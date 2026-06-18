import { differenceInDays } from 'date-fns';
import { parseJsonArray, prisma } from '../lib/prisma.js';
import {
  buildDeadlineMessage,
  markNotified,
  sendNotification,
  sendWeeklySummary,
} from './notification.service.js';

export async function runDeadlineMonitor(): Promise<void> {
  const now = new Date();
  const allActive = await prisma.opportunity.findMany({
    where: {
      status: { in: ['SAVED', 'PLANNING', 'IN_PROGRESS'] },
      deadline: { not: null, gte: now },
    },
    include: { user: true },
  });

  for (const opp of allActive) {
    if (!opp.deadline) continue;
    const daysLeft = differenceInDays(opp.deadline, now);
    const user = opp.user;

    if (!user.ntfyEnabled || !user.ntfyTopic) continue;

    const notifyDays = parseJsonArray<number>(user.notifyDaysBefore);
    const shouldNotify = notifyDays.includes(daysLeft);
    const alreadyNotified = parseJsonArray<number>(opp.notificationsSent).includes(daysLeft);

    if (shouldNotify && !alreadyNotified) {
      const priority = daysLeft <= 2 ? 'urgent' : daysLeft <= 7 ? 'high' : 'default';
      const title =
        daysLeft <= 2
          ? `🚨 URGENT: Apply TODAY — ${opp.name}`
          : daysLeft <= 7
            ? `⚠️ Deadline Soon: ${opp.name}`
            : `📅 Upcoming: ${opp.name}`;

      await sendNotification({
        topic: user.ntfyTopic,
        title,
        message: buildDeadlineMessage(opp, daysLeft),
        priority,
        tags: daysLeft <= 2 ? ['warning', 'rotating_light'] : ['warning', 'calendar'],
        clickUrl: opp.applicationLink ?? undefined,
        serverUrl: user.ntfyServerUrl,
      });

      const urgencyLevel = daysLeft <= 2 ? 'critical' : daysLeft <= 7 ? 'high' : 'medium';
      await markNotified(opp.id, daysLeft, urgencyLevel);
    }
  }

  await prisma.opportunity.updateMany({
    where: {
      deadline: { lt: now },
      status: { in: ['SAVED', 'PLANNING'] },
    },
    data: { status: 'EXPIRED' },
  });
}

export { sendWeeklySummary };
