import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function PrivacyPolicy() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <h1 className="text-4xl font-bold text-slate-900 mb-6">Privacy Policy</h1>
          <p className="text-slate-400 mb-4">We take your privacy seriously. This policy outlines how IdeaForge collects, uses, and protects your personal information.</p>
          <h2 className="text-xl font-semibold text-slate-900 mt-8 mb-3">Data Collection</h2>
          <p className="text-slate-400 mb-4">We collect account information, idea submissions, and usage analytics to improve our service. Your ideas are encrypted at rest and never shared with third parties without consent.</p>
          <h2 className="text-xl font-semibold text-slate-900 mt-8 mb-3">Data Usage</h2>
          <p className="text-slate-400 mb-4">Your data is used solely to provide and improve the IdeaForge platform. We do not sell or rent your personal information.</p>
          <h2 className="text-xl font-semibold text-slate-900 mt-8 mb-3">Your Rights</h2>
          <p className="text-slate-400">You may request access, correction, or deletion of your personal data at any time by contacting us at tesfazion428@gmail.com.</p>
        </div>
      </main>
      <Footer />
    </>
  );
}
