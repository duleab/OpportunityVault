import { describe, expect, it } from 'vitest';
import { decryptSecretRecord, encryptSecretRecord, getConfiguredSecrets } from './secretCrypto.js';

describe('secretCrypto', () => {
  const secret = 'a-production-secret-that-is-long-enough';

  it('encrypts secret records without leaving provider keys in stored text', () => {
    const encrypted = encryptSecretRecord({ groq: 'gsk-private', gemini: 'AIza-private' }, secret);

    expect(encrypted).not.toContain('gsk-private');
    expect(encrypted).not.toContain('AIza-private');
    expect(decryptSecretRecord(encrypted, secret)).toEqual({
      groq: 'gsk-private',
      gemini: 'AIza-private',
    });
  });

  it('reads legacy plaintext JSON so existing users can migrate safely', () => {
    expect(decryptSecretRecord('{"groq":"legacy-key"}', secret)).toEqual({ groq: 'legacy-key' });
  });

  it('exposes only configured flags to clients', () => {
    expect(getConfiguredSecrets({ groq: 'secret', gemini: '', mistral: 'another' })).toEqual({
      groq: true,
      gemini: false,
      mistral: true,
    });
  });
});
