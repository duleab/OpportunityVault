import type { Response } from 'express';
import { AppError, asyncHandler } from '../middleware/errorHandler.js';
import type { AuthRequest } from '../middleware/auth.middleware.js';
import {
  loginUser,
  refreshAccessToken,
  registerUser,
  revokeRefreshToken,
} from '../services/auth.service.js';

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
