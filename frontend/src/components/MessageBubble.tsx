'use client';

import { Message } from '@/types';
import { ShieldCheck, Activity } from 'lucide-react';

interface MessageBubbleProps {
  message: Message;
}

export default function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === 'user';
  const timestamp = message.timestamp ? new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} w-full group animate-fade-in`}>
      <div className={`flex items-center gap-2 mb-2 px-1 ${isUser ? 'flex-row-reverse' : ''}`}>
        <div className={`w-2 h-2 ${isUser ? 'bg-slate-300' : 'bg-medical-primary'}`} />
        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
          {isUser ? 'Patient' : 'Nana'}
        </span>
        <span className="text-[10px] text-slate-300 font-mono">
          {timestamp}
        </span>
      </div>
      
      <div className={`p-5 border ${isUser ? 'bg-slate-50 border-medical-border text-slate-700' : 'bg-white border-medical-primary/20 text-medical-secondary shadow-sm'} rounded-none max-w-[90%] sm:max-w-[85%] md:max-w-[75%] relative`}>
        {/* Sharp corner accent */}
        {!isUser && <div className="absolute top-0 left-0 w-1 h-full bg-medical-primary" />}
        
        <p className="whitespace-pre-wrap leading-relaxed text-[14px] font-medium">{message.content}</p>
        
        {!isUser && (
          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <div className="flex flex-col">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em]">
                  Validated Output
                </span>
                {message.specialist && (
                  <span className="text-[8px] font-bold text-medical-primary uppercase">
                    Ref: {message.specialist}
                  </span>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-1.5 bg-slate-50 px-2 py-1 border border-slate-100">
              <Activity className="w-3 h-3 text-medical-primary animate-pulse" />
              <span className="text-[9px] font-mono font-bold text-slate-400">STAGE {message.stage || 1}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
