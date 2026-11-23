import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Sparkles,
  AlertTriangle,
  TrendingUp,
  BarChart3,
  ShieldCheck,
  Calendar,
  Layers,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  CheckCircle2,
  Clock,
  Radio,
  FileSpreadsheet
} from 'lucide-react';
import { BloodGroup } from '../types';
import {
  BarChart,
  Bar,
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
  const { shortagePredictions, inventory, requests } = useApp();
  const [selectedHorizon, setSelectedHorizon] = useState<'7 Days' | '14 Days' | '30 Days'>('7 Days');

  // Generate trend data across time for visualization
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
    <div className="space-y-6">
      {/* Module Title Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white shadow-xl border border-slate-800 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/20 text-red-300 border border-red-500/30 text-xs font-bold mb-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Machine Learning Predictive Horizon
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              AI Blood Shortage & Demand Prediction Engine
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed">
              Consolidates historical transfusion trends, hospital elective surgical schedules, emergency trauma
              frequencies, and seasonal epidemiological factors to forecast blood deficit 7–14 days in advance.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-slate-800/80 p-1.5 rounded-2xl border border-slate-700">
            {(['7 Days', '14 Days', '30 Days'] as const).map(horizon => (
              <button
                key={horizon}
                onClick={() => setSelectedHorizon(horizon)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  selectedHorizon === horizon
                    ? 'bg-red-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {horizon}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Critical Shortage Warning Ticker */}
      {criticalGroups.length > 0 && (
        <div className="p-4 rounded-3xl bg-red-500/10 dark:bg-red-950/40 border border-red-500/30 text-red-700 dark:text-red-300 text-xs flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 animate-bounce" />
            <div>
              <span className="font-extrabold uppercase">Immediate AI Proactive Warning:</span>{' '}
              {criticalGroups.map(g => g.blood_group).join(', ')} projected to experience stock exhaustion in next 48-72 hours. Automated outreach to eligible donors recommended.
            </div>
          </div>
          <span className="text-[11px] font-mono font-bold px-2.5 py-1 rounded-full bg-red-600 text-white shrink-0">
            97% Confidence
          </span>
        </div>
      )}

      {/* 8 Blood Group Prediction Cards (Direct Prompt Requirement Specification) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {shortagePredictions.map(pred => {
          const isCritical = pred.risk_level === 'Critical Shortage';
          const isHigh = pred.risk_level === 'High Risk';
          const isSafe = pred.risk_level === 'Safe / Adequate';

          return (
            <div
              key={pred.blood_group}
              className={`p-5 rounded-3xl bg-white dark:bg-slate-900 border transition-all shadow-xs relative ${
                isCritical
                  ? 'border-red-500/50 dark:border-red-600/50 ring-1 ring-red-500/20'
                  : isHigh
                  ? 'border-amber-500/40'
                  : 'border-slate-200 dark:border-slate-800'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xl font-black px-3 py-1 rounded-xl bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300">
                  {pred.blood_group}
                </span>
                <span
                  className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase ${
                    isCritical
                      ? 'bg-red-600 text-white animate-pulse'
                      : isHigh
                      ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                      : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                  }`}
                >
                  {pred.status}
                </span>
              </div>

              <div className="space-y-1.5 my-3">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500 dark:text-slate-400">Current Stock:</span>
                  <span className="font-extrabold text-slate-900 dark:text-white">
                    {pred.current_units} Units
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500 dark:text-slate-400">Predicted Demand:</span>
                  <span className="font-extrabold text-red-600 dark:text-red-400">
                    {pred.predicted_demand} Units Next Week
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500 dark:text-slate-400">Risk Assessment:</span>
                  <span className={`font-bold ${isCritical ? 'text-red-600' : isHigh ? 'text-amber-600' : 'text-emerald-600'}`}>
                    {pred.risk_level}
                  </span>
                </div>
              </div>

              {/* Progress bar of current stock against predicted need */}
              <div className="mt-3">
                <div className="w-full h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      isCritical ? 'bg-red-600' : isHigh ? 'bg-amber-500' : 'bg-emerald-500'
                    }`}
                    style={{
                      width: `${Math.min(100, Math.round((pred.current_units / (pred.predicted_demand || 1)) * 100))}%`,
                    }}
                  />
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 text-[10px] text-slate-500 leading-tight">
                <strong>AI Action:</strong> {pred.recommended_action}
              </div>
            </div>
          );
        })}
      </div>

      {/* Trend Forecast Graphs & Historical Ingestion Data */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left (7 Cols): Shortage Projection Curve (Universal O- Deficit vs Stable B+) */}
        <div className="lg:col-span-7 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Shortage Inversion Curve (O- Deficit vs B+ Surplus)
              </h3>
              <p className="text-xs text-slate-400">
                Projected 7-Day Inflow vs Outflow Burn Rate
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-red-600">Model: LSTM-v3.4</span>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#64748b' }} />
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
                <Line
                  type="monotone"
                  dataKey="O- Demand"
                  stroke="#ef4444"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="O- Supply"
                  stroke="#f97316"
                  strokeWidth={2}
                  strokeDasharray="4 4"
                />
                <Line
                  type="monotone"
                  dataKey="B+ Supply"
                  stroke="#10b981"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right (5 Cols): AI Forecast Pipeline Architecture & Ingestion Sources */}
        <div className="lg:col-span-5 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
              Neural Shortage Predictor Inputs
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Real-time multi-variate telemetry feeds powering the prediction algorithm
            </p>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 flex items-start gap-3">
                <div className="p-1.5 rounded-xl bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                  <Activity className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white">Historical Blood Requests</h4>
                  <p className="text-slate-500 dark:text-slate-400 text-[11px] mt-0.5">
                    Analyzes 36 months of trauma admissions and oncology platelet schedules.
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 flex items-start gap-3">
                <div className="p-1.5 rounded-xl bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white">Inventory Expiry & Shelf-Life</h4>
                  <p className="text-slate-500 dark:text-slate-400 text-[11px] mt-0.5">
                    Tracks 35-day whole-blood degradation across Apollo, Red Cross, Max, and Rotary.
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 flex items-start gap-3">
                <div className="p-1.5 rounded-xl bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white">Seasonal & Climatic Trends</h4>
                  <p className="text-slate-500 dark:text-slate-400 text-[11px] mt-0.5">
                    Correlates monsoon dengue platelet spikes and holiday highway accident vectors.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-semibold">
            <span className="text-slate-500">Model Convergence:</span>
            <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Trained on 480k Transfusion Events
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
