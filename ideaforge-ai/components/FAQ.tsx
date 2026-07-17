"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(0);
  const faqs = [
     { q: "How accurate is the AI validation?", a: "IdeaForge uses a multi-layered analysis engine that combines real-time market data with a 9-dimension scoring framework. We achieve a 94% accuracy rate based on user feedback and follow-up validations." },
     { q: "How long does a validation take?", a: "Most validations complete in 15-30 seconds. Complex ideas with detailed descriptions may take up to 60 seconds for a thorough analysis." },
     { q: "Can I validate any type of business idea?", a: "Yes! IdeaForge works across all industries and business models — from SaaS and e-commerce to brick-and-mortar businesses and service companies." },
    { q: "What's included in the free plan?", a: "The free plan includes 1 idea validation per month with basic AI analysis and a standard report. Upgrade to Pro for unlimited validations, advanced analysis, PDF export, and more." },
    { q: "Can I share my reports?", a: "Pro users can export reports as PDFs and share them via a unique link. Free users can view reports in the dashboard." },
    { q: "Is my idea data secure?", a: "Absolutely. Your ideas are encrypted at rest and in transit. We never share your data with third parties or use it for training. You can delete your data anytime." },
  ];
  return (
    <section className="py-20 bg-surface">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-heading">Frequently Asked Questions</h2>
        </div>
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <motion.div key={i} className="glass-card rounded-xl border border-white/40 dark:border-white/10 overflow-hidden" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}>
              <motion.button onClick={() => setOpen(open === i ? null : i)} className="w-full flex items-center justify-between px-6 py-4 text-left">
                <span className="text-sm font-semibold text-heading dark:text-white">{faq.q}</span>
                <motion.svg className={`w-4 h-4 text-muted`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} animate={{ rotate: open === i ? 180 : 0 }} transition={{ duration: 0.2 }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </motion.svg>
              </motion.button>
              <AnimatePresence>
                {open === i && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
                    <div className="px-6 pb-4 text-sm text-body dark:text-gray-300 leading-relaxed">{faq.a}</div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
