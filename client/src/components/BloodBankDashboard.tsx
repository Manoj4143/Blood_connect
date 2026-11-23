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
  CheckCircle2
} from 'lucide-react';
import { BloodGroup, InventoryItem } from '../types';
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
    shortagePredictions,
  } = useApp();

  // Pick current blood bank or fallback to first
  const currentBank = bloodBanks.find(b => b.id === currentUser.id) || bloodBanks[0];

  const bankInventory = inventory.filter(i => i.blood_bank_id === currentBank.id);

  // Modal / form states for Add Stock
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<BloodGroup>('O+');
  const [unitsToAdd, setUnitsToAdd] = useState<number>(10);
  const [expiryDate, setExpiryDate] = useState<string>(() => {
    const d = new Date();
    d.setDate(d.getDate() + 35); // standard ~35-42 days shelf life for RBC
    return d.toISOString().split('T')[0];
  });

  // Edit stock inline
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

  // Prepare chart data
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
    <div className="space-y-6">
      {/* Header with Blood Bank Info */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-200 border border-amber-300 dark:border-amber-700">
                Authorized Transfusion Facility
              </span>
              <span className="text-xs text-slate-400">License: {currentBank.license_number}</span>
            </div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white mt-1">
              {currentBank.name}
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex flex-wrap items-center gap-3">
              <span>📍 {currentBank.address}, {currentBank.city}</span>
              <span>📞 {currentBank.phone}</span>
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md shadow-red-600/20 flex items-center gap-1.5 transition-all"
            >
              <Plus className="w-4 h-4" />
              Add Stock Entry
            </button>
          </div>
        </div>
      </div>

      {/* Overview Metric Tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Available Inventory</span>
          <div className="text-3xl font-black text-slate-900 dark:text-white mt-1">
            {totalBankUnits} <span className="text-sm font-semibold text-slate-400">Units</span>
          </div>
          <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium mt-1">
            Component testing & refrigeration validated (4°C)
          </p>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Critical Low Stock Groups</span>
          <div className="text-3xl font-black text-red-600 mt-1">
            {chartData.filter(d => d.units < 5).length}{' '}
            <span className="text-sm font-semibold text-slate-400">Groups Below Threshold</span>
          </div>
          <p className="text-[11px] text-red-500 mt-1">
            Requires urgent donor mobilization camp scheduling
          </p>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Shortage Alert Status</span>
          <div className="text-2xl font-black text-amber-600 dark:text-amber-400 mt-1 flex items-center gap-2">
            <AlertTriangle className="w-6 h-6 text-amber-500" />
            Active Surveillance
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            AI Shortage model synchronized with regional emergency requests
          </p>
        </div>
      </div>

      {/* Inventory Bar Chart & Analytics */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Inventory Distribution & Stock Level Chart
            </h3>
            <p className="text-xs text-slate-400">
              Red bars indicate critically depleted stock (&lt; 5 units)
            </p>
          </div>
          <span className="text-xs font-semibold px-2 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
            Real-Time Units
          </span>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
              <XAxis dataKey="bloodGroup" tick={{ fontSize: 12, fill: '#64748b' }} />
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
              <Bar dataKey="units" radius={[8, 8, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.units < 5 ? '#ef4444' : '#3b82f6'}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Inventory Detailed Data Table */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Full Inventory Matrix & Expiry Management
          </h3>
          <span className="text-xs text-slate-400">
            {bankInventory.length} Managed Component Lots
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 font-semibold uppercase tracking-wider">
                <th className="pb-3 px-3">Blood Group</th>
                <th className="pb-3 px-3">Units Available</th>
                <th className="pb-3 px-3">Expiry Date</th>
                <th className="pb-3 px-3">Status</th>
                <th className="pb-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium text-slate-700 dark:text-slate-300">
              {bankInventory.map(item => {
                const isShortage = item.units_available < 5;
                const isEditingThis = editingId === item.id;

                return (
                  <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="py-3 px-3">
                      <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg font-black text-xs bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300">
                        {item.blood_group}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      {isEditingThis ? (
                        <div className="flex items-center gap-1.5">
                          <input
                            type="number"
                            min="0"
                            value={editUnits}
                            onChange={e => setEditUnits(Number(e.target.value))}
                            className="w-16 px-2 py-1 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                          />
                          <button
                            onClick={() => handleSaveEdit(item.id)}
                            className="px-2 py-1 bg-emerald-600 text-white rounded-md text-[10px] font-bold"
                          >
                            Save
                          </button>
                        </div>
                      ) : (
                        <span className="font-bold text-sm text-slate-900 dark:text-white">
                          {item.units_available} Units
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-3">
                      <span className="flex items-center gap-1.5 text-slate-500">
                        <Calendar className="w-3.5 h-3.5" />
                        {item.expiry_date}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      {isShortage ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-300">
                          Critical Shortage
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
                          Normal Reserve
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
                          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                          title="Edit Stock"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => removeInventoryStock(item.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
                          title="Remove Stock"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Stock Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-6">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
              Add Blood Inventory Lot
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Enter component testing units to append to facility reserve.
            </p>

            <form onSubmit={handleAddStock} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Blood Group
                </label>
                <select
                  value={selectedGroup}
                  onChange={e => setSelectedGroup(e.target.value as BloodGroup)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold text-red-600"
                >
                  {bloodGroups.map(bg => (
                    <option key={bg} value={bg}>{bg}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Units Available (Bags / 450ml)
                </label>
                <input
                  type="number"
                  min="1"
                  required
                  value={unitsToAdd}
                  onChange={e => setUnitsToAdd(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Expiration Date
                </label>
                <input
                  type="date"
                  required
                  value={expiryDate}
                  onChange={e => setExpiryDate(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 dark:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md"
                >
                  Commit to Stock
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
