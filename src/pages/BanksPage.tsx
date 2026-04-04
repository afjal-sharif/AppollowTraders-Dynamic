import { useEffect, useState } from 'react';
import { apiJson } from '../api';
import type { Bank } from '../types';
import Card from '../components/Card';
import SearchBar from '../components/SearchBar';
import ShareButtons from '../components/ShareButtons';
import PageHeader from '../components/PageHeader';
import { Building2 } from 'lucide-react';

export default function BanksPage() {
  const [banks, setBanks] = useState<Bank[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiJson<Bank[]>('/api/banks')
      .then((data) => {
        if (Array.isArray(data)) setBanks(data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = banks.filter(
    (b) =>
      (b.name || '').toLowerCase().includes(search.toLowerCase()) ||
      (b.title || '').toLowerCase().includes(search.toLowerCase()) ||
      (b.account || '').toLowerCase().includes(search.toLowerCase())
  );

  const getText = (b: Bank) =>
    `Bank: ${b.name}\nTitle: ${b.title || '-'}\nAccount: ${b.account}\nRouting: ${b.routing}\nBranch: ${b.branch}`;

  return (
    <div>
      <PageHeader title="ব্যাংক একাউন্টস" icon="🏦" />
      <SearchBar value={search} onChange={setSearch} placeholder="ব্যাংক খুঁজুন..." />

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-6 h-6 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 text-slate-400">
          <Building2 size={40} className="mx-auto mb-3 opacity-40" />
          <p className="text-sm">কোনো ব্যাংক পাওয়া যায়নি</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((b) => (
            <Card key={b.key} className="animate-slide-up">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                  <Building2 size={20} className="text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-slate-800 text-sm">{b.name}</p>
                  {b.title && <p className="text-xs text-slate-500 mt-0.5">Title: {b.title}</p>}
                  <div className="mt-2 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] uppercase tracking-wide text-slate-400 w-16 shrink-0">অ্যাকাউন্ট</span>
                      <span className="text-xs font-mono text-slate-700 bg-slate-50 px-2 py-0.5 rounded">{b.account}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] uppercase tracking-wide text-slate-400 w-16 shrink-0">রাউটিং</span>
                      <span className="text-xs font-mono text-slate-700 bg-slate-50 px-2 py-0.5 rounded">{b.routing}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] uppercase tracking-wide text-slate-400 w-16 shrink-0">শাখা</span>
                      <span className="text-xs text-slate-700">{b.branch}</span>
                    </div>
                  </div>
                </div>
              </div>
              <ShareButtons text={getText(b)} />
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
