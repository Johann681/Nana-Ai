'use client';

import { useAuth } from '@/context/AuthContext';
import { 
  User, 
  Mail, 
  MapPin, 
  ShieldCheck, 
  HeartPulse, 
  Edit3, 
  Key,
  Database,
  Lock
} from 'lucide-react';

export default function ProfilePage() {
  const { user } = useAuth();

  return (
    <div className="space-y-10 animate-fade-in pb-20">
      <section className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-2xl font-bold text-medical-secondary mb-1">Clinical Profile</h1>
          <p className="text-slate-500 text-sm">
            Manage your verified patient identity and clinical background data.
          </p>
        </div>
        <div className="flex gap-3">
          <button className="btn-secondary flex items-center gap-2">
            <Edit3 className="w-4 h-4" />
            Edit Profile
          </button>
          <button className="btn-primary flex items-center gap-2">
            <Key className="w-4 h-4" />
            Access Keys
          </button>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column - Identity Card */}
        <div className="space-y-8">
          <div className="card-enterprise p-8 bg-white flex flex-col items-center text-center">
            <div className="w-24 h-24 bg-medical-surface border border-medical-border rounded-full flex items-center justify-center mb-6 relative">
              <User className="w-10 h-10 text-slate-400" />
              <div className="absolute bottom-1 right-1 w-6 h-6 bg-emerald-500 border-4 border-white rounded-full" />
            </div>
            <h2 className="text-xl font-bold text-medical-secondary">{user?.name || 'Authorized User'}</h2>
            <p className="text-xs font-bold text-medical-accent uppercase tracking-[0.2em] mt-1">Verified Patient</p>
            
            <div className="w-full mt-10 pt-10 border-t border-slate-50 space-y-4">
              <div className="flex items-center gap-4 text-left">
                <div className="w-8 h-8 bg-slate-50 rounded-sm flex items-center justify-center shrink-0">
                  <Mail className="w-4 h-4 text-slate-400" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Email Address</p>
                  <p className="text-sm font-medium text-slate-700 truncate">{user?.email || '---'}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 text-left">
                <div className="w-8 h-8 bg-slate-50 rounded-sm flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4 text-slate-400" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Regional Location</p>
                  <p className="text-sm font-medium text-slate-700">{user?.profile?.country || 'Global Access'}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="card-enterprise p-6 bg-medical-secondary text-white border-none overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-medical-primary/10 rounded-full -mr-16 -mt-16 blur-3xl" />
            <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-4 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4" />
              Security Status
            </h4>
            <div className="space-y-4 relative z-10">
              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-300">2FA Verification</span>
                <span className="text-[10px] font-bold text-emerald-400 uppercase">Enabled</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-300">Data Redundancy</span>
                <span className="text-[10px] font-bold text-emerald-400 uppercase">Verified</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-300">Last Audit</span>
                <span className="text-[10px] font-bold text-slate-400 uppercase">24h ago</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Clinical Background */}
        <div className="lg:col-span-2 space-y-8">
          <div className="card-enterprise p-8 bg-white">
            <div className="flex items-center justify-between mb-8 border-b border-slate-50 pb-4">
              <h3 className="text-xs font-bold text-medical-secondary uppercase tracking-[0.2em] flex items-center gap-2">
                <HeartPulse className="w-4 h-4 text-medical-primary" />
                Clinical Background
              </h3>
              <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Data Source: Patient Declaration</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-6">
                <div>
                  <label className="label-enterprise">Known Allergies & Sensitivities</label>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {user?.healthInfo?.allergies?.length ? user.healthInfo.allergies.map(a => (
                      <span key={a} className="px-3 py-1.5 bg-medical-error/5 text-medical-error text-[10px] font-bold border border-medical-error/10 rounded-sm uppercase tracking-widest">{a}</span>
                    )) : <span className="text-xs font-medium text-slate-400 italic">No allergies declared.</span>}
                  </div>
                </div>
                <div>
                  <label className="label-enterprise">Chronic Pathologies</label>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {user?.healthInfo?.chronicConditions?.length ? user.healthInfo.chronicConditions.map(c => (
                      <span key={c} className="px-3 py-1.5 bg-medical-accent/5 text-medical-accent text-[10px] font-bold border border-medical-accent/10 rounded-sm uppercase tracking-widest">{c}</span>
                    )) : <span className="text-xs font-medium text-slate-400 italic">No chronic conditions declared.</span>}
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="label-enterprise">Physical Attributes</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3">
                    <div className="p-4 bg-medical-surface border border-medical-border rounded-sm">
                      <p className="text-[9px] font-bold text-slate-400 uppercase mb-1">Blood Type</p>
                      <p className="text-sm font-bold text-medical-secondary">{user?.profile?.bloodType || 'Unknown'}</p>
                    </div>
                    <div className="p-4 bg-medical-surface border border-medical-border rounded-sm">
                      <p className="text-[9px] font-bold text-slate-400 uppercase mb-1">Biological Sex</p>
                      <p className="text-sm font-bold text-medical-secondary capitalize">{user?.profile?.gender || '---'}</p>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="label-enterprise">Authorization Level</label>
                  <div className="mt-3 p-4 bg-emerald-50 border border-emerald-100 rounded-sm flex items-center justify-between">
                    <div>
                      <p className="text-[9px] font-bold text-emerald-600 uppercase mb-0.5">Tier 02 Verification</p>
                      <p className="text-[11px] text-emerald-800 font-medium">Standard Healthcare Node Access</p>
                    </div>
                    <Lock className="w-4 h-4 text-emerald-500" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="card-enterprise p-8 bg-slate-50 border-dashed border-slate-300">
            <div className="flex items-start gap-3 md:gap-6">
              <div className="p-3 bg-white border border-slate-200 rounded-sm">
                <Database className="w-6 h-6 text-slate-400" />
              </div>
              <div className="space-y-2">
                <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-medical-secondary">Clinical Record Protocol</h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Modification of your clinical background data may trigger a re-assessment of existing consultation summaries. Nana Health uses this data to calibrate the diagnostic precision of AI specialist nodes. 
                  Audit ID: <span className="font-mono text-medical-secondary font-bold">NANA-SEC-{user?._id?.slice(-8).toUpperCase()}</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
