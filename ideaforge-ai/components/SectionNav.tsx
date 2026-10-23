"use client";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { useState } from "react";

const sections = [
  { id: "hero", label: "Hero", top: 0 },
  { id: "features", label: "Features" },
  { id: "how-it-works", label: "How It Works" },
  { id: "pricing", label: "Pricing" },
];

export default function SectionNav() {
  const [active, setActive] = useState("hero");
  const [visible, setVisible] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setVisible(latest > 400);
    const offsets = sections.map((s) => {
      const el = document.getElementById(s.id);
      return { id: s.id, top: el ? el.getBoundingClientRect().top + window.scrollY - 200 : 0 };
    });
    for (let i = offsets.length - 1; i >= 0; i--) {
      if (latest >= offsets[i].top) {
        setActive(offsets[i].id);
        break;
      }
    }
  });

  return (
    <motion.nav
      className="fixed left-4 top-1/2 -translate-y-1/2 z-40 hidden xl:flex flex-col gap-2"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: visible ? 1 : 0, x: visible ? 0 : -20, pointerEvents: visible ? "auto" : "none" }}
      transition={{ duration: 0.2 }}
    >
      {sections.map((s) => (
        <a
          key={s.id}
          href={`#${s.id}`}
          className="group flex items-center gap-2.5 py-1"
          onClick={(e) => {
            e.preventDefault();
            document.getElementById(s.id)?.scrollIntoView({ behavior: "smooth" });
          }}
        >
          <div className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
            active === s.id
              ? "bg-sky-400 scale-125 shadow-[0_0_6px_rgba(129,140,248,0.5)]"
              : "bg-white/20 group-hover:bg-white/40"
          }`} />
          <span className={`text-[11px] font-medium transition-colors duration-300 ${
            active === s.id ? "text-sky-400" : "text-slate-600 group-hover:text-slate-400"
          }`}>
            {s.label}
          </span>
        </a>
      ))}
    </motion.nav>
  );
}
