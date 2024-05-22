export async function hashPassword(
  password: string,
  saltBytes?: Uint8Array
): Promise<{ salt: string; hash: string }> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    data,
    { name: 'PBKDF2' },
    false,
    ['deriveBits']
  );

  // Generate a new salt if one is not provided
  const salt = saltBytes || crypto.getRandomValues(new Uint8Array(16));
  const derivedBits = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: salt,
      iterations: 100000,
      hash: 'SHA-256',
    },
    keyMaterial,
    256 // number of bits to derive
  );

  const hashBuffer = new Uint8Array(derivedBits);
  const hash = Array.from(hashBuffer)
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');

  const saltHex = Array.from(salt)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');

  return { salt: saltHex, hash };
}

export function hexStringToUint8Array(hexString: string) {
  if (hexString.length % 2 !== 0) {
    throw new Error('Hex string has an odd length');
  }
  const arrayBuffer = new Uint8Array(hexString.length / 2);
  for (let i = 0; i < hexString.length; i += 2) {
    const byteValue = parseInt(hexString.substring(i, i + 2), 16);
    arrayBuffer[i / 2] = byteValue;
  }
  return arrayBuffer;
}
