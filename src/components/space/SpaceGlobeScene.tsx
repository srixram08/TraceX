import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export interface SpaceTelemetryData {
  subSatLat: number;
  subSatLng: number;
  altitudeKm: number;
  velocityKmS: number;
  orbitalPeriodMin: number;
  isScanning: boolean;
  sarFrequencyGhz: number;
  swathWidthKm: number;
  orbitCycle: string;
}

export interface SpaceSceneProps {
  onSelectEntity?: (entity: 'satellite' | 'ship' | 'spill' | null) => void;
  selectedEntity?: 'satellite' | 'ship' | 'spill' | null;
  cameraPreset?: 'orbital' | 'satellite' | 'spill';
  showRadarBeam?: boolean;
  showOrbits?: boolean;
  showSpillPulse?: boolean;
  showAisTrail?: boolean;
  showClouds?: boolean;
  orbitSpeed?: number;
  onTelemetryUpdate?: (data: SpaceTelemetryData) => void;
}

// Convert geographic lat/lng to 3D Cartesian coordinates on sphere of given radius
export function latLngToVector3(lat: number, lng: number, radius: number): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);
  return new THREE.Vector3(x, y, z);
}

// Convert 3D Cartesian coordinates on sphere back to geographic lat/lng
export function vector3ToLatLng(pos: THREE.Vector3): { lat: number; lng: number } {
  const norm = pos.clone().normalize();
  const lat = 90 - Math.acos(norm.y) * (180 / Math.PI);
  let lng = Math.atan2(norm.z, -norm.x) * (180 / Math.PI) - 180;
  while (lng < -180) lng += 360;
  while (lng > 180) lng -= 360;
  return { lat, lng };
}

export const SpaceGlobeScene: React.FC<SpaceSceneProps> = ({
  onSelectEntity,
  selectedEntity,
  cameraPreset = 'orbital',
  showRadarBeam = true,
  showOrbits = true,
  showSpillPulse = true,
  showAisTrail = true,
  showClouds = true,
  orbitSpeed = 1.0,
  onTelemetryUpdate,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);

  // References for animated objects
  const earthMeshRef = useRef<THREE.Mesh | null>(null);
  const cloudsMeshRef = useRef<THREE.Mesh | null>(null);
  const satelliteGroupRef = useRef<THREE.Group | null>(null);
  const radarBeamMeshRef = useRef<THREE.Mesh | null>(null);
  const groundSwathMeshRef = useRef<THREE.Mesh | null>(null);
  const spillGroupRef = useRef<THREE.Group | null>(null);
  const orbitLineRef = useRef<THREE.Line | null>(null);
  const solarWingsRef = useRef<THREE.Group[]>([]);
  const beaconLightsRef = useRef<THREE.PointLight[]>([]);

  // Camera targets & modes
  const targetCamPosRef = useRef<THREE.Vector3>(new THREE.Vector3(0, 3.0, 16.0));
  const targetLookAtRef = useRef<THREE.Vector3>(new THREE.Vector3(0, 0, 0));
  const chaseModeRef = useRef<boolean>(false);
  const oceanViewModeRef = useRef<boolean>(false);

  // Real-life scale proportions
  const EARTH_RADIUS = 5.2;
  const ORBIT_ALTITUDE = 2.0;
  const ORBIT_RADIUS = EARTH_RADIUS + ORBIT_ALTITUDE; // ~7.2 units
  const INCLINATION = 98.18 * (Math.PI / 180);

  // Arabian Sea SLK-042 Incident Coordinates
  const SPILL_LAT = 20.8421;
  const SPILL_LNG = 69.4128;

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // 1. Scene Setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // 2. Camera Setup
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.05, 1500);
    camera.position.set(0, 3.0, 16.0);
    cameraRef.current = camera;

    // 3. Renderer Setup
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 4. OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.minDistance = 0.15; // Allows zooming right down onto the ships and ocean waves!
    controls.maxDistance = 40;
    controls.maxPolarAngle = Math.PI * 0.95;
    controls.minPolarAngle = 0.02;
    controlsRef.current = controls;

    // 5. Solar System Lighting
    const ambientLight = new THREE.AmbientLight(0xe0f2fe, 1.6);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xffffff, 2.8);
    sunLight.position.set(16, 12, 22);
    scene.add(sunLight);

    const fillLight = new THREE.DirectionalLight(0x38bdf8, 1.2);
    fillLight.position.set(-20, 5, 12);
    scene.add(fillLight);

    // 6. Natural Cosmos Starfield
    const starsCount = 2000;
    const starsGeo = new THREE.BufferGeometry();
    const starPositions = new Float32Array(starsCount * 3);
    const starColors = new Float32Array(starsCount * 3);
    for (let i = 0; i < starsCount; i++) {
      const r = 160 + Math.random() * 260;
      const theta = 2 * Math.PI * Math.random();
      const phi = Math.acos(2 * Math.random() - 1);
      starPositions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      starPositions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      starPositions[i * 3 + 2] = r * Math.cos(phi);

      const colorVal = Math.random();
      if (colorVal > 0.7) {
        starColors[i * 3] = 0.8; starColors[i * 3 + 1] = 0.9; starColors[i * 3 + 2] = 1.0;
      } else if (colorVal > 0.3) {
        starColors[i * 3] = 1.0; starColors[i * 3 + 1] = 1.0; starColors[i * 3 + 2] = 1.0;
      } else {
        starColors[i * 3] = 1.0; starColors[i * 3 + 1] = 0.92; starColors[i * 3 + 2] = 0.8;
      }
    }
    starsGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    starsGeo.setAttribute('color', new THREE.BufferAttribute(starColors, 3));
    const starMat = new THREE.PointsMaterial({
      size: 1.1,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
    });
    const starPoints = new THREE.Points(starsGeo, starMat);
    scene.add(starPoints);

    // 7. REAL-LIFE PHOTOREALISTIC EARTH GLOBE
    const textureLoader = new THREE.TextureLoader();
    textureLoader.setCrossOrigin('anonymous');

    const dayTexture = textureLoader.load('/textures/earth/earth-blue-marble.jpg');
    dayTexture.colorSpace = THREE.SRGBColorSpace;

    const topoTexture = textureLoader.load('/textures/earth/earth-topology.png');
    const waterTexture = textureLoader.load('/textures/earth/earth-water.png');
    const nightTexture = textureLoader.load('/textures/earth/earth-night.jpg');

    const earthGeo = new THREE.SphereGeometry(EARTH_RADIUS, 128, 128);

    const earthMat = new THREE.MeshStandardMaterial({
      map: dayTexture,
      bumpMap: topoTexture,
      bumpScale: 0.015,
      roughnessMap: waterTexture,
      roughness: 0.45,
      metalness: 0.08,
      emissiveMap: nightTexture,
      emissive: new THREE.Color(0xfff0b3),
      emissiveIntensity: 0.25,
    });

    const earthMesh = new THREE.Mesh(earthGeo, earthMat);
    earthMesh.rotation.y = Math.PI * 0.9;
    scene.add(earthMesh);
    earthMeshRef.current = earthMesh;

    // 8. DELICATE ATMOSPHERIC RAYLEIGH SCATTERING HALO
    const atmosGeo = new THREE.SphereGeometry(EARTH_RADIUS * 1.025, 64, 64);
    const atmosMat = new THREE.ShaderMaterial({
      vertexShader: `
        varying vec3 vNormal;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec3 vNormal;
        void main() {
          float intensity = pow(0.68 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.2);
          gl_FragColor = vec4(0.24, 0.65, 1.0, 1.0) * intensity * 1.35;
        }
      `,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
      transparent: true,
      depthWrite: false,
    });
    const atmosMesh = new THREE.Mesh(atmosGeo, atmosMat);
    scene.add(atmosMesh);

    // 9. GENUINE 2K NASA CLOUD LAYER
    const cloudTexture = textureLoader.load('/textures/earth/earth-clouds.jpg');
    const cloudsGeo = new THREE.SphereGeometry(EARTH_RADIUS * 1.012, 96, 96);
    const cloudsMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      alphaMap: cloudTexture,
      transparent: true,
      opacity: 0.75,
      depthWrite: false,
      roughness: 0.85,
    });
    const cloudsMesh = new THREE.Mesh(cloudsGeo, cloudsMat);
    scene.add(cloudsMesh);
    cloudsMeshRef.current = cloudsMesh;

    // 10. REALISTIC POLAR ORBIT PATH
    const curve = new THREE.EllipseCurve(0, 0, ORBIT_RADIUS, ORBIT_RADIUS, 0, 2 * Math.PI, false, 0);
    const points = curve.getPoints(140);
    const orbitGeo = new THREE.BufferGeometry().setFromPoints(points.map((p) => new THREE.Vector3(p.x, p.y, 0)));
    const orbitMat = new THREE.LineBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.45,
    });
    const orbitLine = new THREE.Line(orbitGeo, orbitMat);
    orbitLine.rotation.set(INCLINATION, 0, 0);
    scene.add(orbitLine);
    orbitLineRef.current = orbitLine;

    // 11. HIGH-FIDELITY RECONNAISSANCE SPACECRAFT (MATCHING REFERENCE IMAGE)
    const satGroup = new THREE.Group();
    satGroup.name = 'satellite';
    const shipBody = new THREE.Group();
    satGroup.add(shipBody);

    const whiteSkinMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, metalness: 0.8, roughness: 0.22 });
    const darkSkinMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.7, roughness: 0.35 });
    const heatShieldMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.85, roughness: 0.28 });
    const silverTrussMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.9, roughness: 0.15 });
    const dishMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, metalness: 0.8, roughness: 0.2 });

    // Aft Propulsion Base Ring
    const baseRingGeo = new THREE.CylinderGeometry(0.38, 0.42, 0.08, 32);
    baseRingGeo.rotateX(Math.PI * 0.5);
    const baseRing = new THREE.Mesh(baseRingGeo, heatShieldMat);
    baseRing.position.set(0, 0, -0.65);
    shipBody.add(baseRing);

    // Fluted heat shield plate
    const flutedGeo = new THREE.CylinderGeometry(0.36, 0.36, 0.02, 32);
    flutedGeo.rotateX(Math.PI * 0.5);
    const flutedDisc = new THREE.Mesh(flutedGeo, darkSkinMat);
    flutedDisc.position.set(0, 0, -0.69);
    shipBody.add(flutedDisc);

    // Main rocket nozzle
    const nozzleGeo = new THREE.CylinderGeometry(0.06, 0.14, 0.16, 24, 1, true);
    nozzleGeo.rotateX(Math.PI * 0.5);
    const nozzleMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.9, roughness: 0.2, side: THREE.DoubleSide });
    const nozzle = new THREE.Mesh(nozzleGeo, nozzleMat);
    nozzle.position.set(0, 0, -0.76);
    shipBody.add(nozzle);

    // RCS thruster pods
    for (let v = 0; v < 4; v++) {
      const a = (v * Math.PI) / 2;
      const vGeo = new THREE.CylinderGeometry(0.02, 0.04, 0.06, 12);
      vGeo.rotateX(Math.PI * 0.5);
      const vMesh = new THREE.Mesh(vGeo, silverTrussMat);
      vMesh.position.set(Math.cos(a) * 0.34, Math.sin(a) * 0.34, -0.66);
      shipBody.add(vMesh);
    }

    // Rear whip antennas
    for (let a = 0; a < 2; a++) {
      const sign = a === 0 ? 1 : -1;
      const whipGeo = new THREE.CylinderGeometry(0.006, 0.006, 0.3, 6);
      whipGeo.rotateZ(sign * Math.PI * 0.25);
      const whip = new THREE.Mesh(whipGeo, silverTrussMat);
      whip.position.set(sign * 0.42, 0, -0.62);
      shipBody.add(whip);
    }

    // Service Module Cylinder
    const aftCylGeo = new THREE.CylinderGeometry(0.36, 0.38, 0.35, 32);
    aftCylGeo.rotateX(Math.PI * 0.5);
    const aftCyl = new THREE.Mesh(aftCylGeo, darkSkinMat);
    aftCyl.position.set(0, 0, -0.45);
    shipBody.add(aftCyl);

    const fwdCylGeo = new THREE.CylinderGeometry(0.35, 0.36, 0.35, 32);
    fwdCylGeo.rotateX(Math.PI * 0.5);
    const fwdCyl = new THREE.Mesh(fwdCylGeo, whiteSkinMat);
    fwdCyl.position.set(0, 0, -0.12);
    shipBody.add(fwdCyl);

    // Twin Solar Array Wings (4 rectangular panels per wing with framing)
    const createSolarWing = (isLeft: boolean) => {
      const wingGroup = new THREE.Group();
      const dir = isLeft ? -1 : 1;
      wingGroup.position.set(dir * 0.35, 0, -0.25);

      const boomGeo = new THREE.CylinderGeometry(0.02, 0.02, 0.2, 8);
      boomGeo.rotateZ(Math.PI * 0.5);
      const boom = new THREE.Mesh(boomGeo, silverTrussMat);
      boom.position.set(dir * 0.1, 0, 0);
      wingGroup.add(boom);

      const pW = 0.32;
      const pH = 0.015;
      const pD = 0.44;
      for (let p = 0; p < 4; p++) {
        const pGeo = new THREE.BoxGeometry(pW, pH, pD);
        const pMat = new THREE.MeshStandardMaterial({
          color: 0x0f172a,
          metalness: 0.8,
          roughness: 0.2,
          emissive: 0x0284c7,
          emissiveIntensity: 0.12,
        });
        const panel = new THREE.Mesh(pGeo, pMat);
        panel.position.set(dir * (0.22 + p * (pW + 0.02)), 0, 0);
        wingGroup.add(panel);

        const frameGeo = new THREE.BoxGeometry(pW + 0.01, pH + 0.005, 0.02);
        const frame1 = new THREE.Mesh(frameGeo, silverTrussMat);
        frame1.position.set(dir * (0.22 + p * (pW + 0.02)), 0, pD * 0.5);
        wingGroup.add(frame1);
        const frame2 = new THREE.Mesh(frameGeo, silverTrussMat);
        frame2.position.set(dir * (0.22 + p * (pW + 0.02)), 0, -pD * 0.5);
        wingGroup.add(frame2);
      }

      const tipGeo = new THREE.CylinderGeometry(0.015, 0.005, 0.08, 8);
      tipGeo.rotateZ(dir * Math.PI * 0.5);
      const tip = new THREE.Mesh(tipGeo, silverTrussMat);
      tip.position.set(dir * (0.22 + 4 * (pW + 0.02)), 0, 0);
      wingGroup.add(tip);

      if (!isLeft) {
        const wDishGeo = new THREE.CylinderGeometry(0.08, 0.02, 0.04, 16);
        wDishGeo.rotateX(Math.PI * 0.4);
        const wDish = new THREE.Mesh(wDishGeo, dishMat);
        wDish.position.set(dir * 0.22, 0.08, 0);
        wingGroup.add(wDish);
      }

      shipBody.add(wingGroup);
      solarWingsRef.current.push(wingGroup);
    };

    createSolarWing(true);
    createSolarWing(false);

    // Descent Module (SA)
    const descentGeo = new THREE.CylinderGeometry(0.33, 0.35, 0.32, 32);
    descentGeo.rotateX(Math.PI * 0.5);
    const descent = new THREE.Mesh(descentGeo, darkSkinMat);
    descent.position.set(0, 0, 0.18);
    shipBody.add(descent);

    const windowGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.02, 16);
    windowGeo.rotateZ(Math.PI * 0.5);
    const windowMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      emissive: 0x0284c7,
      emissiveIntensity: 0.4,
      roughness: 0.1,
      metalness: 0.9,
    });
    const porthole = new THREE.Mesh(windowGeo, windowMat);
    porthole.position.set(0.34, 0.05, 0.18);
    shipBody.add(porthole);

    // Forward Orbital Module (BO)
    const orbitalGeo = new THREE.SphereGeometry(0.33, 32, 32);
    orbitalGeo.scale(1.0, 1.05, 1.0);
    const orbitalModule = new THREE.Mesh(orbitalGeo, darkSkinMat);
    orbitalModule.position.set(0, 0, 0.52);
    shipBody.add(orbitalModule);

    // Nose docking probe
    const noseGeo = new THREE.CylinderGeometry(0.08, 0.12, 0.16, 24);
    noseGeo.rotateX(Math.PI * 0.5);
    const nose = new THREE.Mesh(noseGeo, whiteSkinMat);
    nose.position.set(0, 0, 0.88);
    shipBody.add(nose);

    const probeGeo = new THREE.CylinderGeometry(0.015, 0.015, 0.14, 8);
    probeGeo.rotateX(Math.PI * 0.5);
    const probe = new THREE.Mesh(probeGeo, silverTrussMat);
    probe.position.set(0, 0, 0.98);
    shipBody.add(probe);

    // Steerable Dishes
    const dish1Geo = new THREE.CylinderGeometry(0.12, 0.03, 0.05, 20);
    dish1Geo.rotateX(-Math.PI * 0.35);
    const dish1 = new THREE.Mesh(dish1Geo, dishMat);
    dish1.position.set(0, 0.36, 0.52);
    shipBody.add(dish1);

    const dish2Geo = new THREE.CylinderGeometry(0.1, 0.025, 0.04, 16);
    dish2Geo.rotateZ(Math.PI * 0.4);
    dish2Geo.rotateX(Math.PI * 0.2);
    const dish2 = new THREE.Mesh(dish2Geo, dishMat);
    dish2.position.set(-0.34, 0.18, 0.28);
    shipBody.add(dish2);

    const navLight = new THREE.PointLight(0x38bdf8, 1.4, 3.5);
    navLight.position.set(0, 0.4, 0.5);
    shipBody.add(navLight);
    beaconLightsRef.current.push(navLight);

    scene.add(satGroup);
    satelliteGroupRef.current = satGroup;

    // 12. Translucent Microwave Radar Beam
    const beamGeo = new THREE.ConeGeometry(1.2, ORBIT_ALTITUDE * 1.0, 32, 1, true);
    beamGeo.translate(0, -(ORBIT_ALTITUDE * 1.0) / 2, 0);
    const beamMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.15,
      side: THREE.DoubleSide,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const radarBeam = new THREE.Mesh(beamGeo, beamMat);
    satGroup.add(radarBeam);
    radarBeamMeshRef.current = radarBeam;

    const swathGeo = new THREE.RingGeometry(0.02, 0.7, 32);
    const swathMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.5,
      side: THREE.DoubleSide,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const groundSwath = new THREE.Mesh(swathGeo, swathMat);
    scene.add(groundSwath);
    groundSwathMeshRef.current = groundSwath;

    // 13. IMMERSIVE OCEAN INCIDENT AREA: TACTICAL FLEET & CRUDE SLICK (Arabian Sea: 20.84° N, 69.41° E)
    const spillPosLocal = latLngToVector3(SPILL_LAT, SPILL_LNG, EARTH_RADIUS + 0.015);
    const spillArea = new THREE.Group();
    spillArea.name = 'spill';
    spillArea.position.copy(spillPosLocal);
    spillArea.lookAt(spillPosLocal.clone().multiplyScalar(2)); // Align normal outwards from sphere

    // A. Local Ocean Water Surface Patch with shimmering specular waves
    const oceanWaterGeo = new THREE.CircleGeometry(0.85, 64);
    const oceanWaterMat = new THREE.MeshStandardMaterial({
      color: 0x023e6b,
      roughness: 0.1,
      metalness: 0.85,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.92,
      depthWrite: false,
    });
    const oceanWater = new THREE.Mesh(oceanWaterGeo, oceanWaterMat);
    oceanWater.position.set(0, 0, 0.002);
    spillArea.add(oceanWater);

    // Dynamic wave ripples expanding from incident center
    const rippleGeo1 = new THREE.RingGeometry(0.2, 0.22, 48);
    const rippleMat1 = new THREE.MeshBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.5, side: THREE.DoubleSide, depthWrite: false });
    const ripple1 = new THREE.Mesh(rippleGeo1, rippleMat1);
    ripple1.position.set(0, 0, 0.003);
    spillArea.add(ripple1);

    const rippleGeo2 = new THREE.RingGeometry(0.45, 0.47, 48);
    const rippleMat2 = new THREE.MeshBasicMaterial({ color: 0x0284c7, transparent: true, opacity: 0.35, side: THREE.DoubleSide, depthWrite: false });
    const ripple2 = new THREE.Mesh(rippleGeo2, rippleMat2);
    ripple2.position.set(0, 0, 0.003);
    spillArea.add(ripple2);

    // B. Iridescent Hydrocarbon Petroleum Slick Polygon
    const slickShape = new THREE.Shape();
    slickShape.moveTo(-0.06, 0.32);
    slickShape.quadraticCurveTo(0.26, 0.36, 0.36, 0.08);
    slickShape.quadraticCurveTo(0.42, -0.24, 0.14, -0.34);
    slickShape.quadraticCurveTo(-0.18, -0.38, -0.32, -0.16);
    slickShape.quadraticCurveTo(-0.42, 0.14, -0.06, 0.32);

    const slickGeo = new THREE.ShapeGeometry(slickShape);
    const slickMat = new THREE.MeshStandardMaterial({
      color: 0x020617, // Viscous black crude petroleum
      roughness: 0.08,
      metalness: 0.95,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.95,
      depthWrite: false,
    });
    const slickMesh = new THREE.Mesh(slickGeo, slickMat);
    slickMesh.position.set(0, 0, 0.006);
    spillArea.add(slickMesh);

    // Iridescent Rainbow Sheen Fringe
    const fringeShape = new THREE.Shape();
    fringeShape.moveTo(-0.10, 0.38);
    fringeShape.quadraticCurveTo(0.32, 0.42, 0.42, 0.10);
    fringeShape.quadraticCurveTo(0.48, -0.28, 0.18, -0.40);
    fringeShape.quadraticCurveTo(-0.22, -0.44, -0.38, -0.18);
    fringeShape.quadraticCurveTo(-0.48, 0.18, -0.10, 0.38);
    const fringeGeo = new THREE.ShapeGeometry(fringeShape);
    const fringeMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.4,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const fringeMesh = new THREE.Mesh(fringeGeo, fringeMat);
    fringeMesh.position.set(0, 0, 0.005);
    spillArea.add(fringeMesh);

    // Glowing Red SAR Dielectric Backscatter Contour Ring
    const pulseRingGeo = new THREE.RingGeometry(0.42, 0.48, 64);
    const pulseRingMat = new THREE.MeshBasicMaterial({
      color: 0xef4444,
      transparent: true,
      opacity: 0.9,
      side: THREE.DoubleSide,
      depthWrite: false,
    });
    const pulseRing = new THREE.Mesh(pulseRingGeo, pulseRingMat);
    pulseRing.position.set(0, 0, 0.007);
    spillArea.add(pulseRing);

    // Floating Yellow Containment Booms deployed around the perimeter
    const boomCurve = new THREE.EllipseCurve(0, 0, 0.52, 0.48, 0.15, Math.PI * 0.98, false, 0);
    const boomPoints = boomCurve.getPoints(40);
    const boomLineGeo = new THREE.BufferGeometry().setFromPoints(boomPoints.map(p => new THREE.Vector3(p.x, p.y, 0.012)));
    const boomLineMat = new THREE.LineBasicMaterial({ color: 0xfacc15, linewidth: 3 });
    const boomLine = new THREE.Line(boomLineGeo, boomLineMat);
    spillArea.add(boomLine);

    // Yellow float buoys spaced along the containment boom
    const buoyGeo = new THREE.SphereGeometry(0.006, 8, 8);
    const buoyMat = new THREE.MeshBasicMaterial({ color: 0xfacc15 });
    boomPoints.forEach((p, idx) => {
      if (idx % 3 === 0) {
        const buoy = new THREE.Mesh(buoyGeo, buoyMat);
        buoy.position.set(p.x, p.y, 0.012);
        spillArea.add(buoy);
      }
    });

    // --- C. DETAILED MARITIME FLEET IN THE ARABIAN SEA (6 VESSELS) ---

    // Helper to create crisp high-DPI 3D text/badge sprite floating over a ship
    const createShipLabel = (title: string, sub: string, colorHex: string) => {
      const canvas = document.createElement('canvas');
      canvas.width = 640;
      canvas.height = 160;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = 'rgba(10, 15, 29, 0.92)';
        ctx.beginPath();
        ctx.roundRect(10, 10, 620, 140, 24);
        ctx.fill();
        ctx.lineWidth = 4;
        ctx.strokeStyle = colorHex;
        ctx.stroke();

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 36px monospace';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillText(title, 36, 58);

        ctx.fillStyle = colorHex;
        ctx.font = '600 24px monospace';
        ctx.fillText(sub, 36, 106);
      }
      const spriteTex = new THREE.CanvasTexture(canvas);
      const spriteMat = new THREE.SpriteMaterial({ map: spriteTex, depthTest: false });
      const sprite = new THREE.Sprite(spriteMat);
      sprite.scale.set(0.32, 0.08, 1);
      return sprite;
    };

    // 1. PRIME SUSPECT VESSEL: MV NEPTUNE VOYAGER (Aframax Crude Tanker - 94.2% Match)
    const tankerGroup = new THREE.Group();
    tankerGroup.name = 'ship';
    tankerGroup.position.set(0.05, 0.14, 0.02);
    tankerGroup.rotation.z = Math.PI * 0.18;

    // Tanker Main Hull (Dark crimson bottom, black boot-topping)
    const tHullGeo = new THREE.BoxGeometry(0.06, 0.26, 0.038);
    const tHullMat = new THREE.MeshStandardMaterial({ color: 0x881337, roughness: 0.35, metalness: 0.3 });
    const tHull = new THREE.Mesh(tHullGeo, tHullMat);
    tankerGroup.add(tHull);

    // Tapered Bow Wedge
    const tBowGeo = new THREE.ConeGeometry(0.032, 0.06, 4);
    tBowGeo.rotateZ(-Math.PI * 0.5);
    tBowGeo.rotateX(Math.PI * 0.25);
    const tBow = new THREE.Mesh(tBowGeo, tHullMat);
    tBow.position.set(0, 0.14, 0);
    tankerGroup.add(tBow);

    // Tanker Superstructure / Bridge Castle (Aft)
    const tBridgeGeo = new THREE.BoxGeometry(0.05, 0.06, 0.05);
    const tBridgeMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.25 });
    const tBridge = new THREE.Mesh(tBridgeGeo, tBridgeMat);
    tBridge.position.set(0, -0.075, 0.04);
    tankerGroup.add(tBridge);

    // Twin Exhaust Funnels (Red with black tops)
    const funnelGeo = new THREE.CylinderGeometry(0.005, 0.005, 0.022, 8);
    funnelGeo.rotateX(Math.PI * 0.5);
    const funnelMat = new THREE.MeshStandardMaterial({ color: 0xdc2626 });
    const funnelL = new THREE.Mesh(funnelGeo, funnelMat);
    funnelL.position.set(-0.012, -0.095, 0.055);
    const funnelR = new THREE.Mesh(funnelGeo, funnelMat);
    funnelR.position.set(0.012, -0.095, 0.055);
    tankerGroup.add(funnelL);
    tankerGroup.add(funnelR);

    // Radar & Comms Mast on Bridge
    const tMastGeo = new THREE.CylinderGeometry(0.003, 0.003, 0.045, 6);
    tMastGeo.rotateX(Math.PI * 0.5);
    const tMast = new THREE.Mesh(tMastGeo, new THREE.MeshBasicMaterial({ color: 0x38bdf8 }));
    tMast.position.set(0, -0.075, 0.072);
    tankerGroup.add(tMast);

    // Piping Deck Manifolds (Crude transfer pipes)
    const tPipeGeo = new THREE.BoxGeometry(0.024, 0.14, 0.012);
    const tPipeMat = new THREE.MeshStandardMaterial({ color: 0x475569, metalness: 0.85, roughness: 0.3 });
    const tPipe = new THREE.Mesh(tPipeGeo, tPipeMat);
    tPipe.position.set(0, 0.025, 0.024);
    tankerGroup.add(tPipe);

    // Active Stern Bilge Discharge Plume (Iridescent oil trail flowing into the sea)
    const plumeGeo = new THREE.PlaneGeometry(0.045, 0.18);
    const plumeMat = new THREE.MeshBasicMaterial({ color: 0x020617, transparent: true, opacity: 0.9, depthWrite: false });
    const plume = new THREE.Mesh(plumeGeo, plumeMat);
    plume.position.set(0, -0.19, 0.002);
    tankerGroup.add(plume);

    // Floating 3D Tactical Tag
    const tLabel = createShipLabel('🔴 MV NEPTUNE VOYAGER', '94.2% SUSPECT // AFRAMAX TANKER', '#ef4444');
    tLabel.position.set(0, 0.04, 0.12);
    tankerGroup.add(tLabel);

    spillArea.add(tankerGroup);

    // 2. COMMERCIAL CHEMICAL TANKER: MT PACIFIC GLORY (18% Nominal)
    const chemGroup = new THREE.Group();
    chemGroup.name = 'ship';
    chemGroup.position.set(0.28, -0.16, 0.02);
    chemGroup.rotation.z = -Math.PI * 0.28;

    const cHullGeo = new THREE.BoxGeometry(0.048, 0.20, 0.032);
    const cHullMat = new THREE.MeshStandardMaterial({ color: 0x1d4ed8, roughness: 0.35, metalness: 0.4 });
    const cHull = new THREE.Mesh(cHullGeo, cHullMat);
    chemGroup.add(cHull);

    // 4 Cylindrical deck pressure chemical tanks
    const tankGeo = new THREE.CylinderGeometry(0.009, 0.009, 0.035, 12);
    tankGeo.rotateX(Math.PI * 0.5);
    const tankMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.85, roughness: 0.2 });
    for (let i = 0; i < 4; i++) {
      const tank = new THREE.Mesh(tankGeo, tankMat);
      tank.position.set((i % 2 === 0 ? -0.012 : 0.012), 0.04 - Math.floor(i / 2) * 0.05, 0.022);
      chemGroup.add(tank);
    }

    const cBridgeGeo = new THREE.BoxGeometry(0.04, 0.045, 0.038);
    const cBridge = new THREE.Mesh(cBridgeGeo, new THREE.MeshStandardMaterial({ color: 0xffffff }));
    cBridge.position.set(0, -0.055, 0.034);
    chemGroup.add(cBridge);

    const cWakeGeo = new THREE.PlaneGeometry(0.04, 0.22);
    const cWake = new THREE.Mesh(cWakeGeo, new THREE.MeshBasicMaterial({ color: 0x67e8f9, transparent: true, opacity: 0.55, depthWrite: false }));
    cWake.position.set(0, -0.18, 0.002);
    chemGroup.add(cWake);

    const cLabel = createShipLabel('🔵 MT PACIFIC GLORY', '18% NOMINAL // CHEMICAL TANKER', '#38bdf8');
    cLabel.position.set(0, 0, 0.1);
    chemGroup.add(cLabel);

    spillArea.add(chemGroup);

    // 3. CONTAINER MEGA-SHIP: EVER RADIANT (14,000 TEU)
    const containerGroup = new THREE.Group();
    containerGroup.name = 'ship';
    containerGroup.position.set(-0.32, -0.10, 0.02);
    containerGroup.rotation.z = Math.PI * 0.32;

    const contHullGeo = new THREE.BoxGeometry(0.06, 0.28, 0.038);
    const contHull = new THREE.Mesh(contHullGeo, new THREE.MeshStandardMaterial({ color: 0x14532d, roughness: 0.45 }));
    containerGroup.add(contHull);

    // Stacked Colorful Container Cargo Bays
    const containerColors = [0xd97706, 0x0284c7, 0xdc2626, 0xf8fafc, 0x475569];
    for (let row = 0; row < 5; row++) {
      const bColor = containerColors[row % containerColors.length];
      const bayGeo = new THREE.BoxGeometry(0.048, 0.038, 0.028);
      const bayMesh = new THREE.Mesh(bayGeo, new THREE.MeshStandardMaterial({ color: bColor, roughness: 0.6 }));
      bayMesh.position.set(0, 0.08 - row * 0.042, 0.03);
      containerGroup.add(bayMesh);
    }

    const contBridge = new THREE.Mesh(new THREE.BoxGeometry(0.048, 0.032, 0.044), new THREE.MeshStandardMaterial({ color: 0xffffff }));
    contBridge.position.set(0, -0.105, 0.038);
    containerGroup.add(contBridge);

    const contWake = new THREE.Mesh(new THREE.PlaneGeometry(0.055, 0.24), new THREE.MeshBasicMaterial({ color: 0x67e8f9, transparent: true, opacity: 0.5, depthWrite: false }));
    contWake.position.set(0, -0.20, 0.002);
    containerGroup.add(contWake);

    const contLabel = createShipLabel('🟢 EVER RADIANT', 'TRANSIT CLEARED // 14,000 TEU', '#22c55e');
    contLabel.position.set(0, 0, 0.11);
    containerGroup.add(contLabel);

    spillArea.add(containerGroup);

    // 4. COAST GUARD POLLUTION CONTROL CUTTER: ICGS SAMUDRA PRAHARI
    const cgGroup = new THREE.Group();
    cgGroup.name = 'ship';
    cgGroup.position.set(-0.18, 0.26, 0.02);
    cgGroup.rotation.z = -Math.PI * 0.58;

    const cgHullGeo = new THREE.BoxGeometry(0.038, 0.16, 0.028);
    const cgHull = new THREE.Mesh(cgHullGeo, new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.2 }));
    cgGroup.add(cgHull);

    // Coast Guard High-Visibility Orange & Navy Diagonal Sash
    const stripeGeo = new THREE.BoxGeometry(0.04, 0.024, 0.03);
    const stripe = new THREE.Mesh(stripeGeo, new THREE.MeshBasicMaterial({ color: 0xf97316 }));
    stripe.position.set(0, 0.04, 0);
    cgGroup.add(stripe);

    const cgBridge = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.04, 0.035), new THREE.MeshStandardMaterial({ color: 0xffffff }));
    cgBridge.position.set(0, -0.015, 0.03);
    cgGroup.add(cgBridge);

    // Active Incident Searchlight
    const searchlight = new THREE.PointLight(0x38bdf8, 1.8, 0.45);
    searchlight.position.set(0, 0.045, 0.035);
    cgGroup.add(searchlight);

    // Forward Water/Foam Monitor Cannon
    const cannonGeo = new THREE.CylinderGeometry(0.002, 0.002, 0.016, 6);
    cannonGeo.rotateX(Math.PI * 0.5);
    const cannon = new THREE.Mesh(cannonGeo, new THREE.MeshBasicMaterial({ color: 0xdc2626 }));
    cannon.position.set(0, 0.065, 0.02);
    cgGroup.add(cannon);

    const cgLabel = createShipLabel('🛡️ ICGS SAMUDRA PRAHARI', 'COAST GUARD POLLUTION CONTROL', '#f97316');
    cgLabel.position.set(0, 0, 0.09);
    cgGroup.add(cgLabel);

    spillArea.add(cgGroup);

    // 5. BOOM SKIMMER WORKBOAT ALPHA
    const skimmerGroup = new THREE.Group();
    skimmerGroup.name = 'ship';
    skimmerGroup.position.set(0.18, 0.24, 0.018);
    skimmerGroup.rotation.z = Math.PI * 0.42;

    const skimmerGeo = new THREE.BoxGeometry(0.026, 0.07, 0.018);
    const skimmer = new THREE.Mesh(skimmerGeo, new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.3 }));
    skimmerGroup.add(skimmer);

    const skimmerLabel = createShipLabel('🟡 SKIMMER-01', 'ACTIVE BOOM SWEEP', '#f59e0b');
    skimmerLabel.position.set(0, 0, 0.075);
    skimmerGroup.add(skimmerLabel);

    spillArea.add(skimmerGroup);

    // 6. OCEAN SALVAGE TUG: SEA GUARDIAN
    const tugGroup = new THREE.Group();
    tugGroup.name = 'ship';
    tugGroup.position.set(-0.06, -0.28, 0.018);
    tugGroup.rotation.z = -Math.PI * 0.15;

    const tugGeo = new THREE.BoxGeometry(0.032, 0.09, 0.024);
    const tug = new THREE.Mesh(tugGeo, new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.4 }));
    tugGroup.add(tug);

    const tugHouse = new THREE.Mesh(new THREE.BoxGeometry(0.024, 0.032, 0.026), new THREE.MeshStandardMaterial({ color: 0xffffff }));
    tugHouse.position.set(0, 0.015, 0.022);
    tugGroup.add(tugHouse);

    // Towing Floating Oil Bladder (Yellow cylindrical storage container)
    const bladderGeo = new THREE.CylinderGeometry(0.008, 0.008, 0.04, 10);
    bladderGeo.rotateX(Math.PI * 0.5);
    const bladder = new THREE.Mesh(bladderGeo, new THREE.MeshStandardMaterial({ color: 0xfacc15, roughness: 0.3 }));
    bladder.position.set(0, -0.09, 0.008);
    tugGroup.add(bladder);

    const tugLabel = createShipLabel('⚪ SEA GUARDIAN', 'SALVAGE & OIL RECOVERY TUG', '#94a3b8');
    tugLabel.position.set(0, 0, 0.08);
    tugGroup.add(tugLabel);

    spillArea.add(tugGroup);

    earthMesh.add(spillArea);
    spillGroupRef.current = spillArea;

    // 14. Dynamic AIS Telemetry Uplink Beam from Suspect Tanker to Satellite
    const aisLineGeo = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(0, 0, 0),
    ]);
    const aisLineMat = new THREE.LineDashedMaterial({
      color: 0x38bdf8,
      dashSize: 0.25,
      gapSize: 0.12,
      transparent: true,
      opacity: 0.75,
    });
    const aisLine = new THREE.Line(aisLineGeo, aisLineMat);
    scene.add(aisLine);

    // 15. Click / Pointer Interaction
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handlePointerDown = (event: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(
        [satGroup, spillArea, tankerGroup, chemGroup, containerGroup, cgGroup],
        true
      );

      if (intersects.length > 0) {
        let topObj: THREE.Object3D | null = intersects[0].object;
        while (topObj && topObj.parent && topObj.parent !== scene && topObj.parent !== earthMesh) {
          if (topObj.name === 'satellite' || topObj.name === 'spill' || topObj.name === 'ship') {
            break;
          }
          topObj = topObj.parent;
        }

        if (topObj && (topObj.name === 'satellite' || topObj.name === 'spill' || topObj.name === 'ship')) {
          if (onSelectEntity) {
            onSelectEntity(topObj.name as 'satellite' | 'ship' | 'spill');
          }
        }
      }
    };

    container.addEventListener('pointerdown', handlePointerDown);

    // 16. Realistic Orbital & Ocean Camera Animation Loop
    let animFrameId: number;
    const clock = new THREE.Clock();
    let lastTelemetryTime = 0;

    const animate = () => {
      animFrameId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const time = clock.getElapsedTime() * orbitSpeed;

      // Realistic Earth Rotation
      if (earthMeshRef.current) {
        earthMeshRef.current.rotation.y = time * 0.02 + Math.PI * 0.9;
      }
      // Natural Differential Cloud Parallax
      if (cloudsMeshRef.current) {
        cloudsMeshRef.current.rotation.y = time * 0.024 + Math.PI * 0.9;
      }

      // Continuous 3D Sun-Synchronous Polar LEO Satellite Orbit
      const satAngle = time * 0.38;
      const satX = ORBIT_RADIUS * Math.cos(satAngle);
      const satY = ORBIT_RADIUS * Math.sin(satAngle) * Math.sin(INCLINATION);
      const satZ = ORBIT_RADIUS * Math.sin(satAngle) * Math.cos(INCLINATION);

      if (satGroup) {
        satGroup.position.set(satX, satY, satZ);

        const nextAngle = satAngle + 0.01;
        const nextX = ORBIT_RADIUS * Math.cos(nextAngle);
        const nextY = ORBIT_RADIUS * Math.sin(nextAngle) * Math.sin(INCLINATION);
        const nextZ = ORBIT_RADIUS * Math.sin(nextAngle) * Math.cos(INCLINATION);
        const velocityVec = new THREE.Vector3(nextX - satX, nextY - satY, nextZ - satZ).normalize();

        satGroup.lookAt(satX + velocityVec.x, satY + velocityVec.y, satZ + velocityVec.z);
        satGroup.rotateZ(Math.PI * 0.15);

        if (radarBeamMeshRef.current) {
          radarBeamMeshRef.current.visible = showRadarBeam;
          radarBeamMeshRef.current.lookAt(0, 0, 0);
        }

        if (groundSwathMeshRef.current) {
          const groundNorm = new THREE.Vector3(satX, satY, satZ).normalize();
          const groundPos = groundNorm.clone().multiplyScalar(EARTH_RADIUS + 0.03);
          groundSwathMeshRef.current.position.copy(groundPos);
          groundSwathMeshRef.current.lookAt(groundPos.clone().multiplyScalar(2));
          groundSwathMeshRef.current.visible = showRadarBeam;

          const swathPulse = 1.0 + Math.sin(time * 6.0) * 0.08;
          groundSwathMeshRef.current.scale.set(swathPulse, swathPulse, 1.0);
        }

        solarWingsRef.current.forEach((wing) => {
          wing.rotation.x = Math.sin(time * 0.38) * 0.3;
        });

        beaconLightsRef.current.forEach((light) => {
          light.intensity = 0.6 + Math.sin(time * 8.0) * 1.2;
        });
      }

      // Animate Spill Pulsing Boundary & Ocean Ripples
      if (spillGroupRef.current && showSpillPulse) {
        const pulse = 1.0 + Math.sin(time * 3.8) * 0.08;
        pulseRing.scale.set(pulse, pulse, 1.0);

        if (ripple1 && ripple2) {
          const r1 = 0.2 + (time * 0.12) % 0.42;
          ripple1.scale.set(r1 / 0.2, r1 / 0.2, 1);
          (ripple1.material as THREE.MeshBasicMaterial).opacity = Math.max(0, 0.55 * (1 - (r1 - 0.2) / 0.42));

          const r2 = 0.2 + ((time * 0.12) + 0.21) % 0.42;
          ripple2.scale.set(r2 / 0.2, r2 / 0.2, 1);
          (ripple2.material as THREE.MeshBasicMaterial).opacity = Math.max(0, 0.45 * (1 - (r2 - 0.2) / 0.42));
        }
      }

      // Dynamic AIS Telemetry Uplink Beam (Ship to Satellite)
      if (showAisTrail && spillGroupRef.current && satGroup) {
        const shipWorldPos = new THREE.Vector3();
        tankerGroup.getWorldPosition(shipWorldPos);
        const satWorldPos = new THREE.Vector3();
        satGroup.getWorldPosition(satWorldPos);

        const positions = aisLine.geometry.attributes.position.array as Float32Array;
        positions[0] = shipWorldPos.x;
        positions[1] = shipWorldPos.y;
        positions[2] = shipWorldPos.z;
        positions[3] = satWorldPos.x;
        positions[4] = satWorldPos.y;
        positions[5] = satWorldPos.z;
        aisLine.geometry.attributes.position.needsUpdate = true;
        aisLine.computeLineDistances();
      }

      // Calculate Real-Time Sub-Satellite Geographic Coordinates
      if (onTelemetryUpdate && clock.getElapsedTime() - lastTelemetryTime > 0.2) {
        lastTelemetryTime = clock.getElapsedTime();
        const earthRot = earthMeshRef.current ? earthMeshRef.current.rotation.y : 0;
        const satWorld = new THREE.Vector3(satX, satY, satZ);
        satWorld.applyAxisAngle(new THREE.Vector3(0, 1, 0), -earthRot);
        const { lat, lng } = vector3ToLatLng(satWorld);

        onTelemetryUpdate({
          subSatLat: parseFloat(lat.toFixed(3)),
          subSatLng: parseFloat(lng.toFixed(3)),
          altitudeKm: 693.4,
          velocityKmS: 7.59,
          orbitalPeriodMin: 98.6,
          isScanning: showRadarBeam,
          sarFrequencyGhz: 5.405,
          swathWidthKm: 250,
          orbitCycle: 'Cycle 174 / Rel. Orbit 42',
        });
      }

      // Dynamic Camera Interpolation & Continuous Tactical Ocean Tracking
      if (cameraRef.current && controlsRef.current) {
        if (oceanViewModeRef.current && spillGroupRef.current) {
          // 1. Calculate rotating ocean world coordinates in Arabian Sea
          const spillWorld = new THREE.Vector3();
          spillGroupRef.current.getWorldPosition(spillWorld);
          const upNormal = spillWorld.clone().normalize();

          // Geographic surface tangents (East and North on Earth's curved sphere)
          const worldNorth = new THREE.Vector3(0, 1, 0);
          const eastTangent = new THREE.Vector3().crossVectors(worldNorth, upNormal).normalize();
          const northTangent = new THREE.Vector3().crossVectors(upNormal, eastTangent).normalize();

          // Low-altitude vantage point right at sea level (0.24 units up, 0.44 units along surface)
          const oceanCamPos = spillWorld.clone()
            .add(upNormal.clone().multiplyScalar(0.24))
            .add(eastTangent.clone().multiplyScalar(0.44))
            .add(northTangent.clone().multiplyScalar(-0.26));

          const oceanLookAt = spillWorld.clone().add(upNormal.clone().multiplyScalar(0.02));

          // 2. Spherical Atmospheric Descent (Great-Circle Slerp + Altitude Glide)
          // Ensures camera curves around Earth's atmosphere and NEVER cuts through the solid interior!
          const curPos = cameraRef.current.position.clone();
          const curDist = curPos.length();
          const targetDist = oceanCamPos.length();

          const curDir = curPos.clone().normalize();
          const targetDir = oceanCamPos.clone().normalize();

          const rotQuat = new THREE.Quaternion().setFromUnitVectors(curDir, targetDir);
          const slerpQuat = new THREE.Quaternion().identity().slerp(rotQuat, 0.065);
          const nextDir = curDir.clone().applyQuaternion(slerpQuat).normalize();

          // Smooth altitude transition from orbital space down to ocean waves
          const nextDist = THREE.MathUtils.lerp(curDist, targetDist, 0.055);
          const safeDist = Math.max(nextDist, EARTH_RADIUS + 0.16);

          cameraRef.current.position.copy(nextDir.multiplyScalar(safeDist));
          controlsRef.current.target.lerp(oceanLookAt, 0.065);

          // 3. Parting Clouds: Smoothly fade clouds as camera penetrates atmosphere
          if (cloudsMeshRef.current) {
            const cloudDist = safeDist - EARTH_RADIUS;
            const cloudOpacity = THREE.MathUtils.clamp((cloudDist - 0.25) / 1.8, 0.0, 0.75);
            (cloudsMeshRef.current.material as THREE.MeshStandardMaterial).opacity = cloudOpacity;
          }
        } else if (chaseModeRef.current && satGroup) {
          const satPos = satGroup.position.clone();
          const orbitDir = new THREE.Vector3(-satPos.z, 0, satPos.x).normalize();
          const camOffset = satPos
            .clone()
            .normalize()
            .multiplyScalar(2.2)
            .add(orbitDir.clone().multiplyScalar(-3.2))
            .add(new THREE.Vector3(0, 1.4, 0));

          cameraRef.current.position.lerp(satPos.clone().add(camOffset), 0.08);
          controlsRef.current.target.lerp(satPos, 0.08);

          if (cloudsMeshRef.current) {
            (cloudsMeshRef.current.material as THREE.MeshStandardMaterial).opacity = 0.75;
          }
        } else {
          // Orbital overview mode: smooth return to space
          cameraRef.current.position.lerp(targetCamPosRef.current, 0.05);
          controlsRef.current.target.lerp(targetLookAtRef.current, 0.05);

          if (cloudsMeshRef.current) {
            const curOp = (cloudsMeshRef.current.material as THREE.MeshStandardMaterial).opacity;
            (cloudsMeshRef.current.material as THREE.MeshStandardMaterial).opacity = THREE.MathUtils.lerp(curOp, 0.75, 0.05);
          }
        }
        controlsRef.current.update();
      }

      renderer.render(scene, camera);
    };

    animate();

    // 17. Resize Handler
    const handleResize = () => {
      if (!containerRef.current || !rendererRef.current || !cameraRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      container.removeEventListener('pointerdown', handlePointerDown);
      cancelAnimationFrame(animFrameId);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  // Update visibility props dynamically
  useEffect(() => {
    if (radarBeamMeshRef.current) {
      radarBeamMeshRef.current.visible = showRadarBeam;
    }
    if (groundSwathMeshRef.current) {
      groundSwathMeshRef.current.visible = showRadarBeam;
    }
  }, [showRadarBeam]);

  useEffect(() => {
    if (orbitLineRef.current) {
      orbitLineRef.current.visible = showOrbits;
    }
  }, [showOrbits]);

  useEffect(() => {
    if (cloudsMeshRef.current) {
      cloudsMeshRef.current.visible = showClouds;
    }
  }, [showClouds]);

  // Handle Camera Presets with Deep Dive into Ocean
  useEffect(() => {
    if (cameraPreset === 'orbital') {
      chaseModeRef.current = false;
      oceanViewModeRef.current = false;
      targetCamPosRef.current.set(0, 3.0, 16.0);
      targetLookAtRef.current.set(0, 0, 0);
      if (controlsRef.current) {
        controlsRef.current.minDistance = 5.8;
        controlsRef.current.maxDistance = 40.0;
      }
    } else if (cameraPreset === 'satellite') {
      chaseModeRef.current = true;
      oceanViewModeRef.current = false;
      if (controlsRef.current) {
        controlsRef.current.minDistance = 0.5;
        controlsRef.current.maxDistance = 25.0;
      }
    } else if (cameraPreset === 'spill') {
      chaseModeRef.current = false;
      oceanViewModeRef.current = true;
      if (controlsRef.current) {
        controlsRef.current.minDistance = 0.08;
        controlsRef.current.maxDistance = 4.0;
      }
    }
  }, [cameraPreset]);

  // Handle Selected Entity Focus
  useEffect(() => {
    if (selectedEntity === 'satellite') {
      chaseModeRef.current = true;
      oceanViewModeRef.current = false;
      if (controlsRef.current) {
        controlsRef.current.minDistance = 0.5;
        controlsRef.current.maxDistance = 25.0;
      }
    } else if (selectedEntity === 'spill' || selectedEntity === 'ship') {
      chaseModeRef.current = false;
      oceanViewModeRef.current = true;
      if (controlsRef.current) {
        controlsRef.current.minDistance = 0.08;
        controlsRef.current.maxDistance = 4.0;
      }
    }
  }, [selectedEntity]);

  return (
    <div className="relative w-full h-full min-h-[580px] lg:min-h-[720px] overflow-hidden select-none">
      <div ref={containerRef} className="absolute inset-0 cursor-grab active:cursor-grabbing z-0" />
    </div>
  );
};
