import { Link } from 'react-router-dom';
import { format, differenceInDays } from 'date-fns';
import type { Opportunity } from '../../types/opportunity.types';

function urgencyDot(daysLeft: number | null) {
  if (daysLeft === null) return 'bg-[#e5e7eb]';
  if (daysLeft <= 2)  return 'bg-[#dc2626]';
  if (daysLeft <= 7)  return 'bg-[#d97706]';
  if (daysLeft <= 30) return 'bg-[#2563eb]';
  return 'bg-[#9ca3af]';
}

function daysText(daysLeft: number | null) {
  if (daysLeft === null) return '—';
  if (daysLeft === 0)    return 'Today!';
  if (daysLeft < 0)     return 'Expired';
  return `${daysLeft}d left`;
}

function daysColor(daysLeft: number | null) {
  if (daysLeft === null || daysLeft < 0) return 'text-[#9ca3af]';
  if (daysLeft <= 2)  return 'text-[#dc2626] font-bold';
  if (daysLeft <= 7)  return 'text-[#d97706] font-semibold';
  return 'text-[#6b7280]';
}

function OrgAvatar({ name }: { name: string | null }) {
  const initials = (name ?? '?').slice(0, 2).toUpperCase();
  return (
    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-[#eff6ff] text-accent text-[10px] font-bold border border-[#bfdbfe]">
      {initials}
    </div>
  );
}

export function UpcomingDeadlines({ items }: { items: Opportunity[] }) {
  if (items.length === 0) {
    return (
      <div className="card p-5">
        <h3 className="text-sm font-semibold text-[#111827] mb-3">Upcoming Deadlines</h3>
        <p className="text-sm text-[#9ca3af]">No upcoming deadlines.</p>
      </div>
    );
  }

  return (
    <div className="card">
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-[#e5e7eb]">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold text-[#111827]">Upcoming Deadlines</h3>
          {items.filter((o) => o.urgency?.isUrgent).length > 0 && (
            <span className="rounded bg-[#fef2f2] border border-[#fecaca] px-2 py-0.5 text-xs text-[#991b1b]">
              {items.filter((o) => o.urgency?.isUrgent).length} urgent
            </span>
          )}
        </div>
        <Link to="/opportunities" className="text-xs text-accent hover:underline">
          View all
        </Link>
      </div>

      {/* List */}
      <div className="divide-y divide-[#f3f4f6]">
        {items.slice(0, 6).map((opp) => {
          const daysLeft = opp.deadline
            ? differenceInDays(new Date(opp.deadline), new Date())
            : null;
          return (
            <Link
              key={opp.id}
              to={`/opportunities/${opp.id}`}
              className="flex items-center gap-3 px-5 py-3 hover:bg-[#f9fafb] transition-colors"
            >
              <OrgAvatar name={opp.organization ?? opp.name} />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-[#111827] truncate">{opp.name}</p>
                <p className="text-[11px] text-[#9ca3af] truncate">{opp.organization ?? '—'}</p>
              </div>
              <div className="flex flex-col items-end gap-0.5 flex-shrink-0">
                <span className={`text-xs ${daysColor(daysLeft)}`}>
                  {daysText(daysLeft)}
                </span>
                <span className="text-[10px] text-[#9ca3af]">
                  {opp.deadline ? format(new Date(opp.deadline), 'dd MMM yyyy') : '—'}
                </span>
              </div>
              <span className={`ml-1 h-2 w-2 flex-shrink-0 rounded-full ${urgencyDot(daysLeft)}`} />
            </Link>
          );
        })}
      </div>

      {/* Footer */}
      <div className="border-t border-[#e5e7eb] px-5 py-3">
        <Link to="/opportunities" className="text-xs text-[#6b7280] hover:text-accent transition-colors">
          View all upcoming deadlines →
        </Link>
      </div>
    </div>
  );
}
