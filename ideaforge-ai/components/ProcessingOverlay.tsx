"use client";
import { useMemo } from "react";

interface Step {
  step: string;
  label: string;
  progress: number;
}

const STEP_ICONS: Record<string, string> = {
  init: "M13 10V3L4 14h7v7l9-11h-7z",
  market: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
  competitors: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z",
  monetization: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
  risks: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z",
  scoring: "M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z",
  report: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
  done: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
  fallback: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z",
  brainstorm: "M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z",
  analyzing: "M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z",
  polishing: "M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z",
};

export default function ProcessingOverlay({
  steps,
  title,
  subtitle,
}: {
  steps: Step[];
  title: string;
  subtitle?: string;
}) {
  const currentStep = steps[steps.length - 1];
  const progress = currentStep?.progress || 0;

  const completedSteps = useMemo(() => {
    if (currentStep && currentStep.step !== "done") {
      return steps.slice(0, -1).map((s) => s.step);
    }
    return steps.filter((s) => s.step === "done").map((s) => s.step);
  }, [steps, currentStep]);

  return (
    <div className="max-w-xl mx-auto text-center py-12">
      <div className="mb-8">
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center mx-auto mb-5 shadow-xl shadow-indigo-500/25 relative">
          <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          <div className="absolute inset-0 rounded-3xl animate-ping opacity-20 bg-gradient-to-br from-indigo-500 to-violet-500" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{title}</h2>
        {subtitle && <p className="text-gray-500 dark:text-gray-400 text-sm">{subtitle}</p>}
      </div>

      <div className="glass-card rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm mb-6">
        <div className="relative mb-4">
          <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between mt-2">
            <span className="text-xs font-medium text-indigo-600 dark:text-indigo-400">{progress}%</span>
            <span className="text-xs text-gray-400">Analyzing...</span>
          </div>
        </div>

        <div className="space-y-2 text-left">
          {steps.map((s, i) => {
            const isDone = s.step === "done";
            const isFallback = s.step === "fallback";
            const isActive = i === steps.length - 1 && !isDone;
            const wasCompleted = completedSteps.includes(s.step) || i < steps.length - 1;
            const icon = STEP_ICONS[s.step] || STEP_ICONS.init;

            return (
              <div key={`${s.step}-${i}`} className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-300 ${
                isActive ? "bg-indigo-50 dark:bg-indigo-500/10" : wasCompleted ? "opacity-60" : ""
              }`}>
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                  isDone ? "bg-emerald-100 dark:bg-emerald-500/15" :
                  isFallback ? "bg-amber-100 dark:bg-amber-500/15" :
                  isActive ? "bg-indigo-100 dark:bg-indigo-500/15" :
                  "bg-gray-100 dark:bg-gray-800"
                }`}>
                  {isDone ? (
                    <svg className="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  ) : isFallback ? (
                    <svg className="w-4 h-4 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01" />
                    </svg>
                  ) : (
                    <svg className={`w-4 h-4 ${isActive ? "text-indigo-500 animate-pulse" : "text-gray-400"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d={icon} />
                    </svg>
                  )}
                </div>
                <span className={`text-sm font-medium ${
                  isDone ? "text-emerald-600 dark:text-emerald-400" :
                  isActive ? "text-indigo-600 dark:text-indigo-400" :
                  isFallback ? "text-amber-600 dark:text-amber-400" :
                  "text-gray-600 dark:text-gray-400"
                }`}>{s.label}</span>
                {isActive && (
                  <div className="ml-auto flex gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <p className="text-xs text-gray-400 dark:text-gray-500">
        Powered by AI - Usually takes 10-30 seconds
      </p>
    </div>
  );
}
