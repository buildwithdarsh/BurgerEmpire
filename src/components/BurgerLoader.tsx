'use client';

import { useState, useEffect } from 'react';
import type { Mode } from '@/store/mode';

// Module-level: survives React Strict Mode's effect cleanup/re-run cycle.
// Timers are stored here so the cleanup function cannot cancel them on remount.
let _fadeTimer: ReturnType<typeof setTimeout> | null = null;
let _hideTimer: ReturnType<typeof setTimeout> | null = null;

/** True only on a hard refresh — when the full-screen loader actually played. */
export let loaderDidRun = false;

export default function BurgerLoader({ initialMode }: { initialMode: Mode }) {
  const [visible, setVisible] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);
  const isClassic = initialMode === 'classic';

  useEffect(() => {
    // Already scheduled (Strict Mode remount) — just re-lock scroll and wait.
    if (_fadeTimer !== null || _hideTimer !== null) {
      document.body.style.overflow = 'hidden';
      return () => { document.body.style.overflow = ''; };
    }

    document.body.style.overflow = 'hidden';
    loaderDidRun = true;

    _fadeTimer = setTimeout(() => {
      setFadeOut(true);
    }, 3500);

    _hideTimer = setTimeout(() => {
      setVisible(false);
      document.body.style.overflow = '';
      _fadeTimer = null;
      _hideTimer = null;
      loaderDidRun = false;
    }, 4000);

    // Cleanup: only release scroll lock — intentionally do NOT clear the
    // module-level timers so Strict Mode cannot restart the sequence.
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center transition-opacity duration-500 ${
        fadeOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
      style={{ backgroundColor: isClassic ? '#1A1A1A' : '#1C2B1E' }}
    >
      {/* Glow ring behind burger */}
      <div
        className="absolute rounded-full blur-[80px] animate-[breathe_2s_ease-in-out_infinite]"
        style={{
          width: 280,
          height: 280,
          backgroundColor: isClassic
            ? 'rgba(235, 122, 41, 0.25)'
            : 'rgba(74, 160, 86, 0.25)',
        }}
      />

      {/* Burger SVG */}
      <div className="relative w-48 h-48 sm:w-56 sm:h-56">
        <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Top bun */}
          <g className="animate-[loaderBounce_1.6s_ease-in-out_infinite]" style={{ animationDelay: '0s' }}>
            <path
              d="M40 90 C40 50, 160 50, 160 90 L160 95 L40 95 Z"
              fill={isClassic ? '#E8A84C' : '#A3C585'}
              stroke={isClassic ? '#C4852A' : '#7BA35E'}
              strokeWidth="2"
            />
            {isClassic ? (
              <>
                <ellipse cx="80" cy="72" rx="4" ry="2.5" fill="#F5E6C8" transform="rotate(-20 80 72)" />
                <ellipse cx="110" cy="68" rx="4" ry="2.5" fill="#F5E6C8" transform="rotate(15 110 68)" />
                <ellipse cx="95" cy="62" rx="4" ry="2.5" fill="#F5E6C8" transform="rotate(-5 95 62)" />
                <ellipse cx="125" cy="78" rx="3.5" ry="2" fill="#F5E6C8" transform="rotate(10 125 78)" />
                <ellipse cx="70" cy="82" rx="3.5" ry="2" fill="#F5E6C8" transform="rotate(-10 70 82)" />
              </>
            ) : (
              <>
                <line x1="75" y1="65" x2="90" y2="80" stroke="#8AB86A" strokeWidth="1.5" opacity="0.6" />
                <line x1="110" y1="62" x2="120" y2="78" stroke="#8AB86A" strokeWidth="1.5" opacity="0.6" />
                <line x1="95" y1="58" x2="100" y2="75" stroke="#8AB86A" strokeWidth="1.5" opacity="0.6" />
              </>
            )}
          </g>

          {/* Lettuce / greens */}
          <g className="animate-[loaderBounce_1.6s_ease-in-out_infinite]" style={{ animationDelay: '0.1s' }}>
            <path
              d="M35 97 Q50 90, 60 97 Q70 104, 80 97 Q90 90, 100 97 Q110 104, 120 97 Q130 90, 140 97 Q150 104, 165 97 L165 103 Q150 110, 140 103 Q130 96, 120 103 Q110 110, 100 103 Q90 96, 80 103 Q70 110, 60 103 Q50 96, 35 103 Z"
              fill={isClassic ? '#4CAF50' : '#6DBF47'}
            />
          </g>

          {/* Cheese (classic) or avocado (healthy) */}
          <g className="animate-[loaderBounce_1.6s_ease-in-out_infinite]" style={{ animationDelay: '0.2s' }}>
            <path
              d="M38 105 L162 105 L162 113 Q150 120, 140 113 L38 113 Z"
              fill={isClassic ? '#FFD54F' : '#8BC34A'}
              opacity="0.9"
            />
          </g>

          {/* Patty */}
          <g className="animate-[loaderBounce_1.6s_ease-in-out_infinite]" style={{ animationDelay: '0.3s' }}>
            <rect
              x="38" y="115" width="124" height="20" rx="10"
              fill={isClassic ? '#5D3A1A' : '#6D8B4E'}
              stroke={isClassic ? '#3E2712' : '#4A6B34'}
              strokeWidth="1.5"
            />
            <line x1="55" y1="120" x2="55" y2="130" stroke={isClassic ? '#3E2712' : '#4A6B34'} strokeWidth="1" opacity="0.3" />
            <line x1="80" y1="120" x2="80" y2="130" stroke={isClassic ? '#3E2712' : '#4A6B34'} strokeWidth="1" opacity="0.3" />
            <line x1="105" y1="120" x2="105" y2="130" stroke={isClassic ? '#3E2712' : '#4A6B34'} strokeWidth="1" opacity="0.3" />
            <line x1="130" y1="120" x2="130" y2="130" stroke={isClassic ? '#3E2712' : '#4A6B34'} strokeWidth="1" opacity="0.3" />
          </g>

          {/* Tomato / beetroot */}
          <g className="animate-[loaderBounce_1.6s_ease-in-out_infinite]" style={{ animationDelay: '0.35s' }}>
            <rect
              x="42" y="137" width="116" height="8" rx="4"
              fill={isClassic ? '#E53935' : '#C62828'}
              opacity="0.85"
            />
          </g>

          {/* Bottom bun */}
          <g className="animate-[loaderBounce_1.6s_ease-in-out_infinite]" style={{ animationDelay: '0.4s' }}>
            <path
              d="M38 147 L162 147 L162 155 C162 165, 40 165, 40 155 Z"
              fill={isClassic ? '#E8A84C' : '#A3C585'}
              stroke={isClassic ? '#C4852A' : '#7BA35E'}
              strokeWidth="2"
            />
          </g>
        </svg>
      </div>

      {/* Brand text */}
      <div className="mt-6 text-center animate-[slideInUp_0.6s_ease-out_0.3s_both]">
        <div
          className="text-3xl sm:text-4xl font-bold tracking-tight"
          style={{
            fontFamily: "var(--font-hero)",
            color: isClassic ? '#EB7A29' : '#A3C585',
          }}
        >
          Burger Empire
        </div>
        <p
          className="mt-2 text-sm tracking-[0.25em] uppercase"
          style={{
            fontFamily: "var(--font-body)",
            color: isClassic
              ? 'rgba(235, 122, 41, 0.5)'
              : 'rgba(163, 197, 133, 0.5)',
          }}
        >
          {isClassic ? 'Smash Burgers Done Right' : 'Wholesome & Delicious'}
        </p>
      </div>

      {/* Loading dots */}
      <div className="mt-8 flex gap-2">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="block w-2 h-2 rounded-full animate-[loaderDot_1.2s_ease-in-out_infinite]"
            style={{
              backgroundColor: isClassic ? '#EB7A29' : '#A3C585',
              animationDelay: `${i * 0.2}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
