import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/Sidebar';
import { Topbar } from './components/Topbar';
import { LandingPage } from './components/LandingPage';
import { DonorDashboard } from './components/DonorDashboard';
import { BloodBankDashboard } from './components/BloodBankDashboard';
import { HospitalDashboard } from './components/HospitalDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { AIShortagePredictionModule } from './components/AIShortagePredictionModule';
import { AuthModal } from './components/AuthModal';
import type { UserRole } from './types';

const MainAppContent: React.FC = () => {
  const { loginAs } = useApp();
  const [activeTab, setActiveTab] = useState<string>('donor');
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
    <div className="min-h-screen bg-[#131418] text-slate-100 flex font-sans antialiased overflow-x-hidden">
      {/* Left Sidebar (LifeCare dark UI style with cyan active indicators) */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        openAuthModal={openAuthModal}
      />

      {/* Main Content Area with Sticky Topbar */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#131418]">
        {/* Top Header Bar */}
        <Topbar
          openAuthModal={openAuthModal}
        />

        {/* Dashboard Work Area */}
        <main className="flex-1 p-6 lg:p-8 max-w-[1600px] w-full mx-auto">
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

        {/* Subtle Hospital Grade Footer */}
        <footer className="border-t border-[#22242d] bg-[#14151a] py-4 px-8 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>
            <strong className="text-slate-300">BloodConnect AI</strong> • Emergency Blood & Donor Coordination Network
          </div>
          <div className="italic text-slate-400">
            "Current systems tell us where blood is available today. BloodConnect AI predicts where blood will be needed tomorrow."
          </div>
        </footer>
      </div>

      {/* Auth Modal */}
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
