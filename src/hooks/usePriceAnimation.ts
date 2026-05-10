'use client';

import { useEffect, useRef, useState } from 'react';

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

export function usePriceAnimation(targetPrice: number, duration = 400) {
  const [displayPrice, setDisplayPrice] = useState(targetPrice);
  const prevPrice = useRef(targetPrice);

  useEffect(() => {
    const from = prevPrice.current;
    const to = targetPrice;
    prevPrice.current = targetPrice;

    if (from === to) return;

    const start = performance.now();
    const diff = to - from;

    function animate(now: number) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeOutCubic(progress);
      setDisplayPrice(Math.round(from + diff * eased));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    }

    requestAnimationFrame(animate);
  }, [targetPrice, duration]);

  return displayPrice;
}
