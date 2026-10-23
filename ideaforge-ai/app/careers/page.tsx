import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function Careers() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <h1 className="text-4xl font-bold text-slate-900 mb-6">Careers</h1>
          <p className="text-slate-400 mb-4">We&apos;re a small, distributed team building the future of startup validation.</p>
          <p className="text-slate-400 mb-4">If you&apos;re passionate about AI, market research, and helping founders succeed, we&apos;d love to hear from you.</p>
          <p className="text-slate-400">Email us at tesfazion428@gmail.com with your resume and a brief note about what interests you.</p>
        </div>
      </main>
      <Footer />
    </>
  );
}
