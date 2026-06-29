import { Link, useNavigate } from 'react-router-dom';
import { Plus, Menu, Bell, Search } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useSettingsStore } from '../../store/settingsStore';

interface TopBarProps {
  onMenuClick?: () => void;
}

function getInitials(name?: string | null, email?: string | null): string {
  if (name) return name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase();
  if (email) return email[0].toUpperCase();
  return 'U';
}

const AI_LABEL: Record<string, string> = {
  groq:    'Groq',
  gemini:  'Gemini',
  mistral: 'Mistral',
  ollama:  'Ollama',
  zhipu:   'GLM (Z.ai)',
};

export function TopBar({ onMenuClick }: TopBarProps) {
  const user = useAuthStore((s) => s.user);
  const navigate = useNavigate();
  const aiProvider = useSettingsStore((s) => s.aiProvider);

  return (
    <header className="flex items-center gap-3 border-b border-[#e5e7eb] bg-white px-4 py-3">
      {/* Mobile menu button */}
      <button
        onClick={onMenuClick}
        className="rounded p-2 text-[#9ca3af] hover:bg-[#f3f4f6] hover:text-[#374151] md:hidden flex-shrink-0 transition-colors"
      >
        <Menu className="h-4 w-4" />
      </button>

      {/* Mobile logo */}
      <div className="flex items-center gap-2 md:hidden">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent text-white font-bold text-xs">OV</div>
        <span className="font-semibold text-[#111827] text-sm">OpportunityVault</span>
      </div>

      {/* Search bar */}
      <div className="flex-1 max-w-xl mx-auto hidden sm:block">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9ca3af]" />
          <input
            placeholder="Search opportunities…"
            className="w-full rounded border border-[#e5e7eb] bg-[#f9fafb] py-2 pl-10 pr-4 text-sm text-[#374151] placeholder-[#9ca3af] focus:outline-none focus:border-accent focus:ring-2 focus:ring-[#bfdbfe] transition-colors"
            onFocus={() => navigate('/opportunities')}
            readOnly
          />
        </div>
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-2 ml-auto">
        {/* Add button */}
        <Link to="/add">
          <button className="flex items-center gap-1.5 rounded bg-accent px-3.5 py-2 text-xs font-semibold text-white hover:bg-accent-hover transition-colors">
            <Plus className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">New</span>
          </button>
        </Link>

        {/* Notification bell */}
        <button className="relative rounded p-2 text-[#9ca3af] hover:bg-[#f3f4f6] hover:text-[#374151] transition-colors">
          <Bell className="h-4 w-4" />
        </button>

        {/* AI Provider badge */}
        <div className="hidden sm:flex items-center gap-1.5 rounded border border-[#e5e7eb] bg-[#f9fafb] px-3 py-1.5 text-xs text-[#6b7280]">
          <span className="h-1.5 w-1.5 rounded-full bg-[#059669]" />
          {AI_LABEL[aiProvider] ?? aiProvider}
        </div>

        {/* User avatar */}
        <div className="flex items-center gap-2 rounded border border-[#e5e7eb] bg-[#f9fafb] px-2 py-1.5 cursor-pointer hover:bg-[#f3f4f6] transition-colors">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-accent text-white text-[10px] font-semibold">
            {getInitials(user?.name, user?.email)}
          </div>
          <div className="hidden sm:block">
            <p className="text-xs font-medium text-[#111827] leading-none">
              {user?.name ?? user?.email?.split('@')[0] ?? 'User'}
            </p>
            <p className="text-[10px] text-[#9ca3af] mt-0.5 leading-none">{user?.email}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
