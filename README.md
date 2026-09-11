# 🛰️ TraceX | Maritime Oil-Spill Forensic Attribution & Intelligence

<div align="center">

![TraceX Platform Banner](https://img.shields.io/badge/Platform-TraceX%20v2.4-blueviolet?style=for-the-badge&logo=satellite)
![License](https://img.shields.io/badge/License-MIT-emerald?style=for-the-badge)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?style=for-the-badge&logo=typescript)
![React](https://img.shields.io/badge/React-19-cyan?style=for-the-badge&logo=react)
![Three.js](https://img.shields.io/badge/Three.js-WebGL-black?style=for-the-badge&logo=three.js)
![Status](https://img.shields.io/badge/Status-Operational-success?style=for-the-badge)

**Next-Generation Multi-Modal Forensic Attribution Decision-Support Platform**  
*SIH26143 / NTRO Space Technology & Maritime Surveillance Division*

</div>

---

## 🌊 Overview

**TraceX** is an AI-powered maritime oil-spill forensic investigation platform engineered for maritime defense, environmental tribunals, and coast guard operations. By synthesizing **Sentinel-1 C-SAR radar satellite telemetry**, **Lagrangian ocean hydrodynamics**, and **global AIS transponder kinematics**, TraceX unmasks illegal bilge dumping and vessel discharge events, providing court-admissible cryptographic evidence dossiers.

---

## ⚡ Key Architectural Pillars

### 1. 🌍 Photorealistic 3D Planetary & Orbital Twin
- **NASA Blue Marble High-Res Textures**: Photorealistic planetary rendering with surface topography, specular ocean reflections, and dynamic cloud shadow layers.
- **Atmospheric Rayleigh Scattering**: Multi-layered volumetric atmosphere with realistic day/night terminator and nighttime urban light illumination.
- **Orbital Satellite Navigation**: Animated Sentinel-1 SAR satellite orbit simulation with an interactive camera dive directly from low-Earth orbit into the ocean slick coordinates.

### 2. 🗺️ Tactical Ocean Operations Map (Deep Space Theme)
- **Multi-Basemap GIS Engine**: Dual space basemap support featuring **Tactical Navy (CartoDB Dark Matter)** and **Orbital Satellite (Esri World Imagery)**.
- **Dynamic Hydrodynamic Layers**: Real-time visualization of observed SAR oil spill contours, reconstructed origin probability ellipses, and Monte Carlo drift particles.
- **Kinematic Anomaly Markers**: Automated detection of dark-ship transponder blackout windows, AIS gaps, and sustained deceleration events.

### 3. 🕸️ Celestial Constellation Evidence Graph (TraceX Policy Platform v2.4)
- **Radiant Golden Sun Core**: Central *"Constitution / Forensic Origin Core"* featuring 42 spiky golden coronal rays, multi-ring concentric aura, and confidence badges.
- **Volumetric Tapered Sunbeam Flares**: Flared golden-to-neon energy beam polygons connecting the core to primary hubs with dual-pass Gaussian glow and traveling white photon pulses.
- **Glossy 3D Spherical Pearl Hubs**: Rendered with multi-stop radial sphere gradients, metallic bevel rims, and rounded percentage attribution badges.
- **Branching Satellite Leaf Nodes**: Interconnected fiber-optic stems with numerical sensor telemetry badges (`#24`, `#18`, `#35`, `#40`, etc.).
- **Forensic Timeline Rail**: Vertical epoch scrubber ($2017 \to 2024$) with active pulse highlights on discharge inception windows ($T_{-3h}$).
- **Interactive Constellation Simulation**: Real-time simulation trigger propagating energetic pulse waves through the constellation graph.

### 4. ⚖️ Abductive Multi-Hypothesis & Falsification Engine (TraceX 2.0)
- **Competing Hypothesis Framework**: Formulates mutually exclusive causal explanations ($H_1 \dots H_4$) spanning vessel illegal discharge, in-transit offloads, subsea pipeline leaks, and natural biogenic films.
- **Physics-Constrained Falsification**: Automatically tests each hypothesis against hydrodynamic constraints, drafts, and radar polarizations.
- **Bifurcated Dual Evidence Accounting Ledger**: Segregates evidence into **Supporting Evidence ($E^+$)** and **Contradictory Evidence ($E^-$)** ledgers to eliminate tribunal automation bias.

### 5. 🎲 Monte Carlo Stochastic Physics & Forward Forecasting
- **Stochastic Ensemble Modeling**: Executes 200–500 particle perturbation runs with adjustable ocean current variance ($\pm 20\%$), wind leeway ($1.0\% - 5.0\%$), and release window offsets.
- **Court-Admissible Confidence Envelopes**: Computes ensemble overlap rates, Intersection over Union (IoU), stochastic dispersion radii, and centroid shifts.
- **Forward Ecological Risk Forecasting**: Projects slick trajectory forward ($+6h$ to $+48h$) to predict threats to marine sanctuaries, fishery zones, and coastal desalination intakes.

### 6. ⏪ Rewind the Ocean Engine & Counterfactual Studio
- **Lagrangian Reverse Advection**: Scrub backward in time ($T_0 \to T_{-8h}$) to trace spill dispersion back to its geographic source coordinates.
- **Automated Origin Rendezvous Alert**: Detects spatiotemporal intersections between suspect vessel paths and origin probability ellipses.
- **Counterfactual Simulation Studio**: Side-by-side and overlay comparison between observed satellite radar masks and forward simulated plumes.

### 7. 📡 Satellite SAR & Optical Lab
- **Dual-Polarization Decomposition**: Sentinel-1 C-band VV (Co-Pol) and VH (Cross-Pol) normalized radar cross-section damping analysis.
- **Dielectric Threshold Segmentation**: Interactive slider controls for dielectric contrast extraction and volumetric slick footprint estimation ($m^3$).

### 8. 🛡️ Certified Forensic Intelligence Dossier
- **Cryptographic Provenance**: SHA-256 Merkle root hashing of SAR scenes, AIS feeds, and oceanic physics slices.
- **Tribunal Admissibility**: Formatted for compliance with **MARPOL Annex I Regulation 15** proceedings and international maritime arbitration.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Core Framework** | [React 19](https://react.dev/), [TypeScript 5](https://www.typescriptlang.org/), [Vite](https://vitejs.dev/) |
| **Styling & Theme** | [Tailwind CSS v4](https://tailwindcss.com/), Cyberpunk Slate & Space Dark Palette |
| **3D & WebGL** | [Three.js](https://threejs.org/), Custom GLSL Shaders, NASA Blue Marble Maps |
| **Cartography & GIS** | [Leaflet](https://leafletjs.com/), CartoDB Dark Matter, Esri World Imagery |
| **Icons & UI** | [Lucide React](https://lucide.dev/), Glassmorphic Canvas Design System |
| **Physics Simulation**| Custom Lagrangian Advection Engine, 500-Run Monte Carlo Perturbation |

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: `v18.0.0` or higher
- **npm**: `v9.0.0` or higher

### Installation

```bash
# Clone the repository
git clone https://github.com/srixram08/TraceX.git

# Navigate to project root
cd TraceX

# Install project dependencies
npm install
```

### Development Server

```bash
# Launch the Vite live development server
npm run dev
```
Open your browser and navigate to `http://localhost:5173/`.

### Production Build

```bash
# Type-check and compile optimized production bundle
npm run build

# Preview production build locally
npm run preview
```

---

## 🔒 Security & Provenance

All forensic evidence generated within TraceX is hashed using standard **SHA-256** cryptographic primitives to establish an unalterable chain of custody for maritime judicial proceedings.

---

<div align="center">
  <sub>Developed for Smart India Hackathon (SIH26143) • National Technical Research Organisation (NTRO) Track</sub>
</div>
