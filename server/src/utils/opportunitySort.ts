type SortDirection = 'asc' | 'desc';

interface SortableOpportunity {
  countries: string[];
  urgency: { daysLeft: number | null };
}

export function sortOpportunities<T extends SortableOpportunity>(
  opportunities: T[],
  sortBy: string,
  sortOrder: string
): T[] {
  if (sortBy !== 'countries' && sortBy !== 'daysLeft') return opportunities;

  const direction: SortDirection = sortOrder === 'desc' ? 'desc' : 'asc';
  return [...opportunities].sort((left, right) => {
    if (sortBy === 'countries') {
      const comparison = left.countries.join(', ').localeCompare(right.countries.join(', '), undefined, {
        sensitivity: 'base',
      });
      return direction === 'desc' ? -comparison : comparison;
    }

    const leftValue = left.urgency.daysLeft;
    const rightValue = right.urgency.daysLeft;
    if (leftValue === null) return rightValue === null ? 0 : 1;
    if (rightValue === null) return -1;
    return direction === 'desc' ? rightValue - leftValue : leftValue - rightValue;
  });
}
