import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const DEFAULT_BENCHMARKS = [
  {
    industry: "SaaS",
    avgViability: 68.5,
    avgMarket: 72.3,
    avgRisk: 45.2,
    totalValidations: 1240,
  },
  {
    industry: "E-Commerce",
    avgViability: 64.8,
    avgMarket: 69.1,
    avgRisk: 48.7,
    totalValidations: 980,
  },
  {
    industry: "FinTech",
    avgViability: 71.2,
    avgMarket: 74.6,
    avgRisk: 42.1,
    totalValidations: 870,
  },
  {
    industry: "HealthTech",
    avgViability: 66.3,
    avgMarket: 70.8,
    avgRisk: 51.3,
    totalValidations: 650,
  },
  {
    industry: "AI/ML",
    avgViability: 73.1,
    avgMarket: 76.4,
    avgRisk: 39.8,
    totalValidations: 1100,
  },
];

export async function GET() {
  try {
    const benchmarks = await prisma.validationBenchmark.findMany({
      orderBy: { totalValidations: "desc" },
    });

    if (benchmarks.length === 0) {
      return NextResponse.json({
        benchmarks: DEFAULT_BENCHMARKS,
        source: "defaults",
      });
    }

    const grouped = benchmarks.reduce<
      Record<
        string,
        {
          totalViability: number;
          totalMarket: number;
          totalRisk: number;
          totalValidations: number;
          count: number;
        }
      >
   >((acc, row) => {
      if (!acc[row.industry]) {
        acc[row.industry] = {
          totalViability: 0,
          totalMarket: 0,
          totalRisk: 0,
          totalValidations: 0,
          count: 0,
        };
      }
      const g = acc[row.industry];
      g.totalViability += row.avgViability * row.totalValidations;
      g.totalMarket += row.avgMarket * row.totalValidations;
      g.totalRisk += row.avgRisk * row.totalValidations;
      g.totalValidations += row.totalValidations;
      g.count++;
      return acc;
    }, {});

    const result = Object.entries(grouped)
      .map(([industry, g]) => ({
        industry,
        avgViability: Number(
          (g.totalViability / g.totalValidations).toFixed(1)
        ),
        avgMarket: Number((g.totalMarket / g.totalValidations).toFixed(1)),
        avgRisk: Number((g.totalRisk / g.totalValidations).toFixed(1)),
        totalValidations: g.totalValidations,
      }))
      .sort((a, b) => b.totalValidations - a.totalValidations);

    return NextResponse.json({ benchmarks: result, source: "database" });
  } catch (err: unknown) {
    console.error("Benchmarks error:", err instanceof Error ? err.message : "unknown error");
    return NextResponse.json(
      { error: "Failed to fetch benchmarks" },
      { status: 500 }
    );
  }
}
