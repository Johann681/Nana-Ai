'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { 
  User, 
  Stethoscope, 
  ShieldAlert, 
  ChevronRight, 
  ChevronLeft,
  CheckCircle2
} from 'lucide-react';

export default function OnboardingPage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    dob: '',
    gender: 'prefer-not-to-say',
    country: '',
    allergies: '',
    chronicConditions: '',
    bloodType: '',
    emergencyName: '',
    emergencyPhone: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const { refreshUser } = useAuth();
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const res = await fetch(`${apiBase}/api/auth/profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          profile: {
            dob: formData.dob,
            gender: formData.gender,
            country: formData.country,
            bloodType: formData.bloodType,
            emergencyContact: {
              name: formData.emergencyName,
              phone: formData.emergencyPhone,
            },
          },
          healthInfo: {
            allergies: formData.allergies.split(',').map(s => s.trim()).filter(s => s !== ''),
            chronicConditions: formData.chronicConditions.split(',').map(s => s.trim()).filter(s => s !== ''),
          },
          onboardingComplete: true,
        }),
      });

      if (!res.ok) throw new Error('Failed to save profile');
      
      await refreshUser();
      router.push('/home');
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const steps = [
    { id: 1, title: 'Identity', icon: User },
    { id: 2, title: 'Medical', icon: Stethoscope },
    { id: 3, title: 'Safety', icon: ShieldAlert },
  ];

  return (
    <div className="min-h-dvh flex items-center justify-center bg-medical-surface px-4 py-12">
      <div className="max-w-2xl w-full bg-white border border-medical-border shadow-enterprise rounded-sm overflow-hidden flex flex-col md:flex-row min-h-[500px] sm:min-h-[600px]">
        
        {/* Sidebar Decor */}
        <div className="w-full md:w-1/3 bg-medical-secondary p-8 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-medical-primary/5 opacity-50" />
          <div className="relative z-10 space-y-8">
            <div className="w-10 h-10 bg-medical-primary flex items-center justify-center rounded-sm">
              <Stethoscope className="w-5 h-5" />
            </div>
            <div className="space-y-2">
              <h1 className="text-xl font-bold">Health Onboarding</h1>
              <p className="text-[11px] text-slate-400 uppercase tracking-widest font-semibold">Clinical Data Node</p>
            </div>
            
            <nav className="space-y-6 pt-8">
              {steps.map((s) => (
                <div key={s.id} className="flex items-center gap-4 group">
                  <div className={`w-8 h-8 rounded-sm border flex items-center justify-center transition-all ${
                    step >= s.id ? 'bg-medical-primary border-medical-primary text-white' : 'border-white/10 text-slate-500'
                  }`}>
                    {step > s.id ? <CheckCircle2 className="w-4 h-4" /> : <s.icon className="w-4 h-4" />}
                  </div>
                  <span className={`text-xs font-bold uppercase tracking-widest ${
                    step >= s.id ? 'text-white' : 'text-slate-500'
                  }`}>
                    {s.title}
                  </span>
                </div>
              ))}
            </nav>
          </div>
          
          <div className="relative z-10 pt-12">
            <p className="text-[10px] text-slate-500 leading-relaxed italic">
              &quot;Your medical data is encrypted and used solely for diagnostic precision.&quot;
            </p>
          </div>
        </div>

        {/* Form Content */}
        <div className="flex-1 p-8 md:p-12 flex flex-col justify-between">
          <div className="animate-fade-in">
            {step === 1 && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-2xl font-bold text-medical-secondary">Personal Identity</h2>
                  <p className="text-sm text-slate-500 mt-1">Start by providing your basic identity details.</p>
                </div>
                <div className="space-y-5">
                  <div className="space-y-1.5">
                    <label className="label-enterprise">Date of Birth</label>
                    <input
                      name="dob"
                      type="date"
                      className="input-enterprise"
                      value={formData.dob}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="label-enterprise">Gender Assignment</label>
                    <select
                      name="gender"
                      className="input-enterprise bg-white"
                      value={formData.gender}
                      onChange={handleChange}
                    >
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                      <option value="prefer-not-to-say">Prefer not to say</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="label-enterprise">Jurisdiction / Country</label>
                    <input
                      name="country"
                      type="text"
                      placeholder="e.g. United Kingdom"
                      className="input-enterprise"
                      value={formData.country}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-2xl font-bold text-medical-secondary">Clinical Profile</h2>
                  <p className="text-sm text-slate-500 mt-1">Help our AI understand your medical background.</p>
                </div>
                <div className="space-y-5">
                  <div className="space-y-1.5">
                    <label className="label-enterprise">Known Allergies</label>
                    <input
                      name="allergies"
                      type="text"
                      placeholder="Peanuts, Penicillin (comma separated)"
                      className="input-enterprise"
                      value={formData.allergies}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="label-enterprise">Chronic Conditions</label>
                    <input
                      name="chronicConditions"
                      type="text"
                      placeholder="Asthma, Diabetes (comma separated)"
                      className="input-enterprise"
                      value={formData.chronicConditions}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="label-enterprise">Blood Type Grouping</label>
                    <input
                      name="bloodType"
                      type="text"
                      placeholder="e.g. O+"
                      className="input-enterprise"
                      value={formData.bloodType}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-2xl font-bold text-medical-secondary">Emergency Protocols</h2>
                  <p className="text-sm text-slate-500 mt-1">Designate a primary contact for urgent situations.</p>
                </div>
                <div className="space-y-5">
                  <div className="space-y-1.5">
                    <label className="label-enterprise">Contact Authority Name</label>
                    <input
                      name="emergencyName"
                      type="text"
                      placeholder="Full Legal Name"
                      className="input-enterprise"
                      value={formData.emergencyName}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="label-enterprise">Direct Phone Link</label>
                    <input
                      name="emergencyPhone"
                      type="text"
                      placeholder="+1 234 567 890"
                      className="input-enterprise"
                      value={formData.emergencyPhone}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="pt-12 flex flex-col gap-4">
            <div className="flex gap-4">
              {step > 1 && (
                <button
                  onClick={prevStep}
                  className="flex-1 btn-secondary flex items-center justify-center gap-2"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Back
                </button>
              )}
              {step < 3 ? (
                <button
                  onClick={nextStep}
                  className="flex-[2] btn-primary flex items-center justify-center gap-2"
                >
                  Continue
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="flex-[2] btn-primary flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      Finalize Profile
                      <ChevronRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              )}
            </div>
            
            <button 
              onClick={() => router.push('/home')} 
              className="text-center text-[10px] font-bold text-slate-400 hover:text-medical-primary uppercase tracking-widest transition-colors py-2"
            >
              Decline Profile Completion (Skip)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
