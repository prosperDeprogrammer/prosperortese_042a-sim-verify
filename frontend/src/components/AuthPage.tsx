import React, { useState } from 'react';

interface AuthPageProps {
  onSuccess: (key: string) => void;
  onCancel: () => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({ onSuccess, onCancel }) => {
  const [view, setView] = useState<'signup' | 'signin'>('signup');
  const [isProcessing, setIsProcessing] = useState(false);
  const [email, setEmail] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [businessType, setBusinessType] = useState('E-commerce');
  const [country, setCountry] = useState('Select Country');
  const [existingKey, setExistingKey] = useState('');
  const [isSignedUp, setIsSignedUp] = useState(false);
  const [generatedKey, setGeneratedKey] = useState('');
  const [isCopied, setIsCopied] = useState(false);

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setTimeout(() => {
      const key = `sv_live_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
      setGeneratedKey(key);
      setIsProcessing(false);
      setIsSignedUp(true);
    }, 1500);
  };

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (existingKey.length > 10) {
      onSuccess(existingKey);
    }
  };

  return (
    <div className="min-h-screen bg-dark-950 flex flex-col lg:flex-row relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand-500 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent-500 rounded-full blur-[120px]"></div>
      </div>

      {/* Left Side: Branding/Value Prop - Hidden on Mobile */}
      <div className="hidden lg:flex lg:w-[45%] px-8 md:px-12 lg:px-16 pt-8 md:pt-12 pb-12 flex-col justify-between relative z-10 bg-dark-900/20 backdrop-blur-3xl border-r border-white/5">
        <div>
          <div className="mb-8 md:mb-12">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 bg-brand-500 rounded-2xl flex items-center justify-center shadow-glow">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
              </div>
              <h1 className="text-2xl font-black text-white tracking-tighter">SimVerify Pro</h1>
            </div>

            <h2 className="text-4xl md:text-5xl font-black text-white leading-[1.1] tracking-tight mb-8">
              Empowering SMEs with <span className="text-brand-gradient">Network Intelligence.</span>
            </h2>
            <p className="text-dark-400 text-lg leading-relaxed max-w-md">
              Join the GSMA Open Gateway ecosystem. Secure your transactions and build consumer trust with live telecom signals.
            </p>
          </div>

          <div className="space-y-6">
            {[
              { title: 'Zero Friction', desc: 'Verify identities in the background via Nokia NAC.' },
              { title: 'Instant Protection', desc: 'Real-time SIM swap and location anomaly alerts.' },
              { title: 'Built for Africa', desc: 'Direct carrier integration across MTN, Airtel, and more.' }
            ].map((feature, i) => (
              <div key={i} className="flex gap-4">
                <div className="w-6 h-6 rounded-full bg-brand-500/10 flex items-center justify-center flex-shrink-0 text-brand-500">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                </div>
                <div>
                  <h4 className="text-white font-bold text-sm mb-1">{feature.title}</h4>
                  <p className="text-dark-500 text-xs leading-relaxed">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-12 mt-12 border-t border-white/5">
          <p className="text-dark-600 text-[10px] font-black uppercase tracking-[0.3em]">
            Trusted by the GSMA Open Gateway Initiative
          </p>
        </div>
      </div>

      {/* Right Side: Form */}
      <div className="flex-1 flex items-start justify-center px-6 md:px-12 pt-6 md:pt-10 lg:pt-16 pb-12 relative z-10">
        <div className="w-full max-w-md animate-fade-in">
          {/* Global Back Button for Mobile & Desktop */}
          <button 
            onClick={onCancel}
            className="flex items-center gap-2 text-dark-500 hover:text-white transition-colors mb-8 group"
          >
            <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            <span className="text-[11px] font-bold uppercase tracking-widest">Back to Home</span>
          </button>

          {!isSignedUp ? (
            <>
              <div className="mb-6 text-center lg:text-left">
                <h3 className="text-3xl font-black text-white mb-2 tracking-tight">
                  {view === 'signup' ? 'Create SME Account' : 'Welcome Back'}
                </h3>
                <p className="text-dark-400 text-sm font-medium">
                  {view === 'signup'
                    ? 'Get your production API key in seconds.'
                    : 'Access your secure developer dashboard.'}
                </p>
              </div>

              {view === 'signup' ? (
                <form onSubmit={handleSignUp} className="space-y-5">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-[10px] font-black text-dark-500 mb-2 uppercase tracking-[0.2em] ml-1">Business Name</label>
                      <input
                        type="text"
                        required
                        placeholder="Business Name"
                        className="input-field w-full"
                        value={businessName}
                        onChange={(e) => setBusinessName(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-dark-500 mb-2 uppercase tracking-[0.2em] ml-1">Work Email</label>
                      <input
                        type="email"
                        required
                        placeholder="ceo@business.com"
                        className="input-field w-full"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-black text-dark-500 mb-2 uppercase tracking-[0.2em] ml-1">Type</label>
                        <select
                          className="input-field w-full appearance-none cursor-pointer"
                          value={businessType}
                          onChange={(e) => setBusinessType(e.target.value)}
                        >
                          <option>E-commerce</option>
                          <option>Logistics</option>
                          <option>Fintech</option>
                          <option>Retail</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] font-black text-dark-500 mb-2 uppercase tracking-[0.2em] ml-1">Country</label>
                        <select
                          className="input-field w-full appearance-none cursor-pointer"
                          value={country}
                          onChange={(e) => setCountry(e.target.value)}
                        >
                          <option>Nigeria</option>
                          <option>Kenya</option>
                          <option>Ghana</option>
                          <option>South Africa</option>
                          <option>Rwanda</option>
                          <option>Senegal</option>
                          <option>Egypt</option>
                          <option>Ethiopia</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 px-1 pt-2">
                    <input type="checkbox" required className="mt-1 w-4 h-4 rounded border-dark-800 bg-dark-950 text-brand-500 focus:ring-brand-500/20" id="terms" />
                    <label htmlFor="terms" className="text-[10px] text-dark-500 leading-relaxed">
                      I agree to the <span className="text-brand-400 hover:underline cursor-pointer">Terms</span> and <span className="text-brand-400 hover:underline cursor-pointer">Privacy Policy</span>.
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={isProcessing}
                    className="btn-primary w-full mt-2"
                  >
                    {isProcessing ? 'Securing Credentials...' : 'Register & Generate Key'}
                  </button>

                  <div className="text-center mt-8 pt-8 border-t border-white/5">
                    <p className="text-dark-500 text-xs">
                      Already have a key?{' '}
                      <button
                        type="button"
                        onClick={() => setView('signin')}
                        className="text-brand-500 font-bold hover:underline"
                      >
                        Sign In
                      </button>
                    </p>
                  </div>
                </form>
              ) : (
                <form onSubmit={handleSignIn} className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-[10px] font-black text-dark-500 mb-2 uppercase tracking-[0.2em] ml-1">Work Email</label>
                      <input
                        type="email"
                        required
                        placeholder="ceo@business.com"
                        className="input-field w-full"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-dark-500 mb-2 uppercase tracking-[0.2em] ml-1">Password</label>
                      <input
                        type="password"
                        required
                        placeholder="••••••••"
                        className="input-field w-full"
                      />
                    </div>
                  </div>

                  <button type="submit" className="btn-primary w-full">
                    Sign In to Dashboard
                  </button>

                  <div className="text-center mt-8 pt-8 border-t border-white/5">
                    <p className="text-dark-500 text-xs">
                      New to SimVerify?{' '}
                      <button
                        type="button"
                        onClick={() => setView('signup')}
                        className="text-brand-500 font-bold hover:underline"
                      >
                        Create SME Account
                      </button>
                    </p>
                  </div>
                </form>
              )}
            </>
          ) : (
            <div className="text-center animate-fade-in">
              <div className="w-20 h-20 bg-safe/10 rounded-[2rem] flex items-center justify-center mb-8 mx-auto">
                <svg className="w-10 h-10 text-safe" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
              </div>
              <h3 className="text-4xl font-black text-white mb-4 tracking-tight">Success!</h3>
              <p className="text-dark-400 text-sm mb-12 font-medium">Your production-ready API key is now active and ready for integration.</p>

              <div
                className={`bg-dark-950 p-8 rounded-[2rem] border transition-all duration-300 mb-12 group cursor-copy active:scale-[0.98] ${isCopied ? 'border-safe/50 bg-safe/5' : 'border-white/5'}`}
                onClick={() => {
                  navigator.clipboard.writeText(generatedKey);
                  setIsCopied(true);
                  setTimeout(() => setIsCopied(false), 2000);
                }}
              >
                <p className={`text-[10px] font-black mb-4 uppercase tracking-[0.2em] transition-colors ${isCopied ? 'text-safe' : 'text-brand-500'}`}>
                  {isCopied ? '✓ Saved to Clipboard' : 'Your Secret API Key'}
                </p>
                <code className={`text-base font-mono break-all bg-dark-900 px-4 py-2 rounded-xl block transition-colors ${isCopied ? 'text-safe' : 'text-white'}`}>{generatedKey}</code>
              </div>

              <button
                onClick={() => onSuccess(generatedKey)}
                className="btn-primary w-full py-5 text-sm font-black uppercase tracking-[0.2em] shadow-glow"
              >
                Enter Platform
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
