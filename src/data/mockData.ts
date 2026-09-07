import { Incident } from '../types';

export const mockIncidents: Incident[] = [
  {
    id: 'inc-042',
    caseNumber: 'SLK-042',
    title: 'Arabian Sea Crude Discharge Incident',
    region: 'Arabian Sea (Sector Gujarat EEZ - 64 NM Offshore)',
    coordinates: { lat: 20.8421, lng: 69.4128 },
    detectionTimestamp: '2026-09-04 06:30 UTC',
    sensor: 'Sentinel-1 C-SAR Dual-Pol',
    polarization: 'VV / VH Cross-Polarized',
    resolutionMeters: 10,
    areaKm2: 18.64,
    estimatedVolumeM3: 425.0,
    confidence: 0.95,
    status: 'ACTIVE_INVESTIGATION',
    windSpeedKnots: 12.4,
    windDirectionDeg: 235, // SW
    currentKnots: 1.42,
    currentDirectionDeg: 62, // ENE
    waveHeightMeters: 1.8,
    sstDegC: 28.4,
    bathymetryMeters: -142,
    description: 'Dark-spot dielectric slick signature identified via Sentinel-1 SAR interferometry. Multi-spectral verification reveals medium-to-heavy crude oil with active emulsification plume extending 7.2 km along current vectors.',
    probableOrigin: {
      lat: 20.7612,
      lng: 69.2894,
      radiusKm: 3.4,
      timeWindowStart: '02:00 UTC',
      timeWindowEnd: '03:15 UTC',
      estimatedReleaseOffsetHours: 4.2,
      confidence: 0.92,
      uncertaintyLatKm: 1.2,
      uncertaintyLngKm: 1.6
    },
    spillPolygon: [
      [20.858, 69.398],
      [20.865, 69.421],
      [20.849, 69.442],
      [20.832, 69.431],
      [20.825, 69.405],
      [20.839, 69.388]
    ],
    vessels: [
      {
        id: 'v-001',
        name: 'MV Neptune Voyager',
        imo: '9482718',
        mmsi: '538009214',
        flag: 'Marshall Islands',
        flagCode: 'MH',
        type: 'Crude Oil Tanker (Aframax)',
        dwt: 114800,
        draft: 14.8,
        length: 244,
        beam: 42,
        originPort: 'Fujairah Anchorage (AE)',
        destinationPort: 'Vadinar Port (IN)',
        cargoType: 'Heavy Arabian Light Crude',
        rank: 1,
        score: {
          overall: 89,
          spatial: 94,
          temporal: 91,
          trajectory: 87,
          heading: 82,
          drift: 93
        },
        simulatedOverlapIoU: 91.4,
        status: 'HIGH_PROBABILITY',
        anomalyFlags: [
          'Unexplained speed drop (14.2 kn → 4.1 kn) inside origin ellipse',
          'AIS Transponder gap for 47 minutes during estimated release window',
          'Course altered 38° right before entering probable origin zone',
          'Ballast tank cleaning telemetry anomaly detected via port pre-arrival log'
        ],
        explainableInsights: [
          'Passed within 0.8 km of reconstructed Lagrangian reverse-drift origin centroid.',
          'Arrival at origin matches estimated release window (02:15–02:50 UTC, T-4.2h) with 91% temporal precision.',
          'Heading was directly parallel (68°) with hydrodynamic slick dispersion vector.',
          'Vessel decelerated and maintained drift state for 47 minutes without declared mechanical distress.',
          'Forward counterfactual simulation yields a 91.4% spatial IoU overlap against observed Sentinel-1 SAR mask.'
        ],
        estimatedReleaseTime: '02:32 UTC (T-4h 10m)',
        estimatedReleaseOffsetHours: -4.17,
        releaseCoordinates: { lat: 20.7635, lng: 69.2912 },
        color: '#ef4444',
        trajectory: [
          { lat: 20.620, lng: 69.110, timestamp: 'T-6h (00:30 UTC)', timeOffsetHours: -6, sog: 14.5, cog: 55, heading: 56, navStatus: 'Underway using Engine' },
          { lat: 20.690, lng: 69.200, timestamp: 'T-5h (01:30 UTC)', timeOffsetHours: -5, sog: 14.1, cog: 54, heading: 55, navStatus: 'Underway using Engine' },
          { lat: 20.760, lng: 69.288, timestamp: 'T-4h (02:30 UTC)', timeOffsetHours: -4, sog: 4.1, cog: 68, heading: 70, navStatus: 'Restricted Manoeuvrability', isAnomalous: true, anomalyReason: 'AIS transmission drop + speed anomaly' },
          { lat: 20.795, lng: 69.340, timestamp: 'T-3h (03:30 UTC)', timeOffsetHours: -3, sog: 6.8, cog: 60, heading: 62, navStatus: 'Underway using Engine' },
          { lat: 20.880, lng: 69.450, timestamp: 'T-2h (04:30 UTC)', timeOffsetHours: -2, sog: 13.8, cog: 58, heading: 59, navStatus: 'Underway using Engine' },
          { lat: 20.970, lng: 69.570, timestamp: 'T-1h (05:30 UTC)', timeOffsetHours: -1, sog: 14.2, cog: 56, heading: 57, navStatus: 'Underway using Engine' },
          { lat: 21.060, lng: 69.690, timestamp: 'T-0h (06:30 UTC)', timeOffsetHours: 0, sog: 14.4, cog: 55, heading: 56, navStatus: 'Underway using Engine' }
        ]
      },
      {
        id: 'v-002',
        name: 'MT Ocean Titan',
        imo: '9321045',
        mmsi: '636018332',
        flag: 'Liberia',
        flagCode: 'LR',
        type: 'Chemical / Oil Products Tanker',
        dwt: 49990,
        draft: 11.2,
        length: 183,
        beam: 32,
        originPort: 'Sohar (OM)',
        destinationPort: 'Mumbai High (IN)',
        cargoType: 'Refined Naphtha',
        rank: 2,
        score: {
          overall: 64,
          spatial: 72,
          temporal: 58,
          trajectory: 65,
          heading: 61,
          drift: 66
        },
        simulatedOverlapIoU: 58.2,
        status: 'MODERATE',
        anomalyFlags: [
          'Passed 4.8 km south of reconstructed origin ellipse',
          'Speed remained constant (12.6 kn) with continuous AIS broadcast'
        ],
        explainableInsights: [
          'Spatial trajectory crossed peripheral influence zone, but missed core reverse-drift centroid by 4.8 km.',
          'Temporal passage was 1 hour prior to optimal estimated release window.',
          'No significant speed drops or transponder blackout episodes observed.',
          'Simulated release produces 58.2% overlap due to downwind lateral dispersion.'
        ],
        estimatedReleaseTime: '01:15 UTC (T-5h 15m)',
        estimatedReleaseOffsetHours: -5.25,
        releaseCoordinates: { lat: 20.7250, lng: 69.2450 },
        color: '#f59e0b',
        trajectory: [
          { lat: 20.550, lng: 69.020, timestamp: 'T-6h', timeOffsetHours: -6, sog: 12.8, cog: 72, heading: 71, navStatus: 'Underway' },
          { lat: 20.640, lng: 69.140, timestamp: 'T-5h', timeOffsetHours: -5, sog: 12.6, cog: 70, heading: 70, navStatus: 'Underway' },
          { lat: 20.730, lng: 69.260, timestamp: 'T-4h', timeOffsetHours: -4, sog: 12.7, cog: 71, heading: 72, navStatus: 'Underway' },
          { lat: 20.820, lng: 69.380, timestamp: 'T-3h', timeOffsetHours: -3, sog: 12.5, cog: 69, heading: 70, navStatus: 'Underway' },
          { lat: 20.910, lng: 69.500, timestamp: 'T-2h', timeOffsetHours: -2, sog: 12.6, cog: 70, heading: 71, navStatus: 'Underway' },
          { lat: 21.000, lng: 69.620, timestamp: 'T-1h', timeOffsetHours: -1, sog: 12.8, cog: 72, heading: 71, navStatus: 'Underway' },
          { lat: 21.090, lng: 69.740, timestamp: 'T-0h', timeOffsetHours: 0, sog: 12.7, cog: 71, heading: 70, navStatus: 'Underway' }
        ]
      },
      {
        id: 'v-003',
        name: 'Pacific Crown',
        imo: '9619204',
        mmsi: '354892000',
        flag: 'Panama',
        flagCode: 'PA',
        type: 'Capesize Bulk Carrier',
        dwt: 178500,
        draft: 18.1,
        length: 292,
        beam: 45,
        originPort: 'Port Hedland (AU)',
        destinationPort: 'Mundra (IN)',
        cargoType: 'Iron Ore (Dry Bulk)',
        rank: 3,
        score: {
          overall: 41,
          spatial: 48,
          temporal: 38,
          trajectory: 42,
          heading: 39,
          drift: 36
        },
        simulatedOverlapIoU: 24.5,
        status: 'LOW_PROBABILITY',
        anomalyFlags: [
          'Dry bulk carrier with fuel oil bunker only (no liquid cargo)',
          'Maintained consistent sea lane speed of 11.2 knots'
        ],
        explainableInsights: [
          'Capesize bulk carrier lacks crude oil cargo; only holds heavy fuel oil bunkers.',
          'Trajectory was 9.2 km north-west of origin zone during release window.',
          'Simulated plume drift fails to reach satellite observed slick polygon (24.5% IoU).'
        ],
        estimatedReleaseTime: '03:45 UTC (T-2h 45m)',
        estimatedReleaseOffsetHours: -2.75,
        releaseCoordinates: { lat: 20.8900, lng: 69.2100 },
        color: '#00f2fe',
        trajectory: [
          { lat: 20.710, lng: 68.980, timestamp: 'T-6h', timeOffsetHours: -6, sog: 11.2, cog: 45, heading: 45, navStatus: 'Underway' },
          { lat: 20.780, lng: 69.070, timestamp: 'T-5h', timeOffsetHours: -5, sog: 11.1, cog: 46, heading: 46, navStatus: 'Underway' },
          { lat: 20.850, lng: 69.160, timestamp: 'T-4h', timeOffsetHours: -4, sog: 11.3, cog: 44, heading: 45, navStatus: 'Underway' },
          { lat: 20.920, lng: 69.250, timestamp: 'T-3h', timeOffsetHours: -3, sog: 11.2, cog: 45, heading: 44, navStatus: 'Underway' },
          { lat: 20.990, lng: 69.340, timestamp: 'T-2h', timeOffsetHours: -2, sog: 11.0, cog: 45, heading: 46, navStatus: 'Underway' },
          { lat: 21.060, lng: 69.430, timestamp: 'T-1h', timeOffsetHours: -1, sog: 11.2, cog: 46, heading: 45, navStatus: 'Underway' },
          { lat: 21.130, lng: 69.520, timestamp: 'T-0h', timeOffsetHours: 0, sog: 11.4, cog: 44, heading: 44, navStatus: 'Underway' }
        ]
      },
      {
        id: 'v-004',
        name: 'Gulf Pioneer',
        imo: '9158421',
        mmsi: '470211000',
        flag: 'United Arab Emirates',
        flagCode: 'AE',
        type: 'Offshore Supply Vessel',
        dwt: 3200,
        draft: 5.4,
        length: 75,
        beam: 16,
        originPort: 'Mumbai High Field',
        destinationPort: 'Porbandar (IN)',
        cargoType: 'Drilling Equipment',
        rank: 4,
        score: {
          overall: 28,
          spatial: 31,
          temporal: 26,
          trajectory: 24,
          heading: 32,
          drift: 29
        },
        simulatedOverlapIoU: 14.1,
        status: 'EXCLUDED',
        anomalyFlags: [
          'Stationary at platform cluster during primary discharge window'
        ],
        explainableInsights: [
          'Stationary at offshore rig 28 km south of spill location.',
          'Environmental drift vector could not transport discharge from this location to observed slick.'
        ],
        estimatedReleaseTime: '00:10 UTC',
        estimatedReleaseOffsetHours: -6.33,
        releaseCoordinates: { lat: 20.4800, lng: 69.3500 },
        color: '#94a3b8',
        trajectory: [
          { lat: 20.480, lng: 69.350, timestamp: 'T-6h', timeOffsetHours: -6, sog: 0.2, cog: 120, heading: 118, navStatus: 'Moored' },
          { lat: 20.480, lng: 69.350, timestamp: 'T-4h', timeOffsetHours: -4, sog: 0.1, cog: 120, heading: 120, navStatus: 'Moored' },
          { lat: 20.480, lng: 69.350, timestamp: 'T-2h', timeOffsetHours: -2, sog: 0.2, cog: 120, heading: 119, navStatus: 'Moored' },
          { lat: 20.480, lng: 69.350, timestamp: 'T-0h', timeOffsetHours: 0, sog: 0.1, cog: 120, heading: 121, navStatus: 'Moored' }
        ]
      }
    ]
  },
  {
    id: 'inc-043',
    caseNumber: 'SLK-043',
    title: 'Malacca Strait High-Traffic Bunker Slick',
    region: 'Strait of Malacca (TSS Northbound Lane - Off Port Dickson)',
    coordinates: { lat: 2.4512, lng: 101.7821 },
    detectionTimestamp: '2026-09-03 14:15 UTC',
    sensor: 'RADARSAT-2 Fine SAR',
    polarization: 'HH / HV Polarimetric',
    resolutionMeters: 8,
    areaKm2: 7.82,
    estimatedVolumeM3: 160.0,
    confidence: 0.92,
    status: 'VERIFIED',
    windSpeedKnots: 8.5,
    windDirectionDeg: 190,
    currentKnots: 2.1,
    currentDirectionDeg: 310, // NW Tidal Stream
    waveHeightMeters: 0.9,
    sstDegC: 30.1,
    bathymetryMeters: -48,
    description: 'High-contrast elongated sheen along commercial traffic lane. Heavy vessel density requiring multi-vessel trajectory deconfliction.',
    probableOrigin: {
      lat: 2.3810,
      lng: 101.8620,
      radiusKm: 2.1,
      timeWindowStart: '11:00 UTC',
      timeWindowEnd: '12:20 UTC',
      estimatedReleaseOffsetHours: 2.8,
      confidence: 0.89,
      uncertaintyLatKm: 0.8,
      uncertaintyLngKm: 1.1
    },
    spillPolygon: [
      [2.465, 101.765],
      [2.472, 101.790],
      [2.448, 101.802],
      [2.435, 101.775]
    ],
    vessels: [
      {
        id: 'v-101',
        name: 'MT Ocean Titan',
        imo: '9321045',
        mmsi: '636018332',
        flag: 'Liberia',
        flagCode: 'LR',
        type: 'Product Tanker',
        dwt: 49990,
        draft: 11.4,
        length: 183,
        beam: 32,
        originPort: 'Singapore (SG)',
        destinationPort: 'Chittagong (BD)',
        cargoType: 'Heavy Fuel Oil',
        rank: 1,
        score: {
          overall: 78,
          spatial: 85,
          temporal: 81,
          trajectory: 76,
          heading: 74,
          drift: 80
        },
        simulatedOverlapIoU: 81.2,
        status: 'HIGH_PROBABILITY',
        anomalyFlags: ['Engine bilge wash maneuver during night passage'],
        explainableInsights: [
          'Spatial track aligns with tidal reverse drift corridor.',
          'Night-time transit timestamp overlaps origin release window.'
        ],
        estimatedReleaseTime: '11:45 UTC',
        estimatedReleaseOffsetHours: -2.5,
        releaseCoordinates: { lat: 2.3850, lng: 101.8590 },
        color: '#ef4444',
        trajectory: [
          { lat: 2.290, lng: 101.980, timestamp: 'T-4h', timeOffsetHours: -4, sog: 13.5, cog: 315, heading: 314, navStatus: 'Underway' },
          { lat: 2.380, lng: 101.860, timestamp: 'T-2h', timeOffsetHours: -2, sog: 13.2, cog: 312, heading: 312, navStatus: 'Underway' },
          { lat: 2.470, lng: 101.750, timestamp: 'T-0h', timeOffsetHours: 0, sog: 13.4, cog: 315, heading: 316, navStatus: 'Underway' }
        ]
      }
    ]
  },
  {
    id: 'inc-044',
    caseNumber: 'SLK-044',
    title: 'Bay of Bengal Deepwater Plume',
    region: 'Bay of Bengal (Off Paradip - 110 NM South-East)',
    coordinates: { lat: 18.9142, lng: 88.2415 },
    detectionTimestamp: '2026-09-02 22:40 UTC',
    sensor: 'Sentinel-2 MSI Optical + Sentinel-1 SAR',
    polarization: 'Multi-Spectral NDVI / SAR Co-Registered',
    resolutionMeters: 10,
    areaKm2: 24.12,
    estimatedVolumeM3: 610.0,
    confidence: 0.97,
    status: 'ACTIVE_INVESTIGATION',
    windSpeedKnots: 15.2,
    windDirectionDeg: 140, // SE Monsoon
    currentKnots: 1.8,
    currentDirectionDeg: 345, // NNW
    waveHeightMeters: 2.4,
    sstDegC: 29.2,
    bathymetryMeters: -1850,
    description: 'Extensive multi-lobed spill detected at deep oceanic shelf boundary. Strong monsoonal drift driving slick north-northwest toward sensitive coastal estuaries.',
    probableOrigin: {
      lat: 18.7820,
      lng: 88.2040,
      radiusKm: 4.8,
      timeWindowStart: '16:00 UTC',
      timeWindowEnd: '18:00 UTC',
      estimatedReleaseOffsetHours: 5.5,
      confidence: 0.94,
      uncertaintyLatKm: 1.8,
      uncertaintyLngKm: 2.2
    },
    spillPolygon: [
      [18.940, 88.220],
      [18.955, 88.255],
      [18.920, 88.275],
      [18.895, 88.240],
      [18.910, 88.210]
    ],
    vessels: [
      {
        id: 'v-201',
        name: 'Pacific Crown',
        imo: '9619204',
        mmsi: '354892000',
        flag: 'Panama',
        flagCode: 'PA',
        type: 'VLCC Supertanker',
        dwt: 318000,
        draft: 21.5,
        length: 333,
        beam: 60,
        originPort: 'Ras Tanura (SA)',
        destinationPort: 'Paradip Port (IN)',
        cargoType: 'Heavy Basrah Crude',
        rank: 1,
        score: {
          overall: 84,
          spatial: 92,
          temporal: 86,
          trajectory: 82,
          heading: 79,
          drift: 88
        },
        simulatedOverlapIoU: 86.8,
        status: 'HIGH_PROBABILITY',
        anomalyFlags: ['Slowed speed in deep water offshore corridor for 90 minutes'],
        explainableInsights: [
          'Crossed probable origin zone at 16:45 UTC with significant deceleration.',
          'Forward simulation shows 86.8% plume overlap with observed satellite contour.'
        ],
        estimatedReleaseTime: '16:45 UTC (T-5.9h)',
        estimatedReleaseOffsetHours: -5.9,
        releaseCoordinates: { lat: 18.7840, lng: 88.2050 },
        color: '#ef4444',
        trajectory: [
          { lat: 18.620, lng: 88.120, timestamp: 'T-8h', timeOffsetHours: -8, sog: 15.1, cog: 340, heading: 340, navStatus: 'Underway' },
          { lat: 18.780, lng: 88.205, timestamp: 'T-6h', timeOffsetHours: -6, sog: 5.2, cog: 345, heading: 346, navStatus: 'Underway', isAnomalous: true, anomalyReason: 'Drastic speed drop' },
          { lat: 18.940, lng: 88.260, timestamp: 'T-3h', timeOffsetHours: -3, sog: 14.8, cog: 342, heading: 343, navStatus: 'Underway' },
          { lat: 19.110, lng: 88.320, timestamp: 'T-0h', timeOffsetHours: 0, sog: 15.0, cog: 340, heading: 340, navStatus: 'Underway' }
        ]
      }
    ]
  }
];
