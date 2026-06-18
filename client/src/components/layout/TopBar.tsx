import { Link } from 'react-router-dom';
import { Plus, Menu } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { Button } from '../ui/Button';

interface TopBarProps {
  title: string;
  onMenuClick?: () => void;
}

export function TopBar({ title, onMenuClick }: TopBarProps) {
  const user = useAuthStore((s) => s.user);

  return (
    <header className="flex items-center justify-between border-b border-white/5 bg-base/80 px-4 py-4 backdrop-blur md:px-8">
      <div className="flex items-center gap-3">
        <button onClick={onMenuClick} className="rounded-lg p-2 hover:bg-white/5 md:hidden">
          <Menu className="h-5 w-5 text-gray-400" />
        </button>
        <h1 className="font-display text-xl font-semibold text-white md:text-2xl">{title}</h1>
      </div>
      <div className="flex items-center gap-3">
        <span className="hidden text-sm text-gray-400 sm:block">{user?.email}</span>
        <Link to="/add">
          <Button size="sm" className="hidden sm:inline-flex">
            <Plus className="h-4 w-4" />
            Add
          </Button>
        </Link>
      </div>
    </header>
  );
}
