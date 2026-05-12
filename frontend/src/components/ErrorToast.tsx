'use client';

import { useEffect, useState } from 'react';
import { X, ShieldAlert } from 'lucide-react';

interface ErrorToastProps {
  message: string;
  onDismiss: () => void;
}

export default function ErrorToast({ message, onDismiss }: ErrorToastProps) {
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setExiting(true);
      setTimeout(onDismiss, 350);
    }, 5000);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  const handleDismiss = () => {
    setExiting(true);
    setTimeout(onDismiss, 350);
  };

  return (
    <div
      role="alert"
      aria-live="assertive"
      className={`fixed bottom-4 right-4 md:bottom-10 md:right-10 z-[100] flex items-start gap-4 bg-white border border-medical-error/20 shadow-premium rounded-sm px-5 py-4 max-w-[90%] sm:max-w-sm transition-all duration-300 ${
        exiting ? 'opacity-0 translate-x-10' : 'opacity-100 translate-x-0'
      }`}
    >
      <div className="w-10 h-10 bg-medical-error/5 flex items-center justify-center rounded-sm shrink-0">
        <ShieldAlert className="w-5 h-5 text-medical-error" />
      </div>

      <div className="flex-1 min-w-0 pt-0.5">
        <p className="text-[11px] font-bold text-medical-error uppercase tracking-widest">Protocol Error</p>
        <p className="text-xs text-slate-500 mt-1 leading-relaxed">{message}</p>
      </div>

      <button
        onClick={handleDismiss}
        className="p-1 text-slate-300 hover:text-slate-600 transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
      
      {/* Progress line */}
      <div className="absolute bottom-0 left-0 h-0.5 bg-medical-error/20 w-full overflow-hidden">
        <div className="h-full bg-medical-error animate-[shrink_5s_linear_forwards]" />
      </div>

      <style jsx>{`
        @keyframes shrink {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>
    </div>
  );
}
