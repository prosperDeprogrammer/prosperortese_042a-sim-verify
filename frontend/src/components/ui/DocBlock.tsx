import React from 'react';

interface DocBlockProps {
  title: string;
  body: string;
}

export const DocBlock: React.FC<DocBlockProps> = ({ title, body }) => {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-950 p-3">
      <p className="mb-1 font-medium text-white">{title}</p>
      <pre className="overflow-x-auto text-xs text-cyan-200">{body}</pre>
    </div>
  );
};
