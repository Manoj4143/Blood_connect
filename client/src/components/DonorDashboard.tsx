import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Heart,
  Calendar,
  Clock,
  ShieldCheck,
  AlertOctagon,
  MapPin,
  Phone,
  Mail,
  Award,
  Sparkles,
  CheckCircle,
  XCircle,
  Building,
  CheckCircle2,
  AlertTriangle,
  Search,
  SlidersHorizontal,
  ChevronRight,
  TrendingUp,
  UserCheck
} from 'lucide-react';
import type { Donor, BloodGroup } from '../types';
import { calculateEligibility } from '../utils/aiPrediction';

export const DonorDashboard: React.FC = () => {
  const {
    donors,
    currentUser,
    updateDonorProfile,
    recordDonation,
    requests,
    bloodBanks,
    acceptEmergencyRequestByDonor,
    rejectEmergencyRequestByDonor,
    shortagePredictions,
  } = useApp();

  const donor = donors.find(d => d.id === currentUser.id) || donors[0];

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(donor.name);
  const [phone, setPhone] = useState(donor.phone);
  const [city, setCity] = useState(donor.city);
  const [address, setAddress] = useState(donor.address);
  const [bloodGroup, setBloodGroup] = useState<BloodGroup>(donor.blood_group);
  const [lastDonationDate, setLastDonationDate] = useState(donor.last_donation_date);
  const [successToast, setSuccessToast] = useState<string | null>(null);
  const [filterText, setFilterText] = useState('');

  const eligibility = calculateEligibility(donor.last_donation_date);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateDonorProfile(donor.id, {
      name,
      phone,
      city,
      address,
      blood_group: bloodGroup,
      last_donation_date: lastDonationDate,
    });
    setIsEditing(false);
    setSuccessToast('Profile and 90-day biological cycle updated successfully!');
    setTimeout(() => setSuccessToast(null), 4000);
  };

  const handleSimulateDonation = () => {
    recordDonation(donor.id);
    setSuccessToast('Donation verified! Cooldown active for next 90 days. Thank you for saving lives!');
    setTimeout(() => setSuccessToast(null), 5000);
  };

  const compatibleRequests = requests.filter(
    r => (r.blood_group === donor.blood_group || donor.blood_group === 'O-') && r.status === 'Pending'
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-slate-200">
      {/* LEFT & CENTER COLUMN (8 cols): Patients Management & Recent Activity styled cards */}
      <div className="lg:col-span-8 space-y-6">
        {/* Banner with Status & Quick Actions */}
        {successToast && (
          <div className="p-4 rounded-2xl bg-[#00d2c4]/10 border border-[#00d2c4]/30 text-[#00d2c4] text-xs flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span className="font-semibold">{successToast}</span>
          </div>
        )}

        {/* Card 1: Main Management Table matching reference card 'Patients Management' */}
        <div className="p-6 rounded-3xl bg-[#1e1f25] border border-[#292a33] shadow-md space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-extrabold text-white tracking-tight">
                Donor Profile & Medical Eligibility
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                90-day cooldown compliance and dynamic donor registration
              </p>
            </div>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="text-xs font-bold text-[#00d2c4] hover:underline"
            >
              {isEditing ? 'Close Edit' : 'Edit Profile'}
            </button>
          </div>

          {/* Search bar & Cyan Advance Filter Button (Exact Reference Match) */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              <input
                type="text"
                value={filterText}
                onChange={e => setFilterText(e.target.value)}
                placeholder="search patients name, id, blood group..."
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[#16171d] border border-[#282a35] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#00d2c4]"
              />
            </div>
            <button
              onClick={handleSimulateDonation}
              className="w-full sm:w-auto px-5 py-2.5 rounded-2xl bg-[#00d2c4] hover:bg-[#00beaf] text-[#0d1217] font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg shadow-[#00d2c4]/20 transition-all shrink-0 cursor-pointer"
            >
              <Heart className="w-4 h-4 fill-[#0d1217]" />
              <span>Log Donation (+90d)</span>
            </button>
          </div>

          {/* Reference styled Data Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#292a33] text-slate-400 font-bold uppercase tracking-wider text-[11px]">
                  <th className="pb-3 px-3">Donor ID</th>
                  <th className="pb-3 px-3">Name</th>
                  <th className="pb-3 px-3">Blood Group</th>
                  <th className="pb-3 px-3">Last Donated</th>
                  <th className="pb-3 px-3">Eligibility Status</th>
                  <th className="pb-3 px-3 text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#262832] font-medium text-slate-300">
                <tr className="hover:bg-[#23242e] transition-colors">
                  <td className="py-3 px-3 font-mono font-bold text-white">#{donor.id}</td>
                  <td className="py-3 px-3 font-bold text-white">{donor.name}</td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded-md font-extrabold text-[11px] bg-red-950/80 text-red-400 border border-red-800">
                      {donor.blood_group}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-slate-400">{donor.last_donation_date}</td>
                  <td className="py-3 px-3">
                    {donor.eligibility_status === 'ELIGIBLE' ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-950/80 text-emerald-400 border border-emerald-800">
                        ELIGIBLE
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-red-950/80 text-red-400 border border-red-800">
                        NOT ELIGIBLE
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-3 text-right text-[#00d2c4] font-semibold cursor-pointer hover:underline">
                    View
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Profile Edit Form if active */}
        {isEditing && (
          <form onSubmit={handleSaveProfile} className="p-6 rounded-3xl bg-[#1e1f25] border border-[#00d2c4]/40 shadow-xl space-y-4">
            <h3 className="text-sm font-bold text-white">Update Profile Details</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-[#16171d] border border-[#282a35] text-white focus:outline-none focus:border-[#00d2c4]"
                />
              </div>
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Phone</label>
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-[#16171d] border border-[#282a35] text-white focus:outline-none focus:border-[#00d2c4]"
                />
              </div>
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Last Donation Date</label>
                <input
                  type="date"
                  required
                  value={lastDonationDate}
                  onChange={e => setLastDonationDate(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-[#16171d] border border-[#282a35] text-white focus:outline-none focus:border-[#00d2c4]"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-[#00d2c4] text-[#0d1217] font-bold text-xs"
              >
                Save Updates
              </button>
            </div>
          </form>
        )}

        {/* Card 2: Recent Activity matching 'Recent Patients Activity' in Reference */}
        <div className="p-6 rounded-3xl bg-[#1e1f25] border border-[#292a33] shadow-md space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-extrabold text-white tracking-tight">
              Active Emergency Requests & Dispatch
            </h2>
            <span className="text-xs font-bold text-[#00d2c4]">
              {compatibleRequests.length} Matches
            </span>
          </div>

          <div className="space-y-3">
            {compatibleRequests.length === 0 ? (
              <div className="p-6 rounded-2xl bg-[#16171d] text-center text-xs text-slate-500">
                No emergency blood shortages matching {donor.blood_group} in your immediate sector.
              </div>
            ) : (
              compatibleRequests.map(req => (
                <div
                  key={req.id}
                  className="p-4 rounded-2xl bg-[#16171d] border border-[#282a35] flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-red-600 to-rose-500 flex items-center justify-center text-white font-black text-xs shrink-0">
                      {req.blood_group}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-white">{req.hospital_name}</span>
                        <span className="px-1.5 py-0.2 rounded text-[10px] font-extrabold uppercase bg-red-950 text-red-400 border border-red-800">
                          {req.priority}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Indication: <span className="text-slate-300 font-medium">{req.patient_status}</span>
                      </p>
                      <p className="text-[10px] text-slate-500 mt-0.5">
                        Required: {req.units_required} Units • Radius: {req.search_radius_used || '15 KM'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      disabled={donor.eligibility_status !== 'ELIGIBLE'}
                      onClick={() => acceptEmergencyRequestByDonor(req.id, donor.id)}
                      className="px-3.5 py-2 rounded-xl bg-[#00d2c4] hover:bg-[#00beaf] disabled:opacity-40 disabled:cursor-not-allowed text-[#0d1217] font-bold text-xs transition-all"
                    >
                      Accept Request
                    </button>
                    <button
                      onClick={() => rejectEmergencyRequestByDonor(req.id, donor.id)}
                      className="px-3 py-2 rounded-xl bg-[#23242e] hover:bg-[#2b2d38] text-slate-300 text-xs font-semibold transition-all"
                    >
                      Decline
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN (4 cols): Patient Cards, Doctor List, Today's Report styled as Reference */}
      <div className="lg:col-span-4 space-y-6">
        {/* Box 1: Patient Quick Stats matching top right card in reference */}
        <div className="p-6 rounded-3xl bg-[#1e1f25] border border-[#292a33] shadow-md space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
              Donation Track
            </span>
            <span className="text-[11px] px-2 py-0.5 rounded-lg bg-[#16171d] text-slate-400 font-semibold border border-[#282a35]">
              Cycle: 90 Days
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3.5 rounded-2xl bg-[#16171d] border border-[#282a35]">
              <div className="flex items-center gap-2 mb-1">
                <div className="p-1.5 rounded-xl bg-[#00d2c4]/15 text-[#00d2c4]">
                  <Award className="w-4 h-4" />
                </div>
                <span className="text-xl font-black text-white">{donor.donations_count}</span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium">Completed Donations</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#16171d] border border-[#282a35]">
              <div className="flex items-center gap-2 mb-1">
                <div className="p-1.5 rounded-xl bg-amber-500/15 text-amber-400">
                  <Clock className="w-4 h-4" />
                </div>
                <span className="text-xl font-black text-white">{eligibility.daysRemaining}d</span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium">Cooldown Days Left</p>
            </div>
          </div>
        </div>

        {/* Box 2: Doctor List style -> Nearby Certified Blood Banks */}
        <div className="p-6 rounded-3xl bg-[#1e1f25] border border-[#292a33] shadow-md space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-extrabold text-white">Nearby Blood Banks</h3>
            <span className="text-xs font-bold text-[#00d2c4] cursor-pointer">See All</span>
          </div>

          <div className="space-y-3">
            {bloodBanks.slice(0, 3).map((bank, idx) => (
              <div key={bank.id} className="flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-[#16171d] border border-[#282a35] flex items-center justify-center text-slate-300 font-bold">
                    {idx + 1}
                  </div>
                  <div>
                    <div className="font-bold text-white text-xs leading-tight">{bank.name}</div>
                    <div className="text-[10px] text-slate-400">{bank.location}</div>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-emerald-400">Available</span>
              </div>
            ))}
          </div>
        </div>

        {/* Box 3: Today's Report style matching reference amber warning alert */}
        <div className="p-6 rounded-3xl bg-[#1e1f25] border border-[#292a33] shadow-md space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-extrabold text-white">Today's Report</h3>
            <span className="text-xs font-bold text-[#00d2c4] cursor-pointer">See All</span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-2xl bg-[#16171d] border border-[#282a35] flex items-start gap-3">
              <div className="p-1.5 rounded-xl bg-amber-500/20 text-amber-400 shrink-0 mt-0.5">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <div>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  Next eligible biological date set for <strong>{donor.next_eligible_date}</strong>.
                </p>
                <span className="text-[10px] text-slate-500 mt-1 block">Few Hours Ago</span>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-[#16171d] border border-[#282a35] flex items-start gap-3">
              <div className="p-1.5 rounded-xl bg-[#00d2c4]/20 text-[#00d2c4] shrink-0 mt-0.5">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  Universal O- plasma reserves are currently at critical levels across metro banks.
                </p>
                <span className="text-[10px] text-slate-500 mt-1 block">2 Hours Ago</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
