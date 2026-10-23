"use client";
import { useEffect, useState, useCallback, useMemo } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { api, Idea, Announcement } from "@/lib/api";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import { AnimatedRing, MiniSparkline, ScoreRing, ContributionGrid } from "@/components/DashboardWidgets";
import StayInLoop from "@/components/StayInLoop";

const LazyPieChart = dynamic(() => import("@/components/LazyCharts").then((m) => m.LazyPieChart), { ssr: false, loading: () => <div className="h-[200px] bg-white/[0.03] rounded-xl animate-pulse" /> });
const LazyDashboardBarChart = dynamic(() => import("@/components/LazyCharts").then((m) => m.LazyDashboardBarChart), { ssr: false, loading: () => <div className="h-[200px] bg-white/[0.03] rounded-xl animate-pulse" /> });

const COLORS = ["#6366F1", "#818CF8", "#A5B4FC", "#C7D2FE"];
const fadeUp = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } };
const stagger = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.04, delayChildren: 0.05 } } };
const scaleIn = { hidden: { opacity: 0, scale: 0.95 }, show: { opacity: 1, scale: 1, transition: { type: "spring" as const, stiffness: 200, damping: 20 } } };

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
  const [latestNews, setLatestNews] = useState<Announcement | null>(null);
  const [newsDismissed, setNewsDismissed] = useState(false);

  useEffect(() => {
    if (token) {
      api.getIdeas(token).then((d) => setIdeas(d.ideas)).catch(() => {}).finally(() => setLoading(false));
    }
  }, [token]);

  useEffect(() => {
    if (!token) return;
    api.getAnnouncements(token)
      .then((d) => {
        const news = d.announcements[0] ?? null;
        setLatestNews(news);
        setNewsDismissed(news ? localStorage.getItem(`ideaforge_news_${news.id}`) === "1" : false);
      })
      .catch(() => {});
  }, [token]);

  const dismissNews = () => {
    if (!latestNews) return;
    localStorage.setItem(`ideaforge_news_${latestNews.id}`, "1");
    setNewsDismissed(true);
  };

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
    const tips: { icon: string; title: string; desc: string; color: string; action?: string; actionHref?: string }[] = [];
    if (ideas.length === 0) tips.push({ icon: "M12 4v16m8-8H4", title: "Start your journey", desc: "Submit your first idea and get AI-powered validation in under 30 seconds.", color: "from-sky-500 to-orange-500", action: "Validate First Idea", actionHref: "/dashboard/new" });
    if (stats.avgScore > 0 && stats.avgScore < 50) tips.push({ icon: "M9.663 17h4.673M12 3v1", title: "Score needs attention", desc: `Your average is ${stats.avgScore}%. Try the AI Generator for higher-quality ideas.`, color: "from-amber-500 to-orange-500", action: "Generate Ideas", actionHref: "/dashboard/generate" });
    if (stats.winRate >= 70 && stats.validated >= 3) tips.push({ icon: "M5 13l4 4L19 7", title: "Outstanding performance!", desc: `${stats.winRate}% win rate across ${stats.validated} validations.`, color: "from-emerald-500 to-teal-500", action: "Keep Going", actionHref: "/dashboard/new" });
    if (ideas.length >= 3 && ideas.length < 10) tips.push({ icon: "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6", title: "Building momentum", desc: `You've validated ${ideas.length} ideas. Upgrade to Pro for unlimited.`, color: "from-violet-500 to-orange-500", action: "Go Pro", actionHref: "/dashboard/upgrade" });
    if (industryBreakdown.length > 0) { const top = industryBreakdown[0]; tips.push({ icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2 2z", title: `Focus: ${top.name}`, desc: `${top.value} idea${top.value > 1 ? "s" : ""} in this space. Consider adjacent markets.`, color: "from-blue-500 to-sky-500" }); }
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

  const tabs = [
    { id: "overview" as const, label: "Overview", icon: "M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zm0 8a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zm10 0a1 1 0 011-1h4a1 1 0 011 1v6a1 1 0 01-1 1h-4a1 1 0 01-1-1v-6z" },
    { id: "ideas" as const, label: "My Ideas", icon: "M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" },
    { id: "analytics" as const, label: "Analytics", icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2 2z" },
  ];

  const IdeaStatusBadge = ({ status }: { status: string }) => (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${status === "validated" ? "bg-emerald-500/15 text-emerald-400" : status === "processing" ? "bg-blue-500/15 text-blue-400" : status === "failed" ? "bg-red-500/15 text-red-400" : "bg-amber-500/15 text-amber-400"}`}>
      {status === "failed" ? "failed" : status}
    </span>
  );

  return (
    <div className="max-w-[1400px] mx-auto space-y-6">
      <motion.div variants={scaleIn} initial="hidden" animate="show" className="relative rounded-2xl overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-sky-500/[0.10] via-sky-400/[0.04] to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#ffffff]/40" />
        <div className="absolute inset-0 bg-slate-50/60 backdrop-blur-2xl" />
        <div className="relative px-6 py-8 sm:px-8 lg:px-10">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="space-y-3">
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">{getGreeting()}, {user?.name}</h1>
                {streak > 0 && (
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/20">
                    <svg className="w-3.5 h-3.5 text-amber-400" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" /></svg>
                    <span className="text-[11px] font-bold text-amber-400">{streak} day streak</span>
                  </div>
                )}
              </div>
              <p className="text-sm text-slate-400 max-w-lg">Your ideas, research, and next steps in one focused workspace.</p>
              <span className="inline-flex items-center rounded-full border border-sky-400/20 bg-sky-400/10 px-2.5 py-1 text-[11px] font-semibold text-sky-200">{planLabel} plan</span>
            </div>
            <div className="flex gap-2 flex-wrap">
              <Link href="/dashboard/generate" className="px-4 py-2.5 rounded-xl text-sm font-semibold bg-white/[0.06] border border-white/[0.06] text-slate-300 hover:bg-white/[0.1] transition-all inline-flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
                AI Generate
              </Link>
              <Link href="/dashboard/new" className="gradient-btn text-slate-900 px-5 py-2.5 rounded-xl text-sm font-semibold inline-flex items-center gap-2 shadow-lg shadow-sky-500/20">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
                Validate Idea
              </Link>
            </div>
          </div>
        </div>
      </motion.div>

      {latestNews && !newsDismissed && (
        <motion.section
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-2xl border border-sky-400/20 bg-sky-500/[0.07] p-5 sm:p-6"
        >
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-md bg-sky-500/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-sky-200">
              <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.069-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" /></svg>
              {latestNews.tag}
            </span>
            {latestNews.version && <span className="text-xs font-semibold text-sky-300">v{latestNews.version}</span>}
            <span className="text-[10px] text-slate-500">{new Date(latestNews.createdAt).toLocaleDateString()}</span>
          </div>
          <h2 className="mt-2 pr-8 text-base font-semibold text-slate-900">{latestNews.title}</h2>
          <p className="mt-1 max-w-3xl text-sm leading-relaxed text-slate-400">{latestNews.body}</p>
          <Link href="/dashboard/news" className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-sky-300 hover:text-sky-200 transition-colors">
            All updates
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
          </Link>
          <button onClick={dismissNews} aria-label="Dismiss update" className="absolute right-3 top-3 rounded-lg p-1.5 text-slate-500 hover:bg-white/[0.06] hover:text-slate-300 transition-colors">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </motion.section>
      )}

      <section className="card-premium rounded-2xl border border-sky-400/15 p-5 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-sky-300">{plan === "free" ? "Your monthly allowance" : plan === "enterprise" ? "Your workspace" : "Your founder workspace"}</p>
            <h2 className="mt-1 text-lg font-semibold text-slate-900">{plan === "free" ? `${user?.tokens ?? 0} of ${user?.monthlyTokens ?? 5} validations left` : plan === "enterprise" ? "Unlimited validations · API access" : "Unlimited validations · full reports"}</h2>
            <p className="mt-1 text-sm text-slate-400">{plan === "free" ? "Your allowance renews monthly. Upgrade for unlimited validations and report delivery by email." : plan === "enterprise" ? "Manage API keys and analyze ideas from your own tools." : "Export reports as PDF, CSV, or Word document and email them to yourself."}</p>
          </div>
          {plan === "enterprise" ? <Link href="/dashboard/api-keys" className="shrink-0 rounded-xl bg-sky-500 px-4 py-2.5 text-center text-sm font-semibold text-slate-900 hover:bg-sky-400">Manage API keys</Link> : plan === "pro" ? <Link href="/dashboard/upgrade" className="shrink-0 rounded-xl border border-white/10 px-4 py-2.5 text-center text-sm font-semibold text-slate-200 hover:bg-white/5">Manage plan</Link> : <Link href="/dashboard/upgrade" className="shrink-0 rounded-xl bg-sky-500 px-4 py-2.5 text-center text-sm font-semibold text-slate-900 hover:bg-sky-400">Compare plans</Link>}
        </div>
        {plan === "free" && <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/10"><div className="h-full rounded-full bg-sky-400 transition-all" style={{ width: `${Math.min(100, Math.max(0, ((user?.monthlyTokens ?? 5) - (user?.tokens ?? 0)) / Math.max(1, user?.monthlyTokens ?? 5) * 100))}%` }} /></div>}
      </section>

      <div className="flex items-center gap-1 p-1 rounded-xl bg-white/[0.03] border border-white/[0.04] w-fit">
        {tabs.map((tab) => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-[13px] font-medium transition-all ${activeTab === tab.id ? "bg-white/[0.08] text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-300 hover:bg-white/[0.04]"}`}>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d={tab.icon} /></svg>
            {tab.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {activeTab === "overview" && (
          <motion.div key="overview" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }} className="space-y-6">
            <motion.div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4" variants={stagger} initial="hidden" animate="show">
              {[
                { label: "Total Ideas", value: ideas.length, sub: `${stats.validated} validated`, icon: "M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10", color: "from-sky-500 to-sky-600" },
                { label: "Validated", value: stats.validated, sub: `${stats.failed} failed`, icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z", color: "from-sky-500 to-sky-600" },
                { label: plan === "free" ? "Credits left" : "Win Rate", value: plan === "free" ? (user?.tokens ?? 0) : stats.winRate, displayValue: plan === "free" ? `${user?.tokens ?? 0}` : `${stats.winRate}%`, sub: plan === "free" ? "resets monthly" : "success rate", icon: "M13 10V3L4 14h7v7l9-11h-7", color: "from-sky-500 to-sky-600" },
                { label: "Avg Score", value: stats.avgScore, displayValue: `${stats.avgScore}%`, sub: `Peak: ${stats.topScore}%`, icon: "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6", color: "from-sky-500 to-sky-600" },
              ].map((stat) => (
                <motion.div key={stat.label} variants={fadeUp} className="card-premium rounded-xl p-4 lg:p-5 group">
                  <div className="flex items-start justify-between mb-3">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg`}>
                      <svg className="w-5 h-5 text-slate-900" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d={stat.icon} /></svg>
                    </div>
                    {sparklineData.length > 0 && <MiniSparkline data={sparklineData} color="#6366F1" />}
                  </div>
                  <p className="text-2xl lg:text-3xl font-bold text-slate-900">{stat.displayValue || stat.value}</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">{stat.sub}</p>
                  <p className="text-xs text-slate-400 font-medium mt-1">{stat.label}</p>
                </motion.div>
              ))}
            </motion.div>

            <div className="grid lg:grid-cols-3 gap-4 lg:gap-6">
              <div className="lg:col-span-2 space-y-4">
                <motion.div className="card-premium rounded-xl p-5" variants={fadeUp} initial="hidden" animate="show">
                  <div className="flex items-center justify-between mb-4">
                    <div><h3 className="text-sm font-semibold text-slate-900">Score Trend</h3><p className="text-[11px] text-slate-500 mt-0.5">Your validation performance over time</p></div>
                    {scoreTrend.length > 1 && (<div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10"><svg className="w-3 h-3 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg><span className="text-[11px] font-semibold text-emerald-400">+{scoreTrend.length} validations</span></div>)}
                  </div>
                  {scoreTrend.length > 1 ? (<LazyDashboardBarChart data={scoreTrend.map((d) => ({ name: d.date, value: d.score }))} />) : (
                    <div className="flex flex-col items-center justify-center h-[180px] text-center">
                      <div className="w-12 h-12 rounded-xl bg-sky-500/10 flex items-center justify-center mb-3"><svg className="w-6 h-6 text-sky-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg></div>
                      <p className="text-xs text-slate-500">Validate at least 2 ideas to see your trend</p>
                      <Link href="/dashboard/new" className="mt-2 text-xs font-medium text-sky-400 hover:text-sky-300 transition-colors">Submit your first idea →</Link>
                    </div>
                  )}
                </motion.div>

                <motion.div className="card-premium rounded-xl p-5" variants={fadeUp} initial="hidden" animate="show">
                  <div className="flex items-center justify-between mb-4">
                    <div><h3 className="text-sm font-semibold text-slate-900">Activity</h3><p className="text-[11px] text-slate-500 mt-0.5">Your validation activity over the last 16 weeks</p></div>
                    <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
                      <span>Less</span>
                      {[0.03, 0.3, 0.5, 0.7, 0.9].map((o, i) => (<div key={i} className="w-3 h-3 rounded-[3px]" style={{ backgroundColor: `rgba(99,102,241,${o})` }} />))}
                      <span>More</span>
                    </div>
                  </div>
                  <ContributionGrid ideas={ideas} />
                </motion.div>

                {aiInsights.length > 0 && (
                  <motion.div variants={fadeUp} initial="hidden" animate="show">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-5 h-5 rounded-md bg-sky-500 flex items-center justify-center"><svg className="w-3 h-3 text-slate-900" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0" /></svg></div>
                      <h3 className="text-sm font-semibold text-slate-900">AI Insights</h3>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-3">
                      {aiInsights.map((insight, i) => (
                        <div key={i} className="card-premium rounded-xl p-4">
                          <div className="flex items-start gap-3">
                            <div className="w-9 h-9 rounded-xl bg-sky-500/15 text-sky-300 flex items-center justify-center shrink-0">
                              <svg className="w-4 h-4 text-slate-900" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d={insight.icon} /></svg>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-[13px] font-semibold text-slate-900">{insight.title}</p>
                              <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">{insight.desc}</p>
                            </div>
                          </div>
                          {insight.action && insight.actionHref && (<Link href={insight.actionHref} className="mt-3 block w-full text-center text-[11px] font-semibold py-2 rounded-lg bg-white/[0.04] text-slate-300 hover:bg-white/[0.08] hover:text-slate-900 transition-all">{insight.action}</Link>)}
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

                <motion.div className="card-premium rounded-xl p-5" variants={fadeUp} initial="hidden" animate="show">
                  <div className="flex items-center justify-between mb-4">
                    <div><h3 className="text-sm font-semibold text-slate-900">Recent Validations</h3><p className="text-[11px] text-slate-500 mt-0.5">Latest activity across your portfolio</p></div>
                    <Link href="/dashboard/insights" className="text-[11px] font-medium text-sky-400 hover:text-sky-300 transition-colors">View all →</Link>
                  </div>
                  {loading ? (<div className="space-y-3">{[...Array(4)].map((_, i) => (<div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] animate-pulse"><div className="w-10 h-10 rounded-xl bg-white/[0.05]" /><div className="flex-1"><div className="w-3/4 h-3 bg-white/[0.05] rounded mb-1.5" /><div className="w-1/2 h-2 bg-white/[0.05] rounded" /></div></div>))}</div>) : recentIdeas.length === 0 ? (
                    <div className="text-center py-10"><div className="w-14 h-14 rounded-2xl bg-sky-500/10 flex items-center justify-center mx-auto mb-3"><svg className="w-7 h-7 text-sky-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" /></svg></div><p className="text-sm text-slate-400 mb-1">No validations yet</p><p className="text-[11px] text-slate-500">Submit an idea to see your timeline here</p></div>
                  ) : (
                    <div className="relative">
                      <div className="absolute left-[19px] top-4 bottom-4 w-px bg-white/[0.04]" />
                      <div className="space-y-1">
                        {recentIdeas.map((idea) => (
                          <Link key={idea.id} href={`/dashboard/idea/${idea.id}`} className="relative flex items-center gap-3 p-3 rounded-xl hover:bg-white/[0.03] transition-all group pl-2">
                            <div className={`relative z-10 w-[22px] h-[22px] rounded-full flex items-center justify-center shrink-0 ${idea.status === "validated" ? "bg-emerald-500/20 ring-2 ring-emerald-500/30" : idea.status === "failed" ? "bg-red-500/20 ring-2 ring-red-500/30" : idea.status === "processing" ? "bg-blue-500/20 ring-2 ring-blue-500/30" : "bg-amber-500/20 ring-2 ring-amber-500/30"}`}>
                              {idea.status === "validated" ? (<svg className="w-3 h-3 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>) : idea.status === "failed" ? (<svg className="w-3 h-3 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>) : idea.status === "processing" ? (<div className="w-2.5 h-2.5 border-[1.5px] border-blue-400 border-t-transparent rounded-full animate-spin" />) : (<svg className="w-3 h-3 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-[13px] font-medium text-slate-900 truncate group-hover:text-sky-400 transition-colors">{idea.title}</p>
                              <p className="text-[10px] text-slate-500">{idea.industry || "General"} · {new Date(idea.createdAt).toLocaleDateString()}</p>
                            </div>
                            <div className="shrink-0 flex items-center gap-2">
                              {idea.report ? (<ScoreRing score={idea.report.viabilityScore} size={36} />) : (<span className="text-[11px] text-slate-600">—</span>)}
                              <button onClick={(e) => { e.preventDefault(); handleDelete(idea.id); }} className="p-1.5 rounded-lg text-slate-600 hover:text-red-400 hover:bg-red-500/10 transition-colors opacity-0 group-hover:opacity-100">
                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                              </button>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              </div>

              <div className="space-y-4">
                <motion.div className="card-premium rounded-xl p-5 text-center" variants={fadeUp} initial="hidden" animate="show">
                  <h3 className="text-sm font-semibold text-slate-900 mb-4">Portfolio Health</h3>
                  {ideas.length > 0 ? (<><AnimatedRing value={stats.winRate} size={140} strokeWidth={10} color="#6366F1" sublabel="Win Rate" /><div className="grid grid-cols-3 gap-2 mt-5 pt-4 border-t border-white/[0.04]"><div><p className="text-lg font-bold text-emerald-400">{stats.validated}</p><p className="text-[10px] text-slate-500">Passed</p></div><div><p className="text-lg font-bold text-amber-400">{stats.pending}</p><p className="text-[10px] text-slate-500">Pending</p></div><div><p className="text-lg font-bold text-red-400">{stats.failed}</p><p className="text-[10px] text-slate-500">Failed</p></div></div></>) : (<div className="py-8"><div className="w-16 h-16 rounded-full bg-white/[0.03] flex items-center justify-center mx-auto mb-3"><svg className="w-8 h-8 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}><path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg></div><p className="text-xs text-slate-500">No data yet</p></div>)}
                </motion.div>

                <motion.div className="card-premium rounded-xl p-5" variants={fadeUp} initial="hidden" animate="show">
                  <h3 className="text-sm font-semibold text-slate-900 mb-3">Quick Actions</h3>
                  <div className="space-y-2">
                    {[
                      { href: "/dashboard/new", label: "Validate New Idea", desc: "AI validation in 30s", icon: "M12 4v16m8-8H4", grad: "from-sky-500/10 to-orange-500/10 hover:from-sky-500/20 hover:to-orange-500/20 border-sky-500/20", ibg: "bg-sky-500/20 text-sky-400" },
                      { href: "/dashboard/generate", label: "AI Idea Generator", desc: "Brainstorm opportunities", icon: "M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3", grad: "from-amber-500/10 to-orange-500/10 hover:from-amber-500/20 hover:to-orange-500/20 border-amber-500/20", ibg: "bg-amber-500/20 text-amber-400" },
                      { href: "/dashboard/compare", label: "Compare Ideas", desc: "Side-by-side analysis", icon: "M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2z", grad: "from-emerald-500/10 to-teal-500/10 hover:from-emerald-500/20 hover:to-teal-500/20 border-emerald-500/20", ibg: "bg-emerald-500/20 text-emerald-400" },
                    ].map((a) => (
                      <Link key={a.href} href={a.href} className="flex items-center gap-3 p-3 rounded-xl bg-sky-500/[0.03] hover:bg-sky-500/[0.08] border border-sky-400/15 transition-all group">
                        <div className="w-9 h-9 rounded-lg bg-sky-500/15 text-sky-300 flex items-center justify-center group-hover:scale-105 transition-transform">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d={a.icon} /></svg>
                        </div>
                        <div><p className="text-sm font-medium text-slate-900">{a.label}</p><p className="text-[10px] text-slate-400">{a.desc}</p></div>
                      </Link>
                    ))}
                  </div>
                </motion.div>

                <motion.div className="card-premium rounded-xl p-5" variants={fadeUp} initial="hidden" animate="show">
                  <h3 className="text-sm font-semibold text-slate-900 mb-1">Stay in the loop</h3>
                  <p className="text-[11px] text-slate-500 mb-1">Product updates, releases, and news from Sunshine Tech Solution.</p>
                  <StayInLoop compact />
                </motion.div>

                {ideas.length > 0 && (<>
                  <motion.div className="card-premium rounded-xl p-5" variants={fadeUp} initial="hidden" animate="show">
                    <h3 className="text-sm font-semibold text-slate-900 mb-3">Score Distribution</h3>
                    {loading ? <div className="h-[160px] bg-white/[0.03] rounded-xl animate-pulse" /> : <LazyPieChart data={scoreDistribution} colors={COLORS} />}
                  </motion.div>
                  {topIdeas.length > 0 && (
                    <motion.div className="card-premium rounded-xl p-5" variants={fadeUp} initial="hidden" animate="show">
                      <h3 className="text-sm font-semibold text-slate-900 mb-3">Top Performing</h3>
                      <div className="space-y-2">
                        {topIdeas.map((idea, i) => (
                          <Link key={idea.id} href={`/dashboard/idea/${idea.id}`} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/[0.03] transition-all group">
                            <span className="text-[11px] font-bold text-slate-600 w-4">#{i + 1}</span>
                            <ScoreRing score={idea.report?.viabilityScore || 0} size={32} />
                            <div className="flex-1 min-w-0">
                              <p className="text-[13px] font-medium text-slate-900 truncate group-hover:text-sky-400 transition-colors">{idea.title}</p>
                              <p className="text-[10px] text-slate-500">{idea.industry}</p>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </motion.div>
                  )}
                  {industryBreakdown.length > 0 && (
                    <motion.div className="card-premium rounded-xl p-5" variants={fadeUp} initial="hidden" animate="show">
                      <h3 className="text-sm font-semibold text-slate-900 mb-3">Top Industries</h3>
                      <div className="space-y-2.5">
                        {industryBreakdown.map((ind, i) => (
                          <div key={ind.name} className="flex items-center gap-3">
                            <span className="text-[11px] font-bold text-slate-600 w-4">{i + 1}</span>
                            <div className="flex-1"><div className="flex items-center justify-between mb-1"><span className="text-xs font-medium text-slate-300 truncate">{ind.name}</span><span className="text-xs font-bold text-slate-900">{ind.value}</span></div><div className="h-1.5 rounded-full bg-white/[0.04] overflow-hidden"><div className="h-full rounded-full bg-gradient-to-r from-sky-500 to-amber-500 transition-all duration-700" style={{ width: `${(ind.value / ideas.length) * 100}%` }} /></div></div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </>)}
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === "ideas" && (
          <motion.div key="ideas" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }} className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                <input type="text" placeholder="Search ideas..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/[0.05] border border-white/[0.06] text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500/30 transition-all placeholder:text-slate-500" />
              </div>
              <select value={filter} onChange={(e) => setFilter(e.target.value)} className="px-4 py-2.5 rounded-xl bg-white/[0.05] border border-white/[0.06] text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 appearance-none cursor-pointer">
                <option value="all" className="bg-slate-50">All Status</option>
                <option value="validated" className="bg-slate-50">Validated</option>
                <option value="pending" className="bg-slate-50">Pending</option>
                <option value="failed" className="bg-slate-50">Failed</option>
              </select>
              <select value={sort} onChange={(e) => setSort(e.target.value)} className="px-4 py-2.5 rounded-xl bg-white/[0.05] border border-white/[0.06] text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 appearance-none cursor-pointer">
                <option value="newest" className="bg-slate-50">Newest First</option>
                <option value="oldest" className="bg-slate-50">Oldest First</option>
                <option value="score-high" className="bg-slate-50">Highest Score</option>
                <option value="score-low" className="bg-slate-50">Lowest Score</option>
              </select>
              <div className="flex bg-white/[0.05] border border-white/[0.06] rounded-xl overflow-hidden">
                <button onClick={() => setView("grid")} className={`px-3 py-2 transition-colors ${view === "grid" ? "bg-sky-500/15 text-sky-400" : "text-slate-500 hover:text-slate-300"}`}><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg></button>
                <button onClick={() => setView("list")} className={`px-3 py-2 transition-colors ${view === "list" ? "bg-sky-500/15 text-sky-400" : "text-slate-500 hover:text-slate-300"}`}><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16" /></svg></button>
              </div>
            </div>

            {loading ? (<div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">{[...Array(6)].map((_, i) => (<div key={i} className="card-premium rounded-xl p-5 animate-pulse"><div className="flex items-start justify-between mb-3"><div className="w-16 h-5 bg-white/[0.05] rounded-full" /><div className="w-10 h-5 bg-white/[0.05] rounded" /></div><div className="w-3/4 h-4 bg-white/[0.05] rounded mb-2" /><div className="w-full h-3 bg-white/[0.05] rounded mb-1" /><div className="w-2/3 h-3 bg-white/[0.05] rounded" /></div>))}</div>) : filtered.length === 0 ? (
              <div className="text-center py-20"><div className="w-16 h-16 rounded-2xl bg-sky-500/10 flex items-center justify-center mx-auto mb-4"><svg className="w-8 h-8 text-sky-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" /></svg></div><h3 className="text-lg font-semibold text-slate-900">{search ? "No matching ideas" : "No ideas yet"}</h3><p className="text-slate-400 text-sm mt-1 mb-4">{search ? "Try a different search term" : "Submit your first business idea to get AI-powered validation"}</p>{!search && <Link href="/dashboard/new" className="gradient-btn text-slate-900 px-5 py-2.5 rounded-xl text-sm font-semibold inline-block shadow-lg shadow-sky-500/25">Submit Your First Idea</Link>}</div>
            ) : view === "grid" ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filtered.map((idea) => (
                  <Link key={idea.id} href={`/dashboard/idea/${idea.id}`} className="card-premium rounded-xl p-5 block group">
                    <div className="flex items-start justify-between mb-3"><IdeaStatusBadge status={idea.status} />{idea.report && <ScoreRing score={idea.report.viabilityScore} size={40} />}</div>
                    <h3 className="font-semibold text-slate-900 mb-1 line-clamp-1 group-hover:text-sky-400 transition-colors">{idea.title}</h3>
                    <p className="text-sm text-slate-400 line-clamp-2 mb-3">{idea.description}</p>
                    {idea.status === "failed" && (<button onClick={(e) => { e.preventDefault(); handleRetry(idea.id); }} disabled={retryingId === idea.id} className="w-full text-center text-xs font-medium text-red-400 hover:text-red-300 py-1.5 rounded-lg hover:bg-red-500/10 transition-colors disabled:opacity-50 flex items-center justify-center gap-1.5 mb-2"><svg className={`w-3.5 h-3.5 ${retryingId === idea.id ? "animate-spin" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>{retryingId === idea.id ? "Retrying..." : "Retry Validation"}</button>)}
                    <div className="flex items-center gap-2 text-xs text-slate-500"><span>{idea.industry}</span><span className="w-1 h-1 rounded-full bg-slate-600" /><span>{new Date(idea.createdAt).toLocaleDateString()}</span></div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="space-y-2">
                {filtered.map((idea) => (
                  <Link key={idea.id} href={`/dashboard/idea/${idea.id}`} className="card-premium rounded-xl p-4 flex items-center gap-4 group">
                    <div className="flex-1 min-w-0"><div className="flex items-center gap-2 mb-1"><h3 className="font-semibold text-slate-900 truncate group-hover:text-sky-400 transition-colors">{idea.title}</h3><IdeaStatusBadge status={idea.status} /></div><p className="text-sm text-slate-400 truncate">{idea.description}</p></div>
                    <div className="text-right shrink-0">{idea.report ? <p className="text-xl font-bold text-slate-900">{idea.report.viabilityScore}%</p> : <p className="text-sm text-slate-600">—</p>}<p className="text-xs text-slate-500">{new Date(idea.createdAt).toLocaleDateString()}</p></div>
                  </Link>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {activeTab === "analytics" && (
          <motion.div key="analytics" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }} className="space-y-6">
            <div className="grid sm:grid-cols-3 gap-4">
              {[{ label: "Validated", value: stats.validated, color: "text-emerald-400" }, { label: "Pending", value: stats.pending, color: "text-amber-400" }, { label: "Failed", value: stats.failed, color: "text-red-400" }].map((s) => (
                <div key={s.label} className="card-premium rounded-xl p-5 text-center"><p className={`text-3xl font-bold ${s.color}`}>{s.value}</p><p className="text-xs text-slate-400 mt-1">{s.label}</p></div>
              ))}
            </div>
            <div className="grid lg:grid-cols-2 gap-4">
              <div className="card-premium rounded-xl p-5"><h3 className="text-sm font-semibold text-slate-900 mb-4">Score Distribution</h3>{loading ? <div className="h-[200px] bg-white/[0.03] rounded-xl animate-pulse" /> : <LazyPieChart data={scoreDistribution} colors={COLORS} />}</div>
              <div className="card-premium rounded-xl p-5"><h3 className="text-sm font-semibold text-slate-900 mb-4">Score Trend</h3>{scoreTrend.length > 1 ? <LazyDashboardBarChart data={scoreTrend.map((d) => ({ name: d.date, value: d.score }))} /> : <div className="h-[200px] flex items-center justify-center text-xs text-slate-500">Need more data points</div>}</div>
            </div>
            {industryBreakdown.length > 0 && (
              <div className="card-premium rounded-xl p-5">
                <h3 className="text-sm font-semibold text-slate-900 mb-4">Industry Breakdown</h3>
                <div className="space-y-3">
                  {industryBreakdown.map((ind, i) => (
                    <div key={ind.name} className="flex items-center gap-4">
                      <span className="text-xs font-bold text-slate-500 w-6">{i + 1}.</span>
                      <div className="flex-1"><div className="flex items-center justify-between mb-1.5"><span className="text-sm font-medium text-slate-300">{ind.name}</span><span className="text-sm font-bold text-slate-900">{ind.value} ideas</span></div><div className="h-2 rounded-full bg-white/[0.04] overflow-hidden"><div className="h-full rounded-full bg-gradient-to-r from-sky-500 to-amber-500 transition-all duration-700" style={{ width: `${(ind.value / ideas.length) * 100}%` }} /></div></div>
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
