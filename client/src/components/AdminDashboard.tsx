import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Users,
  ShieldAlert,
  Building2,
  Activity,
  Heart,
  BarChart3,
  Database
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

  const totalDonors = donors.length;
  const eligibleDonors = donors.filter(d => d.eligibility_status === 'ELIGIBLE').length;
  const totalBloodBanks = bloodBanks.length;
  const totalHospitals = hospitals.length;
  const activeEmergencyRequests = requests.filter(r => r.status === 'Pending' || r.status === 'Reserved').length;
  const criticalShortagesCount = shortagePredictions.filter(p => p.risk_level === 'Critical Shortage').length;

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

  const COLORS = ['#ef4444', '#00d2c4', '#3b82f6', '#f59e0b', '#8b5cf6', '#ec4899', '#10b981', '#6366f1'];

  const monthlyDonationsGrowth = [
    { month: 'Jun', donations: 340, requests: 290 },
    { month: 'Jul', donations: 420, requests: 380 },
    { month: 'Aug', donations: 480, requests: 460 },
    { month: 'Sep', donations: 560, requests: 510 },
    { month: 'Oct', donations: 690, requests: 630 },
    { month: 'Nov', donations: 820, requests: 740 },
  ];

  return (
    <div className="space-y-6 text-slate-200">
      {/* Top Banner */}
      <div className="p-6 rounded-3xl bg-[#1e1f25] border border-[#292a33] shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Directorate Oversight & Analytics
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time public health surveillance and database registry
          </p>
        </div>

        <div className="flex bg-[#16171d] p-1 rounded-2xl border border-[#282a35]">
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'analytics' ? 'bg-[#00d2c4] text-[#0d1217]' : 'text-slate-400 hover:text-white'
            }`}
          >
            Analytics & Trends
          </button>
          <button
            onClick={() => setActiveTab('database')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'database' ? 'bg-[#00d2c4] text-[#0d1217]' : 'text-slate-400 hover:text-white'
            }`}
          >
            Database Registry
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="p-4 rounded-2xl bg-[#1e1f25] border border-[#292a33]">
          <span className="text-[10px] font-bold uppercase text-slate-500">Total Donors</span>
          <div className="text-2xl font-black text-white mt-1">{totalDonors}</div>
        </div>
        <div className="p-4 rounded-2xl bg-[#1e1f25] border border-[#292a33]">
          <span className="text-[10px] font-bold uppercase text-[#00d2c4]">Eligible Donors</span>
          <div className="text-2xl font-black text-[#00d2c4] mt-1">{eligibleDonors}</div>
        </div>
        <div className="p-4 rounded-2xl bg-[#1e1f25] border border-[#292a33]">
          <span className="text-[10px] font-bold uppercase text-amber-400">Blood Banks</span>
          <div className="text-2xl font-black text-white mt-1">{totalBloodBanks}</div>
        </div>
        <div className="p-4 rounded-2xl bg-[#1e1f25] border border-[#292a33]">
          <span className="text-[10px] font-bold uppercase text-blue-400">Hospitals</span>
          <div className="text-2xl font-black text-white mt-1">{totalHospitals}</div>
        </div>
        <div className="p-4 rounded-2xl bg-[#1e1f25] border border-[#292a33]">
          <span className="text-[10px] font-bold uppercase text-red-400">Active Requests</span>
          <div className="text-2xl font-black text-red-400 mt-1">{activeEmergencyRequests}</div>
        </div>
        <div className="p-4 rounded-2xl bg-[#1e1f25] border border-[#292a33]">
          <span className="text-[10px] font-bold uppercase text-rose-400">Critical Shortages</span>
          <div className="text-2xl font-black text-rose-400 mt-1">{criticalShortagesCount}</div>
        </div>
      </div>

      {activeTab === 'analytics' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 p-6 rounded-3xl bg-[#1e1f25] border border-[#292a33] shadow-md space-y-4">
            <h3 className="text-base font-extrabold text-white">Monthly Donations vs Demand</h3>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyDonationsGrowth} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.08} />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#8b8e9b' }} />
                  <YAxis tick={{ fontSize: 11, fill: '#8b8e9b' }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#16171d',
                      border: '1px solid #282a35',
                      borderRadius: '12px',
                      color: '#fff',
                      fontSize: '11px',
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                  <Line type="monotone" dataKey="donations" name="Completed" stroke="#00d2c4" strokeWidth={3} />
                  <Line type="monotone" dataKey="requests" name="Requests" stroke="#ef4444" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="lg:col-span-4 p-6 rounded-3xl bg-[#1e1f25] border border-[#292a33] shadow-md space-y-4">
            <h3 className="text-base font-extrabold text-white">Blood Group Distribution</h3>
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
        </div>
      ) : (
        /* Database Inspector */
        <div className="p-6 rounded-3xl bg-[#1e1f25] border border-[#292a33] shadow-md space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            {(['donors', 'blood_banks', 'hospitals', 'inventory', 'requests'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setDbTable(tab)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-all ${
                  dbTable === tab ? 'bg-[#00d2c4] text-[#0d1217]' : 'bg-[#16171d] border border-[#282a35] text-slate-400'
                }`}
              >
                {tab.replace('_', ' ')}
              </button>
            ))}
          </div>

          <div className="overflow-x-auto max-h-96">
            {dbTable === 'donors' && (
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#292a33] text-slate-400 font-bold uppercase text-[10px]">
                    <th className="pb-2 px-2">ID</th>
                    <th className="pb-2 px-2">Name</th>
                    <th className="pb-2 px-2">Blood</th>
                    <th className="pb-2 px-2">City</th>
                    <th className="pb-2 px-2">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#262832] text-slate-300">
                  {donors.map(d => (
                    <tr key={d.id} className="hover:bg-[#23242e]">
                      <td className="py-2.5 px-2 font-mono">{d.id}</td>
                      <td className="py-2.5 px-2 font-bold text-white">{d.name}</td>
                      <td className="py-2.5 px-2 font-bold text-red-400">{d.blood_group}</td>
                      <td className="py-2.5 px-2">{d.city}</td>
                      <td className="py-2.5 px-2">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          d.eligibility_status === 'ELIGIBLE' ? 'bg-emerald-950 text-emerald-400' : 'bg-red-950 text-red-400'
                        }`}>
                          {d.eligibility_status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            {dbTable !== 'donors' && (
              <div className="p-4 text-xs text-slate-500">
                Displaying active records for {dbTable.replace('_', ' ')}.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
