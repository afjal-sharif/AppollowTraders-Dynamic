import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  icon?: string;
  showBack?: boolean;
}

export default function PageHeader({ title, subtitle, icon, showBack = false }: PageHeaderProps) {
  const navigate = useNavigate();

  return (
    <div className="mb-5">
      {showBack && (
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700 mb-2 transition-colors"
        >
          <ArrowLeft size={16} />
          পেছনে যান
        </button>
      )}
      <div className="flex items-center gap-3">
        {icon && <span className="text-2xl">{icon}</span>}
        <div>
          <h1 className="text-xl font-bold text-slate-800">{title}</h1>
          {subtitle && <p className="text-sm text-slate-500 mt-0.5">{subtitle}</p>}
        </div>
      </div>
    </div>
  );
}
