import { createTransport, type Transporter } from "nodemailer";

export interface EmailOptions {
  to: string;
  subject: string;
  text: string;
  html?: string;
}

let transporter: Transporter | null = null;

function getTransporter(): Transporter {
  if (transporter) return transporter;
  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_APP_PASSWORD;
  transporter = createTransport({
    service: "gmail",
    auth: { user, pass },
  });
  return transporter;
}

export async function sendEmail(options: EmailOptions): Promise<boolean> {
  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_APP_PASSWORD;
  if (!user || !pass) {
    console.warn("GMAIL_USER/GMAIL_APP_PASSWORD not set; skipping email");
    return false;
  }
  try {
    const info = await getTransporter().sendMail({
      from: process.env.GMAIL_FROM || user,
      to: options.to,
      subject: options.subject,
      text: options.text,
      html: options.html || `<pre>${options.text}</pre>`,
    });
    console.log("Email sent:", info.messageId);
    return true;
  } catch (err) {
    console.error("Gmail send error:", err instanceof Error ? err.message : err);
    return false;
  }
}
