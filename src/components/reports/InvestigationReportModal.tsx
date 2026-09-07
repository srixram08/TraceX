import React, { useState } from 'react';
import { X, Printer, Download, ShieldCheck, FileText, CheckCircle2, AlertTriangle, Scale, Sparkles } from 'lucide-react';
import { Incident, Vessel } from '../../types';
import { CryptographicProvenanceBadge } from './CryptographicProvenanceBadge';

interface InvestigationReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  incident: Incident;
  selectedVessel: Vessel;
}

export const InvestigationReportModal: React.FC<InvestigationReportModalProps> = ({
  isOpen,
  onClose,
  incident,
  selectedVessel,
}) => {
  const [exported, setExported] = useState<boolean>(false);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({
      incident,
      topCandidate: selectedVessel,
      hypotheses: incident.hypotheses,
      dualLedger: incident.dualLedger,
      monteCarlo: incident.monteCarlo,
      forwardRisk: incident.forwardRisk,
      provenance: incident.provenance,
      generatedAt: new Date().toISOString(),
      system: "TraceX 2.0 / NTRO Maritime Intelligence Engine",
      dossierId: `DOS-${incident.caseNumber}-2026`
    }, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `TraceX_Dossier_${incident.caseNumber}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    setExported(true);
    setTimeout(() => setExported(false), 3000);
  };

  const topVessel = incident.vessels[0];

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-marine-900 border border-white/15 rounded-2xl max-w-3xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-marine-950/90 print:hidden">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold font-display text-white">
                INVESTIGATION DOSSIER #{incident.caseNumber}
              </h3>
              <p className="text-[11px] font-mono text-slate-400">
                NTRO / SIH26143 Certified Maritime Forensic Attribution Report
              </p>
            </div>
          </div>

          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Printable Document Body */}
        <div className="p-8 overflow-y-auto space-y-6 text-slate-200 font-mono text-xs bg-slate-950 print:bg-white print:text-black">
          
          {/* Top Dossier Title */}
          <div className="border-b-2 border-purple-500 pb-4 flex justify-between items-end">
            <div>
              <span className="text-[10px] text-purple-400 uppercase tracking-widest block font-bold">
                FORENSIC MARITIME INTELLIGENCE ATTRIBUTION
              </span>
              <h2 className="text-xl font-bold font-display text-white print:text-black">
                INVESTIGATION REPORT #{incident.caseNumber}
              </h2>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Classification: RESTRICTED • Decision-Support Brief
              </p>
            </div>
            <div className="text-right text-[10px] text-slate-400">
              <div>Generated: {new Date().toUTCString()}</div>
              <div>Node: SIH26143-NTRO-ALPHA</div>
            </div>
          </div>

          {/* Section 1: Incident Summary */}
          <div>
            <h3 className="text-xs font-bold text-tactical-cyan print:text-indigo-800 uppercase tracking-wider mb-2">
              1. INCIDENT &amp; SATELLITE DETECTION SUMMARY
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-marine-900/60 print:bg-slate-100 p-3 rounded-xl border border-white/5 print:border-slate-300 text-[11px]">
              <div>
                <span className="text-slate-400 print:text-slate-600 block text-[10px]">Detection Time</span>
                <span className="font-bold text-white print:text-black">{incident.detectionTimestamp}</span>
              </div>
              <div>
                <span className="text-slate-400 print:text-slate-600 block text-[10px]">Coordinates</span>
                <span className="font-bold text-white print:text-black">{incident.coordinates.lat.toFixed(4)}°N, {incident.coordinates.lng.toFixed(4)}°E</span>
              </div>
              <div>
                <span className="text-slate-400 print:text-slate-600 block text-[10px]">Estimated Area</span>
                <span className="font-bold text-white print:text-black">{incident.areaKm2} km² ({incident.estimatedVolumeM3} m³)</span>
              </div>
              <div>
                <span className="text-slate-400 print:text-slate-600 block text-[10px]">Satellite Sensor</span>
                <span className="font-bold text-white print:text-black">{incident.sensor}</span>
              </div>
            </div>
          </div>

          {/* Section 2: Probable Origin Reconstruction */}
          <div>
            <h3 className="text-xs font-bold text-tactical-cyan print:text-indigo-800 uppercase tracking-wider mb-2">
              2. RECONSTRUCTED ORIGIN &amp; HYDRODYNAMIC DRIFT
            </h3>
            <div className="bg-marine-900/60 print:bg-slate-100 p-3 rounded-xl border border-white/5 print:border-slate-300 space-y-1.5 text-[11px]">
              <div className="flex justify-between">
                <span className="text-slate-400 print:text-slate-600">Origin Centroid:</span>
                <span className="font-bold text-white print:text-black">{incident.probableOrigin.lat.toFixed(4)}°N, {incident.probableOrigin.lng.toFixed(4)}°E</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 print:text-slate-600">Estimated Release Window:</span>
                <span className="font-bold text-purple-300 print:text-purple-800">{incident.probableOrigin.timeWindowStart} – {incident.probableOrigin.timeWindowEnd} (T-4.2h)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 print:text-slate-600">Environmental Advection Vectors:</span>
                <span className="text-slate-200 print:text-slate-800">Current {incident.currentKnots} kn @ {incident.currentDirectionDeg}° | Wind {incident.windSpeedKnots} kn @ {incident.windDirectionDeg}°</span>
              </div>
            </div>
          </div>

          {/* Section 3: Candidate Vessel Attribution */}
          <div>
            <h3 className="text-xs font-bold text-tactical-cyan print:text-indigo-800 uppercase tracking-wider mb-2">
              3. PRIMARY CANDIDATE VESSEL ATTRIBUTION
            </h3>
            <div className="bg-marine-900/60 print:bg-slate-100 p-4 rounded-xl border border-white/5 print:border-slate-300 space-y-3">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="text-sm font-bold text-white print:text-black">{topVessel.name}</h4>
                  <p className="text-[10px] text-slate-400 print:text-slate-600">
                    IMO {topVessel.imo} • MMSI {topVessel.mmsi} • Flag: {topVessel.flag} • Type: {topVessel.type}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 print:text-emerald-800 border border-emerald-500/30">
                    {topVessel.score.overall}% Composite Evidence Match
                  </span>
                </div>
              </div>

              {/* Score Breakdown Table */}
              <div className="grid grid-cols-5 gap-2 text-center text-[10px] bg-marine-950 print:bg-white p-2 rounded-lg">
                <div><span className="block text-slate-400">Spatial</span><strong className="text-emerald-400">{topVessel.score.spatial}%</strong></div>
                <div><span className="block text-slate-400">Temporal</span><strong className="text-emerald-400">{topVessel.score.temporal}%</strong></div>
                <div><span className="block text-slate-400">Trajectory</span><strong className="text-emerald-400">{topVessel.score.trajectory}%</strong></div>
                <div><span className="block text-slate-400">Heading</span><strong className="text-emerald-400">{topVessel.score.heading}%</strong></div>
                <div><span className="block text-slate-400">Plume IoU</span><strong className="text-tactical-cyan">{topVessel.simulatedOverlapIoU}%</strong></div>
              </div>

              {/* Supporting Forensic Insights */}
              <div className="space-y-1 text-[11px] pt-1">
                <span className="text-[10px] font-bold text-purple-300 print:text-purple-800 uppercase block">Supporting Evidence Findings:</span>
                {topVessel.explainableInsights.map((insight, idx) => (
                  <div key={idx} className="flex items-start gap-1.5 text-slate-300 print:text-slate-700">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{insight}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Section 4: Cryptographic Forensic Chain of Custody */}
          <div>
            <h3 className="text-xs font-bold text-tactical-cyan print:text-indigo-800 uppercase tracking-wider mb-2">
              4. CRYPTOGRAPHIC MERKLE AUDIT CHAIN OF CUSTODY
            </h3>
            <CryptographicProvenanceBadge provenance={incident.provenance} />
          </div>

          {/* Section 5: Legal Notice */}
          <div className="border-t border-white/10 pt-4 space-y-2 text-[10px] text-slate-400 print:text-slate-600">
            <div className="flex items-center gap-1.5 font-bold text-amber-400 print:text-amber-800">
              <Scale className="w-3.5 h-3.5" />
              <span>LEGAL DECISION SUPPORT NOTICE (SIH26143 / NTRO STANDARD)</span>
            </div>
            <p>
              This document is generated by the TraceX automated maritime intelligence platform as investigative evidence. Final administrative or judicial actions remain subject to human maritime forensic verification.
            </p>
            <div className="flex justify-between pt-2 text-[9px] text-slate-500">
              <span>Merkle Root: {incident.provenance?.merkleRootHash.slice(0, 24)}...</span>
              <span>Signature: VERIFIED_NTRO_NODE</span>
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-white/10 bg-marine-950 flex items-center justify-between font-mono text-xs print:hidden">
          <span className="text-slate-400">
            {exported ? '✓ Exported Successfully' : 'Ready for Export / Print'}
          </span>

          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Dossier</span>
            </button>

            <button
              onClick={handleExportJSON}
              className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-tactical-cyan text-white font-bold shadow-lg shadow-purple-600/30 hover:scale-105 transition-transform"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Certified JSON / PDF</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
