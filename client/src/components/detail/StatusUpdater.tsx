import type { AppStatus } from '../../types/opportunity.types';
import { APP_STATUSES } from '../../types/opportunity.types';
import { Button } from '../ui/Button';

interface StatusUpdaterProps {
  status: AppStatus;
  onChange: (status: AppStatus) => void;
}

export function StatusUpdater({ status, onChange }: StatusUpdaterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {APP_STATUSES.map((s) => (
        <Button
          key={s}
          size="sm"
          variant={status === s ? 'primary' : 'secondary'}
          onClick={() => onChange(s)}
        >
          {s.replace('_', ' ')}
        </Button>
      ))}
    </div>
  );
}
