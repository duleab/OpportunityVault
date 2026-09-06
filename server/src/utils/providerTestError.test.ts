import { describe, expect, it } from 'vitest';
import { getProviderTestError } from './providerTestError.js';

describe('getProviderTestError', () => {
  it('reports rejected credentials without exposing provider response bodies', () => {
    const error = { response: { status: 401, data: { error: 'secret provider detail' } } };
    expect(getProviderTestError('Groq', error)).toEqual({
      statusCode: 400,
      message: 'Groq rejected the API key. Check that the key is active and belongs to the correct provider.',
    });
  });

  it('distinguishes quota and model availability failures', () => {
    expect(getProviderTestError('Gemini', { response: { status: 429 } }).message).toContain('quota');
    expect(getProviderTestError('Gemini', { response: { status: 404 } }).message).toContain('model');
  });

  it('reports timeouts and connection failures', () => {
    expect(getProviderTestError('Mistral', { code: 'ECONNABORTED' }).message).toContain('timed out');
    expect(getProviderTestError('Mistral', { code: 'ENOTFOUND' }).message).toContain('could not be reached');
  });
});
