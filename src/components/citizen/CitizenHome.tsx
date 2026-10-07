import React, { useState } from 'react';
import { Phone, ShieldAlert, FileText, ArrowRight, Activity, Volume2, CheckCircle2, Clock } from 'lucide-react';
import { Language, EmergencyCase } from '../../types';
import { translations } from '../../utils/translations';
import { speakText } from '../../utils/speech';

interface CitizenHomeProps {
  lang: Language;
  onStartReport: (type?: any) => void;
  activeCase: EmergencyCase | null;
  onViewCaseStatus: (caseId: string) => void;
}

export const CitizenHome: React.FC<CitizenHomeProps> = ({
  lang,
  onStartReport,
  activeCase,
  onViewCaseStatus
}) => {
  const t = translations[lang];
  const [showCallModal, setShowCallModal] = useState<boolean>(false);

  const handleSosClick = () => {
    // Large SOS tap initiates emergency reporting flow immediately
    onStartReport();
  };

  const handleReadStatus = () => {
    if (!activeCase) {
      speakText('No active emergency reported currently.', lang);
      return;
    }
    const text = `Your emergency report ${activeCase.id} status is ${activeCase.status}. Assigned to ${activeCase.assignedResponder ? activeCase.assignedResponder.name : 'Dispatch control center'}.`;
    speakText(text, lang);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 sm:py-10 space-y-8">
      
      {/* Top Banner / Low Literacy Welcome */}
      <div className="text-center space-y-3">
        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          {t.selectEmergencyType}
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 font-medium max-w-xl mx-auto">
          Tap the big SOS button or select your emergency category to send an instant AI-prioritized alert.
        </p>
      </div>

      {/* PROMINENT HUGE 🚨 SOS BUTTON */}
      <div className="flex flex-col items-center justify-center py-4">
        <div className="relative group cursor-pointer" onClick={handleSosClick}>
          {/* Animated radar rings */}
          <div className="absolute -inset-4 rounded-full bg-red-600/30 animate-radar-ping pointer-events-none" />
          <div className="absolute -inset-8 rounded-full bg-red-500/20 animate-pulse pointer-events-none" />
          
          <button
            type="button"
            onClick={handleSosClick}
            className="relative w-48 h-48 sm:w-64 sm:h-64 rounded-full bg-gradient-to-tr from-red-700 via-red-600 to-red-500 text-white font-extrabold shadow-2xl shadow-red-600/60 border-4 border-red-400 flex flex-col items-center justify-center transition-transform active:scale-95 hover:scale-105"
            aria-label={t.sosButton}
          >
            <span className="text-4xl sm:text-6xl mb-1 filter drop-shadow-md">🚨</span>
            <span className="text-3xl sm:text-5xl tracking-widest font-black uppercase text-white drop-shadow">
              SOS
            </span>
            <span className="mt-2 text-xs sm:text-sm font-bold bg-black/30 px-3 py-1 rounded-full text-red-100 border border-white/20">
              {t.sosSubtext}
            </span>
          </button>
        </div>
      </div>

      {/* Main Action Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
        
        {/* Report Emergency Button */}
        <button
          onClick={() => onStartReport()}
          className="flex items-center justify-between p-5 sm:p-6 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white rounded-2xl shadow-lg shadow-red-900/20 transition group border border-red-500/30"
        >
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-white/20 rounded-xl group-hover:scale-110 transition">
              <ShieldAlert className="w-8 h-8 text-white" />
            </div>
            <div className="text-left">
              <span className="block text-xl font-bold">{t.reportEmergency}</span>
              <span className="text-xs text-red-100 font-medium">Text, Voice, Photo & Location</span>
            </div>
          </div>
          <ArrowRight className="w-6 h-6 text-red-200 group-hover:translate-x-1 transition" />
        </button>

        {/* Direct Call Hotlines Button */}
        <button
          onClick={() => setShowCallModal(true)}
          className="flex items-center justify-between p-5 sm:p-6 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl shadow-lg transition group border border-slate-800"
        >
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-red-500/20 text-red-400 rounded-xl group-hover:scale-110 transition">
              <Phone className="w-8 h-8" />
            </div>
            <div className="text-left">
              <span className="block text-lg font-bold">{t.callEmergency}</span>
              <span className="text-xs text-slate-400 font-medium">108 Ambulance • 100 Police • 101 Fire</span>
            </div>
          </div>
          <ArrowRight className="w-6 h-6 text-slate-400 group-hover:translate-x-1 transition" />
        </button>

      </div>

      {/* Active Case Status Card (If any case exists) */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 sm:p-6 border border-slate-200 dark:border-slate-700 shadow-md">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-4 mb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 rounded-xl">
              <Activity className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                {t.recentReport}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {activeCase ? `Case ID: ${activeCase.id}` : t.noActiveReport}
              </p>
            </div>
          </div>

          {activeCase && (
            <button
              onClick={handleReadStatus}
              className="flex items-center space-x-1 text-xs font-semibold px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-200 transition"
            >
              <Volume2 className="w-4 h-4 text-blue-500" />
              <span>{t.audioReadout}</span>
            </button>
          )}
        </div>

        {activeCase ? (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-700">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-bold text-slate-900 dark:text-white capitalize">
                    {activeCase.emergencyType} Emergency
                  </span>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-black ${
                    activeCase.priority === 'CRITICAL' ? 'bg-red-500 text-white' :
                    activeCase.priority === 'HIGH' ? 'bg-orange-500 text-white' :
                    activeCase.priority === 'MEDIUM' ? 'bg-amber-400 text-slate-950' : 'bg-emerald-500 text-white'
                  }`}>
                    {activeCase.priority} PRIORITY
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 line-clamp-1">
                  📍 {activeCase.location.address}
                </p>
              </div>

              <div className="flex items-center space-x-3">
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300">
                  {activeCase.status}
                </span>
                <button
                  onClick={() => onViewCaseStatus(activeCase.id)}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition shadow-sm"
                >
                  View Timeline & Location ➔
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-6 text-slate-500 dark:text-slate-400 text-sm">
            <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2 opacity-60" />
            No active emergency case. If you need assistance, tap SOS above.
          </div>
        )}
      </div>

      {/* Emergency Call Hotlines Modal */}
      {showCallModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Phone className="w-5 h-5 text-red-600" />
                Direct Emergency Call
              </h3>
              <button
                onClick={() => setShowCallModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300">
              For direct emergency dispatch, tap any official emergency helpline below:
            </p>

            <div className="space-y-3">
              <a
                href="tel:108"
                className="flex items-center justify-between p-4 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800/50 rounded-xl hover:bg-red-100 transition"
              >
                <div>
                  <span className="font-bold text-red-900 dark:text-red-300 block">🚑 108 — Medical Ambulance</span>
                  <span className="text-xs text-red-700 dark:text-red-400">24x7 Free Emergency Medical Service</span>
                </div>
                <span className="px-3 py-1 bg-red-600 text-white font-extrabold text-sm rounded-lg">Call 108</span>
              </a>

              <a
                href="tel:100"
                className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800/50 rounded-xl hover:bg-blue-100 transition"
              >
                <div>
                  <span className="font-bold text-blue-900 dark:text-blue-300 block">🚔 100 — Police Assistance</span>
                  <span className="text-xs text-blue-700 dark:text-blue-400">Immediate Safety & Crime Control</span>
                </div>
                <span className="px-3 py-1 bg-blue-600 text-white font-extrabold text-sm rounded-lg">Call 100</span>
              </a>

              <a
                href="tel:101"
                className="flex items-center justify-between p-4 bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-800/50 rounded-xl hover:bg-orange-100 transition"
              >
                <div>
                  <span className="font-bold text-orange-900 dark:text-orange-300 block">🔥 101 — Fire Rescue</span>
                  <span className="text-xs text-orange-700 dark:text-orange-400">Fire Brigade & Rescue Team</span>
                </div>
                <span className="px-3 py-1 bg-orange-600 text-white font-extrabold text-sm rounded-lg">Call 101</span>
              </a>
            </div>

            <button
              onClick={() => setShowCallModal(false)}
              className="w-full py-2.5 bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold rounded-xl text-sm hover:bg-slate-300 transition"
            >
              Close
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
