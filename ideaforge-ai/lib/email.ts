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
  const host = process.env.MAILTRAP_SMTP_HOST || "bulk.smtp.mailtrap.io";
  const port = Number(process.env.MAILTRAP_SMTP_PORT || 587);
  const user = process.env.MAILTRAP_SMTP_USER || "apismtp@mailtrap.io";
  const pass = process.env.MAILTRAP_API_TOKEN || "";
  transporter = createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });
  return transporter;
}

export async function sendEmail(options: EmailOptions): Promise<boolean> {
  const token = process.env.MAILTRAP_API_TOKEN;
  if (!token) {
    console.warn("MAILTRAP_API_TOKEN not set; skipping email");
    return false;
  }
  try {
    const info = await getTransporter().sendMail({
      from: process.env.MAILTRAP_FROM_EMAIL || "Private Person <hello@ideaforge.ai>",
      to: options.to,
      subject: options.subject,
      text: options.text,
      html: options.html || `<pre>${options.text}</pre>`,
    });
    console.log("Email sent:", info.messageId);
    return true;
  } catch (err) {
    console.error("Mailtrap send error:", err instanceof Error ? err.message : err);
    return false;
  }
}
