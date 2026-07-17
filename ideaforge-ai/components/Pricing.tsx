"use client";
import Link from "next/link";
import { motion } from "framer-motion";

const plans = [
  {
    name: "Explorer",
    price: "$0",
    period: "forever",
    desc: "Perfect for testing the waters",
    features: [
      "1 idea validation / month",
      "Quick preview score",
      "Basic 5-score analysis",
      "Email support",
      "Community access",
    ],
    cta: "Start Free",
    href: "/register",
    popular: false,
  },
  {
    name: "Founder",
    price: "$19",
    period: "/month",
    desc: "For serious founders and teams",
    features: [
      "Unlimited validations",
      "9-Dimension Index",
      "SWOT Analysis",
      "Competitive Landscape Map",
      "Market Timing Score",
      "Skeptic Mode (adversarial stress-test)",
      "TAM / SAM / SOM Market Sizing",
      "GTM Experiments & Checklist",
      "7-Day Action Plan",
      "Pivot Assistant (AI chat)",
      "PDF Export & Sharing",
      "Side-by-Side Comparison",
      "Priority support",
    ],
    cta: "Upgrade to Pro",
    href: "/register",
    popular: true,
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.2, delayChildren: 0.1 }
  }
};

const item = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  show: { opacity: 1, y: 0, scale: 1, transition: { type: "spring" as const, stiffness: 100 } }
};

export default function Pricing() {
  return (
    <section className="py-20 bg-surface" id="pricing">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div className="text-center mb-12" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.6 }}>
          <h2 className="text-3xl sm:text-4xl font-bold text-heading">Simple, Transparent Pricing</h2>
          <p className="text-body mt-3">Start free. Upgrade when you need unlimited power.</p>
        </motion.div>
        <motion.div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto" variants={container} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-100px" }}>
          {plans.map((plan) => (
            <motion.div key={plan.name} variants={item} whileHover={{ y: -5, transition: { type: "spring", stiffness: 300 } }}>
              <div className={`relative rounded-2xl p-8 h-full ${plan.popular ? "bg-white border-2 border-indigo-500 shadow-xl shadow-indigo-500/10 dark:bg-gray-800 dark:border-indigo-400" : "bg-white border border-gray-200 dark:bg-gray-800 dark:border-gray-700"}`}>
                {plan.popular && (
                  <motion.div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-xs font-semibold shadow-lg"
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    Most Popular
                  </motion.div>
                )}
                <h3 className="text-xl font-bold text-heading dark:text-white">{plan.name}</h3>
                <p className="text-sm text-body mt-1 mb-4">{plan.desc}</p>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-4xl font-bold text-heading dark:text-white">{plan.price}</span>
                  <span className="text-sm text-muted">{plan.period}</span>
                </div>
                <ul className="space-y-2.5 mb-8">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-body">
                      <svg className="w-4 h-4 text-indigo-500 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      {f}
                    </li>
                  ))}
                </ul>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link href={plan.href} className={`block text-center py-3 rounded-xl text-sm font-semibold transition-all ${plan.popular ? "gradient-btn text-white shadow-lg" : "border border-gray-200 text-heading hover:bg-surface-alt dark:border-gray-700 dark:text-white dark:hover:bg-gray-700"}`}>
                    {plan.cta}
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
