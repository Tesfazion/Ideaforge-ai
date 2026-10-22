const MAILTRAP_API_URL = "https://send.api.mailtrap.io/api/send";

export interface EmailOptions {
  to: string;
  subject: string;
  text: string;
  html?: string;
}

export async function sendEmail(options: EmailOptions): Promise<boolean> {
  const token = process.env.MAILTRAP_API_TOKEN;
  if (!token) {
    console.warn("MAILTRAP_API_TOKEN not set; skipping email");
    return false;
  }
  const fromEmail = process.env.MAILTRAP_FROM_EMAIL || "noreply@ideaforge.ai";
  const fromName = process.env.MAILTRAP_FROM_NAME || "IdeaForge";
  try {
    const res = await fetch(MAILTRAP_API_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: { email: fromEmail, name: fromName },
        to: [{ email: options.to }],
        subject: options.subject,
        text: options.text,
        html: options.html || `<pre>${options.text}</pre>`,
      }),
    });
    if (!res.ok) {
      console.error("Mailtrap send failed:", res.status, await res.text());
      return false;
    }
    return true;
  } catch (err) {
    console.error("Mailtrap send error:", err instanceof Error ? err.message : err);
    return false;
  }
}
