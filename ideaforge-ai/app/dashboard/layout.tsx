"use client";
import { useState, useEffect, useCallback, ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { useTheme } from "@/components/ThemeProvider";

function Sidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const pathname = usePathname();
  const links = [
    { href: "/dashboard", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0a1 1 0 01-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 01-1 1", label: "Dashboard", desc: "Overview & ideas" },
    { href: "/dashboard/generate", icon: "M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z", label: "Generate Ideas", desc: "AI brainstorming" },
    { href: "/dashboard/new", icon: "M12 4v16m8-8H4", label: "Validate Idea", desc: "Submit & analyze" },
    { href: "/dashboard/compare", icon: "M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2z", label: "Compare", desc: "Side-by-side" },
    { href: "/dashboard/insights", icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2 2z", label: "Insights", desc: "Analytics & trends" },
    { href: "/dashboard/upgrade", icon: "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6", label: "Upgrade", desc: "Unlock Pro features" },
  ];
  return (
    <>
      {open && <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden transition-opacity" onClick={onClose} />}
      <aside className={`sidebar-base fixed top-0 left-0 z-50 h-full w-72 border-r transform transition-transform duration-300 ease-out lg:translate-x-0 ${open ? "translate-x-0" : "-translate-x-full"} lg:static lg:z-auto flex flex-col`}>
        <div className="flex items-center justify-between px-5 py-5 border-b border-gray-100 dark:border-gray-800">
          <Link href="/dashboard" className="flex items-center gap-3" onClick={onClose}>
            <div className="w-10 h-10 rounded-xl gradient-btn flex items-center justify-center shadow-lg">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
               <span className="text-lg font-bold text-gray-900 dark:text-white">IdeaForge</span>
              <p className="text-[10px] text-gray-400 dark:text-gray-600 -mt-0.5">Business Intelligence Platform</p>
            </div>
          </Link>
          <button onClick={onClose} className="lg:hidden p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        <nav className="p-3 space-y-1 flex-1">
          {links.map((link) => {
            const active = link.href === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(link.href);
            return (
              <Link key={link.href} href={link.href} onClick={onClose}
                className={`group flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                  active
                    ? "bg-indigo-50 dark:bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 shadow-sm"
                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-white"
                }`}>
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                  active ? "bg-indigo-100 dark:bg-indigo-500/20" : "bg-gray-100 dark:bg-gray-800 group-hover:bg-gray-200 dark:group-hover:bg-gray-700"
                }`}>
                  <svg className={`w-4.5 h-4.5 ${active ? "text-indigo-600 dark:text-indigo-400" : "text-gray-500 dark:text-gray-400"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d={link.icon} />
                  </svg>
                </div>
                <div className="min-w-0">
                  <p className="truncate">{link.label}</p>
                  <p className="text-[10px] text-gray-400 dark:text-gray-600 truncate">{link.desc}</p>
                </div>
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-gray-100 dark:border-gray-800">
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-500/10 dark:to-purple-500/10 rounded-xl p-3">
            <p className="text-xs font-semibold text-gray-900 dark:text-white">Need more validations?</p>
            <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5 mb-2">Upgrade to Pro for unlimited access</p>
            <Link href="/dashboard/upgrade" onClick={onClose} className="text-[10px] font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">
              View Plans &rarr;
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
}

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user) router.push("/login");
  }, [user, loading, router]);

  const handleClickOutside = useCallback(() => { setNotifOpen(false); setProfileOpen(false); }, []);

  useEffect(() => {
    if (notifOpen || profileOpen) {
      document.addEventListener("click", handleClickOutside);
      return () => document.removeEventListener("click", handleClickOutside);
    }
  }, [notifOpen, profileOpen, handleClickOutside]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#0B1120]">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-gray-500 dark:text-gray-400">Loading your workspace...</p>
      </div>
    </div>
  );
  if (!user) return null;

  return (
    <div className="min-h-screen flex bg-gray-50 dark:bg-[#0B1120] transition-colors duration-300">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col min-w-0">
        <header className="header-base sticky top-0 z-30 backdrop-blur-xl border-b border-gray-200/80 dark:border-gray-800/80">
          <div className="flex items-center justify-between px-4 sm:px-6 py-3">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div className="hidden lg:flex items-center gap-2">
              <div className="relative">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input type="text" placeholder="Search ideas..." className="pl-9 pr-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 w-64 transition-colors placeholder:text-gray-400" />
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <button onClick={toggleTheme} className="p-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors" title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}>
                {theme === "dark" ? (
                  <svg className="w-5 h-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                )}
              </button>
              <div className="relative">
                <button onClick={(e) => { e.stopPropagation(); setNotifOpen(!notifOpen); }} className="p-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors relative">
                  <svg className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                  <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white dark:ring-[#0B1120]" />
                </button>
                {notifOpen && (
                  <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 shadow-xl p-4 animate-slide-up" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">Notifications</p>
                      <button className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline">Mark all read</button>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-start gap-3 p-2 rounded-lg bg-indigo-50 dark:bg-indigo-500/10">
                        <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-500/20 flex items-center justify-center shrink-0 mt-0.5">
                          <svg className="w-4 h-4 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-gray-900 dark:text-white">Validation Complete</p>
                          <p className="text-[10px] text-gray-500 dark:text-gray-400">Your idea scored 87% viability</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-center py-3">
                        <p className="text-xs text-gray-400 dark:text-gray-500">No more notifications</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div className="relative">
                <button onClick={(e) => { e.stopPropagation(); setProfileOpen(!profileOpen); }} className="flex items-center gap-2.5 ml-2 pl-3 border-l border-gray-200 dark:border-gray-700 py-1 pr-1 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                  <div className="w-8 h-8 rounded-full gradient-btn flex items-center justify-center text-white text-sm font-bold shadow-sm">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="hidden sm:block text-left">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white leading-tight">{user.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{user.plan === "pro" ? "Pro Plan" : "Free Plan"}</p>
                  </div>
                  {user.plan !== "pro" && (
                    <Link href="/dashboard/upgrade" className={`hidden sm:flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-lg ${(user.tokens ?? 0) <= 1 ? "bg-amber-50 dark:bg-amber-500/15 text-amber-700 dark:text-amber-400" : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"} hover:underline transition-colors`}>
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                      {(user.tokens ?? 0) <= 1 ? `${user.tokens ?? 0} token left` : `${user.tokens ?? 0} tokens left`}
                    </Link>
                  )}
                  {user.plan === "pro" && (
                    <span className="hidden sm:flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-400">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                      Unlimited
                    </span>
                  )}
                  <svg className="w-4 h-4 text-gray-400 hidden sm:block" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {profileOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 shadow-xl p-2 animate-slide-up" onClick={(e) => e.stopPropagation()}>
                    <div className="px-3 py-2 border-b border-gray-100 dark:border-gray-800 mb-1">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">{user.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{user.email}</p>
                    </div>
                    <Link href="/dashboard/upgrade" onClick={() => setProfileOpen(false)} className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                      </svg>
                      {user.plan === "pro" ? "Manage Plan" : "Upgrade to Pro"}
                    </Link>
                    <button onClick={logout} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 dark:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
