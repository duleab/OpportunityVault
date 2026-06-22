import { Link, useNavigate } from 'react-router-dom';
import { Plus, Menu, Bell, Search, ChevronDown } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

interface TopBarProps {
  title?: string;
  onMenuClick?: () => void;
}

function getInitials(name?: string | null, email?: string | null): string {
  if (name) return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  if (email) return email[0].toUpperCase();
  return 'U';
}

export function TopBar({ onMenuClick }: TopBarProps) {
  const user = useAuthStore((s) => s.user);
  const navigate = useNavigate();

  return (
    <header className="flex items-center gap-3 border-b border-white/[0.06] bg-sidebar-bg px-4 py-3">
      {/* Mobile menu */}
      <button onClick={onMenuClick} className="rounded-lg p-2 hover:bg-white/5 md:hidden flex-shrink-0">
        <Menu className="h-4 w-4 text-gray-400" />
      </button>

      {/* Mobile logo */}
      <div className="flex items-center gap-2 md:hidden">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent text-white font-bold text-xs">OV</div>
        <span className="font-semibold text-white text-sm">OpportunityVault</span>
      </div>

      {/* Search bar — center */}
      <div className="flex-1 max-w-xl mx-auto hidden sm:block">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
          <input
            placeholder="Search opportunities, organizations, or keywords..."
            className="w-full rounded-lg bg-surface-2 border border-white/[0.08] py-2 pl-10 pr-16 text-sm text-gray-300 placeholder-gray-600 focus:outline-none focus:border-accent/40 transition"
            onFocus={() => navigate('/opportunities')}
            readOnly
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-0.5 text-[11px] text-gray-600">
            <kbd className="bg-surface-3 border border-white/[0.06] rounded px-1.5 py-0.5">⌘</kbd>
            <kbd className="bg-surface-3 border border-white/[0.06] rounded px-1.5 py-0.5">K</kbd>
          </span>
        </div>
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-2 ml-auto">
        {/* Add button */}
        <Link to="/add">
          <button className="flex items-center gap-1.5 rounded-lg bg-accent px-3.5 py-2 text-xs font-semibold text-white hover:bg-accent-hover transition shadow-glow">
            <Plus className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">New Opportunity</span>
          </button>
        </Link>

        {/* Notification bell */}
        <button className="relative rounded-lg p-2 text-gray-400 hover:bg-white/5 hover:text-white transition">
          <Bell className="h-4 w-4" />
          <span className="absolute top-1 right-1 h-1.5 w-1.5 rounded-full bg-red-400" />
        </button>

        {/* AI Provider badge */}
        <div className="hidden sm:flex items-center gap-1.5 rounded-lg border border-white/[0.08] bg-surface-2 px-3 py-1.5 text-xs text-gray-300">
          <span className="h-1.5 w-1.5 rounded-full bg-green-400" />
          AI: Groq
        </div>

        {/* User avatar */}
        <div className="flex items-center gap-2 rounded-lg border border-white/[0.08] bg-surface-2 px-2 py-1.5 cursor-pointer hover:bg-surface-3 transition">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-accent to-violet-500 text-white text-[10px] font-semibold">
            {getInitials(user?.name, user?.email)}
          </div>
          <div className="hidden sm:block">
            <p className="text-xs font-medium text-white leading-none">{user?.name ?? user?.email?.split('@')[0] ?? 'User'}</p>
            <p className="text-[10px] text-gray-500 mt-0.5 leading-none">{user?.email}</p>
          </div>
          <ChevronDown className="hidden sm:block h-3 w-3 text-gray-500" />
        </div>
      </div>
    </header>
  );
}
