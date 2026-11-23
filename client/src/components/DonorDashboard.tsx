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
  Send
} from 'lucide-react';
import { Donor, BloodGroup } from '../types';
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

  // Pick current donor or fallback to first donor
  const donor = donors.find(d => d.id === currentUser.id) || donors[0];

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(donor.name);
  const [phone, setPhone] = useState(donor.phone);
  const [city, setCity] = useState(donor.city);
  const [address, setAddress] = useState(donor.address);
  const [bloodGroup, setBloodGroup] = useState<BloodGroup>(donor.blood_group);
  const [lastDonationDate, setLastDonationDate] = useState(donor.last_donation_date);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Dynamic eligibility calculation for display
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

  // Find emergency requests that match this donor's blood group
  const compatibleRequests = requests.filter(
    r => (r.blood_group === donor.blood_group || donor.blood_group === 'O-') && r.status === 'Pending'
  );

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-slate-900 dark:text-white">Donor Command Console</h1>
            {/* Strict Eligibility Badge */}
            {donor.eligibility_status === 'ELIGIBLE' ? (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700 shadow-xs">
                <CheckCircle className="w-3.5 h-3.5" />
                ELIGIBLE
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-800 dark:bg-red-950/80 dark:text-red-300 border border-red-300 dark:border-red-700 shadow-xs">
                <AlertOctagon className="w-3.5 h-3.5" />
                NOT ELIGIBLE
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Logged in as <strong className="text-slate-800 dark:text-slate-200">{donor.name}</strong> • Blood Group{' '}
            <span className="text-red-600 font-bold">{donor.blood_group}</span>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleSimulateDonation}
            className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 flex items-center gap-1.5 transition-all"
          >
            <Heart className="w-4 h-4 fill-white" />
            Log New Blood Donation
          </button>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 text-slate-700 dark:text-slate-200 font-semibold text-xs transition-all"
          >
            {isEditing ? 'Cancel Edit' : 'Edit Profile'}
          </button>
        </div>
      </div>

      {successToast && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs flex items-center gap-2 shadow-xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="font-medium">{successToast}</span>
        </div>
      )}

      {/* 4 Key Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Eligibility Status */}
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Eligibility Engine
            </span>
            <div className={`p-2 rounded-xl ${donor.eligibility_status === 'ELIGIBLE' ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-950' : 'bg-red-100 text-red-600 dark:bg-red-950'}`}>
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-black text-slate-900 dark:text-white">
            {donor.eligibility_status === 'ELIGIBLE' ? (
              <span className="text-emerald-600 dark:text-emerald-400">Ready to Donate</span>
            ) : (
              <span className="text-red-600 dark:text-red-400">Rest Cooldown Active</span>
            )}
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            {donor.eligibility_status === 'ELIGIBLE'
              ? 'Meets 90-day recovery protocol. Emergency dispatch enabled.'
              : `Cooldown active: ${eligibility.daysRemaining} days remaining until replenishment.`}
          </p>
        </div>

        {/* Card 2: Next Eligible Date */}
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Next Eligible Date
            </span>
            <div className="p-2 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-600">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-black text-blue-600 dark:text-blue-400">
            {donor.next_eligible_date}
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            Last Donated: <strong>{donor.last_donation_date}</strong> (Strict +90 Days)
          </p>
        </div>

        {/* Card 3: Total Lifetime Donations */}
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Impact Track
            </span>
            <div className="p-2 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-600">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-black text-slate-900 dark:text-white">
            {donor.donations_count} <span className="text-xs font-semibold text-slate-400">Donations</span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            ~{donor.donations_count * 3} lives directly impacted by your red cells and platelets.
          </p>
        </div>

        {/* Card 4: Blood Group & Geolocation */}
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Assigned Coordinates
            </span>
            <div className="p-2 rounded-xl bg-purple-100 dark:bg-purple-950 text-purple-600">
              <MapPin className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <span className="text-red-600 font-extrabold">{donor.blood_group}</span>
            <span className="text-xs font-medium text-slate-500">• {donor.city}</span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            {donor.latitude.toFixed(4)}° N, {donor.longitude.toFixed(4)}° E
          </p>
        </div>
      </div>

      {/* Profile Edit Drawer / Form */}
      {isEditing && (
        <form onSubmit={handleSaveProfile} className="p-6 rounded-3xl bg-white dark:bg-slate-900 border-2 border-red-500/20 shadow-lg space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Update Donor Medical Profile Information
            </h3>
            <span className="text-[11px] text-slate-400">Changes immediately re-run the 90-day calculation</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Phone Number</label>
              <input
                type="text"
                required
                value={phone}
                onChange={e => setPhone(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Blood Group</label>
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
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">City</label>
              <input
                type="text"
                value={city}
                onChange={e => setCity(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Street Address</label>
              <input
                type="text"
                value={address}
                onChange={e => setAddress(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Last Donation Date</label>
              <input
                type="date"
                required
                value={lastDonationDate}
                onChange={e => setLastDonationDate(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md"
            >
              Save Profile Updates
            </button>
          </div>
        </form>
      )}

      {/* Active Emergency Broadcast Requests Section */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              Active Emergency Requests Matching Your Profile
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Requests received from hospital trauma centers when blood bank inventory was depleted.
            </p>
          </div>
          <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-red-50 text-red-700 border border-red-200 dark:bg-red-950/60 dark:text-red-300">
            {compatibleRequests.length} Active
          </span>
        </div>

        {donor.eligibility_status !== 'ELIGIBLE' && (
          <div className="mb-4 p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 text-amber-800 dark:text-amber-200 text-xs">
            <div className="flex items-center gap-2 font-bold mb-1">
              <AlertOctagon className="w-4 h-4 text-amber-600" />
              Protective Cooldown Shield Active
            </div>
            You are currently in your 90-day mandatory recovery cooldown ({eligibility.daysRemaining} days remaining).
            Emergency push notifications are safely paused for you to protect your hemoglobin and health.
          </div>
        )}

        {compatibleRequests.length === 0 ? (
          <div className="text-center py-8 text-slate-400 text-xs">
            <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
            No pending emergency broadcasts for {donor.blood_group} in your immediate sector right now.
          </div>
        ) : (
          <div className="space-y-3">
            {compatibleRequests.map(req => (
              <div
                key={req.id}
                className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase bg-red-600 text-white">
                      Priority: {req.priority}
                    </span>
                    <span className="text-xs font-bold text-slate-900 dark:text-white">
                      {req.hospital_name}
                    </span>
                    <span className="text-[11px] text-slate-400">• {req.created_at}</span>
                  </div>
                  <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Patient Case: <span className="font-normal text-slate-600 dark:text-slate-400">{req.patient_status}</span>
                  </p>
                  <p className="text-xs text-red-600 dark:text-red-400 font-bold mt-1">
                    Required: {req.units_required} Units of {req.blood_group} (Radius: {req.search_radius_used || '15 KM'})
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    disabled={donor.eligibility_status !== 'ELIGIBLE'}
                    onClick={() => acceptEmergencyRequestByDonor(req.id, donor.id)}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-xs shadow-xs flex items-center gap-1.5 transition-all"
                  >
                    <CheckCircle className="w-3.5 h-3.5" />
                    Accept & Commit
                  </button>
                  <button
                    onClick={() => rejectEmergencyRequestByDonor(req.id, donor.id)}
                    className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 font-semibold text-xs transition-all"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    Decline
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* AI Donation Recommendations & Nearby Blood Banks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Box 1: AI Donation Recommendations */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 rounded-xl bg-red-100 dark:bg-red-950 text-red-600">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                AI Donation Insights for {donor.name}
              </h3>
              <p className="text-[11px] text-slate-400">Personalized clinical recommendations</p>
            </div>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
              <div className="font-bold text-red-600 mb-0.5">High Community Value Group: {donor.blood_group}</div>
              <p className="text-slate-600 dark:text-slate-300">
                {donor.blood_group === 'O-'
                  ? 'As an O- universal donor, your red cells can be transfused to any emergency trauma victim without crossmatching delays. Your donations have the highest priority in our predictive model.'
                  : `Your ${donor.blood_group} plasma and red cells are vital for local trauma units. Maintaining steady donations every 90 days prevents regional deficits.`}
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
              <div className="font-bold text-slate-800 dark:text-slate-200 mb-0.5">Nutritional & Recovery Tip</div>
              <p className="text-slate-600 dark:text-slate-300">
                Continue dietary iron intake (spinach, lentils, citrus for vitamin C absorption) to maintain optimal
                ferritin levels for your next scheduled donation on <strong>{donor.next_eligible_date}</strong>.
              </p>
            </div>
          </div>
        </div>

        {/* Box 2: Nearby Blood Banks */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-600">
                <Building className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Nearby Certified Blood Banks</h3>
                <p className="text-[11px] text-slate-400">Walk-in donation center network</p>
              </div>
            </div>
            <span className="text-[11px] font-semibold text-blue-600 dark:text-blue-400">Within Metro Area</span>
          </div>

          <div className="space-y-2.5">
            {bloodBanks.slice(0, 3).map(bank => (
              <div
                key={bank.id}
                className="p-3 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex items-center justify-between text-xs"
              >
                <div>
                  <div className="font-bold text-slate-900 dark:text-white">{bank.name}</div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3 text-red-500" />
                    {bank.location}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">Lic: {bank.license_number}</div>
                </div>
                <div className="text-right">
                  <a
                    href={`tel:${bank.phone}`}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-bold text-[11px] hover:bg-blue-100 transition-colors"
                  >
                    <Phone className="w-3 h-3" />
                    Call Desk
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
