"use client";
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer } from "recharts";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from "recharts";
import { PieChart, Pie, Cell as PieCell, Tooltip as PieTooltip, Legend } from "recharts";
import { useChartTheme } from "@/lib/theme";

function BarSkeleton() {
  return (
    <div className="space-y-3 animate-pulse">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="flex items-center gap-3">
          <div className="w-20 h-3 bg-gray-200 dark:bg-gray-700 rounded" />
          <div className="flex-1 h-3 bg-gray-200 dark:bg-gray-700 rounded-full" />
          <div className="w-8 h-3 bg-gray-200 dark:bg-gray-700 rounded" />
        </div>
      ))}
    </div>
  );
}

function CircleSkeleton() {
  return (
    <div className="flex justify-center gap-6 animate-pulse">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="flex flex-col items-center">
          <div className="w-[90px] h-[90px] rounded-full bg-gray-200 dark:bg-gray-700" />
          <div className="w-12 h-2 bg-gray-200 dark:bg-gray-700 rounded mt-2" />
        </div>
      ))}
    </div>
  );
}

function DimensionSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      {[...Array(9)].map((_, i) => (
        <div key={i}>
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-gray-200 dark:bg-gray-700" />
              <div className="w-28 h-3 bg-gray-200 dark:bg-gray-700 rounded" />
            </div>
            <div className="w-8 h-3 bg-gray-200 dark:bg-gray-700 rounded" />
          </div>
          <div className="w-full h-2.5 rounded-full bg-gray-200 dark:bg-gray-700" />
        </div>
      ))}
    </div>
  );
}

function ChartSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="w-32 h-4 bg-gray-200 dark:bg-gray-700 rounded mb-3" />
      <div className="w-full h-[280px] bg-gray-100 dark:bg-gray-800 rounded-xl" />
    </div>
  );
}

export function LazyRadarChart({ data }: { data: { subject: string; value: number }[] }) {
  const palette = useChartTheme();
  return (
    <ResponsiveContainer width="100%" height={280}>
      <RadarChart data={data}>
        <PolarGrid stroke={palette.grid} />
        <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fill: palette.axis }} stroke={palette.axis} />
        <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 10, fill: palette.axis }} stroke={palette.axis} />
        <Radar name="Score" dataKey="value" stroke="#6366F1" fill="#6366F1" fillOpacity={0.3} />
      </RadarChart>
    </ResponsiveContainer>
  );
}

export function LazyBarChart({ data }: { data: { name: string; value: number; color: string }[] }) {
  const palette = useChartTheme();
  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={data}>
        <XAxis dataKey="name" tick={{ fontSize: 11, fill: palette.axis }} stroke={palette.axis} />
        <YAxis domain={[0, 100]} tick={{ fill: palette.axis }} stroke={palette.axis} />
        <Tooltip contentStyle={{ backgroundColor: palette.tooltip, border: `1px solid ${palette.tooltipBorder}`, borderRadius: "12px", fontSize: 12, color: palette.text }} />
        <Bar dataKey="value" radius={[6, 6, 0, 0]}>
          {data.map((entry, i) => <Cell key={i} fill={entry.color} />)}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

export function LazyPieChart({ data, colors }: { data: { name: string; value: number }[]; colors: string[] }) {
  const palette = useChartTheme();
  return (
    <ResponsiveContainer width="100%" height={200}>
      <PieChart>
        <Pie data={data} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" paddingAngle={4}>
          {data.map((_, i) => <PieCell key={i} fill={colors[i]} />)}
        </Pie>
        <PieTooltip contentStyle={{ backgroundColor: palette.tooltip, border: `1px solid ${palette.tooltipBorder}`, borderRadius: "12px", fontSize: 12, color: palette.text }} />
        <Legend wrapperStyle={{ fontSize: 11, color: palette.text }} />
      </PieChart>
    </ResponsiveContainer>
  );
}

export function LazyDashboardBarChart({ data }: { data: { name: string; value: number }[] }) {
  const palette = useChartTheme();
  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={data}>
        <XAxis dataKey="name" tick={{ fontSize: 11, fill: palette.axis }} stroke={palette.axis} />
        <YAxis allowDecimals={false} tick={{ fill: palette.axis }} stroke={palette.axis} />
        <Tooltip contentStyle={{ backgroundColor: palette.tooltip, border: `1px solid ${palette.tooltipBorder}`, borderRadius: "12px", fontSize: 12, color: palette.text }} />
        <Bar dataKey="value" fill="#6366F1" radius={[6, 6, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export { BarSkeleton, CircleSkeleton, DimensionSkeleton, ChartSkeleton };
