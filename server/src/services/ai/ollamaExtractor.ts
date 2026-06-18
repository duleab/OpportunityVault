import axios from 'axios';
import { env } from '../../config/env.js';
import type { ExtractedData } from '../../types/index.js';
import { buildPrompt } from './prompt.js';
import { parseExtractedJson, withTimeout, type AIExtractor } from './aiProvider.js';

export const ollamaExtractor: AIExtractor = {
  name: 'ollama',
  async extract(rawText: string): Promise<ExtractedData[]> {
    return withTimeout(
      (async () => {
        const response = await axios.post(
          `${env.ollamaBaseUrl}/api/generate`,
          {
            model: 'llama3.2',
            prompt: buildPrompt(rawText),
            stream: false,
            format: 'json',
          },
          { timeout: 28000 }
        );

        const content = response.data.response as string;
        return parseExtractedJson(content);
      })()
    );
  },
};
