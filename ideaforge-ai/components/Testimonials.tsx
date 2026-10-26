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
  show: { opacity: 1, transition: { staggerChildren: 0.07, delayChildren: 0.05 } },
};

const item = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

function Stars({ rating }: { rating: number }) {
  return (
    <div className="mb-4 flex gap-0.5" aria-label={`${rating} out of 5`}>
      {Array.from({ length: rating }).map((_, i) => (
        <svg key={i} className="h-3.5 w-3.5 fill-[var(--brand-orange)] text-[var(--brand-orange)]" viewBox="0 0 20 20" aria-hidden="true">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

function TestimonialBody({ t }: { t: (typeof testimonials)[0] }) {
  return (
    <>
      <Stars rating={t.rating} />
      <p className="mb-5 text-sm leading-relaxed text-copy">&ldquo;{t.text}&rdquo;</p>
      <div className="flex items-center gap-3">
        <span className="relative h-10 w-10 overflow-hidden rounded-full border border-line">
          <Image src={t.avatar} alt={t.name} fill unoptimized sizes="40px" className="object-cover" />
        </span>
        <span>
          <span className="block text-sm font-semibold text-ink">{t.name}</span>
          <span className="block text-xs text-muted">{t.role} at {t.company}</span>
        </span>
      </div>
    </>
  );
}

export default function Testimonials() {
  return (
    <section className="section bg-surface">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          className="mx-auto mb-12 max-w-2xl text-center"
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
        >
          <span className="eyebrow">Customer stories</span>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            Trusted by founders and product teams
          </h2>
          <p className="mt-3 flex items-center justify-center gap-2 text-base text-copy">
            <span className="font-semibold text-ink">4.9 / 5</span>
            <span className="text-muted">from 2,400+ reviews</span>
          </p>
        </motion.div>

        {/* Mobile carousel */}
        <div className="-mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-4 md:hidden scrollbar-hide">
          {testimonials.map((t) => (
            <div key={t.name} className="testimonial-card min-w-[300px] snap-center p-6">
              <TestimonialBody t={t} />
            </div>
          ))}
        </div>

        <motion.div
          className="hidden gap-4 md:grid md:grid-cols-2 lg:grid-cols-3"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          {testimonials.map((t) => (
            <motion.div key={t.name} variants={item} className="testimonial-card p-6">
              <TestimonialBody t={t} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
