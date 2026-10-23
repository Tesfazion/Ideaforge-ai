"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { useState } from "react";

const plans = [
  {
    name: "Explorer",
    monthlyPrice: "$0",
    annualPrice: "$0",
    period: "forever",
    desc: "Perfect for testing the waters",
    features: [
      "5 idea validations / month",
      "Quick preview score",
      "Full report in your workspace",
      "PDF export",
    ],
    cta: "Start Free",
    href: "/register",
    popular: false,
  },
  {
    name: "Founder Pro",
    monthlyPrice: "$19",
    annualPrice: "$15",
    period: "/month",
    annualNote: "billed annually",
    annualSavings: "Save $48/year",
    desc: "For founders who validate often",
    features: [
      "Everything in Explorer",
      "Unlimited validations",
      "Email full reports as CSV or Word",
    ],
    cta: "Upgrade to Pro",
    href: "/register",
    popular: true,
  },
  {
    name: "Enterprise",
    monthlyPrice: "$49",
    annualPrice: "$39",
    period: "/month",
    annualNote: "billed annually",
    annualSavings: "Save $120/year",
    desc: "For organizations integrating IdeaForge",
    features: [
      "Everything in Founder Pro",
      "Enterprise API access",
      "Up to 10 active API keys",
      "Programmatic validation workflow",
    ],
    cta: "Contact Sales",
    href: "/contact",
    popular: false,
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.1 }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 100 } }
};

export default function Pricing() {
  const [annual, setAnnual] = useState(false);

  return (
    <section className="py-24 bg-white relative" id="pricing">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-orange-500/[0.02] to-transparent" />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-block text-xs font-semibold text-sky-400 bg-sky-500/10 border border-sky-500/20 px-3 py-1 rounded-full mb-5 tracking-wider uppercase">Pricing</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">Simple, transparent pricing</h2>
          <p className="text-slate-400 mt-3">Start free. Upgrade when you need unlimited power.</p>

          <div className="flex items-center justify-center gap-3 mt-8">
            <span className={`text-sm font-medium transition-colors ${!annual ? "text-slate-900" : "text-slate-500"}`}>Monthly</span>
            <button
              onClick={() => setAnnual(!annual)}
              className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${annual ? "bg-sky-500" : "bg-white/10"}`}
            >
              <motion.div
                className="absolute top-1 w-4 h-4 rounded-full bg-white shadow-md"
                animate={{ left: annual ? 28 : 4 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            </button>
            <span className={`text-sm font-medium transition-colors ${annual ? "text-slate-900" : "text-slate-500"}`}>
              Annual
              <span className="ml-1.5 text-xs text-emerald-400 font-semibold">Save 20%</span>
            </span>
          </div>
        </motion.div>

        <motion.div
          className="grid md:grid-cols-3 gap-4 items-start"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          {plans.map((plan) => (
            <motion.div key={plan.name} variants={item} whileHover={{ y: -3, transition: { type: "spring", stiffness: 400 } }}>
              <div className={`relative rounded-2xl p-6 h-full transition-all duration-300 ${
                plan.popular
                  ? "border border-sky-500/30 bg-sky-500/[0.05] shadow-lg shadow-sky-500/10 ring-1 ring-sky-500/10"
                  : "border border-white/[0.06] bg-white/[0.02] hover:border-white/10"
              }`}>
                {plan.popular && (
                  <>
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-gradient-to-r from-sky-500 to-orange-500 text-slate-900 text-xs font-semibold shadow-lg shadow-sky-500/30">
                      Most Popular
                    </div>
                    <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-32 h-8 bg-sky-500/20 rounded-full blur-xl" />
                  </>
                )}
                <h3 className="text-lg font-bold text-slate-900">{plan.name}</h3>
                <p className="text-sm text-slate-500 mt-1 mb-5">{plan.desc}</p>
                <div className="flex items-baseline gap-1 mb-1">
                  <span className="text-4xl font-bold text-slate-900">{annual ? plan.annualPrice : plan.monthlyPrice}</span>
                  <span className="text-sm text-slate-500">{plan.period}</span>
                </div>
                {annual && plan.annualPrice !== "$0" && (
                  <div className="flex items-center gap-2 mb-5">
                    <p className="text-xs text-slate-600">{plan.annualNote}</p>
                    {plan.annualSavings && (
                      <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.5 rounded-md">
                        {plan.annualSavings}
                      </span>
                    )}
                  </div>
                )}
                {(!annual || plan.annualPrice === "$0") && <div className="mb-5" />}
                <ul className="space-y-2 mb-6">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-slate-400">
                      <svg className="w-4 h-4 text-sky-400 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      {f}
                    </li>
                  ))}
                </ul>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Link href={plan.href} className={`block text-center py-3 rounded-xl text-sm font-semibold transition-all ${
                    plan.popular
                      ? "gradient-btn text-slate-900"
                      : "border border-white/10 text-slate-300 hover:bg-white/5 hover:border-white/15"
                  }`}>
                    {plan.cta}
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className="mt-8 grid sm:grid-cols-3 gap-3 max-w-2xl mx-auto"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-center gap-2 text-xs text-slate-500 justify-center">
            <svg className="w-3.5 h-3.5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            14-day money back
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-500 justify-center">
            <svg className="w-3.5 h-3.5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            Cancel anytime
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-500 justify-center">
            <svg className="w-3.5 h-3.5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            No credit card for free
          </div>
        </motion.div>
      </div>
    </section>
  );
}
