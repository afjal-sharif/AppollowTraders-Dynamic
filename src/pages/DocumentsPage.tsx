import { useEffect, useState, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { apiJson, postJson } from '../api';
import type { Document, AppSettings } from '../types';
import { DOCUMENT_TYPES } from '../types';
import Card from '../components/Card';
import SearchBar from '../components/SearchBar';
import ShareButtons from '../components/ShareButtons';
import PageHeader from '../components/PageHeader';
import ExpiryBadge from '../components/ExpiryBadge';
import DocumentViewer from '../components/DocumentViewer';
import { FileText, Pencil, Trash2, Save, X, Eye, Download } from 'lucide-react';

export default function DocumentsPage() {
  const [docs, setDocs] = useState<Document[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [editKey, setEditKey] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<Document>>({});
  const [viewerFile, setViewerFile] = useState<string | null>(null);
  const [settings, setSettings] = useState<AppSettings>({ editEnabled: true, deleteEnabled: true });
  const [searchParams] = useSearchParams();
  const highlightDoc = searchParams.get('doc');
  const highlightRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    Promise.all([
      apiJson<Document[]>('/api/documents'),
      apiJson<AppSettings>('/api/settings').catch(() => ({ editEnabled: true, deleteEnabled: true })),
    ]).then(([data, s]) => {
      if (Array.isArray(data)) setDocs(data);
      if (s) setSettings(s);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (highlightRef.current) {
      setTimeout(() => {
        highlightRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 300);
    }
  }, [docs]);

  const filtered = docs.filter(
    (d) =>
      (d.name || '').toLowerCase().includes(search.toLowerCase()) ||
      (d.type || '').toLowerCase().includes(search.toLowerCase()) ||
      (d.number || '').toLowerCase().includes(search.toLowerCase())
  );

  const getText = (d: Document) =>
    `Document: ${d.name}\nType: ${d.type}\nNumber: ${d.number}\nExpiry: ${d.expiry}`;

  const handleSave = async (d: Document) => {
    const finalType = editData.type === 'Others'
      ? (editData as any)._otherType || d.type
      : editData.type || d.type;

    await postJson('/api/save-document', {
      key: d.key,
      name: editData.name || d.name,
      number: editData.number || d.number,
      type: finalType,
      expiry: editData.expiry || d.expiry,
    });
    setDocs((prev) =>
      prev.map((item) =>
        item.key === d.key
          ? {
              ...item,
              name: editData.name || d.name,
              number: editData.number || d.number,
              type: finalType,
              expiry: editData.expiry || d.expiry,
            }
          : item
      )
    );
    setEditKey(null);
    setEditData({});
  };

  const handleDelete = async (key: string) => {
    if (!confirm('এই ডকুমেন্ট মুছে ফেলতে চান?')) return;
    await postJson('/api/delete', { key });
    setDocs((prev) => prev.filter((d) => d.key !== key));
  };

  return (
    <div>
      <PageHeader title="ব্যবসায়িক ডকুমেন্টস" icon="📄" />
      <SearchBar value={search} onChange={setSearch} placeholder="ডকুমেন্ট খুঁজুন..." />

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-6 h-6 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 text-slate-400">
          <FileText size={40} className="mx-auto mb-3 opacity-40" />
          <p className="text-sm">কোনো ডকুমেন্ট পাওয়া যায়নি</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((d) => {
            const isHighlight = highlightDoc === d.name;
            const isEditing = editKey === d.key;
            const currentSelectValue = editData.type ?? (DOCUMENT_TYPES.includes(d.type) ? d.type : 'Others');
            const showOtherInput = currentSelectValue === 'Others' || (!editData.type && !DOCUMENT_TYPES.includes(d.type));

            return (
              <div key={d.key} ref={isHighlight ? highlightRef : undefined}>
                <Card highlight={isHighlight} className="animate-slide-up">
                  {isEditing ? (
                    <div className="space-y-3">
                      <div>
                        <label className="text-xs font-medium text-slate-500 mb-1 block">নাম</label>
                        <input
                          className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm bg-white"
                          value={editData.name ?? d.name}
                          onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                          placeholder="নাম"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-medium text-slate-500 mb-1 block">নম্বর</label>
                        <input
                          className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm bg-white"
                          value={editData.number ?? d.number}
                          onChange={(e) => setEditData({ ...editData, number: e.target.value })}
                          placeholder="নম্বর"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-medium text-slate-500 mb-1 block">ডকুমেন্ট টাইপ</label>
                        <select
                          className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm bg-white"
                          value={currentSelectValue}
                          onChange={(e) => setEditData({ ...editData, type: e.target.value })}
                        >
                          {DOCUMENT_TYPES.map((t) => (
                            <option key={t} value={t}>{t}</option>
                          ))}
                        </select>
                      </div>
                      {showOtherInput && (
                        <div>
                          <label className="text-xs font-medium text-slate-500 mb-1 block">টাইপ লিখুন</label>
                          <input
                            className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm bg-white"
                            value={(editData as any)._otherType ?? (!DOCUMENT_TYPES.includes(d.type) ? d.type : '')}
                            onChange={(e) => setEditData({ ...editData, _otherType: e.target.value } as any)}
                            placeholder="ডকুমেন্ট টাইপ লিখুন"
                          />
                        </div>
                      )}
                      <div>
                        <label className="text-xs font-medium text-slate-500 mb-1 block">মেয়াদ</label>
                        <input
                          type="date"
                          className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm bg-white"
                          value={editData.expiry ?? d.expiry}
                          onChange={(e) => setEditData({ ...editData, expiry: e.target.value })}
                        />
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleSave(d)}
                          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-medium"
                        >
                          <Save size={14} /> সেভ
                        </button>
                        <button
                          onClick={() => { setEditKey(null); setEditData({}); }}
                          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-slate-100 text-slate-600 text-sm font-medium"
                        >
                          <X size={14} /> বাতিল
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      {/* Thumbnail */}
                      {d.file && (
                        <div
                          className="mb-3 rounded-xl overflow-hidden bg-slate-100 cursor-pointer"
                          onClick={() => setViewerFile(d.file!)}
                        >
                          <img
                            src={`/file?key=${d.file}`}
                            alt={d.name}
                            className="w-full h-36 object-cover"
                            loading="lazy"
                          />
                        </div>
                      )}
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
                          <FileText size={20} className="text-emerald-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-slate-800 text-sm">{d.name}</p>
                          <p className="text-xs text-slate-500 mt-0.5">📋 {d.type}</p>
                          <p className="text-xs text-slate-500"># {d.number}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <span className="text-xs text-slate-400">মেয়াদ: {d.expiry}</span>
                            <ExpiryBadge expiry={d.expiry} />
                          </div>
                        </div>
                      </div>
                      <ShareButtons text={getText(d)}>
                        {d.file && (
                          <>
                            <button
                              onClick={() => setViewerFile(d.file!)}
                              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-600 text-xs font-medium transition-all"
                            >
                              <Eye size={14} />
                              দেখুন
                            </button>
                            <button
                              onClick={() => window.open(`/file?key=${d.file}`, '_blank')}
                              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-600 text-xs font-medium transition-all"
                            >
                              <Download size={14} />
                            </button>
                          </>
                        )}
                        {settings.editEnabled && (
                          <button
                            onClick={() => { setEditKey(d.key); setEditData({}); }}
                            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-600 text-xs font-medium transition-all"
                          >
                            <Pencil size={14} />
                          </button>
                        )}
                        {settings.deleteEnabled && (
                          <button
                            onClick={() => handleDelete(d.key)}
                            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 text-xs font-medium transition-all"
                          >
                            <Trash2 size={14} />
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

      {/* Document Viewer Modal */}
      {viewerFile && (
        <DocumentViewer fileKey={viewerFile} onClose={() => setViewerFile(null)} />
      )}
    </div>
  );
}
