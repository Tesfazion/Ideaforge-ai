"use client";
import { motion } from "framer-motion";
import Image from "next/image";

const features = [
  {
    title: "9-Dimension Deep Dive",
    desc: "Problem Severity, Market Urgency, Market Size, Competitive Moat, Ease of Replica, Revenue Potential, Founder-Idea Fit, Time to Market, and Scalability — all scored individually.",
    icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
    color: "from-blue-500 to-blue-600",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop&auto=format&q=80",
    alt: "Business analytics dashboard",
  },
  {
    title: "SWOT Analysis",
    desc: "Auto-generated Strengths, Weaknesses, Opportunities, and Threats tailored to your specific idea, market, and competitive landscape.",
    icon: "M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z",
    color: "from-emerald-500 to-emerald-600",
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&h=300&fit=crop&auto=format&q=80",
    alt: "Strategic planning session",
  },
  {
    title: "Competitive Landscape",
    desc: "Map of direct and indirect competitors with their strengths, weaknesses, market gaps, and a differentiation strategy for your idea.",
    icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z",
    color: "from-violet-500 to-violet-600",
    image: "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=400&h=300&fit=crop&auto=format&q=80",
    alt: "Team analyzing competitors",
  },
  {
    title: "Market Timing Score",
    desc: "Is now the right time? We analyze market signals, search trends, funding activity, and regulatory environment to give you a timing score.",
    icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
    color: "from-amber-500 to-amber-600",
    image: "https://images.unsplash.com/photo-1611974765270-ca1258634369?w=400&h=300&fit=crop&auto=format&q=80",
    alt: "Market trends chart",
  },
  {
    title: "Skeptic Mode",
    desc: "A brutal adversarial stress-test that actively looks for fatal flaws, regulatory risks, timing issues, and structural business model problems.",
    icon: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z",
    color: "from-red-500 to-red-600",
    image: "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=400&h=300&fit=crop&auto=format&q=80",
    alt: "Risk assessment visualization",
  },
  {
    title: "7-Day Action Plan",
    desc: "A step-by-step plan with daily themes, specific tasks, templates, and expected outcomes to validate your idea in just one week.",
    icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4",
    color: "from-indigo-500 to-indigo-600",
    image: "https://images.unsplash.com/photo-1507925921958-8a62f3d1a50d?w=400&h=300&fit=crop&auto=format&q=80",
    alt: "Planning calendar and tasks",
  },
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

export default function Features() {
  return (
    <section className="py-20 bg-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div className="text-center mb-12" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.6 }}>
          <span className="inline-block text-xs font-bold text-primary bg-primary/10 px-4 py-1.5 rounded-full mb-4 tracking-wider uppercase">Features</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-heading">Everything You Need to Validate</h2>
          <p className="text-body mt-3 max-w-2xl mx-auto">IdeaForge AI goes beyond simple scoring. Get a complete analysis toolkit that helps you understand, test, and refine your business idea.</p>
        </motion.div>
        <motion.div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6" variants={container} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-100px" }}>
          {features.map((f) => (
            <motion.div key={f.title} className="card-base rounded-2xl overflow-hidden card-hover group" variants={item} whileHover={{ y: -5, transition: { type: "spring", stiffness: 300 } }}>
              <div className="relative h-40 overflow-hidden">
                <Image src={f.image} alt={f.alt} fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                <div className="absolute bottom-3 left-3">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${f.color} flex items-center justify-center shadow-lg`}>
                    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d={f.icon} />
                    </svg>
                  </div>
                </div>
              </div>
              <div className="p-5">
                <h3 className="text-lg font-semibold text-heading mb-2">{f.title}</h3>
                <p className="text-sm text-body leading-relaxed">{f.desc}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
