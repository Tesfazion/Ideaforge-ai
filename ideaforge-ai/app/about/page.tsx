import Link from "next/link";
import PageShell, { PageHeader, Prose, ProseSection } from "@/components/PageShell";
import { SUNSHINE } from "@/lib/site";

const PRINCIPLES = [
  {
    title: "Evidence over instinct",
    body: "Every report is structured the same way, so a founder can compare an idea against their own past work instead of guessing.",
    icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
  },
  {
    title: "Accessible by default",
    body: "The same rigour that accelerators apply should be available to a solo founder with a notebook and an internet connection.",
    icon: "M12 2a10 10 0 100 20 10 10 0 000-20zm0 4v6l4 2",
  },
  {
    title: "Built to be trusted",
    body: "Your ideas stay yours. Data is encrypted in transit and at rest, and it is never used to train third-party models.",
    icon: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z",
  },
];

const STATS = [
  { value: "9", label: "Analysis dimensions" },
  { value: "30s", label: "Typical report time" },
  { value: "45+", label: "Countries served" },
  { value: "2,847", label: "Ideas validated" },
];

export default function About() {
  return (
    <PageShell width="wide">
      <PageHeader
        eyebrow="Company"
        title="About IdeaForge"
        description="An AI-assisted validation workspace built for founders, product teams, and innovation programmes who want to de-risk a venture before committing to it."
      />

      <Prose>
        <p>
          IdeaForge turns an unstructured idea into a structured business case: market size,
          competitive position, revenue potential, execution risk, and a seven-day action plan
          you can start on immediately.
        </p>
        <p>
          It is built and supported by{" "}
          <a
            href={SUNSHINE.url}
            target="_blank"
            rel="noreferrer"
            className="font-medium text-link hover:underline"
          >
            {SUNSHINE.name}
          </a>
          , a technology company that designs and delivers software for organisations across
          Ethiopia and beyond.
        </p>
      </Prose>

      <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {STATS.map((stat) => (
          <div key={stat.label} className="card p-5">
            <p className="font-heading text-3xl font-bold tracking-tight text-ink">{stat.value}</p>
            <p className="mt-1 text-xs font-medium text-muted">{stat.label}</p>
          </div>
        ))}
      </div>

      <section className="mt-14">
        <h2 className="text-xl font-bold tracking-tight text-ink">How we build</h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-3">
          {PRINCIPLES.map((item) => (
            <div key={item.title} className="card p-5">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-soft text-brand-ink">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                </svg>
              </span>
              <h3 className="mt-4 text-base font-bold text-ink">{item.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-copy">{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      <ProseSection title="Our mission">
        <p>
          We believe every serious idea deserves a fair assessment, regardless of team size or
          budget. IdeaForge exists to make that first honest look at an opportunity fast,
          affordable, and repeatable.
        </p>
      </ProseSection>

      <div className="card mt-12 flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-base font-bold text-ink">Want to see it on your own idea?</h2>
          <p className="mt-1 text-sm text-copy">Free to start, no credit card required.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link href="/register" className="btn btn-primary">Get started free</Link>
          <Link href="/contact" className="btn btn-secondary">Talk to us</Link>
        </div>
      </div>
    </PageShell>
  );
}
