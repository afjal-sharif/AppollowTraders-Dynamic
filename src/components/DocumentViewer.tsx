import { useState, useRef, useEffect } from 'react';
import { X, ZoomIn, ZoomOut, RotateCw, Download } from 'lucide-react';

interface DocumentViewerProps {
  fileKey: string;
  onClose: () => void;
}

export default function DocumentViewer({ fileKey, onClose }: DocumentViewerProps) {
  const [scale, setScale] = useState(1);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const startRef = useRef({ x: 0, y: 0 });
  const posRef = useRef({ x: 0, y: 0 });
  const distRef = useRef(0);
  const dragging = useRef(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const isPdf = fileKey.endsWith('.pdf');

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
    if (!el) return;

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
      e.preventDefault();
      if (e.touches.length === 1 && dragging.current) {
        const nx = e.touches[0].clientX - startRef.current.x;
        const ny = e.touches[0].clientY - startRef.current.y;
        posRef.current = { x: nx, y: ny };
        setPos({ x: nx, y: ny });
        updateTransform(scale, nx, ny);
      }
      if (e.touches.length === 2) {
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
  }, [scale]);

  return (
    <div className="fixed inset-0 z-50 bg-black/90 flex flex-col animate-fade-in">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-3 bg-black/50">
        <div className="flex items-center gap-2">
          <button onClick={zoomIn} className="p-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors">
            <ZoomIn size={18} />
          </button>
          <button onClick={zoomOut} className="p-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors">
            <ZoomOut size={18} />
          </button>
          <button onClick={resetZoom} className="p-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors">
            <RotateCw size={18} />
          </button>
          <button
            onClick={() => window.open(`/file?key=${fileKey}`, '_blank')}
            className="p-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors"
          >
            <Download size={18} />
          </button>
        </div>
        <button onClick={onClose} className="p-2 rounded-lg bg-white/10 text-white hover:bg-red-500/50 transition-colors">
          <X size={20} />
        </button>
      </div>

      {/* Content */}
      <div id="viewer-container" className="flex-1 overflow-hidden flex items-center justify-center">
        <div ref={wrapperRef} style={{ transformOrigin: 'center center' }}>
          {isPdf ? (
            <iframe
              src={`/file?key=${fileKey}`}
              className="w-screen h-screen border-none"
              title="PDF Viewer"
            />
          ) : (
            <img
              src={`/file?key=${fileKey}`}
              alt="Document"
              className="max-w-none"
              style={{ display: 'block' }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
