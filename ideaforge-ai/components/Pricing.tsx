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
    desc: "Test the waters with a full first report.",
    features: [
      "5 idea validations / month",
      "Quick preview score",
      "Full report in your workspace",
      "PDF export",
    ],
    cta: "Start free",
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
    desc: "For founders validating ideas regularly.",
    features: [
      "Everything in Explorer",
      "Unlimited validations",
      "Email reports as CSV or Word",
      "Priority analysis queue",
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
    desc: "For teams embedding IdeaForge in a workflow.",
    features: [
      "Everything in Founder Pro",
      "Enterprise API access",
      "Up to 10 active API keys",
      "Programmatic validation",
    ],
    cta: "Contact sales",
    href: "/contact",
    popular: false,
  },
];

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

const item = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function Pricing() {
  const [annual, setAnnual] = useState(false);

  return (
    <section className="section section-alt" id="pricing">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          className="mx-auto max-w-2xl text-center"
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
        >
          <span className="eyebrow">Pricing</span>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            Simple, transparent pricing
          </h2>
          <p className="mt-3 text-base leading-relaxed text-copy">
            Start free and stay free for five validations a month. Upgrade only when your
            pipeline demands it.
          </p>

          <div className="mt-8 flex items-center justify-center gap-3">
            <span className={`text-sm font-medium ${annual ? "text-muted" : "text-ink"}`}>Monthly</span>
            <button
              type="button"
              role="switch"
              aria-checked={annual}
              aria-label="Toggle annual billing"
              onClick={() => setAnnual((value) => !value)}
              className={`relative h-6 w-11 rounded-full transition-colors ${
                annual ? "bg-brand-strong" : "bg-[#cbd5e1]"
              }`}
            >
              <span
                className="absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm transition-all duration-200"
                style={{ left: annual ? 24 : 4 }}
              />
            </button>
            <span className={`text-sm font-medium ${annual ? "text-ink" : "text-muted"}`}>
              Annual
              <span className="ml-2 rounded-md bg-success-soft px-1.5 py-0.5 text-[11px] font-semibold text-success-ink">
                Save 20%
              </span>
            </span>
          </div>
        </motion.div>

        <motion.div
          className="mt-12 grid items-start gap-5 md:grid-cols-3"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          {plans.map((plan) => (
            <motion.div key={plan.name} variants={item} className="h-full">
              <div
                className={`relative flex h-full flex-col rounded-xl border bg-surface p-6 transition-shadow ${
                  plan.popular
                    ? "border-brand-line shadow-[var(--shadow-md)]"
                    : "border-line shadow-[var(--shadow-xs)] hover:shadow-[var(--shadow-sm)]"
                }`}
              >
                {plan.popular && (
                  <span className="absolute -top-3 left-6 rounded-full bg-brand-strong px-2.5 py-0.5 text-[11px] font-semibold text-white">
                    Most popular
                  </span>
                )}

                <h3 className="text-base font-bold text-ink">{plan.name}</h3>
                <p className="mt-1 text-sm leading-relaxed text-muted">{plan.desc}</p>

                <div className="mt-5 flex items-baseline gap-1">
                  <span className="text-[2.25rem] font-bold leading-none tracking-tight text-ink">
                    {annual ? plan.annualPrice : plan.monthlyPrice}
                  </span>
                  <span className="text-sm text-muted">{plan.period}</span>
                </div>

                <div className="mt-2 min-h-[1.25rem]">
                  {annual && plan.annualPrice !== "$0" && (
                    <p className="text-xs text-muted">
                      {plan.annualNote}
                      {plan.annualSavings && (
                        <span className="ml-2 font-semibold text-success-ink">{plan.annualSavings}</span>
                      )}
                    </p>
                  )}
                </div>

                <ul className="mt-5 flex-1 space-y-2.5 border-t border-line pt-5">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2.5 text-sm text-copy">
                      <svg
                        className="mt-0.5 h-4 w-4 shrink-0 text-brand"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2.5}
                        aria-hidden="true"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>

                <Link
                  href={plan.href}
                  className={`mt-6 block rounded-lg py-2.5 text-center text-sm font-semibold transition-colors ${
                    plan.popular
                      ? "bg-brand-strong text-white hover:bg-brand-strong-hover"
                      : "border border-line-strong bg-surface text-ink hover:bg-surface-alt"
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.ul
          className="mx-auto mt-8 flex max-w-2xl flex-wrap items-center justify-center gap-x-6 gap-y-2"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          {["14-day money back", "Cancel anytime", "No card for the free plan"].map((note) => (
            <li key={note} className="flex items-center gap-1.5 text-xs text-muted">
              <svg className="h-3.5 w-3.5 text-brand" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              {note}
            </li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
}
