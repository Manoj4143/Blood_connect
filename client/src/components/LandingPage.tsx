import React from 'react';
import {
  Heart,
  Activity,
  ShieldAlert,
  Zap,
  Clock,
  Compass,
  Users,
  Building,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  Award
} from 'lucide-react';
import { UserRole } from '../types';

interface LandingPageProps {
  onNavigateRole: (role: UserRole) => void;
  openAuthModal: (role?: UserRole) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigateRole, openAuthModal }) => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28">
        {/* Background Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-br from-red-500/10 via-rose-500/5 to-transparent blur-3xl -z-10 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            {/* Pill Tagline */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-100 dark:bg-red-950/60 border border-red-200 dark:border-red-900/60 text-red-700 dark:text-red-300 text-xs font-semibold mb-6 shadow-xs animate-fade-in">
              <span className="flex h-2 w-2 rounded-full bg-red-600 animate-ping"></span>
              Emergency Blood Discovery & Shortage AI
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.15]">
              AI-Powered Blood Coordination{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-rose-600">
                Saving Lives in Seconds
              </span>
            </h1>

            {/* Project Tagline Callout */}
            <div className="mt-5 p-3 rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-sm backdrop-blur-sm max-w-2xl mx-auto">
              <p className="text-sm font-medium text-slate-600 dark:text-slate-300 italic">
                “Current systems tell us where blood is available today.{' '}
                <span className="text-red-600 dark:text-red-400 font-semibold not-italic">
                  BloodConnect AI predicts where blood will be needed tomorrow.
                </span>”
              </p>
            </div>

            <p className="mt-6 text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl mx-auto">
              A unified healthcare ecosystem connecting blood donors, blood banks, hospitals, and public health
              administrators. Eliminates emergency search latency through real-time stock orchestration and intelligent
              donor radius dispatch.
            </p>

            {/* 4 Role Registration / Entry CTA Buttons */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={() => {
                  openAuthModal('donor');
                  onNavigateRole('donor');
                }}
                className="px-5 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm shadow-lg shadow-red-600/25 flex items-center gap-2 transform active:scale-95 transition-all"
              >
                <Heart className="w-4 h-4 fill-white" />
                Register as Donor
              </button>

              <button
                onClick={() => {
                  openAuthModal('blood_bank');
                  onNavigateRole('blood_bank');
                }}
                className="px-5 py-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 hover:border-slate-400 text-slate-900 dark:text-white font-bold text-sm shadow-sm flex items-center gap-2 active:scale-95 transition-all"
              >
                <Activity className="w-4 h-4 text-amber-500" />
                Register Blood Bank
              </button>

              <button
                onClick={() => {
                  openAuthModal('hospital');
                  onNavigateRole('hospital');
                }}
                className="px-5 py-3 rounded-xl bg-slate-900 dark:bg-white hover:bg-slate-800 dark:hover:bg-slate-100 text-white dark:text-slate-950 font-bold text-sm shadow-md flex items-center gap-2 active:scale-95 transition-all"
              >
                <Building className="w-4 h-4 text-blue-500" />
                Register Hospital
              </button>

              <button
                onClick={() => openAuthModal()}
                className="px-5 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold text-sm transition-all"
              >
                Login
              </button>
            </div>
          </div>

          {/* Real-time Hero Statistics Banner */}
          <div className="mt-14 grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm text-center">
              <div className="text-2xl lg:text-3xl font-black text-red-600 tracking-tight">4.2 Mins</div>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1">
                Avg Emergency Match Time (Down from 48 mins)
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm text-center">
              <div className="text-2xl lg:text-3xl font-black text-emerald-600 tracking-tight">100%</div>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1">
                Eligibility Compliant (Strict 90-Day Cooldown)
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm text-center">
              <div className="text-2xl lg:text-3xl font-black text-blue-600 tracking-tight">94.8%</div>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1">
                Shortage Forecast Accuracy
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm text-center">
              <div className="text-2xl lg:text-3xl font-black text-purple-600 tracking-tight">160 KM</div>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1">
                Max Dynamic Search Radius
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works: Step 1 vs Step 2 Smart Dispatch */}
      <section className="py-16 bg-white dark:bg-slate-900/50 border-y border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-red-600 dark:text-red-400">
              Protocol Architecture
            </span>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white mt-2">
              How BloodConnect AI Emergency Search Works
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
              Our automated failover pipeline guarantees patients receive blood through verified hospital reserves
              first, before mobilizing registered civic donors.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Step 1 Card */}
            <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-900 border-2 border-blue-500/30 relative shadow-sm">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-xs font-bold mb-4">
                Step 1: Automated Inventory Reserve
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                Blood Bank Stock Discovery
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                When an emergency request is generated, BloodConnect AI queries regional licensed blood banks instantly.
                If blood is available in inventory, units are immediately locked and reserved for transit.
              </p>
              <div className="space-y-2 text-xs font-medium text-slate-600 dark:text-slate-400">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  Instant reserve without manual telephone inquiries
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  Real-time stock deduction prevents double allocation
                </div>
              </div>
            </div>

            {/* Step 2 Card */}
            <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-900 border-2 border-red-500/30 relative shadow-sm">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300 text-xs font-bold mb-4">
                Step 2: Failover AI Donor Broadcast
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                Dynamic Radius Donor Mobilization
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                If blood bank inventory is insufficient, the system activates dynamic radius search (5km → 15km → 30km
                → 50km → District). AI ranks donors and delivers notifications strictly to verified ELIGIBLE donors.
              </p>
              <div className="space-y-2 text-xs font-medium text-slate-600 dark:text-slate-400">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  Strict 90-day cooldown filter shields recent donors
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  AI multi-criteria ranking (Compatibility + Distance + History)
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-red-600 dark:text-red-400">
              Platform Modules
            </span>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white mt-2">
              Engineered for Critical Healthcare Demands
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
              Built on hospital-grade standards ensuring reliability, security, and immediate life-saving coordination.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-red-100 dark:bg-red-950/60 flex items-center justify-center text-red-600 mb-4">
                <Heart className="w-6 h-6 fill-red-600/20" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                Automated Donor Eligibility Engine
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Calculates Last Donation + 90 Days. Strictly blocks notifications to ineligible donors to prevent
                donor fatigue and protect donor health.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-950/60 flex items-center justify-center text-blue-600 mb-4">
                <Compass className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                Dynamic Expansion Search Radius
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                If no donors or stock exist in 5 km, the search radius automatically expands through 15 km, 30 km, 50 km,
                and neighbouring districts with live radius tracking.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 flex items-center justify-center text-emerald-600 mb-4">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                AI Shortage Prediction
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Machine learning model ingests seasonal hospital surgery schedules, historical trauma rates, and shelf-life
                expiry to forecast deficits 7-14 days ahead.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-950/60 flex items-center justify-center text-amber-600 mb-4">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                Priority Emergency Triage
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Critical, High, Medium, and Low triage priority routing. Critical polytrauma requests bypass routine
                queues and alert nearest trauma centers.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-950/60 flex items-center justify-center text-purple-600 mb-4">
                <Building className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                Multi-Blood Bank Inventory Sync
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Centralized real-time tracking of A+, A-, B+, B-, AB+, AB-, O+, O- with unit expiry tracking and low-stock
                threshold warnings.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-rose-100 dark:bg-rose-950/60 flex items-center justify-center text-rose-600 mb-4">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                Role-Based Security & Permissions
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Strict separation of concerns across 4 distinct portals: Donor Dashboard, Hospital Desk, Blood Bank
                Inventory, and Administrator Oversight.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Social Impact & Statistics */}
      <section className="py-16 bg-slate-900 text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-red-400">
                Social Impact
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mt-2 leading-tight">
                Addressing the 12,000 Lives Lost Daily to Blood Delays
              </h2>
              <p className="text-slate-300 text-sm sm:text-base mt-4 leading-relaxed">
                Globally, over 118 million blood donations are collected each year, yet distribution bottlenecks cause
                catastrophic local shortages during critical obstetrics, trauma, and cancer therapies. BloodConnect AI
                converts disconnected databases into an intelligent, proactive lifeline.
              </p>

              <div className="mt-6 space-y-3">
                <div className="flex items-start gap-3">
                  <div className="p-1 rounded-lg bg-red-500/20 text-red-400 mt-0.5">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white">Zero Ineligible Donor Fatigue</h4>
                    <p className="text-xs text-slate-400">
                      Eliminates wasted calls to donors who donated recently, maintaining 85% donor retention.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-1 rounded-lg bg-blue-500/20 text-blue-400 mt-0.5">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white">40% Reduction in Wastage</h4>
                    <p className="text-xs text-slate-400">
                      Predictive balancing routes units before expiration to high-demand surgical theaters.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Visual Impact Box */}
            <div className="p-8 rounded-3xl bg-slate-800/80 border border-slate-700 shadow-xl backdrop-blur-md">
              <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-400" />
                Blood Ecosystem Impact Metrics
              </h3>

              <div className="space-y-6">
                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span className="text-slate-300">Average Emergency Response Speed</span>
                    <span className="text-emerald-400">92% Faster</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-700 overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: '92%' }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span className="text-slate-300">Shortage Forecasting Horizon</span>
                    <span className="text-blue-400">14 Days Forward</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-700 overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full" style={{ width: '85%' }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span className="text-slate-300">Rare Blood Group (O-, AB-) Fulfillment</span>
                    <span className="text-red-400">96.4% Success</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-700 overflow-hidden">
                    <div className="h-full bg-red-500 rounded-full" style={{ width: '96.4%' }}></div>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-700 flex items-center justify-between">
                <div>
                  <p className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">Active Donors</p>
                  <p className="text-2xl font-black text-white">48,290+</p>
                </div>
                <div>
                  <p className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">Lives Saved</p>
                  <p className="text-2xl font-black text-red-400">114,800+</p>
                </div>
                <div>
                  <p className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">Hospitals</p>
                  <p className="text-2xl font-black text-blue-400">180+</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Call to Action */}
      <section className="py-16 text-center">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Ready to Build the Future of Emergency Transfusion?
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 max-w-xl mx-auto">
            Join thousands of lifesavers, certified blood banks, and hospital surgical teams on BloodConnect AI today.
          </p>

          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <button
              onClick={() => onNavigateRole('donor')}
              className="px-6 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm shadow-md"
            >
              Enter Donor Portal
            </button>
            <button
              onClick={() => onNavigateRole('hospital')}
              className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md"
            >
              Enter Hospital Portal
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
