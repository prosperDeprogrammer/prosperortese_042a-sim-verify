import React from 'react';

interface PricingCardProps {
  title: string;
  price: string;
  subtitle: string;
  bullets: string[];
  featured?: boolean;
  isActive?: boolean;
  onClick?: () => void;
}

export const PricingCard: React.FC<PricingCardProps> = ({
  title,
  price,
  subtitle,
  bullets,
  featured = false,
  isActive = false,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      role={onClick ? "button" : undefined}
      className={`rounded-2xl border p-4 transition duration-300 relative ${onClick ? "cursor-pointer hover:scale-105 shadow-lg" : ""} ${isActive
        ? "border-emerald-500/60 bg-emerald-500/10 ring-1 ring-emerald-500/30"
        : featured
          ? "border-cyan-500/50 bg-cyan-500/10"
          : "border-slate-800 bg-slate-900/70 hover:border-slate-700"
        }`}
    >
      {isActive && (
        <span className="absolute top-3 right-3 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5">
          Your Plan
        </span>
      )}
      <p className="text-sm uppercase tracking-[0.16em] text-slate-400">{title}</p>
      <p className="mt-2 text-3xl font-bold text-white">{price}</p>
      <p className="mt-1 text-sm text-slate-300">{subtitle}</p>
      <ul className="mt-3 space-y-1 text-sm text-slate-300">
        {bullets.map((item) => (
          <li key={item}>- {item}</li>
        ))}
      </ul>
    </div>
  );
};
