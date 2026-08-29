import { describe, expect, it } from 'vitest';
import { normalizeNotificationServerUrl } from './notificationUrl.js';

describe('normalizeNotificationServerUrl', () => {
  it('accepts the official ntfy service over HTTPS', () => {
    expect(normalizeNotificationServerUrl('https://ntfy.sh/')).toBe('https://ntfy.sh');
  });

  it.each([
    'http://ntfy.sh',
    'https://localhost:3000',
    'https://127.0.0.1',
    'https://169.254.169.254',
    'https://example.com',
  ])('rejects unsafe notification destination %s', (url) => {
    expect(() => normalizeNotificationServerUrl(url)).toThrow('Unsupported notification server');
  });
});
