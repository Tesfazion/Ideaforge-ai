import { NextRequest, NextResponse } from "next/server";
import { clearAuthCookie } from "@/lib/jwt";

export async function POST(request: NextRequest) {
  const origin = request.headers.get("origin");
  if (origin && origin !== request.nextUrl.origin) {
    return NextResponse.json({ error: "Invalid request origin" }, { status: 403 });
  }
  const response = NextResponse.json({ success: true });
  clearAuthCookie(response);
  return response;
}
