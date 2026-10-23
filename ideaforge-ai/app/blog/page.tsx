import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function Blog() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <h1 className="text-4xl font-bold text-slate-900 mb-6">Blog</h1>
          <p className="text-slate-400">Coming soon. We&apos;re preparing stories on startup validation, market sizing, and founder insights.</p>
        </div>
      </main>
      <Footer />
    </>
  );
}
