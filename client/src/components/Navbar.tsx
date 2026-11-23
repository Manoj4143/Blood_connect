import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Activity,
  Heart,
  Building2,
  ShieldAlert,
  Bell,
  Sun,
  Moon,
  LogOut,
  Menu,
  X,
  Search,
  UserCheck
} from 'lucide-react';
import { UserRole } from '../types';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  openAuthModal: (role?: UserRole) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab, openAuthModal }) => {
  const { currentRole, loginAs, logout, isLoggedIn, currentUser, notifications, darkMode, toggleDarkMode } = useApp();
  const [showNotifications, setShowNotifications] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const roleUnreadNotifs = notifications.filter(
    n => !n.read && (n.user_role === currentRole || n.user_id === currentUser.id)
  );

  const roleColors: Record<UserRole, string> = {
    donor: 'bg-red-50 text-red-700 border-red-200 dark:bg-red-950/40 dark:text-red-300 dark:border-red-800',
    hospital: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800',
    blood_bank: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800',
    admin: 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-800',
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Tagline */}
          <div
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => setActiveTab('landing')}
          >
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-red-600 to-rose-500 text-white shadow-md shadow-red-500/20 group-hover:scale-105 transition-transform">
              <Heart className="w-5 h-5 fill-white" />
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500 border-2 border-white dark:border-slate-900"></span>
              </span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-xl tracking-tight text-slate-900 dark:text-white">
                  Blood<span className="text-red-600">Connect</span>
                </span>
                <span className="text-[11px] font-bold px-1.5 py-0.5 rounded-md bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-300 border border-red-300 dark:border-red-800">
                  AI
                </span>
              </div>
              <p className="hidden md:block text-[10px] text-slate-500 dark:text-slate-400 tracking-tight">
                Predictive Blood & Donor Coordination
              </p>
            </div>
          </div>

          {/* Center Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            <button
              onClick={() => setActiveTab('landing')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'landing'
                  ? 'text-red-600 bg-red-50 dark:bg-red-950/40 dark:text-red-400 font-semibold'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              Home
            </button>

            <button
              onClick={() => setActiveTab('donor')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'donor'
                  ? 'text-red-600 bg-red-50 dark:bg-red-950/40 dark:text-red-400 font-semibold'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Heart className="w-4 h-4 text-red-500" />
              Donor Dashboard
            </button>

            <button
              onClick={() => setActiveTab('hospital')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'hospital'
                  ? 'text-red-600 bg-red-50 dark:bg-red-950/40 dark:text-red-400 font-semibold'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Building2 className="w-4 h-4 text-blue-500" />
              Hospital Desk
            </button>

            <button
              onClick={() => setActiveTab('blood_bank')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'blood_bank'
                  ? 'text-red-600 bg-red-50 dark:bg-red-950/40 dark:text-red-400 font-semibold'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Activity className="w-4 h-4 text-amber-500" />
              Blood Bank
            </button>

            <button
              onClick={() => setActiveTab('admin')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'admin'
                  ? 'text-red-600 bg-red-50 dark:bg-red-950/40 dark:text-red-400 font-semibold'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <ShieldAlert className="w-4 h-4 text-purple-500" />
              Admin & Analytics
            </button>

            <button
              onClick={() => setActiveTab('ai_prediction')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'ai_prediction'
                  ? 'text-red-600 bg-red-50 dark:bg-red-950/40 dark:text-red-400 font-semibold'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
              AI Forecast
            </button>
          </nav>

          {/* Right Action Icons & Role Switcher */}
          <div className="flex items-center gap-2.5">
            {/* Quick Role Switcher Pill for Demo Ease */}
            <div className="hidden sm:flex items-center bg-slate-100 dark:bg-slate-800 rounded-lg p-0.5 border border-slate-200 dark:border-slate-700">
              {(['donor', 'hospital', 'blood_bank', 'admin'] as UserRole[]).map(role => (
                <button
                  key={role}
                  onClick={() => {
                    loginAs(role);
                    setActiveTab(role === 'blood_bank' ? 'blood_bank' : role);
                  }}
                  className={`px-2 py-1 rounded-md text-xs font-medium capitalize transition-all ${
                    currentRole === role
                      ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs font-semibold'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  {role.replace('_', ' ')}
                </button>
              ))}
            </div>

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              aria-label="Toggle theme"
              className="p-2 rounded-lg text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Notifications Popover */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 rounded-lg text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <Bell className="w-4 h-4" />
                {roleUnreadNotifs.length > 0 && (
                  <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[9px] font-bold text-white ring-2 ring-white dark:ring-slate-900 animate-bounce">
                    {roleUnreadNotifs.length}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-900/10 p-3 z-50">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800 mb-2">
                    <span className="font-semibold text-xs text-slate-900 dark:text-white uppercase tracking-wider">
                      Targeted Notifications ({roleUnreadNotifs.length} New)
                    </span>
                    <span className="text-[10px] text-slate-400">Strict Eligibility Filter</span>
                  </div>
                  <div className="max-h-72 overflow-y-auto space-y-2">
                    {notifications.slice(0, 5).map(n => (
                      <div
                        key={n.id}
                        className={`p-2.5 rounded-xl border text-xs transition-colors ${
                          n.read
                            ? 'bg-slate-50/50 dark:bg-slate-800/40 border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                            : 'bg-red-50/80 dark:bg-red-950/30 border-red-200 dark:border-red-900/50 text-slate-800 dark:text-slate-200 font-medium'
                        }`}
                      >
                        <div className="flex items-center justify-between font-semibold mb-1">
                          <span className="text-red-600 dark:text-red-400">{n.title}</span>
                          <span className="text-[10px] text-slate-400 font-normal">{n.sent_at}</span>
                        </div>
                        <p className="text-[11px] leading-relaxed text-slate-600 dark:text-slate-300">
                          {n.message}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Auth Button or User Profile Badge */}
            {isLoggedIn ? (
              <div className="flex items-center gap-2">
                <div className={`hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-full border text-xs font-medium ${roleColors[currentRole]}`}>
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span className="truncate max-w-[130px]">{currentUser.name}</span>
                </div>
                <button
                  onClick={logout}
                  title="Logout"
                  className="p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => openAuthModal()}
                className="px-3.5 py-1.5 rounded-lg bg-red-600 text-white font-semibold text-xs shadow-md shadow-red-600/20 hover:bg-red-700 transition-all"
              >
                Sign In
              </button>
            )}

            {/* Mobile menu trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu drop */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-3 border-t border-slate-200 dark:border-slate-800 flex flex-col gap-1">
            <button
              onClick={() => { setActiveTab('landing'); setMobileMenuOpen(false); }}
              className="text-left px-3 py-2 rounded-lg text-sm text-slate-700 dark:text-slate-300 font-medium"
            >
              Home
            </button>
            <button
              onClick={() => { setActiveTab('donor'); setMobileMenuOpen(false); }}
              className="text-left px-3 py-2 rounded-lg text-sm text-slate-700 dark:text-slate-300 font-medium"
            >
              Donor Dashboard
            </button>
            <button
              onClick={() => { setActiveTab('hospital'); setMobileMenuOpen(false); }}
              className="text-left px-3 py-2 rounded-lg text-sm text-slate-700 dark:text-slate-300 font-medium"
            >
              Hospital Desk
            </button>
            <button
              onClick={() => { setActiveTab('blood_bank'); setMobileMenuOpen(false); }}
              className="text-left px-3 py-2 rounded-lg text-sm text-slate-700 dark:text-slate-300 font-medium"
            >
              Blood Bank Inventory
            </button>
            <button
              onClick={() => { setActiveTab('admin'); setMobileMenuOpen(false); }}
              className="text-left px-3 py-2 rounded-lg text-sm text-slate-700 dark:text-slate-300 font-medium"
            >
              Admin & Analytics
            </button>
            <button
              onClick={() => { setActiveTab('ai_prediction'); setMobileMenuOpen(false); }}
              className="text-left px-3 py-2 rounded-lg text-sm text-red-600 font-semibold"
            >
              AI Shortage Prediction
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
