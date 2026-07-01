import axios from 'axios';
import { format } from 'date-fns';
import { env } from '../config/env.js';
import { parseJsonArray, prisma, stringifyJsonArray } from '../lib/prisma.js';
import type { Opportunity } from '@prisma/client';
import { serializeOpportunity } from '../utils/serializeOpportunity.js';

export type NotificationPriority = 'min' | 'low' | 'default' | 'high' | 'urgent';

export interface SendNotificationParams {
  topic: string;
  title: string;
  message: string;
  priority: NotificationPriority;
  tags: string[];
  clickUrl?: string;
  serverUrl?: string;
}

export async function sendNotification(params: SendNotificationParams): Promise<void> {
  const server = params.serverUrl || env.ntfyDefaultServer;
  try {
    await axios.post(`${server}/${params.topic}`, params.message, {
      headers: {
        Title: params.title,
        Priority: params.priority,
        Tags: params.tags.join(','),
        Click: params.clickUrl || '',
        'Content-Type': 'text/plain',
      },
      timeout: 10000,
    });
  } catch (err) {
    console.warn('⚠️ Non-fatal: Failed to send ntfy notification:', err instanceof Error ? err.message : err);
  }
}

export function buildDeadlineMessage(opp: Opportunity, daysLeft: number): string {
  const deadline = opp.deadline ? format(opp.deadline, 'MMM d, yyyy') : 'Unknown';
  const link = opp.applicationLink ?? 'No link available';
  return `${opp.name}\nDeadline: ${deadline} (${daysLeft} days left!)\nApply: ${link}`;
}

export async function notifyNewOpportunity(userId: string, opp: Opportunity): Promise<void> {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user?.ntfyEnabled || !user.ntfyTopic) return;

  const countries = parseJsonArray<string>(opp.countries).join(', ') || 'N/A';
  const deadline = opp.deadline ? format(opp.deadline, 'MMM d, yyyy') : 'No deadline';

  await sendNotification({
    topic: user.ntfyTopic,
    title: `✅ Opportunity Saved: ${opp.name}`,
    message: `Type: ${opp.type} | Deadline: ${deadline} | ${countries}`,
    priority: 'low',
    tags: ['white_check_mark'],
    serverUrl: user.ntfyServerUrl,
  });
}

export async function notifyStatusChange(userId: string, opp: Opportunity, newStatus: string): Promise<void> {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user?.ntfyEnabled || !user.ntfyTopic) return;

  const configs: Record<string, { title: string; priority: NotificationPriority }> = {
    APPLIED: { title: `🎯 Application Submitted: ${opp.name}`, priority: 'high' },
    ACCEPTED: { title: `🎉 ACCEPTED! ${opp.name}`, priority: 'urgent' },
    REJECTED: { title: `❌ Not selected: ${opp.name}`, priority: 'default' },
  };

  const config = configs[newStatus];
  if (!config) return;

  await sendNotification({
    topic: user.ntfyTopic,
    title: config.title,
    message: `Status updated to ${newStatus}`,
    priority: config.priority,
    tags: ['information_source'],
    clickUrl: opp.applicationLink ?? undefined,
    serverUrl: user.ntfyServerUrl,
  });
}

export async function sendWeeklySummary(): Promise<void> {
  const users = await prisma.user.findMany({ where: { ntfyEnabled: true, ntfyTopic: { not: null } } });
  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  for (const user of users) {
    if (!user.ntfyTopic) continue;

    const opportunities = await prisma.opportunity.findMany({ where: { userId: user.id } });
    const serialized = opportunities.map(serializeOpportunity);

    const savedThisWeek = opportunities.filter((o) => o.createdAt >= weekAgo).length;
    const appliedThisWeek = opportunities.filter(
      (o) => o.status === 'APPLIED' && o.appliedAt && o.appliedAt >= weekAgo
    ).length;
    const deadlinesThisWeek = serialized.filter(
      (o) => o.urgency.daysLeft !== null && o.urgency.daysLeft >= 0 && o.urgency.daysLeft <= 7
    ).length;
    const urgentCount = serialized.filter((o) => o.urgency.isUrgent).length;

    const upcoming = serialized
      .filter((o) => o.deadline && o.urgency.daysLeft !== null && o.urgency.daysLeft >= 0)
      .sort((a, b) => new Date(a.deadline!).getTime() - new Date(b.deadline!).getTime())
      .slice(0, 5);

    const deadlineList = upcoming
      .map((o) => `• ${o.name} — ${o.deadline ? format(new Date(o.deadline), 'MMM d') : 'TBD'}`)
      .join('\n');

    const message = `This week:
• ${savedThisWeek} opportunities saved
• ${appliedThisWeek} applications submitted
• ${deadlinesThisWeek} deadlines this week
• ${urgentCount} urgent (≤7 days)

Upcoming deadlines:
${deadlineList || 'None'}`;

    await sendNotification({
      topic: user.ntfyTopic,
      title: '📊 Your Weekly Opportunity Summary',
      message,
      priority: 'default',
      tags: ['bar_chart'],
      serverUrl: user.ntfyServerUrl,
    });
  }
}

export async function sendTestNotification(topic: string, serverUrl?: string): Promise<void> {
  await sendNotification({
    topic,
    title: 'OpportunityVault Test',
    message: 'Notifications are working! You will receive deadline alerts here.',
    priority: 'default',
    tags: ['white_check_mark', 'bell'],
    serverUrl: serverUrl ?? env.ntfyDefaultServer,
  });
}

export async function markNotified(oppId: string, daysLeft: number, urgencyLevel: string): Promise<void> {
  const opp = await prisma.opportunity.findUnique({ where: { id: oppId } });
  if (!opp) return;

  const sent = parseJsonArray<number>(opp.notificationsSent);
  if (!sent.includes(daysLeft)) sent.push(daysLeft);

  await prisma.opportunity.update({
    where: { id: oppId },
    data: {
      notificationsSent: stringifyJsonArray(sent),
      lastNotifiedAt: new Date(),
      isUrgent: daysLeft <= 7,
      urgencyLevel,
    },
  });
}
