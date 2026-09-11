import React, { useState, useMemo } from 'react';
import { 
  GitFork, Sparkles, ShieldAlert, CheckCircle2, ChevronRight, Activity, Flame, Ship, Wind,
  ZoomIn, ZoomOut, Filter, Play, RefreshCw, Layers, SlidersHorizontal, Info, Eye
} from 'lucide-react';
import { Incident, Vessel } from '../../types';

interface EvidenceGraphViewProps {
  incident: Incident;
  selectedVessel: Vessel;
  onSelectVessel: (v: Vessel) => void;
}

interface SatelliteNode {
  id: string;
  label: string;
  tag: number;
  x: number;
  y: number;
  color: string;
}

interface HubNode {
  id: string;
  label: string;
  category: string;
  confidence: number;
  color: string;
  glowColor: string;
  x: number;
  y: number;
  radius: number;
  isPrimaryBeam?: boolean;
  satellites: SatelliteNode[];
  details: string;
  metrics: { label: string; value: string }[];
}

export const EvidenceGraphView: React.FC<EvidenceGraphViewProps> = ({
  incident,
  selectedVessel,
  onSelectVessel,
}) => {
  const [activeNodeId, setActiveNodeId] = useState<string>('origin-core');
  const [activeTimeline, setActiveTimeline] = useState<string>('2024-T3');
  const [filterType, setFilterType] = useState<'all' | 'high-conf' | 'vessels' | 'anomalies'>('all');
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);

  // Center Origin / Constitution Core
  const centerCore = {
    id: 'origin-core',
    label: 'Forensic Origin & Attribution Core',
    shortLabel: 'Origin Core',
    category: 'Core Attribution Engine',
    confidence: 94,
    x: 600,
    y: 350,
    radius: 36,
    details: `Lagrangian reverse trajectory convergence at Lat ${incident.coordinates.lat.toFixed(3)}°, Lon ${incident.coordinates.lng.toFixed(3)}°. Hydrodynamic back-projection isolates discharge window to 16:20-17:05 UTC.`,
    metrics: [
      { label: 'Slick Footprint', value: `${incident.areaKm2} km²` },
      { label: 'Attribution Score', value: '94.2% Conf.' },
      { label: 'Confidence Tier', value: 'Level 4 Judicial' },
      { label: 'Ledger State', value: 'SHA-256 Validated' }
    ]
  };

  // Primary Celestial Hubs (Radiating around core like Image 1)
  const hubs: HubNode[] = useMemo(() => [
    {
      id: 'hub-slick',
      label: 'SAR Dielectric Slick Plume',
      category: 'SAR Radar Signature',
      confidence: 96,
      color: '#f43f5e',
      glowColor: 'rgba(244, 63, 94, 0.45)',
      x: 350,
      y: 190,
      radius: 23,
      isPrimaryBeam: true,
      details: `Sentinel-1 C-SAR Dual-Pol (VV/VH) radar acquisition at ${incident.detectionTimestamp}. Normalized radar cross-section damping indicates heavy fuel oil slick of 18.64 km².`,
      metrics: [
        { label: 'Radar Sensor', value: 'Sentinel-1B C-Band' },
        { label: 'Polarization', value: 'VV + VH Cross-Pol' },
        { label: 'Backscatter Dip', value: '-24.8 dB Damping' }
      ],
      satellites: [
        { id: 'sat-sar-1', label: 'VV/VH Polarity Ratio', tag: 24, x: 280, y: 150, color: '#34d399' },
        { id: 'sat-sar-2', label: 'NRCS Damping Peak', tag: 18, x: 300, y: 240, color: '#fbbf24' },
        { id: 'sat-sar-3', label: 'Surface Tension Gradient', tag: 35, x: 230, y: 190, color: '#a78bfa' }
      ]
    },
    {
      id: 'hub-drift',
      label: 'Lagrangian Reverse Advection',
      category: 'Hydrodynamics',
      confidence: 87,
      color: '#06b6d4',
      glowColor: 'rgba(6, 182, 212, 0.45)',
      x: 520,
      y: 130,
      radius: 22,
      isPrimaryBeam: true,
      details: `Back-tracing 6-hour drift vector using HYCOM ocean currents (${incident.currentKnots} kn @ ${incident.currentDirectionDeg}°) and ECMWF surface winds (${incident.windSpeedKnots} kn @ ${incident.windDirectionDeg}°).`,
      metrics: [
        { label: 'Ocean Current', value: `${incident.currentKnots} kn @ ${incident.currentDirectionDeg}°` },
        { label: 'Surface Wind', value: `${incident.windSpeedKnots} kn @ ${incident.windDirectionDeg}°` },
        { label: 'Stokes Drift', value: '1.42 kn True' }
      ],
      satellites: [
        { id: 'sat-drift-1', label: 'Stokes Drift Field', tag: 20, x: 470, y: 90, color: '#38bdf8' },
        { id: 'sat-drift-2', label: 'HYCOM Velocity', tag: 15, x: 580, y: 80, color: '#818cf8' }
      ]
    },
    {
      id: 'hub-origin',
      label: 'Spatiotemporal Origin Corridor',
      category: 'Origin Ellipse',
      confidence: 89,
      color: '#f59e0b',
      glowColor: 'rgba(245, 158, 11, 0.45)',
      x: 770,
      y: 150,
      radius: 24,
      isPrimaryBeam: true,
      details: `Bayesian probability ellipse bounding discharge coordinates within radius ${incident.probableOrigin.radiusKm} km during window ${incident.probableOrigin.timeWindowStart} - ${incident.probableOrigin.timeWindowEnd}.`,
      metrics: [
        { label: 'Radius', value: `${incident.probableOrigin.radiusKm} km Ellipse` },
        { label: 'Time Window', value: `${incident.probableOrigin.timeWindowStart} UTC` },
        { label: 'Fay Dispersion', value: '1.8 mm Mean Depth' }
      ],
      satellites: [
        { id: 'sat-orig-1', label: 'Corridor Boundary', tag: 18, x: 840, y: 110, color: '#34d399' },
        { id: 'sat-orig-2', label: 'Fay Model Rate', tag: 22, x: 740, y: 85, color: '#fbbf24' }
      ]
    },
    {
      id: 'hub-vessel-1',
      label: `#1 ${incident.vessels[0]?.name || 'MV Neptune Voyager'}`,
      category: 'Primary Suspect Vessel',
      confidence: 94,
      color: '#ef4444',
      glowColor: 'rgba(239, 68, 68, 0.5)',
      x: 900,
      y: 300,
      radius: 25,
      isPrimaryBeam: true,
      details: `Crude Tanker IMO 9482718. Direct spatial intersection with origin ellipse at 16:34 UTC. Speed drop from 14.2 to 4.1 kn accompanied by 47-min AIS dark window.`,
      metrics: [
        { label: 'MMSI / IMO', value: '228394000 / 9482718' },
        { label: 'Flag & Type', value: 'Liberia (LR) • Crude Tanker' },
        { label: 'Intersection', value: '94.2% Confluence' }
      ],
      satellites: [
        { id: 'sat-v1-1', label: 'Draft Reduction (-3.6m)', tag: 24, x: 970, y: 250, color: '#f87171' },
        { id: 'sat-v1-2', label: 'Rudder Maneuver 38°', tag: 8, x: 960, y: 350, color: '#fbbf24' },
        { id: 'sat-v1-3', label: 'Cargo Log Anomaly', tag: 19, x: 920, y: 210, color: '#38bdf8' }
      ]
    },
    {
      id: 'hub-ais-gap',
      label: 'AIS Dark Transponder Gap',
      category: 'AIS Telemetry Anomaly',
      confidence: 100,
      color: '#a855f7',
      glowColor: 'rgba(168, 85, 247, 0.45)',
      x: 850,
      y: 500,
      radius: 23,
      isPrimaryBeam: true,
      details: 'Complete transponder blackout spanning 47 minutes inside international waters corridor. Transmission resumed with displaced dead-reckoning trajectory.',
      metrics: [
        { label: 'Gap Duration', value: '47 Minutes Blackout' },
        { label: 'Coverage Void', value: '18.4 Nautical Miles' },
        { label: 'Resumption Fix', value: 'Lat 24.81° Lon 56.40°' }
      ],
      satellites: [
        { id: 'sat-ais-1', label: 'VHF Transmitter Drop', tag: 40, x: 920, y: 550, color: '#a78bfa' },
        { id: 'sat-ais-2', label: 'Satellite Re-acquisition', tag: 20, x: 880, y: 590, color: '#38bdf8' },
        { id: 'sat-ais-3', label: 'Last Known Fix 16:12', tag: 7, x: 790, y: 560, color: '#34d399' }
      ]
    },
    {
      id: 'hub-kinematics',
      label: 'Kinematic Speed Deceleration',
      category: 'Engine & Propulsion',
      confidence: 91,
      color: '#ec4899',
      glowColor: 'rgba(236, 72, 153, 0.45)',
      x: 640,
      y: 570,
      radius: 23,
      isPrimaryBeam: true,
      details: 'Propulsion power dropped sharply from cruising speed (14.2 kn) to discharge drift speed (4.1 kn), consistent with tank washing and slop discharge procedure.',
      metrics: [
        { label: 'Speed Baseline', value: '14.2 kn Service Speed' },
        { label: 'Minimum Speed', value: '4.1 kn Drift' },
        { label: 'RPM Signature', value: '-68% Load Reduction' }
      ],
      satellites: [
        { id: 'sat-kin-1', label: 'Shaft RPM Metric', tag: 31, x: 600, y: 640, color: '#f472b6' },
        { id: 'sat-kin-2', label: 'Aux Bilge Run', tag: 13, x: 690, y: 640, color: '#fbbf24' }
      ]
    },
    {
      id: 'hub-vessel-2',
      label: `#2 ${incident.vessels[1]?.name || 'MT Ocean Titan'}`,
      category: 'Secondary Vessel',
      confidence: 18,
      color: '#38bdf8',
      glowColor: 'rgba(56, 189, 248, 0.45)',
      x: 410,
      y: 540,
      radius: 22,
      isPrimaryBeam: false,
      details: 'Chemical Tanker IMO 9321045. Passed 4.8 km south of the origin corridor with unbroken Class-A AIS transmission and steady 12.8 kn speed profile. Exonerated.',
      metrics: [
        { label: 'CPA Distance', value: '4.8 km Clearance' },
        { label: 'AIS Continuity', value: '100% Unbroken' },
        { label: 'Verdict State', value: 'Cleared / Exonerated' }
      ],
      satellites: [
        { id: 'sat-v2-1', label: 'Corridor Clearance', tag: 29, x: 340, y: 600, color: '#38bdf8' },
        { id: 'sat-v2-2', label: 'Continuous Broadcast', tag: 8, x: 440, y: 620, color: '#34d399' }
      ]
    },
    {
      id: 'hub-verdict',
      label: 'Judicial Attribution Dossier',
      category: 'Legal Evidence Pack',
      confidence: 98,
      color: '#10b981',
      glowColor: 'rgba(16, 185, 129, 0.45)',
      x: 270,
      y: 360,
      radius: 24,
      isPrimaryBeam: true,
      details: 'Cryptographically sealed forensic package combining SAR dielectric footprint, ocean current inversion, and kinematic telemetry for MARPOL Annex I prosecution.',
      metrics: [
        { label: 'Evidence Hash', value: '0x7e4b...92fa' },
        { label: 'Jurisdiction', value: 'EEZ Maritime Court' },
        { label: 'MARPOL Protocol', value: 'Annex I Reg 15' }
      ],
      satellites: [
        { id: 'sat-ver-1', label: 'Cryptographic Ledger', tag: 29, x: 190, y: 320, color: '#34d399' },
        { id: 'sat-ver-2', label: 'CleanSeaNet Match', tag: 14, x: 180, y: 410, color: '#fbbf24' },
        { id: 'sat-ver-3', label: 'Chain of Custody', tag: 22, x: 220, y: 470, color: '#a78bfa' }
      ]
    }
  ], [incident]);

  // Secondary cross-links between hubs & satellites (creating the constellation mesh in Image 1)
  const crossLinks = useMemo(() => [
    { from: 'hub-slick', to: 'hub-drift', color: '#06b6d4', width: 1.5, dash: '4,4' },
    { from: 'hub-drift', to: 'hub-origin', color: '#f59e0b', width: 1.5, dash: '4,4' },
    { from: 'hub-origin', to: 'hub-vessel-1', color: '#ef4444', width: 2, dash: 'none' },
    { from: 'hub-origin', to: 'hub-vessel-2', color: '#38bdf8', width: 1.2, dash: '3,3' },
    { from: 'hub-vessel-1', to: 'hub-ais-gap', color: '#a855f7', width: 1.8, dash: 'none' },
    { from: 'hub-ais-gap', to: 'hub-kinematics', color: '#ec4899', width: 1.8, dash: 'none' },
    { from: 'hub-kinematics', to: 'hub-verdict', color: '#10b981', width: 1.5, dash: '4,4' },
    { from: 'hub-slick', to: 'hub-verdict', color: '#10b981', width: 1.5, dash: 'none' },
    { from: 'hub-vessel-1', to: 'hub-verdict', color: '#f59e0b', width: 1.8, dash: 'none' }
  ], []);

  // Filter hubs based on toolbar
  const filteredHubs = useMemo(() => {
    if (filterType === 'high-conf') return hubs.filter(h => h.confidence >= 85);
    if (filterType === 'vessels') return hubs.filter(h => h.id.includes('vessel'));
    if (filterType === 'anomalies') return hubs.filter(h => h.id.includes('ais') || h.id.includes('kinematics'));
    return hubs;
  }, [hubs, filterType]);

  // Find active node object
  const activeNode = useMemo(() => {
    if (activeNodeId === 'origin-core') return centerCore;
    const foundHub = hubs.find(h => h.id === activeNodeId);
    if (foundHub) return foundHub;
    for (const h of hubs) {
      const sat = h.satellites.find(s => s.id === activeNodeId);
      if (sat) {
        return {
          id: sat.id,
          label: sat.label,
          category: `Satellite Telemetry • Ref #${sat.tag}`,
          confidence: h.confidence,
          color: sat.color,
          details: `Corroborating signal point #${sat.tag} linked to ${h.label}. Calibrated at timestamp ${incident.detectionTimestamp}.`,
          metrics: [
            { label: 'Parent Hub', value: h.label },
            { label: 'Signal Reference', value: `Sensor-ID #${sat.tag}` },
            { label: 'Status', value: 'Validated Active' }
          ]
        };
      }
    }
    return centerCore;
  }, [activeNodeId, hubs, centerCore, incident]);

  // Corona rays for the central sun core (42 radial spiky sunbeams like Image 1)
  const coronaRays = useMemo(() => {
    const rays = [];
    const count = 42;
    for (let i = 0; i < count; i++) {
      const angle = (i * 360) / count;
      const rad = (angle * Math.PI) / 180;
      const innerR = 38;
      const outerR = 48 + ((i % 3 === 0) ? 18 : (i % 2 === 0) ? 10 : 5);
      const x1 = centerCore.x + Math.cos(rad) * innerR;
      const y1 = centerCore.y + Math.sin(rad) * innerR;
      const x2 = centerCore.x + Math.cos(rad) * outerR;
      const y2 = centerCore.y + Math.sin(rad) * outerR;
      rays.push({ id: i, x1, y1, x2, y2, angle, isMajor: i % 3 === 0 });
    }
    return rays;
  }, [centerCore.x, centerCore.y]);

  // Calculate tapered flare polygon coordinates between center core and a hub
  const getTaperedBeamPath = (hub: HubNode) => {
    const dx = hub.x - centerCore.x;
    const dy = hub.y - centerCore.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist === 0) return '';

    // Unit vector
    const ux = dx / dist;
    const uy = dy / dist;
    // Perpendicular vector
    const px = -uy;
    const py = ux;

    const baseHalfW = 16; // flared base width near sun core
    const tipHalfW = 4;   // tapered narrow width near target hub

    // Start 32px away from center, end 22px before hub center
    const startDist = 32;
    const endDist = Math.max(startDist + 10, dist - hub.radius - 2);

    const p1x = centerCore.x + ux * startDist + px * baseHalfW;
    const p1y = centerCore.y + uy * startDist + py * baseHalfW;

    const p2x = centerCore.x + ux * endDist + px * tipHalfW;
    const p2y = centerCore.y + uy * endDist + py * tipHalfW;

    const p3x = centerCore.x + ux * endDist - px * tipHalfW;
    const p3y = centerCore.y + uy * endDist - py * tipHalfW;

    const p4x = centerCore.x + ux * startDist - px * baseHalfW;
    const p4y = centerCore.y + uy * startDist - py * baseHalfW;

    return `M ${p1x} ${p1y} L ${p2x} ${p2y} L ${p3x} ${p3y} L ${p4x} ${p4y} Z`;
  };

  const handleSimulate = () => {
    setIsSimulating(true);
    setTimeout(() => setIsSimulating(false), 3200);
  };

  return (
    <div className="bg-[#03090e] p-4 lg:p-6 rounded-3xl border border-[#0d2a35] shadow-2xl shadow-cyan-950/40 space-y-4 flex flex-col font-sans text-slate-100 select-none">
      
      {/* Top Application Bar matching Image 1: Policy Platform header + View toggle + Zoom controls + Simulation button */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-3 border-b border-[#0f323f]/60">
        
        {/* Left: Platform Title & Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-500/20 via-cyan-500/20 to-purple-600/30 border border-amber-400/40 flex items-center justify-center text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.2)]">
            <GitFork className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-extrabold tracking-tight text-white font-sans">
                TraceX Policy Platform
              </h2>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-amber-400/10 text-amber-300 border border-amber-400/30">
                CONSTELLATION v2.4
              </span>
            </div>
            <p className="text-[11px] font-mono text-cyan-300/60 font-medium">
              Forensic Attributive Graph • Neural Multi-Modal Maritime Graph
            </p>
          </div>
        </div>

        {/* Center: Interactive Toolbar matching the header in Image 1 */}
        <div className="flex items-center gap-1.5 bg-[#071922]/90 p-1 rounded-2xl border border-[#133c4a]">
          <button
            onClick={() => setFilterType('all')}
            title="Full Graph View"
            className={`p-2 rounded-xl transition-all ${filterType === 'all' ? 'bg-amber-400/20 text-amber-300 shadow-inner' : 'text-slate-400 hover:text-slate-200'}`}
          >
            <Layers className="w-4 h-4" />
          </button>
          <button
            onClick={() => setFilterType(filterType === 'vessels' ? 'all' : 'vessels')}
            title="Filter Vessels"
            className={`p-2 rounded-xl transition-all ${filterType === 'vessels' ? 'bg-cyan-500/20 text-cyan-300 shadow-inner' : 'text-slate-400 hover:text-slate-200'}`}
          >
            <Ship className="w-4 h-4" />
          </button>
          <div className="w-px h-5 bg-[#133c4a] mx-0.5" />
          <button
            onClick={() => setZoomLevel(prev => Math.min(prev + 0.15, 1.45))}
            title="Zoom In"
            className="p-2 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-[#0c2b36] transition-colors"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={() => setZoomLevel(prev => Math.max(prev - 0.15, 0.8))}
            title="Zoom Out"
            className="p-2 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-[#0c2b36] transition-colors"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <div className="w-px h-5 bg-[#133c4a] mx-0.5" />
          <button
            onClick={() => setFilterType(prev => prev === 'high-conf' ? 'all' : 'high-conf')}
            title="High Confidence Only (>85%)"
            className={`p-2 rounded-xl transition-all ${filterType === 'high-conf' ? 'bg-emerald-500/20 text-emerald-300' : 'text-slate-400 hover:text-slate-200'}`}
          >
            <Filter className="w-4 h-4" />
          </button>
        </div>

        {/* Right: + New Simulation Gold Pill Button */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleSimulate}
            disabled={isSimulating}
            className="px-4 py-2 rounded-full border border-amber-400/70 text-amber-300 bg-amber-400/10 hover:bg-amber-400/20 active:scale-95 transition-all text-xs font-mono font-bold flex items-center gap-2 shadow-[0_0_15px_rgba(245,158,11,0.15)] disabled:opacity-60"
          >
            <Play className={`w-3.5 h-3.5 fill-amber-300 ${isSimulating ? 'animate-spin' : ''}`} />
            <span>{isSimulating ? 'Propagating Field...' : '+ New Simulation'}</span>
          </button>
        </div>
      </div>

      {/* Main Celestial Canvas Container */}
      <div className="relative w-full h-[620px] rounded-2xl bg-gradient-to-b from-[#020b10] via-[#051a22] to-[#02090e] border border-[#0d2e3b] overflow-hidden shadow-2xl flex items-center justify-center">
        
        {/* Subtle background radial nebula glow */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_48%,rgba(14,64,74,0.35)_0%,rgba(6,27,33,0.6)_50%,transparent_100%)] pointer-events-none" />
        
        {/* Ambient star dust particles */}
        <div className="absolute inset-0 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:36px_36px] opacity-15 pointer-events-none" />

        {/* Left Side Vertical Timeline Rail (matching Image 1 with timeline indicators 2017 -> 2024) */}
        <div className="absolute left-4 top-1/2 -translate-y-1/2 z-20 flex flex-col items-center gap-3 py-4 select-none pointer-events-auto">
          {/* Jagged rail edge */}
          <div className="absolute -left-1 top-0 bottom-0 w-2 flex flex-col justify-between items-center opacity-30 pointer-events-none">
            {Array.from({ length: 18 }).map((_, i) => (
              <div key={i} className="w-1.5 h-1 bg-cyan-400/60 rounded-full" />
            ))}
          </div>

          {[
            { year: '2017', label: 'T-6h Baselines', active: false },
            { year: '2018', label: 'T-5h Transit', active: false },
            { year: '2019', label: 'T-4h AIS Ping', active: false },
            { year: '2020', label: 'T-3h Discharge', active: true },
            { year: '2021', label: 'T-2h Drift Vector', active: false },
            { year: '2022', label: 'T-1h Slick Plume', active: false },
            { year: '2023', label: 'T-0h Detection', active: false },
            { year: '2024', label: 'Attribution Verdict', active: false },
          ].map((item) => {
            const isSelected = activeTimeline === item.year || (activeTimeline === '2024-T3' && item.active);
            return (
              <button
                key={item.year}
                onClick={() => setActiveTimeline(item.year)}
                className={`group relative flex items-center transition-all ${
                  isSelected
                    ? 'px-3 py-1 rounded-full border border-amber-300/80 bg-amber-400/15 shadow-[0_0_18px_rgba(251,191,36,0.35)] scale-110'
                    : 'px-2 py-0.5 text-slate-500 hover:text-slate-300'
                }`}
              >
                <span
                  className={`font-mono text-xs font-extrabold ${
                    isSelected ? 'text-amber-200' : 'text-slate-500 group-hover:text-slate-300'
                  }`}
                >
                  {item.year}
                </span>

                {/* Tooltip on hover */}
                <span className="absolute left-full ml-3 px-2 py-1 rounded bg-[#071922] border border-[#133c4a] text-[10px] font-mono text-cyan-300 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-30 shadow-lg">
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Bottom Left Floating Glassmorphic Legend matching Image 1 */}
        <div className="absolute bottom-4 left-4 z-20 bg-[#041219]/80 backdrop-blur-md px-3.5 py-2.5 rounded-2xl border border-[#0e3340] shadow-lg text-[11px] font-mono space-y-1.5 pointer-events-none">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Legend</div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-amber-400 shadow-[0_0_8px_#f59e0b] border border-amber-200" />
            <span className="text-slate-300">1 Origin Core (Attribution)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-rose-400 shadow-[0_0_8px_#f43f5e] border border-rose-200" />
            <span className="text-slate-300">8 Celestial Hubs</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_6px_#10b981]" />
            <span className="text-slate-400">21 Corroborating Signals</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-4 h-0.5 bg-gradient-to-r from-amber-400 to-transparent" />
            <span className="text-slate-400">Volumetric Sunbeam Flare</span>
          </div>
        </div>

        {/* SVG Viewport */}
        <svg
          className="w-full h-full transition-transform duration-500 ease-out"
          viewBox="0 0 1200 720"
          style={{ transform: `scale(${zoomLevel})` }}
        >
          <defs>
            {/* Soft Glow Filter */}
            <filter id="softGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            {/* Radiant Sunbeam Filter for the Golden Center Flares */}
            <filter id="beamGlow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="8" result="heavyBlur" />
              <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="lightBlur" />
              <feMerge>
                <feMergeNode in="heavyBlur" />
                <feMergeNode in="lightBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            {/* Central Sun Golden Radial Gradient */}
            <radialGradient id="sunCoreGrad" cx="38%" cy="32%" r="65%">
              <stop offset="0%" stopColor="#fffbeb" />
              <stop offset="35%" stopColor="#fde047" />
              <stop offset="70%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#b45309" />
            </radialGradient>

            {/* 3D Glossy Sphere Gradients for Hubs */}
            <radialGradient id="roseSphere" cx="35%" cy="30%" r="65%">
              <stop offset="0%" stopColor="#ffe4e6" />
              <stop offset="30%" stopColor="#f43f5e" />
              <stop offset="75%" stopColor="#9f1239" />
              <stop offset="100%" stopColor="#4c0519" />
            </radialGradient>

            <radialGradient id="cyanSphere" cx="35%" cy="30%" r="65%">
              <stop offset="0%" stopColor="#ecfeff" />
              <stop offset="30%" stopColor="#06b6d4" />
              <stop offset="75%" stopColor="#0e7490" />
              <stop offset="100%" stopColor="#164e63" />
            </radialGradient>

            <radialGradient id="amberSphere" cx="35%" cy="30%" r="65%">
              <stop offset="0%" stopColor="#fef3c7" />
              <stop offset="30%" stopColor="#f59e0b" />
              <stop offset="75%" stopColor="#b45309" />
              <stop offset="100%" stopColor="#78350f" />
            </radialGradient>

            <radialGradient id="purpleSphere" cx="35%" cy="30%" r="65%">
              <stop offset="0%" stopColor="#f3e8ff" />
              <stop offset="30%" stopColor="#a855f7" />
              <stop offset="75%" stopColor="#7e22ce" />
              <stop offset="100%" stopColor="#3b0764" />
            </radialGradient>

            <radialGradient id="emeraldSphere" cx="35%" cy="30%" r="65%">
              <stop offset="0%" stopColor="#ecfdf5" />
              <stop offset="30%" stopColor="#10b981" />
              <stop offset="75%" stopColor="#047857" />
              <stop offset="100%" stopColor="#064e3b" />
            </radialGradient>

            {/* Beam Gradients for each Hub */}
            {hubs.map(hub => (
              <linearGradient
                key={`beam-grad-${hub.id}`}
                id={`beam-grad-${hub.id}`}
                x1={centerCore.x}
                y1={centerCore.y}
                x2={hub.x}
                y2={hub.y}
                gradientUnits="userSpaceOnUse"
              >
                <stop offset="0%" stopColor="#fef08a" stopOpacity="0.75" />
                <stop offset="35%" stopColor="#f59e0b" stopOpacity="0.45" />
                <stop offset="85%" stopColor={hub.color} stopOpacity="0.25" />
                <stop offset="100%" stopColor={hub.color} stopOpacity="0.05" />
              </linearGradient>
            ))}
          </defs>

          {/* LAYER 1: Secondary Cross-Network Links (Cyan / Violet subtle mesh) */}
          <g className="cross-links opacity-60">
            {crossLinks.map((link, idx) => {
              const src = hubs.find(h => h.id === link.from);
              const dst = hubs.find(h => h.id === link.to);
              if (!src || !dst) return null;
              return (
                <g key={`cross-${idx}`}>
                  <line
                    x1={src.x}
                    y1={src.y}
                    x2={dst.x}
                    y2={dst.y}
                    stroke={link.color}
                    strokeWidth={link.width}
                    strokeDasharray={link.dash}
                    strokeOpacity="0.5"
                  />
                  {/* Active traveling photon on cross links */}
                  <circle r="2.5" fill={link.color}>
                    <animateMotion
                      path={`M ${src.x} ${src.y} L ${dst.x} ${dst.y}`}
                      dur={`${3.5 + (idx % 3)}s`}
                      repeatCount="indefinite"
                    />
                  </circle>
                </g>
              );
            })}
          </g>

          {/* LAYER 2: Radiant Tapered Volumetric Sunbeams from Center Core to Hubs */}
          <g className="tapered-sunbeams">
            {filteredHubs.map(hub => {
              const beamPath = getTaperedBeamPath(hub);
              if (!beamPath) return null;
              return (
                <g key={`beam-${hub.id}`}>
                  {/* Flared volumetric beam polygon */}
                  <path
                    d={beamPath}
                    fill={`url(#beam-grad-${hub.id})`}
                    filter="url(#beamGlow)"
                    className="transition-opacity duration-300"
                    opacity={activeNodeId === hub.id ? 1 : 0.75}
                  />

                  {/* Sharp laser core filament in center of beam */}
                  <line
                    x1={centerCore.x}
                    y1={centerCore.y}
                    x2={hub.x}
                    y2={hub.y}
                    stroke="#fef08a"
                    strokeWidth="1.2"
                    strokeOpacity="0.8"
                  />

                  {/* High-speed energy pulse traveling down the flare */}
                  <circle r="3.5" fill="#ffffff" filter="url(#softGlow)">
                    <animateMotion
                      path={`M ${centerCore.x} ${centerCore.y} L ${hub.x} ${hub.y}`}
                      dur={isSimulating ? '1s' : `${2.2 + (hub.confidence % 3) * 0.4}s`}
                      repeatCount="indefinite"
                    />
                  </circle>
                </g>
              );
            })}
          </g>

          {/* LAYER 3: Satellite Leaf Nodes and Connecting Stems */}
          <g className="satellites">
            {filteredHubs.map(hub =>
              hub.satellites.map(sat => (
                <g
                  key={sat.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveNodeId(sat.id);
                  }}
                  className="cursor-pointer group"
                >
                  {/* Connecting stem line */}
                  <line
                    x1={hub.x}
                    y1={hub.y}
                    x2={sat.x}
                    y2={sat.y}
                    stroke="rgba(255, 255, 255, 0.22)"
                    strokeWidth="1.2"
                    strokeDasharray="2,2"
                  />

                  {/* Small traveling speck */}
                  <circle r="1.5" fill={sat.color}>
                    <animateMotion
                      path={`M ${hub.x} ${hub.y} L ${sat.x} ${sat.y}`}
                      dur="2.5s"
                      repeatCount="indefinite"
                    />
                  </circle>

                  {/* Satellite Orb */}
                  <circle
                    cx={sat.x}
                    cy={sat.y}
                    r={activeNodeId === sat.id ? 8 : 6}
                    fill={sat.color}
                    stroke="#ffffff"
                    strokeWidth="1.5"
                    filter="url(#softGlow)"
                    className="transition-all duration-200 group-hover:scale-125"
                  />

                  {/* Numerical Tag Badge Pill right next to satellite orb (e.g. 24, 18, 35 as in Image 1) */}
                  <g transform={`translate(${sat.x + 8}, ${sat.y - 6})`}>
                    <rect
                      x="0"
                      y="0"
                      width="18"
                      height="12"
                      rx="4"
                      fill="#04141c"
                      stroke="rgba(255, 255, 255, 0.35)"
                      strokeWidth="0.8"
                    />
                    <text
                      x="9"
                      y="9"
                      textAnchor="middle"
                      fill="#f8fafc"
                      fontSize="8"
                      fontFamily="monospace"
                      fontWeight="bold"
                    >
                      {sat.tag}
                    </text>
                  </g>
                </g>
              ))
            )}
          </g>

          {/* LAYER 4: Radiant Golden Sun Center Core (Constitution / Origin Core) */}
          <g
            className="center-core cursor-pointer group"
            onClick={() => setActiveNodeId('origin-core')}
          >
            {/* Spiky Corona Sunbeam Rays (42 rays radiating outwards) */}
            <g className="corona-rays">
              {coronaRays.map(ray => (
                <line
                  key={ray.id}
                  x1={ray.x1}
                  y1={ray.y1}
                  x2={ray.x2}
                  y2={ray.y2}
                  stroke="#fbbf24"
                  strokeWidth={ray.isMajor ? 1.8 : 1}
                  strokeOpacity={ray.isMajor ? 0.9 : 0.6}
                  strokeLinecap="round"
                />
              ))}
            </g>

            {/* Glowing Aura Rings */}
            <circle
              cx={centerCore.x}
              cy={centerCore.y}
              r={centerCore.radius + 12}
              fill="none"
              stroke="#f59e0b"
              strokeWidth="1.5"
              strokeDasharray="4,3"
              strokeOpacity="0.4"
              className="animate-[spin_40s_linear_infinite]"
            />
            <circle
              cx={centerCore.x}
              cy={centerCore.y}
              r={centerCore.radius + 6}
              fill="none"
              stroke="#fbbf24"
              strokeWidth="2"
              strokeOpacity="0.7"
            />

            {/* Core 3D Sun Sphere */}
            <circle
              cx={centerCore.x}
              cy={centerCore.y}
              r={centerCore.radius}
              fill="url(#sunCoreGrad)"
              stroke="#ffffff"
              strokeWidth="2.5"
              filter="url(#softGlow)"
              className="transition-transform group-hover:scale-105"
            />

            {/* Inner Concentric Rings */}
            <circle
              cx={centerCore.x}
              cy={centerCore.y}
              r={centerCore.radius * 0.65}
              fill="none"
              stroke="#ffffff"
              strokeWidth="1.5"
              strokeOpacity="0.8"
            />
            <circle
              cx={centerCore.x}
              cy={centerCore.y}
              r={centerCore.radius * 0.3}
              fill="#ffffff"
              opacity="0.9"
            />

            {/* Text Label: "Constitution" / "Origin Core" with percentage badge */}
            <g transform={`translate(${centerCore.x + 48}, ${centerCore.y + 4})`}>
              <text
                x="0"
                y="0"
                fill="#ffffff"
                fontSize="13"
                fontFamily="Inter, Roboto, sans-serif"
                fontWeight="800"
                filter="drop-shadow(0 2px 4px rgba(0,0,0,0.8))"
              >
                Constitution
              </text>
              {/* Badge 47% or 94% */}
              <g transform="translate(0, 5)">
                <rect
                  x="0"
                  y="0"
                  width="32"
                  height="14"
                  rx="4"
                  fill="#031720"
                  stroke="#fbbf24"
                  strokeWidth="1"
                />
                <text
                  x="16"
                  y="10"
                  textAnchor="middle"
                  fill="#fbbf24"
                  fontSize="9"
                  fontFamily="monospace"
                  fontWeight="bold"
                >
                  94%
                </text>
              </g>
            </g>
          </g>

          {/* LAYER 5: Primary Celestial Hubs (Pearl/Glass Orbs with Percentage Badges) */}
          <g className="celestial-hubs">
            {filteredHubs.map(hub => {
              const isSelected = activeNodeId === hub.id;
              let sphereGrad = 'url(#roseSphere)';
              if (hub.color === '#06b6d4' || hub.color === '#38bdf8') sphereGrad = 'url(#cyanSphere)';
              if (hub.color === '#f59e0b') sphereGrad = 'url(#amberSphere)';
              if (hub.color === '#a855f7') sphereGrad = 'url(#purpleSphere)';
              if (hub.color === '#10b981') sphereGrad = 'url(#emeraldSphere)';

              return (
                <g
                  key={hub.id}
                  onClick={() => {
                    setActiveNodeId(hub.id);
                    if (hub.id === 'hub-vessel-1') onSelectVessel(incident.vessels[0]);
                    if (hub.id === 'hub-vessel-2' && incident.vessels[1]) onSelectVessel(incident.vessels[1]);
                  }}
                  className="cursor-pointer group"
                >
                  {/* Outer Concentric Bevel Ring */}
                  <circle
                    cx={hub.x}
                    cy={hub.y}
                    r={hub.radius + 7}
                    fill="none"
                    stroke={isSelected ? '#ffffff' : hub.color}
                    strokeWidth={isSelected ? 2 : 1}
                    strokeOpacity={isSelected ? 0.9 : 0.35}
                    strokeDasharray={isSelected ? 'none' : '3,3'}
                    filter={isSelected ? 'url(#softGlow)' : undefined}
                  />

                  {/* Middle Rim Ring */}
                  <circle
                    cx={hub.x}
                    cy={hub.y}
                    r={hub.radius + 3}
                    fill="none"
                    stroke="#ffffff"
                    strokeWidth="1.2"
                    strokeOpacity="0.6"
                  />

                  {/* 3D Glossy Pearl Sphere */}
                  <circle
                    cx={hub.x}
                    cy={hub.y}
                    r={hub.radius}
                    fill={sphereGrad}
                    stroke="#ffffff"
                    strokeWidth={isSelected ? 2.5 : 1.5}
                    filter="url(#softGlow)"
                    className="transition-transform duration-200 group-hover:scale-110"
                  />

                  {/* Specular Inner Highlight Crescent */}
                  <ellipse
                    cx={hub.x - hub.radius * 0.28}
                    cy={hub.y - hub.radius * 0.32}
                    rx={hub.radius * 0.35}
                    ry={hub.radius * 0.22}
                    fill="#ffffff"
                    opacity="0.7"
                    transform={`rotate(-25 ${hub.x} ${hub.y})`}
                  />

                  {/* Inner Nucleus Dot */}
                  <circle
                    cx={hub.x}
                    cy={hub.y}
                    r={hub.radius * 0.3}
                    fill="#ffffff"
                    opacity="0.85"
                  />

                  {/* Node Label & Percentage Badge (matching Image 1 layout) */}
                  <g transform={`translate(${hub.x + hub.radius + 8}, ${hub.y - 2})`}>
                    <text
                      x="0"
                      y="0"
                      fill="#ffffff"
                      fontSize="11"
                      fontFamily="Inter, Roboto, sans-serif"
                      fontWeight={isSelected ? '800' : '600'}
                      filter="drop-shadow(0 2px 4px rgba(0,0,0,0.9))"
                    >
                      {hub.label}
                    </text>
                    {/* Rounded pill badge e.g. 24%, 31%, 17% */}
                    <g transform="translate(0, 4)">
                      <rect
                        x="0"
                        y="0"
                        width="30"
                        height="13"
                        rx="4"
                        fill="#051a24"
                        stroke={hub.color}
                        strokeWidth="0.9"
                      />
                      <text
                        x="15"
                        y="9.5"
                        textAnchor="middle"
                        fill={hub.color}
                        fontSize="8.5"
                        fontFamily="monospace"
                        fontWeight="bold"
                      >
                        {hub.confidence}%
                      </text>
                    </g>
                  </g>
                </g>
              );
            })}
          </g>
        </svg>
      </div>

      {/* Forensic Node Inspector Drawer (High-Tech Telemetry Card) */}
      <div className="bg-[#04141c] text-slate-100 p-4.5 rounded-2xl border border-[#0f323f] flex flex-col md:flex-row items-start md:items-center justify-between gap-4 font-mono text-xs shadow-xl">
        <div className="space-y-1.5 max-w-2xl">
          <div className="flex items-center gap-2.5">
            <span
              className="w-3 h-3 rounded-full animate-pulse shadow-sm"
              style={{ backgroundColor: 'color' in activeNode ? activeNode.color : '#f59e0b' }}
            />
            <strong className="text-white text-sm font-sans font-extrabold tracking-tight">
              {activeNode.label}
            </strong>
            <span className="text-[10px] font-mono font-bold text-cyan-300 uppercase px-2.5 py-0.5 bg-cyan-950/80 rounded-full border border-cyan-800/80">
              {activeNode.category}
            </span>
            <span className="text-[10px] font-mono font-bold text-amber-300 uppercase px-2 py-0.5 bg-amber-950/60 rounded-full border border-amber-800/60">
              {activeNode.confidence}% Confidence
            </span>
          </div>

          <p className="text-slate-300 leading-relaxed text-[11px] font-medium">
            {activeNode.details}
          </p>

          {/* Metric Badges */}
          <div className="flex flex-wrap items-center gap-3 pt-1">
            {activeNode.metrics.map((m, idx) => (
              <div key={idx} className="flex items-center gap-1.5 text-[10px] bg-[#08222d] px-2 py-1 rounded-lg border border-[#143e4e]">
                <span className="text-slate-400">{m.label}:</span>
                <span className="text-cyan-200 font-bold">{m.value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {activeNode.id.includes('vessel') && (
            <button
              onClick={() => onSelectVessel(incident.vessels[0])}
              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white text-[11px] font-bold font-mono transition-all flex items-center gap-1.5 shadow-[0_0_12px_rgba(239,68,68,0.3)] active:scale-95"
            >
              <Ship className="w-3.5 h-3.5" />
              <span>Inspect Suspect</span>
            </button>
          )}

          <button
            onClick={handleSimulate}
            className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 text-white text-[11px] font-bold font-mono transition-all flex items-center gap-1.5 shadow-[0_0_12px_rgba(6,182,212,0.3)] active:scale-95"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-200" />
            <span>Simulate Node Flux</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

    </div>
  );
};
