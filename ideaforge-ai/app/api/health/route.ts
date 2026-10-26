import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return NextResponse.json({ status: "ok", database: "ok", timestamp: new Date().toISOString() });
  } catch (error) {
    console.error("Health check database query failed:", error instanceof Error ? error.message : "unknown error");
    return NextResponse.json(
      { status: "error", database: "unavailable", timestamp: new Date().toISOString() },
      { status: 503 }
    );
  }
}
