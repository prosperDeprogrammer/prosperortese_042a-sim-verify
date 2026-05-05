import React, { useMemo } from 'react';
import { getCamaraStats, getCamaraHistory } from '../api/mockService';

export const Dashboard: React.FC = () => {
  const stats = useMemo(() => getCamaraStats(), []);
  const history = useMemo(() => getCamaraHistory(), []);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState('ALL');
  const [copied, setCopied] = React.useState(false);

  const filteredHistory = useMemo(() => {
    return history.filter(item => {
      const matchesSearch = item.phoneNumber.includes(searchTerm);
      const matchesStatus = statusFilter === 'ALL' ||
        (statusFilter === 'BLOCKED' && item.status === 'HIGH RISK') ||
        (statusFilter === 'VERIFIED' && item.status === 'VERIFIED') ||
        (statusFilter === 'FLAGGED' && item.status === 'SUSPICIOUS');
      return matchesSearch && matchesStatus;
    });
  }, [history, searchTerm, statusFilter]);

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
            <h1 className="text-3xl md:text-4xl font-extrabold text-white font-outfit">Security Monitor</h1>
            {/* <span className="bg-brand-500/10 text-brand-400 text-[9px] font-bold px-2 py-1 rounded border border-brand-500/20 tracking-widest uppercase">Live Protection</span> */}
          </div>
          <p className="text-dark-400 text-sm md:text-lg max-w-2xl">
            Real-time identity verification signals for African Fintechs and E-commerce platforms.
            <span className="hidden md:inline"> Built on enterprise-grade network infrastructure.</span>
          </p>
        </div>
        <div className="w-full md:w-auto bg-dark-900 border border-dark-800 rounded-2xl px-5 py-3 text-dark-300 text-xs font-mono flex items-center justify-between md:justify-start gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-safe rounded-full animate-pulse"></span>
            <span className="uppercase tracking-tighter">System Status: Online</span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-10 md:mb-12">
        {[
          { label: 'Total Verifications', value: stats.totalApiCalls, color: 'text-brand-400', icon: 'M13 10V3L4 14h7v7l9-11h-7z', trend: 'Network Live' },
          { label: 'Blocked Threats', value: stats.fraudCasesDetected, color: 'text-danger', icon: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z', trend: 'Shield Active' },
          { label: 'SIM Swap Alerts', value: stats.simSwapAlerts, color: 'text-accent-400', icon: 'M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A10.003 10.003 0 0012 20c4.083 0 7.774-2.422 9.456-5.908M12 4a10.003 10.003 0 00-9.456 5.908M12 4v10M12 4a10.003 10.003 0 019.456 5.908M12 4v10m0 0l3.14-3.14M12 14l-3.14-3.14', trend: 'High Risk' },
          { label: 'Location Warnings', value: stats.locationMismatchAlerts, color: 'text-suspicious', icon: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z', trend: 'Risk Watch' },
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
        <div className="p-5 md:p-8 border-b border-dark-800 space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="flex items-center gap-4">
              <h2 className="text-xl md:text-2xl font-bold text-white font-outfit">Verification Logs</h2>
              <div className="px-2 py-0.5 bg-brand-500/10 border border-brand-500/20 rounded text-[9px] text-brand-400 font-mono tracking-widest uppercase">{filteredHistory.length} Records</div>
            </div>
            <div className="flex w-full md:w-auto gap-4">
              <button
                onClick={() => window.location.reload()}
                className="flex-1 md:flex-none bg-dark-900 hover:bg-dark-800 border border-dark-800 px-4 py-2 rounded-xl text-dark-300 text-xs font-bold transition-all"
              >
                Refresh
              </button>
              <button className="flex-1 md:flex-none bg-brand-600 hover:bg-brand-500 text-white px-5 py-2 rounded-xl text-xs font-bold transition-all shadow-glow">
                Export CSV
              </button>
            </div>
          </div>

          {/* Data Table Controls */}
          <div className="flex flex-col md:flex-row gap-4 pt-4 border-t border-dark-800/50">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg className="h-4 w-4 text-dark-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              </div>
              <input
                type="text"
                placeholder="Search phone number..."
                className="block w-full pl-11 pr-4 py-2.5 bg-dark-950 border border-dark-800 rounded-xl text-sm text-white placeholder-dark-600 focus:outline-none focus:border-brand-500/50 transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
              {['ALL', 'VERIFIED', 'BLOCKED', 'FLAGGED'].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setStatusFilter(filter)}
                  className={`px-4 py-2 rounded-xl text-[10px] font-black tracking-widest transition-all whitespace-nowrap border ${statusFilter === filter
                    ? 'bg-brand-500 text-white border-brand-500 shadow-glow-sm'
                    : 'bg-dark-900 text-dark-500 border-dark-800 hover:border-dark-700'
                    }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-dark-950/80 border-b border-dark-800">
                <th className="px-6 py-4 text-dark-500 font-bold uppercase text-[10px] tracking-[0.2em]">Subject MSISDN</th>
                <th className="px-6 py-4 text-dark-500 font-bold uppercase text-[10px] tracking-[0.2em]">Security Status</th>
                <th className="px-6 py-4 text-dark-500 font-bold uppercase text-[10px] tracking-[0.2em] text-center hidden sm:table-cell">Risk Index</th>
                <th className="px-6 py-4 text-dark-500 font-bold uppercase text-[10px] tracking-[0.2em] hidden lg:table-cell">Network Signals</th>
                <th className="px-6 py-4 text-dark-500 font-bold uppercase text-[10px] tracking-[0.2em] text-right">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-800/30">
              {filteredHistory.length > 0 ? (
                filteredHistory.map((item, i) => (
                  <tr key={i} className="group hover:bg-brand-500/[0.02] transition-all duration-300">
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full ${item.status === 'VERIFIED' ? 'bg-safe' : 'bg-danger'} shadow-[0_0_10px_rgba(0,0,0,0.5)]`}></div>
                        <span className="text-white font-mono font-medium text-sm tracking-tight">{item.phoneNumber}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[9px] font-black tracking-widest border ${item.status === 'VERIFIED' ? 'bg-safe/10 text-safe border-safe/20' :
                        item.status === 'HIGH RISK' ? 'bg-danger/10 text-danger border-danger/20' :
                          'bg-suspicious/10 text-suspicious border-suspicious/20'
                        }`}>
                        <span className="mr-1.5 w-1 h-1 rounded-full bg-current animate-pulse"></span>
                        {item.status === 'HIGH RISK' ? 'BLOCKED' : item.status}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-center hidden sm:table-cell">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded bg-dark-900 border border-dark-800 ${item.riskScore === 'LOW' ? 'text-safe' :
                        item.riskScore === 'HIGH' ? 'text-danger' :
                          'text-suspicious'
                        }`}>
                        {item.riskScore}
                      </span>
                    </td>
                    <td className="px-6 py-5 hidden lg:table-cell">
                      <div className="flex gap-2 flex-wrap max-w-[200px]">
                        {item.alerts.simSwap && <span className="bg-dark-950 text-danger text-[8px] font-bold px-2 py-0.5 rounded border border-danger/30">SIM_SWAP</span>}
                        {item.alerts.locationMismatch && <span className="bg-dark-950 text-suspicious text-[8px] font-bold px-2 py-0.5 rounded border border-suspicious/30">GEO_ZONE</span>}
                        {item.alerts.numberMismatch && <span className="bg-dark-950 text-brand-400 text-[8px] font-bold px-2 py-0.5 rounded border border-brand-400/30">IDENTITY_FAIL</span>}
                        {!item.alerts.simSwap && !item.alerts.locationMismatch && !item.alerts.numberMismatch && (
                          <span className="text-dark-600 text-[8px] font-bold tracking-widest uppercase italic opacity-50">Clear Signals</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <p className="text-dark-400 text-[10px] font-medium">{item.date.split(' ')[0]}</p>
                      <p className="text-dark-600 text-[9px] font-mono mt-0.5">{item.date.split(' ')[1]}</p>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-8 py-24 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-12 h-12 bg-dark-900 rounded-full flex items-center justify-center text-dark-700">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                      </div>
                      <p className="text-dark-500 font-bold uppercase tracking-[0.2em] text-[10px]">No results match your criteria</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>



      <p className="mt-16 text-center text-dark-400 text-[10px] font-mono tracking-[0.3em] uppercase opacity-50">
        SimVerify Pro // Enterprise-Grade Secure Identity Platform
      </p>
    </div>
  );
};
