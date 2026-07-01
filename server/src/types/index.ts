import type { AppStatus, OpportunityType } from '@prisma/client';

export interface UrgencyInfo {
  level: 'none' | 'expired' | 'critical' | 'high' | 'medium' | 'low' | 'applied' | 'accepted' | 'rejected' | 'withdrawn' | 'skipped';
  daysLeft: number | null;
  label: string;
  color: string;
  isUrgent: boolean;
}

export interface ExtractedData {
  name: string;
  organization: string | null;
  description: string | null;
  type: OpportunityType;
  level: string | null;
  field: string | null;
  countries: string[];
  isRemote: boolean;
  isOnline: boolean;
  deadline: string | null;
  startDate: string | null;
  duration: string | null;
  hasFee: boolean;
  feeAmount: string | null;
  funding: string | null;
  applicationLink: string | null;
  sourceUrl?: string | null;
  websiteUrl: string | null;
  eligibility: string | null;
  requirements: string[];
  languageReq: string | null;
  confidence: number;
}

export interface ExtractedFieldConfidence {
  field: string;
  confidence: number;
}

export interface OpportunityResponse {
  id: string;
  userId: string;
  name: string;
  organization: string | null;
  description: string | null;
  type: OpportunityType;
  level: string | null;
  field: string | null;
  countries: string[];
  isRemote: boolean;
  isOnline: boolean;
  deadline: string | null;
  startDate: string | null;
  duration: string | null;
  hasFee: boolean;
  feeAmount: string | null;
  funding: string | null;
  applicationLink: string | null;
  sourceUrl: string | null;
  websiteUrl: string | null;
  eligibility: string | null;
  requirements: string[];
  languageReq: string | null;
  isUrgent: boolean;
  urgencyLevel: string;
  urgency: UrgencyInfo;
  status: AppStatus;
  appliedAt: string | null;
  rejectedReason: string | null;
  notes: string | null;
  rawText: string;
  aiExtractedData: Record<string, unknown>;
  notificationsSent: number[];
  lastNotifiedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface AuthUser {
  id: string;
  email: string;
  name: string | null;
  ntfyTopic: string | null;
  ntfyEnabled: boolean;
  ntfyServerUrl: string;
  aiProvider: string;
  apiKeys: Record<string, string>;
  notifyDaysBefore: number[];
}

export interface JwtPayload {
  userId: string;
  email: string;
}
