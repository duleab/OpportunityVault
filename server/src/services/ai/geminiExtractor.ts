import axios from 'axios';
import { env } from '../../config/env.js';
import type { ExtractedData } from '../../types/index.js';
import { buildPrompt } from './prompt.js';
import { parseExtractedJson, withTimeout, type AIExtractor } from './aiProvider.js';

const GEMINI_ENDPOINT =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

export const geminiExtractor: AIExtractor = {
  name: 'gemini',
  async extract(rawText: string): Promise<ExtractedData> {
    return withTimeout(
      (async () => {
        const response = await axios.post(
          `${GEMINI_ENDPOINT}?key=${env.geminiApiKey}`,
          {
            contents: [{ parts: [{ text: buildPrompt(rawText) }] }],
            generationConfig: {
              temperature: 0.1,
              maxOutputTokens: 2000,
              responseMimeType: 'application/json',
            },
          },
          { timeout: 28000 }
        );

        const content = response.data.candidates?.[0]?.content?.parts?.[0]?.text as string;
        return parseExtractedJson(content);
      })()
    );
  },
};
