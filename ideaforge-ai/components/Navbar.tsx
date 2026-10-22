"use client";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/lib/auth";
import { motion, useScroll, useTransform } from "framer-motion";
import { useState } from "react";

export default function Navbar() {
  const { user } = useAuth();
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, 80], [0, 0.8]);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <motion.nav className="fixed top-0 left-0 right-0 z-50">
      <div className="absolute inset-0 bg-[#060a13]/80 backdrop-blur-xl border-b border-white/5" />
      <motion.div className="absolute inset-0 bg-indigo-500/5" style={{ opacity }} />
      <div className="relative max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2.5 group">
             <div className="w-10 h-10 rounded-lg overflow-hidden group-hover:shadow-indigo-500/40 transition-shadow">
               <Image src="/logo.png" alt="IdeaForge" width={40} height={40} className="w-full h-full object-contain" />
            </div>
            <span className="text-lg font-bold text-white tracking-tight">IdeaForge</span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            <a href="#features" className="px-3 py-2 text-sm text-slate-400 hover:text-white transition-colors rounded-lg hover:bg-white/5">Features</a>
            <a href="#how-it-works" className="px-3 py-2 text-sm text-slate-400 hover:text-white transition-colors rounded-lg hover:bg-white/5">How It Works</a>
            <a href="#pricing" className="px-3 py-2 text-sm text-slate-400 hover:text-white transition-colors rounded-lg hover:bg-white/5">Pricing</a>
          </div>

          <div className="hidden md:flex items-center gap-2">
            {user ? (
              <div className="flex items-center gap-2">
                {user.plan === "pro" && (
                  <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    Pro
                  </span>
                )}
                <Link href="/dashboard" className="gradient-btn text-white px-4 py-2 rounded-lg text-sm font-semibold">
                  Dashboard
                </Link>
              </div>
            ) : (
              <>
                <Link href="/login" className="text-sm font-medium text-slate-400 hover:text-white px-3 py-2 transition-colors">
                  Sign In
                </Link>
                <Link href="/register" className="gradient-btn text-white px-4 py-2 rounded-lg text-sm font-semibold">
                  Get Started
                </Link>
              </>
            )}
          </div>

          <div className="flex items-center gap-1 md:hidden">
            <button onClick={() => setMobileOpen(!mobileOpen)} className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors" aria-label="Toggle menu">
              {mobileOpen ? (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {mobileOpen && (
          <motion.div
            className="md:hidden pb-4 border-t border-white/5 mt-2 pt-4"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex flex-col gap-1">
              <a href="#features" onClick={() => setMobileOpen(false)} className="px-3 py-2.5 text-sm text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors">Features</a>
              <a href="#how-it-works" onClick={() => setMobileOpen(false)} className="px-3 py-2.5 text-sm text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors">How It Works</a>
              <a href="#pricing" onClick={() => setMobileOpen(false)} className="px-3 py-2.5 text-sm text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors">Pricing</a>
              <div className="border-t border-white/5 mt-2 pt-2 flex flex-col gap-1">
                {user ? (
                  <Link href="/dashboard" onClick={() => setMobileOpen(false)} className="gradient-btn text-white px-4 py-2.5 rounded-lg text-sm font-semibold text-center">Dashboard</Link>
                ) : (
                  <>
                    <Link href="/login" onClick={() => setMobileOpen(false)} className="px-3 py-2.5 text-sm text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors">Sign In</Link>
                    <Link href="/register" onClick={() => setMobileOpen(false)} className="gradient-btn text-white px-4 py-2.5 rounded-lg text-sm font-semibold text-center">Get Started</Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.nav>
  );
}
