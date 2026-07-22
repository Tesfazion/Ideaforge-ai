"use client";
import { motion } from "framer-motion";
import Image from "next/image";

const features = [
  {
    title: "9-Dimension Deep Dive",
    desc: "Problem Severity, Market Urgency, Market Size, Competitive Moat, Ease of Replica, Revenue Potential, Founder-Idea Fit, Time to Market, and Scalability.",
    icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
    gradient: "from-indigo-500/20 to-indigo-600/5",
    iconColor: "text-indigo-400",
    borderColor: "hover:border-indigo-500/30",
    span: "md:col-span-1 md:row-span-2",
    tall: true,
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=800&fit=crop&auto=format&q=80",
    imageAlt: "Data analytics dashboard",
  },
  {
    title: "SWOT Analysis",
    desc: "Auto-generated Strengths, Weaknesses, Opportunities, and Threats tailored to your specific idea and competitive landscape.",
    icon: "M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z",
    gradient: "from-purple-500/20 to-purple-600/5",
    iconColor: "text-purple-400",
    borderColor: "hover:border-purple-500/30",
    span: "",
    tall: false,
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=300&fit=crop&auto=format&q=80",
    imageAlt: "Team brainstorming",
  },
  {
    title: "Competitive Landscape",
    desc: "Map of direct and indirect competitors with strengths, weaknesses, market gaps, and a differentiation strategy.",
    icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z",
    gradient: "from-violet-500/20 to-violet-600/5",
    iconColor: "text-violet-400",
    borderColor: "hover:border-violet-500/30",
    span: "",
    tall: false,
    image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=600&h=300&fit=crop&auto=format&q=80",
    imageAlt: "Strategy planning",
  },
  {
    title: "Market Timing Score",
    desc: "Is now the right time? We analyze market signals, search trends, funding activity, and regulatory environment.",
    icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
    gradient: "from-amber-500/20 to-amber-600/5",
    iconColor: "text-amber-400",
    borderColor: "hover:border-amber-500/30",
    span: "",
    tall: false,
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=300&fit=crop&auto=format&q=80",
    imageAlt: "Market analytics",
  },
  {
    title: "Skeptic Mode",
    desc: "A brutal adversarial stress-test that actively looks for fatal flaws, regulatory risks, timing issues, and structural problems.",
    icon: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z",
    gradient: "from-rose-500/20 to-rose-600/5",
    iconColor: "text-rose-400",
    borderColor: "hover:border-rose-500/30",
    span: "md:col-span-1 md:row-span-2",
    tall: true,
    image: "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=600&h=800&fit=crop&auto=format&q=80",
    imageAlt: "Code review",
  },
  {
    title: "7-Day Action Plan",
    desc: "Step-by-step plan with daily themes, specific tasks, templates, and expected outcomes to validate in just one week.",
    icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4",
    gradient: "from-emerald-500/20 to-emerald-600/5",
    iconColor: "text-emerald-400",
    borderColor: "hover:border-emerald-500/30",
    span: "",
    tall: false,
    image: "https://images.unsplash.com/photo-1507925921958-8a62f3d1a50d?w=600&h=300&fit=crop&auto=format&q=80",
    imageAlt: "Task management",
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 100 } }
};

export default function Features() {
  return (
    <section id="features" className="py-24 bg-[#060a13] relative">
      <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/[0.02] via-transparent to-transparent" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-block text-xs font-semibold text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-3 py-1 rounded-full mb-5 tracking-wider uppercase">Features</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">Everything you need to validate</h2>
          <p className="text-slate-400 mt-3 max-w-2xl mx-auto">Go beyond simple scoring. Get a complete analysis toolkit that helps you understand, test, and refine your business idea.</p>
        </motion.div>

        <motion.div
          className="grid md:grid-cols-3 gap-4"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          {features.map((f) => (
            <motion.div
              key={f.title}
              className={`group relative rounded-2xl border border-white/[0.06] bg-gradient-to-br ${f.gradient} overflow-hidden transition-all duration-300 ${f.borderColor} ${f.span} ${f.tall ? "flex flex-col" : ""}`}
              variants={item}
              whileHover={{ y: -2, transition: { type: "spring", stiffness: 400 } }}
            >
              {f.tall && (
                <div className="relative h-44 overflow-hidden">
                  <Image
                    src={f.image}
                    alt={f.imageAlt}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#060a13] via-[#060a13]/40 to-transparent" />
                  <div className="absolute bottom-3 left-3">
                    <div className={`w-10 h-10 rounded-xl bg-white/[0.08] backdrop-blur-md border border-white/[0.1] flex items-center justify-center ${f.iconColor}`}>
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d={f.icon} />
                      </svg>
                    </div>
                  </div>
                </div>
              )}
              <div className={`p-5 ${f.tall ? "flex-1 flex flex-col" : ""}`}>
                {!f.tall && (
                  <div className={`w-10 h-10 rounded-xl bg-white/[0.05] border border-white/[0.06] flex items-center justify-center mb-4 ${f.iconColor}`}>
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d={f.icon} />
                    </svg>
                  </div>
                )}
                <h3 className="text-base font-semibold text-white mb-2">{f.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{f.desc}</p>
                {!f.tall && (
                  <div className="mt-4 h-28 rounded-xl overflow-hidden relative">
                    <Image
                      src={f.image}
                      alt={f.imageAlt}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover opacity-60 group-hover:opacity-80 group-hover:scale-105 transition-all duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#060a13]/80 to-transparent" />
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
