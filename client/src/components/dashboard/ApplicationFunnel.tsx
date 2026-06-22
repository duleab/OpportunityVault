import { Link } from 'react-router-dom';

interface FunnelItem {
  label: string;
  status: string;
  count: number;
  color: string;
  bg: string;
  href: string;
}

interface ApplicationFunnelProps {
  byStatus: Record<string, number>;
  total: number;
}

const FUNNEL_STAGES: Omit<FunnelItem, 'count'>[] = [
  { label: 'Saved', status: 'SAVED', color: 'bg-gray-400', bg: 'bg-gray-400/20 text-gray-300', href: '/opportunities?status=SAVED' },
  { label: 'Planning', status: 'PLANNING', color: 'bg-blue-400', bg: 'bg-blue-400/20 text-blue-300', href: '/opportunities?status=PLANNING' },
  { label: 'In Progress', status: 'IN_PROGRESS', color: 'bg-violet-400', bg: 'bg-violet-400/20 text-violet-300', href: '/opportunities?status=IN_PROGRESS' },
  { label: 'Applied', status: 'APPLIED', color: 'bg-amber-400', bg: 'bg-amber-400/20 text-amber-300', href: '/opportunities?status=APPLIED' },
  { label: 'Interview', status: 'INTERVIEW', color: 'bg-orange-400', bg: 'bg-orange-400/20 text-orange-300', href: '/opportunities?status=INTERVIEW' },
  { label: 'Accepted', status: 'ACCEPTED', color: 'bg-green-400', bg: 'bg-green-400/20 text-green-300', href: '/opportunities?status=ACCEPTED' },
];

export function ApplicationFunnel({ byStatus, total }: ApplicationFunnelProps) {
  return (
    <div className="card">
      <div className="flex items-center justify-between px-5 pt-5 pb-3">
        <h3 className="text-sm font-semibold text-white">Application Funnel</h3>
        <Link to="/opportunities" className="text-xs text-accent hover:underline">View full funnel →</Link>
      </div>
      <div className="divide-y divide-white/[0.05] pb-3">
        {FUNNEL_STAGES.map(({ label, status, color, href }) => {
          const count = byStatus[status] ?? 0;
          const pct = total > 0 ? Math.round((count / total) * 100) : 0;
          return (
            <Link
              key={status}
              to={href}
              className="flex items-center gap-3 px-5 py-2.5 hover:bg-white/[0.03] transition"
            >
              <span className={`h-2.5 w-2.5 flex-shrink-0 rounded-full ${color}`} />
              <span className="flex-1 text-xs text-gray-300">{label}</span>
              {/* Mini bar */}
              <div className="w-16 h-1.5 rounded-full bg-white/10 overflow-hidden">
                <div
                  className={`h-full rounded-full ${color}`}
                  style={{ width: `${pct}%` }}
                />
              </div>
              <span className="w-6 text-right text-xs font-semibold text-white tabular-nums">{count}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
