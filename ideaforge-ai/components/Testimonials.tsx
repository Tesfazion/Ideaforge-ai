"use client";
import { motion } from "framer-motion";
import Image from "next/image";

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Founder",
    company: "LearnLoop",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&auto=format&q=80",
    text: "IdeaForge validated my SaaS idea in seconds and saved me months of research. The competitor analysis alone was worth it.",
    rating: 5,
  },
  {
    name: "Marcus Johnson",
    role: "Product Manager",
    company: "Stripe",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&auto=format&q=80",
    text: "We use IdeaForge to quickly validate feature ideas before committing engineering resources. Game changer for our team.",
    rating: 5,
  },
  {
    name: "Elena Rodriguez",
    role: "Solo Entrepreneur",
    company: "IndieHacker",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&auto=format&q=80",
    text: "As a first-time founder, this tool gave me the confidence to pursue my idea. The risk assessment helped me prepare for challenges.",
    rating: 5,
  },
  {
    name: "David Kim",
    role: "Angel Investor",
    company: "AngelList",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&auto=format&q=80",
    text: "I recommend IdeaForge to every founder in my portfolio. It's like having a whole strategy team on demand.",
    rating: 5,
  },
  {
    name: "Priya Mehta",
    role: "Growth Lead",
    company: "Notion",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&auto=format&q=80",
    text: "The market timing score alone saved us from launching too early. We pivoted and doubled our conversion rate.",
    rating: 5,
  },
  {
    name: "Alex Turner",
    role: "Co-founder",
    company: "Vercel",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&auto=format&q=80",
    text: "From idea to pitch deck in a weekend. IdeaForge gave us the data-driven narrative investors were looking for.",
    rating: 5,
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 100 } }
};

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5 mb-4">
      {Array.from({ length: rating }).map((_, i) => (
        <svg key={i} className="w-3.5 h-3.5 text-amber-400 fill-current" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

function TestimonialCard({ t }: { t: typeof testimonials[0] }) {
  return (
    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 transition-all duration-300 hover:border-white/10 hover:bg-white/[0.04] min-w-[300px] sm:min-w-0 snap-center">
      <Stars rating={t.rating} />
      <p className="text-sm text-slate-400 leading-relaxed mb-5">&quot;{t.text}&quot;</p>
      <div className="flex items-center gap-3">
        <div className="relative w-10 h-10 rounded-full overflow-hidden border border-white/10">
          <Image
            src={t.avatar}
            alt={t.name}
            fill
            sizes="40px"
            className="object-cover"
          />
        </div>
        <div>
          <p className="text-sm font-semibold text-white">{t.name}</p>
          <p className="text-xs text-slate-500">{t.role} at {t.company}</p>
        </div>
      </div>
    </div>
  );
}

export default function Testimonials() {
  return (
    <section className="py-24 bg-[#060a13] relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-purple-500/[0.02] via-transparent to-transparent" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-block text-xs font-semibold text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-3 py-1 rounded-full mb-5 tracking-wider uppercase">Testimonials</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">Loved by entrepreneurs</h2>
          <p className="text-slate-400 mt-3">Rated 4.9/5 from 2,400+ reviews</p>
        </motion.div>

        <div className="md:hidden overflow-x-auto pb-4 -mx-4 px-4 snap-x snap-mandatory scrollbar-hide">
          <motion.div
            className="flex gap-3"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            {testimonials.map((t) => (
              <TestimonialCard key={t.name} t={t} />
            ))}
          </motion.div>
        </div>

        <motion.div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-4" variants={container} initial="hidden" whileInView="show" viewport={{ once: true }}>
          {testimonials.map((t) => (
            <motion.div
              key={t.name}
              className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 transition-all duration-300 hover:border-white/10 hover:bg-white/[0.04]"
              variants={item}
              whileHover={{ y: -2, transition: { type: "spring", stiffness: 400 } }}
            >
              <Stars rating={t.rating} />
              <p className="text-sm text-slate-400 leading-relaxed mb-5">&quot;{t.text}&quot;</p>
              <div className="flex items-center gap-3">
                <div className="relative w-10 h-10 rounded-full overflow-hidden border border-white/10">
                  <Image
                    src={t.avatar}
                    alt={t.name}
                    fill
                    sizes="40px"
                    className="object-cover"
                  />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{t.name}</p>
                  <p className="text-xs text-slate-500">{t.role} at {t.company}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
