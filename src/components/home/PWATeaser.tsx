'use client';

import { useState, useEffect, useRef } from 'react';
import { useMode } from '@/hooks/useMode';
import { motion, AnimatePresence } from 'framer-motion';

const smoothEase = [0.16, 1, 0.3, 1] as const;

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function PWATeaser() {
  const { isClassic } = useMode();
  const [visible, setVisible] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const deferredPromptRef = useRef<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    // SSR guard — all window/localStorage access is inside useEffect
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    const isDismissed = localStorage.getItem('pwa_banner_dismissed') === 'true';

    if (isStandalone || isDismissed) return;

    setVisible(true);

    const handler = (e: Event) => {
      e.preventDefault();
      deferredPromptRef.current = e as BeforeInstallPromptEvent;
    };

    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleDismiss = () => {
    localStorage.setItem('pwa_banner_dismissed', 'true');
    setVisible(false);
  };

  const handleInstall = async () => {
    if (deferredPromptRef.current) {
      await deferredPromptRef.current.prompt();
      const { outcome } = await deferredPromptRef.current.userChoice;
      if (outcome === 'accepted') {
        setVisible(false);
      }
      deferredPromptRef.current = null;
    } else {
      // No native prompt available — show tooltip
      setShowTooltip(true);
      setTimeout(() => setShowTooltip(false), 4000);
    }
  };

  const accent = isClassic ? '#EB7A29' : '#4AA056';
  const bg = isClassic ? '#1A1A1A' : '#1C2B1E';

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="py-4 px-5 transition-colors duration-500"
          style={{ backgroundColor: bg }}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 40 }}
          transition={{ duration: 0.5, ease: smoothEase }}
        >
          <div className="max-w-[1200px] mx-auto flex items-center justify-between gap-3">
            {/* Left side: icon + text */}
            <div className="flex items-center gap-3 min-w-0">
              {/* Phone inline SVG icon */}
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="flex-shrink-0">
                <rect x="4" y="1" width="12" height="18" rx="2.5" stroke="white" strokeWidth="1.5" fill="none" />
                <circle cx="10" cy="16" r="1" fill="white" />
                <rect x="7" y="3" width="6" height="1" rx="0.5" fill="white" opacity={0.4} />
              </svg>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-white truncate">
                  Add Burger Empire to your home screen
                </p>
                <p className="text-xs hidden sm:block" style={{ color: 'rgba(255,255,255,0.65)' }}>
                  Get the full app experience — fast, offline-ready
                </p>
              </div>
            </div>

            {/* Right side: install + dismiss */}
            <div className="flex items-center gap-2 flex-shrink-0 relative">
              <motion.button
                onClick={handleInstall}
                className="px-5 py-2 rounded-xl text-xs font-bold transition-all duration-200"
                style={{ backgroundColor: accent, color: isClassic ? '#1A1A1A' : '#FFFFFF' }}
                whileHover={{ scale: 1.04, y: -1 }}
                whileTap={{ scale: 0.97 }}
              >
                Install
              </motion.button>

              {/* Dismiss button */}
              <button
                onClick={handleDismiss}
                className="p-1.5 rounded-lg transition-colors duration-200"
                style={{ color: 'rgba(255,255,255,0.6)' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.7)')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.6)')}
                aria-label="Dismiss install banner"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M4.5 4.5L11.5 11.5M11.5 4.5L4.5 11.5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              </button>

              {/* Tooltip for manual install */}
              <AnimatePresence>
                {showTooltip && (
                  <motion.div
                    className="absolute bottom-full right-0 mb-2 px-3 py-2 rounded-lg text-xs text-white max-w-[220px] text-center"
                    style={{ backgroundColor: isClassic ? '#2C2C2C' : '#2D4A35' }}
                    initial={{ opacity: 0, y: 6, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                  >
                    Tap your browser&apos;s menu → Add to Home Screen
                    {/* Tooltip arrow */}
                    <div
                      className="absolute top-full right-6 w-0 h-0"
                      style={{
                        borderLeft: '5px solid transparent',
                        borderRight: '5px solid transparent',
                        borderTop: `5px solid ${isClassic ? '#2C2C2C' : '#2D4A35'}`,
                      }}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
