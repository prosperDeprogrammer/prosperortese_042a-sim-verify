import React, { useState } from 'react';

// --- Standout Component: Network Pulse ---
const NetworkPulse = () => (
  <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-5">
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-brand-500/30 rounded-full animate-ping duration-[4s]"></div>
  </div>
);

// --- Landing Page ---
export const LandingPage: React.FC<{ onStart: () => void; onSandbox: () => void }> = ({ onStart, onSandbox }) => {
  return (

    <div className="relative pt-32 md:pt-40 pb-16 px-6 min-h-[80vh] w-full">
      <NetworkPulse />
      <div className="max-w-5xl mx-auto text-center relative z-10">
        {/* <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-[10px] md:text-xs font-bold mb-6 animate-fade-in uppercase tracking-widest">
          <span className="flex h-1.5 w-1.5 rounded-full bg-brand-500 animate-pulse"></span>
          Theme 5: SME Enablement & Digital Commerce
        </div> */}

        <h1 className="text-3xl md:text-5xl lg:text-7xl font-black text-white mb-6 md:mb-8 leading-[1.1] tracking-tighter">
          Empowering SME <br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-brand-400 via-accent-400 to-brand-600">
            Trust & Growth
          </span>
        </h1>

        <p className="text-sm md:text-xl text-dark-400 mb-8 md:mb-12 max-w-2xl mx-auto leading-relaxed font-medium">
          The unified API for African SMEs to enable **one-click checkout security**, passwordless onboarding, and fraud-proof digital commerce using GSMA Open Gateway.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-3">
          <button
            onClick={onStart}
            className="btn-primary w-full sm:w-auto group"
          >
            Start Verification Free
            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
          </button>
          <button onClick={onSandbox} className="btn-secondary w-full sm:w-auto">
            Enter API Sandbox
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto text-center relative z-10">


        {/* Use Cases Section */}
        <div className="mt-32 text-left">
          <div className="text-center mb-16">
            <h2 className="text-2xl md:text-4xl font-black text-white mb-4 tracking-tight">Real-World SME Applications</h2>
            <p className="text-dark-400 text-sm md:text-lg max-w-2xl mx-auto">How African businesses use SimVerify to build trust and scale securely.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Use Case 1 */}
            <div className="bg-dark-900/40 p-8 rounded-[2rem] border border-white/5 hover:border-brand-500/30 transition-all group">
              <div className="w-12 h-12 bg-accent-500/10 rounded-2xl flex items-center justify-center text-accent-400 mb-6 group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Account Takeover Prevention</h3>
              <p className="text-dark-400 text-sm leading-relaxed mb-4">Block hackers before they access accounts by checking for recent SIM Swaps during password resets or high-value checkout.</p>
              <div className="inline-flex items-center gap-2 text-[10px] font-bold text-brand-500 uppercase tracking-widest">
                <span className="w-1.5 h-1.5 bg-brand-500 rounded-full"></span> simSwap API
              </div>
            </div>

            {/* Use Case 2 */}
            <div className="bg-dark-900/40 p-8 rounded-[2rem] border border-white/5 hover:border-brand-500/30 transition-all group">
              <div className="w-12 h-12 bg-safe/10 rounded-2xl flex items-center justify-center text-safe mb-6 group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Passwordless Onboarding</h3>
              <p className="text-dark-400 text-sm leading-relaxed mb-4">Increase conversion rates by instantly verifying mobile numbers silently in the background. No SMS OTPs required.</p>
              <div className="inline-flex items-center gap-2 text-[10px] font-bold text-brand-500 uppercase tracking-widest">
                <span className="w-1.5 h-1.5 bg-brand-500 rounded-full"></span> numberVerification API
              </div>
            </div>

            {/* Use Case 3 */}
            <div className="bg-dark-900/40 p-8 rounded-[2rem] border border-white/5 hover:border-brand-500/30 transition-all group">
              <div className="w-12 h-12 bg-suspicious/10 rounded-2xl flex items-center justify-center text-suspicious mb-6 group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /></svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Geo-Fenced Commerce</h3>
              <p className="text-dark-400 text-sm leading-relaxed mb-4">Validate that a transaction is originating from the registered device's physical location to stop Card-Not-Present fraud.</p>
              <div className="inline-flex items-center gap-2 text-[10px] font-bold text-brand-500 uppercase tracking-widest">
                <span className="w-1.5 h-1.5 bg-brand-500 rounded-full"></span> locationVerify API
              </div>
            </div>
          </div>
        </div>

        {/* SME Success Stories - High Impact */}
        <div className="mt-32 overflow-hidden relative">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-[10px] font-black uppercase tracking-widest mb-4">
              <span className="flex h-1.5 w-1.5 rounded-full bg-brand-500 animate-pulse"></span>
              Live Impact Report
            </div>
            <h2 className="text-2xl md:text-4xl font-black text-white mb-4 tracking-tight">SME Success Stories</h2>
            <p className="text-dark-400 text-sm md:text-lg max-w-2xl mx-auto px-6">Empowering thousands of merchants to trade securely across the continent.</p>
          </div>

          <div className="relative">
            {/* Fades for smooth edge transition */}
            <div className="absolute inset-y-0 left-0 w-20 md:w-40 bg-gradient-to-r from-dark-950 to-transparent z-10"></div>
            <div className="absolute inset-y-0 right-0 w-20 md:w-40 bg-gradient-to-l from-dark-950 to-transparent z-10"></div>

            <div className="animate-marquee flex gap-6 md:gap-8 py-4">
              {[
                { name: 'Lagos Logistics', impact: 'Fraud reduced by 92%', tag: 'Logistics', color: 'text-brand-400', quote: "We cut fraud to zero while speeding up our deliveries." },
                { name: 'Kigali Fintech', impact: '100% Account Security', tag: 'Fintech', color: 'text-accent-400', quote: "Instantly verified our users with telco-grade signals." },
                { name: 'Nairobi Retail', impact: 'Zero OTP Interception', tag: 'E-commerce', color: 'text-safe', quote: "The SIM-swap detection is a literal game-changer." },
                { name: 'Accra Pay', impact: 'Frictionless Onboarding', tag: 'Payments', color: 'text-brand-500', quote: "Increased checkout conversion by 28% overnight." },
                { name: 'Joburg Delivery', impact: 'Verified Tracking', tag: 'Last Mile', color: 'text-suspicious', quote: "Finally, a fraud solution built for African markets." },
                // Duplicate for loop
                { name: 'Lagos Logistics', impact: 'Fraud reduced by 92%', tag: 'Logistics', color: 'text-brand-400', quote: "We cut fraud to zero while speeding up our deliveries." },
                { name: 'Kigali Fintech', impact: '100% Account Security', tag: 'Fintech', color: 'text-accent-400', quote: "Instantly verified our users with telco-grade signals." },
                { name: 'Nairobi Retail', impact: 'Zero OTP Interception', tag: 'E-commerce', color: 'text-safe', quote: "The SIM-swap detection is a literal game-changer." },
                { name: 'Accra Pay', impact: 'Frictionless Onboarding', tag: 'Payments', color: 'text-brand-500', quote: "Increased checkout conversion by 28% overnight." },
                { name: 'Joburg Delivery', impact: 'Verified Tracking', tag: 'Last Mile', color: 'text-suspicious', quote: "Finally, a fraud solution built for African markets." }
              ].map((story, i) => (
                <div key={i} className="flex-shrink-0 bg-dark-900/40 p-6 md:p-8 rounded-[2.5rem] border border-white/5 w-[280px] md:w-[350px] hover:border-brand-500/30 transition-all group">
                  <div className="flex justify-between items-start mb-6">
                    <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-1 bg-white/5 rounded-md ${story.color}`}>{story.tag}</span>
                    <svg className="w-5 h-5 text-dark-700" fill="currentColor" viewBox="0 0 24 24"><path d="M14.017 21L14.017 18C14.017 16.8954 14.9124 16 16.017 16H19.017C19.5693 16 20.017 15.5523 20.017 15V9C20.017 8.44772 19.5693 8 19.017 8H16.017C14.9124 8 14.017 7.10457 14.017 6V3L10.017 3V15C10.017 18.3137 12.7033 21 16.017 21H14.017ZM4.017 21L4.017 18C4.017 16.8954 4.91243 16 6.017 16H9.017C9.56928 16 10.017 15.5523 10.017 15V9C10.017 8.44772 9.56928 8 9.017 8H6.017C4.91243 8 4.017 7.10457 4.017 6V3L0.017 3V15C0.017 18.3137 2.7033 21 6.017 21H4.017Z" /></svg>
                  </div>
                  <p className="text-dark-300 text-sm italic mb-4 leading-relaxed">"{story.quote}"</p>
                  <p className="text-white font-bold text-base mb-1">{story.name}</p>
                  <p className={`text-[11px] font-black ${story.color} uppercase tracking-widest`}>{story.impact}</p>
                </div>
              ))}
            </div>
          </div>
        </div>



        {/* Pricing & Impact Sections */}
        <div className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
          {[
            {
              title: 'Starter Plan',
              price: 'Free',
              desc: 'For emerging SMEs.',
              features: ['500 checks/month', 'Full fraud detection (SIM + Location)']
            },
            {
              title: 'Growth Plan',
              price: '$20',
              period: '/month',
              desc: 'For scaling startups.',
              features: ['10,000 checks', 'Advanced risk insights + dashboard', 'Live chat support', 'AI insights'],
              popular: true
            },
            {
              title: 'Enterprise',
              price: 'Custom pricing',
              desc: 'For high-volume commerce.',
              features: ['API integration + priority support', 'Unlimited checks']
            }
          ].map((plan, i) => (
            <div key={i} className={`glass-card p-8 border-t-2 ${plan.popular ? 'border-brand-500 scale-105 bg-brand-500/5' : 'border-dark-800 opacity-80'}`}>
              {plan.popular && <span className="bg-brand-500 text-white text-[8px] font-black uppercase px-2 py-1 rounded-full mb-4 inline-block tracking-widest">Most Popular</span>}
              <h3 className="text-xl font-black text-white mb-1">{plan.title}</h3>
              <p className="text-dark-500 text-xs mb-6">{plan.desc}</p>
              <div className="text-3xl font-black text-white mb-6">{plan.price}{plan.period && <span className="text-xs text-dark-600 font-medium tracking-normal"> {plan.period}</span>}</div>
              <ul className="space-y-3 mb-8">
                {plan.features.map((f, j) => (
                  <li key={j} className="flex items-center gap-2 text-[10px] md:text-xs text-dark-300 font-medium">
                    <svg className="w-3 h-3 text-brand-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                    {f}
                  </li>
                ))}
              </ul>
              <button onClick={onStart} className={`w-full py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${plan.popular ? 'bg-brand-600 text-white shadow-glow' : 'bg-dark-950 text-dark-400 border border-dark-800 hover:border-brand-500/50 hover:text-brand-400'}`}>Choose {plan.title}</button>
            </div>
          ))}
        </div>

      </div>

      {/* Network Partners Marquee */}
      <div className="mt-20 py-10 w-full max-w-6xl mx-auto border-t border-white/5 overflow-hidden group relative z-10">
        <p className="text-[10px] font-black text-dark-500 uppercase tracking-[0.3em] text-center mb-8">Infrastructure & Network Partners</p>

        <div className="relative">
          {/* Fades for smooth edge transition */}
          <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-dark-950 to-transparent z-10"></div>
          <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-dark-950 to-transparent z-10"></div>

          <div className="animate-marquee flex items-center gap-12 md:gap-20">
            {[
              { name: 'GSMA', sub: 'OPEN GATEWAY', color: 'text-white' },
              { name: 'Nokia', sub: 'NAC PLATFORM', color: 'text-brand-500' },
              { name: 'MTN', sub: 'NIGERIA', color: 'text-[#FFCC00]' },
              { name: 'Airtel', sub: 'NIGERIA', color: 'text-[#FF0000]' },
              { name: 'Glo', sub: 'NIGERIA', color: 'text-[#00FF00]' },
              { name: '9mobile', sub: 'NIGERIA', color: 'text-[#006633]' },
              // Duplicate for seamless loop
              { name: 'GSMA', sub: 'OPEN GATEWAY', color: 'text-white' },
              { name: 'Nokia', sub: 'NAC PLATFORM', color: 'text-brand-500' },
              { name: 'MTN', sub: 'NIGERIA', color: 'text-[#FFCC00]' },
              { name: 'Airtel', sub: 'NIGERIA', color: 'text-[#FF0000]' },
              { name: 'Glo', sub: 'NIGERIA', color: 'text-[#00FF00]' },
              { name: '9mobile', sub: 'NIGERIA', color: 'text-[#006633]' }
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
