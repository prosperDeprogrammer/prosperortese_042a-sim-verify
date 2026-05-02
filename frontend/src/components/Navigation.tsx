import React, { useState } from 'react';

export const Navbar: React.FC<{ onNavigate: (page: any) => void }> = ({ onNavigate }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleNavigate = (page: any) => {
    onNavigate(page);
    setIsMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-dark-950/90 backdrop-blur-xl border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 md:px-8 h-16 md:h-24 flex items-center justify-between">
        {/* Logo */}
        <div
          className="flex items-center gap-3 cursor-pointer group"
          onClick={() => handleNavigate('landing')}
        >
          <div className="w-9 h-9 md:w-12 md:h-12 bg-gradient-to-br from-brand-600 to-brand-700 rounded-xl flex items-center justify-center shadow-glow group-hover:scale-105 transition-transform">
            <svg className="w-5 h-5 md:w-7 md:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-7.618 3.072a11.955 11.955 0 00-6.382 17.923c4.41 4.493 11.526 8.238 12 9.61 0.474-1.372 7.59-5.117 12-9.61a11.955 11.955 0 00-6.382-17.923z" />
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="text-xl md:text-2xl font-black font-outfit tracking-tighter text-white leading-none">
              SimVerify <span className="text-brand-500">Pro</span>
            </span>
            <div className="flex items-center gap-1 mt-1">
              <span className="text-[7px] md:text-[8px] text-brand-400/80 font-black tracking-widest uppercase">GSMA</span>
              <span className="text-[7px] md:text-[8px] text-dark-500 font-bold tracking-widest uppercase">OPEN GATEWAY</span>
            </div>
          </div>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          <button onClick={() => handleNavigate('dashboard')} className="text-dark-400 hover:text-brand-400 transition-colors font-medium text-sm tracking-wide">Dashboard</button>
          <button onClick={() => handleNavigate('docs')} className="text-dark-400 hover:text-brand-400 transition-colors font-medium text-sm tracking-wide">Docs</button>

          <div className="flex items-center gap-4 ml-4">
            <button onClick={() => handleNavigate('input')} className="text-brand-400 border border-brand-500/30 hover:bg-brand-500/10 px-6 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest transition-all">
              API Sandbox
            </button>
            <button onClick={() => handleNavigate('auth')} className="btn-primary px-8 py-2.5 font-black text-xs uppercase tracking-widest">
              Get Started
            </button>
          </div>
        </div>

        {/* Mobile Hamburger Toggle */}
        <button
          className="md:hidden w-10 h-10 flex items-center justify-center text-dark-300 hover:text-white transition-colors"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-dark-950/95 backdrop-blur-2xl border-b border-white/5 p-6 space-y-6 animate-fade-in shadow-2xl">
          <div className="flex flex-col gap-3">
            <button
              onClick={() => handleNavigate('docs')}
              className="w-full text-left p-4 rounded-xl bg-dark-900/50 text-dark-200 font-medium tracking-wide text-sm"
            >
              Documentation
            </button>
            <button
              onClick={() => handleNavigate('dashboard')}
              className="w-full text-left p-4 rounded-xl bg-dark-900/50 text-dark-200 font-medium tracking-wide text-sm"
            >
              Dashboard
            </button>
            <button
              onClick={() => handleNavigate('input')}
              className="w-full text-center p-4 rounded-xl border border-brand-500/30 text-brand-400 font-black tracking-widest text-xs uppercase"
            >
              API Sandbox
            </button>
            <button
              onClick={() => handleNavigate('auth')}
              className="btn-primary w-full py-4 font-black tracking-widest text-xs uppercase"
            >
              Get Started
            </button>
          </div>
          <div className="pt-4 border-t border-white/5 flex justify-center gap-4 text-dark-600 text-[10px] font-mono uppercase tracking-[0.2em]">
            <span>v1.0.4 Live</span>
            <span>•</span>
            <span>Nokia NaC</span>
          </div>
        </div>
      )}
    </nav>
  );
};

export const Footer: React.FC<{ onNavigate: (page: any) => void }> = ({ onNavigate }) => (
  <footer className="py-10 md:py-16 border-t border-dark-800 bg-dark-950">
    <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8 text-center md:text-left">
      <div>
        <p className="text-white font-bold text-sm mb-2">SimVerify Pro</p>
        <p className="text-dark-400 text-xs md:text-sm max-w-xs">Stopping SIM-swap and OTP fraud with telecom intelligence.</p>
      </div>
      <div className="flex flex-col items-center md:items-end gap-5">
        <div className="flex flex-wrap justify-center md:justify-end gap-6 text-xs font-medium text-dark-400">
          <span className="flex items-center gap-2 text-dark-300">
            <div className="w-2 h-2 bg-safe rounded-full animate-pulse"></div> Network Live
          </span>
          <button onClick={() => onNavigate('privacy')} className="hover:text-brand-400 transition-colors">Privacy Policy</button>
          <button onClick={() => onNavigate('terms')} className="hover:text-brand-400 transition-colors">Terms of Service</button>
          <button onClick={() => onNavigate('docs')} className="hover:text-brand-400 transition-colors">API Docs</button>
        </div>
        <p className="text-dark-400 text-[10px] font-bold font-mono uppercase tracking-widest">© 2026 GSMA OPEN GATEWAY INITIATIVE</p>
      </div>
    </div>
  </footer>
);
