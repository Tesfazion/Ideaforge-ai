"use client";

import { useState } from "react";
import { SUNSHINE } from "@/lib/site";

export default function StayInLoop({
  compact = false,
  tone = "light",
}: {
  compact?: boolean;
  tone?: "light" | "dark";
}) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "done">("idle");
  const [error, setError] = useState("");

  const dark = tone === "dark";

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
    <div className={compact ? "" : dark ? "" : "mt-5"}>
      {!compact && (
        <p className={`text-xs font-semibold ${dark ? "text-[#e6ecf4]" : "text-ink"}`}>
          Stay in the loop
        </p>
      )}
      {!compact && (
        <p className={`mt-1 text-xs leading-relaxed ${dark ? "text-[#8b98ab]" : "text-muted"}`}>
          Product updates, research notes, and new validation models. No noise.
        </p>
      )}

      <form onSubmit={subscribe} className="mt-3 flex gap-2">
        <label htmlFor="stay-in-loop-email" className="sr-only">
          Your email address for product updates
        </label>
        <input
          id="stay-in-loop-email"
          type="email"
          placeholder="Your email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          aria-invalid={error ? "true" : undefined}
          className={`min-w-0 flex-1 px-3 py-2 text-xs ${dark ? "footer-input" : "input"}`}
        />
        <button
          type="submit"
          disabled={state === "loading"}
          className={`whitespace-nowrap rounded-[0.625rem] px-3.5 py-2 text-xs font-semibold transition-colors disabled:opacity-60 ${
            dark
              ? "bg-brand-strong text-white hover:bg-brand-strong-hover"
              : "btn btn-primary btn-sm"
          }`}
        >
          {state === "loading" ? "…" : state === "done" ? "Subscribed" : "Subscribe"}
        </button>
      </form>

      {error && <p className="mt-1.5 text-xs font-medium text-[#f2a3a3]">{error}</p>}
      {state === "done" && !error && (
        <p className="mt-1.5 text-xs font-medium text-[#7fce9f]">Thanks — check your inbox to confirm.</p>
      )}

      {!compact && (
        <a
          href={SUNSHINE.url}
          target="_blank"
          rel="noopener noreferrer"
          className={`mt-3 inline-flex items-center gap-1.5 text-xs font-medium transition-colors ${
            dark ? "text-[#f0a768] hover:text-[#ffc08f]" : "text-brand-ink hover:text-brand"
          }`}
        >
          Visit {SUNSHINE.name}
          <span aria-hidden="true">→</span>
        </a>
      )}
    </div>
  );
}
