
import React from 'react';
import AIAssistant from '../components/AIAssistant';

const Support: React.FC = () => {
  const triggerTechnicalHelp = () => {
    window.dispatchEvent(new CustomEvent('open-ai-chat', {
      detail: {
        initialMessage: "I'm having technical issues. How do I sync my store?"
      }
    }));
  };

  const triggerOrderHelp = () => {
    window.dispatchEvent(new CustomEvent('open-ai-chat', {
      detail: {
        initialMessage: "How do I track my recent orders?"
      }
    }));
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      <header className="pt-2">
        <h2 className="text-3xl font-black text-slate-900 tracking-tight">Support Hub</h2>
        <div className="flex items-center gap-2 mt-2">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">AI Concierge Online</p>
        </div>
      </header>
      
      {/* Quick Action Cards */}
      <div className="grid grid-cols-2 gap-4">
        <button 
          onClick={triggerTechnicalHelp}
          className="p-5 bg-white border border-slate-100 rounded-[32px] text-left hover:bg-slate-50 transition-colors shadow-sm"
        >
          <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-3">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M11 4a2 2 0 114 0v1a2 2 0 01-2 2H3m2 4l-2 2m0 0l2 2m-2-2h8m-5-3h.01M17 16l4-4m0 0l-4-4m4 4H7" /></svg>
          </div>
          <p className="font-black text-[10px] uppercase tracking-widest text-slate-900">Technical Help</p>
          <p className="text-[10px] text-slate-400 mt-1">Syncing & URL help</p>
        </button>
        <button 
          onClick={triggerOrderHelp}
          className="p-5 bg-white border border-slate-100 rounded-[32px] text-left hover:bg-slate-50 transition-colors shadow-sm"
        >
          <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mb-3">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
          </div>
          <p className="font-black text-[10px] uppercase tracking-widest text-slate-900">Order Tracking</p>
          <p className="text-[10px] text-slate-400 mt-1">Status & History</p>
        </button>
      </div>

      <div className="h-[calc(100vh-420px)]">
        <AIAssistant standalone />
      </div>

      {/* Human Support Escalation */}
      <div className="bg-slate-900 rounded-[40px] p-8 text-white relative overflow-hidden">
        <div className="relative z-10 space-y-4">
          <div className="flex items-center gap-3">
             <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
             <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50">Human Support</p>
          </div>
          <h4 className="text-xl font-black">Still have questions?</h4>
          <p className="text-sm text-white/50 leading-relaxed font-medium">Our store agents are available on WhatsApp for direct consultation and payment verification.</p>
          <a 
            href="https://wa.me/yournumber" 
            target="_blank" 
            rel="noreferrer"
            className="flex items-center justify-center gap-3 w-full bg-emerald-500 py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-emerald-900/40 active:scale-95 transition-all"
          >
            Connect on WhatsApp
          </a>
        </div>
        <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full blur-3xl -translate-y-20 translate-x-20"></div>
      </div>
    </div>
  );
};

export default Support;
