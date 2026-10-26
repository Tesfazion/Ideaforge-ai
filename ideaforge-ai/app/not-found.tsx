import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function NotFound() {
  return (
    <>
      <Navbar />
      <main id="main-content" className="flex min-h-screen items-center justify-center bg-page px-4 pt-[7.5rem]">
        <div className="max-w-md text-center">
          <p className="font-heading text-6xl font-bold tracking-tight text-brand-strong">404</p>
          <h1 className="mt-3 text-2xl font-bold tracking-tight text-ink">Page not found</h1>
          <p className="mt-2 text-sm leading-relaxed text-copy">
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Link href="/" className="btn btn-primary">Back to home</Link>
            <Link href="/dashboard" className="btn btn-secondary">Go to dashboard</Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
