import PageShell, { PageHeader } from "@/components/PageShell";

const baseChangelog = [
  {
    version: "1.3.0",
    date: "2024-04-05",
    tag: "update",
    title: "A workspace that fits your routine",
    body: "Appearance preferences and product updates make it easier to keep the workspace comfortable and stay informed as IdeaForge evolves.",
    highlights: [
      "Choose between light and dark appearance",
      "Subscribe to product updates from the footer",
      "Refinements to navigation and dashboard performance",
    ],
  },
  {
    version: "1.2.0",
    date: "2024-03-10",
    tag: "release",
    title: "Better ways to compare and track progress",
    body: "New comparison and analytics views help founders make sense of multiple ideas and learn from their validation history.",
    highlights: [
      "Compare two ideas across their key metrics",
      "Review score trends and industry performance",
      "See insights and activity in the founder dashboard",
    ],
  },
  {
    version: "1.1.0",
    date: "2024-02-20",
    tag: "release",
    title: "From a blank page to ideas worth testing",
    body: "The idea generator and guided iteration tools help founders move from early brainstorming to a sharper business concept.",
    highlights: [
      "Generate business concepts from interests and constraints",
      "Follow analysis progress as a report is prepared",
      "Explore alternative directions with pivot suggestions and AI chat",
    ],
  },
  {
    version: "1.0.0",
    date: "2024-01-15",
    tag: "release",
    title: "A complete first pass at idea validation",
    body: "IdeaForge brings structured startup assessment into one report, so founders can evaluate an opportunity before committing to a build.",
    highlights: [
      "Nine viability dimensions with a clear overall score",
      "SWOT, competitor context, market sizing, and execution guidance",
      "A personal dashboard and downloadable PDF reports",
    ],
  },
];

const TAG_STYLE: Record<string, string> = {
  release: "badge badge-accent",
  news: "badge badge-success",
  update: "badge badge-warning",
  fix: "badge badge-danger",
};

const TAG_LABEL: Record<string, string> = {
  release: "Release",
  news: "News",
  update: "Update",
  fix: "Fix",
};

export default function Changelog() {
  return (
    <PageShell width="wide">
      <PageHeader
        eyebrow="Product updates"
        title="A clearer path from idea to evidence"
        description="Follow the product improvements that help founders assess opportunities, compare directions, and choose their next experiment."
      />

      <div className="mt-8 flex items-center justify-between gap-3">
        <h2 className="text-base font-bold text-ink">Release history</h2>
        <span className="text-xs font-medium text-muted">{baseChangelog.length} updates</span>
      </div>

      <ol className="mt-5 space-y-4">
        {baseChangelog.map((entry) => (
          <li key={entry.version} className="card p-5 sm:p-6">
            <div className="mb-3 flex flex-wrap items-center gap-2.5">
              <span className={TAG_STYLE[entry.tag] ?? TAG_STYLE.release}>
                {TAG_LABEL[entry.tag] ?? "Release"}
              </span>
              <span className="text-sm font-semibold text-ink">v{entry.version}</span>
              <time className="text-xs text-muted" dateTime={entry.date}>
                {new Date(`${entry.date}T00:00:00`).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </time>
            </div>
            <h3 className="text-base font-bold text-ink">{entry.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-copy">{entry.body}</p>
            <ul className="mt-4 grid gap-2 sm:grid-cols-2">
              {entry.highlights.map((highlight) => (
                <li key={highlight} className="flex gap-2 text-sm leading-6 text-copy">
                  <svg
                    className="mt-1 h-3.5 w-3.5 shrink-0 text-brand-strong"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.5}
                    aria-hidden="true"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  {highlight}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ol>
    </PageShell>
  );
}
