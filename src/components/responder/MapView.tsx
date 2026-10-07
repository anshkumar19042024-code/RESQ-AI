import React, { useState } from 'react';
import { MapPin, Navigation, Compass, Layers, AlertCircle, Shield, Truck } from 'lucide-react';
import { EmergencyCase, Responder } from '../../types';

interface MapViewProps {
  cases: EmergencyCase[];
  responders: Responder[];
  selectedCase?: EmergencyCase | null;
  onSelectCase?: (c: EmergencyCase) => void;
  heightClass?: string;
}

export const MapView: React.FC<MapViewProps> = ({
  cases,
  responders,
  selectedCase,
  onSelectCase,
  heightClass = 'h-96 sm:h-[500px]'
}) => {
  const [activeLayer, setActiveLayer] = useState<'all' | 'critical' | 'responders'>('all');

  // Coords center around Coimbatore (11.0168, 76.9558)
  const mapCenter = { lat: 11.0168, lng: 76.9558 };

  // Convert lat/lng to percentage offset in container grid
  const getCoordsPercentage = (lat?: number, lng?: number) => {
    if (!lat || !lng) return { x: 50, y: 50 };
    // Normalization bounds for demo area
    const minLat = 10.98;
    const maxLat = 11.05;
    const minLng = 76.92;
    const maxLng = 77.04;

    const x = Math.min(92, Math.max(8, ((lng - minLng) / (maxLng - minLng)) * 100));
    const y = Math.min(92, Math.max(8, (1 - (lat - minLat) / (maxLat - minLat)) * 100));
    return { x, y };
  };

  const filteredCases = cases.filter(c => {
    if (activeLayer === 'critical') return c.priority === 'CRITICAL' || c.priority === 'HIGH';
    return true;
  });

  return (
    <div className={`relative w-full rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 ${heightClass} shadow-2xl`}>
      
      {/* Visual Canvas / Tactical Map Background Layer */}
      <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-slate-950/80 pointer-events-none" />

      {/* Map Grid Roads Visualization SVG */}
      <svg className="absolute inset-0 w-full h-full opacity-25 pointer-events-none">
        {/* Main Arterial Roads */}
        <line x1="10%" y1="50%" x2="90%" y2="50%" stroke="#475569" strokeWidth="6" />
        <line x1="40%" y1="10%" x2="70%" y2="90%" stroke="#475569" strokeWidth="4" />
        <line x1="20%" y1="80%" x2="85%" y2="20%" stroke="#475569" strokeWidth="3" />
        <circle cx="50%" cy="50%" r="20%" stroke="#334155" strokeWidth="2" fill="none" strokeDasharray="6 6" />
      </svg>

      {/* Map Overlay Controls */}
      <div className="absolute top-4 left-4 z-20 flex items-center space-x-2 bg-slate-900/90 backdrop-blur-md p-1.5 rounded-xl border border-slate-800 shadow-lg">
        <button
          onClick={() => setActiveLayer('all')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
            activeLayer === 'all' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
          }`}
        >
          All Markers ({cases.length})
        </button>
        <button
          onClick={() => setActiveLayer('critical')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
            activeLayer === 'critical' ? 'bg-red-600 text-white' : 'text-slate-400 hover:text-white'
          }`}
        >
          High/Critical
        </button>
        <button
          onClick={() => setActiveLayer('responders')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
            activeLayer === 'responders' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
          }`}
        >
          Responders ({responders.length})
        </button>
      </div>

      <div className="absolute top-4 right-4 z-20 flex items-center space-x-2 bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-800 text-xs text-slate-300 font-mono">
        <Compass className="w-4 h-4 text-blue-400 animate-spin" style={{ animationDuration: '12s' }} />
        <span>TACTICAL MAP GRID • COIMBATORE HQ</span>
      </div>

      {/* Emergency Cases Pin Markers */}
      {activeLayer !== 'responders' && filteredCases.map((c) => {
        const { x, y } = getCoordsPercentage(c.location.latitude, c.location.longitude);
        const isSelected = selectedCase?.id === c.id;

        return (
          <div
            key={c.id}
            onClick={() => onSelectCase && onSelectCase(c)}
            style={{ left: `${x}%`, top: `${y}%` }}
            className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer z-10 transition-transform hover:scale-125 group`}
          >
            {/* Radar Pulsing Circle */}
            <div className={`absolute -inset-3 rounded-full animate-ping opacity-75 ${
              c.priority === 'CRITICAL' ? 'bg-red-500' :
              c.priority === 'HIGH' ? 'bg-orange-500' : 'bg-amber-400'
            }`} />

            {/* Marker Container */}
            <div className={`relative flex items-center justify-center w-8 h-8 rounded-full shadow-lg font-black text-xs border-2 ${
              isSelected ? 'ring-4 ring-white scale-110' : ''
            } ${
              c.priority === 'CRITICAL' ? 'bg-red-600 border-red-300 text-white' :
              c.priority === 'HIGH' ? 'bg-orange-600 border-orange-300 text-white' :
              c.priority === 'MEDIUM' ? 'bg-amber-500 border-amber-200 text-slate-950' : 'bg-emerald-600 border-emerald-300 text-white'
            }`}>
              {c.emergencyType === 'accident' ? '🚗' :
               c.emergencyType === 'fire' ? '🔥' :
               c.emergencyType === 'medical' ? '🚑' :
               c.emergencyType === 'crime' ? '🚔' : '🚨'}
            </div>

            {/* Hover Tooltip */}
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block z-30 w-48 p-2.5 bg-slate-900/95 backdrop-blur-md text-white text-xs rounded-xl border border-slate-700 shadow-2xl pointer-events-none">
              <div className="font-extrabold text-red-400 flex items-center justify-between">
                <span>{c.id}</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">{c.priority}</span>
              </div>
              <p className="font-medium line-clamp-1 mt-1">{c.aiSummary}</p>
              <p className="text-[10px] text-slate-400 mt-1">Status: {c.status}</p>
            </div>
          </div>
        );
      })}

      {/* Responder Vehicle Markers */}
      {responders.map((r) => {
        const { x, y } = getCoordsPercentage(r.coords.lat, r.coords.lng);

        return (
          <div
            key={r.id}
            style={{ left: `${x}%`, top: `${y}%` }}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 z-10 group cursor-pointer"
          >
            <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white border-2 border-emerald-300 shadow-md flex items-center justify-center text-xs font-bold">
              <Truck className="w-4 h-4" />
            </div>

            {/* Tooltip */}
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 hidden group-hover:block z-30 w-44 p-2 bg-slate-900 text-white text-xs rounded-lg border border-slate-700 shadow-xl pointer-events-none">
              <span className="font-bold text-emerald-400 block">{r.name}</span>
              <span className="text-[10px] text-slate-300 block">{r.status} • {r.distanceKm} km</span>
            </div>
          </div>
        );
      })}

      {/* Bottom Map Legend */}
      <div className="absolute bottom-3 left-4 right-4 z-20 flex flex-wrap items-center justify-between gap-2 bg-slate-900/90 backdrop-blur-md px-4 py-2 rounded-xl border border-slate-800 text-xs text-slate-300">
        <div className="flex items-center space-x-4">
          <span className="flex items-center space-x-1">
            <span className="w-3 h-3 rounded-full bg-red-600" />
            <span>Critical</span>
          </span>
          <span className="flex items-center space-x-1">
            <span className="w-3 h-3 rounded-full bg-orange-500" />
            <span>High Priority</span>
          </span>
          <span className="flex items-center space-x-1">
            <span className="w-3 h-3 rounded-full bg-amber-400" />
            <span>Medium Priority</span>
          </span>
          <span className="flex items-center space-x-1">
            <span className="w-3 h-3 rounded-full bg-emerald-500" />
            <span>Responder Unit</span>
          </span>
        </div>
        <span className="text-[11px] text-slate-400 font-mono">Click marker to inspect case</span>
      </div>

    </div>
  );
};
