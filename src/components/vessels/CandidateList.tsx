import React from 'react';
import { Ship, Sparkles, AlertTriangle, ArrowUpRight } from 'lucide-react';
import { Vessel } from '../../types';

interface CandidateListProps {
  vessels: Vessel[];
  selectedVessel: Vessel | null;
  onSelectVessel: (v: Vessel) => void;
  onOpenDetails: (v: Vessel) => void;
  onSimulateVessel: (v: Vessel) => void;
}

export const CandidateList: React.FC<CandidateListProps> = ({
  vessels,
  selectedVessel,
  onSelectVessel,
  onOpenDetails,
  onSimulateVessel,
}) => {
  return (
    <div className="bg-white/95 backdrop-blur-md p-6 rounded-3xl border border-slate-200/90 shadow-lg shadow-purple-900/5 flex flex-col h-full space-y-4">
      
      {/* Top Header */}
      <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-purple-100 to-indigo-100 text-purple-700 flex items-center justify-center font-bold border border-purple-200/60 shadow-xs">
            <Ship className="w-4.5 h-4.5" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold tracking-tight text-slate-900 font-sans">
              CANDIDATE VESSELS
            </h3>
            <p className="text-[11px] font-mono text-slate-500 font-medium">
              Multi-Factor Vessel Attribution Ranking
            </p>
          </div>
        </div>
        <span className="text-xs font-mono font-extrabold px-3 py-1 rounded-full bg-purple-100/80 text-purple-700 border border-purple-200">
          {vessels.length} Correlated
        </span>
      </div>

      {/* Vertical Ranked Cards List */}
      <div className="space-y-3.5 overflow-y-auto pr-1 flex-1 max-h-[620px]">
        {vessels.map((vessel) => {
          const isSelected = selectedVessel?.id === vessel.id;
          const isRank1 = vessel.rank === 1;

          return (
            <div
              key={vessel.id}
              onClick={() => onSelectVessel(vessel)}
              className={`p-4 rounded-2xl border transition-all duration-200 cursor-pointer relative group ${
                isSelected
                  ? 'bg-purple-50/90 border-2 border-purple-600 shadow-md shadow-purple-600/10 ring-2 ring-purple-100'
                  : 'bg-slate-50/70 border-slate-200/90 hover:border-purple-300 hover:bg-white hover:shadow-md'
              }`}
            >
              {/* Top Row: Rank, Name & Score */}
              <div className="flex items-start justify-between gap-2 mb-2.5">
                <div className="flex items-center gap-3">
                  <span className={`w-7.5 h-7.5 rounded-xl flex items-center justify-center font-mono font-black text-xs ${
                    isRank1
                      ? 'bg-purple-600 text-white shadow-sm shadow-purple-500/30'
                      : vessel.rank === 2
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'bg-slate-200 text-slate-700'
                  }`}>
                    #{vessel.rank}
                  </span>
                  <div>
                    <h4 className="text-sm font-extrabold text-slate-900 group-hover:text-purple-700 transition-colors font-sans tracking-tight">
                      {vessel.name}
                    </h4>
                    <p className="text-[11px] font-mono text-slate-500">
                      IMO {vessel.imo} • {vessel.type}
                    </p>
                  </div>
                </div>

                <span className={`text-xs font-mono font-black px-2.5 py-1 rounded-full ${
                  vessel.score.overall >= 80
                    ? 'bg-purple-600 text-white shadow-sm shadow-purple-500/20'
                    : vessel.score.overall >= 50
                    ? 'bg-amber-100 text-amber-900 border border-amber-200/80 font-bold'
                    : 'bg-slate-200 text-slate-700'
                }`}>
                  {vessel.score.overall}% Score
                </span>
              </div>

              {/* 3-Factor Compatibility Grid with Dark Readable Text */}
              <div className="grid grid-cols-3 gap-2 py-2.5 my-2 bg-white rounded-xl px-3 border border-slate-200/80 text-[11px] font-mono shadow-2xs">
                <div className="flex flex-col">
                  <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Spatial</span>
                  <span className="font-extrabold text-emerald-700">{vessel.score.spatial}% ✓</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Temporal</span>
                  <span className={`font-extrabold ${vessel.score.temporal >= 70 ? 'text-emerald-700' : 'text-amber-700'}`}>
                    {vessel.score.temporal}% {vessel.score.temporal >= 70 ? '✓' : '~'}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Trajectory</span>
                  <span className={`font-extrabold ${vessel.score.trajectory >= 70 ? 'text-emerald-700' : 'text-amber-700'}`}>
                    {vessel.score.trajectory}% {vessel.score.trajectory >= 70 ? '✓' : '~'}
                  </span>
                </div>
              </div>

              {/* Anomaly Notification */}
              {vessel.anomalyFlags.length > 0 && (
                <div className="my-2 p-2.5 rounded-xl bg-red-50/90 border border-red-200/80 text-[11px] font-mono text-red-900 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
                  <span className="truncate font-semibold">{vessel.anomalyFlags[0]}</span>
                </div>
              )}

              {/* Card Bottom Actions */}
              <div className="flex items-center justify-between gap-2 mt-3 pt-2.5 border-t border-slate-200/70 text-xs">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenDetails(vessel);
                  }}
                  className="text-purple-700 font-bold hover:text-purple-900 transition-colors flex items-center gap-1 text-[11px] font-mono"
                >
                  <span>AIS Telemetry</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onSimulateVessel(vessel);
                  }}
                  className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-[11px] font-bold font-mono shadow-sm transition-all flex items-center gap-1.5 hover:scale-105"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Simulate Spill</span>
                </button>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
