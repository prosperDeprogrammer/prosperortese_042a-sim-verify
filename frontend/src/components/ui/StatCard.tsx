import React from 'react';

interface StatCardProps {
  label: string;
  value: string;
  tone?: "default" | "safe" | "warn" | "danger";
}

const toneMap: Record<string, string> = {
  default: "text-cyan-200 border-cyan-500/30",
  safe: "text-emerald-300 border-emerald-500/30",
  warn: "text-amber-300 border-amber-500/30",
  danger: "text-rose-300 border-rose-500/30",
};

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  tone = "default",
}) => {
  return (
    <div className={`rounded-xl border bg-slate-900/60 p-3 ${toneMap[tone]}`}>
      <p className="text-xs uppercase tracking-[0.14em] text-slate-400">{label}</p>
      <p className="mt-1 text-3xl font-bold text-white">{value}</p>
    </div>
  );
};
