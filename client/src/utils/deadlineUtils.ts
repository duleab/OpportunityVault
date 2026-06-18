import { differenceInDays, format, formatDistanceToNow } from 'date-fns';
import type { UrgencyInfo } from '../types/opportunity.types';

export function calculateUrgency(deadline: Date | null): UrgencyInfo {
  if (!deadline) {
    return { level: 'none', daysLeft: null, label: 'No deadline', color: 'gray', isUrgent: false };
  }

  const now = new Date();
  const daysLeft = differenceInDays(deadline, now);

  if (daysLeft < 0) return { level: 'expired', daysLeft, label: 'EXPIRED', color: 'red', isUrgent: false };
  if (daysLeft <= 2) return { level: 'critical', daysLeft, label: `${daysLeft}d 🔥`, color: 'red', isUrgent: true };
  if (daysLeft <= 7) return { level: 'high', daysLeft, label: `${daysLeft}d`, color: 'orange', isUrgent: true };
  if (daysLeft <= 30) return { level: 'medium', daysLeft, label: `${daysLeft}d`, color: 'amber', isUrgent: false };
  return { level: 'low', daysLeft, label: `${daysLeft}d`, color: 'gray', isUrgent: false };
}

export function formatDeadline(iso: string | null): string {
  if (!iso) return '—';
  return format(new Date(iso), 'MMM d, yyyy');
}

export function formatRelative(iso: string): string {
  return formatDistanceToNow(new Date(iso), { addSuffix: true });
}

export function daysUntil(iso: string | null): number | null {
  if (!iso) return null;
  return differenceInDays(new Date(iso), new Date());
}

export function copyToClipboard(text: string): Promise<void> {
  return navigator.clipboard.writeText(text);
}

export const COUNTRY_FLAGS: Record<string, string> = {
  Germany: '🇩🇪', USA: '🇺🇸', 'United States': '🇺🇸', UK: '🇬🇧',
  'United Kingdom': '🇬🇧', France: '🇫🇷', Canada: '🇨🇦', Online: '🌐',
  Remote: '🌐', Japan: '🇯🇵', China: '🇨🇳', India: '🇮🇳', Australia: '🇦🇺',
};

export function countryFlag(country: string): string {
  return COUNTRY_FLAGS[country] ?? '🏳️';
}
