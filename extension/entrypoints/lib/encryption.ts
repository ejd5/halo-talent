// ─── Encryption layer — Halo Companion ───────────
// AES-256-GCM encryption for local cached fan data

import { ENCRYPTION } from "./constants";

let encryptionKey: CryptoKey | null = null;

/** Derive an AES-GCM key from a master password + salt */
export async function deriveKey(
  password: string,
  salt: Uint8Array<ArrayBuffer>
): Promise<CryptoKey> {
  const enc = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    enc.encode(password),
    "PBKDF2",
    false,
    ["deriveKey"]
  );

  const key = await crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt,
      iterations: 600_000,
      hash: "SHA-256",
    },
    keyMaterial,
    { name: ENCRYPTION.ALGORITHM, length: ENCRYPTION.KEY_LENGTH },
    false,
    ["encrypt", "decrypt"]
  );

  encryptionKey = key;
  return key;
}

/** Encrypt plaintext with AES-GCM */
export async function encrypt(plaintext: string): Promise<{
  ciphertext: ArrayBuffer;
  iv: Uint8Array;
}> {
  if (!encryptionKey) throw new Error("Encryption key not initialized");

  const iv = crypto.getRandomValues(new Uint8Array(ENCRYPTION.IV_LENGTH));
  const enc = new TextEncoder();

  const ciphertext = await crypto.subtle.encrypt(
    { name: ENCRYPTION.ALGORITHM, iv },
    encryptionKey,
    enc.encode(plaintext)
  );

  return { ciphertext, iv };
}

/** Decrypt AES-GCM ciphertext */
export async function decrypt(
  ciphertext: ArrayBuffer,
  iv: Uint8Array<ArrayBuffer>
): Promise<string> {
  if (!encryptionKey) throw new Error("Encryption key not initialized");

  const dec = new TextDecoder();
  const plaintext = await crypto.subtle.decrypt(
    { name: ENCRYPTION.ALGORITHM, iv },
    encryptionKey,
    ciphertext
  );

  return dec.decode(plaintext);
}

/** Check if encryption is ready */
export function isEncryptionReady(): boolean {
  return encryptionKey !== null;
}

/** Clear the in-memory encryption key */
export function clearEncryptionKey(): void {
  encryptionKey = null;
}
