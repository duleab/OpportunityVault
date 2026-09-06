import { describe, expect, it } from 'vitest';
import { getProviderTestPlan } from './providerTestPlan';

describe('getProviderTestPlan', () => {
  it('saves a newly entered key before testing the provider', () => {
    expect(getProviderTestPlan('groq', { groq: '  new-key  ' }, false)).toEqual({
      canTest: true,
      keyToSave: 'new-key',
    });
  });

  it('tests immediately when a key is already configured', () => {
    expect(getProviderTestPlan('groq', {}, true)).toEqual({ canTest: true });
  });

  it('lets the server check for a configured global key', () => {
    expect(getProviderTestPlan('groq', {}, false)).toEqual({ canTest: true });
  });
});
