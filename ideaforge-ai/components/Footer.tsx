"use client";
import Link from "next/link";
import Image from "next/image";
import StayInLoop from "./StayInLoop";
import { SUNSHINE } from "@/lib/site";

const COLUMNS = [
  {
    heading: "Product",
    links: [
      { href: "/#features", label: "Features" },
      { href: "/#how-it-works", label: "How it works" },
      { href: "/#pricing", label: "Pricing" },
      { href: "/dashboard", label: "Dashboard" },
      { href: "/changelog", label: "Changelog" },
    ],
  },
  {
    heading: "Company",
    links: [
      { href: "/about", label: "About" },
      { href: "/blog", label: "Insights" },
      { href: "/careers", label: "Careers" },
      { href: "/contact", label: "Contact" },
      { href: "/status", label: "Status" },
    ],
  },
  {
    heading: "Legal",
    links: [
      { href: "/privacy-policy", label: "Privacy policy" },
      { href: "/terms-of-service", label: "Terms of service" },
      { href: "/cookie-policy", label: "Cookie policy" },
      { href: "/gdpr", label: "GDPR" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="footer-shell">
      <div className="footer-rule" aria-hidden="true" />
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-5 lg:gap-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-3" aria-label="IdeaForge home">
              <span className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-lg border border-brand bg-[#ffffff] p-1">
                <Image src="/logo.png" alt="" width={36} height={36} className="h-full w-full object-contain" />
              </span>
              <span className="flex flex-col leading-tight">
                <span className="text-base font-bold text-[#ffffff]">IdeaForge</span>
                <span className="text-[10px] font-medium uppercase tracking-[0.12em] text-[#93a1b5]">
                  Sunshine Tech Solution
                </span>
              </span>
            </Link>

            <p className="mt-4 max-w-sm text-sm leading-relaxed text-[#a7b4c6]">
              AI-powered business idea validation for founders, product teams, and innovation
              programs — built and supported by {SUNSHINE.name}.
            </p>

            <div className="mt-4 flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-1.5 rounded-md border border-[rgba(255,255,255,0.14)] px-2 py-1 text-[11px] font-medium text-[#c3cedd]">
                <svg className="h-3.5 w-3.5 text-[#7fce9f]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.6-4A11.9 11.9 0 0112 2.9 11.9 11.9 0 013.4 4 12 12 0 003 9c0 5.6 3.8 10.3 9 11.6 5.2-1.3 9-6 9-11.6 0-1 0-2-.4-3z" />
                </svg>
                SOC 2 controls
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-md border border-[rgba(255,255,255,0.14)] px-2 py-1 text-[11px] font-medium text-[#c3cedd]">
                <svg className="h-3.5 w-3.5 text-[#7fce9f]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                GDPR ready
              </span>
            </div>

            <div className="mt-6 max-w-sm">
              <StayInLoop tone="dark" />
            </div>
          </div>

          {COLUMNS.map((column) => (
            <div key={column.heading}>
              <h3 className="footer-heading">{column.heading}</h3>
              <ul className="mt-4 space-y-2.5">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="footer-link">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-[rgba(255,255,255,0.1)] pt-6 sm:flex-row sm:items-center">
          <p className="footer-muted">
            &copy; {new Date().getFullYear()} {SUNSHINE.name}. IdeaForge is a {SUNSHINE.name} product.
          </p>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <a
              href={SUNSHINE.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-xs font-medium text-[#c3cedd] transition-colors hover:text-[#ffffff]"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.7} aria-hidden="true">
                <circle cx="12" cy="12" r="9" />
                <path d="M3 12h18M12 3a15 15 0 010 18M12 3a15 15 0 000 18" />
              </svg>
              {SUNSHINE.name}
            </a>
            <Link href="/contact" className="text-xs font-medium text-[#c3cedd] transition-colors hover:text-[#ffffff]">
              Talk to sales
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
