import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import {
  LayoutDashboard, Briefcase, Plus, Settings, LogOut,
  Search, AlertCircle, Calendar, FileText, CheckCircle, XCircle,
  Moon, Sun
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useOpportunityStore } from '../../store/opportunityStore';
import { useSettingsStore } from '../../store/settingsStore';

const navLinks = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/opportunities', icon: Briefcase, label: 'Opportunities' },
  { to: '/add', icon: Plus, label: 'Add Opportunity' },
  { to: '/settings', icon: Settings, label: 'Settings' },
];

function getInitials(name?: string | null, email?: string | null): string {
  if (name) return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  if (email) return email[0].toUpperCase();
  return 'U';
}

export function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const logout = useAuthStore((s) => s.logout);
  const user = useAuthStore((s) => s.user);
  const opportunities = useOpportunityStore((s) => s.opportunities);
  const [search, setSearch] = useState('');

  const urgentCount = opportunities.filter(o => o.urgency?.isUrgent).length;
  const totalCount = opportunities.length;
  const appliedCount = opportunities.filter(o => o.status === 'APPLIED').length;
  const acceptedCount = opportunities.filter(o => o.status === 'ACCEPTED').length;
  const rejectedCount = opportunities.filter(o => o.status === 'REJECTED').length;
  const dueThisWeek = opportunities.filter(o => {
    if (!o.deadline) return false;
    const days = o.urgency?.daysLeft ?? null;
    return days !== null && days >= 0 && days <= 7;
  }).length;

  const quickFilters = [
    { label: 'Urgent', icon: AlertCircle, color: 'text-red-400', dot: 'bg-red-400', count: urgentCount, href: '/opportunities?urgency=high' },
    { label: 'Due This Week', icon: Calendar, color: 'text-amber-400', dot: 'bg-amber-400', count: dueThisWeek, href: '/opportunities?urgency=medium' },
    { label: 'Applications', icon: FileText, color: 'text-blue-400', dot: 'bg-blue-400', count: appliedCount, href: '/opportunities?status=APPLIED' },
    { label: 'Accepted', icon: CheckCircle, color: 'text-green-400', dot: 'bg-green-400', count: acceptedCount, href: '/opportunities?status=ACCEPTED' },
    { label: 'Rejected', icon: XCircle, color: 'text-gray-400', dot: 'bg-gray-400', count: rejectedCount, href: '/opportunities?status=REJECTED' },
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <aside className="hidden w-60 flex-shrink-0 flex-col bg-sidebar-bg border-r border-white/[0.06] md:flex">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-5 py-4 border-b border-white/[0.06]">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-white font-bold text-sm shadow-glow">
          OV
        </div>
        <span className="font-semibold text-white text-sm tracking-tight">OpportunityVault</span>
      </div>

      {/* Search */}
      <div className="px-3 pt-3 pb-2">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-500" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search opportunities..."
            className="w-full rounded-lg bg-surface-2 border border-white/[0.07] py-2 pl-8 pr-10 text-xs text-gray-300 placeholder-gray-600 focus:outline-none focus:border-accent/40 transition"
          />
          <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-gray-600 bg-surface-3 px-1.5 py-0.5 rounded border border-white/[0.06]">⌘/</span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-2 py-2 space-y-0.5">
        {navLinks.map(({ to, icon: Icon, label }) => {
          const active = location.pathname === to || (to !== '/dashboard' && location.pathname.startsWith(to));
          const count = to === '/opportunities' ? totalCount : undefined;
          return (
            <Link
              key={to}
              to={to}
              className={`sidebar-link ${active ? 'active' : ''}`}
            >
              <Icon className="h-4 w-4 flex-shrink-0" />
              <span className="flex-1">{label}</span>
              {count !== undefined && count > 0 && (
                <span className="rounded-full bg-surface-3 px-2 py-0.5 text-[11px] text-gray-400">{count}</span>
              )}
            </Link>
          );
        })}

        {/* Quick Filters */}
        <div className="pt-4 pb-1 px-2">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-600">Quick Filters</p>
        </div>
        {quickFilters.map(({ label, dot, count, href }) => (
          <Link key={label} to={href} className="sidebar-link">
            <span className={`h-2 w-2 flex-shrink-0 rounded-full ${dot}`} />
            <span className="flex-1 text-xs">{label}</span>
            <span className="rounded-full bg-surface-3 px-2 py-0.5 text-[11px] text-gray-400">{count}</span>
          </Link>
        ))}
      </nav>

      {/* Theme Toggle */}
      <div className="px-5 mt-auto pb-4">
        <button
          onClick={() => useSettingsStore.getState().toggleTheme()}
          className="flex w-full items-center justify-between rounded-lg bg-surface-2 p-1 border border-white/[0.06]"
        >
          <div className={`flex w-1/2 items-center justify-center gap-1.5 rounded-md py-1.5 transition ${useSettingsStore((s) => s.theme) === 'dark' ? 'bg-surface-3 shadow-sm text-white' : 'text-gray-500 hover:text-white'}`}>
            <Moon className="h-3.5 w-3.5" />
            <span className="text-[10px] font-medium">Dark</span>
          </div>
          <div className={`flex w-1/2 items-center justify-center gap-1.5 rounded-md py-1.5 transition ${useSettingsStore((s) => s.theme) === 'light' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-white'}`}>
            <Sun className="h-3.5 w-3.5" />
            <span className="text-[10px] font-medium">Light</span>
          </div>
        </button>
      </div>

      {/* User Profile */}
      <div className="border-t border-white/[0.06] p-3">
        <div className="flex items-center gap-3 rounded-lg px-2 py-2">
          <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-accent to-violet-500 text-white text-xs font-semibold">
            {getInitials(user?.name, user?.email)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-white truncate">{user?.name ?? user?.email?.split('@')[0] ?? 'User'}</p>
            <p className="text-[10px] text-accent truncate">Premium Plan</p>
          </div>
          <button
            onClick={handleLogout}
            title="Log out"
            className="rounded-lg p-1.5 text-gray-500 hover:text-red-400 hover:bg-red-400/10 transition"
          >
            <LogOut className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
}
