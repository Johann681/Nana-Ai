'use client';

import { useState, useEffect } from 'react';
import type { LucideIcon } from 'lucide-react';
import { 
  Bell, 
  Moon, 
  Shield, 
  Database, 
  Trash2, 
  ChevronRight,
  Lock,
  Eye,
  Smartphone
} from 'lucide-react';

type ToggleSettingItem = {
  label: string;
  desc: string;
  icon: LucideIcon;
  action: 'toggle';
  value: boolean;
  onToggle: () => void;
};

type LinkSettingItem = {
  label: string;
  desc: string;
  icon: LucideIcon;
  action: 'link';
};

type SettingItem = ToggleSettingItem | LinkSettingItem;

type SettingsSection = {
  title: string;
  items: SettingItem[];
};

export default function SettingsPage() {
  // 1. state
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem('darkMode') === 'true';
  });

  const [highContrast, setHighContrast] = useState(() => {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem('highContrast') === 'true';
  });

  // 2. apply on mount
  useEffect(() => {
    const savedDark = localStorage.getItem('darkMode') === 'true';
    const savedContrast = localStorage.getItem('highContrast') === 'true';
    document.documentElement.classList.toggle('dark', savedDark);
    document.documentElement.classList.toggle('high-contrast', savedContrast);
  }, []);

  // 3. toggles
  const toggleDarkMode = () => {
    setDarkMode(prev => {
      const next = !prev;
      localStorage.setItem('darkMode', String(next));
      document.documentElement.classList.toggle('dark', next);
      return next;
    });
  };

  const toggleHighContrast = () => {
    setHighContrast(prev => {
      const next = !prev;
      localStorage.setItem('highContrast', String(next));
      document.documentElement.classList.toggle('high-contrast', next);
      return next;
    });
  };

  // ... rest of your component stays exactly the same
  const sections: SettingsSection[] = [
    {
      title: 'Preferences',
      items: [
        { label: 'Dark Mode', desc: 'Optimize interface for low-light environments.', icon: Moon, action: 'toggle', value: darkMode, onToggle: toggleDarkMode },
        { label: 'High Contrast', desc: 'Increase accessibility for critical clinical reading.', icon: Eye, action: 'toggle', value: highContrast, onToggle: toggleHighContrast },
      ]
    },
    {
      title: 'Notifications',
      items: [
        { label: 'Diagnostic Alerts', desc: 'Receive immediate updates on report analysis.', icon: Bell, action: 'toggle', value: true, onToggle: () => {} },
        { label: 'Security Notifications', desc: 'Alerts for login attempts and data sync.', icon: Shield, action: 'toggle', value: true, onToggle: () => {} },
      ]
    },
    {
      title: 'Data & Privacy',
      items: [
        { label: 'Sync Mobile Health Data', desc: 'Connect with Apple Health or Google Fit nodes.', icon: Smartphone, action: 'link' },
        { label: 'Clinical Data Export', desc: 'Download your entire health data history.', icon: Database, action: 'link' },
      ]
    }
  ];

  return (
    <div className="space-y-10 animate-fade-in pb-20">
      <section>
        <h1 className="text-2xl font-bold text-medical-secondary mb-1">Account Configuration</h1>
        <p className="text-slate-500 text-sm">
          Manage your interface preferences, security protocols, and data synchronization.
        </p>
      </section>

      <div className="max-w-3xl space-y-8">
        {sections.map((section) => (
          <div key={section.title} className="space-y-4">
            <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em] px-1">{section.title}</h3>
            <div className="card-enterprise bg-white divide-y divide-slate-50 overflow-hidden">
              {section.items.map((item) => (
                <div key={item.label} className="p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4 md:gap-0 group hover:bg-slate-50/50 transition-all">
                  <div className="flex items-center gap-2 md:gap-4">
                    <div className="w-10 h-10 bg-medical-surface border border-medical-border rounded-sm flex items-center justify-center group-hover:bg-white transition-colors">
                      <item.icon className="w-5 h-5 text-slate-400 group-hover:text-medical-primary transition-colors" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-medical-secondary">{item.label}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{item.desc}</p>
                    </div>
                  </div>

                  {item.action === 'toggle' ? (
                    <button
                      onClick={item.onToggle}
                      className={`w-11 h-6 rounded-full relative transition-all duration-300 ${item.value ? 'bg-medical-primary' : 'bg-slate-200'}`}
                    >
                      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-all duration-300 ${item.value ? 'right-1' : 'left-1'}`} />
                    </button>
                  ) : (
                    <ChevronRight className="w-4 h-4 text-slate-300" />
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}

        <div className="pt-10 border-t border-medical-border">
          <div className="card-enterprise p-8 bg-red-50/30 border-red-100 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-white border border-red-100 rounded-sm">
                <Trash2 className="w-6 h-6 text-red-500" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-red-900">Decommission Account</h4>
                <p className="text-xs text-red-600/70 mt-1 max-w-sm">
                  Permanently erase your clinical records and identity data from our secure nodes. This action cannot be reversed.
                </p>
              </div>
            </div>
            <button className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white text-[10px] font-bold uppercase tracking-widest rounded-sm transition-all whitespace-nowrap shadow-sm active:scale-[0.98]">
              Delete Data Node
            </button>
          </div>
        </div>
      </div>

      <div className="pt-20 text-center">
        <p className="text-[10px] font-bold text-slate-300 uppercase tracking-[0.3em] flex items-center justify-center gap-3">
          <Lock className="w-3.5 h-3.5" />
          End-to-End Enterprise Encryption Active
        </p>
      </div>
    </div>
  );
}
