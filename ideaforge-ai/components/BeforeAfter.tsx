"use client";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const comparisons = [
  { label: "Research Time", without: "Weeks", withVal: "30 seconds", withoutPct: 95, withPct: 5 },
  { label: "Cost", without: "$500+", withVal: "Free / $19", withoutPct: 90, withPct: 10 },
  { label: "Data Depth", without: "Surface", withVal: "9-Dimension", withoutPct: 20, withPct: 95 },
  { label: "Competitor Intel", without: "Manual", withVal: "Auto-Mapped", withoutPct: 15, withPct: 90 },
  { label: "Action Plan", without: "None", withVal: "7-Day Plan", withoutPct: 0, withPct: 85 },
];

function Bar({ pct, color, delay }: { pct: number; color: string; delay: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });
  return (
    <div ref={ref} className="h-2 rounded-full bg-white/5 overflow-hidden">
      <motion.div
        className={`h-full rounded-full ${color}`}
        initial={{ width: 0 }}
        animate={inView ? { width: `${pct}%` } : {}}
        transition={{ duration: 0.8, delay, ease: "easeOut" }}
      />
    </div>
  );
}

export default function BeforeAfter() {
  return (
    <section className="py-24 bg-[#060a13] relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-sky-500/[0.02] to-transparent" />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-block text-xs font-semibold text-sky-400 bg-sky-500/10 border border-sky-500/20 px-3 py-1 rounded-full mb-5 tracking-wider uppercase">Why IdeaForge</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">Stop guessing. Start validating.</h2>
          <p className="text-slate-400 mt-3 max-w-xl mx-auto">See what changes when you use AI-powered validation instead of traditional methods.</p>
        </motion.div>

        <motion.div
          className="rounded-2xl border border-white/[0.06] bg-white/[0.02] overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <div className="grid grid-cols-[1fr_auto_auto] gap-0 text-sm">
            <div className="px-5 py-3 border-b border-white/[0.06] text-xs font-semibold text-slate-500 uppercase tracking-wider">Metric</div>
            <div className="px-5 py-3 border-b border-white/[0.06] text-xs font-semibold text-red-400/70 uppercase tracking-wider w-32 text-center">Without</div>
            <div className="px-5 py-3 border-b border-white/[0.06] text-xs font-semibold text-sky-400 uppercase tracking-wider w-32 text-center">With IdeaForge</div>

            {comparisons.map((c, i) => (
              <motion.div
                key={c.label}
                className="contents"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 + i * 0.08 }}
              >
                <div className="px-5 py-4 border-b border-white/[0.03] font-medium text-slate-300 flex items-center">{c.label}</div>
                <div className="px-5 py-4 border-b border-white/[0.03] w-32">
                  <p className="text-center text-xs text-slate-500 mb-1.5">{c.without}</p>
                  <Bar pct={c.withoutPct} color="bg-red-400/60" delay={0.2 + i * 0.08} />
                </div>
                <div className="px-5 py-4 border-b border-white/[0.03] w-32">
                  <p className="text-center text-xs text-sky-400 font-medium mb-1.5">{c.withVal}</p>
                  <Bar pct={c.withPct} color="bg-gradient-to-r from-sky-500 to-orange-500" delay={0.3 + i * 0.08} />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
