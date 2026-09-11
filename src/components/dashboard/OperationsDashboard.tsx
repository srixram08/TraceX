import React, { useState } from 'react';
import { 
  Flame, RotateCcw, GitFork, FlaskConical, Satellite, FileText, Scale, Activity,
  LayoutDashboard, BarChart3, Users, User, FileCode, HelpCircle, Plus, ChevronDown, 
  ArrowUpRight, ArrowDownRight, TrendingUp, TrendingDown, Clock, ShieldCheck, MapPin
} from 'lucide-react';
import { Incident, Vessel } from '../../types';
import { OceanTacticalMap } from '../map/OceanTacticalMap';
import { RewindController } from '../rewind/RewindController';
import { CandidateList } from '../vessels/CandidateList';
import { VesselDetailModal } from '../vessels/VesselDetailModal';
import { ExplainableAIPanel } from '../xai/ExplainableAIPanel';
import { CounterfactualStudio } from '../simulation/CounterfactualStudio';
import { EvidenceGraphView } from '../graph/EvidenceGraphView';
import { SatelliteViewer } from '../sar/SatelliteViewer';
import { EnvironmentalPanel } from '../environment/EnvironmentalPanel';
import { AbductiveHypothesisLedger } from '../xai/AbductiveHypothesisLedger';
import { MonteCarloForwardSimulator } from '../simulation/MonteCarloForwardSimulator';

interface OperationsDashboardProps {
  incident: Incident;
  incidents: Incident[];
  setActiveIncident: (incident: Incident) => void;
  onOpenReport: () => void;
  onOpenNewIncident: () => void;
  isDarkMode?: boolean;
}

export const OperationsDashboard: React.FC<OperationsDashboardProps> = ({
  incident,
  incidents,
  setActiveIncident,
  onOpenReport,
  onOpenNewIncident,
  isDarkMode = true
}) => {
  const [activeTab, setActiveTab] = useState<'map-rewind' | 'abductive-ledger' | 'monte-carlo' | 'counterfactual' | 'evidence-graph' | 'sar-lab'>('map-rewind');
  const [selectedVessel, setSelectedVessel] = useState<Vessel>(incident.vessels[0]);
  const [inspectedVessel, setInspectedVessel] = useState<Vessel | null>(null);
  const [rewindHours, setRewindHours] = useState<number>(0);
  const [timeRange, setTimeRange] = useState<'all' | '1day' | '1month' | '1year'>('all');
  const [simulatedPolygon, setSimulatedPolygon] = useState<[number, number][] | null>(null);
  const [isLocationOpen, setIsLocationOpen] = useState<boolean>(false);

  // Sync selected vessel when incident changes
  React.useEffect(() => {
    if (incident && incident.vessels && incident.vessels.length > 0) {
      setSelectedVessel(incident.vessels[0]);
    }
  }, [incident]);

  const handleUpdateSimulatedPolygon = (poly: [number, number][]) => {
    setSimulatedPolygon(poly);
  };

  const handleSimulateCandidate = (vessel: Vessel) => {
    setSelectedVessel(vessel);
    setActiveTab('counterfactual');
  };

  return (
    <div className="min-h-screen bg-[#02060c] text-slate-100 font-sans p-3 sm:p-6 transition-colors duration-300 relative z-10 select-none">
      <div className="max-w-[1700px] mx-auto flex flex-col lg:flex-row gap-6">
        
        {/* ========================================== */}
        {/* LEFT VERTICAL SIDEBAR (SPACE THEMED)       */}
        {/* ========================================== */}
        <aside className="w-full lg:w-64 bg-[#040e16]/95 backdrop-blur-xl rounded-3xl border border-[#0e3344] p-5 shadow-2xl h-fit self-start flex flex-col gap-6 shrink-0">
          
          <div className="space-y-6">

            {/* DIRECTORIES NAVIGATION */}
            <div className="space-y-1.5">
              <span className="text-xs font-bold text-cyan-400/80 px-3 uppercase tracking-wider block mb-1.5 font-mono">
                Directories
              </span>

              <button
                onClick={() => setActiveTab('map-rewind')}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-sm font-extrabold transition-all cursor-pointer ${
                  activeTab === 'map-rewind'
                    ? 'bg-gradient-to-r from-purple-600/30 via-indigo-600/30 to-purple-600/20 text-white shadow-[0_0_15px_rgba(168,85,247,0.25)] border border-purple-500/50'
                    : 'text-slate-400 hover:text-white hover:bg-[#061824]'
                }`}
              >
                <LayoutDashboard className="w-4.5 h-4.5 text-purple-400 shrink-0" />
                <span>Dashboard</span>
              </button>

              <button
                onClick={() => setActiveTab('abductive-ledger')}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-sm font-extrabold transition-all cursor-pointer ${
                  activeTab === 'abductive-ledger'
                    ? 'bg-gradient-to-r from-purple-600/30 via-indigo-600/30 to-purple-600/20 text-white shadow-[0_0_15px_rgba(168,85,247,0.25)] border border-purple-500/50'
                    : 'text-slate-400 hover:text-white hover:bg-[#061824]'
                }`}
              >
                <BarChart3 className="w-4.5 h-4.5 text-purple-400 shrink-0" />
                <span>Stats &amp; Ledger</span>
              </button>

              <button
                onClick={() => setActiveTab('monte-carlo')}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-sm font-extrabold transition-all cursor-pointer ${
                  activeTab === 'monte-carlo'
                    ? 'bg-gradient-to-r from-purple-600/30 via-indigo-600/30 to-purple-600/20 text-white shadow-[0_0_15px_rgba(168,85,247,0.25)] border border-purple-500/50'
                    : 'text-slate-400 hover:text-white hover:bg-[#061824]'
                }`}
              >
                <Activity className="w-4.5 h-4.5 text-indigo-400 shrink-0" />
                <span>Monte Carlo</span>
              </button>

              <button
                onClick={() => setActiveTab('evidence-graph')}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-sm font-extrabold transition-all cursor-pointer ${
                  activeTab === 'evidence-graph'
                    ? 'bg-gradient-to-r from-purple-600/30 via-indigo-600/30 to-purple-600/20 text-white shadow-[0_0_15px_rgba(168,85,247,0.25)] border border-purple-500/50'
                    : 'text-slate-400 hover:text-white hover:bg-[#061824]'
                }`}
              >
                <GitFork className="w-4.5 h-4.5 text-cyan-400 shrink-0" />
                <span>Graph View</span>
              </button>
            </div>

            {/* REPORTS / INCIDENT LOGS LIST */}
            <div className="space-y-1.5 pt-3.5 border-t border-[#0f3243]">
              <span className="text-xs font-bold text-cyan-400/80 px-3 uppercase tracking-wider block mb-1.5 font-mono">
                Case Files &amp; Logs
              </span>

              {[
                { name: 'file_03/27/18.log', code: 'SLK-042' },
                { name: 'file_09/03/26.log', code: 'SLK-043' },
                { name: 'file_11/17/17.log', code: 'SLK-044' },
                { name: 'file_06/20/16.log', code: 'SLK-045' },
                { name: 'file_06/28/16.log', code: 'SLK-046' },
                { name: 'file_02/14/13.log', code: 'SLK-048', alert: true },
              ].map((file, i) => {
                const matchedInc = incidents.find(inc => inc.caseNumber === file.code);
                const isActive = incident.caseNumber === file.code;
                return (
                  <div
                    key={i}
                    onClick={() => {
                      if (matchedInc) {
                        setActiveIncident(matchedInc);
                      }
                    }}
                    className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                      file.alert 
                        ? 'text-rose-300 font-extrabold bg-rose-950/70 border border-rose-800/80 shadow-[0_0_8px_rgba(244,63,94,0.2)]' 
                        : isActive 
                        ? 'text-cyan-300 font-black bg-[#061824] border border-[#144760] shadow-[0_0_10px_rgba(6,182,212,0.2)]' 
                        : 'text-slate-400 hover:text-white hover:bg-[#061824]/60'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate min-w-0">
                      <FileCode className={`w-4 h-4 shrink-0 ${file.alert ? 'text-rose-400' : isActive ? 'text-cyan-400' : 'text-slate-500'}`} />
                      <span className="truncate">{file.name}</span>
                    </div>
                    <span className={`text-[11px] font-bold px-1.5 py-0.5 rounded shrink-0 ml-1 ${isActive ? 'bg-cyan-950 text-cyan-300 border border-cyan-800' : 'text-slate-500'}`}>
                      {file.code}
                    </span>
                  </div>
                );
              })}

              <button
                onClick={onOpenNewIncident}
                className="w-full mt-2.5 flex items-center gap-2 px-3.5 py-2.5 rounded-2xl border border-dashed border-[#133c50] text-xs sm:text-sm font-bold text-slate-300 hover:text-cyan-300 hover:border-cyan-500/60 hover:bg-[#061824] transition-all justify-center cursor-pointer"
              >
                <Plus className="w-4 h-4 text-cyan-400" />
                <span>Create New Case</span>
              </button>
            </div>

            {/* User Profile Footer */}
            <div className="pt-4 border-t border-[#0f3243] flex items-center justify-between">
              <button className="w-9 h-9 rounded-full bg-[#061824] text-slate-400 hover:text-white flex items-center justify-center font-bold text-sm border border-[#133c50] transition-colors">
                <HelpCircle className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-purple-950 border border-purple-800 flex items-center justify-center text-purple-300 font-black text-sm shadow-[0_0_10px_rgba(168,85,247,0.3)]">
                  <User className="w-4 h-4" />
                </div>
                <div className="text-xs font-mono leading-tight">
                  <span className="font-extrabold text-white block text-xs">Investigator</span>
                  <span className="text-cyan-400/80 text-xs font-bold uppercase block">NTRO Node</span>
                </div>
              </div>
            </div>

          </div>

        </aside>

        {/* ========================================== */}
        {/* RIGHT MAIN CONTENT DASHBOARD GRID          */}
        {/* ========================================== */}
        <main className="flex-1 space-y-6">
          
          {/* TACTICAL HUD TELEMETRY RIBBON */}
          <div className="bg-[#040e16]/95 backdrop-blur-xl p-3.5 sm:p-4 rounded-3xl border border-[#0e3344] shadow-2xl flex flex-wrap items-center justify-between gap-3 font-sans text-xs sm:text-sm">
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-purple-950/80 border border-purple-800 text-purple-200 font-mono font-extrabold text-xs sm:text-sm shadow-xs">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#10b981]" />
                <span>COMMAND CENTER • ACTIVE EEZ NODE</span>
              </div>

              <div className="hidden md:flex items-center gap-2 text-slate-300 font-mono font-bold text-xs sm:text-sm">
                <Clock className="w-4 h-4 text-cyan-400" />
                <span>06:30 UTC</span>
                <span className="text-slate-600">•</span>
                <MapPin className="w-4 h-4 text-purple-400" />
                <span>{incident.coordinates.lat.toFixed(2)}°N, {incident.coordinates.lng.toFixed(2)}°E</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <button
                onClick={() => setActiveTab('monte-carlo')}
                className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-[#061824] hover:bg-[#092233] border border-[#133c50] text-cyan-300 font-mono font-bold text-xs sm:text-sm transition-all cursor-pointer shadow-xs"
              >
                <Activity className="w-4 h-4 text-cyan-400" />
                <span>500 Physics Runs</span>
              </button>

              <button
                onClick={onOpenReport}
                className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-mono font-bold text-xs sm:text-sm shadow-[0_0_15px_rgba(168,85,247,0.3)] transition-all cursor-pointer active:scale-95"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Cryptographic Dossier</span>
              </button>
            </div>
          </div>

          {/* TOP GRID: MAIN CHART CARD + 4 STACKED KPI CARDS */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            
            {/* TOP MAIN CENTER CARD */}
            <div className="lg:col-span-8 bg-[#040e16]/95 backdrop-blur-xl rounded-3xl border border-[#0e3344] p-6 shadow-2xl flex flex-col justify-between">
              
              {/* Card Header & Controls */}
              <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                
                {/* Left Side: Interactive Location Pill Selector + Main Title */}
                <div className="flex flex-wrap items-center gap-3">
                  
                  {/* Interactive Location Dropdown Button */}
                  <div className="relative">
                    <button
                      onClick={() => setIsLocationOpen(!isLocationOpen)}
                      className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#061824] hover:bg-[#092233] text-white border border-[#133c50] font-black text-sm sm:text-base transition-all shadow-md cursor-pointer group select-none"
                      title="Switch Location / Incident"
                    >
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#10b981]" />
                      <span className="font-black font-mono text-cyan-300">{incident.caseNumber}</span>
                      <span className="text-slate-400 font-sans text-xs sm:text-sm font-bold">({incident.region.split(' (')[0]})</span>
                      <ChevronDown className={`w-4 h-4 text-cyan-400 transition-transform duration-200 ${isLocationOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {/* Dropdown Popover */}
                    {isLocationOpen && (
                      <>
                        <div className="fixed inset-0 z-30" onClick={() => setIsLocationOpen(false)} />
                        <div className="absolute left-0 mt-2 w-80 bg-[#040e16] rounded-2xl border border-[#0e3344] shadow-2xl z-40 p-2 space-y-1 backdrop-blur-xl">
                          <div className="px-3 py-1.5 text-xs font-mono font-black text-cyan-400 uppercase tracking-wider flex items-center justify-between border-b border-[#0f3243] mb-1">
                            <span>Select Target Location</span>
                            <span className="text-xs text-purple-300 bg-purple-950 px-2 py-0.5 rounded-full font-mono font-bold border border-purple-800">{incidents.length} INCIDENTS</span>
                          </div>
                          {incidents.map((inc) => (
                            <button
                              key={inc.id}
                              onClick={() => {
                                setActiveIncident(inc);
                                setIsLocationOpen(false);
                              }}
                              className={`w-full text-left px-3.5 py-2.5 rounded-xl transition-all flex items-center justify-between cursor-pointer ${
                                inc.id === incident.id
                                  ? 'bg-[#061824] text-cyan-300 font-extrabold border border-[#144760] shadow-sm'
                                  : 'text-slate-300 hover:bg-[#061824]/60 hover:text-white font-medium'
                              }`}
                            >
                              <div className="flex items-center gap-2.5">
                                <span className={`w-2.5 h-2.5 rounded-full ${inc.id === incident.id ? 'bg-emerald-400 shadow-[0_0_8px_#10b981]' : 'bg-slate-700'}`} />
                                <div>
                                  <div className="text-xs sm:text-sm font-mono font-bold flex items-center gap-2">
                                    <span className="text-cyan-300">{inc.caseNumber}</span>
                                    <span className="text-xs font-sans font-semibold px-2 py-0.5 rounded-full bg-[#082233] text-slate-300">
                                      {inc.region.split(' (')[0]}
                                    </span>
                                  </div>
                                  <div className="text-xs text-slate-400 font-mono mt-0.5">
                                    {inc.areaKm2} km² • {inc.sensor.split(' ')[0]} • Vol: {inc.estimatedVolumeM3} m³
                                  </div>
                                </div>
                              </div>
                              {inc.id === incident.id && (
                                <span className="text-xs font-mono font-bold text-cyan-300 bg-cyan-950 px-2 py-0.5 rounded-full border border-cyan-800">
                                  ACTIVE
                                </span>
                              )}
                            </button>
                          ))}
                        </div>
                      </>
                    )}
                  </div>

                  <div>
                    <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                      Tactical Ocean Drift &amp; SAR Telemetry
                    </h2>
                    <p className="text-xs sm:text-sm text-cyan-300/70 font-bold mt-0.5">Incident #{incident.caseNumber} • {incident.region}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {/* Time Range Pills */}
                  <div className="flex items-center gap-1 bg-[#061824] p-1 rounded-full text-xs sm:text-sm font-extrabold border border-[#133c50]">
                    {(['all', '1day', '1month', '1year'] as const).map(range => (
                      <button
                        key={range}
                        onClick={() => setTimeRange(range)}
                        className={`px-3 py-1 rounded-full transition-all cursor-pointer ${
                          timeRange === range
                            ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-xs font-bold'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        {range === 'all' ? 'All' : range === '1day' ? '1 Day' : range === '1month' ? '1 Month' : '1 Year'}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* CARD MAIN BODY CONTENT (Tab View Render) */}
              <div className="flex-1 min-h-[580px]">
                {activeTab === 'map-rewind' && (
                  <div className="space-y-4">
                    <div className="h-[580px] rounded-2xl overflow-hidden border border-[#0d2a37]">
                      <OceanTacticalMap
                        incident={incident}
                        selectedVessel={selectedVessel}
                        onSelectVessel={(v) => setSelectedVessel(v)}
                        rewindHours={rewindHours}
                        simulatedScenarioVessel={selectedVessel}
                        simulatedPolygon={simulatedPolygon}
                        isDarkMode={true}
                      />
                    </div>
                    <RewindController
                      incident={incident}
                      rewindHours={rewindHours}
                      setRewindHours={setRewindHours}
                      selectedVessel={selectedVessel}
                    />
                  </div>
                )}

                {activeTab === 'abductive-ledger' && (
                  <AbductiveHypothesisLedger incident={incident} />
                )}

                {activeTab === 'monte-carlo' && (
                  <MonteCarloForwardSimulator incident={incident} />
                )}

                {activeTab === 'counterfactual' && (
                  <CounterfactualStudio
                    incident={incident}
                    selectedVessel={selectedVessel}
                    onSelectVessel={(v) => setSelectedVessel(v)}
                    onUpdateSimulatedPolygon={handleUpdateSimulatedPolygon}
                  />
                )}

                {activeTab === 'evidence-graph' && (
                  <EvidenceGraphView
                    incident={incident}
                    selectedVessel={selectedVessel}
                    onSelectVessel={(v) => setSelectedVessel(v)}
                  />
                )}

                {activeTab === 'sar-lab' && (
                  <SatelliteViewer incident={incident} />
                )}
              </div>

              {/* Card Footer Legend */}
              <div className="flex items-center gap-6 pt-3.5 border-t border-[#0f3243] text-xs sm:text-sm font-bold text-slate-300 font-mono">
                <span className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-blue-500 shadow-[0_0_8px_#3b82f6]" /> Sentinel-1 SAR Mask
                </span>
                <span className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-amber-400 shadow-[0_0_8px_#f59e0b]" /> AIS Track Vector
                </span>
                <span className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-purple-500 shadow-[0_0_8px_#a855f7]" /> Hydrodynamic Plume
                </span>
              </div>

            </div>

            {/* TOP RIGHT STACKED KPI CARDS (4 SPACE THEMED CARDS) */}
            <div className="lg:col-span-4 space-y-4 flex flex-col justify-between">
              
              {/* KPI CARD 1: Slick Area */}
              <div className="bg-[#040e16]/95 backdrop-blur-xl rounded-3xl border border-[#0e3344] p-5 shadow-2xl flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-400 block uppercase font-mono tracking-wider">Estimated Slick Area</span>
                  <span className="text-2xl sm:text-3xl font-black text-white font-mono mt-1 block">{incident.areaKm2} km²</span>
                  <span className="text-xs font-bold text-rose-300 bg-rose-950/80 px-2.5 py-1 rounded-full border border-rose-800/80 inline-flex items-center gap-1.5 mt-2 font-mono">
                    <TrendingDown className="w-4 h-4 text-rose-400" /> 7.00% Since last observation
                  </span>
                </div>

                <button className="w-11 h-11 rounded-full bg-[#061824] text-slate-300 hover:text-white flex items-center justify-center font-bold shrink-0 border border-[#133c50] shadow-sm">
                  <ArrowUpRight className="w-5.5 h-5.5" />
                </button>
              </div>

              {/* KPI CARD 2: Attributed Suspect */}
              <div className="bg-[#040e16]/95 backdrop-blur-xl rounded-3xl border border-[#0e3344] p-5 shadow-2xl flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-400 block uppercase font-mono tracking-wider">Attributed Suspect</span>
                  <span className="text-2xl sm:text-3xl font-black text-white font-mono mt-1 block">{selectedVessel.name.split(' ')[1] || selectedVessel.name}</span>
                  <span className="text-xs font-bold text-indigo-200 bg-indigo-950/80 px-2.5 py-1 rounded-full border border-indigo-800/80 inline-flex items-center gap-1.5 mt-2 font-mono">
                    <ShieldCheck className="w-4 h-4 text-indigo-400" /> {selectedVessel.score.overall}% Attribution Score
                  </span>
                </div>

                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-[0_0_15px_rgba(59,130,246,0.35)] shrink-0">
                  <Users className="w-5.5 h-5.5" />
                </div>
              </div>

              {/* KPI CARD 3: SAR Resolution */}
              <div className="bg-[#040e16]/95 backdrop-blur-xl rounded-3xl border border-[#0e3344] p-5 shadow-2xl flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-400 block uppercase font-mono tracking-wider">SAR Sensor Swath</span>
                  <span className="text-2xl sm:text-3xl font-black text-white font-mono mt-1 block">{incident.sensor.split(' ')[0]}</span>
                  <span className="text-xs font-bold text-emerald-300 bg-emerald-950/80 px-2.5 py-1 rounded-full border border-emerald-800/80 inline-flex items-center gap-1.5 mt-2 font-mono">
                    <TrendingUp className="w-4 h-4 text-emerald-400" /> 10m High-Res
                  </span>
                </div>

                {/* Mini Bar Chart Graphic */}
                <div className="flex items-end gap-1 h-9 shrink-0">
                  <div className="w-1.5 h-4 bg-cyan-400 rounded-xs shadow-[0_0_6px_#22d3ee]" />
                  <div className="w-1.5 h-6 bg-cyan-500 rounded-xs shadow-[0_0_6px_#06b6d4]" />
                  <div className="w-1.5 h-3 bg-cyan-400 rounded-xs shadow-[0_0_6px_#22d3ee]" />
                  <div className="w-1.5 h-8 bg-blue-500 rounded-xs shadow-[0_0_8px_#3b82f6]" />
                  <div className="w-1.5 h-5 bg-blue-400 rounded-xs shadow-[0_0_6px_#60a5fa]" />
                  <div className="w-1.5 h-9 bg-purple-500 rounded-xs shadow-[0_0_8px_#a855f7]" />
                </div>
              </div>

              {/* KPI CARD 4: Drift Vector */}
              <div className="bg-[#040e16]/95 backdrop-blur-xl rounded-3xl border border-[#0e3344] p-5 shadow-2xl flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-400 block uppercase font-mono tracking-wider">Current Drift Vector</span>
                  <span className="text-2xl sm:text-3xl font-black text-white font-mono mt-1 block">{incident.currentKnots} kn</span>
                  <span className="text-xs font-bold text-emerald-300 bg-emerald-950/80 px-2.5 py-1 rounded-full border border-emerald-800/80 inline-flex items-center gap-1.5 mt-2 font-mono">
                    <TrendingUp className="w-4 h-4 text-emerald-400" /> @ {incident.currentDirectionDeg}° Vector
                  </span>
                </div>

                {/* Smooth Sparkline Curve SVG */}
                <svg className="w-20 h-10 text-cyan-400 shrink-0 filter drop-shadow-[0_0_6px_rgba(6,182,212,0.4)]" viewBox="0 0 100 40">
                  <path
                    d="M 0 30 Q 25 5 50 25 T 100 10"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                </svg>
              </div>

            </div>

          </div>

          {/* BOTTOM GRID: HYPOTHESES CARD + EVIDENCE DOUGHNUT CARD */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            
            {/* BOTTOM LEFT CARD */}
            <div className="lg:col-span-7 bg-[#040e16]/95 backdrop-blur-xl rounded-3xl border border-[#0e3344] p-5 sm:p-6 shadow-2xl flex flex-col justify-between">
              
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-xl sm:text-2xl font-black text-white">
                    Abductive Hypotheses Confidence &amp; Physics
                  </h3>
                  <p className="text-xs sm:text-sm text-cyan-300/70 font-bold mt-0.5">Multi-candidate posterior probability distribution</p>
                </div>

                {/* Pill Filter Tabs */}
                <div className="flex items-center gap-1 border border-[#133c50] p-1 rounded-xl text-xs sm:text-sm font-bold bg-[#061824]">
                  <button className="px-3 py-1 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg font-bold shadow-xs">Day</button>
                  <button className="px-3 py-1 text-slate-400 hover:text-white font-bold">Month</button>
                  <button className="px-3 py-1 text-slate-400 hover:text-white font-bold">Year</button>
                </div>
              </div>

              {/* Big Metric Display */}
              <div className="mb-5">
                <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider block">Total Cumulative Confidence</span>
                <div className="flex items-baseline gap-3 mt-1">
                  <span className="text-3xl sm:text-4xl font-black text-white font-mono">89.4% Posterior Match</span>
                  <span className="text-xs sm:text-sm font-bold text-emerald-300 bg-emerald-950/80 px-2.5 py-0.5 rounded-full border border-emerald-800 font-mono">
                    ↑ 7.00%
                  </span>
                </div>
              </div>

              {/* Breakdown Items with Progress Bars */}
              <div className="space-y-4 font-mono text-xs sm:text-sm">
                <div>
                  <div className="flex justify-between mb-1.5">
                    <span className="font-extrabold text-slate-100">MV Neptune Voyager (Bilge Discharge)</span>
                    <span className="text-cyan-300 font-bold">Rank #1 • 68.4%</span>
                  </div>
                  <div className="w-full h-2.5 bg-[#061824] rounded-full overflow-hidden border border-[#133c50]">
                    <div className="h-full bg-gradient-to-r from-blue-600 to-cyan-500 rounded-full shadow-[0_0_8px_#06b6d4]" style={{ width: '68.4%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-1.5">
                    <span className="font-extrabold text-slate-100">MT Pacific Trader (Tank Washing)</span>
                    <span className="text-amber-400 font-bold">Rank #2 • 28.2%</span>
                  </div>
                  <div className="w-full h-2.5 bg-[#061824] rounded-full overflow-hidden border border-[#133c50]">
                    <div className="h-full bg-gradient-to-r from-amber-600 to-amber-400 rounded-full shadow-[0_0_8px_#f59e0b]" style={{ width: '28.2%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-1.5">
                    <span className="font-extrabold text-slate-100">Subsea Wellhead R-4 Pipeline</span>
                    <span className="text-purple-300 font-bold">Rank #3 • 5.0%</span>
                  </div>
                  <div className="w-full h-2.5 bg-[#061824] rounded-full overflow-hidden border border-[#133c50]">
                    <div className="h-full bg-gradient-to-r from-purple-600 to-purple-400 rounded-full shadow-[0_0_8px_#a855f7]" style={{ width: '5.0%' }} />
                  </div>
                </div>
              </div>

            </div>

            {/* BOTTOM RIGHT CARD (Evidence Doughnut Card) */}
            <div className="lg:col-span-5 bg-[#040e16]/95 backdrop-blur-xl rounded-3xl border border-[#0e3344] p-5 sm:p-6 shadow-2xl flex flex-col justify-between">
              
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg sm:text-xl font-black text-white">
                  Evidence Composition Breakdown
                </h3>

                <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#133c50] bg-[#061824] text-xs font-bold text-slate-300 font-mono">
                  <span>Oct - Nov 2026</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>
              </div>

              {/* DOUGHNUT CHART + LEGEND GRID */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-6 py-2">
                
                {/* SVG DOUGHNUT CHART WITH CENTER TEXT */}
                <div className="relative w-44 h-44 shrink-0 flex items-center justify-center">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                    <circle cx="18" cy="18" r="14" fill="none" stroke="#061824" strokeWidth="4.5" />
                    <circle cx="18" cy="18" r="14" fill="none" stroke="#8b5cf6" strokeWidth="4.5" strokeDasharray="35 100" strokeDashoffset="0" />
                    <circle cx="18" cy="18" r="14" fill="none" stroke="#06b6d4" strokeWidth="4.5" strokeDasharray="25 100" strokeDashoffset="-35" />
                    <circle cx="18" cy="18" r="14" fill="none" stroke="#f59e0b" strokeWidth="4.5" strokeDasharray="25 100" strokeDashoffset="-60" />
                    <circle cx="18" cy="18" r="14" fill="none" stroke="#10b981" strokeWidth="4.5" strokeDasharray="15 100" strokeDashoffset="-85" />
                  </svg>

                  <div className="absolute text-center font-mono">
                    <span className="text-[10px] text-slate-400 block uppercase font-bold">Total</span>
                    <span className="text-xl font-black text-white block leading-tight">123,456</span>
                    <span className="text-[10px] text-cyan-300 font-sans font-bold">Vectors / IoU</span>
                  </div>
                </div>

                {/* LEGEND ITEMS WITH COLOR DOTS */}
                <div className="space-y-2.5 font-mono text-xs sm:text-sm w-full">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-slate-300 font-bold">
                      <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_6px_#22d3ee]" /> Spatial P95 Match
                    </span>
                    <strong className="text-white font-extrabold">3490</strong>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-slate-300 font-bold">
                      <span className="w-2.5 h-2.5 rounded-full bg-purple-500 shadow-[0_0_6px_#a855f7]" /> Temporal Window
                    </span>
                    <strong className="text-white font-extrabold">9146</strong>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-slate-300 font-bold">
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-[0_0_6px_#f59e0b]" /> Hydrodynamic Plume
                    </span>
                    <strong className="text-white font-extrabold">7553</strong>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-slate-300 font-bold">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_6px_#10b981]" /> AIS Kinematic
                    </span>
                    <strong className="text-white font-extrabold">2906</strong>
                  </div>
                </div>

              </div>

            </div>

          </div>

        </main>

      </div>

      {/* Vessel Detail Modal */}
      <VesselDetailModal
        vessel={inspectedVessel}
        onClose={() => setInspectedVessel(null)}
        onSimulate={handleSimulateCandidate}
      />
    </div>
  );
};
