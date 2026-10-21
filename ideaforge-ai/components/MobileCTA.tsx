"use client";
import Link from "next/link";
import { motion, useScroll } from "framer-motion";
import { useEffect, useState } from "react";

export default function MobileCTA() {
  const { scrollY } = useScroll();
  const [show, setShow] = useState(false);

  useEffect(() => {
    const unsubscribe = scrollY.on("change", (latest) => {
      setShow(latest > 600);
    });
    return () => unsubscribe();
  }, [scrollY]);

  return (
    <motion.div
      className="fixed bottom-0 left-0 right-0 z-50 md:hidden"
      initial={{ y: 100 }}
      animate={{ y: show ? 0 : 100 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <div className="bg-[#0c1222]/95 backdrop-blur-xl border-t border-white/10 px-4 py-3 safe-area-pb">
        <Link
          href="/register"
          className="gradient-btn text-white w-full py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2"
        >
          Start Validating Free
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </Link>
      </div>
    </motion.div>
  );
}
