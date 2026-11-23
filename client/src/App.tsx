import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { LandingPage } from './components/LandingPage';
import { DonorDashboard } from './components/DonorDashboard';
import { BloodBankDashboard } from './components/BloodBankDashboard';
import { HospitalDashboard } from './components/HospitalDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { AIShortagePredictionModule } from './components/AIShortagePredictionModule';
import { AuthModal } from './components/AuthModal';
import { UserRole } from './types';
import { Heart, Activity, Building2, ShieldAlert, Sparkles } from 'lucide-react';

const MainAppContent: React.FC = () => {
  const { currentRole, loginAs, logout } = useApp();
  const [activeTab, setActiveTab] = useState<string>('landing');
  const [authModalOpen, setAuthModalOpen] = useState<boolean>(false);
  const [authModalRole, setAuthModalRole] = useState<UserRole>('donor');

  const openAuthModal = (role: UserRole = 'donor') => {
    setAuthModalRole(role);
    setAuthModalOpen(true);
  };

  const handleAuthSuccess = (role: UserRole) => {
    setActiveTab(role === 'blood_bank' ? 'blood_bank' : role);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors flex flex-col font-sans">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        openAuthModal={openAuthModal}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {activeTab === 'landing' && (
          <LandingPage
            onNavigateRole={role => {
              loginAs(role);
              setActiveTab(role === 'blood_bank' ? 'blood_bank' : role);
            }}
            openAuthModal={openAuthModal}
          />
        )}

        {activeTab === 'donor' && <DonorDashboard />}
        {activeTab === 'hospital' && <HospitalDashboard />}
        {activeTab === 'blood_bank' && <BloodBankDashboard />}
        {activeTab === 'admin' && <AdminDashboard />}
        {activeTab === 'ai_prediction' && <AIShortagePredictionModule />}
      </main>

      {/* Role Switcher Floating Pill for Demo Ease on Tablet / Mobile */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-3 py-2 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl flex items-center gap-1 sm:hidden">
        <button
          onClick={() => { loginAs('donor'); setActiveTab('donor'); }}
          className={`p-2 rounded-xl text-xs font-bold ${activeTab === 'donor' ? 'bg-red-600 text-white' : 'text-slate-600'}`}
        >
          <Heart className="w-4 h-4" />
        </button>
        <button
          onClick={() => { loginAs('hospital'); setActiveTab('hospital'); }}
          className={`p-2 rounded-xl text-xs font-bold ${activeTab === 'hospital' ? 'bg-blue-600 text-white' : 'text-slate-600'}`}
        >
          <Building2 className="w-4 h-4" />
        </button>
        <button
          onClick={() => { loginAs('blood_bank'); setActiveTab('blood_bank'); }}
          className={`p-2 rounded-xl text-xs font-bold ${activeTab === 'blood_bank' ? 'bg-amber-600 text-white' : 'text-slate-600'}`}
        >
          <Activity className="w-4 h-4" />
        </button>
        <button
          onClick={() => { loginAs('admin'); setActiveTab('admin'); }}
          className={`p-2 rounded-xl text-xs font-bold ${activeTab === 'admin' ? 'bg-purple-600 text-white' : 'text-slate-600'}`}
        >
          <ShieldAlert className="w-4 h-4" />
        </button>
        <button
          onClick={() => setActiveTab('ai_prediction')}
          className={`p-2 rounded-xl text-xs font-bold ${activeTab === 'ai_prediction' ? 'bg-emerald-600 text-white' : 'text-slate-600'}`}
        >
          <Sparkles className="w-4 h-4" />
        </button>
      </div>

      {/* Global Professional Healthcare Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-6 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800 dark:text-slate-200">BloodConnect AI</span>
            <span>• Emergency Blood & Donor Coordination Network</span>
          </div>
          <div className="italic text-slate-400">
            "Current systems tell us where blood is available today. BloodConnect AI predicts where blood will be needed tomorrow."
          </div>
          <div>© {new Date().getFullYear()} BloodConnect AI. All Rights Reserved.</div>
        </div>
      </footer>

      {/* Authentication & Role Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialRole={authModalRole}
        onSuccess={handleAuthSuccess}
      />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}
