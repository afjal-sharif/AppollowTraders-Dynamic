import { useEffect, useState } from 'react';
import { apiJson, postJson } from '../api';
import type { LicenseInfo } from '../types';
import PageHeader from '../components/PageHeader';
import Card from '../components/Card';
import { Shield, Calendar, Clock, CheckCircle, AlertTriangle, Save } from 'lucide-react';

export default function SuperAdminPage() {
  const [license, setLicense] = useState<LicenseInfo | null>(null);
  const [renewDate, setRenewDate] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    apiJson<LicenseInfo>('/api/license-info')
      .then((data) => setLicense(data))
      .finally(() => setLoading(false));
  }, []);

  const handleRenew = async () => {
    if (!renewDate) {
      alert('তারিখ নির্বাচন করুন');
      return;
    }
    setSaving(true);
    try {
      const res = await postJson('/api/set-license?master=4321', { date: renewDate });
      if (res.success) {
        alert('লাইসেন্স আপডেট হয়েছে!');
        window.location.reload();
      } else {
        alert('আপডেট ব্যর্থ হয়েছে');
      }
    } catch {
      alert('সার্ভার এরর');
    }
    setSaving(false);
  };

  const getStatusColor = (status: string) => {
    if (status === 'expired') return 'text-red-600 bg-red-50';
    if (status === 'warning') return 'text-amber-600 bg-amber-50';
    return 'text-emerald-600 bg-emerald-50';
  };

  return (
    <div>
      <PageHeader title="সুপার অ্যাডমিন" icon="🔐" subtitle="লাইসেন্স ম্যানেজমেন্ট" />

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-6 h-6 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
        </div>
      ) : license ? (
        <div className="space-y-4">
          {/* License Status Cards */}
          <div className="grid grid-cols-3 gap-3">
            <Card className="text-center">
              <div className={`w-10 h-10 rounded-xl mx-auto mb-2 flex items-center justify-center ${getStatusColor(license.status)}`}>
                {license.status === 'expired' ? <AlertTriangle size={20} /> : <CheckCircle size={20} />}
              </div>
              <p className="text-[10px] text-slate-400 uppercase tracking-wide">স্ট্যাটাস</p>
              <p className={`text-sm font-bold mt-0.5 ${
                license.status === 'expired' ? 'text-red-600' : license.status === 'warning' ? 'text-amber-600' : 'text-emerald-600'
              }`}>
                {license.status === 'expired' ? 'শেষ' : license.status === 'warning' ? 'সতর্কতা' : 'সক্রিয়'}
              </p>
            </Card>

            <Card className="text-center">
              <div className="w-10 h-10 rounded-xl mx-auto mb-2 flex items-center justify-center bg-blue-50 text-blue-600">
                <Calendar size={20} />
              </div>
              <p className="text-[10px] text-slate-400 uppercase tracking-wide">মেয়াদ</p>
              <p className="text-sm font-bold text-slate-800 mt-0.5">{license.expiry}</p>
            </Card>

            <Card className="text-center">
              <div className="w-10 h-10 rounded-xl mx-auto mb-2 flex items-center justify-center bg-indigo-50 text-indigo-600">
                <Clock size={20} />
              </div>
              <p className="text-[10px] text-slate-400 uppercase tracking-wide">বাকি দিন</p>
              <p className={`text-sm font-bold mt-0.5 ${license.days <= 0 ? 'text-red-600' : 'text-slate-800'}`}>
                {license.days}
              </p>
            </Card>
          </div>

          {/* Renew Form */}
          <Card>
            <div className="flex items-center gap-2 mb-4">
              <Shield size={18} className="text-indigo-600" />
              <h3 className="text-sm font-bold text-slate-800">লাইসেন্স রিনিউ</h3>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-slate-500 mb-1.5 block">নতুন মেয়াদের তারিখ</label>
                <input
                  type="date"
                  value={renewDate}
                  onChange={(e) => setRenewDate(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm bg-white"
                />
              </div>
              <button
                onClick={handleRenew}
                disabled={saving}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold text-sm shadow-lg shadow-indigo-200 disabled:opacity-50"
              >
                <Save size={16} />
                {saving ? 'আপডেট হচ্ছে...' : 'লাইসেন্স আপডেট করুন'}
              </button>
            </div>
          </Card>
        </div>
      ) : (
        <Card>
          <p className="text-sm text-slate-500 text-center py-4">লাইসেন্স তথ্য লোড করা যায়নি</p>
        </Card>
      )}
    </div>
  );
}
