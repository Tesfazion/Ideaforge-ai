"use client";
import { useEffect, useState, useCallback, useMemo } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { api, Idea } from "@/lib/api";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import { AnimatedRing, MiniSparkline, ScoreRing, ContributionGrid } from "@/components/DashboardWidgets";
import StayInLoop from "@/components/StayInLoop";

const LazyPieChart = dynamic(() => import("@/components/LazyCharts").then((m) => m.LazyPieChart), {
  ssr: false,
  loading: () => <div className="h-[200px] animate-pulse rounded-lg bg-surface-alt" />,
});
const LazyDashboardBarChart = dynamic(() => import("@/components/LazyCharts").then((m) => m.LazyDashboardBarChart), {
  ssr: false,
  loading: () => <div className="h-[200px] animate-pulse rounded-lg bg-surface-alt" />,
});

const COLORS = ["#007ACC", "#EF842B", "#62AEE3", "#F6B875"];
const fadeUp = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } };
const stagger = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.04, delayChildren: 0.04 } } };

function StatusBadge({ status }: { status: string }) {
  const tone =
    status === "validated"
      ? "badge badge-success"
      : status === "failed"
        ? "badge badge-danger"
        : status === "processing"
          ? "badge badge-accent"
          : "badge badge-warning";
  return <span className={tone}>{status === "processing" ? "Processing" : status}</span>;
}

export default function DashboardPage() {
  const { user, token } = useAuth();
  const searchParams = useSearchParams();
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [filter, setFilter] = useState("all");
  const [sort, setSort] = useState("newest");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [loading, setLoading] = useState(true);
  const [retryingId, setRetryingId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"overview" | "ideas" | "analytics">("overview");

  useEffect(() => {
    if (token) {
      api.getIdeas(token).then((d) => setIdeas(d.ideas)).catch(() => {}).finally(() => setLoading(false));
    }
  }, [token]);

  const filtered = useMemo(() => ideas.filter((i) => {
    if (filter === "validated" && i.status !== "validated") return false;
    if (filter === "pending" && i.status !== "pending" && i.status !== "processing") return false;
    if (filter === "failed" && i.status !== "failed") return false;
    if (search && !i.title.toLowerCase().includes(search.toLowerCase()) && !i.description.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  }).sort((a, b) => {
    if (sort === "oldest") return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    if (sort === "score-high") return (b.report?.viabilityScore || 0) - (a.report?.viabilityScore || 0);
    if (sort === "score-low") return (a.report?.viabilityScore || 0) - (b.report?.viabilityScore || 0);
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  }), [ideas, filter, search, sort]);

  const stats = useMemo(() => {
    const validated = ideas.filter((i) => i.status === "validated").length;
    const failed = ideas.filter((i) => i.status === "failed").length;
    const pending = ideas.filter((i) => i.status === "pending" || i.status === "processing").length;
    const wr = ideas.filter((i) => i.report);
    const avgScore = wr.length > 0 ? Math.round(wr.reduce((s, i) => s + (i.report?.viabilityScore || 0), 0) / wr.length) : 0;
    const topScore = wr.length > 0 ? Math.max(...wr.map((i) => i.report?.viabilityScore || 0)) : 0;
    const winRate = wr.length > 0 ? Math.round((wr.filter((i) => (i.report?.viabilityScore || 0) >= 60).length / wr.length) * 100) : 0;
    return { validated, failed, pending, avgScore, topScore, winRate };
  }, [ideas]);

  const scoreDistribution = useMemo(() => [
    { name: "Excellent (80-100)", value: ideas.filter((i) => (i.report?.viabilityScore || 0) >= 80).length },
    { name: "Good (60-79)", value: ideas.filter((i) => { const s = i.report?.viabilityScore || 0; return s >= 60 && s < 80; }).length },
    { name: "Fair (40-59)", value: ideas.filter((i) => { const s = i.report?.viabilityScore || 0; return s >= 40 && s < 60; }).length },
    { name: "Poor (0-39)", value: ideas.filter((i) => (i.report?.viabilityScore || 0) < 40).length },
  ], [ideas]);

  const industryBreakdown = useMemo(() => {
    const c: Record<string, number> = {};
    ideas.forEach((i) => { const ind = i.industry || "Uncategorized"; c[ind] = (c[ind] || 0) + 1; });
    return Object.entries(c).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value).slice(0, 6);
  }, [ideas]);

  const recentIdeas = useMemo(() => [...ideas].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 8), [ideas]);
  const topIdeas = useMemo(() => ideas.filter((i) => i.report).sort((a, b) => (b.report?.viabilityScore || 0) - (a.report?.viabilityScore || 0)).slice(0, 5), [ideas]);

  const scoreTrend = useMemo(() => {
    return ideas.filter((i) => i.status === "validated" && i.report).sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()).slice(-7).map((i) => ({
      date: new Date(i.createdAt).toLocaleDateString(undefined, { month: "short", day: "numeric" }), score: i.report?.viabilityScore || 0,
    }));
  }, [ideas]);

  const sparklineData = useMemo(() => {
    return ideas.filter((i) => i.status === "validated" && i.report).sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()).slice(-10).map((i) => i.report?.viabilityScore || 0);
  }, [ideas]);

  const streak = useMemo(() => {
    if (ideas.length === 0) return 0;
    const dates = [...new Set(ideas.map((i) => new Date(i.createdAt).toDateString()))].sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
    let count = 0; const today = new Date(); today.setHours(0, 0, 0, 0); let check = new Date(today);
    for (const d of dates) { const dd = new Date(d); dd.setHours(0, 0, 0, 0); const diff = (check.getTime() - dd.getTime()) / 86400000; if (diff === 0 || (count === 0 && diff <= 1)) { count++; check = dd; } else if (diff > 1) break; }
    return count;
  }, [ideas]);

  const aiInsights = useMemo(() => {
    const tips: { icon: string; title: string; desc: string; action?: string; actionHref?: string }[] = [];
    if (ideas.length === 0) tips.push({ icon: "M12 4v16m8-8H4", title: "Start your journey", desc: "Submit your first idea and get AI-powered validation in under 30 seconds.", action: "Validate first idea", actionHref: "/dashboard/new" });
    if (stats.avgScore > 0 && stats.avgScore < 50) tips.push({ icon: "M9.663 17h4.673M12 3v1", title: "Scores need attention", desc: `Your average is ${stats.avgScore}%. Try the AI generator for stronger concepts.`, action: "Generate ideas", actionHref: "/dashboard/generate" });
    if (stats.winRate >= 70 && stats.validated >= 3) tips.push({ icon: "M5 13l4 4L19 7", title: "Strong portfolio", desc: `${stats.winRate}% of your reports score 60 or above across ${stats.validated} validations.`, action: "Validate another", actionHref: "/dashboard/new" });
    if (ideas.length >= 3 && ideas.length < 10) tips.push({ icon: "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6", title: "Building momentum", desc: `You have validated ${ideas.length} ideas. Pro removes the monthly limit.`, action: "Compare plans", actionHref: "/dashboard/upgrade" });
    if (industryBreakdown.length > 0) {
      const top = industryBreakdown[0];
      tips.push({ icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2 2z", title: `Focus: ${top.name}`, desc: `${top.value} idea${top.value > 1 ? "s" : ""} in this space. Look for adjacent markets.` });
    }
    return tips.slice(0, 4);
  }, [ideas, stats, industryBreakdown]);

  const handleRetry = useCallback(async (ideaId: string) => {
    if (!token) return; setRetryingId(ideaId);
    try { await api.retryIdea(token, ideaId); setIdeas((p) => p.map((i) => i.id === ideaId ? { ...i, status: "pending" } : i)); } catch {} finally { setRetryingId(null); }
  }, [token]);

  const handleDelete = useCallback(async (ideaId: string) => {
    if (!token) return;
    try { await api.deleteIdea(token, ideaId); setIdeas((p) => p.filter((i) => i.id !== ideaId)); } catch {}
  }, [token]);

  const getGreeting = () => { const h = new Date().getHours(); return h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening"; };
  const plan = user?.plan || "free";
  const planLabel = plan === "enterprise" ? "Enterprise" : plan === "pro" ? "Founder Pro" : "Explorer";
  const monthlyTokens = user?.monthlyTokens ?? 5;
  const tokensLeft = user?.tokens ?? 0;
  const allowanceUsed = Math.min(100, Math.max(0, ((monthlyTokens - tokensLeft) / Math.max(1, monthlyTokens)) * 100));

  const tabs = [
    { id: "overview" as const, label: "Overview", icon: "M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zm0 8a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zm10 0a1 1 0 011-1h4a1 1 0 011 1v6a1 1 0 01-1 1h-4a1 1 0 01-1-1v-6z" },
    { id: "ideas" as const, label: "My ideas", icon: "M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" },
    { id: "analytics" as const, label: "Analytics", icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2 2z" },
  ];

  const kpis = [
    { label: "Total ideas", value: ideas.length, sub: `${stats.validated} validated`, icon: "M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" },
    { label: "Validated", value: stats.validated, sub: `${stats.failed} failed`, icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" },
    { label: plan === "free" ? "Credits left" : "Win rate", value: plan === "free" ? tokensLeft : stats.winRate, displayValue: plan === "free" ? `${tokensLeft}` : ideas.length ? `${stats.winRate}%` : "—", sub: plan === "free" ? "resets monthly" : "score ≥ 60", icon: "M13 10V3L4 14h7v7l9-11h-7" },
    { label: "Average score", value: stats.avgScore, displayValue: ideas.length ? `${stats.avgScore}%` : "—", sub: ideas.length ? `Peak ${stats.topScore}%` : "after your first report", icon: "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" },
  ];

  return (
    <div className="dashboard-overview mx-auto max-w-[1400px] space-y-6">
      {/* Greeting */}
      <motion.section
        variants={fadeUp}
        initial="hidden"
        animate="show"
        className="dashboard-welcome px-6 py-7 sm:px-8"
      >
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl font-bold tracking-tight text-ink sm:text-[1.75rem]">
                {getGreeting()}, {user?.name?.split(" ")[0]}
              </h1>
              {streak > 0 && <span className="badge badge-warning">{streak} day streak</span>}
            </div>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-copy">
              Your ideas, research, and next steps in one focused workspace.
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span className="badge badge-neutral">{planLabel} plan</span>
              {plan === "free" && <span className="badge badge-neutral">{tokensLeft} of {monthlyTokens} validations left</span>}
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Link href="/dashboard/generate" className="btn btn-secondary">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              AI generate
            </Link>
            <Link href="/dashboard/new" className="btn btn-primary">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              Validate idea
            </Link>
          </div>
        </div>
      </motion.section>

      {/* Plan allowance */}
      <section className="card p-5 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-brand-ink">
              {plan === "free" ? "Your monthly allowance" : plan === "enterprise" ? "Your workspace" : "Your founder workspace"}
            </p>
            <h2 className="mt-1.5 text-lg font-bold text-ink">
              {plan === "free"
                ? `${tokensLeft} of ${monthlyTokens} validations left`
                : plan === "enterprise"
                  ? "Unlimited validations · API access"
                  : "Unlimited validations · full reports"}
            </h2>
            <p className="mt-1 text-sm leading-relaxed text-copy">
              {plan === "free"
                ? "Your allowance renews monthly. Upgrade for unlimited validations and report delivery by email."
                : plan === "enterprise"
                  ? "Manage API keys and analyze ideas from your own tools."
                  : "Export reports as PDF, CSV, or Word and email them to yourself."}
            </p>
          </div>
          <Link
            href={plan === "enterprise" ? "/dashboard/api-keys" : "/dashboard/upgrade"}
            className={plan === "pro" ? "btn btn-secondary shrink-0" : "btn btn-primary shrink-0"}
          >
            {plan === "enterprise" ? "Manage API keys" : plan === "pro" ? "Manage plan" : "Compare plans"}
          </Link>
        </div>
        {plan === "free" && (
          <div className="mt-4">
            <div className="h-1.5 overflow-hidden rounded-full bg-surface-sunken">
              <div className="h-full rounded-full bg-brand transition-all" style={{ width: `${allowanceUsed}%` }} />
            </div>
            <p className="mt-1.5 text-[11px] text-muted">{Math.round(allowanceUsed)}% of this month&apos;s allowance used</p>
          </div>
        )}
      </section>

      {/* Tabs */}
      <div className="dashboard-tabs inline-flex items-center gap-1" role="tablist" aria-label="Dashboard views">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            role="tab"
            aria-selected={activeTab === tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`dashboard-tab ${activeTab === tab.id ? "is-active" : ""}`}
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d={tab.icon} />
            </svg>
            {tab.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {activeTab === "overview" && (
          <motion.div key="overview" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.18 }} className="space-y-6">
            {/* KPI row */}
            <motion.div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4" variants={stagger} initial="hidden" animate="show">
              {kpis.map((stat) => (
                <motion.div key={stat.label} variants={fadeUp} className="card p-4 lg:p-5">
                  <div className="mb-3 flex items-start justify-between">
                    <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-soft text-brand-ink">
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6} aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" d={stat.icon} />
                      </svg>
                    </span>
                    {sparklineData.length > 0 && <MiniSparkline data={sparklineData} />}
                  </div>
                  <p className="font-heading text-2xl font-bold tabular-nums text-ink lg:text-3xl">
                    {stat.displayValue ?? stat.value}
                  </p>
                  <p className="mt-1 text-xs font-medium text-muted">{stat.label}</p>
                  <p className="mt-0.5 text-[11px] text-muted">{stat.sub}</p>
                </motion.div>
              ))}
            </motion.div>

            {ideas.length === 0 ? (
              <section className="dashboard-empty p-6 sm:p-8 lg:p-10">
                <div className="dashboard-empty-copy max-w-2xl">
                  <span className="dashboard-eyebrow">Your workspace is ready</span>
                  <h2>Turn your first idea into a clear next step.</h2>
                  <p>
                    Get a structured review of your market, customers, competition, and risks.
                    Your reports and progress will appear here.
                  </p>
                  <div className="mt-6 flex flex-wrap gap-3">
                    <Link href="/dashboard/new" className="btn btn-primary">Validate your first idea</Link>
                    <Link href="/dashboard/generate" className="dashboard-secondary-action">Explore ideas with AI</Link>
                  </div>
                </div>
                <div className="dashboard-steps mt-8 grid gap-3 sm:grid-cols-3">
                  <div><span>01</span><strong>Describe</strong><p>Share the business idea you want to explore.</p></div>
                  <div><span>02</span><strong>Review</strong><p>See market signals, strengths, and key risks.</p></div>
                  <div><span>03</span><strong>Decide</strong><p>Use your report to plan a practical next step.</p></div>
                </div>
              </section>
            ) : (
              <div className="grid gap-4 lg:grid-cols-3 lg:gap-6">
                <div className="space-y-4 lg:col-span-2">
                  {/* Trend */}
                  <motion.section className="card p-5" variants={fadeUp} initial="hidden" animate="show">
                    <div className="mb-4 flex items-start justify-between gap-3">
                      <div>
                        <h3 className="text-sm font-bold text-ink">Score trend</h3>
                        <p className="mt-0.5 text-[11px] text-muted">Validation performance over time</p>
                      </div>
                      {scoreTrend.length > 1 && (
                        <span className="badge badge-success">+{scoreTrend.length} validations</span>
                      )}
                    </div>
                    {scoreTrend.length > 1 ? (
                      <LazyDashboardBarChart data={scoreTrend.map((d) => ({ name: d.date, value: d.score }))} />
                    ) : (
                      <div className="flex h-[180px] flex-col items-center justify-center text-center">
                        <span className="mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-brand-soft text-brand-ink">
                          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                          </svg>
                        </span>
                        <p className="text-xs text-muted">Validate at least 2 ideas to see your trend</p>
                        <Link href="/dashboard/new" className="btn btn-link mt-2 text-xs">Submit an idea →</Link>
                      </div>
                    )}
                  </motion.section>

                  {/* Activity */}
                  <motion.section className="card p-5" variants={fadeUp} initial="hidden" animate="show">
                    <div className="mb-4 flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-bold text-ink">Activity</h3>
                        <p className="mt-0.5 text-[11px] text-muted">Validation activity over the last 16 weeks</p>
                      </div>
                      <div className="flex items-center gap-1.5 text-[10px] text-muted">
                        <span>Less</span>
                        {[0.28, 0.48, 0.7, 1].map((o, i) => (
                          <span key={i} className="h-3 w-3 rounded-[3px]" style={{ backgroundColor: `rgba(0,122,204,${o})` }} />
                        ))}
                        <span>More</span>
                      </div>
                    </div>
                    <ContributionGrid ideas={ideas} />
                  </motion.section>

                  {/* Insights */}
                  {aiInsights.length > 0 && (
                    <motion.section variants={fadeUp} initial="hidden" animate="show">
                      <div className="mb-3 flex items-center gap-2">
                        <span className="flex h-6 w-6 items-center justify-center rounded-md bg-brand-strong text-white">
                          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0" />
                          </svg>
                        </span>
                        <h3 className="text-sm font-bold text-ink">Recommendations</h3>
                      </div>
                      <div className="grid gap-3 sm:grid-cols-2">
                        {aiInsights.map((insight, i) => (
                          <div key={i} className="card p-4">
                            <div className="flex items-start gap-3">
                              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-surface-alt text-brand-ink">
                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.7} aria-hidden="true">
                                  <path strokeLinecap="round" strokeLinejoin="round" d={insight.icon} />
                                </svg>
                              </span>
                              <div className="min-w-0 flex-1">
                                <p className="text-[13px] font-semibold text-ink">{insight.title}</p>
                                <p className="mt-1 text-[11px] leading-relaxed text-copy">{insight.desc}</p>
                              </div>
                            </div>
                            {insight.action && insight.actionHref && (
                              <Link href={insight.actionHref} className="btn btn-secondary btn-sm mt-3 w-full">
                                {insight.action}
                              </Link>
                            )}
                          </div>
                        ))}
                      </div>
                    </motion.section>
                  )}

                  {/* Recent validations table */}
                  <motion.section className="card overflow-hidden" variants={fadeUp} initial="hidden" animate="show">
                    <div className="flex items-center justify-between border-b border-line px-5 py-4">
                      <div>
                        <h3 className="text-sm font-bold text-ink">Recent validations</h3>
                        <p className="mt-0.5 text-[11px] text-muted">Latest activity across your portfolio</p>
                      </div>
                      <Link href="/dashboard/insights" className="btn btn-link text-xs">View all →</Link>
                    </div>

                    {loading ? (
                      <div className="space-y-3 p-5">
                        {[...Array(4)].map((_, i) => (
                          <div key={i} className="flex animate-pulse items-center gap-3">
                            <div className="h-9 w-9 rounded-lg bg-surface-alt" />
                            <div className="flex-1">
                              <div className="mb-1.5 h-3 w-3/4 rounded bg-surface-alt" />
                              <div className="h-2 w-1/2 rounded bg-surface-alt" />
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : recentIdeas.length === 0 ? (
                      <div className="px-5 py-12 text-center">
                        <p className="text-sm font-medium text-ink">No validations yet</p>
                        <p className="mt-1 text-xs text-muted">Submit an idea to see your timeline here</p>
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="data-table">
                          <thead>
                            <tr>
                              <th scope="col">Idea</th>
                              <th scope="col">Status</th>
                              <th scope="col" className="text-right">Score</th>
                              <th scope="col">Created</th>
                              <th scope="col"><span className="sr-only">Actions</span></th>
                            </tr>
                          </thead>
                          <tbody>
                            {recentIdeas.map((idea) => (
                              <tr key={idea.id}>
                                <td>
                                  <Link href={`/dashboard/idea/${idea.id}`} className="block min-w-0">
                                    <span className="block max-w-[22rem] truncate font-medium text-ink hover:text-brand">
                                      {idea.title}
                                    </span>
                                    <span className="mt-0.5 block text-[11px] text-muted">
                                      {idea.industry || "General"}
                                    </span>
                                  </Link>
                                </td>
                                <td><StatusBadge status={idea.status} /></td>
                                <td className="text-right font-semibold tabular-nums text-ink">
                                  {idea.report ? `${idea.report.viabilityScore}%` : "—"}
                                </td>
                                <td className="whitespace-nowrap text-xs text-muted">
                                  {new Date(idea.createdAt).toLocaleDateString()}
                                </td>
                                <td className="text-right">
                                  <button
                                    type="button"
                                    onClick={() => handleDelete(idea.id)}
                                    className="rounded-md p-1.5 text-muted transition-colors hover:bg-danger-soft hover:text-danger-ink"
                                    aria-label={`Delete ${idea.title}`}
                                  >
                                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.7} aria-hidden="true">
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </motion.section>
                </div>

                {/* Right rail */}
                <div className="space-y-4">
                  <motion.section className="card p-5 text-center" variants={fadeUp} initial="hidden" animate="show">
                    <h3 className="mb-4 text-sm font-bold text-ink">Portfolio health</h3>
                    {ideas.length > 0 ? (
                      <>
                        <AnimatedRing value={stats.winRate} size={140} strokeWidth={10} color="#ef842b" sublabel="Win rate" />
                        <dl className="mt-5 grid grid-cols-3 gap-2 border-t border-line pt-4">
                          <div>
                            <dd className="font-heading text-lg font-bold text-success-ink">{stats.validated}</dd>
                            <dt className="text-[10px] text-muted">Passed</dt>
                          </div>
                          <div>
                            <dd className="font-heading text-lg font-bold text-warning-ink">{stats.pending}</dd>
                            <dt className="text-[10px] text-muted">Pending</dt>
                          </div>
                          <div>
                            <dd className="font-heading text-lg font-bold text-danger-ink">{stats.failed}</dd>
                            <dt className="text-[10px] text-muted">Failed</dt>
                          </div>
                        </dl>
                      </>
                    ) : (
                      <div className="py-8">
                        <p className="text-xs text-muted">No data yet</p>
                      </div>
                    )}
                  </motion.section>

                  <motion.section className="card p-5" variants={fadeUp} initial="hidden" animate="show">
                    <h3 className="mb-3 text-sm font-bold text-ink">Quick actions</h3>
                    <div className="space-y-2">
                      {[
                        { href: "/dashboard/new", label: "Validate new idea", desc: "AI validation in 30 seconds", icon: "M12 4v16m8-8H4" },
                        { href: "/dashboard/generate", label: "AI idea generator", desc: "Brainstorm opportunities", icon: "M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3" },
                        { href: "/dashboard/compare", label: "Compare ideas", desc: "Side-by-side analysis", icon: "M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2z" },
                      ].map((action) => (
                        <Link
                          key={action.href}
                          href={action.href}
                          className="flex items-center gap-3 rounded-lg border border-line px-3 py-2.5 transition-colors hover:border-line-strong hover:bg-surface-alt"
                        >
                          <span className="flex h-8 w-8 items-center justify-center rounded-md bg-surface-alt text-brand-ink">
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.7} aria-hidden="true">
                              <path strokeLinecap="round" strokeLinejoin="round" d={action.icon} />
                            </svg>
                          </span>
                          <span className="min-w-0">
                            <span className="block text-[13px] font-medium text-ink">{action.label}</span>
                            <span className="block text-[10px] text-muted">{action.desc}</span>
                          </span>
                        </Link>
                      ))}
                    </div>
                  </motion.section>

                  <motion.section className="card p-5" variants={fadeUp} initial="hidden" animate="show">
                    <h3 className="text-sm font-bold text-ink">Stay in the loop</h3>
                    <p className="mt-0.5 text-[11px] text-muted">Product updates and new validation models.</p>
                    <div className="mt-3">
                      <StayInLoop compact />
                    </div>
                  </motion.section>

                  {ideas.length > 0 && (
                    <>
                      <motion.section className="card p-5" variants={fadeUp} initial="hidden" animate="show">
                        <h3 className="mb-3 text-sm font-bold text-ink">Score distribution</h3>
                        {loading ? <div className="h-[160px] animate-pulse rounded-lg bg-surface-alt" /> : <LazyPieChart data={scoreDistribution} colors={COLORS} />}
                      </motion.section>

                      {topIdeas.length > 0 && (
                        <motion.section className="card p-5" variants={fadeUp} initial="hidden" animate="show">
                          <h3 className="mb-3 text-sm font-bold text-ink">Top performing</h3>
                          <div className="space-y-1">
                            {topIdeas.map((idea, i) => (
                              <Link
                                key={idea.id}
                                href={`/dashboard/idea/${idea.id}`}
                                className="flex items-center gap-3 rounded-lg px-2 py-2 transition-colors hover:bg-surface-alt"
                              >
                                <span className="w-4 text-[11px] font-bold text-muted">#{i + 1}</span>
                                <ScoreRing score={idea.report?.viabilityScore || 0} size={32} />
                                <span className="min-w-0 flex-1">
                                  <span className="block truncate text-[13px] font-medium text-ink">{idea.title}</span>
                                  <span className="block text-[10px] text-muted">{idea.industry}</span>
                                </span>
                              </Link>
                            ))}
                          </div>
                        </motion.section>
                      )}

                      {industryBreakdown.length > 0 && (
                        <motion.section className="card p-5" variants={fadeUp} initial="hidden" animate="show">
                          <h3 className="mb-3 text-sm font-bold text-ink">Top industries</h3>
                          <div className="space-y-3">
                            {industryBreakdown.map((ind, i) => (
                              <div key={ind.name} className="flex items-center gap-3">
                                <span className="w-4 text-[11px] font-bold text-muted">{i + 1}</span>
                                <div className="flex-1">
                                  <div className="mb-1 flex items-center justify-between">
                                    <span className="truncate text-xs font-medium text-copy">{ind.name}</span>
                                    <span className="text-xs font-bold text-ink">{ind.value}</span>
                                  </div>
                                  <div className="h-1.5 overflow-hidden rounded-full bg-surface-sunken">
                                    <div className="h-full rounded-full bg-brand" style={{ width: `${(ind.value / ideas.length) * 100}%` }} />
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </motion.section>
                      )}
                    </>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        )}

        {activeTab === "ideas" && (
          <motion.div key="ideas" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.18 }} className="space-y-4">
            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="relative flex-1">
                <svg className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="search"
                  placeholder="Search ideas…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  aria-label="Search ideas"
                  className="input pl-10"
                />
              </div>
              <select value={filter} onChange={(e) => setFilter(e.target.value)} aria-label="Filter by status" className="select sm:w-40">
                <option value="all">All status</option>
                <option value="validated">Validated</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed</option>
              </select>
              <select value={sort} onChange={(e) => setSort(e.target.value)} aria-label="Sort ideas" className="select sm:w-44">
                <option value="newest">Newest first</option>
                <option value="oldest">Oldest first</option>
                <option value="score-high">Highest score</option>
                <option value="score-low">Lowest score</option>
              </select>
              <div className="flex overflow-hidden rounded-lg border border-line-strong">
                <button
                  type="button"
                  onClick={() => setView("grid")}
                  aria-pressed={view === "grid"}
                  aria-label="Grid view"
                  className={`px-3 py-2 transition-colors ${view === "grid" ? "bg-brand-soft text-brand-ink" : "text-muted hover:bg-surface-alt"}`}
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={() => setView("list")}
                  aria-pressed={view === "list"}
                  aria-label="List view"
                  className={`px-3 py-2 transition-colors ${view === "list" ? "bg-brand-soft text-brand-ink" : "text-muted hover:bg-surface-alt"}`}
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                  </svg>
                </button>
              </div>
            </div>

            {loading ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="card animate-pulse p-5">
                    <div className="mb-3 flex items-start justify-between">
                      <div className="h-5 w-16 rounded-full bg-surface-alt" />
                      <div className="h-5 w-10 rounded bg-surface-alt" />
                    </div>
                    <div className="mb-2 h-4 w-3/4 rounded bg-surface-alt" />
                    <div className="mb-1 h-3 w-full rounded bg-surface-alt" />
                    <div className="h-3 w-2/3 rounded bg-surface-alt" />
                  </div>
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className="py-20 text-center">
                <span className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-brand-soft text-brand-ink">
                  <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                  </svg>
                </span>
                <h3 className="text-lg font-bold text-ink">{search ? "No matching ideas" : "No ideas yet"}</h3>
                <p className="mx-auto mt-1 max-w-sm text-sm text-copy">
                  {search ? "Try a different search term." : "Submit your first business idea to get AI-powered validation."}
                </p>
                {!search && <Link href="/dashboard/new" className="btn btn-primary mt-4">Submit your first idea</Link>}
              </div>
            ) : view === "grid" ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {filtered.map((idea) => (
                  <Link key={idea.id} href={`/dashboard/idea/${idea.id}`} className="card card-hover block p-5">
                    <div className="mb-3 flex items-start justify-between">
                      <StatusBadge status={idea.status} />
                      {idea.report && <ScoreRing score={idea.report.viabilityScore} size={40} />}
                    </div>
                    <h3 className="line-clamp-1 font-semibold text-ink">{idea.title}</h3>
                    <p className="mt-1 line-clamp-2 text-sm text-copy">{idea.description}</p>
                    {idea.status === "failed" && (
                      <button
                        type="button"
                        onClick={(e) => { e.preventDefault(); handleRetry(idea.id); }}
                        disabled={retryingId === idea.id}
                        className="btn btn-secondary btn-sm mt-3 w-full"
                      >
                        {retryingId === idea.id ? "Retrying…" : "Retry validation"}
                      </button>
                    )}
                    <div className="mt-3 flex items-center gap-2 text-xs text-muted">
                      <span>{idea.industry}</span>
                      <span className="h-1 w-1 rounded-full bg-[var(--line-strong)]" />
                      <span>{new Date(idea.createdAt).toLocaleDateString()}</span>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="space-y-2">
                {filtered.map((idea) => (
                  <Link key={idea.id} href={`/dashboard/idea/${idea.id}`} className="card card-hover flex items-center gap-4 p-4">
                    <div className="min-w-0 flex-1">
                      <div className="mb-1 flex items-center gap-2">
                        <h3 className="truncate font-semibold text-ink">{idea.title}</h3>
                        <StatusBadge status={idea.status} />
                      </div>
                      <p className="truncate text-sm text-copy">{idea.description}</p>
                    </div>
                    <div className="shrink-0 text-right">
                      {idea.report ? (
                        <p className="font-heading text-xl font-bold text-ink">{idea.report.viabilityScore}%</p>
                      ) : (
                        <p className="text-sm text-muted">—</p>
                      )}
                      <p className="text-xs text-muted">{new Date(idea.createdAt).toLocaleDateString()}</p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {activeTab === "analytics" && (
          <motion.div key="analytics" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.18 }} className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-3">
              {[
                { label: "Validated", value: stats.validated, tone: "text-success-ink" },
                { label: "Pending", value: stats.pending, tone: "text-warning-ink" },
                { label: "Failed", value: stats.failed, tone: "text-danger-ink" },
              ].map((s) => (
                <div key={s.label} className="card p-5 text-center">
                  <p className={`font-heading text-3xl font-bold ${s.tone}`}>{s.value}</p>
                  <p className="mt-1 text-xs text-muted">{s.label}</p>
                </div>
              ))}
            </div>
            <div className="grid gap-4 lg:grid-cols-2">
              <div className="card p-5">
                <h3 className="mb-4 text-sm font-bold text-ink">Score distribution</h3>
                {loading ? <div className="h-[200px] animate-pulse rounded-lg bg-surface-alt" /> : <LazyPieChart data={scoreDistribution} colors={COLORS} />}
              </div>
              <div className="card p-5">
                <h3 className="mb-4 text-sm font-bold text-ink">Score trend</h3>
                {scoreTrend.length > 1 ? (
                  <LazyDashboardBarChart data={scoreTrend.map((d) => ({ name: d.date, value: d.score }))} />
                ) : (
                  <div className="flex h-[200px] items-center justify-center text-xs text-muted">Need more data points</div>
                )}
              </div>
            </div>
            {industryBreakdown.length > 0 && (
              <div className="card p-5">
                <h3 className="mb-4 text-sm font-bold text-ink">Industry breakdown</h3>
                <div className="space-y-3">
                  {industryBreakdown.map((ind, i) => (
                    <div key={ind.name} className="flex items-center gap-4">
                      <span className="w-6 text-xs font-bold text-muted">{i + 1}.</span>
                      <div className="flex-1">
                        <div className="mb-1.5 flex items-center justify-between">
                          <span className="text-sm font-medium text-copy">{ind.name}</span>
                          <span className="text-sm font-bold text-ink">{ind.value} ideas</span>
                        </div>
                        <div className="h-2 overflow-hidden rounded-full bg-surface-sunken">
                          <div className="h-full rounded-full bg-brand" style={{ width: `${(ind.value / ideas.length) * 100}%` }} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
