"use client";
import { useState } from "react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const r = await fetch("/api/auth/forgot-password", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email }) });
      const d = await r.json();
      setMsg(d.message || d.error || "Done");
    } catch {
      setMsg("Failed");
    } finally {
      setLoading(false);
    }
  }
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#060a13]">
      <div className="w-full max-w-md p-6 rounded-2xl bg-[#0c1222] border border-white/[0.06]">
        <h1 className="text-xl font-bold text-white mb-4">Forgot password</h1>
        <form onSubmit={submit} className="space-y-4">
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className="w-full px-4 py-2.5 rounded-xl bg-white/[0.05] border border-white/[0.06] text-white text-sm" required />
          <button disabled={loading} className="w-full py-2.5 rounded-xl text-sm font-semibold text-white bg-sky-500 hover:bg-sky-400 disabled:opacity-50">{loading ? "Sending..." : "Send reset link"}</button>
        </form>
        {msg && <p className="mt-3 text-sm text-slate-400">{msg}</p>}
        <p className="mt-4 text-sm"><Link href="/login" className="text-sky-400">Back to login</Link></p>
      </div>
    </div>
  );
}
