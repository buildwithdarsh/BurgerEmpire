'use client';

import { useEffect, useRef } from 'react';
import { useModeStore, type Mode } from '@/store/mode';
import { classicPatternUri, healthyPatternUri } from './FloatingBackground';

export default function ModeProvider({
  children,
  initialMode,
}: {
  children: React.ReactNode;
  initialMode: Mode;
}) {
  const mode = useModeStore((s) => s.mode);
  const setMode = useModeStore((s) => s.setMode);
  const isClassic = mode === 'classic';
  const initialized = useRef(false);

  // Seed the store with the server-read cookie value on first mount
  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;
      setMode(initialMode);
    }
  }, [initialMode, setMode]);

  return (
    <div
      data-mode={mode}
      className="mode-transition min-h-screen"
      style={{
        '--pattern-url': isClassic ? classicPatternUri : healthyPatternUri,
      } as React.CSSProperties}
    >
      {children}
    </div>
  );
}
