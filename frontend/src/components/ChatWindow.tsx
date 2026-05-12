'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Message } from '@/types';
import { extractReport, generateReportPdf, sendChatMessage, createConsultation } from '@/lib/api';

import Header from './Header';
import MessageBubble from './MessageBubble';
import InputBar from './InputBar';
import QuickButtons from './QuickButtons';
import ErrorToast from './ErrorToast';
import Onboarding from './Onboarding';
import ProgressIndicator from './ProgressIndicator';
import ReportPreview from './ReportPreview';
import { ConsultationReport } from '@/types';

export default function ChatWindow() {
  const [messages, setMessages]       = useState<Message[]>([]);
  const [inputValue, setInputValue]   = useState('');
  const [isLoading, setIsLoading]     = useState(false);
  const [errorMsg, setErrorMsg]       = useState<string | null>(null);
  const [isOnboarding, setIsOnboarding] = useState(true);
  const [currentStage, setCurrentStage] = useState(1);
  const [isTyping, setIsTyping]       = useState(false);
  const [showReportButton, setShowReportButton] = useState(false);
  const [generatedReport, setGeneratedReport] = useState<ConsultationReport | null>(null);
  const [consultationId, setConsultationId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const currentStageRef = useRef<number>(1);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, generatedReport, scrollToBottom]);

  // Sequentially process message chunks with natural delays
  const processChunks = useCallback(async (chunks: string[], stage: number) => {
    setIsLoading(false);
    
    for (const chunk of chunks) {
      setIsTyping(true);
      const delay = 700 + (chunk.length * 20); 
      await new Promise(resolve => setTimeout(resolve, delay));
      
      const aiMsg: Message = { 
        role: 'assistant', 
        content: chunk,
        stage: stage,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      
      setMessages(prev => [...prev, aiMsg]);
      setIsTyping(false);
      await new Promise(resolve => setTimeout(resolve, 300));
    }

    if (stage === 4) {
      setShowReportButton(true);
    }
  }, []);

  const handleSend = useCallback(async (text?: string) => {
    const content = (text ?? inputValue).trim();
    if (!content || isLoading || isTyping || !consultationId) return;

    setShowReportButton(false);
    setGeneratedReport(null);
    
    const userMsg: Message = { 
      role: 'user', 
      content,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsLoading(true);
    setErrorMsg(null);

    const history = messages.slice(-10);
    const result = await sendChatMessage({ userMessage: content, messages: history, consultationId });

    if (result.error) {
      setIsLoading(false);
      setErrorMsg(result.error);
      return;
    }

    if (result.chunks) {
      if (result.stage) {
        setCurrentStage(result.stage);
        currentStageRef.current = result.stage;
      }
      processChunks(result.chunks, result.stage || currentStageRef.current);
    }
  }, [inputValue, isLoading, isTyping, messages, processChunks, consultationId]);

  const handleStart = async () => {
    setIsOnboarding(false);
    setIsLoading(true);
    
    try {
      // 1. Create a consultation
      const consultation = await createConsultation('GP_ADA', 'Dr. Ada Okafor');
      setConsultationId(consultation._id);

      // 2. Trigger the first message
      const result = await sendChatMessage({ 
        userMessage: "[TRIGGER_START_CONSULTATION]", 
        messages: [],
        consultationId: consultation._id
      });
      
      if (result.chunks) {
        if (result.stage) {
          setCurrentStage(result.stage);
          currentStageRef.current = result.stage;
        }
        processChunks(result.chunks, result.stage || currentStageRef.current);
      }
    } catch {
      setErrorMsg('Failed to start consultation. Please refresh.');
      setIsLoading(false);
    }
  };

  const handleGenerateReport = async () => {
    if (!consultationId) return;
    try {
      setIsLoading(true);
      const report = await extractReport(consultationId);
      setGeneratedReport(report);
      setShowReportButton(false);
      setIsLoading(false);
    } catch {
      setErrorMsg('Failed to generate report. Please try again.');
      setIsLoading(false);
    }
  };

  const handleDownloadPdf = async () => {
    if (!generatedReport || !consultationId) return;
    try {
      setIsLoading(true);
      const blob = await generateReportPdf({ _id: consultationId });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `ada-consultation-${new Date().toISOString().split('T')[0]}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      setIsLoading(false);
    } catch {
      setErrorMsg('Failed to download PDF.');
      setIsLoading(false);
    }
  };

  if (isOnboarding) {
    return <Onboarding onStart={handleStart} />;
  }

  return (
    <div className="flex flex-col h-dvh max-w-2xl mx-auto bg-[#F9F8F6]">
      {errorMsg && <ErrorToast message={errorMsg} onDismiss={() => setErrorMsg(null)} />}
      
      <Header isOnline={!isLoading && !isTyping} />
      <ProgressIndicator stage={currentStage} />

      <main className="flex-1 overflow-y-auto px-4 py-4 space-y-2 scrollbar-hide">
        {messages.map((msg, i) => (
          <MessageBubble key={i} message={msg} />
        ))}
        
        {generatedReport && (
          <ReportPreview 
            report={generatedReport} 
            onDownload={handleDownloadPdf} 
          />
        )}

        {(isLoading || isTyping) && (
          <div className="flex items-center gap-2 px-2 pb-4 msg-animate">
            <span className="text-xs font-bold text-emerald-800 animate-pulse">
              Dr. Ada is typing
            </span>
            <div className="flex gap-1">
              <span className="w-1 h-1 bg-emerald-800 rounded-full typing-dot" />
              <span className="w-1 h-1 bg-emerald-800 rounded-full typing-dot" />
              <span className="w-1 h-1 bg-emerald-800 rounded-full typing-dot" />
            </div>
          </div>
        )}

        {showReportButton && (
          <div className="flex justify-center py-4 msg-animate">
            <button
              onClick={handleGenerateReport}
              className="flex items-center gap-2 px-6 py-3 bg-white border-2 border-emerald-600 text-emerald-700 rounded-2xl text-sm font-bold hover:bg-emerald-50 transition-all shadow-md active:scale-95"
            >
              📄 Generate your consultation report
            </button>
          </div>
        )}

        <div ref={messagesEndRef} />
      </main>

      <section className="sticky bottom-0 bg-[#F9F8F6] pb-safe">
        {messages.length > 0 && !isLoading && !isTyping && (
          <QuickButtons 
            onSelect={(text) => handleSend(text)} 
            disabled={isLoading || isTyping} 
          />
        )}
        <InputBar
          value={inputValue}
          onChange={setInputValue}
          onSend={() => handleSend()}
          isLoading={isLoading || isTyping}
        />
      </section>
    </div>
  );
}
