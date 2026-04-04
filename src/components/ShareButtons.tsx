import { Copy, MessageSquare, Share2 } from 'lucide-react';
import { useState } from 'react';

interface ShareButtonsProps {
  text: string;
  children?: React.ReactNode;
}

export default function ShareButtons({ text, children }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="flex items-center gap-2 mt-3 flex-wrap">
      <button
        onClick={handleCopy}
        className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-medium transition-all"
      >
        <Copy size={14} />
        {copied ? 'কপি হয়েছে!' : 'কপি'}
      </button>
      <button
        onClick={() => (window.location.href = `sms:?body=${encodeURIComponent(text)}`)}
        className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-600 text-xs font-medium transition-all"
      >
        <MessageSquare size={14} />
        SMS
      </button>
      <button
        onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank')}
        className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-green-50 hover:bg-green-100 text-green-600 text-xs font-medium transition-all"
      >
        <Share2 size={14} />
        WhatsApp
      </button>
      {children}
    </div>
  );
}
