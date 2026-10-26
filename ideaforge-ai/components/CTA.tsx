"use client";
import Link from "next/link";
import { motion } from "framer-motion";

const ASSURANCES = ["No credit card required", "Free plan forever", "14-day money back"];

export default function CTA() {
  return (
    <section className="section bg-surface">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          className="cta-surface relative overflow-hidden rounded-2xl px-6 py-14 text-center sm:px-12 sm:py-16"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div
            className="absolute inset-x-0 top-0 h-1 bg-[linear-gradient(90deg,#ef842b_0%,#ef842b_52%,#007acc_100%)]"
            aria-hidden="true"
          />

          <span className="inline-flex items-center rounded-full border border-[rgba(255,255,255,0.18)] bg-[rgba(255,255,255,0.08)] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.09em] text-[#ffc08f]">
            Get started
          </span>

          <h2 className="mx-auto mt-5 max-w-2xl text-3xl font-bold tracking-tight text-[#ffffff] sm:text-4xl">
            Ready to validate your next big idea?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-[#b7c4d4]">
            Join the founders and product teams who pressure-test their concepts before
            committing time and budget.
          </p>

          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/register"
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-brand-strong px-7 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-strong-hover sm:w-auto"
            >
              Start for free
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            <Link
              href="/contact"
              className="inline-flex w-full items-center justify-center rounded-lg border border-[rgba(255,255,255,0.24)] px-7 py-3 text-sm font-semibold text-[#e8eef6] transition-colors hover:border-[rgba(255,255,255,0.45)] hover:bg-[rgba(255,255,255,0.07)] sm:w-auto"
            >
              Talk to our team
            </Link>
          </div>

          <ul className="mt-9 flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            {ASSURANCES.map((assurance) => (
              <li key={assurance} className="flex items-center gap-1.5 text-xs text-[#8b9aad]">
                <svg className="h-3.5 w-3.5 text-[#ef842b]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                {assurance}
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
    </section>
  );
}
