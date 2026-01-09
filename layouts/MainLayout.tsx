
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import AIAssistant from '../components/AIAssistant';

const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const { cart } = useCart();
  const { user } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen flex flex-col max-w-md mx-auto bg-white shadow-xl relative overflow-x-hidden">
      {/* Dynamic Header */}
      <header className="px-6 py-4 flex items-center justify-between sticky top-0 bg-white/80 backdrop-blur-md z-40 border-b border-slate-50">
        <Link to="/" className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
          <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center text-white text-xs">W</div>
          WhatsStore
        </Link>
        <div className="flex items-center gap-3">
          <Link to="/cart" className="relative p-2 rounded-xl bg-slate-50 text-slate-600">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
            {cart.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold border-2 border-white">
                {cart.length}
              </span>
            )}
          </Link>
          <Link to="/profile" className="w-9 h-9 rounded-xl overflow-hidden border border-slate-100 shadow-sm">
             <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.phone || 'Guest'}`} alt="avatar" />
          </Link>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 pb-24 overflow-y-auto px-6 pt-4">
        {children}
      </main>

      {/* AI Assistant - Floating Component (visible only when not on Support page) */}
      {!isActive('/support') && <AIAssistant />}

      {/* Navigation Bar - Refactored for deep support integration */}
      <nav className="fixed bottom-0 w-full max-w-md bg-white/90 backdrop-blur-lg border-t border-slate-100 px-8 py-4 flex justify-between items-center z-50">
        <Link to="/" className={`transition-colors ${isActive('/') ? 'text-slate-900' : 'text-slate-300'}`}>
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>
        </Link>
        <Link to="/products" className={`transition-colors ${isActive('/products') ? 'text-slate-900' : 'text-slate-300'}`}>
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M4 11h5V5H4v6zm0 7h5v-6H4v6zm7 0h5v-6h-5v6zm0-13v6h5V5h-5z"/></svg>
        </Link>
        <Link to="/support" className={`transition-all ${isActive('/support') ? 'text-slate-900 scale-110' : 'text-slate-300'}`}>
          <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
            <path d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </Link>
        <Link to="/profile" className={`transition-colors ${isActive('/profile') ? 'text-slate-900' : 'text-slate-300'}`}>
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
        </Link>
      </nav>
    </div>
  );
};

export default MainLayout;
