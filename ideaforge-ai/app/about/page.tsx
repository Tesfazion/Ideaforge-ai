import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function About() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <h1 className="text-4xl font-bold text-slate-900 mb-6">About IdeaForge</h1>
          <p className="text-slate-400 mb-4">IdeaForge is an AI-powered business idea validation platform built for entrepreneurs, founders, and innovators who want to de-risk their next venture before writing a single line of code.</p>
          <p className="text-slate-400 mb-4">Our mission is to democratize startup validation by giving everyone access to the same kind of rigorous analysis that top accelerators and VCs use.</p>
          <p className="text-slate-400 mb-4">IdeaForge is made by <a className="text-sky-400 hover:text-sky-300" href="https://sunshinetechsolution.vercel.app/" target="_blank" rel="noreferrer">Sunshine Tech Solution</a>.</p>
          <p className="text-slate-400">We believe every great idea deserves a fair shot at market validation, regardless of team size or budget.</p>
        </div>
      </main>
      <Footer />
    </>
  );
}
