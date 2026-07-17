"use client";
import Link from "next/link";
import { motion } from "framer-motion";

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

export default function Footer() {
  return (
    <footer className="border-t border-gray-100 bg-white dark:bg-gray-900 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8" variants={container} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-100px" }}>
          <motion.div variants={item}>
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg gradient-btn flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <span className="text-lg font-bold text-heading dark:text-white">IdeaForge AI</span>
            </Link>
            <p className="text-sm text-body dark:text-gray-400 leading-relaxed">AI-powered business idea validation for entrepreneurs and innovators.</p>
          </motion.div>
          <motion.div variants={item}>
            <h4 className="text-sm font-semibold text-heading dark:text-white mb-3">Product</h4>
            <ul className="space-y-2 text-sm text-body dark:text-gray-400">
              <li><Link href="#features" className="hover:text-primary transition-colors">Features</Link></li>
              <li><Link href="#pricing" className="hover:text-primary transition-colors">Pricing</Link></li>
              <li><Link href="#how-it-works" className="hover:text-primary transition-colors">How It Works</Link></li>
            </ul>
          </motion.div>
          <motion.div variants={item}>
            <h4 className="text-sm font-semibold text-heading dark:text-white mb-3">Company</h4>
            <ul className="space-y-2 text-sm text-body dark:text-gray-400">
              <li><Link href="#" className="hover:text-primary transition-colors">About</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Blog</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Contact</Link></li>
            </ul>
          </motion.div>
          <motion.div variants={item}>
            <h4 className="text-sm font-semibold text-heading dark:text-white mb-3">Legal</h4>
            <ul className="space-y-2 text-sm text-body dark:text-gray-400">
              <li><Link href="#" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Terms of Service</Link></li>
            </ul>
          </motion.div>
        </motion.div>
        <motion.div className="border-t border-gray-100 dark:border-gray-800 mt-8 pt-8 text-center text-sm text-muted"
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.3 }}
        >
          &copy; {new Date().getFullYear()} IdeaForge AI. All rights reserved.
        </motion.div>
      </div>
    </footer>
  );
}
