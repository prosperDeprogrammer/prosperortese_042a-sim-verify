import React, { useState, useEffect } from 'react';
import { Step } from './types/pro';
import { Navbar, Footer } from './components/Navigation';
import { VerificationFlow } from './components/AppFlow';
import { LandingPage } from './components/LandingPage';
import { Dashboard } from './components/Dashboard';
import { PrivacyPolicy, TermsOfService } from './components/LegalPages';
import { ApiDocs } from './components/ApiDocs';
import { ChatWidget } from './components/ChatWidget';
import { AuthPage } from './components/AuthPage';

import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isAppLoading, setIsAppLoading] = useState(true);

  useEffect(() => {
    // Swift loader
    const timer = setTimeout(() => {
      setIsAppLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  if (isAppLoading) {
    return (
      <div className="fixed inset-0 bg-dark-950 z-[200] flex items-center justify-center">
        <div className="flex flex-col items-center gap-6 animate-fade-in">
          <div className="relative w-16 h-16 flex items-center justify-center">
            <div className="absolute inset-0 border-t-2 border-brand-500 rounded-full animate-spin"></div>
            <div className="absolute inset-2 border-r-2 border-safe/50 rounded-full animate-spin-slow"></div>
            <div className="w-8 h-8 bg-brand-500/20 rounded-full animate-pulse"></div>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="text-brand-500 font-black tracking-[0.3em] text-[10px] uppercase animate-pulse">Initializing Secure Node</div>
            <div className="w-32 h-0.5 bg-dark-800 rounded-full overflow-hidden">
              <div className="h-full bg-brand-500 w-full animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const showNav = location.pathname !== '/auth';

  return (
    <div className="min-h-screen flex flex-col">
      {showNav && <Navbar onNavigate={(page) => navigate(`/${page === 'landing' ? '' : page}`)} />}
      
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={
            <LandingPage 
              onStart={() => navigate('/auth')} 
              onSandbox={() => navigate('/gateway')}
            />
          } />

          <Route path="/auth" element={
            <AuthPage 
              onSuccess={(key) => {
                console.log('SME Authenticated with key:', key);
                navigate('/dashboard');
              }}
              onCancel={() => navigate('/')}
            />
          } />
          
          <Route path="/gateway" element={
            <VerificationFlow 
              onComplete={() => navigate('/dashboard')} 
              onNavigate={(page) => navigate(`/${page === 'landing' ? '' : page}`)}
            />
          } />
          
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/docs" element={<ApiDocs />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsOfService />} />
        </Routes>
      </main>
      
      {showNav && <Footer onNavigate={(page) => navigate(`/${page === 'landing' ? '' : page}`)} />}
      <ChatWidget />
    </div>
  );
}

export default App;
