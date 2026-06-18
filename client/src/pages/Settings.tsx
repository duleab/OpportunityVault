import { useState, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { useOpportunityStore } from '../store/opportunityStore';
import { fetchOpportunities } from '../services/opportunityService';
import { NotificationSettings } from '../components/settings/NotificationSettings';
import { AIProviderSettings } from '../components/settings/AIProviderSettings';
import { ExportSettings } from '../components/settings/ExportSettings';

const tabs = ['Notifications', 'AI Provider', 'Export'] as const;
type Tab = (typeof tabs)[number];

export function Settings() {
  const [tab, setTab] = useState<Tab>('Notifications');
  const accessToken = useAuthStore((s) => s.accessToken);
  const setOpportunities = useOpportunityStore((s) => s.setOpportunities);

  useEffect(() => {
    if (!accessToken) return;
    fetchOpportunities(accessToken, { limit: 500 })
      .then((res) => setOpportunities(res.data))
      .catch(() => undefined);
  }, [accessToken, setOpportunities]);

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6 flex gap-2 border-b border-white/10">
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 text-sm font-medium ${
              tab === t ? 'border-b-2 border-accent text-accent' : 'text-gray-400 hover:text-white'
            }`}
          >
            {t}
          </button>
        ))}
      </div>
      {tab === 'Notifications' && <NotificationSettings />}
      {tab === 'AI Provider' && <AIProviderSettings />}
      {tab === 'Export' && <ExportSettings />}
    </div>
  );
}
