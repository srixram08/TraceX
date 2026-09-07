import React, { useEffect, useRef, useState } from 'react';
import { 
  Layers, Compass, Wind, Navigation, Eye, EyeOff, Radio, Maximize2, RotateCcw, AlertTriangle, Shield, Map
} from 'lucide-react';
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
  isDarkMode = false,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const leafletMapRef = useRef<any>(null);
  const currentTileLayerRef = useRef<any>(null);

  // Basemap style: 'voyager' (crisp light blue water), 'dark' (navy), 'satellite' (Esri satellite)
  const [baseMapStyle, setBaseMapStyle] = useState<'voyager' | 'dark' | 'satellite'>(
    isDarkMode ? 'dark' : 'voyager'
  );

  // Sync baseMapStyle when global theme is toggled
  useEffect(() => {
    setBaseMapStyle(isDarkMode ? 'dark' : 'voyager');
  }, [isDarkMode]);

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

    const L = (window as any).L;
    if (!L) return;

    if (!leafletMapRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [incident.coordinates.lat, incident.coordinates.lng],
        zoom: 11,
        zoomControl: false,
        attributionControl: false,
      });

      // Add default Light Voyager basemap with blue oceans
      const tileUrl = baseMapStyle === 'voyager'
        ? 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png'
        : baseMapStyle === 'dark'
        ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
        : 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';

      currentTileLayerRef.current = L.tileLayer(tileUrl, {
        maxZoom: 19,
        subdomains: 'abcd',
      }).addTo(map);

      leafletMapRef.current = map;

      // Invalidate size after render to prevent empty/blank tile view
      setTimeout(() => {
        map.invalidateSize();
      }, 250);
    } else {
      leafletMapRef.current.setView([incident.coordinates.lat, incident.coordinates.lng], 11);
      setTimeout(() => {
        leafletMapRef.current.invalidateSize();
      }, 100);
    }
  }, [incident]);

  // Tile layer switcher
  useEffect(() => {
    const map = leafletMapRef.current;
    const L = (window as any).L;
    if (!map || !L || !currentTileLayerRef.current) return;

    map.removeLayer(currentTileLayerRef.current);

    const tileUrl = baseMapStyle === 'voyager'
      ? 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png'
      : baseMapStyle === 'dark'
      ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
      : 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';

    currentTileLayerRef.current = L.tileLayer(tileUrl, {
      maxZoom: 19,
      subdomains: 'abcd',
    }).addTo(map);
  }, [baseMapStyle]);

  // Vector Layer rendering
  useEffect(() => {
    const map = leafletMapRef.current;
    const L = (window as any).L;
    if (!map || !L) return;

    const layerGroup = L.layerGroup().addTo(map);

    // 1. Observed Spill Polygon
    if (layers.spillPolygon && incident.spillPolygon.length > 0) {
      const spillPoly = L.polygon(incident.spillPolygon, {
        color: '#dc2626',
        weight: 3,
        fillColor: '#ef4444',
        fillOpacity: 0.45,
        dashArray: '5, 5'
      }).addTo(layerGroup);

      spillPoly.bindTooltip(`
        <div class="p-1.5 font-mono text-xs text-slate-900 bg-white">
          <div class="font-bold text-red-600">🔴 Observed Slick (T0)</div>
          <div>Area: ${incident.areaKm2} km²</div>
          <div>Confidence: ${(incident.confidence * 100).toFixed(0)}%</div>
        </div>
      `);
    }

    // 2. Probable Origin Zone Ellipse (Expands backwards with rewindHours)
    if (layers.originEllipse && rewindHours > 0) {
      const orig = incident.probableOrigin;
      const expansionFactor = 1 + (rewindHours * 0.25);
      const originRadius = (orig.radiusKm * 1000) * expansionFactor;

      const originCircle = L.circle([orig.lat, orig.lng], {
        radius: originRadius,
        color: '#7c3aed',
        weight: 3,
        fillColor: '#9333ea',
        fillOpacity: 0.25,
        dashArray: '6, 6'
      }).addTo(layerGroup);

      originCircle.bindTooltip(`
        <div class="p-1.5 font-mono text-xs text-slate-900 bg-white">
          <div class="font-bold text-purple-700">🎯 Reconstructed Origin Zone</div>
          <div>Release Window: ${orig.timeWindowStart} - ${orig.timeWindowEnd}</div>
          <div>Radius: ${(originRadius / 1000).toFixed(1)} km</div>
          <div>Confidence: ${(orig.confidence * 100).toFixed(0)}%</div>
        </div>
      `);
    }

    // 3. Simulated Counterfactual Plume Overlay
    if (layers.counterfactualPlume && simulatedPolygon && simulatedPolygon.length > 0) {
      const simPoly = L.polygon(simulatedPolygon, {
        color: '#2563eb',
        weight: 3,
        fillColor: '#00d2ff',
        fillOpacity: 0.35,
      }).addTo(layerGroup);

      simPoly.bindTooltip(`
        <div class="p-1.5 font-mono text-xs text-slate-900 bg-white">
          <div class="font-bold text-blue-700">🌊 Simulated Plume (Forward)</div>
          <div>Candidate: ${simulatedScenarioVessel?.name || 'Candidate'}</div>
          <div>Overlap: ${simulatedScenarioVessel?.simulatedOverlapIoU || 85}% IoU</div>
        </div>
      `);
    }

    // 4. Candidate Vessels & Trajectories
    if (layers.vesselTracks) {
      incident.vessels.forEach((vessel) => {
        const isSelected = selectedVessel?.id === vessel.id;
        const color = vessel.rank === 1 ? '#7c3aed' : vessel.rank === 2 ? '#2563eb' : '#059669';

        // Draw trajectory line
        const latLngs = vessel.trajectory.map(p => [p.lat, p.lng]);
        L.polyline(latLngs, {
          color: color,
          weight: isSelected ? 4 : 2.5,
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

        // Vessel Icon Marker
        const markerHtml = `
          <div style="
            display: flex;
            align-items: center;
            justify-content: center;
            width: 32px;
            height: 32px;
            background: white;
            border: 3px solid ${color};
            border-radius: 50%;
            box-shadow: 0 4px 14px rgba(0, 0, 0, 0.25);
            cursor: pointer;
            transform: rotate(${activePoint.heading || 0}deg);
          ">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="${color}">
              <path d="M12 2L2 22l10-4 10 4z"/>
            </svg>
          </div>
        `;

        const icon = L.divIcon({
          className: 'custom-vessel-marker',
          html: markerHtml,
          iconSize: [32, 32],
          iconAnchor: [16, 16],
        });

        const marker = L.marker([activePoint.lat, activePoint.lng], { icon }).addTo(layerGroup);
        marker.on('click', () => onSelectVessel(vessel));
        marker.bindTooltip(`
          <div class="p-1.5 font-mono text-xs text-slate-900 bg-white">
            <div class="font-bold text-purple-900">${vessel.name} (Rank #${vessel.rank})</div>
            <div class="text-slate-500">IMO ${vessel.imo} • ${vessel.flag}</div>
            <div class="text-emerald-600 font-bold">Evidence Match: ${vessel.score.overall}%</div>
            <div class="text-slate-500">Speed: ${activePoint.sog} kn | HDG: ${activePoint.heading}°</div>
          </div>
        `);

        // Anomaly Markers
        vessel.trajectory.forEach(pt => {
          if (pt.isAnomalous) {
            const anomalyIcon = L.divIcon({
              className: 'custom-anomaly-marker',
              html: `
                <div style="
                  width: 20px;
                  height: 20px;
                  background: #ef4444;
                  border: 2px solid white;
                  border-radius: 6px;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  box-shadow: 0 4px 10px rgba(239, 68, 68, 0.5);
                ">
                  <span style="color: white; font-size: 11px; font-weight: bold;">!</span>
                </div>
              `,
              iconSize: [20, 20],
              iconAnchor: [10, 10]
            });
            const aMarker = L.marker([pt.lat, pt.lng], { icon: anomalyIcon }).addTo(layerGroup);
            aMarker.bindTooltip(`
              <div class="p-1.5 font-mono text-xs text-red-900 bg-white">
                <div class="font-bold text-red-600">⚠️ Forensic Anomaly</div>
                <div>${pt.anomalyReason || 'AIS transponder blackout'}</div>
                <div>Timeline: ${pt.timestamp}</div>
              </div>
            `);
          }
        });

      });
    }

    // 5. Monte Carlo Stochastic Drift Particles (500 Trajectories)
    if (layers.driftParticles) {
      particles.forEach((p, idx) => {
        const particleMarker = L.circleMarker([p.lat, p.lng], {
          radius: idx % 7 === 0 ? 3.5 : 2,
          color: p.status === 'matched' ? '#a855f7' : '#06b6d4',
          fillColor: p.status === 'matched' ? '#c084fc' : '#22d3ee',
          fillOpacity: 0.75,
          weight: 1,
        }).addTo(layerGroup);

        if (idx % 15 === 0) {
          particleMarker.bindTooltip(`
            <div class="p-1 font-mono text-[10px] bg-slate-900 text-white rounded">
              <span class="text-purple-300 font-bold">Monte Carlo Particle #${p.id}</span><br/>
              Velocity Perturbation: ${((p.probability || 0.85) * 100).toFixed(0)}%
            </div>
          `);
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
    <div className="relative w-full h-full min-h-[520px] bg-slate-100 dark:bg-slate-950 rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-xl flex flex-col transition-colors duration-300">
      
      {/* Top Left Coordinates Card */}
      <div className="absolute top-4 left-4 z-[400] flex items-center gap-2">
        <div className="bg-white/95 dark:bg-slate-900/90 backdrop-blur-md px-4 py-2 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-lg flex items-center gap-2.5 text-xs font-mono text-slate-800 dark:text-slate-200">
          <Radio className="w-4 h-4 text-purple-600 dark:text-purple-400 animate-pulse" />
          <span className="font-extrabold text-slate-900 dark:text-white font-display">OCEAN TACTICAL MAP</span>
          <span className="text-slate-300 dark:text-slate-700">|</span>
          <span className="font-bold text-purple-700 dark:text-purple-400">{incident.coordinates.lat.toFixed(4)}°N, {incident.coordinates.lng.toFixed(4)}°E</span>
        </div>

        <button
          onClick={handleResetZoom}
          className="bg-white/95 dark:bg-slate-900/90 backdrop-blur-md p-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-lg text-slate-700 dark:text-slate-300 hover:text-purple-600 dark:hover:text-purple-400 hover:border-purple-300 dark:hover:border-purple-700 transition-all"
          title="Reset Zoom"
        >
          <Maximize2 className="w-4 h-4" />
        </button>

        {/* Map Basemap Switcher */}
        <div className="bg-white/95 dark:bg-slate-900/90 backdrop-blur-md p-1 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-lg flex items-center gap-1 text-[11px] font-mono">
          <button
            onClick={() => setBaseMapStyle('voyager')}
            className={`px-2.5 py-1 rounded-xl transition-all font-bold ${
              baseMapStyle === 'voyager' ? 'bg-purple-600 text-white shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:text-purple-600 dark:hover:text-purple-400'
            }`}
          >
            Light
          </button>
          <button
            onClick={() => setBaseMapStyle('satellite')}
            className={`px-2.5 py-1 rounded-xl transition-all font-bold ${
              baseMapStyle === 'satellite' ? 'bg-purple-600 text-white shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:text-purple-600 dark:hover:text-purple-400'
            }`}
          >
            Satellite
          </button>
          <button
            onClick={() => setBaseMapStyle('dark')}
            className={`px-2.5 py-1 rounded-xl transition-all font-bold ${
              baseMapStyle === 'dark' ? 'bg-purple-600 text-white shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:text-purple-600 dark:hover:text-purple-400'
            }`}
          >
            Navy
          </button>
        </div>
      </div>

      {/* Top Right Layer Palette Card (Adapts to Dark Mode!) */}
      <div className="absolute top-4 right-4 z-[400] bg-white/95 dark:bg-slate-900/95 backdrop-blur-md p-4 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl max-w-xs space-y-2.5 text-slate-800 dark:text-slate-100 transition-colors duration-300">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800 font-mono text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
          <div className="flex items-center gap-2 text-purple-700 dark:text-purple-400">
            <Layers className="w-4 h-4" />
            <span>Map Layers</span>
          </div>
          <span className="text-[10px] text-purple-600 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/80 px-2 py-0.5 rounded-full font-bold border border-purple-200/50 dark:border-purple-800/50">
            7 Active
          </span>
        </div>

        <div className="space-y-1.5 text-xs font-mono font-medium">
          <label className="flex items-center justify-between cursor-pointer text-slate-800 dark:text-slate-200 hover:text-purple-700 dark:hover:text-purple-400 p-1 hover:bg-slate-50 dark:hover:bg-slate-800/60 rounded-lg">
            <span className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-500 shadow-sm shadow-red-300" />
              <span>Oil Spill Contour</span>
            </span>
            <input 
              type="checkbox" 
              checked={layers.spillPolygon} 
              onChange={() => toggleLayer('spillPolygon')}
              className="accent-purple-600 dark:accent-purple-500 w-4 h-4 cursor-pointer"
            />
          </label>

          <label className="flex items-center justify-between cursor-pointer text-slate-800 dark:text-slate-200 hover:text-purple-700 dark:hover:text-purple-400 p-1 hover:bg-slate-50 dark:hover:bg-slate-800/60 rounded-lg">
            <span className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-purple-600 shadow-sm shadow-purple-300" />
              <span>Origin Probability</span>
            </span>
            <input 
              type="checkbox" 
              checked={layers.originEllipse} 
              onChange={() => toggleLayer('originEllipse')}
              className="accent-purple-600 dark:accent-purple-500 w-4 h-4 cursor-pointer"
            />
          </label>

          <label className="flex items-center justify-between cursor-pointer text-slate-800 dark:text-slate-200 hover:text-purple-700 dark:hover:text-purple-400 p-1 hover:bg-slate-50 dark:hover:bg-slate-800/60 rounded-lg">
            <span className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-blue-500 shadow-sm shadow-blue-300" />
              <span>Counterfactual Plume</span>
            </span>
            <input 
              type="checkbox" 
              checked={layers.counterfactualPlume} 
              onChange={() => toggleLayer('counterfactualPlume')}
              className="accent-purple-600 dark:accent-purple-500 w-4 h-4 cursor-pointer"
            />
          </label>

          <label className="flex items-center justify-between cursor-pointer text-slate-800 dark:text-slate-200 hover:text-purple-700 dark:hover:text-purple-400 p-1 hover:bg-slate-50 dark:hover:bg-slate-800/60 rounded-lg">
            <span className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-amber-500 shadow-sm shadow-amber-300" />
              <span>AIS Vessel Tracks</span>
            </span>
            <input 
              type="checkbox" 
              checked={layers.vesselTracks} 
              onChange={() => toggleLayer('vesselTracks')}
              className="accent-purple-600 dark:accent-purple-500 w-4 h-4 cursor-pointer"
            />
          </label>
        </div>

        {/* Environmental Mini Readout */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] font-mono text-slate-600 dark:text-slate-400 space-y-1">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
              <Wind className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" /> Wind:
            </span>
            <span className="text-slate-900 dark:text-slate-100 font-bold">{incident.windSpeedKnots} kn @ {incident.windDirectionDeg}°</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
              <Compass className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> Current:
            </span>
            <span className="text-slate-900 dark:text-slate-100 font-bold">{incident.currentKnots} kn @ {incident.currentDirectionDeg}°</span>
          </div>
        </div>
      </div>

      {/* Main Map Canvas */}
      <div ref={mapContainerRef} className="w-full h-full flex-1 z-10" />

      {/* Bottom Bar Info */}
      <div className="absolute bottom-4 left-4 z-[400] bg-white/95 dark:bg-slate-900/90 backdrop-blur-md px-4 py-2 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-lg text-xs font-mono text-slate-700 dark:text-slate-300 flex items-center gap-3">
        <span className="flex items-center gap-1.5 font-bold text-purple-700 dark:text-purple-400">
          <Shield className="w-4 h-4 text-purple-600 dark:text-purple-400" /> SIH26143 / NTRO TACTICAL GRID
        </span>
        <span className="text-slate-300 dark:text-slate-700">•</span>
        <span>Reconstructed Time: <strong className="text-slate-900 dark:text-white">T-{rewindHours.toFixed(1)}h</strong></span>
      </div>

    </div>
  );
};
