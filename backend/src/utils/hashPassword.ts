export async function hashPassword(
  password: string
): Promise<{ salt: string; hash: string }> {
  const salt = crypto.getRandomValues(new Uint8Array(16)); // Generate a 16-byte salt
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    data,
    { name: 'PBKDF2' },
    false,
    ['deriveBits']
  );

  const derivedBits = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: salt,
      iterations: 100000,
      hash: 'SHA-256',
    },
    keyMaterial,
    256
  );

  const hashBuffer = new Uint8Array(derivedBits);
  const hash = Array.from(hashBuffer)
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');

  const saltHex = Array.from(salt)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');

  return { salt: saltHex, hash: hash };
}
