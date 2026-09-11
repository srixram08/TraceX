import React from 'react';
import {
  Compass,
  Satellite,
  AlertTriangle,
  Play,
  Pause,
  Cloud,
  Eye,
  Activity,
  Layers,
  Ship,
  Radio,
  Sliders,
  Shield,
  Zap,
} from 'lucide-react';
import { SpaceTelemetryData } from './SpaceGlobeScene';

interface SpaceHudOverlayProps {
  onLaunchMissionControl: () => void;
  onExploreIncident: () => void;
  cameraPreset: 'orbital' | 'satellite' | 'spill';
  setCameraPreset: (preset: 'orbital' | 'satellite' | 'spill') => void;
  selectedEntity: 'satellite' | 'ship' | 'spill' | null;
  onSelectEntity: (entity: 'satellite' | 'ship' | 'spill' | null) => void;
  showRadarBeam: boolean;
  setShowRadarBeam: (show: boolean) => void;
  showOrbits: boolean;
  setShowOrbits: (show: boolean) => void;
  showSpillPulse: boolean;
  setShowSpillPulse: (show: boolean) => void;
  showClouds?: boolean;
  setShowClouds?: (show: boolean) => void;
  orbitSpeed: number;
  setOrbitSpeed: (speed: number) => void;
  telemetryData?: SpaceTelemetryData | null;
}

export const SpaceHudOverlay: React.FC<SpaceHudOverlayProps> = ({
  onLaunchMissionControl,
  onExploreIncident,
  cameraPreset,
  setCameraPreset,
  selectedEntity,
  onSelectEntity,
  showRadarBeam,
  setShowRadarBeam,
  showOrbits,
  setShowOrbits,
  showSpillPulse,
  setShowSpillPulse,
  showClouds = true,
  setShowClouds,
  orbitSpeed,
  setOrbitSpeed,
  telemetryData,
}) => {
  const isOrbiting = orbitSpeed > 0.05;

  return (
    <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-3 sm:p-5 lg:p-7 z-10 font-sans">
      
      {/* TOP TELEMETRY & CAMERA CONTROLS BAR */}
      <div className="flex flex-wrap items-center justify-between gap-3 pointer-events-auto">
        
        {/* Left: Satellite Live Ephemeris / Orbital Telemetry Pill */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 px-4 py-2 rounded-full bg-slate-950/85 backdrop-blur-xl border border-purple-500/35 text-purple-300 shadow-xl shadow-purple-950/50">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-400 animate-ping" />
            <span className="text-[11px] font-mono tracking-wider uppercase font-bold text-white">
              SENTINEL-1C C-SAR
            </span>
          </div>

          <span className="text-slate-600 hidden sm:inline">|</span>

          <div className="flex items-center gap-2.5 text-[10px] sm:text-[11px] font-mono text-slate-300">
            <span>
              LAT: <strong className="text-purple-300">{telemetryData?.subSatLat ?? 20.8}°</strong>
            </span>
            <span>
              LNG: <strong className="text-cyan-400">{telemetryData?.subSatLng ?? 69.4}°</strong>
            </span>
            <span className="hidden md:inline">
              ALT: <strong className="text-emerald-400">693 km</strong>
            </span>
            <span className="hidden lg:inline">
              VEL: <strong className="text-indigo-300">7.59 km/s</strong>
            </span>
          </div>
        </div>

        {/* Right: Camera Presets (Orbital / Follow Satellite / Arabian Sea Spill) */}
        <div className="flex items-center gap-1.5 p-1 rounded-full bg-slate-950/85 backdrop-blur-xl border border-slate-800 text-xs shadow-2xl">
          <button
            onClick={() => setCameraPreset('orbital')}
            className={`px-3.5 py-1.5 rounded-full font-medium transition-all flex items-center gap-1.5 ${
              cameraPreset === 'orbital'
                ? 'bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 text-white font-bold shadow-md shadow-purple-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
            title="Wide view of Earth globe and orbital paths"
          >
            <Compass className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Orbital Overview</span>
            <span className="sm:hidden">Globe</span>
          </button>

          <button
            onClick={() => setCameraPreset('satellite')}
            className={`px-3.5 py-1.5 rounded-full font-medium transition-all flex items-center gap-1.5 ${
              cameraPreset === 'satellite'
                ? 'bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-600 text-white font-bold shadow-md shadow-purple-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
            title="Chase Cam: Follow Sentinel-1 in real-time orbit"
          >
            <Satellite className="w-3.5 h-3.5 text-purple-300" />
            <span className="hidden sm:inline">Lock Satellite (POV)</span>
            <span className="sm:hidden">Follow Sat</span>
          </button>

          <button
            onClick={() => setCameraPreset('spill')}
            className={`px-3.5 py-1.5 rounded-full font-medium transition-all flex items-center gap-1.5 ${
              cameraPreset === 'spill'
                ? 'bg-gradient-to-r from-red-600 to-amber-600 text-white font-bold shadow-md shadow-red-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
            title="Focus camera on SLK-042 oil spill and suspect ship"
          >
            <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
            <span className="hidden sm:inline">Ocean Spill &amp; Vessel</span>
            <span className="sm:hidden">Spill Target</span>
          </button>
        </div>

      </div>

      {/* ACTIVE OCEAN TACTICAL RECONNAISSANCE BANNER */}
      {cameraPreset === 'spill' && (
        <div className="my-2 w-full max-w-2xl mx-auto flex items-center justify-between gap-3 px-4 py-2.5 rounded-2xl bg-red-950/85 backdrop-blur-2xl border border-red-500/50 shadow-2xl shadow-red-950/80 pointer-events-auto text-xs font-mono animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center">
              <span className="w-3 h-3 rounded-full bg-red-500 animate-ping absolute" />
              <span className="w-2.5 h-2.5 rounded-full bg-red-400 relative" />
            </div>
            <div>
              <div className="font-bold text-white tracking-wider flex items-center gap-2">
                <span>🌊 OCEAN SURFACE INCIDENT AREA</span>
                <span className="px-2 py-0.5 rounded text-[10px] bg-red-500/30 text-red-200 border border-red-400/40">
                  SLK-042
                </span>
              </div>
              <div className="text-[11px] text-red-200/90 hidden sm:block">
                Arabian Sea (20.84°N, 69.41°E) • 6 Ships Deployed • 18.64 km² Crude Slick
              </div>
            </div>
          </div>

          <button
            onClick={() => setCameraPreset('orbital')}
            className="px-3.5 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-purple-300 hover:text-white border border-purple-500/40 hover:border-purple-300 font-bold transition-all shadow-lg flex items-center gap-1.5 active:scale-95 text-[11px]"
            title="Ascend camera back to global orbital view"
          >
            <span>Ascend to Orbit</span>
            <span>↑</span>
          </button>
        </div>
      )}

      {/* CENTER CINEMATIC HERO & CONTROLS */}
      <div className="flex flex-col items-center justify-center text-center my-auto px-4 py-4 pointer-events-none">
        
        {/* Title Header */}
        <div className="space-y-3 max-w-3xl">
          
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-gradient-to-r from-purple-950/60 via-indigo-950/60 to-slate-950/80 border border-purple-500/40 text-purple-300 text-[11px] font-mono tracking-widest uppercase shadow-lg shadow-purple-950/40">
            <Radio className="w-3 h-3 text-purple-400 animate-pulse" />
            <span>SPACE-BORNE MARITIME RECONNAISSANCE</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-light tracking-[0.2em] text-white uppercase drop-shadow-[0_0_35px_rgba(168,85,247,0.35)] font-display">
            Trace<span className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-indigo-300 to-cyan-400">X</span>
          </h1>

          <p className="text-xs sm:text-sm tracking-[0.16em] uppercase text-slate-300 font-light max-w-xl mx-auto drop-shadow-md">
            Interactive Earth Reconnaissance • Satellite Radar &amp; Marine Discharge Attribution
          </p>

        </div>

        {/* Center Primary Action Button */}
        <div className="mt-7 flex flex-col items-center gap-3 pointer-events-auto">
          
          <button
            onClick={onLaunchMissionControl}
            className="group relative flex items-center gap-3 px-8 py-3.5 rounded-full bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 hover:from-purple-500 hover:via-indigo-500 hover:to-cyan-500 border border-purple-400/60 hover:border-cyan-300 text-white font-bold text-sm tracking-wider uppercase transition-all duration-300 shadow-[0_0_35px_rgba(168,85,247,0.4)] hover:shadow-[0_0_55px_rgba(168,85,247,0.65)] hover:scale-105 active:scale-95"
          >
            <div className="w-7 h-7 rounded-full bg-purple-500/25 border border-purple-300/60 flex items-center justify-center text-purple-200 group-hover:bg-white group-hover:text-black transition-colors">
              <Satellite className="w-4 h-4" />
            </div>
            <span>Initialize Mission Control</span>
            <span className="text-cyan-300 text-lg group-hover:translate-x-1.5 transition-transform">»</span>
          </button>

          <button
            onClick={onExploreIncident}
            className="text-xs font-mono tracking-wider text-slate-400 hover:text-purple-300 transition-colors flex items-center gap-1.5 underline decoration-slate-700 hover:decoration-purple-400 underline-offset-4"
          >
            <span>Inspect Active Incident SLK-042 (Arabian Sea)</span>
            <span className="text-purple-400">»</span>
          </button>

        </div>

        {/* Hotspot Badges to Inspect in 3D */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2 sm:gap-2.5 pointer-events-auto">
          
          <button
            onClick={() => {
              onSelectEntity('satellite');
              setCameraPreset('satellite');
            }}
            className={`px-3 py-1.5 rounded-full text-xs font-mono flex items-center gap-2 border transition-all ${
              selectedEntity === 'satellite' || cameraPreset === 'satellite'
                ? 'bg-purple-500/20 border-purple-400 text-purple-200 shadow-lg shadow-purple-500/30'
                : 'bg-slate-950/70 border-slate-800 text-slate-300 hover:border-purple-500/40 hover:text-white'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-ping" />
            <span>🛰️ Sentinel-1 SAR</span>
          </button>

          <button
            onClick={() => {
              onSelectEntity('spill');
              setCameraPreset('spill');
            }}
            className={`px-3 py-1.5 rounded-full text-xs font-mono flex items-center gap-2 border transition-all ${
              selectedEntity === 'spill' || cameraPreset === 'spill'
                ? 'bg-red-500/20 border-red-400 text-red-200 shadow-lg shadow-red-500/30'
                : 'bg-slate-950/70 border-slate-800 text-slate-300 hover:border-red-500/40 hover:text-white'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
            <span>🚨 18.64 km² Crude Slick</span>
          </button>

          <button
            onClick={() => {
              onSelectEntity('ship');
              setCameraPreset('spill');
            }}
            className={`px-3 py-1.5 rounded-full text-xs font-mono flex items-center gap-2 border transition-all ${
              selectedEntity === 'ship'
                ? 'bg-amber-500/20 border-amber-400 text-amber-200 shadow-lg shadow-amber-500/30'
                : 'bg-slate-950/70 border-slate-800 text-slate-300 hover:border-amber-500/40 hover:text-white'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            <span>🚢 MV Neptune Voyager</span>
          </button>

        </div>

      </div>

      {/* BOTTOM MISSION CONTROL & ORBIT SPEED TOOLBAR */}
      <div className="pointer-events-auto border border-slate-800/80 bg-slate-950/85 backdrop-blur-xl px-4 py-2.5 rounded-2xl flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-slate-400 shadow-2xl">
        
        {/* Left: Brand Identifier */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-white tracking-widest uppercase">
              TRACEX ORBITAL
            </span>
            <span className="hidden md:inline text-slate-600">|</span>
            <span className="hidden md:inline text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400 font-bold">
              RADAR HYDRODYNAMIC TWIN
            </span>
          </div>
        </div>

        {/* Center: Dynamic Orbit Speed Controller */}
        <div className="flex items-center gap-2 bg-slate-900/90 px-3 py-1.5 rounded-xl border border-slate-800">
          <button
            onClick={() => setOrbitSpeed(isOrbiting ? 0 : 1.0)}
            className="p-1 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-purple-300 transition-colors"
            title={isOrbiting ? 'Pause orbital motion' : 'Resume orbit'}
          >
            {isOrbiting ? <Pause className="w-3.5 h-3.5 text-purple-400" /> : <Play className="w-3.5 h-3.5 text-emerald-400" />}
          </button>

          <span className="text-[10px] uppercase font-bold text-slate-400">Orbit:</span>

          <div className="flex items-center gap-1">
            {[0.5, 1.0, 2.0, 4.0].map((spd) => (
              <button
                key={spd}
                onClick={() => setOrbitSpeed(spd)}
                className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all ${
                  Math.abs(orbitSpeed - spd) < 0.1
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                {spd}x
              </button>
            ))}
          </div>
        </div>

        {/* Center-Right: 3D Visualization Toggles */}
        <div className="flex items-center gap-3 sm:gap-4 text-[11px]">
          <label className="flex items-center gap-1.5 cursor-pointer hover:text-white transition-colors">
            <input
              type="checkbox"
              checked={showRadarBeam}
              onChange={(e) => setShowRadarBeam(e.target.checked)}
              className="accent-purple-500 rounded"
            />
            <span>Radar Swath</span>
          </label>

          <label className="flex items-center gap-1.5 cursor-pointer hover:text-white transition-colors">
            <input
              type="checkbox"
              checked={showOrbits}
              onChange={(e) => setShowOrbits(e.target.checked)}
              className="accent-purple-500 rounded"
            />
            <span className="hidden sm:inline">Orbit Track</span>
            <span className="sm:hidden">Orbits</span>
          </label>

          <label className="flex items-center gap-1.5 cursor-pointer hover:text-white transition-colors">
            <input
              type="checkbox"
              checked={showSpillPulse}
              onChange={(e) => setShowSpillPulse(e.target.checked)}
              className="accent-red-500 rounded"
            />
            <span>Spill Pulse</span>
          </label>

          {setShowClouds && (
            <label className="flex items-center gap-1.5 cursor-pointer hover:text-white transition-colors">
              <input
                type="checkbox"
                checked={showClouds}
                onChange={(e) => setShowClouds(e.target.checked)}
                className="accent-blue-500 rounded"
              />
              <span className="hidden sm:inline">Clouds</span>
            </label>
          )}
        </div>

        {/* Right Status Indicator */}
        <div className="hidden lg:flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-[11px]">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>ALL SYSTEMS NOMINAL</span>
          </div>
          <span className="text-slate-600">•</span>
          <span className="text-slate-400 text-[10px]">© 2026 TRACEX</span>
        </div>

      </div>

    </div>
  );
};
