import type { Response } from 'express';
import { AppError, asyncHandler } from '../middleware/errorHandler.js';
import type { AuthRequest } from '../middleware/auth.middleware.js';
import {
  loginUser,
  refreshAccessToken,
  registerUser,
  revokeRefreshToken,
  updateUserSettings,
  verifyPassword,
  hashPassword,
} from '../services/auth.service.js';
import { prisma } from '../lib/prisma.js';

export const register = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { email, password, name } = req.body as { email?: string; password?: string; name?: string };
  if (!email || !password) throw new AppError(400, 'Email and password are required');
  if (password.length < 6) throw new AppError(400, 'Password must be at least 6 characters');

  const result = await registerUser(email, password, name);
  res.status(201).json(result);
});

export const login = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { email, password } = req.body as { email?: string; password?: string };
  if (!email || !password) throw new AppError(400, 'Email and password are required');

  try {
    const result = await loginUser(email, password);
    res.json(result);
  } catch {
    throw new AppError(401, 'Invalid credentials');
  }
});

export const refresh = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { refreshToken } = req.body as { refreshToken?: string };
  if (!refreshToken) throw new AppError(400, 'Refresh token required');

  try {
    const result = await refreshAccessToken(refreshToken);
    res.json(result);
  } catch {
    throw new AppError(401, 'Invalid refresh token');
  }
});

export const logout = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { refreshToken } = req.body as { refreshToken?: string };
  if (refreshToken) await revokeRefreshToken(refreshToken);
  res.json({ message: 'Logged out' });
});

export const updateMe = asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = req.user!.userId;
  const { name } = req.body as { name?: string };
  if (!name?.trim()) throw new AppError(400, 'Name is required');

  const user = await updateUserSettings(userId, { name: name.trim() });
  res.json({ user });
});

export const changePassword = asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = req.user!.userId;
  const { currentPassword, newPassword } = req.body as {
    currentPassword?: string;
    newPassword?: string;
  };

  if (!currentPassword || !newPassword) {
    throw new AppError(400, 'currentPassword and newPassword are required');
  }
  if (newPassword.length < 6) {
    throw new AppError(400, 'New password must be at least 6 characters');
  }

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new AppError(404, 'User not found');

  const valid = await verifyPassword(currentPassword, user.passwordHash);
  if (!valid) throw new AppError(401, 'Current password is incorrect');

  const passwordHash = await hashPassword(newPassword);
  await prisma.user.update({ where: { id: userId }, data: { passwordHash } });

  res.json({ message: 'Password updated successfully' });
});

export const deleteAccount = asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = req.user!.userId;
  const { password } = req.body as { password?: string };
  if (!password) throw new AppError(400, 'Password confirmation is required');

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new AppError(404, 'User not found');

  const valid = await verifyPassword(password, user.passwordHash);
  if (!valid) throw new AppError(401, 'Incorrect password');

  // Cascade deletes opportunities + refresh tokens via Prisma schema onDelete: Cascade
  await prisma.user.delete({ where: { id: userId } });

  res.json({ message: 'Account deleted' });
});
