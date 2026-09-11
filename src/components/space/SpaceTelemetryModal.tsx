import React from 'react';
import { 
  X, Satellite, Ship, AlertTriangle, ArrowRight, 
  Layers, ShieldAlert, Activity, Compass, Wind, Droplets
} from 'lucide-react';
import { Incident } from '../../types';

interface SpaceTelemetryModalProps {
  selectedEntity: 'satellite' | 'ship' | 'spill' | null;
  onClose: () => void;
  onOpenDashboard: () => void;
  incident: Incident;
}

export const SpaceTelemetryModal: React.FC<SpaceTelemetryModalProps> = ({
  selectedEntity,
  onClose,
  onOpenDashboard,
  incident,
}) => {
  if (!selectedEntity) return null;

  const topVessel = incident.vessels[0];

  return (
    <div className="fixed bottom-24 right-4 md:right-8 z-50 w-full max-w-md pointer-events-auto animate-in fade-in slide-in-from-bottom-6 duration-300">
      <div className="relative rounded-3xl bg-slate-950/92 backdrop-blur-2xl border border-purple-500/35 p-6 shadow-2xl shadow-purple-950/80 text-white font-sans overflow-hidden">
        
        {/* Background Radar Line Decor */}
        <div className="absolute top-0 right-0 w-36 h-36 bg-purple-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
          <div className="flex items-center gap-2">
            {selectedEntity === 'satellite' && (
              <>
                <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/40 flex items-center justify-center">
                  <Satellite className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-purple-300 font-mono">SENTINEL-1C C-SAR</h3>
                  <p className="text-[10px] text-slate-400 font-mono">Space-Borne Radar Platform</p>
                </div>
              </>
            )}

            {selectedEntity === 'spill' && (
              <>
                <div className="w-8 h-8 rounded-xl bg-red-500/20 text-red-400 border border-red-500/40 flex items-center justify-center">
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-red-300 font-mono">{incident.caseNumber}</h3>
                  <p className="text-[10px] text-slate-400 font-mono">Active Dielectric Slick</p>
                </div>
              </>
            )}

            {selectedEntity === 'ship' && (
              <>
                <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center">
                  <Ship className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-amber-300 font-mono">{topVessel.name}</h3>
                  <p className="text-[10px] text-slate-400 font-mono">Top Suspect Tanker</p>
                </div>
              </>
            )}
          </div>

          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body Content */}
        <div className="py-4 space-y-3 text-xs font-mono">
          
          {selectedEntity === 'satellite' && (
            <>
              <p className="text-slate-300 font-sans text-xs leading-relaxed">
                Sentinel-1 operates a C-band synthetic aperture radar (SAR) at 5.405 GHz, enabling day-and-night all-weather detection of sea surface oil slicks via dielectric backscatter damping.
              </p>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Orbit Altitude</span>
                  <span className="text-cyan-300 font-bold">693 km Sun-Sync</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Polarization</span>
                  <span className="text-cyan-300 font-bold">VV + VH Dual-Pol</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Resolution</span>
                  <span className="text-cyan-300 font-bold">10 m Stripmap</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Repeat Cycle</span>
                  <span className="text-cyan-300 font-bold">6 Days (Constellation)</span>
                </div>
              </div>
            </>
          )}

          {selectedEntity === 'spill' && (
            <>
              <div className="p-3 rounded-xl bg-red-950/40 border border-red-500/30 text-red-200 text-xs">
                <div className="flex justify-between font-bold mb-1">
                  <span>LOCATION:</span>
                  <span className="text-white">{incident.region}</span>
                </div>
                <div className="flex justify-between text-[11px] text-red-300">
                  <span>GPS COORDINATES:</span>
                  <span>{incident.coordinates.lat.toFixed(4)}°N, {incident.coordinates.lng.toFixed(4)}°E</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div className="p-2 rounded-xl bg-slate-900/80 border border-slate-800 text-center">
                  <span className="text-[9px] text-slate-400 block">SLICK AREA</span>
                  <span className="text-red-400 font-bold text-xs">{incident.areaKm2} km²</span>
                </div>
                <div className="p-2 rounded-xl bg-slate-900/80 border border-slate-800 text-center">
                  <span className="text-[9px] text-slate-400 block">EST. VOLUME</span>
                  <span className="text-red-400 font-bold text-xs">{incident.estimatedVolumeM3} m³</span>
                </div>
                <div className="p-2 rounded-xl bg-slate-900/80 border border-slate-800 text-center">
                  <span className="text-[9px] text-slate-400 block">CONFIDENCE</span>
                  <span className="text-emerald-400 font-bold text-xs">{(incident.confidence * 100).toFixed(0)}%</span>
                </div>
              </div>
            </>
          )}

          {selectedEntity === 'ship' && (
            <>
              <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-500/30 text-amber-200 text-xs space-y-1">
                <div className="flex justify-between font-bold">
                  <span>VESSEL TYPE:</span>
                  <span className="text-white">{topVessel.type}</span>
                </div>
                <div className="flex justify-between text-[11px]">
                  <span>FLAG STATE:</span>
                  <span className="text-white">{topVessel.flag} (IMO {topVessel.imo})</span>
                </div>
                <div className="flex justify-between text-[11px]">
                  <span>ATTRIBUTION MATCH:</span>
                  <span className="text-amber-400 font-bold">{topVessel.score.overall}% MATCH</span>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-[11px] text-slate-300 space-y-1">
                <div className="text-amber-400 font-bold flex items-center gap-1">
                  <ShieldAlert className="w-3.5 h-3.5" />
                  <span>CRITICAL FORENSIC ANOMALY:</span>
                </div>
                <p className="font-sans text-xs text-slate-300">
                  47-minute AIS blackout during passage through origin ellipse. Speed decelerated from 14.2 kn to 4.1 kn matching bilge pumping maneuvers.
                </p>
              </div>
            </>
          )}

        </div>

        {/* Action Button */}
        <button
          onClick={onOpenDashboard}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 hover:from-purple-500 hover:to-cyan-500 text-white font-bold text-xs shadow-lg shadow-purple-900/40 flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-98"
        >
          <span>Open Mission Control Forensic Dossier</span>
          <ArrowRight className="w-4 h-4" />
        </button>

      </div>
    </div>
  );
};
