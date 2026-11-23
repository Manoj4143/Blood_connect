import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Building2,
  AlertTriangle,
  Search,
  Compass,
  CheckCircle2,
  Clock,
  Send,
  UserCheck,
  ChevronRight,
  ShieldCheck,
  Phone,
  MapPin,
  Heart,
  Sparkles,
  Zap,
  Activity
} from 'lucide-react';
import { BloodGroup, PriorityLevel, RadiusTier } from '../types';
import { rankDonorsForEmergency, RadiusTier as RTier, RADIUS_THRESHOLDS } from '../utils/aiPrediction';

export const HospitalDashboard: React.FC = () => {
  const {
    hospitals,
    inventory,
    donors,
    requests,
    currentUser,
    createEmergencyRequest,
    updateRequestStatus,
  } = useApp();

  const hospital = hospitals.find(h => h.id === currentUser.id) || hospitals[0];

  // Request Form States
  const [bloodGroup, setBloodGroup] = useState<BloodGroup>('O-');
  const [unitsRequired, setUnitsRequired] = useState<number>(2);
  const [priority, setPriority] = useState<PriorityLevel>('Critical');
  const [patientStatus, setPatientStatus] = useState<string>('Severe Obstetric Post-Partum Hemorrhage');
  const [selectedRadius, setSelectedRadius] = useState<RTier>('15 KM');

  // Search & Matching States
  const [searchTargetGroup, setSearchTargetGroup] = useState<BloodGroup>('O-');
  const [donorSearchRadius, setDonorSearchRadius] = useState<RTier>('15 KM');
  const [lastDispatchedResult, setLastDispatchedResult] = useState<{
    message: string;
    resolvedVia: string;
  } | null>(null);

  const radiusTiers: RTier[] = ['5 KM', '15 KM', '30 KM', '50 KM', 'District Wide', 'Neighbouring Districts'];

  const handleCreateRequest = (e: React.FormEvent) => {
    e.preventDefault();
    const res = createEmergencyRequest({
      hospitalId: hospital.id,
      bloodGroup,
      unitsRequired: Number(unitsRequired),
      priority,
      patientStatus,
      selectedRadius,
    });

    setLastDispatchedResult({
      message: res.message,
      resolvedVia: res.resolvedVia,
    });
  };

  // Run AI matching for the selected search tab
  const matchingResult = rankDonorsForEmergency(
    donors,
    searchTargetGroup,
    hospital.latitude,
    hospital.longitude,
    donorSearchRadius,
    false // strict eligibility: exclude ineligible donors
  );

  const hospitalRequests = requests.filter(r => r.hospital_id === hospital.id);

  return (
    <div className="space-y-6">
      {/* Hospital Identity Bar */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-200 border border-blue-300 dark:border-blue-700">
                Hospital Emergency Desk
              </span>
              <span className="text-xs text-slate-400">ID: {hospital.id}</span>
            </div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white mt-1">
              {hospital.name}
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-3">
              <span>📍 {hospital.address}, {hospital.city}</span>
              <span>📞 {hospital.contact}</span>
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="flex h-3 w-3 rounded-full bg-emerald-500 animate-ping"></span>
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Trauma Dispatch Active
            </span>
          </div>
        </div>
      </div>

      {lastDispatchedResult && (
        <div
          className={`p-4 rounded-3xl border text-xs shadow-md transition-all ${
            lastDispatchedResult.resolvedVia === 'Blood Bank'
              ? 'bg-blue-50 dark:bg-blue-950/40 border-blue-300 dark:border-blue-800 text-blue-900 dark:text-blue-100'
              : 'bg-red-50 dark:bg-red-950/40 border-red-300 dark:border-red-800 text-red-900 dark:text-red-100'
          }`}
        >
          <div className="flex items-start gap-3">
            <div className="p-1 rounded-full bg-white/60 dark:bg-slate-800 mt-0.5">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            </div>
            <div className="space-y-1">
              <div className="font-extrabold text-sm">Emergency Dispatch Protocol Completed</div>
              <p className="leading-relaxed">{lastDispatchedResult.message}</p>
            </div>
          </div>
        </div>
      )}

      {/* Main Grid: Emergency Request Creator & Intelligent Donor Search */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (5 Cols): Create Emergency Blood Request */}
        <div className="lg:col-span-5 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 rounded-xl bg-red-100 dark:bg-red-950 text-red-600">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Create Emergency Blood Request
              </h2>
              <p className="text-[11px] text-slate-400">Step 1: Blood Bank &rarr; Step 2: Donors</p>
            </div>
          </div>

          <form onSubmit={handleCreateRequest} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Blood Group
                </label>
                <select
                  value={bloodGroup}
                  onChange={e => setBloodGroup(e.target.value as BloodGroup)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold text-red-600"
                >
                  {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => (
                    <option key={bg} value={bg}>{bg}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Units Required
                </label>
                <input
                  type="number"
                  min="1"
                  max="50"
                  required
                  value={unitsRequired}
                  onChange={e => setUnitsRequired(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-semibold"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Priority Level
              </label>
              <div className="grid grid-cols-4 gap-1.5">
                {(['Critical', 'High', 'Medium', 'Low'] as PriorityLevel[]).map(p => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPriority(p)}
                    className={`py-1.5 rounded-lg text-xs font-bold transition-all ${
                      priority === p
                        ? p === 'Critical'
                          ? 'bg-red-600 text-white shadow-xs'
                          : p === 'High'
                          ? 'bg-orange-500 text-white'
                          : p === 'Medium'
                          ? 'bg-amber-500 text-white'
                          : 'bg-blue-600 text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Patient Status & Clinical Indication
              </label>
              <textarea
                rows={2}
                required
                value={patientStatus}
                onChange={e => setPatientStatus(e.target.value)}
                placeholder="e.g. ICU Bed 4 polytrauma with splenic rupture, urgent transfusion required."
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Initial Search Radius
              </label>
              <select
                value={selectedRadius}
                onChange={e => setSelectedRadius(e.target.value as RTier)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-medium"
              >
                {radiusTiers.map(tier => (
                  <option key={tier} value={tier}>{tier} (Up to {RADIUS_THRESHOLDS[tier]} KM)</option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs shadow-md shadow-red-600/25 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Zap className="w-4 h-4 fill-white" />
              Dispatch Emergency Blood Request
            </button>
          </form>
        </div>

        {/* Right Column (7 Cols): Intelligent Donor Matching & Dynamic Search Radius */}
        <div className="lg:col-span-7 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-500" />
                  Intelligent Donor Matching & Dynamic Radius
                </h2>
                <p className="text-[11px] text-slate-400">
                  AI ranks candidates by Match + 100% Eligibility + Distance + History
                </p>
              </div>

              {/* Group & Radius Selector */}
              <div className="flex items-center gap-2">
                <select
                  value={searchTargetGroup}
                  onChange={e => setSearchTargetGroup(e.target.value as BloodGroup)}
                  className="px-2.5 py-1.5 text-xs font-bold text-red-600 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                >
                  {['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'].map(g => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>

                <select
                  value={donorSearchRadius}
                  onChange={e => setDonorSearchRadius(e.target.value as RTier)}
                  className="px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                >
                  {radiusTiers.map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Dynamic Search Radius Breadcrumb / Expansion Indicator */}
            <div className="mb-4 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Compass className="w-4 h-4 text-blue-500" />
                  Dynamic Search Radius Pipeline
                </span>
                <span className="text-[11px] font-semibold text-blue-600 dark:text-blue-400">
                  Current: {donorSearchRadius} ({RADIUS_THRESHOLDS[donorSearchRadius]} KM)
                </span>
              </div>

              <div className="flex items-center gap-1 overflow-x-auto pb-1 text-[11px]">
                {radiusTiers.map((tier, idx) => {
                  const isActive = tier === donorSearchRadius;
                  const isPast = radiusTiers.indexOf(donorSearchRadius) > idx;

                  return (
                    <button
                      key={tier}
                      onClick={() => setDonorSearchRadius(tier)}
                      className={`px-2 py-1 rounded-md shrink-0 font-semibold transition-all ${
                        isActive
                          ? 'bg-blue-600 text-white shadow-xs'
                          : isPast
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                          : 'bg-slate-200/60 dark:bg-slate-700/60 text-slate-500'
                      }`}
                    >
                      {tier}
                    </button>
                  );
                })}
              </div>

              {matchingResult.expandedRadiusNeeded && (
                <div className="mt-2 text-[11px] text-amber-600 dark:text-amber-400 flex items-center gap-1.5 font-medium">
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                  No eligible donors in {donorSearchRadius}. Automatically suggested expansion:{' '}
                  <strong className="underline cursor-pointer" onClick={() => matchingResult.suggestedRadius && setDonorSearchRadius(matchingResult.suggestedRadius)}>
                    {matchingResult.suggestedRadius}
                  </strong>
                </div>
              )}
            </div>

            {/* Ranked Donors List */}
            <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
              {matchingResult.ranked.length === 0 ? (
                <div className="text-center py-10 text-xs text-slate-400">
                  No eligible registered donors within {donorSearchRadius}. Try expanding to "District Wide" or "Neighbouring Districts".
                </div>
              ) : (
                matchingResult.ranked.map(item => (
                  <div
                    key={item.donor.id}
                    className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs hover:border-slate-300 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="flex flex-col items-center justify-center w-10 h-10 rounded-xl bg-red-50 text-red-700 dark:bg-red-950/80 dark:text-red-300 font-extrabold text-xs">
                          <span>#{item.rank}</span>
                          <span className="text-[9px] text-slate-400 font-medium">Rank</span>
                        </div>

                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-xs text-slate-900 dark:text-white">
                              {item.donor.name}
                            </span>
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-extrabold bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300">
                              {item.donor.blood_group}
                            </span>
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                              ELIGIBLE
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
                            <span>📍 {item.distanceKm} km away</span>
                            <span>• {item.donor.city}</span>
                            <span>• {item.donor.donations_count} prior donations</span>
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-xs font-black text-emerald-600 dark:text-emerald-400">
                          {item.matchScore}% Score
                        </div>
                        <a
                          href={`tel:${item.donor.phone}`}
                          className="inline-flex items-center gap-1 mt-1 px-2 py-1 rounded-md bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-[10px] font-bold"
                        >
                          <Phone className="w-3 h-3" />
                          {item.donor.phone}
                        </a>
                      </div>
                    </div>

                    <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-800 flex flex-wrap gap-1">
                      {item.matchReasons.map((r, i) => (
                        <span
                          key={i}
                          className="px-1.5 py-0.5 rounded text-[9px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                        >
                          ✓ {r}
                        </span>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Hospital Request History Table */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Emergency Request Audit & Transfusion Log
            </h3>
            <p className="text-xs text-slate-400">
              Live status tracking across blood banks and civically matched donors
            </p>
          </div>
          <span className="text-xs text-slate-400">{hospitalRequests.length} Requests Recorded</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 font-semibold uppercase tracking-wider">
                <th className="pb-3 px-3">Req ID</th>
                <th className="pb-3 px-3">Blood Group</th>
                <th className="pb-3 px-3">Units</th>
                <th className="pb-3 px-3">Priority</th>
                <th className="pb-3 px-3">Patient Clinical Status</th>
                <th className="pb-3 px-3">Source / Assigned</th>
                <th className="pb-3 px-3">Status</th>
                <th className="pb-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300 font-medium">
              {hospitalRequests.map(req => (
                <tr key={req.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                  <td className="py-3 px-3 font-mono font-bold text-slate-900 dark:text-white">
                    {req.id}
                  </td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-1 rounded-md font-extrabold bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300">
                      {req.blood_group}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-bold">{req.units_required}</td>
                  <td className="py-3 px-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-extrabold ${
                        req.priority === 'Critical'
                          ? 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300'
                          : req.priority === 'High'
                          ? 'bg-orange-100 text-orange-700'
                          : 'bg-blue-100 text-blue-700'
                      }`}
                    >
                      {req.priority}
                    </span>
                  </td>
                  <td className="py-3 px-3 max-w-xs truncate" title={req.patient_status}>
                    {req.patient_status}
                  </td>
                  <td className="py-3 px-3 text-slate-500">
                    {req.assigned_to || (req.resolved_source ? `Broadcasting: ${req.resolved_source}` : 'Pending Matching')}
                  </td>
                  <td className="py-3 px-3">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        req.status === 'Reserved'
                          ? 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
                          : req.status === 'Dispatched'
                          ? 'bg-purple-100 text-purple-700'
                          : req.status === 'Fulfilled'
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-amber-100 text-amber-700'
                      }`}
                    >
                      {req.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <select
                      value={req.status}
                      onChange={e => updateRequestStatus(req.id, e.target.value as any)}
                      className="px-2 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-[11px] font-semibold border-none"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Reserved">Reserved</option>
                      <option value="Dispatched">Dispatched</option>
                      <option value="Fulfilled">Fulfilled</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
