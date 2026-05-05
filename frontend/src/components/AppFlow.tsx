import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Step, VerificationResult, ApiLog } from '../types/pro';
import { runCamaraFraudEngine } from '../api/mockService';

// --- Standout Component: Typewriter Insight ---
const TypewriterInsight: React.FC<{ text: string }> = ({ text }) => {
  const [displayedText, setDisplayedText] = useState('');

  useEffect(() => {
    if (!text) return;
    let i = 0;
    setDisplayedText('');
    const interval = setInterval(() => {
      setDisplayedText(text.slice(0, i));
      i++;
      if (i > text.length) clearInterval(interval);
    }, 15);
    return () => clearInterval(interval);
  }, [text]);

  return <p className="text-white text-sm md:text-base leading-relaxed italic">"{displayedText}"</p>;
};

type InsightStatus = 'safe' | 'danger' | 'suspicious' | 'default';

/** Plain-language copy for judges and non-technical users (Theme 5). */
function buildTheme5InsightCards(result: VerificationResult): { label: string; hint: string; value: string; status: InsightStatus }[] {
  const raw = result.rawResponse || {};
  const nv = raw.numberVerification;

  const simOk = result.simSwapStatus === 'CLEAN';
  const locOk = result.locationMatch === 'MATCHED';

  let phoneValue: string;
  let phoneStatus: InsightStatus = 'suspicious';
  if (nv?.devicePhoneNumberVerified === true) {
    phoneValue =
      raw._mockNumberVerification === true
        ? 'Confirmed: The mobile network validates this number for this session.'
        : 'Yes — the carrier layer confirms this number for the session.';
    phoneStatus = 'safe';
  } else if (nv?.detail?.code === 'MISSING_IDENTIFIER') {
    phoneValue =
      'Not finished — the carrier needs a real phone on mobile data; a server-only test cannot complete this.';
    phoneStatus = 'suspicious';
  } else if (typeof nv?.message === 'string') {
    phoneValue = `Not verified — ${nv.message}`;
    phoneStatus = 'danger';
  } else if (nv?.detail?.message) {
    phoneValue = `Not verified — ${String(nv.detail.message)}`;
    phoneStatus = 'danger';
  } else {
    phoneValue = 'See raw JSON in Developer tab for the exact carrier response.';
    phoneStatus = 'suspicious';
  }

  return [
    {
      label: 'SIM Swap Check',
      hint: 'Has the SIM card been changed recently? (Prevents account takeover)',
      value: simOk ? 'Safe: No recent SIM changes detected.' : 'Warning: Possible recent SIM swap detected.',
      status: simOk ? 'safe' : 'danger'
    },
    {
      label: 'Location Zone Check',
      hint: 'Is the phone in the expected business zone? (Commerce security)',
      value: locOk ? 'Safe: Phone is within the correct area.' : 'Warning: Phone is outside the expected zone.',
      status: locOk ? 'safe' : 'suspicious'
    },
    {
      label: 'Network Number Match',
      hint: 'Does the carrier network confirm this number? (Passwordless onboarding)',
      value: phoneValue,
      status: phoneStatus
    }
  ];
}

// LandingPage has been moved to its own file.

// --- Code Block Component ---
const CodeBlock: React.FC<{ code: string, lang: string }> = ({ code, lang }) => {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center px-1">
        <span className="text-[10px] font-bold text-dark-500 uppercase tracking-widest">{lang}</span>
        <button onClick={copy} className="text-[9px] font-bold text-brand-500 hover:text-brand-400 uppercase tracking-tight transition-colors">
          {copied ? '✓ Copied' : 'Copy Code'}
        </button>
      </div>
      <div className="bg-dark-950 p-4 rounded-xl border border-dark-800 font-mono text-[10px] text-brand-300 overflow-x-auto whitespace-pre relative group">
        {code}
      </div>
    </div>
  );
};

// --- Verification Flow ---
export const VerificationFlow: React.FC<{ initialStep?: Step; onComplete: () => void; onNavigate?: (page: any) => void }> = ({ initialStep, onComplete, onNavigate }) => {
  const [step, setStep] = useState<Step>(initialStep || 'input');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [error, setError] = useState('');
  const [result, setResult] = useState<VerificationResult | null>(null);
  const [currentLogs, setCurrentLogs] = useState<ApiLog[]>([]);
  const [loadingText, setLoadingText] = useState('Connecting...');
  const [resultTab, setResultTab] = useState<'insights' | 'developer'>('insights');
  const inputSectionRef = useRef<HTMLDivElement>(null);

  const toggleDocs = () => {
    if (onNavigate) {
      onNavigate('docs');
    } else {
      setStep(step === 'docs' ? 'input' : 'docs');
    }
  };

  const insightCards = useMemo(
    () => (result ? buildTheme5InsightCards(result) : []),
    [result]
  );

  // Sync internal step with external initialStep when it changes (from Navbar)
  useEffect(() => {
    if (initialStep) setStep(initialStep);
  }, [initialStep]);

  const handleCheckSim = async () => {
    if (!phoneNumber) return;
    if (phoneNumber.length < 8) {
      setError('Invalid phone number format.');
      return;
    }
    setError('');
    setStep('loading');
    setCurrentLogs([]);

    const loadingTexts = [
      'Connecting to Operator...',
      'Checking SIM status...',
      'Matching Location...',
      'Finalizing Security Check...'
    ];

    let textIdx = 0;
    const textInterval = setInterval(() => {
      if (textIdx < loadingTexts.length) {
        setLoadingText(loadingTexts[textIdx]);
        textIdx++;
      }
    }, 500);

    try {
      const res = await runCamaraFraudEngine(phoneNumber, (log) => {
        setCurrentLogs(prev => [...prev, log]);
      });
      clearInterval(textInterval);
      setTimeout(() => {
        setResult(res);
        setStep('result');
      }, 500);
    } catch (err) {
      clearInterval(textInterval);
      setStep('input');
      setError('Network communication failed. Please try again.');
    }
  };

  return (
    <div className="pt-24 md:pt-32 pb-20 px-4 md:px-6 max-w-4xl mx-auto min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-white tracking-tight">Security Gateway</h1>
          <p className="text-dark-500 text-[10px] md:text-xs font-bold uppercase tracking-[0.2em]">Network-as-Code Terminal</p>
        </div>
        <button
          onClick={() => setStep(step === 'docs' ? 'input' : 'docs')}
          className="text-[9px] font-black text-brand-500 uppercase tracking-widest border border-brand-500/20 bg-brand-500/5 px-4 py-2 rounded-xl hover:bg-brand-500/10 transition-all flex items-center gap-2"
        >
          {step === 'docs' ? (
            <>
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
              Back to Terminal
            </>
          ) : (
            <>
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
              Integration Docs
            </>
          )}
        </button>
      </div>

      {step === 'docs' && (
        <div className="space-y-8 animate-fade-in pb-20">
          <div className="glass-card p-8 md:p-12 border-t-2 border-t-brand-500">
            <h2 className="text-3xl font-bold text-white mb-4 tracking-tight">Technical Integration</h2>
            <p className="text-dark-400 mb-10 max-w-2xl text-sm leading-relaxed">
              Integrate the signals into your SME platform using our carrier-grade API endpoints.
              These snippets use the real-time Nokia NAC gateway.
            </p>

            <div className="space-y-12">
              <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h3 className="text-xs font-black text-brand-500 uppercase tracking-widest flex items-center gap-2">
                    <span className="w-5 h-5 bg-brand-500/10 rounded flex items-center justify-center text-[10px]">1</span>
                    Node.js Implementation
                  </h3>
                  <pre className="bg-[#0D1117] p-5 rounded-2xl border border-dark-800 overflow-x-auto text-[10px] font-mono text-brand-300 leading-loose">
                    <code>{`const axios = require('axios');

// Check SIM Swap + Identity
const response = await axios.post(
  'https://api.simverify.pro/v1/verify', 
  { phoneNumber: '${phoneNumber || '2348000000000'}' },
  { headers: { 'Authorization': 'Bearer <KEY>' } }
);

if (response.data.status === 'HIGH RISK') {
  blockTransaction(); // AI mitigation
}`}</code>
                  </pre>
                </div>

                <div className="space-y-4">
                  <h3 className="text-xs font-black text-safe uppercase tracking-widest flex items-center gap-2">
                    <span className="w-5 h-5 bg-safe/10 rounded flex items-center justify-center text-[10px]">2</span>
                    cURL Request
                  </h3>
                  <pre className="bg-[#0D1117] p-5 rounded-2xl border border-dark-800 overflow-x-auto text-[10px] font-mono text-safe leading-loose">
                    <code>{`curl -X POST https://api.simverify.pro/v1/verify \\
  -H "Authorization: Bearer <KEY>" \\
  -H "Content-Type: application/json" \\
  -d '{"phoneNumber": "${phoneNumber || '2348000000000'}"}'`}</code>
                  </pre>
                </div>
              </section>

              <section className="p-8 rounded-3xl bg-gradient-to-br from-brand-600/10 to-accent-600/10 border border-brand-500/20">
                <h4 className="text-white font-bold mb-4">Supported Languages & SDKs</h4>
                <p className="text-dark-400 text-xs mb-6">Our REST API is compatible with any language capable of making HTTP requests.</p>
                <div className="flex flex-wrap gap-4">
                  {['Node.js', 'Python', 'PHP', 'Go', 'Ruby', 'Java', 'C#', 'Rust', 'Swift'].map(lang => (
                    <span key={lang} className="bg-dark-950/50 text-dark-300 text-[10px] px-3 py-1 rounded-full border border-dark-800 font-bold">{lang}</span>
                  ))}
                </div>
              </section>
            </div>

            <div className="mt-10 pt-8 border-t border-dark-800 flex items-center justify-between">
              <p className="text-dark-500 text-[10px] font-medium italic">
                * All endpoints are secured by Nokia Network-as-Code.
              </p>
              <button
                onClick={() => onNavigate && onNavigate('docs')}
                className="text-brand-400 text-[10px] font-black uppercase tracking-widest hover:text-brand-300 transition-colors"
              >
                View Full API Reference →
              </button>
            </div>
          </div>
        </div>
      )}

      {step === 'input' && (
        <div className="space-y-6 animate-fade-in">
          {/* 1. Sandbox FIRST for immediate trial */}
          <div className="glass-card p-6 md:p-8 bg-brand-500/5 border-brand-500/10">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg md:text-xl font-semibold text-white">SME Trust Sandbox</h3>
                <p className="text-dark-300 text-sm md:text-base mt-2">Click a test scenario below to auto-fill and test real signals.</p>
              </div>
              <span className="text-[9px] font-mono font-black text-brand-500 bg-brand-500/10 px-2.5 py-1 rounded-full border border-brand-500/20">LIVE_GATEWAY</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
              {[
                { title: 'SIM Swap Detected', number: '99999991000', desc: 'SIM swap = TRUE. Detect a hacked line.', icon: '⚠️' },
                { title: 'Stable SIM Check', number: '99999991001', desc: 'SIM swap = FALSE. Safe network ID.', icon: '🛡️' },
                { title: 'Secure Onboarding', number: '99999991001', desc: 'Passwordless + Safe SIM flow.', icon: '✅' },
                { title: 'Location Mismatch', number: '99999991003', desc: 'User is outside the allowed zone.', icon: '📍' }
              ].map((test, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setPhoneNumber(test.number);
                    inputSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                  }}
                  className="group flex flex-col text-left p-4 rounded-2xl bg-dark-950/80 border border-white/5 hover:border-brand-500/40 transition-all hover:bg-brand-500/5 active:scale-[0.98]"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-base">{test.icon}</span>
                    <span className="text-[11px] font-semibold text-white tracking-wide group-hover:text-brand-400 transition-colors">{test.title}</span>
                  </div>
                  <p className="text-[10px] text-dark-500 mb-3 leading-snug font-medium">{test.desc}</p>
                  <div className="mt-auto pt-2 border-t border-white/5 flex justify-between items-center">
                    <span className="text-[11px] font-mono text-brand-500 font-medium">+{test.number}</span>
                    <span className="text-[9px] text-dark-500 group-hover:text-brand-400 font-semibold tracking-wide">Try Now →</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* 2. Manual Input Card */}
          <div ref={inputSectionRef} className="glass-card p-8 md:p-12 border-t-4 border-t-brand-500 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-500/5 blur-3xl rounded-full -mr-16 -mt-16"></div>
            <div className="mb-10 text-center md:text-left">
              <h2 className="text-2xl md:text-3xl font-black text-white mb-2 tracking-tighter">Network Identity Scan</h2>
              <p className="text-dark-400 text-xs md:text-sm font-medium">Verify any mobile number across Africa via carrier-grade network intelligence.</p>
            </div>

            <div className="max-w-md mx-auto md:mx-0">
              <div className="mb-8 text-left">
                <label className="block text-[11px] font-medium text-dark-500 mb-2.5 tracking-wide ml-1">Phone Number (MSISDN)</label>
                <div className="relative group">
                  <div className="bg-dark-950 rounded-xl flex items-center w-full border border-dark-800 group-focus-within:border-brand-500/50 transition-all shadow-inner">
                    <span className="pl-5 text-brand-500 font-medium text-lg">+</span>
                    <input
                      type="tel"
                      placeholder="e.g. 2348030000000"
                      className="bg-transparent w-full pl-3 pr-5 py-3 md:py-2 text-base md:text-lg font-mono text-white outline-none placeholder:text-dark-700"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value.replace(/[^0-9]/g, ''))}
                      onKeyPress={(e) => e.key === 'Enter' && handleCheckSim()}
                    />
                  </div>
                </div>
                {error && <p className="mt-3 text-danger text-[10px] font-black uppercase tracking-widest flex items-center gap-2 bg-danger/10 p-2 rounded-lg border border-danger/20"><span className="w-1.5 h-1.5 bg-danger rounded-full animate-pulse"></span> {error}</p>}
              </div>

              <button
                onClick={handleCheckSim}
                disabled={!phoneNumber}
                className="btn-primary w-full glow-effect disabled:opacity-30 disabled:cursor-not-allowed"
              >
                Verify Identity
                <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
              </button>
              <p className="mt-6 text-center text-dark-500 text-[11px] font-medium tracking-wide">Powered by CAMARA Open Gateway Standard</p>
            </div>
          </div>
        </div>
      )}

      {step === 'loading' && (
        <div className="glass-card p-12 animate-fade-in text-center flex flex-col items-center max-w-2xl mx-auto py-20">
          <div className="relative mb-8">
            <div className="w-16 h-16 border-4 border-dark-800 border-t-brand-500 rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-2 h-2 bg-brand-500 rounded-full animate-pulse"></div>
            </div>
          </div>
          <h2 className="text-xl font-bold text-white mb-8 tracking-tight">{loadingText}</h2>

          <div className="w-full space-y-4 max-w-xs mt-2">
            {[
              { label: 'Confirming Owner' },
              { label: 'Checking SIM' },
              { label: 'Matching Location' }
            ].map((api, i) => {
              const isDone = currentLogs.length > i;
              return (
                <div key={i} className="flex items-center justify-between">
                  <span className={`text-[11px] font-bold tracking-wide ${isDone ? 'text-white' : 'text-dark-600'}`}>{api.label}</span>
                  {isDone ? (
                    <span className="text-[8px] font-bold text-safe tracking-widest uppercase">Verified</span>
                  ) : (
                    <div className="w-8 h-1 bg-dark-900 rounded-full overflow-hidden">
                      <div className="h-full bg-brand-500 animate-loading-bar"></div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {step === 'result' && result && (
        <div className="space-y-6 animate-fade-in pb-20">
          <div className="glass-card overflow-hidden border-dark-800">
            <div className={`h-1.5 ${result.status === 'VERIFIED' ? 'bg-safe' :
              result.status === 'HIGH RISK' ? 'bg-danger' : 'bg-suspicious'
              }`}></div>

            <div className="p-8 md:p-10">
              <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-10">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-2xl font-bold text-white tracking-tight">Security Intelligence Report</h2>
                    {/* <span className="text-[10px] font-mono text-dark-500">ID: {result.timestamp.slice(-5).toUpperCase()}</span> */}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-dark-500 uppercase tracking-widest font-bold">Identity:</span>
                    <span className="text-[11px] font-mono text-brand-400">{result.phoneNumber}</span>
                  </div>
                </div>

                <span className={`px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest border shadow-lg flex items-center gap-2 ${result.status === 'VERIFIED' ? 'bg-safe/10 text-safe border-safe/20' :
                  result.status === 'HIGH RISK' ? 'bg-danger/10 text-danger border-danger/20' :
                    'bg-suspicious/10 text-suspicious border-suspicious/20'
                  }`}>
                  <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse"></span>
                  {result.status === 'HIGH RISK' ? 'BLOCKED' : result.status}
                </span>
              </div>

              {/* Tab Navigation */}
              <div className="flex gap-6 border-b border-dark-800 mb-8">
                <button
                  onClick={() => setResultTab('insights')}
                  className={`pb-4 text-[10px] font-black uppercase tracking-[0.2em] transition-all relative ${resultTab === 'insights' ? 'text-brand-500' : 'text-dark-500 hover:text-dark-300'}`}
                >
                  Business Insights
                  {resultTab === 'insights' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-500 animate-fade-in"></div>}
                </button>
                <button
                  onClick={() => setResultTab('developer')}
                  className={`pb-4 text-[10px] font-black uppercase tracking-[0.2em] transition-all relative ${resultTab === 'developer' ? 'text-brand-500' : 'text-dark-500 hover:text-dark-300'}`}
                >
                  Raw Response
                  {resultTab === 'developer' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-500 animate-fade-in"></div>}
                </button>
              </div>

              {resultTab === 'insights' ? (
                <div className="animate-fade-in">
                  <div className="bg-dark-950 rounded-2xl p-6 border border-dark-800 mb-8">
                    {result.simSwapStatus === 'SWAPPED_RECENTLY' ? (
                      <div className="mb-6 p-4 bg-danger/10 border border-danger/30 rounded-2xl flex items-center gap-4 animate-pulse">
                        <div className="w-10 h-10 bg-danger/20 rounded-full flex items-center justify-center text-danger">
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                        </div>
                        <div>
                          <p className="text-danger font-black text-[10px] uppercase tracking-[0.2em]">Critical Security Threat</p>
                          <p className="text-white text-xs font-bold">Recent SIM Swap Detected. SME Account Takeover in progress.</p>
                        </div>
                      </div>
                    ) : (
                      <div className="mb-6 p-4 bg-safe/10 border border-safe/30 rounded-2xl flex items-center gap-4">
                        <div className="w-10 h-10 bg-safe/20 rounded-full flex items-center justify-center text-safe">
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                        </div>
                        <div>
                          <p className="text-safe font-black text-[10px] uppercase tracking-[0.2em]">Trusted Network Signal</p>
                          <p className="text-white text-xs font-bold">SIM Swap = FALSE. This device has a stable network identity.</p>
                        </div>
                      </div>
                    )}

                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-brand-500/10 rounded-xl flex items-center justify-center flex-shrink-0 text-brand-500">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                      </div>
                      <div>
                        <h4 className="text-brand-500 font-bold text-[9px] uppercase tracking-widest mb-1">SimVerify Agentic Intelligence</h4>
                        <div className="space-y-3">
                          <TypewriterInsight text={result.aiInsight || 'No insight generated.'} />
                          <div className="pt-4 border-t border-white/5 space-y-2">
                            <p className="text-[8px] font-black text-dark-500 uppercase tracking-widest">Agentic Decision Log:</p>
                            {[
                              { label: 'Signal Correlation', desc: 'Analyzed SIM vs Location vectors' },
                              { label: 'Risk Prediction', desc: 'Calculated fraud probability index' },
                              { label: 'Automated Action', desc: result.status === 'VERIFIED' ? 'Approval token issued' : 'Security gate triggered' }
                            ].map((step, i) => (
                              <div key={i} className="flex items-center gap-2">
                                <div className="w-1 h-1 bg-brand-500 rounded-full"></div>
                                <span className="text-[9px] text-dark-400 font-bold">{step.label}:</span>
                                <span className="text-[9px] text-dark-600 italic">{step.desc}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
                    {insightCards.map((item, i) => (
                      <div key={i} className="bg-dark-900/40 p-5 md:p-6 rounded-2xl border border-white/5 hover:border-brand-500/30 transition-all relative overflow-hidden group">
                        {i === 0 && (
                          <div className="absolute top-2 right-2 flex items-center gap-1">
                            <div className="w-1 h-1 bg-safe rounded-full animate-pulse"></div>
                            <span className="text-[6px] text-dark-500 font-bold uppercase tracking-tighter">Live API</span>
                          </div>
                        )}
                        <p className="text-dark-500 text-[8px] md:text-[9px] font-black uppercase mb-1 tracking-widest leading-tight">{item.label}</p>
                        <p className="text-dark-600 text-[9px] font-medium leading-snug mb-2 normal-case">{item.hint}</p>
                        <p className={`text-xs md:text-sm font-black leading-snug ${item.status === 'safe' ? 'text-safe' :
                          item.status === 'danger' ? 'text-danger' :
                            item.status === 'suspicious' ? 'text-suspicious' : 'text-white'
                          }`}>
                          {item.value}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="animate-fade-in space-y-6">
                  <div className="bg-dark-950 p-6 rounded-2xl border border-dark-800 font-mono text-[10px] relative">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-brand-500 font-black uppercase tracking-widest">Nokia NAC Gateway Response</span>
                      <span className="text-dark-600 font-bold">application/json</span>
                    </div>
                    <pre className="text-brand-300 overflow-x-auto whitespace-pre">
                      {JSON.stringify(result.rawResponse, null, 2)}
                    </pre>
                  </div>

                  <div className="bg-brand-500/5 p-6 rounded-2xl border border-brand-500/20">
                    <h4 className="text-white font-bold text-xs mb-2">Technical Summary</h4>
                    <p className="text-dark-400 text-[10px] leading-relaxed">
                      Theme 5 uses three endpoints only:{' '}
                      <span className="text-brand-400 font-mono">numberVerification</span>,{' '}
                      <span className="text-brand-400 font-mono">simSwap</span>,{' '}
                      <span className="text-brand-400 font-mono">locationVerify</span>. Each value is the JSON RapidAPI/Nokia returned for that call (errors like{' '}
                      <span className="text-brand-400 font-mono">API doesn&apos;t exists</span> come from the gateway when the URL or subscription is wrong).
                    </p>
                  </div>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-4 mt-3">
                <button
                  onClick={() => { setStep('input'); setPhoneNumber(''); }}
                  className="btn-primary flex-1"
                >
                  New Identity Scan
                </button>
                <button
                  onClick={() => onComplete()}
                  className="btn-primary flex-1"
                >
                  View Dashboard
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="mt-20 py-10 border-t border-white/5 overflow-hidden group">
        <p className="text-[10px] font-black text-dark-500 uppercase tracking-[0.3em] text-center mb-8">Infrastructure & Network Partners</p>

        <div className="relative">
          {/* Fades for smooth edge transition */}
          <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-dark-950 to-transparent z-10"></div>
          <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-dark-950 to-transparent z-10"></div>

          <div className="animate-marquee flex items-center gap-12 md:gap-20">
            {[
              { name: 'GSMA', sub: 'OPEN GATEWAY', color: 'text-white' },
              { name: 'Nokia', sub: 'NAC PLATFORM', color: 'text-brand-500' },
              { name: 'MTN', sub: 'GLOBAL AFRICA', color: 'text-[#FFCC00]' },
              { name: 'Airtel', sub: 'CENTRAL AFRICA', color: 'text-[#FF0000]' },
              { name: 'Vodacom', sub: 'SOUTH AFRICA', color: 'text-[#E60000]' },
              { name: 'Safaricom', sub: 'EAST AFRICA', color: 'text-[#49AA4F]' },
              { name: 'Orange', sub: 'WEST AFRICA', color: 'text-[#FF7900]' },
              { name: 'Glo', sub: 'WEST AFRICA', color: 'text-[#00FF00]' }
            ].map((partner, i) => (
              <div key={i} className="flex items-center gap-3 grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all duration-500 cursor-default">
                <span className={`${partner.color} font-black tracking-tighter text-xl md:text-2xl italic`}>{partner.name}</span>
                <div className="h-4 w-px bg-dark-800"></div>
                <span className="text-dark-400 font-bold text-[8px] md:text-[10px] uppercase tracking-widest whitespace-nowrap">{partner.sub}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
