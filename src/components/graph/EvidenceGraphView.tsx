import React, { useState } from 'react';
import { 
  GitFork, Sparkles, ShieldAlert, CheckCircle2, ChevronRight, Activity, Flame, Ship, Wind
} from 'lucide-react';
import { Incident, Vessel } from '../../types';

interface EvidenceGraphViewProps {
  incident: Incident;
  selectedVessel: Vessel;
  onSelectVessel: (v: Vessel) => void;
}

export const EvidenceGraphView: React.FC<EvidenceGraphViewProps> = ({
  incident,
  selectedVessel,
  onSelectVessel,
}) => {
  const [activeNodeId, setActiveNodeId] = useState<string>('spill-main');

  // Evidence Graph Nodes
  const nodes = [
    { id: 'spill-main', label: `Observed Spill (${incident.areaKm2} km²)`, type: 'spill', icon: Flame, color: '#ef4444', x: 120, y: 180, details: `Sentinel-1 C-SAR Dual-Pol detection at ${incident.detectionTimestamp}. Spatial area 18.64 km².` },
    { id: 'drift-vector', label: 'Hydrodynamic Drift Vector', type: 'environment', icon: Wind, color: '#0284c7', x: 280, y: 120, details: `Current: ${incident.currentKnots} kn @ ${incident.currentDirectionDeg}°. Wind: ${incident.windSpeedKnots} kn @ ${incident.windDirectionDeg}°.` },
    { id: 'origin-zone', label: 'Probable Origin Zone', type: 'origin', icon: Sparkles, color: '#9333ea', x: 440, y: 180, details: `Estimated release window: ${incident.probableOrigin.timeWindowStart} - ${incident.probableOrigin.timeWindowEnd}. Radius: ${incident.probableOrigin.radiusKm} km.` },
    { id: 'vessel-1', label: `#1 ${incident.vessels[0].name} (89%)`, type: 'vessel', icon: Ship, color: '#ef4444', x: 620, y: 100, details: `Aframax Crude Tanker IMO 9482718. Spatial: 94%, Temporal: 91%, Trajectory: 87%.` },
    { id: 'vessel-2', label: `#2 ${incident.vessels[1]?.name || 'Candidate B'} (64%)`, type: 'vessel', icon: Ship, color: '#f59e0b', x: 620, y: 220, details: 'Chemical Tanker IMO 9321045. Passed 4.8 km south of origin corridor.' },
    { id: 'anomaly-speed', label: 'Speed Drop (14.2 → 4.1 kn)', type: 'anomaly', icon: Activity, color: '#ef4444', x: 800, y: 70, details: 'Drastic speed reduction sustained for 47 minutes during release window.' },
    { id: 'anomaly-ais', label: 'AIS Transponder Gap (47 min)', type: 'anomaly', icon: ShieldAlert, color: '#ef4444', x: 800, y: 140, details: 'Dark ship transponder blackout detected while inside origin probability ellipse.' },
    { id: 'verdict-node', label: 'High Attribution Confidence', type: 'forensic', icon: CheckCircle2, color: '#10b981', x: 960, y: 180, details: 'Multi-factor Bayesian fusion concludes 89% probability of illegal discharge attribution.' }
  ];

  const links = [
    { from: 'spill-main', to: 'drift-vector', label: 'Lagrangian Reverse Advection' },
    { from: 'drift-vector', to: 'origin-zone', label: 'Back-Projected Origin' },
    { from: 'origin-zone', to: 'vessel-1', label: 'Spatial-Temporal Confluence (94%)' },
    { from: 'origin-zone', to: 'vessel-2', label: 'Peripheral Passage' },
    { from: 'vessel-1', to: 'anomaly-speed', label: 'Deceleration Anomaly' },
    { from: 'vessel-1', to: 'anomaly-ais', label: 'Dark Ship Event' },
    { from: 'vessel-1', to: 'verdict-node', label: 'IoU Plume Match 91.4%' },
    { from: 'anomaly-speed', to: 'verdict-node', label: 'Corroborating Evidence' },
    { from: 'anomaly-ais', to: 'verdict-node', label: 'Corroborating Evidence' },
  ];

  const activeNode = nodes.find(n => n.id === activeNodeId) || nodes[0];

  return (
    <div className="bg-white/95 backdrop-blur-md p-6 rounded-3xl border border-slate-200/90 shadow-lg shadow-purple-900/5 space-y-4 flex flex-col font-sans">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3.5 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-purple-100 to-indigo-100 text-purple-700 flex items-center justify-center font-bold border border-purple-200/60 shadow-xs">
            <GitFork className="w-4.5 h-4.5" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold tracking-tight text-slate-900 font-sans flex items-center gap-2">
              MARITIME EVIDENCE GRAPH
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 border border-purple-200">
                SIGNATURE VISUALIZER
              </span>
            </h3>
            <p className="text-[11px] font-mono text-slate-500 font-medium">
              Interactive Forensic Knowledge Network: Spill → Drift → Origin → Vessel → Anomalies
            </p>
          </div>
        </div>

        <span className="text-xs font-mono font-bold text-purple-700 bg-purple-50 px-3 py-1 rounded-full border border-purple-100">
          Click any node to inspect evidence detail
        </span>
      </div>

      {/* SVG Network Graph Canvas (Navy High-Tech Container for clear text contrast) */}
      <div className="relative w-full h-80 bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden flex items-center justify-center shadow-inner">
        <div className="absolute inset-0 radar-grid opacity-30 pointer-events-none" />

        <svg className="w-full h-full" viewBox="0 0 1080 340">
          {/* Connector Lines */}
          <defs>
            <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#9333ea" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.8" />
            </linearGradient>
          </defs>

          {links.map((link, idx) => {
            const sourceNode = nodes.find(n => n.id === link.from);
            const targetNode = nodes.find(n => n.id === link.to);
            if (!sourceNode || !targetNode) return null;

            return (
              <g key={idx}>
                <line
                  x1={sourceNode.x}
                  y1={sourceNode.y}
                  x2={targetNode.x}
                  y2={targetNode.y}
                  stroke="rgba(255, 255, 255, 0.25)"
                  strokeWidth="2"
                  strokeDasharray="4, 4"
                />
                <circle
                  r="3.5"
                  fill="#38bdf8"
                  className="animate-pulse"
                >
                  <animateMotion
                    path={`M ${sourceNode.x} ${sourceNode.y} L ${targetNode.x} ${targetNode.y}`}
                    dur="3s"
                    repeatCount="indefinite"
                  />
                </circle>
              </g>
            );
          })}

          {/* Graph Nodes */}
          {nodes.map((node) => {
            const isSelected = activeNodeId === node.id;

            return (
              <g
                key={node.id}
                onClick={() => {
                  setActiveNodeId(node.id);
                  if (node.id === 'vessel-1') onSelectVessel(incident.vessels[0]);
                  if (node.id === 'vessel-2' && incident.vessels[1]) onSelectVessel(incident.vessels[1]);
                }}
                className="cursor-pointer group"
                transform={`translate(${node.x}, ${node.y})`}
              >
                {/* Glow ring */}
                <circle
                  r={isSelected ? 26 : 22}
                  fill="rgba(15, 23, 42, 0.95)"
                  stroke={node.color}
                  strokeWidth={isSelected ? 3.5 : 2}
                  className="transition-all duration-300 group-hover:stroke-sky-400"
                  style={{
                    filter: isSelected ? `drop-shadow(0 0 12px ${node.color})` : undefined
                  }}
                />

                {/* Node Label Text */}
                <text
                  textAnchor="middle"
                  y="38"
                  fill="#f8fafc"
                  fontSize="11"
                  fontFamily="Inter, Roboto, sans-serif"
                  fontWeight={isSelected ? '800' : '600'}
                >
                  {node.label}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Node Inspector Drawer */}
      <div className="bg-slate-900 text-slate-100 p-4.5 rounded-2xl border border-slate-800 flex items-start justify-between gap-4 font-mono text-xs shadow-md">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: activeNode.color }} />
            <strong className="text-white text-sm font-sans font-extrabold">{activeNode.label}</strong>
            <span className="text-[10px] font-mono text-purple-300 uppercase px-2 py-0.5 bg-purple-950/80 rounded-full border border-purple-800/80 font-bold">
              {activeNode.type}
            </span>
          </div>
          <p className="text-slate-300 leading-relaxed text-[11px] font-medium">
            {activeNode.details}
          </p>
        </div>

        <button
          onClick={() => {
            if (activeNode.type === 'vessel') onSelectVessel(incident.vessels[0]);
          }}
          className="px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-[11px] font-bold font-mono transition-colors flex items-center gap-1 shrink-0 shadow-xs"
        >
          <span>Correlate Node</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

    </div>
  );
};
