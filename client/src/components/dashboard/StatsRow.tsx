import { ExternalLink } from 'lucide-react';
import type { Opportunity } from '../../types/opportunity.types';
import { CountdownTimer } from '../ui/CountdownTimer';
import { Button } from '../ui/Button';

interface StatsRowProps {
  total: number;
  applied: number;
  urgent: number;
  accepted: number;
}

export function StatsRow({ total, applied, urgent, accepted }: StatsRowProps) {
  const stats = [
    { label: 'Total Saved', value: total, color: 'text-white' },
    { label: 'Applied', value: applied, color: 'text-accent' },
    { label: 'Urgent (≤7d)', value: urgent, color: 'text-warning' },
    { label: 'Accepted', value: accepted, color: 'text-accent2' },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {stats.map((s) => (
        <div key={s.label} className="rounded-xl border border-white/10 bg-surface p-5">
          <p className="text-sm text-gray-400">{s.label}</p>
          <p className={`mt-1 font-display text-3xl font-bold ${s.color}`}>{s.value}</p>
        </div>
      ))}
    </div>
  );
}

export function UrgentSection({ items }: { items: Opportunity[] }) {
  if (items.length === 0) return null;
  return (
    <section className="mt-8">
      <h2 className="mb-4 font-display text-lg font-semibold text-white">🚨 Needs Attention</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {items.map((opp) => (
          <div key={opp.id} className="rounded-xl border border-warning/20 bg-warning/5 p-4">
            <p className="font-medium text-white">{opp.name}</p>
            {opp.deadline && <CountdownTimer deadline={opp.deadline} className="mt-1 block" />}
            {opp.applicationLink && (
              <a href={opp.applicationLink} target="_blank" rel="noopener noreferrer" className="mt-3 inline-block">
                <Button size="sm">Apply Now <ExternalLink className="h-3 w-3" /></Button>
              </a>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
