import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const baseChangelog = [
  { version: "1.0.0", date: "2024-01-15", tag: "release", title: "Initial launch", body: "Initial launch with 9-dimension validation, dashboard, and PDF export." },
  { version: "1.1.0", date: "2024-02-20", tag: "release", title: "AI generator and live streaming", body: "Added AI Idea Generator, live SSE streaming, and pivot assistant." },
  { version: "1.2.0", date: "2024-03-10", tag: "release", title: "Compare and insights", body: "Launched Compare page, Insights analytics, and streak counter." },
  { version: "1.3.0", date: "2024-04-05", tag: "release", title: "Themes and subscriptions", body: "Dark/light theme, email subscription, and performance improvements." },
];

const tagStyles: Record<string, string> = {
  release: "bg-sky-500/15 text-sky-300 border-sky-500/20",
  news: "bg-emerald-500/15 text-emerald-300 border-emerald-500/20",
  update: "bg-amber-500/15 text-amber-300 border-amber-500/20",
  fix: "bg-rose-500/15 text-rose-300 border-rose-500/20",
};

async function getUpdates() {
  try {
    const rows = await prisma.announcement.findMany({
      where: { published: true },
      orderBy: [{ pinned: "desc" }, { createdAt: "desc" }],
      take: 50,
    });
    return rows.map((row) => ({
      id: row.id,
      version: row.version,
      date: row.createdAt.toISOString().slice(0, 10),
      tag: row.tag,
      title: row.title,
      body: row.body,
    }));
  } catch {
    return [];
  }
}

export default async function Changelog() {
  const updates = await getUpdates();
  const entries = [
    ...updates,
    ...baseChangelog.map((entry) => ({ ...entry, id: `base-${entry.version}` })),
  ];

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-sky-300">Product updates</p>
          <h1 className="mt-2 text-4xl font-bold text-slate-900 mb-2">Changelog</h1>
          <p className="text-sm text-slate-400 mb-8">New versions, features, fixes, and news about IdeaForge.</p>
          <div className="space-y-4">
            {entries.map((entry) => (
              <article key={entry.id} className="p-5 rounded-xl border border-white/[0.06] bg-white/[0.03]">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className={`rounded-md border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${tagStyles[entry.tag] ?? tagStyles.news}`}>
                    {entry.tag}
                  </span>
                  {entry.version && <span className="text-sm font-semibold text-sky-400">v{entry.version}</span>}
                  <span className="text-xs text-slate-500">{entry.date}</span>
                </div>
                <h2 className="text-sm font-semibold text-slate-900">{entry.title}</h2>
                <p className="mt-1 text-sm text-slate-300 whitespace-pre-line">{entry.body}</p>
              </article>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
