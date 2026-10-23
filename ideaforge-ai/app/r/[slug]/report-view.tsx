"use client";

import { useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";

const LazyRadarChart = dynamic(
  () => import("@/components/LazyCharts").then((m) => m.LazyRadarChart),
  {
    ssr: false,
    loading: () => (
      <div className="h-[280px] bg-white/[0.05] rounded-xl animate-pulse" />
    ),
  }
);

interface Idea {
  id: string;
  title: string;
  description: string;
  targetAudience: string;
  industry: string;
  publicSlug: string | null;
  viewCount: number;
}

interface ReportData {
  id: string;
  viabilityScore: number;
  marketScore: number;
  competitorScore: number;
  monetizationScore: number;
  riskScore: number;
  marketAnalysis: string;
  competitorOverview: string;
  nineDimensions: string;
  skepticAnalysis: string;
  marketSizing: string;
  sources: string;
  swotAnalysis: string;
  confidence: number;
  adversarialVerdict: string;
}

interface NineDimension {
  name: string;
  score: number;
  maxScore: number;
  label: string;
  description: string;
  icon: string;
}

interface SourceLink {
  title: string;
  url: string;
  context: string;
}

interface SkepticAnalysis {
  overallVerdict: string;
  executionRisks: string[];
  regulatoryRisks: string[];
  timingRisks: string[];
  structuralFlaws: string[];
  keyChallenge: string;
  brutalScore: number;
}

interface MarketSizing {
  tam: string;
  tamValue: string;
  sam: string;
  samValue: string;
  som: string;
  somValue: string;
  reasoning: string;
}

interface SWOTAnalysis {
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
}

function safeJsonParse<T>(value: string, fallback: T): T {
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

function ScoreCircle({
  score,
  label,
  color,
}: {
  score: number;
  label: string;
  color: string;
}) {
  const r = 36;
  const c = 2 * Math.PI * r;
  return (
    <div className="flex flex-col items-center">
      <svg width="90" height="90">
        <circle
          cx="45"
          cy="45"
          r={r}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth="6"
        />
        <circle
          cx="45"
          cy="45"
          r={r}
          fill="none"
          stroke={color}
          strokeWidth="6"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - score / 100)}
          strokeLinecap="round"
          transform="rotate(-90 45 45)"
          className="transition-all duration-1000"
        />
        <text
          x="45"
          y="45"
          textAnchor="middle"
          dominantBaseline="central"
          className="text-lg font-bold fill-current text-white"
        >
          {score}
        </text>
      </svg>
      <span className="text-xs text-slate-400 mt-1">{label}</span>
    </div>
  );
}

function DimensionBar({ dim }: { dim: NineDimension }) {
  const pct = (dim.score / dim.maxScore) * 100;
  const color =
    dim.score >= 7 ? "#22C55E" : dim.score >= 5 ? "#F59E0B" : "#EF4444";
  const dimIcons: Record<string, string> = {
    problem:
      "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z",
    urgency:
      "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
    market:
      "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
    moat:
      "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
    replica:
      "M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15",
    revenue:
      "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
    fit:
      "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z",
    time: "M13 10V3L4 14h7v7l9-11h-7z",
    scale: "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6",
  };
  return (
    <div className="group">
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-white/[0.05] flex items-center justify-center">
            <svg
              className="w-3.5 h-3.5 text-slate-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d={dimIcons[dim.icon] || dimIcons.problem}
              />
            </svg>
          </div>
          <span className="text-sm font-medium text-white">{dim.name}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 italic hidden sm:block">
            {dim.label}
          </span>
          <span className="text-sm font-bold" style={{ color }}>
            {dim.score}/{dim.maxScore}
          </span>
        </div>
      </div>
      <div className="w-full h-2.5 rounded-full bg-white/[0.05] overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-1000 ease-out"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
      <p className="text-[11px] text-slate-400 mt-1 pl-8">
        {dim.description}
      </p>
    </div>
  );
}

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.08,
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number],
    },
  }),
};

export default function ReportView({
  idea,
  report,
}: {
  idea: Idea;
  report: ReportData;
}) {
  const parsedDimensions = useMemo(
    () => safeJsonParse<NineDimension[]>(report.nineDimensions, []),
    [report.nineDimensions]
  );
  const parsedSources = useMemo(
    () => safeJsonParse<SourceLink[]>(report.sources, []),
    [report.sources]
  );
  const parsedSkeptic = useMemo(
    () => safeJsonParse<SkepticAnalysis | null>(report.skepticAnalysis, null),
    [report.skepticAnalysis]
  );
  const parsedMarketSizing = useMemo(
    () => safeJsonParse<MarketSizing | null>(report.marketSizing, null),
    [report.marketSizing]
  );
  const parsedSWOT = useMemo(
    () => safeJsonParse<SWOTAnalysis | null>(report.swotAnalysis, null),
    [report.swotAnalysis]
  );

  const radarData = useMemo(
    () => [
      { subject: "Market", value: report.marketScore },
      { subject: "Competition", value: report.competitorScore },
      { subject: "Monetization", value: report.monetizationScore },
      { subject: "Risk (inv)", value: 100 - report.riskScore },
      { subject: "Viability", value: report.viabilityScore },
    ],
    [report]
  );

  const verdict = useMemo(() => {
    if (report.viabilityScore >= 80)
      return {
        text: "Excellent",
        color: "bg-emerald-500",
        desc: "This idea has strong potential. Proceed with confidence!",
      };
    if (report.viabilityScore >= 60)
      return {
        text: "Good",
        color: "bg-sky-500",
        desc: "Solid idea with manageable risks. Refine your approach.",
      };
    if (report.viabilityScore >= 40)
      return {
        text: "Fair",
        color: "bg-amber-500",
        desc: "Needs significant improvements. Consider the analysis below.",
      };
    return {
      text: "Needs Work",
      color: "bg-red-500",
      desc: "Major challenges ahead. Review the full analysis for next steps.",
    };
  }, [report.viabilityScore]);

  return (
    <div className="min-h-screen bg-[#060a13]">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-sky-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-violet-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 space-y-8">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-center"
        >
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-white transition-colors"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            IdeaForge
          </Link>
        </motion.div>

        <motion.div
          custom={0}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="card-base rounded-2xl p-6 sm:p-8 text-center"
        >
          <div
            className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-white text-sm font-semibold ${verdict.color} mb-4`}
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            {verdict.text}
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
            {idea.title}
          </h1>
          <p className="text-6xl sm:text-7xl font-bold text-white mb-1">
            {report.viabilityScore}
            <span className="text-2xl text-slate-500">/100</span>
          </p>
          <p className="text-slate-400 text-sm mb-2">{verdict.desc}</p>

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.03] border border-white/[0.06] mb-6">
            <svg
              className="w-3.5 h-3.5 text-sky-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="text-xs text-slate-400">
              Confidence: <span className="text-white font-semibold">{report.confidence}%</span>
            </span>
          </div>

          <div className="flex justify-center gap-6 flex-wrap">
            <ScoreCircle score={report.marketScore} label="Market" color="#6366F1" />
            <ScoreCircle
              score={report.competitorScore}
              label="Competition"
              color="#8B5CF6"
            />
            <ScoreCircle
              score={report.monetizationScore}
              label="Monetization"
              color="#22C55E"
            />
            <ScoreCircle
              score={100 - report.riskScore}
              label="Safety"
              color="#F59E0B"
            />
          </div>
        </motion.div>

        {parsedDimensions.length > 0 && (
          <motion.div
            custom={1}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="card-base rounded-2xl p-6 sm:p-8"
          >
            <div className="flex items-center gap-2 mb-5">
              <div className="w-8 h-8 rounded-lg bg-blue-500/15 flex items-center justify-center">
                <svg
                  className="w-4 h-4 text-blue-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                  />
                </svg>
              </div>
              <h2 className="text-base font-semibold text-white">
                Nine-Dimension Index
              </h2>
            </div>

            <div className="grid lg:grid-cols-2 gap-8 items-start">
              <div className="space-y-4">
                {parsedDimensions.map((dim, i) => (
                  <DimensionBar key={i} dim={dim} />
                ))}
              </div>
              <div>
                <LazyRadarChart data={radarData} />
              </div>
            </div>
          </motion.div>
        )}

        {parsedSWOT && (
          <motion.div
            custom={2}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="card-base rounded-2xl p-6 sm:p-8 space-y-4"
          >
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-amber-500/15 flex items-center justify-center">
                <svg
                  className="w-4 h-4 text-amber-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                  />
                </svg>
              </div>
              <h2 className="text-base font-semibold text-white">
                SWOT Analysis
              </h2>
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4">
                <p className="text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-2">
                  Strengths
                </p>
                <ul className="space-y-1">
                  {(parsedSWOT.strengths || []).map((item: string, i: number) => (
                    <li
                      key={i}
                      className="text-xs text-slate-300 flex items-start gap-2"
                    >
                      <span className="text-emerald-400 mt-0.5">-</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-4">
                <p className="text-xs font-semibold text-red-400 uppercase tracking-wider mb-2">
                  Weaknesses
                </p>
                <ul className="space-y-1">
                  {(parsedSWOT.weaknesses || []).map(
                    (item: string, i: number) => (
                      <li
                        key={i}
                        className="text-xs text-slate-300 flex items-start gap-2"
                      >
                        <span className="text-red-400 mt-0.5">-</span>
                        {item}
                      </li>
                    )
                  )}
                </ul>
              </div>
              <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-4">
                <p className="text-xs font-semibold text-blue-400 uppercase tracking-wider mb-2">
                  Opportunities
                </p>
                <ul className="space-y-1">
                  {(parsedSWOT.opportunities || []).map(
                    (item: string, i: number) => (
                      <li
                        key={i}
                        className="text-xs text-slate-300 flex items-start gap-2"
                      >
                        <span className="text-blue-400 mt-0.5">-</span>
                        {item}
                      </li>
                    )
                  )}
                </ul>
              </div>
              <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4">
                <p className="text-xs font-semibold text-amber-400 uppercase tracking-wider mb-2">
                  Threats
                </p>
                <ul className="space-y-1">
                  {(parsedSWOT.threats || []).map(
                    (item: string, i: number) => (
                      <li
                        key={i}
                        className="text-xs text-slate-300 flex items-start gap-2"
                      >
                        <span className="text-amber-400 mt-0.5">-</span>
                        {item}
                      </li>
                    )
                  )}
                </ul>
              </div>
            </div>
          </motion.div>
        )}

        {parsedSkeptic && (
          <motion.div
            custom={3}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="card-base rounded-2xl p-6 sm:p-8 border-2 border-red-500/30 space-y-4"
          >
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-red-500/15 flex items-center justify-center">
                <svg
                  className="w-4 h-4 text-red-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              </div>
              <div>
                <h2 className="text-base font-semibold text-white">
                  Skeptic Analysis
                </h2>
                <p className="text-[10px] text-slate-500 uppercase tracking-wider">
                  Adversarial stress-test
                </p>
              </div>
            </div>

            {report.adversarialVerdict && (
              <div className="bg-red-500/10 rounded-xl px-5 py-4 border border-red-500/20">
                <p className="text-xs uppercase tracking-wider text-red-400 font-semibold mb-1">
                  Adversarial Verdict
                </p>
                <p className="text-sm text-slate-200 leading-relaxed">
                  {report.adversarialVerdict}
                </p>
              </div>
            )}

            <div className="bg-red-500/10 rounded-xl px-5 py-4 border border-red-500/20">
              <p className="text-xs uppercase tracking-wider text-red-400 font-semibold mb-1">
                Brutal Verdict
              </p>
              <p className="text-sm text-slate-200 leading-relaxed">
                {parsedSkeptic.overallVerdict}
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-3">
              {parsedSkeptic.executionRisks?.length > 0 && (
                <div className="rounded-xl border border-white/[0.06] p-4">
                  <p className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold mb-2">
                    Execution Risks
                  </p>
                  <ul className="space-y-1">
                    {parsedSkeptic.executionRisks.map((risk, i) => (
                      <li
                        key={i}
                        className="text-xs text-slate-300 flex items-start gap-2"
                      >
                        <span className="text-red-400 mt-0.5">*</span>
                        {risk}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {parsedSkeptic.regulatoryRisks?.length > 0 && (
                <div className="rounded-xl border border-white/[0.06] p-4">
                  <p className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold mb-2">
                    Regulatory Risks
                  </p>
                  <ul className="space-y-1">
                    {parsedSkeptic.regulatoryRisks.map((risk, i) => (
                      <li
                        key={i}
                        className="text-xs text-slate-300 flex items-start gap-2"
                      >
                        <span className="text-red-400 mt-0.5">*</span>
                        {risk}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {parsedSkeptic.timingRisks?.length > 0 && (
                <div className="rounded-xl border border-white/[0.06] p-4">
                  <p className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold mb-2">
                    Timing Risks
                  </p>
                  <ul className="space-y-1">
                    {parsedSkeptic.timingRisks.map((risk, i) => (
                      <li
                        key={i}
                        className="text-xs text-slate-300 flex items-start gap-2"
                      >
                        <span className="text-red-400 mt-0.5">*</span>
                        {risk}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {parsedSkeptic.structuralFlaws?.length > 0 && (
                <div className="rounded-xl border border-white/[0.06] p-4">
                  <p className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold mb-2">
                    Structural Flaws
                  </p>
                  <ul className="space-y-1">
                    {parsedSkeptic.structuralFlaws.map((risk, i) => (
                      <li
                        key={i}
                        className="text-xs text-slate-300 flex items-start gap-2"
                      >
                        <span className="text-red-400 mt-0.5">*</span>
                        {risk}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between bg-white/[0.03] rounded-xl px-5 py-3 border border-white/[0.06]">
              <div>
                <p className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">
                  Biggest Challenge
                </p>
                <p className="text-sm text-slate-200 font-medium">
                  {parsedSkeptic.keyChallenge}
                </p>
              </div>
              <div className="text-right">
                <p className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">
                  Brutal Score
                </p>
                <p
                  className={`text-2xl font-bold ${
                    parsedSkeptic.brutalScore >= 70
                      ? "text-red-400"
                      : parsedSkeptic.brutalScore >= 40
                        ? "text-amber-400"
                        : "text-emerald-400"
                  }`}
                >
                  {parsedSkeptic.brutalScore}
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {parsedMarketSizing && (
          <motion.div
            custom={4}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="card-base rounded-2xl p-6 sm:p-8 space-y-4"
          >
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-500/15 flex items-center justify-center">
                <svg
                  className="w-4 h-4 text-blue-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <h2 className="text-base font-semibold text-white">
                Market Sizing (TAM / SAM / SOM)
              </h2>
            </div>

            <div className="grid sm:grid-cols-3 gap-3">
              <div className="rounded-xl border border-sky-500/20 bg-sky-500/5 p-4 text-center">
                <p className="text-[10px] uppercase tracking-wider text-sky-400 font-semibold mb-1">
                  TAM
                </p>
                <p className="text-xl font-bold text-white">
                  {parsedMarketSizing.tamValue || "N/A"}
                </p>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  {parsedMarketSizing.tam}
                </p>
              </div>
              <div className="rounded-xl border border-violet-500/20 bg-violet-500/5 p-4 text-center">
                <p className="text-[10px] uppercase tracking-wider text-violet-400 font-semibold mb-1">
                  SAM
                </p>
                <p className="text-xl font-bold text-white">
                  {parsedMarketSizing.samValue || "N/A"}
                </p>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  {parsedMarketSizing.sam}
                </p>
              </div>
              <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4 text-center">
                <p className="text-[10px] uppercase tracking-wider text-emerald-400 font-semibold mb-1">
                  SOM
                </p>
                <p className="text-xl font-bold text-white">
                  {parsedMarketSizing.somValue || "N/A"}
                </p>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  {parsedMarketSizing.som}
                </p>
              </div>
            </div>

            {parsedMarketSizing.reasoning && (
              <div className="bg-white/[0.03] rounded-xl px-4 py-3 border border-white/[0.06]">
                <p className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold mb-1">
                  Reasoning
                </p>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {parsedMarketSizing.reasoning}
                </p>
              </div>
            )}
          </motion.div>
        )}

        {parsedSources.length > 0 && (
          <motion.div
            custom={5}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="card-base rounded-2xl p-6 sm:p-8"
          >
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/15 flex items-center justify-center">
                <svg
                  className="w-4 h-4 text-emerald-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                  />
                </svg>
              </div>
              <h2 className="text-base font-semibold text-white">
                Verified Sources
              </h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {parsedSources.map((source, i) => (
                <a
                  key={i}
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-white/[0.06] bg-white/[0.03] hover:bg-blue-500/10 hover:border-blue-500/30 transition-all"
                >
                  <div className="w-6 h-6 rounded-md bg-emerald-500/15 flex items-center justify-center shrink-0">
                    <svg
                      className="w-3 h-3 text-emerald-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-white truncate max-w-[200px]">
                      {source.title}
                    </p>
                    <p className="text-[10px] text-slate-400 truncate max-w-[200px]">
                      {source.context}
                    </p>
                  </div>
                  <svg
                    className="w-3.5 h-3.5 text-slate-500 group-hover:text-blue-400 shrink-0 transition-colors"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                </a>
              ))}
            </div>
          </motion.div>
        )}

        <motion.div
          custom={6}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="card-base rounded-2xl p-8 text-center space-y-4"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs font-medium">
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
            Generated by AI
          </div>
          <h2 className="text-xl font-bold text-white">
            Validate your own idea in 30 seconds
          </h2>
          <p className="text-sm text-slate-400 max-w-md mx-auto">
            Get a comprehensive 9-dimension analysis with market sizing, SWOT,
            competitor mapping, and a 7-day action plan.
          </p>
          <Link
            href="/register"
            className="inline-flex items-center gap-2 gradient-btn text-white px-6 py-3 rounded-xl text-sm font-semibold transition-all"
          >
            Start Validating for Free
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </Link>
          <p className="text-[10px] text-slate-600">
            Powered by IdeaForge AI
          </p>
        </motion.div>
      </div>
    </div>
  );
}
