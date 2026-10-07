import React, { useState } from 'react';
import { Search, Filter, ShieldAlert, Eye, ArrowUpDown, ChevronRight, CheckCircle2 } from 'lucide-react';
import { EmergencyCase, PriorityLevel, EmergencyType, CaseStatus } from '../../types';

interface CaseListViewProps {
  cases: EmergencyCase[];
  onSelectCase: (c: EmergencyCase) => void;
  onQuickAccept?: (caseId: string) => void;
}

export const CaseListView: React.FC<CaseListViewProps> = ({
  cases,
  onSelectCase,
  onQuickAccept
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [priorityFilter, setPriorityFilter] = useState<string>('ALL');
  const [typeFilter, setTypeFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  const filteredCases = cases.filter((c) => {
    // Search query
    const text = `${c.id} ${c.description} ${c.aiSummary} ${c.location.address}`.toLowerCase();
    if (searchQuery && !text.includes(searchQuery.toLowerCase())) return false;

    // Priority filter
    if (priorityFilter !== 'ALL' && c.priority !== priorityFilter) return false;

    // Type filter
    if (typeFilter !== 'ALL' && c.emergencyType !== typeFilter) return false;

    // Status filter
    if (statusFilter !== 'ALL' && c.status !== statusFilter) return false;

    return true;
  }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return (
    <div className="space-y-4">
      
      {/* Search & Filters Bar */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl space-y-3 shadow-lg">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          
          {/* Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Case ID, Location, Keywords..."
              className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Priority Filter */}
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
          >
            <option value="ALL">All Priorities</option>
            <option value="CRITICAL">🔴 Critical Priority</option>
            <option value="HIGH">🟠 High Priority</option>
            <option value="MEDIUM">🟡 Medium Priority</option>
            <option value="LOW">🟢 Low Priority</option>
          </select>

          {/* Type Filter */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
          >
            <option value="ALL">All Emergency Types</option>
            <option value="accident">🚗 Road Accident</option>
            <option value="fire">🔥 Fire</option>
            <option value="medical">🏥 Medical Emergency</option>
            <option value="crime">🚔 Crime & Safety</option>
            <option value="disaster">🌊 Natural Disaster</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
          >
            <option value="ALL">All Statuses</option>
            <option value="Pending">⏳ Pending Dispatch</option>
            <option value="Assigned">🚑 Assigned</option>
            <option value="En Route">🚚 En Route</option>
            <option value="Arrived">📍 Arrived</option>
            <option value="Resolved">✅ Resolved</option>
            <option value="Escalated">⚠️ Escalated</option>
          </select>

        </div>
      </div>

      {/* Case Table for Desktop / Cards for Mobile */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-950 text-slate-400 uppercase font-mono tracking-wider border-b border-slate-800">
                <th className="p-3.5">Case ID</th>
                <th className="p-3.5">Type</th>
                <th className="p-3.5">Priority</th>
                <th className="p-3.5">Location & Summary</th>
                <th className="p-3.5">Casualties</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5">Responder</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-200">
              {filteredCases.length > 0 ? (
                filteredCases.map((c) => (
                  <tr
                    key={c.id}
                    className="hover:bg-slate-800/50 transition cursor-pointer"
                    onClick={() => onSelectCase(c)}
                  >
                    <td className="p-3.5 font-mono font-bold text-white">
                      {c.id}
                    </td>

                    <td className="p-3.5 font-bold capitalize">
                      <span className="flex items-center space-x-1.5">
                        <span>
                          {c.emergencyType === 'accident' ? '🚗' :
                           c.emergencyType === 'fire' ? '🔥' :
                           c.emergencyType === 'medical' ? '🏥' :
                           c.emergencyType === 'crime' ? '🚔' : '🚨'}
                        </span>
                        <span>{c.emergencyType}</span>
                      </span>
                    </td>

                    <td className="p-3.5">
                      <span className={`px-2.5 py-1 rounded-full font-black text-[10px] tracking-wider ${
                        c.priority === 'CRITICAL' ? 'bg-red-600 text-white animate-pulse' :
                        c.priority === 'HIGH' ? 'bg-orange-500 text-white' :
                        c.priority === 'MEDIUM' ? 'bg-amber-400 text-slate-950' : 'bg-emerald-500 text-white'
                      }`}>
                        {c.priority}
                      </span>
                    </td>

                    <td className="p-3.5 max-w-xs">
                      <span className="font-semibold text-white block line-clamp-1">{c.aiSummary}</span>
                      <span className="text-slate-400 text-[11px] block line-clamp-1">📍 {c.location.address}</span>
                    </td>

                    <td className="p-3.5 font-bold">
                      {c.peopleAffected} Person(s)
                    </td>

                    <td className="p-3.5">
                      <span className={`px-2.5 py-1 rounded-lg font-bold text-[11px] ${
                        c.status === 'Pending' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                        c.status === 'Assigned' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' :
                        c.status === 'En Route' ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30' :
                        c.status === 'Arrived' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' :
                        c.status === 'Resolved' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                        'bg-red-500/20 text-red-300 border border-red-500/30'
                      }`}>
                        {c.status}
                      </span>
                    </td>

                    <td className="p-3.5 text-slate-300 font-medium">
                      {c.assignedResponder ? c.assignedResponder.name : 'Unassigned'}
                    </td>

                    <td className="p-3.5 text-right">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectCase(c);
                        }}
                        className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 font-bold text-white text-[11px] transition shadow-sm"
                      >
                        Details ➔
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="text-center py-10 text-slate-400 font-medium">
                    No emergency cases match your search/filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
