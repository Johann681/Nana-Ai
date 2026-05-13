'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { ShieldCheck, Lock, Mail, ChevronRight, Activity, Loader2 } from 'lucide-react';

export default function LoginPage() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Identity verification failed');

      login(data);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Login failed';
      setError(message);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-dvh flex items-center justify-center bg-medical-surface px-4 py-12 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full opacity-40 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-medical-primary/5 blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-medical-accent/5 blur-[120px]" />
      </div>

      <div className="max-w-[440px] w-full relative z-10">
        <div className="card-enterprise bg-white p-10 md:p-12 shadow-premium border-medical-border overflow-hidden relative">
          {/* Top Bar Decor */}
          <div className="absolute top-0 left-0 w-full h-1 bg-medical-primary" />
          
          <div className="flex flex-col items-center text-center mb-10">
            <div className="w-16 h-16 bg-medical-secondary text-white rounded-sm flex items-center justify-center mb-6 shadow-sm">
              <ShieldCheck className="w-8 h-8 text-medical-primary" />
            </div>
            <h1 className="text-2xl font-bold text-medical-secondary tracking-tight">Patient Access</h1>
            <p className="mt-2 text-sm text-slate-500">Secure entry to Nana Health clinical network</p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="p-4 bg-medical-error/5 text-medical-error text-[11px] font-bold uppercase tracking-wider rounded-sm border border-medical-error/10 flex items-start gap-3 animate-fade-in">
                <Activity className="w-4 h-4 shrink-0" />
                {error}
              </div>
            )}
            
            <div className="space-y-5">
              <div className="space-y-1.5">
                <label className="label-enterprise">Credential / Email</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    name="email"
                    type="email"
                    required
                    className="input-enterprise pl-11"
                    placeholder="name@organization.com"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <div className="flex justify-between items-center px-0.5">
                  <label className="label-enterprise">Secure Password</label>
                  <Link href="/auth/forgot-password" title="Forgot Password" className="text-[10px] font-bold text-medical-accent hover:text-medical-primary transition-colors uppercase tracking-widest">Recovery</Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    name="password"
                    type="password"
                    required
                    className="input-enterprise pl-11"
                    placeholder="••••••••••••"
                    value={formData.password}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center px-1">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-medical-primary focus:ring-medical-primary border-medical-border rounded-sm cursor-pointer"
              />
              <label htmlFor="remember-me" className="ml-3 block text-xs font-bold text-slate-500 uppercase tracking-widest cursor-pointer select-none">
                Maintain session on this node
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full h-12 flex items-center justify-center gap-3 shadow-sm group"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  Verify Identity
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>

            <div className="text-center pt-6 border-t border-slate-50">
              <p className="text-xs font-medium text-slate-500">
                Unauthorized access is strictly prohibited.
              </p>
              <div className="mt-4">
                <Link href="/auth/register" className="text-[10px] font-bold text-medical-primary hover:text-medical-secondary transition-all uppercase tracking-[0.2em] flex items-center justify-center gap-2">
                  Initialize New Account
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </form>
        </div>
        
        {/* Footer Disclaimer */}
        <div className="mt-8 text-center space-y-4">
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] flex items-center justify-center gap-3">
            <Lock className="w-3.5 h-3.5" />
            HIPAA Compliant Node
          </p>
        </div>
      </div>
    </div>
  );
}
