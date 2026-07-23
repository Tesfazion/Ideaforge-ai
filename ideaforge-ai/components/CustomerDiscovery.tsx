"use client";

import { useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface PainPoint {
  quote: string;
  source: string;
  url: string;
  platform: string;
  sentiment: "frustrated" | "seeking" | "angry" | "curious";
}

interface DemandSignal {
  signal: string;
  evidence: string;
  strength: "strong" | "moderate" | "weak";
  sourceCount: number;
}

interface CompetitorMention {
  name: string;
  context: string;
  sentiment: "positive" | "negative" | "neutral";
  frequency: number;
  url: string;
}

interface DiscoveryResult {
  painPoints: PainPoint[];
  demandSignals: DemandSignal[];
  competitorMentions: CompetitorMention[];
  suggestedOutreach: string[];
  rawSources: { title: string; url: string; snippet: string; platform: string }[];
  summary: string;
}

interface ProgressStep {
  step: string;
  label: string;
  progress: number;
}

const SENTIMENT_CONFIG: Record<string, { color: string; bg: string; border: string; label: string }> = {
  frustrated: { color: "text-red-400", bg: "bg-red-500/10", border: "border-red-500/20", label: "Frustrated" },
  seeking: { color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20", label: "Seeking Help" },
  angry: { color: "text-orange-400", bg: "bg-orange-500/10", border: "border-orange-500/20", label: "Angry" },
  curious: { color: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/20", label: "Curious" },
};

const STRENGTH_CONFIG: Record<string, { color: string; bg: string; label: string }> = {
  strong: { color: "text-emerald-400", bg: "bg-emerald-500/10", label: "Strong" },
  moderate: { color: "text-yellow-400", bg: "bg-yellow-500/10", label: "Moderate" },
  weak: { color: "text-slate-400", bg: "bg-slate-500/10", label: "Weak" },
};

const COMPETITOR_SENTIMENT: Record<string, { color: string; label: string }> = {
  positive: { color: "text-emerald-400", label: "Positive" },
  negative: { color: "text-red-400", label: "Negative" },
  neutral: { color: "text-slate-400", label: "Neutral" },
};

export default function CustomerDiscovery({
  ideaId,
  ideaTitle,
  ideaDescription,
}: {
  ideaId: string;
  ideaTitle: string;
  ideaDescription: string;
}) {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState<ProgressStep[]>([]);
  const [result, setResult] = useState<DiscoveryResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const runDiscovery = useCallback(async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    setProgress([]);

    const abortController = new AbortController();
    abortRef.current = abortController;

    try {
      const token = document.cookie
        .split("; ")
        .find((c) => c.startsWith("token="))
        ?.split("=")[1];

      const res = await fetch(`/api/ideas/${ideaId}/discover`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ title: ideaTitle, description: ideaDescription }),
        signal: abortController.signal,
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || `Request failed (${res.status})`);
      }

      const reader = res.body?.getReader();
      if (!reader) throw new Error("No response stream");

      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed.startsWith("data: ")) continue;
          const jsonStr = trimmed.slice(6);

          try {
            const event = JSON.parse(jsonStr);

            if (event.type === "progress") {
              setProgress((prev) => {
                const existing = prev.findIndex((p) => p.step === event.step);
                if (existing >= 0) {
                  const updated = [...prev];
                  updated[existing] = { step: event.step, label: event.label, progress: event.progress };
                  return updated;
                }
                return [...prev, { step: event.step, label: event.label, progress: event.progress }];
              });
            } else if (event.type === "complete") {
              setResult(event.result);
            } else if (event.type === "error") {
              setError(event.message);
            }
          } catch {
            // skip malformed lines
          }
        }
      }
    } catch (err: unknown) {
      if (err instanceof Error && err.name === "AbortError") return;
      setError(err instanceof Error ? err.message : "Discovery failed");
    } finally {
      setLoading(false);
      abortRef.current = null;
    }
  }, [ideaId, ideaTitle, ideaDescription]);

  const copyToClipboard = useCallback(async (text: string, idx: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIdx(idx);
      setTimeout(() => setCopiedIdx(null), 2000);
    } catch {
      // fallback
    }
  }, []);

  const currentProgress = progress.length > 0 ? progress[progress.length - 1] : null;
  const progressPercent = currentProgress?.progress || 0;

  return (
    <div className="space-y-4">
      <motion.button
        onClick={runDiscovery}
        disabled={loading}
        whileHover={!loading ? { scale: 1.01 } : {}}
        whileTap={!loading ? { scale: 0.98 } : {}}
        className={`w-full py-3.5 px-5 rounded-xl text-sm font-semibold transition-all duration-300 flex items-center justify-center gap-2.5 ${
          loading
            ? "bg-indigo-500/20 text-indigo-300 cursor-wait border border-indigo-500/20"
            : "bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40"
        }`}
      >
        {loading ? (
          <>
            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Scanning platforms...
          </>
        ) : (
          <>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            Discover Customer Pain Points
          </>
        )}
      </motion.button>

      <AnimatePresence>
        {loading && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
            <div className="bg-[#0c1220] border border-white/[0.06] rounded-xl p-4">
              <div className="relative mb-3">
                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full"
                    initial={{ width: "0%" }}
                    animate={{ width: `${progressPercent}%` }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                  />
                </div>
                <div className="flex justify-between mt-1.5">
                  <span className="text-[11px] font-medium text-indigo-400">{progressPercent}%</span>
                  <span className="text-[11px] text-slate-500">Scanning Reddit, HN, PH, X...</span>
                </div>
              </div>
              <div className="space-y-1">
                {progress.map((p, i) => (
                  <motion.div key={`${p.step}-${i}`} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-2 text-[12px]">
                    <svg className="w-3 h-3 text-emerald-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-slate-400">{p.label}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {error && (
        <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-sm text-red-400">
          {error}
        </motion.div>
      )}

      <AnimatePresence>
        {result && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.4, ease: "easeOut" }} className="space-y-4">
            {result.summary && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="bg-[#0c1220] border border-white/[0.06] rounded-xl p-4">
                <p className="text-sm text-slate-300 leading-relaxed">{result.summary}</p>
              </motion.div>
            )}

            {result.painPoints.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="bg-[#0c1220] border border-white/[0.06] rounded-xl overflow-hidden">
                <div className="px-4 py-3 border-b border-white/[0.06] flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                    <svg className="w-3.5 h-3.5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white">Pain Points Found</h4>
                    <p className="text-[11px] text-slate-500">{result.painPoints.length} real user complaints & requests</p>
                  </div>
                </div>
                <div className="p-3 space-y-2 max-h-[400px] overflow-y-auto">
                  {result.painPoints.map((pp, i) => {
                    const sentiment = SENTIMENT_CONFIG[pp.sentiment] || SENTIMENT_CONFIG.seeking;
                    return (
                      <motion.div key={i} initial={{ opacity: 0, x: -5 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.05 * i }} className="bg-white/[0.02] border border-white/[0.04] rounded-lg p-3 hover:border-white/[0.08] transition-colors">
                        <div className="flex items-start justify-between gap-2 mb-1.5">
                          <span className={`inline-flex items-center text-[10px] font-medium px-1.5 py-0.5 rounded-md ${sentiment.bg} ${sentiment.color} border ${sentiment.border}`}>
                            {sentiment.label}
                          </span>
                          <span className="text-[10px] text-slate-600">{pp.platform}</span>
                        </div>
                        <p className="text-[13px] text-slate-300 leading-relaxed italic">&ldquo;{pp.quote}&rdquo;</p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-[11px] text-slate-500 truncate max-w-[200px]">{pp.source}</span>
                          {pp.url && (
                            <a href={pp.url} target="_blank" rel="noopener noreferrer" className="text-[10px] text-indigo-400 hover:text-indigo-300 underline underline-offset-2">
                              View source
                            </a>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {result.demandSignals.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="bg-[#0c1220] border border-white/[0.06] rounded-xl overflow-hidden">
                <div className="px-4 py-3 border-b border-white/[0.06] flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                    <svg className="w-3.5 h-3.5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white">Demand Signals</h4>
                    <p className="text-[11px] text-slate-500">Evidence of market demand</p>
                  </div>
                </div>
                <div className="p-3 space-y-2">
                  {result.demandSignals.map((ds, i) => {
                    const strength = STRENGTH_CONFIG[ds.strength] || STRENGTH_CONFIG.moderate;
                    return (
                      <motion.div key={i} initial={{ opacity: 0, x: -5 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.05 * i }} className="bg-white/[0.02] border border-white/[0.04] rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-md ${strength.bg} ${strength.color}`}>{strength.label}</span>
                          <span className="text-[10px] text-slate-600">{ds.sourceCount} sources</span>
                        </div>
                        <p className="text-[13px] text-white font-medium mb-0.5">{ds.signal}</p>
                        <p className="text-[12px] text-slate-400">{ds.evidence}</p>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {result.competitorMentions.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="bg-[#0c1220] border border-white/[0.06] rounded-xl overflow-hidden">
                <div className="px-4 py-3 border-b border-white/[0.06] flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center">
                    <svg className="w-3.5 h-3.5 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white">Competitor Mentions</h4>
                    <p className="text-[11px] text-slate-500">{result.competitorMentions.length} alternatives discussed by users</p>
                  </div>
                </div>
                <div className="p-3 space-y-2">
                  {result.competitorMentions.map((cm, i) => {
                    const sentiment = COMPETITOR_SENTIMENT[cm.sentiment] || COMPETITOR_SENTIMENT.neutral;
                    return (
                      <motion.div key={i} initial={{ opacity: 0, x: -5 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.05 * i }} className="bg-white/[0.02] border border-white/[0.04] rounded-lg p-3">
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-[13px] text-white font-medium">{cm.name}</p>
                          <div className="flex items-center gap-2">
                            <span className={`text-[10px] font-medium ${sentiment.color}`}>{sentiment.label}</span>
                            <span className="text-[10px] text-slate-600">x{cm.frequency}</span>
                          </div>
                        </div>
                        <p className="text-[12px] text-slate-400">{cm.context}</p>
                        {cm.url && (
                          <a href={cm.url} target="_blank" rel="noopener noreferrer" className="text-[10px] text-indigo-400 hover:text-indigo-300 underline underline-offset-2 mt-1 inline-block">
                            View discussion
                          </a>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {result.suggestedOutreach.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }} className="bg-[#0c1220] border border-white/[0.06] rounded-xl overflow-hidden">
                <div className="px-4 py-3 border-b border-white/[0.06] flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-violet-500/10 border border-violet-500/20 flex items-center justify-center">
                    <svg className="w-3.5 h-3.5 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white">Suggested Outreach</h4>
                    <p className="text-[11px] text-slate-500">AI-generated messages for customer interviews</p>
                  </div>
                </div>
                <div className="p-3 space-y-2">
                  {result.suggestedOutreach.map((msg, i) => (
                    <motion.div key={i} initial={{ opacity: 0, x: -5 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.05 * i }} className="bg-white/[0.02] border border-white/[0.04] rounded-lg p-3 group relative">
                      <p className="text-[12px] text-slate-300 leading-relaxed pr-8">{msg}</p>
                      <button
                        onClick={() => copyToClipboard(msg, i)}
                        className="absolute top-2 right-2 p-1.5 rounded-md bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] transition-all opacity-0 group-hover:opacity-100"
                        title="Copy to clipboard"
                      >
                        {copiedIdx === i ? (
                          <svg className="w-3 h-3 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        ) : (
                          <svg className="w-3 h-3 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                        )}
                      </button>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {result.rawSources.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }} className="bg-[#0c1220] border border-white/[0.06] rounded-xl overflow-hidden">
                <div className="px-4 py-3 border-b border-white/[0.06] flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-slate-500/10 border border-slate-500/20 flex items-center justify-center">
                    <svg className="w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white">Raw Sources</h4>
                    <p className="text-[11px] text-slate-500">{result.rawSources.length} results scanned across platforms</p>
                  </div>
                </div>
                <div className="p-3 space-y-1.5 max-h-[300px] overflow-y-auto">
                  {result.rawSources.slice(0, 10).map((src, i) => (
                    <a key={i} href={src.url} target="_blank" rel="noopener noreferrer" className="block bg-white/[0.02] border border-white/[0.04] rounded-lg p-2.5 hover:border-white/[0.08] transition-colors">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-[10px] font-medium text-indigo-400 bg-indigo-500/10 px-1.5 py-0.5 rounded">{src.platform}</span>
                      </div>
                      <p className="text-[12px] text-slate-300 truncate">{src.title}</p>
                      {src.snippet && <p className="text-[11px] text-slate-500 truncate mt-0.5">{src.snippet}</p>}
                    </a>
                  ))}
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
