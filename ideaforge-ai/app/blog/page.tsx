import Link from "next/link";
import PageShell, { PageHeader } from "@/components/PageShell";

export default function Blog() {
  return (
    <PageShell>
      <PageHeader
        eyebrow="Insights"
        title="Insights"
        description="Notes on validation, market sizing, and what actually separates a promising idea from an expensive distraction."
      />

      <div className="card mt-10 p-8 text-center">
        <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-brand-soft text-brand-ink">
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        </span>
        <h2 className="mt-4 text-lg font-bold text-ink">The first articles are in draft</h2>
        <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-copy">
          We&apos;re preparing pieces on market sizing without a research budget, how to read a
          competitive landscape, and the questions investors ask before they commit.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link href="/register" className="btn btn-primary">Validate an idea in the meantime</Link>
          <Link href="/changelog" className="btn btn-secondary">See what shipped</Link>
        </div>
      </div>
    </PageShell>
  );
}
