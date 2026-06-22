import { formatDistanceToNow } from 'date-fns';

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
    <ul className="space-y-2">
      {items.map((item) => (
        <li key={item.id} className="flex items-start gap-3 rounded-lg p-3 hover:bg-white/[0.03] transition">
          <div className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-accent" />
          <div className="flex-1 min-w-0">
            <p className="text-xs text-gray-300 truncate">{item.message}</p>
            <p className="text-[11px] text-gray-600 mt-0.5">
              {formatDistanceToNow(new Date(item.timestamp), { addSuffix: true })}
            </p>
          </div>
        </li>
      ))}
    </ul>
  );
}
