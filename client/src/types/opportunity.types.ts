export type OpportunityType =
  | 'SCHOLARSHIP' | 'FELLOWSHIP' | 'GRANT' | 'JOB' | 'INTERNSHIP'
  | 'RESEARCH' | 'SUMMER_PROGRAM' | 'COMPETITION' | 'CONFERENCE'
  | 'VOLUNTEER' | 'EXCHANGE' | 'TRAINING' | 'OTHER';

export type AppStatus =
  | 'SAVED' | 'PLANNING' | 'IN_PROGRESS' | 'APPLIED' | 'INTERVIEW'
  | 'ACCEPTED' | 'REJECTED' | 'WITHDRAWN' | 'SKIPPED' | 'EXPIRED';

export interface UrgencyInfo {
  level: 'none' | 'expired' | 'critical' | 'high' | 'medium' | 'low';
  daysLeft: number | null;
  label: string;
  color: string;
  isUrgent: boolean;
}

export interface Opportunity {
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

export interface AuthUser {
  id: string;
  email: string;
  name: string | null;
  ntfyTopic: string | null;
  ntfyEnabled: boolean;
  ntfyServerUrl: string;
  aiProvider: string;
  notifyDaysBefore: number[];
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface StatsOverview {
  total: number;
  by_type: Record<string, number>;
  by_status: Record<string, number>;
  urgent_count: number;
  applied_count: number;
  accepted_count: number;
  this_week_added: number;
  this_month_added: number;
  upcoming_deadlines: Opportunity[];
}

export interface ExtractionResult {
  extracted: ExtractedData;
  confidence: number;
  provider: string;
  lowConfidenceFields: string[];
  warning: string | null;
}

export const OPPORTUNITY_TYPES: OpportunityType[] = [
  'SCHOLARSHIP', 'FELLOWSHIP', 'GRANT', 'JOB', 'INTERNSHIP',
  'RESEARCH', 'SUMMER_PROGRAM', 'COMPETITION', 'CONFERENCE',
  'VOLUNTEER', 'EXCHANGE', 'TRAINING', 'OTHER',
];

export const APP_STATUSES: AppStatus[] = [
  'SAVED', 'PLANNING', 'IN_PROGRESS', 'APPLIED', 'INTERVIEW',
  'ACCEPTED', 'REJECTED', 'WITHDRAWN', 'SKIPPED', 'EXPIRED',
];

export const TYPE_COLORS: Record<OpportunityType, string> = {
  SCHOLARSHIP: 'bg-purple-500/20 text-purple-300',
  FELLOWSHIP: 'bg-indigo-500/20 text-indigo-300',
  GRANT: 'bg-blue-500/20 text-blue-300',
  JOB: 'bg-emerald-500/20 text-emerald-300',
  INTERNSHIP: 'bg-teal-500/20 text-teal-300',
  RESEARCH: 'bg-cyan-500/20 text-cyan-300',
  SUMMER_PROGRAM: 'bg-orange-500/20 text-orange-300',
  COMPETITION: 'bg-pink-500/20 text-pink-300',
  CONFERENCE: 'bg-violet-500/20 text-violet-300',
  VOLUNTEER: 'bg-lime-500/20 text-lime-300',
  EXCHANGE: 'bg-amber-500/20 text-amber-300',
  TRAINING: 'bg-sky-500/20 text-sky-300',
  OTHER: 'bg-gray-500/20 text-gray-300',
};

export const STATUS_COLORS: Record<AppStatus, string> = {
  SAVED: 'bg-gray-500/20 text-gray-300',
  PLANNING: 'bg-blue-500/20 text-blue-300',
  IN_PROGRESS: 'bg-indigo-500/20 text-indigo-300',
  APPLIED: 'bg-purple-500/20 text-purple-300',
  INTERVIEW: 'bg-cyan-500/20 text-cyan-300',
  ACCEPTED: 'bg-emerald-500/20 text-emerald-300',
  REJECTED: 'bg-red-500/20 text-red-300',
  WITHDRAWN: 'bg-orange-500/20 text-orange-300',
  SKIPPED: 'bg-muted/40 text-gray-400',
  EXPIRED: 'bg-red-500/20 text-red-400',
};
