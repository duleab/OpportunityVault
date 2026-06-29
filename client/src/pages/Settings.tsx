import { useState, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { useOpportunityStore } from '../store/opportunityStore';
import { fetchOpportunities } from '../services/opportunityService';
import { AccountSettings } from '../components/settings/AccountSettings';
import { NotificationSettings } from '../components/settings/NotificationSettings';
import { AIProviderSettings } from '../components/settings/AIProviderSettings';
import { ExportSettings } from '../components/settings/ExportSettings';

const tabs = ['Account', 'Notifications', 'AI Provider', 'Export'] as const;
type Tab = (typeof tabs)[number];

export function Settings() {
  const [tab, setTab] = useState<Tab>('Account');
  const accessToken = useAuthStore((s) => s.accessToken);
  const setOpportunities = useOpportunityStore((s) => s.setOpportunities);

  // Only fetch opportunities when the Export tab is active
  useEffect(() => {
    if (tab !== 'Export' || !accessToken) return;
    fetchOpportunities(accessToken, { limit: 500 })
      .then((res) => setOpportunities(res.data))
      .catch(() => undefined);
  }, [tab, accessToken, setOpportunities]);

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <div className="mx-auto max-w-3xl px-4 py-8">
        {/* Page header */}
        <div className="mb-6">
          <h1 className="text-xl font-semibold text-[#111827]">Settings</h1>
          <p className="mt-1 text-sm text-[#6b7280]">Manage your account and application preferences.</p>
        </div>

        {/* Tab bar */}
        <div className="mb-6 flex gap-0 border-b border-[#e5e7eb]">
          {tabs.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2.5 text-sm font-medium transition-colors duration-150 ${
                tab === t
                  ? 'border-b-2 border-[#2563eb] text-[#2563eb]'
                  : 'border-b-2 border-transparent text-[#6b7280] hover:text-[#111827]'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className="card p-6">
          {tab === 'Account'       && <AccountSettings />}
          {tab === 'Notifications' && <NotificationSettings />}
          {tab === 'AI Provider'   && <AIProviderSettings />}
          {tab === 'Export'        && <ExportSettings />}
        </div>
      </div>
    </div>
  );
}
