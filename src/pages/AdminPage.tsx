import { useEffect, useState } from 'react';
import { apiJson, postJson } from '../api';
import type { Bank, Vehicle, BackupItem, AppSettings } from '../types';
import { VEHICLE_DOC_TYPES } from '../types';
import PageHeader from '../components/PageHeader';
import Card from '../components/Card';
import {
  Save, Trash2, Database, Download, RefreshCw, Package, AlertTriangle,
  Plus, Landmark, Car, ToggleLeft, ToggleRight, Pencil, Shield, Key, Lock,
} from 'lucide-react';

export default function AdminPage() {
  const [liveMode, setLiveMode] = useState(false);
  const [banks, setBanks] = useState<Bank[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [backups, setBackups] = useState<BackupItem[]>([]);
  const [deleteKey, setDeleteKey] = useState('');
  const [loadingBackups, setLoadingBackups] = useState(false);
  const [settings, setSettings] = useState<AppSettings>({ editEnabled: true, deleteEnabled: true });
  const [savingSettings, setSavingSettings] = useState(false);

  // Credentials
  const [currentPin, setCurrentPin] = useState('');
  const [currentMasterKey, setCurrentMasterKey] = useState('');
  const [newPin, setNewPin] = useState('');
  const [newMasterKey, setNewMasterKey] = useState('');
  const [showCredentials, setShowCredentials] = useState(false);

  // Bank form
  const [bank, setBank] = useState({ title: '', name: '', account: '', routing: '', branch: '' });
  // Vehicle form
  const [vehicle, setVehicle] = useState({ name: '', carNumber: '', docType: VEHICLE_DOC_TYPES[0], otherDoc: '', expiry: '' });

  const loadOptions = () => {
    Promise.all([
      apiJson<Bank[]>('/api/banks'),
      apiJson<Vehicle[]>('/api/vehicles'),
    ]).then(([b, v]) => {
      setBanks(b || []);
      setVehicles(v || []);
    });
  };

  const loadBackups = () => {
    setLoadingBackups(true);
    apiJson<BackupItem[]>('/api/backups')
      .then((list) => setBackups(list || []))
      .finally(() => setLoadingBackups(false));
  };

  const loadSettings = () => {
    apiJson<AppSettings>('/api/settings')
      .then((s) => {
        if (s) setSettings(s);
      })
      .catch(() => {});
  };

  const loadCredentials = () => {
    apiJson<{ pin: string; masterKey: string }>('/api/credentials-info')
      .then((c) => {
        if (c) {
          setCurrentPin(c.pin);
          setCurrentMasterKey(c.masterKey);
        }
      })
      .catch(() => {});
  };

  const changePin = async () => {
    if (!newPin || newPin.length < 4) {
      alert('পিন কমপক্ষে ৪ সংখ্যার হতে হবে');
      return;
    }
    const res = await postJson<{ success: boolean; message?: string }>('/api/change-pin', { newPin });
    if (res?.success) {
      alert('পিন সফলভাবে পরিবর্তন হয়েছে!');
      setNewPin('');
      loadCredentials();
    } else {
      alert(res?.message || 'পিন পরিবর্তন ব্যর্থ হয়েছে');
    }
  };

  const changeMasterKey = async () => {
    if (!newMasterKey || newMasterKey.length < 4) {
      alert('মাস্টার কী কমপক্ষে ৪ সংখ্যার হতে হবে');
      return;
    }
    const res = await postJson<{ success: boolean; message?: string }>('/api/change-master-key', { newKey: newMasterKey });
    if (res?.success) {
      alert('মাস্টার কী সফলভাবে পরিবর্তন হয়েছে!');
      setNewMasterKey('');
      loadCredentials();
    } else {
      alert(res?.message || 'মাস্টার কী পরিবর্তন ব্যর্থ হয়েছে');
    }
  };

  useEffect(() => {
    loadOptions();
    loadBackups();
    loadSettings();
    loadCredentials();
  }, []);

  const toggleSetting = async (key: 'editEnabled' | 'deleteEnabled') => {
    const newSettings = { ...settings, [key]: !settings[key] };
    setSettings(newSettings);
    setSavingSettings(true);
    try {
      await postJson('/api/settings', newSettings);
    } catch {
      // Revert on error
      setSettings(settings);
      alert('সেটিংস সেভ করা যায়নি');
    }
    setSavingSettings(false);
  };

  const saveBank = async () => {
    await postJson('/api/save-bank', bank);
    alert('ব্যাংক সেভ হয়েছে!');
    setBank({ title: '', name: '', account: '', routing: '', branch: '' });
    if (liveMode) window.location.href = '/banks';
    else loadOptions();
  };

  const saveVehicle = async () => {
    await postJson('/api/save-vehicle', {
      name: vehicle.name,
      carNumber: vehicle.carNumber,
      docType: vehicle.docType === 'Others' ? vehicle.otherDoc : vehicle.docType,
      expiry: vehicle.expiry,
    });
    alert('গাড়ি সেভ হয়েছে!');
    setVehicle({ name: '', carNumber: '', docType: VEHICLE_DOC_TYPES[0], otherDoc: '', expiry: '' });
    if (liveMode) window.location.href = '/vehicles';
    else loadOptions();
  };

  const deleteItem = async () => {
    if (!deleteKey) return;
    await postJson('/api/delete', { key: deleteKey });
    alert('মুছে ফেলা হয়েছে!');
    loadOptions();
  };

  const deleteAll = async (prefix: string) => {
    if (!confirm('আপনি কি নিশ্চিত?')) return;
    await postJson('/api/delete-all', { prefix });
    alert('সব মুছে ফেলা হয়েছে!');
    loadOptions();
  };

  const createBackup = async () => {
    await apiJson('/api/backup');
    alert('ব্যাকআপ তৈরি হয়েছে!');
    loadBackups();
  };

  const restoreBackup = async (key: string) => {
    if (!confirm('এই ব্যাকআপ রিস্টোর করতে চান?')) return;
    await postJson('/api/restore', { key });
    alert('রিস্টোর সফল হয়েছে!');
    loadOptions();
  };

  const deleteBackup = async (key: string) => {
    if (!confirm('এই ব্যাকআপ মুছে ফেলতে চান?')) return;
    await postJson('/api/delete-backup', { key });
    alert('ব্যাকআপ মুছে ফেলা হয়েছে!');
    loadBackups();
  };

  const downloadBackup = (key: string) => {
    fetch(`/file?key=${key}`, { credentials: 'include' })
      .then((r) => r.blob())
      .then((blob) => {
        const a = document.createElement('a');
        const filename = key.split('/')[1];
        a.href = URL.createObjectURL(blob);
        a.download = `backup-${filename}`;
        a.click();
      });
  };

  return (
    <div>
      <PageHeader title="অ্যাডমিন প্যানেল" icon="⚙" />

      {/* Edit & Delete Toggle Settings */}
      <Card className="mb-4">
        <div className="flex items-center gap-2 mb-3">
          <Shield size={18} className="text-indigo-600" />
          <h3 className="text-sm font-bold text-slate-800">এডিট ও ডিলিট কন্ট্রোল</h3>
        </div>
        <div className="space-y-3">
          <button
            onClick={() => toggleSetting('editEnabled')}
            disabled={savingSettings}
            className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100 hover:bg-slate-100 transition-colors"
          >
            <div className="flex items-center gap-2">
              <Pencil size={16} className="text-amber-600" />
              <span className="text-sm font-medium text-slate-700">এডিট বাটন</span>
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-xs font-medium ${settings.editEnabled ? 'text-emerald-600' : 'text-red-500'}`}>
                {settings.editEnabled ? 'চালু' : 'বন্ধ'}
              </span>
              {settings.editEnabled ? (
                <ToggleRight size={28} className="text-emerald-500" />
              ) : (
                <ToggleLeft size={28} className="text-slate-400" />
              )}
            </div>
          </button>
          <button
            onClick={() => toggleSetting('deleteEnabled')}
            disabled={savingSettings}
            className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100 hover:bg-slate-100 transition-colors"
          >
            <div className="flex items-center gap-2">
              <Trash2 size={16} className="text-red-600" />
              <span className="text-sm font-medium text-slate-700">ডিলিট বাটন</span>
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-xs font-medium ${settings.deleteEnabled ? 'text-emerald-600' : 'text-red-500'}`}>
                {settings.deleteEnabled ? 'চালু' : 'বন্ধ'}
              </span>
              {settings.deleteEnabled ? (
                <ToggleRight size={28} className="text-emerald-500" />
              ) : (
                <ToggleLeft size={28} className="text-slate-400" />
              )}
            </div>
          </button>
          <p className="text-[10px] text-slate-400 text-center">
            বন্ধ করলে ফ্রন্টেন্ড থেকে এডিট/ডিলিট বাটন লুকানো হবে
          </p>
        </div>
      </Card>

      {/* Change PIN & Master Key */}
      <Card className="mb-4">
        <button
          onClick={() => setShowCredentials(!showCredentials)}
          className="w-full flex items-center justify-between"
        >
          <div className="flex items-center gap-2">
            <Key size={18} className="text-amber-600" />
            <h3 className="text-sm font-bold text-slate-800">পিন ও মাস্টার কী</h3>
          </div>
          <span className="text-xs text-slate-400">{showCredentials ? '▲ বন্ধ' : '▼ খুলুন'}</span>
        </button>

        {showCredentials && (
          <div className="mt-3 space-y-4">
            {/* Current Credentials Display */}
            <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
              <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-2">বর্তমান তথ্য</p>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-slate-500">লগইন পিন:</span>
                <span className="text-sm font-mono font-bold text-slate-800">{currentPin || '...'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500">মাস্টার কী:</span>
                <span className="text-sm font-mono font-bold text-slate-800">{currentMasterKey || '...'}</span>
              </div>
            </div>

            {/* Change PIN */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Lock size={14} className="text-blue-600" />
                <span className="text-xs font-medium text-slate-600">নতুন লগইন পিন</span>
              </div>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="নতুন পিন (কমপক্ষে ৪ সংখ্যা)"
                  value={newPin}
                  onChange={(e) => setNewPin(e.target.value)}
                  className="flex-1 px-3 py-2.5 rounded-xl border border-slate-200 text-sm"
                />
                <button
                  onClick={changePin}
                  className="px-4 py-2.5 rounded-xl bg-blue-600 text-white text-xs font-medium whitespace-nowrap"
                >
                  পরিবর্তন
                </button>
              </div>
            </div>

            {/* Change Master Key */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Key size={14} className="text-amber-600" />
                <span className="text-xs font-medium text-slate-600">নতুন মাস্টার কী</span>
              </div>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="নতুন মাস্টার কী (কমপক্ষে ৪ সংখ্যা)"
                  value={newMasterKey}
                  onChange={(e) => setNewMasterKey(e.target.value)}
                  className="flex-1 px-3 py-2.5 rounded-xl border border-slate-200 text-sm"
                />
                <button
                  onClick={changeMasterKey}
                  className="px-4 py-2.5 rounded-xl bg-amber-500 text-white text-xs font-medium whitespace-nowrap"
                >
                  পরিবর্তন
                </button>
              </div>
            </div>

            <p className="text-[10px] text-red-400 text-center">
              ⚠ পিন পরিবর্তনের পর নতুন পিন দিয়ে লগইন করতে হবে
            </p>
          </div>
        )}
      </Card>

      {/* Live Mode Toggle */}
      <Card className="mb-4">
        <button
          onClick={() => setLiveMode(!liveMode)}
          className="w-full flex items-center justify-between"
        >
          <span className="text-sm font-medium text-slate-700">Instant Update মোড</span>
          {liveMode ? (
            <ToggleRight size={28} className="text-blue-600" />
          ) : (
            <ToggleLeft size={28} className="text-slate-400" />
          )}
        </button>
      </Card>

      {/* Quick Add Bank */}
      <Card className="mb-4">
        <div className="flex items-center gap-2 mb-3">
          <Landmark size={18} className="text-blue-600" />
          <h3 className="text-sm font-bold text-slate-800">দ্রুত ব্যাংক যোগ</h3>
        </div>
        <div className="space-y-2">
          <input placeholder="অ্যাকাউন্ট টাইটেল" value={bank.title} onChange={(e) => setBank({ ...bank, title: e.target.value })} className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm" />
          <input placeholder="ব্যাংকের নাম" value={bank.name} onChange={(e) => setBank({ ...bank, name: e.target.value })} className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm" />
          <input placeholder="অ্যাকাউন্ট নম্বর" value={bank.account} onChange={(e) => setBank({ ...bank, account: e.target.value })} className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm" />
          <input placeholder="রাউটিং নম্বর" value={bank.routing} onChange={(e) => setBank({ ...bank, routing: e.target.value })} className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm" />
          <input placeholder="শাখা" value={bank.branch} onChange={(e) => setBank({ ...bank, branch: e.target.value })} className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm" />
          <button onClick={saveBank} className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-medium">
            <Save size={14} /> ব্যাংক সেভ
          </button>
        </div>
      </Card>

      {/* Quick Add Vehicle */}
      <Card className="mb-4">
        <div className="flex items-center gap-2 mb-3">
          <Car size={18} className="text-amber-600" />
          <h3 className="text-sm font-bold text-slate-800">দ্রুত গাড়ি যোগ</h3>
        </div>
        <div className="space-y-2">
          <input placeholder="নাম" value={vehicle.name} onChange={(e) => setVehicle({ ...vehicle, name: e.target.value })} className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm" />
          <input placeholder="গাড়ির নম্বর" value={vehicle.carNumber} onChange={(e) => setVehicle({ ...vehicle, carNumber: e.target.value })} className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm" />
          <select value={vehicle.docType} onChange={(e) => setVehicle({ ...vehicle, docType: e.target.value })} className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm">
            {VEHICLE_DOC_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
          {vehicle.docType === 'Others' && (
            <input placeholder="ডকুমেন্ট টাইপ" value={vehicle.otherDoc} onChange={(e) => setVehicle({ ...vehicle, otherDoc: e.target.value })} className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm" />
          )}
          <input type="date" value={vehicle.expiry} onChange={(e) => setVehicle({ ...vehicle, expiry: e.target.value })} className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm" />
          <button onClick={saveVehicle} className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-amber-500 text-white text-sm font-medium">
            <Save size={14} /> গাড়ি সেভ
          </button>
        </div>
      </Card>

      {/* Delete Single Item */}
      <Card className="mb-4">
        <div className="flex items-center gap-2 mb-3">
          <Trash2 size={18} className="text-red-600" />
          <h3 className="text-sm font-bold text-slate-800">আইটেম মুছুন</h3>
        </div>
        <select value={deleteKey} onChange={(e) => setDeleteKey(e.target.value)} className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm mb-2">
          <option value="">নির্বাচন করুন</option>
          {banks.map((b) => (
            <option key={b.key} value={b.key}>ব্যাংক - {b.name}</option>
          ))}
          {vehicles.map((v) => (
            <option key={v.key} value={v.key}>গাড়ি - {v.name}</option>
          ))}
        </select>
        <button onClick={deleteItem} className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-red-500 text-white text-sm font-medium">
          <Trash2 size={14} /> নির্বাচিত আইটেম মুছুন
        </button>
      </Card>

      {/* Delete All */}
      <Card className="mb-4">
        <div className="flex items-center gap-2 mb-3">
          <AlertTriangle size={18} className="text-red-600" />
          <h3 className="text-sm font-bold text-slate-800">⚠ সব ডাটা মুছুন</h3>
        </div>
        <div className="space-y-2">
          <button onClick={() => deleteAll('bank:')} className="w-full py-2.5 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm font-medium hover:bg-red-100 transition-colors">
            সব ব্যাংক মুছুন
          </button>
          <button onClick={() => deleteAll('vehicle:')} className="w-full py-2.5 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm font-medium hover:bg-red-100 transition-colors">
            সব গাড়ি মুছুন
          </button>
          <button onClick={() => deleteAll('doc:')} className="w-full py-2.5 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm font-medium hover:bg-red-100 transition-colors">
            সব ডকুমেন্ট মুছুন
          </button>
        </div>
      </Card>

      {/* Backup System */}
      <Card>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Database size={18} className="text-indigo-600" />
            <h3 className="text-sm font-bold text-slate-800">💾 ব্যাকআপ সিস্টেম</h3>
          </div>
          <button
            onClick={createBackup}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-indigo-600 text-white text-xs font-medium"
          >
            <Plus size={12} /> ব্যাকআপ
          </button>
        </div>

        {loadingBackups ? (
          <div className="flex justify-center py-6">
            <div className="w-5 h-5 border-2 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
          </div>
        ) : backups.length === 0 ? (
          <p className="text-xs text-slate-400 text-center py-4">কোনো ব্যাকআপ নেই</p>
        ) : (
          <div className="space-y-2">
            {backups.map((b) => {
              const timestamp = b.key.split('/')[1]?.replace('.json', '');
              const date = timestamp ? new Date(parseInt(timestamp)).toLocaleString() : 'Unknown';
              const size = Math.round((b.size || 0) / 1024);

              return (
                <div key={b.key} className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                  <div className="flex items-center gap-2 mb-2">
                    <Package size={14} className="text-indigo-500" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-slate-700 truncate">📦 Backup</p>
                      <p className="text-[10px] text-slate-400">{date} • {size} KB</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => downloadBackup(b.key)}
                      className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg bg-blue-50 text-blue-600 text-xs font-medium hover:bg-blue-100 transition-colors"
                    >
                      <Download size={12} /> ডাউনলোড
                    </button>
                    <button
                      onClick={() => restoreBackup(b.key)}
                      className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg bg-emerald-50 text-emerald-600 text-xs font-medium hover:bg-emerald-100 transition-colors"
                    >
                      <RefreshCw size={12} /> রিস্টোর
                    </button>
                    <button
                      onClick={() => deleteBackup(b.key)}
                      className="flex items-center justify-center gap-1 px-3 py-1.5 rounded-lg bg-red-50 text-red-600 text-xs font-medium hover:bg-red-100 transition-colors"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>
    </div>
  );
}
