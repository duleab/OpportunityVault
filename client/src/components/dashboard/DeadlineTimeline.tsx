import { Link } from 'react-router-dom';
import { format, differenceInDays } from 'date-fns';
import type { Opportunity } from '../../types/opportunity.types';

interface UpcomingDeadlinesProps {
  items: Opportunity[];
}

function urgencyBadge(daysLeft: number | null) {
  if (daysLeft === null) return null;
  if (daysLeft <= 2) return <span className="rounded-md bg-red-500/20 px-2 py-0.5 text-xs font-medium text-red-300 border border-red-500/30">Critical</span>;
  if (daysLeft <= 7) return <span className="rounded-md bg-amber-500/20 px-2 py-0.5 text-xs font-medium text-amber-300 border border-amber-500/30">High</span>;
  if (daysLeft <= 30) return <span className="rounded-md bg-yellow-500/10 px-2 py-0.5 text-xs font-medium text-yellow-400 border border-yellow-500/20">Medium</span>;
  return <span className="rounded-md bg-gray-500/10 px-2 py-0.5 text-xs font-medium text-gray-400 border border-gray-500/20">Low</span>;
}

function daysColor(daysLeft: number | null) {
  if (daysLeft === null) return 'text-gray-400';
  if (daysLeft <= 2) return 'text-red-400';
  if (daysLeft <= 7) return 'text-amber-400';
  if (daysLeft <= 30) return 'text-yellow-400';
  return 'text-gray-400';
}

function OrgAvatar({ name }: { name: string | null }) {
  const initials = name ? name.slice(0, 2).toUpperCase() : '??';
  const colors = ['bg-violet-500', 'bg-blue-500', 'bg-green-500', 'bg-amber-500', 'bg-red-500', 'bg-pink-500', 'bg-cyan-500'];
  const idx = (name ?? '').charCodeAt(0) % colors.length;
  return (
    <div className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg ${colors[idx]} text-white text-[10px] font-bold`}>
      {initials}
    </div>
  );
}

export function UpcomingDeadlines({ items }: UpcomingDeadlinesProps) {
  if (items.length === 0) {
    return <p className="text-sm text-gray-500 py-4">No upcoming deadlines.</p>;
  }

  return (
    <div className="card">
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-5 pb-3">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold text-white">Upcoming Deadlines</h3>
          <span className="rounded-full bg-red-500/20 px-2 py-0.5 text-xs text-red-300 border border-red-500/20">
            {items.filter(o => o.urgency?.isUrgent).length} urgent
          </span>
        </div>
        <Link to="/opportunities" className="text-xs text-accent hover:underline">View all</Link>
      </div>

      {/* List */}
      <div className="divide-y divide-white/[0.05]">
        {items.slice(0, 6).map((opp) => {
          const daysLeft = opp.deadline ? differenceInDays(new Date(opp.deadline), new Date()) : null;
          return (
            <Link
              key={opp.id}
              to={`/opportunities/${opp.id}`}
              className="flex items-center gap-3 px-5 py-3 hover:bg-white/[0.03] transition"
            >
              <OrgAvatar name={opp.organization ?? opp.name} />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-white truncate">{opp.name}</p>
                <p className="text-[11px] text-gray-500 truncate">{opp.organization ?? '—'}</p>
              </div>
              <div className="flex flex-col items-end gap-1 flex-shrink-0">
                <span className={`font-mono text-xs font-medium ${daysColor(daysLeft)}`}>
                  {daysLeft !== null ? (daysLeft === 0 ? 'Today!' : `${daysLeft} days left`) : '—'}
                </span>
                <span className="text-[10px] text-gray-600">
                  {opp.deadline ? format(new Date(opp.deadline), 'dd MMM yyyy') : 'No date'}
                </span>
              </div>
              <div className="ml-2 flex-shrink-0">
                {urgencyBadge(daysLeft)}
              </div>
            </Link>
          );
        })}
      </div>

      {/* Footer */}
      <div className="border-t border-white/[0.05] px-5 py-3">
        <Link to="/opportunities" className="text-xs text-gray-500 hover:text-accent transition flex items-center gap-1">
          View all upcoming deadlines →
        </Link>
      </div>
    </div>
  );
}
