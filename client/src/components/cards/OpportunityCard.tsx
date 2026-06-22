import { Link } from 'react-router-dom';
import { ExternalLink } from 'lucide-react';
import { differenceInDays, format } from 'date-fns';
import type { Opportunity, AppStatus } from '../../types/opportunity.types';

const TYPE_COLORS: Record<string, string> = {
  SCHOLARSHIP: 'bg-violet-500/15 text-violet-300',
  INTERNSHIP: 'bg-blue-500/15 text-blue-300',
  FELLOWSHIP: 'bg-green-500/15 text-green-300',
  JOB: 'bg-amber-500/15 text-amber-300',
  RESEARCH: 'bg-pink-500/15 text-pink-300',
  GRANT: 'bg-cyan-500/15 text-cyan-300',
  COMPETITION: 'bg-red-500/15 text-red-300',
  SUMMER_PROGRAM: 'bg-orange-500/15 text-orange-300',
  CONFERENCE: 'bg-teal-500/15 text-teal-300',
  VOLUNTEER: 'bg-emerald-500/15 text-emerald-300',
  EXCHANGE: 'bg-indigo-500/15 text-indigo-300',
  TRAINING: 'bg-purple-500/15 text-purple-300',
  OTHER: 'bg-gray-500/15 text-gray-300',
};

const URGENCY_BORDER: Record<string, string> = {
  critical: 'border-l-red-500',
  high: 'border-l-amber-500',
  medium: 'border-l-yellow-500',
  low: 'border-l-gray-700',
  none: 'border-l-gray-800',
  expired: 'border-l-gray-600',
};

interface OpportunityCardProps {
  opportunity: Opportunity;
  onStatusChange: (id: string, status: AppStatus) => void;
}

function OrgAvatar({ name }: { name: string | null }) {
  const initials = name ? name.slice(0, 2).toUpperCase() : '??';
  const bgColors = ['bg-violet-600', 'bg-blue-600', 'bg-green-600', 'bg-amber-600', 'bg-red-600', 'bg-pink-600', 'bg-cyan-600'];
  const idx = (name ?? '').charCodeAt(0) % bgColors.length;
  return (
    <div className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg ${bgColors[idx]} text-white text-[10px] font-bold`}>
      {initials}
    </div>
  );
}

export function OpportunityCard({ opportunity: opp, onStatusChange }: OpportunityCardProps) {
  const daysLeft = opp.deadline ? differenceInDays(new Date(opp.deadline), new Date()) : null;
  const deadlineColor = daysLeft === null ? 'text-gray-500'
    : daysLeft < 0 ? 'text-gray-500 line-through'
    : daysLeft <= 3 ? 'text-red-400 font-semibold'
    : daysLeft <= 7 ? 'text-amber-400'
    : 'text-gray-400';

  return (
    <div className={`card card-hover flex flex-col border-l-2 ${URGENCY_BORDER[opp.urgency.level]} p-4 gap-3`}>
      {/* Header */}
      <div className="flex items-start gap-3">
        <OrgAvatar name={opp.organization ?? opp.name} />
        <div className="flex-1 min-w-0">
          <p className="text-[11px] text-gray-500 truncate">{opp.organization ?? '—'}</p>
          <Link to={`/opportunities/${opp.id}`} className="text-sm font-semibold text-white hover:text-accent transition truncate block">
            {opp.name}
          </Link>
        </div>
        <span className={`flex-shrink-0 rounded-md px-2 py-0.5 text-[11px] font-medium capitalize ${TYPE_COLORS[opp.type] ?? 'bg-gray-500/15 text-gray-300'}`}>
          {opp.type.toLowerCase().replace('_', ' ')}
        </span>
      </div>

      {/* Description */}
      {opp.description && (
        <p className="text-xs text-gray-500 line-clamp-2">{opp.description}</p>
      )}

      {/* Deadline row */}
      <div className="flex items-center justify-between text-xs">
        <div>
          {opp.deadline ? (
            <div>
              <span className={`font-mono ${deadlineColor}`}>
                {daysLeft !== null && daysLeft >= 0 ? `${daysLeft}d left` : daysLeft !== null && daysLeft < 0 ? 'Expired' : ''}
              </span>
              <span className="ml-2 text-gray-600">{format(new Date(opp.deadline), 'MMM d, yyyy')}</span>
            </div>
          ) : (
            <span className="text-gray-600">No deadline</span>
          )}
        </div>
        {opp.funding && (
          <span className="rounded-md bg-green-500/10 px-2 py-0.5 text-[11px] text-green-400 border border-green-500/20">
            {opp.funding.length > 20 ? opp.funding.slice(0, 20) + '…' : opp.funding}
          </span>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between gap-2 pt-1 border-t border-white/[0.05]">
        <select
          value={opp.status}
          onChange={(e) => onStatusChange(opp.id, e.target.value as AppStatus)}
          className="rounded-md border border-white/10 bg-surface-2 px-2 py-1 text-xs text-white focus:outline-none focus:border-accent/40 cursor-pointer"
        >
          {['SAVED','PLANNING','IN_PROGRESS','APPLIED','INTERVIEW','ACCEPTED','REJECTED'].map(s => (
            <option key={s} value={s}>{s.toLowerCase().replace('_', ' ')}</option>
          ))}
        </select>
        {opp.applicationLink && (
          <a
            href={opp.applicationLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 rounded-md bg-accent/15 px-2.5 py-1 text-xs text-accent hover:bg-accent/25 transition"
          >
            Apply <ExternalLink className="h-3 w-3" />
          </a>
        )}
      </div>
    </div>
  );
}
