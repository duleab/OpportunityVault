const ALLOWED_NOTIFICATION_HOSTS = new Set(['ntfy.sh']);

export function normalizeNotificationServerUrl(value: string): string {
  try {
    const url = new URL(value);
    if (url.protocol !== 'https:' || !ALLOWED_NOTIFICATION_HOSTS.has(url.hostname) || url.port) {
      throw new Error();
    }
    return url.origin;
  } catch {
    throw new Error('Unsupported notification server');
  }
}
