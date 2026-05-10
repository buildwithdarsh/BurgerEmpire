'use client';

import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

const CLASSIC_STEPS = [
  'Preparing your order…',
  'Sending to the kitchen…',
  'Almost there…',
  'Hang tight…',
];

const HEALTHY_STEPS = [
  'Crafting your wholesome order…',
  'Alerting the kitchen…',
  'Almost ready…',
  'Just a moment…',
];

interface Props {
  isPlacing: boolean;
  isClassic: boolean;
}

export default function PlacingOrderLoader({ isPlacing, isClassic }: Props) {
  const [stepIndex, setStepIndex] = useState(0);
  const [animating, setAnimating] = useState<'in' | 'out'>('in');
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const steps = isClassic ? CLASSIC_STEPS : HEALTHY_STEPS;
  const accent = isClassic ? '#EB7A29' : '#A3C585';
  const bg = isClassic ? '#1A1A1A' : '#1C2B1E';
  const glowColor = isClassic ? 'rgba(235,122,41,0.22)' : 'rgba(74,160,86,0.22)';
  const ringColor = isClassic ? 'rgba(235,122,41,0.5)' : 'rgba(74,160,86,0.5)';
  const steamColor = isClassic ? 'rgba(255,200,100,0.5)' : 'rgba(163,197,133,0.5)';

  useEffect(() => {
    if (!isPlacing) {
      setStepIndex(0);
      setAnimating('in');
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }

    setStepIndex(0);
    setAnimating('in');

    intervalRef.current = setInterval(() => {
      setAnimating('out');
      setTimeout(() => {
        setStepIndex((i) => (i + 1) % steps.length);
        setAnimating('in');
      }, 350);
    }, 2400);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPlacing, steps.length]);

  if (!isPlacing) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center"
      style={{ backgroundColor: bg }}
    >
      {/* Pulse glow orb */}
      <div
        className="absolute rounded-full"
        style={{
          width: 320,
          height: 320,
          backgroundColor: glowColor,
          filter: 'blur(72px)',
          animation: 'pulseGlow 2.2s ease-in-out infinite',
        }}
      />

      {/* Spinning ring */}
      <div
        className="absolute rounded-full"
        style={{
          width: 220,
          height: 220,
          border: `2px solid transparent`,
          borderTopColor: ringColor,
          borderRightColor: ringColor,
          animation: 'spinRing 1.8s linear infinite',
        }}
      />
      {/* Inner counter-spin ring */}
      <div
        className="absolute rounded-full"
        style={{
          width: 196,
          height: 196,
          border: `1.5px solid transparent`,
          borderBottomColor: ringColor,
          borderLeftColor: ringColor,
          opacity: 0.5,
          animation: 'spinRing 2.6s linear infinite reverse',
        }}
      />

      {/* Burger SVG + steam */}
      <div className="relative" style={{ width: 160, height: 190 }}>
        {/* Steam wisps */}
        {[38, 60, 82].map((x, i) => (
          <svg
            key={x}
            className="absolute"
            style={{
              top: 0,
              left: x,
              width: 20,
              height: 36,
              animation: `steamRise 1.6s ease-in-out infinite`,
              animationDelay: `${i * 0.45}s`,
            }}
            viewBox="0 0 20 36"
            fill="none"
          >
            <path
              d="M10 36 C6 28, 14 20, 10 12 C6 4, 14 0, 10 0"
              stroke={steamColor}
              strokeWidth="2.5"
              strokeLinecap="round"
              fill="none"
            />
          </svg>
        ))}

        {/* Burger body */}
        <svg
          viewBox="0 0 160 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ position: 'absolute', bottom: 0, width: 160, height: 120 }}
        >
          {/* Top bun */}
          <g style={{ animation: 'loaderBounce 1.6s ease-in-out infinite', animationDelay: '0s' }}>
            <path
              d="M18 52 C18 20, 142 20, 142 52 L142 58 L18 58 Z"
              fill={isClassic ? '#E8A84C' : '#A3C585'}
              stroke={isClassic ? '#C4852A' : '#7BA35E'}
              strokeWidth="1.5"
            />
            {isClassic ? (
              <>
                <ellipse cx="55" cy="38" rx="4" ry="2.5" fill="#F5E6C8" transform="rotate(-20 55 38)" />
                <ellipse cx="80" cy="33" rx="4" ry="2.5" fill="#F5E6C8" transform="rotate(15 80 33)" />
                <ellipse cx="105" cy="38" rx="3.5" ry="2" fill="#F5E6C8" transform="rotate(10 105 38)" />
              </>
            ) : (
              <>
                <line x1="55" y1="32" x2="65" y2="48" stroke="#8AB86A" strokeWidth="1.5" opacity="0.6" />
                <line x1="80" y1="28" x2="85" y2="46" stroke="#8AB86A" strokeWidth="1.5" opacity="0.6" />
                <line x1="105" y1="32" x2="112" y2="46" stroke="#8AB86A" strokeWidth="1.5" opacity="0.6" />
              </>
            )}
          </g>

          {/* Lettuce */}
          <g style={{ animation: 'loaderBounce 1.6s ease-in-out infinite', animationDelay: '0.1s' }}>
            <path
              d="M14 60 Q26 53, 36 60 Q46 67, 56 60 Q66 53, 80 60 Q94 67, 104 60 Q114 53, 124 60 Q134 67, 146 60 L146 66 Q134 73, 124 66 Q114 59, 104 66 Q94 73, 80 66 Q66 59, 56 66 Q46 73, 36 66 Q26 59, 14 66 Z"
              fill={isClassic ? '#4CAF50' : '#6DBF47'}
            />
          </g>

          {/* Cheese / avocado */}
          <g style={{ animation: 'loaderBounce 1.6s ease-in-out infinite', animationDelay: '0.2s' }}>
            <path
              d="M16 68 L144 68 L144 76 Q132 83, 124 76 L16 76 Z"
              fill={isClassic ? '#FFD54F' : '#8BC34A'}
              opacity="0.9"
            />
          </g>

          {/* Patty */}
          <g style={{ animation: 'loaderBounce 1.6s ease-in-out infinite', animationDelay: '0.3s' }}>
            <rect x="16" y="78" width="128" height="18" rx="9"
              fill={isClassic ? '#5D3A1A' : '#6D8B4E'}
              stroke={isClassic ? '#3E2712' : '#4A6B34'}
              strokeWidth="1.5"
            />
            {[34, 56, 80, 104].map((x) => (
              <line key={x} x1={x} y1="82" x2={x} y2="92"
                stroke={isClassic ? '#3E2712' : '#4A6B34'}
                strokeWidth="1" opacity="0.3"
              />
            ))}
          </g>

          {/* Tomato */}
          <g style={{ animation: 'loaderBounce 1.6s ease-in-out infinite', animationDelay: '0.35s' }}>
            <rect x="20" y="98" width="120" height="7" rx="3.5"
              fill={isClassic ? '#E53935' : '#C62828'}
              opacity="0.85"
            />
          </g>

          {/* Bottom bun */}
          <g style={{ animation: 'loaderBounce 1.6s ease-in-out infinite', animationDelay: '0.4s' }}>
            <path
              d="M16 107 L144 107 L144 114 C144 122, 18 122, 18 114 Z"
              fill={isClassic ? '#E8A84C' : '#A3C585'}
              stroke={isClassic ? '#C4852A' : '#7BA35E'}
              strokeWidth="1.5"
            />
          </g>
        </svg>
      </div>

      {/* Title */}
      <div className="mt-8 text-center">
        <h2
          className="text-2xl sm:text-3xl font-bold tracking-tight"
          style={{
            color: accent,
            fontFamily: "var(--font-hero)",
          }}
        >
          Placing Order
        </h2>

        {/* Cycling step message */}
        <div className="mt-3 h-6 overflow-hidden">
          <p
            key={stepIndex}
            className="text-sm tracking-wide"
            style={{
              color: isClassic ? 'rgba(235,122,41,0.65)' : 'rgba(163,197,133,0.65)',
              fontFamily: "var(--font-body)",
              animation: animating === 'in'
                ? 'stepSlideIn 0.35s ease-out forwards'
                : 'stepFadeOut 0.35s ease-in forwards',
            }}
          >
            {steps[stepIndex]}
          </p>
        </div>
      </div>

      {/* Dots */}
      <div className="mt-6 flex gap-2.5">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="block w-2 h-2 rounded-full"
            style={{
              backgroundColor: accent,
              animation: 'loaderDot 1.2s ease-in-out infinite',
              animationDelay: `${i * 0.2}s`,
            }}
          />
        ))}
      </div>

      {/* Tip */}
      <p
        className="absolute bottom-10 text-[0.6875rem] tracking-[0.15em] uppercase"
        style={{
          color: isClassic ? 'rgba(235,122,41,0.25)' : 'rgba(163,197,133,0.25)',
          fontFamily: "var(--font-body)",
          animation: 'slideInUp 0.6s ease-out 0.5s both',
        }}
      >
        {isClassic ? 'Fresh & made to order' : 'Wholesome every time'}
      </p>
    </div>,
    document.body
  );
}
