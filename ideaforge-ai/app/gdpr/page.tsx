import PageShell, { PageHeader, ProseSection } from "@/components/PageShell";

const RIGHTS = [
  "Access — request a copy of the personal data we hold about you",
  "Rectification — correct any inaccurate information",
  "Erasure — request deletion of your data",
  "Restriction — limit how we process your data",
  "Objection — object to processing based on legitimate interests",
  "Portability — receive your data in a machine-readable format",
];

export default function GDPR() {
  return (
    <PageShell>
      <PageHeader
        eyebrow="Legal"
        title="GDPR compliance"
        description="IdeaForge is committed to protecting your personal data in accordance with the General Data Protection Regulation."
      />

      <ProseSection title="Your rights">
        <p>Under GDPR you have the right to:</p>
        <ul className="mt-2 space-y-2">
          {RIGHTS.map((right) => (
            <li key={right} className="flex gap-2.5">
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
              <span>{right}</span>
            </li>
          ))}
        </ul>
      </ProseSection>

      <ProseSection title="Lawful basis">
        <p>
          We process account and report data to perform our contract with you, and aggregate
          analytics on the basis of legitimate interest in improving the product.
        </p>
      </ProseSection>

      <ProseSection title="Contact">
        <p>
          For GDPR-related requests, email{" "}
          <a href="mailto:tesfazion428@gmail.com" className="font-medium text-link hover:underline">
            tesfazion428@gmail.com
          </a>
          . We respond within 30 days.
        </p>
      </ProseSection>
    </PageShell>
  );
}
