import React, { useState, useEffect } from 'react';
import { 
  FlaskConical, Sparkles, Sliders, RotateCcw, CheckCircle2, ChevronRight, BarChart3, ArrowRight, Flame
} from 'lucide-react';
import { Incident, Vessel } from '../../types';
import { simulateForwardSpill } from '../../physics/driftEngine';

interface CounterfactualStudioProps {
  incident: Incident;
  selectedVessel: Vessel;
  onSelectVessel: (v: Vessel) => void;
  onUpdateSimulatedPolygon: (poly: [number, number][], vessel: Vessel) => void;
}

export const CounterfactualStudio: React.FC<CounterfactualStudioProps> = ({
  incident,
  selectedVessel,
  onSelectVessel,
  onUpdateSimulatedPolygon,
}) => {
  const [viewMode, setViewMode] = useState<'side-by-side' | 'overlay' | 'hypothesis-matrix'>('side-by-side');
  
  const [releaseOffsetHours, setReleaseOffsetHours] = useState<number>(
    Math.abs(selectedVessel.estimatedReleaseOffsetHours || 4.2)
  );
  const [volumeMultiplier, setVolumeMultiplier] = useState<number>(1.0);

  const [simResult, setSimResult] = useState(() => 
    simulateForwardSpill(selectedVessel, incident, releaseOffsetHours, volumeMultiplier)
  );

  useEffect(() => {
    const res = simulateForwardSpill(selectedVessel, incident, releaseOffsetHours, volumeMultiplier);
    setSimResult(res);
    onUpdateSimulatedPolygon(res.simulatedPolygon, selectedVessel);
  }, [selectedVessel, releaseOffsetHours, volumeMultiplier, incident, onUpdateSimulatedPolygon]);

  return (
    <div className="bg-[#040e16]/95 backdrop-blur-md p-6 rounded-3xl border border-[#0e3344] shadow-2xl space-y-6 text-slate-100 font-sans select-none">
      
      {/* Studio Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#0f3243]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center justify-center font-bold shadow-[0_0_15px_rgba(168,85,247,0.25)]">
            <FlaskConical className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-extrabold text-white">
                COUNTERFACTUAL SIMULATION STUDIO
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-bold border border-purple-500/40">
                SIGNATURE ENGINE
              </span>
            </div>
            <p className="text-xs font-mono text-cyan-300/70 font-medium">
              Hypothesis Validation: Observed Satellite Slick vs Simulated Plume
            </p>
          </div>
        </div>

        {/* View Mode Toggle Switch */}
        <div className="flex items-center gap-1 bg-[#061824] p-1 rounded-2xl text-xs font-mono border border-[#133c50]">
          <button
            onClick={() => setViewMode('side-by-side')}
            className={`px-3 py-1.5 rounded-xl transition-all font-bold ${
              viewMode === 'side-by-side' ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-[0_0_12px_rgba(168,85,247,0.4)]' : 'text-slate-400 hover:text-white'
            }`}
          >
            Side-by-Side
          </button>
          <button
            onClick={() => setViewMode('overlay')}
            className={`px-3 py-1.5 rounded-xl transition-all font-bold ${
              viewMode === 'overlay' ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-[0_0_12px_rgba(168,85,247,0.4)]' : 'text-slate-400 hover:text-white'
            }`}
          >
            Overlay Mode
          </button>
          <button
            onClick={() => setViewMode('hypothesis-matrix')}
            className={`px-3 py-1.5 rounded-xl transition-all font-bold ${
              viewMode === 'hypothesis-matrix' ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-[0_0_12px_rgba(168,85,247,0.4)]' : 'text-slate-400 hover:text-white'
            }`}
          >
            Hypothesis Comparison
          </button>
        </div>
      </div>

      {/* Target Status Ribbon */}
      <div className="bg-[#061824] p-4 rounded-2xl border border-[#133c50] flex flex-wrap items-center justify-between gap-4 font-mono shadow-inner">
        <div>
          <span className="text-[10px] text-slate-400 uppercase font-bold block">Tested Candidate Hypothesis:</span>
          <span className="text-sm font-extrabold text-white">
            Source: <strong className="text-purple-300">{selectedVessel.name}</strong> ({selectedVessel.type})
          </span>
        </div>

        <div className="flex items-center gap-5 text-xs">
          <div>
            <span className="text-[10px] text-slate-400 block uppercase">Est. Release Window:</span>
            <span className="text-cyan-300 font-bold">T-{releaseOffsetHours.toFixed(1)}h UTC</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block uppercase">Overlap Confidence (IoU):</span>
            <span className="text-emerald-400 font-extrabold text-sm">{simResult.iouOverlap}% Match</span>
          </div>
        </div>
      </div>

      {/* Simulation Sliders Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-[#061824] p-4 rounded-2xl border border-[#133c50] text-xs font-mono">
        <div>
          <div className="flex items-center justify-between mb-1.5 text-slate-300">
            <span className="font-bold">Temporal Release Offset</span>
            <span className="text-cyan-300 font-extrabold">T-{releaseOffsetHours.toFixed(1)}h</span>
          </div>
          <input
            type="range"
            min="0.5"
            max="8.0"
            step="0.1"
            value={releaseOffsetHours}
            onChange={(e) => setReleaseOffsetHours(Number(e.target.value))}
            className="w-full accent-cyan-400 cursor-pointer"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5 text-slate-300">
            <span className="font-bold">Estimated Discharge Volume Scaler</span>
            <span className="text-purple-300 font-extrabold">{volumeMultiplier.toFixed(1)}x ({incident.areaKm2 * volumeMultiplier} km²)</span>
          </div>
          <input
            type="range"
            min="0.5"
            max="2.5"
            step="0.1"
            value={volumeMultiplier}
            onChange={(e) => setVolumeMultiplier(Number(e.target.value))}
            className="w-full accent-purple-500 cursor-pointer"
          />
        </div>
      </div>

    </div>
  );
};
