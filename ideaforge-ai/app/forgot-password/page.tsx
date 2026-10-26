"use client";
import { useState } from "react";
import Link from "next/link";
import AuthShell from "@/components/AuthShell";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMsg("");
    setError("");
    try {
      const r = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error || "Could not send the reset link");
      setMsg(d.message || "If that address exists, a reset link is on its way.");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell
      title="Reset your password"
      subtitle="Enter the email on your account and we'll send you a reset link."
      footer={
        <p className="text-center text-sm text-copy">
          Remembered it?{" "}
          <Link href="/login" className="font-semibold text-brand-ink hover:text-brand-strong">
            Back to sign in
          </Link>
        </p>
      }
    >
      {msg ? (
        <div className="rounded-lg border px-4 py-3.5 text-sm"
             style={{
               borderColor: "var(--success-line)",
               backgroundColor: "var(--success-soft)",
               color: "var(--success-ink)",
             }}>
          {msg}
        </div>
      ) : (
        <form onSubmit={submit} className="space-y-5">
          <div className="field">
            <label htmlFor="email" className="label">Work email</label>
            <input
              id="email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input"
              placeholder="you@company.com"
            />
          </div>

          {error && (
            <p role="alert" className="rounded-lg border px-4 py-3 text-sm"
               style={{
                 borderColor: "var(--danger-line)",
                 backgroundColor: "var(--danger-soft)",
                 color: "var(--danger-ink)",
               }}>
              {error}
            </p>
          )}

          <button type="submit" disabled={loading} className="btn btn-primary btn-block">
            {loading ? "Sending…" : "Send reset link"}
          </button>
        </form>
      )}
    </AuthShell>
  );
}
