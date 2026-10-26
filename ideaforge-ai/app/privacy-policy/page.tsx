import PageShell, { PageHeader, ProseSection } from "@/components/PageShell";

export default function PrivacyPolicy() {
  return (
    <PageShell>
      <PageHeader
        eyebrow="Legal"
        title="Privacy policy"
        description="How IdeaForge collects, uses, and protects your personal information."
      />

      <ProseSection title="Data we collect">
        <p>
          We collect account information (name and email), the ideas you submit for validation,
          and aggregate usage analytics. Your ideas are encrypted at rest and in transit, and are
          never shared with third parties without your consent.
        </p>
      </ProseSection>

      <ProseSection title="How we use your data">
        <p>
          Your data is used solely to provide and improve the IdeaForge platform — generating
          your reports, delivering them to you, and diagnosing failures. We do not sell or rent
          your personal information.
        </p>
      </ProseSection>

      <ProseSection title="Sub-processors">
        <p>
          IdeaForge uses third-party AI providers to generate analysis. When you supply your own
          provider key in AI settings, requests are made with your key and your provider&apos;s
          terms apply. Report delivery and payments are handled by established infrastructure and
          payment providers.
        </p>
      </ProseSection>

      <ProseSection title="Your rights">
        <p>
          You may request access to, correction of, or deletion of your personal data at any time
          by emailing{" "}
          <a href="mailto:tesfazion428@gmail.com" className="font-medium text-link hover:underline">
            tesfazion428@gmail.com
          </a>
          . You can also delete individual ideas from your dashboard.
        </p>
      </ProseSection>

      <ProseSection title="Retention">
        <p>
          We keep your account data for as long as your account is active. Deleting your account
          removes your ideas and reports from production systems, subject to short-lived backups.
        </p>
      </ProseSection>
    </PageShell>
  );
}
