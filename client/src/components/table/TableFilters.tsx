import { OPPORTUNITY_TYPES, APP_STATUSES } from '../../types/opportunity.types';
import { Select } from '../ui/Select';

interface TableFiltersProps {
  type: string;
  status: string;
  country: string;
  urgency: string;
  onTypeChange: (v: string) => void;
  onStatusChange: (v: string) => void;
  onCountryChange: (v: string) => void;
  onUrgencyChange: (v: string) => void;
}

export function TableFilters({
  type, status, country, urgency,
  onTypeChange, onStatusChange, onCountryChange, onUrgencyChange,
}: TableFiltersProps) {
  return (
    <div className="flex flex-wrap gap-3">
      <Select value={type} onChange={(e) => onTypeChange(e.target.value)} className="w-36">
        <option value="">All Types</option>
        {OPPORTUNITY_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
      </Select>
      <Select value={status} onChange={(e) => onStatusChange(e.target.value)} className="w-36">
        <option value="">All Status</option>
        {APP_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
      </Select>
      <input
        value={country}
        onChange={(e) => onCountryChange(e.target.value)}
        placeholder="Country"
        className="w-32 rounded-lg border border-[#e5e7eb] bg-white px-3 py-2 text-sm text-[#111827] focus:border-accent focus:outline-none shadow-sm"
      />
      <Select value={urgency} onChange={(e) => onUrgencyChange(e.target.value)} className="w-36">
        <option value="">All Urgency</option>
        <option value="critical">Critical</option>
        <option value="high">High</option>
        <option value="medium">Medium</option>
        <option value="low">Low</option>
        <option value="expired">Expired</option>
      </Select>
    </div>
  );
}
