import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { postJson } from '../api';
import PageHeader from '../components/PageHeader';
import Card from '../components/Card';
import { Save } from 'lucide-react';

export default function AddBankPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '',
    name: '',
    account: '',
    routing: '',
    branch: '',
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await postJson('/api/save-bank', form);
    alert('ব্যাংক সেভ হয়েছে!');
    navigate('/banks');
  };

  const fields = [
    { key: 'title', label: 'অ্যাকাউন্ট টাইটেল', placeholder: 'যেমন: মেসার্স এপোলো ট্রেডার্স' },
    { key: 'name', label: 'ব্যাংকের নাম', placeholder: 'যেমন: ইসলামী ব্যাংক' },
    { key: 'account', label: 'অ্যাকাউন্ট নম্বর', placeholder: 'অ্যাকাউন্ট নম্বর লিখুন' },
    { key: 'routing', label: 'রাউটিং নম্বর', placeholder: 'রাউটিং নম্বর লিখুন' },
    { key: 'branch', label: 'শাখা', placeholder: 'শাখার নাম লিখুন' },
  ];

  return (
    <div>
      <PageHeader title="নতুন ব্যাংক যোগ করুন" icon="➕" showBack />
      <Card>
        <form onSubmit={handleSubmit} className="space-y-4">
          {fields.map((f) => (
            <div key={f.key}>
              <label className="text-xs font-medium text-slate-500 mb-1.5 block">{f.label}</label>
              <input
                type="text"
                value={(form as any)[f.key]}
                onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                placeholder={f.placeholder}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm bg-white"
                required={f.key === 'name' || f.key === 'account'}
              />
            </div>
          ))}
          <button
            type="submit"
            disabled={saving}
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold text-sm shadow-lg shadow-blue-200 hover:shadow-xl transition-all disabled:opacity-50"
          >
            <Save size={16} />
            {saving ? 'সেভ হচ্ছে...' : 'ব্যাংক সেভ করুন'}
          </button>
        </form>
      </Card>
    </div>
  );
}
