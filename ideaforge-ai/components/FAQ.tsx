"use client";
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

const faqs = [
  { q: "How accurate is the AI validation?", a: "IdeaForge uses a multi-layered analysis engine that combines real-time market data with a 9-dimension scoring framework. We achieve a 94% accuracy rate based on user feedback and follow-up validations.", category: "product" },
  { q: "How long does a validation take?", a: "Most validations complete in 15-30 seconds. Complex ideas with detailed descriptions may take up to 60 seconds for a thorough analysis.", category: "product" },
  { q: "Can I validate any type of business idea?", a: "Yes! IdeaForge works across all industries and business models — from SaaS and e-commerce to brick-and-mortar businesses and service companies.", category: "product" },
  { q: "What's included in the free plan?", a: "The Explorer plan includes 5 idea validations per month and full reports in your workspace. Upgrade to Founder Pro for unlimited validations and report delivery by email as CSV or Word.", category: "pricing" },
  { q: "Can I share my reports?", a: "Pro users can export reports as PDFs and share them via a unique link. Free users can view reports in the dashboard.", category: "product" },
  { q: "Is my idea data secure?", a: "Absolutely. Your ideas are encrypted at rest and in transit. We never share your data with third parties or use it for training. You can delete your data anytime.", category: "security" },
  { q: "Can I cancel my subscription anytime?", a: "Yes, you can cancel your subscription at any time from your dashboard settings. Your access will continue until the end of your current billing period. No cancellation fees.", category: "pricing" },
  { q: "Do you offer refunds?", a: "We offer a 14-day money-back guarantee on all paid plans. If you're not satisfied, contact us within 14 days of your purchase for a full refund.", category: "pricing" },
  { q: "What payment methods do you accept?", a: "We accept all major credit cards (Visa, Mastercard, American Express) and PayPal. Enterprise customers can also pay via invoice with NET 30 terms.", category: "pricing" },
  { q: "Is there an API available?", a: "Yes, our Enterprise plan includes full API access for programmatic idea validation, batch processing, and custom integrations. Documentation is available at docs.ideaforge.ai.", category: "product" },
  { q: "What does Enterprise add?", a: "Enterprise includes unlimited validations and API access with up to 10 active API keys. Shared team workspaces are not currently included.", category: "product" },
  { q: "What data sources does IdeaForge use?", a: "IdeaForge analyzes real-time market data from multiple sources including industry reports, funding databases, search trend data, competitor websites, and regulatory filings to provide up-to-date insights.", category: "product" },
];

const categories = [
  { id: "all", label: "All" },
  { id: "product", label: "Product" },
  { id: "pricing", label: "Pricing" },
  { id: "security", label: "Security" },
];

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(0);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

  const filtered = useMemo(() => {
    return faqs.filter((faq) => {
      const matchesCategory = activeCategory === "all" || faq.category === activeCategory;
      const matchesSearch = !search || faq.q.toLowerCase().includes(search.toLowerCase()) || faq.a.toLowerCase().includes(search.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [search, activeCategory]);

  return (
    <section className="faq-section py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
       <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
        <motion.div
          className="faq-intro self-start lg:sticky lg:top-28"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="section-kicker">FAQ</span>
          <h2 className="mt-4 text-3xl sm:text-4xl font-bold tracking-tight">Frequently asked questions</h2>
          <p className="faq-copy mt-4 max-w-md text-base leading-7">Quick answers about validation, reports, pricing, and how IdeaForge handles your ideas.</p>
          <div className="faq-contact mt-8 rounded-xl border p-5">
            <p className="text-sm font-semibold">Need a hand?</p>
            <p className="faq-copy mt-1 text-sm leading-6">Talk with our team about the best way to validate your idea.</p>
            <Link href="/contact" className="faq-contact-link mt-4 inline-flex items-center gap-2 text-sm font-semibold">Contact the team <span aria-hidden="true">→</span></Link>
          </div>
        </motion.div>

        <div className="min-w-0">
        <motion.div
          className="mb-5 flex flex-col gap-3"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
        >
          <div className="relative flex-1">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search questions..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setOpen(null); }}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-white/[0.06] bg-white/[0.03] text-sm text-white placeholder-slate-500 focus:outline-none focus:border-sky-500/30 focus:ring-1 focus:ring-sky-500/20 transition-all"
            />
          </div>
          <div className="flex flex-wrap gap-1.5">
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => { setActiveCategory(c.id); setOpen(null); }}
                className={`px-3 py-2 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                  activeCategory === c.id
                    ? "bg-sky-500/10 text-sky-400 border border-sky-500/20"
                    : "text-slate-500 border border-white/[0.06] hover:text-slate-300 hover:border-white/10"
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </motion.div>

        <div className="faq-list space-y-2">
          <AnimatePresence mode="popLayout">
            {filtered.map((faq) => {
              const originalIndex = faqs.indexOf(faq);
              return (
                <motion.div
                  key={faq.q}
                  className="faq-item overflow-hidden rounded-xl border transition-colors"
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                >
                  <button
                    onClick={() => setOpen(open === originalIndex ? null : originalIndex)}
                    className="w-full flex items-center justify-between px-5 py-4 text-left"
                  >
                    <span className="text-sm font-medium text-slate-200 pr-4">{faq.q}</span>
                    <motion.svg
                      className="w-4 h-4 text-slate-500 shrink-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                      animate={{ rotate: open === originalIndex ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </motion.svg>
                  </button>
                  <AnimatePresence>
                    {open === originalIndex && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="px-5 pb-4 text-sm text-slate-400 leading-relaxed">{faq.a}</div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </AnimatePresence>
          {filtered.length === 0 && (
            <motion.p
              className="text-center text-sm text-slate-500 py-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              No questions match your search. Try a different term.
            </motion.p>
          )}
        </div>

        <motion.div
          className="faq-more mt-8 border-t pt-6 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          <p className="text-sm text-slate-500 mb-3">Still have questions?</p>
          <Link href="/register" className="faq-contact-link inline-flex items-center gap-2 text-sm font-semibold transition-colors">
            Get in touch with our team
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </motion.div>
        </div>
       </div>
      </div>
    </section>
  );
}
