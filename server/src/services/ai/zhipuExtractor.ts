import axios from 'axios';
import { env } from '../../config/env.js';
import type { ExtractedData } from '../../types/index.js';
import { buildPrompt } from './prompt.js';
import { parseExtractedJson, withTimeout, type AIExtractor } from './aiProvider.js';

// ZhipuAI (智谱AI) — GLM-4 series
// API docs: https://open.bigmodel.cn/dev/api
const ZHIPU_ENDPOINT = 'https://open.bigmodel.cn/api/paas/v4/chat/completions';

export const zhipuExtractor: AIExtractor = {
  name: 'zhipu',
  async extract(rawText: string): Promise<ExtractedData[]> {
    return withTimeout(
      (async () => {
        const response = await axios.post(
          ZHIPU_ENDPOINT,
          {
            model: 'glm-4-flash',
            messages: [{ role: 'user', content: buildPrompt(rawText) }],
            temperature: 0.1,
            max_tokens: 2000,
            response_format: { type: 'json_object' },
          },
          {
            headers: {
              Authorization: `Bearer ${env.zhipuApiKey}`,
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
