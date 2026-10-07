import React, { useState } from 'react';
import { ShieldAlert, MapPin, Users, CheckCircle, Clock, Truck, AlertTriangle, Phone, Sparkles, Navigation, X } from 'lucide-react';
import { EmergencyCase, Responder } from '../../types';
import { getStoredResponders, updateCaseStatus } from '../../utils/storage';
import { recommendBestResponder } from '../../utils/aiEngine';
import { MapView } from './MapView';

interface CaseDetailModalProps {
  caseItem: EmergencyCase;
  onClose: () => void;
  onCaseUpdated: () => void;
}

export const CaseDetailModal: React.FC<CaseDetailModalProps> = ({
  caseItem,
  onClose,
  onCaseUpdated
}) => {
  const responders = getStoredResponders();
  const recommended = recommendBestResponder(caseItem, responders);

  const [selectedResponder, setSelectedResponder] = useState<Responder | undefined>(
    caseItem.assignedResponder || recommended
  );

  const handleAction = (newStatus: EmergencyCase['status']) => {
    updateCaseStatus(caseItem.id, newStatus, selectedResponder);
    onCaseUpdated();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 text-white rounded-3xl max-w-4xl w-full my-auto shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="p-5 sm:p-6 bg-slate-950 border-b border-slate-800 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center space-x-3">
            <div className={`p-3 rounded-2xl ${
              caseItem.priority === 'CRITICAL' ? 'bg-red-600/20 text-red-500 border border-red-500/40' :
              caseItem.priority === 'HIGH' ? 'bg-orange-600/20 text-orange-400 border border-orange-500/40' :
              'bg-blue-600/20 text-blue-400 border border-blue-500/40'
            }`}>
              <ShieldAlert className="w-7 h-7 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-xl sm:text-2xl font-black text-white">
                  Emergency Case #{caseItem.id}
                </h2>
                <span className={`px-3 py-0.5 rounded-full text-xs font-black tracking-wider ${
                  caseItem.priority === 'CRITICAL' ? 'bg-red-600 text-white' :
                  caseItem.priority === 'HIGH' ? 'bg-orange-600 text-white' :
                  caseItem.priority === 'MEDIUM' ? 'bg-amber-400 text-slate-950' : 'bg-emerald-600 text-white'
                }`}>
                  {caseItem.priority} PRIORITY
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Reported: {new Date(caseItem.createdAt).toLocaleString()} • Category: <strong className="text-slate-200 capitalize">{caseItem.emergencyType}</strong>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1">
          
          {/* Status Escalation Banner (if Escalated) */}
          {caseItem.status === 'Escalated' && (
            <div className="p-4 bg-red-950/70 border border-red-700/80 rounded-2xl flex items-center justify-between text-red-200 text-xs sm:text-sm animate-pulse">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0" />
                <span className="font-extrabold">⚠️ CASE ESCALATED — CONTROL ROOM ATTENTION REQUIRED</span>
              </div>
            </div>
          )}

          {/* AI Intelligence Summary Block */}
          <div className="bg-slate-800/90 border border-slate-700 rounded-2xl p-5 space-y-3 shadow-md">
            <div className="flex items-center justify-between border-b border-slate-700/80 pb-3">
              <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5 uppercase tracking-wider">
                <Sparkles className="w-4 h-4" /> ResQ AI Case Intelligence Summary
              </span>
              <span className="text-xs font-bold px-2 py-0.5 rounded bg-indigo-900/60 text-indigo-300 border border-indigo-700/50">
                Confidence: {caseItem.confidence} (96%)
              </span>
            </div>

            <p className="text-sm sm:text-base font-semibold text-white leading-relaxed">
              "{caseItem.aiSummary}"
            </p>

            <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 text-xs text-slate-300 font-mono">
              <strong className="text-amber-300 font-sans">Priority Calculation Explanation:</strong> {caseItem.priorityReason}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
              <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800">
                <span className="text-slate-400 block font-medium">Location</span>
                <span className="font-bold text-white flex items-center gap-1 mt-0.5">
                  <MapPin className="w-4 h-4 text-red-400 flex-shrink-0" />
                  {caseItem.location.address}
                </span>
              </div>

              <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800">
                <span className="text-slate-400 block font-medium">Casualties / Affected</span>
                <span className="font-bold text-white flex items-center gap-1 mt-0.5">
                  <Users className="w-4 h-4 text-blue-400 flex-shrink-0" />
                  {caseItem.peopleAffected} Individual(s) Reported
                </span>
              </div>
            </div>

            <div className="p-3.5 bg-blue-950/40 rounded-xl border border-blue-800/40 text-xs">
              <span className="text-blue-300 font-bold block mb-1">Recommended Response Strategy:</span>
              <span className="text-slate-200">{caseItem.recommendedResponse}</span>
            </div>
          </div>

          {/* Interactive Tactical Location Map Preview */}
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-slate-300 flex items-center gap-1.5">
              <Navigation className="w-4 h-4 text-blue-400" />
              Incident Tactical Map Location
            </h3>
            <MapView
              cases={[caseItem]}
              responders={responders}
              selectedCase={caseItem}
              heightClass="h-56"
            />
          </div>

          {/* Responder Recommendation & Selection Engine */}
          <div className="bg-slate-800/90 border border-slate-700 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Truck className="w-4 h-4 text-emerald-400" />
                Select Responder Unit for Assignment
              </h3>
              <span className="text-xs text-slate-400 font-mono">
                {responders.filter(r => r.status === 'Available').length} Available Nearby
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {responders.map((r) => {
                const isRecommended = recommended?.id === r.id;
                const isSelected = selectedResponder?.id === r.id;

                return (
                  <div
                    key={r.id}
                    onClick={() => setSelectedResponder(r)}
                    className={`p-3.5 rounded-xl border-2 cursor-pointer transition relative flex flex-col justify-between space-y-2 ${
                      isSelected
                        ? 'bg-emerald-950/60 border-emerald-500 text-white ring-2 ring-emerald-500/30'
                        : 'bg-slate-900 border-slate-800 hover:border-slate-700 text-slate-300'
                    }`}
                  >
                    {isRecommended && (
                      <span className="absolute -top-2.5 right-3 px-2 py-0.5 rounded-full bg-amber-500 text-slate-950 font-black text-[10px] shadow">
                        ★ RECOMMENDED MATCH
                      </span>
                    )}

                    <div className="flex items-start justify-between">
                      <div>
                        <span className="font-extrabold text-sm text-white block">{r.name}</span>
                        <span className="text-xs text-slate-400">{r.capability} • {r.vehicleNumber}</span>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-emerald-400 border border-emerald-800">
                        {r.status}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs font-mono border-t border-slate-800/80 pt-2 text-slate-400">
                      <span>📍 {r.distanceKm} km away</span>
                      <span className="font-bold text-amber-400">ETA: ~{r.etaMinutes} mins</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Case Audit Timeline */}
          <div className="bg-slate-800/90 border border-slate-700 rounded-2xl p-5 space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-400" />
              Dynamic Case Action Audit Trail
            </h3>

            <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
              {caseItem.timeline.map((ev, idx) => (
                <div key={ev.id || idx} className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs flex items-center justify-between">
                  <div>
                    <span className="font-bold text-white block">{ev.title}</span>
                    {ev.description && <span className="text-slate-400 text-[11px] block">{ev.description}</span>}
                  </div>
                  <div className="text-right flex-shrink-0 ml-2">
                    <span className="font-mono text-slate-400 block">{ev.timestamp}</span>
                    <span className="text-[10px] font-semibold text-indigo-400">{ev.actor || 'System'}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Footer Responder Action Buttons */}
        <div className="p-5 bg-slate-950 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 flex-shrink-0">
          <button
            type="button"
            onClick={() => handleAction('Escalated')}
            className="px-4 py-2.5 rounded-xl bg-red-950/80 hover:bg-red-900 border border-red-700/80 text-red-200 text-xs font-bold transition flex items-center space-x-1.5"
          >
            <AlertTriangle className="w-4 h-4 text-red-400" />
            <span>Simulate Escalation</span>
          </button>

          <div className="flex flex-wrap items-center space-x-2">
            {caseItem.status === 'Pending' && (
              <button
                type="button"
                onClick={() => handleAction('Assigned')}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-xl shadow-lg transition"
              >
                ✓ Accept & Assign Responder
              </button>
            )}

            {caseItem.status === 'Assigned' && (
              <button
                type="button"
                onClick={() => handleAction('En Route')}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs rounded-xl shadow-lg transition"
              >
                🚚 Start Response (En Route)
              </button>
            )}

            {caseItem.status === 'En Route' && (
              <button
                type="button"
                onClick={() => handleAction('Arrived')}
                className="px-5 py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-xs rounded-xl shadow-lg transition"
              >
                📍 Mark Arrived on Scene
              </button>
            )}

            {(caseItem.status === 'Arrived' || caseItem.status === 'Escalated') && (
              <button
                type="button"
                onClick={() => handleAction('Resolved')}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-xl shadow-lg transition"
              >
                ✅ Mark Case Resolved
              </button>
            )}

            {caseItem.status === 'Resolved' && (
              <span className="px-4 py-2 rounded-xl bg-emerald-900/50 text-emerald-300 text-xs font-bold border border-emerald-700">
                ✓ Case Resolved & Archived
              </span>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
