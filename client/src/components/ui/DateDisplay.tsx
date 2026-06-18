import { format } from 'date-fns';

interface DateDisplayProps {
  iso: string | null;
  expired?: boolean;
  className?: string;
}

export function DateDisplay({ iso, expired, className = '' }: DateDisplayProps) {
  if (!iso) return <span className={`font-mono text-gray-500 ${className}`}>—</span>;
  return (
    <span className={`font-mono text-sm ${expired ? 'text-danger line-through' : 'text-gray-300'} ${className}`}>
      {format(new Date(iso), 'MMM d, yyyy')}
    </span>
  );
}
