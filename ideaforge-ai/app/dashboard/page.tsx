"use client";
import { useEffect, useState, useCallback, useMemo } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth";
import { api, Idea } from "@/lib/api";
import dynamic from "next/dynamic";

const LazyPieChart = dynamic(() => import("@/components/LazyCharts").then((m) => m.LazyPieChart), { ssr: false, loading: () => <div className="h-[200px] bg-gray-100 dark:bg-gray-800 rounded-xl animate-pulse" /> });
const LazyDashboardBarChart = dynamic(() => import("@/components/LazyCharts").then((m) => m.LazyDashboardBarChart), { ssr: false, loading: () => <div className="h-[200px] bg-gray-100 dark:bg-gray-800 rounded-xl animate-pulse" /> });

const COLORS = ["#22C55E", "#6366F1", "#F59E0B", "#EF4444", "#8B5CF6", "#EC4899", "#14B8A6", "#F97316"];

function StreakBadge({ count }: { count: number }) {
  if (count === 0) return null;
  return (
    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20">
      <svg className="w-4 h-4 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 6.879A3 3 0 1012 9c0 .828-.448 1.5-1 1.5s-1-.672-1-1.5a3 3 0 00-2.121-5.121z" />
      </svg>
      <span className="text-xs font-bold text-amber-700 dark:text-amber-400">{count} day streak</span>
    </div>
  );
}

function InsightCard({ icon, title, desc, action, actionHref }: { icon: string; title: string; desc: string; action?: string; actionHref?: string }) {
  return (
    <div className="card-base rounded-xl p-4 flex items-start gap-3">
      <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-500/15 flex items-center justify-center shrink-0">
        <svg className="w-4 h-4 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d={icon} /></svg>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 dark:text-white">{title}</p>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 leading-relaxed">{desc}</p>
      </div>
      {action && actionHref && (
        <Link href={actionHref} className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-medium shrink-0">{action} →</Link>
      )}
    </div>
  );
}

export default function DashboardPage() {
  const { user, token } = useAuth();
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [sort, setSort] = useState("newest");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [loading, setLoading] = useState(true);
  const [retryingId, setRetryingId] = useState<string | null>(null);
  const [showShortcuts, setShowShortcuts] = useState(false);

  useEffect(() => {
    if (token) {
      api.getIdeas(token).then((data) => setIdeas(data.ideas)).catch(() => {}).finally(() => setLoading(false));
    }
  }, [token]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setShowShortcuts((v) => !v);
      }
      if (e.key === "Escape") setShowShortcuts(false);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  const filtered = useMemo(() => ideas
    .filter((idea) => {
      if (filter === "validated" && idea.status !== "validated") return false;
      if (filter === "pending" && idea.status !== "pending") return false;
      if (filter === "failed" && idea.status !== "failed") return false;
      if (search && !idea.title.toLowerCase().includes(search.toLowerCase()) && !idea.description.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    })
    .sort((a, b) => {
      if (sort === "oldest") return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      if (sort === "score-high") return (b.report?.viabilityScore || 0) - (a.report?.viabilityScore || 0);
      if (sort === "score-low") return (a.report?.viabilityScore || 0) - (b.report?.viabilityScore || 0);
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }), [ideas, filter, search, sort]);

  const stats = useMemo(() => {
    const validated = ideas.filter((i) => i.status === "validated").length;
    const failed = ideas.filter((i) => i.status === "failed").length;
    const pending = ideas.filter((i) => i.status === "pending" || i.status === "processing").length;
    const withReport = ideas.filter((i) => i.report);
    const avgScore = withReport.length > 0 ? Math.round(withReport.reduce((sum, i) => sum + (i.report?.viabilityScore || 0), 0) / withReport.length) : 0;
    const topScore = withReport.length > 0 ? Math.max(...withReport.map((i) => i.report?.viabilityScore || 0)) : 0;
    const winRate = withReport.length > 0 ? Math.round((withReport.filter((i) => (i.report?.viabilityScore || 0) >= 60).length / withReport.length) * 100) : 0;
    return { validated, failed, pending, avgScore, topScore, winRate };
  }, [ideas]);

  const scoreDistribution = useMemo(() => [
    { name: "Excellent (80-100)", value: ideas.filter((i) => (i.report?.viabilityScore || 0) >= 80).length },
    { name: "Good (60-79)", value: ideas.filter((i) => { const s = i.report?.viabilityScore || 0; return s >= 60 && s < 80; }).length },
    { name: "Fair (40-59)", value: ideas.filter((i) => { const s = i.report?.viabilityScore || 0; return s >= 40 && s < 60; }).length },
    { name: "Poor (0-39)", value: ideas.filter((i) => (i.report?.viabilityScore || 0) < 40).length },
  ], [ideas]);

  const industryBreakdown = useMemo(() => {
    const counts: Record<string, number> = {};
    ideas.forEach((i) => {
      const ind = i.industry || "Uncategorized";
      counts[ind] = (counts[ind] || 0) + 1;
    });
    return Object.entries(counts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 6);
  }, [ideas]);

  const recentIdeas = useMemo(() => [...ideas].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 5), [ideas]);

  const scoreTrend = useMemo(() => {
    const validated = ideas
      .filter((i) => i.status === "validated" && i.report)
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
      .slice(-7);
    return validated.map((i) => ({
      date: new Date(i.createdAt).toLocaleDateString(undefined, { month: "short", day: "numeric" }),
      score: i.report?.viabilityScore || 0,
    }));
  }, [ideas]);

  const streak = useMemo(() => {
    if (ideas.length === 0) return 0;
    const dates = [...new Set(ideas.map((i) => new Date(i.createdAt).toDateString()))].sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    let check = new Date(today);
    for (const d of dates) {
      const dd = new Date(d);
      dd.setHours(0, 0, 0, 0);
      const diff = (check.getTime() - dd.getTime()) / (1000 * 60 * 60 * 24);
      if (diff === 0 || (streak === 0 && diff <= 1)) {
        streak++;
        check = dd;
      } else if (diff > 1) {
        break;
      }
    }
    return streak;
  }, [ideas]);

  const insights = useMemo(() => {
    const tips: { icon: string; title: string; desc: string; action?: string; actionHref?: string }[] = [];
    if (ideas.length === 0) {
      tips.push({ icon: "M12 4v16m8-8H4", title: "Start validating", desc: "Submit your first idea to get AI-powered insights and a viability score.", action: "Validate Idea", actionHref: "/dashboard/new" });
    }
    if (stats.avgScore > 0 && stats.avgScore < 50) {
      tips.push({ icon: "M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z", title: "Low average score detected", desc: "Try refining your problem statement or use the AI Idea Generator for inspiration.", action: "Generate", actionHref: "/dashboard/generate" });
    }
    if (stats.winRate >= 70 && stats.validated >= 2) {
      tips.push({ icon: "M5 13l4 4L19 7", title: "Great win rate!", desc: "You have a strong track record. Consider scaling with more ideas.", action: "New Idea", actionHref: "/dashboard/new" });
    }
    if (industryBreakdown.length > 0) {
      const top = industryBreakdown[0];
      tips.push({ icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2 2z", title: `Top category: ${top.name}`, desc: `You have ${top.value} idea${top.value > 1 ? "s" : ""} in this space. Consider exploring adjacent markets.`, action: "Explore", actionHref: "/dashboard/generate" });
    }
    return tips.slice(0, 3);
  }, [ideas, stats, industryBreakdown]);

  const handleRetry = useCallback(async (ideaId: string) => {
    if (!token) return;
    setRetryingId(ideaId);
    try {
      await api.retryIdea(token, ideaId);
      setIdeas((prev) => prev.map((i) => i.id === ideaId ? { ...i, status: "pending" } : i));
    } catch {} finally { setRetryingId(null); }
  }, [token]);

  const handleDelete = useCallback(async (ideaId: string) => {
    if (!token) return;
    try {
      await api.deleteIdea(token, ideaId);
      setIdeas((prev) => prev.filter((i) => i.id !== ideaId));
    } catch {}
  }, [token]);

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-slide-up">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Welcome back, {user?.name}</h1>
            <StreakBadge count={streak} />
          </div>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Here&apos;s your business validation dashboard</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setShowShortcuts(true)} className="px-3 py-2.5 rounded-xl text-sm font-semibold border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors inline-flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
            Shortcuts
          </button>
          <Link href="/dashboard/generate" className="px-4 py-2.5 rounded-xl text-sm font-semibold border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors inline-flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
            Generate Ideas
          </Link>
          <Link href="/dashboard/new" className="gradient-btn text-white px-5 py-2.5 rounded-xl text-sm font-semibold inline-flex items-center gap-2 shadow-lg">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
            Validate New Idea
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Ideas", value: ideas.length, color: "from-blue-500 to-blue-600", lightBg: "bg-blue-50 dark:bg-blue-500/10", icon: "M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10", trend: null },
          { label: "Validated", value: stats.validated, color: "from-emerald-500 to-emerald-600", lightBg: "bg-emerald-50 dark:bg-emerald-500/10", icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z", trend: stats.validated > 0 ? "up" : null },
          { label: user?.plan !== "pro" ? "Tokens Left" : "Win Rate", value: user?.plan !== "pro" ? (user?.tokens ?? 0) : `${stats.winRate}%`, color: user?.plan !== "pro" ? "from-amber-500 to-orange-500" : "from-violet-500 to-violet-600", lightBg: user?.plan !== "pro" ? "bg-amber-50 dark:bg-amber-500/10" : "bg-violet-50 dark:bg-violet-500/10", icon: user?.plan !== "pro" ? "M13 10V3L4 14h7v7l9-11h-7z" : "M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z", trend: user?.plan !== "pro" ? ((user?.tokens ?? 0) <= 1 ? "down" : null) : (stats.winRate >= 60 ? "up" : stats.winRate > 0 ? "down" : null) },
          { label: "Avg Score", value: `${stats.avgScore}%`, color: "from-amber-500 to-orange-500", lightBg: "bg-amber-50 dark:bg-amber-500/10", icon: "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6", trend: stats.avgScore >= 70 ? "up" : stats.avgScore > 0 ? "down" : null },
        ].map((stat) => (
          <div key={stat.label} className="card-base rounded-xl p-5 card-hover group">
            <div className="flex items-start justify-between mb-3">
              <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg shadow-opacity-20 group-hover:scale-105 transition-transform`}>
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d={stat.icon} />
                </svg>
              </div>
              {stat.trend && (
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${stat.trend === "up" ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400" : "bg-red-50 text-red-600 dark:bg-red-500/15 dark:text-red-400"}`}>
                  {stat.trend === "up" ? "Trending up" : "Needs attention"}
                </span>
              )}
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-4">
          <div className="card-base rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Score Trend</h3>
              {scoreTrend.length > 1 && (
                <span className="text-xs text-gray-500 dark:text-gray-400">Last {scoreTrend.length} validations</span>
              )}
            </div>
            {scoreTrend.length > 1 ? (
              <LazyDashboardBarChart data={scoreTrend.map((d) => ({ name: d.date, value: d.score }))} />
            ) : (
              <div className="flex items-center justify-center h-[180px] text-xs text-gray-400">Submit and validate at least 2 ideas to see your trend</div>
            )}
          </div>
          <div className="card-base rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Recent Activity</h3>
              <Link href="/dashboard/new" className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-medium">View all</Link>
            </div>
            {loading ? (
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 animate-pulse">
                    <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700" />
                    <div className="flex-1">
                      <div className="w-3/4 h-3 bg-gray-200 dark:bg-gray-700 rounded mb-1" />
                      <div className="w-1/2 h-2 bg-gray-200 dark:bg-gray-700 rounded" />
                    </div>
                  </div>
                ))}
              </div>
            ) : recentIdeas.length === 0 ? (
              <div className="text-center py-8">
                <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                  </svg>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">No activity yet. Submit your first idea!</p>
              </div>
            ) : (
              <div className="space-y-2">
                {recentIdeas.map((idea) => (
                  <Link key={idea.id} href={`/dashboard/idea/${idea.id}`} className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                      idea.status === "validated" ? "bg-emerald-100 dark:bg-emerald-500/20" :
                      idea.status === "failed" ? "bg-red-100 dark:bg-red-500/20" :
                      idea.status === "processing" ? "bg-blue-100 dark:bg-blue-500/20" :
                      "bg-amber-100 dark:bg-amber-500/20"
                    }`}>
                      {idea.status === "validated" ? (
                        <svg className="w-5 h-5 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                      ) : idea.status === "failed" ? (
                        <svg className="w-5 h-5 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                      ) : idea.status === "processing" ? (
                        <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <svg className="w-5 h-5 text-amber-600 dark:text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{idea.title}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{idea.industry || "General"} &middot; {new Date(idea.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div className="text-right shrink-0 flex items-center gap-2">
                      {idea.report ? (
                        <span className={`text-lg font-bold ${idea.report.viabilityScore >= 70 ? "text-emerald-600 dark:text-emerald-400" : idea.report.viabilityScore >= 50 ? "text-amber-600 dark:text-amber-400" : "text-red-600 dark:text-red-400"}`}>
                          {idea.report.viabilityScore}%
                        </span>
                      ) : (
                        <span className="text-xs text-gray-400">&mdash;</span>
                      )}
                      <button onClick={(e) => { e.preventDefault(); handleDelete(idea.id); }} className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors opacity-0 group-hover:opacity-100">
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="space-y-4">
          <div className="card-base rounded-xl p-5">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Quick Actions</h3>
            <div className="space-y-2">
              <Link href="/dashboard/new" className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-500/10 dark:to-purple-500/10 hover:from-indigo-100 hover:to-purple-100 dark:hover:from-indigo-500/20 dark:hover:to-purple-500/20 transition-colors group">
                <div className="w-9 h-9 rounded-lg bg-indigo-100 dark:bg-indigo-500/20 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <svg className="w-4 h-4 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Submit New Idea</p>
                  <p className="text-[10px] text-gray-500 dark:text-gray-400">Get AI validation in 30s</p>
                </div>
              </Link>
              <Link href="/dashboard/generate" className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-500/10 dark:to-orange-500/10 hover:from-amber-100 hover:to-orange-100 dark:hover:from-amber-500/20 dark:hover:to-orange-500/20 transition-colors group">
                <div className="w-9 h-9 rounded-lg bg-amber-100 dark:bg-amber-500/20 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <svg className="w-4 h-4 text-amber-600 dark:text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">AI Idea Generator</p>
                  <p className="text-[10px] text-gray-500 dark:text-gray-400">Brainstorm new opportunities</p>
                </div>
              </Link>
              <Link href="/dashboard/compare" className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-500/10 dark:to-teal-500/10 hover:from-emerald-100 hover:to-teal-100 dark:hover:from-emerald-500/20 dark:hover:to-teal-500/20 transition-colors group">
                <div className="w-9 h-9 rounded-lg bg-emerald-100 dark:bg-emerald-500/20 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <svg className="w-4 h-4 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2z" /></svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Compare Ideas</p>
                  <p className="text-[10px] text-gray-500 dark:text-gray-400">Side-by-side analysis</p>
                </div>
              </Link>
            </div>
          </div>

          {ideas.length > 0 && (
            <>
              <div className="card-base rounded-xl p-5">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Score Distribution</h3>
                {loading ? (
                  <div className="h-[160px] bg-gray-100 dark:bg-gray-800 rounded-xl animate-pulse" />
                ) : (
                  <LazyPieChart data={scoreDistribution} colors={COLORS} />
                )}
              </div>
              {industryBreakdown.length > 0 && (
                <div className="card-base rounded-xl p-5">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Top Industries</h3>
                  <div className="space-y-2.5">
                    {industryBreakdown.map((ind, i) => (
                      <div key={ind.name} className="flex items-center gap-3">
                        <span className="text-xs font-bold text-gray-400 dark:text-gray-500 w-4">{i + 1}</span>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-medium text-gray-700 dark:text-gray-300 truncate">{ind.name}</span>
                            <span className="text-xs font-bold text-gray-900 dark:text-white">{ind.value}</span>
                          </div>
                          <div className="h-1.5 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
                            <div className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500" style={{ width: `${(ind.value / ideas.length) * 100}%` }} />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input type="text" placeholder="Search ideas... (Ctrl+K)" value={search} onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors placeholder:text-gray-400" />
          </div>
          <select value={filter} onChange={(e) => setFilter(e.target.value)}
            className="px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20">
            <option value="all">All Status</option>
            <option value="validated">Validated</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
          </select>
          <select value={sort} onChange={(e) => setSort(e.target.value)}
            className="px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20">
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="score-high">Highest Score</option>
            <option value="score-low">Lowest Score</option>
          </select>
          <div className="flex bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
            <button onClick={() => setView("grid")} className={`px-3 py-2 transition-colors ${view === "grid" ? "bg-indigo-50 dark:bg-indigo-500/15 text-indigo-600 dark:text-indigo-400" : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"}`}>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </button>
            <button onClick={() => setView("list")} className={`px-3 py-2 transition-colors ${view === "list" ? "bg-indigo-50 dark:bg-indigo-500/15 text-indigo-600 dark:text-indigo-400" : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"}`}>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {insights.length > 0 && (
          <div className="grid sm:grid-cols-3 gap-3">
            {insights.map((insight, i) => (
              <InsightCard key={i} {...insight} />
            ))}
          </div>
        )}

        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="card-base rounded-xl p-5 animate-pulse">
                <div className="flex items-start justify-between mb-3">
                  <div className="w-16 h-5 bg-gray-200 dark:bg-gray-700 rounded-full" />
                  <div className="w-10 h-5 bg-gray-200 dark:bg-gray-700 rounded" />
                </div>
                <div className="w-3/4 h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2" />
                <div className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded mb-1" />
                <div className="w-2/3 h-3 bg-gray-200 dark:bg-gray-700 rounded mb-3" />
                <div className="w-1/2 h-3 bg-gray-200 dark:bg-gray-700 rounded" />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">No ideas yet</h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1 mb-4">Submit your first business idea to get AI-powered validation</p>
            <Link href="/dashboard/new" className="gradient-btn text-white px-5 py-2.5 rounded-xl text-sm font-semibold inline-block">Submit Your First Idea</Link>
          </div>
        ) : view === "grid" ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((idea) => (
              <Link key={idea.id} href={`/dashboard/idea/${idea.id}`} className="card-base rounded-xl p-5 card-hover block animate-slide-up">
                <div className="flex items-start justify-between mb-3">
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${idea.status === "validated" ? "bg-emerald-50 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-400" : idea.status === "processing" ? "bg-blue-50 dark:bg-blue-500/15 text-blue-700 dark:text-blue-400" : idea.status === "failed" ? "bg-red-50 dark:bg-red-500/15 text-red-700 dark:text-red-400" : "bg-amber-50 dark:bg-amber-500/15 text-amber-700 dark:text-amber-400"}`}>
                    {idea.status === "failed" ? "failed" : idea.status}
                  </span>
                  {idea.report && <span className="text-lg font-bold text-gray-900 dark:text-white">{idea.report.viabilityScore}%</span>}
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1 line-clamp-1">{idea.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-3">{idea.description}</p>
                {idea.status === "failed" && (
                  <button onClick={(e) => { e.preventDefault(); handleRetry(idea.id); }} disabled={retryingId === idea.id}
                    className="w-full text-center text-xs font-medium text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 py-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors disabled:opacity-50 flex items-center justify-center gap-1.5">
                    <svg className={`w-3.5 h-3.5 ${retryingId === idea.id ? "animate-spin" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    {retryingId === idea.id ? "Retrying..." : "Retry Validation"}
                  </button>
                )}
                <div className="flex items-center gap-2 text-xs text-gray-400 dark:text-gray-500">
                  <span>{idea.industry}</span>
                  <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-600" />
                  <span>{new Date(idea.createdAt).toLocaleDateString()}</span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {filtered.map((idea) => (
              <Link key={idea.id} href={`/dashboard/idea/${idea.id}`} className="card-base rounded-xl p-4 flex items-center gap-4 card-hover block">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-gray-900 dark:text-white truncate">{idea.title}</h3>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${idea.status === "validated" ? "bg-emerald-50 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-400" : idea.status === "processing" ? "bg-blue-50 dark:bg-blue-500/15 text-blue-700 dark:text-blue-400" : idea.status === "failed" ? "bg-red-50 dark:bg-red-500/15 text-red-700 dark:text-red-400" : "bg-amber-50 dark:bg-amber-500/15 text-amber-700 dark:text-amber-400"}`}>
                      {idea.status === "failed" ? "failed" : idea.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{idea.description}</p>
                  {idea.status === "failed" && (
                    <button onClick={(e) => { e.preventDefault(); handleRetry(idea.id); }} disabled={retryingId === idea.id}
                      className="mt-1 text-xs font-medium text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors disabled:opacity-50 inline-flex items-center gap-1">
                      <svg className={`w-3 h-3 ${retryingId === idea.id ? "animate-spin" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      {retryingId === idea.id ? "Retrying..." : "Retry"}
                    </button>
                  )}
                </div>
                <div className="text-right shrink-0">
                  {idea.report ? <p className="text-xl font-bold text-gray-900 dark:text-white">{idea.report.viabilityScore}%</p> : <p className="text-sm text-gray-400">&mdash;</p>}
                  <p className="text-xs text-gray-400 dark:text-gray-500">{new Date(idea.createdAt).toLocaleDateString()}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {showShortcuts && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={() => setShowShortcuts(false)}>
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-2xl p-6 max-w-sm w-full mx-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-semibold text-gray-900 dark:text-white">Keyboard Shortcuts</h3>
              <button onClick={() => setShowShortcuts(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="space-y-2.5 text-sm">
              {[
                { keys: ["Ctrl", "K"], desc: "Toggle shortcuts" },
                { keys: ["Esc"], desc: "Close modal" },
              ].map((s) => (
                <div key={s.desc} className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-300">{s.desc}</span>
                  <div className="flex items-center gap-1">
                    {s.keys.map((k) => (
                      <kbd key={k} className="px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-xs font-mono text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700">{k}</kbd>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
