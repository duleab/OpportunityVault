import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient();

export function parseJsonArray<T>(value: string, fallback: T[] = []): T[] {
  try {
    const parsed = JSON.parse(value) as T[];
    return Array.isArray(parsed) ? parsed : fallback;
  } catch {
    return fallback;
  }
}

export function stringifyJsonArray<T>(value: T[]): string {
  return JSON.stringify(value);
}
