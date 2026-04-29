import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, VerifyResult } from '../types';

interface ChatWidgetProps {
  lastResult: VerifyResult | null;
}

export const ChatWidget: React.FC<ChatWidgetProps> = ({ lastResult }) => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { sender: "bot", text: "Hi there! Need help integrating the Fraud API, checking your numbers, or understanding your risk scores? 😊" }
  ]);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages, isTyping]);

  const sendChatMessage = () => {
    if (!chatInput.trim()) return;
    const text = chatInput.trim().toLowerCase();
    setChatInput("");
    setChatMessages(prev => [...prev, { sender: "user", text: chatInput.trim() }]);
    setIsTyping(true);

    setTimeout(() => {
      let botResponse = "A technical support agent has been notified and will review your request shortly! Sit tight! 🛡";

      if (text.includes("why") || text.includes("blocked") || text.includes("suspicious")) {
        if (lastResult) {
          botResponse = `Agent Insight: For number ${lastResult.phone}, we detected ${lastResult.risk_score} risk. ${lastResult.ai_insight} The logic chain indicates: ${lastResult.logic_chain?.[lastResult.logic_chain.length - 1] || "check failed"}.`;
        } else {
          botResponse = "I don't see any recent fraud checks in your session. Please run a verification first so I can analyze the results for you!";
        }
      } else if (text.includes("nokia") || text.includes("network as code") || text.includes("api")) {
        botResponse = "This demo is built specifically for the Nokia Network-as-Code architecture. We simulate CAMARA APIs (SIM Swap, Number Verification) locally, but the code is structured to swap for real Nokia sandbox endpoints in minutes!";
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

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 flex flex-col items-end">
      {isChatOpen && (
        <div className="mb-3 w-[calc(100vw-2rem)] sm:w-[340px] max-h-[80vh] sm:max-h-[520px] rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-cyan-700 to-cyan-600 px-4 py-3 text-white shrink-0">
            <div className="flex justify-between items-center">
              <span className="font-bold text-sm flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
                Live Support
              </span>
              <button 
                onClick={() => setIsChatOpen(false)} 
                className="text-cyan-100 hover:text-white transition text-lg leading-none"
              >
                ✕
              </button>
            </div>
            <p className="text-xs text-cyan-100/80 mt-0.5">SimVerify Anti-Fraud API Support</p>
          </div>

          {/* Contact Info Bar */}
          <div className="flex shrink-0 border-b border-slate-800 divide-x divide-slate-800 bg-slate-900 overflow-x-auto">
            <a href="tel:+2348100000000" className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-[10px] sm:text-[11px] font-medium text-slate-300 hover:bg-slate-800 hover:text-cyan-300 transition truncate min-w-0">
              <svg className="w-3.5 h-3.5 text-cyan-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <span className="truncate">+234 810 000 0000</span>
            </a>
            <a href="mailto:support@simverify.io" className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-[10px] sm:text-[11px] font-medium text-slate-300 hover:bg-slate-800 hover:text-cyan-300 transition truncate min-w-0">
              <svg className="w-3.5 h-3.5 text-cyan-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span className="truncate italic">support@simverify.io</span>
            </a>
          </div>

          {/* Messages area */}
          <div className="flex-1 overflow-y-auto p-4 bg-slate-950 space-y-3 min-h-[200px]">
            {chatMessages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm leading-relaxed break-words ${
                    msg.sender === "user"
                      ? "bg-cyan-600/30 text-cyan-100 border border-cyan-500/30 rounded-tr-sm"
                      : "bg-slate-800 text-slate-200 border border-slate-700 rounded-tl-sm"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-slate-800 border border-slate-700 rounded-2xl rounded-tl-sm px-4 py-3 flex gap-1.5 items-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce"></div>
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: "0.15s" }}></div>
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: "0.3s" }}></div>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Textarea + Send */}
          <div className="shrink-0 border-t border-slate-800 bg-slate-900 p-3">
            <div className="flex gap-2 items-end">
              <textarea
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={handleSendChat}
                placeholder="Type your message... (Enter to send, Shift+Enter for new line)"
                rows={2}
                className="flex-1 resize-none bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500 placeholder-slate-500 leading-relaxed"
              />
              <button
                onClick={sendChatMessage}
                disabled={!chatInput.trim()}
                className="shrink-0 bg-cyan-500 hover:bg-cyan-400 disabled:bg-slate-700 disabled:cursor-not-allowed text-slate-950 disabled:text-slate-500 rounded-xl w-10 h-10 flex items-center justify-center transition"
                title="Send message"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
            <p className="text-[10px] text-slate-500 mt-1.5 text-right">Shift+Enter for new line</p>
          </div>
        </div>
      )}
      <button
        onClick={() => setIsChatOpen(!isChatOpen)}
        className="w-14 h-14 rounded-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 flex items-center justify-center shadow-lg transition-transform hover:scale-105"
      >
        {isChatOpen ? (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        ) : (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
        )}
      </button>
    </div>
  );
};
