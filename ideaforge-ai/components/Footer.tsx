"use client";
import Link from "next/link";
import Image from "next/image";
import StayInLoop from "./StayInLoop";
import { SUNSHINE } from "@/lib/site";

export default function Footer() {
  return (
    <footer className="border-t border-white/5 bg-[#060a13]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-lg overflow-hidden">
                <Image src="/logo.png" alt="IdeaForge" width={40} height={40} className="w-full h-full object-contain" />
              </div>
              <span className="text-base font-bold text-white">IdeaForge</span>
            </Link>
            <p className="text-sm text-slate-500 leading-relaxed max-w-xs">AI-powered business idea validation for entrepreneurs and innovators.</p>
            <p className="mt-3 text-xs text-slate-500">
              A product by{" "}
              <a href={SUNSHINE.url} target="_blank" rel="noopener noreferrer" className="font-medium text-sky-400 hover:text-sky-300">
                {SUNSHINE.name}
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
              <li><Link href="/#features" className="text-slate-400 hover:text-white transition-colors block">Features<span className="block text-slate-600 text-xs mt-0.5">9-dimension AI validation</span></Link></li>
              <li><Link href="/#pricing" className="text-slate-400 hover:text-white transition-colors block">Pricing<span className="block text-slate-600 text-xs mt-0.5">Free, Pro and Enterprise</span></Link></li>
              <li><Link href="/#how-it-works" className="text-slate-400 hover:text-white transition-colors block">How It Works<span className="block text-slate-600 text-xs mt-0.5">Validate any idea in seconds</span></Link></li>
              <li><Link href="/dashboard" className="text-slate-400 hover:text-white transition-colors block">Dashboard<span className="block text-slate-600 text-xs mt-0.5">Manage your validations</span></Link></li>
              <li><Link href="/changelog" className="text-slate-400 hover:text-white transition-colors block">Changelog<span className="block text-slate-600 text-xs mt-0.5">Latest releases</span></Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">Company</h4>
            <ul className="space-y-3 text-sm">
              <li><Link href="/about" className="text-slate-400 hover:text-white transition-colors block">About<span className="block text-slate-600 text-xs mt-0.5">Our mission and story</span></Link></li>
              <li><Link href="/blog" className="text-slate-400 hover:text-white transition-colors block">Blog<span className="block text-slate-600 text-xs mt-0.5">Startup insights</span></Link></li>
              <li><Link href="/careers" className="text-slate-400 hover:text-white transition-colors block">Careers<span className="block text-slate-600 text-xs mt-0.5">Join the team</span></Link></li>
              <li><Link href="/contact" className="text-slate-400 hover:text-white transition-colors block">Contact<span className="block text-slate-600 text-xs mt-0.5">Get in touch</span></Link></li>
              <li><Link href="/status" className="text-slate-400 hover:text-white transition-colors block">Status<span className="block text-slate-600 text-xs mt-0.5">System uptime</span></Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">Legal</h4>
            <ul className="space-y-3 text-sm">
              <li><Link href="/privacy-policy" className="text-slate-400 hover:text-white transition-colors block">Privacy Policy<span className="block text-slate-600 text-xs mt-0.5">How we handle data</span></Link></li>
              <li><Link href="/terms-of-service" className="text-slate-400 hover:text-white transition-colors block">Terms of Service<span className="block text-slate-600 text-xs mt-0.5">Usage terms</span></Link></li>
              <li><Link href="/cookie-policy" className="text-slate-400 hover:text-white transition-colors block">Cookie Policy<span className="block text-slate-600 text-xs mt-0.5">Tracking and cookies</span></Link></li>
              <li><Link href="/gdpr" className="text-slate-400 hover:text-white transition-colors block">GDPR<span className="block text-slate-600 text-xs mt-0.5">EU data rights</span></Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/5 mt-8 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-600">&copy; {new Date().getFullYear()} {SUNSHINE.name}. IdeaForge is a product of {SUNSHINE.name}.</p>
          <a href={SUNSHINE.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-xs text-slate-500 hover:text-sky-300 transition-colors">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3a15 15 0 010 18M12 3a15 15 0 000 18" /></svg>
            {SUNSHINE.name}
          </a>
        </div>
      </div>
    </footer>
  );
}