import React, { useEffect, useState } from 'react';
import { Sparkles, Brain, ShieldAlert, CheckCircle, ArrowRight } from 'lucide-react';
import { EmergencyCase, Language } from '../../types';
import { translations } from '../../utils/translations';

interface AiProcessingModalProps {
  lang: Language;
  createdCase: EmergencyCase;
  onComplete: () => void;
}

export const AiProcessingModal: React.FC<AiProcessingModalProps> = ({
  lang,
  createdCase,
  onComplete
}) => {
  const t = translations[lang];
  const [step, setStep] = useState<number>(0);
  const [isFinished, setIsFinished] = useState<boolean>(false);

  const steps = [
    'Initializing ResQ AI Natural Language Engine...',
    'Extracting emergency keywords & medical indicators...',
    'Calculating priority score & vulnerability matrix...',
    'Matching closest recommended responder units...'
  ];

  useEffect(() => {
    const timer1 = setTimeout(() => setStep(1), 700);
    const timer2 = setTimeout(() => setStep(2), 1400);
    const timer3 = setTimeout(() => setStep(3), 2100);
    const timer4 = setTimeout(() => {
      setIsFinished(true);
    }, 2800);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 text-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-6">
        
        {/* Header */}
        <div className="flex items-center space-x-3 border-b border-slate-800 pb-4">
          <div className="p-3 bg-gradient-to-tr from-red-600 to-indigo-600 rounded-2xl shadow-lg shadow-indigo-900/40">
            <Brain className="w-8 h-8 text-white animate-pulse" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-xl font-extrabold text-white">ResQ AI Case Intelligence</h3>
              <Sparkles className="w-4 h-4 text-amber-400" />
            </div>
            <p className="text-xs text-slate-400">Deterministic Neural Priority Engine</p>
          </div>
        </div>

        {!isFinished ? (
          /* Processing Steps Animation */
          <div className="space-y-4 py-4">
            <div className="flex items-center justify-center py-6">
              <div className="relative flex items-center justify-center w-24 h-24">
                <div className="absolute inset-0 rounded-full border-4 border-indigo-500/20 animate-ping" />
                <div className="w-16 h-16 rounded-full border-4 border-red-500 border-t-transparent animate-spin" />
                <Sparkles className="w-8 h-8 text-amber-400 absolute" />
              </div>
            </div>

            <div className="space-y-2">
              {steps.map((text, idx) => (
                <div
                  key={idx}
                  className={`flex items-center space-x-3 text-xs font-semibold p-2.5 rounded-xl transition ${
                    step >= idx ? 'bg-indigo-950/60 text-indigo-200 border border-indigo-800/40' : 'text-slate-600 opacity-40'
                  }`}
                >
                  {step > idx ? (
                    <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  ) : step === idx ? (
                    <div className="w-4 h-4 rounded-full border-2 border-amber-400 border-t-transparent animate-spin flex-shrink-0" />
                  ) : (
                    <div className="w-4 h-4 rounded-full border border-slate-700 flex-shrink-0" />
                  )}
                  <span>{text}</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* Result Summary Card */
          <div className="space-y-4 animate-fade-in">
            <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-slate-400">{createdCase.id}</span>
                <span className={`px-3 py-1 rounded-full text-xs font-black tracking-wider ${
                  createdCase.priority === 'CRITICAL' ? 'bg-red-500 text-white' :
                  createdCase.priority === 'HIGH' ? 'bg-orange-500 text-white' :
                  createdCase.priority === 'MEDIUM' ? 'bg-amber-400 text-slate-950' : 'bg-emerald-500 text-white'
                }`}>
                  {createdCase.priority} PRIORITY
                </span>
              </div>

              <div>
                <h4 className="text-xs uppercase font-extrabold text-slate-400 tracking-wider">AI Case Summary</h4>
                <p className="text-sm font-semibold text-white mt-0.5">
                  {createdCase.aiSummary}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs border-t border-slate-700/60 pt-2">
                <div>
                  <span className="text-slate-400 block">People Affected</span>
                  <span className="font-bold text-white">{createdCase.peopleAffected} Individual(s)</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Confidence Score</span>
                  <span className="font-bold text-emerald-400">96% High</span>
                </div>
              </div>

              <div className="bg-indigo-950/50 p-2.5 rounded-xl border border-indigo-800/40 text-xs">
                <span className="text-indigo-300 font-bold block mb-0.5">Recommended Response:</span>
                <span className="text-slate-200">{createdCase.recommendedResponse}</span>
              </div>
            </div>

            <button
              onClick={onComplete}
              className="w-full py-3.5 bg-gradient-to-r from-red-600 to-indigo-600 hover:from-red-500 hover:to-indigo-500 text-white font-extrabold text-sm rounded-xl transition shadow-lg flex items-center justify-center space-x-2"
            >
              <span>Track Live Response Status</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
