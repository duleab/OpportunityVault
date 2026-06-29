import { getName } from 'country-list';
import { OpportunityType } from '@prisma/client';
import type { ExtractedData } from '../types/index.js';
import { calculateUrgency } from '../utils/urgencyCalculator.js';
import { geminiExtractor } from './ai/geminiExtractor.js';
import { groqExtractor } from './ai/groqExtractor.js';
import { mistralExtractor } from './ai/mistralExtractor.js';
import { ollamaExtractor } from './ai/ollamaExtractor.js';
import { zhipuExtractor } from './ai/zhipuExtractor.js';
import type { AIExtractor } from './ai/aiProvider.js';

const VALID_TYPES = new Set<string>(Object.values(OpportunityType));

const extractors: Record<string, AIExtractor> = {
  groq: groqExtractor,
  gemini: geminiExtractor,
  mistral: mistralExtractor,
  ollama: ollamaExtractor,
  zhipu: zhipuExtractor,
};

const FALLBACK_CHAIN = ['groq', 'zhipu', 'gemini', 'mistral', 'ollama'] as const;

function isValidUrl(url: string | null): boolean {
  if (!url) return false;
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

function normalizeCountries(countries: string[]): string[] {
  return countries
    .map((c) => {
      const trimmed = c.trim();
      if (trimmed.toLowerCase() === 'online' || trimmed.toLowerCase() === 'remote') {
        return trimmed.charAt(0).toUpperCase() + trimmed.slice(1).toLowerCase();
      }
      const normalized = getName(trimmed) ?? getName(trimmed.toUpperCase());
      return normalized ?? trimmed;
    })
    .filter(Boolean);
}

function parseDate(value: string | null): Date | null {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function normalizeType(type: string): OpportunityType {
  const upper = type.toUpperCase();
  return VALID_TYPES.has(upper) ? (upper as OpportunityType) : OpportunityType.OTHER;
}

export function postProcessExtraction(data: ExtractedData, rawText: string): {
  extracted: ExtractedData;
  lowConfidenceFields: string[];
  warning: string | null;
} {
  const confidence = typeof data.confidence === 'number' ? data.confidence : 0.5;
  const deadline = parseDate(data.deadline);
  const urgency = calculateUrgency(deadline);

  const processed: ExtractedData = {
    ...data,
    type: normalizeType(String(data.type)),
    countries: normalizeCountries(Array.isArray(data.countries) ? data.countries : []),
    requirements: Array.isArray(data.requirements) ? data.requirements : [],
    applicationLink: isValidUrl(data.applicationLink) ? data.applicationLink : null,
    websiteUrl: isValidUrl(data.websiteUrl) ? data.websiteUrl : null,
    deadline: deadline?.toISOString() ?? null,
    startDate: parseDate(data.startDate)?.toISOString() ?? null,
    confidence,
  };

  const lowConfidenceFields: string[] = [];
  if (confidence < 0.5) {
    Object.entries(processed).forEach(([key, value]) => {
      if (key !== 'confidence' && value !== null && value !== undefined) {
        lowConfidenceFields.push(key);
      }
    });
  }

  const warning =
    confidence < 0.5
      ? 'AI confidence low — please review all fields carefully'
      : null;

  void rawText;
  void urgency;

  return { extracted: processed, lowConfidenceFields, warning };
}

export async function extractWithFallback(
  rawText: string,
  preferredProvider?: string
): Promise<{
  extractions: ExtractedData[];
  provider: string;
  lowConfidenceFieldsList: string[][];
  warnings: (string | null)[];
}> {
  const chain = preferredProvider
    ? [preferredProvider, ...FALLBACK_CHAIN.filter((p) => p !== preferredProvider)]
    : [...FALLBACK_CHAIN];

  let lastError: Error | null = null;

  for (const providerName of chain) {
    const extractor = extractors[providerName];
    if (!extractor) continue;

    try {
      const rawArray = await extractor.extract(rawText);
      
      const extractions: ExtractedData[] = [];
      const lowConfidenceFieldsList: string[][] = [];
      const warnings: (string | null)[] = [];

      for (const raw of rawArray) {
        const { extracted, lowConfidenceFields, warning } = postProcessExtraction(raw, rawText);
        extractions.push(extracted);
        lowConfidenceFieldsList.push(lowConfidenceFields);
        warnings.push(warning);
      }

      return { extractions, provider: providerName, lowConfidenceFieldsList, warnings };
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err));
    }
  }

  throw lastError ?? new Error('All AI providers failed');
}

export function getExtractor(provider: string): AIExtractor | undefined {
  return extractors[provider];
}
