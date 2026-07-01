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
  async extract(rawText: string, options?: { imageBase64?: string; userApiKey?: string }): Promise<ExtractedData[]> {
    return withTimeout(
      (async () => {
        const apiKey = options?.userApiKey || env.zhipuApiKey;
        const model = options?.imageBase64 ? 'glm-4v-flash' : 'glm-4-flash';
        
        let contentArray: any[] = [{ type: 'text', text: buildPrompt(rawText || 'Extract data from the image.') }];
        if (options?.imageBase64) {
          const base64Data = options.imageBase64.replace(/^data:image\/\w+;base64,/, '');
          contentArray.push({
            type: 'image_url',
            image_url: { url: `data:image/jpeg;base64,${base64Data}` }
          });
        }

        const response = await axios.post(
          ZHIPU_ENDPOINT,
          {
            model,
            messages: [{ role: 'user', content: contentArray }],
            temperature: 0.1,
            max_tokens: 2000,
            response_format: { type: 'json_object' },
          },
          {
            headers: {
              Authorization: `Bearer ${apiKey}`,
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
