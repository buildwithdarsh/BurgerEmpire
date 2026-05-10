'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

function PrinterIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 6 2 18 2 18 9" />
      <path d="M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2" />
      <rect x="6" y="14" width="12" height="8" />
    </svg>
  );
}

function RefreshIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 4 23 10 17 10" />
      <polyline points="1 20 1 14 7 14" />
      <path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15" />
    </svg>
  );
}

export default function TokenActions() {
  const router = useRouter();
  const [seconds, setSeconds] = useState(60);
  const shouldRedirect = useRef(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds((s) => {
        if (s <= 1) {
          clearInterval(interval);
          shouldRedirect.current = true;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Handle redirect outside of state setter
  useEffect(() => {
    if (seconds <= 0 && shouldRedirect.current) {
      router.push('/self-checkin');
    }
  }, [seconds, router]);

  const handlePrint = () => window.print();

  return (
    <div className="flex flex-col items-center gap-4 mt-8 print:hidden">
      <button
        onClick={handlePrint}
        className="flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 border border-zinc-600 text-white font-bold px-8 py-4 rounded-2xl text-lg transition-colors"
      >
        <PrinterIcon size={20} /> Print Receipt
      </button>

      <Link
        href="/self-checkin"
        className="flex items-center gap-2 bg-orange-500 hover:bg-orange-400 text-white font-black px-8 py-4 rounded-2xl text-lg transition-colors"
      >
        <RefreshIcon size={20} /> New Order
      </Link>

      <p className="text-zinc-600 text-sm mt-2">
        Auto-resets in{' '}
        <span className="text-zinc-400 font-mono font-bold">{seconds}s</span>
      </p>
    </div>
  );
}
