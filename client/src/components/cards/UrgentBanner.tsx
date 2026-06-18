import { AlertTriangle } from 'lucide-react';

interface UrgentBannerProps {
  count: number;
  onClick: () => void;
}

export function UrgentBanner({ count, onClick }: UrgentBannerProps) {
  if (count === 0) return null;
  return (
    <button
      onClick={onClick}
      className="mb-4 flex w-full items-center gap-3 rounded-lg border border-warning/30 bg-warning/10 px-4 py-3 text-left transition hover:bg-warning/15"
    >
      <AlertTriangle className="h-5 w-5 text-warning" />
      <span className="text-sm font-medium text-warning">
        ⚠️ {count} opportunit{count === 1 ? 'y' : 'ies'} need attention
      </span>
    </button>
  );
}
