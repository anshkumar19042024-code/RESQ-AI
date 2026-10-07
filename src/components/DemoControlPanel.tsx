import React, { useState } from 'react';
import { Gamepad2, Play, CheckCircle, Truck, MapPin, AlertCircle, RefreshCw, Plus, ChevronDown, ChevronUp } from 'lucide-react';
import { resetDemoData, getStoredCases, updateCaseStatus, saveCase } from '../utils/storage';
import { processCaseWithAI } from '../utils/aiEngine';
import { EmergencyCase } from '../types';

interface DemoControlPanelProps {
  onRefreshCases: () => void;
  onSelectCase?: (c: EmergencyCase) => void;
}

export const DemoControlPanel: React.FC<DemoControlPanelProps> = ({ onRefreshCases, onSelectCase }) => {
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const [notification, setNotification] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleReset = () => {
    resetDemoData();
    onRefreshCases();
    showToast('Reset data to initial demo state!');
  };

  const handleSimulateNewCase = () => {
    const randomTypes: ('accident' | 'fire' | 'medical' | 'crime' | 'disaster')[] = ['accident', 'fire', 'medical', 'crime', 'disaster'];
    const selectedType = randomTypes[Math.floor(Math.random() * randomTypes.length)];
    
    const sampleLocations = [
      'Opposite Fun Republic Mall, Avinashi Road',
      'Gandhi Park Junction, R.S. Puram',
      'TIDEL Park Signal, Peelamedu',
      'Railway Station Main Entrance, Coimbatore'
    ];
    const location = sampleLocations[Math.floor(Math.random() * sampleLocations.length)];

    const descriptions = {
      accident: 'Car hit divider near traffic light. Driver conscious, passenger complaining of severe leg injury.',
      fire: 'Electrical short circuit in shop basement. Heavy black smoke issuing.',
      medical: 'Person fainted at bus stop with high fever and shortness of breath.',
      crime: 'Two individuals attempting forced entry into closed storefront.',
      disaster: 'Severe waterlogging and tree fallen across main roadway blocking emergency vehicles.'
    };

    const newCase = processCaseWithAI({
      emergencyType: selectedType,
      description: descriptions[selectedType],
      peopleAffected: Math.floor(1 + Math.random() * 4),
      location: { address: location, latitude: 11.018 + Math.random() * 0.02, longitude: 76.96 + Math.random() * 0.02 }
    });

    saveCase(newCase);
    onRefreshCases();
    if (onSelectCase) onSelectCase(newCase);
    showToast(`Simulated new ${selectedType.toUpperCase()} case created: ${newCase.id}`);
  };

  const handleSimulateStep = (targetStatus: 'Assigned' | 'En Route' | 'Arrived' | 'Resolved' | 'Escalated') => {
    const cases = getStoredCases();
    // Find active case that can transition to targetStatus
    let target = cases.find(c => {
      if (targetStatus === 'Assigned') return c.status === 'Pending';
      if (targetStatus === 'En Route') return c.status === 'Assigned';
      if (targetStatus === 'Arrived') return c.status === 'En Route';
      if (targetStatus === 'Resolved') return c.status === 'Arrived';
      if (targetStatus === 'Escalated') return c.status === 'Pending' || c.status === 'Assigned';
      return false;
    });

    if (!target) {
      // Fallback to first non-resolved case
      target = cases.find(c => c.status !== 'Resolved') || cases[0];
    }

    if (!target) {
      showToast('No active case available to transition.');
      return;
    }

    const updated = updateCaseStatus(target.id, targetStatus);
    onRefreshCases();
    if (updated && onSelectCase) onSelectCase(updated);
    showToast(`${target.id} updated to ${targetStatus}`);
  };

  return (
    <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white border-y border-indigo-800/50 shadow-xl px-4 py-3">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="p-1.5 rounded-lg bg-indigo-600 text-white animate-pulse">
              <Gamepad2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm sm:text-base flex items-center gap-2">
                🎮 DEMO MODE CONTROL PANEL
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  Hackathon Interactive Presets
                </span>
              </h3>
              <p className="text-xs text-slate-300 hidden sm:block">
                Simulate end-to-end emergency lifecycle without external hardware or API keys
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {notification && (
              <span className="text-xs font-semibold px-3 py-1 bg-emerald-500 text-slate-950 rounded-full animate-fade-in">
                {notification}
              </span>
            )}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
              aria-label="Toggle Demo Panel"
            >
              {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {isOpen && (
          <div className="mt-3 pt-3 border-t border-indigo-900/60 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 text-xs">
            <button
              onClick={handleSimulateNewCase}
              className="flex items-center justify-center space-x-1.5 px-3 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 font-bold text-white transition shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Simulate Case</span>
            </button>

            <button
              onClick={() => handleSimulateStep('Assigned')}
              className="flex items-center justify-center space-x-1.5 px-3 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 font-semibold text-white transition"
            >
              <Play className="w-3.5 h-3.5" />
              <span>Sim Accept</span>
            </button>

            <button
              onClick={() => handleSimulateStep('En Route')}
              className="flex items-center justify-center space-x-1.5 px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 font-semibold text-white transition"
            >
              <Truck className="w-3.5 h-3.5" />
              <span>Sim En Route</span>
            </button>

            <button
              onClick={() => handleSimulateStep('Arrived')}
              className="flex items-center justify-center space-x-1.5 px-3 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 font-semibold text-white transition"
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>Sim Arrived</span>
            </button>

            <button
              onClick={() => handleSimulateStep('Resolved')}
              className="flex items-center justify-center space-x-1.5 px-3 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 font-semibold text-white transition"
            >
              <CheckCircle className="w-3.5 h-3.5" />
              <span>Sim Resolve</span>
            </button>

            <button
              onClick={() => handleSimulateStep('Escalated')}
              className="flex items-center justify-center space-x-1.5 px-3 py-2 rounded-lg bg-red-600 hover:bg-red-500 font-semibold text-white transition"
            >
              <AlertCircle className="w-3.5 h-3.5" />
              <span>Sim Escalation</span>
            </button>

            <button
              onClick={handleReset}
              className="col-span-2 sm:col-span-2 lg:col-span-2 flex items-center justify-center space-x-1.5 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 font-semibold text-slate-200 border border-slate-700 transition"
            >
              <RefreshCw className="w-3.5 h-3.5 text-amber-400" />
              <span>Load / Reset Demo Cases</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
