"use client";
import { motion } from "framer-motion";
import Image from "next/image";

const steps = [
  {
    num: "01",
    title: "Describe Your Idea",
    desc: "Tell us about your business concept, target audience, and industry. Add as much detail as you want for deeper analysis.",
    icon: "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z",
    image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&h=500&fit=crop&auto=format&q=80",
    imageAlt: "Writing business idea on laptop",
    detail: "~2 minutes",
  },
  {
    num: "02",
    title: "IdeaForge Analysis",
    desc: "Our AI engine performs a 9-dimension deep dive: market sizing, SWOT, skeptic stress-test, GTM experiments, and competitive landscape.",
    icon: "M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",
    image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&h=500&fit=crop&auto=format&q=80",
    imageAlt: "AI analysis process",
    detail: "~30 seconds",
  },
  {
    num: "03",
    title: "Get Your Report",
    desc: "Receive a comprehensive report with radar charts, market timing indicators, risk heatmaps, and a 7-day action plan.",
    icon: "M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=500&fit=crop&auto=format&q=80",
    imageAlt: "Business report dashboard",
    detail: "Instant",
  },
  {
    num: "04",
    title: "Act & Iterate",
    desc: "Follow the action plan, pivot with the AI assistant, and compare ideas side-by-side to find your best opportunity.",
    icon: "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=500&fit=crop&auto=format&q=80",
    imageAlt: "Growth analytics",
    detail: "7-day plan",
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.1 }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 100 } }
};

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 bg-[#060a13] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-block text-xs font-semibold text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-3 py-1 rounded-full mb-5 tracking-wider uppercase">How It Works</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">From idea to validation in minutes</h2>
          <p className="text-slate-400 mt-3 max-w-2xl mx-auto">Four simple steps to validate, pivot, and launch your next big idea with AI-powered precision.</p>
        </motion.div>

        <motion.div
          className="relative"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-white/[0.06] to-transparent" />

          <div className="space-y-8">
            {steps.map((step, idx) => (
              <motion.div key={step.num} variants={item} className="relative">
                <div className={`grid lg:grid-cols-2 gap-6 items-center ${idx % 2 === 1 ? "lg:direction-rtl" : ""}`}>
                  <div className={`${idx % 2 === 1 ? "lg:order-last lg:pl-12" : "lg:pr-12"}`}>
                    <div className="relative rounded-2xl overflow-hidden border border-white/[0.06] h-56 sm:h-64 group">
                      <Image
                        src={step.image}
                        alt={step.imageAlt}
                        fill
                        sizes="(max-width: 1024px) 100vw, 50vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#060a13] via-[#060a13]/30 to-transparent" />
                      <div className="absolute inset-0 bg-indigo-500/5 group-hover:bg-indigo-500/10 transition-colors duration-500" />
                      <div className="absolute bottom-0 left-0 right-0 p-5">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/25">
                            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                              <path strokeLinecap="round" strokeLinejoin="round" d={step.icon} />
                            </svg>
                          </div>
                          <div>
                            <span className="text-xs font-mono text-indigo-400">Step {step.num}</span>
                            <h3 className="text-lg font-bold text-white">{step.title}</h3>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className={`space-y-4 ${idx % 2 === 1 ? "lg:pr-12" : "lg:pl-12"}`}>
                    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-xs font-semibold text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2.5 py-0.5 rounded-full">Step {step.num}</span>
                        <span className="text-[11px] text-slate-600 font-mono">{step.detail}</span>
                      </div>
                      <h3 className="text-xl font-bold text-white mb-2">{step.title}</h3>
                      <p className="text-slate-400 text-sm leading-relaxed">{step.desc}</p>
                    </div>
                  </div>
                </div>

                <div className="hidden lg:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                  <div className="w-9 h-9 rounded-full bg-[#060a13] border border-white/[0.1] flex items-center justify-center">
                    <span className="text-xs font-bold text-indigo-400">{step.num}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
