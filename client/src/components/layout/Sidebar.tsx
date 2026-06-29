import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Briefcase, Plus, Settings, LogOut,
  AlertCircle, Calendar, FileText, CheckCircle, XCircle,
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useOpportunityStore } from '../../store/opportunityStore';

const navLinks = [
  { to: '/dashboard',     icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/opportunities', icon: Briefcase,        label: 'Opportunities' },
  { to: '/add',           icon: Plus,             label: 'Add Opportunity' },
  { to: '/settings',      icon: Settings,         label: 'Settings' },
];

function getInitials(name?: string | null, email?: string | null): string {
  if (name) return name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase();
  if (email) return email[0].toUpperCase();
  return 'U';
}

export function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const logout = useAuthStore((s) => s.logout);
  const user = useAuthStore((s) => s.user);
  const opportunities = useOpportunityStore((s) => s.opportunities);

  const urgentCount  = opportunities.filter((o) => o.urgency?.isUrgent).length;
  const totalCount   = opportunities.length;
  const appliedCount = opportunities.filter((o) => o.status === 'APPLIED').length;
  const acceptedCount = opportunities.filter((o) => o.status === 'ACCEPTED').length;
  const rejectedCount = opportunities.filter((o) => o.status === 'REJECTED').length;
  const dueThisWeek  = opportunities.filter((o) => {
    const days = o.urgency?.daysLeft ?? null;
    return days !== null && days >= 0 && days <= 7;
  }).length;

  const quickFilters = [
    { label: 'Urgent',        dot: 'bg-[#dc2626]', count: urgentCount,  href: '/opportunities?urgency=high',    icon: AlertCircle },
    { label: 'Due This Week', dot: 'bg-[#d97706]', count: dueThisWeek,  href: '/opportunities?urgency=medium',  icon: Calendar },
    { label: 'Applications',  dot: 'bg-[#2563eb]', count: appliedCount, href: '/opportunities?status=APPLIED',  icon: FileText },
    { label: 'Accepted',      dot: 'bg-[#059669]', count: acceptedCount,href: '/opportunities?status=ACCEPTED', icon: CheckCircle },
    { label: 'Rejected',      dot: 'bg-[#9ca3af]', count: rejectedCount,href: '/opportunities?status=REJECTED', icon: XCircle },
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <aside className="hidden w-60 flex-shrink-0 flex-col bg-white border-r border-[#e5e7eb] md:flex">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-5 py-4 border-b border-[#e5e7eb]">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-white font-bold text-sm">
          OV
        </div>
        <span className="font-semibold text-[#111827] text-sm tracking-tight">OpportunityVault</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-0.5">
        {navLinks.map(({ to, icon: Icon, label }) => {
          const active =
            location.pathname === to ||
            (to !== '/dashboard' && location.pathname.startsWith(to));
          const count = to === '/opportunities' ? totalCount : undefined;
          return (
            <Link key={to} to={to} className={`sidebar-link ${active ? 'active' : ''}`}>
              <Icon className="h-4 w-4 flex-shrink-0" />
              <span className="flex-1">{label}</span>
              {count !== undefined && count > 0 && (
                <span className="rounded bg-[#f3f4f6] px-2 py-0.5 text-xs font-medium text-[#6b7280] border border-[#e5e7eb]">
                  {count}
                </span>
              )}
            </Link>
          );
        })}

        {/* Quick Filters */}
        <div className="pt-5 pb-1.5 px-1">
          <p className="label">Quick Filters</p>
        </div>
        {quickFilters.map(({ label, dot, count, href }) => (
          <Link key={label} to={href} className="sidebar-link">
            <span className={`h-2 w-2 flex-shrink-0 rounded-full ${dot}`} />
            <span className="flex-1 text-xs">{label}</span>
            <span className="rounded bg-[#f3f4f6] px-2 py-0.5 text-xs font-medium text-[#6b7280] border border-[#e5e7eb]">
              {count}
            </span>
          </Link>
        ))}
      </nav>

      {/* User Profile */}
      <div className="border-t border-[#e5e7eb] p-3">
        <div className="flex items-center gap-3 rounded-lg px-2 py-2 hover:bg-[#f9fafb] transition-colors">
          {/* Avatar */}
          <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-accent text-white text-xs font-semibold">
            {getInitials(user?.name, user?.email)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-[#111827] truncate">
              {user?.name ?? user?.email?.split('@')[0] ?? 'User'}
            </p>
            <p className="text-[11px] text-[#9ca3af] truncate">{user?.email}</p>
          </div>
          <button
            onClick={handleLogout}
            title="Log out"
            className="rounded p-1.5 text-[#9ca3af] hover:text-[#dc2626] hover:bg-[#fef2f2] transition-colors"
          >
            <LogOut className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
}
