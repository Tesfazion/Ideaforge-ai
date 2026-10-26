"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

function Counter({ end, suffix = "" }: { end: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const duration = 1600;
    const step = (end / duration) * 16;
    const timer = setInterval(() => {
      start += step;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [end]);
  return (
    <>
      {count.toLocaleString()}
      {suffix}
    </>
  );
}

const DIMENSIONS = [
  { name: "Problem severity", score: 85, accent: false },
  { name: "Market urgency", score: 78, accent: false },
  { name: "Market size", score: 88, accent: true },
  { name: "Competitive moat", score: 72, accent: false },
  { name: "Revenue potential", score: 76, accent: true },
  { name: "Founder–idea fit", score: 90, accent: false },
  { name: "Time to market", score: 82, accent: true },
  { name: "Scalability", score: 84, accent: false },
  { name: "Ease of replication", score: 68, accent: true },
];

const TRUST_POINTS = ["No credit card required", "9-dimension analysis", "Report in 30 seconds"];

export default function Hero() {
  return (
    <section className="hero-surface relative overflow-hidden pt-[7.5rem] pb-16 sm:pb-20">
      <div className="hero-grid pointer-events-none absolute inset-0" aria-hidden="true" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
          {/* Copy */}
          <div className="max-w-2xl">
            <motion.span
              className="eyebrow"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              Business idea validation
            </motion.span>

            <motion.h1
              className="mt-5 text-[2.5rem] font-bold leading-[1.08] tracking-tight text-ink sm:text-5xl lg:text-[3.5rem]"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.05 }}
            >
              Validate your idea
              <br />
              <span className="text-brand-strong">before you build it.</span>
            </motion.h1>

            <motion.p
              className="mt-6 max-w-xl text-base leading-relaxed text-copy sm:text-lg"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.12 }}
            >
              Get a structured 9-dimension analysis of any business idea in 30 seconds —
              market research, SWOT, competitor mapping, risk assessment, and a 7-day
              action plan you can actually execute.
            </motion.p>

            <motion.div
              className="mt-9 flex w-full flex-col gap-3 sm:w-auto sm:flex-row"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.18 }}
            >
              <Link href="/register" className="btn btn-primary btn-lg">
                Start validating free
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <Link href="#how-it-works" className="btn btn-secondary btn-lg">
                See how it works
              </Link>
            </motion.div>

            <motion.ul
              className="mt-8 flex flex-wrap gap-x-6 gap-y-2.5"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.26 }}
            >
              {TRUST_POINTS.map((point) => (
                <li key={point} className="flex items-center gap-2 text-sm text-muted">
                  <svg className="h-4 w-4 shrink-0 text-brand-strong" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  {point}
                </li>
              ))}
            </motion.ul>

            <motion.p
              className="mt-8 text-sm text-muted"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.34 }}
            >
              <span className="font-semibold text-ink">
                <Counter end={2847} suffix="+" />
              </span>{" "}
              ideas validated by founders and product teams.
            </motion.p>
          </div>

          {/* Product preview card */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="card overflow-hidden">
              <div className="flex items-center justify-between border-b border-line bg-surface-alt px-5 py-3">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-[#e2e8f0]" aria-hidden="true" />
                  <span className="h-2 w-2 rounded-full bg-[#e2e8f0]" aria-hidden="true" />
                  <span className="h-2 w-2 rounded-full bg-[#e2e8f0]" aria-hidden="true" />
                  <span className="ml-2 text-xs font-semibold uppercase tracking-[0.08em] text-muted">
                    Validation report
                  </span>
                </div>
                <span className="badge badge-success">Score 87</span>
              </div>

              <div className="p-5 sm:p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-muted">
                      Idea under review
                    </p>
                    <h2 className="mt-1 text-base font-bold text-ink">AI-powered tutoring platform</h2>
                  </div>
                  <span className="badge badge-neutral whitespace-nowrap">SaaS · Education</span>
                </div>

                <div className="mt-5 space-y-2.5">
                  {DIMENSIONS.map((dimension, index) => (
                    <div key={dimension.name} className="flex items-center gap-3">
                      <span className="w-[7.5rem] shrink-0 truncate text-xs text-copy">{dimension.name}</span>
                      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-[#eaf0f6]">
                        <motion.div
                          className="h-full rounded-full"
                          style={{
                            backgroundColor: dimension.accent
                              ? "var(--brand-orange)"
                              : "var(--brand-blue)",
                          }}
                          initial={{ width: 0 }}
                          animate={{ width: `${dimension.score}%` }}
                          transition={{ duration: 0.9, delay: 0.4 + index * 0.05, ease: "easeOut" }}
                        />
                      </div>
                      <span className="w-7 shrink-0 text-right text-xs font-semibold tabular-nums text-ink">
                        {dimension.score}
                      </span>
                    </div>
                  ))}
                </div>

                <dl className="mt-6 grid grid-cols-3 gap-3 border-t border-line pt-5">
                  {[
                    { label: "Analysis time", value: "30s" },
                    { label: "Dimensions", value: "9" },
                    { label: "Confidence", value: "94%" },
                  ].map((metric) => (
                    <div key={metric.label} className="rounded-lg border border-line bg-surface-alt px-3 py-2.5 text-center">
                      <dd className="text-lg font-bold text-ink">{metric.value}</dd>
                      <dt className="mt-0.5 text-[10px] font-semibold uppercase tracking-[0.06em] text-muted">
                        {metric.label}
                      </dt>
                    </div>
                  ))}
                </dl>
              </div>
            </div>

            <div className="card absolute -bottom-5 -left-4 hidden items-center gap-2.5 px-4 py-3 shadow-[var(--shadow-md)] sm:flex">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-soft text-brand-ink">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </span>
              <div>
                <p className="text-xs font-semibold text-ink">7-day action plan</p>
                <p className="text-[11px] text-muted">Generated with every report</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
