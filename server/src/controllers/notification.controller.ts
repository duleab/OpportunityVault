import type { Response } from 'express';
import { AppError, asyncHandler } from '../middleware/errorHandler.js';
import type { AuthRequest } from '../middleware/auth.middleware.js';
import { extractWithFallback } from '../services/extraction.service.js';
import { sendTestNotification } from '../services/notification.service.js';
import { updateUserSettings, serializeUser } from '../services/auth.service.js';
import { prisma } from '../lib/prisma.js';

export const testNotification = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { topic, serverUrl } = req.body as { topic?: string; serverUrl?: string };
  if (!topic) throw new AppError(400, 'topic is required');
  await sendTestNotification(topic, serverUrl);
  res.json({ message: 'Test notification sent' });
});

export const getNotificationSettings = asyncHandler(async (req: AuthRequest, res: Response) => {
  const user = await prisma.user.findUnique({ where: { id: req.user!.userId } });
  if (!user) throw new AppError(404, 'User not found');
  res.json({ settings: serializeUser(user) });
});

export const patchNotificationSettings = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { ntfyTopic, ntfyEnabled, notifyDaysBefore, ntfyServerUrl } = req.body as {
    ntfyTopic?: string;
    ntfyEnabled?: boolean;
    notifyDaysBefore?: number[];
    ntfyServerUrl?: string;
  };

  const settings = await updateUserSettings(req.user!.userId, {
    ntfyTopic,
    ntfyEnabled,
    notifyDaysBefore,
    ntfyServerUrl,
  });
  res.json({ settings });
});

export const getSettings = asyncHandler(async (req: AuthRequest, res: Response) => {
  const user = await prisma.user.findUnique({ where: { id: req.user!.userId } });
  if (!user) throw new AppError(404, 'User not found');
  res.json({ settings: serializeUser(user) });
});

export const patchSettings = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { aiProvider, ntfyTopic, ntfyEnabled, ntfyServerUrl, notifyDaysBefore, name } = req.body as {
    aiProvider?: string;
    ntfyTopic?: string;
    ntfyEnabled?: boolean;
    ntfyServerUrl?: string;
    notifyDaysBefore?: number[];
    name?: string;
  };

  const settings = await updateUserSettings(req.user!.userId, {
    aiProvider,
    ntfyTopic,
    ntfyEnabled,
    ntfyServerUrl,
    notifyDaysBefore,
    name,
  });
  res.json({ settings });
});

export const testExtraction = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { rawText, provider } = req.body as { rawText?: string; provider?: string };
  const text = rawText ?? 'Sample scholarship: Gates Scholarship for undergraduate students. Deadline March 15, 2026. Fully funded. Apply at https://example.com/apply';
  const result = await extractWithFallback(text, provider);
  res.json(result);
});
