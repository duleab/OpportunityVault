import { formatRelative } from '../../utils/deadlineUtils';

interface ActivityItem {
  id: string;
  message: string;
  timestamp: string;
}

interface ActivityFeedProps {
  items: ActivityItem[];
}

export function ActivityFeed({ items }: ActivityFeedProps) {
  if (items.length === 0) {
    return <p className="text-sm text-gray-500">No recent activity.</p>;
  }

  return (
    <ul className="space-y-3">
      {items.map((item) => (
        <li key={item.id} className="flex items-start gap-3 text-sm">
          <div className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-accent" />
          <div>
            <p className="text-gray-300">{item.message}</p>
            <p className="text-xs text-gray-500">{formatRelative(item.timestamp)}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}
