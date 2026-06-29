import type { ReactNode } from 'react';

interface StatCardProps {
  label: string;
  value: number;
  icon: ReactNode;
  accentColor: string;
  subLabel?: string;
}

function StatCard({ label, value, icon, accentColor, subLabel }: StatCardProps) {
  return (
    <div className="card card-hover p-5">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="label mb-2">{label}</p>
          <p className="text-3xl font-extrabold text-[#111827] tabular-nums tracking-tight">{value}</p>
          {subLabel && <p className="mt-1 text-xs text-[#9ca3af]">{subLabel}</p>}
        </div>
        <div
          className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg"
          style={{ backgroundColor: accentColor + '18', color: accentColor }}
        >
          {icon}
        </div>
      </div>
      {/* Accent bottom bar */}
      <div className="mt-4 h-1 rounded-full bg-[#f3f4f6]">
        <div
          className="h-1 rounded-full transition-all"
          style={{ width: `${Math.min(100, value * 5)}%`, backgroundColor: accentColor }}
        />
      </div>
    </div>
  );
}

interface StatsRowProps {
  total: number;
  applied: number;
  urgent: number;
  accepted: number;
}

export function StatsRow({ total, applied, urgent, accepted }: StatsRowProps) {
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      <StatCard
        label="Total Saved"
        value={total}
        accentColor="#2563eb"
        subLabel="all time"
        icon={<svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>}
      />
      <StatCard
        label="Applications"
        value={applied}
        accentColor="#059669"
        subLabel="submitted"
        icon={<svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
      />
      <StatCard
        label="Urgent Deadlines"
        value={urgent}
        accentColor="#d97706"
        subLabel="≤7 days left"
        icon={<svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
      />
      <StatCard
        label="Accepted"
        value={accepted}
        accentColor="#2563eb"
        subLabel="🎉 congratulations"
        icon={<svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>}
      />
    </div>
  );
}

export function UrgentSection({ items }: { items: import('../../types/opportunity.types').Opportunity[] }) {
  if (items.length === 0) return null;
  return (
    <section>
      <div className="flex items-center gap-2 mb-3">
        <span className="text-sm font-semibold text-[#111827]">🚨 Needs Immediate Attention</span>
        <span className="rounded bg-[#fef2f2] border border-[#fecaca] px-2 py-0.5 text-xs text-[#991b1b]">
          {items.length} urgent
        </span>
      </div>
      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {items.slice(0, 3).map((opp) => (
          <div key={opp.id} className="card p-4 border-l-4 border-[#dc2626]">
            <p className="text-sm font-semibold text-[#111827] truncate">{opp.name}</p>
            <p className="text-xs text-[#9ca3af] mt-0.5 truncate">{opp.organization ?? '—'}</p>
            {opp.deadline && (
              <p className="mt-2 text-xs font-bold text-[#dc2626]">
                {opp.urgency.daysLeft === 0 ? 'Due today!' : `${opp.urgency.daysLeft} day${opp.urgency.daysLeft === 1 ? '' : 's'} left`}
              </p>
            )}
            {opp.applicationLink && (
              <a
                href={opp.applicationLink}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-flex items-center gap-1 text-xs text-accent font-medium hover:underline"
              >
                Apply Now →
              </a>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
