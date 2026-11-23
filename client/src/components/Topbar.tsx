import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Search,
  MessageSquare,
  Bell,
  ChevronDown,
  User,
  Heart,
  ShieldCheck,
  Building2,
  Activity
} from 'lucide-react';
import type { UserRole } from '../types';

interface TopbarProps {
  onSearchChange?: (val: string) => void;
  openAuthModal: (role?: UserRole) => void;
}

export const Topbar: React.FC<TopbarProps> = ({ onSearchChange, openAuthModal }) => {
  const { currentUser, currentRole, notifications } = useApp();
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  const roleUnreadNotifs = notifications.filter(
    n => !n.read && (n.user_role === currentRole || n.user_id === currentUser.id)
  );

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
    if (onSearchChange) onSearchChange(e.target.value);
  };

  return (
    <header className="h-20 bg-[#131418] border-b border-[#22242d] px-6 lg:px-8 flex items-center justify-between gap-4 sticky top-0 z-30">
      {/* Left Welcome Text */}
      <div>
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-extrabold text-white tracking-tight">
            Hello, {currentUser.name}
          </h2>
          <span className="text-lg">👋</span>
        </div>
        <p className="text-xs text-slate-400 mt-0.5">
          Welcome to the BloodConnect AI Coordination & Emergency Platform.
        </p>
      </div>

      {/* Middle Pill Search Bar */}
      <div className="hidden md:flex items-center flex-1 max-w-md mx-6">
        <div className="relative w-full">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchValue}
            onChange={handleSearch}
            placeholder="Search anything (donors, blood groups, hospitals, requests)..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[#1e1f25] border border-[#2a2c36] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#00d2c4] transition-colors"
          />
        </div>
      </div>

      {/* Right User & Utility Icons */}
      <div className="flex items-center gap-4">
        {/* Message / Chat Icon */}
        <button
          className="p-2.5 rounded-xl bg-[#1e1f25] border border-[#2a2c36] text-slate-400 hover:text-white transition-colors"
          title="Direct Consultations"
        >
          <MessageSquare className="w-4 h-4" />
        </button>

        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2.5 rounded-xl bg-[#1e1f25] border border-[#2a2c36] text-slate-400 hover:text-white transition-colors"
          >
            <Bell className="w-4 h-4" />
            {roleUnreadNotifs.length > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-black text-white">
                {roleUnreadNotifs.length}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-3 w-80 sm:w-96 rounded-2xl bg-[#1e1f25] border border-[#2a2c36] shadow-2xl p-4 z-50">
              <div className="flex items-center justify-between pb-2.5 border-b border-[#2a2c36] mb-3">
                <span className="font-bold text-xs uppercase text-white tracking-wider">
                  Targeted Notifications ({roleUnreadNotifs.length})
                </span>
                <span className="text-[10px] text-[#00d2c4] font-semibold">Strict Eligibility Filter</span>
              </div>
              <div className="max-h-72 overflow-y-auto space-y-2 pr-1">
                {notifications.slice(0, 5).map(n => (
                  <div
                    key={n.id}
                    className={`p-3 rounded-xl border text-xs ${
                      n.read
                        ? 'bg-[#17181e] border-[#252731] text-slate-400'
                        : 'bg-[#23242e] border-red-500/30 text-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between font-bold mb-1">
                      <span className="text-red-400">{n.title}</span>
                      <span className="text-[9px] text-slate-500">{n.sent_at}</span>
                    </div>
                    <p className="text-[11px] leading-relaxed text-slate-300">{n.message}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Card Dropdown as in Reference */}
        <div
          onClick={() => openAuthModal()}
          className="flex items-center gap-3 pl-2 cursor-pointer hover:opacity-90 transition-opacity"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-400 flex items-center justify-center text-[#131418] font-black text-sm shadow-md">
            {currentUser.name.charAt(0)}
          </div>
          <div className="hidden sm:block text-left">
            <div className="text-xs font-bold text-white leading-tight">{currentUser.name}</div>
            <div className="text-[10px] text-slate-400 capitalize">{currentRole.replace('_', ' ')}</div>
          </div>
          <ChevronDown className="w-3.5 h-3.5 text-slate-500 hidden sm:block" />
        </div>
      </div>
    </header>
  );
};
