import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const checks = [
  { name: "API", status: "Operational" as const },
  { name: "AI Validation Engine", status: "Operational" as const },
  { name: "Database", status: "Operational" as const },
];

export default function Status() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <h1 className="text-4xl font-bold text-slate-900 mb-6">System Status</h1>
          <div className="space-y-4">
            {checks.map((c) => (
              <div key={c.name} className="flex items-center justify-between p-4 rounded-xl border border-white/[0.06] bg-white/[0.03]">
                <span className="text-slate-300">{c.name}</span>
                <span className="text-emerald-400 text-sm font-medium">{c.status}</span>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
