"use client";
import { motion } from "framer-motion";

const features = [
  { name: "AI Engine", ideaforge: "9-Dimension", others: "Generic single-score", score: 95 },
  { name: "Analysis Depth", ideaforge: "SWOT + Skeptic + Timing", others: "Basic surface-level", score: 90 },
  { name: "Report Speed", ideaforge: "15-30 seconds", others: "5-10 minutes", score: 98 },
  { name: "Competitor Data", ideaforge: "Real-time web-sourced", others: "Static/outdated", score: 85 },
  { name: "Market Sizing", ideaforge: "TAM / SAM / SOM", others: "Not available", score: 88 },
  { name: "GTM Experiments", ideaforge: "4 auto-generated", others: "Not available", score: 82 },
  { name: "Export Options", ideaforge: "PDF, Share, Compare", others: "PDF only", score: 90 },
  { name: "Idea Comparison", ideaforge: "Side-by-side radar", others: "No", score: 87 },
  { name: "Pivot Assistant", ideaforge: "AI chat + 3 directions", others: "Not available", score: 92 },
  { name: "Action Plan", ideaforge: "7-day step-by-step", others: "Generic advice", score: 85 },
  { name: "Price", ideaforge: "Free / $19/mo", others: "$49-99/mo", score: 95 },
];

export default function ComparisonTable() {
  return (
    <section className="py-24 bg-white relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-block text-xs font-semibold text-sky-400 bg-sky-500/10 border border-sky-500/20 px-3 py-1 rounded-full mb-5 tracking-wider uppercase">Comparison</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">Why choose IdeaForge?</h2>
          <p className="text-slate-400 mt-3">See how we compare to traditional validation tools</p>
        </motion.div>

        <motion.div
          className="rounded-2xl border border-white/[0.06] bg-white/[0.02] overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[620px]">
              <thead>
                <tr className="border-b border-white/[0.06]">
                  <th className="text-left px-6 py-4 font-semibold text-slate-300">Feature</th>
                  <th className="text-center px-4 py-4 font-semibold text-sky-400">
                    <span className="inline-flex items-center gap-1.5">
                      <div className="w-5 h-5 rounded-md bg-gradient-to-br from-sky-500 to-orange-600 flex items-center justify-center">
                        <svg className="w-3 h-3 text-slate-900" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                      </div>
                      IdeaForge
                    </span>
                  </th>
                  <th className="text-center px-4 py-4 font-semibold text-slate-500 w-24">Score</th>
                  <th className="text-center px-6 py-4 font-semibold text-slate-500">Others</th>
                </tr>
              </thead>
              <tbody>
                {features.map((f, i) => (
                  <motion.tr
                    key={f.name}
                    className={`border-b border-white/[0.03] group hover:bg-white/[0.02] transition-colors ${i % 2 === 0 ? "bg-white/[0.01]" : ""}`}
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 + i * 0.03 }}
                  >
                    <td className="px-6 py-3.5 font-medium text-slate-300">{f.name}</td>
                    <td className="px-4 py-3.5 text-center">
                      <span className="inline-flex items-center gap-1.5 text-sky-400 font-medium text-xs">
                        <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                        {f.ideaforge}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1.5 rounded-full bg-white/5 overflow-hidden">
                          <motion.div
                            className="h-full rounded-full bg-gradient-to-r from-sky-500 to-orange-500"
                            initial={{ width: 0 }}
                            whileInView={{ width: `${f.score}%` }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: 0.3 + i * 0.05 }}
                          />
                        </div>
                        <span className="text-[11px] font-mono text-slate-500 w-6 text-right">{f.score}</span>
                      </div>
                    </td>
                    <td className="px-6 py-3.5 text-center text-slate-500 text-xs">{f.others}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="px-6 py-4 border-t border-white/[0.06] bg-white/[0.01]">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500">Average score</span>
              <div className="flex items-center gap-3">
                <span className="text-slate-500">Others: <span className="text-slate-400 font-mono">~30</span></span>
                <span className="text-sky-400 font-semibold">IdeaForge: <span className="font-mono">90.5</span></span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
