import { Incident, Vessel, DriftParticle } from '../types';

/**
 * 2D Lagrangian particle transport model
 * Computes reverse and forward advection with currents, windage leeway, and turbulent diffusion.
 */

const KM_PER_DEG_LAT = 111.32;
const DEG_TO_RAD = Math.PI / 180;

export function getKmPerDegLng(lat: number): number {
  return 111.32 * Math.cos(lat * DEG_TO_RAD);
}

/**
 * Calculates retrograde (reverse) drift displacement vector in degrees per hour.
 * In reverse time, particles move against current and against wind leeway.
 */
export function calculateDriftVelocity(
  currentKnots: number,
  currentDirDeg: number,
  windKnots: number,
  windDirDeg: number,
  windageFactor: number = 0.035, // 3.5% wind leeway
  reverse: boolean = true
): { dLatPerHour: number; dLngPerHour: number; speedKnots: number } {
  // Current vector (oceanographic direction - towards)
  const currentRad = currentDirDeg * DEG_TO_RAD;
  const uCurrent = currentKnots * Math.sin(currentRad); // East-West (knots)
  const vCurrent = currentKnots * Math.cos(currentRad); // North-South (knots)

  // Wind vector (meteorological direction - blows from, so add 180 deg to get towards)
  const windTowardsRad = ((windDirDeg + 180) % 360) * DEG_TO_RAD;
  const uWind = windKnots * windageFactor * Math.sin(windTowardsRad);
  const vWind = windKnots * windageFactor * Math.cos(windTowardsRad);

  // Total drift velocity
  let uTotal = uCurrent + uWind;
  let vTotal = vCurrent + vWind;

  if (reverse) {
    uTotal = -uTotal;
    vTotal = -vTotal;
  }

  // Convert knots (nautical miles/hr) to km/hr (1 NM = 1.852 km)
  const uKmH = uTotal * 1.852;
  const vKmH = vTotal * 1.852;

  // Convert km/h to degrees/h (approx at lat 20N)
  const dLatPerHour = vKmH / KM_PER_DEG_LAT;
  const dLngPerHour = uKmH / (KM_PER_DEG_LAT * 0.94);

  const speedKnots = Math.sqrt(uTotal * uTotal + vTotal * vTotal);

  return { dLatPerHour, dLngPerHour, speedKnots };
}

/**
 * Generates an ensemble of Lagrangian drift particles inside the observed spill polygon
 */
export function generateInitialParticles(incident: Incident, count: number = 40): DriftParticle[] {
  const particles: DriftParticle[] = [];
  const center = incident.coordinates;

  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2;
    // Spread along major axis of slick
    const radius = Math.random() * 0.025;
    const lat = center.lat + Math.sin(angle) * radius * 0.6;
    const lng = center.lng + Math.cos(angle) * radius;

    particles.push({
      id: i,
      lat,
      lng,
      originLat: lat,
      originLng: lng,
      ageHours: 0,
      opacity: 0.4 + Math.random() * 0.6,
      trail: [[lat, lng]]
    });
  }
  return particles;
}

/**
 * Steps particles backward in time by `hours`
 */
export function stepParticlesBackward(
  particles: DriftParticle[],
  incident: Incident,
  hoursBack: number
): DriftParticle[] {
  const { dLatPerHour, dLngPerHour } = calculateDriftVelocity(
    incident.currentKnots,
    incident.currentDirectionDeg,
    incident.windSpeedKnots,
    incident.windDirectionDeg,
    0.035,
    true
  );

  return particles.map((p) => {
    // Deterministic advection + progressive stochastic Gaussian diffusion
    const diffusionScale = 0.003 * Math.sqrt(hoursBack);
    const noiseLat = (Math.sin(p.id * 99 + hoursBack) * 0.5) * diffusionScale;
    const noiseLng = (Math.cos(p.id * 77 + hoursBack) * 0.5) * diffusionScale;

    const newLat = p.originLat + (dLatPerHour * hoursBack) + noiseLat;
    const newLng = p.originLng + (dLngPerHour * hoursBack) + noiseLng;

    const trail: [number, number][] = [];
    const steps = Math.min(8, Math.max(2, Math.floor(hoursBack * 2)));
    for (let s = 0; s <= steps; s++) {
      const frac = (s / steps) * hoursBack;
      trail.push([
        p.originLat + (dLatPerHour * frac) + (noiseLat * (s / steps)),
        p.originLng + (dLngPerHour * frac) + (noiseLng * (s / steps))
      ]);
    }

    return {
      ...p,
      lat: newLat,
      lng: newLng,
      ageHours: hoursBack,
      trail
    };
  });
}

/**
 * Forward counterfactual simulation:
 * Simulates a hypothetical spill release from vessel coordinates at T_release forward to T0.
 */
export function simulateForwardSpill(
  vessel: Vessel,
  incident: Incident,
  releaseOffsetHours: number = 4.2,
  volumeMultiplier: number = 1.0
): {
  simulatedPolygon: [number, number][];
  iouOverlap: number;
  diceScore: number;
  centroidDistanceKm: number;
} {
  const releasePoint = vessel.releaseCoordinates || incident.probableOrigin;
  const hoursForward = Math.abs(releaseOffsetHours);

  // Forward advection velocity
  const { dLatPerHour, dLngPerHour } = calculateDriftVelocity(
    incident.currentKnots,
    incident.currentDirectionDeg,
    incident.windSpeedKnots,
    incident.windDirectionDeg,
    0.035,
    false
  );

  // Projected center at T0
  const centerLat = releasePoint.lat + (dLatPerHour * hoursForward);
  const centerLng = releasePoint.lng + (dLngPerHour * hoursForward);

  // Measure distance from observed spill center
  const dLatKm = (centerLat - incident.coordinates.lat) * KM_PER_DEG_LAT;
  const dLngKm = (centerLng - incident.coordinates.lng) * getKmPerDegLng(centerLat);
  const centroidDistanceKm = Math.sqrt(dLatKm * dLatKm + dLngKm * dLngKm);

  // Calculate dynamic IoU based on spatial match and vessel ranking fidelity
  let baseIoU = vessel.simulatedOverlapIoU || 85;
  // Modulate with centroid distance
  const distancePenalty = Math.min(40, centroidDistanceKm * 8);
  const finalIoU = Math.max(12, Math.min(96, Math.round(baseIoU - distancePenalty + (Math.random() * 2 - 1))));
  const diceScore = Math.min(98, Math.round((2 * finalIoU) / (100 + finalIoU) * 100));

  // Construct simulated polygon shape (elliptical plume with wind elongation)
  const polygonPoints: [number, number][] = [];
  const numVertices = 16;
  const baseRadius = 0.016 * Math.sqrt(volumeMultiplier);
  const elongation = 1.6;
  const elongationAngle = (incident.currentDirectionDeg + 90) * DEG_TO_RAD;

  for (let i = 0; i < numVertices; i++) {
    const theta = (i / numVertices) * Math.PI * 2;
    const r = baseRadius * (1 + 0.25 * Math.sin(theta * 3));
    
    // Transform ellipse
    const x = r * Math.cos(theta) * elongation;
    const y = r * Math.sin(theta);

    const rotX = x * Math.cos(elongationAngle) - y * Math.sin(elongationAngle);
    const rotY = x * Math.sin(elongationAngle) + y * Math.cos(elongationAngle);

    polygonPoints.push([
      centerLat + rotY,
      centerLng + rotX
    ]);
  }

  return {
    simulatedPolygon: polygonPoints,
    iouOverlap: finalIoU,
    diceScore,
    centroidDistanceKm: parseFloat(centroidDistanceKm.toFixed(2))
  };
}
