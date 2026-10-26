import PageShell, { PageHeader } from "@/components/PageShell";
import { SUNSHINE } from "@/lib/site";

const CHECKS = [
  { name: "Web application", status: "Operational" },
  { name: "API", status: "Operational" },
  { name: "AI validation engine", status: "Operational" },
  { name: "Database", status: "Operational" },
];

export default function Status() {
  return (
    <PageShell width="narrow">
      <PageHeader
        eyebrow="Status"
        title="System status"
        description="Live availability for the IdeaForge platform and its dependencies."
      />

      <div className="card mt-8 flex items-center gap-3 p-4">
        <span className="relative flex h-2.5 w-2.5" aria-hidden="true">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--success)] opacity-60" />
          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[var(--success)]" />
        </span>
        <p className="text-sm font-semibold text-ink">All systems operational</p>
      </div>

      <div className="card mt-4 divide-y divide-[var(--line)]">
        {CHECKS.map((check) => (
          <div key={check.name} className="flex items-center justify-between px-4 py-3.5">
            <span className="text-sm text-copy">{check.name}</span>
            <span className="badge badge-success">{check.status}</span>
          </div>
        ))}
      </div>

      <p className="mt-6 text-xs leading-relaxed text-muted">
        Depending on an external AI provider. If a validation stalls, it can be retried from your
        dashboard without losing the report. For anything urgent, contact{" "}
        <a href={`mailto:${SUNSHINE.email}`} className="font-medium text-link hover:underline">
          {SUNSHINE.email}
        </a>
        .
      </p>
    </PageShell>
  );
}
