import React from 'react';
import { Wind, Compass, Waves, Thermometer, Gauge, Anchor } from 'lucide-react';
import { Incident } from '../../types';

interface EnvironmentalPanelProps {
  incident: Incident;
}

export const EnvironmentalPanel: React.FC<EnvironmentalPanelProps> = ({ incident }) => {
  return (
    <div className="bg-white/95 backdrop-blur-md p-6 rounded-3xl border border-slate-200/90 shadow-lg shadow-purple-900/5 space-y-4 font-sans">
      
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
            <Compass className="w-4.5 h-4.5 text-blue-600" />
          </div>
          <h3 className="text-sm font-extrabold tracking-tight text-slate-900 font-sans">
            ENVIRONMENTAL TELEMETRY
          </h3>
        </div>
        <span className="text-[11px] font-mono text-slate-500 font-medium">
          HYCOM / ECMWF Live
        </span>
      </div>

      {/* 6 High-Contrast Sensor Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 font-mono text-xs">
        
        <div className="bg-blue-50/80 p-3.5 rounded-2xl border border-blue-100/90 transition-all hover:bg-blue-50">
          <div className="flex items-center gap-1.5 text-blue-900 text-[10px] mb-1 font-bold">
            <Wind className="w-3.5 h-3.5 text-blue-600" />
            <span>Wind Leeway</span>
          </div>
          <div className="text-base font-extrabold text-slate-900">
            {incident.windSpeedKnots} <span className="text-[10px] text-slate-500 font-normal">kn</span>
          </div>
          <span className="text-[10px] text-slate-500 font-medium">{incident.windDirectionDeg}° SW</span>
        </div>

        <div className="bg-emerald-50/80 p-3.5 rounded-2xl border border-emerald-100/90 transition-all hover:bg-emerald-50">
          <div className="flex items-center gap-1.5 text-emerald-900 text-[10px] mb-1 font-bold">
            <Compass className="w-3.5 h-3.5 text-emerald-600" />
            <span>Surface Current</span>
          </div>
          <div className="text-base font-extrabold text-emerald-900">
            {incident.currentKnots} <span className="text-[10px] text-slate-500 font-normal">kn</span>
          </div>
          <span className="text-[10px] text-slate-500 font-medium">{incident.currentDirectionDeg}° ENE</span>
        </div>

        <div className="bg-purple-50/80 p-3.5 rounded-2xl border border-purple-100/90 transition-all hover:bg-purple-50">
          <div className="flex items-center gap-1.5 text-purple-900 text-[10px] mb-1 font-bold">
            <Waves className="w-3.5 h-3.5 text-purple-600" />
            <span>Significant Wave</span>
          </div>
          <div className="text-base font-extrabold text-slate-900">
            {incident.waveHeightMeters} <span className="text-[10px] text-slate-500 font-normal">m</span>
          </div>
          <span className="text-[10px] text-slate-500 font-medium">Period: 6.2s</span>
        </div>

        <div className="bg-amber-50/80 p-3.5 rounded-2xl border border-amber-100/90 transition-all hover:bg-amber-50">
          <div className="flex items-center gap-1.5 text-amber-900 text-[10px] mb-1 font-bold">
            <Thermometer className="w-3.5 h-3.5 text-amber-600" />
            <span>Sea Surface Temp</span>
          </div>
          <div className="text-base font-extrabold text-slate-900">
            {incident.sstDegC}°C
          </div>
          <span className="text-[10px] text-slate-500 font-medium">Buoy #23001</span>
        </div>

        <div className="bg-indigo-50/80 p-3.5 rounded-2xl border border-indigo-100/90 transition-all hover:bg-indigo-50">
          <div className="flex items-center gap-1.5 text-indigo-900 text-[10px] mb-1 font-bold">
            <Anchor className="w-3.5 h-3.5 text-indigo-600" />
            <span>Bathymetry</span>
          </div>
          <div className="text-base font-extrabold text-slate-900">
            {incident.bathymetryMeters} <span className="text-[10px] text-slate-500 font-normal">m</span>
          </div>
          <span className="text-[10px] text-slate-500 font-medium">Shelf Edge</span>
        </div>

        <div className="bg-red-50/80 p-3.5 rounded-2xl border border-red-100/90 transition-all hover:bg-red-50">
          <div className="flex items-center gap-1.5 text-red-900 text-[10px] mb-1 font-bold">
            <Gauge className="w-3.5 h-3.5 text-red-600" />
            <span>Stokes Leeway</span>
          </div>
          <div className="text-base font-extrabold text-slate-900">
            3.5%
          </div>
          <span className="text-[10px] text-slate-500 font-medium">Windage Ratio</span>
        </div>

      </div>

    </div>
  );
};
