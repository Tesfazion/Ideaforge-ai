import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getUserId } from "@/lib/jwt";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

export const runtime = "nodejs";

const bodySchema = z.object({ format: z.enum(["csv", "doc"]) });

function printable(value: unknown): string {
  if (value == null) return "";
  if (typeof value === "string") return value;
  return JSON.stringify(value, null, 2);
}

function csvCell(value: string): string {
  const guarded = /^[=+\-@\t\r]/.test(value) ? `'${value}` : value;
  return `"${guarded.replace(/"/g, '""')}"`;
}

function escapeHtml(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const userId = getUserId(request);
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id: ideaId } = await params;
  const rateLimit = checkRateLimit(`report-email:${userId}:${getClientIp(request)}`, { windowMs: 3600000, maxRequests: 3 });
  if (!rateLimit.allowed) return NextResponse.json({ error: "Please wait before emailing another report." }, { status: 429 });

  const parsed = bodySchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Choose CSV or Word document." }, { status: 400 });

  const user = await prisma.user.findUnique({ where: { id: userId }, select: { email: true, plan: true } });
  if (!user) return NextResponse.json({ error: "Account not found." }, { status: 404 });
  if (!(["pro", "enterprise"] as string[]).includes(user.plan)) return NextResponse.json({ error: "Email report delivery is available on Founder Pro and Enterprise." }, { status: 403 });

  const idea = await prisma.idea.findFirst({ where: { id: ideaId, userId }, include: { report: true } });
  if (!idea) return NextResponse.json({ error: "Idea not found." }, { status: 404 });
  if (!idea.report || idea.status !== "validated") return NextResponse.json({ error: "This idea does not have a completed report yet." }, { status: 409 });

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;
  if (!apiKey || !from) return NextResponse.json({ error: "Email delivery is not configured. Add RESEND_API_KEY and RESEND_FROM_EMAIL to the server environment." }, { status: 503 });

  const rows: [string, string][] = [
    ["Idea title", idea.title], ["Description", idea.description], ["Target audience", idea.targetAudience],
    ["Industry", idea.industry], ["Market scope", idea.marketScope], ["Created", idea.createdAt.toISOString()],
    ...Object.entries(idea.report).map(([key, value]) => [key, printable(value)] as [string, string]),
  ];
  const format = parsed.data.format;
  const isCsv = format === "csv";
  const filename = `IdeaForge-${idea.title.trim().replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "").slice(0, 60) || "report"}.${isCsv ? "csv" : "doc"}`;
  const content = isCsv
    ? `\uFEFF${["Section,Value", ...rows.map(([label, value]) => `${csvCell(label)},${csvCell(value)}`)].join("\r\n")}`
    : `<!doctype html><html><head><meta charset="utf-8"><style>body{font-family:Arial,sans-serif;color:#172033}h1{color:#4338ca}table{border-collapse:collapse;width:100%}th,td{border:1px solid #d8deea;padding:9px;text-align:left;vertical-align:top}th{width:24%;background:#f1f3fb}pre{white-space:pre-wrap;font:inherit;margin:0}</style></head><body><h1>IdeaForge validation report</h1><h2>${escapeHtml(idea.title)}</h2><table><tbody>${rows.map(([label, value]) => `<tr><th>${escapeHtml(label)}</th><td><pre>${escapeHtml(value)}</pre></td></tr>`).join("")}</tbody></table></body></html>`;
  const attachment = Buffer.from(content, "utf8").toString("base64");

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from,
        to: [user.email],
        subject: `Your IdeaForge report: ${idea.title}`,
        html: `<p>Your full validation report for <strong>${escapeHtml(idea.title)}</strong> is attached as a ${isCsv ? "CSV file" : "Word-compatible document"}.</p><p>IdeaForge</p>`,
        attachments: [{ filename, content: attachment, content_type: isCsv ? "text/csv" : "application/msword" }],
      }),
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({})) as { message?: string };
      console.error("Report email provider error:", response.status, error.message || "unknown error");
      return NextResponse.json({ error: "The email could not be sent right now. Please try again later." }, { status: 502 });
    }
    return NextResponse.json({ message: `Report sent to ${user.email}.` });
  } catch (error) {
    console.error("Report email failed:", error instanceof Error ? error.message : "unknown error");
    return NextResponse.json({ error: "The email could not be sent right now. Please try again later." }, { status: 502 });
  }
}
