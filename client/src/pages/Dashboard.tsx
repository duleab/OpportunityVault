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

function SkeletonBlock({ className = '' }: { className?: string }) {
  return (
    <div className={`bg-[#f3f4f6] rounded animate-pulse ${className}`} />
  );
}

function SkeletonCard() {
  return (
    <div
      className="card p-5 animate-pulse"
      style={{ background: '#ffffff', border: '1px solid #e5e7eb', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}
    >
      <SkeletonBlock className="h-3 w-20 mb-3" />
      <SkeletonBlock className="h-8 w-14 mb-4" />
      <SkeletonBlock className="h-10 w-full" />
      <SkeletonBlock className="h-3 w-28 mt-3" />
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

  /* ── Loading skeleton ─────────────────────────────────────────── */
  if (loading) {
    return (
      <div className="space-y-6 animate-fade-in" style={{ background: '#fafafa' }}>
        {/* Greeting skeleton */}
        <div className="flex items-start justify-between">
          <div>
            <SkeletonBlock className="h-7 w-56 mb-2" />
            <SkeletonBlock className="h-4 w-72" />
          </div>
          <SkeletonBlock className="hidden sm:block h-8 w-36 rounded-full" />
        </div>

        {/* Stat cards skeleton */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>

        {/* Middle row skeleton */}
        <div className="grid gap-4 lg:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="card p-5 animate-pulse"
              style={{ background: '#ffffff', border: '1px solid #e5e7eb', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}
            >
              <SkeletonBlock className="h-4 w-32 mb-4" />
              <SkeletonBlock className="h-40 w-full" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  /* ── Empty state ──────────────────────────────────────────────── */
  if (!stats || stats.total === 0) {
    return (
      <div
        className="flex flex-col items-center justify-center py-24 text-center animate-fade-in"
        style={{ background: '#fafafa', minHeight: '60vh' }}
      >
        <div
          className="card mb-8 flex flex-col items-center px-10 py-12"
          style={{
            background: '#ffffff',
            border: '1px solid #e5e7eb',
            boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
            borderRadius: '8px',
            maxWidth: '420px',
            width: '100%',
          }}
        >
          {/* Icon */}
          <div
            className="mb-6 flex h-16 w-16 items-center justify-center rounded-full"
            style={{ background: '#eff6ff', border: '1px solid #bfdbfe' }}
          >
            <span className="text-3xl" role="img" aria-label="target">🎯</span>
          </div>

          <h2
            className="text-lg font-bold mb-2"
            style={{ color: '#111827' }}
          >
            Your vault is empty
          </h2>

          <p
            className="text-sm mb-8 leading-relaxed"
            style={{ color: '#6b7280', maxWidth: '300px' }}
          >
            Start by adding your first opportunity. Paste any scholarship, job,
            or program text and let AI extract the details.
          </p>

          <Link to="/add">
            <Button
              size="lg"
              style={{
                background: '#2563eb',
                color: '#ffffff',
                border: 'none',
                borderRadius: '6px',
                fontWeight: 600,
                padding: '10px 24px',
              }}
            >
              + Add your first opportunity
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  /* ── Main dashboard ───────────────────────────────────────────── */
  return (
    <div
      className="space-y-6 animate-fade-in"
      style={{ background: '#fafafa' }}
    >
      {/* ── Greeting header ── */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1
            className="text-2xl font-bold leading-tight"
            style={{ color: '#111827' }}
          >
            {getGreeting()},{' '}
            <span style={{ color: '#2563eb' }}>{displayName}</span> 👋
          </h1>
          <p
            className="mt-1 text-sm"
            style={{ color: '#6b7280' }}
          >
            Here's what's happening with your opportunities today.
          </p>
        </div>

        {/* Date badge */}
        <div
          className="hidden sm:flex items-center gap-2 text-xs shrink-0 px-3 py-1.5 rounded-full"
          style={{
            background: '#ffffff',
            border: '1px solid #e5e7eb',
            color: '#6b7280',
          }}
        >
          <svg
            className="h-3.5 w-3.5 shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            style={{ color: '#9ca3af' }}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          {today}
        </div>
      </div>

      {/* ── Stat cards ── */}
      <StatsRow
        total={stats.total}
        applied={stats.applied_count}
        urgent={stats.urgent_count}
        accepted={stats.accepted_count}
      />

      {/* ── Urgent items ── */}
      <UrgentSection
        items={stats.upcoming_deadlines.filter((o) => o.urgency.isUrgent)}
      />

      {/* ── Middle 3-column grid ── */}
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

      {/* ── Recently added table ── */}
      {recentOpps.length > 0 && <RecentlyAdded items={recentOpps} />}
    </div>
  );
}
