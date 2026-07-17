import { NextRequest, NextResponse } from "next/server";

const ABSTRACT_API_KEY = process.env.ABSTRACT_EMAIL_API_KEY || "";

async function verifyEmail(email: string): Promise<{ deliverable: boolean; is_disposable: boolean; suggestion: string | null }> {
  if (!ABSTRACT_API_KEY) {
    return { deliverable: true, is_disposable: false, suggestion: null };
  }
  try {
    const res = await fetch(
      `https://emailvalidation.abstractapi.com/v1/?api_key=${ABSTRACT_API_KEY}&email=${encodeURIComponent(email)}`
    );
    const data: Record<string, unknown> = await res.json() as Record<string, unknown>;
    const deliverability = data.deliverability as string;
    const isDisposable = (data.is_disposable_email as { value?: boolean })?.value || false;
    return {
      deliverable: deliverability === "DELIVERABLE",
      is_disposable: isDisposable,
      suggestion: (data.suggestion as string) || null,
    };
  } catch {
    return { deliverable: true, is_disposable: false, suggestion: null };
  }
}

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();
    if (!email || typeof email !== "string") {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }
    const result = await verifyEmail(email.trim().toLowerCase());
    if (result.is_disposable) {
      return NextResponse.json({ valid: false, deliverable: false, is_disposable: true, suggestion: null, message: "Disposable email addresses are not allowed" });
    }
    if (!result.deliverable && result.suggestion) {
      return NextResponse.json({ valid: false, deliverable: false, is_disposable: false, suggestion: result.suggestion, message: `Did you mean ${result.suggestion}?` });
    }
    return NextResponse.json({ valid: result.deliverable, deliverable: result.deliverable, is_disposable: false, suggestion: null, message: null });
  } catch (err: unknown) {
    console.error("Check email error:", err);
    return NextResponse.json({ error: "Email check failed" }, { status: 500 });
  }
}
