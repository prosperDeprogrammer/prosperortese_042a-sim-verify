import React from 'react';

interface CheckCardProps {
  title: string;
  passed: boolean;
  passText: string;
  failText: string;
}

export const CheckCard: React.FC<CheckCardProps> = ({
  title,
  passed,
  passText,
  failText,
}) => {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3">
      <div className="mb-1 flex items-center justify-between gap-2">
        <p className="font-semibold text-white">{title}</p>
        <span
          className={`rounded border px-2 py-0.5 text-xs ${passed
            ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-300"
            : "border-rose-500/40 bg-rose-500/10 text-rose-300"
            }`}
        >
          {passed ? "Pass" : "Fail"}
        </span>
      </div>
      <p className="text-sm text-slate-400">{passed ? passText : failText}</p>
    </div>
  );
};
