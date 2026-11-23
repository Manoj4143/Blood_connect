import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Activity,
  Plus,
  Trash2,
  Edit,
  AlertTriangle,
  Building2,
  Phone,
  FileCheck,
  TrendingUp,
  PackageCheck,
  Calendar,
  CheckCircle2,
  Search
} from 'lucide-react';
import type { BloodGroup, InventoryItem } from '../types';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';

export const BloodBankDashboard: React.FC = () => {
  const {
    bloodBanks,
    inventory,
    currentUser,
    addInventoryStock,
    updateInventoryStock,
    removeInventoryStock,
  } = useApp();

  const currentBank = bloodBanks.find(b => b.id === currentUser.id) || bloodBanks[0];
  const bankInventory = inventory.filter(i => i.blood_bank_id === currentBank.id);

  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<BloodGroup>('O+');
  const [unitsToAdd, setUnitsToAdd] = useState<number>(10);
  const [expiryDate, setExpiryDate] = useState<string>(() => {
    const d = new Date();
    d.setDate(d.getDate() + 35);
    return d.toISOString().split('T')[0];
  });

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editUnits, setEditUnits] = useState<number>(0);

  const bloodGroups: BloodGroup[] = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  const handleAddStock = (e: React.FormEvent) => {
    e.preventDefault();
    addInventoryStock(currentBank.id, selectedGroup, Number(unitsToAdd), expiryDate);
    setShowAddModal(false);
  };

  const handleSaveEdit = (invId: string) => {
    updateInventoryStock(invId, Number(editUnits));
    setEditingId(null);
  };

  const chartData = bloodGroups.map(bg => {
    const item = bankInventory.find(i => i.blood_group === bg);
    const units = item ? item.units_available : 0;
    return {
      bloodGroup: bg,
      units,
      isShortage: units < 5,
    };
  });

  const totalBankUnits = bankInventory.reduce((acc, i) => acc + i.units_available, 0);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-slate-200">
      {/* LEFT & CENTER (8 cols) */}
      <div className="lg:col-span-8 space-y-6">
        {/* Header Bar */}
        <div className="p-6 rounded-3xl bg-[#1e1f25] border border-[#292a33] shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase bg-[#00d2c4]/10 text-[#00d2c4] border border-[#00d2c4]/30">
                Authorized Transfusion Facility
              </span>
              <span className="text-xs text-slate-500">License: {currentBank.license_number}</span>
            </div>
            <h1 className="text-xl font-black text-white mt-1.5 tracking-tight">{currentBank.name}</h1>
            <p className="text-xs text-slate-400 mt-0.5">📍 {currentBank.address}, {currentBank.city}</p>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2.5 rounded-2xl bg-[#00d2c4] hover:bg-[#00beaf] text-[#0d1217] font-extrabold text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-[#00d2c4]/20 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Add Stock Lot
          </button>
        </div>

        {/* Stock Chart styled in Dark Card */}
        <div className="p-6 rounded-3xl bg-[#1e1f25] border border-[#292a33] shadow-md space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-extrabold text-white">Inventory Distribution Matrix</h3>
            <span className="text-xs text-slate-400 font-bold">Total: {totalBankUnits} Units</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.08} />
                <XAxis dataKey="bloodGroup" tick={{ fontSize: 11, fill: '#8b8e9b' }} />
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
                <Bar dataKey="units" radius={[8, 8, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.units < 5 ? '#ef4444' : '#00d2c4'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Detailed Table matching 'Patients Management' table */}
        <div className="p-6 rounded-3xl bg-[#1e1f25] border border-[#292a33] shadow-md space-y-4">
          <h3 className="text-base font-extrabold text-white">Full Inventory Matrix</h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#292a33] text-slate-400 font-bold uppercase text-[11px]">
                  <th className="pb-3 px-3">Blood Group</th>
                  <th className="pb-3 px-3">Units Available</th>
                  <th className="pb-3 px-3">Expiry Date</th>
                  <th className="pb-3 px-3">Status</th>
                  <th className="pb-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#262832] font-medium text-slate-300">
                {bankInventory.map(item => (
                  <tr key={item.id} className="hover:bg-[#23242e] transition-colors">
                    <td className="py-3 px-3 font-bold text-white">
                      <span className="px-2.5 py-1 rounded-lg font-black text-xs bg-red-950/80 text-red-400 border border-red-800">
                        {item.blood_group}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-bold text-white text-sm">
                      {editingId === item.id ? (
                        <div className="flex items-center gap-1.5">
                          <input
                            type="number"
                            value={editUnits}
                            onChange={e => setEditUnits(Number(e.target.value))}
                            className="w-16 px-2 py-1 rounded-lg bg-[#16171d] border border-[#282a35] text-xs text-white"
                          />
                          <button
                            onClick={() => handleSaveEdit(item.id)}
                            className="px-2 py-1 bg-[#00d2c4] text-[#0d1217] rounded-md text-[10px] font-bold"
                          >
                            Save
                          </button>
                        </div>
                      ) : (
                        `${item.units_available} Units`
                      )}
                    </td>
                    <td className="py-3 px-3 text-slate-400">{item.expiry_date}</td>
                    <td className="py-3 px-3">
                      {item.units_available < 5 ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-red-950 text-red-400 border border-red-800">
                          Critical
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-[#00d2c4]/15 text-[#00d2c4]">
                          Adequate
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <div className="inline-flex items-center gap-2">
                        <button
                          onClick={() => {
                            setEditingId(item.id);
                            setEditUnits(item.units_available);
                          }}
                          className="p-1 rounded-lg text-slate-400 hover:text-white"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => removeInventoryStock(item.id)}
                          className="p-1 rounded-lg text-red-400 hover:text-red-300"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN (4 cols) */}
      <div className="lg:col-span-4 space-y-6">
        <div className="p-6 rounded-3xl bg-[#1e1f25] border border-[#292a33] shadow-md space-y-4">
          <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Inventory Status</span>
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3.5 rounded-2xl bg-[#16171d] border border-[#282a35]">
              <span className="text-2xl font-black text-white">{totalBankUnits}</span>
              <p className="text-[11px] text-slate-400 mt-1">Total Units</p>
            </div>
            <div className="p-3.5 rounded-2xl bg-[#16171d] border border-[#282a35]">
              <span className="text-2xl font-black text-red-400">{chartData.filter(d => d.units < 5).length}</span>
              <p className="text-[11px] text-slate-400 mt-1">Low Stock Types</p>
            </div>
          </div>
        </div>

        {/* Shortage Watch */}
        <div className="p-6 rounded-3xl bg-[#1e1f25] border border-[#292a33] shadow-md space-y-4">
          <h3 className="text-sm font-extrabold text-white">Shortage Alert Watch</h3>
          <div className="p-3.5 rounded-2xl bg-[#16171d] border border-[#282a35] space-y-2 text-xs">
            <div className="flex items-center gap-2 text-amber-400 font-bold">
              <AlertTriangle className="w-4 h-4" />
              Automated Surveillance
            </div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              When emergency blood search Step 1 queries this bank, stock decrements in real time.
            </p>
          </div>
        </div>
      </div>

      {/* Add Stock Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-3xl bg-[#1e1f25] border border-[#292a33] p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-white">Add Blood Stock Lot</h3>
            <form onSubmit={handleAddStock} className="space-y-3.5">
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Blood Group</label>
                <select
                  value={selectedGroup}
                  onChange={e => setSelectedGroup(e.target.value as BloodGroup)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-[#16171d] border border-[#282a35] text-red-400 font-bold"
                >
                  {bloodGroups.map(bg => <option key={bg} value={bg}>{bg}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Units (Bags)</label>
                <input
                  type="number"
                  min="1"
                  required
                  value={unitsToAdd}
                  onChange={e => setUnitsToAdd(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-[#16171d] border border-[#282a35] text-white"
                />
              </div>
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Expiry Date</label>
                <input
                  type="date"
                  required
                  value={expiryDate}
                  onChange={e => setExpiryDate(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-[#16171d] border border-[#282a35] text-white"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs text-slate-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#00d2c4] text-[#0d1217] font-bold text-xs rounded-xl"
                >
                  Commit Lot
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
