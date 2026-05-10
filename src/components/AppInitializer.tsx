'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/store/auth';
import { useCartStore } from '@/store/cart';

function usePatternMouseParallax() {
  useEffect(() => {
    // Desktop only (mouse pointer device)
    if (!window.matchMedia('(pointer: fine)').matches) return;

    let rafId: number;
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;

    const STRENGTH = 14; // max pixel offset
    const EASE = 0.06;   // lerp factor — lower = smoother/slower

    function onMove(e: MouseEvent) {
      // Offset from viewport centre, normalised to [-1, 1]
      const nx = (e.clientX / window.innerWidth  - 0.5) * 2;
      const ny = (e.clientY / window.innerHeight - 0.5) * 2;
      targetX = nx * STRENGTH;
      targetY = ny * STRENGTH;
    }

    function tick() {
      currentX += (targetX - currentX) * EASE;
      currentY += (targetY - currentY) * EASE;
      document.documentElement.style.setProperty('--pattern-mx', currentX.toFixed(2));
      document.documentElement.style.setProperty('--pattern-my', currentY.toFixed(2));
      rafId = requestAnimationFrame(tick);
    }

    window.addEventListener('mousemove', onMove, { passive: true });
    rafId = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(rafId);
      document.documentElement.style.removeProperty('--pattern-mx');
      document.documentElement.style.removeProperty('--pattern-my');
    };
  }, []);
}

export default function AppInitializer() {
  useEffect(() => {
    const init = useAuthStore.getState().initialize;
    init().then(() => {
      // If user is authenticated, sync local cart to server
      const user = useAuthStore.getState().user;
      if (user && !user.isGuest) {
        useCartStore.getState().syncToServer();
      }
    }).catch(() => {
      // Initialization failed — app will work in degraded mode
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  usePatternMouseParallax();

  return null;
}
