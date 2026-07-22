"use client";
import { useAuth } from "@/lib/auth";
import { api } from "@/lib/api";
import { useState } from "react";
import ContactModal from "@/components/ContactModal";
import { motion } from "framer-motion";

export default function UpgradePage() {
  const { user, token } = useAuth();
  const [contactOpen, setContactOpen] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  const handleCheckout = async (plan: "pro" | "enterprise") => {
    if (!token) return;
    setCheckoutLoading(true);
    setCheckoutError(null);
    try {
      const data = await api.createCheckoutSession(token, { plan });
      window.location.href = data.url;
    } catch {
      setCheckoutError("Failed to start checkout. Please try again.");
      setCheckoutLoading(false);
    }
  };

  if (user?.plan === "pro") {
    return (
      <div className="max-w-lg mx-auto text-center py-20 animate-slide-up">
        <div className="w-16 h-16 rounded-2xl bg-emerald-500 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-500/25">
          <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">You&apos;re on Pro!</h1>
        <p className="text-slate-400 mb-6">You now have unlimited validations, priority processing, and all premium features.</p>
        <div className="grid grid-cols-3 gap-4 max-w-sm mx-auto">
          {[
            { label: "Validations", value: "Unlimited tokens", icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" },
            { label: "Priority", value: "Enabled", icon: "M13 10V3L4 14h7v7l9-11h-7z" },
            { label: "Exports", value: "Unlimited", icon: "M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" },
          ].map((item) => (
            <div key={item.label} className="card-base rounded-xl p-3 text-center">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/15 flex items-center justify-center mx-auto mb-2">
                <svg className="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                </svg>
              </div>
              <p className="text-lg font-bold text-white">{item.value}</p>
              <p className="text-xs text-slate-400">{item.label}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-10 animate-slide-up">
      <motion.div className="relative rounded-3xl overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-purple-500/10" />
        <div className="absolute inset-0 bg-[#0c1222]/80 backdrop-blur-xl" />
        <div className="relative px-6 py-8 sm:px-10 text-center">
          <h1 className="text-3xl font-bold text-white">Progressive Value Pricing</h1>
          <p className="text-slate-400 mt-2 max-w-lg mx-auto">Pay for the value you get. Start free, upgrade when you&apos;re ready to validate seriously.</p>
        </div>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
        <motion.div className="card-base rounded-2xl p-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Explorer</div>
          <h3 className="text-lg font-bold text-white">Free</h3>
          <p className="text-3xl font-bold text-white mt-1">$0<span className="text-sm text-slate-400 font-normal">/forever</span></p>
          <p className="text-xs text-slate-400 mt-1">Perfect for testing the waters</p>
          <ul className="mt-5 space-y-2.5 text-sm text-slate-300">
             <li className="flex items-start gap-2">
              <svg className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
              <div><span className="font-medium">5 tokens</span> per month</div>
            </li>
            <li className="flex items-start gap-2">
              <svg className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
              <div><span className="font-medium">Basic 5-dimension</span> scoring</div>
            </li>
            <li className="flex items-start gap-2">
              <svg className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
              <div><span className="font-medium">Standard report</span> sections</div>
            </li>
            <li className="flex items-start gap-2">
              <svg className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
              <div><span className="font-medium">1 idea</span> generated</div>
            </li>
            <li className="flex items-start gap-2">
              <svg className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
              <div><span className="font-medium">Instant preview score</span> (no sign-up)</div>
            </li>
          </ul>
          <div className="mt-6 px-4 py-2.5 rounded-xl border border-white/[0.06] text-center text-sm text-slate-400 font-medium">
            {user?.plan === "free" ? "Current Plan" : "Downgrade"}
          </div>
        </motion.div>

        <motion.div className="rounded-2xl border-2 border-blue-500 bg-white/[0.05] p-6 relative shadow-lg shadow-blue-500/10" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <div className="absolute -top-3 right-4 px-3 py-0.5 rounded-full bg-gradient-to-r from-blue-600 to-amber-500 text-white text-xs font-semibold shadow-sm">Most Popular</div>
          <div className="text-xs font-semibold uppercase tracking-wider text-blue-400 mb-2">Founder</div>
          <h3 className="text-lg font-bold text-white">Pro</h3>
          <p className="text-3xl font-bold text-white mt-1">$19<span className="text-sm text-slate-400 font-normal">/month</span></p>
          <p className="text-xs text-slate-400 mt-1">Everything you need to validate</p>
          <ul className="mt-5 space-y-2.5 text-sm text-slate-300">
            <li className="flex items-start gap-2">
              <svg className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
              <div><span className="font-medium">Unlimited</span> validations</div>
            </li>
            <li className="flex items-start gap-2">
              <svg className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
              <div><span className="font-medium">Live-Sourced Evidence</span> with real-time web search</div>
            </li>
            <li className="flex items-start gap-2">
              <svg className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
              <div><span className="font-medium">Skeptic Mode</span> adversarial stress-test</div>
            </li>
            <li className="flex items-start gap-2">
              <svg className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
              <div><span className="font-medium">TAM/SAM/SOM</span> market sizing</div>
            </li>
            <li className="flex items-start gap-2">
              <svg className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
              <div><span className="font-medium">7-Day Action Plan</span> with templates</div>
            </li>
            <li className="flex items-start gap-2">
              <svg className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
              <div><span className="font-medium">Full 9-Dimension Index</span> scoring</div>
            </li>
            <li className="flex items-start gap-2">
              <svg className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
              <div><span className="font-medium">GTM Experiments</span> & action checklist</div>
            </li>
            <li className="flex items-start gap-2">
              <svg className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
              <div><span className="font-medium">Pivot Assistant</span> with AI chat</div>
            </li>
            <li className="flex items-start gap-2">
              <svg className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
              <div><span className="font-medium">PDF export</span> & investor-ready report</div>
            </li>
            <li className="flex items-start gap-2">
              <svg className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
              <div><span className="font-medium">Unlimited</span> idea generation</div>
            </li>
          </ul>
          <button onClick={() => handleCheckout("pro")} disabled={checkoutLoading}
            className="mt-6 w-full gradient-btn text-white font-semibold py-2.5 rounded-xl text-sm disabled:opacity-50 flex items-center justify-center gap-2">
            {checkoutLoading ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Creating checkout session...
              </>
            ) : (
              "Upgrade to Pro"
            )}
          </button>
          {checkoutError && <p className="text-xs text-red-500 mt-2 text-center">{checkoutError}</p>}
        </motion.div>

        <motion.div className="card-base rounded-2xl p-6 opacity-75" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Team</div>
          <h3 className="text-lg font-bold text-white">Enterprise</h3>
          <p className="text-3xl font-bold text-white mt-1">$49<span className="text-sm text-slate-400 font-normal">/month</span></p>
          <p className="text-xs text-slate-400 mt-1">For teams validating multiple ideas</p>
          <ul className="mt-5 space-y-2.5 text-sm text-slate-300">
            <li className="flex items-start gap-2">
              <svg className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
              <div><span className="font-medium">Everything in Pro</span></div>
            </li>
            <li className="flex items-start gap-2">
              <svg className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
              <div><span className="font-medium">5 team members</span></div>
            </li>
            <li className="flex items-start gap-2">
              <svg className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
              <div><span className="font-medium">Shared workspace</span> & comparison</div>
            </li>
            <li className="flex items-start gap-2">
              <svg className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
              <div><span className="font-medium">API access</span> for integrations</div>
            </li>
            <li className="flex items-start gap-2">
              <svg className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
              <div><span className="font-medium">Dedicated support</span></div>
            </li>
          </ul>
          <button onClick={() => setContactOpen(true)}
            className="mt-6 w-full gradient-btn text-white font-semibold py-2.5 rounded-xl text-sm">
            Contact Sales
          </button>
        </motion.div>
      </div>

      <ContactModal open={contactOpen} onClose={() => setContactOpen(false)} />

      <motion.div className="card-base rounded-2xl p-6 max-w-3xl mx-auto" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
        <h3 className="text-base font-semibold text-white mb-4 text-center">Credit System & Value Guarantees</h3>
        <div className="grid sm:grid-cols-3 gap-4">
          {[
            { title: "Pay Per Value", desc: "Each validation uses one credit. Credits are only consumed when the AI analysis completes successfully.", icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" },
            { title: "Auto-Refund on Failure", desc: "If the AI fails or returns a 5xx error, your credit is automatically refunded. You never pay for failed validations.", icon: "M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" },
            { title: "Retry Anytime", desc: "Failed ideas can be retried at no cost. We believe in giving you a complete analysis, not charging for errors.", icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" },
          ].map((item) => (
            <div key={item.title} className="text-center p-4">
                 <div className="w-10 h-10 rounded-xl bg-blue-500/15 flex items-center justify-center mx-auto mb-3">
                  <svg className="w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                </svg>
              </div>
              <h4 className="text-sm font-semibold text-white mb-1">{item.title}</h4>
              <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
