import type { Opportunity } from '@prisma/client';
import { parseJsonArray } from '../lib/prisma.js';
import { calculateUrgency } from './urgencyCalculator.js';
import type { OpportunityResponse } from '../types/index.js';

export function serializeOpportunity(opp: Opportunity): OpportunityResponse {
  const deadline = opp.deadline;
  const urgency = calculateUrgency(deadline);

  let aiData: Record<string, unknown> = {};
  try {
    aiData = JSON.parse(opp.aiExtractedData) as Record<string, unknown>;
  } catch {
    aiData = {};
  }

  return {
    id: opp.id,
    userId: opp.userId,
    name: opp.name,
    organization: opp.organization,
    description: opp.description,
    type: opp.type,
    level: opp.level,
    field: opp.field,
    countries: parseJsonArray<string>(opp.countries),
    isRemote: opp.isRemote,
    isOnline: opp.isOnline,
    deadline: deadline?.toISOString() ?? null,
    startDate: opp.startDate?.toISOString() ?? null,
    duration: opp.duration,
    hasFee: opp.hasFee,
    feeAmount: opp.feeAmount,
    funding: opp.funding,
    applicationLink: opp.applicationLink,
    sourceUrl: opp.sourceUrl,
    websiteUrl: opp.websiteUrl,
    eligibility: opp.eligibility,
    requirements: parseJsonArray<string>(opp.requirements),
    languageReq: opp.languageReq,
    isUrgent: urgency.isUrgent,
    urgencyLevel: urgency.level,
    urgency,
    status: opp.status,
    appliedAt: opp.appliedAt?.toISOString() ?? null,
    rejectedReason: opp.rejectedReason,
    notes: opp.notes,
    rawText: opp.rawText,
    aiExtractedData: aiData,
    notificationsSent: parseJsonArray<number>(opp.notificationsSent),
    lastNotifiedAt: opp.lastNotifiedAt?.toISOString() ?? null,
    createdAt: opp.createdAt.toISOString(),
    updatedAt: opp.updatedAt.toISOString(),
  };
}
