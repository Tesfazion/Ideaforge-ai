import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function CookiePolicy() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#060a13]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <h1 className="text-4xl font-bold text-white mb-6">Cookie Policy</h1>
          <p className="text-slate-400 mb-4">We use cookies and similar technologies to improve your experience, analyze traffic, and personalize content.</p>
          <h2 className="text-xl font-semibold text-white mt-8 mb-3">Essential Cookies</h2>
          <p className="text-slate-400 mb-4">Required for the platform to function. These cannot be disabled.</p>
          <h2 className="text-xl font-semibold text-white mt-8 mb-3">Analytics Cookies</h2>
          <p className="text-slate-400">Help us understand how visitors interact with the site so we can improve performance and usability.</p>
        </div>
      </main>
      <Footer />
    </>
  );
}
