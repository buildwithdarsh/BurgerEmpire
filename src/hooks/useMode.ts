'use client';

import { useModeStore, type Mode } from '@/store/mode';

export function useMode() {
  const mode = useModeStore((s) => s.mode);
  const isTransitioning = useModeStore((s) => s.isTransitioning);
  const toggleMode = useModeStore((s) => s.toggleMode);
  const setMode = useModeStore((s) => s.setMode);

  const isClassic = mode === 'classic';
  const isHealthy = mode === 'healthy';

  return { mode, isClassic, isHealthy, isTransitioning, toggleMode, setMode };
}

export function getModeValue<T>(mode: Mode, classic: T, healthy: T): T {
  return mode === 'classic' ? classic : healthy;
}
