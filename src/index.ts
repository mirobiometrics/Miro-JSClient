import { readFile } from 'fs/promises';
import type { EnrollOptions, EnrollResult, Options, RecognizeResult, DeleteResult } from './types.js';
import { hmacSign, encryptImage } from './crypto.js';
import { BASE_URL, getCredentials, fetchRsaKey } from './client.js';

export type { Credentials, Options, EnrollOptions, EnrollResult, RecognizeResult, DeleteResult } from './types.js';

export async function enrollImage(
  palm1Path: string,
  palm2Path?: string,
  customerId?: string,
  customerData?: string,
  options?: EnrollOptions
): Promise<EnrollResult> {
  const credentials = getCredentials(options ?? {});
  if (!credentials) return { ok: false, code: 'MISSING_CREDENTIALS', message: 'Missing credentials. Provide via options or set MIRO_INSTANCE_ID and MIRO_SECRET env vars.' };

  const rsaResult = await fetchRsaKey();
  if (!rsaResult.ok) return rsaResult;

  const palm1Encrypted = await encryptImage(await readFile(palm1Path), rsaResult.key);
  const palm2Encrypted = palm2Path ? await encryptImage(await readFile(palm2Path), rsaResult.key) : undefined;

  const body: Record<string, unknown> = { palm1: palm1Encrypted, imageMirrored: options?.imageMirrored ?? false };
  if (palm2Encrypted) body.palm2 = palm2Encrypted;
  if (customerId) body.customerId = customerId;
  if (customerData) body.customerData = customerData;

  const hmacMetadata = [palm1Encrypted.encryptedKey, palm1Encrypted.iv, palm2Encrypted?.encryptedKey ?? '', palm2Encrypted?.iv ?? '', customerId ?? '', customerData ?? ''].join(':');
  const path = '/api/enroll';
  const timestamp = Math.floor(Date.now() / 1000);
  const signature = await hmacSign(credentials.secret, 'POST', path, timestamp, hmacMetadata);

  const response = await fetch(`${BASE_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Instance-Id': credentials.instanceId, 'X-Timestamp': timestamp.toString(), 'X-Signature': signature },
    body: JSON.stringify(body),
  });

  const data = (await response.json().catch(() => ({}))) as Record<string, unknown>;
  return response.ok ? { ok: true, ...data } : { ok: false, ...data };
}

async function uploadSingleImage(imagePath: string, mode: 'recognize' | 'delete', options: Options): Promise<RecognizeResult | DeleteResult> {
  const credentials = getCredentials(options);
  if (!credentials) return { ok: false, code: 'MISSING_CREDENTIALS', message: 'Missing credentials. Provide via options or set MIRO_INSTANCE_ID and MIRO_SECRET env vars.' };

  const rsaResult = await fetchRsaKey();
  if (!rsaResult.ok) return rsaResult;

  const encrypted = await encryptImage(await readFile(imagePath), rsaResult.key);
  const path = `/api/${mode}`;
  const timestamp = Math.floor(Date.now() / 1000);
  const signature = await hmacSign(credentials.secret, 'POST', path, timestamp, `${encrypted.encryptedKey}:${encrypted.iv}`);

  const response = await fetch(`${BASE_URL}${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/octet-stream',
      'X-Instance-Id': credentials.instanceId,
      'X-Timestamp': timestamp.toString(),
      'X-Signature': signature,
      'X-Encrypted-Key': encrypted.encryptedKey,
      'X-IV': encrypted.iv,
      ...(options.imageMirrored && { 'X-Image-Mirrored': 'true' }),
    },
    body: Buffer.from(encrypted.data, 'base64'),
  });

  const data = (await response.json().catch(() => ({}))) as Record<string, unknown>;
  return response.ok ? { ok: true, ...data } : { ok: false, ...data };
}

export const recognizeImage = (imagePath: string, options: Options = {}): Promise<RecognizeResult> => uploadSingleImage(imagePath, 'recognize', options);
export const deleteImage = (imagePath: string, options: Options = {}): Promise<DeleteResult> => uploadSingleImage(imagePath, 'delete', options);
