import { ReactNode } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

/**
 * Standard shell for secondary marketing/content pages.
 * Clears the fixed navbar (68px) and keeps the Sunshine container width.
 */
export default function PageShell({
  children,
  width = "prose",
}: {
  children: ReactNode;
  width?: "prose" | "wide" | "narrow";
}) {
  const max = width === "wide" ? "max-w-5xl" : width === "narrow" ? "max-w-xl" : "max-w-3xl";

  return (
    <>
      <Navbar />
      <main id="main-content" className="min-h-screen bg-page pt-[7.5rem]">
        <div className={`mx-auto ${max} px-4 pb-20 sm:px-6 lg:px-8`}>{children}</div>
      </main>
      <Footer />
    </>
  );
}

export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: ReactNode;
}) {
  return (
    <header className="border-b border-line pb-8">
      {eyebrow && <span className="eyebrow">{eyebrow}</span>}
      <h1 className="mt-4 text-3xl font-bold tracking-tight text-ink sm:text-4xl">{title}</h1>
      {description && (
        <p className="mt-3 max-w-2xl text-base leading-relaxed text-copy">{description}</p>
      )}
      {actions && <div className="mt-6 flex flex-wrap gap-3">{actions}</div>}
    </header>
  );
}

export function Prose({ children }: { children: ReactNode }) {
  return (
    <div className="mt-8 space-y-4 text-[0.9375rem] leading-7 text-copy">
      {children}
    </div>
  );
}

export function ProseSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mt-8">
      <h2 className="text-lg font-bold text-ink">{title}</h2>
      <div className="mt-2 space-y-3 text-[0.9375rem] leading-7 text-copy">{children}</div>
    </section>
  );
}
