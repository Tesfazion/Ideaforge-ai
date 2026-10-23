"use client";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const ACTIVITIES = [
  { name: "Sarah C.", idea: "AI-Powered Tutoring Platform", score: 87, time: "2m ago", action: "validated" },
  { name: "Marcus J.", idea: "Sustainable Packaging SaaS", score: 74, time: "5m ago", action: "validated" },
  { name: "Elena R.", idea: "3 new ideas for HealthTech", score: null, time: "8m ago", action: "generated" },
  { name: "David K.", idea: "Remote Team Wellness App", score: 91, time: "12m ago", action: "validated" },
  { name: "Priya M.", idea: "B2B Invoice Automation", score: 82, time: "18m ago", action: "validated" },
  { name: "Alex T.", idea: "5 new ideas for FinTech", score: null, time: "22m ago", action: "generated" },
  { name: "Jordan L.", idea: "Carbon Offset Marketplace", score: 79, time: "28m ago", action: "validated" },
  { name: "Ryan W.", idea: "Fitness App for Seniors", score: 68, time: "35m ago", action: "validated" },
];

export default function ActivityFeed() {
  const [visibleIdx, setVisibleIdx] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisibleIdx((prev) => (prev + 1) % ACTIVITIES.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const visible = [
    ACTIVITIES[visibleIdx % ACTIVITIES.length],
    ACTIVITIES[(visibleIdx + 1) % ACTIVITIES.length],
    ACTIVITIES[(visibleIdx + 2) % ACTIVITIES.length],
  ];

  return (
    <section className="py-16 bg-white border-y border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="inline-flex items-center gap-2 text-xs text-slate-500">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Live activity
          </div>
        </motion.div>
        <div className="grid md:grid-cols-3 gap-3">
          {visible.map((a, i) => (
            <motion.div
              key={`${a.name}-${visibleIdx}-${i}`}
              className="flex items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.3 }}
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-sky-500 to-orange-600 flex items-center justify-center text-slate-900 text-xs font-bold shrink-0">
                {a.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-slate-300 truncate">
                  <span className="font-medium text-slate-900">{a.name}</span>{" "}
                  {a.action}{" "}
                  <span className="font-medium">{a.idea}</span>
                </p>
              </div>
              {a.score && (
                <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md shrink-0">
                  {a.score}%
                </span>
              )}
              <span className="text-[11px] text-slate-600 shrink-0">{a.time}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
