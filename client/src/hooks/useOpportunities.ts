import { useCallback, useEffect, useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { useOpportunityStore } from '../store/opportunityStore';
import {
  fetchOpportunities,
  updateOpportunity,
  deleteOpportunity,
  type OpportunityFilters,
} from '../services/opportunityService';
import type { AppStatus } from '../types/opportunity.types';

export function useOpportunities(initialFilters: OpportunityFilters = {}) {
  const accessToken     = useAuthStore((s) => s.accessToken);
  const setOpportunities = useOpportunityStore((s) => s.setOpportunities);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState(initialFilters);
  const [total, setTotal]     = useState(0);

  const load = useCallback(async () => {
    if (!accessToken) return;
    setLoading(true);
    try {
      const res = await fetchOpportunities(accessToken, filters);
      // Pass pagination meta through to the store so Pagination component has it
      setOpportunities(res.data, {
        page:       res.page,
        totalPages: res.totalPages,
        total:      res.total,
        limit:      res.limit,
      });
      setTotal(res.total);
    } finally {
      setLoading(false);
    }
  }, [accessToken, filters, setOpportunities]);

  useEffect(() => {
    void load();
  }, [load]);

  const updateStatus = async (id: string, status: AppStatus) => {
    if (!accessToken) return;
    await updateOpportunity(accessToken, id, { status });
    await load();
  };

  const remove = async (id: string) => {
    if (!accessToken) return;
    await deleteOpportunity(accessToken, id);
    await load();
  };

  return { loading, total, filters, setFilters, reload: load, updateStatus, remove };
}
