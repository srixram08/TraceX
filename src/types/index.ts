export type ViewMode = 'landing' | 'login' | 'dashboard';

export interface AISPoint {
  lat: number;
  lng: number;
  timestamp: string; // ISO or relative (e.g. 'T-0h', 'T-2h')
  timeOffsetHours: number; // 0 for T0, -2 for T-2h
  sog: number; // Knots
  cog: number; // Degrees
  heading: number;
  navStatus: string;
  isAnomalous?: boolean;
  anomalyReason?: string;
}

export interface VesselScore {
  overall: number;
  spatial: number;
  temporal: number;
  trajectory: number;
  heading: number;
  drift: number;
}

export interface Vessel {
  id: string;
  name: string;
  imo: string;
  mmsi: string;
  flag: string;
  flagCode: string;
  type: string;
  dwt: number;
  draft: number;
  length: number;
  beam: number;
  originPort: string;
  destinationPort: string;
  cargoType: string;
  rank: number;
  score: VesselScore;
  simulatedOverlapIoU: number;
  status: 'HIGH_PROBABILITY' | 'MODERATE' | 'LOW_PROBABILITY' | 'EXCLUDED';
  trajectory: AISPoint[];
  anomalyFlags: string[];
  explainableInsights: string[];
  estimatedReleaseTime: string;
  estimatedReleaseOffsetHours: number;
  releaseCoordinates: { lat: number; lng: number };
  color: string;
}

export interface ProbableOrigin {
  lat: number;
  lng: number;
  radiusKm: number;
  timeWindowStart: string;
  timeWindowEnd: string;
  estimatedReleaseOffsetHours: number;
  confidence: number;
  uncertaintyLatKm: number;
  uncertaintyLngKm: number;
}

export interface Incident {
  id: string;
  caseNumber: string;
  title: string;
  region: string;
  coordinates: { lat: number; lng: number };
  detectionTimestamp: string;
  sensor: string;
  polarization: string;
  resolutionMeters: number;
  areaKm2: number;
  estimatedVolumeM3: number;
  confidence: number;
  status: 'ACTIVE_INVESTIGATION' | 'VERIFIED' | 'ARCHIVED' | 'ESCALATED';
  windSpeedKnots: number;
  windDirectionDeg: number;
  currentKnots: number;
  currentDirectionDeg: number;
  waveHeightMeters: number;
  sstDegC: number;
  bathymetryMeters: number;
  probableOrigin: ProbableOrigin;
  spillPolygon: [number, number][]; // LatLng array
  vessels: Vessel[];
  description: string;
}

export interface DriftParticle {
  id: number;
  lat: number;
  lng: number;
  originLat: number;
  originLng: number;
  ageHours: number;
  opacity: number;
  trail: [number, number][];
}

export interface EvidenceGraphNode {
  id: string;
  label: string;
  category: 'spill' | 'origin' | 'environment' | 'vessel' | 'anomaly' | 'forensic';
  confidence?: number;
  meta?: string;
  x?: number;
  y?: number;
}

export interface EvidenceGraphLink {
  source: string;
  target: string;
  label: string;
  weight: number;
}
