"use client";
import { useState } from "react";
import { useAuth } from "@/lib/auth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      router.push("/dashboard");
    } catch (err: unknown) {
      const error = err as { error?: string };
      setError(error.error || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#0B1120] px-4 transition-colors">
      <div className="w-full max-w-md">
        <motion.div className="mb-8" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors group">
            <svg className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Back to home
          </Link>
        </motion.div>
        <motion.div className="text-center mb-8" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
          <Link href="/" className="inline-flex items-center gap-2.5 mb-6">
            <motion.div className="w-10 h-10 rounded-xl gradient-btn flex items-center justify-center shadow-lg" whileHover={{ scale: 1.1, rotate: 10 }} transition={{ type: "spring", stiffness: 400 }}>
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </motion.div>
            <span className="text-2xl font-bold text-gray-900 dark:text-white">IdeaForge<span className="gradient-text"> AI</span></span>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Welcome back</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Sign in to your account</p>
        </motion.div>
        <motion.div className="card-base rounded-2xl p-8 shadow-sm dark:shadow-none" initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
          {error && (
            <motion.div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-700 dark:text-red-400 text-sm px-4 py-3 rounded-xl mb-6" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}>
              {error}
            </motion.div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
              <label className="block text-sm font-medium text-gray-900 dark:text-gray-200 mb-1.5">Email</label>
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors placeholder:text-gray-400" placeholder="you@example.com" />
            </motion.div>
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="relative">
              <label className="block text-sm font-medium text-gray-900 dark:text-gray-200 mb-1.5">Password</label>
              <input type={showPassword ? "text" : "password"} required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors placeholder:text-gray-400 pr-10" placeholder="Your password" />
              <button type="button" onClick={() => setShowPassword((v) => !v)} className="absolute right-3 top-8 p-1 rounded-md text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors" aria-label={showPassword ? "Hide password" : "Show password"}>
                {showPassword ? (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.292-4.292M3.042 20.063A9.965 9.965 0 0112 19c4.478 0 8.268-2.943 9.543-7a9.97 9.97 0 01-1.563-3.029M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A9.969 9.969 0 0112 4.5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                )}
              </button>
            </motion.div>
            <motion.button type="submit" disabled={loading} className="w-full gradient-btn text-white font-semibold py-2.5 rounded-xl text-sm disabled:opacity-50" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
              {loading ? "Signing in..." : "Sign In"}
            </motion.button>
          </form>
          <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
            Don&apos;t have an account? <Link href="/register" className="text-indigo-600 dark:text-indigo-400 font-medium hover:underline">Sign up</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
