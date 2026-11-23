import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Heart,
  LayoutDashboard,
  Calendar,
  Building2,
  Activity,
  BarChart3,
  Sparkles,
  HelpCircle,
  Settings,
  LogOut,
  ChevronRight,
  ShieldCheck,
  AlertTriangle
} from 'lucide-react';
import type { UserRole } from '../types';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  openAuthModal: (role?: UserRole) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, openAuthModal }) => {
  const { currentRole, loginAs, logout, notifications } = useApp();

  const unreadAlerts = notifications.filter(n => !n.read && n.type === 'Emergency Blood Request').length;

  return (
    <aside className="w-64 shrink-0 bg-[#14151a] border-r border-[#22242d] flex flex-col justify-between p-5 min-h-screen text-slate-300">
      <div className="space-y-6">
        {/* Brand / Logo exactly as LifeCare style */}
        <div
          onClick={() => setActiveTab('landing')}
          className="flex items-center gap-2.5 cursor-pointer px-2 group"
        >
          <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-gradient-to-tr from-red-600 to-rose-500 text-white shadow-md shadow-red-500/20">
            <Heart className="w-4 h-4 fill-white" />
          </div>
          <div className="flex items-center gap-1 font-extrabold text-xl tracking-tight text-white">
            <span>BloodConnect</span>
            <span className="text-[#00d2c4] text-xs font-black uppercase tracking-wider px-1.5 py-0.5 rounded-md bg-[#00d2c4]/10 border border-[#00d2c4]/30">
              AI
            </span>
          </div>
        </div>

        {/* Section: GENERAL */}
        <div className="space-y-1.5">
          <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-500">
            General
          </p>

          <button
            onClick={() => setActiveTab('donor')}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'donor'
                ? 'bg-[#00d2c4] text-[#0d1217] shadow-lg shadow-[#00d2c4]/20'
                : 'text-slate-400 hover:text-white hover:bg-[#1e1f26]'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <LayoutDashboard className="w-4 h-4" />
              <span>Donor Dashboard</span>
            </div>
          </button>

          <button
            onClick={() => setActiveTab('hospital')}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'hospital'
                ? 'bg-[#00d2c4] text-[#0d1217] shadow-lg shadow-[#00d2c4]/20'
                : 'text-slate-400 hover:text-white hover:bg-[#1e1f26]'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Building2 className="w-4 h-4" />
              <span>Hospital Desk</span>
            </div>
            {unreadAlerts > 0 && (
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                activeTab === 'hospital' ? 'bg-[#0d1217] text-[#00d2c4]' : 'bg-red-500 text-white'
              }`}>
                {unreadAlerts}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('blood_bank')}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'blood_bank'
                ? 'bg-[#00d2c4] text-[#0d1217] shadow-lg shadow-[#00d2c4]/20'
                : 'text-slate-400 hover:text-white hover:bg-[#1e1f26]'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Activity className="w-4 h-4" />
              <span>Blood Bank Inventory</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 opacity-40" />
          </button>

          <button
            onClick={() => setActiveTab('landing')}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'landing'
                ? 'bg-[#00d2c4] text-[#0d1217] shadow-lg shadow-[#00d2c4]/20'
                : 'text-slate-400 hover:text-white hover:bg-[#1e1f26]'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Calendar className="w-4 h-4" />
              <span>Landing Overview</span>
            </div>
          </button>
        </div>

        {/* Section: REPORTS & AI */}
        <div className="space-y-1.5 pt-2">
          <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-500">
            Reports & AI
          </p>

          <button
            onClick={() => setActiveTab('ai_prediction')}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'ai_prediction'
                ? 'bg-[#00d2c4] text-[#0d1217] shadow-lg shadow-[#00d2c4]/20'
                : 'text-slate-400 hover:text-white hover:bg-[#1e1f26]'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>AI Shortage Forecast</span>
            </div>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          </button>

          <button
            onClick={() => setActiveTab('admin')}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'admin'
                ? 'bg-[#00d2c4] text-[#0d1217] shadow-lg shadow-[#00d2c4]/20'
                : 'text-slate-400 hover:text-white hover:bg-[#1e1f26]'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <BarChart3 className="w-4 h-4" />
              <span>Admin & Analytics</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 opacity-40" />
          </button>
        </div>

        {/* Section: SETTINGS & QUICK ROLE SWITCH */}
        <div className="space-y-1.5 pt-2">
          <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-500">
            Role Switcher
          </p>

          <div className="p-2.5 rounded-2xl bg-[#1a1c22] border border-[#272933] space-y-1">
            {(['donor', 'hospital', 'blood_bank', 'admin'] as UserRole[]).map(r => (
              <button
                key={r}
                onClick={() => {
                  loginAs(r);
                  setActiveTab(r === 'blood_bank' ? 'blood_bank' : r);
                }}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-[11px] font-semibold capitalize transition-all ${
                  currentRole === r
                    ? 'bg-[#292c36] text-[#00d2c4] font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <span>{r.replace('_', ' ')}</span>
                {currentRole === r && <span className="w-1.5 h-1.5 rounded-full bg-[#00d2c4]"></span>}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Footer Options */}
      <div className="pt-4 border-t border-[#22242d] space-y-1">
        <button
          onClick={() => openAuthModal()}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-[#1e1f26] transition-colors"
        >
          <Settings className="w-4 h-4" />
          <span>Switch Account / Sign In</span>
        </button>

        <button
          onClick={logout}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-red-400 hover:text-red-300 hover:bg-red-950/20 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Log Out</span>
        </button>
      </div>
    </aside>
  );
};
