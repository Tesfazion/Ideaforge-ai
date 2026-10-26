import { SignJWT, jwtVerify } from "jose";
import { NextRequest } from "next/server";

function getSecret(): Uint8Array {
  const secret = process.env.JWT_SECRET;
  if (!secret || Buffer.byteLength(secret, "utf8") < 32) {
    throw new Error("JWT_SECRET must contain at least 32 bytes.");
  }
  return new TextEncoder().encode(secret);
}

export interface JwtPayload {
  userId: string;
}

export function signToken(userId: string): Promise<string> {
  return new SignJWT({ userId })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getSecret());
}

export function signPasswordResetToken(userId: string): Promise<string> {
  return new SignJWT({ userId, type: "password_reset" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("1h")
    .sign(getSecret());
}

export async function verifyToken(token: string): Promise<JwtPayload> {
  const { payload } = await jwtVerify(token, getSecret(), { algorithms: ["HS256"] });
  if (typeof payload.userId !== "string" || !payload.userId) {
    throw new Error("Invalid token payload.");
  }
  return { userId: payload.userId };
}

export async function verifyPasswordResetToken(token: string): Promise<string | null> {
  const { payload } = await jwtVerify(token, getSecret(), { algorithms: ["HS256"] });
  if (payload.type !== "password_reset" || typeof payload.userId !== "string" || !payload.userId) {
    return null;
  }
  return payload.userId;
}

export async function getUserId(request: NextRequest): Promise<string | null> {
  const cookieToken = request.cookies.get("ideaforge_token")?.value;
  const header = request.headers.get("authorization");
  const bearerToken = header?.startsWith("Bearer ") ? header.slice(7) : null;
  const token = cookieToken || bearerToken;
  if (!token) return null;

  try {
    const decoded = await verifyToken(token);
    return decoded.userId;
  } catch {
    return null;
  }
}

export function setAuthCookie(response: import("next/server").NextResponse, token: string): void {
  response.cookies.set("ideaforge_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 7 * 24 * 60 * 60,
  });
}

export function clearAuthCookie(response: import("next/server").NextResponse): void {
  response.cookies.set("ideaforge_token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 0,
  });
}
