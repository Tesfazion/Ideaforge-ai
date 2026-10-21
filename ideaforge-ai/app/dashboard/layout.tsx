"use client";
import { useState, useEffect, ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import OnboardingFlow from "@/components/OnboardingFlow";

const NAV_ITEMS = [
  { href: "/dashboard", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4", label: "Dashboard", badge: null },
  { href: "/dashboard/generate", icon: "M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z", label: "AI Generator", badge: "AI" },
  { href: "/dashboard/new", icon: "M12 4v16m8-8H4", label: "Validate Idea", badge: null },
  { href: "/dashboard/compare", icon: "M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2z", label: "Compare", badge: null },
  { href: "/dashboard/insights", icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2 2z", label: "Insights", badge: null },
  { href: "/dashboard/api-keys", icon: "M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z", label: "API Keys", badge: "ENT" },
  { href: "/dashboard/settings", icon: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z", label: "AI Settings", badge: null },
  { href: "/dashboard/upgrade", icon: "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6", label: "Pricing", badge: "PRO" },
];

const BOTTOM_LINKS = [
  { href: "https://docs.ideaforge.ai", icon: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253", label: "Docs" },
  { href: "/dashboard/payment/success", icon: "M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z", label: "Help" },
];

function Sidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const pathname = usePathname();
  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-md z-40 lg:hidden"
            onClick={onClose}
          />
        )}
      </AnimatePresence>
      <aside className={`sidebar-base fixed top-0 left-0 z-50 h-full w-[260px] border-r border-white/[0.04] transform transition-all duration-300 ease-out lg:translate-x-0 ${open ? "translate-x-0 shadow-2xl shadow-black/50" : "-translate-x-full"} lg:static lg:z-auto flex flex-col`}>
        <div className="flex items-center gap-3 px-5 h-16 border-b border-white/[0.04] shrink-0">
          <Link href="/dashboard" className="flex items-center gap-3" onClick={onClose}>
            <div className="w-9 h-9 rounded-xl overflow-hidden ring-1 ring-white/10">
              <Image src="/logo.png" alt="IdeaForge" width={36} height={36} className="w-full h-full object-contain" />
            </div>
            <div>
              <span className="text-[15px] font-bold text-white tracking-tight">IdeaForge</span>
              <p className="text-[9px] text-slate-500 font-medium uppercase tracking-widest -mt-0.5">Business Intel</p>
            </div>
          </Link>
          <button onClick={onClose} className="lg:hidden ml-auto p-1.5 rounded-lg hover:bg-white/5 transition-colors">
            <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-3 px-3 space-y-0.5">
          {NAV_ITEMS.map((link) => {
            const active = link.href === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(link.href);
            return (
              <Link key={link.href} href={link.href} onClick={onClose}
                className={`group flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-200 relative ${
                  active
                    ? "bg-white/[0.08] text-white"
                    : "text-slate-400 hover:bg-white/[0.04] hover:text-slate-200"
                }`}>
                {active && (
                  <motion.div layoutId="sidebar-active" className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full bg-gradient-to-b from-indigo-400 to-purple-500" transition={{ type: "spring", stiffness: 300, damping: 30 }} />
                )}
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-all duration-200 ${
                  active ? "bg-indigo-500/20 text-indigo-400" : "text-slate-500 group-hover:text-slate-400"
                }`}>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d={link.icon} />
                  </svg>
                </div>
                <span className="truncate">{link.label}</span>
                {link.badge && (
                  <span className={`ml-auto text-[9px] font-bold px-1.5 py-0.5 rounded-md uppercase tracking-wider ${
                    "bg-indigo-500/15 text-indigo-300"
                  }`}>{link.badge}</span>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="px-3 pb-3 space-y-2">
          {BOTTOM_LINKS.map((link) => (
            <a key={link.href} href={link.href} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-3 px-3 py-2 rounded-xl text-[13px] font-medium text-slate-500 hover:text-slate-300 hover:bg-white/[0.03] transition-all">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-600">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d={link.icon} />
                </svg>
              </div>
              {link.label}
            </a>
          ))}
        </div>

        <div className="px-3 pb-4">
          <div className="rounded-xl bg-indigo-500/[0.06] border border-indigo-500/[0.12] p-3.5">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-6 h-6 rounded-md bg-indigo-500/20 flex items-center justify-center">
                <svg className="w-3.5 h-3.5 text-indigo-300" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" /></svg>
              </div>
              <div>
                <p className="text-xs font-semibold text-white">Go Pro</p>
                <p className="text-[10px] text-slate-400">Unlimited validations</p>
              </div>
            </div>
            <Link href="/dashboard/upgrade" onClick={onClose}
              className="block w-full text-center text-[11px] font-semibold py-2 rounded-lg bg-indigo-500/20 text-indigo-400 hover:bg-indigo-500/30 transition-colors">
              Upgrade Now
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
}

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { user, token, loading, logout, refreshUser } = useAuth();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [cmdOpen, setCmdOpen] = useState(false);
  const [notifications, setNotifications] = useState<{ id: string; title: string; score: number | null; status: string; createdAt: string }[]>([]);
  const showOnboarding = !loading && !!user && user.onboardingComplete === false;
  const { scrollY } = useScroll();
  const headerBg = useTransform(scrollY, [0, 100], ["rgba(6,10,19,0.5)", "rgba(6,10,19,0.92)"]);

  useEffect(() => {
    if (!loading && !user) router.push("/login");
  }, [user, loading, router]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setCmdOpen((v) => !v);
      }
      if (e.key === "Escape") {
        setCmdOpen(false);
        setNotifOpen(false);
        setProfileOpen(false);
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  useEffect(() => {
    if (!user || !token) return;
    import("@/lib/api").then(({ api }) => {
      api.getIdeas(token).then((data) => {
        const recent = data.ideas.slice(0, 5).map((idea) => ({
          id: idea.id, title: idea.title, score: idea.report?.viabilityScore ?? null,
          status: idea.status, createdAt: idea.createdAt,
        }));
        setNotifications(recent);
      }).catch(() => {});
    });
  }, [user, token]);

  useEffect(() => {
    const handler = () => { setNotifOpen(false); setProfileOpen(false); };
    if (notifOpen || profileOpen) {
      document.addEventListener("click", handler);
      return () => document.removeEventListener("click", handler);
    }
  }, [notifOpen, profileOpen]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#060a13]">
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <div className="w-12 h-12 border-[3px] border-indigo-500/20 rounded-full" />
          <div className="absolute inset-0 w-12 h-12 border-[3px] border-indigo-500 border-t-transparent rounded-full animate-spin" />
        </div>
        <p className="text-sm text-slate-500 font-medium">Loading your workspace...</p>
      </div>
    </div>
  );
  if (!user) return null;

  return (
    <div className="min-h-screen flex bg-[#060a13] transition-colors duration-300 relative">
      <div className="fixed inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-indigo-600/[0.07] rounded-full blur-[150px]" />
        <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] bg-indigo-600/[0.04] rounded-full blur-[130px]" />
      </div>

      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0 relative">
        <motion.header style={{ backgroundColor: headerBg }} className="header-base sticky top-0 z-30 border-b border-white/[0.04]">
          <div className="flex items-center justify-between px-4 sm:px-6 h-14">
            <div className="flex items-center gap-3">
              <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 -ml-2 rounded-lg hover:bg-white/5 transition-colors">
                <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <button onClick={() => setCmdOpen(true)}
                className="hidden sm:flex items-center gap-3 px-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.06] text-sm text-slate-500 hover:text-slate-300 hover:bg-white/[0.06] transition-all w-[280px] lg:w-[320px]">
                <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <span className="flex-1 text-left">Search ideas...</span>
                <div className="flex items-center gap-0.5">
                  <kbd className="px-1.5 py-0.5 rounded bg-white/[0.06] text-[10px] font-mono border border-white/[0.08]">⌘</kbd>
                  <kbd className="px-1.5 py-0.5 rounded bg-white/[0.06] text-[10px] font-mono border border-white/[0.08]">K</kbd>
                </div>
              </button>
            </div>

            <div className="flex items-center gap-1">
              <div className="relative">
                <button onClick={(e) => { e.stopPropagation(); setNotifOpen(!notifOpen); setProfileOpen(false); }}
                  className="p-2.5 rounded-xl hover:bg-white/[0.05] transition-colors relative">
                  <svg className="w-[18px] h-[18px] text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                  <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full ring-2 ring-[#060a13]" />
                </button>
                <AnimatePresence>
                  {notifOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.96 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-80 rounded-2xl bg-[#0c1222]/98 backdrop-blur-2xl border border-white/[0.06] shadow-2xl shadow-black/60 p-4"
                      onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-between mb-3">
                        <p className="text-sm font-semibold text-white">Recent Activity</p>
                        <span className="text-[10px] text-slate-500 font-medium">{notifications.length} items</span>
                      </div>
                      <div className="space-y-1.5 max-h-64 overflow-y-auto scrollbar-thin">
                        {notifications.length === 0 ? (
                          <p className="text-xs text-slate-500 text-center py-4">No activity yet</p>
                        ) : (
                          notifications.map((notif) => (
                            <a key={notif.id} href={`/dashboard/idea/${notif.id}`}
                              className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-white/[0.04] transition-colors group" onClick={() => setNotifOpen(false)}>
                              <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                                notif.status === "validated" ? "bg-emerald-500/15" : notif.status === "failed" ? "bg-red-500/15" : "bg-amber-500/15"
                              }`}>
                                {notif.status === "validated" ? (
                                  <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                                ) : notif.status === "failed" ? (
                                  <svg className="w-4 h-4 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                                ) : (
                                  <svg className="w-4 h-4 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                )}
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="text-xs font-medium text-white truncate group-hover:text-indigo-400 transition-colors">{notif.title}</p>
                                <p className="text-[10px] text-slate-500">
                                  {notif.status === "validated" ? `Scored ${notif.score}%` : notif.status === "failed" ? "Failed" : "Processing..."}
                                </p>
                              </div>
                            </a>
                          ))
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="w-px h-6 bg-white/[0.06] mx-1 hidden sm:block" />

              <div className="relative">
                <button onClick={(e) => { e.stopPropagation(); setProfileOpen(!profileOpen); setNotifOpen(false); }}
                  className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-xl hover:bg-white/[0.04] transition-colors">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold shadow-lg shadow-indigo-500/20">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="hidden sm:block text-left">
                    <p className="text-[13px] font-semibold text-white leading-tight">{user.name}</p>
                    <p className="text-[10px] text-slate-500 font-medium">{user.plan === "pro" ? "Pro Plan" : user.plan === "enterprise" ? "Enterprise Plan" : "Free Plan"}</p>
                  </div>
                  <svg className="w-3.5 h-3.5 text-slate-500 hidden sm:block" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <AnimatePresence>
                  {profileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.96 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-64 rounded-2xl bg-[#0c1222]/98 backdrop-blur-2xl border border-white/[0.06] shadow-2xl shadow-black/60 p-2"
                      onClick={(e) => e.stopPropagation()}>
                      <div className="px-3 py-3 border-b border-white/[0.06] mb-1">
                        <p className="text-sm font-semibold text-white">{user.name}</p>
                        <p className="text-xs text-slate-500">{user.email}</p>
                        <div className="flex items-center gap-2 mt-2">
                          {user.plan !== "pro" ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-1 rounded-lg bg-amber-500/15 text-amber-400">
                              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                              {user.tokens ?? 0} tokens left
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-1 rounded-lg bg-emerald-500/15 text-emerald-400">
                              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                              Unlimited
                            </span>
                          )}
                        </div>
                      </div>
                      <Link href="/dashboard/upgrade" onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2.5 text-sm text-slate-300 rounded-xl hover:bg-white/[0.05] transition-colors">
                        <svg className="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                        {user.plan === "pro" ? "Manage Plan" : "Upgrade to Pro"}
                      </Link>
                      <button onClick={logout} className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm text-red-400 rounded-xl hover:bg-red-500/10 transition-colors">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Sign Out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </motion.header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto relative">
          {children}
        </main>
      </div>

      <AnimatePresence>
        {cmdOpen && (
          <CommandPalette key={cmdOpen ? "open" : "closed"} onClose={() => setCmdOpen(false)} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showOnboarding && (
          <OnboardingFlow
            open={showOnboarding}
            onComplete={async () => {
              await refreshUser();
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function CommandPalette({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const commands = [
    { label: "Validate New Idea", icon: "M12 4v16m8-8H4", href: "/dashboard/new", category: "Actions" },
    { label: "Generate AI Ideas", icon: "M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3", href: "/dashboard/generate", category: "Actions" },
    { label: "Compare Ideas", icon: "M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2z", href: "/dashboard/compare", category: "Actions" },
    { label: "View Insights", icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2 2z", href: "/dashboard/insights", category: "Navigate" },
    { label: "Go to Dashboard", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4", href: "/dashboard", category: "Navigate" },
    { label: "Upgrade Plan", icon: "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6", href: "/dashboard/upgrade", category: "Account" },
  ];

  const filtered = commands.filter((c) => !query || c.label.toLowerCase().includes(query.toLowerCase()));

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] bg-black/60 backdrop-blur-sm"
      onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: -10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: -10 }}
        transition={{ duration: 0.15 }}
        className="w-full max-w-lg mx-4 rounded-2xl bg-[#0c1222]/98 backdrop-blur-2xl border border-white/[0.08] shadow-2xl shadow-black/60 overflow-hidden"
        onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-white/[0.06]">
          <svg className="w-5 h-5 text-slate-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input type="text" autoFocus value={query} onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command or search..."
            className="flex-1 bg-transparent text-sm text-white placeholder:text-slate-500 focus:outline-none" />
          <kbd className="px-1.5 py-0.5 rounded bg-white/[0.06] text-[10px] font-mono text-slate-500 border border-white/[0.08]">ESC</kbd>
        </div>
        <div className="p-2 max-h-72 overflow-y-auto scrollbar-thin">
          {filtered.length === 0 ? (
            <p className="text-xs text-slate-500 text-center py-6">No results found</p>
          ) : (
            filtered.map((cmd) => (
              <button key={cmd.href}
                onClick={() => { router.push(cmd.href); onClose(); }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-300 hover:bg-white/[0.06] hover:text-white transition-colors group">
                <div className="w-8 h-8 rounded-lg bg-white/[0.04] flex items-center justify-center text-slate-500 group-hover:text-slate-300 group-hover:bg-white/[0.08] transition-colors">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d={cmd.icon} />
                  </svg>
                </div>
                <span className="flex-1 text-left">{cmd.label}</span>
                <span className="text-[10px] text-slate-600 font-medium">{cmd.category}</span>
              </button>
            ))
          )}
        </div>
        <div className="px-4 py-2.5 border-t border-white/[0.06] flex items-center gap-4 text-[10px] text-slate-600">
          <span className="flex items-center gap-1"><kbd className="px-1 py-0.5 rounded bg-white/[0.04] font-mono border border-white/[0.06]">↵</kbd> Select</span>
          <span className="flex items-center gap-1"><kbd className="px-1 py-0.5 rounded bg-white/[0.04] font-mono border border-white/[0.06]">esc</kbd> Close</span>
        </div>
      </motion.div>
    </motion.div>
  );
}
