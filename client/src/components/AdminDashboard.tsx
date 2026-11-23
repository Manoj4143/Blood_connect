import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Users,
  ShieldAlert,
  Building2,
  Activity,
  Heart,
  TrendingUp,
  MapPin,
  CheckCircle,
  AlertTriangle,
  Database,
  ArrowUpRight,
  Filter,
  Search,
  Download
} from 'lucide-react';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

export const AdminDashboard: React.FC = () => {
  const {
    donors,
    bloodBanks,
    hospitals,
    inventory,
    requests,
    shortagePredictions,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'analytics' | 'database'>('analytics');
  const [dbTable, setDbTable] = useState<'donors' | 'blood_banks' | 'hospitals' | 'inventory' | 'requests'>('donors');
  const [searchTerm, setSearchTerm] = useState('');

  // KPI calculations
  const totalDonors = donors.length;
  const eligibleDonors = donors.filter(d => d.eligibility_status === 'ELIGIBLE').length;
  const totalBloodBanks = bloodBanks.length;
  const totalHospitals = hospitals.length;
  const activeEmergencyRequests = requests.filter(r => r.status === 'Pending' || r.status === 'Reserved').length;
  const criticalShortagesCount = shortagePredictions.filter(p => p.risk_level === 'Critical Shortage').length;

  // Analytics Chart 1: Blood Group Distribution across Registered Donors
  const bloodGroupDistribution = [
    { name: 'O+', value: donors.filter(d => d.blood_group === 'O+').length },
    { name: 'O-', value: donors.filter(d => d.blood_group === 'O-').length },
    { name: 'A+', value: donors.filter(d => d.blood_group === 'A+').length },
    { name: 'A-', value: donors.filter(d => d.blood_group === 'A-').length },
    { name: 'B+', value: donors.filter(d => d.blood_group === 'B+').length },
    { name: 'B-', value: donors.filter(d => d.blood_group === 'B-').length },
    { name: 'AB+', value: donors.filter(d => d.blood_group === 'AB+').length },
    { name: 'AB-', value: donors.filter(d => d.blood_group === 'AB-').length },
  ];

  const COLORS = ['#ef4444', '#f97316', '#3b82f6', '#06b6d4', '#8b5cf6', '#ec4899', '#10b981', '#6366f1'];

  // Analytics Chart 2: Monthly Donations Growth
  const monthlyDonationsGrowth = [
    { month: 'Jun', donations: 340, requests: 290 },
    { month: 'Jul', donations: 420, requests: 380 },
    { month: 'Aug', donations: 480, requests: 460 },
    { month: 'Sep', donations: 560, requests: 510 },
    { month: 'Oct', donations: 690, requests: 630 },
    { month: 'Nov', donations: 820, requests: 740 },
  ];

  // Analytics Chart 3: Regional Distribution (Delhi NCR)
  const regionalData = [
    { region: 'Central Delhi', donations: 342, shortages: 14 },
    { region: 'South Delhi', donations: 512, shortages: 8 },
    { region: 'North Delhi', donations: 280, shortages: 19 },
    { region: 'Noida / East', donations: 390, shortages: 11 },
    { region: 'Gurugram', donations: 410, shortages: 7 },
  ];

  return (
    <div className="space-y-6">
      {/* Title & View Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-slate-900 dark:text-white">
              National Health Directorate Oversight
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300">
              Admin Master Console
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Real-time public health surveillance, blood supply chain analytics, and institutional registry
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
            <button
              onClick={() => setActiveTab('analytics')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'analytics'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Analytics & Trends
            </button>
            <button
              onClick={() => setActiveTab('database')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'database'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Database Registry
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards (Specified in Prompt) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* KPI 1: Total Donors */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Donors</span>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">{totalDonors}</div>
          <p className="text-[10px] text-slate-400 mt-0.5">Registered nationwide</p>
        </div>

        {/* KPI 2: Eligible Donors */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-500">Eligible Donors</span>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">{eligibleDonors}</div>
          <p className="text-[10px] text-emerald-600/80 mt-0.5">Ready for dispatch</p>
        </div>

        {/* KPI 3: Blood Banks */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-amber-500">Blood Banks</span>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">{totalBloodBanks}</div>
          <p className="text-[10px] text-slate-400 mt-0.5">Licensed component hubs</p>
        </div>

        {/* KPI 4: Hospitals */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-blue-500">Hospitals</span>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">{totalHospitals}</div>
          <p className="text-[10px] text-slate-400 mt-0.5">Connected trauma centers</p>
        </div>

        {/* KPI 5: Active Emergency Requests */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-red-500">Active Requests</span>
          <div className="text-2xl font-black text-red-600 mt-1">{activeEmergencyRequests}</div>
          <p className="text-[10px] text-red-500/80 mt-0.5">In triage or reserve</p>
        </div>

        {/* KPI 6: Critical Shortages */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-rose-500">Critical Shortages</span>
          <div className="text-2xl font-black text-rose-600 mt-1">{criticalShortagesCount}</div>
          <p className="text-[10px] text-rose-500/80 mt-0.5">Groups below safety</p>
        </div>
      </div>

      {activeTab === 'analytics' ? (
        <>
          {/* Charts Row 1: Monthly Donations & Blood Group Distribution */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Monthly Donations Growth */}
            <div className="lg:col-span-8 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Monthly Donations Growth vs Blood Demand Trends
                  </h3>
                  <p className="text-xs text-slate-400">
                    Net units collected across hospital drives vs clinical demand
                  </p>
                </div>
                <span className="text-xs font-semibold px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-600">
                  Last 6 Months
                </span>
              </div>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={monthlyDonationsGrowth} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                    <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#64748b' }} />
                    <YAxis tick={{ fontSize: 12, fill: '#64748b' }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#0f172a',
                        border: 'none',
                        borderRadius: '12px',
                        color: '#fff',
                        fontSize: '12px',
                      }}
                    />
                    <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                    <Line type="monotone" dataKey="donations" name="Completed Donations" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} />
                    <Line type="monotone" dataKey="requests" name="Emergency Requests" stroke="#ef4444" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Blood Group Distribution Pie */}
            <div className="lg:col-span-4 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
                  Blood Group Distribution
                </h3>
                <p className="text-xs text-slate-400 mb-4">
                  Registry share by ABO & Rh typing
                </p>

                <div className="h-52 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={bloodGroupDistribution}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={75}
                        paddingAngle={3}
                        dataKey="value"
                      >
                        {bloodGroupDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-1 pt-2 text-[10px] font-semibold text-center text-slate-600 dark:text-slate-400">
                {bloodGroupDistribution.map((g, i) => (
                  <div key={g.name} className="flex items-center gap-1 justify-center">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                    <span>{g.name} ({g.value})</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Charts Row 2: Regional Performance & Shortage Regions */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Regional Donation Density vs Shortage Hotspots
                </h3>
                <p className="text-xs text-slate-400">
                  Identifies geographical zones requiring mobile donation bus deployment
                </p>
              </div>
            </div>

            <div className="h-60 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={regionalData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                  <XAxis dataKey="region" tick={{ fontSize: 12, fill: '#64748b' }} />
                  <YAxis tick={{ fontSize: 12, fill: '#64748b' }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      border: 'none',
                      borderRadius: '12px',
                      color: '#fff',
                      fontSize: '12px',
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                  <Bar dataKey="donations" name="Units Collected" fill="#3b82f6" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="shortages" name="Unfulfilled Shortages" fill="#ef4444" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      ) : (
        /* Database Table Inspector */
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-2">
              <Database className="w-5 h-5 text-purple-600" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Relational Database Explorer
              </h3>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {(['donors', 'blood_banks', 'hospitals', 'inventory', 'requests'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setDbTable(tab)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all ${
                    dbTable === tab
                      ? 'bg-purple-600 text-white shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  {tab.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>

          {/* Table Render according to schema specified in prompt */}
          <div className="overflow-x-auto max-h-96">
            {dbTable === 'donors' && (
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 font-semibold uppercase">
                    <th className="pb-2 px-2">ID</th>
                    <th className="pb-2 px-2">Name</th>
                    <th className="pb-2 px-2">Phone</th>
                    <th className="pb-2 px-2">Blood</th>
                    <th className="pb-2 px-2">City</th>
                    <th className="pb-2 px-2">Last Donation</th>
                    <th className="pb-2 px-2">Next Eligible</th>
                    <th className="pb-2 px-2">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                  {donors.map(d => (
                    <tr key={d.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                      <td className="py-2.5 px-2 font-mono font-bold">{d.id}</td>
                      <td className="py-2.5 px-2 font-bold">{d.name}</td>
                      <td className="py-2.5 px-2 text-slate-500">{d.phone}</td>
                      <td className="py-2.5 px-2 font-bold text-red-600">{d.blood_group}</td>
                      <td className="py-2.5 px-2">{d.city}</td>
                      <td className="py-2.5 px-2">{d.last_donation_date}</td>
                      <td className="py-2.5 px-2">{d.next_eligible_date}</td>
                      <td className="py-2.5 px-2">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          d.eligibility_status === 'ELIGIBLE' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {d.eligibility_status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {dbTable === 'blood_banks' && (
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 font-semibold uppercase">
                    <th className="pb-2 px-2">ID</th>
                    <th className="pb-2 px-2">Name</th>
                    <th className="pb-2 px-2">Location</th>
                    <th className="pb-2 px-2">Phone</th>
                    <th className="pb-2 px-2">License Number</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                  {bloodBanks.map(b => (
                    <tr key={b.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                      <td className="py-2.5 px-2 font-mono font-bold">{b.id}</td>
                      <td className="py-2.5 px-2 font-bold">{b.name}</td>
                      <td className="py-2.5 px-2">{b.location}</td>
                      <td className="py-2.5 px-2">{b.phone}</td>
                      <td className="py-2.5 px-2 font-mono text-slate-500">{b.license_number}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {dbTable === 'hospitals' && (
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 font-semibold uppercase">
                    <th className="pb-2 px-2">ID</th>
                    <th className="pb-2 px-2">Name</th>
                    <th className="pb-2 px-2">Location</th>
                    <th className="pb-2 px-2">Contact</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                  {hospitals.map(h => (
                    <tr key={h.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                      <td className="py-2.5 px-2 font-mono font-bold">{h.id}</td>
                      <td className="py-2.5 px-2 font-bold">{h.name}</td>
                      <td className="py-2.5 px-2">{h.location}</td>
                      <td className="py-2.5 px-2">{h.contact}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {dbTable === 'inventory' && (
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 font-semibold uppercase">
                    <th className="pb-2 px-2">ID</th>
                    <th className="pb-2 px-2">Blood Bank ID</th>
                    <th className="pb-2 px-2">Blood Group</th>
                    <th className="pb-2 px-2">Units Available</th>
                    <th className="pb-2 px-2">Expiry Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                  {inventory.map(inv => (
                    <tr key={inv.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                      <td className="py-2.5 px-2 font-mono font-bold">{inv.id}</td>
                      <td className="py-2.5 px-2 font-mono">{inv.blood_bank_id}</td>
                      <td className="py-2.5 px-2 font-bold text-red-600">{inv.blood_group}</td>
                      <td className="py-2.5 px-2 font-bold">{inv.units_available}</td>
                      <td className="py-2.5 px-2">{inv.expiry_date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {dbTable === 'requests' && (
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 font-semibold uppercase">
                    <th className="pb-2 px-2">ID</th>
                    <th className="pb-2 px-2">Hospital</th>
                    <th className="pb-2 px-2">Blood Group</th>
                    <th className="pb-2 px-2">Units Required</th>
                    <th className="pb-2 px-2">Priority</th>
                    <th className="pb-2 px-2">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                  {requests.map(r => (
                    <tr key={r.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                      <td className="py-2.5 px-2 font-mono font-bold">{r.id}</td>
                      <td className="py-2.5 px-2 font-semibold">{r.hospital_name}</td>
                      <td className="py-2.5 px-2 font-bold text-red-600">{r.blood_group}</td>
                      <td className="py-2.5 px-2 font-bold">{r.units_required}</td>
                      <td className="py-2.5 px-2">{r.priority}</td>
                      <td className="py-2.5 px-2 font-bold">{r.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
