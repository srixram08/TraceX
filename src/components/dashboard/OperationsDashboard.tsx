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
  isDarkMode = false
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
    <div className="min-h-screen bg-transparent text-slate-800 dark:text-slate-100 font-sans p-3 sm:p-6 transition-colors duration-300 relative z-10">
      <div className="max-w-[1700px] mx-auto flex flex-col lg:flex-row gap-6">
        
        {/* ========================================== */}
        {/* LEFT VERTICAL SIDEBAR (MATCHING REFERENCE)  */}
        {/* ========================================== */}
        <aside className="w-full lg:w-64 bg-white dark:bg-slate-900/90 rounded-3xl border border-slate-200/90 dark:border-slate-800/90 p-5 shadow-sm flex flex-col justify-between shrink-0 transition-colors duration-300">
          
          <div className="space-y-6">

            {/* DIRECTORIES NAVIGATION */}
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 px-3 uppercase tracking-wider block mb-2 font-mono">
                Directories
              </span>

              <button
                onClick={() => setActiveTab('map-rewind')}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-2xl text-xs font-extrabold transition-all ${
                  activeTab === 'map-rewind'
                    ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white shadow-2xs border border-slate-200/60 dark:border-slate-700'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/60'
                }`}
              >
                <LayoutDashboard className="w-4 h-4 text-slate-700 dark:text-slate-300" />
                <span>Dashboard</span>
              </button>

              <button
                onClick={() => setActiveTab('abductive-ledger')}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-2xl text-xs font-extrabold transition-all ${
                  activeTab === 'abductive-ledger'
                    ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white shadow-2xs border border-slate-200/60 dark:border-slate-700'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/60'
                }`}
              >
                <BarChart3 className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                <span>Stats &amp; Ledger</span>
              </button>

              <button
                onClick={() => setActiveTab('monte-carlo')}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-2xl text-xs font-extrabold transition-all ${
                  activeTab === 'monte-carlo'
                    ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white shadow-2xs border border-slate-200/60 dark:border-slate-700'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/60'
                }`}
              >
                <Activity className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <span>Monte Carlo</span>
              </button>

              <button
                onClick={() => setActiveTab('evidence-graph')}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-2xl text-xs font-extrabold transition-all ${
                  activeTab === 'evidence-graph'
                    ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white shadow-2xs border border-slate-200/60 dark:border-slate-700'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/60'
                }`}
              >
                <GitFork className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span>Graph View</span>
              </button>
            </div>

            {/* REPORTS / INCIDENT LOGS LIST */}
            <div className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-800">
              <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 px-3 uppercase tracking-wider block mb-2 font-mono">
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
                    className={`flex items-center justify-between px-3.5 py-1.5 rounded-xl text-xs font-mono transition-all cursor-pointer ${
                      file.alert 
                        ? 'text-rose-600 dark:text-rose-400 font-bold bg-rose-50/70 dark:bg-rose-950/70 border border-rose-200/60 dark:border-rose-800/60' 
                        : isActive 
                        ? 'text-purple-700 dark:text-purple-300 font-extrabold bg-purple-50/90 dark:bg-purple-950/80 border border-purple-200/60 dark:border-purple-800 shadow-2xs' 
                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/50'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <FileCode className={`w-3.5 h-3.5 ${file.alert ? 'text-rose-500 dark:text-rose-400' : isActive ? 'text-purple-600 dark:text-purple-400' : 'text-slate-400'}`} />
                      <span className="truncate">{file.name}</span>
                    </div>
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${isActive ? 'bg-purple-200/70 dark:bg-purple-900/80 text-purple-800 dark:text-purple-200' : 'text-slate-400 dark:text-slate-500'}`}>
                      {file.code}
                    </span>
                  </div>
                );
              })}

              <button
                onClick={onOpenNewIncident}
                className="w-full mt-3 flex items-center gap-2 px-3.5 py-2 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-purple-600 dark:hover:text-purple-400 hover:border-purple-300 dark:hover:border-purple-700 hover:bg-purple-50/40 dark:hover:bg-purple-950/40 transition-all justify-center"
              >
                <Plus className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                <span>Create New Case</span>
              </button>
            </div>

          </div>

          {/* Bottom Help & User Profile */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <button className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white flex items-center justify-center font-bold text-xs">
              <HelpCircle className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-950 border border-purple-200 dark:border-purple-800 flex items-center justify-center text-purple-700 dark:text-purple-300 font-extrabold text-xs">
                <User className="w-4 h-4" />
              </div>
              <div className="text-[11px] font-mono leading-tight">
                <span className="font-bold text-slate-800 dark:text-slate-200 block">Investigator</span>
                <span className="text-slate-400 dark:text-slate-500 text-[9px] uppercase block">NTRO Node</span>
              </div>
            </div>
          </div>

        </aside>

        {/* ========================================== */}
        {/* RIGHT MAIN CONTENT DASHBOARD GRID          */}
        {/* ========================================== */}
        <main className="flex-1 space-y-6">
          
          {/* TOP GRID: MAIN CHART CARD + 4 STACKED KPI CARDS */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            
            {/* TOP MAIN CENTER CARD */}
            <div className="lg:col-span-8 bg-white dark:bg-slate-900/90 rounded-3xl border border-slate-200/90 dark:border-slate-800/90 p-6 shadow-sm flex flex-col justify-between transition-colors duration-300">
              
              {/* Card Header & Controls */}
              <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                
                {/* Left Side: Interactive Location Pill Selector + Main Title */}
                <div className="flex flex-wrap items-center gap-3">
                  
                  {/* Interactive Location Dropdown Button on LEFT side */}
                  <div className="relative">
                    <button
                      onClick={() => setIsLocationOpen(!isLocationOpen)}
                      className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-50 hover:bg-purple-100 dark:bg-purple-950/60 dark:hover:bg-purple-900/80 text-purple-800 dark:text-purple-200 border border-purple-200/90 dark:border-purple-800 font-medium text-xs transition-all shadow-2xs cursor-pointer group select-none"
                      title="Switch Location / Incident"
                    >
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      <span className="font-extrabold font-mono text-purple-900 dark:text-purple-200">{incident.caseNumber}</span>
                      <span className="text-slate-600 dark:text-slate-400 font-sans text-xs">({incident.region.split(' (')[0]})</span>
                      <ChevronDown className={`w-3.5 h-3.5 text-purple-600 dark:text-purple-400 transition-transform duration-200 ${isLocationOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {/* Dropdown Popover */}
                    {isLocationOpen && (
                      <>
                        <div className="fixed inset-0 z-30" onClick={() => setIsLocationOpen(false)} />
                        <div className="absolute left-0 mt-2 w-80 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-2xl z-40 p-2 space-y-1 backdrop-blur-xl animate-in fade-in zoom-in-95 duration-150">
                          <div className="px-3 py-1.5 text-[11px] font-mono font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider flex items-center justify-between border-b border-slate-100 dark:border-slate-800 mb-1">
                            <span>Select Target Location</span>
                            <span className="text-[10px] text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950 px-2 py-0.5 rounded-full font-mono font-bold">{incidents.length} INCIDENTS</span>
                          </div>
                          {incidents.map((inc) => (
                            <button
                              key={inc.id}
                              onClick={() => {
                                setActiveIncident(inc);
                                setIsLocationOpen(false);
                              }}
                              className={`w-full text-left px-3 py-2.5 rounded-xl transition-all flex items-center justify-between ${
                                inc.id === incident.id
                                  ? 'bg-purple-50/90 dark:bg-purple-950/80 text-purple-900 dark:text-purple-200 font-extrabold border border-purple-200/80 dark:border-purple-800 shadow-2xs'
                                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white font-medium'
                              }`}
                            >
                              <div className="flex items-center gap-2.5">
                                <span className={`w-2.5 h-2.5 rounded-full ${inc.id === incident.id ? 'bg-emerald-500 ring-2 ring-emerald-200 dark:ring-emerald-900' : 'bg-slate-300 dark:bg-slate-700'}`} />
                                <div>
                                  <div className="text-xs font-mono font-bold flex items-center gap-2">
                                    <span className="text-purple-900 dark:text-purple-300">{inc.caseNumber}</span>
                                    <span className="text-[10px] font-sans font-normal px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                                      {inc.region.split(' (')[0]}
                                    </span>
                                  </div>
                                  <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono mt-0.5">
                                    {inc.areaKm2} km² • {inc.sensor.split(' ')[0]} • Vol: {inc.estimatedVolumeM3} m³
                                  </div>
                                </div>
                              </div>
                              {inc.id === incident.id && (
                                <span className="text-[10px] font-mono font-bold text-purple-700 dark:text-purple-300 bg-purple-100 dark:bg-purple-950 px-2 py-0.5 rounded-full">
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
                    <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                      Tactical Ocean Drift &amp; SAR Telemetry
                    </h2>
                    <p className="text-xs text-slate-400 dark:text-slate-400 font-medium">Incident #{incident.caseNumber} • {incident.region}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {/* Time Range Pills */}
                  <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-full text-xs font-extrabold">
                    {(['all', '1day', '1month', '1year'] as const).map(range => (
                      <button
                        key={range}
                        onClick={() => setTimeRange(range)}
                        className={`px-3 py-1 rounded-full transition-all ${
                          timeRange === range
                            ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-xs'
                            : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
                        }`}
                      >
                        {range === 'all' ? 'All' : range === '1day' ? '1 Day' : range === '1month' ? '1 Month' : '1 Year'}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* CARD MAIN BODY CONTENT (Tab View Render) */}
              <div className="flex-1 min-h-[420px]">
                {activeTab === 'map-rewind' && (
                  <div className="space-y-4">
                    <div className="h-[360px] rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800">
                      <OceanTacticalMap
                        incident={incident}
                        selectedVessel={selectedVessel}
                        onSelectVessel={(v) => setSelectedVessel(v)}
                        rewindHours={rewindHours}
                        simulatedScenarioVessel={selectedVessel}
                        simulatedPolygon={simulatedPolygon}
                        isDarkMode={isDarkMode}
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

              {/* Card Footer Legend (Matching Reference Dots) */}
              <div className="flex items-center gap-6 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs font-extrabold text-slate-600 dark:text-slate-300 font-mono">
                <span className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-600" /> Sentinel-1 SAR Mask
                </span>
                <span className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> AIS Track Vector
                </span>
                <span className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-purple-600" /> Hydrodynamic Plume
                </span>
              </div>

            </div>

            {/* TOP RIGHT STACKED KPI CARDS (4 CARDS MATCHING REFERENCE) */}
            <div className="lg:col-span-4 space-y-4 flex flex-col justify-between">
              
              {/* KPI CARD 1: Revenue / Slick Area */}
              <div className="bg-white dark:bg-slate-900/90 rounded-3xl border border-slate-200/90 dark:border-slate-800/90 p-5 shadow-sm flex items-center justify-between transition-colors duration-300">
                <div>
                  <span className="text-xs font-bold text-slate-400 dark:text-slate-500 block uppercase font-mono tracking-wider">Estimated Slick Area</span>
                  <span className="text-2xl font-black text-slate-900 dark:text-white font-mono mt-0.5 block">{incident.areaKm2} km²</span>
                  <span className="text-[11px] font-bold text-rose-500 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/80 px-2 py-0.5 rounded-full border border-rose-100 dark:border-rose-800 inline-flex items-center gap-1 mt-1 font-mono">
                    <TrendingDown className="w-3 h-3" /> 7.00% Since last observation
                  </span>
                </div>

                <button className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white flex items-center justify-center">
                  <ArrowUpRight className="w-5 h-5" />
                </button>
              </div>

              {/* KPI CARD 2: Customers / Attributed Suspect */}
              <div className="bg-white dark:bg-slate-900/90 rounded-3xl border border-slate-200/90 dark:border-slate-800/90 p-5 shadow-sm flex items-center justify-between transition-colors duration-300">
                <div>
                  <span className="text-xs font-bold text-slate-400 dark:text-slate-500 block uppercase font-mono tracking-wider">Attributed Suspect</span>
                  <span className="text-2xl font-black text-slate-900 dark:text-white font-mono mt-0.5 block">{selectedVessel.name.split(' ')[1] || selectedVessel.name}</span>
                  <span className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/80 px-2 py-0.5 rounded-full border border-indigo-100 dark:border-indigo-800 inline-flex items-center gap-1 mt-1 font-mono">
                    <ShieldCheck className="w-3 h-3" /> {selectedVessel.score.overall}% Attribution Score
                  </span>
                </div>

                <div className="w-11 h-11 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/25">
                  <Users className="w-5 h-5" />
                </div>
              </div>

              {/* KPI CARD 3: Current Month / SAR Resolution */}
              <div className="bg-white dark:bg-slate-900/90 rounded-3xl border border-slate-200/90 dark:border-slate-800/90 p-5 shadow-sm flex items-center justify-between transition-colors duration-300">
                <div>
                  <span className="text-xs font-bold text-slate-400 dark:text-slate-500 block uppercase font-mono tracking-wider">SAR Sensor Swath</span>
                  <span className="text-2xl font-black text-slate-900 dark:text-white font-mono mt-0.5 block">{incident.sensor.split(' ')[0]}</span>
                  <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-100 dark:border-emerald-800 inline-flex items-center gap-1 mt-1 font-mono">
                    <TrendingUp className="w-3 h-3" /> 10m High-Res
                  </span>
                </div>

                {/* Mini Bar Chart Graphic (Matching Reference) */}
                <div className="flex items-end gap-1 h-9">
                  <div className="w-1.5 h-4 bg-blue-400 rounded-xs" />
                  <div className="w-1.5 h-6 bg-blue-500 rounded-xs" />
                  <div className="w-1.5 h-3 bg-blue-400 rounded-xs" />
                  <div className="w-1.5 h-8 bg-blue-600 rounded-xs" />
                  <div className="w-1.5 h-5 bg-blue-500 rounded-xs" />
                  <div className="w-1.5 h-9 bg-blue-600 rounded-xs" />
                </div>
              </div>

              {/* KPI CARD 4: New Leads / Drift Vector */}
              <div className="bg-white dark:bg-slate-900/90 rounded-3xl border border-slate-200/90 dark:border-slate-800/90 p-5 shadow-sm flex items-center justify-between transition-colors duration-300">
                <div>
                  <span className="text-xs font-bold text-slate-400 dark:text-slate-500 block uppercase font-mono tracking-wider">Current Drift Vector</span>
                  <span className="text-2xl font-black text-slate-900 dark:text-white font-mono mt-0.5 block">{incident.currentKnots} kn</span>
                  <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-100 dark:border-emerald-800 inline-flex items-center gap-1 mt-1 font-mono">
                    <TrendingUp className="w-3 h-3" /> @ {incident.currentDirectionDeg}° Vector
                  </span>
                </div>

                {/* Smooth Sparkline Curve SVG (Matching Reference) */}
                <svg className="w-20 h-10 text-blue-600 dark:text-blue-400" viewBox="0 0 100 40">
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

          {/* BOTTOM GRID: SALES / HYPOTHESES CARD + SESSION BY DEVICE / EVIDENCE DOUGHNUT CARD */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            
            {/* BOTTOM LEFT CARD (Sales / Abductive Hypotheses Breakdown) */}
            <div className="lg:col-span-7 bg-white dark:bg-slate-900/90 rounded-3xl border border-slate-200/90 dark:border-slate-800/90 p-6 shadow-sm flex flex-col justify-between transition-colors duration-300">
              
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
                    Abductive Hypotheses Confidence &amp; Physics
                  </h3>
                  <p className="text-xs text-slate-400 dark:text-slate-400 font-medium">Multi-candidate posterior probability distribution</p>
                </div>

                {/* Pill Filter Tabs */}
                <div className="flex items-center gap-1 border border-slate-200 dark:border-slate-800 p-0.5 rounded-xl text-xs font-bold">
                  <button className="px-3 py-1 bg-blue-600 text-white rounded-lg">Day</button>
                  <button className="px-3 py-1 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white">Month</button>
                  <button className="px-3 py-1 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white">Year</button>
                </div>
              </div>

              {/* Big Metric Display */}
              <div className="mb-6">
                <span className="text-xs text-slate-400 dark:text-slate-500 font-mono block">Total Cumulative Confidence</span>
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl font-black text-slate-900 dark:text-white font-mono">$76685.41 / 89.4%</span>
                  <span className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800 font-mono">
                    ↑ 7.00%
                  </span>
                </div>
              </div>

              {/* Breakdown Items with Progress Bars */}
              <div className="space-y-4 font-mono text-xs">
                <div>
                  <div className="flex justify-between mb-1.5">
                    <span className="font-extrabold text-slate-900 dark:text-slate-200">$601.62 — MV Neptune Voyager (Bilge Discharge)</span>
                    <span className="text-slate-500 dark:text-slate-400">Item #1 • 68.4%</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-600 rounded-full" style={{ width: '68.4%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-1.5">
                    <span className="font-extrabold text-slate-900 dark:text-slate-200">$294.86 — MT Pacific Trader (Tank Washing)</span>
                    <span className="text-slate-500 dark:text-slate-400">Item #2 • 28.2%</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-500 rounded-full" style={{ width: '28.2%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-1.5">
                    <span className="font-extrabold text-slate-900 dark:text-slate-200">$972.65 — Subsea Wellhead R-4 Pipeline</span>
                    <span className="text-slate-500 dark:text-slate-400">Item #3 • 5.0%</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-purple-600 rounded-full" style={{ width: '5.0%' }} />
                  </div>
                </div>
              </div>

            </div>

            {/* BOTTOM RIGHT CARD (Session by Device / Evidence Doughnut Chart) */}
            <div className="lg:col-span-5 bg-white dark:bg-slate-900/90 rounded-3xl border border-slate-200/90 dark:border-slate-800/90 p-6 shadow-sm flex flex-col justify-between transition-colors duration-300">
              
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
                  Evidence Composition Breakdown
                </h3>

                <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-600 dark:text-slate-300 font-mono">
                  <span>Oct - Nov 2026</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>
              </div>

              {/* DOUGHNUT CHART + LEGEND GRID */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-6 py-2">
                
                {/* SVG DOUGHNUT CHART WITH CENTER TEXT */}
                <div className="relative w-44 h-44 shrink-0 flex items-center justify-center">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                    {/* Circle Segments */}
                    <circle cx="18" cy="18" r="14" fill="none" stroke="#f1f5f9" className="dark:stroke-slate-800" strokeWidth="4.5" />
                    <circle cx="18" cy="18" r="14" fill="none" stroke="#8b5cf6" strokeWidth="4.5" strokeDasharray="35 100" strokeDashoffset="0" />
                    <circle cx="18" cy="18" r="14" fill="none" stroke="#3b82f6" strokeWidth="4.5" strokeDasharray="25 100" strokeDashoffset="-35" />
                    <circle cx="18" cy="18" r="14" fill="none" stroke="#f97316" strokeWidth="4.5" strokeDasharray="25 100" strokeDashoffset="-60" />
                    <circle cx="18" cy="18" r="14" fill="none" stroke="#cbd5e1" className="dark:stroke-slate-600" strokeWidth="4.5" strokeDasharray="15 100" strokeDashoffset="-85" />
                  </svg>

                  <div className="absolute text-center font-mono">
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 block uppercase font-bold">Total</span>
                    <span className="text-lg font-black text-slate-900 dark:text-white block leading-tight">123456</span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 font-sans">Visitors / IoU</span>
                  </div>
                </div>

                {/* LEGEND ITEMS WITH COLOR DOTS */}
                <div className="space-y-3 font-mono text-xs w-full">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-slate-600 dark:text-slate-300 font-medium">
                      <span className="w-2.5 h-2.5 rounded-full bg-blue-600" /> Spatial P95 Match
                    </span>
                    <strong className="text-slate-900 dark:text-white font-extrabold">3490</strong>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-slate-600 dark:text-slate-300 font-medium">
                      <span className="w-2.5 h-2.5 rounded-full bg-purple-600" /> Temporal Window
                    </span>
                    <strong className="text-slate-900 dark:text-white font-extrabold">9146</strong>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-slate-600 dark:text-slate-300 font-medium">
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Hydrodynamic Plume
                    </span>
                    <strong className="text-slate-900 dark:text-white font-extrabold">7553</strong>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-slate-600 dark:text-slate-300 font-medium">
                      <span className="w-2.5 h-2.5 rounded-full bg-slate-300 dark:bg-slate-600" /> AIS Kinematic
                    </span>
                    <strong className="text-slate-900 dark:text-white font-extrabold">2906</strong>
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
