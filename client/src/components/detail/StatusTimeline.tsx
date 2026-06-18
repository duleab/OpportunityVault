import { formatRelative } from '../../utils/deadlineUtils';
import type { Opportunity } from '../../types/opportunity.types';

interface TimelineEvent {
  id: string;
  label: string;
  timestamp: string;
}

function buildEvents(opp: Opportunity): TimelineEvent[] {
  const events: TimelineEvent[] = [
    { id: 'created', label: `Saved as ${opp.status}`, timestamp: opp.createdAt },
  ];

  if (opp.appliedAt) {
    events.push({ id: 'applied', label: 'Application submitted', timestamp: opp.appliedAt });
  }

  if (opp.status === 'ACCEPTED') {
    events.push({ id: 'accepted', label: 'Accepted', timestamp: opp.updatedAt });
  }
  if (opp.status === 'REJECTED') {
    events.push({ id: 'rejected', label: 'Rejected', timestamp: opp.updatedAt });
  }
  if (opp.status === 'EXPIRED') {
    events.push({ id: 'expired', label: 'Deadline expired', timestamp: opp.updatedAt });
  }
  if (opp.lastNotifiedAt) {
    events.push({ id: 'notified', label: 'Deadline alert sent', timestamp: opp.lastNotifiedAt });
  }

  return events.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}

interface StatusTimelineProps {
  opportunity: Opportunity;
}

export function StatusTimeline({ opportunity }: StatusTimelineProps) {
  const events = buildEvents(opportunity);
  if (events.length === 0) return null;

  return (
    <div>
      <h4 className="mb-3 text-sm font-medium text-gray-400">Status History</h4>
      <ul className="space-y-3 border-l border-white/10 pl-4">
        {events.map((e) => (
          <li key={e.id} className="relative">
            <div className="absolute -left-[21px] top-1.5 h-2.5 w-2.5 rounded-full bg-accent" />
            <p className="text-sm text-gray-300">{e.label}</p>
            <p className="text-xs text-gray-500">{formatRelative(e.timestamp)}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
