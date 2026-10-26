"use client";
import { motion } from "framer-motion";
import Image from "next/image";

const steps = [
  {
    num: "01",
    title: "Describe your idea",
    desc: "Tell us about your business concept, target audience, and industry. Add as much detail as you want for a deeper analysis.",
    icon: "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z",
    image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&h=500&fit=crop&auto=format&q=80",
    imageAlt: "Founder writing a business idea on a laptop",
    detail: "~2 minutes",
  },
  {
    num: "02",
    title: "IdeaForge analysis",
    desc: "Our engine performs a 9-dimension deep dive: market sizing, SWOT, a skeptic stress test, go-to-market experiments, and competitive landscape.",
    icon: "M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",
    image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&h=500&fit=crop&auto=format&q=80",
    imageAlt: "Analysts reviewing research together",
    detail: "~30 seconds",
  },
  {
    num: "03",
    title: "Get your report",
    desc: "Receive a structured report with radar charts, market timing indicators, risk heatmaps, and a 7-day action plan.",
    icon: "M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=500&fit=crop&auto=format&q=80",
    imageAlt: "Business report dashboard on a screen",
    detail: "Instant",
  },
  {
    num: "04",
    title: "Act and iterate",
    desc: "Follow the action plan, pivot with the AI assistant, and compare ideas side by side to find your strongest opportunity.",
    icon: "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=500&fit=crop&auto=format&q=80",
    imageAlt: "Growth analytics on a laptop",
    detail: "7-day plan",
  },
];

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="section section-alt">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          className="mx-auto max-w-2xl text-center"
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
        >
          <span className="eyebrow">How it works</span>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            From idea to validation in minutes
          </h2>
          <p className="mt-3 text-base leading-relaxed text-copy">
            Four clear steps to validate, refine, and act on your next business idea.
          </p>
        </motion.div>

        <motion.div
          className="relative mt-14"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          <div className="absolute bottom-0 left-1/2 top-0 hidden w-px bg-[var(--line)] lg:block" aria-hidden="true" />

          <div className="space-y-10">
            {steps.map((step, idx) => {
              const reversed = idx % 2 === 1;
              return (
                <motion.div key={step.num} variants={item} className="relative">
                  <div className="grid items-center gap-6 lg:grid-cols-2 lg:gap-0">
                    <div className={reversed ? "lg:order-last lg:pl-12" : "lg:pr-12"}>
                      <div className="group relative h-56 overflow-hidden rounded-xl border border-line bg-surface-alt sm:h-64">
                        <Image
                          src={step.image}
                          alt={step.imageAlt}
                          fill
                          unoptimized
                          sizes="(max-width: 1024px) 100vw, 50vw"
                          className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                        />
                        <div className="workflow-image-surface absolute inset-0" />
                        <div className="absolute inset-x-0 bottom-0 p-5">
                          <div className="flex items-center gap-3">
                            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-strong text-white">
                              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6} aria-hidden="true">
                                <path strokeLinecap="round" strokeLinejoin="round" d={step.icon} />
                              </svg>
                            </span>
                            <div>
                              <span className="workflow-image-label block text-[11px] font-bold uppercase tracking-[0.1em]">
                                Step {step.num}
                              </span>
                              <h3 className="workflow-image-text text-lg font-bold">{step.title}</h3>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className={reversed ? "lg:pr-12" : "lg:pl-12"}>
                      <div className="card p-6">
                        <div className="mb-3 flex items-center gap-2.5">
                          <span className="badge badge-brand">Step {step.num}</span>
                          <span className="text-[11px] font-medium text-muted">{step.detail}</span>
                        </div>
                        <h3 className="text-xl font-bold text-ink">{step.title}</h3>
                        <p className="mt-2 text-sm leading-relaxed text-copy">{step.desc}</p>
                      </div>
                    </div>
                  </div>

                  <div className="absolute left-1/2 top-1/2 z-10 hidden -translate-x-1/2 -translate-y-1/2 lg:flex" aria-hidden="true">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full border border-brand-line bg-surface text-[11px] font-bold text-brand-ink shadow-[var(--shadow-xs)]">
                      {step.num}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
