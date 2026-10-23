"use client";
import { motion } from "framer-motion";
import Image from "next/image";

const integrations = [
  { name: "Notion", file: "Notion logo - United States.jpg" },
  { name: "Slack", file: "Slack Logo PNG Transparent Images.jpg" },
  { name: "Google Sheets", file: "Google Sheet Icon Logo PNG.jpg" },
  { name: "Zapier", file: "Zapier Logo.jpg" },
  { name: "Airtable", file: "Download Airtable Rounded Logo Design.jpg" },
  { name: "Trello", file: "Trello logo.jpg" },
  { name: "Asana", file: "Asana Sticker.jpg" },
];

export default function Integrations() {
  return (
    <section className="py-20 bg-[#060a13] border-t border-white/5">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-block text-xs font-semibold text-sky-400 bg-sky-500/10 border border-sky-500/20 px-3 py-1 rounded-full mb-5 tracking-wider uppercase">Integrations</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">Works with your stack</h2>
          <p className="text-slate-400 mt-3 max-w-xl mx-auto">Export insights directly to the tools your team already uses.</p>
        </motion.div>

        <motion.div
          className="flex flex-wrap items-center justify-center gap-4"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15 }}
        >
          {integrations.map((int, i) => (
            <motion.div
              key={int.name}
              className="flex items-center gap-2.5 px-4 py-3 rounded-xl border border-white/[0.06] bg-white/[0.02] hover:border-white/10 hover:bg-white/[0.04] transition-all duration-300 cursor-default"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.05 * i }}
              whileHover={{ y: -2 }}
            >
              <div className="w-8 h-8 rounded-lg bg-white/[0.06] border border-white/[0.06] flex items-center justify-center overflow-hidden">
                <Image src={`/integrations/${int.file}`} alt={int.name} width={32} height={32} className="w-full h-full object-contain" />
              </div>
              <span className="text-sm font-medium text-slate-300">{int.name}</span>
            </motion.div>
          ))}
          <div className="flex items-center gap-2 px-4 py-3 rounded-xl border border-dashed border-white/[0.08] text-slate-500">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            <span className="text-sm">More coming soon</span>
          </div>
        </motion.div>

        <motion.p
          className="text-center text-xs text-slate-600 mt-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          Enterprise plan includes API access and custom integrations
        </motion.p>
      </div>
    </section>
  );
}
