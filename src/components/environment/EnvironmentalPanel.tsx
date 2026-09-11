import React from 'react';
import { Wind, Compass, Waves, Thermometer, Gauge, Anchor } from 'lucide-react';
import { Incident } from '../../types';

interface EnvironmentalPanelProps {
  incident: Incident;
}

export const EnvironmentalPanel: React.FC<EnvironmentalPanelProps> = ({ incident }) => {
  return (
    <div className="bg-[#040e16]/95 backdrop-blur-md p-6 rounded-3xl border border-[#0e3344] shadow-2xl space-y-4 font-sans text-slate-100 select-none">
      
      <div className="flex items-center justify-between pb-3 border-b border-[#0f3243]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 flex items-center justify-center font-bold">
            <Compass className="w-4.5 h-4.5 text-cyan-400" />
          </div>
          <h3 className="text-sm font-extrabold tracking-tight text-white font-sans">
            ENVIRONMENTAL TELEMETRY
          </h3>
        </div>
        <span className="text-[11px] font-mono text-cyan-300/70 font-medium">
          HYCOM / ECMWF Live
        </span>
      </div>

      {/* 6 Sensor Cards (Deep Space Dark) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 font-mono text-xs">
        
        <div className="bg-[#061824] p-3.5 rounded-2xl border border-[#133c50] shadow-md">
          <div className="flex items-center gap-1.5 text-cyan-400 text-[10px] mb-1 font-bold">
            <Wind className="w-3.5 h-3.5 text-cyan-400" />
            <span>Wind Leeway</span>
          </div>
          <div className="text-base font-extrabold text-white">
            {incident.windSpeedKnots} <span className="text-[10px] text-slate-400 font-normal">kn</span>
          </div>
          <span className="text-[10px] text-slate-400 font-medium">{incident.windDirectionDeg}° SW</span>
        </div>

        <div className="bg-[#061824] p-3.5 rounded-2xl border border-[#133c50] shadow-md">
          <div className="flex items-center gap-1.5 text-emerald-400 text-[10px] mb-1 font-bold">
            <Compass className="w-3.5 h-3.5 text-emerald-400" />
            <span>Surface Current</span>
          </div>
          <div className="text-base font-extrabold text-emerald-300">
            {incident.currentKnots} <span className="text-[10px] text-slate-400 font-normal">kn</span>
          </div>
          <span className="text-[10px] text-slate-400 font-medium">{incident.currentDirectionDeg}° ENE</span>
        </div>

        <div className="bg-[#061824] p-3.5 rounded-2xl border border-[#133c50] shadow-md">
          <div className="flex items-center gap-1.5 text-purple-400 text-[10px] mb-1 font-bold">
            <Waves className="w-3.5 h-3.5 text-purple-400" />
            <span>Significant Wave</span>
          </div>
          <div className="text-base font-extrabold text-white">
            {incident.waveHeightMeters} <span className="text-[10px] text-slate-400 font-normal">m</span>
          </div>
          <span className="text-[10px] text-slate-400 font-medium">Period: 6.2s</span>
        </div>

        <div className="bg-[#061824] p-3.5 rounded-2xl border border-[#133c50] shadow-md">
          <div className="flex items-center gap-1.5 text-amber-400 text-[10px] mb-1 font-bold">
            <Thermometer className="w-3.5 h-3.5 text-amber-400" />
            <span>Sea Surface Temp</span>
          </div>
          <div className="text-base font-extrabold text-white">
            {incident.sstDegC}°C
          </div>
          <span className="text-[10px] text-slate-400 font-medium">Buoy #23001</span>
        </div>

        <div className="bg-[#061824] p-3.5 rounded-2xl border border-[#133c50] shadow-md">
          <div className="flex items-center gap-1.5 text-indigo-400 text-[10px] mb-1 font-bold">
            <Anchor className="w-3.5 h-3.5 text-indigo-400" />
            <span>Bathymetry</span>
          </div>
          <div className="text-base font-extrabold text-white">
            {incident.bathymetryMeters} <span className="text-[10px] text-slate-400 font-normal">m</span>
          </div>
          <span className="text-[10px] text-slate-400 font-medium">Shelf Edge</span>
        </div>

        <div className="bg-[#061824] p-3.5 rounded-2xl border border-[#133c50] shadow-md">
          <div className="flex items-center gap-1.5 text-rose-400 text-[10px] mb-1 font-bold">
            <Gauge className="w-3.5 h-3.5 text-rose-400" />
            <span>Stokes Leeway</span>
          </div>
          <div className="text-base font-extrabold text-white">
            3.5%
          </div>
          <span className="text-[10px] text-slate-400 font-medium">Windage Ratio</span>
        </div>

      </div>

    </div>
  );
};
