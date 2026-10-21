"use client";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email) return;
    setLoading(true);
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
      setSubscribed(true);
      setEmail("");
      setTimeout(() => setSubscribed(false), 3000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="border-t border-white/5 bg-[#060a13]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-lg overflow-hidden">
                <Image src="/logo.png" alt="IdeaForge" width={40} height={40} className="w-full h-full object-contain" />
              </div>
              <span className="text-base font-bold text-white">IdeaForge</span>
            </Link>
            <p className="text-sm text-slate-500 leading-relaxed max-w-xs">AI-powered business idea validation for entrepreneurs and innovators.</p>
            <p className="mt-3 text-xs text-slate-500">
              Made by{" "}
              <a href="https://sunshinetechsolution.vercel.app/" target="_blank" rel="noreferrer" className="font-medium text-indigo-400 hover:text-indigo-300">
                Sunshine Tech Solution
              </a>
            </p>
            <div className="flex items-center gap-2 mt-4">
              <div className="flex items-center gap-1 text-xs text-slate-600">
                <svg className="w-3.5 h-3.5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                SOC 2
              </div>
              <div className="w-px h-3 bg-white/10" />
              <div className="flex items-center gap-1 text-xs text-slate-600">
                <svg className="w-3.5 h-3.5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                GDPR
              </div>
            </div>

            <div className="mt-5">
              <p className="text-xs font-semibold text-slate-400 mb-2">Stay in the loop</p>
              <AnimatePresence mode="wait">
                {subscribed ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-2 text-xs text-emerald-400"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    Subscribed!
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    onSubmit={handleSubmit}
                    className="flex gap-1.5"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <input
                      type="email"
                      placeholder="you@company.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="flex-1 px-3 py-1.5 rounded-lg border border-white/[0.06] bg-white/[0.03] text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500/30 transition-colors min-w-0"
                    />
                    <button type="submit" disabled={loading} className="px-3 py-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-medium hover:bg-indigo-500/20 transition-colors whitespace-nowrap disabled:opacity-60">
                      {loading ? "..." : "Subscribe"}
                    </button>
                  </motion.form>
                )}
              </AnimatePresence>
              {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
            </div>
          </div>
          <div>
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">Product</h4>
            <ul className="space-y-3 text-sm">
              <li><Link href="/#features" className="text-slate-400 hover:text-white transition-colors block">Features<span className="block text-slate-600 text-xs mt-0.5">9-dimension AI validation</span></Link></li>
              <li><Link href="/#pricing" className="text-slate-400 hover:text-white transition-colors block">Pricing<span className="block text-slate-600 text-xs mt-0.5">Free, Pro and Enterprise</span></Link></li>
              <li><Link href="/#how-it-works" className="text-slate-400 hover:text-white transition-colors block">How It Works<span className="block text-slate-600 text-xs mt-0.5">Validate any idea in seconds</span></Link></li>
              <li><Link href="/dashboard" className="text-slate-400 hover:text-white transition-colors block">Dashboard<span className="block text-slate-600 text-xs mt-0.5">Manage your validations</span></Link></li>
              <li><Link href="/changelog" className="text-slate-400 hover:text-white transition-colors block">Changelog<span className="block text-slate-600 text-xs mt-0.5">Latest releases</span></Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">Company</h4>
            <ul className="space-y-3 text-sm">
              <li><Link href="/about" className="text-slate-400 hover:text-white transition-colors block">About<span className="block text-slate-600 text-xs mt-0.5">Our mission and story</span></Link></li>
              <li><Link href="/blog" className="text-slate-400 hover:text-white transition-colors block">Blog<span className="block text-slate-600 text-xs mt-0.5">Startup insights</span></Link></li>
              <li><Link href="/careers" className="text-slate-400 hover:text-white transition-colors block">Careers<span className="block text-slate-600 text-xs mt-0.5">Join the team</span></Link></li>
              <li><Link href="/contact" className="text-slate-400 hover:text-white transition-colors block">Contact<span className="block text-slate-600 text-xs mt-0.5">Get in touch</span></Link></li>
              <li><Link href="/status" className="text-slate-400 hover:text-white transition-colors block">Status<span className="block text-slate-600 text-xs mt-0.5">System uptime</span></Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">Legal</h4>
            <ul className="space-y-3 text-sm">
              <li><Link href="/privacy-policy" className="text-slate-400 hover:text-white transition-colors block">Privacy Policy<span className="block text-slate-600 text-xs mt-0.5">How we handle data</span></Link></li>
              <li><Link href="/terms-of-service" className="text-slate-400 hover:text-white transition-colors block">Terms of Service<span className="block text-slate-600 text-xs mt-0.5">Usage terms</span></Link></li>
              <li><Link href="/cookie-policy" className="text-slate-400 hover:text-white transition-colors block">Cookie Policy<span className="block text-slate-600 text-xs mt-0.5">Tracking and cookies</span></Link></li>
              <li><Link href="/gdpr" className="text-slate-400 hover:text-white transition-colors block">GDPR<span className="block text-slate-600 text-xs mt-0.5">EU data rights</span></Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/5 mt-8 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-600">&copy; {new Date().getFullYear()} IdeaForge. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <a href="#" className="text-slate-600 hover:text-white transition-colors" aria-label="Twitter">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
            </a>
            <a href="#" className="text-slate-600 hover:text-white transition-colors" aria-label="GitHub">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" /></svg>
            </a>
            <a href="#" className="text-slate-600 hover:text-white transition-colors" aria-label="LinkedIn">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>
            </a>
            <a href="#" className="text-slate-600 hover:text-white transition-colors" aria-label="Discord">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" /></svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
