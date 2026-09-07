import React, { useState } from 'react';
import { Scan } from 'lucide-react';
import { Incident } from '../../types';

interface SatelliteViewerProps {
  incident: Incident;
}

export const SatelliteViewer: React.FC<SatelliteViewerProps> = ({ incident }) => {
  const [polarization, setPolarization] = useState<'VV' | 'VH' | 'RGB_COMPOSITE'>('VV');
  const [threshold, setThreshold] = useState<number>(65);
  const [showMask, setShowMask] = useState<boolean>(true);

  return (
    <div className="bg-white/95 backdrop-blur-md p-6 rounded-3xl border border-slate-200/90 shadow-lg shadow-purple-900/5 space-y-4 font-sans">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3.5 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-purple-100 to-indigo-100 text-purple-700 flex items-center justify-center font-bold border border-purple-200/60 shadow-xs">
            <Scan className="w-4.5 h-4.5" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold tracking-tight text-slate-900 font-sans">
              SATELLITE SAR &amp; OPTICAL LAB
            </h3>
            <p className="text-[11px] font-mono text-slate-500 font-medium">
              Sensor: {incident.sensor} ({incident.polarization}) • {incident.resolutionMeters}m GSD
            </p>
          </div>
        </div>

        {/* Pol Mode Switcher */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-2xl border border-slate-200/80 text-xs font-mono">
          <button
            onClick={() => setPolarization('VV')}
            className={`px-3 py-1 rounded-xl transition-all font-bold ${
              polarization === 'VV' ? 'bg-purple-600 text-white shadow-sm' : 'text-slate-600 hover:text-purple-600'
            }`}
          >
            VV (Co-Pol)
          </button>
          <button
            onClick={() => setPolarization('VH')}
            className={`px-3 py-1 rounded-xl transition-all font-bold ${
              polarization === 'VH' ? 'bg-purple-600 text-white shadow-sm' : 'text-slate-600 hover:text-purple-600'
            }`}
          >
            VH (Cross-Pol)
          </button>
          <button
            onClick={() => setPolarization('RGB_COMPOSITE')}
            className={`px-3 py-1 rounded-xl transition-all font-bold ${
              polarization === 'RGB_COMPOSITE' ? 'bg-purple-600 text-white shadow-sm' : 'text-slate-600 hover:text-purple-600'
            }`}
          >
            False Color
          </button>
        </div>
      </div>

      {/* Main Image Raster Simulation Container (Dark Radar Canvas) */}
      <div className="relative h-64 bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden flex items-center justify-center shadow-inner">
        <div className="absolute inset-0 radar-grid opacity-30 pointer-events-none" />

        {/* Synthetic SAR Backscatter Canvas Rendering */}
        <div className="relative w-full h-full p-4 flex items-center justify-center">
          
          {/* Simulated Dark Slick Contour */}
          <div className={`w-64 h-36 rounded-[35%_65%_75%_25%/45%_55%_65%_45%] transition-all duration-500 border-2 ${
            polarization === 'VV'
              ? 'bg-slate-900/90 border-slate-700 shadow-inner'
              : polarization === 'VH'
              ? 'bg-indigo-950/80 border-indigo-700'
              : 'bg-gradient-to-tr from-purple-950/90 via-red-950/60 to-blue-950/80 border-purple-500'
          }`}>
            
            {/* Overlay Dielectric Threshold Mask */}
            {showMask && (
              <div 
                className="w-full h-full rounded-[inherit] bg-red-600/40 border-2 border-red-500 flex flex-col items-center justify-center animate-pulse"
                style={{ opacity: threshold / 100 }}
              >
                <span className="text-[11px] font-mono font-extrabold text-white bg-slate-950/80 px-2.5 py-1 rounded-lg border border-red-400/50 shadow-sm">
                  Extracted Slick Mask ({incident.areaKm2} km²)
                </span>
                <span className="text-[10px] font-mono text-red-200 mt-1 font-bold">
                  Dielectric Damping: -4.8 dB
                </span>
              </div>
            )}

          </div>

        </div>

        {/* Top Left Metadata Overlay */}
        <div className="absolute top-3 left-3 bg-slate-900/90 px-3 py-1.5 rounded-xl border border-slate-800 text-[10px] font-mono text-slate-300 font-medium">
          <div>Pass Time: {incident.detectionTimestamp}</div>
          <div>Orbit: Ascending Node #49102</div>
        </div>

        {/* Bottom Right Area Pill */}
        <div className="absolute bottom-3 right-3 bg-slate-900/90 px-3 py-1.5 rounded-xl border border-slate-800 text-[10px] font-mono text-cyan-400 font-extrabold">
          Estimated Volume: {incident.estimatedVolumeM3} m³
        </div>
      </div>

      {/* Threshold & Mask Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200/80 font-mono text-xs text-slate-800">
        <div>
          <div className="flex justify-between text-slate-600 mb-1.5 font-semibold">
            <span>Dielectric Thresholding:</span>
            <span className="text-purple-700 font-bold">{threshold}%</span>
          </div>
          <input
            type="range"
            min="30"
            max="95"
            value={threshold}
            onChange={(e) => setThreshold(parseInt(e.target.value))}
            className="w-full accent-purple-600 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
          />
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-3 pt-3 sm:pt-0">
          <label className="flex items-center gap-2.5 cursor-pointer text-slate-700 font-bold hover:text-purple-700 transition-colors">
            <input
              type="checkbox"
              checked={showMask}
              onChange={(e) => setShowMask(e.target.checked)}
              className="accent-purple-600 w-4 h-4 rounded"
            />
            <span>Show Segmentation Mask</span>
          </label>
        </div>
      </div>

    </div>
  );
};
