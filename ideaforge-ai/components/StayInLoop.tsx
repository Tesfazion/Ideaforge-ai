"use client";

import { useState } from "react";
import { SUNSHINE_LINKS } from "@/lib/site";

const ICONS: Record<string, string> = {
  globe: "M12 21a9 9 0 100-18 9 9 0 000 18zm0-18c2.5 2.4 4 5.5 4 9s-1.5 6.6-4 9m0-18c-2.5 2.4-4 5.5-4 9s1.5 6.6 4 9M3.6 9h16.8M3.6 15h16.8",
  spark: "M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9L12 3z",
  github: "M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z",
};

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
      <form onSubmit={subscribe} className="flex gap-1.5">
        <input
          type="email"
          placeholder="you@company.com"
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
      <div className="mt-3 flex flex-wrap items-center gap-1.5">
        {SUNSHINE_LINKS.map((link) => (
          <a
            key={link.href}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 rounded-md border border-white/[0.06] bg-white/[0.02] px-2 py-1 text-[10px] font-medium text-slate-400 hover:border-sky-400/20 hover:text-sky-300 transition-colors"
          >
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
              <path d={ICONS[link.icon]} />
            </svg>
            {link.label}
          </a>
        ))}
      </div>
    </div>
  );
}
