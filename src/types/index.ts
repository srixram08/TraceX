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

// ==========================================
// TRACEX 2.0 STRATEGIC PIVOT INTERFACES
// ==========================================

export type HypothesisStatus = 'UNDER_TESTING' | 'SUPPORTED' | 'FALSIFIED';

export interface ForensicHypothesis {
  id: string;
  code: string; // H1, H2, H3, H4
  title: string;
  targetName: string;
  type: 'VESSEL_DISCHARGE' | 'IN_TRANSIT_OFFLOAD' | 'SUBSEA_INFRASTRUCTURE' | 'NATURAL_BIOGENIC';
  description: string;
  posteriorProbability: number; // e.g. 0.84
  status: HypothesisStatus;
  falsificationReason?: string;
  supportingEvidenceCount: number;
  contradictoryEvidenceCount: number;
  physicsConstraintScore: number; // 0-100%
}

export interface DualEvidenceItem {
  id: string;
  category: 'Spatial' | 'Temporal' | 'Kinematics' | 'Monte Carlo' | 'Centroid' | 'Plume Axis' | 'Draft Match';
  metric: string;
  value: string;
  impactWeight: number; // 0 to 1
  detail: string;
  isFalsificationCriterion?: boolean;
}

export interface DualEvidenceLedger {
  supporting: DualEvidenceItem[]; // E+
  contradictory: DualEvidenceItem[]; // E-
}

export interface MonteCarloEnsembleConfig {
  iterations: number; // e.g. 500
  currentPerturbationPct: number; // e.g. 20 (±20%)
  windLeewayPct: number; // e.g. 2.5 (1-4%)
  timeWindowVarianceHours: number; // e.g. 2 (±2h)
}

export interface MonteCarloResult {
  totalRuns: number;
  successfulHits: number;
  ensembleOverlapPct: number; // e.g. 68.4%
  robustnessEnvelopeIoU: number; // e.g. 0.76
  dispersionRadiusKm: number; // e.g. 4.2 km
  centroidShiftKm: number; // e.g. 2.4 km
}

export interface EcologicalImpactAsset {
  id: string;
  name: string;
  type: 'MARINE_PROTECTED_AREA' | 'CORAL_REEF' | 'FISHERY_ZONE' | 'DESALINATION_PLANT' | 'COASTAL_PORT';
  coordinates: { lat: number; lng: number };
  distanceKm: number;
  timeToImpactHours: number;
  riskSeverity: 'CRITICAL' | 'HIGH' | 'MODERATE' | 'LOW';
  economicValueUsd: string;
}

export interface ForwardRiskProjection {
  forecastHours: 6 | 12 | 24 | 48;
  projectedAreaKm2: number;
  driftDirectionDeg: number;
  driftSpeedKnots: number;
  impactAssets: EcologicalImpactAsset[];
  coastalThreatLevel: 'HIGH_ALERT' | 'MONITORED' | 'SAFE';
}

export interface CryptographicProvenance {
  sarSceneHashSHA256: string;
  aisIngestionHashSHA256: string;
  oceanicModelSliceHash: string;
  modelWeightsSeed: string;
  merkleRootHash: string;
  generatedTimestamp: string;
  blockchainVerificationUrl: string;
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
  
  // TraceX 2.0 Additions
  hypotheses?: ForensicHypothesis[];
  dualLedger?: DualEvidenceLedger;
  monteCarlo?: MonteCarloResult;
  forwardRisk?: ForwardRiskProjection;
  provenance?: CryptographicProvenance;
}
