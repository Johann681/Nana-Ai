'use client';

import type { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import {
  Activity,
  FileText,
  Home,
  Loader2,
  LogOut,
  MessageSquare,
  Settings,
  ShieldCheck,
  User,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

type AuthenticatedLayoutProps = {
  children: ReactNode;
};

const navigation = [
  { label: 'Home', href: '/home', icon: Home },
  { label: 'Consultations', href: '/consultations', icon: MessageSquare },
  { label: 'Reports', href: '/reports', icon: FileText },
  { label: 'Profile', href: '/profile', icon: User },
  { label: 'Settings', href: '/settings', icon: Settings },
];

export default function AuthenticatedLayout({ children }: AuthenticatedLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading, logout } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/auth/login');
    }
  }, [loading, router, user]);

  if (loading || !user) {
    return (
      <div className="min-h-dvh bg-medical-surface flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-slate-500">
          <Loader2 className="w-8 h-8 animate-spin text-medical-primary" />
          <p className="text-[10px] font-bold uppercase tracking-[0.2em]">Validating secure session</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-dvh bg-medical-surface flex overflow-hidden">
      <aside className="hidden lg:flex w-72 shrink-0 flex-col border-r border-medical-border bg-white">
        <div className="h-20 px-6 flex items-center gap-3 border-b border-medical-border">
          <div className="w-10 h-10 rounded-sm bg-medical-secondary text-white flex items-center justify-center">
            <ShieldCheck className="w-5 h-5 text-medical-primary" />
          </div>
          <div>
            <p className="text-sm font-bold text-medical-secondary">Nana Health</p>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Clinical Network</p>
          </div>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-3 rounded-sm text-sm font-bold transition-colors ${
                  isActive
                    ? 'bg-medical-primary text-white'
                    : 'text-slate-500 hover:bg-medical-surface hover:text-medical-secondary'
                }`}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-medical-border space-y-4">
          <div className="p-3 bg-medical-surface border border-medical-border rounded-sm">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Signed in as</p>
            <p className="text-sm font-bold text-medical-secondary truncate mt-1">{user.name}</p>
            <p className="text-xs text-slate-500 truncate">{user.email}</p>
          </div>
          <button
            onClick={logout}
            className="w-full btn-secondary flex items-center justify-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      <div className="flex-1 min-w-0 flex flex-col">
        <header className="h-16 lg:h-20 shrink-0 bg-white border-b border-medical-border flex items-center justify-between px-4 sm:px-6 lg:px-10">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Secure Workspace</p>
            <p className="text-sm font-bold text-medical-secondary">Welcome back, {user.name}</p>
          </div>
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-emerald-600 bg-emerald-50 border border-emerald-100 px-3 py-2 rounded-sm">
            <Activity className="w-3.5 h-3.5" />
            Online
          </div>
        </header>

        <main className="flex-1 overflow-y-auto scrollbar-hide px-4 py-6 sm:px-6 lg:px-10 lg:py-8">
          {children}
        </main>

        <nav className="lg:hidden shrink-0 bg-white border-t border-medical-border grid grid-cols-5">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);

            return (
              <Link
                key={item.href}
                href={item.href}
                aria-label={item.label}
                className={`h-16 flex flex-col items-center justify-center gap-1 text-[10px] font-bold transition-colors ${
                  isActive ? 'text-medical-primary' : 'text-slate-400'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
