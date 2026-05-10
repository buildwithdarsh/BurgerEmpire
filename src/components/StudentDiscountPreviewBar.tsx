'use client';

import { useState, useEffect } from 'react';
import { useMode } from '@/hooks/useMode';
import { useAuthStore } from '@/store/auth';
import { TZ } from '@/lib/tz';

interface DiscountPreview {
  applicable: boolean;
  discountAmount: number;
  blockedReason: string | null;
  progressHint: string | null;
}

interface StudentDiscountPreviewBarProps {
  subtotal: number;
  itemCount: number;
  orderType: string;
  cartMode: string;
  couponApplied: boolean;
  coinsRedeemed: number;
  giftCardApplied: boolean;
}

export default function StudentDiscountPreviewBar({
  subtotal,
  itemCount,
  orderType,
  cartMode,
  couponApplied,
  coinsRedeemed,
  giftCardApplied,
}: StudentDiscountPreviewBarProps) {
  const { isClassic } = useMode();
  const user = useAuthStore((s) => s.user);
  const [preview, setPreview] = useState<DiscountPreview | null>(null);

  useEffect(() => {
    if (!user || user.isGuest) {
      setPreview(null);
      return;
    }

    let cancelled = false;

    async function fetchPreview() {
      try {
        const data = await TZ.storefront.student.previewDiscount({ cartTotal: subtotal }) as unknown as DiscountPreview;

        if (!cancelled) {
          setPreview(data);
        }
      } catch {
        if (!cancelled) {
          setPreview(null);
        }
      }
    }

    fetchPreview();

    return () => {
      cancelled = true;
    };
  }, [user, subtotal, itemCount, orderType, cartMode, couponApplied, coinsRedeemed, giftCardApplied]);

  // Don't render for guests or unauthenticated users
  if (!user || user.isGuest) return null;

  // Don't render if no preview data available
  if (!preview) return null;

  // Don't render if nothing to show
  if (!preview.applicable && !preview.blockedReason && !preview.progressHint) return null;

  const accent = isClassic ? '#9A1E29' : '#4AA056';

  // Active discount: green bar
  if (preview.applicable && preview.discountAmount > 0) {
    return (
      <div
        className="w-full px-4 py-3 text-center text-sm font-semibold"
        style={{ backgroundColor: '#D1FAE5', color: '#065F46' }}
      >
        <span className="mr-1.5">&#127891;</span>
        Your Student Discount is active — saving you{' '}
        <strong>&#8377;{preview.discountAmount}</strong> on this order
      </div>
    );
  }

  // Blocked reason: subtle yellow bar
  if (preview.blockedReason) {
    return (
      <div
        className="w-full px-4 py-3 text-center text-sm font-medium"
        style={{ backgroundColor: '#FEF3C7', color: '#92400E' }}
      >
        <span className="mr-1.5">&#127891;</span>
        {preview.blockedReason}
      </div>
    );
  }

  // Progress hint: accent-tinted bar
  if (preview.progressHint) {
    return (
      <div
        className="w-full px-4 py-3 text-center text-sm font-medium"
        style={{ backgroundColor: `${accent}10`, color: accent }}
      >
        <span className="mr-1.5">&#127891;</span>
        {preview.progressHint}
      </div>
    );
  }

  return null;
}
