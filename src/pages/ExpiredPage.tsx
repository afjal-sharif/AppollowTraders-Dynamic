import { AlertTriangle } from 'lucide-react';

export default function ExpiredPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-red-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-xl p-8 max-w-sm w-full text-center">
        <div className="w-16 h-16 rounded-2xl bg-red-100 flex items-center justify-center mx-auto mb-4">
          <AlertTriangle size={32} className="text-red-500" />
        </div>
        <h2 className="text-xl font-bold text-red-600 mb-2">⚠ দুঃখিত</h2>
        <p className="text-slate-600 text-sm leading-relaxed">
          সফটওয়্যার এর মেয়াদ শেষ হয়ে গেছে
        </p>
        <div className="mt-4 p-3 rounded-xl bg-red-50 border border-red-100">
          <p className="text-xs text-red-600">
            সফটওয়্যার পুনরায় ব্যাবহার করতে বাৎসরিক বিল পরিশোধ করে দ্রুত রিনিউ করুন
          </p>
        </div>
      </div>
    </div>
  );
}
