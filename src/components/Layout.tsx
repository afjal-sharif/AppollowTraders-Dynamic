import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Home, Landmark, FileText, Car, Plus, Settings, Shield, Menu, X, ChevronRight,
} from 'lucide-react';

function getNavItems(userRole: 'none' | 'user' | 'admin' | 'superadmin') {
  const items = [
    { path: '/', label: '🏠 ড্যাশবোর্ড', icon: Home },
    { path: '/banks', label: '🏦 ব্যাংক', icon: Landmark },
    { path: '/documents', label: '📄 ডকুমেন্টস', icon: FileText },
    { path: '/vehicles', label: '🚗 গাড়ি', icon: Car },
    { path: '/add-bank', label: '➕ ব্যাংক যোগ', icon: Plus },
    { path: '/add-document', label: '➕ ডকুমেন্ট যোগ', icon: Plus },
    { path: '/add-vehicle', label: '➕ গাড়ি যোগ', icon: Plus },
  ];
  
  if (userRole === 'admin' || userRole === 'superadmin') {
    items.push({ path: '/admin', label: '⚙ অ্যাডমিন', icon: Settings });
  }
  
  if (userRole === 'superadmin') {
    items.push({ path: '/super-admin', label: '🔐 সুপার অ্যাডমিন', icon: Shield });
  }
  
  return items;
}

export default function Layout({ children, userRole = 'none' }: { children: React.ReactNode; userRole?: 'none' | 'user' | 'admin' | 'superadmin' }) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-slate-100 shadow-sm">
        <div className="flex items-center justify-between px-4 py-3 max-w-lg mx-auto">
          <div className="flex items-center gap-2" onClick={() => navigate('/')}>
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white text-sm font-bold shadow-lg shadow-blue-200">
              AT
            </div>
            <div className="leading-tight">
              <p className="text-[11px] text-slate-400 font-medium tracking-wide uppercase">মেসার্স</p>
              <p className="text-sm font-bold text-slate-800 -mt-0.5">এপোলো ট্রেডার্স</p>
            </div>
          </div>
          <button
            onClick={() => setOpen(!open)}
            className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </header>

      {/* Slide-out menu */}
      {open && (
        <>
          <div className="fixed inset-0 bg-black/30 z-40 animate-fade-in" onClick={() => setOpen(false)} />
          <div className="fixed top-0 right-0 h-full w-72 bg-white z-50 shadow-2xl animate-slide-up p-4 pt-6 overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <p className="text-lg font-bold text-slate-800">মেনু</p>
              <button onClick={() => setOpen(false)} className="p-2 rounded-lg hover:bg-slate-100">
                <X size={20} />
              </button>
            </div>
            <nav className="space-y-1">
              {getNavItems(userRole).map((item) => {
                const active = location.pathname === item.path;
                return (
                  <button
                    key={item.path}
                    onClick={() => { navigate(item.path); setOpen(false); }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left text-sm font-medium transition-all ${
                      active
                        ? 'bg-blue-50 text-blue-700 shadow-sm'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <item.icon size={18} />
                    <span className="flex-1">{item.label}</span>
                    <ChevronRight size={14} className="text-slate-300" />
                  </button>
                );
              })}
            </nav>
          </div>
        </>
      )}

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/90 backdrop-blur-xl border-t border-slate-100 shadow-[0_-4px_20px_rgba(0,0,0,0.06)]">
        <div className="flex items-center justify-around max-w-lg mx-auto py-1">
          {[
            { path: '/', icon: Home, label: 'হোম' },
            { path: '/banks', icon: Landmark, label: 'ব্যাংক' },
            { path: '/documents', icon: FileText, label: 'ডকুমেন্ট' },
            { path: '/vehicles', icon: Car, label: 'গাড়ি' },
            { path: '/admin', icon: Settings, label: 'অ্যাডমিন' },
          ].map((item) => {
            const active = location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`flex flex-col items-center gap-0.5 px-3 py-2 rounded-xl transition-all ${
                  active ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                <item.icon size={20} strokeWidth={active ? 2.5 : 1.8} />
                <span className="text-[10px] font-medium">{item.label}</span>
                {active && <div className="w-1 h-1 rounded-full bg-blue-600 mt-0.5" />}
              </button>
            );
          })}
        </div>
      </nav>

      {/* Content */}
      <main className="max-w-lg mx-auto px-4 pt-4 pb-24">
        {children}
      </main>
    </div>
  );
}
