import PageShell, { PageHeader, ProseSection } from "@/components/PageShell";

export default function TermsOfService() {
  return (
    <PageShell>
      <PageHeader
        eyebrow="Legal"
        title="Terms of service"
        description="By using IdeaForge, you agree to these terms. Please read them carefully."
      />

      <ProseSection title="Account">
        <p>
          You are responsible for maintaining the confidentiality of your credentials and for all
          activity that occurs under your account. Notify us immediately if you suspect
          unauthorised access.
        </p>
      </ProseSection>

      <ProseSection title="Acceptable use">
        <p>
          You agree not to misuse the service, attempt to disrupt its operation, or use it to
          generate content that is unlawful. Automated access is permitted only through the
          documented API on an Enterprise plan.
        </p>
      </ProseSection>

      <ProseSection title="Plans and billing">
        <p>
          Paid plans renew monthly or annually until cancelled. You can cancel at any time from
          your dashboard, and access continues until the end of the current billing period. Paid
          plans include a 14-day money-back guarantee.
        </p>
      </ProseSection>

      <ProseSection title="Limitation of liability">
        <p>
          IdeaForge provides validation guidance, not guarantees. It does not promise business
          success, funding, or revenue. Decisions you make based on a report are your own.
        </p>
      </ProseSection>

      <ProseSection title="Changes">
        <p>
          We may update these terms as the product evolves. Material changes will be announced in
          the changelog before they take effect.
        </p>
      </ProseSection>
    </PageShell>
  );
}
