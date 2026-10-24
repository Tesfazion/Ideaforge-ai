"use client";
import { motion } from "framer-motion";
import Image from "next/image";

const features = [
  { title: "9-dimension analysis", desc: "Assess problem severity, urgency, market size, competitive moat, revenue potential, founder fit, timing, and scalability.", icon: "M3 3v18h18M7 14l4-4 4 4 6-7" },
  { title: "SWOT analysis", desc: "See the strengths, weaknesses, opportunities, and threats specific to your idea and its market.", icon: "M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z" },
  { title: "Competitor research", desc: "Map direct and indirect competitors, compare their offers, and find room to differentiate.", icon: "M16 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2m16 0v-2a4 4 0 00-3-3.87M14 3.13a4 4 0 010 7.75M14 7a4 4 0 11-8 0 4 4 0 018 0z" },
  { title: "Market timing", desc: "Review market signals, search trends, funding activity, and regulations to understand why now matters.", icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" },
  { title: "Skeptic mode", desc: "Stress-test assumptions and surface potential flaws, risks, timing issues, and constraints early.", icon: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" },
  { title: "7-day action plan", desc: "Turn the analysis into daily tasks, practical experiments, and clear outcomes to test this week.", icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" },
];

export default function Features() {
  return (
    <section id="features" className="feature-section py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div className="feature-heading mb-12 grid gap-7 md:grid-cols-[1.2fr_.8fr] md:items-end" initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <div className="pb-1">
            <span className="section-kicker">Features</span>
            <h2 className="mt-4 text-3xl sm:text-4xl font-bold tracking-tight">Everything you need to validate</h2>
          </div>
          <div className="feature-story relative min-h-40 overflow-hidden rounded-xl border">
            <Image src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=1000&h=500&fit=crop&auto=format&q=85" alt="Founders reviewing research and planning together" fill unoptimized sizes="(max-width: 768px) 100vw, 40vw" className="object-cover" />
            <div className="feature-story-shade absolute inset-0" />
            <p className="feature-story-caption absolute inset-x-5 bottom-4 text-sm font-semibold">Research first. Build with confidence.</p>
          </div>
        </motion.div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <motion.article key={feature.title} className="feature-card rounded-xl border p-6" initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.06 }}>
              <div className="mb-5 flex items-center justify-between">
                <span className="feature-icon flex h-11 w-11 items-center justify-center rounded-lg border">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.7}><path strokeLinecap="round" strokeLinejoin="round" d={feature.icon} /></svg>
                </span>
                <span className="feature-index text-xs font-semibold tabular-nums">0{index + 1}</span>
              </div>
              <h3 className="text-lg font-semibold">{feature.title}</h3>
              <p className="mt-2 text-sm leading-6">{feature.desc}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
