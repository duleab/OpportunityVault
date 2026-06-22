import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { useAuthStore } from '../store/authStore';
import { fetchStats, fetchOpportunities } from '../services/opportunityService';
import type { StatsOverview, Opportunity } from '../types/opportunity.types';
import { StatsRow, UrgentSection } from '../components/dashboard/StatsRow';
import { UpcomingDeadlines } from '../components/dashboard/DeadlineTimeline';
import { TypeBreakdown } from '../components/dashboard/TypeBreakdown';
import { ApplicationFunnel } from '../components/dashboard/ApplicationFunnel';
import { RecentlyAdded } from '../components/dashboard/RecentlyAdded';
import { Button } from '../components/ui/Button';

function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

function SkeletonCard() {
  return (
    <div className="card p-5 animate-pulse">
      <div className="h-3 w-24 bg-white/5 rounded mb-3" />
      <div className="h-8 w-16 bg-white/10 rounded mb-4" />
      <div className="h-12 bg-white/5 rounded" />
      <div className="h-3 w-32 bg-white/5 rounded mt-3" />
    </div>
  );
}

export function Dashboard() {
  const accessToken = useAuthStore((s) => s.accessToken);
  const user = useAuthStore((s) => s.user);
  const [stats, setStats] = useState<StatsOverview | null>(null);
  const [recentOpps, setRecentOpps] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!accessToken) return;
    Promise.all([
      fetchStats(accessToken),
      fetchOpportunities(accessToken, { sortBy: 'createdAt', sortOrder: 'desc', limit: 10 }),
    ])
      .then(([s, opps]) => {
        setStats(s);
        setRecentOpps(opps.data);
      })
      .catch(() => undefined)
      .finally(() => setLoading(false));
  }, [accessToken]);

  const displayName = user?.name ?? user?.email?.split('@')[0] ?? 'there';
  const today = format(new Date(), 'EEEE, dd MMM yyyy');

  if (loading) {
    return (
      <div className="space-y-6 animate-fade-in">
        {/* Greeting skeleton */}
        <div>
          <div className="h-7 w-64 bg-white/5 rounded mb-2 animate-pulse" />
          <div className="h-4 w-80 bg-white/5 rounded animate-pulse" />
        </div>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => <SkeletonCard key={i} />)}
        </div>
      </div>
    );
  }

  if (!stats || stats.total === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center animate-fade-in">
        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-accent/10 border border-accent/20">
          <span className="text-4xl">🎯</span>
        </div>
        <h2 className="text-xl font-bold text-white mb-2">Your vault is empty</h2>
        <p className="text-gray-400 text-sm mb-8 max-w-sm">
          Start by adding your first opportunity. Paste any scholarship, job, or program text and let AI extract the details.
        </p>
        <Link to="/add">
          <Button size="lg">
            <span>+ Add your first opportunity</span>
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Greeting Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">
            {getGreeting()}, {displayName} 👋
          </h1>
          <p className="mt-1 text-sm text-gray-400">
            Here's what's happening with your opportunities today.
          </p>
        </div>
        <div className="hidden sm:flex items-center gap-2 text-xs text-gray-500">
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          {today}
        </div>
      </div>

      {/* Stat Cards */}
      <StatsRow
        total={stats.total}
        applied={stats.applied_count}
        urgent={stats.urgent_count}
        accepted={stats.accepted_count}
      />

      {/* Urgent section */}
      <UrgentSection items={stats.upcoming_deadlines.filter((o) => o.urgency.isUrgent)} />

      {/* Middle row: 3 columns */}
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <UpcomingDeadlines items={stats.upcoming_deadlines} />
        </div>
        <div className="lg:col-span-1">
          <TypeBreakdown data={stats.by_type} />
        </div>
        <div className="lg:col-span-1">
          <ApplicationFunnel byStatus={stats.by_status} total={stats.total} />
        </div>
      </div>

      {/* Recently Added table */}
      {recentOpps.length > 0 && <RecentlyAdded items={recentOpps} />}
    </div>
  );
}
