
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Profile: React.FC = () => {
  const { user, logout } = useAuth();
  const [backendUrl, setBackendUrl] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    // Fix: Unified storage to AsyncStorage for compatibility with apiService
    const loadConfig = async () => {
      const stored = await AsyncStorage.getItem('ws_backend_url');
      if (stored) setBackendUrl(stored);
    };
    loadConfig();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    // Fix: Save using AsyncStorage as apiService expects
    await AsyncStorage.setItem('ws_backend_url', backendUrl);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-8 animate-fadeIn py-4">
      <header className="flex items-center justify-between">
        <h2 className="text-3xl font-black text-slate-900 tracking-tight">Account</h2>
      </header>

      {/* User Info Card */}
      <div className="bg-slate-900 rounded-[32px] p-8 text-white relative overflow-hidden shadow-2xl shadow-slate-200">
        <div className="relative z-10 flex items-center gap-5">
          <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md overflow-hidden border border-white/20">
            <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.phone || 'Guest'}`} alt="avatar" />
          </div>
          <div>
            <p className="text-[10px] text-white/40 font-black uppercase tracking-[0.2em] mb-1">WhatsApp Verified</p>
            <p className="text-xl font-black tracking-tight">{user?.phone || 'Guest User'}</p>
          </div>
        </div>
        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-blue-500/20 rounded-full blur-3xl"></div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4">
        <Link to="/support" className="p-6 bg-white border border-slate-100 rounded-[32px] flex flex-col gap-4 shadow-sm active:bg-slate-50 transition-all">
          <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
          </div>
          <p className="font-black text-xs uppercase tracking-widest text-slate-900">AI Concierge</p>
        </Link>
        {user?.isAdmin && (
          <Link to="/admin" className="p-6 bg-slate-900 rounded-[32px] flex flex-col gap-4 shadow-xl shadow-slate-200 active:scale-95 transition-all">
            <div className="w-10 h-10 bg-white/10 text-white rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
            </div>
            <p className="font-black text-xs uppercase tracking-widest text-white">Management</p>
          </Link>
        )}
      </div>

      {/* Backend Configuration */}
      <div className="bg-slate-50 rounded-[40px] p-8 space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center text-white">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
          </div>
          <h3 className="font-black text-[10px] uppercase tracking-[0.2em] text-slate-400">System Config</h3>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          <div className="space-y-4">
            <input 
              type="url" 
              placeholder="https://your-n8n-url.com" 
              value={backendUrl}
              onChange={(e) => setBackendUrl(e.target.value)}
              className="w-full bg-white border border-slate-100 px-6 py-5 rounded-2xl text-sm font-bold focus:outline-none focus:ring-4 focus:ring-slate-900/5 transition-all shadow-sm"
              required
            />
            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest text-center leading-relaxed">
              Required for Catalog Sync & Order Processing
            </p>
          </div>

          <button 
            type="submit" 
            className={`w-full py-5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all active:scale-95 shadow-xl ${
              saved ? 'bg-emerald-500 text-white' : 'bg-slate-900 text-white'
            }`}
          >
            {saved ? 'Connection Saved ✓' : 'Save Connection'}
          </button>
        </form>
      </div>

      {/* Logout */}
      <div className="pt-8">
        <button 
          onClick={logout}
          className="w-full flex items-center justify-center gap-3 py-5 text-red-500 font-black text-xs uppercase tracking-[0.2em] bg-red-50 rounded-2xl active:scale-95 transition-all border border-red-100/50"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
          Sign Out
        </button>
      </div>

      <div className="text-center pt-8">
        <p className="text-[9px] text-slate-300 font-black uppercase tracking-[0.3em]">Version 1.0.8 • Enterprise Concierge</p>
      </div>
    </div>
  );
};

export default Profile;
