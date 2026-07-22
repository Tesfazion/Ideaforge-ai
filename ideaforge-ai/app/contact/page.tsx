"use client";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function Contact() {
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [teamSize, setTeamSize] = useState("");
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, company, teamSize, message }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({ error: "Submission failed" }));
        throw new Error(data.error || "Submission failed");
      }
      setSubmitted(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    }
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#060a13]">
        <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <h1 className="text-4xl font-bold text-white mb-6">Contact</h1>
          {submitted ? (
            <p className="text-emerald-400">Thanks! We&apos;ll get back to you shortly.</p>
          ) : (
            <form onSubmit={submit} className="space-y-4">
              <input type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" className="w-full px-4 py-2.5 rounded-xl border border-white/[0.06] bg-white/[0.05] text-sm text-white focus:outline-none focus:border-indigo-500/40 focus:ring-1 focus:ring-indigo-500/20 transition-colors placeholder:text-slate-500" />
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="w-full px-4 py-2.5 rounded-xl border border-white/[0.06] bg-white/[0.05] text-sm text-white focus:outline-none focus:border-indigo-500/40 focus:ring-1 focus:ring-indigo-500/20 transition-colors placeholder:text-slate-500" />
              <input type="text" value={company} onChange={(e) => setCompany(e.target.value)} placeholder="Company" className="w-full px-4 py-2.5 rounded-xl border border-white/[0.06] bg-white/[0.05] text-sm text-white focus:outline-none focus:border-indigo-500/40 focus:ring-1 focus:ring-indigo-500/20 transition-colors placeholder:text-slate-500" />
              <input type="text" value={teamSize} onChange={(e) => setTeamSize(e.target.value)} placeholder="Team size" className="w-full px-4 py-2.5 rounded-xl border border-white/[0.06] bg-white/[0.05] text-sm text-white focus:outline-none focus:border-indigo-500/40 focus:ring-1 focus:ring-indigo-500/20 transition-colors placeholder:text-slate-500" />
              <textarea required value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Message" rows={4} className="w-full px-4 py-2.5 rounded-xl border border-white/[0.06] bg-white/[0.05] text-sm text-white focus:outline-none focus:border-indigo-500/40 focus:ring-1 focus:ring-indigo-500/20 transition-colors placeholder:text-slate-500" />
              <button type="submit" className="w-full gradient-btn text-white font-semibold py-2.5 rounded-xl text-sm">Send message</button>
              {error && <p className="text-xs text-red-400">{error}</p>}
            </form>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
