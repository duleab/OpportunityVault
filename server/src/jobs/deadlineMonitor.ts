import cron from 'node-cron';
import { runDeadlineMonitor, sendWeeklySummary } from '../services/deadline.service.js';

export function startDeadlineMonitor(): void {
  cron.schedule('0 9 * * *', async () => {
    console.log('[cron] Running daily deadline monitor');
    try {
      await runDeadlineMonitor();
    } catch (err) {
      console.error('[cron] Deadline monitor failed:', err);
    }
  });

  cron.schedule('0 9 * * 0', async () => {
    console.log('[cron] Running weekly summary');
    try {
      await sendWeeklySummary();
    } catch (err) {
      console.error('[cron] Weekly summary failed:', err);
    }
  });

  console.log('Deadline monitor scheduled: daily 9:00 UTC, weekly Sunday 9:00 UTC');
}
