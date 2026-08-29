import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { env } from '../config/env.js';
import { parseJsonArray, prisma, stringifyJsonArray } from '../lib/prisma.js';
import type { AuthUser, JwtPayload } from '../types/index.js';
import { decryptSecretRecord, encryptSecretRecord, getConfiguredSecrets } from '../utils/secretCrypto.js';

const SALT_ROUNDS = 12;

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function signAccessToken(payload: JwtPayload): string {
  return jwt.sign(payload, env.jwtAccessSecret, { expiresIn: env.jwtAccessExpires as jwt.SignOptions['expiresIn'] });
}

export function signRefreshToken(payload: JwtPayload): string {
  return jwt.sign(payload, env.jwtRefreshSecret, { expiresIn: env.jwtRefreshExpires as jwt.SignOptions['expiresIn'] });
}

export function verifyAccessToken(token: string): JwtPayload {
  return jwt.verify(token, env.jwtAccessSecret) as JwtPayload;
}

export function verifyRefreshToken(token: string): JwtPayload {
  return jwt.verify(token, env.jwtRefreshSecret) as JwtPayload;
}

export async function createRefreshToken(userId: string): Promise<string> {
  const token = crypto.randomBytes(40).toString('hex');
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  await prisma.refreshToken.create({
    data: { userId, token, expiresAt },
  });

  return token;
}

export async function revokeRefreshToken(token: string): Promise<void> {
  await prisma.refreshToken.deleteMany({ where: { token } });
}

export function serializeUser(user: {
  id: string;
  email: string;
  name: string | null;
  ntfyTopic: string | null;
  ntfyEnabled: boolean;
  ntfyServerUrl: string;
  aiProvider: string;
  apiKeys: string;
  notifyDaysBefore: string;
}): AuthUser {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    ntfyTopic: user.ntfyTopic,
    ntfyEnabled: user.ntfyEnabled,
    ntfyServerUrl: user.ntfyServerUrl,
    aiProvider: user.aiProvider,
    apiKeyConfigured: getConfiguredSecrets(decryptSecretRecord(user.apiKeys, env.jwtRefreshSecret)),
    notifyDaysBefore: parseJsonArray<number>(user.notifyDaysBefore),
  };
}

export async function registerUser(
  email: string,
  password: string,
  name?: string
): Promise<{ user: AuthUser; accessToken: string; refreshToken: string }> {
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) throw new Error('Email already registered');

  const passwordHash = await hashPassword(password);
  const user = await prisma.user.create({
    data: { email, passwordHash, name: name ?? null },
  });

  const payload: JwtPayload = { userId: user.id, email: user.email };
  const accessToken = signAccessToken(payload);
  const refreshToken = await createRefreshToken(user.id);

  return { user: serializeUser(user), accessToken, refreshToken };
}

export async function loginUser(
  email: string,
  password: string
): Promise<{ user: AuthUser; accessToken: string; refreshToken: string }> {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error('Invalid credentials');

  const valid = await verifyPassword(password, user.passwordHash);
  if (!valid) throw new Error('Invalid credentials');

  if (user.apiKeys && !user.apiKeys.startsWith('enc:v1:')) {
    user.apiKeys = encryptSecretRecord(
      decryptSecretRecord(user.apiKeys, env.jwtRefreshSecret),
      env.jwtRefreshSecret
    );
    await prisma.user.update({ where: { id: user.id }, data: { apiKeys: user.apiKeys } });
  }

  const payload: JwtPayload = { userId: user.id, email: user.email };
  const accessToken = signAccessToken(payload);
  const refreshToken = await createRefreshToken(user.id);

  return { user: serializeUser(user), accessToken, refreshToken };
}

export async function refreshAccessToken(
  refreshToken: string
): Promise<{ accessToken: string; refreshToken: string; user: AuthUser }> {
  const stored = await prisma.refreshToken.findUnique({
    where: { token: refreshToken },
    include: { user: true },
  });

  if (!stored || stored.expiresAt < new Date()) {
    throw new Error('Invalid refresh token');
  }

  await revokeRefreshToken(refreshToken);
  const payload: JwtPayload = { userId: stored.user.id, email: stored.user.email };
  const accessToken = signAccessToken(payload);
  const newRefreshToken = await createRefreshToken(stored.user.id);

  return {
    accessToken,
    refreshToken: newRefreshToken,
    user: serializeUser(stored.user),
  };
}

export async function updateUserSettings(
  userId: string,
  data: Partial<{
    aiProvider: string;
    ntfyTopic: string | null;
    ntfyEnabled: boolean;
    ntfyServerUrl: string;
    notifyDaysBefore: number[];
    name: string;
    apiKeys: Record<string, string>;
  }>
): Promise<AuthUser> {
  const updateData: Record<string, unknown> = { ...data };
  if (data.notifyDaysBefore) {
    updateData.notifyDaysBefore = stringifyJsonArray(data.notifyDaysBefore);
  }
  if (data.apiKeys) {
    const existing = await prisma.user.findUnique({ where: { id: userId }, select: { apiKeys: true } });
    const merged = {
      ...decryptSecretRecord(existing?.apiKeys ?? '{}', env.jwtRefreshSecret),
      ...data.apiKeys,
    };
    Object.keys(merged).forEach((provider) => {
      if (!merged[provider]?.trim()) delete merged[provider];
    });
    updateData.apiKeys = encryptSecretRecord(merged, env.jwtRefreshSecret);
  }

  const user = await prisma.user.update({
    where: { id: userId },
    data: updateData,
  });

  return serializeUser(user);
}
