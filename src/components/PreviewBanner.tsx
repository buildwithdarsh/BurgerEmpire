'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

/* ─── Same launch target as ComingSoonLanding ─── */
const LAUNCH_DATE = new Date('2026-03-25T00:00:00+05:30').getTime();

function useCountdown() {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  const diff = Math.max(0, LAUNCH_DATE - now);
  return {
    days: Math.floor(diff / 86_400_000),
    hours: Math.floor((diff / 3_600_000) % 24),
    minutes: Math.floor((diff / 60_000) % 60),
    seconds: Math.floor((diff / 1_000) % 60),
  };
}

export default function PreviewBanner() {
  const { days, hours, minutes, seconds } = useCountdown();

  return (
    <div className="sticky top-0 z-[9999] flex items-center justify-between gap-4 bg-neutral-900 px-4 py-2 text-xs text-white">
      <div className="flex items-center gap-2">
        <span className="rounded bg-amber-500 px-1.5 py-0.5 text-[0.625rem] font-bold uppercase tracking-wider text-black">
          Preview
        </span>
        <span className="text-white/60">
          Launch in{' '}
          <span className="font-mono font-semibold text-white tabular-nums">
            {days}d {String(hours).padStart(2, '0')}h{' '}
            {String(minutes).padStart(2, '0')}m{' '}
            {String(seconds).padStart(2, '0')}s
          </span>
        </span>
      </div>
      <Link
        href="/api/preview/exit"
        className="rounded px-2 py-0.5 text-[0.625rem] font-medium text-white/50 transition-colors hover:bg-white/10 hover:text-white"
      >
        Exit Preview
      </Link>
    </div>
  );
}
