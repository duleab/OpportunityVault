import axios from 'axios';
import { env } from '../../config/env.js';
import type { ExtractedData } from '../../types/index.js';
import { buildPrompt } from './prompt.js';
import { parseExtractedJson, withTimeout, type AIExtractor } from './aiProvider.js';

const GEMINI_ENDPOINT =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

export const geminiExtractor: AIExtractor = {
  name: 'gemini',
  async extract(rawText: string, options?: { imageBase64?: string; userApiKey?: string }): Promise<ExtractedData[]> {
    return withTimeout(
      (async () => {
        const apiKey = options?.userApiKey || env.geminiApiKey;
        const parts: any[] = [];
        
        if (options?.imageBase64) {
          const base64Data = options.imageBase64.replace(/^data:image\/\w+;base64,/, '');
          parts.push({
            inlineData: {
              mimeType: 'image/jpeg',
              data: base64Data,
            },
          });
        }
        
        parts.push({ text: buildPrompt(rawText || 'Extract data from the image.') });

        const response = await axios.post(
          `${GEMINI_ENDPOINT}?key=${apiKey}`,
          {
            contents: [{ parts }],
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
