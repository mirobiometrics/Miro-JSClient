export async function hmacSign(secret: string, method: string, path: string, timestamp: number, body: string): Promise<string> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey('raw', encoder.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(`${method}\n${path}\n${timestamp}\n${body}`));
  return Buffer.from(signature).toString('base64');
}

export async function importRsaKey(pem: string): Promise<CryptoKey> {
  const pemContents = pem.replace(/-----BEGIN PUBLIC KEY-----|-----END PUBLIC KEY-----|\s/g, '');
  const bytes = new Uint8Array(Buffer.from(pemContents, 'base64'));
  return crypto.subtle.importKey('spki', bytes, { name: 'RSA-OAEP', hash: 'SHA-256' }, false, ['encrypt']);
}

export async function encryptImage(imageBuffer: Buffer, rsaKey: CryptoKey): Promise<{ encryptedKey: string; iv: string; data: string }> {
  const aesKey = await crypto.subtle.generateKey({ name: 'AES-GCM', length: 256 }, true, ['encrypt']);
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encryptedImage = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, aesKey, new Uint8Array(imageBuffer));
  const encryptedAesKey = await crypto.subtle.encrypt({ name: 'RSA-OAEP' }, rsaKey, await crypto.subtle.exportKey('raw', aesKey));

  const toBase64 = (buf: ArrayBuffer) => Buffer.from(buf).toString('base64');
  return {
    encryptedKey: toBase64(encryptedAesKey),
    iv: toBase64(iv.buffer),
    data: toBase64(encryptedImage)
  };
}
