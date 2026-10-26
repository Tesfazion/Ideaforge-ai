"use client";
import { useEffect, useState, useMemo } from "react";
import { useAuth } from "@/lib/auth";
import { api, Idea } from "@/lib/api";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, CartesianGrid } from "recharts";
import { motion } from "framer-motion";
import { useChartTheme } from "@/lib/theme";

export default function InsightsPage() {
  const { token } = useAuth();
  const chartPalette = useChartTheme();
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      api.getIdeas(token).then((data) => setIdeas(data.ideas)).finally(() => setLoading(false));
    }
  }, [token]);

  const validated = useMemo(() => ideas.filter((i) => i.status === "validated" && i.report), [ideas]);
  const failed = useMemo(() => ideas.filter((i) => i.status === "failed"), [ideas]);
  const pending = useMemo(() => ideas.filter((i) => i.status === "pending" || i.status === "processing"), [ideas]);

  const scoreByIndustry = useMemo(() => {
    const map: Record<string, { scores: number[]; count: number }> = {};
    validated.forEach((i) => {
      const ind = i.industry || "Uncategorized";
      if (!map[ind]) map[ind] = { scores: [], count: 0 };
      map[ind].scores.push(i.report!.viabilityScore);
      map[ind].count++;
    });
    return Object.entries(map)
      .map(([name, v]) => ({ name, avgScore: Math.round(v.scores.reduce((a, b) => a + b, 0) / v.scores.length), count: v.count }))
      .sort((a, b) => b.avgScore - a.avgScore);
  }, [validated]);

  const executionData = useMemo(() => {
    const buckets = [0, 0, 0];
    validated.forEach((i) => {
      const ec = i.report!.executionComplexity;
      if (ec <= 3) buckets[0]++;
      else if (ec <= 6) buckets[1]++;
      else buckets[2]++;
    });
    return [
      { name: "Low (1-3)", value: buckets[0], color: "#22C55E" },
      { name: "Medium (4-6)", value: buckets[1], color: "#F59E0B" },
      { name: "High (7-10)", value: buckets[2], color: "#EF4444" },
    ];
  }, [validated]);

  const successByScope = useMemo(() => {
    const map: Record<string, { total: number; validated: number }> = {};
    ideas.forEach((i) => {
      const scope = i.marketScope || "global";
      if (!map[scope]) map[scope] = { total: 0, validated: 0 };
      map[scope].total++;
      if (i.status === "validated") map[scope].validated++;
    });
    return Object.entries(map).map(([name, v]) => ({ name, rate: v.total > 0 ? Math.round((v.validated / v.total) * 100) : 0 }));
  }, [ideas]);

  if (loading) return <div className="flex justify-center py-20"><div className="w-8 h-8 border-4 border-sky-500 border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-slide-up">
      <motion.div className="relative rounded-3xl overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-sky-500/10 via-sky-400/5 to-orange-500/10" />
        <div className="absolute inset-0 bg-[#0c1222]/80 backdrop-blur-xl" />
        <div className="relative px-6 py-8 sm:px-10">
          <h1 className="text-2xl font-bold text-white mb-1">Insights & Analytics</h1>
          <p className="text-sm text-slate-400">Deep dive into your validation performance and patterns</p>
        </div>
      </motion.div>

      <motion.div className="grid sm:grid-cols-3 gap-4" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        {[
          { label: "Validated", value: validated.length, color: "text-emerald-400", bg: "bg-emerald-500/10" },
          { label: "Pending", value: pending.length, color: "text-amber-400", bg: "bg-amber-500/10" },
          { label: "Failed", value: failed.length, color: "text-red-400", bg: "bg-red-500/10" },
        ].map((s) => (
          <div key={s.label} className="card-base rounded-xl p-5 text-center group hover:scale-[1.02] transition-transform">
            <p className={`text-3xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-slate-400 mt-1">{s.label}</p>
          </div>
        ))}
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-4">
        <motion.div className="card-base rounded-2xl p-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <h3 className="text-sm font-semibold text-white mb-4">Average Score by Industry</h3>
          {scoreByIndustry.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={scoreByIndustry}>
                <CartesianGrid strokeDasharray="3 3" stroke={chartPalette.grid} />
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: chartPalette.axis }} stroke={chartPalette.axis} />
                <YAxis domain={[0, 100]} tick={{ fill: chartPalette.axis }} stroke={chartPalette.axis} />
                <Tooltip contentStyle={{ backgroundColor: chartPalette.tooltip, border: `1px solid ${chartPalette.tooltipBorder}`, borderRadius: "12px", fontSize: 12, color: chartPalette.text }} />
                <Bar dataKey="avgScore" radius={[6, 6, 0, 0]}>
                  {scoreByIndustry.map((entry, i) => <Cell key={i} fill={["#007ACC", "#EF842B", "#22C55E", "#F59E0B", "#EF4444", "#62AEE3"][i % 6]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[200px] flex items-center justify-center text-xs text-slate-500">Submit ideas to see industry insights</div>
          )}
        </motion.div>
        <motion.div className="card-base rounded-2xl p-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <h3 className="text-sm font-semibold text-white mb-4">Execution Complexity Distribution</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={executionData}>
              <CartesianGrid strokeDasharray="3 3" stroke={chartPalette.grid} />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: chartPalette.axis }} stroke={chartPalette.axis} />
              <YAxis allowDecimals={false} tick={{ fill: chartPalette.axis }} stroke={chartPalette.axis} />
              <Tooltip contentStyle={{ backgroundColor: chartPalette.tooltip, border: `1px solid ${chartPalette.tooltipBorder}`, borderRadius: "12px", fontSize: 12, color: chartPalette.text }} />
              <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                {executionData.map((entry) => <Cell key={entry.name} fill={entry.color} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      <motion.div className="card-base rounded-2xl p-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <h3 className="text-sm font-semibold text-white mb-4">Validation Success Rate by Market Scope</h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={successByScope}>
            <CartesianGrid strokeDasharray="3 3" stroke={chartPalette.grid} />
            <XAxis dataKey="name" tick={{ fontSize: 11, fill: chartPalette.axis }} stroke={chartPalette.axis} />
            <YAxis domain={[0, 100]} tick={{ fill: chartPalette.axis }} stroke={chartPalette.axis} />
            <Tooltip contentStyle={{ backgroundColor: chartPalette.tooltip, border: `1px solid ${chartPalette.tooltipBorder}`, borderRadius: "12px", fontSize: 12, color: chartPalette.text }} />
            <Bar dataKey="rate" fill="#007ACC" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>
    </div>
  );
}
