import React, { useState } from 'react';
import { 
  Flame, RotateCcw, GitFork, FlaskConical, Satellite, FileText
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

interface OperationsDashboardProps {
  incident: Incident;
  onOpenReport: () => void;
  onOpenNewIncident: () => void;
}

export const OperationsDashboard: React.FC<OperationsDashboardProps> = ({
  incident,
  onOpenReport,
}) => {
  const [activeTab, setActiveTab] = useState<'map-rewind' | 'counterfactual' | 'evidence-graph' | 'sar-lab'>('map-rewind');
  const [selectedVessel, setSelectedVessel] = useState<Vessel>(incident.vessels[0]);
  const [inspectedVessel, setInspectedVessel] = useState<Vessel | null>(null);
  const [rewindHours, setRewindHours] = useState<number>(0);

  const [simulatedPolygon, setSimulatedPolygon] = useState<[number, number][] | null>(null);

  const handleUpdateSimulatedPolygon = (poly: [number, number][]) => {
    setSimulatedPolygon(poly);
  };

  const handleSimulateCandidate = (vessel: Vessel) => {
    setSelectedVessel(vessel);
    setActiveTab('counterfactual');
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-transparent p-4 sm:p-8 space-y-6 max-w-[1600px] mx-auto font-sans">
      
      {/* TOP INCIDENT TELEMETRY RIBBON */}
      <div className="bg-white/95 backdrop-blur-md p-5 rounded-3xl border border-slate-200/90 shadow-lg shadow-purple-900/5 flex flex-wrap items-center justify-between gap-4 font-mono text-xs">
        
        {/* Left: Incident Case & Area */}
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-red-100 to-rose-100 border border-red-200 flex items-center justify-center text-red-600 shadow-xs">
            <Flame className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <span className="text-lg font-extrabold text-slate-900 font-sans tracking-tight">
                INCIDENT #{incident.caseNumber}
              </span>
              <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-red-100 text-red-700 border border-red-200 uppercase tracking-wider">
                {incident.status}
              </span>
            </div>
            <p className="text-xs text-slate-500 font-sans font-medium mt-0.5">
              {incident.region}
            </p>
          </div>
        </div>

        {/* Middle Telemetry Badges */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="bg-slate-50 px-4 py-2 rounded-2xl border border-slate-200/80 shadow-2xs">
            <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">Estimated Slick Area</span>
            <span className="text-sm font-extrabold text-slate-900">{incident.areaKm2} km²</span>
          </div>

          <div className="bg-purple-50/80 px-4 py-2 rounded-2xl border border-purple-200/80 shadow-2xs">
            <span className="text-purple-600 block text-[10px] uppercase font-bold tracking-wider">SAR Confidence</span>
            <span className="text-sm font-extrabold text-purple-900">{(incident.confidence * 100).toFixed(0)}%</span>
          </div>

          <div className="bg-blue-50/80 px-4 py-2 rounded-2xl border border-blue-200/80 shadow-2xs">
            <span className="text-blue-600 block text-[10px] uppercase font-bold tracking-wider">Sensor Swath</span>
            <span className="text-sm font-extrabold text-blue-900">{incident.sensor.split(' ')[0]} Dual-Pol</span>
          </div>

          <div className="bg-emerald-50/80 px-4 py-2 rounded-2xl border border-emerald-200/80 shadow-2xs">
            <span className="text-emerald-700 block text-[10px] uppercase font-bold tracking-wider">Current Drift</span>
            <span className="text-sm font-extrabold text-emerald-900">{incident.currentKnots} kn @ {incident.currentDirectionDeg}°</span>
          </div>
        </div>

        {/* Right Action: Export Dossier */}
        <button
          onClick={onOpenReport}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold text-xs shadow-md shadow-purple-500/25 transition-all hover:scale-105"
        >
          <FileText className="w-4 h-4" />
          <span>Export Dossier</span>
        </button>

      </div>

      {/* SUB-VIEW TABS SWITCHER */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 bg-white p-1.5 rounded-2xl border border-slate-200/90 shadow-xs text-xs font-sans">
          <button
            onClick={() => setActiveTab('map-rewind')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all font-bold ${
              activeTab === 'map-rewind'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-500/20'
                : 'text-slate-600 hover:text-purple-600 hover:bg-purple-50'
            }`}
          >
            <RotateCcw className="w-4 h-4" />
            <span>Tactical Map &amp; Rewind</span>
          </button>

          <button
            onClick={() => setActiveTab('counterfactual')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all font-bold ${
              activeTab === 'counterfactual'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-500/20'
                : 'text-slate-600 hover:text-purple-600 hover:bg-purple-50'
            }`}
          >
            <FlaskConical className="w-4 h-4" />
            <span>Counterfactual Simulation</span>
          </button>

          <button
            onClick={() => setActiveTab('evidence-graph')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all font-bold ${
              activeTab === 'evidence-graph'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-500/20'
                : 'text-slate-600 hover:text-purple-600 hover:bg-purple-50'
            }`}
          >
            <GitFork className="w-4 h-4" />
            <span>Evidence Graph</span>
          </button>

          <button
            onClick={() => setActiveTab('sar-lab')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all font-bold ${
              activeTab === 'sar-lab'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-500/20'
                : 'text-slate-600 hover:text-purple-600 hover:bg-purple-50'
            }`}
          >
            <Satellite className="w-4 h-4" />
            <span>SAR Satellite Lab</span>
          </button>
        </div>

        <span className="text-xs font-mono text-slate-500 hidden md:block">
          Active Suspect Focus: <strong className="text-purple-700 font-bold">{selectedVessel.name}</strong> ({selectedVessel.score.overall}% Match)
        </span>
      </div>

      {/* MAIN OPERATIONAL SPLIT LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left / Center Work Area */}
        <div className="lg:col-span-7 space-y-6">
          
          {activeTab === 'map-rewind' && (
            <>
              <div className="h-[540px]">
                <OceanTacticalMap
                  incident={incident}
                  selectedVessel={selectedVessel}
                  onSelectVessel={(v) => setSelectedVessel(v)}
                  rewindHours={rewindHours}
                  simulatedScenarioVessel={selectedVessel}
                  simulatedPolygon={simulatedPolygon}
                />
              </div>

              <RewindController
                incident={incident}
                rewindHours={rewindHours}
                setRewindHours={setRewindHours}
                selectedVessel={selectedVessel}
              />
            </>
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

        {/* Right Side Intelligence & Candidates Panel */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Candidate Vessel List */}
          <CandidateList
            vessels={incident.vessels}
            selectedVessel={selectedVessel}
            onSelectVessel={(v) => setSelectedVessel(v)}
            onOpenDetails={(v) => setInspectedVessel(v)}
            onSimulateVessel={handleSimulateCandidate}
          />

          {/* Explainable AI Factor Panel */}
          <ExplainableAIPanel
            vessel={selectedVessel}
            incident={incident}
            onOpenReport={onOpenReport}
          />

          {/* Environmental Telemetry Stream */}
          <EnvironmentalPanel incident={incident} />

        </div>

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
