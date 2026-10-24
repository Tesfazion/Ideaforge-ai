import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const baseChangelog = [
  {
    version: "1.0.0", date: "2024-01-15", tag: "release", title: "A complete first pass at idea validation",
    body: "IdeaForge brings structured startup assessment into one report, so founders can evaluate an opportunity before committing to a build.",
    highlights: ["Nine viability dimensions with a clear overall score", "SWOT, competitor context, market sizing, and execution guidance", "A personal dashboard and downloadable PDF reports"],
  },
  {
    version: "1.1.0", date: "2024-02-20", tag: "release", title: "From a blank page to ideas worth testing",
    body: "The idea generator and guided iteration tools help founders move from early brainstorming to a sharper business concept.",
    highlights: ["Generate business concepts from interests and constraints", "Follow analysis progress as a report is prepared", "Explore alternative directions with pivot suggestions and AI chat"],
  },
  {
    version: "1.2.0", date: "2024-03-10", tag: "release", title: "Better ways to compare and track progress",
    body: "New comparison and analytics views help founders make sense of multiple ideas and learn from their validation history.",
    highlights: ["Compare two ideas across their key metrics", "Review score trends and industry performance", "See insights and activity in the founder dashboard"],
  },
  {
    version: "1.3.0", date: "2024-04-05", tag: "update", title: "A workspace that fits your routine",
    body: "Appearance preferences and product updates make it easier to keep the workspace comfortable and stay informed as IdeaForge evolves.",
    highlights: ["Choose between light and dark appearance", "Subscribe to product updates from the footer", "Refinements to navigation and dashboard performance"],
  },
];

const tagStyles: Record<string, string> = {
  release: "bg-sky-500/15 text-sky-300 border-sky-500/20",
  news: "bg-emerald-500/15 text-emerald-300 border-emerald-500/20",
  update: "bg-amber-500/15 text-amber-300 border-amber-500/20",
  fix: "bg-rose-500/15 text-rose-300 border-rose-500/20",
};

export default function Changelog() {
  const entries = baseChangelog.map((entry) => ({ ...entry, id: `base-${entry.version}` }));

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#060a13]">
        <div className="mx-auto max-w-4xl px-4 py-24 sm:px-6 lg:px-8">
          <header className="mb-12 max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-sky-300">Product updates</p>
            <h1 className="mt-3 text-4xl font-bold text-white sm:text-5xl">A clearer path from idea to evidence</h1>
            <p className="mt-4 text-base leading-7 text-slate-400">Follow the product improvements that help founders assess opportunities, compare directions, and choose their next experiment.</p>
          </header>
          <div className="mb-5 flex items-center justify-between gap-3">
            <h2 className="text-lg font-semibold text-white">Release history</h2>
            <span className="text-xs text-slate-500">{entries.length} updates</span>
          </div>
          <div className="space-y-5">
            {entries.map((entry) => (
              <article key={entry.id} className="rounded-xl border border-white/[0.08] bg-white/[0.03] p-5 sm:p-6">
                <div className="mb-3 flex flex-wrap items-center gap-2">
                  <span className={`rounded-md border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${tagStyles[entry.tag] ?? tagStyles.news}`}>
                    {entry.tag === "fix" ? "Fix" : entry.tag === "news" ? "News" : entry.tag === "update" ? "Update" : "Release"}
                  </span>
                  {entry.version && <span className="text-sm font-semibold text-sky-400">v{entry.version}</span>}
                  <time className="text-xs text-slate-500" dateTime={entry.date}>{new Date(`${entry.date}T00:00:00`).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</time>
                </div>
                <h3 className="text-lg font-semibold text-white">{entry.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-300 whitespace-pre-line">{entry.body}</p>
                {"highlights" in entry && entry.highlights && <ul className="mt-4 grid gap-2 sm:grid-cols-2">{entry.highlights.map((highlight) => <li key={highlight} className="flex gap-2 text-sm leading-5 text-slate-400"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-sky-400" />{highlight}</li>)}</ul>}
              </article>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
