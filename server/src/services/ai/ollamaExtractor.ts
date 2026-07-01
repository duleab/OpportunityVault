import axios from 'axios';
import { env } from '../../config/env.js';
import type { ExtractedData } from '../../types/index.js';
import { buildPrompt } from './prompt.js';
import { parseExtractedJson, withTimeout, type AIExtractor } from './aiProvider.js';

export const ollamaExtractor: AIExtractor = {
  name: 'ollama',
  async extract(rawText: string, options?: { imageBase64?: string; userApiKey?: string }): Promise<ExtractedData[]> {
    return withTimeout(
      (async () => {
        const payload: any = {
          model: 'llama3.2',
          prompt: buildPrompt(rawText || 'Extract data from the image.'),
          stream: false,
          format: 'json',
        };

        if (options?.imageBase64) {
          const base64Data = options.imageBase64.replace(/^data:image\/\w+;base64,/, '');
          payload.images = [base64Data];
        }

        const response = await axios.post(
          `${env.ollamaBaseUrl}/api/generate`,
          payload,
          { timeout: 28000 }
        );

        const content = response.data.response as string;
        return parseExtractedJson(content);
      })()
    );
  },
};
