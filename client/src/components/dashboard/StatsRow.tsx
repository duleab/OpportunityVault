import { TrendingUp, TrendingDown } from 'lucide-react';
import type { ReactNode } from 'react';
import { Sparkline } from '../ui/Sparkline';

interface StatCardProps {
  label: string;
  value: number;
  trend?: { value: number; label: string; up: boolean };
  icon: ReactNode;
  iconBg: string;
  sparkColor: string;
  sparkGradientId: string;
  sparkData?: { value: number }[];
}

function makeSparkData(seed: number, count = 10) {
  // Generate fake but plausible spark data based on the seed
  return Array.from({ length: count }, (_, i) => ({
    value: Math.max(0, seed * (0.6 + Math.random() * 0.5) * ((i + 1) / count)),
  }));
}

export function StatCard({
  label, value, trend, icon, iconBg, sparkColor, sparkGradientId, sparkData,
}: StatCardProps) {
  const data = sparkData ?? makeSparkData(value);
  return (
    <div className="card card-hover p-5 flex flex-col gap-3">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-gray-400">{label}</p>
          <p className="mt-1 text-3xl font-bold text-white tabular-nums">{value}</p>
        </div>
        <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${iconBg}`}>
          {icon}
        </div>
      </div>
      {/* Sparkline */}
      <div className="-mx-1">
        <Sparkline data={data} color={sparkColor} gradientId={sparkGradientId} />
      </div>
      {trend && (
        <div className="flex items-center gap-1.5">
          {trend.up ? (
            <TrendingUp className="h-3.5 w-3.5 text-green-400" />
          ) : (
            <TrendingDown className="h-3.5 w-3.5 text-red-400" />
          )}
          <span className={`text-xs font-medium ${trend.up ? 'text-green-400' : 'text-red-400'}`}>
            {trend.up ? '+' : '-'}{Math.abs(trend.value)}%
          </span>
          <span className="text-xs text-gray-500">{trend.label}</span>
        </div>
      )}
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
  const stats: StatCardProps[] = [
    {
      label: 'Total Opportunities',
      value: total,
      trend: { value: 12, label: 'from last month', up: true },
      icon: <svg className="h-5 w-5 text-violet-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>,
      iconBg: 'bg-violet-500/20',
      sparkColor: '#8b5cf6',
      sparkGradientId: 'spark-total',
    },
    {
      label: 'Applications',
      value: applied,
      trend: { value: 8, label: 'from last month', up: true },
      icon: <svg className="h-5 w-5 text-green-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
      iconBg: 'bg-green-500/20',
      sparkColor: '#10b981',
      sparkGradientId: 'spark-applied',
    },
    {
      label: 'Urgent Deadlines',
      value: urgent,
      trend: { value: 2, label: 'from yesterday', up: false },
      icon: <svg className="h-5 w-5 text-amber-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
      iconBg: 'bg-amber-500/20',
      sparkColor: '#f59e0b',
      sparkGradientId: 'spark-urgent',
    },
    {
      label: 'Accepted',
      value: accepted,
      trend: { value: 1, label: 'from last month', up: true },
      icon: <svg className="h-5 w-5 text-emerald-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>,
      iconBg: 'bg-emerald-500/20',
      sparkColor: '#34d399',
      sparkGradientId: 'spark-accepted',
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {stats.map((s) => <StatCard key={s.label} {...s} />)}
    </div>
  );
}

export function UrgentSection({ items }: { items: import('../../types/opportunity.types').Opportunity[] }) {
  if (items.length === 0) return null;
  return (
    <section className="mt-6">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-sm font-semibold text-white">🚨 Needs Immediate Attention</span>
        <span className="rounded-full bg-red-500/20 px-2 py-0.5 text-xs text-red-300 border border-red-500/20">{items.length} urgent</span>
      </div>
      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {items.slice(0, 3).map((opp) => (
          <div key={opp.id} className="card p-4 border-l-2 border-red-500">
            <p className="text-sm font-medium text-white truncate">{opp.name}</p>
            {opp.deadline && (
              <p className="mt-1 font-mono text-xs text-red-400">
                {opp.urgency.daysLeft === 0 ? 'Due today!' : `${opp.urgency.daysLeft}d left`}
              </p>
            )}
            {opp.applicationLink && (
              <a href={opp.applicationLink} target="_blank" rel="noopener noreferrer"
                className="mt-2 inline-flex items-center gap-1 text-xs text-accent hover:underline">
                Apply Now →
              </a>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
