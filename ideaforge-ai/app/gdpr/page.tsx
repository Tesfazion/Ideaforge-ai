import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function GDPR() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <h1 className="text-4xl font-bold text-slate-900 mb-6">GDPR Compliance</h1>
          <p className="text-slate-400 mb-4">IdeaForge is committed to protecting your personal data in accordance with the General Data Protection Regulation (GDPR).</p>
          <h2 className="text-xl font-semibold text-slate-900 mt-8 mb-3">Your Rights</h2>
          <p className="text-slate-400 mb-4">Under GDPR, you have the right to access, rectify, erase, restrict processing, object to processing, and data portability.</p>
          <h2 className="text-xl font-semibold text-slate-900 mt-8 mb-3">Contact</h2>
          <p className="text-slate-400">For GDPR-related requests, email tesfazion428@gmail.com.</p>
        </div>
      </main>
      <Footer />
    </>
  );
}
