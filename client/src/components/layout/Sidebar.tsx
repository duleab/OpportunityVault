import { Link, useLocation } from 'react-router-dom';
import { Archive, LayoutDashboard, List, PlusCircle, Settings, LogOut,
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

const links = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/opportunities', icon: List, label: 'Opportunities' },
  { to: '/add', icon: PlusCircle, label: 'Add' },
  { to: '/settings', icon: Settings, label: 'Settings' },
];

export function Sidebar() {
  const location = useLocation();
  const logout = useAuthStore((s) => s.logout);

  return (
    <aside className="hidden w-64 flex-shrink-0 flex-col border-r border-white/5 bg-surface md:flex">
      <div className="flex items-center gap-2 border-b border-white/5 px-6 py-5">
        <Archive className="h-7 w-7 text-accent" />
        <span className="font-display text-lg font-bold text-white">OpportunityVault</span>
      </div>
      <nav className="flex-1 space-y-1 p-4">
        {links.map(({ to, icon: Icon, label }) => {
          const active = location.pathname.startsWith(to);
          return (
            <Link
              key={to}
              to={to}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                active ? 'bg-accent/20 text-accent' : 'text-gray-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <Icon className="h-5 w-5" />
              {label}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-white/5 p-4">
        <button
          onClick={() => logout()}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-gray-400 hover:bg-white/5 hover:text-white"
        >
          <LogOut className="h-5 w-5" />
          Log out
        </button>
      </div>
    </aside>
  );
}
