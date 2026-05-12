'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getConsultations } from '@/lib/api';
import { Consultation } from '@/types';
import { useToast } from '@/context/ToastContext';
import { handleNavigation, handleFeatureNotReady } from '@/actions/uiActions';
import { 
  MessageSquare, 
  ChevronRight, 
  Stethoscope, 
  History,
  Clock,
  MoreVertical
} from 'lucide-react';

export default function ConsultationsPage() {
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { toast } = useToast();

  const fetchConsultations = useCallback(async () => {
    try {
      const data = await getConsultations();
      setConsultations(data);
    } catch (err) {
      console.error(err);
      toast('Failed to load consultations', 'error');
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchConsultations();
  }, [fetchConsultations]);

  if (isLoading) return (
    <div className="flex flex-col items-center justify-center py-32 space-y-4">
      <div className="w-8 h-8 border-2 border-medical-primary border-t-transparent rounded-full animate-spin" />
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Retrieving Session History...</p>
    </div>
  );

  return (
    <div className="space-y-10 animate-fade-in pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-2xl font-bold text-medical-secondary mb-1">Session History</h1>
          <p className="text-slate-500 text-sm">
            Review and resume your previous clinical discussions and medical assessments.
          </p>
        </div>
        <button 
          onClick={() => handleNavigation('/home', router)}
          className="btn-primary flex items-center gap-2"
        >
          <MessageSquare className="w-4 h-4" />
          New Consultation
        </button>
      </div>

      <div className="grid gap-4">
        {consultations.length === 0 ? (
          <div className="card-enterprise p-24 text-center bg-white flex flex-col items-center">
            <div className="w-20 h-20 bg-medical-surface flex items-center justify-center rounded-full mb-8">
              <MessageSquare className="w-10 h-10 text-slate-300" />
            </div>
            <h3 className="text-base font-bold text-medical-secondary mb-2">No Active Sessions Found</h3>
            <p className="text-sm text-slate-500 max-w-sm mx-auto leading-relaxed">
              You haven&apos;t initiated any clinical consultations yet. Connect with a specialist node to begin your health journey.
            </p>
            <button 
              onClick={() => handleNavigation('/home', router)}
              className="mt-8 btn-primary"
            >
              Browse Specialist Network
            </button>
          </div>
        ) : (
          <div className="grid gap-4">
            {consultations.map((c) => (
              <Link 
                key={c._id} 
                href={`/chat/${c._id}`}
                className="card-enterprise group p-6 flex flex-col md:flex-row items-center justify-between gap-6 hover:border-medical-primary transition-all active:scale-[0.99]"
              >
                <div className="flex items-center gap-6 w-full md:w-auto">
                  <div className="w-14 h-14 bg-medical-surface border border-medical-border flex items-center justify-center text-3xl group-hover:bg-medical-primary/5 transition-colors rounded-sm shrink-0">
                    <Stethoscope className="w-6 h-6 text-medical-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <h4 className="font-bold text-medical-secondary text-base group-hover:text-medical-primary transition-colors truncate">
                        {c.title || 'Clinical Consultation'}
                      </h4>
                      <span className={`text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-sm ${
                        c.status === 'completed' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-blue-50 text-blue-600 border border-blue-100'
                      }`}>
                        {c.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-[11px] text-slate-400 font-medium">
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" />
                        {new Date(c.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                      <span className="w-1 h-1 bg-slate-300 rounded-full" />
                      <span className="flex items-center gap-1.5 text-medical-accent font-bold uppercase tracking-wider">
                        Dr. {c.doctorName}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 pt-4 md:pt-0 border-slate-50">
                  <div className="flex items-center gap-6">
                    <div className="hidden lg:flex flex-col items-end">
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Last Update</p>
                      <p className="text-[11px] font-bold text-slate-600">Recent</p>
                    </div>
                    <div className="h-8 w-[1px] bg-slate-100 hidden lg:block" />
                    <div className="flex -space-x-2">
                      <div className="w-7 h-7 bg-slate-50 border-2 border-white rounded-full flex items-center justify-center text-[10px] font-bold text-slate-400">
                        {c.messages.length}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={(e) => { e.preventDefault(); handleFeatureNotReady('Session Options', toast); }}
                      className="p-2 hover:bg-slate-50 rounded-sm transition-colors text-slate-400"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>
                    <div className="w-8 h-8 bg-medical-primary text-white flex items-center justify-center rounded-sm shadow-sm group-hover:translate-x-1 transition-transform">
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* History Insight */}
      <div className="card-enterprise p-8 bg-medical-secondary text-white border-none relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-medical-primary/20 rounded-full -mr-32 -mt-32 blur-3xl opacity-50" />
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-6">
            <div className="p-4 bg-white/10 rounded-sm">
              <History className="w-8 h-8 text-white" />
            </div>
            <div>
              <h4 className="text-base font-bold">Comprehensive Medical Timeline</h4>
              <p className="text-sm text-slate-400 mt-1 max-w-xl">
                Your consultation history provides a longitudinal view of your health progress. AI specialists use this history to provide more personalized and accurate diagnostic insights.
              </p>
            </div>
          </div>
          <button 
            onClick={() => handleFeatureNotReady('Timeline Download', toast)}
            className="btn-primary whitespace-nowrap bg-white text-medical-secondary hover:bg-slate-100 border-none shadow-none"
          >
            Download Full Timeline
          </button>
        </div>
      </div>
    </div>
  );
}
