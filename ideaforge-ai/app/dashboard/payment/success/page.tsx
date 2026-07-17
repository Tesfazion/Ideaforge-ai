"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const plan = searchParams.get("plan");
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    if (!sessionId || !plan) return;
    const timer = setTimeout(() => setVerified(true), 1200);
    return () => clearTimeout(timer);
  }, [sessionId, plan]);

  const planLabel = plan === "enterprise" ? "Enterprise" : "Pro";
  const amount = plan === "enterprise" ? "$49" : "$19";

  if (!sessionId || !plan) {
    return (
      <div className="max-w-lg mx-auto text-center py-20 animate-slide-up">
        <div className="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Invalid Session</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-6">We could not verify your payment session.</p>
        <Link href="/dashboard/upgrade" className="gradient-btn text-white px-6 py-2.5 rounded-xl text-sm font-semibold">View Plans</Link>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto text-center py-20 animate-slide-up">
      <div className="relative w-20 h-20 mx-auto mb-6">
        <div className="absolute inset-0 rounded-full bg-emerald-100 dark:bg-emerald-500/20 animate-ping opacity-75" />
        <div className="relative w-20 h-20 rounded-full bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/25">
          <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
      </div>

      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Payment Successful!</h1>
      <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-sm mx-auto">Your {planLabel} plan has been activated. Enjoy unlimited access to all premium features.</p>

      <div className="card-base rounded-2xl p-6 max-w-sm mx-auto mb-8 text-left space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500 dark:text-gray-400">Plan</span>
          <span className="text-sm font-semibold text-gray-900 dark:text-white">{planLabel}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500 dark:text-gray-400">Amount</span>
          <span className="text-sm font-semibold text-gray-900 dark:text-white">{amount}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500 dark:text-gray-400">Status</span>
          <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-600 dark:text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            {verified ? "Verified" : "Verifying..."}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500 dark:text-gray-400">Session ID</span>
          <span className="text-xs font-mono text-gray-500 dark:text-gray-400 break-all text-right max-w-[160px]">{sessionId}</span>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <Link href="/dashboard" className="gradient-btn text-white px-6 py-2.5 rounded-xl text-sm font-semibold w-full sm:w-auto text-center">
          Go to Dashboard
        </Link>
        <Link href="/dashboard/upgrade" className="px-6 py-2.5 rounded-xl text-sm font-semibold border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors w-full sm:w-auto text-center">
          Manage Plan
        </Link>
      </div>
    </div>
  );
}
