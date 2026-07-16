import type { Response } from 'express';
import type { AppStatus, OpportunityType } from '@prisma/client';
import { addDays } from 'date-fns';
import { AppError, asyncHandler } from '../middleware/errorHandler.js';
import type { AuthRequest } from '../middleware/auth.middleware.js';
import { prisma, stringifyJsonArray } from '../lib/prisma.js';
import { extractWithFallback } from '../services/extraction.service.js';
import { notifyNewOpportunity, notifyStatusChange } from '../services/notification.service.js';
import { exportCsv, exportJson, exportToNotion } from '../services/export.service.js';
import { serializeOpportunity } from '../utils/serializeOpportunity.js';
import type { ExtractedData } from '../types/index.js';
import { calculateUrgency } from '../utils/urgencyCalculator.js';

const VALID_TYPES = new Set<string>([
  'SCHOLARSHIP', 'FELLOWSHIP', 'GRANT', 'JOB', 'INTERNSHIP', 'RESEARCH',
  'SUMMER_PROGRAM', 'COMPETITION', 'CONFERENCE', 'VOLUNTEER', 'EXCHANGE', 'TRAINING', 'OTHER'
]);

function parseSafeType(val: unknown): OpportunityType {
  if (!val) return 'OTHER' as OpportunityType;
  let str = String(val).trim().toUpperCase().replace(/\s+/g, '_');
  if (str === 'PROGRAM' || str === 'BOOTCAMP' || str === 'WORKSHOP' || str === 'COURSE') str = 'TRAINING';
  if (str === 'HACKATHON') str = 'COMPETITION';
  if (str === 'EMPLOYMENT' || str === 'FULL_TIME' || str === 'PART_TIME') str = 'JOB';
  if (VALID_TYPES.has(str)) return str as OpportunityType;
  return 'OTHER' as OpportunityType;
}

function parseSafeDate(val: unknown): Date | null {
  if (!val) return null;
  const str = String(val).trim();
  if (!str || /^(null|none|tbd|n\/a|rolling|continuous|open|varies|various|ongoing|unspecified)$/i.test(str)) {
    return null;
  }
  const d = new Date(str);
  return isNaN(d.getTime()) ? null : d;
}

function buildOpportunityData(
  extracted: ExtractedData,
  rawText: string,
  userEdits?: Record<string, unknown>
) {
  const merged = { ...extracted, ...userEdits };
  const deadline = parseSafeDate(merged.deadline);
  const startDate = parseSafeDate(merged.startDate);
  const status = String((merged as Record<string, unknown>).status ?? 'SAVED');
  const urgency = calculateUrgency(deadline, status);

  return {
    name: String(merged.name ?? 'Untitled Opportunity'),
    organization: merged.organization ? String(merged.organization) : null,
    description: merged.description ? String(merged.description) : null,
    type: parseSafeType(merged.type),
    level: merged.level ? String(merged.level) : null,
    field: merged.field ? String(merged.field) : null,
    countries: stringifyJsonArray(Array.isArray(merged.countries) ? merged.countries.map(String) : []),
    isRemote: Boolean(merged.isRemote),
    isOnline: Boolean(merged.isOnline),
    deadline,
    startDate,
    duration: merged.duration ? String(merged.duration) : null,
    hasFee: Boolean(merged.hasFee),
    feeAmount: merged.feeAmount ? String(merged.feeAmount) : null,
    funding: merged.funding ? String(merged.funding) : null,
    applicationLink: merged.applicationLink ? String(merged.applicationLink) : null,
    sourceUrl: merged.sourceUrl ? String(merged.sourceUrl) : null,
    websiteUrl: merged.websiteUrl ? String(merged.websiteUrl) : null,
    eligibility: merged.eligibility ? String(merged.eligibility) : null,
    requirements: stringifyJsonArray(
      Array.isArray(merged.requirements) ? merged.requirements.map(String) : []
    ),
    languageReq: merged.languageReq ? String(merged.languageReq) : null,
    isUrgent: urgency.isUrgent,
    urgencyLevel: urgency.level,
    status: (status as AppStatus),
    rawText,
    aiExtractedData: JSON.stringify({ ...extracted, userEdits: userEdits ?? null }),
  };
}

export const extractPreview = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { rawText, provider, imageBase64 } = req.body as { rawText?: string; provider?: string; imageBase64?: string };
  if (!rawText?.trim() && !imageBase64) throw new AppError(400, 'rawText or image is required');

  const user = await prisma.user.findUnique({ where: { id: req.user!.userId } });
  let userApiKeys: Record<string, string> = {};
  if (user?.apiKeys) {
    try {
      userApiKeys = JSON.parse(user.apiKeys);
    } catch {
      // Ignore
    }
  }

  const result = await extractWithFallback(rawText || 'Extract data from the image.', provider, imageBase64, userApiKeys);
  res.json({
    extractions: result.extractions,
    provider: result.provider,
    lowConfidenceFieldsList: result.lowConfidenceFieldsList,
    warnings: result.warnings,
  });
});

export const checkDuplicate = asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = req.user!.userId;
  const name = String(req.query.name ?? '').trim().toLowerCase();
  if (!name) {
    res.json({ found: false });
    return;
  }

  const rows = await prisma.opportunity.findMany({ where: { userId } });
  const normalize = (s: string) => s.toLowerCase().replace(/[^a-z0-9\s]/g, '').trim();
  const target = normalize(name);

  let bestMatch: { id: string; name: string; status: string; createdAt: Date; score: number } | null = null;

  for (const row of rows) {
    const rowNorm = normalize(row.name);
    // Exact match
    if (rowNorm === target) {
      bestMatch = { id: row.id, name: row.name, status: row.status, createdAt: row.createdAt, score: 1 };
      break;
    }
    // Contains match
    if (rowNorm.includes(target) || target.includes(rowNorm)) {
      const score = Math.min(rowNorm.length, target.length) / Math.max(rowNorm.length, target.length);
      if (!bestMatch || score > bestMatch.score) {
        bestMatch = { id: row.id, name: row.name, status: row.status, createdAt: row.createdAt, score };
      }
    }
  }

  const threshold = 0.75;
  if (bestMatch && bestMatch.score >= threshold) {
    res.json({
      found: true,
      match: { id: bestMatch.id, name: bestMatch.name, status: bestMatch.status, createdAt: bestMatch.createdAt },
    });
    return;
  }
  res.json({ found: false });
});


export const saveExtracted = asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = req.user!.userId;
  const { extracted, rawText, userEdits } = req.body as {
    extracted?: ExtractedData;
    rawText?: string;
    userEdits?: Record<string, unknown>;
  };

  if (!extracted || !rawText) throw new AppError(400, 'extracted and rawText are required');

  const data = buildOpportunityData(extracted, rawText, userEdits);
  const opp = await prisma.opportunity.create({ data: { ...data, userId } });

  await notifyNewOpportunity(userId, opp);
  res.status(201).json({ opportunity: serializeOpportunity(opp) });
});

const VALID_SORT_FIELDS = new Set([
  'deadline', 'createdAt', 'updatedAt', 'name', 'status', 'type', 'urgencyLevel',
]);

export const listOpportunities = asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = req.user!.userId;
  const {
    type, status, country, urgency, search,
    sortBy = 'createdAt', sortOrder = 'desc',
    page = '1', limit = '20',
  } = req.query as Record<string, string>;

  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 20));
  const skip = (pageNum - 1) * limitNum;

  // Sanitise sortBy to prevent injection of arbitrary field names
  const safeSortBy = VALID_SORT_FIELDS.has(sortBy) ? sortBy : 'createdAt';

  const where: Record<string, unknown> = { userId };
  if (type) where.type = type;
  if (status) where.status = status;
  // urgencyLevel is a real DB column — filter at the DB level when provided
  if (urgency) where.urgencyLevel = urgency;
  if (search) {
    where.OR = [
      { name: { contains: search } },
      { organization: { contains: search } },
      { description: { contains: search } },
    ];
  }

  const rows = await prisma.opportunity.findMany({
    where: where as never,
    orderBy: { [safeSortBy]: sortOrder === 'desc' ? 'desc' : 'asc' },
  });

  let serialized = rows.map(serializeOpportunity);

  // country is stored as a JSON array string — must filter in-memory
  if (country) {
    serialized = serialized.filter((o) =>
      o.countries.some((c) => c.toLowerCase().includes(country.toLowerCase()))
    );
  }

  // Total is now accurate: computed AFTER all filters, BEFORE pagination slice
  const total = serialized.length;
  const data = serialized.slice(skip, skip + limitNum);

  res.json({
    data,
    total,
    page: pageNum,
    limit: limitNum,
    totalPages: Math.ceil(total / limitNum),
  });
});

export const getOpportunity = asyncHandler(async (req: AuthRequest, res: Response) => {
  const opp = await prisma.opportunity.findFirst({
    where: { id: req.params.id, userId: req.user!.userId },
  });
  if (!opp) throw new AppError(404, 'Opportunity not found');
  res.json({ opportunity: serializeOpportunity(opp) });
});

export const updateOpportunity = asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = req.user!.userId;
  const existing = await prisma.opportunity.findFirst({
    where: { id: req.params.id, userId },
  });
  if (!existing) throw new AppError(404, 'Opportunity not found');

  const body = req.body as Record<string, unknown>;
  const updateData: Record<string, unknown> = {};

  const stringFields = [
    'name', 'organization', 'description', 'level', 'field', 'duration',
    'feeAmount', 'funding', 'applicationLink', 'sourceUrl', 'websiteUrl',
    'eligibility', 'languageReq', 'rejectedReason', 'notes',
  ];
  stringFields.forEach((f) => {
    if (body[f] !== undefined) updateData[f] = body[f];
  });

  if (body.type) updateData.type = parseSafeType(body.type);
  if (body.status) {
    updateData.status = body.status;
    if (body.status === 'APPLIED') updateData.appliedAt = new Date();
  }
  if (body.isRemote !== undefined) updateData.isRemote = body.isRemote;
  if (body.isOnline !== undefined) updateData.isOnline = body.isOnline;
  if (body.hasFee !== undefined) updateData.hasFee = body.hasFee;
  if (body.deadline !== undefined) {
    updateData.deadline = parseSafeDate(body.deadline);
  }
  if (body.startDate !== undefined) {
    updateData.startDate = parseSafeDate(body.startDate);
  }
  if (body.countries) updateData.countries = stringifyJsonArray(body.countries as string[]);
  if (body.requirements) updateData.requirements = stringifyJsonArray(body.requirements as string[]);

  const newDeadline = 'deadline' in updateData ? (updateData.deadline as Date | null) : existing.deadline;
  const newStatus = 'status' in updateData ? String(updateData.status) : existing.status;
  const urgency = calculateUrgency(newDeadline, newStatus);
  updateData.isUrgent = urgency.isUrgent;
  updateData.urgencyLevel = urgency.level;

  const opp = await prisma.opportunity.update({
    where: { id: existing.id },
    data: updateData,
  });

  if (body.status && body.status !== existing.status) {
    await notifyStatusChange(userId, opp, String(body.status));
  }

  res.json({ opportunity: serializeOpportunity(opp) });
});

export const deleteOpportunity = asyncHandler(async (req: AuthRequest, res: Response) => {
  const existing = await prisma.opportunity.findFirst({
    where: { id: req.params.id, userId: req.user!.userId },
  });
  if (!existing) throw new AppError(404, 'Opportunity not found');
  await prisma.opportunity.delete({ where: { id: existing.id } });
  res.json({ message: 'Deleted' });
});

export const getUrgent = asyncHandler(async (req: AuthRequest, res: Response) => {
  const rows = await prisma.opportunity.findMany({ where: { userId: req.user!.userId } });
  const urgent = rows.map(serializeOpportunity).filter((o) => o.urgency.isUrgent);
  res.json({ data: urgent });
});

export const getUpcoming = asyncHandler(async (req: AuthRequest, res: Response) => {
  const days = parseInt(String(req.query.days ?? '30'), 10);
  const cutoff = addDays(new Date(), days);
  const rows = await prisma.opportunity.findMany({
    where: {
      userId: req.user!.userId,
      deadline: { gte: new Date(), lte: cutoff },
    },
    orderBy: { deadline: 'asc' },
  });
  res.json({ data: rows.map(serializeOpportunity) });
});

export const bulkStatus = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { ids, status } = req.body as { ids?: string[]; status?: AppStatus };
  if (!ids?.length || !status) throw new AppError(400, 'ids and status required');

  const isSettled = ['APPLIED', 'ACCEPTED', 'REJECTED', 'WITHDRAWN', 'SKIPPED'].includes(status);
  await prisma.opportunity.updateMany({
    where: { id: { in: ids }, userId: req.user!.userId },
    data: {
      status,
      ...(status === 'APPLIED' ? { appliedAt: new Date() } : {}),
      ...(isSettled ? { isUrgent: false, urgencyLevel: status.toLowerCase() } : {}),
    },
  });

  res.json({ message: 'Updated', count: ids.length });
});

export const exportOpportunities = asyncHandler(async (req: AuthRequest, res: Response) => {
  const format = String(req.query.format ?? 'json');
  const userId = req.user!.userId;

  if (format === 'csv') {
    const csv = await exportCsv(userId);
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=opportunities.csv');
    res.send(csv);
    return;
  }

  if (format === 'notion') {
    const { notionToken, databaseId } = req.query as Record<string, string>;
    if (!notionToken || !databaseId) throw new AppError(400, 'notionToken and databaseId required');
    const result = await exportToNotion(userId, notionToken, databaseId);
    res.json(result);
    return;
  }

  const json = await exportJson(userId);
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Content-Disposition', 'attachment; filename=opportunities.json');
  res.send(json);
});

export const getStats = asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = req.user!.userId;
  const now = new Date();
  const weekAgo = addDays(now, -7);
  const monthAgo = addDays(now, -30);

  const rows = await prisma.opportunity.findMany({ where: { userId } });
  const serialized = rows.map(serializeOpportunity);

  const byType: Record<string, number> = {};
  const byStatus: Record<string, number> = {};
  serialized.forEach((o) => {
    byType[o.type] = (byType[o.type] ?? 0) + 1;
    byStatus[o.status] = (byStatus[o.status] ?? 0) + 1;
  });

  const upcoming = serialized
    .filter((o) => o.deadline && o.urgency.daysLeft !== null && o.urgency.daysLeft >= 0)
    .sort((a, b) => new Date(a.deadline!).getTime() - new Date(b.deadline!).getTime())
    .slice(0, 10);

  res.json({
    total: serialized.length,
    by_type: byType,
    by_status: byStatus,
    urgent_count: serialized.filter((o) => o.urgency.isUrgent).length,
    applied_count: serialized.filter((o) => o.status === 'APPLIED').length,
    accepted_count: serialized.filter((o) => o.status === 'ACCEPTED').length,
    this_week_added: rows.filter((o) => o.createdAt >= weekAgo).length,
    this_month_added: rows.filter((o) => o.createdAt >= monthAgo).length,
    upcoming_deadlines: upcoming,
  });
});
