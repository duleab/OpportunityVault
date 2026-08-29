import crypto from 'crypto';

const PREFIX = 'enc:v1';

function encryptionKey(secret: string): Buffer {
  return crypto.createHash('sha256').update(secret).digest();
}

export function encryptSecretRecord(values: Record<string, string>, secret: string): string {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv('aes-256-gcm', encryptionKey(secret), iv);
  const encrypted = Buffer.concat([cipher.update(JSON.stringify(values), 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();
  return [PREFIX, iv.toString('base64url'), tag.toString('base64url'), encrypted.toString('base64url')].join(':');
}

export function decryptSecretRecord(value: string, secret: string): Record<string, string> {
  if (!value) return {};
  if (!value.startsWith(`${PREFIX}:`)) {
    try {
      return JSON.parse(value) as Record<string, string>;
    } catch {
      return {};
    }
  }

  try {
    const [, , iv, tag, encrypted] = value.split(':');
    const decipher = crypto.createDecipheriv('aes-256-gcm', encryptionKey(secret), Buffer.from(iv, 'base64url'));
    decipher.setAuthTag(Buffer.from(tag, 'base64url'));
    const decrypted = Buffer.concat([
      decipher.update(Buffer.from(encrypted, 'base64url')),
      decipher.final(),
    ]).toString('utf8');
    return JSON.parse(decrypted) as Record<string, string>;
  } catch {
    return {};
  }
}

export function getConfiguredSecrets(values: Record<string, string>): Record<string, boolean> {
  return Object.fromEntries(Object.entries(values).map(([provider, key]) => [provider, Boolean(key?.trim())]));
}
