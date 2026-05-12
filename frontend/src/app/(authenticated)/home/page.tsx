'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { doctors } from '@/data/doctors';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { handleNavigation, handleFeatureNotReady, handleStartConsultation } from '@/actions/uiActions';
import { 
  Users, 
  Activity, 
  Clock, 
  FileCheck, 
  ChevronRight,
  Plus,
  Stethoscope,
  BrainCircuit,
  ShieldCheck
} from 'lucide-react';

export default function HomePage() {
  const router = useRouter();
  const { user } = useAuth();
  const { toast } = useToast();
  const [loadingSpecialistId, setLoadingSpecialistId] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState(4);

  const startConsultation = async (doctorId: string, doctorName: string) => {
    await handleStartConsultation(doctorId, doctorName, router, toast, (isLoading) => {
      setLoadingSpecialistId(isLoading ? doctorId : null);
    });
  };

  const stats = [
    { label: 'Active Sessions', value: '04', icon: Users, color: 'text-medical-primary', bg: 'bg-medical-primary/10' },
    { label: 'Diagnostic Accuracy', value: '98.2%', icon: BrainCircuit, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    { label: 'Pending Reports', value: '12', icon: FileCheck, color: 'text-amber-500', bg: 'bg-amber-500/10' },
    { label: 'System Status', value: 'Optimal', icon: Activity, color: 'text-blue-500', bg: 'bg-blue-500/10' }
  ];

  return (
    <div className="space-y-10 animate-fade-in pb-20">
      
      {/* Header Section */}
      <section className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-2xl font-bold text-medical-secondary mb-1">Health Overview</h1>
          <p className="text-slate-500 text-sm">
            Welcome back, <span className="font-semibold text-medical-secondary">{user?.name}</span>. Your health data is synchronized and secure.
          </p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => handleNavigation('/consultations', router)}
            className="btn-secondary flex items-center gap-2"
          >
            <Clock className="w-4 h-4" />
            History
          </button>
          <button 
            onClick={() => handleNavigation('/consultations', router)}
            className="btn-primary flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            New Assessment
          </button>
        </div>
      </section>

      {/* Analytics Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className="card-enterprise p-6 group hover:-translate-y-1 transition-all">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-2.5 rounded-sm ${stat.bg}`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Live</span>
            </div>
            <div>
              <p className="text-2xl font-bold text-medical-secondary">{stat.value}</p>
              <p className="text-xs font-medium text-slate-500 mt-1">{stat.label}</p>
            </div>
            <div className="mt-4 h-1 w-full bg-slate-100 rounded-full overflow-hidden">
              <div className={`h-full ${stat.color.replace('text-', 'bg-')} w-2/3 transition-all duration-1000`} />
            </div>
          </div>
        ))}
      </section>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column - Network */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-medical-border">
            <div>
              <h2 className="text-sm font-bold text-medical-secondary uppercase tracking-widest flex items-center gap-2">
                <Stethoscope className="w-4 h-4 text-medical-primary" />
                AI Specialist Network
              </h2>
            </div>
            <button 
              onClick={() => handleFeatureNotReady('Specialist Directory', toast)}
              className="text-[10px] font-bold text-medical-primary uppercase tracking-widest hover:underline"
            >
              View All Specialist Nodes
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {doctors.slice(0, visibleCount).map((doc) => (
              <div 
                key={doc.id}
                className="card-enterprise group p-5 flex flex-col cursor-pointer active:scale-[0.99]"
                onClick={() => startConsultation(doc.id, doc.name)}
              >
                <div className="flex justify-between items-start mb-6">
                  <div className="w-14 h-14 bg-medical-surface border border-medical-border flex items-center justify-center text-3xl group-hover:bg-medical-primary/5 transition-colors rounded-sm">
                    {doc.avatar}
                  </div>
                  <div className="flex flex-col items-end gap-1.5">
                    <span className="flex items-center gap-1.5 text-[9px] font-bold text-emerald-600 uppercase tracking-widest bg-emerald-50 px-2 py-1 rounded-sm">
                      <span className="w-1 h-1 bg-emerald-500 rounded-full animate-pulse" />
                      Available
                    </span>
                    <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest border border-slate-100 px-1.5 py-0.5 rounded-sm">v4.2</span>
                  </div>
                </div>

                <div className="space-y-1.5 mb-6">
                  <h4 className="font-bold text-medical-secondary text-sm group-hover:text-medical-primary transition-colors">{doc.name}</h4>
                  <p className="text-[11px] font-bold text-medical-accent uppercase tracking-wider">{doc.title}</p>
                  <p className="text-[12px] text-slate-500 leading-relaxed line-clamp-2">
                    {doc.specialty || `Advanced clinical specialist providing autonomous diagnostics and care planning.`}
                  </p>
                </div>

                <div className="mt-auto pt-4 border-t border-slate-50 flex items-center justify-between">
                  <div className="flex gap-1">
                    <div className="w-1.5 h-1.5 bg-medical-primary rounded-full" />
                    <div className="w-1.5 h-1.5 bg-slate-200 rounded-full" />
                    <div className="w-1.5 h-1.5 bg-slate-200 rounded-full" />
                  </div>
                  <button 
                    disabled={loadingSpecialistId === doc.id}
                    className="flex items-center gap-1.5 text-[10px] font-bold text-medical-secondary uppercase tracking-widest group-hover:text-medical-primary transition-all disabled:opacity-50"
                  >
                    {loadingSpecialistId === doc.id ? 'Connecting...' : 'Consult Specialist'}
                    {!loadingSpecialistId && <ChevronRight className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {visibleCount < doctors.length && (
            <button
              onClick={() => setVisibleCount(prev => prev + 4)}
              className="btn-secondary w-full mt-2 flex items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-widest"
            >
              <Plus className="w-4 h-4" />
              Load More Specialists
            </button>
          )}
        </div>

        {/* Sidebar Widgets - Right 1 Column */}
        <section className="space-y-8">
          {/* Health Score Widget */}
          <div className="card-enterprise p-6 bg-medical-secondary text-white border-none relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-medical-primary/10 rounded-full -mr-16 -mt-16 blur-3xl" />
            <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] mb-6 text-slate-400">Personal Health Index</h4>
            <div className="flex items-center gap-6">
              <div className="relative w-24 h-24 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="6" fill="transparent" className="text-white/10" />
                  <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="6" fill="transparent" className="text-medical-primary" strokeDasharray={251.2} strokeDashoffset={251.2 * (1 - 0.85)} />
                </svg>
                <span className="absolute text-xl font-bold">85</span>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-bold text-emerald-400">+2.4%</p>
                <p className="text-xs text-slate-400">Increase from last month</p>
              </div>
            </div>
            <button 
              onClick={() => handleFeatureNotReady('Detailed Analytics', toast)}
              className="w-full mt-6 py-2.5 bg-white/10 hover:bg-white/15 text-[10px] font-bold uppercase tracking-widest transition-all rounded-sm"
            >
              View Detailed Analytics
            </button>
          </div>

          {/* Quick Recommendations */}
          <div className="space-y-4">
            <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500">AI Recommendations</h4>
            {[
              { title: 'Vitamin D Intake', desc: 'Slight deficiency detected in latest bloodwork.', type: 'Warning' },
              { title: 'Hydration Cycle', desc: 'Your water intake is 20% below optimal levels.', type: 'Action' },
              { title: 'Sleep Optimization', desc: 'Restorative sleep improved by 15% this week.', type: 'Insight' }
            ].map((rec) => (
              <div key={rec.title} className="card-enterprise p-4 bg-white hover:border-medical-accent transition-all">
                <div className="flex justify-between items-start mb-1">
                  <p className="text-xs font-bold text-medical-secondary">{rec.title}</p>
                  <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded-sm uppercase ${
                    rec.type === 'Warning' ? 'bg-amber-50 text-amber-600' : 
                    rec.type === 'Action' ? 'bg-blue-50 text-blue-600' : 'bg-emerald-50 text-emerald-600'
                  }`}>
                    {rec.type}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 leading-snug">{rec.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Compliance Section */}
      <section className="pt-8">
        <div className="card-enterprise p-8 bg-slate-50 border-slate-200 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-white rounded-sm border border-slate-200">
              <ShieldCheck className="w-6 h-6 text-medical-primary" />
            </div>
            <div className="space-y-1">
              <h4 className="text-xs font-bold uppercase tracking-[0.1em] text-medical-secondary">Clinical Protocol & Compliance</h4>
              <p className="text-[11px] text-slate-500 max-w-2xl leading-relaxed">
                Nana Health AI protocols are validated against anonymized clinical datasets. This system is designed for decision support and does not replace emergency medical intervention.
                All data is encrypted under AES-256 standards with strict HIPAA-aligned access controls.
              </p>
            </div>
          </div>
          <button 
            onClick={() => handleFeatureNotReady('Audit Data Logs', toast)}
            className="whitespace-nowrap px-8 py-3 btn-secondary text-[10px] font-bold uppercase tracking-widest"
          >
            Audit Data Logs
          </button>
        </div>
      </section>
    </div>
  );
}