import crypto from "crypto";

// Internal secret for video token signing and URL obfuscation
const VIDEO_SECRET = process.env.VIDEO_ENCRYPTION_SECRET || "coding75-protected-video-playback-secret-v1";
const ALGORITHM = "aes-256-cbc";

// 32-byte derived key
const KEY = crypto.createHash("sha256").update(VIDEO_SECRET).digest();

/**
 * Generate a tamper-proof, timestamped signed token for a video lecture.
 * Valid for `expiresInMs` (default 24 hours).
 */
export function generateVideoToken(videoId: string, expiresInMs: number = 24 * 60 * 60 * 1000): string {
  const expiresAt = Date.now() + expiresInMs;
  const payload = JSON.stringify({ id: videoId, exp: expiresAt });

  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(ALGORITHM, KEY, iv);
  let encrypted = cipher.update(payload, "utf8", "hex");
  encrypted += cipher.final("hex");

  // HMAC signature to detect tampering
  const hmac = crypto.createHmac("sha256", KEY);
  hmac.update(`${iv.toString("hex")}:${encrypted}`);
  const signature = hmac.digest("hex");

  return `${iv.toString("hex")}.${encrypted}.${signature}`;
}

/**
 * Verify that a token is valid, untampered, and not expired.
 * Optionally verifies that the token matches the requested videoId.
 */
export function verifyVideoToken(token: string, expectedVideoId?: string): boolean {
  if (!token || typeof token !== "string") return false;

  const parts = token.split(".");
  if (parts.length !== 3) return false;

  const [ivHex, encryptedHex, signature] = parts;

  try {
    // 1. Verify HMAC
    const hmac = crypto.createHmac("sha256", KEY);
    hmac.update(`${ivHex}:${encryptedHex}`);
    const expectedSig = hmac.digest("hex");

    if (!crypto.timingSafeEqual(Buffer.from(signature, "hex"), Buffer.from(expectedSig, "hex"))) {
      return false;
    }

    // 2. Decrypt payload
    const iv = Buffer.from(ivHex, "hex");
    const decipher = crypto.createDecipheriv(ALGORITHM, KEY, iv);
    let decrypted = decipher.update(encryptedHex, "hex", "utf8");
    decrypted += decipher.final("utf8");

    const data = JSON.parse(decrypted);

    // 3. Check expiry
    if (!data.exp || typeof data.exp !== "number" || data.exp < Date.now()) {
      return false;
    }

    // 4. Check video ID match if specified
    if (expectedVideoId && data.id !== expectedVideoId) {
      return false;
    }

    return true;
  } catch (err) {
    return false;
  }
}

/**
 * Encrypt a raw Google Drive URL or File ID into an opaque ciphertext string.
 */
export function encryptDriveUrl(rawUrl: string): string {
  if (!rawUrl) return "";
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(ALGORITHM, KEY, iv);
  let encrypted = cipher.update(rawUrl, "utf8", "hex");
  encrypted += cipher.final("hex");
  return `${iv.toString("hex")}-${encrypted}`;
}

/**
 * Decrypt an opaque ciphertext string back into the raw Google Drive URL.
 */
export function decryptDriveUrl(ciphertext: string): string | null {
  if (!ciphertext) return null;
  const parts = ciphertext.split("-");
  if (parts.length !== 2) return null;

  try {
    const [ivHex, encryptedHex] = parts;
    const iv = Buffer.from(ivHex, "hex");
    const decipher = crypto.createDecipheriv(ALGORITHM, KEY, iv);
    let decrypted = decipher.update(encryptedHex, "hex", "utf8");
    decrypted += decipher.final("utf8");
    return decrypted;
  } catch {
    return null;
  }
}
