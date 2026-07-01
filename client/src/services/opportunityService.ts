import { apiRequest, authenticatedFetch } from './api';
import type {
  ExtractionResult,
  ExtractedData,
  Opportunity,
  PaginatedResponse,
  StatsOverview,
  AppStatus,
} from '../types/opportunity.types';

export interface OpportunityFilters {
  type?: string;
  status?: string;
  country?: string;
  urgency?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: string;
  page?: number;
  limit?: number;
}

function buildQuery(filters: OpportunityFilters): string {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([k, v]) => {
    if (v !== undefined && v !== '') params.set(k, String(v));
  });
  const q = params.toString();
  return q ? `?${q}` : '';
}

export async function fetchOpportunities(
  token: string,
  filters: OpportunityFilters = {}
): Promise<PaginatedResponse<Opportunity>> {
  return apiRequest(`/opportunities${buildQuery(filters)}`, { token });
}

export async function fetchOpportunity(token: string, id: string): Promise<{ opportunity: Opportunity }> {
  return apiRequest(`/opportunities/${id}`, { token });
}

export async function updateOpportunity(
  token: string,
  id: string,
  data: Partial<Opportunity>
): Promise<{ opportunity: Opportunity }> {
  return apiRequest(`/opportunities/${id}`, { method: 'PATCH', token, body: JSON.stringify(data) });
}

export async function deleteOpportunity(token: string, id: string): Promise<void> {
  await apiRequest(`/opportunities/${id}`, { method: 'DELETE', token });
}

export async function fetchUrgent(token: string): Promise<{ data: Opportunity[] }> {
  return apiRequest('/opportunities/urgent', { token });
}

export async function fetchUpcoming(token: string, days = 30): Promise<{ data: Opportunity[] }> {
  return apiRequest(`/opportunities/upcoming?days=${days}`, { token });
}

export async function bulkUpdateStatus(
  token: string,
  ids: string[],
  status: AppStatus
): Promise<void> {
  await apiRequest('/opportunities/bulk-status', {
    method: 'POST',
    token,
    body: JSON.stringify({ ids, status }),
  });
}

export async function fetchStats(token: string): Promise<StatsOverview> {
  return apiRequest('/stats/overview', { token });
}

export async function extractOpportunity(
  token: string,
  rawText: string,
  provider?: string,
  imageBase64?: string
): Promise<ExtractionResult> {
  return apiRequest('/extract', {
    method: 'POST',
    token,
    body: JSON.stringify({ rawText, provider, imageBase64 }),
  });
}

export async function saveExtracted(
  token: string,
  extracted: ExtractedData,
  rawText: string,
  userEdits?: Partial<ExtractedData>
): Promise<{ opportunity: Opportunity }> {
  return apiRequest('/extract/save', {
    method: 'POST',
    token,
    body: JSON.stringify({ extracted, rawText, userEdits }),
  });
}

export async function exportFromServer(
  token: string,
  format: 'csv' | 'json' | 'notion',
  notionToken?: string,
  databaseId?: string
): Promise<Blob | { success: number; failed: number }> {
  const params = new URLSearchParams({ format });
  if (notionToken) params.set('notionToken', notionToken);
  if (databaseId) params.set('databaseId', databaseId);

  const res = await authenticatedFetch(`/opportunities/export?${params}`, { token });

  if (!res.ok) {
    const body = (await res.json().catch(() => null)) as { error?: string } | null;
    throw new Error(body?.error ?? 'Export failed');
  }
  if (format === 'notion') return res.json() as Promise<{ success: number; failed: number }>;
  return res.blob();
}

export async function checkDuplicate(
  token: string,
  name: string
): Promise<{ found: boolean; match?: { id: string; name: string; status: string; createdAt: string } }> {
  return apiRequest(`/opportunities/check-duplicate?name=${encodeURIComponent(name)}`, { token });
}

