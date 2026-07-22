import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function TermsOfService() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#060a13]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <h1 className="text-4xl font-bold text-white mb-6">Terms of Service</h1>
          <p className="text-slate-400 mb-4">By using IdeaForge, you agree to these terms. Please read them carefully.</p>
          <h2 className="text-xl font-semibold text-white mt-8 mb-3">Account</h2>
          <p className="text-slate-400 mb-4">You are responsible for maintaining the confidentiality of your account and for all activities under your account.</p>
          <h2 className="text-xl font-semibold text-white mt-8 mb-3">Usage</h2>
          <p className="text-slate-400 mb-4">You agree not to misuse our services or interfere with their normal operation.</p>
          <h2 className="text-xl font-semibold text-white mt-8 mb-3">Limitation of Liability</h2>
          <p className="text-slate-400">IdeaForge provides validation guidance but does not guarantee business success. Use at your own risk.</p>
        </div>
      </main>
      <Footer />
    </>
  );
}
