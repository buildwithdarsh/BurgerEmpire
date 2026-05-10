'use client';

import { useEffect, useRef } from 'react';
import { useMode } from '@/hooks/useMode';
import { useReducedMotion } from '@/hooks/useReducedMotion';

interface Particle {
  x: number;
  y: number;
  size: number;
  speedY: number;
  speedX: number;
  rotation: number;
  rotationSpeed: number;
  opacity: number;
  type: 'seed' | 'leaf';
}

export default function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { isClassic } = useMode();
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    const particles: Particle[] = [];
    const maxParticles = 20;

    function resize() {
      canvas!.width = window.innerWidth;
      canvas!.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    function createParticle(): Particle {
      return {
        x: Math.random() * canvas!.width,
        y: canvas!.height + 20,
        size: 3 + Math.random() * 6,
        speedY: -(0.3 + Math.random() * 0.7),
        speedX: (Math.random() - 0.5) * 0.5,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.02,
        opacity: 0.3 + Math.random() * 0.4,
        type: isClassic ? 'seed' : 'leaf',
      };
    }

    function drawSeed(p: Particle) {
      ctx!.save();
      ctx!.translate(p.x, p.y);
      ctx!.rotate(p.rotation);
      ctx!.globalAlpha = p.opacity;
      ctx!.fillStyle = '#F5E6C4';
      ctx!.beginPath();
      ctx!.ellipse(0, 0, p.size * 0.4, p.size, 0, 0, Math.PI * 2);
      ctx!.fill();
      ctx!.restore();
    }

    function drawLeaf(p: Particle) {
      ctx!.save();
      ctx!.translate(p.x, p.y);
      ctx!.rotate(p.rotation);
      ctx!.globalAlpha = p.opacity;
      ctx!.fillStyle = '#7BC47F';
      ctx!.beginPath();
      ctx!.ellipse(0, 0, p.size * 0.5, p.size, 0, 0, Math.PI * 2);
      ctx!.fill();
      // Leaf vein
      ctx!.strokeStyle = '#5AA35E';
      ctx!.lineWidth = 0.5;
      ctx!.beginPath();
      ctx!.moveTo(0, -p.size);
      ctx!.lineTo(0, p.size);
      ctx!.stroke();
      ctx!.restore();
    }

    function animate() {
      ctx!.clearRect(0, 0, canvas!.width, canvas!.height);

      if (particles.length < maxParticles && Math.random() < 0.05) {
        particles.push(createParticle());
      }

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.y += p.speedY;
        p.x += p.speedX;
        p.rotation += p.rotationSpeed;

        if (p.y < -20) {
          particles.splice(i, 1);
          continue;
        }

        if (p.type === 'seed') {
          drawSeed(p);
        } else {
          drawLeaf(p);
        }
      }

      animId = requestAnimationFrame(animate);
    }

    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, [isClassic, reducedMotion]);

  if (reducedMotion) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: 0.6 }}
    />
  );
}
