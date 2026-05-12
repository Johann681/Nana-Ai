'use client';

import Link from 'next/link';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { 
  Home, 
  MessageSquare, 
  FileText, 
  User, 
  Settings, 
  LogOut, 
  Bell, 
  Plus,
  Activity,
  ShieldCheck,
  Menu,
  X
} from 'lucide-react';

export default function AuthenticatedLayout({ children }: { children: React.ReactNode }) {
  const { user, logout, loading } = useAuth();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navItems = [
    { name: 'Dashboard', href: '/home', icon: Home },
    { name: 'Consultations', href: '/consultations', icon: MessageSquare },
    { name: 'Health Reports', href: '/reports', icon: FileText },
    { name: 'My Profile', href: '/profile', icon: User },
    { name: 'Settings', href: '/settings', icon: Settings },
  ];

  if (loading) return (
    <div className="h-dvh flex items-center justify-center bg-medical-surface">
      <div className="w-8 h-8 border-2 border-medical-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );

  const SidebarContent = () => (
    <>
      <div className="flex items-center gap-3 h-20 px-8 border-b border-white/5">
        <div className="w-9 h-9 bg-medical-primary flex items-center justify-center rounded-sm">
          <ShieldCheck className="w-5 h-5 text-white" />
        </div>
        <div>
          <span className="text-base font-bold tracking-tight block">Nana Health</span>
          <span className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold">Enterprise AI</span>
        </div>
        {/* Close button mobile only */}
        <button
          onClick={() => setSidebarOpen(false)}
          className="ml-auto md:hidden text-slate-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 py-8 px-4 space-y-10">
        <nav className="space-y-1.5">
          <p className="px-4 pb-3 text-[11px] font-bold text-slate-500 uppercase tracking-[0.2em]">Medical Services</p>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 text-sm font-medium transition-all duration-200 group ${
                  isActive 
                    ? 'bg-medical-primary text-white rounded-sm shadow-sm' 
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500 group-hover:text-white'}`} />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="p-6 border-t border-white/5 bg-black/20">
        <div className="flex items-center gap-3 mb-6 px-2">
          <div className="w-10 h-10 bg-slate-800 border border-white/10 flex items-center justify-center text-sm font-bold uppercase rounded-sm">
            {user?.name?.[0] || 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold truncate text-white">{user?.name}</p>
            <p className="text-[10px] text-emerald-500 font-bold uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
              Verified Patient
            </p>
          </div>
        </div>
        <button 
          onClick={logout}
          className="w-full py-2.5 flex items-center justify-center gap-2 text-xs font-bold text-slate-400 hover:text-white hover:bg-red-500/10 border border-white/5 transition-all rounded-sm"
        >
          <LogOut className="w-3.5 h-3.5" />
          Sign Out Securely
        </button>
      </div>
    </>
  );

  return (
    <div className="flex h-dvh bg-medical-surface text-medical-secondary overflow-hidden font-sans">
      
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Desktop always visible, Mobile slide-in */}
      <aside className={`
        fixed md:static inset-y-0 left-0 z-40
        flex flex-col w-72 bg-medical-secondary text-white border-r border-white/10 overflow-y-auto
        transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <SidebarContent />
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 relative flex flex-col overflow-hidden min-w-0">
        
        {/* Top Header */}
        <header className="h-16 md:h-20 bg-white border-b border-medical-border flex items-center justify-between px-4 sm:px-6 md:px-10 z-10 gap-4">
          <div className="flex items-center gap-3 md:gap-6">
            {/* Hamburger - mobile only */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden w-9 h-9 flex items-center justify-center rounded-sm hover:bg-slate-50 border border-medical-border transition-colors"
            >
              <Menu className="w-4 h-4 text-slate-600" />
            </button>

            <div className="hidden sm:flex items-center gap-2.5 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
              <Activity className="w-3.5 h-3.5 text-emerald-500" />
              <span>Core Systems Active</span>
            </div>
            <div className="hidden sm:block h-4 w-[1px] bg-slate-200" />
            <div className="hidden md:block text-[11px] font-bold text-slate-400 uppercase tracking-widest">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </div>
          </div>
          
          <div className="flex items-center gap-3 md:gap-5">
            <button className="relative w-9 h-9 md:w-10 md:h-10 flex items-center justify-center rounded-sm hover:bg-slate-50 border border-medical-border transition-colors">
              <Bell className="w-4 h-4 text-slate-600" />
              <span className="absolute top-2 right-2 md:top-2.5 md:right-2.5 w-2 h-2 bg-medical-error rounded-full border-2 border-white" />
            </button>
            <div className="hidden sm:block h-6 w-[1px] bg-slate-200" />
            <button className="flex items-center gap-1.5 md:gap-2 px-3 md:px-5 py-2 md:py-2.5 bg-medical-primary text-white text-[10px] md:text-xs font-bold uppercase tracking-widest hover:bg-medical-secondary transition-all rounded-sm shadow-sm active:scale-[0.98]">
              <Plus className="w-3.5 h-3.5 md:w-4 md:h-4" />
              <span className="hidden sm:inline">New Consultation</span>
              <span className="sm:hidden">New</span>
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-10 scroll-smooth">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}