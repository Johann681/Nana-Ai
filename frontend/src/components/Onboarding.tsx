'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';

interface OnboardingProps {
  onStart: () => void;
}

export default function Onboarding({ onStart }: OnboardingProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { user, updateUser } = useAuth();

  const completeOnboarding = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/auth/profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          onboardingComplete: true,
          profile: {
            hasCompletedOnboarding: true,
            onboardedAt: new Date().toISOString()
          }
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to complete intake');
      }

      await response.json();
      if (updateUser && user) {
        updateUser({ ...user, onboardingComplete: true });
      }
      onStart();
      
    } catch (error: unknown) {
      console.error('Intake error:', error);
      alert('Intake synchronization failed. Please retry.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80dvh] px-6 text-center animate-fade-in">
      <div className="max-w-2xl w-full card-enterprise p-12 bg-white space-y-10">
        <div className="space-y-4">
          <div className="w-12 h-12 bg-blue-600 mx-auto flex items-center justify-center text-xl font-bold text-white">
            N
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight uppercase">Medical Intake Portal</h1>
          <p className="text-slate-500 text-sm max-w-md mx-auto leading-relaxed">
            Authorized node initialization required. This process synchronizes your health data with our clinical intelligence network.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-1 w-full border border-slate-100">
          {[
            { id: '01', title: 'Data Privacy', desc: 'Enterprise-grade encryption (HIPAA compliant)' },
            { id: '02', title: 'AI Validation', desc: 'Evidence-based clinical datasets' },
            { id: '03', title: 'Network Link', desc: 'Instant connection to specialist nodes' },
          ].map((step) => (
            <div key={step.id} className="flex items-center gap-3 md:gap-6 p-6 bg-slate-50/50 text-left hover:bg-white transition-colors border-b border-slate-100 last:border-none">
              <span className="text-xs font-bold text-blue-600">{step.id}</span>
              <div>
                <p className="font-bold text-xs text-slate-900 uppercase tracking-widest">{step.title}</p>
                <p className="text-[11px] text-slate-500">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="pt-6">
          <button
            onClick={completeOnboarding}
            disabled={isLoading}
            className="btn-primary w-full max-w-xs text-[10px] uppercase tracking-[0.2em]"
          >
            {isLoading ? 'Synchronizing...' : 'Initialize Intake Session'}
          </button>
          
          <div className="mt-8 flex items-center justify-center gap-4 opacity-40">
            <div className="h-[1px] w-8 bg-slate-400" />
            <span className="text-[8px] font-bold uppercase tracking-[0.3em]">Secure Connection</span>
            <div className="h-[1px] w-8 bg-slate-400" />
          </div>
        </div>
      </div>
    </div>
  );
}