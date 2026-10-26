"use client";
import { useState } from "react";
import Link from "next/link";

type PreviewResult = {
  viabilityScore: number;
  marketScore: number;
  competitorScore: number;
  monetizationScore: number;
  riskScore: number;
  message: string;
  usedFallback: boolean;
};

export default function PreviewScore() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PreviewResult | null>(null);
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

  const tone =
    result && result.viabilityScore >= 60
      ? "badge badge-success"
      : result && result.viabilityScore >= 40
        ? "badge badge-warning"
        : "badge badge-danger";

  return (
    <section className="section bg-surface" id="preview">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <span className="eyebrow">Free preview</span>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            Get an instant preview score
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-base leading-relaxed text-copy">
            No account required. Describe your idea and see how it scores before you sign up.
          </p>
        </div>

        <div className="card mt-10 p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="field">
              <label htmlFor="preview-title" className="label">Idea title</label>
              <input
                id="preview-title"
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. AI-powered fitness coach"
                suppressHydrationWarning
                className="input"
              />
            </div>

            <div className="field">
              <label htmlFor="preview-description" className="label">Brief description</label>
              <textarea
                id="preview-description"
                required
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your idea in two or three sentences…"
                className="textarea resize-none"
              />
              <p className="helper">Include who it is for and how it makes money.</p>
            </div>

            <button type="submit" disabled={loading} className="btn btn-primary btn-block">
              {loading ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" aria-hidden="true" />
                  Analyzing…
                </>
              ) : (
                <>
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Get free preview score
                </>
              )}
            </button>
          </form>

          {error && (
            <div
              role="alert"
              className="mt-5 rounded-lg border px-4 py-3 text-sm"
              style={{
                borderColor: "var(--danger-line)",
                backgroundColor: "var(--danger-soft)",
                color: "var(--danger-ink)",
              }}
            >
              {error}
            </div>
          )}

          {result && (
            <div className="animate-slide-up mt-8 border-t border-line pt-8">
              <div className="flex flex-col items-center gap-8 sm:flex-row sm:justify-center">
                <div className="text-center">
                  <span className={`${tone} mb-3`}>
                    {result.viabilityScore >= 60 ? "Promising" : result.viabilityScore >= 40 ? "Needs work" : "High risk"}
                  </span>
                  <p className="font-heading text-5xl font-bold tracking-tight text-ink">
                    {result.viabilityScore}
                    <span className="text-xl font-medium text-muted">/100</span>
                  </p>
                  <p className="mt-1 text-xs text-muted">Viability score</p>
                </div>

                <div className="flex flex-wrap justify-center gap-5">
                  {[
                    { label: "Market", score: result.marketScore, color: "var(--brand-blue)" },
                    { label: "Competition", score: result.competitorScore, color: "var(--brand-blue)" },
                    { label: "Monetization", score: result.monetizationScore, color: "var(--brand-orange)" },
                    { label: "Safety", score: 100 - result.riskScore, color: "var(--success)" },
                  ].map((item) => (
                    <div key={item.label} className="flex flex-col items-center">
                      <svg width="70" height="70" aria-hidden="true">
                        <circle cx="35" cy="35" r="28" fill="none" stroke="var(--line)" strokeWidth="5" />
                        <circle
                          cx="35"
                          cy="35"
                          r="28"
                          fill="none"
                          stroke={item.color}
                          strokeWidth="5"
                          strokeDasharray={2 * Math.PI * 28}
                          strokeDashoffset={2 * Math.PI * 28 * (1 - item.score / 100)}
                          strokeLinecap="round"
                          transform="rotate(-90 35 35)"
                          className="transition-all duration-700"
                        />
                        <text
                          x="35"
                          y="35"
                          textAnchor="middle"
                          dominantBaseline="central"
                          className="fill-current font-heading text-sm font-bold"
                          style={{ color: "var(--ink)" }}
                        >
                          {item.score}
                        </text>
                      </svg>
                      <span className="mt-1 text-[10px] font-medium text-muted">{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              <p className="mt-5 text-center text-xs leading-relaxed text-muted">{result.message}</p>

              <div className="mt-5 text-center">
                <Link href="/register" className="btn btn-primary">
                  Unlock the full report
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
