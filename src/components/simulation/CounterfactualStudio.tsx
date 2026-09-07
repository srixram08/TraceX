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
    <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-md space-y-6">
      
      {/* Studio Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
            <FlaskConical className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-extrabold font-display text-slate-900">
                COUNTERFACTUAL SIMULATION STUDIO
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 font-bold border border-purple-200">
                SIGNATURE ENGINE
              </span>
            </div>
            <p className="text-xs font-mono text-slate-500">
              Hypothesis Validation: Observed Satellite Slick vs Simulated Plume
            </p>
          </div>
        </div>

        {/* View Mode Toggle Switch */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-2xl text-xs font-mono">
          <button
            onClick={() => setViewMode('side-by-side')}
            className={`px-3 py-1.5 rounded-xl transition-all font-bold ${
              viewMode === 'side-by-side' ? 'bg-purple-600 text-white shadow-sm' : 'text-slate-600 hover:text-purple-700'
            }`}
          >
            Side-by-Side
          </button>
          <button
            onClick={() => setViewMode('overlay')}
            className={`px-3 py-1.5 rounded-xl transition-all font-bold ${
              viewMode === 'overlay' ? 'bg-purple-600 text-white shadow-sm' : 'text-slate-600 hover:text-purple-700'
            }`}
          >
            Overlay Mode
          </button>
          <button
            onClick={() => setViewMode('hypothesis-matrix')}
            className={`px-3 py-1.5 rounded-xl transition-all font-bold ${
              viewMode === 'hypothesis-matrix' ? 'bg-purple-600 text-white shadow-sm' : 'text-slate-600 hover:text-purple-700'
            }`}
          >
            Hypothesis Comparison
          </button>
        </div>
      </div>

      {/* Target Status Ribbon */}
      <div className="bg-purple-50/70 p-4 rounded-2xl border border-purple-100 flex flex-wrap items-center justify-between gap-4 font-mono">
        <div>
          <span className="text-[10px] text-purple-600 uppercase font-bold block">Tested Candidate Hypothesis:</span>
          <span className="text-sm font-extrabold text-slate-900">
            Source: <strong className="text-purple-700">{selectedVessel.name}</strong> ({selectedVessel.type})
          </span>
        </div>

        <div className="flex items-center gap-5 text-xs">
          <div>
            <span className="text-slate-400 block text-[10px]">Estimated Release</span>
            <span className="text-slate-900 font-bold">{selectedVessel.estimatedReleaseTime}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px]">Centroid Offset</span>
            <span className="text-emerald-700 font-bold">{simResult.centroidDistanceKm} km</span>
          </div>
          <div className="text-right">
            <span className="text-slate-400 block text-[10px]">Spatial Overlap Match</span>
            <span className="text-sm font-black text-purple-700 bg-white px-2.5 py-0.5 rounded-full border border-purple-200 shadow-sm">
              {simResult.iouOverlap}% IoU
            </span>
          </div>
        </div>
      </div>

      {/* Side-by-Side Visual View */}
      {viewMode === 'side-by-side' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 flex flex-col justify-between h-72">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <span className="text-xs font-mono font-bold text-red-600">
                1. OBSERVED SATELLITE SPILL (T0)
              </span>
              <span className="text-[10px] font-mono text-slate-500">
                Area: {incident.areaKm2} km²
              </span>
            </div>

            <div className="my-auto flex items-center justify-center">
              <div className="w-48 h-28 rounded-[40%_60%_70%_30%/40%_50%_60%_55%] bg-red-100 border-2 border-red-500 shadow-md flex flex-col items-center justify-center animate-pulse">
                <span className="text-xs font-mono font-bold text-red-700">
                  Sentinel-1 SAR Slick
                </span>
                <span className="text-[10px] font-mono text-red-500">
                  Dual-Pol VV Mask
                </span>
              </div>
            </div>

            <div className="text-[11px] font-mono text-slate-500 flex justify-between">
              <span>Detection: {incident.detectionTimestamp}</span>
              <span className="font-bold text-emerald-700">Confidence: {(incident.confidence * 100).toFixed(0)}%</span>
            </div>
          </div>

          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 flex flex-col justify-between h-72">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <span className="text-xs font-mono font-bold text-purple-700">
                2. FORWARD SIMULATED PLUME ({selectedVessel.name})
              </span>
              <span className="text-[11px] font-mono font-bold text-purple-700">
                {simResult.iouOverlap}% IoU
              </span>
            </div>

            <div className="my-auto flex items-center justify-center">
              <div className="w-48 h-28 rounded-[45%_55%_65%_35%/50%_45%_65%_45%] bg-purple-100 border-2 border-purple-600 shadow-md flex flex-col items-center justify-center">
                <span className="text-xs font-mono font-bold text-purple-900">
                  Simulated Forward Drift
                </span>
                <span className="text-[10px] font-mono text-purple-600">
                  Discharge at T-{releaseOffsetHours.toFixed(1)}h
                </span>
              </div>
            </div>

            <div className="text-[11px] font-mono text-slate-500 flex justify-between">
              <span>Dice Similarity: {simResult.diceScore}%</span>
              <span>Offset: {simResult.centroidDistanceKm} km</span>
            </div>
          </div>

        </div>
      )}

      {/* Overlay Visual Mode */}
      {viewMode === 'overlay' && (
        <div className="bg-slate-50 p-8 rounded-2xl border border-slate-200 flex flex-col items-center justify-center min-h-[300px]">
          <div className="relative w-64 h-40 flex items-center justify-center">
            <div className="absolute w-56 h-36 rounded-[40%_60%_70%_30%/40%_50%_60%_55%] bg-red-200/80 border-2 border-red-500" />
            <div className="absolute w-52 h-34 rounded-[45%_55%_65%_35%/50%_45%_65%_45%] bg-purple-300/70 border-2 border-purple-600 -translate-x-2 translate-y-1" />
            <div className="relative z-10 text-center bg-white px-4 py-2 rounded-2xl border border-purple-200 shadow-xl font-mono">
              <span className="text-[10px] font-bold text-slate-500 uppercase block">INTERSECTION OVER UNION</span>
              <span className="text-2xl font-black text-purple-700">{simResult.iouOverlap}% OVERLAP</span>
            </div>
          </div>

          <p className="mt-4 text-xs font-mono text-slate-600 text-center max-w-md">
            High spatial overlap confirms hypothesis: illegal bilge discharge occurred along {selectedVessel.name}'s heading during estimated release window.
          </p>
        </div>
      )}

      {/* Hypothesis Table Mode */}
      {viewMode === 'hypothesis-matrix' && (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono bg-white rounded-2xl border border-slate-200">
            <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] border-b border-slate-200">
              <tr>
                <th className="p-3">Rank / Candidate</th>
                <th className="p-3">Type</th>
                <th className="p-3">IoU Overlap</th>
                <th className="p-3">Centroid Offset</th>
                <th className="p-3">Verdict</th>
                <th className="p-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {incident.vessels.map((v) => (
                <tr key={v.id} className={selectedVessel.id === v.id ? 'bg-purple-50/70 font-bold' : ''}>
                  <td className="p-3 font-bold text-slate-900 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-slate-200 flex items-center justify-center text-[10px]">#{v.rank}</span>
                    <span>{v.name}</span>
                  </td>
                  <td className="p-3 text-slate-500">{v.type}</td>
                  <td className="p-3 font-extrabold text-purple-700">{v.simulatedOverlapIoU}%</td>
                  <td className="p-3">{v.rank === 1 ? '0.72 km' : v.rank === 2 ? '4.80 km' : '9.20 km'}</td>
                  <td className="p-3">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      v.rank === 1 ? 'bg-purple-100 text-purple-800' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {v.rank === 1 ? 'PRIMARY SUSPECT' : 'EXCLUDED'}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => onSelectVessel(v)}
                      className="px-2.5 py-1 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-700 text-[11px] font-bold transition-colors"
                    >
                      Simulate
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Interactive Sliders */}
      <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3 font-mono text-xs">
        <div className="flex justify-between items-center text-purple-800 font-bold">
          <span className="flex items-center gap-1.5">
            <Sliders className="w-3.5 h-3.5 text-purple-600" />
            <span>Interactive Simulation Tweaker</span>
          </span>
          <button
            onClick={() => {
              setReleaseOffsetHours(4.2);
              setVolumeMultiplier(1.0);
            }}
            className="text-[11px] text-slate-500 hover:text-purple-700 flex items-center gap-1"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <div className="flex justify-between text-slate-600 mb-1 font-medium">
              <span>Release Time (T-minus):</span>
              <span className="font-bold text-slate-900">T-{releaseOffsetHours.toFixed(1)}h</span>
            </div>
            <input
              type="range"
              min="1"
              max="8"
              step="0.1"
              value={releaseOffsetHours}
              onChange={(e) => setReleaseOffsetHours(parseFloat(e.target.value))}
              className="w-full accent-purple-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between text-slate-600 mb-1 font-medium">
              <span>Discharge Volume Scaling:</span>
              <span className="font-bold text-slate-900">{(volumeMultiplier * 100).toFixed(0)}% ({incident.estimatedVolumeM3} m³)</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="2.5"
              step="0.1"
              value={volumeMultiplier}
              onChange={(e) => setVolumeMultiplier(parseFloat(e.target.value))}
              className="w-full accent-purple-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
            />
          </div>
        </div>
      </div>

    </div>
  );
};
