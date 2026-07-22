"use client";
import { useEffect, useState, useRef, useMemo, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth";
import { api, Report, streamValidate, streamPivotSuggestions, SSEProgressEvent, SourceLink, PivotSuggestion, NineDimension, GTMExperiments, MarketSizing, ActionPlanDay, SkepticAnalysis, SWOTAnalysis, CompetitiveLandscape, MarketTiming } from "@/lib/api";
import ProcessingOverlay from "@/components/ProcessingOverlay";
import dynamic from "next/dynamic";

const LazyRadarChart = dynamic(() => import("@/components/LazyCharts").then((m) => m.LazyRadarChart), {
  ssr: false,
  loading: () => <div className="h-[280px] bg-white/[0.05] rounded-xl animate-pulse" />
});
const LazyBarChart = dynamic(() => import("@/components/LazyCharts").then((m) => m.LazyBarChart), {
  ssr: false,
  loading: () => <div className="h-[280px] bg-white/[0.05] rounded-xl animate-pulse" />
});

function ScoreCircle({ score, label, color }: { score: number; label: string; color: string }) {
  const r = 36, c = 2 * Math.PI * r;
  return (
    <div className="flex flex-col items-center">
      <svg width="90" height="90">
        <circle cx="45" cy="45" r={r} fill="none" stroke="rgba(255,255,255,0.06)" className="dark:stroke-white/10" strokeWidth="6" />
        <circle cx="45" cy="45" r={r} fill="none" stroke={color} strokeWidth="6"
          strokeDasharray={c} strokeDashoffset={c * (1 - score / 100)}
          strokeLinecap="round" transform="rotate(-90 45 45)" className="transition-all duration-1000" />
        <text x="45" y="45" textAnchor="middle" dominantBaseline="central" className="text-lg font-bold fill-current text-white">{score}</text>
      </svg>
      <span className="text-xs text-slate-400 mt-1">{label}</span>
    </div>
  );
}

function DimensionBar({ dim }: { dim: NineDimension }) {
  const pct = (dim.score / dim.maxScore) * 100;
  const color = dim.score >= 7 ? "#22C55E" : dim.score >= 5 ? "#F59E0B" : "#EF4444";
  const dimIcons: Record<string, string> = {
    problem: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z",
    urgency: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
    market: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
    moat: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
    replica: "M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15",
    revenue: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
    fit: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z",
    time: "M13 10V3L4 14h7v7l9-11h-7z",
    scale: "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6",
  };
  return (
    <div className="group">
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-white/[0.05] flex items-center justify-center">
            <svg className="w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d={dimIcons[dim.icon] || dimIcons.problem} />
            </svg>
          </div>
          <span className="text-sm font-medium text-white">{dim.name}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 italic hidden sm:block">{dim.label}</span>
          <span className="text-sm font-bold" style={{ color }}>{dim.score}/{dim.maxScore}</span>
        </div>
      </div>
      <div className="w-full h-2.5 rounded-full bg-white/[0.05] overflow-hidden">
        <div className="h-full rounded-full transition-all duration-1000 ease-out" style={{ width: `${pct}%`, backgroundColor: color }} />
      </div>
      <p className="text-[11px] text-slate-400 mt-1 pl-8">{dim.description}</p>
    </div>
  );
}

function SourceBadge({ source }: { source: SourceLink }) {
  return (
    <a href={source.url} target="_blank" rel="noopener noreferrer"
      className="group inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-white/[0.06] bg-white/[0.03] hover:bg-blue-500/10 hover:border-blue-300 dark:hover:border-blue-500/30 transition-all">
      <div className="w-6 h-6 rounded-md bg-emerald-500/15 flex items-center justify-center shrink-0">
        <svg className="w-3 h-3 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <div className="min-w-0">
        <p className="text-xs font-medium text-white truncate max-w-[200px]">{source.title}</p>
        <p className="text-[10px] text-slate-400 truncate max-w-[200px]">{source.context}</p>
      </div>
      <svg className="w-3.5 h-3.5 text-slate-500 group-hover:text-blue-400 shrink-0 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
      </svg>
    </a>
  );
}

function PivotCard({ pivot, onPivotTo }: { pivot: PivotSuggestion; onPivotTo: (p: PivotSuggestion) => void }) {
  return (
    <div className="card-base rounded-xl p-4 border border-white/[0.06] hover:border-blue-500/30 transition-all">
      <div className="flex items-start justify-between mb-2">
        <h4 className="font-semibold text-sm text-white">{pivot.direction}</h4>
        <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
          pivot.viabilityEstimate >= 70 ? "bg-emerald-500/15 text-emerald-400"
          : pivot.viabilityEstimate >= 50 ? "bg-amber-500/15 text-amber-400"
          : "bg-red-500/15 text-red-700 dark:text-red-400"
        }`}>{pivot.viabilityEstimate}%</span>
      </div>
      <p className="text-xs text-slate-300 mb-2 leading-relaxed">{pivot.description}</p>
      <div className="flex items-center gap-2 mb-3">
        <span className="text-[10px] uppercase tracking-wider text-slate-500 font-medium">Targets:</span>
        <span className="text-xs text-slate-300">{pivot.targetAudience}</span>
      </div>
      <div className="bg-white/[0.03] rounded-lg px-3 py-2 mb-3">
        <p className="text-[10px] uppercase tracking-wider text-slate-500 font-medium mb-0.5">Key Pivot</p>
        <p className="text-xs text-slate-200">{pivot.keyPivot}</p>
      </div>
      <button onClick={() => onPivotTo(pivot)}
        className="w-full text-center text-xs font-medium text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 py-1.5 rounded-lg hover:bg-blue-500/10 transition-colors">
        Validate This Pivot &rarr;
      </button>
    </div>
  );
}

export default function ReportPage() {
  const { id } = useParams();
  const { token } = useAuth();
  const [report, setReport] = useState<Report | null>(null);
  const [ideaTitle, setIdeaTitle] = useState("");
  const [status, setStatus] = useState<"loading" | "processing" | "streaming" | "error" | "done">("loading");
  const [downloading, setDownloading] = useState(false);
  const [streamSteps, setStreamSteps] = useState<{ step: string; label: string; progress: number }[]>([]);
  const [retrying, setRetrying] = useState(false);
  const [pivotLoading, setPivotLoading] = useState(false);
  const [pivotSteps, setPivotSteps] = useState<{ step: string; label: string; progress: number }[]>([]);
  const [chatMessages, setChatMessages] = useState<{ role: "user" | "assistant"; content: string }[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [chatSending, setChatSending] = useState(false);
  const [showPivotPanel, setShowPivotPanel] = useState(false);
  const [skepticMode, setSkepticMode] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const hasStartedStream = useRef(false);

  const parsedSources: SourceLink[] = useMemo(() => report ? (() => { try { return JSON.parse(report.sources); } catch { return []; } })() : [], [report]);
  const parsedPivots: PivotSuggestion[] = useMemo(() => report ? (() => { try { return JSON.parse(report.pivotSuggestions); } catch { return []; } })() : [], [report]);
  const parsedDimensions: NineDimension[] = useMemo(() => report ? (() => { try { return JSON.parse(report.nineDimensions); } catch { return []; } })() : [], [report]);
  const parsedGTM: GTMExperiments | null = useMemo(() => report ? (() => { try { return JSON.parse(report.gtmExperiments); } catch { return null; } })() : null, [report]);
  const parsedSkeptic: SkepticAnalysis | null = useMemo(() => report ? (() => { try { return JSON.parse(report.skepticAnalysis); } catch { return null; } })() : null, [report]);
  const parsedMarketSizing: MarketSizing | null = useMemo(() => report ? (() => { try { return JSON.parse(report.marketSizing); } catch { return null; } })() : null, [report]);
  const parsedActionPlan: ActionPlanDay[] = useMemo(() => report ? (() => { try { return JSON.parse(report.actionPlan); } catch { return []; } })() : [], [report]);
  const parsedSWOT: SWOTAnalysis | null = useMemo(() => report ? (() => { try { return JSON.parse(report.swotAnalysis); } catch { return null; } })() : null, [report]);
  const parsedCompetitive: CompetitiveLandscape | null = useMemo(() => report ? (() => { try { return JSON.parse(report.competitiveLandscape); } catch { return null; } })() : null, [report]);
  const parsedMarketTiming: MarketTiming | null = useMemo(() => report ? (() => { try { return JSON.parse(report.marketTiming); } catch { return null; } })() : null, [report]);

  const radarData = useMemo(() => report ? [
    { subject: "Market", value: report.marketScore },
    { subject: "Competition", value: report.competitorScore },
    { subject: "Monetization", value: report.monetizationScore },
    { subject: "Risk (inv)", value: 100 - report.riskScore },
    { subject: "Viability", value: report.viabilityScore },
  ] : [], [report]);

  const barData = useMemo(() => report ? [
    { name: "Market", value: report.marketScore, color: "#6366F1" },
    { name: "Competition", value: report.competitorScore, color: "#8B5CF6" },
    { name: "Monetization", value: report.monetizationScore, color: "#22C55E" },
    { name: "Risk", value: report.riskScore, color: "#EF4444" },
  ] : [], [report]);

  const verdict = useMemo(() => {
    if (!report) return { text: "", color: "", desc: "" };
    return report.viabilityScore >= 80 ? { text: "Excellent", color: "bg-emerald-500", desc: "This idea has strong potential. Proceed with confidence!" }
      : report.viabilityScore >= 60 ? { text: "Good", color: "bg-indigo-500", desc: "Solid idea with manageable risks. Refine your approach." }
      : report.viabilityScore >= 40 ? { text: "Fair", color: "bg-amber-500", desc: "Needs significant improvements. Consider the pivot suggestions below." }
      : { text: "Needs Work", color: "bg-red-500", desc: "Major challenges ahead. Explore the pivot assistant for alternatives." };
  }, [report]);

  const execLabel = useMemo(() => report ? (report.executionComplexity <= 3 ? "Low" : report.executionComplexity <= 6 ? "Medium" : "High") : "", [report]);
  const execColor = useMemo(() => report ? (report.executionComplexity <= 3 ? "text-emerald-400" : report.executionComplexity <= 6 ? "text-amber-400" : "text-red-400") : "", [report]);

  useEffect(() => {
    if (!token) return;
    const fetchReport = async () => {
      try {
        const data = await api.getReport(token, id as string);
        setReport(data.report);
        setIdeaTitle(data.idea.title);
        setStatus("done");
      } catch (err: unknown) {
        const error = err as { status?: number; idea?: { title?: string; status?: string } };
        if (error.status === 202) {
          setIdeaTitle(error.idea?.title || "");
          setStatus("processing");
        } else {
          setStatus("error");
        }
      }
    };
    fetchReport();
  }, [token, id]);

  useEffect(() => {
    if (status !== "processing" || !token || hasStartedStream.current) return;
    hasStartedStream.current = true;
    setStatus("streaming");
    const cleanup = streamValidate(token, id as string, (event: SSEProgressEvent) => {
      if (event.type === "progress" && event.step && event.label && event.progress !== undefined) {
        setStreamSteps((prev) => {
          const exists = prev.findIndex((s) => s.step === event.step);
          if (exists >= 0) { const next = [...prev]; next[exists] = { step: event.step!, label: event.label!, progress: event.progress! }; return next; }
          return [...prev, { step: event.step!, label: event.label!, progress: event.progress! }];
        });
      } else if (event.type === "complete" && "report" in event) {
        setReport((event as { report: Report }).report);
        setStatus("done");
      } else if (event.type === "error") {
        setStatus("error");
      }
    });
    return () => cleanup();
  }, [status, token, id]);

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [chatMessages]);

  const handleRetry = useCallback(async () => {
    if (!token) return;
    setRetrying(true);
    try {
      await api.retryIdea(token, id as string);
      setStatus("processing");
      hasStartedStream.current = false;
      setStreamSteps([]);
    } catch {} finally { setRetrying(false); }
  }, [token, id]);

  const handleGeneratePivots = useCallback(async () => {
    if (!token || !report) return;
    setPivotLoading(true);
    setPivotSteps([{ step: "pivots", label: "Generating pivot suggestions...", progress: 30 }]);
    const cleanup = streamPivotSuggestions(token, id as string, (event) => {
      if (event.type === "progress" && event.step && event.label && event.progress !== undefined) {
        setPivotSteps((prev) => {
          const exists = prev.findIndex((s) => s.step === event.step);
          if (exists >= 0) { const next = [...prev]; next[exists] = { step: event.step!, label: event.label!, progress: event.progress! }; return next; }
          return [...prev, { step: event.step!, label: event.label!, progress: event.progress! }];
        });
      } else if (event.type === "complete") {
        setReport((prev) => prev ? { ...prev, pivotSuggestions: JSON.stringify(event.pivots || []) } : prev);
        setPivotLoading(false); setPivotSteps([]);
      } else if (event.type === "error") { setPivotLoading(false); setPivotSteps([]); }
    });
    setTimeout(() => { cleanup(); }, 30000);
  }, [token, report, id]);

  const handlePivotTo = useCallback((pivot: PivotSuggestion) => {
    window.location.href = `/dashboard/new?title=${encodeURIComponent(`${ideaTitle} (${pivot.direction})`)}&desc=${encodeURIComponent(pivot.description)}&audience=${encodeURIComponent(pivot.targetAudience)}`;
  }, [ideaTitle]);

  const handleChat = useCallback(async () => {
    if (!chatInput.trim() || !token || chatSending) return;
    const userMsg = chatInput.trim();
    setChatInput("");
    setChatMessages((prev) => [...prev, { role: "user", content: userMsg }]);
    setChatSending(true);
    try {
      const data = await api.pivotChat(token, id as string, userMsg, chatMessages);
      setChatMessages((prev) => [...prev, { role: "assistant", content: data.reply }]);
    } catch {
      setChatMessages((prev) => [...prev, { role: "assistant", content: "Sorry, I couldn't process that. Please try again." }]);
    } finally { setChatSending(false); }
  }, [chatInput, token, chatSending, chatMessages, id]);

  const handlePDF = useCallback(async () => {
    setDownloading(true);
    try {
      const html2canvas = (await import("html2canvas")).default;
      const jsPDF = (await import("jspdf")).default;
      const el = document.getElementById("report-content");
      if (!el) return;
      const canvas = await html2canvas(el, { scale: 2, useCORS: true, backgroundColor: "#ffffff" });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pageW = pdf.internal.pageSize.getWidth();
      const pageH = pdf.internal.pageSize.getHeight();
      const margin = 10;
      const usableW = pageW - margin * 2;
      const imgH = (canvas.height * usableW) / canvas.width;
      let remaining = imgH;
      let imgY = 0;
      let page = 0;
      while (remaining > 0) {
        if (page > 0) pdf.addPage();
        pdf.addImage(imgData, "PNG", margin, margin - imgY, usableW, imgH);
        remaining -= pageH - margin * 2;
        imgY += pageH - margin * 2;
        page++;
      }
      pdf.save(`IdeaForge-Report-${ideaTitle.replace(/\s+/g, "-")}.pdf`);
    } finally { setDownloading(false); }
  }, [ideaTitle]);

  if (status === "loading") {
    return (
      <div className="max-w-4xl mx-auto space-y-6 animate-pulse">
        <div className="flex items-center gap-2">
          <div className="w-20 h-4 bg-white/[0.05] rounded" />
        </div>
        <div className="w-3/4 h-7 bg-white/[0.05] rounded" />
        <div className="card-base rounded-2xl p-6 space-y-4">
          <div className="flex justify-center gap-6">
            {[...Array(4)].map((_, i) => <div key={i} className="w-[90px] h-[90px] rounded-full bg-white/[0.05]" />)}
          </div>
        </div>
        <div className="card-base rounded-2xl p-6 space-y-4">
          {[...Array(5)].map((_, i) => <div key={i} className="w-full h-10 bg-white/[0.05] rounded" />)}
        </div>
      </div>
    );
  }

  if (status === "streaming" || (status === "processing" && !report)) {
    return (
      <ProcessingOverlay
        steps={streamSteps.length > 0 ? streamSteps : [{ step: "init", label: "Connecting to AI engine...", progress: 3 }]}
        title={ideaTitle || "Analyzing your idea..."}
        subtitle="Our AI is working on your validation report"
      />
    );
  }

  if (status === "error" || (!report && status !== "processing")) {
    return (
      <div className="max-w-2xl mx-auto text-center py-20">
        <div className="w-16 h-16 rounded-2xl bg-red-500/10 flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-white">Validation Failed</h2>
        <p className="text-slate-400 text-sm mt-2 mb-6">The AI analysis encountered an error. You can retry at no additional cost.</p>
        <div className="flex gap-3 justify-center">
          <button onClick={handleRetry} disabled={retrying}
            className="gradient-btn text-white px-5 py-2.5 rounded-xl text-sm font-semibold inline-flex items-center gap-2 disabled:opacity-50 transition-all">
            <svg className={`w-4 h-4 ${retrying ? "animate-spin" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            {retrying ? "Retrying..." : "Retry Validation"}
          </button>
          <Link href="/dashboard" className="px-5 py-2.5 rounded-xl border border-white/[0.06] bg-white/[0.05] text-sm font-medium text-white hover:bg-white/[0.08] transition-colors">
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-slide-up">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <Link href="/dashboard" className="text-sm text-indigo-400 hover:underline mb-1 inline-block">&larr; Back to Dashboard</Link>
          <h1 className="text-2xl font-bold text-white">{ideaTitle}</h1>
        </div>
        <div className="flex gap-2 flex-wrap">
          <button onClick={() => setSkepticMode(!skepticMode)}
            className={`px-4 py-2 rounded-xl border text-sm font-medium flex items-center gap-2 transition-colors ${skepticMode ? "border-red-500/30 bg-red-500/10 text-red-300" : "border-white/[0.06] bg-white/[0.05] text-white hover:bg-white/[0.08]"}`}>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            {skepticMode ? "Skeptic Mode: ON" : "Skeptic Mode: OFF"}
          </button>
          <button onClick={handlePDF} disabled={downloading}
            className="px-4 py-2 rounded-xl border border-white/[0.06] bg-white/[0.05] text-sm font-medium text-white hover:bg-white/[0.08] flex items-center gap-2 disabled:opacity-50 transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            {downloading ? "Exporting..." : "Export PDF"}
          </button>
          <button onClick={() => setShowPivotPanel(!showPivotPanel)}
            className="px-4 py-2 rounded-xl border border-blue-500/30 bg-blue-500/10 text-sm font-medium text-blue-300 hover:bg-blue-500/20 flex items-center gap-2 transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
            </svg>
            Pivot
          </button>
        </div>
      </div>

      {report!.usedFallback && (
        <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 flex items-start gap-3">
          <svg className="w-5 h-5 text-amber-400 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <div>
            <p className="text-sm font-medium text-amber-200">Analysis completed using fallback model</p>
            <p className="text-xs text-amber-400 mt-0.5">Live search was temporarily unavailable. The report was generated using our static AI model. Scores and insights are still actionable but may lack the latest market data.</p>
          </div>
        </div>
      )}

      <div id="report-content" className="space-y-6">
        <div className="card-base rounded-2xl p-6 text-center">
          <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-white text-sm font-semibold ${verdict.color} mb-3 shadow-md`}>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {verdict.text}
          </div>
          <p className="text-6xl font-bold text-white mb-1">{report!.viabilityScore}<span className="text-2xl text-slate-500">/100</span></p>
          <p className="text-slate-400 text-sm">{verdict.desc}</p>
          <div className="flex justify-center gap-6 mt-6 flex-wrap">
            <ScoreCircle score={report!.marketScore} label="Market" color="#6366F1" />
            <ScoreCircle score={report!.competitorScore} label="Competition" color="#8B5CF6" />
            <ScoreCircle score={report!.monetizationScore} label="Monetization" color="#22C55E" />
            <ScoreCircle score={100 - report!.riskScore} label="Safety" color="#F59E0B" />
          </div>
          <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.03] border border-white/[0.06]">
            <span className="text-xs text-slate-400">Execution Complexity:</span>
            <span className={`text-sm font-bold ${execColor}`}>{report!.executionComplexity}/10 &mdash; {execLabel}</span>
          </div>
        </div>

        {parsedDimensions.length > 0 && (
          <div className="card-base rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-blue-500/15 flex items-center justify-center">
                <svg className="w-4 h-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </div>
              <h3 className="text-base font-semibold text-white">Nine-Dimension Index</h3>
            </div>
            <div className="space-y-4">
              {parsedDimensions.map((dim, i) => (
                <DimensionBar key={i} dim={dim} />
              ))}
            </div>
          </div>
        )}

        {report!.valueHypothesis && (
          <div className="card-base rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-blue-500/15 flex items-center justify-center">
                <svg className="w-4 h-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-base font-semibold text-white">Value Hypothesis</h3>
            </div>
            <div className="bg-gradient-to-r from-indigo-500/10 to-violet-500/10 rounded-xl px-5 py-4 border border-indigo-500/20">
              <p className="text-sm text-slate-200 leading-relaxed italic">&ldquo;{report!.valueHypothesis}&rdquo;</p>
            </div>
            {report!.riskiestAssumption && (
              <div className="mt-3 bg-red-500/10 rounded-xl px-5 py-4 border border-red-500/20">
                <p className="text-[10px] uppercase tracking-wider text-red-400 font-semibold mb-1">Riskiest Assumption</p>
                <p className="text-sm text-slate-200 leading-relaxed">{report!.riskiestAssumption}</p>
              </div>
            )}
          </div>
        )}

        {parsedSources.length > 0 && (
          <div className="card-base rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/15 flex items-center justify-center">
                <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
              </div>
              <h3 className="text-base font-semibold text-white">Verified Sources</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {parsedSources.map((source, i) => <SourceBadge key={i} source={source} />)}
            </div>
          </div>
        )}

        {parsedGTM && (
          <div className="card-base rounded-2xl p-6 space-y-5">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-violet-500/15 flex items-center justify-center">
                <svg className="w-4 h-4 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-base font-semibold text-white">GTM Experiments & Action Plan</h3>
            </div>

            <div className="bg-gradient-to-r from-violet-500/10 to-indigo-500/10 rounded-xl p-5 border border-violet-500/20 space-y-3">
              <div>
                <p className="text-[10px] uppercase tracking-wider text-violet-400 font-semibold mb-1">Your Specific ICP</p>
                <p className="text-sm text-slate-200 leading-relaxed">{parsedGTM.specificICP}</p>
              </div>
              <div className="border-t border-violet-500/20 pt-3">
                <p className="text-[10px] uppercase tracking-wider text-violet-400 font-semibold mb-1">Landing Page Hook</p>
                <p className="text-base font-bold text-white">{parsedGTM.landingPageHook}</p>
                <p className="text-sm text-slate-300 mt-1">{parsedGTM.landingPageSubheadline}</p>
              </div>
              <div className="border-t border-violet-500/20 pt-3">
                <p className="text-[10px] uppercase tracking-wider text-violet-400 font-semibold mb-1">Minimum Success Metric</p>
                <p className="text-sm text-slate-200">{parsedGTM.minimumSuccessMetric}</p>
                <p className="text-xs text-violet-300 font-medium mt-1">Target: {parsedGTM.successTarget}</p>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-white mb-3">Low-Cost Experiments</h4>
              <div className="grid sm:grid-cols-2 gap-3">
                {parsedGTM.experiments.map((exp, i) => (
                  <div key={i} className="rounded-xl border border-white/[0.06] p-4 hover:border-violet-500/30 transition-colors">
                    <div className="flex items-start justify-between mb-2">
                      <h5 className="text-sm font-semibold text-white">{exp.title}</h5>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-500/15 text-emerald-400">{exp.cost}</span>
                    </div>
                    <p className="text-xs text-slate-300 mb-2 leading-relaxed">{exp.description}</p>
                    <div className="flex items-center gap-3 text-[10px] text-slate-500">
                      <span className="flex items-center gap-1">
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        {exp.timeframe}
                      </span>
                      <span className="flex items-center gap-1">
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                        {exp.metric}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-white mb-3">Action Checklist</h4>
              <div className="space-y-2">
                {parsedGTM.checklist.map((item, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                    <div className="w-5 h-5 rounded-md border-2 border-white/[0.15] shrink-0 mt-0.5 flex items-center justify-center">
                      <span className="text-[10px] font-bold text-slate-500">{i + 1}</span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-0.5">
                        <p className="text-sm font-medium text-white">{item.task}</p>
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-indigo-500/15 text-indigo-400 shrink-0">{item.deadline}</span>
                      </div>
                      <p className="text-xs text-slate-400">{item.why}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {parsedSkeptic && skepticMode && (
          <div className="card-base rounded-2xl p-6 border-2 border-red-500/30 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-red-500/15 flex items-center justify-center">
                <svg className="w-4 h-4 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <div>
                <h3 className="text-base font-semibold text-white">Skeptic Analysis</h3>
                <p className="text-[10px] text-slate-500 uppercase tracking-wider">Adversarial stress-test</p>
              </div>
            </div>

            <div className="bg-red-500/10 rounded-xl px-5 py-4 border border-red-500/20">
              <p className="text-xs uppercase tracking-wider text-red-400 font-semibold mb-1">Brutal Verdict</p>
              <p className="text-sm text-slate-200 leading-relaxed">{parsedSkeptic.overallVerdict}</p>
            </div>

            <div className="grid sm:grid-cols-2 gap-3">
              <div className="rounded-xl border border-white/[0.06] p-4">
                <p className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold mb-2">Execution Risks</p>
                <ul className="space-y-1">
                  {parsedSkeptic.executionRisks.map((risk, i) => (
                    <li key={i} className="text-xs text-slate-300 flex items-start gap-2">
                      <span className="text-red-400 mt-0.5">•</span>{risk}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-xl border border-white/[0.06] p-4">
                <p className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold mb-2">Regulatory Risks</p>
                <ul className="space-y-1">
                  {parsedSkeptic.regulatoryRisks.map((risk, i) => (
                    <li key={i} className="text-xs text-slate-300 flex items-start gap-2">
                      <span className="text-red-400 mt-0.5">•</span>{risk}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-xl border border-white/[0.06] p-4">
                <p className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold mb-2">Timing Risks</p>
                <ul className="space-y-1">
                  {parsedSkeptic.timingRisks.map((risk, i) => (
                    <li key={i} className="text-xs text-slate-300 flex items-start gap-2">
                      <span className="text-red-400 mt-0.5">•</span>{risk}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-xl border border-white/[0.06] p-4">
                <p className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold mb-2">Structural Flaws</p>
                <ul className="space-y-1">
                  {parsedSkeptic.structuralFlaws.map((risk, i) => (
                    <li key={i} className="text-xs text-slate-300 flex items-start gap-2">
                      <span className="text-red-400 mt-0.5">•</span>{risk}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="flex items-center justify-between bg-white/[0.03] rounded-xl px-5 py-3 border border-white/[0.06]">
              <div>
                <p className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">Biggest Challenge</p>
                <p className="text-sm text-slate-200 font-medium">{parsedSkeptic.keyChallenge}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">Brutal Score</p>
                <p className={`text-2xl font-bold ${parsedSkeptic.brutalScore >= 70 ? "text-red-400" : parsedSkeptic.brutalScore >= 40 ? "text-amber-400" : "text-emerald-400"}`}>{parsedSkeptic.brutalScore}</p>
              </div>
            </div>
          </div>
        )}

        {parsedMarketSizing && (
          <div className="card-base rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-500/15 flex items-center justify-center">
                <svg className="w-4 h-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-base font-semibold text-white">Market Sizing (TAM / SAM / SOM)</h3>
            </div>

            <div className="grid sm:grid-cols-3 gap-3">
              <div className="rounded-xl border border-indigo-500/20 bg-indigo-500/5 p-4 text-center">
                <p className="text-[10px] uppercase tracking-wider text-indigo-400 dark:text-indigo-400 font-semibold mb-1">TAM</p>
                <p className="text-xl font-bold text-white">{parsedMarketSizing.tamValue || "N/A"}</p>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">{parsedMarketSizing.tam}</p>
              </div>
              <div className="rounded-xl border border-violet-500/20 bg-violet-500/5 p-4 text-center">
                <p className="text-[10px] uppercase tracking-wider text-violet-400 font-semibold mb-1">SAM</p>
                <p className="text-xl font-bold text-white">{parsedMarketSizing.samValue || "N/A"}</p>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">{parsedMarketSizing.sam}</p>
              </div>
              <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4 text-center">
                <p className="text-[10px] uppercase tracking-wider text-emerald-400 dark:text-emerald-400 font-semibold mb-1">SOM</p>
                <p className="text-xl font-bold text-white">{parsedMarketSizing.somValue || "N/A"}</p>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">{parsedMarketSizing.som}</p>
              </div>
            </div>

            {parsedMarketSizing.reasoning && (
              <div className="bg-white/[0.03] rounded-xl px-4 py-3 border border-white/[0.06]">
                <p className="text-xs text-slate-300 leading-relaxed">{parsedMarketSizing.reasoning}</p>
              </div>
            )}
          </div>
        )}

        {parsedActionPlan.length > 0 && (
          <div className="card-base rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-violet-500/15 flex items-center justify-center">
                <svg className="w-4 h-4 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h3 className="text-base font-semibold text-white">7-Day Validation Action Plan</h3>
                <p className="text-[10px] text-slate-500 uppercase tracking-wider">Day-by-day execution roadmap</p>
              </div>
            </div>

            <div className="space-y-3">
              {parsedActionPlan.map((day) => (
                <div key={day.day} className="rounded-xl border border-white/[0.06] p-4 hover:border-violet-500/30 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-md bg-violet-500/15 flex items-center justify-center text-[10px] font-bold text-violet-400">D{day.day}</span>
                      <h4 className="text-sm font-semibold text-white">{day.theme}</h4>
                    </div>
                    {day.template && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-indigo-500/15 text-indigo-400">{day.template}</span>
                    )}
                  </div>
                  <ul className="space-y-1 mb-2">
                    {day.tasks.map((task, i) => (
                      <li key={i} className="text-xs text-slate-300 flex items-start gap-2">
                        <span className="text-violet-400 mt-0.5">•</span>{task}
                      </li>
                    ))}
                  </ul>
                  <div className="bg-white/[0.03] rounded-lg px-3 py-2">
                    <p className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold mb-0.5">Expected Outcome</p>
                    <p className="text-xs text-slate-300">{day.expectedOutcome}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {parsedSWOT && (
          <div className="card-base rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-amber-500/15 flex items-center justify-center">
                <svg className="w-4 h-4 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </div>
              <h3 className="text-base font-semibold text-white">SWOT Analysis</h3>
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4">
                <p className="text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-2">Strengths</p>
                <ul className="space-y-1">
                  {(parsedSWOT.strengths || []).map((item: string, i: number) => (
                    <li key={i} className="text-xs text-slate-300 flex items-start gap-2">
                      <span className="text-emerald-400 mt-0.5">-</span>{item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-xl border border-red-500/20 bg-red-50/50 dark:bg-red-500/5 p-4">
                <p className="text-xs font-semibold text-red-700 dark:text-red-400 uppercase tracking-wider mb-2">Weaknesses</p>
                <ul className="space-y-1">
                  {(parsedSWOT.weaknesses || []).map((item: string, i: number) => (
                    <li key={i} className="text-xs text-slate-300 flex items-start gap-2">
                      <span className="text-red-400 mt-0.5">-</span>{item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-xl border border-blue-500/20 bg-blue-50/50 dark:bg-blue-500/5 p-4">
                <p className="text-xs font-semibold text-blue-700 dark:text-blue-400 uppercase tracking-wider mb-2">Opportunities</p>
                <ul className="space-y-1">
                  {(parsedSWOT.opportunities || []).map((item: string, i: number) => (
                    <li key={i} className="text-xs text-slate-300 flex items-start gap-2">
                      <span className="text-blue-400 mt-0.5">-</span>{item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-xl border border-amber-500/20 bg-amber-50/50 dark:bg-amber-500/5 p-4">
                <p className="text-xs font-semibold text-amber-400 uppercase tracking-wider mb-2">Threats</p>
                <ul className="space-y-1">
                  {(parsedSWOT.threats || []).map((item: string, i: number) => (
                    <li key={i} className="text-xs text-slate-300 flex items-start gap-2">
                      <span className="text-amber-400 mt-0.5">-</span>{item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {parsedCompetitive && (
          <div className="card-base rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-500/15 flex items-center justify-center">
                <svg className="w-4 h-4 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-base font-semibold text-white">Competitive Landscape</h3>
            </div>

            {parsedCompetitive.directCompetitors.length > 0 && (
              <div>
                <p className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold mb-2">Direct Competitors</p>
                <div className="space-y-2">
                  {parsedCompetitive.directCompetitors.map((comp: { name: string; description: string; strength: string; weakness: string }, i: number) => (
                    <div key={i} className="rounded-xl border border-white/[0.06] p-3">
                      <p className="text-sm font-semibold text-white mb-1">{comp.name}</p>
                      <p className="text-xs text-slate-300 mb-2">{comp.description}</p>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="bg-emerald-500/10 rounded-lg px-2.5 py-1.5">
                          <p className="text-[10px] text-emerald-400 font-semibold mb-0.5">Strength</p>
                          <p className="text-[11px] text-slate-300">{comp.strength}</p>
                        </div>
                        <div className="bg-red-500/10 rounded-lg px-2.5 py-1.5">
                          <p className="text-[10px] text-red-400 font-semibold mb-0.5">Weakness</p>
                          <p className="text-[11px] text-slate-300">{comp.weakness}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {parsedCompetitive.indirectCompetitors.length > 0 && (
              <div>
                <p className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold mb-2">Indirect Competitors</p>
                <div className="flex flex-wrap gap-2">
                  {parsedCompetitive.indirectCompetitors.map((comp: { name: string; description: string }, i: number) => (
                    <div key={i} className="rounded-lg border border-white/[0.06] px-3 py-2">
                      <p className="text-xs font-medium text-white">{comp.name}</p>
                      <p className="text-[10px] text-slate-400">{comp.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {parsedCompetitive.marketGaps.length > 0 && (
              <div className="bg-blue-500/10 rounded-xl px-4 py-3 border border-blue-500/20">
                <p className="text-[10px] uppercase tracking-wider text-blue-400 dark:text-blue-400 font-semibold mb-1">Market Gaps</p>
                <ul className="space-y-1">
                  {parsedCompetitive.marketGaps.map((gap: string, i: number) => (
                    <li key={i} className="text-xs text-slate-300 flex items-start gap-2">
                      <span className="text-blue-400 mt-0.5">-</span>{gap}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {parsedCompetitive.differentiationStrategy && (
              <div className="bg-violet-500/10 rounded-xl px-4 py-3 border border-violet-500/20">
                <p className="text-[10px] uppercase tracking-wider text-violet-400 font-semibold mb-1">Differentiation Strategy</p>
                <p className="text-sm text-slate-200 leading-relaxed">{parsedCompetitive.differentiationStrategy}</p>
              </div>
            )}
          </div>
        )}

        {parsedMarketTiming && (
          <div className="card-base rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-amber-500/15 flex items-center justify-center">
                <svg className="w-4 h-4 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-base font-semibold text-white">Market Timing</h3>
              <span className={`ml-auto px-3 py-1 rounded-full text-xs font-bold ${
                parsedMarketTiming.score >= 70 ? "bg-emerald-500/15 text-emerald-400"
                : parsedMarketTiming.score >= 40 ? "bg-amber-500/15 text-amber-400"
                : "bg-red-500/15 text-red-700 dark:text-red-400"
              }`}>{parsedMarketTiming.score}/100</span>
            </div>

            <div className="flex items-center gap-3">
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                parsedMarketTiming.trend === "rising" ? "bg-emerald-500/15 text-emerald-400"
                : parsedMarketTiming.trend === "stable" ? "bg-blue-500/15 text-blue-700 dark:text-blue-400"
                : "bg-red-500/15 text-red-700 dark:text-red-400"
              }`}>
                {parsedMarketTiming.trend === "rising" ? "Rising" : parsedMarketTiming.trend === "stable" ? "Stable" : "Declining"}
              </span>
              <span className="text-xs text-slate-400">Window: {parsedMarketTiming.windowOfOpportunity}</span>
            </div>

            <div className="bg-white/[0.03] rounded-xl px-4 py-3 border border-white/[0.06]">
              <p className="text-xs text-slate-300 leading-relaxed">{parsedMarketTiming.reasoning}</p>
            </div>

            {parsedMarketTiming.signals.length > 0 && (
              <div>
                <p className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold mb-2">Signals</p>
                <div className="flex flex-wrap gap-2">
                  {parsedMarketTiming.signals.map((signal: { label: string; direction: string }, i: number) => (
                    <div key={i} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/[0.06]">
                      <span className={`w-2 h-2 rounded-full ${
                        signal.direction === "up" ? "bg-emerald-500"
                        : signal.direction === "down" ? "bg-red-500"
                        : "bg-slate-400"
                      }`} />
                      <span className="text-xs text-slate-300">{signal.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        <div className="grid lg:grid-cols-2 gap-4">
          <div className="card-base rounded-2xl p-5">
            <h3 className="text-sm font-semibold text-white mb-3">Radar Analysis</h3>
            <LazyRadarChart data={radarData} />
          </div>
          <div className="card-base rounded-2xl p-5">
            <h3 className="text-sm font-semibold text-white mb-3">Score Breakdown</h3>
            <LazyBarChart data={barData} />
          </div>
        </div>

        {[
          { title: "Market Analysis", content: report!.marketAnalysis, icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z", color: "text-indigo-400" },
          { title: "Competitor Overview", content: report!.competitorOverview, icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z", color: "text-violet-400" },
          { title: "Monetization Models", content: report!.monetizationModels, icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z", color: "text-emerald-400" },
          { title: "Risk Assessment", content: report!.riskAssessment, icon: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z", color: "text-amber-400" },
          { title: "Next Steps", content: report!.nextSteps, icon: "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6", color: "text-blue-400" },
        ].map((section) => (
          <div key={section.title} className="card-base rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-white/[0.05] flex items-center justify-center">
                <svg className={`w-4 h-4 ${section.color}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d={section.icon} />
                </svg>
              </div>
              <h3 className="text-base font-semibold text-white">{section.title}</h3>
            </div>
            <div className="text-sm text-slate-300 whitespace-pre-line leading-relaxed">{section.content}</div>
          </div>
        ))}
      </div>

      {showPivotPanel && (
        <div className="card-base rounded-2xl p-6 border-2 border-indigo-200 dark:border-indigo-500/30 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-500/15 flex items-center justify-center">
                <svg className="w-4 h-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
              </div>
              <h3 className="text-base font-semibold text-white">Pivot Assistant</h3>
            </div>
            <button onClick={() => setShowPivotPanel(false)} className="text-slate-500 hover:text-slate-300">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          {report!.viabilityScore < 70 && (
            <div className="bg-gradient-to-r from-indigo-500/10 to-violet-500/10 rounded-xl px-4 py-3 border border-indigo-500/20">
              <p className="text-sm text-slate-300">Your score is <span className="font-bold">{report!.viabilityScore}/100</span>. Here are 3 alternative directions to explore, or chat with the AI for personalized pivot advice.</p>
            </div>
          )}
          {parsedPivots.length === 0 && !pivotLoading && (
            <button onClick={handleGeneratePivots}
              className="w-full py-3 rounded-xl border-2 border-dashed border-indigo-200 dark:border-indigo-500/30 text-sm font-medium text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 transition-colors">
              Generate Pivot Suggestions
            </button>
          )}
          {pivotLoading && (
            <div className="space-y-2">
              {pivotSteps.map((step, i) => (
                <div key={i} className="flex items-center gap-3 text-sm text-slate-300">
                  <div className="w-5 h-5 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
                  <span>{step.label}</span>
                </div>
              ))}
            </div>
          )}
          {parsedPivots.length > 0 && (
            <div className="grid sm:grid-cols-3 gap-3">
              {parsedPivots.map((pivot, i) => <PivotCard key={i} pivot={pivot} onPivotTo={handlePivotTo} />)}
            </div>
          )}
          <div className="border-t border-white/[0.06] pt-4">
            <p className="text-xs font-medium text-slate-400 mb-2">Chat with Pivot Assistant</p>
            <div className="h-48 overflow-y-auto rounded-xl bg-white/[0.03] p-3 space-y-2 mb-2">
              {chatMessages.length === 0 && (
                <p className="text-xs text-slate-500 text-center py-6">Ask about pivoting, targeting a different audience, or changing your business model...</p>
              )}
              {chatMessages.map((msg, i) => (
                <div key={i} className={`text-xs px-3 py-2 rounded-lg max-w-[85%] ${msg.role === "user" ? "bg-indigo-500/20 text-indigo-200 ml-auto" : "bg-white/[0.05] text-slate-200 border border-white/[0.06]"}`}>
                  {msg.content}
                </div>
              ))}
              {chatSending && (
                <div className="bg-white/[0.05] border border-white/[0.06] rounded-lg px-3 py-2 max-w-[85%]">
                  <div className="flex gap-1"><span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" /><span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:0.15s]" /><span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:0.3s]" /></div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>
            <div className="flex gap-2">
              <input type="text" value={chatInput} onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleChat()}
                placeholder="Ask about pivoting your idea..."
                className="flex-1 px-3 py-2 rounded-xl border border-white/[0.06] bg-white/[0.05] text-white text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors placeholder:text-slate-500" />
              <button onClick={handleChat} disabled={chatSending || !chatInput.trim()}
                className="gradient-btn text-white px-4 py-2 rounded-xl text-xs font-semibold disabled:opacity-50 transition-all">
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
