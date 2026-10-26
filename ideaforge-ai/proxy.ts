import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

function createCsp(nonce: string): string {
  return [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}' https://js.stripe.com`,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https: blob:",
    "font-src 'self' data:",
    "connect-src 'self' https://api.exa.ai https://api.stripe.com https://openrouter.ai",
    "frame-src 'self' https://js.stripe.com https://hooks.stripe.com",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
  ].join("; ");
}

function continueWithSecurityHeaders(request: NextRequest, nonce: string): NextResponse {
  const csp = createCsp(nonce);
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);
  requestHeaders.set("Content-Security-Policy", csp);
  const response = NextResponse.next({ request: { headers: requestHeaders } });
  response.headers.set("Content-Security-Policy", csp);
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  return response;
}

const PUBLIC_PATHS = [
  "/",
  "/login",
  "/register",
  "/api/auth/login",
  "/api/auth/logout",
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
  if (!secret || new TextEncoder().encode(secret).length < 32) return null;
  return new TextEncoder().encode(secret);
}

async function verifyJwt(token: string): Promise<boolean> {
  const secret = getJwtSecret();
  if (!secret) return false;
  try {
    const { payload } = await jwtVerify(token, secret, { algorithms: ["HS256"] });
    return typeof payload.userId === "string" && payload.userId.length > 0;
  } catch {
    return false;
  }
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const nonce = btoa(crypto.randomUUID());

  if (STATIC_PATHS.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  if (PUBLIC_PATHS.includes(pathname)) {
    return continueWithSecurityHeaders(request, nonce);
  }

  if (pathname.startsWith("/r/")) {
    return continueWithSecurityHeaders(request, nonce);
  }

  if (pathname.startsWith("/api/")) {
    const cookieToken = request.cookies.get("ideaforge_token")?.value;
    const authHeader = request.headers.get("authorization");
    const bearerToken = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;
    const token = cookieToken || bearerToken;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const valid = await verifyJwt(token);
    if (!valid) {
      return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 });
    }
    return continueWithSecurityHeaders(request, nonce);
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

  const response = continueWithSecurityHeaders(request, nonce);
  response.headers.set("X-XSS-Protection", "1; mode=block");
  response.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
