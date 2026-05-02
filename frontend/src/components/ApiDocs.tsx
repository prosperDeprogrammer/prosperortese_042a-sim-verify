import React, { useState } from 'react';

export const ApiDocs: React.FC = () => {
  const [activeTab, setActiveTab] = useState('sim-swap');
  const [activeLang, setActiveLang] = useState('curl');
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const text = currentContent.snippets[activeLang as 'curl' | 'node'];
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const endpoints = [
    { id: 'auth', name: 'Authentication', method: 'POST', path: '/v1/auth' },
    { id: 'sim-swap', name: 'Check SIM Swap', method: 'POST', path: '/v1/sim-swap/check' },
    { id: 'number-verify', name: 'Verify Number', method: 'POST', path: '/v1/number-verification/verify' },
    { id: 'location-verify', name: 'Verify Location', method: 'POST', path: '/v1/location-verification/verify' }
  ];

  const content = {
    'auth': {
      title: 'Authentication',
      desc: 'Get your session token using your API key. Include this token in the Authorization header of all subsequent API calls.',
      snippets: {
        curl: `curl -X POST https://api.simverify.pro/v1/auth \\
  -H "Content-Type: application/json" \\
  -d '{"apiKey": "sv_live_123456789"}'`,
        node: `const axios = require('axios');

const response = await axios.post('https://api.simverify.pro/v1/auth', {
  apiKey: 'sv_live_123456789'
});

console.log(response.data.token);`
      },
      response: `{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresIn": 3600
}`
    },
    'sim-swap': {
      title: 'Check SIM Swap',
      desc: 'Check if a mobile number has recently undergone a SIM swap. Crucial for preventing account takeovers during password resets or high-value transactions.',
      snippets: {
        curl: `curl -X POST https://api.simverify.pro/v1/sim-swap/check \\
  -H "Authorization: Bearer <YOUR_TOKEN>" \\
  -H "Content-Type: application/json" \\
  -d '{
    "phoneNumber": "2349000000000",
    "maxAge": 24
  }'`,
        node: `const axios = require('axios');

const response = await axios.post('https://api.simverify.pro/v1/sim-swap/check', {
  phoneNumber: '2349000000000',
  maxAge: 24 // hours
}, {
  headers: { 'Authorization': 'Bearer <YOUR_TOKEN>' }
});`
      },
      response: `{
  "success": true,
  "swapped": false,
  "lastSwapDate": "2023-11-15T08:30:00Z",
  "riskLevel": "LOW"
}`
    },
    'number-verify': {
      title: 'Verify Number',
      desc: 'Silently verify a mobile number without sending SMS OTPs. Provides a seamless passwordless onboarding experience for legitimate users.',
      snippets: {
        curl: `curl -X POST https://api.simverify.pro/v1/number-verification/verify \\
  -H "Authorization: Bearer <YOUR_TOKEN>" \\
  -H "Content-Type: application/json" \\
  -d '{
    "phoneNumber": "2349000000000",
    "hashedIp": "a8f5f167f44f4964e6c998dee827110c"
  }'`,
        node: `// Initiate Number Verification
const response = await axios.post('https://api.simverify.pro/v1/number-verification/verify', {
  phoneNumber: '2349000000000',
  hashedIp: "user_ip_hash"
}, {
  headers: { 'Authorization': 'Bearer <YOUR_TOKEN>' }
});`
      },
      response: `{
  "success": true,
  "verified": true,
  "networkId": "MTN-NG",
  "matchScore": 1.0
}`
    },
    'location-verify': {
      title: 'Verify Location',
      desc: 'Verify if a mobile device is physically present within a specific geographical area. Essential for geo-fenced commerce and fraud prevention.',
      snippets: {
        curl: `curl -X POST https://api.simverify.pro/v1/location-verification/verify \\
  -H "Authorization: Bearer <YOUR_TOKEN>" \\
  -H "Content-Type: application/json" \\
  -d '{
    "phoneNumber": "2349000000000",
    "latitude": 6.5244,
    "longitude": 3.3792,
    "radius": 2000
  }'`,
        node: `const response = await axios.post('https://api.simverify.pro/v1/location-verification/verify', {
  phoneNumber: '2349000000000',
  latitude: 6.5244,
  longitude: 3.3792,
  radius: 2000 // meters
}, {
  headers: { 'Authorization': 'Bearer <YOUR_TOKEN>' }
});`
      },
      response: `{
  "success": true,
  "match": true,
  "distanceEstimation": "< 1km"
}`
    }
  };

  const currentContent = content[activeTab as keyof typeof content];

  return (
    <div className="min-h-[80vh] pt-32 md:pt-40 pb-16 px-6 max-w-7xl mx-auto w-full flex flex-col md:flex-row gap-8 lg:gap-12 animate-fade-in">
      {/* Sidebar */}
      <aside className="w-full md:w-64 flex-shrink-0">
        <h2 className="text-xl font-black text-white mb-6 uppercase tracking-widest">API Reference</h2>

        <div className="space-y-1">
          {endpoints.map(ep => (
            <button
              key={ep.id}
              onClick={() => setActiveTab(ep.id)}
              className={`w-full text-left px-4 py-3 rounded-xl transition-all font-medium text-sm flex items-center justify-between group
                ${activeTab === ep.id
                  ? 'bg-brand-500/10 text-brand-400 border border-brand-500/20'
                  : 'text-dark-400 hover:bg-dark-800/50 hover:text-white border border-transparent'
                }`}
            >
              {ep.name}
              <span className={`text-[9px] font-black font-mono px-1.5 py-0.5 rounded ${ep.method === 'POST' ? 'bg-safe/10 text-safe' : 'bg-brand-500/10 text-brand-500'
                }`}>
                {ep.method}
              </span>
            </button>
          ))}
        </div>

        <div className="mt-8 p-5 rounded-2xl bg-dark-900 border border-dark-800">
          <p className="text-xs text-dark-400 font-medium mb-3">Powered by</p>
          <div className="flex items-center gap-2">
            <span className="font-black text-white text-sm">Nokia</span>
            <div className="h-3 w-px bg-dark-700"></div>
            <span className="text-[10px] font-bold text-dark-500 uppercase tracking-widest">Network as Code</span>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-w-0">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <span className="bg-brand-500/10 text-brand-400 font-mono text-xs font-bold px-2.5 py-1 rounded-md border border-brand-500/20">
              {endpoints.find(e => e.id === activeTab)?.method}
            </span>
            <span className="text-dark-300 font-mono text-sm break-all">
              {endpoints.find(e => e.id === activeTab)?.path}
            </span>
          </div>
          <h1 className="text-3xl font-black text-white mb-4 tracking-tight">{currentContent.title}</h1>
          <p className="text-dark-400 leading-relaxed max-w-3xl">{currentContent.desc}</p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* Request Examples */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white uppercase tracking-widest">Request</h3>
              <div className="flex bg-dark-900 p-1 rounded-lg border border-dark-800">
                <button
                  onClick={() => setActiveLang('curl')}
                  className={`px-3 py-1 text-[10px] font-bold uppercase rounded-md transition-colors ${activeLang === 'curl' ? 'bg-dark-800 text-white' : 'text-dark-500 hover:text-white'}`}
                >
                  cURL
                </button>
                <button
                  onClick={() => setActiveLang('node')}
                  className={`px-3 py-1 text-[10px] font-bold uppercase rounded-md transition-colors ${activeLang === 'node' ? 'bg-dark-800 text-white' : 'text-dark-500 hover:text-white'}`}
                >
                  Node.js
                </button>
              </div>
            </div>

            <div className="relative group h-[18rem]">
              <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={handleCopy}
                  className={`p-1.5 rounded-md border transition-all ${
                    copied 
                    ? 'bg-safe/20 border-safe text-safe' 
                    : 'bg-dark-800 hover:bg-dark-700 text-dark-300 hover:text-white border-dark-700'
                  }`}
                  title="Copy to clipboard"
                >
                  {copied ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                  )}
                </button>
              </div>
              <pre className="bg-[#0D1117] p-5 rounded-2xl border border-dark-800 overflow-x-auto text-xs font-mono text-brand-300 leading-loose h-full">
                <code>{currentContent.snippets[activeLang as 'curl' | 'node']}</code>
              </pre>
            </div>
          </div>

          {/* Response Schema */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white uppercase tracking-widest">Response</h3>
              <span className="text-[10px] font-bold text-safe bg-safe/10 border border-safe/20 px-2 py-1 rounded-md">200 OK</span>
            </div>

            <pre className="bg-[#0D1117] p-5 rounded-2xl border border-dark-800 overflow-x-auto text-xs font-mono text-safe leading-loose h-[18rem]">
              <code>{currentContent.response}</code>
            </pre>
          </div>
        </div>
      </main>
    </div>
  );
};
