import { useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import type { OpportunityFilters } from '../services/opportunityService';

export function useFilters() {
  const [params, setParams] = useSearchParams();

  const filters: OpportunityFilters = useMemo(
    () => ({
      type:      params.get('type') ?? '',
      status:    params.get('status') ?? '',
      country:   params.get('country') ?? '',
      urgency:   params.get('urgency') ?? '',
      search:    params.get('search') ?? '',
      sortBy:    params.get('sortBy') ?? 'createdAt',
      sortOrder: params.get('sortOrder') ?? 'desc',
      page:      parseInt(params.get('page') ?? '1', 10),
      limit:     parseInt(params.get('limit') ?? '20', 10),
    }),
    [params]
  );

  const setFilter = useCallback(
    (key: string, value: string) => {
      setParams((prev) => {
        const next = new URLSearchParams(prev);
        if (value) next.set(key, value);
        else next.delete(key);
        // Reset to page 1 whenever any filter (except page itself) changes
        if (key !== 'page') next.delete('page');
        return next;
      });
    },
    [setParams]
  );

  const clearFilters = useCallback(() => setParams({}), [setParams]);

  return {
    filters,
    setFilter,
    clearFilters,
    view: params.get('view') ?? 'table',
    setView: (v: string) => setFilter('view', v),
  };
}
