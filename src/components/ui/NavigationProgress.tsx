'use client';

import { useEffect, useState, useRef } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { cn } from '@/lib/cn';

/**
 * Thin progress bar at the top of the viewport, shown during route changes.
 * Similar to GitHub/YouTube loading indicators.
 */
export default function NavigationProgress() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isNavigating, setIsNavigating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const prevUrl = useRef('');
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const currentUrl = `${pathname}?${searchParams.toString()}`;

    if (prevUrl.current && prevUrl.current !== currentUrl) {
      // Navigation completed
      setProgress(100);
      setIsComplete(true);

      if (intervalRef.current) clearInterval(intervalRef.current);

      setTimeout(() => {
        setIsNavigating(false);
        setProgress(0);
        setIsComplete(false);
      }, 400);
    }

    prevUrl.current = currentUrl;
  }, [pathname, searchParams]);

  // Listen for clicks on links to start the progress bar
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      const target = e.target as HTMLElement;
      const anchor = target.closest('a');
      if (!anchor) return;

      const href = anchor.getAttribute('href');
      if (!href || href.startsWith('#') || href.startsWith('http') || href.startsWith('mailto:')) return;
      if (anchor.getAttribute('target') === '_blank') return;
      if (href === pathname) return;

      // Start the progress animation
      setIsNavigating(true);
      setIsComplete(false);
      setProgress(15);

      if (intervalRef.current) clearInterval(intervalRef.current);

      // Simulate progress (slows as it approaches 90%)
      let current = 15;
      intervalRef.current = setInterval(() => {
        current += Math.max(1, (90 - current) * 0.08);
        if (current >= 90) {
          current = 90;
          if (intervalRef.current) clearInterval(intervalRef.current);
        }
        setProgress(current);
      }, 100);
    }

    document.addEventListener('click', handleClick, true);
    return () => {
      document.removeEventListener('click', handleClick, true);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [pathname]);

  if (!isNavigating) return null;

  return (
    <div
      className="fixed top-0 left-0 right-0 z-[9998] h-[3px]"
      role="progressbar"
      aria-valuenow={Math.round(progress)}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className={cn(
          'h-full bg-[var(--c-accent)] transition-all',
          isComplete ? 'duration-200 ease-out' : 'duration-100 ease-linear'
        )}
        style={{ width: `${progress}%` }}
      />
      {/* Glow effect at the leading edge */}
      {!isComplete && (
        <div
          className="absolute top-0 right-0 h-full w-24 opacity-50"
          style={{
            background: 'linear-gradient(to right, transparent, var(--c-accent))',
            transform: `translateX(${progress < 90 ? '0' : '-100%'})`,
          }}
        />
      )}
    </div>
  );
}
