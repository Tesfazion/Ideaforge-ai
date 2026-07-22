import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const changelog = [
  { version: "1.0.0", date: "2024-01-15", text: "Initial launch with 9-dimension validation, dashboard, and PDF export." },
  { version: "1.1.0", date: "2024-02-20", text: "Added AI Idea Generator, live SSE streaming, and pivot assistant." },
  { version: "1.2.0", date: "2024-03-10", text: "Launched Compare page, Insights analytics, and streak counter." },
  { version: "1.3.0", date: "2024-04-05", text: "Dark/light theme, email subscription, and performance improvements." },
];

export default function Changelog() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#060a13]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <h1 className="text-4xl font-bold text-white mb-6">Changelog</h1>
          <div className="space-y-6">
            {changelog.map((entry) => (
              <div key={entry.version} className="p-5 rounded-xl border border-white/[0.06] bg-white/[0.03]">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-sm font-semibold text-indigo-400">v{entry.version}</span>
                  <span className="text-xs text-slate-500">{entry.date}</span>
                </div>
                <p className="text-sm text-slate-300">{entry.text}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
