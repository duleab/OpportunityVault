import { useEffect, useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { fetchUpcoming, fetchUrgent } from '../services/opportunityService';
import type { Opportunity } from '../types/opportunity.types';

export function useDeadlines(days = 30) {
  const accessToken = useAuthStore((s) => s.accessToken);
  const [upcoming, setUpcoming] = useState<Opportunity[]>([]);
  const [urgent, setUrgent] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!accessToken) return;
    setLoading(true);
    Promise.all([fetchUpcoming(accessToken, days), fetchUrgent(accessToken)])
      .then(([up, ur]) => {
        setUpcoming(up.data);
        setUrgent(ur.data);
      })
      .finally(() => setLoading(false));
  }, [accessToken, days]);

  return { upcoming, urgent, loading };
}
