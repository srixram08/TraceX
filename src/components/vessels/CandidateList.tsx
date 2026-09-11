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
    <div className="bg-[#040e16]/95 backdrop-blur-md p-6 rounded-3xl border border-[#0e3344] shadow-2xl flex flex-col h-full space-y-4 text-slate-100 font-sans select-none">
      
      {/* Top Header */}
      <div className="flex items-center justify-between pb-3.5 border-b border-[#0f3243]">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-purple-500/20 to-indigo-500/20 text-purple-300 flex items-center justify-center font-bold border border-purple-500/40 shadow-xs">
            <Ship className="w-4.5 h-4.5 text-purple-400" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold tracking-tight text-white font-sans">
              CANDIDATE VESSELS
            </h3>
            <p className="text-[11px] font-mono text-cyan-300/70 font-medium">
              Multi-Factor Vessel Attribution Ranking
            </p>
          </div>
        </div>
        <span className="text-xs font-mono font-extrabold px-3 py-1 rounded-full bg-purple-950/80 text-purple-300 border border-purple-800/80">
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
                  ? 'bg-[#081f2e] border-2 border-purple-500 shadow-[0_0_20px_rgba(168,85,247,0.25)] ring-2 ring-purple-500/20'
                  : 'bg-[#061824]/90 border-[#133c50] hover:border-purple-500/50 hover:bg-[#071f30] shadow-md'
              }`}
            >
              {/* Top Row: Rank, Name & Score */}
              <div className="flex items-start justify-between gap-2 mb-2.5">
                <div className="flex items-center gap-3">
                  <span className={`w-7.5 h-7.5 rounded-xl flex items-center justify-center font-mono font-black text-xs ${
                    isRank1
                      ? 'bg-purple-600 text-white shadow-[0_0_12px_rgba(168,85,247,0.5)]'
                      : vessel.rank === 2
                      ? 'bg-cyan-600 text-white shadow-sm'
                      : 'bg-[#0a2738] text-slate-300'
                  }`}>
                    #{vessel.rank}
                  </span>
                  <div>
                    <h4 className="text-sm font-extrabold text-white group-hover:text-cyan-300 transition-colors font-sans tracking-tight">
                      {vessel.name}
                    </h4>
                    <p className="text-[11px] font-mono text-slate-400">
                      IMO {vessel.imo} • {vessel.type}
                    </p>
                  </div>
                </div>

                <span className={`text-xs font-mono font-black px-2.5 py-1 rounded-full ${
                  vessel.score.overall >= 80
                    ? 'bg-purple-600 text-white shadow-[0_0_12px_rgba(168,85,247,0.4)]'
                    : vessel.score.overall >= 50
                    ? 'bg-amber-950/80 text-amber-300 border border-amber-800 font-bold'
                    : 'bg-[#0a2738] text-slate-300'
                }`}>
                  {vessel.score.overall}% Score
                </span>
              </div>

              {/* 3-Factor Compatibility Grid */}
              <div className="grid grid-cols-3 gap-2 py-2.5 my-2 bg-[#040e16] rounded-xl px-3 border border-[#0e3344] text-[11px] font-mono shadow-inner">
                <div className="flex flex-col">
                  <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Spatial</span>
                  <span className="font-extrabold text-emerald-400">{vessel.score.spatial}% ✓</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Temporal</span>
                  <span className={`font-extrabold ${vessel.score.temporal >= 70 ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {vessel.score.temporal}% {vessel.score.temporal >= 70 ? '✓' : '~'}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Trajectory</span>
                  <span className={`font-extrabold ${vessel.score.trajectory >= 70 ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {vessel.score.trajectory}% {vessel.score.trajectory >= 70 ? '✓' : '~'}
                  </span>
                </div>
              </div>

              {/* Anomaly Notification */}
              {vessel.anomalyFlags.length > 0 && (
                <div className="my-2 p-2.5 rounded-xl bg-rose-950/50 border border-rose-800/60 text-[11px] font-mono text-rose-200 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                  <span className="truncate font-semibold">{vessel.anomalyFlags[0]}</span>
                </div>
              )}

              {/* Card Bottom Actions */}
              <div className="flex items-center justify-between gap-2 mt-3 pt-2.5 border-t border-[#0e3344] text-xs">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenDetails(vessel);
                  }}
                  className="text-cyan-400 font-bold hover:text-cyan-300 transition-colors flex items-center gap-1 text-[11px] font-mono"
                >
                  <span>AIS Telemetry</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onSimulateVessel(vessel);
                  }}
                  className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-[11px] font-bold font-mono shadow-[0_0_12px_rgba(168,85,247,0.3)] transition-all flex items-center gap-1.5 hover:scale-105 active:scale-95"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-200" />
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
