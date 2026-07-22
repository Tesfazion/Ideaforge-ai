"use client";
import { motion } from "framer-motion";

const logos = [
  { name: "Y Combinator", abbr: "YC" },
  { name: "Techstars", abbr: "TS" },
  { name: "Sequoia", abbr: "SQ" },
  { name: "a16z", abbr: "a16z" },
  { name: "500 Startups", abbr: "500" },
  { name: "Plug and Play", abbr: "PnP" },
  { name: "SV Angel", abbr: "SVA" },
  { name: "Founders Fund", abbr: "FF" },
];

function LogoItem({ logo }: { logo: typeof logos[0] }) {
  return (
    <div className="flex items-center gap-2 opacity-30 hover:opacity-60 transition-opacity duration-300 shrink-0 px-6">
      <div className="w-8 h-8 rounded-lg bg-white/[0.05] border border-white/[0.06] flex items-center justify-center">
        <span className="text-xs font-bold text-slate-400">{logo.abbr}</span>
      </div>
      <span className="text-sm font-medium text-slate-500">{logo.name}</span>
    </div>
  );
}

export default function LogoBar() {
  const doubled = [...logos, ...logos];

  return (
    <section className="py-14 bg-[#060a13] border-y border-white/5 overflow-hidden">
      <motion.p
        className="text-center text-xs font-semibold text-slate-600 uppercase tracking-widest mb-8"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        Trusted by founders from leading accelerators
      </motion.p>

      <div className="relative">
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[#060a13] to-transparent z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[#060a13] to-transparent z-10" />

        <div className="flex animate-marquee">
          {doubled.map((logo, i) => (
            <LogoItem key={`${logo.name}-${i}`} logo={logo} />
          ))}
        </div>
      </div>
    </section>
  );
}
