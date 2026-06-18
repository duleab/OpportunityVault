import { STATUS_COLORS, type AppStatus } from '../../types/opportunity.types';
import { Badge } from '../ui/Badge';

interface StatusBadgeProps {
  status: AppStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  return <Badge className={STATUS_COLORS[status]}>{status.replace('_', ' ')}</Badge>;
}
