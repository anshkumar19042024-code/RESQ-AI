import React from 'react';
import { CheckCircle2, Clock, MapPin, PhoneCall, Volume2, Shield, ArrowLeft, AlertTriangle } from 'lucide-react';
import { EmergencyCase, Language } from '../../types';
import { translations } from '../../utils/translations';
import { speakText } from '../../utils/speech';

interface CitizenStatusViewProps {
  lang: Language;
  caseItem: EmergencyCase;
  onBackToHome: () => void;
}

export const CitizenStatusView: React.FC<CitizenStatusViewProps> = ({
  lang,
  caseItem,
  onBackToHome
}) => {
  const t = translations[lang];

  const handleAudioRead = () => {
    const text = `Emergency Report ${caseItem.id}. Status is currently ${caseItem.status}. Priority rated as ${caseItem.priority}. Location: ${caseItem.location.address}.`;
    speakText(text, lang);
  };

  const getStepState = (stepKey: 'Submitted' | 'AiCreated' | 'Assigned' | 'EnRoute' | 'Arrived' | 'Resolved') => {
    const s = caseItem.status;
    if (stepKey === 'Submitted') return 'complete';
    if (stepKey === 'AiCreated') return 'complete';

    if (stepKey === 'Assigned') {
      if (s === 'Assigned' || s === 'En Route' || s === 'Arrived' || s === 'Resolved') return 'complete';
      if (s === 'Pending') return 'active';
      return 'pending';
    }

    if (stepKey === 'EnRoute') {
      if (s === 'En Route' || s === 'Arrived' || s === 'Resolved') return 'complete';
      if (s === 'Assigned') return 'active';
      return 'pending';
    }

    if (stepKey === 'Arrived') {
      if (s === 'Arrived' || s === 'Resolved') return 'complete';
      if (s === 'En Route') return 'active';
      return 'pending';
    }

    if (stepKey === 'Resolved') {
      if (s === 'Resolved') return 'complete';
      if (s === 'Arrived') return 'active';
      return 'pending';
    }

    return 'pending';
  };

  const timelineSteps = [
    { key: 'Submitted' as const, label: t.statusSubmitted, time: caseItem.timeline[0]?.timestamp || 'Just now' },
    { key: 'AiCreated' as const, label: t.statusAiCreated, time: caseItem.timeline[1]?.timestamp || 'Just now' },
    { key: 'Assigned' as const, label: t.statusAssigned, time: caseItem.status === 'Assigned' ? 'Active' : '' },
    { key: 'EnRoute' as const, label: t.statusEnRoute, time: caseItem.status === 'En Route' ? 'In transit' : '' },
    { key: 'Arrived' as const, label: t.statusArrived, time: caseItem.status === 'Arrived' ? 'On site' : '' },
    { key: 'Resolved' as const, label: t.statusResolved, time: caseItem.status === 'Resolved' ? 'Closed' : '' },
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
      
      {/* Header Bar */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
        <button
          onClick={onBackToHome}
          className="flex items-center space-x-2 text-sm font-bold text-slate-600 dark:text-slate-300 hover:text-slate-900 transition"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Home</span>
        </button>

        <button
          onClick={handleAudioRead}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-bold text-xs hover:bg-blue-200 transition"
        >
          <Volume2 className="w-4 h-4 text-blue-600" />
          <span>{t.audioReadout}</span>
        </button>
      </div>

      {/* Main Status Header Card */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white rounded-3xl p-6 shadow-2xl border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-black">
                LIVE DISPATCH FEED
              </span>
              <span className="text-xs font-mono text-slate-400">{caseItem.id}</span>
            </div>
            <h2 className="text-2xl font-black mt-1 text-white capitalize">
              {caseItem.emergencyType} Emergency Report
            </h2>
          </div>

          <div className="flex items-center space-x-2">
            <span className={`px-3 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider ${
              caseItem.priority === 'CRITICAL' ? 'bg-red-500 text-white' :
              caseItem.priority === 'HIGH' ? 'bg-orange-500 text-white' :
              caseItem.priority === 'MEDIUM' ? 'bg-amber-400 text-slate-950' : 'bg-emerald-500 text-white'
            }`}>
              {caseItem.priority} PRIORITY
            </span>
            <span className="px-3 py-1.5 rounded-xl bg-blue-600 text-white font-bold text-xs">
              {caseItem.status}
            </span>
          </div>
        </div>

        {/* AI Summary Banner */}
        <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 text-xs sm:text-sm space-y-2">
          <div className="flex items-center space-x-2 text-indigo-300 font-bold">
            <Shield className="w-4 h-4 text-amber-400" />
            <span>AI Case Summary</span>
          </div>
          <p className="text-slate-200 font-medium">
            "{caseItem.aiSummary}"
          </p>
          <p className="text-xs text-slate-400">
            📍 <strong>Location:</strong> {caseItem.location.address}
          </p>
        </div>

        {/* Assigned Responder Info (if available) */}
        {caseItem.assignedResponder && (
          <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-800/60 flex items-center justify-between text-xs sm:text-sm">
            <div className="flex items-center space-x-3">
              <span className="text-2xl">🚑</span>
              <div>
                <span className="font-bold text-emerald-300 block">{caseItem.assignedResponder.name}</span>
                <span className="text-slate-300 text-xs">ETA: ~{caseItem.assignedResponder.etaMinutes} mins • {caseItem.assignedResponder.distanceKm} km away</span>
              </div>
            </div>
            <a
              href={`tel:${caseItem.assignedResponder.phone}`}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl flex items-center space-x-1"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>Call Crew</span>
            </a>
          </div>
        )}
      </div>

      {/* Visual Timeline */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200 dark:border-slate-700 shadow-md space-y-6">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Clock className="w-5 h-5 text-blue-600" />
          Live Response Timeline
        </h3>

        <div className="relative pl-6 space-y-6 before:absolute before:left-3.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-700">
          {timelineSteps.map((step, idx) => {
            const state = getStepState(step.key);

            return (
              <div key={step.key} className="relative flex items-start space-x-4">
                
                {/* Timeline node */}
                <div className={`absolute -left-6 top-0.5 w-5 h-5 rounded-full flex items-center justify-center transition-all ${
                  state === 'complete' ? 'bg-emerald-500 text-white ring-4 ring-emerald-100 dark:ring-emerald-950' :
                  state === 'active' ? 'bg-blue-600 text-white ring-4 ring-blue-100 dark:ring-blue-950 animate-pulse' :
                  'bg-slate-200 dark:bg-slate-700 text-slate-400'
                }`}>
                  {state === 'complete' ? (
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  ) : state === 'active' ? (
                    <div className="w-2 h-2 rounded-full bg-white animate-ping" />
                  ) : (
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className={`text-sm font-bold ${
                      state === 'complete' ? 'text-slate-900 dark:text-white' :
                      state === 'active' ? 'text-blue-600 dark:text-blue-400 font-extrabold' :
                      'text-slate-400'
                    }`}>
                      {step.label}
                    </span>
                    {step.time && (
                      <span className="text-xs text-slate-400 font-mono">
                        {step.time}
                      </span>
                    )}
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
