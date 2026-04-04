import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Landmark, FileText, Car, AlertTriangle, AlertCircle, Shield } from 'lucide-react';
import { apiJson } from '../api';
import type { LicenseInfo, ExpirySummary } from '../types';
import Card from '../components/Card';

export default function HomePage() {
  const navigate = useNavigate();
  const [license, setLicense] = useState<LicenseInfo | null>(null);
  const [summary, setSummary] = useState<ExpirySummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      apiJson<LicenseInfo>('/api/license-info').catch(() => null),
      apiJson<ExpirySummary>('/api/expiry-summary').catch(() => null),
    ]).then(([lic, sum]) => {
      if (lic && lic.expiry) setLicense(lic);
      if (sum && (sum.expired || sum.warning)) setSummary(sum);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const menuItems = [
    {
      icon: Landmark,
      label: 'ব্যাংক একাউন্টস',
      emoji: '🏦',
      desc: 'ব্যাংক অ্যাকাউন্ট তথ্য',
      path: '/banks',
      gradient: 'from-blue-500 to-blue-600',
      bg: 'bg-blue-50',
    },
    {
      icon: FileText,
      label: 'ব্যবসায়িক ডকুমেন্টস',
      emoji: '📄',
      desc: 'গুরুত্বপূর্ণ কাগজপত্র',
      path: '/documents',
      gradient: 'from-emerald-500 to-emerald-600',
      bg: 'bg-emerald-50',
    },
    {
      icon: Car,
      label: 'গাড়ির ডকুমেন্টস',
      emoji: '🚗',
      desc: 'গাড়ির কাগজপত্র ও মেয়াদ',
      path: '/vehicles',
      gradient: 'from-amber-500 to-orange-500',
      bg: 'bg-amber-50',
    },
  ];

  return (
    <div>
      {/* Hero */}
      <div className="text-center mb-6">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white text-xl font-bold mx-auto shadow-xl shadow-blue-200 mb-3">
          AT
        </div>
        <h1 className="text-lg font-bold text-slate-800">মেসার্স এপোলো ট্রেডার্স</h1>
        <p className="text-xs text-slate-500 mt-1">ব্যবসায়িক ম্যানেজমেন্ট সিস্টেম</p>
      </div>

      {/* License Warning */}
      {license && license.days <= 30 && (
        <div className={`rounded-xl p-3 mb-4 flex items-center gap-3 ${
          license.days <= 7 ? 'bg-red-50 border border-red-200' : 'bg-amber-50 border border-amber-200'
        }`}>
          <Shield size={20} className={license.days <= 7 ? 'text-red-500' : 'text-amber-500'} />
          <div>
            <p className={`text-sm font-semibold ${license.days <= 7 ? 'text-red-700' : 'text-amber-700'}`}>
              ⚠ লাইসেন্স {license.days} দিনের মধ্যে শেষ হবে
            </p>
            <p className="text-xs text-slate-500 mt-0.5">মেয়াদ: {license.expiry}</p>
          </div>
        </div>
      )}

      {/* Expiry Alerts */}
      {summary && (summary.expired.length > 0 || summary.warning.length > 0) && (
        <div className="mb-4 space-y-2">
          {summary.expired.map((v, i) => (
            <div
              key={`exp-${i}`}
              onClick={() => {
                if (v.car === 'DOC') {
                  navigate(`/documents?doc=${encodeURIComponent(v.doc)}`);
                } else {
                  navigate(`/vehicles?car=${encodeURIComponent(v.car)}&doc=${encodeURIComponent(v.doc)}`);
                }
              }}
              className="dash-alert rounded-xl p-3 flex items-center gap-3 cursor-pointer border border-red-200"
            >
              <AlertCircle size={18} className="text-red-600 shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-red-700 truncate">
                  🚨 {v.car === 'DOC' ? v.doc : `${v.car} – ${v.doc}`}
                </p>
                <p className="text-xs text-red-500">মেয়াদ শেষ হয়ে গেছে</p>
              </div>
            </div>
          ))}
          {summary.warning.map((v, i) => (
            <div
              key={`warn-${i}`}
              onClick={() => {
                if (v.car === 'DOC') {
                  navigate(`/documents?doc=${encodeURIComponent(v.doc)}`);
                } else {
                  navigate(`/vehicles?car=${encodeURIComponent(v.car)}&doc=${encodeURIComponent(v.doc)}`);
                }
              }}
              className="rounded-xl p-3 flex items-center gap-3 cursor-pointer bg-amber-50 border border-amber-200 hover:bg-amber-100 transition-colors"
            >
              <AlertTriangle size={18} className="text-amber-600 shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-amber-700 truncate">
                  ⚠ {v.car === 'DOC' ? v.doc : `${v.car} – ${v.doc}`}
                </p>
                <p className="text-xs text-amber-500">{v.days} দিনের মধ্যে মেয়াদ শেষ হবে</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Menu Cards */}
      <div className="space-y-3">
        {menuItems.map((item) => (
          <Card key={item.path}>
            <button
              onClick={() => navigate(item.path)}
              className="w-full flex items-center gap-4 text-left"
            >
              <div className={`w-12 h-12 rounded-xl ${item.bg} flex items-center justify-center text-2xl shrink-0`}>
                {item.emoji}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-slate-800">{item.label}</p>
                <p className="text-xs text-slate-500 mt-0.5">{item.desc}</p>
              </div>
              <div className="text-slate-300">›</div>
            </button>
          </Card>
        ))}
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex justify-center mt-8">
          <div className="w-6 h-6 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
        </div>
      )}

      {/* License Footer */}
      {license && (
        <div className="mt-8 text-center">
          <p className="text-[10px] text-slate-400">
            License: {license.status} | মেয়াদ: {license.expiry} | {license.days} দিন বাকি
          </p>
        </div>
      )}
    </div>
  );
}
