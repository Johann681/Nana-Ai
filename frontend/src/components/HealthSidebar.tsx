'use client';

import { ShieldCheck, Activity, AlertCircle, Pill, Thermometer } from 'lucide-react';

interface HealthSidebarProps {
  patientInfo: {
    name: string;
    allergies: string[];
    medications: string[];
    chronicConditions: string[];
    recentSymptoms: string[];
  };
  specialist?: string;
}

export default function HealthSidebar({ patientInfo, specialist }: HealthSidebarProps) {
  return (
    <aside className="hidden lg:flex flex-col w-80 space-y-6 overflow-y-auto pr-2 scrollbar-hide">
      {/* Patient Context Widget */}
      <div className="bg-white border border-medical-border rounded-none p-6 space-y-6 shadow-sm">
        <div className="flex items-center justify-between">
          <h3 className="text-[10px] font-bold text-medical-secondary uppercase tracking-[0.2em] flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-medical-primary" />
            Clinical Context
          </h3>
          <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-none uppercase tracking-widest">Active</span>
        </div>
        
        <div className="space-y-4">
          <div className="p-3 bg-medical-surface border border-medical-border rounded-none">
            <p className="text-[9px] font-bold text-slate-400 uppercase mb-1">Assigned Specialist</p>
            <p className="text-xs font-bold text-medical-primary uppercase tracking-wider">{specialist || 'General Practitioner'}</p>
          </div>
          
          <div className="space-y-3">
            <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
              <AlertCircle className="w-3 h-3 text-red-500" />
              Allergies
            </h4>
            <div className="flex flex-wrap gap-1">
              {patientInfo.allergies.length > 0 ? (
                patientInfo.allergies.map((a, i) => (
                  <span key={i} className="text-[10px] font-medium bg-red-50 text-red-600 px-2 py-0.5 border border-red-100">
                    {a}
                  </span>
                ))
              ) : (
                <span className="text-[10px] text-slate-400 italic">No known allergies</span>
              )}
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
              <Pill className="w-3 h-3 text-blue-500" />
              Active Medications
            </h4>
            <div className="flex flex-col gap-1">
              {patientInfo.medications.length > 0 ? (
                patientInfo.medications.map((m, i) => (
                  <div key={i} className="text-[10px] font-medium text-slate-600 border-l-2 border-medical-primary pl-2 py-1 bg-slate-50">
                    {m}
                  </div>
                ))
              ) : (
                <span className="text-[10px] text-slate-400 italic">None reported</span>
              )}
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
              <Activity className="w-3 h-3 text-orange-500" />
              Chronic Conditions
            </h4>
            <div className="flex flex-col gap-1">
              {patientInfo.chronicConditions.length > 0 ? (
                patientInfo.chronicConditions.map((c, i) => (
                  <div key={i} className="text-[10px] font-medium text-slate-600 bg-slate-50 border border-medical-border px-2 py-1">
                    {c}
                  </div>
                ))
              ) : (
                <span className="text-[10px] text-slate-400 italic">None reported</span>
              )}
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
              <Thermometer className="w-3 h-3 text-emerald-500" />
              Recent Symptoms
            </h4>
            <div className="flex flex-wrap gap-1">
              {patientInfo.recentSymptoms.length > 0 ? (
                patientInfo.recentSymptoms.map((s, i) => (
                  <span key={i} className="text-[10px] font-medium bg-emerald-50 text-emerald-600 px-2 py-0.5 border border-emerald-100">
                    {s}
                  </span>
                ))
              ) : (
                <span className="text-[10px] text-slate-400 italic">None recorded</span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-medical-secondary p-6 text-white border-none relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-medical-primary/10 rounded-full -mr-16 -mt-16 blur-2xl" />
        <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-6 relative z-10 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4" />
          Data Security
        </h3>
        <p className="text-[11px] text-slate-400 leading-relaxed relative z-10">
          This session is end-to-end encrypted. All clinical data is processed on-site for maximum privacy.
        </p>
      </div>
    </aside>
  );
}
