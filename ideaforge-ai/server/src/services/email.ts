const ABSTRACT_API_KEY = process.env.ABSTRACT_EMAIL_API_KEY || "";

export async function verifyEmail(email: string): Promise<{ deliverable: boolean; is_disposable: boolean; suggestion: string | null }> {
  if (!ABSTRACT_API_KEY) {
    return { deliverable: true, is_disposable: false, suggestion: null };
  }
  try {
    const res = await fetch(
      `emailvalidation.abstractapi.com/v1/?api_key=${ABSTRACT_API_KEY}&email=${encodeURIComponent(email)}`
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
