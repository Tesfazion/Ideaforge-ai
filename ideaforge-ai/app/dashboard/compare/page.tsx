"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth";
import { api, Idea } from "@/lib/api";
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, Legend, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";

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

  if (loading) {
    return <div className="flex justify-center py-20"><div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" /></div>;
  }

  if (ideas.length < 2) {
    return (
      <div className="max-w-lg mx-auto text-center py-20">
        <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2z" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Not enough validated ideas</h2>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">You need at least 2 validated ideas to compare.</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-slide-up">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Compare Ideas</h1>
        <div className="flex items-center gap-2">
          {aWins > bWins && ideaA && (
            <span className="px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-500/15 text-xs font-bold text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30">
              {ideaA.title} leads
            </span>
          )}
          {bWins > aWins && ideaB && (
            <span className="px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-500/15 text-xs font-bold text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30">
              {ideaB.title} leads
            </span>
          )}
          {aWins === bWins && (
            <span className="px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-500/15 text-xs font-bold text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-500/30">
              It&apos;s a tie
            </span>
          )}
        </div>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        {[0, 1].map((idx) => (
          <div key={idx}>
            <label className="text-sm font-medium text-gray-900 dark:text-gray-200 mb-1 block">Idea {idx === 0 ? "A" : "B"}</label>
            <select value={selected[idx]} onChange={(e) => {
              const next = [...selected];
              next[idx] = e.target.value;
              setSelected(next);
            }} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20">
              {ideas.map((idea) => (
                <option key={idea.id} value={idea.id} disabled={idea.id === selected[1 - idx]}>{idea.title}</option>
              ))}
            </select>
          </div>
        ))}
      </div>

      {ideaA?.report && ideaB?.report && (
        <>
          <div className="grid lg:grid-cols-2 gap-4">
            <div className="card-base rounded-2xl p-6">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Radar Comparison</h3>
              <ResponsiveContainer width="100%" height={320}>
                <RadarChart data={radarData}>
                  <PolarGrid stroke="#E2E8F0" className="dark:stroke-gray-700" />
                  <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11 }} stroke="#94A3B8" />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#94A3B8" />
                  <Radar name={ideaA.title} dataKey="A" stroke="#6366F1" fill="#6366F1" fillOpacity={0.3} />
                  <Radar name={ideaB.title} dataKey="B" stroke="#A855F7" fill="#A855F7" fillOpacity={0.3} />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <Tooltip contentStyle={{ backgroundColor: "#1E293B", border: "1px solid #334155", borderRadius: "12px", fontSize: 12, color: "#F1F5F9" }} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
            <div className="card-base rounded-2xl p-6">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Score Breakdown</h3>
              <ResponsiveContainer width="100%" height={320}>
                <BarChart data={barData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" className="dark:stroke-gray-700" />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} stroke="#94A3B8" />
                  <YAxis domain={[0, 100]} stroke="#94A3B8" />
                  <Tooltip contentStyle={{ backgroundColor: "#1E293B", border: "1px solid #334155", borderRadius: "12px", fontSize: 12, color: "#F1F5F9" }} />
                  <Bar dataKey="A" fill="#6366F1" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="B" fill="#A855F7" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="card-base rounded-2xl overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 dark:bg-gray-800/50">
                <tr>
                  <th className="text-left px-4 py-3 font-medium text-gray-900 dark:text-gray-200">Metric</th>
                  <th className="text-center px-4 py-3 font-medium text-indigo-600 dark:text-indigo-400">{ideaA.title}</th>
                  <th className="text-center px-4 py-3 font-medium text-violet-600 dark:text-violet-400">{ideaB.title}</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => {
                  const a = ideaA.report![row.key as keyof typeof ideaA.report] as number;
                  const b = ideaB.report![row.key as keyof typeof ideaB.report] as number;
                  return (
                    <tr key={row.key} className="border-t border-gray-100 dark:border-gray-800">
                      <td className="px-4 py-3 font-medium text-gray-900 dark:text-gray-200">{row.label}</td>
                      <td className={`text-center px-4 py-3 font-semibold ${a > b ? "text-emerald-600 dark:text-emerald-400" : a < b ? "text-red-500" : "text-gray-900 dark:text-white"}`}>{a}{row.key === "riskScore" || row.key === "executionComplexity" ? "" : "%"}</td>
                      <td className={`text-center px-4 py-3 font-semibold ${b > a ? "text-emerald-600 dark:text-emerald-400" : b < a ? "text-red-500" : "text-gray-900 dark:text-white"}`}>{b}{row.key === "riskScore" || row.key === "executionComplexity" ? "" : "%"}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
