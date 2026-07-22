"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth";
import { api, Idea } from "@/lib/api";
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, Legend, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import { motion } from "framer-motion";

type CompRow = { label: string; key: string };

export default function ComparePage() {
  const { token } = useAuth();
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [selected, setSelected] = useState<string[]>(["", ""]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      api.getIdeas(token).then((data) => {
        const validated = data.ideas.filter((i) => i.status === "validated" && i.report);
        setIdeas(validated);
        if (validated.length >= 2) setSelected([validated[0].id, validated[1].id]);
      }).finally(() => setLoading(false));
    }
  }, [token]);

  const ideaA = ideas.find((i) => i.id === selected[0]);
  const ideaB = ideas.find((i) => i.id === selected[1]);

  const radarData = ideaA?.report && ideaB?.report ? [
    { subject: "Market", A: ideaA.report.marketScore, B: ideaB.report.marketScore },
    { subject: "Competition", A: ideaA.report.competitorScore, B: ideaB.report.competitorScore },
    { subject: "Monetization", A: ideaA.report.monetizationScore, B: ideaB.report.monetizationScore },
    { subject: "Risk Safety", A: 100 - ideaA.report.riskScore, B: 100 - ideaB.report.riskScore },
    { subject: "Viability", A: ideaA.report.viabilityScore, B: ideaB.report.viabilityScore },
  ] : [];

  const barData = ideaA?.report && ideaB?.report ? [
    { name: "Viability", A: ideaA.report.viabilityScore, B: ideaB.report.viabilityScore },
    { name: "Market", A: ideaA.report.marketScore, B: ideaB.report.marketScore },
    { name: "Competition", A: ideaA.report.competitorScore, B: ideaB.report.competitorScore },
    { name: "Monetization", A: ideaA.report.monetizationScore, B: ideaB.report.monetizationScore },
    { name: "Risk", A: 100 - ideaA.report.riskScore, B: 100 - ideaB.report.riskScore },
  ] : [];

  const rows: CompRow[] = [
    { label: "Viability", key: "viabilityScore" },
    { label: "Market", key: "marketScore" },
    { label: "Competition", key: "competitorScore" },
    { label: "Monetization", key: "monetizationScore" },
    { label: "Risk", key: "riskScore" },
    { label: "Execution", key: "executionComplexity" },
  ];

  const aWins = rows.filter((r) => {
    if (!ideaA?.report || !ideaB?.report) return false;
    const a = ideaA.report[r.key as keyof typeof ideaA.report] as number;
    const b = ideaB.report[r.key as keyof typeof ideaB.report] as number;
    if (r.key === "riskScore" || r.key === "executionComplexity") return a < b;
    return a > b;
  }).length;

  const bWins = rows.length - aWins;

  const handleExportCSV = () => {
    if (!ideaA?.report || !ideaB?.report) return;
    const header = ["Metric", ideaA.title, ideaB.title, "Winner"];
    const csvRows = [header.join(",")];
    for (const row of rows) {
      const a = ideaA.report[row.key as keyof typeof ideaA.report] as number;
      const b = ideaB.report[row.key as keyof typeof ideaB.report] as number;
      let winner = "Tie";
      if (row.key === "riskScore" || row.key === "executionComplexity") {
        if (a < b) winner = ideaA.title;
        else if (b < a) winner = ideaB.title;
      } else {
        if (a > b) winner = ideaA.title;
        else if (b > a) winner = ideaB.title;
      }
      csvRows.push([row.label, a, b, winner].join(","));
    }
    const blob = new Blob([csvRows.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `compare-${ideaA.title.replace(/\s+/g, "-")}-vs-${ideaB.title.replace(/\s+/g, "-")}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return <div className="flex justify-center py-20"><div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" /></div>;
  }

  if (ideas.length < 2) {
    return (
      <div className="max-w-lg mx-auto text-center py-20 animate-slide-up">
          <div className="w-16 h-16 rounded-2xl bg-blue-500/10 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2z" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-white">Not enough validated ideas</h2>
        <p className="text-slate-400 text-sm mt-2">You need at least 2 validated ideas to compare.</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-slide-up">
      <motion.div className="relative rounded-3xl overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-cyan-500/10" />
        <div className="absolute inset-0 bg-[#0c1222]/80 backdrop-blur-xl" />
        <div className="relative px-6 py-8 sm:px-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">Compare Ideas</h1>
            <p className="text-sm text-slate-400 mt-1">Side-by-side analysis of your validated ideas</p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {ideaA?.report && ideaB?.report && (
              <button onClick={handleExportCSV} className="px-3 py-1.5 rounded-xl border border-white/[0.06] bg-white/[0.05] text-xs font-medium text-slate-300 hover:bg-white/[0.08] transition-colors flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Export CSV
              </button>
            )}
            {aWins > bWins && ideaA && (
              <span className="px-3 py-1 rounded-full bg-emerald-500/15 text-xs font-bold text-emerald-400 border border-emerald-500/30">
                {ideaA.title} leads
              </span>
            )}
            {bWins > aWins && ideaB && (
              <span className="px-3 py-1 rounded-full bg-emerald-500/15 text-xs font-bold text-emerald-400 border border-emerald-500/30">
                {ideaB.title} leads
              </span>
            )}
            {aWins === bWins && (
              <span className="px-3 py-1 rounded-full bg-amber-500/15 text-xs font-bold text-amber-400 border border-amber-500/30">
                It&apos;s a tie
              </span>
            )}
          </div>
        </div>
      </motion.div>

      <motion.div className="grid sm:grid-cols-2 gap-4" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        {[0, 1].map((idx) => (
          <div key={idx}>
            <label className="text-sm font-medium text-white mb-1 block">Idea {idx === 0 ? "A" : "B"}</label>
            <select value={selected[idx]} onChange={(e) => {
              const next = [...selected];
              next[idx] = e.target.value;
              setSelected(next);
            }} className="w-full px-4 py-2.5 rounded-xl border border-white/[0.06] bg-white/[0.05] text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20">
              {ideas.map((idea) => (
                <option key={idea.id} value={idea.id} disabled={idea.id === selected[1 - idx]}>{idea.title}</option>
              ))}
            </select>
          </div>
        ))}
      </motion.div>

      {ideaA?.report && ideaB?.report && (
        <>
          <div className="grid lg:grid-cols-2 gap-4">
            <motion.div className="card-base rounded-2xl p-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <h3 className="text-sm font-semibold text-white mb-4">Radar Comparison</h3>
              <ResponsiveContainer width="100%" height={320}>
                <RadarChart data={radarData}>
                  <PolarGrid stroke="rgba(255,255,255,0.06)" className="dark:stroke-white/10" />
                  <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11 }} stroke="rgba(148,163,184,0.5)" />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="rgba(148,163,184,0.5)" />
                   <Radar name={ideaA.title} dataKey="A" stroke="#6366F1" fill="#6366F1" fillOpacity={0.3} />
                   <Radar name={ideaB.title} dataKey="B" stroke="#A855F7" fill="#A855F7" fillOpacity={0.3} />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <Tooltip contentStyle={{ backgroundColor: "#1E293B", border: "1px solid #334155", borderRadius: "12px", fontSize: 12, color: "#F1F5F9" }} />
                </RadarChart>
              </ResponsiveContainer>
            </motion.div>
            <motion.div className="card-base rounded-2xl p-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
              <h3 className="text-sm font-semibold text-white mb-4">Score Breakdown</h3>
              <ResponsiveContainer width="100%" height={320}>
                <BarChart data={barData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" className="dark:stroke-white/10" />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} stroke="rgba(148,163,184,0.5)" />
                  <YAxis domain={[0, 100]} stroke="rgba(148,163,184,0.5)" />
                  <Tooltip contentStyle={{ backgroundColor: "#1E293B", border: "1px solid #334155", borderRadius: "12px", fontSize: 12, color: "#F1F5F9" }} />
                  <Bar dataKey="A" fill="#6366F1" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="B" fill="#A855F7" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </motion.div>
          </div>

          <motion.div className="card-base rounded-2xl overflow-hidden" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <table className="w-full text-sm">
              <thead className="bg-white/[0.03]">
                <tr>
                  <th className="text-left px-4 py-3 font-medium text-white">Metric</th>
                  <th className="text-center px-4 py-3 font-medium text-indigo-400">{ideaA.title}</th>
                  <th className="text-center px-4 py-3 font-medium text-violet-400">{ideaB.title}</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => {
                  const a = ideaA.report![row.key as keyof typeof ideaA.report] as number;
                  const b = ideaB.report![row.key as keyof typeof ideaB.report] as number;
                  return (
                    <tr key={row.key} className="border-t border-white/[0.06] hover:bg-white/[0.02] transition-colors">
                      <td className="px-4 py-3 font-medium text-white">{row.label}</td>
                      <td className={`text-center px-4 py-3 font-semibold ${a > b ? "text-emerald-400" : a < b ? "text-red-500" : "text-white"}`}>{a}{row.key === "riskScore" || row.key === "executionComplexity" ? "" : "%"}</td>
                      <td className={`text-center px-4 py-3 font-semibold ${b > a ? "text-emerald-400" : b < a ? "text-red-500" : "text-white"}`}>{b}{row.key === "riskScore" || row.key === "executionComplexity" ? "" : "%"}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </motion.div>
        </>
      )}
    </div>
  );
}
