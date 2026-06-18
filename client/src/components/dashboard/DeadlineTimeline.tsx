import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import type { Opportunity } from '../../types/opportunity.types';

interface DeadlineTimelineProps {
  items: Opportunity[];
}

export function DeadlineTimeline({ items }: DeadlineTimelineProps) {
  if (items.length === 0) {
    return <p className="text-sm text-gray-500">No upcoming deadlines in the next 30 days.</p>;
  }

  return (
    <div className="relative pl-6">
      <div className="absolute bottom-0 left-2 top-0 w-px bg-white/10" />
      {items.map((opp) => (
        <Link
          key={opp.id}
          to={`/opportunities/${opp.id}`}
          className="relative mb-4 block rounded-lg border border-white/5 bg-base/50 p-3 pl-4 transition hover:border-accent/30"
        >
          <div className="absolute -left-[17px] top-4 h-3 w-3 rounded-full border-2 border-accent bg-base" />
          <p className="font-medium text-white">{opp.name}</p>
          <p className="font-mono text-xs text-gray-400">
            {opp.deadline ? format(new Date(opp.deadline), 'MMM d, yyyy') : 'TBD'}
          </p>
        </Link>
      ))}
    </div>
  );
}
