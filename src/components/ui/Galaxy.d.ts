import React from 'react';

export interface GalaxyProps {
  starSpeed?: number;
  density?: number;
  hueShift?: number;
  speed?: number;
  glowIntensity?: number;
  saturation?: number;
  mouseRepulsion?: boolean;
  repulsionStrength?: number;
  twinkleIntensity?: number;
  rotationSpeed?: number;
  transparent?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

declare const Galaxy: React.FC<GalaxyProps>;
export default Galaxy;
