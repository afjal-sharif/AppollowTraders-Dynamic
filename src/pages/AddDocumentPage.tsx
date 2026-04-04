import { useState, FormEvent, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { DOCUMENT_TYPES } from '../types';
import PageHeader from '../components/PageHeader';
import Card from '../components/Card';
import { Save, Upload } from 'lucide-react';

export default function AddDocumentPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    number: '',
    type: DOCUMENT_TYPES[0],
    otherType: '',
    expiry: '',
  });
  const [fileName, setFileName] = useState('');
  const [saving, setSaving] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const formData = new FormData();
    formData.append('name', form.name);
    formData.append('number', form.number);
    formData.append('type', form.type === 'Others' ? form.otherType : form.type);
    formData.append('expiry', form.expiry);

    const file = fileRef.current?.files?.[0];
    if (file) {
      formData.append('file', file);
    }

    await fetch('/api/save-document', {
      method: 'POST',
      credentials: 'include',
      body: formData,
    });
    alert('ডকুমেন্ট সেভ হয়েছে!');
    navigate('/documents');
  };

  return (
    <div>
      <PageHeader title="নতুন ডকুমেন্ট যোগ করুন" icon="➕" showBack />
      <Card>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-medium text-slate-500 mb-1.5 block">ডকুমেন্টের নাম</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="ডকুমেন্টের নাম"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm bg-white"
              required
            />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-500 mb-1.5 block">ডকুমেন্ট নম্বর</label>
            <input
              type="text"
              value={form.number}
              onChange={(e) => setForm({ ...form, number: e.target.value })}
              placeholder="নম্বর"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm bg-white"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-500 mb-1.5 block">ডকুমেন্ট টাইপ</label>
            <select
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm bg-white"
            >
              {DOCUMENT_TYPES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
          {form.type === 'Others' && (
            <div>
              <label className="text-xs font-medium text-slate-500 mb-1.5 block">ডকুমেন্ট টাইপ লিখুন</label>
              <input
                type="text"
                value={form.otherType}
                onChange={(e) => setForm({ ...form, otherType: e.target.value })}
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
          <div>
            <label className="text-xs font-medium text-slate-500 mb-1.5 block">ফাইল আপলোড</label>
            <div
              onClick={() => fileRef.current?.click()}
              className="w-full px-4 py-6 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 text-center cursor-pointer hover:border-blue-300 hover:bg-blue-50/30 transition-colors"
            >
              <Upload size={24} className="mx-auto mb-2 text-slate-400" />
              <p className="text-xs text-slate-500">
                {fileName || 'ফাইল নির্বাচন করুন (ছবি / PDF)'}
              </p>
            </div>
            <input
              ref={fileRef}
              type="file"
              name="file"
              className="hidden"
              accept="image/*,.pdf"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) setFileName(f.name);
              }}
            />
          </div>
          <button
            type="submit"
            disabled={saving}
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold text-sm shadow-lg shadow-blue-200 hover:shadow-xl transition-all disabled:opacity-50"
          >
            <Save size={16} />
            {saving ? 'সেভ হচ্ছে...' : 'ডকুমেন্ট সেভ করুন'}
          </button>
        </form>
      </Card>
    </div>
  );
}
