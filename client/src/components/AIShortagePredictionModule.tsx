import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Sparkles,
  AlertTriangle,
  Clock,
  Activity,
  CheckCircle2,
  Calendar,
  Layers,
  Search
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

export const AIShortagePredictionModule: React.FC = () => {
  const { shortagePredictions } = useApp();
  const [selectedHorizon, setSelectedHorizon] = useState<'7 Days' | '14 Days' | '30 Days'>('7 Days');

  const trendData = [
    { day: 'Day 1', 'O- Demand': 18, 'O- Supply': 22, 'B+ Demand': 28, 'B+ Supply': 55 },
    { day: 'Day 2', 'O- Demand': 24, 'O- Supply': 20, 'B+ Demand': 31, 'B+ Supply': 52 },
    { day: 'Day 3', 'O- Demand': 32, 'O- Supply': 16, 'B+ Demand': 33, 'B+ Supply': 49 },
    { day: 'Day 4', 'O- Demand': 38, 'O- Supply': 12, 'B+ Demand': 35, 'B+ Supply': 47 },
    { day: 'Day 5', 'O- Demand': 42, 'O- Supply': 9, 'B+ Demand': 38, 'B+ Supply': 45 },
    { day: 'Day 6', 'O- Demand': 45, 'O- Supply': 7, 'B+ Demand': 40, 'B+ Supply': 44 },
    { day: 'Day 7', 'O- Demand': 48, 'O- Supply': 5, 'B+ Demand': 42, 'B+ Supply': 42 },
  ];

  const criticalGroups = shortagePredictions.filter(
    p => p.risk_level === 'Critical Shortage' || p.risk_level === 'High Risk'
  );

  return (
    <div className="space-y-6 text-slate-200">
      {/* Title Bar styled in Dark Card */}
      <div className="p-6 rounded-3xl bg-[#1e1f25] border border-[#292a33] shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-[#00d2c4]/10 text-[#00d2c4] border border-[#00d2c4]/30 text-[10px] font-bold uppercase mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            AI Predictive Engine
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            AI Blood Shortage & Demand Prediction
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">
            Multi-variate predictive analysis calculating depletion risk and emergency forecast.
          </p>
        </div>

        <div className="flex items-center gap-1.5 p-1 bg-[#16171d] rounded-2xl border border-[#282a35]">
          {(['7 Days', '14 Days', '30 Days'] as const).map(horizon => (
            <button
              key={horizon}
              onClick={() => setSelectedHorizon(horizon)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedHorizon === horizon
                  ? 'bg-[#00d2c4] text-[#0d1217] shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {horizon}
            </button>
          ))}
        </div>
      </div>

      {criticalGroups.length > 0 && (
        <div className="p-4 rounded-2xl bg-red-950/40 border border-red-800 text-red-400 text-xs flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 shrink-0 animate-bounce" />
            <span>
              <strong>Immediate AI Proactive Warning:</strong> {criticalGroups.map(g => g.blood_group).join(', ')} projected for stockout within 48-72h.
            </span>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-red-600 text-white font-mono font-bold text-[10px] shrink-0">
            97% Confidence
          </span>
        </div>
      )}

      {/* 8 Blood Group Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {shortagePredictions.map(pred => {
          const isCritical = pred.risk_level === 'Critical Shortage';
          const isHigh = pred.risk_level === 'High Risk';

          return (
            <div
              key={pred.blood_group}
              className={`p-5 rounded-3xl bg-[#1e1f25] border transition-all ${
                isCritical
                  ? 'border-red-500/60 ring-1 ring-red-500/30'
                  : isHigh
                  ? 'border-amber-500/50'
                  : 'border-[#292a33]'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xl font-black px-2.5 py-1 rounded-xl bg-[#16171d] text-white border border-[#282a35]">
                  {pred.blood_group}
                </span>
                <span
                  className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase ${
                    isCritical ? 'bg-red-950 text-red-400 border border-red-800' : 'bg-[#00d2c4]/15 text-[#00d2c4]'
                  }`}
                >
                  {pred.status}
                </span>
              </div>

              <div className="space-y-1.5 my-3 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">Current Stock:</span>
                  <span className="font-extrabold text-white">{pred.current_units} Units</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Predicted Demand:</span>
                  <span className="font-extrabold text-red-400">{pred.predicted_demand} Units</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Risk Level:</span>
                  <span className={`font-bold ${isCritical ? 'text-red-400' : isHigh ? 'text-amber-400' : 'text-[#00d2c4]'}`}>
                    {pred.risk_level}
                  </span>
                </div>
              </div>

              <div className="w-full h-1.5 rounded-full bg-[#16171d] overflow-hidden mt-3">
                <div
                  className={`h-full rounded-full ${isCritical ? 'bg-red-500' : isHigh ? 'bg-amber-400' : 'bg-[#00d2c4]'}`}
                  style={{ width: `${Math.min(100, Math.round((pred.current_units / (pred.predicted_demand || 1)) * 100))}%` }}
                />
              </div>

              <p className="mt-3 pt-3 border-t border-[#292a33] text-[10px] text-slate-400 leading-tight">
                <strong>Action:</strong> {pred.recommended_action}
              </p>
            </div>
          );
        })}
      </div>

      {/* Projection Graph */}
      <div className="p-6 rounded-3xl bg-[#1e1f25] border border-[#292a33] shadow-md space-y-4">
        <h3 className="text-base font-extrabold text-white">Shortage Forecast Inversion Curve</h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trendData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.08} />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#8b8e9b' }} />
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
              <Line type="monotone" dataKey="O- Demand" stroke="#ef4444" strokeWidth={3} />
              <Line type="monotone" dataKey="O- Supply" stroke="#f97316" strokeWidth={2} strokeDasharray="4 4" />
              <Line type="monotone" dataKey="B+ Supply" stroke="#00d2c4" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
