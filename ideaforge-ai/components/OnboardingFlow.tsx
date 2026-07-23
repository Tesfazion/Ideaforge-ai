"use client";

import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/lib/auth";

const TOTAL_STEPS = 5;

const ROLES = [
  { id: "solo-founder", label: "Solo Founder", icon: "🚀", desc: "Building alone" },
  { id: "co-founder", label: "Co-founder", icon: "🤝", desc: "Building with a partner" },
  { id: "product-manager", label: "Product Manager", icon: "📋", desc: "Managing product strategy" },
  { id: "student", label: "Student", icon: "🎓", desc: "Learning & exploring" },
  { id: "investor", label: "Investor", icon: "💰", desc: "Evaluating opportunities" },
  { id: "other", label: "Other", icon: "💡", desc: "Something else entirely" },
];

const INDUSTRIES = [
  "Technology",
  "Health & Wellness",
  "Finance",
  "Education",
  "E-commerce",
  "SaaS",
  "AI/ML",
  "Sustainability",
  "Real Estate",
  "Other",
];

const FREQUENCIES = [
  { id: "1-2", label: "1-2", desc: "Just getting started" },
  { id: "3-5", label: "3-5", desc: "Building a habit" },
  { id: "6-10", label: "6-10", desc: "Validation machine" },
  { id: "10+", label: "10+", desc: "Ideas are my cardio" },
];

const slideVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? 300 : -300, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? -300 : 300, opacity: 0 }),
};

interface OnboardingFlowProps {
  open: boolean;
  onComplete: () => void;
}

export default function OnboardingFlow({ open, onComplete }: OnboardingFlowProps) {
  const { token, refreshUser } = useAuth();
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [role, setRole] = useState("");
  const [industries, setIndustries] = useState<string[]>([]);
  const [frequency, setFrequency] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  const canNext = useCallback(() => {
    if (step === 0) return true;
    if (step === 1) return role !== "";
    if (step === 2) return industries.length > 0;
    if (step === 3) return frequency !== "";
    return true;
  }, [step, role, industries, frequency]);

  const goNext = () => {
    if (step === TOTAL_STEPS - 1) return;
    setDirection(1);
    setStep((s) => s + 1);
  };

  const goBack = () => {
    if (step === 0) return;
    setDirection(-1);
    setStep((s) => s - 1);
  };

  const toggleIndustry = (ind: string) => {
    setIndustries((prev) =>
      prev.includes(ind) ? prev.filter((i) => i !== ind) : [...prev, ind]
    );
  };

  const handleComplete = async () => {
    setSubmitting(true);
    try {
      await fetch("/api/auth/onboarding", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ role, industries, ideaFrequency: frequency }),
      });
      if (token) await refreshUser();
      onComplete();
    } catch {
      onComplete();
    }
  };

  const handleDismiss = () => {
    setDismissed(true);
    onComplete();
  };

  if (!open || dismissed) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4" onClick={handleDismiss}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="relative w-full max-w-lg bg-[#0c1222] border border-white/[0.06] rounded-2xl shadow-2xl shadow-black/60 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="text-sm font-semibold text-white">IdeaForge AI</span>
          </div>
          <button
            onClick={handleDismiss}
            className="p-1.5 rounded-lg hover:bg-white/[0.06] transition-colors"
          >
            <svg className="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Progress */}
        <div className="px-5 pb-2">
          <div className="flex gap-1.5">
            {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
              <div key={i} className="flex-1 h-1 rounded-full overflow-hidden bg-white/[0.06]">
                <motion.div
                  className="h-full rounded-full"
                  initial={false}
                  animate={{
                    width: i < step ? "100%" : i === step ? "100%" : "0%",
                    backgroundColor: i <= step ? "#6366F1" : "transparent",
                  }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-1.5">
            <span className="text-[10px] text-slate-600 font-medium">Step {step + 1} of {TOTAL_STEPS}</span>
            <button
              onClick={handleDismiss}
              className="text-[10px] text-slate-600 hover:text-slate-400 font-medium transition-colors"
            >
              Skip for now
            </button>
          </div>
        </div>

        {/* Step content */}
        <div className="px-5 py-4 min-h-[340px] flex flex-col">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={step}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="flex-1 flex flex-col"
            >
              {step === 0 && <StepWelcome />}
              {step === 1 && <StepRole selected={role} onSelect={setRole} />}
              {step === 2 && <StepIndustries selected={industries} onToggle={toggleIndustry} />}
              {step === 3 && <StepFrequency selected={frequency} onSelect={setFrequency} />}
              {step === 4 && <StepQuickWin onCTA={handleComplete} submitting={submitting} />}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="px-5 pb-5 flex items-center gap-3">
          {step > 0 && step < TOTAL_STEPS - 1 && (
            <button
              onClick={goBack}
              className="px-4 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-white hover:bg-white/[0.06] transition-all"
            >
              Back
            </button>
          )}
          {step < TOTAL_STEPS - 1 && (
            <button
              onClick={goNext}
              disabled={!canNext()}
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed"
              style={{
                background: canNext()
                  ? "linear-gradient(135deg, #6366F1, #8B5CF6)"
                  : "rgba(255,255,255,0.06)",
              }}
            >
              {step === 0 ? "Let's Go" : "Continue"}
            </button>
          )}
          {step === TOTAL_STEPS - 1 && (
            <button
              onClick={handleComplete}
              disabled={submitting}
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white flex items-center justify-center gap-2 transition-all"
              style={{ background: "linear-gradient(135deg, #6366F1, #8B5CF6)" }}
            >
              {submitting ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Try Your First Idea</span>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </>
              )}
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
}

/* ─── Step Components ───────────────────────────────────────────── */

function StepWelcome() {
  return (
    <div className="flex flex-col items-center justify-center text-center py-4 flex-1">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.15 }}
        className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mb-6 shadow-lg shadow-indigo-500/25"
      >
        <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" />
        </svg>
      </motion.div>
      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="text-xl font-bold text-white mb-2"
      >
        Welcome to IdeaForge AI
      </motion.h2>
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="text-sm text-slate-400 max-w-xs leading-relaxed"
      >
        Validate your business ideas with AI-powered analysis in under 60 seconds. Let&apos;s personalize your experience.
      </motion.p>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="flex items-center gap-6 mt-8 text-[11px] text-slate-500"
      >
        <span className="flex items-center gap-1.5">
          <svg className="w-3.5 h-3.5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          AI-powered
        </span>
        <span className="flex items-center gap-1.5">
          <svg className="w-3.5 h-3.5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          60s results
        </span>
        <span className="flex items-center gap-1.5">
          <svg className="w-3.5 h-3.5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          Secure
        </span>
      </motion.div>
    </div>
  );
}

function StepRole({ selected, onSelect }: { selected: string; onSelect: (v: string) => void }) {
  return (
    <div className="flex flex-col flex-1">
      <h3 className="text-base font-bold text-white mb-1">What&apos;s your role?</h3>
      <p className="text-xs text-slate-500 mb-4">We&apos;ll tailor insights to your perspective.</p>
      <div className="grid grid-cols-2 gap-2.5 flex-1">
        {ROLES.map((r) => (
          <button
            key={r.id}
            onClick={() => onSelect(r.id)}
            className={`flex flex-col items-center gap-1.5 p-3.5 rounded-xl border text-center transition-all ${
              selected === r.id
                ? "bg-indigo-500/[0.12] border-indigo-500/40 shadow-lg shadow-indigo-500/10"
                : "bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.05] hover:border-white/[0.1]"
            }`}
          >
            <span className="text-2xl">{r.icon}</span>
            <span className="text-xs font-semibold text-white">{r.label}</span>
            <span className="text-[10px] text-slate-500 leading-tight">{r.desc}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function StepIndustries({ selected, onToggle }: { selected: string[]; onToggle: (v: string) => void }) {
  return (
    <div className="flex flex-col flex-1">
      <h3 className="text-base font-bold text-white mb-1">What industries interest you?</h3>
      <p className="text-xs text-slate-500 mb-4">Select one or more — this helps us surface relevant ideas.</p>
      <div className="flex flex-wrap gap-2 flex-1 content-start">
        {INDUSTRIES.map((ind) => {
          const active = selected.includes(ind);
          return (
            <button
              key={ind}
              onClick={() => onToggle(ind)}
              className={`px-4 py-2.5 rounded-xl text-xs font-medium border transition-all ${
                active
                  ? "bg-emerald-500/[0.12] border-emerald-500/40 text-emerald-400 shadow-lg shadow-emerald-500/10"
                  : "bg-white/[0.02] border-white/[0.06] text-slate-400 hover:bg-white/[0.05] hover:border-white/[0.1] hover:text-slate-200"
              }`}
            >
              {active && (
                <span className="mr-1.5">
                  <svg className="w-3 h-3 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </span>
              )}
              {ind}
            </button>
          );
        })}
      </div>
      {selected.length > 0 && (
        <p className="text-[10px] text-slate-600 mt-3">{selected.length} selected</p>
      )}
    </div>
  );
}

function StepFrequency({ selected, onSelect }: { selected: string; onSelect: (v: string) => void }) {
  return (
    <div className="flex flex-col flex-1">
      <h3 className="text-base font-bold text-white mb-1">How many ideas do you validate per month?</h3>
      <p className="text-xs text-slate-500 mb-4">This helps us set the right expectations.</p>
      <div className="grid grid-cols-2 gap-2.5 flex-1 content-start">
        {FREQUENCIES.map((f) => (
          <button
            key={f.id}
            onClick={() => onSelect(f.id)}
            className={`flex flex-col items-center gap-1 p-5 rounded-xl border text-center transition-all ${
              selected === f.id
                ? "bg-purple-500/[0.12] border-purple-500/40 shadow-lg shadow-purple-500/10"
                : "bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.05] hover:border-white/[0.1]"
            }`}
          >
            <span className={`text-2xl font-bold ${selected === f.id ? "text-purple-400" : "text-white"}`}>
              {f.label}
            </span>
            <span className="text-[10px] text-slate-500 leading-tight">{f.desc}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function StepQuickWin({ onCTA, submitting }: { onCTA: () => void; submitting: boolean }) {
  return (
    <div className="flex flex-col flex-1">
      <h3 className="text-base font-bold text-white mb-1">See IdeaForge in action</h3>
      <p className="text-xs text-slate-500 mb-4">Here&apos;s a preview of what a validated idea looks like.</p>
      <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-4 flex-1">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-500/15 text-emerald-400">87/100</span>
          <span className="text-[10px] text-slate-500">Viability Score</span>
        </div>
        <h4 className="text-sm font-bold text-white mb-1">AI-Powered Personal Finance Coach</h4>
        <p className="text-[11px] text-slate-400 leading-relaxed mb-3">
          A mobile-first financial coaching app that uses AI to give personalized budgeting advice, spending alerts, and savings goals — targeted at millennials who feel overwhelmed by traditional finance tools.
        </p>
        <div className="grid grid-cols-3 gap-2 mb-3">
          <div className="bg-white/[0.03] rounded-lg p-2 text-center">
            <div className="text-[10px] text-slate-500 mb-0.5">Market</div>
            <div className="text-xs font-bold text-indigo-400">82</div>
          </div>
          <div className="bg-white/[0.03] rounded-lg p-2 text-center">
            <div className="text-[10px] text-slate-500 mb-0.5">Risk</div>
            <div className="text-xs font-bold text-amber-400">Low</div>
          </div>
          <div className="bg-white/[0.03] rounded-lg p-2 text-center">
            <div className="text-[10px] text-slate-500 mb-0.5">Fit</div>
            <div className="text-xs font-bold text-emerald-400">High</div>
          </div>
        </div>
        <div className="flex items-center gap-2 text-[10px] text-slate-500">
          <svg className="w-3 h-3 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          Ready to validate your own idea?
        </div>
      </div>
      <button
        onClick={onCTA}
        disabled={submitting}
        className="mt-4 w-full py-3 rounded-xl text-sm font-semibold text-white flex items-center justify-center gap-2 transition-all"
        style={{ background: "linear-gradient(135deg, #6366F1, #8B5CF6)" }}
      >
        {submitting ? (
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
        ) : (
          <>
            <span>Try Your First Idea</span>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </>
        )}
      </button>
    </div>
  );
}
