import { describe, expect, it } from 'vitest';
import { updateFilterParams } from './filterParams';

describe('updateFilterParams', () => {
  it('updates sort field and direction atomically while resetting the page', () => {
    const current = new URLSearchParams('page=4&limit=50&sortBy=createdAt&sortOrder=desc');

    const next = updateFilterParams(current, {
      sortBy: 'type',
      sortOrder: 'asc',
    });

    expect(next.get('sortBy')).toBe('type');
    expect(next.get('sortOrder')).toBe('asc');
    expect(next.get('limit')).toBe('50');
    expect(next.has('page')).toBe(false);
  });

  it('keeps the selected page size when pagination is reset to page one', () => {
    const current = new URLSearchParams('page=3&limit=20');

    const next = updateFilterParams(current, { limit: '50', page: null });

    expect(next.get('limit')).toBe('50');
    expect(next.has('page')).toBe(false);
  });
});
