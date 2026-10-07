import React, { useState } from 'react';
import { Activity, ShieldAlert, Truck, CheckCircle2, ListFilter, MapPin, BarChart3, Users, RefreshCw } from 'lucide-react';
import { EmergencyCase, Responder } from '../../types';
import { getStoredResponders } from '../../utils/storage';
import { CaseListView } from './CaseListView';
import { MapView } from './MapView';
import { AnalyticsView } from './AnalyticsView';
import { CaseDetailModal } from './CaseDetailModal';

interface ResponderDashboardProps {
  cases: EmergencyCase[];
  onRefreshCases: () => void;
  selectedCase: EmergencyCase | null;
  setSelectedCase: (c: EmergencyCase | null) => void;
}

export const ResponderDashboard: React.FC<ResponderDashboardProps> = ({
  cases,
  onRefreshCases,
  selectedCase,
  setSelectedCase
}) => {
  const [activeTab, setActiveTab] = useState<'cases' | 'map' | 'responders' | 'analytics'>('cases');
  const responders = getStoredResponders();

  const activeCount = cases.filter(c => c.status !== 'Resolved').length;
  const highPriorityCount = cases.filter(c => (c.priority === 'CRITICAL' || c.priority === 'HIGH') && c.status !== 'Resolved').length;
  const availableRespondersCount = responders.filter(r => r.status === 'Available').length;
  const resolvedTodayCount = cases.filter(c => c.status === 'Resolved').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Dashboard Top Stats Banner */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-slate-900 border border-slate-800 p-4 sm:p-5 rounded-2xl flex items-center justify-between shadow-lg">
          <div>
            <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider block">🚨 Active Cases</span>
            <span className="text-2xl sm:text-3xl font-black text-white mt-1 block">{activeCount}</span>
          </div>
          <div className="p-3 bg-red-600/20 text-red-500 rounded-xl border border-red-500/30">
            <Activity className="w-6 h-6 animate-pulse" />
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 sm:p-5 rounded-2xl flex items-center justify-between shadow-lg">
          <div>
            <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider block">🔴 High/Critical</span>
            <span className="text-2xl sm:text-3xl font-black text-orange-400 mt-1 block">{highPriorityCount}</span>
          </div>
          <div className="p-3 bg-orange-600/20 text-orange-400 rounded-xl border border-orange-500/30">
            <ShieldAlert className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 sm:p-5 rounded-2xl flex items-center justify-between shadow-lg">
          <div>
            <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider block">🚑 Available Responders</span>
            <span className="text-2xl sm:text-3xl font-black text-emerald-400 mt-1 block">{availableRespondersCount} / {responders.length}</span>
          </div>
          <div className="p-3 bg-emerald-600/20 text-emerald-400 rounded-xl border border-emerald-500/30">
            <Truck className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 sm:p-5 rounded-2xl flex items-center justify-between shadow-lg">
          <div>
            <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider block">✅ Resolved Today</span>
            <span className="text-2xl sm:text-3xl font-black text-blue-400 mt-1 block">{resolvedTodayCount}</span>
          </div>
          <div className="p-3 bg-blue-600/20 text-blue-400 rounded-xl border border-blue-500/30">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

      </div>

      {/* Tab Navigation */}
      <div className="flex items-center space-x-2 border-b border-slate-800 pb-3 overflow-x-auto">
        <button
          onClick={() => setActiveTab('cases')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold transition ${
            activeTab === 'cases'
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
              : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
          }`}
        >
          <ListFilter className="w-4 h-4" />
          <span>Live Cases ({cases.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('map')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold transition ${
            activeTab === 'map'
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
              : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
          }`}
        >
          <MapPin className="w-4 h-4 text-red-400" />
          <span>Tactical Map Grid</span>
        </button>

        <button
          onClick={() => setActiveTab('responders')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold transition ${
            activeTab === 'responders'
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
              : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
          }`}
        >
          <Truck className="w-4 h-4 text-emerald-400" />
          <span>Responder Fleet ({responders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('analytics')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold transition ${
            activeTab === 'analytics'
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
              : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
          }`}
        >
          <BarChart3 className="w-4 h-4 text-indigo-400" />
          <span>Analytics & Intelligence</span>
        </button>
      </div>

      {/* Tab Content Panels */}
      {activeTab === 'cases' && (
        <CaseListView
          cases={cases}
          onSelectCase={(c) => setSelectedCase(c)}
        />
      )}

      {activeTab === 'map' && (
        <MapView
          cases={cases}
          responders={responders}
          selectedCase={selectedCase}
          onSelectCase={(c) => setSelectedCase(c)}
        />
      )}

      {activeTab === 'responders' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {responders.map((r) => (
            <div key={r.id} className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-3 shadow-lg">
              <div className="flex items-center justify-between">
                <span className="text-2xl">
                  {r.type === 'medical' ? '🚑' : r.type === 'police' ? '🚔' : r.type === 'fire' ? '🔥' : '🛟'}
                </span>
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">
                  {r.status}
                </span>
              </div>
              <div>
                <h3 className="font-extrabold text-white text-base">{r.name}</h3>
                <p className="text-xs text-slate-400">{r.capability} • Reg: {r.vehicleNumber}</p>
              </div>
              <div className="pt-2 border-t border-slate-800 text-xs text-slate-300 font-mono space-y-1">
                <p>📍 Base: {r.locationName}</p>
                <p>📞 Phone: {r.phone}</p>
                <p>⚡ Distance to center: {r.distanceKm} km (~{r.etaMinutes} min ETA)</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'analytics' && (
        <AnalyticsView
          cases={cases}
          onResetDemoData={onRefreshCases}
        />
      )}

      {/* Case Details Modal */}
      {selectedCase && (
        <CaseDetailModal
          caseItem={selectedCase}
          onClose={() => setSelectedCase(null)}
          onCaseUpdated={() => {
            onRefreshCases();
            // Re-fetch selected case to show updated status
            const fresh = cases.find(c => c.id === selectedCase.id);
            if (fresh) setSelectedCase(fresh);
          }}
        />
      )}

    </div>
  );
};
