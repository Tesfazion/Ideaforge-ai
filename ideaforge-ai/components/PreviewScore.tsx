"use client";
import { useState } from "react";

export default function PreviewScore() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ viabilityScore: number; marketScore: number; competitorScore: number; monetizationScore: number; riskScore: number; message: string; usedFallback: boolean } | null>(null);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const res = await fetch("/api/preview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to generate preview");
      setResult(data);
    } catch (err: unknown) {
      const error = err as { message?: string };
      setError(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-16 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800/50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-slate-900">Get Your Instant Preview Score</h2>
          <p className="mt-3 text-gray-500 dark:text-gray-400">No sign-up required. See your viability score in seconds.</p>
        </div>

        <div className="card-base glass-card rounded-2xl p-6 sm:p-8 border border-gray-200 dark:border-gray-700">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-gray-200 mb-1.5">Idea Title</label>
              <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. AI-Powered Fitness Coach" suppressHydrationWarning
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-colors placeholder:text-gray-400" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-gray-200 mb-1.5">Brief Description</label>
              <textarea required rows={3} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Describe your idea in 2-3 sentences..."
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-colors resize-none placeholder:text-gray-400" />
            </div>
            <button type="submit" disabled={loading} suppressHydrationWarning
              className="w-full gradient-btn text-slate-900 font-semibold py-3 rounded-xl text-sm disabled:opacity-50 flex items-center justify-center gap-2">
              {loading ? (
                <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Analyzing...</>
              ) : (
                <><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg> Get Free Preview Score</>
              )}
            </button>
          </form>

          {error && (
            <div className="mt-4 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-700 dark:text-red-400 text-sm px-4 py-3 rounded-xl">{error}</div>
          )}

          {result && (
            <div className="mt-6 animate-slide-up">
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                <div className="text-center">
                  <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-slate-900 text-sm font-semibold mb-2 ${result.viabilityScore >= 60 ? "bg-emerald-500" : result.viabilityScore >= 40 ? "bg-amber-500" : "bg-red-500"}`}>
                    {result.viabilityScore >= 60 ? "Promising" : result.viabilityScore >= 40 ? "Needs Work" : "High Risk"}
                  </div>
                  <p className="text-5xl font-bold text-gray-900 dark:text-slate-900">{result.viabilityScore}<span className="text-xl text-gray-400">/100</span></p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Viability Score</p>
                </div>
                <div className="flex flex-wrap justify-center gap-4">
                  {[
                    { label: "Market", score: result.marketScore, color: "#6366F1" },
                    { label: "Competition", score: result.competitorScore, color: "#8B5CF6" },
                    { label: "Monetization", score: result.monetizationScore, color: "#22C55E" },
                    { label: "Safety", score: 100 - result.riskScore, color: "#F59E0B" },
                  ].map((item) => (
                    <div key={item.label} className="flex flex-col items-center">
                      <svg width="70" height="70">
                        <circle cx="35" cy="35" r="28" fill="none" stroke="#E2E8F0" className="dark:stroke-gray-700" strokeWidth="5" />
                        <circle cx="35" cy="35" r="28" fill="none" stroke={item.color} strokeWidth="5"
                          strokeDasharray={2 * Math.PI * 28} strokeDashoffset={2 * Math.PI * 28 * (1 - item.score / 100)}
                          strokeLinecap="round" transform="rotate(-90 35 35)" className="transition-all duration-1000" />
                        <text x="35" y="35" textAnchor="middle" dominantBaseline="central" className="text-sm font-bold fill-current text-gray-900 dark:text-slate-900">{item.score}</text>
                      </svg>
                      <span className="text-[10px] text-gray-500 dark:text-gray-400 mt-1">{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>
              <p className="text-center text-xs text-gray-500 dark:text-gray-400 mt-4">{result.message}</p>
              <div className="text-center mt-4">
                <a href="/register" className="gradient-btn text-slate-900 px-6 py-2.5 rounded-xl text-sm font-semibold inline-flex items-center gap-2">
                  Sign Up to Unlock Full Report
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
