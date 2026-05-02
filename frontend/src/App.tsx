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

function App() {
  const [currentPage, setCurrentPage] = useState<Step>('landing');
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

  const showNav = currentPage !== 'auth';

  return (
    <div className="min-h-screen flex flex-col">
      {showNav && <Navbar onNavigate={(page) => setCurrentPage(page)} />}
      
      <main className="flex-grow">
        {currentPage === 'landing' && (
          <LandingPage 
            onStart={() => setCurrentPage('auth')} 
            onSandbox={() => setCurrentPage('input')}
          />
        )}

        {currentPage === 'auth' && (
          <AuthPage 
            onSuccess={(key) => {
              console.log('SME Authenticated with key:', key);
              setCurrentPage('dashboard');
            }}
            onCancel={() => setCurrentPage('landing')}
          />
        )}
        
        {(currentPage === 'input' || currentPage === 'loading' || currentPage === 'result') && (
          <VerificationFlow 
            initialStep={currentPage === 'input' ? 'input' : undefined} 
            onComplete={() => setCurrentPage('dashboard')} 
          />
        )}
        
        {currentPage === 'dashboard' && (
          <Dashboard />
        )}
        
        {currentPage === 'docs' && (
          <ApiDocs />
        )}

        {currentPage === 'privacy' && <PrivacyPolicy />}
        {currentPage === 'terms' && <TermsOfService />}
      </main>
      
      {showNav && <Footer onNavigate={(page) => setCurrentPage(page)} />}
      <ChatWidget />
    </div>
  );
}

export default App;
