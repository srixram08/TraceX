import React, { useState } from 'react';
import { X, Upload, Satellite, Radio, CheckCircle2, ArrowRight, Loader2 } from 'lucide-react';
import { Incident } from '../../types';

interface NewIncidentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddNewIncident: (incident: Incident) => void;
}

export const NewIncidentModal: React.FC<NewIncidentModalProps> = ({
  isOpen,
  onClose,
  onAddNewIncident,
}) => {
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [step, setStep] = useState<'upload' | 'analyzing' | 'done'>('upload');
  const [caseTitle, setCaseTitle] = useState('Gulf of Mannar Biological Sanctuary Spill');
  const [region, setRegion] = useState('Gulf of Mannar / Palk Bay Corridor');

  if (!isOpen) return null;

  const handleSimulateUpload = () => {
    setStep('analyzing');
    setIsProcessing(true);

    setTimeout(() => {
      setStep('done');
      setIsProcessing(false);

      const newInc: Incident = {
        id: `inc-${Date.now()}`,
        caseNumber: `SLK-0${Math.floor(Math.random() * 80 + 45)}`,
        title: caseTitle,
        region: region,
        coordinates: { lat: 9.1420, lng: 79.2410 },
        detectionTimestamp: '2026-09-04 09:15 UTC',
        sensor: 'Sentinel-1 C-SAR Dual-Pol',
        polarization: 'VV / VH Cross-Polarized',
        resolutionMeters: 10,
        areaKm2: 12.4,
        estimatedVolumeM3: 310.0,
        confidence: 0.94,
        status: 'ACTIVE_INVESTIGATION',
        windSpeedKnots: 10.8,
        windDirectionDeg: 210,
        currentKnots: 1.6,
        currentDirectionDeg: 45,
        waveHeightMeters: 1.4,
        sstDegC: 29.5,
        bathymetryMeters: -62,
        description: 'Automated satellite pass ingestion detected fresh slick plume near protected coral sanctuary.',
        probableOrigin: {
          lat: 9.0810,
          lng: 79.1820,
          radiusKm: 2.8,
          timeWindowStart: '05:00 UTC',
          timeWindowEnd: '06:30 UTC',
          estimatedReleaseOffsetHours: 3.5,
          confidence: 0.91,
          uncertaintyLatKm: 1.0,
          uncertaintyLngKm: 1.2
        },
        spillPolygon: [
          [9.155, 79.230],
          [9.162, 79.255],
          [9.135, 79.260],
          [9.125, 79.235]
        ],
        vessels: [
          {
            id: 'v-new-1',
            name: 'MT Coral Pearl',
            imo: '9781102',
            mmsi: '419001920',
            flag: 'India',
            flagCode: 'IN',
            type: 'Chemical Tanker',
            dwt: 37500,
            draft: 9.8,
            length: 165,
            beam: 27,
            originPort: 'Chennai (IN)',
            destinationPort: 'Colombo (LK)',
            cargoType: 'Industrial Solvents',
            rank: 1,
            score: {
              overall: 88,
              spatial: 92,
              temporal: 89,
              trajectory: 86,
              heading: 84,
              drift: 90
            },
            simulatedOverlapIoU: 89.2,
            status: 'HIGH_PROBABILITY',
            anomalyFlags: ['Deceleration inside marine sanctuary boundary'],
            explainableInsights: [
              'Vessel trajectory intersected reverse-drift origin zone at 05:40 UTC.',
              'Forward counterfactual simulation yields 89.2% IoU spatial match.'
            ],
            estimatedReleaseTime: '05:40 UTC',
            estimatedReleaseOffsetHours: -3.58,
            releaseCoordinates: { lat: 9.0820, lng: 79.1840 },
            color: '#ef4444',
            trajectory: [
              { lat: 9.010, lng: 79.100, timestamp: 'T-5h', timeOffsetHours: -5, sog: 13.2, cog: 45, heading: 46, navStatus: 'Underway' },
              { lat: 9.080, lng: 79.180, timestamp: 'T-3h', timeOffsetHours: -3, sog: 5.1, cog: 48, heading: 50, navStatus: 'Underway', isAnomalous: true, anomalyReason: 'Sudden deceleration' },
              { lat: 9.150, lng: 79.250, timestamp: 'T-0h', timeOffsetHours: 0, sog: 13.5, cog: 45, heading: 46, navStatus: 'Underway' }
            ]
          }
        ]
      };

      onAddNewIncident(newInc);
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-marine-900 border border-white/15 rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden font-mono">
        
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-marine-950">
          <div className="flex items-center gap-2.5">
            <Satellite className="w-5 h-5 text-purple-400" />
            <h3 className="text-base font-bold text-white font-display">
              INGEST NEW SATELLITE / AIS PASS
            </h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4 text-xs">
          {step === 'upload' && (
            <>
              <div>
                <label className="text-slate-400 block mb-1">Incident Title / Descriptor</label>
                <input
                  type="text"
                  value={caseTitle}
                  onChange={(e) => setCaseTitle(e.target.value)}
                  className="w-full bg-marine-950 border border-white/10 rounded-xl p-2.5 text-white focus:border-purple-500 outline-none"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Maritime Region / EEZ Sector</label>
                <input
                  type="text"
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                  className="w-full bg-marine-950 border border-white/10 rounded-xl p-2.5 text-white focus:border-purple-500 outline-none"
                />
              </div>

              {/* Drag and Drop Zone */}
              <div 
                onClick={handleSimulateUpload}
                className="border-2 border-dashed border-purple-500/40 hover:border-purple-500 rounded-2xl p-8 text-center cursor-pointer bg-purple-950/20 hover:bg-purple-950/40 transition-all group"
              >
                <Upload className="w-8 h-8 text-purple-400 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                <span className="text-white font-bold block mb-1">
                  Upload Sentinel-1 SAR .SAFE / AIS CSV Dataset
                </span>
                <span className="text-slate-400 text-[11px]">
                  Click to simulate direct automated ingestion &amp; neural segmentation
                </span>
              </div>
            </>
          )}

          {step === 'analyzing' && (
            <div className="py-12 text-center space-y-4">
              <Loader2 className="w-10 h-10 text-tactical-cyan animate-spin mx-auto" />
              <div className="text-sm font-bold text-white">
                Running Neural SAR Segmentation &amp; Lagrangian Reverse Advection...
              </div>
              <p className="text-[11px] text-slate-400">
                Correlating 12,400 AIS messages across Gulf of Mannar Sector
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
