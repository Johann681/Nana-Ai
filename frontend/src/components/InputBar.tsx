'use client';

import { KeyboardEvent, useRef, useEffect, useState } from 'react';
import { Send, Loader2, Paperclip, Mic } from 'lucide-react';
import { useToast } from '@/context/ToastContext';
import { handleFeatureNotReady } from '@/actions/uiActions';

interface InputBarProps {
  value: string;
  onChange: (val: string) => void;
  onSend: () => void;
  isLoading: boolean;
}

export default function InputBar({ value, onChange, onSend, isLoading }: InputBarProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const { toast } = useToast();
  
  const placeholders = [
    "Identify your primary symptom...",
    "Describe the duration and intensity...",
    "Provide clinical context for analysis...",
    "List any relevant medical history..."
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % placeholders.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [placeholders.length]);

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
  }, [value]);

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (!isLoading && value.trim()) onSend();
    }
  };

  const canSend = !isLoading && value.trim().length > 0;

  return (
    <div className="bg-white border border-medical-border rounded-sm shadow-premium focus-within:border-medical-primary transition-all overflow-hidden">
      <div className="flex items-end px-4 py-3 gap-3">
        <button 
          onClick={() => handleFeatureNotReady('Clinical File Upload', toast)}
          disabled={isLoading}
          className="p-2 text-slate-400 hover:text-medical-primary transition-colors mb-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Paperclip className="w-5 h-5" />
        </button>
        
        <textarea
          id="chat-input"
          ref={textareaRef}
          rows={1}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholders[placeholderIndex]}
          disabled={isLoading}
          maxLength={1000}
          className="flex-1 bg-transparent resize-none text-[15px] text-medical-secondary placeholder:text-slate-400 outline-none leading-relaxed py-2 disabled:opacity-60 max-h-[120px] overflow-y-auto"
        />

        <div className="flex flex-col items-center gap-2 mb-0.5">
          {value.length > 50 && (
            <span className="text-[10px] font-bold text-slate-300 tabular-nums uppercase tracking-widest">
              {value.length}/1000
            </span>
          )}

          <div className="flex items-center gap-2">
            <button 
              onClick={() => handleFeatureNotReady('Voice Dictation', toast)}
              disabled={isLoading}
              className="p-2 text-slate-400 hover:text-medical-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Mic className="w-5 h-5" />
            </button>
            <button
              id="send-btn"
              onClick={onSend}
              disabled={!canSend}
              className={`w-10 h-10 rounded-sm bg-medical-primary text-white flex items-center justify-center transition-all hover:bg-medical-secondary active:scale-95 disabled:opacity-20 disabled:grayscale shadow-sm`}
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Bottom status bar for input */}
      <div className="h-1.5 bg-slate-50 border-t border-medical-border/50 flex items-center px-4 justify-between">
        <div className={`h-full bg-medical-primary transition-all duration-300 ${value.length > 0 ? 'opacity-100' : 'opacity-0'}`} style={{ width: `${(value.length / 1000) * 100}%` }} />
      </div>
    </div>
  );
}

