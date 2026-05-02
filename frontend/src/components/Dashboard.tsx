import React, { useMemo } from 'react';
import { getCamaraStats, getCamaraHistory } from '../api/mockService';

export const Dashboard: React.FC = () => {
  const stats = useMemo(() => getCamaraStats(), []);
  const history = useMemo(() => getCamaraHistory(), []);
  const [copied, setCopied] = React.useState(false);

  const copySnippet = () => {
    navigator.clipboard.writeText('<script src="https://cdn.simverify.pro/v1/badge.js" data-id="MERCHANT_ID"></script>');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="pt-24 md:pt-32 pb-20 px-4 md:px-6 max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl md:text-4xl font-extrabold text-white font-outfit">Fraud Monitoring</h1>
            <span className="bg-brand-500/10 text-brand-400 text-[9px] font-bold px-2 py-1 rounded border border-brand-500/20 tracking-widest uppercase">Live Nodes</span>
          </div>
          <p className="text-dark-400 text-sm md:text-lg max-w-2xl">
            Real-time identity verification signals for African Fintechs and E-commerce platforms. 
            <span className="hidden md:inline"> Built on enterprise-grade network infrastructure.</span>
          </p>
        </div>
        <div className="w-full md:w-auto bg-dark-900 border border-dark-800 rounded-2xl px-5 py-3 text-dark-300 text-xs font-mono flex items-center justify-between md:justify-start gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-safe rounded-full animate-pulse"></span>
            <span className="uppercase tracking-tighter">Gateway Status: Stable</span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-10 md:mb-12">
        {[
          { label: 'Safety Checks', value: stats.totalApiCalls, color: 'text-brand-400', icon: 'M13 10V3L4 14h7v7l9-11h-7z', trend: 'Active' },
          { label: 'Attacks Stopped', value: stats.fraudCasesDetected, color: 'text-danger', icon: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z', trend: '+100%' },
          { label: 'SIM Swap Risks', value: stats.simSwapAlerts, color: 'text-accent-400', icon: 'M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A10.003 10.003 0 0012 20c4.083 0 7.774-2.422 9.456-5.908M12 4a10.003 10.003 0 00-9.456 5.908M12 4v10M12 4a10.003 10.003 0 019.456 5.908M12 4v10m0 0l3.14-3.14M12 14l-3.14-3.14', trend: 'Critical' },
          { label: 'Zone Anomaly', value: stats.locationMismatchAlerts, color: 'text-suspicious', icon: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z', trend: 'Watchlist' },
        ].map((stat, i) => (
          <div key={i} className="glass-card p-5 md:p-8 relative overflow-hidden group hover:border-brand-500/50 transition-all border-dark-800">
            <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
               <svg className="w-20 h-20 md:w-28 md:h-28" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={stat.icon} /></svg>
            </div>
            <div className="flex justify-between items-start mb-2 md:mb-4">
              <p className="text-dark-500 text-[9px] md:text-[11px] font-semibold uppercase tracking-wider">{stat.label}</p>
              <span className={`text-[8px] md:text-[10px] font-medium px-2 py-0.5 rounded-md ${stat.color} bg-white/5`}>{stat.trend}</span>
            </div>
            <p className={`text-3xl md:text-5xl font-bold ${stat.color}`}>{stat.value.toLocaleString()}</p>
          </div>
        ))}
      </div>

      {/* Verification Logs Table */}
      <div className="glass-card overflow-hidden border-dark-800 shadow-2xl">
        <div className="p-5 md:p-8 border-b border-dark-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex items-center gap-4">
            <h2 className="text-xl md:text-2xl font-bold text-white font-outfit">Audit Trail</h2>
            <div className="px-2 py-0.5 bg-dark-900 border border-dark-800 rounded text-[8px] md:text-[10px] text-dark-500 font-mono tracking-widest uppercase">Fintech Standard</div>
          </div>
          <div className="flex w-full md:w-auto gap-4">
            <button 
              onClick={() => window.location.reload()} 
              className="flex-1 md:flex-none bg-dark-900 hover:bg-dark-800 border border-dark-800 px-4 py-2 rounded-xl text-dark-300 text-xs font-bold transition-all flex items-center justify-center gap-2"
            >
              Refresh
            </button>
            <button className="flex-1 md:flex-none bg-brand-600 hover:bg-brand-500 text-white px-5 py-2 rounded-xl text-xs font-bold transition-all shadow-glow">
              Export Logs
            </button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono">
            <thead>
              <tr className="bg-dark-950/50">
                <th className="px-6 md:px-8 py-5 text-dark-500 font-black uppercase text-[9px] md:text-[10px] tracking-widest">Phone Number</th>
                <th className="px-6 md:px-8 py-5 text-dark-500 font-black uppercase text-[9px] md:text-[10px] tracking-widest">Decision</th>
                <th className="px-6 md:px-8 py-5 text-dark-500 font-black uppercase text-[9px] md:text-[10px] tracking-widest text-center">Score</th>
                <th className="px-6 md:px-8 py-5 text-dark-500 font-black uppercase text-[9px] md:text-[10px] tracking-widest hidden md:table-cell">Alerts</th>
                <th className="px-6 md:px-8 py-5 text-dark-500 font-black uppercase text-[9px] md:text-[10px] tracking-widest">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-800/50">
              {history.length > 0 ? (
                history.map((item, i) => (
                  <tr key={i} className="hover:bg-dark-900/40 transition-colors group">
                    <td className="px-6 md:px-8 py-5 md:py-6 text-white font-bold text-sm">
                      <div className="flex items-center gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-brand-500/40"></div>
                        +{item.phoneNumber}
                      </div>
                    </td>
                    <td className="px-6 md:px-8 py-5 md:py-6">
                      <span className={`px-3 py-1 rounded-lg text-[9px] font-black tracking-widest border shadow-sm ${
                        item.status === 'VERIFIED' ? 'bg-safe/5 text-safe border-safe/20' : 
                        item.status === 'HIGH RISK' ? 'bg-danger/5 text-danger border-danger/20' : 
                        'bg-suspicious/5 text-suspicious border-suspicious/20'
                      }`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-6 md:px-8 py-5 md:py-6">
                      <div className="flex items-center justify-center gap-2">
                        <span className={`font-black text-xs ${item.riskScore === 'LOW' ? 'text-safe' : item.riskScore === 'HIGH' ? 'text-danger' : 'text-suspicious'}`}>
                          {item.riskScore}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 md:px-8 py-5 md:py-6 hidden md:table-cell">
                      <div className="flex gap-2">
                        {item.alerts.simSwap && <span className="bg-danger/10 text-danger text-[8px] font-black px-2 py-0.5 rounded border border-danger/20">SIM_SWAP</span>}
                        {item.alerts.locationMismatch && <span className="bg-suspicious/10 text-suspicious text-[8px] font-black px-2 py-0.5 rounded border border-suspicious/20">LOC_ANOMALY</span>}
                        {!item.alerts.simSwap && !item.alerts.locationMismatch && <span className="text-dark-600 text-[8px] font-bold">SECURE</span>}
                      </div>
                    </td>
                    <td className="px-6 md:px-8 py-5 md:py-6 text-dark-500 text-[10px] font-bold">
                      {item.date.split(' ')[0]}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-8 py-20 text-center">
                    <p className="text-dark-500 font-bold uppercase tracking-widest text-[10px]">No verification records found</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Merchant Tools & Integrations */}
      <div className="mt-12">
        <div className="glass-card p-8 border-dark-800">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="max-w-md">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-10 h-10 bg-brand-500/10 rounded-xl flex items-center justify-center text-brand-500">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">SME Trust Badge</h3>
                  <p className="text-dark-500 text-xs mt-1">Build consumer confidence by showing your storefront is secured by live network intelligence.</p>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <p className="text-[11px] font-bold text-dark-500 uppercase tracking-wider mb-3">Copy-Paste Integration</p>
                  <div className="bg-black/40 p-5 rounded-2xl border border-dark-800 font-mono text-[11px] text-brand-300 relative group">
                    <pre className="overflow-x-auto">{`<script src="https://cdn.simverify.pro/v1/badge.js" \ndata-id="MERCHANT_ID"></script>`}</pre>
                  </div>
                </div>
                <button 
                  onClick={copySnippet}
                  className="btn-primary w-full py-3.5 text-xs font-semibold tracking-wide shadow-glow"
                >
                  {copied ? '✓ Snippet Copied to Clipboard' : 'Copy Trust Badge Snippet'}
                </button>
              </div>
            </div>

            <div className="w-full max-w-sm">
              <p className="text-[11px] font-bold text-dark-500 uppercase tracking-wider mb-4 text-center">Badge Preview</p>
              <div className="bg-dark-950 p-8 rounded-[2rem] border border-dark-800 flex items-center justify-center relative overflow-hidden group">
                <div className="absolute inset-0 bg-brand-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                {/* Badge Design */}
                <div className="flex items-center gap-4 bg-dark-900 border border-brand-500/30 px-6 py-4 rounded-3xl shadow-glow relative z-10 animate-fade-in scale-105">
                  <div className="w-10 h-10 bg-brand-500 rounded-xl flex items-center justify-center shadow-lg">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                  </div>
                  <div>
                    <p className="text-[11px] font-bold text-white uppercase tracking-wider leading-none mb-1">Identity Verified</p>
                    <p className="text-[9px] font-medium text-brand-400 tracking-wide leading-none">by SimVerify Pro</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <p className="mt-16 text-center text-dark-400 text-[10px] font-mono tracking-[0.3em] uppercase opacity-50">
        SimVerify Pro // Enterprise-Grade Secure Identity Platform
      </p>
    </div>
  );
};
