import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, VerifyResult } from '../types';

interface ChatWidgetProps {
  lastResult?: VerifyResult | null;
}

export const ChatWidget: React.FC<ChatWidgetProps> = ({ lastResult }) => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [supportMode, setSupportMode] = useState<'chat' | 'email'>('chat');
  const [chatInput, setChatInput] = useState("");
  const [emailInput, setEmailInput] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { sender: "bot", text: "Hi there! I'm your SimVerify assistant. Need help with SME identity checks or integrating our API? 😊" }
  ]);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (supportMode === 'chat') {
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatMessages, isTyping, supportMode, isChatOpen]);

  const sendChatMessage = () => {
    if (!chatInput.trim()) return;
    const text = chatInput.trim().toLowerCase();
    setChatInput("");
    setChatMessages(prev => [...prev, { sender: "user", text: chatInput.trim() }]);
    setIsTyping(true);

    setTimeout(() => {
      let botResponse = "A SimVerify support specialist has been notified and will review your request shortly. Is there anything else I can help with?";

      if (text.includes("why") || text.includes("blocked") || text.includes("suspicious")) {
        botResponse = "I can help explain our risk scoring. We use three Nokia CAMARA signals — number verification, SIM swap, and location verification — then combine them for SME trust and payments.";
      } else if (text.includes("nokia") || text.includes("network") || text.includes("api")) {
        botResponse = "SimVerify Pro integrates directly with global carrier networks using the GSMA Open Gateway standard for the most reliable fraud signals available.";
      } else if (text.includes("hello") || text.includes("hi")) {
        botResponse = "Hello! How can I assist you today with your SME security needs?";
      }

      setChatMessages(prev => [
        ...prev,
        { sender: "bot", text: botResponse }
      ]);
      setIsTyping(false);
    }, 1200);
  };

  const handleSendChat = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendChatMessage();
    }
  };

  const handleSendEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.trim()) return;
    setEmailSent(true);
    setTimeout(() => {
      setEmailInput("");
      setEmailSent(false);
      setSupportMode('chat');
    }, 3000);
  };

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-8 sm:right-8 z-[100] flex flex-col items-end">
      {isChatOpen && (
        <div className="mb-4 w-[calc(100vw-2rem)] sm:w-[380px] h-[500px] max-h-[70vh] rounded-[2rem] border border-white/10 bg-dark-900/95 backdrop-blur-2xl shadow-premium flex flex-col overflow-hidden animate-fade-in">

          {/* Header */}
          <div className="bg-gradient-to-r from-brand-600 to-brand-700 p-6 text-white shrink-0">
            <div className="flex justify-between items-center mb-1">
              <span className="font-black text-sm uppercase tracking-widest flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-safe animate-pulse"></div>
                SimVerify Support
              </span>
              <button
                onClick={() => setIsChatOpen(false)}
                className="text-white/80 hover:text-white transition-colors p-1"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <p className="text-[10px] text-white/60 font-bold uppercase tracking-tight">Active Response System</p>
          </div>

          {/* Contact Bar */}
          <div className="flex shrink-0 border-b border-white/5 bg-dark-950/50">
            <button 
              onClick={() => setSupportMode('email')}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-[10px] font-black uppercase tracking-tighter transition-colors ${supportMode === 'email' ? 'text-brand-400 bg-brand-500/10' : 'text-dark-400 hover:text-brand-400'}`}
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
              Email Support
            </button>
            <div className="w-px bg-white/5"></div>
            <button 
              onClick={() => setSupportMode('chat')}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-[10px] font-black uppercase tracking-tighter transition-colors ${supportMode === 'chat' ? 'text-brand-400 bg-brand-500/10' : 'text-dark-400 hover:text-brand-400'}`}
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
              Live Chat
            </button>
          </div>

          {/* Body Content */}
          {supportMode === 'chat' ? (
            <>
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {chatMessages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl px-4 py-3 text-xs md:text-sm leading-relaxed shadow-sm ${msg.sender === "user"
                        ? "bg-brand-600 text-white font-medium rounded-tr-none"
                        : "bg-dark-800 text-dark-100 border border-white/5 rounded-tl-none"
                        }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-dark-800 border border-white/5 rounded-2xl rounded-tl-none px-4 py-3 flex gap-1.5 items-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-bounce"></div>
                      <div className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-bounce" style={{ animationDelay: "0.15s" }}></div>
                      <div className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-bounce" style={{ animationDelay: "0.3s" }}></div>
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Input */}
              <div className="shrink-0 p-4 bg-dark-950/80 border-t border-white/5">
                <div className="flex gap-2 items-center bg-dark-900 border border-white/10 rounded-2xl p-2 focus-within:border-brand-500/50 transition-all">
                  <textarea
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={handleSendChat}
                    placeholder="Ask SimVerify..."
                    rows={1}
                    className="flex-1 bg-transparent border-none px-2 py-1 text-sm text-white focus:outline-none placeholder-dark-600 resize-none"
                  />
                  <button
                    onClick={sendChatMessage}
                    disabled={!chatInput.trim()}
                    className="w-10 h-10 bg-brand-600 hover:bg-brand-500 disabled:bg-dark-800 text-white rounded-xl flex items-center justify-center transition-all shadow-glow active:scale-95"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 p-6 flex flex-col justify-center">
              {emailSent ? (
                <div className="text-center animate-fade-in">
                  <div className="w-16 h-16 bg-safe/10 rounded-full flex items-center justify-center mx-auto mb-4 text-safe">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                  </div>
                  <h3 className="text-white font-bold text-lg mb-2">Message Sent!</h3>
                  <p className="text-dark-400 text-sm">Our support team will get back to you shortly.</p>
                </div>
              ) : (
                <form onSubmit={handleSendEmail} className="animate-fade-in flex flex-col h-full">
                  <h3 className="text-white font-bold text-sm mb-4">Send us a message</h3>
                  <textarea 
                    required
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    placeholder="How can we help you with your integration?" 
                    className="w-full flex-1 bg-dark-900 border border-white/10 rounded-2xl p-4 text-sm text-white focus:outline-none focus:border-brand-500/50 transition-all resize-none mb-4 placeholder-dark-600"
                  ></textarea>
                  <button type="submit" className="btn-primary w-full py-3 text-sm flex justify-center items-center gap-2">
                    Send Email
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                  </button>
                </form>
              )}
            </div>
          )}
        </div>
      )}

      {/* Toggle Button */}
      <div className="relative">
        {!isChatOpen && (
          <div className="absolute inset-0 bg-brand-500 rounded-2xl animate-ping opacity-60 duration-1000"></div>
        )}
        <button
          onClick={() => setIsChatOpen(!isChatOpen)}
          className="w-14 h-14 md:w-13 md:h-13 rounded-2xl bg-brand-600 hover:bg-brand-500 text-white flex items-center justify-center shadow-glow 
          transition-all hover:scale-105 active:scale-95 group relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          {isChatOpen ? (
            <svg className="w-6 h-6 md:w-7 md:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
          ) : (
            <svg className="w-6 h-6 md:w-7 md:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
          )}
        </button>
      </div>
    </div>
  );
};
