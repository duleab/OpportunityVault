import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { fetchStats } from '../services/opportunityService';
import type { StatsOverview } from '../types/opportunity.types';
import { StatsRow, UrgentSection } from '../components/dashboard/StatsRow';
import { DeadlineTimeline } from '../components/dashboard/DeadlineTimeline';
import { TypeBreakdown } from '../components/dashboard/TypeBreakdown';
import { ActivityFeed } from '../components/dashboard/ActivityFeed';
import { Button } from '../components/ui/Button';

export function Dashboard() {
  const accessToken = useAuthStore((s) => s.accessToken);
  const [stats, setStats] = useState<StatsOverview | null>(null);

  useEffect(() => {
    if (!accessToken) return;
    fetchStats(accessToken).then(setStats).catch(() => undefined);
  }, [accessToken]);

  if (!stats) {
    return <div className="text-gray-400">Loading dashboard...</div>;
  }

  if (stats.total === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <p className="text-gray-400">No opportunities yet.</p>
        <Link to="/add" className="mt-4">
          <Button>Add your first opportunity →</Button>
        </Link>
      </div>
    );
  }

  const activity = stats.upcoming_deadlines.slice(0, 5).map((o) => ({
    id: o.id,
    message: `Added: ${o.name}`,
    timestamp: o.createdAt,
  }));

  return (
    <div className="space-y-8">
      <StatsRow
        total={stats.total}
        applied={stats.applied_count}
        urgent={stats.urgent_count}
        accepted={stats.accepted_count}
      />
      <UrgentSection items={stats.upcoming_deadlines.filter((o) => o.urgency.isUrgent)} />
      <div className="grid gap-8 lg:grid-cols-2">
        <section>
          <h2 className="mb-4 font-display text-lg font-semibold text-white">Upcoming Deadlines</h2>
          <DeadlineTimeline items={stats.upcoming_deadlines} />
        </section>
        <section>
          <h2 className="mb-4 font-display text-lg font-semibold text-white">By Type</h2>
          <TypeBreakdown data={stats.by_type} />
        </section>
      </div>
      <section>
        <h2 className="mb-4 font-display text-lg font-semibold text-white">Recent Activity</h2>
        <ActivityFeed items={activity} />
      </section>
    </div>
  );
}
