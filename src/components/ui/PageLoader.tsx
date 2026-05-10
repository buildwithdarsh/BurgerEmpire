'use client';

import { useMode } from '@/hooks/useMode';

interface PageLoaderProps {
  /** Optional text below the animation */
  text?: string;
  /** Size variant */
  size?: 'sm' | 'md';
}

/**
 * Themed page-level loader with animated burger icon.
 * Use for full-section or full-page loading states.
 * For inline/button spinners, use <Spinner /> instead.
 */
export default function PageLoader({ text, size = 'md' }: PageLoaderProps) {
  const { isClassic } = useMode();
  const accent = isClassic ? '#9A1E29' : '#4AA056';
  const isSm = size === 'sm';

  return (
    <div className="flex flex-col items-center justify-center gap-3 min-h-[calc(100vh-8rem)]" role="status" aria-label={text || 'Loading'}>
      <div className={`relative ${isSm ? 'w-10 h-10' : 'w-14 h-14'}`}>
        {/* Outer ring */}
        <svg
          className="absolute inset-0 w-full h-full animate-spin"
          viewBox="0 0 48 48"
          fill="none"
          style={{ animationDuration: '1.2s' }}
        >
          <circle cx="24" cy="24" r="20" stroke={accent} strokeWidth="3" strokeOpacity="0.15" />
          <path
            d="M44 24c0-11.046-8.954-20-20-20"
            stroke={accent}
            strokeWidth="3"
            strokeLinecap="round"
          />
        </svg>
        {/* Inner burger icon */}
        <svg
          className={`absolute inset-0 m-auto ${isSm ? 'w-5 h-5' : 'w-7 h-7'}`}
          viewBox="0 0 24 24"
          fill="none"
          style={{ animation: 'breathe 2s ease-in-out infinite' }}
        >
          {/* Top bun */}
          <path d="M4 11h16c0-4-3.6-7-8-7s-8 3-8 7z" fill={accent} fillOpacity="0.7" />
          {/* Lettuce */}
          <path d="M3 12.5c2-1 4 1 6-0.5s4 1 6-0.5 4 1 6-0.5" stroke="#43A047" strokeWidth="1.2" fill="none" strokeLinecap="round" />
          {/* Patty */}
          <rect x="4" y="13.5" width="16" height="3" rx="1.5" fill={accent} fillOpacity="0.5" />
          {/* Bottom bun */}
          <path d="M4 18h16c0 2-3.6 3-8 3s-8-1-8-3z" fill={accent} fillOpacity="0.6" />
        </svg>
      </div>
      {text && (
        <p className="text-xs text-gray-400 font-medium">{text}</p>
      )}
    </div>
  );
}
