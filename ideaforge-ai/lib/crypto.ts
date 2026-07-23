import { createCipheriv, createDecipheriv, createHash, randomBytes } from "crypto";

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 12;

function getKey(): Buffer {
  const raw = process.env.ENCRYPTION_KEY || process.env.JWT_SECRET || "";
  if (!raw) {
    throw new Error("ENCRYPTION_KEY or JWT_SECRET must be set to encrypt API keys.");
  }
  if (raw.length < 16) {
    throw new Error("ENCRYPTION_KEY or JWT_SECRET must be at least 16 characters.");
  }
  return createHash("sha256").update(raw).digest();
}

export function encrypt(plaintext: string, aad?: string): string {
  const iv = randomBytes(IV_LENGTH);
  const cipher = createCipheriv(ALGORITHM, getKey(), iv);
  if (aad) cipher.setAAD(Buffer.from(aad));
  const encrypted = Buffer.concat([cipher.update(plaintext, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return Buffer.concat([iv, tag, encrypted]).toString("base64");
}

export function decrypt(ciphertext: string, aad?: string): string {
  if (!ciphertext) return "";
  const data = Buffer.from(ciphertext, "base64");
  if (data.length < IV_LENGTH + 16 + 1) throw new Error("Invalid ciphertext");
  const iv = data.subarray(0, IV_LENGTH);
  const tag = data.subarray(IV_LENGTH, IV_LENGTH + 16);
  const encrypted = data.subarray(IV_LENGTH + 16);
  const decipher = createDecipheriv(ALGORITHM, getKey(), iv);
  decipher.setAuthTag(tag);
  if (aad) decipher.setAAD(Buffer.from(aad));
  return Buffer.concat([decipher.update(encrypted), decipher.final()]).toString("utf8");
}
