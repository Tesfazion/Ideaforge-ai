"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

function Counter({ end, suffix = "" }: { end: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const duration = 2000;
    const step = (end / duration) * 16;
    const timer = setInterval(() => {
      start += step;
      if (start >= end) { setCount(end); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [end]);
  return <>{count.toLocaleString()}{suffix}</>;
}

const DIMENSIONS = [
  { name: "Problem Severity", score: 85, color: "#818cf8" },
  { name: "Market Urgency", score: 78, color: "#818cf8" },
  { name: "Market Size", score: 88, color: "#a78bfa" },
  { name: "Competitive Moat", score: 72, color: "#a78bfa" },
  { name: "Revenue Potential", score: 76, color: "#c084fc" },
  { name: "Founder-Idea Fit", score: 90, color: "#c084fc" },
  { name: "Time to Market", score: 82, color: "#e879f9" },
  { name: "Scalability", score: 84, color: "#f59e0b" },
  { name: "Ease of Replica", score: 68, color: "#f59e0b" },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 }
  }
};

const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 100 } }
};

function Particles() {
  const [dots, setDots] = useState<{ id: number; x: number; y: number; size: number; duration: number; delay: number }[]>([]);
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      setDots(Array.from({ length: 40 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 2 + 1,
        duration: Math.random() * 20 + 15,
        delay: Math.random() * 10,
      })));
    });
    return () => cancelAnimationFrame(frame);
  }, []);
  if (!dots.length) return <div className="absolute inset-0 overflow-hidden pointer-events-none" />;
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {dots.map((d) => (
        <motion.div
          key={d.id}
          className="absolute rounded-full bg-white/[0.15]"
          style={{ left: `${d.x}%`, top: `${d.y}%`, width: d.size, height: d.size }}
          animate={{ y: [0, -30, 0], opacity: [0, 0.6, 0] }}
          transition={{ duration: d.duration, delay: d.delay, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#060a13]">
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1920&h=1080&fit=crop&auto=format&q=80"
          alt=""
          aria-hidden="true"
          className="w-full h-full object-cover opacity-[0.15]"
          loading="lazy"
          decoding="async"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#060a13] via-[#060a13]/80 to-[#060a13]" />
      </div>
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-16 h-16 sm:w-20 sm:h-20 md:w-32 md:h-32 bg-indigo-600/20 rounded-full blur-[80px] animate-orb" />
        <div className="absolute bottom-1/4 right-1/4 w-12 h-12 sm:w-16 sm:h-16 md:w-32 md:h-32 bg-purple-600/15 rounded-full blur-[60px] animate-orb-delayed" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 sm:w-12 sm:h-12 md:w-24 md:h-24 bg-amber-500/10 rounded-full blur-[40px] animate-orb-slow" />
      </div>

      <Particles />

      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wMykiLz48L3N2Zz4=')] opacity-60" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 sm:pt-32 pb-16 sm:pb-20">
        <motion.div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center" variants={container} initial="hidden" animate="show">
          <motion.div className="max-w-2xl" variants={item}>
            <motion.div
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-medium mb-8"
              variants={item}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Trusted by 1,200+ founders
            </motion.div>

            <motion.h1
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-[1.05] tracking-tight"
              variants={item}
            >
              Validate your idea
              <br />
              <span className="inline-block bg-gradient-to-r from-indigo-400 via-purple-400 to-amber-400 bg-[length:200%_auto] bg-clip-text text-transparent animate-shimmer">
                before you build it.
              </span>
            </motion.h1>

            <motion.p className="mt-6 text-base sm:text-lg text-slate-400 max-w-xl leading-relaxed" variants={item}>
              Get a comprehensive 9-dimension AI analysis of any business idea in 30 seconds. Market research, SWOT, competitor mapping, risk assessment, and a 7-day action plan.
            </motion.p>

            <motion.div className="mt-10 flex flex-col sm:flex-row gap-3 w-full sm:w-auto" variants={item}>
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="w-full sm:w-auto">
                <Link href="/register" className="gradient-btn text-white px-7 py-3.5 rounded-xl text-sm font-semibold inline-flex items-center gap-2 justify-center w-full sm:w-auto">
                  Start Validating Free
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="w-full sm:w-auto">
                <Link href="#how-it-works" className="px-7 py-3.5 rounded-xl text-sm font-semibold border border-white/10 text-slate-300 hover:bg-white/5 transition-colors inline-flex items-center gap-2 justify-center w-full sm:w-auto">
                  See How It Works
                </Link>
              </motion.div>
            </motion.div>

            <motion.div className="mt-12 flex flex-wrap gap-x-8 gap-y-3 text-sm text-slate-500" variants={item}>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                No credit card required
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                <Counter end={2847} suffix="+" /> ideas validated
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                9-dimension analysis
              </div>
            </motion.div>
          </motion.div>

          <motion.div className="relative hidden lg:block" variants={item}>
            <div className="absolute -inset-[1px] rounded-2xl bg-[conic-gradient(from_var(--angle),transparent_25%,#6366f1_50%,transparent_75%)] opacity-40 animate-[spin_6s_linear_infinite]" style={{ "--angle": "0deg" } as React.CSSProperties} />
            <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-[#0c1222]/90 backdrop-blur-xl p-6 shadow-2xl shadow-indigo-500/5">
              <div className="flex items-center gap-2 mb-5">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
                </div>
                <span className="text-xs text-slate-500 ml-2 font-mono">IdeaForge Analysis</span>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-300 font-medium">AI-Powered Tutoring Platform</span>
                  <span className="text-xs px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold">Score: 87</span>
                </div>

                <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1 scrollbar-thin">
                  {DIMENSIONS.map((d) => (
                    <div key={d.name} className="flex items-center gap-2.5">
                      <span className="text-[11px] text-slate-500 w-24 shrink-0 truncate">{d.name}</span>
                      <div className="flex-1 h-1.5 rounded-full bg-white/5 overflow-hidden">
                        <motion.div
                          className="h-full rounded-full"
                          style={{ backgroundColor: d.color }}
                          initial={{ width: 0 }}
                          animate={{ width: `${d.score}%` }}
                          transition={{ duration: 1.2, delay: 0.5, ease: "easeOut" }}
                        />
                      </div>
                      <span className="text-[11px] font-mono text-slate-400 w-7 text-right">{d.score}</span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-white/5 pt-4 mt-4">
                  <div className="grid grid-cols-3 gap-3">
                    <div className="rounded-xl bg-white/[0.03] border border-white/5 p-3 text-center">
                      <p className="text-lg font-bold text-white">30s</p>
                      <p className="text-[10px] text-slate-500 uppercase tracking-wider mt-0.5">Analysis Time</p>
                    </div>
                    <div className="rounded-xl bg-white/[0.03] border border-white/5 p-3 text-center">
                      <p className="text-lg font-bold text-white">9</p>
                      <p className="text-[10px] text-slate-500 uppercase tracking-wider mt-0.5">Dimensions</p>
                    </div>
                    <div className="rounded-xl bg-white/[0.03] border border-white/5 p-3 text-center">
                      <p className="text-lg font-bold text-emerald-400">94%</p>
                      <p className="text-[10px] text-slate-500 uppercase tracking-wider mt-0.5">Accuracy</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute -bottom-3 -right-3 w-24 h-24 bg-indigo-500/20 rounded-full blur-2xl" />
            <div className="absolute -top-3 -left-3 w-20 h-20 bg-purple-500/15 rounded-full blur-2xl" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
