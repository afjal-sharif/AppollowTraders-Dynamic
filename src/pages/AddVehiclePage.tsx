import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { postJson } from '../api';
import { VEHICLE_DOC_TYPES } from '../types';
import PageHeader from '../components/PageHeader';
import Card from '../components/Card';
import { Save } from 'lucide-react';

export default function AddVehiclePage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    carNumber: '',
    docType: VEHICLE_DOC_TYPES[0],
    otherDoc: '',
    expiry: '',
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await postJson('/api/save-vehicle', {
      name: form.name,
      carNumber: form.carNumber,
      docType: form.docType === 'Others' ? form.otherDoc : form.docType,
      expiry: form.expiry,
    });
    alert('গাড়ি সেভ হয়েছে!');
    navigate('/vehicles');
  };

  return (
    <div>
      <PageHeader title="নতুন গাড়ি যোগ করুন" icon="➕" showBack />
      <Card>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-medium text-slate-500 mb-1.5 block">গাড়ির মালিকের নাম</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="নাম লিখুন"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm bg-white"
              required
            />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-500 mb-1.5 block">গাড়ির নম্বর</label>
            <input
              type="text"
              value={form.carNumber}
              onChange={(e) => setForm({ ...form, carNumber: e.target.value })}
              placeholder="গাড়ির নম্বর লিখুন"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm bg-white"
              required
            />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-500 mb-1.5 block">ডকুমেন্ট টাইপ</label>
            <select
              value={form.docType}
              onChange={(e) => setForm({ ...form, docType: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm bg-white"
            >
              {VEHICLE_DOC_TYPES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
          {form.docType === 'Others' && (
            <div>
              <label className="text-xs font-medium text-slate-500 mb-1.5 block">ডকুমেন্ট টাইপ লিখুন</label>
              <input
                type="text"
                value={form.otherDoc}
                onChange={(e) => setForm({ ...form, otherDoc: e.target.value })}
                placeholder="ডকুমেন্ট টাইপ লিখুন"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm bg-white"
                required
              />
            </div>
          )}
          <div>
            <label className="text-xs font-medium text-slate-500 mb-1.5 block">মেয়াদ শেষের তারিখ</label>
            <input
              type="date"
              value={form.expiry}
              onChange={(e) => setForm({ ...form, expiry: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm bg-white"
              required
            />
          </div>
          <button
            type="submit"
            disabled={saving}
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold text-sm shadow-lg shadow-blue-200 hover:shadow-xl transition-all disabled:opacity-50"
          >
            <Save size={16} />
            {saving ? 'সেভ হচ্ছে...' : 'গাড়ি সেভ করুন'}
          </button>
        </form>
      </Card>
    </div>
  );
}
