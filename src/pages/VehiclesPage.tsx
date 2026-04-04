import { useEffect, useState, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { apiJson, postJson } from '../api';
import type { Vehicle, AppSettings } from '../types';
import { VEHICLE_DOC_TYPES } from '../types';
import Card from '../components/Card';
import SearchBar from '../components/SearchBar';
import ShareButtons from '../components/ShareButtons';
import PageHeader from '../components/PageHeader';
import ExpiryBadge from '../components/ExpiryBadge';
import { Car, Pencil, Save, X } from 'lucide-react';

export default function VehiclesPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [editKey, setEditKey] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<Vehicle>>({});
  const [settings, setSettings] = useState<AppSettings>({ editEnabled: true, deleteEnabled: true });
  const [searchParams] = useSearchParams();
  const highlightCar = searchParams.get('car');
  const highlightDoc = searchParams.get('doc');
  const highlightRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    Promise.all([
      apiJson<Vehicle[]>('/api/vehicles'),
      apiJson<AppSettings>('/api/settings').catch(() => ({ editEnabled: true, deleteEnabled: true })),
    ]).then(([data, s]) => {
      if (Array.isArray(data)) {
        const sorted = data.sort(
          (a, b) => new Date(a.expiry).getTime() - new Date(b.expiry).getTime()
        );
        setVehicles(sorted);
      }
      if (s) setSettings(s);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (highlightRef.current) {
      setTimeout(() => {
        highlightRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 300);
    }
  }, [vehicles]);

  const filtered = vehicles.filter(
    (v) =>
      (v.name || '').toLowerCase().includes(search.toLowerCase()) ||
      (v.carNumber || '').toLowerCase().includes(search.toLowerCase()) ||
      (v.docType || '').toLowerCase().includes(search.toLowerCase())
  );

  const getText = (v: Vehicle) =>
    `Vehicle: ${v.name}\nCar Number: ${v.carNumber}\nDocument: ${v.docType}\nExpiry: ${v.expiry}`;

  const handleSave = async (v: Vehicle) => {
    const finalDocType = editData.docType === 'Others'
      ? (editData as any)._otherDoc || v.docType
      : editData.docType || v.docType;

    await postJson('/api/save-vehicle', {
      key: v.key,
      name: editData.name || v.name,
      carNumber: editData.carNumber || v.carNumber,
      docType: finalDocType,
      expiry: editData.expiry || v.expiry,
    });
    setVehicles((prev) =>
      prev.map((item) =>
        item.key === v.key
          ? {
              ...item,
              name: editData.name || v.name,
              carNumber: editData.carNumber || v.carNumber,
              docType: finalDocType,
              expiry: editData.expiry || v.expiry,
            }
          : item
      )
    );
    setEditKey(null);
    setEditData({});
  };

  return (
    <div>
      <PageHeader title="গাড়ির ডকুমেন্টস" icon="🚗" />
      <SearchBar value={search} onChange={setSearch} placeholder="গাড়ি খুঁজুন..." />

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-6 h-6 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 text-slate-400">
          <Car size={40} className="mx-auto mb-3 opacity-40" />
          <p className="text-sm">কোনো গাড়ি পাওয়া যায়নি</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((v) => {
            const isHighlight = highlightCar === v.carNumber && highlightDoc === v.docType;
            const isEditing = editKey === v.key;
            const currentSelectValue = editData.docType ?? (VEHICLE_DOC_TYPES.includes(v.docType) ? v.docType : 'Others');

            return (
              <div
                key={v.key}
                ref={isHighlight ? highlightRef : undefined}
              >
                <Card
                  highlight={isHighlight}
                  className="animate-slide-up"
                >
                  {isEditing ? (
                    <div className="space-y-3">
                      <div>
                        <label className="text-xs font-medium text-slate-500 mb-1 block">নাম</label>
                        <input
                          className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm bg-white"
                          value={editData.name ?? v.name}
                          onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                          placeholder="নাম"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-medium text-slate-500 mb-1 block">গাড়ির নম্বর</label>
                        <input
                          className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm bg-white"
                          value={editData.carNumber ?? v.carNumber}
                          onChange={(e) => setEditData({ ...editData, carNumber: e.target.value })}
                          placeholder="গাড়ির নম্বর"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-medium text-slate-500 mb-1 block">ডকুমেন্ট টাইপ</label>
                        <select
                          className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm bg-white"
                          value={currentSelectValue}
                          onChange={(e) => setEditData({ ...editData, docType: e.target.value })}
                        >
                          {VEHICLE_DOC_TYPES.map((t) => (
                            <option key={t} value={t}>{t}</option>
                          ))}
                        </select>
                      </div>
                      {(currentSelectValue === 'Others' || (!editData.docType && !VEHICLE_DOC_TYPES.includes(v.docType))) && (
                        <div>
                          <label className="text-xs font-medium text-slate-500 mb-1 block">টাইপ লিখুন</label>
                          <input
                            className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm bg-white"
                            value={(editData as any)._otherDoc ?? (!VEHICLE_DOC_TYPES.includes(v.docType) ? v.docType : '')}
                            onChange={(e) => setEditData({ ...editData, _otherDoc: e.target.value } as any)}
                            placeholder="ডকুমেন্ট টাইপ লিখুন"
                          />
                        </div>
                      )}
                      <div>
                        <label className="text-xs font-medium text-slate-500 mb-1 block">মেয়াদ</label>
                        <input
                          type="date"
                          className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm bg-white"
                          value={editData.expiry ?? v.expiry}
                          onChange={(e) => setEditData({ ...editData, expiry: e.target.value })}
                        />
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleSave(v)}
                          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors"
                        >
                          <Save size={14} /> সেভ
                        </button>
                        <button
                          onClick={() => { setEditKey(null); setEditData({}); }}
                          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-slate-100 text-slate-600 text-sm font-medium hover:bg-slate-200 transition-colors"
                        >
                          <X size={14} /> বাতিল
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center shrink-0">
                          <Car size={20} className="text-amber-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-slate-800 text-sm">{v.name}</p>
                          <p className="text-xs text-slate-500 mt-0.5">🚗 {v.carNumber}</p>
                          <p className="text-xs text-slate-500">📋 {v.docType}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <span className="text-xs text-slate-400">মেয়াদ: {v.expiry}</span>
                            <ExpiryBadge expiry={v.expiry} />
                          </div>
                        </div>
                      </div>
                      <ShareButtons text={getText(v)}>
                        {settings.editEnabled && (
                          <button
                            onClick={() => { setEditKey(v.key); setEditData({}); }}
                            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-600 text-xs font-medium transition-all"
                          >
                            <Pencil size={14} />
                            এডিট
                          </button>
                        )}
                      </ShareButtons>
                    </>
                  )}
                </Card>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
