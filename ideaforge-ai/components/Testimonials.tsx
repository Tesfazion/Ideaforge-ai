"use client";
import { motion } from "framer-motion";

const testimonials = [
  { name: "Sarah Chen", role: "Startup Founder", avatar: "SC", text: "IdeaForge validated my SaaS idea in seconds and saved me months of research. The competitor analysis alone was worth it.", rating: 5 },
  { name: "Marcus Johnson", role: "Product Manager", avatar: "MJ", text: "We use IdeaForge to quickly validate feature ideas before committing engineering resources. Game changer for our team.", rating: 5 },
  { name: "Elena Rodriguez", role: "Solo Entrepreneur", avatar: "ER", text: "As a first-time founder, this tool gave me the confidence to pursue my idea. The risk assessment helped me prepare for challenges.", rating: 5 },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.2, delayChildren: 0.1 }
  }
};

const item = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  show: { opacity: 1, y: 0, scale: 1, transition: { type: "spring" as const, stiffness: 100 } }
};

export default function Testimonials() {
  return (
    <section className="py-20 bg-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div className="text-center mb-12" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.6 }}>
          <h2 className="text-3xl sm:text-4xl font-bold text-heading">Loved by Entrepreneurs</h2>
          <p className="text-body mt-3">See what our users have to say</p>
        </motion.div>
        <motion.div className="grid md:grid-cols-3 gap-6" variants={container} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-100px" }}>
          {testimonials.map((t) => (
            <motion.div key={t.name} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6 card-hover" variants={item} whileHover={{ y: -5, transition: { type: "spring", stiffness: 300 } }}>
              <motion.div className="flex gap-1 mb-4">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <motion.svg key={i} className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20"
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </motion.svg>
                ))}
              </motion.div>
              <p className="text-sm text-body dark:text-gray-300 leading-relaxed mb-4">&quot;{t.text}&quot;</p>
              <div className="flex items-center gap-3">
                <motion.div className="w-10 h-10 rounded-full gradient-btn flex items-center justify-center text-white text-sm font-bold"
                  whileHover={{ scale: 1.1, rotate: 10 }}
                >
                  {t.avatar}
                </motion.div>
                <div>
                  <p className="text-sm font-semibold text-heading dark:text-white">{t.name}</p>
                  <p className="text-xs text-muted">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
