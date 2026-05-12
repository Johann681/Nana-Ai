'use client';

import { Activity } from 'lucide-react';

interface QuickButtonsProps {
  onSelect: (text: string) => void;
  disabled: boolean;
}

const QUICK_REPLIES = [
  'Just started', 'Since yesterday', '2-3 days', 'About a week', 'Persistent', 'Recurrent'
];

export default function QuickButtons({ onSelect, disabled }: QuickButtonsProps) {
  return (
    <div className="w-full overflow-x-auto scrollbar-hide flex items-center gap-2 py-2 mb-2 animate-fade-in">
      <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-medical-border rounded-sm shrink-0">
        <Activity className="w-3 h-3 text-medical-primary" />
        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Protocol Shortcuts</span>
      </div>
      {QUICK_REPLIES.map((reply) => (
        <button
          key={reply}
          onClick={() => onSelect(reply)}
          disabled={disabled}
          className="flex-shrink-0 px-4 py-2 bg-white border border-medical-border rounded-sm text-[11px] font-bold text-medical-secondary uppercase tracking-wider hover:border-medical-primary hover:text-medical-primary transition-all active:scale-95 disabled:opacity-50"
        >
          {reply}
        </button>
      ))}
    </div>
  );
}
