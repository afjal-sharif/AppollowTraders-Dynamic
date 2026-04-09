import { useState, useRef, useEffect } from 'react';
import { X, ZoomIn, ZoomOut, RotateCw, Download, ExternalLink, Smartphone, FileText, Image as ImageIcon } from 'lucide-react';

interface DocumentViewerProps {
  fileKey: string;
  onClose: () => void;
}

export default function DocumentViewer({ fileKey, onClose }: DocumentViewerProps) {
  const [scale, setScale] = useState(1);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [pdfMode, setPdfMode] = useState<'direct' | 'google' | 'download'>('direct');
  const startRef = useRef({ x: 0, y: 0 });
  const posRef = useRef({ x: 0, y: 0 });
  const distRef = useRef(0);
  const dragging = useRef(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const fileUrl = `/file?key=${encodeURIComponent(fileKey)}`;
  const fullUrl = `${location.origin}${fileUrl}`;
  const fileName = fileKey.split('/').pop() || fileKey;
  const fileExt = fileName.split('.').pop()?.toLowerCase() || '';
  
  const isPdf = fileExt === 'pdf';
  const isImage = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'svg'].includes(fileExt);
  const isOffice = ['doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx'].includes(fileExt);
  const isText = ['txt', 'rtf', 'csv'].includes(fileExt);
  const isSupportedViewer = isPdf || isImage;
  const isAndroid = /Android/i.test(navigator.userAgent);
  const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
  const isMobile = isAndroid || isIOS;

  const updateTransform = (s: number, x: number, y: number) => {
    if (wrapperRef.current) {
      wrapperRef.current.style.transform = `translate(${x}px,${y}px) scale(${s})`;
    }
  };

  const zoomIn = () => {
    const ns = Math.min(scale + 0.2, 5);
    setScale(ns);
    updateTransform(ns, pos.x, pos.y);
  };

  const zoomOut = () => {
    const ns = Math.max(scale - 0.2, 0.3);
    setScale(ns);
    updateTransform(ns, pos.x, pos.y);
  };

  const resetZoom = () => {
    setScale(1);
    setPos({ x: 0, y: 0 });
    posRef.current = { x: 0, y: 0 };
    updateTransform(1, 0, 0);
  };

  useEffect(() => {
    const el = document.getElementById('viewer-container');
    if (!el || !isImage) return;

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        dragging.current = true;
        startRef.current = {
          x: e.touches[0].clientX - posRef.current.x,
          y: e.touches[0].clientY - posRef.current.y,
        };
      }
      if (e.touches.length === 2) {
        dragging.current = false;
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        distRef.current = Math.sqrt(dx * dx + dy * dy);
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 1 && dragging.current) {
        e.preventDefault();
        const nx = e.touches[0].clientX - startRef.current.x;
        const ny = e.touches[0].clientY - startRef.current.y;
        posRef.current = { x: nx, y: ny };
        setPos({ x: nx, y: ny });
        updateTransform(scale, nx, ny);
      }
      if (e.touches.length === 2) {
        e.preventDefault();
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        const newDist = Math.sqrt(dx * dx + dy * dy);
        const zoom = newDist / distRef.current;
        const ns = Math.min(Math.max(scale * zoom, 0.5), 5);
        distRef.current = newDist;
        setScale(ns);
        updateTransform(ns, posRef.current.x, posRef.current.y);
      }
    };

    const handleTouchEnd = () => {
      dragging.current = false;
    };

    el.addEventListener('touchstart', handleTouchStart, { passive: false });
    el.addEventListener('touchmove', handleTouchMove, { passive: false });
    el.addEventListener('touchend', handleTouchEnd);

    return () => {
      el.removeEventListener('touchstart', handleTouchStart);
      el.removeEventListener('touchmove', handleTouchMove);
      el.removeEventListener('touchend', handleTouchEnd);
    };
  }, [scale, isImage]);

  const openInNewTab = () => window.open(fileUrl, '_blank');
  const downloadFile = () => {
    const a = document.createElement('a');
    a.href = fileUrl;
    a.download = fileName;
    a.click();
  };

  // For mobile PDFs, default to Google Docs viewer
  useEffect(() => {
    if (isPdf && isMobile) {
      setPdfMode('google');
    }
  }, [isPdf, isMobile]);

  return (
    <div className="fixed inset-0 z-50 bg-black/95 flex flex-col animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2.5 bg-black/80 backdrop-blur-sm border-b border-white/10">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          {isImage ? <ImageIcon size={18} className="text-white/70 shrink-0" /> : <FileText size={18} className="text-white/70 shrink-0" />}
          <span className="text-white/90 text-sm truncate">{fileName}</span>
        </div>
        <button onClick={onClose} className="p-2 -mr-1 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors shrink-0">
          <X size={20} />
        </button>
      </div>

      {/* PDF Mobile Toolbar */}
      {isPdf && isMobile && (
        <div className="flex items-center gap-1.5 px-3 py-2 bg-black/60 border-b border-white/5 overflow-x-auto">
          <button
            onClick={() => setPdfMode('direct')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
              pdfMode === 'direct' ? 'bg-white text-black' : 'bg-white/10 text-white/80 hover:bg-white/20'
            }`}
          >
            সরাসরি
          </button>
          <button
            onClick={() => setPdfMode('google')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
              pdfMode === 'google' ? 'bg-white text-black' : 'bg-white/10 text-white/80 hover:bg-white/20'
            }`}
          >
            Google Viewer
          </button>
          <div className="w-px h-6 bg-white/10 mx-1" />
          <button onClick={openInNewTab} className="p-1.5 rounded-lg bg-white/10 text-white/80 hover:bg-white/20 transition-colors">
            <ExternalLink size={16} />
          </button>
          <button onClick={downloadFile} className="p-1.5 rounded-lg bg-white/10 text-white/80 hover:bg-white/20 transition-colors">
            <Download size={16} />
          </button>
        </div>
      )}

      {/* Image Toolbar */}
      {isImage && (
        <div className="flex items-center justify-center gap-2 px-3 py-2 bg-black/60 border-b border-white/5">
          <button onClick={zoomOut} className="p-2 rounded-lg bg-white/10 text-white/80 hover:bg-white/20 transition-colors">
            <ZoomOut size={18} />
          </button>
          <span className="text-white/60 text-xs w-12 text-center">{Math.round(scale * 100)}%</span>
          <button onClick={zoomIn} className="p-2 rounded-lg bg-white/10 text-white/80 hover:bg-white/20 transition-colors">
            <ZoomIn size={18} />
          </button>
          <button onClick={resetZoom} className="p-2 rounded-lg bg-white/10 text-white/80 hover:bg-white/20 transition-colors">
            <RotateCw size={18} />
          </button>
          <div className="w-px h-6 bg-white/10 mx-1" />
          <button onClick={downloadFile} className="p-2 rounded-lg bg-white/10 text-white/80 hover:bg-white/20 transition-colors">
            <Download size={18} />
          </button>
        </div>
      )}

      {/* Content Area */}
      <div id="viewer-container" className="flex-1 relative overflow-hidden bg-zinc-950">
        {isImage && (
          <div className="w-full h-full flex items-center justify-center overflow-hidden touch-none">
            <div ref={wrapperRef} style={{ transformOrigin: 'center center', willChange: 'transform' }}>
              <img src={fileUrl} alt={fileName} className="max-w-none select-none" draggable={false} style={{ display: 'block' }} />
            </div>
          </div>
        )}

        {isPdf && !isMobile && (
          <iframe src={fileUrl} className="w-full h-full border-0 bg-white" title={fileName} />
        )}

        {isPdf && isMobile && pdfMode === 'direct' && (
          <iframe src={fileUrl} className="w-full h-full border-0 bg-white" title={fileName} />
        )}

        {isPdf && isMobile && pdfMode === 'google' && (
          <iframe
            src={`https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(fullUrl)}`}
            className="w-full h-full border-0 bg-white"
            title={fileName}
          />
        )}

        {(isOffice || isText || (!isSupportedViewer && !isPdf)) && (
          <div className="w-full h-full flex items-center justify-center p-6">
            <div className="max-w-sm w-full">
              <div className="bg-zinc-900 rounded-2xl p-6 border border-white/10">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-white/5 flex items-center justify-center">
                  <FileText size={32} className="text-white/40" />
                </div>
                <h3 className="text-white text-center font-medium mb-1">{fileName}</h3>
                <p className="text-white/50 text-center text-sm mb-6">এই ফাইল টাইপ ব্রাউজারে দেখা যাবে না</p>
                
                <div className="space-y-2.5">
                  <button
                    onClick={downloadFile}
                    className="w-full flex items-center justify-center gap-2.5 py-3 rounded-xl bg-white text-black font-medium hover:bg-white/90 active:scale-[0.98] transition-all"
                  >
                    <Download size={18} />
                    ডাউনলোড করুন
                  </button>
                  
                  <button
                    onClick={openInNewTab}
                    className="w-full flex items-center justify-center gap-2.5 py-3 rounded-xl bg-white/10 text-white font-medium hover:bg-white/15 active:scale-[0.98] transition-all"
                  >
                    <ExternalLink size={18} />
                    নতুন ট্যাবে খুলুন
                  </button>

                  {isOffice && (
                    <button
                      onClick={() => window.open(`https://view.officeapps.live.com/op/view.aspx?src=${encodeURIComponent(fullUrl)}`, '_blank')}
                      className="w-full flex items-center justify-center gap-2.5 py-3 rounded-xl bg-[#0078d4] text-white font-medium hover:bg-[#106ebe] active:scale-[0.98] transition-all"
                    >
                      <FileText size={18} />
                      Microsoft Viewer
                    </button>
                  )}

                  {(isPdf || isOffice) && (
                    <button
                      onClick={() => window.open(`https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(fullUrl)}`, '_blank')}
                      className="w-full flex items-center justify-center gap-2.5 py-3 rounded-xl bg-white/5 text-white/80 font-medium hover:bg-white/10 active:scale-[0.98] transition-all border border-white/10"
                    >
                      <Smartphone size={18} />
                      Google Docs Viewer
                    </button>
                  )}

                  {isAndroid && (
                    <p className="text-center text-xs text-white/40 pt-2">
                      ডাউনলোড করার পর ফোনের ডিফল্ট অ্যাপে খুলবে
                    </p>
                  )}
                </div>
              </div>

              <button onClick={onClose} className="w-full mt-4 py-3 text-white/60 text-sm hover:text-white/80 transition-colors">
                বন্ধ করুন
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}