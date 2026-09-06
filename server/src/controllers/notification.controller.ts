import type { Response } from 'express';
import { AppError, asyncHandler } from '../middleware/errorHandler.js';
import type { AuthRequest } from '../middleware/auth.middleware.js';
import { getExtractor, postProcessExtraction } from '../services/extraction.service.js';
import { sendTestNotification } from '../services/notification.service.js';
import { updateUserSettings, serializeUser } from '../services/auth.service.js';
import { prisma } from '../lib/prisma.js';
import { decryptSecretRecord } from '../utils/secretCrypto.js';
import { normalizeNotificationServerUrl } from '../utils/notificationUrl.js';
import { env } from '../config/env.js';
import { getProviderTestError } from '../utils/providerTestError.js';

const PROVIDER_LABELS: Record<string, string> = {
  groq: 'Groq', zhipu: 'Z.ai', gemini: 'Gemini', mistral: 'Mistral', ollama: 'Ollama',
};

const SERVER_API_KEYS: Record<string, string> = {
  groq: env.groqApiKey, zhipu: env.zhipuApiKey, gemini: env.geminiApiKey, mistral: env.mistralApiKey,
};

export const testNotification = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { topic, serverUrl } = req.body as { topic?: string; serverUrl?: string };
  if (!topic) throw new AppError(400, 'topic is required');
  await sendTestNotification(topic, normalizeNotificationServerUrl(serverUrl ?? env.ntfyDefaultServer));
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
    ntfyServerUrl: ntfyServerUrl ? normalizeNotificationServerUrl(ntfyServerUrl) : undefined,
  });
  res.json({ settings });
});

export const getSettings = asyncHandler(async (req: AuthRequest, res: Response) => {
  const user = await prisma.user.findUnique({ where: { id: req.user!.userId } });
  if (!user) throw new AppError(404, 'User not found');
  res.json({ settings: serializeUser(user) });
});

export const patchSettings = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { aiProvider, ntfyTopic, ntfyEnabled, ntfyServerUrl, notifyDaysBefore, name, apiKeys } = req.body as {
    aiProvider?: string;
    ntfyTopic?: string;
    ntfyEnabled?: boolean;
    ntfyServerUrl?: string;
    notifyDaysBefore?: number[];
    name?: string;
    apiKeys?: Record<string, string>;
  };

  const settings = await updateUserSettings(req.user!.userId, {
    aiProvider,
    ntfyTopic,
    ntfyEnabled,
    ntfyServerUrl: ntfyServerUrl ? normalizeNotificationServerUrl(ntfyServerUrl) : undefined,
    notifyDaysBefore,
    name,
    apiKeys,
  });
  res.json({ settings });
});

export const testExtraction = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { rawText, provider } = req.body as { rawText?: string; provider?: string };
  const text = rawText ?? 'Sample scholarship: Gates Scholarship for undergraduate students. Deadline March 15, 2026. Fully funded. Apply at https://example.com/apply';
  
  const user = await prisma.user.findUnique({ where: { id: req.user!.userId } });
  let userApiKeys: Record<string, string> = {};
  if (user?.apiKeys) {
    try {
      userApiKeys = decryptSecretRecord(user.apiKeys, env.jwtRefreshSecret);
    } catch {
      // Ignore
    }
  }

  const providerName = provider ?? user?.aiProvider ?? env.aiProvider;
  const extractor = getExtractor(providerName);
  if (!extractor) throw new AppError(400, 'Unsupported AI provider');

  const providerLabel = PROVIDER_LABELS[providerName] ?? providerName;
  const userApiKey = userApiKeys[providerName];
  if (providerName !== 'ollama' && !userApiKey && !SERVER_API_KEYS[providerName]) {
    throw new AppError(400, `No API key is configured for ${providerLabel}. Enter a key, then test again.`);
  }

  try {
    const extracted = await extractor.extract(text, { userApiKey });
    const processed = extracted.map((item) => postProcessExtraction(item, text));
    res.json({
      extractions: processed.map((item) => item.extracted),
      provider: providerName,
      lowConfidenceFieldsList: processed.map((item) => item.lowConfidenceFields),
      warnings: processed.map((item) => item.warning),
    });
  } catch (error) {
    const failure = getProviderTestError(providerLabel, error);
    throw new AppError(failure.statusCode, failure.message);
  }
});
