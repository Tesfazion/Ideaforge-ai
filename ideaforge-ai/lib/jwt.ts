import jwt from "jsonwebtoken";
import { NextRequest } from "next/server";

const JWT_SECRET = process.env.JWT_SECRET;

function getSecret(): string {
  if (!JWT_SECRET) {
    throw new Error("JWT_SECRET environment variable is required.");
  }
  if (JWT_SECRET.length < 16) {
    throw new Error("JWT_SECRET must be at least 16 characters.");
  }
  return JWT_SECRET;
}

export interface JwtPayload {
  userId: string;
}

export function signToken(userId: string): string {
  return jwt.sign({ userId }, getSecret(), { expiresIn: "7d" });
}

export function verifyToken(token: string): JwtPayload {
  return jwt.verify(token, getSecret()) as JwtPayload;
}

export function getUserId(request: NextRequest): string | null {
  const header = request.headers.get("authorization");
  if (!header || !header.startsWith("Bearer ")) return null;
  const token = header.split(" ")[1];
  try {
    const decoded = verifyToken(token);
    return decoded.userId;
  } catch {
    return null;
  }
}
