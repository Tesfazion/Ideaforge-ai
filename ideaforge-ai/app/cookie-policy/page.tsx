import PageShell, { PageHeader, ProseSection } from "@/components/PageShell";

export default function CookiePolicy() {
  return (
    <PageShell>
      <PageHeader
        eyebrow="Legal"
        title="Cookie policy"
        description="How IdeaForge uses cookies and similar technologies."
      />

      <ProseSection title="Essential cookies">
        <p>
          Required for the platform to function — keeping you signed in and remembering your
          appearance preference. These cannot be disabled while you use the product.
        </p>
      </ProseSection>

      <ProseSection title="Analytics cookies">
        <p>
          Help us understand how visitors use the site so we can improve performance and
          usability. They are aggregated and are not used to identify you.
        </p>
      </ProseSection>

      <ProseSection title="Managing cookies">
        <p>
          You can clear or block cookies in your browser settings. Blocking essential cookies
          will prevent sign-in and theme preferences from working.
        </p>
      </ProseSection>
    </PageShell>
  );
}
