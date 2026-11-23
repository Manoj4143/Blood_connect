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
  Activity,
  SlidersHorizontal
} from 'lucide-react';
import type { BloodGroup, PriorityLevel, RadiusTier } from '../types';
import { rankDonorsForEmergency, RADIUS_THRESHOLDS } from '../utils/aiPrediction';

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

  const [bloodGroup, setBloodGroup] = useState<BloodGroup>('O-');
  const [unitsRequired, setUnitsRequired] = useState<number>(2);
  const [priority, setPriority] = useState<PriorityLevel>('Critical');
  const [patientStatus, setPatientStatus] = useState<string>('Severe Obstetric Post-Partum Hemorrhage');
  const [selectedRadius, setSelectedRadius] = useState<RadiusTier>('15 KM');

  const [searchTargetGroup, setSearchTargetGroup] = useState<BloodGroup>('O-');
  const [donorSearchRadius, setDonorSearchRadius] = useState<RadiusTier>('15 KM');
  const [lastDispatchedResult, setLastDispatchedResult] = useState<{
    message: string;
    resolvedVia: string;
  } | null>(null);

  const radiusTiers: RadiusTier[] = ['5 KM', '15 KM', '30 KM', '50 KM', 'District Wide', 'Neighbouring Districts'];

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

  const matchingResult = rankDonorsForEmergency(
    donors,
    searchTargetGroup,
    hospital.latitude,
    hospital.longitude,
    donorSearchRadius,
    false
  );

  const hospitalRequests = requests.filter(r => r.hospital_id === hospital.id);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-slate-200">
      {/* LEFT & CENTER (8 cols) */}
      <div className="lg:col-span-8 space-y-6">
        {/* Hospital Overview Bar */}
        <div className="p-6 rounded-3xl bg-[#1e1f25] border border-[#292a33] shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase bg-[#00d2c4]/10 text-[#00d2c4] border border-[#00d2c4]/30">
                Hospital Emergency Desk
              </span>
              <span className="text-xs text-slate-500">ID: {hospital.id}</span>
            </div>
            <h1 className="text-xl font-black text-white mt-1.5 tracking-tight">{hospital.name}</h1>
            <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-3">
              <span>📍 {hospital.address}, {hospital.city}</span>
              <span>📞 {hospital.contact}</span>
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
            <span className="text-xs font-bold text-emerald-400">Trauma Dispatch Online</span>
          </div>
        </div>

        {lastDispatchedResult && (
          <div className="p-4 rounded-2xl bg-[#00d2c4]/10 border border-[#00d2c4]/30 text-[#00d2c4] text-xs flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <div>
              <div className="font-extrabold">Emergency Protocol Completed</div>
              <p className="text-slate-300 mt-0.5">{lastDispatchedResult.message}</p>
            </div>
          </div>
        )}

        {/* Create Request Card styled as Reference 'Patients Management' */}
        <div className="p-6 rounded-3xl bg-[#1e1f25] border border-[#292a33] shadow-md space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-extrabold text-white tracking-tight flex items-center gap-2">
              <Zap className="w-5 h-5 text-red-500" />
              Create Emergency Blood Request
            </h2>
            <span className="text-xs text-slate-400">Step 1: Bank &rarr; Step 2: Donors</span>
          </div>

          <form onSubmit={handleCreateRequest} className="space-y-4 pt-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Blood Group
                </label>
                <select
                  value={bloodGroup}
                  onChange={e => setBloodGroup(e.target.value as BloodGroup)}
                  className="w-full px-3 py-2.5 text-xs rounded-2xl bg-[#16171d] border border-[#282a35] text-red-400 font-extrabold focus:outline-none focus:border-[#00d2c4]"
                >
                  {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => (
                    <option key={bg} value={bg}>{bg}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Units Required
                </label>
                <input
                  type="number"
                  min="1"
                  max="50"
                  required
                  value={unitsRequired}
                  onChange={e => setUnitsRequired(Number(e.target.value))}
                  className="w-full px-3 py-2.5 text-xs rounded-2xl bg-[#16171d] border border-[#282a35] text-white font-bold focus:outline-none focus:border-[#00d2c4]"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                Priority Level
              </label>
              <div className="grid grid-cols-4 gap-2">
                {(['Critical', 'High', 'Medium', 'Low'] as PriorityLevel[]).map(p => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPriority(p)}
                    className={`py-2 rounded-xl text-xs font-bold transition-all ${
                      priority === p
                        ? 'bg-[#00d2c4] text-[#0d1217] shadow-md shadow-[#00d2c4]/20'
                        : 'bg-[#16171d] border border-[#282a35] text-slate-400 hover:text-white'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                Patient Status & Clinical Indication
              </label>
              <textarea
                rows={2}
                required
                value={patientStatus}
                onChange={e => setPatientStatus(e.target.value)}
                className="w-full px-3 py-2.5 text-xs rounded-2xl bg-[#16171d] border border-[#282a35] text-white resize-none focus:outline-none focus:border-[#00d2c4]"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-2xl bg-[#00d2c4] hover:bg-[#00beaf] text-[#0d1217] font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-[#00d2c4]/20 transition-all cursor-pointer"
            >
              <Zap className="w-4 h-4 fill-[#0d1217]" />
              Dispatch Emergency Blood Request
            </button>
          </form>
        </div>

        {/* Requests Table matching Reference */}
        <div className="p-6 rounded-3xl bg-[#1e1f25] border border-[#292a33] shadow-md space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-extrabold text-white">Emergency Request Log</h3>
            <span className="text-xs text-[#00d2c4] font-bold">{hospitalRequests.length} Recorded</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#292a33] text-slate-400 font-bold uppercase text-[11px]">
                  <th className="pb-3 px-3">Req ID</th>
                  <th className="pb-3 px-3">Blood</th>
                  <th className="pb-3 px-3">Units</th>
                  <th className="pb-3 px-3">Priority</th>
                  <th className="pb-3 px-3">Assigned Source</th>
                  <th className="pb-3 px-3">Status</th>
                  <th className="pb-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#262832] font-medium text-slate-300">
                {hospitalRequests.map(req => (
                  <tr key={req.id} className="hover:bg-[#23242e] transition-colors">
                    <td className="py-3 px-3 font-mono font-bold text-white">{req.id}</td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded-md font-extrabold bg-red-950 text-red-400 border border-red-800">
                        {req.blood_group}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-bold text-white">{req.units_required}</td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-red-500/20 text-red-400">
                        {req.priority}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-400 max-w-[150px] truncate">{req.assigned_to || req.resolved_source}</td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#00d2c4]/15 text-[#00d2c4]">
                        {req.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <select
                        value={req.status}
                        onChange={e => updateRequestStatus(req.id, e.target.value as any)}
                        className="px-2 py-1 rounded-lg bg-[#16171d] text-[10px] font-bold text-white border border-[#282a35]"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Reserved">Reserved</option>
                        <option value="Dispatched">Dispatched</option>
                        <option value="Fulfilled">Fulfilled</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN (4 cols): Intelligent Matching & Radius */}
      <div className="lg:col-span-4 space-y-6">
        {/* Dynamic Radius Selector Card */}
        <div className="p-6 rounded-3xl bg-[#1e1f25] border border-[#292a33] shadow-md space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-extrabold text-white flex items-center gap-1.5">
              <Compass className="w-4 h-4 text-[#00d2c4]" />
              Smart Radius Expansion
            </h3>
            <span className="text-[11px] font-bold text-[#00d2c4]">{donorSearchRadius}</span>
          </div>

          <div className="grid grid-cols-3 gap-1.5">
            {radiusTiers.map(t => (
              <button
                key={t}
                onClick={() => setDonorSearchRadius(t)}
                className={`py-1.5 px-1 rounded-xl text-[10px] font-bold transition-all text-center ${
                  donorSearchRadius === t
                    ? 'bg-[#00d2c4] text-[#0d1217] font-black'
                    : 'bg-[#16171d] border border-[#282a35] text-slate-400 hover:text-white'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Ranked Donors Card matching 'Doctor List' in reference */}
        <div className="p-6 rounded-3xl bg-[#1e1f25] border border-[#292a33] shadow-md space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-extrabold text-white">AI Ranked Donors</h3>
            <span className="text-xs font-bold text-[#00d2c4]">
              {matchingResult.ranked.length} Available
            </span>
          </div>

          <div className="space-y-3">
            {matchingResult.ranked.slice(0, 4).map(item => (
              <div key={item.donor.id} className="p-3 rounded-2xl bg-[#16171d] border border-[#282a35] text-xs space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-red-950/80 text-red-400 font-black flex items-center justify-center text-[10px]">
                      #{item.rank}
                    </div>
                    <span className="font-bold text-white text-xs">{item.donor.name}</span>
                    <span className="text-[10px] font-extrabold text-red-400">{item.donor.blood_group}</span>
                  </div>
                  <span className="font-black text-xs text-[#00d2c4]">{item.matchScore}%</span>
                </div>
                <div className="flex items-center justify-between text-[10px] text-slate-400">
                  <span>📍 {item.distanceKm} km away</span>
                  <span className="text-emerald-400 font-bold">ELIGIBLE</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Today's Triage Alert */}
        <div className="p-6 rounded-3xl bg-[#1e1f25] border border-[#292a33] shadow-md space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-extrabold text-white">Protocol Status</h3>
            <span className="text-xs font-bold text-[#00d2c4]">Active</span>
          </div>
          <div className="p-3 rounded-2xl bg-[#16171d] border border-[#282a35] text-xs space-y-1">
            <div className="text-white font-bold flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#00d2c4]" />
              Ineligible Shield
            </div>
            <p className="text-[11px] text-slate-400">
              Ineligible donors under the 90-day cooldown are automatically filtered out.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
