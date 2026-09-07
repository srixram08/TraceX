import React from 'react';
import { X, Ship, Radio, AlertTriangle, CheckCircle2, Shield, Anchor, Clock, Compass, Activity, MapPin } from 'lucide-react';
import { Vessel } from '../../types';

interface VesselDetailModalProps {
  vessel: Vessel | null;
  onClose: () => void;
  onSimulate: (v: Vessel) => void;
}

export const VesselDetailModal: React.FC<VesselDetailModalProps> = ({
  vessel,
  onClose,
  onSimulate,
}) => {
  if (!vessel) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-marine-900 border border-white/15 rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-marine-950/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <Ship className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold font-display text-white">{vessel.name}</h3>
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  {vessel.score.overall}% Match (Rank #{vessel.rank})
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono">
                IMO {vessel.imo} • MMSI {vessel.mmsi} • Flag: {vessel.flag} ({vessel.flagCode})
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm">
          
          {/* Telemetry Grid */}
          <div>
            <h4 className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-2 font-bold">
              VESSEL PHYSICAL & VOYAGE TELEMETRY
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-marine-950 p-3.5 rounded-xl border border-white/5 font-mono text-xs">
              <div>
                <span className="text-slate-500 block text-[10px]">Type</span>
                <span className="text-white font-semibold">{vessel.type}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">Deadweight (DWT)</span>
                <span className="text-white font-semibold">{vessel.dwt.toLocaleString()} MT</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">Draft / Length</span>
                <span className="text-white font-semibold">{vessel.draft}m / {vessel.length}m</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">Declared Cargo</span>
                <span className="text-white font-semibold">{vessel.cargoType}</span>
              </div>
              <div className="col-span-2">
                <span className="text-slate-500 block text-[10px]">Origin Port</span>
                <span className="text-slate-300">{vessel.originPort}</span>
              </div>
              <div className="col-span-2">
                <span className="text-slate-500 block text-[10px]">Destination Port</span>
                <span className="text-slate-300">{vessel.destinationPort}</span>
              </div>
            </div>
          </div>

          {/* 5-Factor Scorecard Breakdown */}
          <div>
            <h4 className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-2 font-bold">
              EVIDENCE SCORECARD FACTORS
            </h4>
            <div className="space-y-2 bg-marine-950 p-4 rounded-xl border border-white/5 text-xs font-mono">
              {[
                { label: 'Spatial Compatibility', score: vessel.score.spatial, desc: 'Proximity to reverse-drift centroid' },
                { label: 'Temporal Compatibility', score: vessel.score.temporal, desc: 'Passage aligns with estimated release window' },
                { label: 'Trajectory Course Match', score: vessel.score.trajectory, desc: 'Vessel track orientation vs slick elongation' },
                { label: 'Heading / Speed Compatibility', score: vessel.score.heading, desc: 'Speed reduction & drift state compatibility' },
                { label: 'Lagrangian Intersection', score: vessel.score.drift, desc: 'Intersection with retrograde particle plume' },
              ].map((factor, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-300">{factor.label}:</span>
                    <span className="font-bold text-emerald-400">{factor.score}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-marine-900 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-purple-500 to-emerald-400 rounded-full"
                      style={{ width: `${factor.score}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Anomalies Detected */}
          {vessel.anomalyFlags.length > 0 && (
            <div>
              <h4 className="text-xs font-mono text-red-400 uppercase tracking-wider mb-2 font-bold flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
                FORENSIC ANOMALY INDICATORS
              </h4>
              <div className="space-y-1.5">
                {vessel.anomalyFlags.map((flag, idx) => (
                  <div key={idx} className="p-2.5 rounded-lg bg-red-950/40 border border-red-500/30 text-xs font-mono text-red-200 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" />
                    <span>{flag}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* AIS Waypoints Track Table */}
          <div>
            <h4 className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-2 font-bold">
              AIS WAYPOINTS LOG (SURVEILLANCE TIMELINE)
            </h4>
            <div className="bg-marine-950 rounded-xl border border-white/5 overflow-hidden">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-marine-900/80 text-slate-400 text-[10px] uppercase border-b border-white/5">
                  <tr>
                    <th className="p-2.5">Timeline</th>
                    <th className="p-2.5">Coordinates</th>
                    <th className="p-2.5">SOG (kn)</th>
                    <th className="p-2.5">COG (°)</th>
                    <th className="p-2.5">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-slate-300 text-[11px]">
                  {vessel.trajectory.map((pt, i) => (
                    <tr key={i} className={pt.isAnomalous ? 'bg-red-950/30 text-red-300 font-bold' : ''}>
                      <td className="p-2.5">{pt.timestamp}</td>
                      <td className="p-2.5">{pt.lat.toFixed(3)}°N, {pt.lng.toFixed(3)}°E</td>
                      <td className="p-2.5">{pt.sog} kn</td>
                      <td className="p-2.5">{pt.cog}°</td>
                      <td className="p-2.5">
                        {pt.isAnomalous ? '⚠️ ANOMALY' : pt.navStatus}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-white/10 bg-marine-950 flex items-center justify-between">
          <span className="text-[11px] font-mono text-slate-400">
            Simulated Plume Match: <strong className="text-tactical-cyan font-bold">{vessel.simulatedOverlapIoU}% IoU</strong>
          </span>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-semibold transition-colors"
            >
              Close
            </button>
            <button
              onClick={() => {
                onClose();
                onSimulate(vessel);
              }}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-tactical-cyan text-white text-xs font-bold font-display shadow-lg shadow-purple-600/30 transition-transform hover:scale-105"
            >
              Run Counterfactual Simulation
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
