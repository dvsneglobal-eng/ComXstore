
import React, { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { aiService } from '../services/ai';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { apiService } from '../services/api';

interface Message {
  role: 'user' | 'ai';
  text: string;
}

interface AIAssistantProps {
  standalone?: boolean;
}

const AIAssistant: React.FC<AIAssistantProps> = ({ standalone = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [focusedProduct, setFocusedProduct] = useState<any>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { cart } = useCart();
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  
  const [messages, setMessages] = useState<Message[]>(() => {
    const savedHistory = sessionStorage.getItem('ws_ai_history');
    if (savedHistory) {
      try {
        return JSON.parse(savedHistory);
      } catch (e) {
        console.error('Failed to parse AI history', e);
      }
    }
    return [
      { role: 'ai', text: "Hi! I'm *WhatsStore AI*. I can help you find products, track orders, or answer support questions. ✨" }
    ];
  });

  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleExternalTrigger = (e: any) => {
      const { product, initialMessage } = e.detail || {};
      if (!standalone) setIsOpen(true);
      if (product) setFocusedProduct(product);
      if (initialMessage) {
        handleSend(initialMessage, product);
      }
    };

    window.addEventListener('open-ai-chat', handleExternalTrigger);
    return () => window.removeEventListener('open-ai-chat', handleExternalTrigger);
  }, [standalone]);

  useEffect(() => {
    if (user?.isAuthenticated) {
      apiService.fetchOrders().then(orders => setRecentOrders(orders.slice(0, 3))).catch(() => {});
    }
  }, [user]);

  useEffect(() => {
    sessionStorage.setItem('ws_ai_history', JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping, isOpen, standalone]);

  const handleSend = async (customMsg?: string, overrideProduct?: any) => {
    const userMsg = customMsg || input.trim();
    if (!userMsg || isTyping) return;

    if (!customMsg) setInput('');
    
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsTyping(true);

    const context = {
      userPhone: user?.phone,
      cartItems: cart,
      currentPage: location.pathname,
      lastOrders: recentOrders,
      focusedProduct: overrideProduct || focusedProduct
    };

    const response = await aiService.getChatResponse(userMsg, context);

    setMessages(prev => [...prev, { role: 'ai', text: response || "I'm sorry, I couldn't process that. Please try again." }]);
    setIsTyping(false);
  };

  const clearHistory = () => {
    const initialMessage: Message[] = [{ role: 'ai', text: "Hi! I'm *WhatsStore AI*. How can I help you today? ✨" }];
    setMessages(initialMessage);
    setFocusedProduct(null);
    sessionStorage.removeItem('ws_ai_history');
  };

  const parseMessage = (text: string) => {
    let html = text.replace(/\*(.*?)\*/g, '<strong>$1</strong>');
    
    // Replace markdown style links [Label](/path) with button triggers
    html = html.replace(/\[(.*?)\]\((.*?)\)/g, (match, label, path) => {
      return `<button onclick="window.location.hash='${path}'; document.dispatchEvent(new CustomEvent('close-ai-drawer'))" class="text-blue-600 font-bold underline decoration-2 underline-offset-4 hover:text-blue-800 transition-colors">${label}</button>`;
    });

    return html;
  };

  useEffect(() => {
    const handleClose = () => setIsOpen(false);
    window.addEventListener('close-ai-drawer', handleClose);
    return () => window.removeEventListener('close-ai-drawer', handleClose);
  }, []);

  const quickPrompts = focusedProduct 
    ? [`Tell me about ${focusedProduct.name}`, "Dimensions?", "Is it in stock?"]
    : ["Recent orders?", "Bag items?", "Backend Setup", "How to pay?"];

  const ChatContent = (
    <div className={`flex flex-col bg-white overflow-hidden ${standalone ? 'h-full rounded-[40px] border border-slate-100 shadow-xl' : 'h-full'}`}>
      {!standalone && (
        <div className="px-8 py-6 flex items-center justify-between border-b border-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            </div>
            <div>
              <h3 className="font-black text-slate-900 text-sm uppercase tracking-widest">WhatsStore AI</h3>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Online</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={clearHistory} className="w-10 h-10 flex items-center justify-center bg-slate-50 rounded-full text-slate-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
            </button>
            <button onClick={() => { setIsOpen(false); setFocusedProduct(null); }} className="w-10 h-10 flex items-center justify-center bg-slate-50 rounded-full text-slate-400">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
        </div>
      )}

      {focusedProduct && !standalone && (
        <div className="px-8 py-3 bg-slate-900 text-white flex items-center gap-3 animate-slideDown">
          <img src={focusedProduct.image_url} className="w-8 h-8 rounded-lg object-cover" alt="" />
          <p className="text-[10px] font-black uppercase tracking-widest flex-1 truncate">Topic: {focusedProduct.name}</p>
          <button onClick={() => setFocusedProduct(null)} className="text-white/40 hover:text-white transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
      )}

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 space-y-6 hide-scrollbar bg-slate-50/30">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] p-5 rounded-[28px] text-sm leading-relaxed shadow-sm ${
              msg.role === 'user' ? 'bg-slate-900 text-white rounded-tr-none' : 'bg-white text-slate-800 border border-slate-100 rounded-tl-none'
            }`}>
              <p dangerouslySetInnerHTML={{ __html: parseMessage(msg.text) }} />
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white border border-slate-100 p-5 rounded-[28px] rounded-tl-none shadow-sm flex gap-1">
              <div className="w-1.5 h-1.5 bg-slate-200 rounded-full animate-bounce"></div>
              <div className="w-1.5 h-1.5 bg-slate-200 rounded-full animate-bounce [animation-delay:0.2s]"></div>
              <div className="w-1.5 h-1.5 bg-slate-200 rounded-full animate-bounce [animation-delay:0.4s]"></div>
            </div>
          </div>
        )}
      </div>

      <div className={`p-6 bg-white border-t border-slate-50 ${standalone ? 'pb-8' : ''}`}>
        <div className="relative mb-4">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder={focusedProduct ? `Ask about ${focusedProduct.name}...` : "Type a question..."}
            className="w-full bg-slate-50 border border-slate-100 pl-6 pr-14 py-4 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-slate-900/5 transition-all"
          />
          <button 
            onClick={() => handleSend()}
            disabled={!input.trim() || isTyping}
            className="absolute right-2 top-2 w-10 h-10 bg-slate-900 text-white rounded-xl flex items-center justify-center disabled:opacity-30"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
          </button>
        </div>

        {!isTyping && (
          <div className="flex gap-2 overflow-x-auto hide-scrollbar">
            {quickPrompts.map(prompt => (
              <button 
                key={prompt}
                onClick={() => handleSend(prompt)}
                className="whitespace-nowrap px-4 py-2 bg-slate-100 border border-slate-200 rounded-full text-[10px] font-black uppercase tracking-widest text-slate-500 active:bg-slate-900 active:text-white transition-all shadow-sm"
              >
                {prompt}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  if (standalone) return ChatContent;

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-24 right-6 w-14 h-14 bg-slate-900 text-white rounded-2xl shadow-2xl flex items-center justify-center z-[60] active:scale-90 transition-all hover:bg-slate-800"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[70] flex flex-col max-w-md mx-auto animate-fadeIn">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => { setIsOpen(false); setFocusedProduct(null); }} />
          <div className="mt-auto bg-white rounded-t-[40px] shadow-2xl h-[85vh] flex flex-col relative animate-slideUp overflow-hidden">
            {ChatContent}
          </div>
        </div>
      )}
    </>
  );
};

export default AIAssistant;
