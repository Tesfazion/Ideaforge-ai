"use client";
import { useState, useEffect, ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { motion, AnimatePresence } from "framer-motion";
import OnboardingFlow from "@/components/OnboardingFlow";
import ThemeToggle from "@/components/ThemeToggle";

const NAV_ITEMS = [
  { href: "/dashboard", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4", label: "Overview", badge: null },
  { href: "/dashboard/generate", icon: "M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z", label: "AI generator", badge: "AI" },
  { href: "/dashboard/new", icon: "M12 4v16m8-8H4", label: "Validate idea", badge: null },
  { href: "/dashboard/compare", icon: "M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2z", label: "Compare", badge: null },
  { href: "/dashboard/insights", icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2 2z", label: "Insights", badge: null },
  { href: "/dashboard/api-keys", icon: "M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z", label: "API keys", badge: "ENT" },
  { href: "/dashboard/settings", icon: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z", label: "AI settings", badge: null },
  { href: "/dashboard/upgrade", icon: "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6", label: "Plans", badge: "PRO" },
];

const BOTTOM_LINKS = [
  { href: "https://docs.ideaforge.ai", icon: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253", label: "Documentation" },
  { href: "/contact", icon: "M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z", label: "Help & support" },
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
            className="fixed inset-0 z-40 bg-[rgba(11,18,32,0.4)] lg:hidden"
            onClick={onClose}
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      <aside
        className={`sidebar-base fixed top-0 left-0 z-50 flex h-full w-[264px] flex-col border-r transition-transform duration-200 ease-out lg:static lg:z-auto lg:translate-x-0 ${
          open ? "translate-x-0 shadow-[var(--shadow-lg)]" : "-translate-x-full"
        }`}
      >
        <div className="flex h-[68px] shrink-0 items-center gap-2.5 border-b border-line px-4">
          <Link href="/dashboard" className="flex items-center gap-2.5" onClick={onClose}>
            <span className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-lg border border-brand-line bg-surface p-1">
              <Image src="/logo.png" alt="" width={32} height={32} className="h-full w-full object-contain" />
            </span>
            <span className="flex flex-col leading-tight">
              <span className="text-sm font-bold tracking-tight text-ink">IdeaForge</span>
              <span className="text-[9px] font-semibold uppercase tracking-[0.1em] text-muted">
                Sunshine Tech
              </span>
            </span>
          </Link>
          <button
            type="button"
            onClick={onClose}
            className="ml-auto rounded-md p-1.5 text-muted transition-colors hover:bg-surface-alt hover:text-ink lg:hidden"
            aria-label="Close navigation"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 py-4 scrollbar-thin" aria-label="Workspace">
          <p className="px-3 pb-2 text-[10px] font-bold uppercase tracking-[0.1em] text-muted">Workspace</p>
          {NAV_ITEMS.map((link) => {
            const active = link.href === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={onClose}
                aria-current={active ? "page" : undefined}
                className={`sidebar-item relative flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-[13px] font-medium transition-colors ${
                  active ? "is-active" : ""
                }`}
              >
                <span className="sidebar-item-icon flex h-7 w-7 shrink-0 items-center justify-center rounded-md">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.7} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d={link.icon} />
                  </svg>
                </span>
                <span className="truncate">{link.label}</span>
                {link.badge && (
                  <span
                    className={`ml-auto rounded px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider ${
                      active ? "bg-brand-soft text-brand-ink" : "bg-surface-alt text-muted"
                    }`}
                  >
                    {link.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="space-y-0.5 border-t border-line px-3 py-3">
          {BOTTOM_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              target={link.href.startsWith("http") ? "_blank" : undefined}
              rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
              className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] font-medium text-muted transition-colors hover:bg-surface-alt hover:text-ink"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.7} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d={link.icon} />
              </svg>
              {link.label}
            </a>
          ))}
        </div>

        <div className="px-3 pb-4">
          <div className="dashboard-promo p-3.5">
            <p className="text-xs font-bold text-ink">Founder Pro</p>
            <p className="mt-0.5 text-[11px] leading-relaxed text-copy">
              Unlimited validations, exports, and priority analysis.
            </p>
            <Link
              href="/dashboard/upgrade"
              onClick={onClose}
              className="mt-2.5 block rounded-md bg-brand-strong py-1.5 text-center text-[11px] font-semibold text-white transition-colors hover:bg-brand-strong-hover"
            >
              View plans
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
  const [notifications, setNotifications] = useState<
    { id: string; title: string; score: number | null; status: string; createdAt: string }[]
  >([]);
  const showOnboarding = !loading && !!user && user.onboardingComplete === false;

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
      api
        .getIdeas(token)
        .then((data) => {
          const recent = data.ideas.slice(0, 5).map((idea) => ({
            id: idea.id,
            title: idea.title,
            score: idea.report?.viabilityScore ?? null,
            status: idea.status,
            createdAt: idea.createdAt,
          }));
          setNotifications(recent);
        })
        .catch(() => {});
    });
  }, [user, token]);

  useEffect(() => {
    const handler = () => {
      setNotifOpen(false);
      setProfileOpen(false);
    };
    if (notifOpen || profileOpen) {
      document.addEventListener("click", handler);
      return () => document.removeEventListener("click", handler);
    }
  }, [notifOpen, profileOpen]);

  if (loading)
    return (
      <div className="dashboard-shell flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-[3px] border-brand-line border-t-brand" />
          <p className="text-sm font-medium text-muted">Loading your workspace…</p>
        </div>
      </div>
    );
  if (!user) return null;

  return (
    <div className="dashboard-shell relative flex min-h-screen">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="header-base sticky top-0 z-30 border-b">
          <div className="flex h-[68px] items-center justify-between gap-4 px-4 sm:px-6">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setSidebarOpen(true)}
                className="-ml-2 rounded-md p-2 text-muted transition-colors hover:bg-surface-alt hover:text-ink lg:hidden"
                aria-label="Open navigation"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>

              <button
                type="button"
                onClick={() => setCmdOpen(true)}
                className="hidden w-[280px] items-center gap-2.5 rounded-lg border border-line bg-surface-alt px-3 py-2 text-sm text-muted transition-colors hover:border-line-strong hover:text-ink sm:flex lg:w-[320px]"
              >
                <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <span className="flex-1 text-left">Search ideas and actions…</span>
                <kbd className="rounded border border-line bg-surface px-1.5 py-0.5 font-mono text-[10px] text-muted">⌘K</kbd>
              </button>
            </div>

            <div className="flex items-center gap-1">
              <ThemeToggle />

              <div className="relative">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setNotifOpen(!notifOpen);
                    setProfileOpen(false);
                  }}
                  className="relative rounded-lg p-2.5 text-muted transition-colors hover:bg-surface-alt hover:text-ink"
                  aria-label="Recent activity"
                  aria-expanded={notifOpen}
                >
                  <svg className="h-[18px] w-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                  <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-brand ring-2 ring-[var(--surface)]" />
                </button>

                <AnimatePresence>
                  {notifOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 6 }}
                      transition={{ duration: 0.14 }}
                      className="absolute right-0 mt-2 w-80 rounded-xl border border-line bg-surface p-3 shadow-[var(--shadow-lg)]"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="mb-2 flex items-center justify-between px-1">
                        <p className="text-sm font-semibold text-ink">Recent activity</p>
                        <span className="text-[10px] font-medium text-muted">{notifications.length} items</span>
                      </div>
                      <div className="max-h-64 space-y-0.5 overflow-y-auto scrollbar-thin">
                        {notifications.length === 0 ? (
                          <p className="py-6 text-center text-xs text-muted">No activity yet</p>
                        ) : (
                          notifications.map((notif) => (
                            <a
                              key={notif.id}
                              href={`/dashboard/idea/${notif.id}`}
                              className="flex items-start gap-3 rounded-lg p-2.5 transition-colors hover:bg-surface-alt"
                              onClick={() => setNotifOpen(false)}
                            >
                              <span
                                className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md ${
                                  notif.status === "validated"
                                    ? "bg-success-soft text-success-ink"
                                    : notif.status === "failed"
                                      ? "bg-danger-soft text-danger-ink"
                                      : "bg-warning-soft text-warning-ink"
                                }`}
                              >
                                {notif.status === "validated" ? (
                                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                                ) : notif.status === "failed" ? (
                                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                                ) : (
                                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                )}
                              </span>
                              <span className="min-w-0 flex-1">
                                <span className="block truncate text-xs font-medium text-ink">{notif.title}</span>
                                <span className="block text-[10px] text-muted">
                                  {notif.status === "validated"
                                    ? `Scored ${notif.score}%`
                                    : notif.status === "failed"
                                      ? "Failed"
                                      : "Processing…"}
                                </span>
                              </span>
                            </a>
                          ))
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="mx-1 hidden h-6 w-px bg-[var(--line)] sm:block" />

              <div className="relative">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setProfileOpen(!profileOpen);
                    setNotifOpen(false);
                  }}
                  className="flex items-center gap-2.5 rounded-lg py-1.5 pl-2 pr-2.5 transition-colors hover:bg-surface-alt"
                  aria-expanded={profileOpen}
                  aria-label="Account menu"
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-strong text-xs font-bold text-white">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                  <span className="hidden text-left sm:block">
                    <span className="block text-[13px] font-semibold leading-tight text-ink">{user.name}</span>
                    <span className="block text-[10px] font-medium text-muted">
                      {user.plan === "pro" ? "Founder Pro" : user.plan === "enterprise" ? "Enterprise" : "Explorer"}
                    </span>
                  </span>
                  <svg className="hidden h-3.5 w-3.5 text-muted sm:block" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                <AnimatePresence>
                  {profileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 6 }}
                      transition={{ duration: 0.14 }}
                      className="absolute right-0 mt-2 w-64 rounded-xl border border-line bg-surface p-2 shadow-[var(--shadow-lg)]"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="mb-1 border-b border-line px-3 py-3">
                        <p className="text-sm font-semibold text-ink">{user.name}</p>
                        <p className="text-xs text-muted">{user.email}</p>
                        <div className="mt-2">
                          {user.plan !== "pro" ? (
                            <span className="badge badge-warning">{user.tokens ?? 0} tokens left</span>
                          ) : (
                            <span className="badge badge-success">Unlimited validations</span>
                          )}
                        </div>
                      </div>
                      <Link
                        href="/dashboard/upgrade"
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm text-copy transition-colors hover:bg-surface-alt hover:text-ink"
                      >
                        <svg className="h-4 w-4 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6} aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                        </svg>
                        {user.plan === "pro" ? "Manage plan" : "Upgrade plan"}
                      </Link>
                      <button
                        type="button"
                        onClick={logout}
                        className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium text-danger-ink transition-colors hover:bg-danger-soft"
                      >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6} aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Sign out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </header>

        <main id="main-content" className="relative flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>

      <AnimatePresence>{cmdOpen && <CommandPalette key={cmdOpen ? "open" : "closed"} onClose={() => setCmdOpen(false)} />}</AnimatePresence>

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
    { label: "Validate new idea", icon: "M12 4v16m8-8H4", href: "/dashboard/new", category: "Actions" },
    { label: "Generate AI ideas", icon: "M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3", href: "/dashboard/generate", category: "Actions" },
    { label: "Compare ideas", icon: "M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2z", href: "/dashboard/compare", category: "Actions" },
    { label: "View insights", icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2 2z", href: "/dashboard/insights", category: "Navigate" },
    { label: "Go to overview", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4", href: "/dashboard", category: "Navigate" },
    { label: "Upgrade plan", icon: "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6", href: "/dashboard/upgrade", category: "Account" },
  ];

  const filtered = commands.filter((c) => !query || c.label.toLowerCase().includes(query.toLowerCase()));

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-start justify-center bg-[rgba(11,18,32,0.45)] px-4 pt-[15vh]"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Command palette"
    >
      <motion.div
        initial={{ opacity: 0, y: -8, scale: 0.99 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -8, scale: 0.99 }}
        transition={{ duration: 0.14 }}
        className="w-full max-w-lg overflow-hidden rounded-xl border border-line bg-surface shadow-[var(--shadow-lg)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 border-b border-line px-4 py-3">
          <svg className="h-5 w-5 shrink-0 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command or search…"
            aria-label="Search commands"
            className="flex-1 bg-transparent text-sm text-ink placeholder:text-muted focus:outline-none"
          />
          <kbd className="rounded border border-line bg-surface-alt px-1.5 py-0.5 font-mono text-[10px] text-muted">ESC</kbd>
        </div>
        <div className="max-h-72 overflow-y-auto p-2 scrollbar-thin">
          {filtered.length === 0 ? (
            <p className="py-6 text-center text-xs text-muted">No results found</p>
          ) : (
            filtered.map((cmd) => (
              <button
                key={cmd.href}
                type="button"
                onClick={() => {
                  router.push(cmd.href);
                  onClose();
                }}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-copy transition-colors hover:bg-surface-alt hover:text-ink"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-md bg-surface-alt text-muted">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.7} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d={cmd.icon} />
                  </svg>
                </span>
                <span className="flex-1 text-left">{cmd.label}</span>
                <span className="text-[10px] font-medium text-muted">{cmd.category}</span>
              </button>
            ))
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
