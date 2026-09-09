import { randomBytes, scryptSync, timingSafeEqual } from "crypto";

/**
 * Hashes a plaintext password using crypto.scryptSync with a cryptographically secure random salt.
 * Stored format: <salt_hex>:<hash_hex>
 */
export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const derivedKey = scryptSync(password, salt, 64);
  return `${salt}:${derivedKey.toString("hex")}`;
}

/**
 * Verifies a plaintext password against the stored <salt_hex>:<hash_hex> format using constant-time comparison.
 */
export function verifyPassword(password: string, storedHash: string): boolean {
  try {
    const [salt, key] = storedHash.split(":");
    if (!salt || !key) return false;

    const keyBuffer = Buffer.from(key, "hex");
    const derivedKey = scryptSync(password, salt, 64);

    return timingSafeEqual(keyBuffer, derivedKey);
  } catch {
    return false;
  }
}
