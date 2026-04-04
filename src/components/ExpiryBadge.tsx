import { AlertTriangle, AlertCircle, Clock, CheckCircle } from 'lucide-react';

interface ExpiryBadgeProps {
  expiry: string;
  compact?: boolean;
}

export function getExpiryInfo(expiry: string) {
  const today = new Date();
  const exp = new Date(expiry);
  const diff = Math.floor((exp.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  if (diff < 0) return { label: 'মেয়াদ শেষ', days: diff, level: 'expired' as const, color: 'bg-red-100 text-red-700 border-red-200' };
  if (diff <= 7) return { label: `${diff} দিন বাকি`, days: diff, level: 'critical' as const, color: 'bg-red-50 text-red-600 border-red-200' };
  if (diff <= 15) return { label: `${diff} দিন বাকি`, days: diff, level: 'warning' as const, color: 'bg-amber-50 text-amber-700 border-amber-200' };
  if (diff <= 30) return { label: `${diff} দিন বাকি`, days: diff, level: 'caution' as const, color: 'bg-yellow-50 text-yellow-700 border-yellow-200' };
  return { label: `${diff} দিন বাকি`, days: diff, level: 'ok' as const, color: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
}

export default function ExpiryBadge({ expiry, compact = false }: ExpiryBadgeProps) {
  const info = getExpiryInfo(expiry);

  const icons = {
    expired: <AlertCircle size={14} />,
    critical: <AlertTriangle size={14} />,
    warning: <AlertTriangle size={14} />,
    caution: <Clock size={14} />,
    ok: <CheckCircle size={14} />,
  };

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border ${info.color} ${
      info.level === 'expired' || info.level === 'critical' ? 'dash-alert' : ''
    }`}>
      {icons[info.level]}
      {compact ? `${info.days}d` : info.label}
    </span>
  );
}
