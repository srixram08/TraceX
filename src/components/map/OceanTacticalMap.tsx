import React, { useEffect, useRef, useState } from 'react';
import { 
  Layers, Compass, Wind, Navigation, Eye, EyeOff, Radio, Maximize2, RotateCcw, AlertTriangle, Shield, Map
} from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Incident, Vessel, DriftParticle } from '../../types';
import { stepParticlesBackward, generateInitialParticles } from '../../physics/driftEngine';

interface OceanTacticalMapProps {
  incident: Incident;
  selectedVessel: Vessel | null;
  onSelectVessel: (v: Vessel) => void;
  rewindHours: number;
  simulatedScenarioVessel: Vessel | null;
  simulatedPolygon: [number, number][] | null;
  isDarkMode?: boolean;
}

export const OceanTacticalMap: React.FC<OceanTacticalMapProps> = ({
  incident,
  selectedVessel,
  onSelectVessel,
  rewindHours,
  simulatedScenarioVessel,
  simulatedPolygon,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const leafletMapRef = useRef<L.Map | null>(null);
  const currentTileLayerRef = useRef<L.TileLayer | null>(null);

  // Basemap style: strictly dark space theme ('dark' for high-tech navy space, 'satellite' for orbital sensor view)
  const [baseMapStyle, setBaseMapStyle] = useState<'dark' | 'satellite'>('dark');

  // Layer toggles
  const [layers, setLayers] = useState({
    spillPolygon: true,
    originEllipse: true,
    vesselTracks: true,
    driftParticles: true,
    oceanCurrents: true,
    windVectors: true,
    counterfactualPlume: true,
  });

  const [particles, setParticles] = useState<DriftParticle[]>(() => 
    generateInitialParticles(incident, 45)
  );

  useEffect(() => {
    const updated = stepParticlesBackward(
      generateInitialParticles(incident, 45),
      incident,
      rewindHours
    );
    setParticles(updated);
  }, [rewindHours, incident]);

  // Leaflet Map Initialization
  useEffect(() => {
    if (!mapContainerRef.current) return;

    const leaflet = (window as any).L || L;
    if (!leaflet) return;

    const lat = incident.coordinates.lat;
    const lng = incident.coordinates.lng;

    if (!leafletMapRef.current) {
      const map = leaflet.map(mapContainerRef.current, {
        center: [lat, lng],
        zoom: 11,
        zoomControl: false,
        attributionControl: false,
      });

      // Default to CartoDB Dark Matter with cyber navy oceans
      const tileUrl = baseMapStyle === 'dark'
        ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
        : 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';

      currentTileLayerRef.current = leaflet.tileLayer(tileUrl, {
        maxZoom: 19,
        subdomains: 'abcd',
      }).addTo(map);

      leafletMapRef.current = map;

      // Invalidate size after mount to prevent blank tiles
      setTimeout(() => {
        map.invalidateSize();
      }, 150);
      setTimeout(() => {
        map.invalidateSize();
      }, 500);
    } else {
      leafletMapRef.current.setView([lat, lng], 11);
      setTimeout(() => {
        leafletMapRef.current?.invalidateSize();
      }, 100);
    }

    // ResizeObserver to automatically resize map whenever container dimensions change
    const resizeObserver = new ResizeObserver(() => {
      if (leafletMapRef.current) {
        leafletMapRef.current.invalidateSize();
      }
    });

    resizeObserver.observe(mapContainerRef.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, [incident]);

  // Tile layer switcher
  useEffect(() => {
    const map = leafletMapRef.current;
    const leaflet = (window as any).L || L;
    if (!map || !leaflet) return;

    if (currentTileLayerRef.current) {
      map.removeLayer(currentTileLayerRef.current);
    }

    const tileUrl = baseMapStyle === 'dark'
      ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
      : 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';

    currentTileLayerRef.current = leaflet.tileLayer(tileUrl, {
      maxZoom: 19,
      subdomains: 'abcd',
    }).addTo(map);

    map.invalidateSize();
  }, [baseMapStyle]);

  // Vector Layer rendering
  useEffect(() => {
    const map = leafletMapRef.current;
    const leaflet = (window as any).L || L;
    if (!map || !leaflet) return;

    const layerGroup = leaflet.layerGroup().addTo(map);

    // 1. Observed Spill Polygon (Glowing Neon Red/Rose)
    if (layers.spillPolygon && incident.spillPolygon.length > 0) {
      const spillPoly = leaflet.polygon(incident.spillPolygon, {
        color: '#f43f5e',
        weight: 3,
        fillColor: '#ef4444',
        fillOpacity: 0.5,
        dashArray: '6, 4'
      }).addTo(layerGroup);

      spillPoly.bindTooltip(`
        <div style="background: #06111a; border: 1px solid #f43f5e; padding: 8px 12px; border-radius: 12px; color: white; font-family: monospace; font-size: 11px; box-shadow: 0 0 15px rgba(244,63,94,0.35);">
          <div style="font-weight: 800; color: #f43f5e; margin-bottom: 2px;">🔴 OBSERVED OIL SLICK (T0)</div>
          <div>Area: <strong>${incident.areaKm2} km²</strong></div>
          <div>Sensor Confidence: <strong style="color: #38bdf8;">${(incident.confidence * 100).toFixed(0)}%</strong></div>
        </div>
      `, { className: 'custom-dark-tooltip', sticky: true });
    }

    // 2. Probable Origin Zone Ellipse (Glowing Neon Purple / Violet)
    if (layers.originEllipse && rewindHours > 0) {
      const orig = incident.probableOrigin;
      const expansionFactor = 1 + (rewindHours * 0.25);
      const originRadius = (orig.radiusKm * 1000) * expansionFactor;

      const originCircle = leaflet.circle([orig.lat, orig.lng], {
        radius: originRadius,
        color: '#a855f7',
        weight: 3,
        fillColor: '#9333ea',
        fillOpacity: 0.3,
        dashArray: '8, 6'
      }).addTo(layerGroup);

      originCircle.bindTooltip(`
        <div style="background: #06111a; border: 1px solid #a855f7; padding: 8px 12px; border-radius: 12px; color: white; font-family: monospace; font-size: 11px; box-shadow: 0 0 15px rgba(168,85,247,0.35);">
          <div style="font-weight: 800; color: #c084fc; margin-bottom: 2px;">🎯 RECONSTRUCTED ORIGIN ZONE</div>
          <div>Release Window: <strong>${orig.timeWindowStart} - ${orig.timeWindowEnd}</strong></div>
          <div>Radius: <strong>${(originRadius / 1000).toFixed(1)} km</strong></div>
          <div>Attribution: <strong style="color: #34d399;">${(orig.confidence * 100).toFixed(0)}%</strong></div>
        </div>
      `, { className: 'custom-dark-tooltip', sticky: true });
    }

    // 3. Simulated Counterfactual Plume Overlay (Electric Cyan)
    if (layers.counterfactualPlume && simulatedPolygon && simulatedPolygon.length > 0) {
      const simPoly = leaflet.polygon(simulatedPolygon, {
        color: '#06b6d4',
        weight: 3,
        fillColor: '#00d2ff',
        fillOpacity: 0.35,
      }).addTo(layerGroup);

      simPoly.bindTooltip(`
        <div style="background: #06111a; border: 1px solid #06b6d4; padding: 8px 12px; border-radius: 12px; color: white; font-family: monospace; font-size: 11px; box-shadow: 0 0 15px rgba(6,182,212,0.35);">
          <div style="font-weight: 800; color: #38bdf8; margin-bottom: 2px;">🌊 SIMULATED COUNTERFACTUAL PLUME</div>
          <div>Candidate: <strong>${simulatedScenarioVessel?.name || 'Candidate'}</strong></div>
          <div>Overlap: <strong style="color: #34d399;">${simulatedScenarioVessel?.simulatedOverlapIoU || 85}% IoU</strong></div>
        </div>
      `, { className: 'custom-dark-tooltip', sticky: true });
    }

    // 4. Candidate Vessels & Trajectories
    if (layers.vesselTracks) {
      incident.vessels.forEach((vessel) => {
        const isSelected = selectedVessel?.id === vessel.id;
        const color = vessel.rank === 1 ? '#a855f7' : vessel.rank === 2 ? '#06b6d4' : '#10b981';

        // Draw trajectory line
        const latLngs = vessel.trajectory.map(p => [p.lat, p.lng]);
        leaflet.polyline(latLngs, {
          color: color,
          weight: isSelected ? 4.5 : 2.5,
          opacity: isSelected ? 1.0 : 0.7,
          dashArray: vessel.rank > 2 ? '6, 6' : undefined,
        }).addTo(layerGroup);

        // Position corresponding to current rewindHours
        let activePoint = vessel.trajectory[0];
        let minDiff = 999;
        vessel.trajectory.forEach(pt => {
          const diff = Math.abs(Math.abs(pt.timeOffsetHours) - rewindHours);
          if (diff < minDiff) {
            minDiff = diff;
            activePoint = pt;
          }
        });

        // Space Vessel Icon Marker
        const markerHtml = `
          <div style="
            display: flex;
            align-items: center;
            justify-content: center;
            width: 34px;
            height: 34px;
            background: #06141f;
            border: 2.5px solid ${color};
            border-radius: 50%;
            box-shadow: 0 0 16px ${color};
            cursor: pointer;
            transform: rotate(${activePoint.heading || 0}deg);
          ">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="${color}">
              <path d="M12 2L2 22l10-4 10 4z"/>
            </svg>
          </div>
        `;

        const icon = leaflet.divIcon({
          className: 'custom-vessel-marker',
          html: markerHtml,
          iconSize: [34, 34],
          iconAnchor: [17, 17],
        });

        const marker = leaflet.marker([activePoint.lat, activePoint.lng], { icon }).addTo(layerGroup);
        marker.on('click', () => onSelectVessel(vessel));
        marker.bindTooltip(`
          <div style="background: #06111a; border: 1px solid ${color}; padding: 8px 12px; border-radius: 12px; color: white; font-family: monospace; font-size: 11px; box-shadow: 0 0 15px rgba(0,0,0,0.8);">
            <div style="font-weight: 800; color: ${color}; margin-bottom: 2px;">${vessel.name} (Rank #${vessel.rank})</div>
            <div style="color: #94a3b8;">IMO ${vessel.imo} • ${vessel.flag}</div>
            <div style="color: #34d399; font-weight: bold;">Attribution Match: ${vessel.score.overall}%</div>
            <div style="color: #cbd5e1;">Speed: ${activePoint.sog} kn | HDG: ${activePoint.heading}°</div>
          </div>
        `, { className: 'custom-dark-tooltip' });

        // Anomaly Markers
        vessel.trajectory.forEach(pt => {
          if (pt.isAnomalous) {
            const anomalyIcon = leaflet.divIcon({
              className: 'custom-anomaly-marker',
              html: `
                <div style="
                  width: 22px;
                  height: 22px;
                  background: #ef4444;
                  border: 2px solid #ffffff;
                  border-radius: 6px;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  box-shadow: 0 0 14px rgba(239, 68, 68, 0.8);
                ">
                  <span style="color: white; font-size: 12px; font-weight: 900;">!</span>
                </div>
              `,
              iconSize: [22, 22],
              iconAnchor: [11, 11]
            });
            const aMarker = leaflet.marker([pt.lat, pt.lng], { icon: anomalyIcon }).addTo(layerGroup);
            aMarker.bindTooltip(`
              <div style="background: #1c0508; border: 1px solid #ef4444; padding: 8px 12px; border-radius: 12px; color: #fee2e2; font-family: monospace; font-size: 11px; box-shadow: 0 0 15px rgba(239,68,68,0.4);">
                <div style="font-weight: 800; color: #f87171; margin-bottom: 2px;">⚠️ FORENSIC ANOMALY</div>
                <div>${pt.anomalyReason || 'AIS transponder blackout'}</div>
                <div style="color: #94a3b8;">Timeline: ${pt.timestamp}</div>
              </div>
            `, { className: 'custom-dark-tooltip' });
          }
        });
      });
    }

    // 5. Monte Carlo Stochastic Drift Particles (Cyan & Purple Photons)
    if (layers.driftParticles) {
      particles.forEach((p, idx) => {
        const particleMarker = leaflet.circleMarker([p.lat, p.lng], {
          radius: idx % 7 === 0 ? 4 : 2.5,
          color: p.status === 'matched' ? '#a855f7' : '#06b6d4',
          fillColor: p.status === 'matched' ? '#c084fc' : '#22d3ee',
          fillOpacity: 0.85,
          weight: 1,
        }).addTo(layerGroup);

        if (idx % 15 === 0) {
          particleMarker.bindTooltip(`
            <div style="background: #06111a; border: 1px solid #06b6d4; padding: 6px 10px; border-radius: 8px; color: white; font-family: monospace; font-size: 10px;">
              <span style="color: #c084fc; font-weight: bold;">Monte Carlo Particle #${p.id}</span><br/>
              Velocity Perturbation: ${((p.probability || 0.85) * 100).toFixed(0)}%
            </div>
          `, { className: 'custom-dark-tooltip' });
        }
      });
    }

    return () => {
      map.removeLayer(layerGroup);
    };
  }, [incident, layers, rewindHours, selectedVessel, simulatedPolygon, simulatedScenarioVessel]);

  const toggleLayer = (key: keyof typeof layers) => {
    setLayers(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleResetZoom = () => {
    if (leafletMapRef.current) {
      leafletMapRef.current.setView([incident.coordinates.lat, incident.coordinates.lng], 11);
      leafletMapRef.current.invalidateSize();
    }
  };

  return (
    <div className="relative w-full h-full min-h-[560px] bg-[#02070d] rounded-3xl overflow-hidden border border-[#0d2a37] shadow-2xl shadow-cyan-950/30 flex flex-col select-none">
      
      {/* Top Left Coordinates Card (Deep Space Cyber Glassmorphic HUD) */}
      <div className="absolute top-4 left-4 z-[400] flex items-center gap-2">
        <div className="bg-[#040e16]/90 backdrop-blur-md px-4 py-2 rounded-2xl border border-[#0e3344] shadow-xl flex items-center gap-2.5 text-xs font-mono text-slate-200">
          <Radio className="w-4 h-4 text-cyan-400 animate-pulse" />
          <span className="font-extrabold text-white font-sans tracking-wide">OCEAN TACTICAL MAP</span>
          <span className="text-[#15465c]">|</span>
          <span className="font-bold text-cyan-300">{incident.coordinates.lat.toFixed(4)}°N, {incident.coordinates.lng.toFixed(4)}°E</span>
        </div>

        <button
          onClick={handleResetZoom}
          className="bg-[#040e16]/90 backdrop-blur-md p-2.5 rounded-2xl border border-[#0e3344] shadow-xl text-slate-300 hover:text-cyan-300 hover:border-cyan-500/50 transition-all active:scale-95"
          title="Reset Zoom"
        >
          <Maximize2 className="w-4 h-4" />
        </button>

        {/* Space Tactical Basemap Switcher (Dark Navy Space vs Orbital Satellite) */}
        <div className="bg-[#040e16]/90 backdrop-blur-md p-1 rounded-2xl border border-[#0e3344] shadow-xl flex items-center gap-1 text-[11px] font-mono">
          <button
            onClick={() => setBaseMapStyle('dark')}
            className={`px-3 py-1 rounded-xl transition-all font-bold ${
              baseMapStyle === 'dark' 
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-[0_0_12px_rgba(168,85,247,0.4)]' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Tactical Navy
          </button>
          <button
            onClick={() => setBaseMapStyle('satellite')}
            className={`px-3 py-1 rounded-xl transition-all font-bold ${
              baseMapStyle === 'satellite' 
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-[0_0_12px_rgba(168,85,247,0.4)]' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Orbital Satellite
          </button>
        </div>
      </div>

      {/* Top Right Layer Palette Card (Space Glassmorphism) */}
      <div className="absolute top-4 right-4 z-[400] bg-[#040e16]/90 backdrop-blur-md p-4 rounded-3xl border border-[#0e3344] shadow-2xl max-w-xs space-y-2.5 text-slate-100">
        <div className="flex items-center justify-between pb-2 border-b border-[#0f3243] font-mono text-xs font-bold uppercase tracking-wider text-slate-200">
          <div className="flex items-center gap-2 text-purple-400">
            <Layers className="w-4 h-4" />
            <span>Map Layers</span>
          </div>
          <span className="text-[10px] text-purple-300 bg-purple-950/80 px-2 py-0.5 rounded-full font-bold border border-purple-800/80">
            7 Active
          </span>
        </div>

        <div className="space-y-1.5 text-xs font-mono font-medium">
          <label className="flex items-center justify-between cursor-pointer text-slate-200 hover:text-cyan-300 p-1 hover:bg-[#071926] rounded-lg transition-colors">
            <span className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-rose-500 shadow-[0_0_8px_#f43f5e]" />
              <span>Oil Spill Contour</span>
            </span>
            <input 
              type="checkbox" 
              checked={layers.spillPolygon} 
              onChange={() => toggleLayer('spillPolygon')}
              className="accent-purple-500 w-4 h-4 cursor-pointer"
            />
          </label>

          <label className="flex items-center justify-between cursor-pointer text-slate-200 hover:text-cyan-300 p-1 hover:bg-[#071926] rounded-lg transition-colors">
            <span className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-purple-500 shadow-[0_0_8px_#a855f7]" />
              <span>Origin Probability</span>
            </span>
            <input 
              type="checkbox" 
              checked={layers.originEllipse} 
              onChange={() => toggleLayer('originEllipse')}
              className="accent-purple-500 w-4 h-4 cursor-pointer"
            />
          </label>

          <label className="flex items-center justify-between cursor-pointer text-slate-200 hover:text-cyan-300 p-1 hover:bg-[#071926] rounded-lg transition-colors">
            <span className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-cyan-400 shadow-[0_0_8px_#06b6d4]" />
              <span>Counterfactual Plume</span>
            </span>
            <input 
              type="checkbox" 
              checked={layers.counterfactualPlume} 
              onChange={() => toggleLayer('counterfactualPlume')}
              className="accent-purple-500 w-4 h-4 cursor-pointer"
            />
          </label>

          <label className="flex items-center justify-between cursor-pointer text-slate-200 hover:text-cyan-300 p-1 hover:bg-[#071926] rounded-lg transition-colors">
            <span className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-amber-400 shadow-[0_0_8px_#f59e0b]" />
              <span>AIS Vessel Tracks</span>
            </span>
            <input 
              type="checkbox" 
              checked={layers.vesselTracks} 
              onChange={() => toggleLayer('vesselTracks')}
              className="accent-purple-500 w-4 h-4 cursor-pointer"
            />
          </label>
        </div>

        {/* Environmental Mini Readout */}
        <div className="pt-2 border-t border-[#0f3243] text-[11px] font-mono text-slate-400 space-y-1">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-slate-400">
              <Wind className="w-3.5 h-3.5 text-cyan-400" /> Wind:
            </span>
            <span className="text-white font-bold">{incident.windSpeedKnots} kn @ {incident.windDirectionDeg}°</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-slate-400">
              <Compass className="w-3.5 h-3.5 text-emerald-400" /> Current:
            </span>
            <span className="text-white font-bold">{incident.currentKnots} kn @ {incident.currentDirectionDeg}°</span>
          </div>
        </div>
      </div>

      {/* Main Map Canvas - Must have 100% height */}
      <div 
        ref={mapContainerRef} 
        className="w-full h-full flex-1 z-10 min-h-[560px]"
        style={{ minHeight: '560px', height: '100%' }}
      />

      {/* Bottom Bar Info HUD */}
      <div className="absolute bottom-4 left-4 z-[400] bg-[#040e16]/90 backdrop-blur-md px-4 py-2 rounded-2xl border border-[#0e3344] shadow-xl text-xs font-mono text-slate-300 flex items-center gap-3">
        <span className="flex items-center gap-1.5 font-bold text-purple-400">
          <Shield className="w-4 h-4 text-purple-400" /> SIH26143 / NTRO TACTICAL GRID
        </span>
        <span className="text-slate-600">•</span>
        <span>Reconstructed Time: <strong className="text-cyan-300">T-{rewindHours.toFixed(1)}h</strong></span>
      </div>

    </div>
  );
};
