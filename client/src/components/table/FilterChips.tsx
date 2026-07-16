import { X, SlidersHorizontal } from 'lucide-react';

interface ActiveFilter {
  key: string;
  label: string;
  value: string;
}

interface FilterChipsProps {
  type: string;
  status: string;
  country: string;
  urgency: string;
  search: string;
  sortBy: string;
  sortOrder: string;
  onClear: (key: string) => void;
  onClearAll: () => void;
}

const TYPE_LABELS: Record<string, string> = {
  SCHOLARSHIP: 'Scholarship', FELLOWSHIP: 'Fellowship', GRANT: 'Grant',
  JOB: 'Job', INTERNSHIP: 'Internship', RESEARCH: 'Research',
  SUMMER_PROGRAM: 'Summer Program', COMPETITION: 'Competition',
  CONFERENCE: 'Conference', VOLUNTEER: 'Volunteer', EXCHANGE: 'Exchange',
  TRAINING: 'Training', OTHER: 'Other',
};

const URGENCY_LABELS: Record<string, string> = {
  critical: '🔴 Critical', high: '🟠 High', medium: '🟡 Medium',
  low: '🟢 Low', expired: '⚫ Expired',
};

const STATUS_LABELS: Record<string, string> = {
  SAVED: 'Saved', PLANNING: 'Planning', IN_PROGRESS: 'In Progress',
  APPLIED: 'Applied', INTERVIEW: 'Interview', ACCEPTED: 'Accepted',
  REJECTED: 'Rejected', WITHDRAWN: 'Withdrawn', SKIPPED: 'Skipped', EXPIRED: 'Expired',
};

export function FilterChips({
  type, status, country, urgency, search,
  onClear, onClearAll,
}: FilterChipsProps) {
  const active: ActiveFilter[] = [];

  if (search)  active.push({ key: 'search',  label: 'Search',  value: `"${search}"` });
  if (type)    active.push({ key: 'type',    label: 'Type',    value: TYPE_LABELS[type] ?? type });
  if (status)  active.push({ key: 'status',  label: 'Status',  value: STATUS_LABELS[status] ?? status });
  if (country) active.push({ key: 'country', label: 'Country', value: country });
  if (urgency) active.push({ key: 'urgency', label: 'Urgency', value: URGENCY_LABELS[urgency] ?? urgency });

  if (active.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 animate-fade-in">
      <div className="flex items-center gap-1 text-[#9ca3af]">
        <SlidersHorizontal className="h-3.5 w-3.5" />
        <span className="text-xs font-medium">Filters:</span>
      </div>

      {active.map((f) => (
        <span
          key={f.key}
          className="inline-flex items-center gap-1.5 rounded-full border border-accent/30 bg-accent/8 px-2.5 py-1 text-xs font-medium text-accent"
          style={{ background: 'rgba(37,99,235,0.08)' }}
        >
          <span className="text-[#6b7280] text-[10px] font-semibold uppercase tracking-wide">{f.label}:</span>
          {f.value}
          <button
            onClick={() => onClear(f.key)}
            className="ml-0.5 rounded-full p-0.5 hover:bg-accent/20 transition-colors"
            title={`Remove ${f.label} filter`}
          >
            <X className="h-3 w-3" />
          </button>
        </span>
      ))}

      {active.length > 1 && (
        <button
          onClick={onClearAll}
          className="text-xs text-[#6b7280] hover:text-danger transition-colors underline underline-offset-2"
        >
          Clear all
        </button>
      )}
    </div>
  );
}
