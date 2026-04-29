import React from 'react';

interface FeatureCardProps {
  title: string;
  body: string;
}

export const FeatureCard: React.FC<FeatureCardProps> = ({ title, body }) => {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
      <p className="text-base font-semibold text-white">{title}</p>
      <p className="mt-1 text-sm text-slate-400">{body}</p>
    </div>
  );
};
