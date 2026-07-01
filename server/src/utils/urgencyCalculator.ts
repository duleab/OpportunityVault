import { differenceInDays } from 'date-fns';
import type { UrgencyInfo } from '../types/index.js';

export function calculateUrgency(deadline: Date | null, status?: string): UrgencyInfo {
  const s = status ? String(status).trim().toUpperCase() : '';
  if (s === 'APPLIED') {
    return { level: 'applied', daysLeft: null, label: 'Applied ✓', color: 'green', isUrgent: false };
  }
  if (s === 'ACCEPTED') {
    return { level: 'accepted', daysLeft: null, label: 'Accepted 🎉', color: 'green', isUrgent: false };
  }
  if (s === 'REJECTED') {
    return { level: 'rejected', daysLeft: null, label: 'Rejected', color: 'gray', isUrgent: false };
  }
  if (s === 'WITHDRAWN') {
    return { level: 'withdrawn', daysLeft: null, label: 'Withdrawn', color: 'gray', isUrgent: false };
  }
  if (s === 'SKIPPED') {
    return { level: 'skipped', daysLeft: null, label: 'Skipped', color: 'gray', isUrgent: false };
  }
  if (s === 'EXPIRED') {
    return { level: 'expired', daysLeft: null, label: 'Expired', color: 'red', isUrgent: false };
  }

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

export function urgencyLevelFromDeadline(deadline: Date | null, status?: string): string {
  const level = calculateUrgency(deadline, status).level;
  return level === 'none' || level === 'expired' ? 'none' : level;
}
