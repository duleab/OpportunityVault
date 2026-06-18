import type { ExtractedData } from '../../types/index.js';

export interface AIExtractor {
  name: string;
  extract(rawText: string): Promise<ExtractedData>;
}

export const AI_TIMEOUT_MS = 30_000;

export async function withTimeout<T>(promise: Promise<T>, ms: number = AI_TIMEOUT_MS): Promise<T> {
  let timeoutId: ReturnType<typeof setTimeout> | undefined;
  const timeoutPromise = new Promise<never>((_, reject) => {
    timeoutId = setTimeout(() => reject(new Error('AI extraction timed out after 30 seconds')), ms);
  });

  try {
    return await Promise.race([promise, timeoutPromise]);
  } finally {
    if (timeoutId) clearTimeout(timeoutId);
  }
}

export function parseExtractedJson(content: string): ExtractedData {
  const cleaned = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
  const parsed = JSON.parse(cleaned) as ExtractedData;
  return parsed;
}
