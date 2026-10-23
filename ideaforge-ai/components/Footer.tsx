"use client";
import Link from "next/link";
import Image from "next/image";
import StayInLoop from "./StayInLoop";
import { SUNSHINE_LINKS } from "@/lib/site";

const SOCIAL_ICONS: Record<string, string> = {
  globe: "M12 21a9 9 0 100-18 9 9 0 000 18zm0-18c2.5 2.4 4 5.5 4 9s-1.5 6.6-4 9m0-18c-2.5 2.4-4 5.5-4 9s1.5 6.6 4 9M3.6 9h16.8M3.6 15h16.8",
  spark: "M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9L12 3z",
  github: "M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z",
};

export default function Footer() {
  return (
    <footer className="border-t border-white/5 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-lg overflow-hidden">
                <Image src="/logo.png" alt="IdeaForge" width={40} height={40} className="w-full h-full object-contain" />
              </div>
              <span className="text-base font-bold text-slate-900">IdeaForge</span>
            </Link>
            <p className="text-sm text-slate-500 leading-relaxed max-w-xs">AI-powered business idea validation for entrepreneurs and innovators.</p>
            <p className="mt-3 text-xs text-slate-500">
              Made by{" "}
              <a href="https://sunshinetechsolution.vercel.app/" target="_blank" rel="noreferrer" className="font-medium text-sky-400 hover:text-sky-300">
                Sunshine Tech Solution
              </a>
            </p>
            <div className="flex items-center gap-2 mt-4">
              <div className="flex items-center gap-1 text-xs text-slate-600">
                <svg className="w-3.5 h-3.5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                SOC 2
              </div>
              <div className="w-px h-3 bg-white/10" />
              <div className="flex items-center gap-1 text-xs text-slate-600">
                <svg className="w-3.5 h-3.5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                GDPR
              </div>
            </div>

            <StayInLoop />
          </div>
          <div>
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">Product</h4>
            <ul className="space-y-3 text-sm">
              <li><Link href="/#features" className="text-slate-400 hover:text-slate-900 transition-colors block">Features<span className="block text-slate-600 text-xs mt-0.5">9-dimension AI validation</span></Link></li>
              <li><Link href="/#pricing" className="text-slate-400 hover:text-slate-900 transition-colors block">Pricing<span className="block text-slate-600 text-xs mt-0.5">Free, Pro and Enterprise</span></Link></li>
              <li><Link href="/#how-it-works" className="text-slate-400 hover:text-slate-900 transition-colors block">How It Works<span className="block text-slate-600 text-xs mt-0.5">Validate any idea in seconds</span></Link></li>
              <li><Link href="/dashboard" className="text-slate-400 hover:text-slate-900 transition-colors block">Dashboard<span className="block text-slate-600 text-xs mt-0.5">Manage your validations</span></Link></li>
              <li><Link href="/changelog" className="text-slate-400 hover:text-slate-900 transition-colors block">Changelog<span className="block text-slate-600 text-xs mt-0.5">Latest releases</span></Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">Company</h4>
            <ul className="space-y-3 text-sm">
              <li><Link href="/about" className="text-slate-400 hover:text-slate-900 transition-colors block">About<span className="block text-slate-600 text-xs mt-0.5">Our mission and story</span></Link></li>
              <li><Link href="/blog" className="text-slate-400 hover:text-slate-900 transition-colors block">Blog<span className="block text-slate-600 text-xs mt-0.5">Startup insights</span></Link></li>
              <li><Link href="/careers" className="text-slate-400 hover:text-slate-900 transition-colors block">Careers<span className="block text-slate-600 text-xs mt-0.5">Join the team</span></Link></li>
              <li><Link href="/contact" className="text-slate-400 hover:text-slate-900 transition-colors block">Contact<span className="block text-slate-600 text-xs mt-0.5">Get in touch</span></Link></li>
              <li><Link href="/status" className="text-slate-400 hover:text-slate-900 transition-colors block">Status<span className="block text-slate-600 text-xs mt-0.5">System uptime</span></Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">Legal</h4>
            <ul className="space-y-3 text-sm">
              <li><Link href="/privacy-policy" className="text-slate-400 hover:text-slate-900 transition-colors block">Privacy Policy<span className="block text-slate-600 text-xs mt-0.5">How we handle data</span></Link></li>
              <li><Link href="/terms-of-service" className="text-slate-400 hover:text-slate-900 transition-colors block">Terms of Service<span className="block text-slate-600 text-xs mt-0.5">Usage terms</span></Link></li>
              <li><Link href="/cookie-policy" className="text-slate-400 hover:text-slate-900 transition-colors block">Cookie Policy<span className="block text-slate-600 text-xs mt-0.5">Tracking and cookies</span></Link></li>
              <li><Link href="/gdpr" className="text-slate-400 hover:text-slate-900 transition-colors block">GDPR<span className="block text-slate-600 text-xs mt-0.5">EU data rights</span></Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/5 mt-8 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-600">&copy; {new Date().getFullYear()} IdeaForge. All rights reserved.</p>
          <div className="flex items-center gap-4">
            {SUNSHINE_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-600 hover:text-slate-900 transition-colors"
                aria-label={link.label}
                title={link.label}
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round">
                  <path d={SOCIAL_ICONS[link.icon]} />
                </svg>
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
