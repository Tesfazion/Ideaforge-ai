"use client";
import Link from "next/link";
import { useAuth } from "@/lib/auth";
import { motion, useScroll, useTransform } from "framer-motion";
import { useTheme } from "./ThemeProvider";
import { useEffect, useState } from "react";

export default function Navbar() {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { scrollY } = useScroll();
  const backgroundColor = useTransform(scrollY, [0, 100], ["rgba(255,255,255,0.8)", "rgba(255,255,255,0.95)"]);
  const borderColor = useTransform(scrollY, [0, 100], ["rgba(229,231,235,0.5)", "rgba(229,231,235,1)"]);
  const boxShadow = useTransform(scrollY, [0, 100], ["0 0 0 rgba(0,0,0,0)", "0 4px 20px rgba(0,0,0,0.06)"]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  return (
    <motion.nav 
      className="sticky top-0 z-50 backdrop-blur-xl border-b theme-transition"
      style={{ backgroundColor, borderColor, boxShadow }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <motion.div 
              className="w-8 h-8 rounded-lg gradient-btn flex items-center justify-center"
              whileHover={{ scale: 1.1, rotate: 10 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </motion.div>
             <span className="text-xl font-bold text-heading dark:text-white">IdeaForge</span>
          </Link>
          <div className="flex items-center gap-3">
            <motion.button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              aria-label="Toggle theme"
            >
              {mounted && theme === "light" ? (
                <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              )}
            </motion.button>
            {user ? (
              <div className="flex items-center gap-3">
                {user.plan === "pro" && (
                  <span className="hidden sm:inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-400">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    Pro
                  </span>
                )}
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link href="/dashboard" className="gradient-btn text-white px-4 py-2 rounded-xl text-sm font-semibold">Dashboard</Link>
                </motion.div>
              </div>
            ) : (
              <>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link href="/login" className="text-sm font-medium text-body hover:text-heading px-3 py-2">Sign In</Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link href="/register" className="gradient-btn text-white px-4 py-2 rounded-xl text-sm font-semibold">Get Started Free</Link>
                </motion.div>
              </>
            )}
          </div>
        </div>
      </div>
    </motion.nav>
  );
}
