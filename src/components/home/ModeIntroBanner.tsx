'use client';

import { useState, useEffect } from 'react';
import { useMode } from '@/hooks/useMode';
import { LeafIcon } from '../icons';

export default function ModeIntroBanner() {
  const { isClassic, toggleMode } = useMode();
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const shown = sessionStorage.getItem('bb-mode-banner-shown');
    if (shown) return;

    const showTimer = setTimeout(() => setVisible(true), 2000);
    const hideTimer = setTimeout(() => {
      setVisible(false);
      setDismissed(true);
      sessionStorage.setItem('bb-mode-banner-shown', 'true');
    }, 8000);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  if (dismissed || !visible) return null;

  return (
    <div
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-6 py-4 rounded-2xl max-w-md w-[90%] text-center cursor-pointer border border-white/10"
      style={{
        backgroundColor: isClassic ? '#1A1A1A' : '#FFFFFF',
        color: isClassic ? '#EB7A29' : '#3D8A48',
        animation: 'bannerSlideIn 500ms var(--bounce-entry), jiggle 500ms 600ms',
      }}
      onClick={() => {
        toggleMode();
        setVisible(false);
        setDismissed(true);
        sessionStorage.setItem('bb-mode-banner-shown', 'true');
      }}
    >
      <p className="font-heading font-bold text-sm flex items-center justify-center gap-2">
        Psst — flip to <LeafIcon size={16} /> HEALTHY MODE and taste clean eating that actually slaps!
      </p>
      <p className="text-xs mt-1" style={{ color: isClassic ? '#C8922E' : '#3D6E4D' }}>Tap to switch instantly</p>
    </div>
  );
}
