import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const PUBLIC_PATHS = [
  "/",
  "/login",
  "/register",
  "/api/auth/login",
  "/api/auth/register",
  "/api/auth/check-email",
  "/api/auth/forgot-password",
  "/api/auth/reset-password",
  "/api/health",
  "/api/preview",
  "/api/newsletter",
  "/api/contact",
  "/api/benchmarks",
  "/api/webhooks/stripe",
];

const STATIC_PATHS = [
  "/_next/",
  "/favicon.ico",
  "/robots.txt",
  "/sitemap.xml",
];

function getJwtSecret(): Uint8Array | null {
  const secret = process.env.JWT_SECRET;
  if (!secret) return null;
  return new TextEncoder().encode(secret);
}

async function verifyJwt(token: string): Promise<boolean> {
  const secret = getJwtSecret();
  if (!secret) return false;
  try {
    await jwtVerify(token, secret);
    return true;
  } catch {
    return false;
  }
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (STATIC_PATHS.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  if (PUBLIC_PATHS.includes(pathname)) {
    return NextResponse.next();
  }

  if (pathname.startsWith("/r/")) {
    return NextResponse.next();
  }

  if (pathname.startsWith("/api/")) {
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const token = authHeader.split(" ")[1];
    const valid = await verifyJwt(token);
    if (!valid) {
      return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 });
    }
    return NextResponse.next();
  }

  if (pathname.startsWith("/dashboard")) {
    const token = request.cookies.get("ideaforge_token")?.value;
    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    const valid = await verifyJwt(token);
    if (!valid) {
      const response = NextResponse.redirect(new URL("/login", request.url));
      response.cookies.delete("ideaforge_token");
      return response;
    }
  }

  const response = NextResponse.next();
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-XSS-Protection", "1; mode=block");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
