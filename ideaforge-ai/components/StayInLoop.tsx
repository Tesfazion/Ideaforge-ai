"use client";

import { useState } from "react";
import { SUNSHINE } from "@/lib/site";

export default function StayInLoop({ compact = false }: { compact?: boolean }) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "done">("idle");
  const [error, setError] = useState("");

  const subscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setError("");
    setState("loading");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({ error: "Subscription failed" }));
        throw new Error(data.error || "Subscription failed");
      }
      setState("done");
      setEmail("");
      setTimeout(() => setState("idle"), 3500);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setState("idle");
    }
  };

  return (
    <div className={compact ? "" : "mt-5"}>
      {!compact && <p className="text-xs font-semibold text-slate-400 mb-2">Stay in the loop</p>}
      {!compact && <p className="text-xs text-slate-500 mb-3">Get IdeaForge product updates. For company news, visit {SUNSHINE.name}.</p>}
      <form onSubmit={subscribe} className="flex gap-1.5">
        <input
          type="email"
          aria-label="Your email address for product updates"
          placeholder="Your email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="flex-1 px-3 py-1.5 rounded-lg border border-white/[0.06] bg-white/[0.03] text-xs text-white placeholder-slate-600 focus:outline-none focus:border-sky-500/30 transition-colors min-w-0"
        />
        <button
          type="submit"
          disabled={state === "loading"}
          className="px-3 py-1.5 rounded-lg bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs font-medium hover:bg-sky-500/20 transition-colors whitespace-nowrap disabled:opacity-60"
        >
          {state === "loading" ? "..." : state === "done" ? "Subscribed" : "Subscribe"}
        </button>
      </form>
      {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
      {!compact && <a href={SUNSHINE.url} target="_blank" rel="noopener noreferrer" className="mt-3 inline-block text-xs font-medium text-sky-400 hover:text-sky-300 transition-colors">Visit {SUNSHINE.name}</a>}
    </div>
  );
}
