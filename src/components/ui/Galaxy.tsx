import React, { useEffect, useRef } from 'react';
import './Galaxy.css';

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

export const Galaxy: React.FC<GalaxyProps> = ({
  starSpeed = 0.5,
  density = 1,
  hueShift = 140,
  speed = 1,
  glowIntensity = 0.3,
  saturation = 0,
  mouseRepulsion = true,
  repulsionStrength = 2,
  twinkleIntensity = 0.3,
  rotationSpeed = 0.1,
  transparent = true,
  className = '',
  style = {}
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = containerRef.current ? containerRef.current.clientWidth : window.innerWidth);
    let height = (canvas.height = containerRef.current ? containerRef.current.clientHeight : window.innerHeight);

    const mouse = { x: width / 2, y: height / 2, targetX: width / 2, targetY: height / 2, active: false };

    const handleResize = () => {
      if (!containerRef.current || !canvas) return;
      width = canvas.width = containerRef.current.clientWidth;
      height = canvas.height = containerRef.current.clientHeight;
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      mouse.targetX = e.clientX - rect.left;
      mouse.targetY = e.clientY - rect.top;
      mouse.active = true;
    };

    const handleMouseLeave = () => {
      mouse.active = false;
    };

    window.addEventListener('resize', handleResize);
    const container = containerRef.current;
    if (container) {
      container.addEventListener('mousemove', handleMouseMove);
      container.addEventListener('mouseleave', handleMouseLeave);
    }

    // Generate Galaxy Particles
    const baseCount = Math.floor(700 * density);
    interface Particle {
      baseX: number;
      baseY: number;
      currentX: number;
      currentY: number;
      distance: number;
      angle: number;
      size: number;
      baseAlpha: number;
      alpha: number;
      twinkleSpeed: number;
      twinklePhase: number;
      colorHue: number;
    }

    const particles: Particle[] = [];
    const arms = 4;

    for (let i = 0; i < baseCount; i++) {
      const armIndex = i % arms;
      const armAngle = (armIndex * 2 * Math.PI) / arms;
      const distance = Math.random() * Math.max(width, height) * 0.6;
      const spiralAngle = distance * 0.006;

      const angle = armAngle + spiralAngle + (Math.random() - 0.5) * 0.5;
      const x = Math.cos(angle) * distance;
      const y = Math.sin(angle) * distance;

      particles.push({
        baseX: x,
        baseY: y,
        currentX: x,
        currentY: y,
        distance,
        angle,
        size: Math.random() * 2.8 + 0.8,
        baseAlpha: Math.random() * 0.8 + 0.2,
        alpha: Math.random() * 0.8 + 0.2,
        twinkleSpeed: (Math.random() * 0.05 + 0.01) * speed,
        twinklePhase: Math.random() * Math.PI * 2,
        colorHue: (hueShift + (Math.random() - 0.5) * 60 + 360) % 360,
      });
    }

    let time = 0;

    const render = () => {
      time += 0.01 * speed;

      mouse.x += (mouse.targetX - mouse.x) * 0.08;
      mouse.y += (mouse.targetY - mouse.y) * 0.08;

      ctx.clearRect(0, 0, width, height);

      if (!transparent) {
        ctx.fillStyle = '#090d16';
        ctx.fillRect(0, 0, width, height);
      }

      const centerX = width / 2;
      const centerY = height / 2;
      const currentRotation = time * rotationSpeed;

      // Render Galaxy Core Glow
      if (glowIntensity > 0) {
        const coreGradient = ctx.createRadialGradient(
          centerX,
          centerY,
          0,
          centerX,
          centerY,
          Math.min(width, height) * 0.45
        );
        const coreHue = (hueShift + 360) % 360;
        coreGradient.addColorStop(0, `hsla(${coreHue}, 80%, 70%, ${glowIntensity * 0.6})`);
        coreGradient.addColorStop(0.4, `hsla(${coreHue}, 70%, 50%, ${glowIntensity * 0.25})`);
        coreGradient.addColorStop(1, 'rgba(0,0,0,0)');

        ctx.fillStyle = coreGradient;
        ctx.fillRect(0, 0, width, height);
      }

      // Render Galaxy Star Field Particles
      particles.forEach((p) => {
        const rotatedAngle = p.angle + currentRotation;
        let px = centerX + Math.cos(rotatedAngle) * p.distance;
        let py = centerY + Math.sin(rotatedAngle) * p.distance;

        // Apply Mouse Repulsion if enabled
        if (mouseRepulsion && mouse.active) {
          const dx = px - mouse.x;
          const dy = py - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const maxDist = 200 * repulsionStrength;

          if (dist < maxDist && dist > 0) {
            const force = (1 - dist / maxDist) * 45 * repulsionStrength;
            px += (dx / dist) * force;
            py += (dy / dist) * force;
          }
        }

        // Twinkle Effect
        p.twinklePhase += p.twinkleSpeed * starSpeed;
        const twinkleFactor = Math.sin(p.twinklePhase) * twinkleIntensity;
        p.alpha = Math.max(0.15, Math.min(1.0, p.baseAlpha + twinkleFactor));

        // Draw Star Particle
        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = `hsl(${p.colorHue}, ${saturation > 0 ? saturation : 85}%, 80%)`;

        ctx.beginPath();
        ctx.arc(px, py, p.size, 0, Math.PI * 2);
        ctx.fill();

        // Extra outer halo for larger stars
        if (p.size > 2.0 && glowIntensity > 0) {
          ctx.globalAlpha = p.alpha * glowIntensity * 0.6;
          ctx.beginPath();
          ctx.arc(px, py, p.size * 3.0, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      if (container) {
        container.removeEventListener('mousemove', handleMouseMove);
        container.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, [starSpeed, density, hueShift, speed, glowIntensity, saturation, mouseRepulsion, repulsionStrength, twinkleIntensity, rotationSpeed, transparent]);

  return (
    <div ref={containerRef} className={`galaxy-container ${className}`} style={style}>
      <canvas ref={canvasRef} />
    </div>
  );
};

export default Galaxy;
