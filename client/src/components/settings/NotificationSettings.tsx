import { useState } from 'react';
import toast from 'react-hot-toast';
import { useAuthStore } from '../../store/authStore';
import { patchNotificationSettings, testNotification } from '../../services/notificationService';
import { Button } from '../ui/Button';

const NOTIFY_OPTIONS = [1, 3, 7, 30];
const NTFY_SERVER_URL = 'https://ntfy.sh';

export function NotificationSettings() {
  const { user, accessToken, updateUser } = useAuthStore();
  const [topic, setTopic] = useState(user?.ntfyTopic ?? '');
  const [enabled, setEnabled] = useState(user?.ntfyEnabled ?? true);
  const [days, setDays] = useState<number[]>(user?.notifyDaysBefore ?? [1, 3, 7]);
  const [saving, setSaving] = useState(false);

  const toggleDay = (d: number) => {
    setDays((prev) => (prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d].sort((a, b) => a - b)));
  };

  const save = async () => {
    if (!accessToken) return;
    setSaving(true);
    try {
      const res = await patchNotificationSettings(accessToken, {
        ntfyTopic: topic,
        ntfyEnabled: enabled,
        ntfyServerUrl: NTFY_SERVER_URL,
        notifyDaysBefore: days,
      });
      updateUser(res.settings);
      toast.success('Notification settings saved');
    } catch {
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const test = async () => {
    if (!accessToken || !topic) return toast.error('Enter a topic first');
    try {
      await testNotification(accessToken, topic, NTFY_SERVER_URL);
      toast.success('Test notification sent!');
    } catch {
      toast.error('Test failed — check topic name');
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <label className="block">
          <span className="mb-1 block text-sm text-gray-400">ntfy Topic</span>
          <div className="flex gap-2">
            <input
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="opportunityvault-yourname"
              className="flex-1 rounded-lg border border-white/10 bg-base px-3 py-2 text-sm text-white"
            />
            <Button variant="secondary" onClick={test}>Test →</Button>
          </div>
        </label>
        <div className="block">
          <span className="mb-1 block text-sm text-gray-400">Server URL</span>
          <div className="w-full rounded-lg border border-white/10 bg-base px-3 py-2 text-sm text-gray-400">
            {NTFY_SERVER_URL}
          </div>
        </div>
      </div>

      <div>
        <span className="mb-2 block text-sm text-gray-400">Notify me</span>
        <div className="flex flex-wrap gap-2">
          {NOTIFY_OPTIONS.map((d) => (
            <button
              key={d}
              onClick={() => toggleDay(d)}
              className={`rounded-lg px-3 py-1.5 text-sm ${
                days.includes(d) ? 'bg-accent text-white' : 'border border-white/10 text-gray-400'
              }`}
            >
              {d} day{d !== 1 ? 's' : ''}
            </button>
          ))}
        </div>
      </div>

      <label className="flex items-center gap-3">
        <input type="checkbox" checked={enabled} onChange={(e) => setEnabled(e.target.checked)} className="rounded" />
        <span className="text-sm text-gray-300">Enable notifications</span>
      </label>

      <Button onClick={save} disabled={saving}>{saving ? 'Saving...' : 'Save Settings'}</Button>

      <div className="rounded-lg border border-white/10 bg-base/50 p-4 text-sm text-gray-400">
        <h4 className="mb-2 font-medium text-white">Setup Guide</h4>
        <ol className="list-decimal space-y-1 pl-5">
          <li>Install ntfy app (Android/iOS)</li>
          <li>Open app → tap + → subscribe to your topic</li>
          <li>Enter topic: <code className="font-mono text-accent">opportunityvault-yourname</code></li>
          <li>Paste same topic above and click Test</li>
        </ol>
        <p className="mt-4 text-xs">For security, the hosted app sends notifications only through https://ntfy.sh.</p>
      </div>
    </div>
  );
}
