"use client";
import { motion, useScroll, useSpring } from "framer-motion";
import { useEffect, useState } from "react";

export default function BackToTop() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });
  const [show, setShow] = useState(false);

  useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (latest) => {
      setShow(latest > 0.1);
    });
    return () => unsubscribe();
  }, [scrollYProgress]);

  return (
    <>
      <motion.div
        className="fixed left-0 right-0 top-0 z-[60] h-0.5 origin-left bg-brand"
        style={{ scaleX }}
      />
      <motion.button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="fixed bottom-20 right-4 z-50 flex h-10 w-10 items-center justify-center rounded-full border border-line bg-surface text-copy shadow-[var(--shadow-sm)] transition-colors hover:border-line-strong hover:text-ink md:bottom-8 md:right-6"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: show ? 1 : 0, scale: show ? 1 : 0.8, pointerEvents: show ? "auto" : "none" }}
        transition={{ duration: 0.2 }}
        aria-label="Back to top"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
        </svg>
      </motion.button>
    </>
  );
}
