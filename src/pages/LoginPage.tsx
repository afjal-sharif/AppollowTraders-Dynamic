import { useState, FormEvent } from 'react';
import { Lock } from 'lucide-react';

interface LoginPageProps {
  onLogin: () => void;
}

export default function LoginPage({ onLogin }: LoginPageProps) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!pin.trim()) {
      setError('পিন কোড লিখুন');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache'
        },
        credentials: 'include',
        cache: 'no-store',
        body: JSON.stringify({ pin: pin.trim() }),
      });
      const data = await res.json();
      if (data.success) {
        // Force a small delay to ensure cookie is set
        await new Promise(r => setTimeout(r, 100));
        onLogin();
      } else {
        setError(data.message || 'ভুল পিন! আবার চেষ্টা করুন।');
        setPin('');
      }
    } catch {
      setError('সার্ভারের সাথে সংযোগ করা যায়নি।');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 flex items-center justify-center p-4">
      {/* Decorative circles */}
      <div className="absolute top-20 left-10 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-60 h-60 bg-indigo-500/10 rounded-full blur-3xl" />

      <div className="w-full max-w-sm animate-slide-up">
        <div className="bg-white rounded-3xl shadow-2xl p-8 relative overflow-hidden">
          {/* Top accent */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600" />

          {/* Logo */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white text-2xl font-bold mx-auto shadow-xl shadow-blue-200 mb-4">
              AT
            </div>
            <h1 className="text-xl font-bold text-slate-800">মেসার্স এপোলো ট্রেডার্স</h1>
            <p className="text-sm text-slate-500 mt-1">ব্যবসায়িক ম্যানেজমেন্ট সিস্টেম</p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit}>
            <div className="relative">
              <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="password"
                inputMode="numeric"
                value={pin}
                onChange={(e) => { setPin(e.target.value); setError(''); }}
                placeholder="পিন কোড লিখুন"
                className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                autoFocus
              />
            </div>

            {error && (
              <div className="mt-3 p-2.5 rounded-xl bg-red-50 border border-red-100">
                <p className="text-red-600 text-sm text-center font-medium">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-4 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold text-sm shadow-lg shadow-blue-200 hover:shadow-xl transition-all disabled:opacity-50"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  লগইন হচ্ছে...
                </span>
              ) : (
                '🔐 লগইন'
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-blue-200/50 text-xs mt-6">
          © {new Date().getFullYear()} এপোলো ট্রেডার্স
        </p>
      </div>
    </div>
  );
}
