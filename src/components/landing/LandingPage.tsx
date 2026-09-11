import React, { useState } from 'react';
import { 
  Satellite, RotateCcw, Ship, 
  Play, Pause, Volume2, ArrowRight, Radio, Globe, 
  Flame, ChevronRight, ShieldCheck, Compass, AlertTriangle, 
  Layers, Activity, Zap, Waves, Cpu, Eye, CheckCircle2, Lock
} from 'lucide-react';
import { Incident, Vessel } from '../../types';
import { SpaceGlobeScene, SpaceTelemetryData } from '../space/SpaceGlobeScene';
import { SpaceHudOverlay } from '../space/SpaceHudOverlay';
import { SpaceTelemetryModal } from '../space/SpaceTelemetryModal';

interface LandingPageProps {
  onLaunchDashboard: () => void;
  onOpenLogin: () => void;
  incidents: Incident[];
  activeIncident: Incident;
  setActiveIncident: (inc: Incident) => void;
  user: string | null;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onLaunchDashboard,
  onOpenLogin,
  incidents,
  activeIncident,
  setActiveIncident,
  user,
}) => {
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);
  const [demoScrubberHours, setDemoScrubberHours] = useState<number>(0);

  // 3D Space Scene State
  const [cameraPreset, setCameraPreset] = useState<'orbital' | 'satellite' | 'spill'>('orbital');
  const [selectedEntity, setSelectedEntity] = useState<'satellite' | 'ship' | 'spill' | null>(null);
  const [showRadarBeam, setShowRadarBeam] = useState<boolean>(true);
  const [showOrbits, setShowOrbits] = useState<boolean>(true);
  const [showSpillPulse, setShowSpillPulse] = useState<boolean>(true);
  const [showClouds, setShowClouds] = useState<boolean>(true);
  const [orbitSpeed, setOrbitSpeed] = useState<number>(1.0);
  const [telemetryData, setTelemetryData] = useState<SpaceTelemetryData | null>(null);

  // Interactive SAR Polarization Demo tab
  const [activePolarization, setActivePolarization] = useState<'VV' | 'VH'>('VV');

  const topVessel: Vessel = activeIncident.vessels[0] || {
    name: 'MV Neptune Voyager',
    imo: '9284154',
    type: 'Aframax Crude Tanker',
    flag: 'Panama',
    score: { overall: 94.2, trajectory: 96, drift: 92, draft: 95 },
  };

  const telemetrySamples = [
    {
      id: 'sar-echo',
      title: 'SAR Radar Dielectric Backscatter',
      duration: '0:14 / 2:48',
      desc: 'High-frequency radar backscatter isolating low-dielectric surface slick boundary with -24.8 dB depression.',
      badge: 'C-Band 5.405 GHz',
    },
    {
      id: 'reverse-drift',
      title: 'Reverse Lagrangian Advection Pulse',
      duration: '0:32 / 3:10',
      desc: 'Retrograde ocean transport solver tracking 40 particle trajectories backward in time across HYCOM currents.',
      badge: 'Runge-Kutta 4th',
    },
    {
      id: 'ais-anomaly',
      title: 'AIS Transponder Gap & Deceleration',
      duration: '0:18 / 1:55',
      desc: 'Dark ship anomaly flag: 47-minute transponder blackout & 10.1 kn speed drop along the discharge vector.',
      badge: 'S-AIS Telemetry',
    },
    {
      id: 'counterfactual',
      title: 'Forward Plume Overlap Synthesizer',
      duration: '0:45 / 4:12',
      desc: 'Hypothetical forward discharge matches observed SAR polygon with 91.4% Intersection-over-Union confidence.',
      badge: 'Hydro Twin',
    },
    {
      id: 'voice-briefing',
      title: 'Forensic Intelligence Incident Briefing',
      duration: '0:22 / 2:04',
      desc: 'Automated situation report summarizing top suspect vessel and legal chain of custody for port state control.',
      badge: 'MARPOL Legal',
    },
    {
      id: 'ocean-weather',
      title: 'Stokes Drift & Wavefield Vector',
      duration: '0:11 / 1:40',
      desc: 'Surface roughness modulation showing wind leeway deflection angle of 235° at 12.4 kn sustained.',
      badge: 'NOAA GFS Winds',
    },
  ];

  const handleTogglePlay = (id: string) => {
    setPlayingAudioId(playingAudioId === id ? null : id);
  };

  const handleAction = () => {
    if (user) {
      onLaunchDashboard();
    } else {
      onOpenLogin();
    }
  };

  return (
    <div className="min-h-screen bg-[#030611] text-slate-100 selection:bg-purple-600 selection:text-white font-sans relative overflow-x-hidden">
      
      {/* Soft Ambient Background Glows from Image 1 */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-purple-600/10 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute top-2/3 right-10 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-[600px] h-[600px] bg-cyan-600/10 rounded-full blur-[150px] pointer-events-none" />

      {/* 3D HERO SECTION (PHOTOREALISTIC EARTH & SENTINEL-1 ORBIT) */}
      <section className="relative w-full h-[92vh] min-h-[660px] max-h-[980px] bg-[#02040a] border-b border-slate-800/80 overflow-hidden">
        
        {/* Three.js Photorealistic 3D Space Scene */}
        <SpaceGlobeScene
          onSelectEntity={(entity) => {
            setSelectedEntity(entity);
            if (entity === 'spill' || entity === 'ship') {
              setCameraPreset('spill');
            } else if (entity === 'satellite') {
              setCameraPreset('satellite');
            }
          }}
          selectedEntity={selectedEntity}
          cameraPreset={cameraPreset}
          showRadarBeam={showRadarBeam}
          showOrbits={showOrbits}
          showSpillPulse={showSpillPulse}
          showClouds={showClouds}
          orbitSpeed={orbitSpeed}
          onTelemetryUpdate={setTelemetryData}
        />

        {/* Aerospace HUD Overlay with Telemetry & Orbit Controls */}
        <SpaceHudOverlay
          onLaunchMissionControl={handleAction}
          onExploreIncident={() => {
            setCameraPreset('spill');
            setSelectedEntity('spill');
          }}
          cameraPreset={cameraPreset}
          setCameraPreset={setCameraPreset}
          selectedEntity={selectedEntity}
          onSelectEntity={setSelectedEntity}
          showRadarBeam={showRadarBeam}
          setShowRadarBeam={setShowRadarBeam}
          showOrbits={showOrbits}
          setShowOrbits={setShowOrbits}
          showSpillPulse={showSpillPulse}
          setShowSpillPulse={setShowSpillPulse}
          showClouds={showClouds}
          setShowClouds={setShowClouds}
          orbitSpeed={orbitSpeed}
          setOrbitSpeed={setOrbitSpeed}
          telemetryData={telemetryData}
        />

        {/* 3D Entity Telemetry Inspection Modal */}
        <SpaceTelemetryModal
          selectedEntity={selectedEntity}
          onClose={() => setSelectedEntity(null)}
          onOpenDashboard={handleAction}
          incident={activeIncident}
        />

      </section>

      {/* MISSION BRIEFING & REAL-TIME RECONNAISSANCE CARDS */}
      <section className="py-16 px-4 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Left: Strategic Mission Overview */}
          <div className="lg:col-span-7 space-y-6">
            
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-purple-500/20 via-indigo-500/20 to-cyan-500/20 border border-purple-500/35 text-purple-300 backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-purple-400 animate-ping" />
              <span className="text-xs font-mono font-bold uppercase tracking-wider">
                SIH26143 • NTRO Space Tech &amp; Maritime Reconnaissance
              </span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-[1.15]">
              Space-Borne Radar.{' '}
              <span className="bg-gradient-to-r from-purple-400 via-indigo-300 to-cyan-400 bg-clip-text text-transparent">
                Ocean Hydrodynamics.
              </span>{' '}
              Forensic Truth.
            </h2>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal bg-gradient-to-br from-slate-900/90 via-purple-950/25 to-indigo-950/40 p-5 rounded-2xl border border-purple-500/25 backdrop-blur-md shadow-xl shadow-purple-950/20">
              TraceX integrates high-resolution Synthetic Aperture Radar constellations (Sentinel-1 C-SAR Dual-Pol, RADARSAT-2) with a 2D retrograde Lagrangian transport solver. By rewinding ocean currents and wind-driven Stokes drift, TraceX attributes illegal maritime discharges to dark vessels with court-admissible forensic certainty.
            </p>

            {/* Feature Highlights Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-1">
              <div className="p-3 rounded-xl bg-slate-900/70 border border-purple-500/20 shadow-md">
                <span className="text-[10px] font-mono text-purple-400 uppercase block font-bold">Orbit Constellation</span>
                <span className="text-xs font-bold text-white">Sentinel-1A/B/C LEO</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/70 border border-purple-500/20 shadow-md">
                <span className="text-[10px] font-mono text-emerald-400 uppercase block font-bold">Hydrodynamic Solver</span>
                <span className="text-xs font-bold text-white">RK4 Lagrangian 2D</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/70 border border-purple-500/20 shadow-md">
                <span className="text-[10px] font-mono text-cyan-400 uppercase block font-bold">Attribution Confidence</span>
                <span className="text-xs font-bold text-white">94.2% Verified Match</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={handleAction}
                className="flex items-center gap-2 px-7 py-3.5 rounded-full bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 hover:from-purple-500 hover:via-indigo-500 hover:to-cyan-500 text-white font-bold text-sm shadow-xl shadow-purple-900/40 hover:scale-105 active:scale-95 transition-all"
              >
                <span>Launch Operations Dashboard</span>
                <ChevronRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => {
                  setCameraPreset('spill');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="flex items-center gap-2 px-6 py-3.5 rounded-full bg-slate-900/90 hover:bg-slate-800 border border-purple-500/35 text-purple-200 hover:text-white font-bold text-sm shadow-md transition-all hover:scale-105"
              >
                <Compass className="w-4 h-4 text-purple-400" />
                <span>Focus 3D Earth Spill</span>
              </button>
            </div>

          </div>

          {/* Right: Live Telemetry Radar Scrubber & Attribution Card */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="w-full max-w-md p-1 rounded-[32px] bg-gradient-to-br from-purple-500/40 via-indigo-500/25 to-cyan-500/40 shadow-2xl shadow-purple-950/70">
              <div className="w-full h-full bg-slate-950 rounded-[28px] p-6 text-white overflow-hidden relative flex flex-col justify-between min-h-[440px] border border-purple-500/25">
                
                {/* Top Status */}
                <div className="relative z-10 flex items-center justify-between pb-3 border-b border-slate-800/80">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-purple-400 animate-pulse" />
                    <span className="text-xs font-mono font-bold text-purple-300">
                      LIVE RADAR: {activeIncident.caseNumber}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-200 border border-purple-500/30 font-bold">
                    Sentinel-1 C-SAR
                  </span>
                </div>

                {/* Center Radar Display with Hydrodynamic Particles */}
                <div className="relative z-10 flex flex-col items-center justify-center my-auto py-6">
                  <div className="relative w-48 h-48 rounded-full border border-purple-500/30 flex items-center justify-center">
                    
                    {/* Rotating Radar Sweep Line */}
                    <div className="absolute inset-0 rounded-full border border-purple-500/20 flex items-center justify-center animate-spin" style={{ animationDuration: '8s' }}>
                      <div className="w-1/2 h-0.5 bg-gradient-to-r from-transparent to-purple-400 origin-right ml-auto" />
                    </div>

                    <div className="w-36 h-36 rounded-full border border-indigo-500/30 animate-pulse flex items-center justify-center">
                      <div className="w-24 h-24 rounded-full border border-cyan-500/30" />
                    </div>

                    {/* Oil Slick Anomaly Core */}
                    <div className="absolute w-16 h-11 rounded-[40%_60%_70%_30%] bg-red-500/30 border-2 border-red-500 shadow-xl shadow-red-500/40 flex items-center justify-center animate-pulse">
                      <Flame className="w-4 h-4 text-red-400" />
                    </div>

                    {/* Suspect Vessel Marker */}
                    <div 
                      className="absolute w-8 h-8 rounded-full bg-purple-600 border-2 border-white flex items-center justify-center shadow-lg shadow-purple-500/50 transition-all duration-500"
                      style={{
                        top: `${20 + demoScrubberHours * 8}%`,
                        right: `${20 + demoScrubberHours * 6}%`,
                      }}
                    >
                      <Ship className="w-4 h-4 text-white" />
                    </div>

                    {/* Drift Trail Particles */}
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div
                        key={i}
                        className="absolute w-1.5 h-1.5 rounded-full bg-purple-400/80"
                        style={{
                          top: `${25 + i * 8 + demoScrubberHours * 3}%`,
                          right: `${25 + i * 7 + demoScrubberHours * 2}%`,
                          opacity: Math.max(0.2, 1 - (i * 0.18)),
                        }}
                      />
                    ))}

                  </div>

                  <div className="text-center mt-3 font-mono">
                    <span className="text-xs font-bold text-white block">{topVessel.name}</span>
                    <span className="text-[11px] text-emerald-400 font-bold">
                      {topVessel.score?.overall ?? 94.2}% Attribution Match Score
                    </span>
                  </div>
                </div>

                {/* Hydrodynamic Drift Rewind Interactive Slider */}
                <div className="relative z-10 bg-slate-900/90 p-3.5 rounded-2xl border border-purple-500/20 space-y-2 font-mono text-xs">
                  <div className="flex justify-between items-center text-[10px] text-slate-300">
                    <span className="flex items-center gap-1 font-bold text-purple-400">
                      <RotateCcw className="w-3 h-3" /> Rewind Lagrangian Drift:
                    </span>
                    <span className="text-emerald-400 font-bold">T-{demoScrubberHours}h</span>
                  </div>

                  <input
                    type="range"
                    min="0"
                    max="6"
                    step="0.5"
                    value={demoScrubberHours}
                    onChange={(e) => setDemoScrubberHours(parseFloat(e.target.value))}
                    className="w-full accent-purple-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-[9px] text-slate-500">
                    <span>Acquisition (T0)</span>
                    <span>T-3h Discharge</span>
                    <span>T-6h Anchorage</span>
                  </div>
                </div>

                {/* Launch Button */}
                <button
                  onClick={handleAction}
                  className="relative z-10 mt-3 w-full py-2.5 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 hover:from-purple-500 hover:to-cyan-500 text-white text-xs font-bold shadow-lg shadow-purple-900/50 transition-transform hover:scale-105 flex items-center justify-center gap-1.5"
                >
                  <span>Enter Investigation Twin</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

              </div>
            </div>
          </div>

        </div>
      </section>

      {/* SATELLITE RECONNAISSANCE SPEC SHEET & SAR DUAL-POL CARD */}
      <section className="py-12 px-4 lg:px-8 max-w-7xl mx-auto border-t border-purple-500/20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          
          <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-950/90 via-purple-950/20 to-slate-900/90 border border-purple-500/20 hover:border-purple-400/40 shadow-lg shadow-purple-950/20 transition-all">
            <div className="flex items-center gap-2 text-purple-400 mb-2">
              <Satellite className="w-4 h-4" />
              <span className="text-xs font-mono font-bold uppercase">C-Band SAR Payload</span>
            </div>
            <p className="text-2xl font-black text-white font-display">5.405 GHz</p>
            <p className="text-xs text-slate-400 mt-1">Center wavelength 5.54 cm with all-weather night imaging penetration</p>
          </div>

          <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-950/90 via-purple-950/20 to-slate-900/90 border border-purple-500/20 hover:border-purple-400/40 shadow-lg shadow-purple-950/20 transition-all">
            <div className="flex items-center gap-2 text-emerald-400 mb-2">
              <Globe className="w-4 h-4" />
              <span className="text-xs font-mono font-bold uppercase">Polar Orbit Sun-Sync</span>
            </div>
            <p className="text-2xl font-black text-white font-display">693 km LEO</p>
            <p className="text-xs text-slate-400 mt-1">Inclination 98.18° with 175 orbits per 12-day orbital cycle repeat</p>
          </div>

          <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-950/90 via-purple-950/20 to-slate-900/90 border border-purple-500/20 hover:border-purple-400/40 shadow-lg shadow-purple-950/20 transition-all">
            <div className="flex items-center gap-2 text-indigo-400 mb-2">
              <Layers className="w-4 h-4" />
              <span className="text-xs font-mono font-bold uppercase">SAR Swath Footprint</span>
            </div>
            <p className="text-2xl font-black text-white font-display">250 km</p>
            <p className="text-xs text-slate-400 mt-1">Interferometric Wide (IW) swath mode with 5m x 20m spatial resolution</p>
          </div>

          <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-950/90 via-purple-950/20 to-slate-900/90 border border-purple-500/20 hover:border-purple-400/40 shadow-lg shadow-purple-950/20 transition-all">
            <div className="flex items-center gap-2 text-cyan-400 mb-2">
              <ShieldCheck className="w-4 h-4" />
              <span className="text-xs font-mono font-bold uppercase">Attribution Evidence</span>
            </div>
            <p className="text-2xl font-black text-white font-display">ISO-17025</p>
            <p className="text-xs text-slate-400 mt-1">SHA-256 cryptographic chain of custody for maritime court admissibility</p>
          </div>

        </div>
      </section>

      {/* SPACE & MARITIME INTELLIGENCE MODULES */}
      <section id="services" className="py-16 px-4 lg:px-8 max-w-7xl mx-auto border-t border-purple-500/20">
        <div className="mb-8">
          <h2 className="text-2xl sm:text-3xl font-black text-white font-display">
            Space Technology &amp; Ocean Reconnaissance Services
          </h2>
          <p className="text-xs sm:text-sm font-medium text-slate-400 mt-1">
            Versatile and High-Precision Space-Borne Synthetic Aperture Radar Modules
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Service 1 */}
          <div className="p-6 rounded-3xl bg-gradient-to-br from-slate-950/90 via-purple-950/25 to-slate-900/90 backdrop-blur-md border border-purple-500/20 hover:border-purple-400/50 shadow-lg shadow-purple-950/20 transition-all duration-300 hover:-translate-y-1 group">
            <div className="w-12 h-12 rounded-2xl bg-purple-950/60 border border-purple-500/40 text-purple-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-md shadow-purple-950/40">
              <Satellite className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white mb-2">
              Satellite SAR Dielectric Thresholding
            </h3>
            <p className="text-xs text-slate-400 font-medium leading-relaxed">
              Automated ingestion and dielectric backscatter segmentation of Sentinel-1 C-SAR Dual-Pol (VV/VH) and RADARSAT-2 imagery to isolate surface slick boundaries down to -26 dB.
            </p>
          </div>

          {/* Service 2 */}
          <div className="p-6 rounded-3xl bg-gradient-to-br from-slate-950/90 via-purple-950/25 to-slate-900/90 backdrop-blur-md border border-purple-500/20 hover:border-purple-400/50 shadow-lg shadow-purple-950/20 transition-all duration-300 hover:-translate-y-1 group">
            <div className="w-12 h-12 rounded-2xl bg-indigo-950/60 border border-indigo-500/40 text-indigo-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-md shadow-indigo-950/40">
              <RotateCcw className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white mb-2">
              Reverse Lagrangian Hydrodynamics
            </h3>
            <p className="text-xs text-slate-400 font-medium leading-relaxed">
              2D Lagrangian transport solver operating backwards in time from satellite acquisition, integrating HYCOM ocean currents, wind-driven Stokes drift, and Fay spreading kinetics.
            </p>
          </div>

          {/* Service 3 */}
          <div className="p-6 rounded-3xl bg-gradient-to-br from-slate-950/90 via-purple-950/25 to-slate-900/90 backdrop-blur-md border border-purple-500/20 hover:border-purple-400/50 shadow-lg shadow-purple-950/20 transition-all duration-300 hover:-translate-y-1 group">
            <div className="w-12 h-12 rounded-2xl bg-cyan-950/60 border border-cyan-500/40 text-cyan-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-md shadow-cyan-950/40">
              <Ship className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white mb-2">
              AIS Anomaly &amp; Dark Vessel Fusion
            </h3>
            <p className="text-xs text-slate-400 font-medium leading-relaxed">
              Normalizes global satellite AIS telemetry, identifying transponder blackout episodes, sudden speed drops, course deviations, and illicit ballast tank wash maneuvers.
            </p>
          </div>

        </div>
      </section>

      {/* SENSOR & TELEMETRY FEEDS */}
      <section id="samples" className="py-16 px-4 lg:px-8 max-w-7xl mx-auto border-t border-purple-500/20">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-white font-display">
              Sensor &amp; Telemetry Feeds
            </h2>
            <p className="text-xs sm:text-sm font-medium text-slate-400 mt-1">
              Inspect live acoustic, radar, and hydrodynamic telemetry signals
            </p>
          </div>
          <span className="text-xs font-mono text-purple-400 cursor-pointer hover:underline font-bold">
            6 ACTIVE CHANNELS
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {telemetrySamples.map((sample) => (
            <div 
              key={sample.id}
              className={`p-4 rounded-2xl border transition-all ${
                playingAudioId === sample.id
                  ? 'bg-slate-900/95 border-purple-400 shadow-xl shadow-purple-950/60'
                  : 'bg-gradient-to-br from-slate-950/90 via-purple-950/15 to-slate-900/90 border-purple-500/20 hover:border-purple-400/40 shadow-sm'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <h4 className="text-xs font-bold text-white truncate">
                  {sample.title}
                </h4>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-purple-950/70 border border-purple-500/30 text-purple-300 font-bold">
                  {sample.badge}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-normal mb-3 line-clamp-2">
                {sample.desc}
              </p>

              {/* Player Waveform Bar */}
              <div className="flex items-center gap-2.5 bg-slate-900/90 px-3 py-2 rounded-xl border border-purple-500/20">
                <button
                  onClick={() => handleTogglePlay(sample.id)}
                  className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                    playingAudioId === sample.id
                      ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white animate-pulse shadow-md shadow-purple-500/40'
                      : 'bg-slate-800 hover:bg-purple-950 text-slate-300 hover:text-purple-300'
                  }`}
                >
                  {playingAudioId === sample.id ? (
                    <Pause className="w-3 h-3 fill-current" />
                  ) : (
                    <Play className="w-3 h-3 fill-current ml-0.5" />
                  )}
                </button>

                {/* Animated Waveform Bars */}
                <div className="flex-1 flex items-center gap-1 h-4 overflow-hidden">
                  {[40, 70, 30, 90, 60, 45, 80, 50, 95, 35, 60, 75, 40, 85, 55, 65].map((h, i) => (
                    <div
                      key={i}
                      className={`flex-1 rounded-full transition-all ${
                        playingAudioId === sample.id ? 'bg-gradient-to-t from-purple-500 to-cyan-400' : 'bg-slate-700'
                      }`}
                      style={{
                        height: playingAudioId === sample.id ? `${Math.max(25, (h + i * 15) % 100)}%` : `${h * 0.4}%`
                      }}
                    />
                  ))}
                </div>

                <span className="text-[10px] font-mono text-slate-400">
                  {sample.duration.split(' ')[0]}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-12 px-4 lg:px-8 max-w-7xl mx-auto border-t border-purple-500/20 text-center text-slate-400">
        <p className="text-xs font-mono uppercase tracking-widest text-purple-300/70 mb-6">
          Strategic Aerospace &amp; Marine Reconnaissance Partnerships
        </p>

        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16 opacity-90">
          <div className="font-mono text-xs text-slate-300 flex items-center gap-1.5">
            <Satellite className="w-4 h-4 text-purple-400" /> NTRO Space Tech
          </div>
          <div className="font-mono text-xs text-slate-300 flex items-center gap-1.5">
            <Globe className="w-4 h-4 text-indigo-400" /> IMO MARPOL Annex I
          </div>
          <div className="font-mono text-xs text-slate-300 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" /> EMSA CleanSeaNet
          </div>
          <div className="font-mono text-xs text-slate-300 flex items-center gap-1.5">
            <Radio className="w-4 h-4 text-cyan-400" /> ESA Copernicus Sentinel-1
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-900/80 text-xs font-mono flex flex-wrap justify-between items-center gap-4 text-slate-500">
          <p>© 2026 TraceX Intelligence. SIH26143 / NTRO Problem Statement.</p>
          <p>Space-Borne Decision Support System • Satellite SAR &amp; Marine Discharge Attribution</p>
        </div>
      </footer>

    </div>
  );
};
