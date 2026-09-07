import { describe, expect, it } from 'vitest';
import { ZHIPU_ENDPOINT, ZHIPU_TEXT_MODEL } from './zhipuExtractor.js';

describe('Z.ai provider configuration', () => {
  it('uses the current global API endpoint and supported Flash model', () => {
    expect(ZHIPU_ENDPOINT).toBe('https://api.z.ai/api/paas/v4/chat/completions');
    expect(ZHIPU_TEXT_MODEL).toBe('glm-4.7-flash');
  });
});
