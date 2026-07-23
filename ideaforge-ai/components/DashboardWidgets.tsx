"use client";
import { useMemo } from "react";

export function AnimatedRing({ value, max = 100, size = 120, strokeWidth = 8, color = "#6366F1", sublabel }: {
  value: number; max?: number; size?: number; strokeWidth?: number; color?: string; sublabel?: string;
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const pct = Math.min(value / max, 1);
  const offset = circumference * (1 - pct);
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth={strokeWidth} />
          <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={color} strokeWidth={strokeWidth}
            strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round"
            className="transition-all duration-1000 ease-out" style={{ filter: `drop-shadow(0 0 6px ${color}40)` }} />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl font-bold text-white">{Math.round(pct * 100)}%</span>
        </div>
      </div>
      {sublabel && <p className="text-[10px] text-slate-500">{sublabel}</p>}
    </div>
  );
}

export function MiniSparkline({ data, color = "#6366F1" }: { data: number[]; color?: string }) {
  if (data.length < 2) return <div className="w-16 h-6" />;
  const max = Math.max(...data, 1);
  const min = Math.min(...data, 0);
  const range = max - min || 1;
  const w = 64;
  const h = 24;
  const points = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - ((v - min) / range) * h}`).join(" ");
  return (
    <svg width={w} height={h} className="overflow-visible">
      <polyline points={points} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function ScoreRing({ score, size = 48 }: { score: number; size?: number }) {
  const color = score >= 80 ? "#22C55E" : score >= 60 ? "#6366F1" : score >= 40 ? "#F59E0B" : "#EF4444";
  const radius = (size - 6) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - score / 100);
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth={3} />
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={color} strokeWidth={3}
          strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round"
          style={{ filter: `drop-shadow(0 0 4px ${color}50)` }} />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-xs font-bold text-white">{score}</span>
      </div>
    </div>
  );
}

export function ContributionGrid({ ideas }: { ideas: { createdAt: string }[] }) {
  const weeks = 16;
  const cellSize = 14;

  const grid = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const startDate = new Date(today);
    startDate.setDate(startDate.getDate() - (weeks * 7 - 1));
    startDate.setHours(0, 0, 0, 0);

    const counts: Record<string, number> = {};
    ideas.forEach((i) => {
      const d = new Date(i.createdAt).toDateString();
      counts[d] = (counts[d] || 0) + 1;
    });

    const cells: { date: Date; count: number; dayIdx: number }[][] = [];
    const current = new Date(startDate);
    for (let w = 0; w < weeks; w++) {
      const week: { date: Date; count: number; dayIdx: number }[] = [];
      for (let d = 0; d < 7; d++) {
        const dateStr = current.toDateString();
        week.push({ date: new Date(current), count: counts[dateStr] || 0, dayIdx: d });
        current.setDate(current.getDate() + 1);
      }
      cells.push(week);
    }
    return cells;
  }, [ideas]);

  const getColor = (count: number) => {
    if (count === 0) return "bg-white/[0.03]";
    if (count === 1) return "bg-indigo-500/30";
    if (count === 2) return "bg-indigo-500/50";
    if (count === 3) return "bg-indigo-500/70";
    return "bg-indigo-500/90";
  };

  return (
    <div className="overflow-x-auto scrollbar-hide">
      <div className="flex gap-[3px]">
        {grid.map((week, wi) => (
          <div key={wi} className="flex flex-col gap-[3px]">
            {week.map((cell, di) => (
              <div key={di}
                className={`${getColor(cell.count)} rounded-[3px] transition-colors hover:ring-1 hover:ring-white/20`}
                style={{ width: cellSize, height: cellSize }}
                title={`${cell.date.toLocaleDateString()}: ${cell.count} idea${cell.count !== 1 ? "s" : ""}`} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
