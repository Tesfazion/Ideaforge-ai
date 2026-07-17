"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

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

const ACTIVITIES = [
  { name: "Sarah C.", action: "validated", idea: "AI-Powered Tutoring Platform", score: 87, time: "2m ago" },
  { name: "Marcus J.", action: "validated", idea: "Sustainable Packaging SaaS", score: 74, time: "5m ago" },
  { name: "Elena R.", action: "generated", idea: "3 new ideas for HealthTech", score: null, time: "8m ago" },
  { name: "David K.", action: "validated", idea: "Remote Team Wellness App", score: 91, time: "12m ago" },
  { name: "Priya M.", action: "validated", idea: "B2B Invoice Automation", score: 82, time: "18m ago" },
  { name: "Alex T.", action: "generated", idea: "5 new ideas for FinTech", score: null, time: "22m ago" },
  { name: "Jordan L.", action: "validated", idea: "Carbon Offset Marketplace", score: 79, time: "28m ago" },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.3 }
  }
};

const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 100 } }
};

export default function Hero() {
  const [activityIdx, setActivityIdx] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActivityIdx((prev) => (prev + 1) % ACTIVITIES.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const activity = ACTIVITIES[activityIdx];

  return (
    <section className="relative overflow-hidden bg-white dark:bg-[#0B1120]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
        <motion.div className="grid lg:grid-cols-2 gap-16 items-center" variants={container} initial="hidden" animate="show">
          <motion.div className="text-left max-w-xl" variants={item}>
            <motion.div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6" variants={item}>
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              Trusted by 10,000+ entrepreneurs worldwide
            </motion.div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-heading leading-tight">
              Validate Your Business Idea
              <span className="gradient-text block mt-2">With AI Precision</span>
            </h1>
            <p className="mt-6 text-lg text-body max-w-xl">
              Get a comprehensive 9-dimension analysis of your business idea in 30 seconds. Market research, SWOT analysis, competitor mapping, risk assessment, and a 7-day action plan — all powered by IdeaForge.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link href="/register" className="gradient-btn text-white px-8 py-3.5 rounded-xl text-base font-semibold inline-flex items-center gap-2 justify-center shadow-lg">
                  Start Validating Free
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link href="#how-it-works" className="px-8 py-3.5 rounded-xl text-base font-semibold border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors inline-flex items-center gap-2 justify-center">
                  See How It Works
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                </Link>
              </motion.div>
            </div>
            <motion.div className="mt-10 flex flex-wrap gap-6 text-sm text-muted" variants={item}>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                No credit card required
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                <Counter end={10000} suffix="+" /> ideas validated
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                9-dimension analysis
              </div>
            </motion.div>
          </motion.div>

          <motion.div className="relative hidden lg:block" variants={item}>
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
              <Image
                src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop&auto=format&q=80"
                alt="Modern startup office"
                width={800}
                height={600}
                className="w-full h-[420px] object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">Live Validation</p>
                    <p className="text-xs text-white/70">Just now</p>
                  </div>
                </div>
                <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-md rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-gray-500">Viability Score</span>
                    <span className="text-lg font-bold text-emerald-600">{activity.score || "—"}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                    <motion.div
                      className="bg-gradient-to-r from-emerald-500 to-emerald-400 h-1.5 rounded-full"
                      animate={{ width: `${activity.score || 0}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-white mt-3">
                  <div className="w-7 h-7 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white text-xs font-bold">
                    {activity.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="truncate">
                      <span className="font-medium">{activity.name}</span> {activity.action} <span className="font-medium">{activity.idea}</span>
                    </p>
                  </div>
                  <span className="text-xs text-white/70 whitespace-nowrap">{activity.time}</span>
                </div>
              </div>
            </div>
            <motion.div
              className="absolute -bottom-4 -right-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-lg p-3 flex items-center gap-2"
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-900/50 flex items-center justify-center">
                <svg className="w-4 h-4 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-900 dark:text-white">94% Accuracy</p>
                <p className="text-[10px] text-gray-500">Based on user feedback</p>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
