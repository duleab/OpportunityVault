import { differenceInDays } from 'date-fns';
import type { UrgencyInfo } from '../types/index.js';

export function calculateUrgency(deadline: Date | null): UrgencyInfo {
  if (!deadline) {
    return {
      level: 'none',
      daysLeft: null,
      label: 'No deadline',
      color: 'gray',
      isUrgent: false,
    };
  }

  const now = new Date();
  const daysLeft = differenceInDays(deadline, now);

  if (daysLeft < 0) {
    return {
      level: 'expired',
      daysLeft,
      label: 'EXPIRED',
      color: 'red',
      isUrgent: false,
    };
  }
  if (daysLeft <= 2) {
    return {
      level: 'critical',
      daysLeft,
      label: `${daysLeft}d 🔥`,
      color: 'red',
      isUrgent: true,
    };
  }
  if (daysLeft <= 7) {
    return {
      level: 'high',
      daysLeft,
      label: `${daysLeft}d`,
      color: 'orange',
      isUrgent: true,
    };
  }
  if (daysLeft <= 30) {
    return {
      level: 'medium',
      daysLeft,
      label: `${daysLeft}d`,
      color: 'amber',
      isUrgent: false,
    };
  }
  return {
    level: 'low',
    daysLeft,
    label: `${daysLeft}d`,
    color: 'gray',
    isUrgent: false,
  };
}

export function urgencyLevelFromDeadline(deadline: Date | null): string {
  return calculateUrgency(deadline).level === 'none' || calculateUrgency(deadline).level === 'expired'
    ? 'none'
    : calculateUrgency(deadline).level;
}
