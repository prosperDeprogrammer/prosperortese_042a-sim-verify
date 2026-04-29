import React, { useMemo, useState, useEffect } from "react";
import * as api from "./api/api";
import {
  VerifyResult,
  ApiKeyResponse,
  View,
  RiskScore,
  Stats
} from "./types";
import {
  API_URL,
  decisionText,
  riskStyles,
  navItems,
  demoCases,
  riskBadge
} from "./constants";

// UI Components
import { StatCard } from "./components/ui/StatCard";
import { CheckCard } from "./components/ui/CheckCard";
import { FeatureCard } from "./components/ui/FeatureCard";
import { PricingCard } from "./components/ui/PricingCard";
import { ChatWidget } from "./components/ChatWidget";

export default function App() {
  const [view, setView] = useState<View>("verify");
  const [phone, setPhone] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<VerifyResult | null>(null);
  const [history, setHistory] = useState<VerifyResult[]>([]);
  const [stats, setStats] = useState<Stats>({
    total: 0,
    safe: 0,
    suspicious: 0,
    high: 0,
  });

  const [ownerName, setOwnerName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [email, setEmail] = useState("");
  const [plan, setPlan] = useState<"STARTER" | "GROWTH" | "ENTERPRISE">("STARTER");
  const [apiKeyPayload, setApiKeyPayload] = useState<ApiKeyResponse | null>(null);
  const [apiKeyLoading, setApiKeyLoading] = useState(false);
  const [apiKeyError, setApiKeyError] = useState("");
  const [paymentState, setPaymentState] = useState<"idle" | "processing" | "provisioning" | "success">("idle");
  const [showRaw, setShowRaw] = useState(false);
  const [docTab, setDocTab] = useState<"curl" | "js" | "python">("curl");
  const [copyFeedback, setCopyFeedback] = useState(false);
  const [codeCopyFeedback, setCodeCopyFeedback] = useState(false);
  const [retrievedNotice, setRetrievedNotice] = useState(false);
  const [downgradeConfirm, setDowngradeConfirm] = useState<{ currentPlan: string; targetPlan: string; expiry: string } | null>(null);

  useEffect(() => {
    api.getStats().then(res => {
      const data = res.data;
      setStats({
        total: data.total_checks,
        safe: data.risk_distribution.low,
        suspicious: data.risk_distribution.suspicious,
        high: data.risk_distribution.high,
      });
    }).catch(err => console.error("Stats fetch error:", err));
  }, []);

  useEffect(() => {
    const sectionIds = navItems.map((n) => n.id);
    const observers: IntersectionObserver[] = [];

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setView(id as View);
          }
        },
        { rootMargin: "-30% 0px -60% 0px", threshold: 0 }
      );
      obs.observe(el);
      observers.push(obs);
    });

    return () => observers.forEach((obs) => obs.disconnect());
  }, []);

  const healthMessage = useMemo(() => {
    if (!result) return "Run a verification to get fraud decision.";
    if (result.decision === "ALLOW") return "Customer appears safe. Continue normally.";
    if (result.decision === "STEP_UP") return "Suspicious pattern. Trigger additional identity proof.";
    return "High fraud signal. Block action and investigate.";
  }, [result]);

  const getCoordinates = (): Promise<{ lat?: number; lng?: number }> => {
    return new Promise((resolve) => {
      if (!navigator.geolocation) return resolve({});
      navigator.geolocation.getCurrentPosition(
        (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => resolve({}),
        { timeout: 5000 }
      );
    });
  };

  async function handleVerifyUser(targetPhone: string) {
    const cleanPhone = targetPhone.replace(/[\s\-\(\)]/g, "");
    if (!cleanPhone.match(/^\+?\d+$/)) {
      setError("Invalid characters detected. Use digits only (e.g. 0802... or +234...).");
      return;
    }
    if (cleanPhone.length < 8) {
      setError("Phone number is too short.");
      return;
    }

    try {
      setError("");
      setIsLoading(true);

      // Get real location for WOW factor
      const { lat, lng } = await getCoordinates();

      const res = await api.verifyUser(targetPhone, apiKeyPayload?.key || "sk_live_demo123", lat, lng);
      const payload = res.data;
      setResult(payload);
      setHistory((prev) => [payload, ...prev].slice(0, 20));
      setStats((prev) => ({
        total: prev.total + 1,
        safe: prev.safe + (payload.risk_score === "LOW" ? 1 : 0),
        suspicious: prev.suspicious + (payload.risk_score === "SUSPICIOUS" ? 1 : 0),
        high: prev.high + (payload.risk_score === "HIGH" ? 1 : 0),
      }));
    } catch (err: any) {
      if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else {
        setError("Unable to reach backend. Start API server on localhost:4000.");
      }
    } finally {
      setIsLoading(false);
    }
  }

  async function handleGenerateApiKey() {
    if (!ownerName.trim() || !companyName.trim() || !email.trim()) {
      setApiKeyError("Name, company, and email are required.");
      return;
    }

    try {
      setApiKeyError("");
      setApiKeyLoading(true);
      setApiKeyPayload(null);
      setRetrievedNotice(false);
      setPaymentState("idle");

      const res = await api.generateApiKey({
        owner: ownerName.trim(),
        company: companyName.trim(),
        email: email.trim(),
        plan,
      });

      if (res.status === 201) {
        if (plan === "GROWTH") {
          setPaymentState("processing");
          await new Promise((resolve) => setTimeout(resolve, 2500));
          setPaymentState("success");
        } else if (plan === "ENTERPRISE") {
          setPaymentState("provisioning");
          await new Promise((resolve) => setTimeout(resolve, 1500));
          setPaymentState("success");
        }
      } else if (res.status === 200) {
        setRetrievedNotice(true);
      }

      setApiKeyPayload(res.data);
      setTimeout(() => setPaymentState("idle"), 1000);
    } catch (err: any) {
      setPaymentState("idle");
      if (err.response?.status === 403 && err.response?.data?.canForce) {
        setDowngradeConfirm({
          currentPlan: err.response.data.currentPlan,
          targetPlan: plan,
          expiry: err.response.data.expiry_date,
        });
      } else if (err.response?.data?.error) {
        setApiKeyError(err.response.data.error);
      } else {
        setApiKeyError("Could not create API key. Ensure backend is running.");
      }
    } finally {
      setApiKeyLoading(false);
    }
  }

  async function forceDowngrade() {
    if (!downgradeConfirm) return;
    setDowngradeConfirm(null);
    try {
      setApiKeyError("");
      setApiKeyLoading(true);
      setApiKeyPayload(null);
      setRetrievedNotice(false);
      const res = await api.generateApiKey({
        owner: ownerName.trim(),
        company: companyName.trim(),
        email: email.trim(),
        plan,
        force: true,
      });
      setApiKeyPayload(res.data);
    } catch (err: any) {
      setApiKeyError(err.response?.data?.error || "Downgrade failed.");
    } finally {
      setApiKeyLoading(false);
    }
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopyFeedback(true);
      setTimeout(() => setCopyFeedback(false), 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  const copyDocsCode = async () => {
    let snippet = "";
    if (docTab === "curl") {
      snippet = `curl -X POST ${API_URL}/verify-user \\\n  -H "Content-Type: application/json" \\\n  -H "Authorization: Bearer YOUR_API_KEY" \\\n  -d '{"phone":"08011111111"}'`;
    } else if (docTab === "js") {
      snippet = `const axios = require('axios');\n\nasync function checkFraud(phone) {\n  const response = await axios.post('${API_URL}/verify-user', {\n    phone\n  }, {\n    headers: { 'Authorization': 'Bearer YOUR_API_KEY' }\n  });\n  console.log(response.data.decision);\n}`;
    } else {
      snippet = `import requests\n\ndef check_fraud(phone):\n  url = "${API_URL}/verify-user"\n  headers = { "Authorization": "Bearer YOUR_API_KEY" }\n  data = { "phone": phone }\n\n  response = requests.post(url, json=data, headers=headers)\n  return response.json()`;
    }

    try {
      await navigator.clipboard.writeText(snippet);
      setCodeCopyFeedback(true);
      setTimeout(() => setCodeCopyFeedback(false), 2000);
    } catch (e) { }
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - 30;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto flex w-full max-w-7xl flex-col lg:flex-row">
        <aside className="border-b border-slate-800 bg-slate-900/70 px-4 py-4 lg:sticky lg:top-0 lg:h-screen lg:overflow-y-auto lg:w-72 lg:border-b-0 lg:border-r lg:px-5 lg:py-6 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
          <div className="mb-5 flex items-center gap-3 rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-3 py-2">
            <img src="/simverify_logo.png" alt="SimVerify" className="w-8 h-8 rounded-lg object-contain shrink-0" />
            <div>
              <p className="text-sm font-semibold text-emerald-300">SimVerify</p>
              <p className="text-xs text-emerald-200/80">Hackathon demo mode</p>
            </div>
          </div>

          <p className="mb-2 text-[11px] uppercase tracking-[0.2em] text-slate-500">Navigation</p>
          <div className="grid grid-cols-2 gap-2 lg:grid-cols-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                className={`rounded-lg border px-3 py-2 text-left text-sm transition ${view === item.id
                  ? "border-cyan-500/60 bg-cyan-500/15 text-cyan-200"
                  : "border-slate-800 bg-slate-900 text-slate-300 hover:border-slate-700 hover:text-white"
                  }`}
                onClick={() => {
                  setView(item.id);
                  scrollToSection(item.id);
                }}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="mt-6">
            <p className="mb-2 text-[11px] uppercase tracking-[0.2em] text-slate-500">Demo cases</p>
            <div className="space-y-2">
              {demoCases.map((item) => (
                <button
                  key={item.phone}
                  onClick={() => {
                    setView("verify");
                    setPhone(item.phone);
                    void handleVerifyUser(item.phone);
                    scrollToSection("verify");
                  }}
                  className="w-full rounded-lg border border-slate-800 bg-slate-900 p-3 text-left transition hover:border-slate-700"
                >
                  <p className="font-mono text-sm text-white">{item.phone}</p>
                  <p className="text-xs text-slate-400">{item.hint}</p>
                  <span className={`mt-2 inline-flex rounded border px-2 py-0.5 text-[10px] ${riskBadge(item.tone)}`}>
                    {item.tone}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </aside>

        <main className="flex-1 px-4 py-5 lg:px-8 lg:py-7">
          <header className="mb-5 flex flex-col gap-3 rounded-2xl border border-slate-800 bg-slate-900/60 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <img
                src="/simverify_logo.png"
                alt="SimVerify Logo"
                className="w-12 h-12 rounded-xl object-contain"
              />
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-cyan-300">POST /verify-user</p>
                <h1 className="text-xl font-bold text-white sm:text-2xl">SimVerify Anti-Fraud API</h1>
              </div>
            </div>
            <div className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-slate-300">
              Built for real-world fintech fraud prevention
            </div>
          </header>

          <section className="mb-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
            <StatCard label="Total checks" value={String(stats.total)} />
            <StatCard label="Safe" value={String(stats.safe)} tone="safe" />
            <StatCard label="Suspicious" value={String(stats.suspicious)} tone="warn" />
            <StatCard label="High risk" value={String(stats.high)} tone="danger" />
          </section>

          <div className="flex flex-col gap-16 pb-12">
            <section id="verify" className="space-y-4 scroll-mt-10">
              <h2 className="text-xl font-bold text-white border-b border-slate-800 pb-2 mb-4">Fraud Checker</h2>
              <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
                <p className="mb-2 text-xs uppercase tracking-[0.2em] text-slate-500">Phone number</p>
                <div className="flex flex-col gap-2 sm:flex-row">
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => {
                      const val = e.target.value;
                      // Only allow digits, plus, space, dash, and parentheses
                      const filtered = val.replace(/[^0-9+ \-()]/g, "");
                      setPhone(filtered);
                    }}
                    onBlur={() => {
                      // Professional trim when user finishes typing
                      setPhone(prev => prev.trim());
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !isLoading) void handleVerifyUser(phone.trim());
                    }}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 font-mono text-slate-100 outline-none ring-cyan-500/50 transition focus:border-cyan-500 focus:ring"
                    placeholder="08033333333"
                  />
                  <button
                    onClick={() => void handleVerifyUser(phone.trim())}
                    disabled={isLoading}
                    className="rounded-xl bg-emerald-500 px-6 py-2 font-semibold 
                      text-slate-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isLoading ? "Verifying..." : "Verify"}
                  </button>
                </div>
                {error ? <p className="mt-2 text-sm text-rose-300">{error}</p> : null}

                {result && result.network_type && (
                  <div className="mt-3 flex items-center gap-3">
                    <p className="text-xs text-slate-400 font-medium">
                      Detected Carrier: <span className="text-cyan-400 ml-1 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800">{result.network_type}</span>
                    </p>
                    {result.number_verified && (
                      <span className="text-emerald-400 bg-emerald-950 border border-emerald-800 px-2 py-0.5 rounded text-[11px] uppercase tracking-wider flex items-center gap-1 font-semibold">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg> Active Number
                      </span>
                    )}
                  </div>
                )}
              </div>

              {isLoading && (
                <div className="loading-bar"><div className="loading-fill"></div></div>
              )}
              {(() => {
                const rs = result ? riskStyles[result.risk_score] : riskStyles.SUSPICIOUS;
                return (
                  <div className="space-y-3">
                    <div className={`rounded-2xl border ${rs.container} p-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between transition-colors duration-300`}>
                      <div>
                        <p className={`text-xs uppercase tracking-[0.2em] ${rs.label}`}>Risk score</p>
                        <p className={`text-2xl font-bold ${rs.val}`}>
                          {result ? `${result.risk_score} activity` : "No result yet"}
                        </p>
                        <p className={`text-sm ${rs.desc}`}>{result?.reason || healthMessage}</p>
                      </div>
                      {result && (
                        <div className="flex flex-col gap-2 items-end">
                          <span className={`inline-flex rounded-lg border ${rs.badgeBorder} px-3 py-1 text-xs font-semibold ${rs.badgeText}`}>
                            {result.decision}
                          </span>
                          <button
                            onClick={() => setShowRaw(!showRaw)}
                            className={`text-xs font-medium ${rs.btn} underline underline-offset-2 transition`}
                          >
                            {showRaw ? "Hide raw response" : "View raw response"}
                          </button>
                        </div>
                      )}
                    </div>

                    {result && !showRaw && (
                      <div className="animate-in fade-in slide-in-from-top-2 duration-500">
                        <div className="rounded-2xl border border-cyan-500/30 bg-cyan-500/5 p-4">
                          <div className="flex items-center gap-2 mb-3">
                            <div className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                            </div>
                            <p className="text-xs font-bold uppercase tracking-widest text-cyan-300">Agentic AI Insight</p>
                          </div>
                          <p className="text-sm text-cyan-100/90 leading-relaxed italic border-l-2 border-cyan-500/50 pl-3">
                            "{result.ai_insight}"
                          </p>

                          {result.logic_chain && (
                            <div className="mt-4 space-y-2">
                              <p className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">Agent Reasoning Path</p>
                              <div className="space-y-1.5">
                                {result.logic_chain.map((step, i) => (
                                  <div key={i} className="flex items-start gap-2 text-[11px] text-slate-300">
                                    <span className="text-cyan-500/50 mt-0.5">•</span>
                                    <span>{step}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })()}

              {showRaw && result ? (
                <div className="rounded-2xl border border-slate-800 bg-[#0d1117] p-4 animate-in fade-in slide-in-from-top-2 duration-300">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-500">API Response</p>
                    <div className="flex gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-rose-500/50"></div>
                      <div className="w-2.5 h-2.5 rounded-full bg-amber-500/50"></div>
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/50"></div>
                    </div>
                  </div>
                  <pre className="overflow-x-auto text-[13px] leading-relaxed text-emerald-400 font-mono">
                    {JSON.stringify(result, null, 2)}
                  </pre>
                </div>
              ) : (
                result && !isLoading && (
                  <div className="grid gap-3 lg:grid-cols-2">
                    <CheckCard
                      title="Number Verification (CAMARA)"
                      passed={result.number_verified}
                      passText="MSISDN is valid on network."
                      failText="Number data does not match carrier checks."
                    />
                    <CheckCard
                      title="SIM Swap Detection (CAMARA)"
                      passed={!result.sim_swap_recent}
                      passText="No recent SIM replacement detected."
                      failText="SIM changed recently, strong fraud signal."
                    />
                    <CheckCard
                      title="Device Status (CAMARA)"
                      passed={result.device_active}
                      passText="Device is active and reachable."
                      failText="Device inactive or unreachable."
                    />
                    <CheckCard
                      title="Location Match (CAMARA)"
                      passed={result.location_match}
                      passText="Cell and access location are aligned."
                      failText="Location mismatch detected."
                    />
                  </div>
                )
              )}
            </section>

            <section id="history" className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 scroll-mt-10">
              <h2 className="mb-3 text-lg font-semibold">Recent verification history</h2>
              {history.length === 0 ? (
                <p className="text-sm text-slate-400">No checks yet. Run verification first.</p>
              ) : (
                <div className="space-y-2">
                  {history.map((item) => (
                    <div
                      key={`${item.phone}-${item.timestamp}`}
                      className="flex flex-col gap-2 rounded-xl border border-slate-800 bg-slate-950 p-3 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div>
                        <p className="font-mono text-sm">{item.phone}</p>
                        <p className="text-xs text-slate-400">{new Date(item.timestamp).toLocaleString()}</p>
                      </div>
                      <div className="flex gap-2">
                        <span className={`rounded border px-2 py-0.5 text-xs ${riskBadge(item.risk_score)}`}>{item.risk_score}</span>
                        <span className="rounded border border-slate-700 px-2 py-0.5 text-xs text-slate-300">{item.decision}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            <section id="docs" className="space-y-6 scroll-mt-10">
              <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                  <div>
                    <h2 className="text-lg font-bold text-white">Integration Guide</h2>
                    <p className="text-sm text-slate-400">Implement our Anti-Fraud API in seconds.</p>
                  </div>
                  <div className="mt-3 sm:mt-0 flex gap-2 rounded-lg bg-slate-950 p-1 border border-slate-800 w-fit">
                    {(["curl", "js", "python"] as const).map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setDocTab(tab)}
                        className={`px-4 py-1.5 text-xs font-medium rounded-md transition ${docTab === tab
                          ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30"
                          : "text-slate-400 hover:text-white"
                          }`}
                      >
                        {tab === "curl" ? "cURL" : tab === "js" ? "Node.js" : "Python"}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="rounded-xl border border-slate-800 bg-[#0d1117] p-4 font-mono text-[13px] leading-relaxed relative group">
                  <button
                    onClick={copyDocsCode}
                    className="absolute top-3 right-3 text-slate-500 hover:text-white transition flex items-center gap-1 opacity-0 group-hover:opacity-100"
                    title="Copy code"
                  >
                    {codeCopyFeedback ? (
                      <span className="text-emerald-400 text-xs flex items-center gap-1"><svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>Copied!</span>
                    ) : (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                    )}
                  </button>
                  {docTab === "curl" && (
                    <div className="text-slate-300">
                      <span className="text-cyan-400">curl</span> -X POST {API_URL}/verify-user \<br />
                      &nbsp;&nbsp;-H <span className="text-emerald-300">"Content-Type: application/json"</span> \<br />
                      &nbsp;&nbsp;-H <span className="text-emerald-300">"Authorization: Bearer YOUR_API_KEY"</span> \<br />
                      &nbsp;&nbsp;-d <span className="text-amber-300">'{'{"phone":"08011111111"}'}'</span>
                    </div>
                  )}
                  {docTab === "js" && (
                    <div className="text-slate-300">
                      <span className="text-purple-400">const</span> axios = <span className="text-cyan-300">require</span>(<span className="text-emerald-300">'axios'</span>);<br /><br />
                      <span className="text-purple-400">async function</span> <span className="text-blue-300">checkFraud</span>(phone) {'{'}<br />
                      &nbsp;&nbsp;<span className="text-purple-400">const</span> response = <span className="text-purple-400">await</span> axios.<span className="text-blue-300">post</span>(<span className="text-emerald-300">'{API_URL}/verify-user'</span>, {'{'}<br />
                      &nbsp;&nbsp;&nbsp;&nbsp;phone<br />
                      &nbsp;&nbsp;{'}'}, {'{'}<br />
                      &nbsp;&nbsp;&nbsp;&nbsp;headers: {'{'} <span className="text-emerald-300">'Authorization'</span>: <span className="text-emerald-300">'Bearer YOUR_API_KEY'</span> {'}'}<br />
                      &nbsp;&nbsp;{'}'});<br />
                      &nbsp;&nbsp;console.<span className="text-blue-300">log</span>(response.data.decision);<br />
                      {'}'}
                    </div>
                  )}
                  {docTab === "python" && (
                    <div className="text-slate-300">
                      <span className="text-purple-400">import</span> requests<br /><br />
                      <span className="text-purple-400">def</span> <span className="text-blue-300">check_fraud</span>(phone):<br />
                      &nbsp;&nbsp;url = <span className="text-emerald-300">"{API_URL}/verify-user"</span><br />
                      &nbsp;&nbsp;headers = {'{'} <span className="text-emerald-300">"Authorization"</span>: <span className="text-emerald-300">"Bearer YOUR_API_KEY"</span> {'}'}<br />
                      &nbsp;&nbsp;data = {'{'} <span className="text-emerald-300">"phone"</span>: phone {'}'}<br /><br />
                      &nbsp;&nbsp;response = requests.<span className="text-blue-300">post</span>(url, json=data, headers=headers)<br />
                      &nbsp;&nbsp;<span className="text-purple-400">return</span> response.<span className="text-blue-300">json</span>()
                    </div>
                  )}
                </div>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
                <h3 className="mb-3 text-sm font-semibold uppercase tracking-[0.1em] text-slate-400">Response Scheme</h3>
                <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4 font-mono text-[13px] leading-relaxed">
                  <pre className="text-emerald-200">
                    {`{
                      "phone": "08033333333",
                      "number_verified": false,
                      "sim_swap_recent": false,
                      "last_swap_days": null,
                      "device_active": false,
                      "network_type": null,
                      "location_match": true,
                      "location_country": "Nigeria",
                      "risk_score": "SUSPICIOUS",
                      "decision": "STEP_UP",
                      "reason": "Device is unreachable on network",
                      "timestamp": "2026-04-28T21:40:12.721Z"
                    }`}
                  </pre>
                </div>
              </div>
            </section>

            <section id="features" className="scroll-mt-10">
              <h2 className="text-xl font-bold text-white border-b border-slate-800 pb-2 mb-4">Core Features</h2>
              <div className="grid gap-3 sm:grid-cols-2">
                <FeatureCard title="Real-time network checks" body="Use telco-backed signals instead of OTP-only security." />
                <FeatureCard title="Risk decision engine" body="Return ALLOW, STEP_UP, or BLOCK for every transaction." />
                <FeatureCard title="Simple integration" body="One endpoint to verify number, SIM, device, and location." />
                <FeatureCard title="Audit visibility" body="Track every verification with a timestamp and decision." />
              </div>
            </section>

            <section id="pricing" className="scroll-mt-10">
              <h2 className="text-xl font-bold text-white border-b border-slate-800 pb-2 mb-4">Pricing Plans</h2>
              <div className="grid gap-3 lg:grid-cols-3">
                <PricingCard
                  title="Starter"
                  price="$10"
                  subtitle="Per month"
                  bullets={["SIM Swap Detection (CAMARA)", "Number Verification (CAMARA)", "1,000 checks/month"]}
                  isActive={apiKeyPayload?.plan === "STARTER"}
                  onClick={() => {
                    setPlan("STARTER");
                    scrollToSection("apikey");
                  }}
                />
                <PricingCard
                  title="Growth"
                  price="$99"
                  subtitle="Per month"
                  bullets={["Device Status (CAMARA)", "Location Verification (CAMARA)", "10,000 checks/month"]}
                  featured
                  isActive={apiKeyPayload?.plan === "GROWTH"}
                  onClick={() => {
                    setPlan("GROWTH");
                    scrollToSection("apikey");
                  }}
                />
                <PricingCard
                  title="Enterprise"
                  price="Custom"
                  subtitle="For Banks & Payment Apps"
                  bullets={["Agentic AI Fraud Analyst", "Global Location Triangulation", "Unlimited Capacity"]}
                  isActive={apiKeyPayload?.plan === "ENTERPRISE"}
                  onClick={() => {
                    setPlan("ENTERPRISE");
                    scrollToSection("apikey");
                  }}
                />
              </div>
            </section>

            <section id="apikey" className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 scroll-mt-10">
              <h2 className="mb-3 text-lg font-semibold">Get API key</h2>
              <p className="mb-4 text-sm text-slate-400">
                Fill details below to create a demo key judges can test immediately.
              </p>

              <div className="grid gap-3 sm:grid-cols-2">
                <input
                  value={ownerName}
                  onChange={(e) => setOwnerName(e.target.value)}
                  placeholder="Owner name"
                  disabled={apiKeyLoading}
                  className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 outline-none focus:border-cyan-500 disabled:opacity-50"
                />
                <input
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="Company name"
                  disabled={apiKeyLoading}
                  className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 outline-none focus:border-cyan-500 disabled:opacity-50"
                />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email address"
                  disabled={apiKeyLoading}
                  className="col-span-full sm:col-span-1 rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 outline-none focus:border-cyan-500 disabled:opacity-50"
                />
                <select
                  value={plan}
                  onChange={(e) => setPlan(e.target.value as any)}
                  disabled={apiKeyLoading}
                  className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 outline-none focus:border-cyan-500 disabled:opacity-50"
                >
                  <option value="STARTER">Starter ($10/mo)</option>
                  <option value="GROWTH">Growth ($99/mo)</option>
                  <option value="ENTERPRISE">Enterprise (Custom)</option>
                </select>
                <button
                  onClick={() => handleGenerateApiKey()}
                  disabled={apiKeyLoading}
                  className="col-span-full rounded-xl bg-cyan-500 px-4 py-3 font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {apiKeyLoading && paymentState === "idle" ? <span className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></span> : null}
                  {apiKeyLoading && paymentState === "idle" ? "Processing..." : "Generate key"}
                </button>
              </div>

              {apiKeyError && (
                <div className="mt-4 p-3 rounded-xl border border-rose-500/40 bg-rose-500/10 flex items-center gap-3">
                  <svg className="w-5 h-5 text-rose-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  <p className="text-sm text-rose-300">{apiKeyError}</p>
                </div>
              )}

              {downgradeConfirm && (
                <div className="mt-4 rounded-xl border border-amber-500/40 bg-amber-500/10 p-4 space-y-3">
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-amber-400 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" /></svg>
                    <div>
                      <p className="text-sm font-semibold text-amber-200">Active plan detected — Downgrade confirmation required</p>
                      <p className="text-xs text-amber-100/70 mt-1">
                        You currently have an active <span className="font-bold text-amber-300">{downgradeConfirm.currentPlan}</span> plan valid until <span className="font-bold text-amber-300">{new Date(downgradeConfirm.expiry).toLocaleDateString()}</span>. Switching to <span className="font-bold text-amber-300">{downgradeConfirm.targetPlan}</span> will cancel your current plan immediately and cannot be undone.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={forceDowngrade} className="rounded-lg bg-amber-500 px-4 py-2 text-xs font-bold text-slate-950 hover:bg-amber-400 transition">
                      Yes, downgrade my plan
                    </button>
                    <button onClick={() => setDowngradeConfirm(null)} className="rounded-lg border border-slate-700 px-4 py-2 text-xs font-medium text-slate-300 hover:text-white transition">
                      Cancel — keep {downgradeConfirm.currentPlan}
                    </button>
                  </div>
                </div>
              )}

              {apiKeyLoading && (paymentState === "processing" || paymentState === "provisioning") && (
                <div className="mt-4 rounded-xl border border-cyan-500/30 bg-cyan-500/5 p-5 flex flex-col items-center justify-center gap-3 animate-in fade-in duration-300">
                  <div className="relative flex items-center justify-center">
                    <div className="absolute w-12 h-12 border-4 border-cyan-500/20 rounded-full"></div>
                    <div className="absolute w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
                    <svg className="w-5 h-5 text-cyan-400 z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                  </div>
                  {paymentState === "processing" ? (
                    <>
                      <p className="text-sm font-medium text-cyan-300">Establishing secure connection</p>
                      <p className="text-xs text-slate-400">Processing payment via Gateway ending in ...4242</p>
                    </>
                  ) : (
                    <>
                      <p className="text-sm font-medium text-cyan-300">Provisioning Custom Enterprise SLA</p>
                      <p className="text-xs text-slate-400">Allocating premium dedicated endpoints for your organization...</p>
                    </>
                  )}
                </div>
              )}

              {apiKeyPayload && !apiKeyLoading && (
                <div className="mt-4 rounded-xl border border-emerald-500/40 bg-emerald-500/10 p-4 animate-in slide-in-from-bottom-2 duration-300 shadow-[0_0_15px_rgba(16,185,129,0.15)]">
                  {retrievedNotice && (
                    <div className="mb-3 rounded-lg border border-cyan-500/30 bg-cyan-500/10 px-3 py-2 text-xs font-medium text-cyan-200">
                      Existing active key securely retrieved. No payment was deducted.
                    </div>
                  )}
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    </div>
                    <p className="text-xs uppercase tracking-[0.2em] font-semibold text-emerald-300">Active API Key</p>
                  </div>
                  <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 flex justify-between items-center group">
                    <p className="font-mono text-sm text-emerald-200 break-all">{apiKeyPayload.key}</p>
                    <button
                      onClick={() => void copyToClipboard(apiKeyPayload.key)}
                      className="text-slate-500 hover:text-emerald-400 transition ml-2 py-1 px-2 shrink-0 flex items-center gap-1"
                    >
                      {copyFeedback ? (
                        <span className="text-emerald-400 flex items-center gap-1"><svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>Copied!</span>
                      ) : (
                        <span>Copy</span>
                      )}
                    </button>
                  </div>
                  <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-3 border-t border-emerald-500/20 pt-3">
                    <div>
                      <p className="text-[10px] text-emerald-500/80 uppercase">Owner / Email</p>
                      <p className="text-xs font-semibold text-emerald-100/90 truncate" title={apiKeyPayload.email}>{apiKeyPayload.owner}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-emerald-500/80 uppercase">Plan</p>
                      <p className="text-xs font-semibold text-emerald-100/90">{apiKeyPayload.plan}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-emerald-500/80 uppercase">Purchased</p>
                      <p className="text-xs font-semibold text-emerald-100/90 mt-0.5">
                        {new Date(apiKeyPayload.purchased_date).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] text-emerald-500/80 uppercase">Expiry ({apiKeyPayload.plan === "STARTER" ? "Free" : "Paid"})</p>
                      <p className="text-xs font-semibold text-emerald-100/90 mt-0.5 text-amber-200">
                        {new Date(apiKeyPayload.expiry_date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </section>
          </div>

          <footer className="mt-6 rounded-xl border border-slate-800 bg-slate-900/50 px-3 py-2 text-xs text-slate-400">
            Decision recommendation: {result ? decisionText[result.decision] : "Run verification first"}
          </footer>
        </main>
      </div>

      <ChatWidget lastResult={result} />
    </div>
  );
}
