import PageShell, { PageHeader, Prose, ProseSection } from "@/components/PageShell";

const OPEN_ROLES = [
  {
    title: "Product engineer",
    type: "Full-time · Remote",
    body: "Own features end to end across the Next.js app and the AI analysis pipeline.",
  },
  {
    title: "Research analyst",
    type: "Contract · Remote",
    body: "Shape how we evaluate markets, competitors, and timing signals inside each report.",
  },
];

export default function Careers() {
  return (
    <PageShell>
      <PageHeader
        eyebrow="Careers"
        title="Work with us"
        description="We're a small, distributed team building the tools we wished existed when we started."
      />

      <Prose>
        <p>
          IdeaForge is made by Sunshine Tech Solution. We care about clear thinking, honest
          research, and software that respects the person using it.
        </p>
      </Prose>

      <section className="mt-10">
        <h2 className="text-lg font-bold text-ink">Open roles</h2>
        <div className="mt-4 space-y-3">
          {OPEN_ROLES.map((role) => (
            <div key={role.title} className="card p-5">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-base font-bold text-ink">{role.title}</h3>
                <span className="badge badge-neutral">{role.type}</span>
              </div>
              <p className="mt-1.5 text-sm leading-relaxed text-copy">{role.body}</p>
            </div>
          ))}
        </div>
      </section>

      <ProseSection title="How to apply">
        <p>
          Email{" "}
          <a href="mailto:tesfazion428@gmail.com" className="font-medium text-link hover:underline">
            tesfazion428@gmail.com
          </a>{" "}
          with your résumé and a short note about what you want to work on. Tell us about
          something you built that you are proud of.
        </p>
        <p>We read every application and reply to everyone who reaches out.</p>
      </ProseSection>
    </PageShell>
  );
}
