import { useState } from 'react';
import toast from 'react-hot-toast';
import { useAuthStore } from '../../store/authStore';
import { useOpportunityStore } from '../../store/opportunityStore';
import { exportFromServer } from '../../services/opportunityService';
import { exportToCsvFile, exportToJson } from '../../utils/exportUtils';
import { Button } from '../ui/Button';

export function ExportSettings() {
  const accessToken = useAuthStore((s) => s.accessToken);
  const opportunities = useOpportunityStore((s) => s.opportunities);
  const [notionToken, setNotionToken] = useState('');
  const [databaseId, setDatabaseId] = useState('');
  const [syncing, setSyncing] = useState(false);

  const download = async (format: 'csv' | 'json') => {
    if (accessToken) {
      try {
        const blob = (await exportFromServer(accessToken, format)) as Blob;
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `opportunities.${format}`;
        a.click();
        URL.revokeObjectURL(url);
        toast.success(`Exported as ${format.toUpperCase()}`);
        return;
      } catch {
        /* fallback to client */
      }
    }
    if (format === 'csv') exportToCsvFile(opportunities);
    else exportToJson(opportunities);
    toast.success(`Exported as ${format.toUpperCase()}`);
  };

  const syncNotion = async () => {
    if (!accessToken || !notionToken || !databaseId) {
      toast.error('Enter Notion token and database ID');
      return;
    }
    setSyncing(true);
    try {
      const result = (await exportFromServer(accessToken, 'notion', notionToken, databaseId)) as {
        success: number;
        failed: number;
      };
      toast.success(`Notion sync: ${result.success} succeeded, ${result.failed} failed`);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Notion sync failed';
      toast.error(message);
    } finally {
      setSyncing(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3">
        <Button variant="secondary" onClick={() => download('csv')}>Export all as CSV</Button>
        <Button variant="secondary" onClick={() => download('json')}>Export all as JSON</Button>
      </div>
      <div className="rounded-lg border border-white/10 p-4">
        <h4 className="mb-3 font-medium text-white">Export to Notion</h4>
        <div className="grid gap-3 md:grid-cols-2">
          <input
            value={notionToken}
            onChange={(e) => setNotionToken(e.target.value)}
            placeholder="Notion Integration Token"
            className="rounded-lg border border-white/10 bg-base px-3 py-2 text-sm text-white"
          />
          <input
            value={databaseId}
            onChange={(e) => setDatabaseId(e.target.value)}
            placeholder="Database ID"
            className="rounded-lg border border-white/10 bg-base px-3 py-2 text-sm text-white"
          />
        </div>
        <Button className="mt-3" onClick={syncNotion} disabled={syncing}>
          {syncing ? 'Syncing...' : 'Sync to Notion'}
        </Button>
      </div>
    </div>
  );
}
