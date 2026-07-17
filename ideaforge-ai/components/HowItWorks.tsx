"use client";
import { motion } from "framer-motion";

const steps = [
  { num: "01", title: "Describe Your Idea", desc: "Tell us about your business concept, target audience, and industry. Add as much detail as possible for deeper analysis.", icon: "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" },
  { num: "02", title: "IdeaForge AI Analysis", desc: "Our AI engine performs a 9-dimension deep dive: market sizing, SWOT, skeptic stress-test, GTM experiments, and competitive landscape mapping.", icon: "M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" },
  { num: "03", title: "Get Your Report", desc: "Receive a comprehensive viability report with radar charts, market timing indicators, risk heatmaps, and a 7-day action plan.", icon: "M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" },
  { num: "04", title: "Act & Iterate", desc: "Follow the AI-generated action plan, pivot with the assistant, and compare ideas side-by-side to find your best opportunity.", icon: "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.2, delayChildren: 0.1 }
  }
};

const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 100 } }
};

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 bg-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div className="text-center mb-12" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.6 }}>
          <h2 className="text-3xl sm:text-4xl font-bold text-heading">How It Works</h2>
          <p className="text-body mt-3">Four steps to validate, pivot, and launch your next big idea</p>
        </motion.div>
        <div className="grid md:grid-cols-4 gap-8 relative">
          <div className="hidden md:block absolute top-12 left-[12%] right-[12%] h-0.5 bg-gradient-to-r from-primary/20 via-primary to-primary/20" />
          <motion.div className="grid md:grid-cols-4 gap-8 relative" variants={container} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-100px" }}>
            {steps.map((step) => (
              <motion.div key={step.num} className="relative text-center" variants={item} whileHover={{ y: -5 }}>
                <motion.div 
                  className="w-16 h-16 rounded-2xl gradient-btn flex items-center justify-center mx-auto mb-4 relative z-10 shadow-lg"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d={step.icon} />
                  </svg>
                </motion.div>
                <motion.span className="text-xs font-bold text-primary bg-primary/10 px-3 py-1 rounded-full" whileHover={{ scale: 1.1 }}>
                  Step {step.num}
                </motion.span>
                <h3 className="text-lg font-semibold text-heading mt-3 mb-2">{step.title}</h3>
                <p className="text-sm text-body max-w-xs mx-auto">{step.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
