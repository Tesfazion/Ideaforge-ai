"use client";
import Link from "next/link";
import Image from "next/image";
import { ReactNode } from "react";
import { SUNSHINE } from "@/lib/site";

const VALUE_POINTS = [
  "9-dimension validation in about 30 seconds",
  "Market, competitor, and risk research in one report",
  "A 7-day action plan generated for every idea",
];

export default function AuthShell({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-page">
      <div className="grid min-h-screen lg:grid-cols-[1fr_1.05fr]">
        {/* Brand panel */}
        <aside className="relative hidden flex-col justify-between overflow-hidden p-10 lg:flex cta-surface">
          <div className="absolute inset-x-0 top-0 h-1 bg-[linear-gradient(90deg,#ef842b_0%,#ef842b_52%,#007acc_100%)]" aria-hidden="true" />

          <Link href="/" className="relative flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-lg bg-[#ffffff] p-1">
              <Image src="/logo.png" alt="" width={36} height={36} className="h-full w-full object-contain" />
            </span>
            <span className="flex flex-col leading-tight">
              <span className="text-base font-bold text-[#ffffff]">IdeaForge</span>
              <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#93a1b5]">
                Sunshine Tech Solution
              </span>
            </span>
          </Link>

          <div className="relative max-w-md">
            <h2 className="text-2xl font-bold leading-snug text-[#ffffff]">
              Decide what to build with evidence, not instinct.
            </h2>
            <ul className="mt-7 space-y-3.5">
              {VALUE_POINTS.map((point) => (
                <li key={point} className="flex items-start gap-3 text-sm leading-relaxed text-[#b7c4d4]">
                  <svg className="mt-0.5 h-4 w-4 shrink-0 text-[#ef842b]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  {point}
                </li>
              ))}
            </ul>
          </div>

          <p className="relative text-xs text-[#93a1b5]">
            © {new Date().getFullYear()} {SUNSHINE.name}. All rights reserved.
          </p>
        </aside>

        {/* Form panel */}
        <main className="flex flex-col px-4 py-8 sm:px-8">
          <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center">
            <Link
              href="/"
              className="inline-flex w-fit items-center gap-2 text-sm font-medium text-muted transition-colors hover:text-ink"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
              Back to home
            </Link>

            <div className="mt-8">
              <Link href="/" className="mb-6 inline-flex items-center gap-2.5 lg:hidden">
                <span className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-lg border border-brand-line bg-surface p-1">
                  <Image src="/logo.png" alt="" width={32} height={32} className="h-full w-full object-contain" />
                </span>
                <span className="text-xl font-bold text-ink">IdeaForge</span>
              </Link>

              <h1 className="text-2xl font-bold tracking-tight text-ink sm:text-[1.75rem]">{title}</h1>
              <p className="mt-1.5 text-sm text-copy">{subtitle}</p>
            </div>

            <div className="mt-8">{children}</div>

            {footer && <div className="mt-6">{footer}</div>}
          </div>
        </main>
      </div>
    </div>
  );
}
