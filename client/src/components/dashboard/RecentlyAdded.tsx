import { Link } from 'react-router-dom';
import { Eye, MoreVertical } from 'lucide-react';
import { formatDistanceToNow, differenceInDays, format } from 'date-fns';
import type { Opportunity } from '../../types/opportunity.types';

interface RecentlyAddedProps {
  items: Opportunity[];
}

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

const STATUS_COLORS: Record<string, string> = {
  SAVED: 'bg-gray-500/15 text-gray-300',
  PLANNING: 'bg-blue-500/15 text-blue-300',
  IN_PROGRESS: 'bg-violet-500/15 text-violet-300',
  APPLIED: 'bg-amber-500/15 text-amber-300',
  INTERVIEW: 'bg-orange-500/15 text-orange-300',
  ACCEPTED: 'bg-green-500/15 text-green-300',
  REJECTED: 'bg-red-500/15 text-red-300',
};

function OrgAvatar({ name }: { name: string | null }) {
  const initials = name ? name.slice(0, 2).toUpperCase() : '??';
  const bgColors = ['bg-violet-600','bg-blue-600','bg-green-600','bg-amber-600','bg-red-600','bg-pink-600','bg-cyan-600','bg-indigo-600'];
  const idx = (name ?? '').charCodeAt(0) % bgColors.length;
  return (
    <div className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg ${bgColors[idx]} text-white text-[10px] font-bold`}>
      {initials}
    </div>
  );
}

function DaysLeftBadge({ deadline }: { deadline: string | null }) {
  if (!deadline) return <span className="text-xs text-gray-600">—</span>;
  const days = differenceInDays(new Date(deadline), new Date());
  if (days < 0) return <span className="text-xs font-mono text-gray-500 line-through">Expired</span>;
  let cls = 'text-gray-400';
  if (days <= 3) cls = 'text-red-400 font-semibold';
  else if (days <= 7) cls = 'text-amber-400 font-semibold';
  else if (days <= 30) cls = 'text-yellow-400';
  return <span className={`font-mono text-xs ${cls}`}>{days} days</span>;
}

export function RecentlyAdded({ items }: RecentlyAddedProps) {
  if (items.length === 0) return null;

  return (
    <div className="card">
      <div className="flex items-center justify-between px-5 pt-5 pb-4">
        <h3 className="text-sm font-semibold text-white">Recently Added Opportunities</h3>
        <Link to="/opportunities" className="text-xs text-accent hover:underline">View all</Link>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-y border-white/[0.05]">
              {['OPPORTUNITY', 'TYPE', 'ORGANIZATION', 'DEADLINE', 'DAYS LEFT', 'STATUS', 'ADDED', 'ACTIONS'].map(h => (
                <th key={h} className="px-5 py-2.5 text-left text-[10px] font-semibold uppercase tracking-wider text-gray-600">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.04]">
            {items.slice(0, 8).map((opp) => (
              <tr key={opp.id} className="group hover:bg-white/[0.025] transition">
                {/* Opportunity */}
                <td className="px-5 py-3">
                  <div className="flex items-center gap-3">
                    <OrgAvatar name={opp.organization ?? opp.name} />
                    <div className="min-w-0">
                      <p className="font-medium text-white truncate max-w-[200px]">{opp.name}</p>
                      {opp.description && (
                        <p className="text-[11px] text-gray-500 truncate max-w-[200px] mt-0.5">{opp.description}</p>
                      )}
                    </div>
                  </div>
                </td>
                {/* Type */}
                <td className="px-5 py-3">
                  <span className={`rounded-md px-2 py-0.5 text-[11px] font-medium capitalize ${TYPE_COLORS[opp.type] ?? 'bg-gray-500/15 text-gray-300'}`}>
                    {opp.type.toLowerCase().replace('_', ' ')}
                  </span>
                </td>
                {/* Org */}
                <td className="px-5 py-3 text-gray-400 max-w-[140px]">
                  <span className="truncate block">{opp.organization ?? '—'}</span>
                </td>
                {/* Deadline */}
                <td className="px-5 py-3 font-mono text-gray-400">
                  {opp.deadline ? format(new Date(opp.deadline), 'dd MMM yyyy') : '—'}
                </td>
                {/* Days Left */}
                <td className="px-5 py-3">
                  <DaysLeftBadge deadline={opp.deadline} />
                </td>
                {/* Status */}
                <td className="px-5 py-3">
                  <span className={`rounded-md px-2 py-0.5 text-[11px] font-medium capitalize ${STATUS_COLORS[opp.status] ?? 'bg-gray-500/15 text-gray-300'}`}>
                    {opp.status.toLowerCase().replace('_', ' ')}
                  </span>
                </td>
                {/* Added */}
                <td className="px-5 py-3 text-gray-500">
                  {formatDistanceToNow(new Date(opp.createdAt), { addSuffix: true })}
                </td>
                {/* Actions */}
                <td className="px-5 py-3">
                  <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition">
                    <Link
                      to={`/opportunities/${opp.id}`}
                      className="rounded-lg p-1.5 text-gray-500 hover:text-white hover:bg-white/10 transition"
                      title="View"
                    >
                      <Eye className="h-3.5 w-3.5" />
                    </Link>
                    <button className="rounded-lg p-1.5 text-gray-500 hover:text-white hover:bg-white/10 transition" title="More">
                      <MoreVertical className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
