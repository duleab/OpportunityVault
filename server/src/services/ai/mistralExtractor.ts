import axios from 'axios';
import { env } from '../../config/env.js';
import type { ExtractedData } from '../../types/index.js';
import { buildPrompt } from './prompt.js';
import { parseExtractedJson, withTimeout, type AIExtractor } from './aiProvider.js';

const MISTRAL_ENDPOINT = 'https://api.mistral.ai/v1/chat/completions';

export const mistralExtractor: AIExtractor = {
  name: 'mistral',
  async extract(rawText: string): Promise<ExtractedData[]> {
    return withTimeout(
      (async () => {
        const response = await axios.post(
          MISTRAL_ENDPOINT,
          {
            model: 'mistral-small-latest',
            messages: [{ role: 'user', content: buildPrompt(rawText) }],
            temperature: 0.1,
            max_tokens: 2000,
            response_format: { type: 'json_object' },
          },
          {
            headers: {
              Authorization: `Bearer ${env.mistralApiKey}`,
              'Content-Type': 'application/json',
            },
            timeout: 28000,
          }
        );

        const content = response.data.choices[0]?.message?.content as string;
        return parseExtractedJson(content);
      })()
    );
  },
};
