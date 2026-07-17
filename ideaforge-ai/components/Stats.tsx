"use client";
import { motion } from "framer-motion";

const stats = [
  { value: "50K+", label: "Ideas Validated", icon: "M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" },
  { value: "94%", label: "Accuracy Rate", icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" },
  { value: "30s", label: "Average Analysis", icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" },
  { value: "9", label: "Analysis Dimensions", icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.1 }
  }
};

const item = {
  hidden: { opacity: 0, scale: 0.8 },
  show: { opacity: 1, scale: 1, transition: { type: "spring" as const, stiffness: 100 } }
};

export default function Stats() {
  return (
    <section className="py-16 bg-white border-y border-gray-100 dark:bg-gray-900 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div className="grid grid-cols-2 md:grid-cols-4 gap-8" variants={container} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-100px" }}>
          {stats.map((s) => (
            <motion.div key={s.label} className="glass-card rounded-2xl border border-white/40 dark:border-white/10 p-6 text-center" variants={item} whileHover={{ scale: 1.05, transition: { type: "spring", stiffness: 400 } }}>
              <motion.div 
                className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-900/50 flex items-center justify-center mx-auto mb-3"
                whileHover={{ rotate: 10, scale: 1.1 }}
              >
                <svg className="w-6 h-6 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d={s.icon} />
                </svg>
              </motion.div>
              <motion.p className="text-3xl font-bold text-heading dark:text-white" initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 }}>
                {s.value}
              </motion.p>
              <p className="text-sm text-body mt-1">{s.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
