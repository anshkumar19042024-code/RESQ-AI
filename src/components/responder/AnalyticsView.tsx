import React from 'react';
import { Activity, ShieldAlert, CheckCircle2, Clock, BarChart3, RefreshCw, AlertTriangle, TrendingUp } from 'lucide-react';
import { EmergencyCase } from '../../types';

interface AnalyticsViewProps {
  cases: EmergencyCase[];
  onResetDemoData: () => void;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({ cases, onResetDemoData }) => {
  const totalCount = cases.length;
  const activeCount = cases.filter(c => c.status !== 'Resolved').length;
  const resolvedCount = cases.filter(c => c.status === 'Resolved').length;
  const criticalCount = cases.filter(c => c.priority === 'CRITICAL' || c.priority === 'HIGH').length;

  // Group by emergency type
  const typeCounts = {
    accident: cases.filter(c => c.emergencyType === 'accident').length,
    fire: cases.filter(c => c.emergencyType === 'fire').length,
    medical: cases.filter(c => c.emergencyType === 'medical').length,
    crime: cases.filter(c => c.emergencyType === 'crime').length,
    disaster: cases.filter(c => c.emergencyType === 'disaster').length,
    other: cases.filter(c => c.emergencyType === 'other').length,
  };

  // Group by priority
  const priorityCounts = {
    CRITICAL: cases.filter(c => c.priority === 'CRITICAL').length,
    HIGH: cases.filter(c => c.priority === 'HIGH').length,
    MEDIUM: cases.filter(c => c.priority === 'MEDIUM').length,
    LOW: cases.filter(c => c.priority === 'LOW').length,
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner & Reset */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-5 rounded-2xl">
        <div>
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-blue-400" />
            Emergency Intelligence Analytics
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Real-time performance metrics, priority distributions & response velocity
          </p>
        </div>

        <button
          onClick={onResetDemoData}
          className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 font-bold text-white text-xs transition shadow-md"
        >
          <RefreshCw className="w-4 h-4 text-amber-300" />
          <span>Load Standard Demo Dataset</span>
        </button>
      </div>

      {/* Primary Key Performance Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex items-center justify-between shadow-lg">
          <div>
            <span className="text-xs font-semibold text-slate-400 block uppercase">Total Emergencies</span>
            <span className="text-3xl font-black text-white mt-1 block">{totalCount}</span>
            <span className="text-[11px] text-emerald-400 font-medium flex items-center mt-1">
              <TrendingUp className="w-3 h-3 mr-1" /> Logged in system
            </span>
          </div>
          <div className="p-3 bg-blue-500/20 text-blue-400 rounded-xl">
            <Activity className="w-7 h-7" />
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex items-center justify-between shadow-lg">
          <div>
            <span className="text-xs font-semibold text-slate-400 block uppercase">Active Cases</span>
            <span className="text-3xl font-black text-amber-400 mt-1 block">{activeCount}</span>
            <span className="text-[11px] text-amber-300 font-medium">Pending or En Route</span>
          </div>
          <div className="p-3 bg-amber-500/20 text-amber-400 rounded-xl">
            <ShieldAlert className="w-7 h-7" />
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex items-center justify-between shadow-lg">
          <div>
            <span className="text-xs font-semibold text-slate-400 block uppercase">Resolved Today</span>
            <span className="text-3xl font-black text-emerald-400 mt-1 block">{resolvedCount}</span>
            <span className="text-[11px] text-emerald-400 font-medium">100% Success rate</span>
          </div>
          <div className="p-3 bg-emerald-500/20 text-emerald-400 rounded-xl">
            <CheckCircle2 className="w-7 h-7" />
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex items-center justify-between shadow-lg">
          <div>
            <span className="text-xs font-semibold text-slate-400 block uppercase">Avg Response Time</span>
            <span className="text-3xl font-black text-indigo-300 mt-1 block">6.4 <span className="text-sm font-normal">min</span></span>
            <span className="text-[11px] text-indigo-400 font-medium">AI Optimization Target: &lt;8 min</span>
          </div>
          <div className="p-3 bg-indigo-500/20 text-indigo-400 rounded-xl">
            <Clock className="w-7 h-7" />
          </div>
        </div>

      </div>

      {/* Visual Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Cases by Emergency Type Bar Chart */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center justify-between">
            <span>Emergencies by Category</span>
            <span className="text-xs font-mono text-slate-400">Total: {totalCount}</span>
          </h3>

          <div className="space-y-3 pt-2">
            {[
              { type: 'Road Accident', count: typeCounts.accident, icon: '🚗', color: 'bg-red-500' },
              { type: 'Medical Emergency', count: typeCounts.medical, icon: '🏥', color: 'bg-blue-500' },
              { type: 'Fire Outbreak', count: typeCounts.fire, icon: '🔥', color: 'bg-orange-500' },
              { type: 'Crime & Safety', count: typeCounts.crime, icon: '🚔', color: 'bg-indigo-500' },
              { type: 'Natural Disaster', count: typeCounts.disaster, icon: '🌊', color: 'bg-cyan-500' },
            ].map((item) => {
              const pct = totalCount > 0 ? Math.round((item.count / totalCount) * 100) : 0;

              return (
                <div key={item.type} className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-slate-300 flex items-center gap-1.5">
                      <span>{item.icon}</span>
                      <span>{item.type}</span>
                    </span>
                    <span className="font-mono text-slate-400">{item.count} cases ({pct}%)</span>
                  </div>
                  <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div
                      style={{ width: `${Math.max(5, pct)}%` }}
                      className={`h-full ${item.color} rounded-full transition-all duration-1000`}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Priority Breakdown & SLA Targets */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center justify-between">
            <span>Priority Level Distribution</span>
            <span className="text-xs font-mono text-red-400 font-bold">{criticalCount} High Risk</span>
          </h3>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="p-4 rounded-xl bg-red-950/40 border border-red-800/50 space-y-1">
              <span className="text-xs font-bold text-red-400 block">🔴 CRITICAL</span>
              <span className="text-2xl font-black text-white">{priorityCounts.CRITICAL}</span>
              <span className="text-[10px] text-red-300 block">Immediate &lt; 5 min dispatch</span>
            </div>

            <div className="p-4 rounded-xl bg-orange-950/40 border border-orange-800/50 space-y-1">
              <span className="text-xs font-bold text-orange-400 block">🟠 HIGH</span>
              <span className="text-2xl font-black text-white">{priorityCounts.HIGH}</span>
              <span className="text-[10px] text-orange-300 block">Priority &lt; 8 min dispatch</span>
            </div>

            <div className="p-4 rounded-xl bg-amber-950/40 border border-amber-800/50 space-y-1">
              <span className="text-xs font-bold text-amber-400 block">🟡 MEDIUM</span>
              <span className="text-2xl font-black text-white">{priorityCounts.MEDIUM}</span>
              <span className="text-[10px] text-amber-300 block">Standard &lt; 15 min dispatch</span>
            </div>

            <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-800/50 space-y-1">
              <span className="text-xs font-bold text-emerald-400 block">🟢 LOW</span>
              <span className="text-2xl font-black text-white">{priorityCounts.LOW}</span>
              <span className="text-[10px] text-emerald-300 block">Non-urgent assistance</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
