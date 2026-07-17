"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { streamGenerateIdeas, SSEProgressEvent, GeneratedIdea } from "@/lib/api";

export default function GeneratePage() {
  const { token } = useAuth();
  const router = useRouter();
  const [prompt, setPrompt] = useState("");
  const [industry, setIndustry] = useState("");
  const [ideas, setIdeas] = useState<GeneratedIdea[]>([]);
  const [streaming, setStreaming] = useState(false);
  const [streamSteps, setStreamSteps] = useState<{ step: string; label: string; progress: number }[]>([]);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");
  const [validatingIdx, setValidatingIdx] = useState<number | null>(null);

  const handleGenerate = () => {
    if (!token || !prompt.trim()) return;
    setStreaming(true);
    setIdeas([]);
    setStreamSteps([]);
    setProgress(0);
    setError("");

    streamGenerateIdeas(token, prompt, industry, (event: SSEProgressEvent & { ideas?: GeneratedIdea[] }) => {
      if (event.type === "progress" && event.step && event.label && event.progress !== undefined) {
        setProgress(event.progress);
        setStreamSteps((prev) => {
          const exists = prev.findIndex((s) => s.step === event.step);
          if (exists >= 0) {
            const next = [...prev];
            next[exists] = { step: event.step!, label: event.label!, progress: event.progress! };
            return next;
          }
          return [...prev, { step: event.step!, label: event.label!, progress: event.progress! }];
        });
      } else if (event.type === "complete" && event.ideas) {
        setIdeas(event.ideas);
        setStreaming(false);
        setProgress(100);
      } else if (event.type === "error") {
        setError(event.message || "Generation failed");
        setStreaming(false);
      }
    });
  };

  const handleValidateIdea = async (idea: GeneratedIdea, idx: number) => {
    if (!token) return;
    setValidatingIdx(idx);
    try {
      const formData = new FormData();
      formData.append("title", idea.title);
      formData.append("description", idea.description);
      formData.append("targetAudience", idea.targetAudience);
      formData.append("industry", idea.industry);
      const res = await fetch(`/api/ideas`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const data = await res.json();
      if (data.idea) {
        router.push(`/dashboard/idea/${data.idea.id}`);
      }
    } catch {
      setError("Failed to save idea");
      setValidatingIdx(null);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-slide-up">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center shadow-lg shadow-violet-500/25">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          AI Idea Generator
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Describe your interests and our AI will generate business ideas for you</p>
      </div>

      <div className="card-base rounded-2xl p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-900 dark:text-gray-200 mb-1.5">What interests you? *</label>
          <textarea
            rows={3}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g. I'm interested in AI, fitness, and sustainability. I want to help small businesses reduce waste..."
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-colors resize-none placeholder:text-gray-400"
          />
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-900 dark:text-gray-200 mb-1.5">Industry (optional)</label>
            <select value={industry} onChange={(e) => setIndustry(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20">
              <option value="">Any industry</option>
              <option>Technology</option><option>Healthcare</option><option>Finance</option><option>E-commerce</option>
              <option>Education</option><option>Entertainment</option><option>Food & Beverage</option><option>Real Estate</option>
              <option>Travel</option><option>Sustainability</option><option>Other</option>
            </select>
          </div>
          <div className="flex items-end">
            <button
              onClick={handleGenerate}
              disabled={streaming || !prompt.trim()}
              className="w-full sm:w-auto gradient-btn text-white px-6 py-2.5 rounded-xl text-sm font-semibold disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {streaming ? (
                <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Generating...</>
              ) : (
                <><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg> Generate Ideas</>
              )}
            </button>
          </div>
        </div>
      </div>

      {streaming && (
        <div className="card-base rounded-2xl p-6 animate-slide-up">
          <div className="mb-4">
            <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
            </div>
            <div className="flex justify-between mt-2">
              <span className="text-xs font-medium text-violet-600 dark:text-violet-400">{progress}%</span>
              <span className="text-xs text-gray-400">Brainstorming...</span>
            </div>
          </div>
          <div className="space-y-1.5">
            {streamSteps.map((s, i) => (
              <div key={`${s.step}-${i}`} className="flex items-center gap-2 text-sm">
                <div className={`w-5 h-5 rounded flex items-center justify-center ${
                  i < streamSteps.length - 1 ? "bg-emerald-100 dark:bg-emerald-500/15" :
                  s.step === "done" ? "bg-emerald-100 dark:bg-emerald-500/15" :
                  "bg-violet-100 dark:bg-violet-500/15"
                }`}>
                  {i < streamSteps.length - 1 || s.step === "done" ? (
                    <svg className="w-3 h-3 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <div className="w-2 h-2 rounded-full bg-violet-500 animate-pulse" />
                  )}
                </div>
                <span className={i === streamSteps.length - 1 ? "text-violet-600 dark:text-violet-400 font-medium" : "text-gray-500 dark:text-gray-400"}>
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-700 dark:text-red-400 text-sm px-4 py-3 rounded-xl">{error}</div>
      )}

      {ideas.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg bg-violet-100 dark:bg-violet-500/15 flex items-center justify-center text-xs font-bold text-violet-600 dark:text-violet-400">{ideas.length}</span>
            Generated Ideas
          </h2>
          {ideas.map((idea, idx) => (
            <div key={idx} className="card-base rounded-2xl p-6 hover:shadow-lg dark:hover:shadow-violet-500/5 transition-all duration-300 animate-slide-up" style={{ animationDelay: `${idx * 100}ms` }}>
              <div className="flex items-start justify-between gap-4 mb-3">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">{idea.title}</h3>
                <div className="shrink-0 flex items-center gap-1.5 bg-violet-50 dark:bg-violet-500/10 px-3 py-1 rounded-full">
                  <svg className="w-3.5 h-3.5 text-violet-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                  <span className="text-xs font-bold text-violet-600 dark:text-violet-400">{idea.viabilityScore}%</span>
                </div>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">{idea.description}</p>
              <div className="grid sm:grid-cols-3 gap-3 mb-4">
                <div className="rounded-xl bg-gray-50 dark:bg-gray-800/50 p-3">
                  <p className="text-[11px] uppercase tracking-wider text-gray-400 dark:text-gray-500 font-medium mb-1">Market Opportunity</p>
                  <p className="text-xs text-gray-700 dark:text-gray-300">{idea.marketOpportunity}</p>
                </div>
                <div className="rounded-xl bg-gray-50 dark:bg-gray-800/50 p-3">
                  <p className="text-[11px] uppercase tracking-wider text-gray-400 dark:text-gray-500 font-medium mb-1">Revenue Model</p>
                  <p className="text-xs text-gray-700 dark:text-gray-300">{idea.monetizationHint}</p>
                </div>
                <div className="rounded-xl bg-gray-50 dark:bg-gray-800/50 p-3">
                  <p className="text-[11px] uppercase tracking-wider text-gray-400 dark:text-gray-500 font-medium mb-1">Why It Works</p>
                  <p className="text-xs text-gray-700 dark:text-gray-300">{idea.whyItWorks}</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-gray-400 dark:text-gray-500">
                  <span className="px-2 py-0.5 rounded-md bg-gray-100 dark:bg-gray-800">{idea.industry || "General"}</span>
                  <span>{idea.targetAudience}</span>
                </div>
                <button
                  onClick={() => handleValidateIdea(idea, idx)}
                  disabled={validatingIdx !== null}
                  className="gradient-btn text-white px-4 py-2 rounded-xl text-xs font-semibold disabled:opacity-50 flex items-center gap-1.5"
                >
                  {validatingIdx === idx ? (
                    <><div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" /> Saving...</>
                  ) : (
                    <><svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> Validate This Idea</>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {!streaming && ideas.length === 0 && !error && (
        <div className="text-center py-16">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-violet-100 to-fuchsia-100 dark:from-violet-500/10 dark:to-fuchsia-500/10 flex items-center justify-center mx-auto mb-5">
            <svg className="w-10 h-10 text-violet-400 dark:text-violet-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Tell us what excites you</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md mx-auto">Describe your interests, skills, or problems you want to solve. Our AI will generate personalized business ideas with market analysis.</p>
        </div>
      )}
    </div>
  );
}
