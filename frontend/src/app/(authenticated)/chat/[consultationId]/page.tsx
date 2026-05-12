'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getConsultation, sendConsultationMessage } from '@/lib/api';
import { Message } from '@/types';
import MessageBubble from '@/components/MessageBubble';
import InputBar from '@/components/InputBar';
import QuickButtons from '@/components/QuickButtons';
import HealthSidebar from '@/components/HealthSidebar';
import { useAuth } from '@/context/AuthContext';
import { 
  Stethoscope, 
  AlertCircle, 
  Loader2,
  ShieldAlert
} from 'lucide-react';

export default function ChatPage() {
  const { consultationId } = useParams() as { consultationId: string };
  const router = useRouter();
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [activeSpecialist, setActiveSpecialist] = useState<string | undefined>(undefined);
  const [isEmergency, setIsEmergency] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const fetchChatData = useCallback(async () => {
    try {
      const data = await getConsultation(consultationId);
      setMessages(data.messages || []);
      // Determine active specialist from last assistant message if available
      const lastAssistantMsg = [...(data.messages || [])].reverse().find(m => m.role === 'assistant');
      if (lastAssistantMsg?.specialist) setActiveSpecialist(lastAssistantMsg.specialist);
      if (lastAssistantMsg?.isEmergency) setIsEmergency(true);
    } catch (err) {
      console.error('Failed to fetch chat data:', err);
      router.push('/home');
    } finally {
      setIsInitialLoading(false);
    }
  }, [consultationId, router]);

  useEffect(() => {
    fetchChatData();
  }, [fetchChatData]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!inputValue.trim() || isLoading || isEmergency) return;

    const userMessage: Message = {
      role: 'user',
      content: inputValue,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await sendConsultationMessage(consultationId, userMessage.content);
      
      const assistantMessage: Message = {
        role: 'assistant',
        content: response.chunks ? response.chunks.join(' ') : 'No response from AI.',
        timestamp: new Date().toISOString(),
        stage: response.stage,
        isEmergency: response.isEmergency,
        specialist: response.specialist
      };

      setMessages((prev) => [...prev, assistantMessage]);
      
      if (response.specialist) setActiveSpecialist(response.specialist);
      if (response.isEmergency) setIsEmergency(true);
      
    } catch (err) {
      console.error('Failed to send message:', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isInitialLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100dvh-200px)] space-y-4">
        <Loader2 className="w-8 h-8 text-medical-primary animate-spin" />
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Establishing Secure Clinical Node...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100dvh-120px)] lg:h-[calc(100dvh-100px)] relative animate-fade-in">
      {isEmergency && (
        <div className="mb-6 bg-red-600 text-white p-4 flex items-center gap-4 animate-bounce-subtle border-l-8 border-red-800">
          <ShieldAlert className="w-8 h-8 shrink-0" />
          <div>
            <h3 className="text-sm font-bold uppercase tracking-widest">Urgent Medical Alert</h3>
            <p className="text-xs opacity-90">An emergency condition has been detected. Please contact emergency services immediately. Chat is restricted for safety.</p>
          </div>
        </div>
      )}

      <div className="flex flex-1 overflow-hidden gap-4 md:gap-8">
        {/* Main Conversation Area */}
        <div className="flex-1 flex flex-col bg-white border border-medical-border rounded-none shadow-sm overflow-hidden">
          {/* Chat Header */}
          <header className="px-6 py-4 border-b border-medical-border flex items-center justify-between bg-slate-50/50">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-medical-secondary text-white rounded-none flex items-center justify-center text-xl font-bold border border-medical-primary/20">
                AI
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-sm font-bold text-medical-secondary uppercase tracking-wider">MedCore AI Assistant</h2>
                  <span className={`w-1.5 h-1.5 ${isEmergency ? 'bg-red-500' : 'bg-emerald-500'} rounded-full animate-pulse`} />
                </div>
                <p className="text-[10px] font-bold text-medical-primary uppercase tracking-[0.2em]">
                  {activeSpecialist || 'General Practitioner'} · Clinical Mode
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="px-3 py-1 bg-medical-surface border border-medical-border text-[9px] font-bold text-slate-500 uppercase tracking-widest">
                Session: {consultationId.slice(-6).toUpperCase()}
              </div>
            </div>
          </header>

          {/* Messages Container */}
          <div 
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-6 space-y-8 scroll-smooth scrollbar-hide"
          >
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-6 max-w-md mx-auto">
                <div className="w-16 h-16 bg-medical-surface rounded-none border border-medical-border flex items-center justify-center">
                  <Stethoscope className="w-8 h-8 text-medical-primary opacity-20" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-medical-secondary uppercase tracking-widest mb-2">Diagnostic Interface Ready</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    The local clinical node is active. Please describe your symptoms or health concerns for the specialist router to begin analysis.
                  </p>
                </div>
              </div>
            ) : (
              <>
                {messages.map((msg, idx) => (
                  <MessageBubble key={idx} message={msg} />
                ))}
                {isLoading && (
                  <div className="flex gap-4 animate-fade-in">
                    <div className="w-10 h-10 bg-medical-secondary rounded-none flex items-center justify-center text-white shrink-0">
                      AI
                    </div>
                    <div className="space-y-2 max-w-[80%]">
                      <div className="bg-slate-50 border border-medical-border p-4 rounded-none flex items-center gap-3">
                        <Loader2 className="w-4 h-4 text-medical-primary animate-spin" />
                        <span className="text-[11px] font-bold text-medical-primary uppercase tracking-[0.2em]">Consulting Local LLM Node...</span>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Input Footer */}
          <footer className="p-6 border-t border-medical-border bg-slate-50/30">
            {!isEmergency ? (
              <>
                <QuickButtons onSelect={(text) => setInputValue(text)} disabled={isLoading} />
                <InputBar 
                  value={inputValue} 
                  onChange={setInputValue} 
                  onSend={handleSend} 
                  isLoading={isLoading} 
                />
              </>
            ) : (
              <div className="flex items-center justify-center gap-3 p-4 bg-red-50 border border-red-100 text-red-600">
                <AlertCircle className="w-4 h-4" />
                <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Input Restricted: Emergency Mode Active</span>
              </div>
            )}
          </footer>
        </div>

        {/* Sidebar Context */}
        <HealthSidebar 
          patientInfo={{
            name: user?.name || 'Patient',
            allergies: user?.healthInfo?.allergies || [],
            medications: user?.healthInfo?.medications || [],
            chronicConditions: user?.healthInfo?.chronicConditions || [],
            recentSymptoms: user?.healthInfo?.recentSymptoms || [],
          }} 
          specialist={activeSpecialist}
        />
      </div>
    </div>
  );
}
