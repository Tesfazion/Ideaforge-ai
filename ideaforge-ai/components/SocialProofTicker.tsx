"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

const proofs = [
  { icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z", text: "1,200+ founders trust IdeaForge" },
  { icon: "M13 10V3L4 14h7v7l9-11h-7z", text: "30-second AI analysis" },
  { icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z", text: "2,847 ideas validated this month" },
  { icon: "M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z", text: "Trusted across 45+ countries" },
  { icon: "M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z", text: "Powered by GPT-4o and Claude" },
];

export default function SocialProofTicker() {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setIdx((i) => (i + 1) % proofs.length), 3500);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="border-y border-line bg-surface py-3" aria-live="polite">
      <div className="mx-auto flex max-w-7xl items-center justify-center gap-3 px-4">
        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-brand" aria-hidden="true" />
        <div className="relative h-5 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={idx}
              className="absolute flex items-center gap-2 whitespace-nowrap"
              initial={{ y: 14, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -14, opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              <svg className="h-4 w-4 shrink-0 text-link" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d={proofs[idx].icon} />
              </svg>
              <span className="text-sm text-copy">{proofs[idx].text}</span>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
