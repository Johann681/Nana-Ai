/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/no-unescaped-entities */
'use client';

import { useState } from 'react';
import { 
  Bell, 
  Moon, 
  Globe, 
  Shield, 
  Users, 
  Database, 
  Mail,
  ChevronRight,
  Lock,
  Smartphone,
  FileText,
  Download
} from 'lucide-react';

// Define types directly in the file to avoid import issues
type ToggleSetting = {
  label: string;
  desc: string;
  icon: any;
  action: 'toggle';
  value: boolean;
  onToggle: () => void;
};

type LinkSetting = {
  label: string;
  desc: string;
  icon: any;
  action: 'link';
  href: string;
};

type ActionSetting = {
  label: string;
  desc: string;
  icon: any;
  action: 'action';
  onClick: () => void;
};

type SettingItem = ToggleSetting | LinkSetting | ActionSetting;

export default function SettingsPage() {
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [autoSave, setAutoSave] = useState(true);
  const [twoFactor, setTwoFactor] = useState(false);

  const settingsData: SettingItem[] = [
    {
      label: "Push Notifications",
      desc: "Receive real-time health alerts and reminders",
      icon: Bell,
      action: "toggle",
      value: notifications,
      onToggle: () => setNotifications(!notifications)
    },
    {
      label: "Dark Mode",
      desc: "Switch to dark theme for better night visibility",
      icon: Moon,
      action: "toggle",
      value: darkMode,
      onToggle: () => setDarkMode(!darkMode)
    },
    {
      label: "Auto-Save Reports",
      desc: "Automatically save consultation reports",
      icon: Database,
      action: "toggle",
      value: autoSave,
      onToggle: () => setAutoSave(!autoSave)
    },
    {
      label: "Two-Factor Authentication",
      desc: "Add an extra layer of security to your account",
      icon: Shield,
      action: "toggle",
      value: twoFactor,
      onToggle: () => setTwoFactor(!twoFactor)
    },
    {
      label: "Language & Region",
      desc: "Change your preferred language and regional settings",
      icon: Globe,
      action: "link",
      href: "/settings/language"
    },
    {
      label: "Privacy Controls",
      desc: "Manage your data privacy and sharing preferences",
      icon: Lock,
      action: "link",
      href: "/settings/privacy"
    },
    {
      label: "Connected Devices",
      desc: "Manage devices connected to your account",
      icon: Smartphone,
      action: "link",
      href: "/settings/devices"
    },
    {
      label: "Data Export",
      desc: "Download all your medical records and data",
      icon: Download,
      action: "action",
      onClick: () => {
        console.log("Exporting data...");
        alert("Your data export will be prepared and emailed to you.");
      }
    },
    {
      label: "Account Sharing",
      desc: "Manage family access and shared accounts",
      icon: Users,
      action: "link",
      href: "/settings/sharing"
    },
    {
      label: "Email Preferences",
      desc: "Choose which emails you receive from Nana",
      icon: Mail,
      action: "link",
      href: "/settings/emails"
    },
    {
      label: "Medical ID",
      desc: "Set up your emergency medical information",
      icon: FileText,
      action: "link",
      href: "/settings/medical-id"
    }
  ];

  // Helper function to check if an item is a toggle
  const isToggleItem = (item: SettingItem): item is ToggleSetting => {
    return item.action === 'toggle';
  };

  // Helper function to check if an item is a link or action
  const isNavigableItem = (item: SettingItem): item is LinkSetting | ActionSetting => {
    return item.action === 'link' || item.action === 'action';
  };

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-medical-secondary">Settings</h1>
        <p className="text-medical-muted mt-1">Manage your account preferences and security</p>
      </div>

      <div className="grid gap-4">
        {settingsData.map((item) => {
          const Icon = item.icon;
          
          return (
            <div
              key={item.label}
              className="flex items-center justify-between p-5 bg-white border border-medical-border rounded-sm hover:shadow-sm transition-all duration-200"
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-medical-primary/10 rounded-sm flex items-center justify-center">
                  <Icon className="w-5 h-5 text-medical-primary" />
                </div>
                <div>
                  <h3 className="font-bold text-medical-secondary mb-1">{item.label}</h3>
                  <p className="text-sm text-medical-muted">{item.desc}</p>
                </div>
              </div>

              <div>
                {isToggleItem(item) && (
                  <button
                    onClick={item.onToggle}
                    className={`w-11 h-6 rounded-full relative transition-all duration-300 ${
                      item.value ? 'bg-medical-primary' : 'bg-slate-200'
                    }`}
                  >
                    <div
                      className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-all duration-300 ${
                        item.value ? 'right-1' : 'left-1'
                      }`}
                    />
                  </button>
                )}

                {isNavigableItem(item) && item.action === 'link' && (
                  <button
                    onClick={() => window.location.href = item.href}
                    className="w-8 h-8 flex items-center justify-center rounded-sm hover:bg-slate-50 transition-colors"
                  >
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </button>
                )}

                {isNavigableItem(item) && item.action === 'action' && (
                  <button
                    onClick={item.onClick}
                    className="w-8 h-8 flex items-center justify-center rounded-sm hover:bg-slate-50 transition-colors"
                  >
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8 p-5 bg-amber-50 border border-amber-200 rounded-sm">
        <div className="flex items-start gap-3">
          <Shield className="w-5 h-5 text-amber-600 mt-0.5" />
          <div>
            <h4 className="font-bold text-amber-800 text-sm">Security Notice</h4>
            <p className="text-xs text-amber-700 mt-1">
              Changes to security settings may require email verification. We'll notify you of any critical changes to your account.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}