import axios from 'axios';
import { format } from 'date-fns';
import { env } from '../config/env.js';
import { parseJsonArray, prisma } from '../lib/prisma.js';
import { serializeOpportunity } from '../utils/serializeOpportunity.js';
import type { OpportunityResponse } from '../types/index.js';

const NOTION_VERSION = '2022-06-28';

type NotionPropertySchema = {
  id: string;
  name: string;
  type: string;
  select?: { options: { name: string }[] };
  multi_select?: { options: { name: string }[] };
  status?: { options: { name: string }[] };
};

function escapeCsv(value: string): string {
  if (value.includes(',') || value.includes('"') || value.includes('\n')) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

function notionHeaders(token: string): Record<string, string> {
  return {
    Authorization: `Bearer ${token}`,
    'Notion-Version': NOTION_VERSION,
    'Content-Type': 'application/json',
  };
}

function normalizeDatabaseId(databaseId: string): string {
  const trimmed = databaseId.trim().replace(/-/g, '');
  if (trimmed.length !== 32) return databaseId.trim();
  return `${trimmed.slice(0, 8)}-${trimmed.slice(8, 12)}-${trimmed.slice(12, 16)}-${trimmed.slice(16, 20)}-${trimmed.slice(20)}`;
}

function truncate(text: string, max = 2000): string {
  return text.length <= max ? text : `${text.slice(0, max - 3)}...`;
}

function mapAppStatusToNotion(status: string, options: string[]): string {
  const normalized = options.map((o) => o.toLowerCase());
  const pick = (candidate: string) => {
    const idx = normalized.indexOf(candidate.toLowerCase());
    return idx >= 0 ? options[idx]! : null;
  };

  switch (status) {
    case 'SAVED':
    case 'SKIPPED':
      return pick('Not started') ?? pick('To-do') ?? options[0] ?? status;
    case 'PLANNING':
    case 'IN_PROGRESS':
    case 'APPLIED':
    case 'INTERVIEW':
      return pick('In progress') ?? pick('In Progress') ?? options[1] ?? options[0] ?? status;
    case 'ACCEPTED':
    case 'REJECTED':
    case 'WITHDRAWN':
    case 'EXPIRED':
      return pick('Done') ?? pick('Complete') ?? options[options.length - 1] ?? status;
    default:
      return options.includes(status) ? status : (options[0] ?? status);
  }
}

function matchSelectOption(value: string, options: string[]): string | null {
  if (!value) return null;
  const exact = options.find((o) => o.toLowerCase() === value.toLowerCase());
  if (exact) return exact;
  const partial = options.find(
    (o) => o.toLowerCase().includes(value.toLowerCase()) || value.toLowerCase().includes(o.toLowerCase())
  );
  return partial ?? null;
}

function buildRichText(value: string | null | undefined): { rich_text: { text: { content: string } }[] } {
  if (!value) return { rich_text: [] };
  return { rich_text: [{ text: { content: truncate(value) } }] };
}

function buildNotionProperties(
  opp: OpportunityResponse,
  schema: Record<string, NotionPropertySchema>
): Record<string, unknown> {
  const properties: Record<string, unknown> = {};
  const link = opp.applicationLink ?? opp.websiteUrl ?? opp.sourceUrl;
  const country = opp.countries[0] ?? null;

  for (const prop of Object.values(schema)) {
    const name = prop.name;
    const lower = name.toLowerCase();

    if (prop.type === 'title' && (lower === 'name' || lower === 'title')) {
      properties[name] = { title: [{ text: { content: truncate(opp.name, 200) } }] };
      continue;
    }

    if (prop.type === 'date' && lower.includes('deadline')) {
      properties[name] = opp.deadline
        ? { date: { start: format(new Date(opp.deadline), 'yyyy-MM-dd') } }
        : { date: null };
      continue;
    }

    if (prop.type === 'url' && (lower.includes('link') || lower.includes('url'))) {
      properties[name] = link ? { url: link } : { url: null };
      continue;
    }

    if (prop.type === 'rich_text') {
      if (lower === 'type') {
        properties[name] = buildRichText(opp.type);
      } else if (lower === 'notes') {
        properties[name] = buildRichText(opp.notes);
      } else if (lower === 'level') {
        properties[name] = buildRichText(opp.level);
      } else if (lower === 'text' || lower === 'description') {
        properties[name] = buildRichText(opp.description ?? opp.organization);
      } else if (lower === 'field') {
        properties[name] = buildRichText(opp.field);
      } else if (lower.includes('country') || lower.includes('countries')) {
        properties[name] = buildRichText(opp.countries.join(', ') || null);
      }
      continue;
    }

    if (prop.type === 'select') {
      const options = prop.select?.options.map((o) => o.name) ?? [];
      if (lower.includes('country') || lower.includes('countries')) {
        const matched = country ? matchSelectOption(country, options) : null;
        properties[name] = matched ? { select: { name: matched } } : { select: null };
      } else if (lower === 'type') {
        const matched = matchSelectOption(opp.type, options) ?? opp.type;
        properties[name] = options.length > 0 && !options.includes(matched)
          ? { select: null }
          : { select: { name: matched } };
      } else if (lower === 'status') {
        const mapped = mapAppStatusToNotion(opp.status, options);
        properties[name] = { select: { name: mapped } };
      }
      continue;
    }

    if (prop.type === 'multi_select' && (lower.includes('country') || lower.includes('countries'))) {
      const options = prop.multi_select?.options.map((o) => o.name) ?? [];
      const selected = opp.countries
        .map((c) => matchSelectOption(c, options))
        .filter((c): c is string => Boolean(c))
        .map((c) => ({ name: c }));
      properties[name] = { multi_select: selected };
      continue;
    }

    if (prop.type === 'status' && lower === 'status') {
      const options = prop.status?.options.map((o) => o.name) ?? [];
      properties[name] = { status: { name: mapAppStatusToNotion(opp.status, options) } };
    }
  }

  return properties;
}

async function fetchNotionDatabaseSchema(
  token: string,
  databaseId: string
): Promise<Record<string, NotionPropertySchema>> {
  const normalizedId = normalizeDatabaseId(databaseId);
  const response = await axios.get(`https://api.notion.com/v1/databases/${normalizedId}`, {
    headers: notionHeaders(token),
  });
  return response.data.properties as Record<string, NotionPropertySchema>;
}

export async function exportCsv(userId: string): Promise<string> {
  const rows = await prisma.opportunity.findMany({ where: { userId } });
  const serialized = rows.map(serializeOpportunity);

  const headers = [
    'id', 'name', 'organization', 'description', 'type', 'level', 'field',
    'countries', 'isRemote', 'isOnline', 'deadline', 'startDate', 'duration',
    'hasFee', 'feeAmount', 'funding', 'applicationLink', 'sourceUrl', 'websiteUrl',
    'eligibility', 'requirements', 'languageReq', 'status', 'notes', 'createdAt',
  ];

  const lines = [headers.join(',')];
  for (const o of serialized) {
    lines.push(
      [
        o.id, o.name, o.organization ?? '', o.description ?? '', o.type, o.level ?? '',
        o.field ?? '', o.countries.join('; '), String(o.isRemote), String(o.isOnline),
        o.deadline ? format(new Date(o.deadline), 'yyyy-MM-dd') : '',
        o.startDate ? format(new Date(o.startDate), 'yyyy-MM-dd') : '',
        o.duration ?? '', String(o.hasFee), o.feeAmount ?? '', o.funding ?? '',
        o.applicationLink ?? '', o.sourceUrl ?? '', o.websiteUrl ?? '',
        o.eligibility ?? '', o.requirements.join('; '), o.languageReq ?? '',
        o.status, o.notes ?? '', format(new Date(o.createdAt), 'yyyy-MM-dd'),
      ].map((v) => escapeCsv(String(v))).join(',')
    );
  }

  return lines.join('\n');
}

export async function exportJson(userId: string): Promise<string> {
  const rows = await prisma.opportunity.findMany({ where: { userId } });
  const serialized = rows.map(serializeOpportunity);
  return JSON.stringify(serialized, null, 2);
}

export async function exportToNotion(
  userId: string,
  notionToken: string,
  databaseId: string
): Promise<{ success: number; failed: number; errors: string[] }> {
  const token = notionToken || env.notionApiKey;
  if (!token) throw new Error('Notion integration token is required');

  const schema = await fetchNotionDatabaseSchema(token, databaseId);
  const rows = await prisma.opportunity.findMany({ where: { userId } });
  const serialized = rows.map(serializeOpportunity);

  let success = 0;
  let failed = 0;
  const errors: string[] = [];

  for (const opp of serialized) {
    try {
      await createNotionPage(token, databaseId, opp, schema);
      success += 1;
    } catch (err) {
      failed += 1;
      const message = axios.isAxiosError(err)
        ? (err.response?.data as { message?: string })?.message ?? err.message
        : err instanceof Error
          ? err.message
          : 'Unknown error';
      if (errors.length < 3) errors.push(`${opp.name}: ${message}`);
    }
  }

  if (serialized.length > 0 && success === 0 && errors[0]) {
    throw new Error(errors[0]);
  }

  return { success, failed, errors };
}

async function createNotionPage(
  token: string,
  databaseId: string,
  opp: OpportunityResponse,
  schema: Record<string, NotionPropertySchema>
): Promise<void> {
  const normalizedId = normalizeDatabaseId(databaseId);
  const properties = buildNotionProperties(opp, schema);

  await axios.post(
    'https://api.notion.com/v1/pages',
    {
      parent: { database_id: normalizedId },
      properties,
    },
    { headers: notionHeaders(token) }
  );
}

export function parseCountriesField(value: string): string[] {
  return parseJsonArray<string>(value);
}
