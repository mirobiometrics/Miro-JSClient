import type { Credentials, Options } from './types.js';
import { importRsaKey } from './crypto.js';

export const BASE_URL = process.env.MIRO_BASE_URL ?? 'https://orchestrator.mirobiometrics.com';

export function getCredentials(options: Options): Credentials | null {
  if (options.credentials) return options.credentials;
  const instanceId = process.env.MIRO_INSTANCE_ID;
  const secret = process.env.MIRO_SECRET;
  return instanceId && secret ? { instanceId, secret } : null;
}

export async function fetchRsaKey(): Promise<{ ok: true; key: CryptoKey } | { ok: false; error: string; detail?: string }> {
  const res = await fetch(`${BASE_URL}/api/key-exchange/rsa`, { cache: 'no-store' });
  if (!res.ok) return { ok: false, error: String(res.status), detail: 'Failed to fetch RSA key' };
  const text = await res.text();
  const pem = text.trim().startsWith('-----BEGIN') ? text : (JSON.parse(text) as { publicKey: string }).publicKey;
  return { ok: true, key: await importRsaKey(pem) };
}
