"use client";
import { motion } from "framer-motion";

const features = [
  ["Analysis depth", "9 dimensions, SWOT and skeptic review", "Single overall score"],
  ["Market research", "Competitor signals and market sizing", "Limited or manual research"],
  ["Time to result", "Usually 15–30 seconds", "Several minutes"],
  ["Next steps", "Experiments and a 7-day action plan", "General recommendations"],
  ["Iteration", "Pivot suggestions and side-by-side comparison", "Start a new analysis"],
  ["Takeaway", "PDF report and shareable results", "Basic report"],
];

export default function ComparisonTable() {
  return (
    <section className="comparison-section py-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div className="mb-12 text-center" initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <span className="section-kicker">Comparison</span>
          <h2 className="mt-4 text-3xl sm:text-4xl font-bold tracking-tight">Why choose IdeaForge?</h2>
          <p className="comparison-intro mt-3 max-w-2xl mx-auto">A clearer view of what you get from a focused idea validation workflow.</p>
        </motion.div>
        <motion.div className="comparison-panel overflow-hidden rounded-xl border" initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.45 }}>
         <div className="overflow-x-auto"><div className="min-w-[620px]">
          <div className="comparison-head grid grid-cols-[1.05fr_1.5fr_1.15fr] gap-4 px-5 py-4 text-xs font-semibold uppercase tracking-wide sm:px-7">
            <span>Capability</span><span>IdeaForge</span><span>Basic tools</span>
          </div>
          {features.map(([label, ours, other], index) => (
            <div key={label} className={`comparison-row grid grid-cols-[1.05fr_1.5fr_1.15fr] gap-4 px-5 py-4 text-sm sm:px-7 ${index % 2 ? "comparison-row-alt" : ""}`}>
              <span className="font-semibold">{label}</span>
              <span className="flex items-start gap-2"><svg className="comparison-check mt-0.5 h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg><span>{ours}</span></span>
              <span className="comparison-muted">{other}</span>
            </div>
          ))}
         </div></div>
          <div className="comparison-foot flex flex-col gap-1 px-5 py-4 text-sm sm:flex-row sm:items-center sm:justify-between sm:px-7">
            <span className="font-semibold">Built for decisions you can act on</span>
            <span className="comparison-muted">Understand the risks before you invest more time.</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
