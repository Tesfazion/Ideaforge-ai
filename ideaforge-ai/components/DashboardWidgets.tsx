"use client";
import { useMemo } from "react";
import { useIsDarkTheme } from "@/lib/theme";

function useInkColor() {
  const isDark = useIsDarkTheme();
  return isDark ? "#f8fafc" : "#0b1220";
}

function useMutedColor() {
  const isDark = useIsDarkTheme();
  return isDark ? "#94a3b8" : "#64748b";
}

function useTrackColor() {
  const isDark = useIsDarkTheme();
  return isDark ? "rgba(255,255,255,0.10)" : "rgba(15,23,42,0.08)";
}

export function AnimatedRing({ value, max = 100, size = 120, strokeWidth = 8, color = "#007ACC", sublabel }: {
  value: number; max?: number; size?: number; strokeWidth?: number; color?: string; sublabel?: string;
}) {
  const ink = useInkColor();
  const muted = useMutedColor();
  const track = useTrackColor();
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const pct = Math.min(value / max, 1);
  const offset = circumference * (1 - pct);
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={track} strokeWidth={strokeWidth} />
          <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={color} strokeWidth={strokeWidth}
            strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round"
            className="transition-all duration-700 ease-out" />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-heading text-2xl font-bold" style={{ color: ink }}>{Math.round(pct * 100)}%</span>
        </div>
      </div>
      {sublabel && <p className="text-[11px] font-medium" style={{ color: muted }}>{sublabel}</p>}
    </div>
  );
}

export function MiniSparkline({ data, color = "#007ACC" }: { data: number[]; color?: string }) {
  if (data.length < 2) return <div className="h-6 w-16" />;
  const max = Math.max(...data, 1);
  const min = Math.min(...data, 0);
  const range = max - min || 1;
  const w = 64;
  const h = 24;
  const points = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - ((v - min) / range) * h}`).join(" ");
  return (
    <svg width={w} height={h} className="overflow-visible" aria-hidden="true">
      <polyline points={points} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity={0.85} />
    </svg>
  );
}

export function ScoreRing({ score, size = 48 }: { score: number; size?: number }) {
  const color = score >= 80 ? "#12824f" : score >= 60 ? "#007ACC" : score >= 40 ? "#b06a12" : "#c02b2b";
  const ink = useInkColor();
  const track = useTrackColor();
  const radius = (size - 6) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - score / 100);
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90" aria-hidden="true">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={track} strokeWidth={3} />
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={color} strokeWidth={3}
          strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round" />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-xs font-bold tabular-nums" style={{ color: ink }}>{score}</span>
      </div>
    </div>
  );
}

export function ContributionGrid({ ideas }: { ideas: { createdAt: string }[] }) {
  const isDark = useIsDarkTheme();
  const weeks = 16;
  const cellSize = 13;

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

  const empty = isDark ? "rgba(255,255,255,0.07)" : "#eef2f7";
  const getColor = (count: number) => {
    if (count === 0) return empty;
    if (count === 1) return "rgba(0,122,204,0.28)";
    if (count === 2) return "rgba(0,122,204,0.48)";
    if (count === 3) return "rgba(0,122,204,0.7)";
    return "#007acc";
  };

  return (
    <div className="overflow-x-auto scrollbar-hide">
      <div className="flex gap-[3px]">
        {grid.map((week, wi) => (
          <div key={wi} className="flex flex-col gap-[3px]">
            {week.map((cell, di) => (
              <div
                key={di}
                className="rounded-[3px] transition-transform hover:scale-110"
                style={{ width: cellSize, height: cellSize, backgroundColor: getColor(cell.count) }}
                title={`${cell.date.toLocaleDateString()}: ${cell.count} idea${cell.count !== 1 ? "s" : ""}`}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
