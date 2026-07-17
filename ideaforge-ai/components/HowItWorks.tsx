"use client";
import { motion } from "framer-motion";
import Image from "next/image";

const steps = [
  {
    num: "01",
    title: "Describe Your Idea",
    desc: "Tell us about your business concept, target audience, and industry. Add as much detail as possible for deeper analysis.",
    icon: "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=500&fit=crop&auto=format&q=80",
    alt: "Team planning business ideas together",
  },
  {
    num: "02",
    title: "IdeaForge AI Analysis",
    desc: "Our AI engine performs a 9-dimension deep dive: market sizing, SWOT, skeptic stress-test, GTM experiments, and competitive landscape mapping.",
    icon: "M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",
    image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&h=500&fit=crop&auto=format&q=80",
    alt: "AI and automation concept",
  },
  {
    num: "03",
    title: "Get Your Report",
    desc: "Receive a comprehensive viability report with radar charts, market timing indicators, risk heatmaps, and a 7-day action plan.",
    icon: "M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=500&fit=crop&auto=format&q=80",
    alt: "Business analytics dashboard",
  },
  {
    num: "04",
    title: "Act & Iterate",
    desc: "Follow the AI-generated action plan, pivot with the assistant, and compare ideas side-by-side to find your best opportunity.",
    icon: "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=500&fit=crop&auto=format&q=80",
    alt: "Entrepreneur reviewing analytics",
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.1 }
  }
};

const item = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 80 } }
};

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 bg-surface overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div className="text-center mb-20" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.6 }}>
          <span className="inline-block text-xs font-bold text-primary bg-primary/10 px-4 py-1.5 rounded-full mb-4 tracking-wider uppercase">How It Works</span>
          <h2 className="text-3xl sm:text-5xl font-bold text-heading tracking-tight">From idea to validation in minutes</h2>
          <p className="text-body mt-4 text-lg max-w-2xl mx-auto">Four simple steps to validate, pivot, and launch your next big idea with AI-powered precision.</p>
        </motion.div>

        <div className="relative">
          <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-gray-200 dark:via-gray-700 to-transparent" />

          <motion.div className="space-y-24" variants={container} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-100px" }}>
            {steps.map((step, idx) => (
              <motion.div key={step.num} variants={item} className="relative">
                <div className={`grid lg:grid-cols-2 gap-12 lg:gap-20 items-center ${idx % 2 === 1 ? "" : ""}`}>
                  <div className={`relative ${idx % 2 === 1 ? "lg:order-last" : "lg:order-first"}`}>
                    <div className="absolute -inset-4 bg-gradient-to-r from-primary/5 to-accent/5 rounded-3xl blur-2xl" />
                    <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-gray-100 dark:border-gray-700/50 bg-white dark:bg-gray-800 h-64 sm:h-80">
                      <Image src={step.image} alt={step.alt} fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-6">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-bold mb-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-white" />
                          Step {step.num}
                        </span>
                        <h3 className="text-xl font-bold text-white">{step.title}</h3>
                      </div>
                    </div>
                  </div>

                  <div className={`space-y-5 ${idx % 2 === 1 ? "lg:text-left" : "lg:text-left"}`}>
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl gradient-btn shadow-lg shadow-primary/25">
                      <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d={step.icon} />
                      </svg>
                    </div>
                    <div>
                      <span className="text-xs font-bold text-primary bg-primary/10 px-3 py-1 rounded-full">Step {step.num}</span>
                      <h3 className="text-2xl sm:text-3xl font-bold text-heading mt-3 mb-3">{step.title}</h3>
                      <p className="text-body text-base leading-relaxed max-w-lg">{step.desc}</p>
                    </div>
                  </div>
                </div>

                <div className="hidden lg:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                  <div className="w-10 h-10 rounded-full gradient-btn flex items-center justify-center shadow-lg shadow-primary/25 text-white font-bold text-sm">
                    {step.num}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
