'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

export interface CartChange {
  type: 'out_of_stock' | 'price_change' | 'coupon_invalid' | 'loyalty_insufficient';
  message: string;
  itemId?: string;
  itemName?: string;
  oldPrice?: number;
  newPrice?: number;
}

interface CartChangedPopupProps {
  changes: CartChange[];
  unavailableItemIds: string[];
  availableItemCount: number;
  isClassic: boolean;
  onProceed: () => void;
  onReviewCart: () => void;
}

import { BanIcon, TagIcon, TicketIcon, CoinIcon } from './icons';

const changeTypeIcon = (type: CartChange['type']) => {
  switch (type) {
    case 'out_of_stock':        return <BanIcon size={16} color="#EF4444" />;
    case 'price_change':        return <TagIcon size={16} color="#F59E0B" />;
    case 'coupon_invalid':      return <TicketIcon size={16} color="#8B5CF6" />;
    case 'loyalty_insufficient':return <CoinIcon size={16} color="#EB7A29" />;
  }
};

export default function CartChangedPopup({
  changes,
  unavailableItemIds,
  availableItemCount,
  isClassic,
  onProceed,
  onReviewCart,
}: CartChangedPopupProps) {
  const accent = isClassic ? '#9A1E29' : '#4AA056';
  const accentBg = isClassic ? '#FAF8F4' : '#F0FAF3';
  const accentLight = isClassic ? '#FEF3E2' : '#E8F5EC';

  const [mounted, setMounted] = useState(false);

  // Mount portal target + lock body scroll
  useEffect(() => {
    setMounted(true);
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const hasUnavailable = unavailableItemIds.length > 0;
  const canProceed = availableItemCount > 0;

  const content = (
    <div className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center p-0 sm:p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onReviewCart} />

      {/* Panel — slides up on mobile, centered on desktop */}
      <div
        className="relative w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl overflow-hidden shadow-2xl flex flex-col"
        style={{ backgroundColor: '#FFFFFF', maxHeight: '92dvh' }}
      >
        {/* Top accent bar */}
        <div className="h-1.5 w-full flex-shrink-0" style={{ background: `linear-gradient(90deg, ${accent}, ${isClassic ? '#EB7A29' : '#6aab7e'})` }} />

        {/* Illustration + header */}
        <div className="px-6 pt-6 pb-4 text-center flex-shrink-0" style={{ backgroundColor: accentLight }}>
          {/* SVG Illustration — burger with exclamation badge */}
          <div className="flex justify-center mb-3">
            <svg width="88" height="88" viewBox="0 0 110 110" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Plate / shadow */}
              <ellipse cx="55" cy="95" rx="38" ry="7" fill="#E5E7EB" opacity="0.5" />

              {/* Bottom bun */}
              <rect x="18" y="72" width="74" height="18" rx="9" fill="#C06820" />
              <rect x="22" y="68" width="66" height="8" rx="4" fill="#C17C12" opacity="0.4" />

              {/* Patty */}
              <rect x="20" y="56" width="70" height="16" rx="6" fill="#7B3F00" />

              {/* Lettuce */}
              <path d="M16 58 Q28 50 40 56 Q52 50 64 56 Q76 50 88 56 Q95 60 94 62 Q80 54 68 60 Q56 54 44 60 Q32 54 20 60 Z" fill="#4AA056" />

              {/* Cheese */}
              <rect x="22" y="50" width="66" height="10" rx="3" fill="#EB7A29" />

              {/* Top bun */}
              <path d="M20 50 Q22 28 55 26 Q88 28 90 50 Z" fill="#D46E1F" />
              {/* Bun shine */}
              <ellipse cx="42" cy="34" rx="8" ry="4" fill="white" opacity="0.18" transform="rotate(-20 42 34)" />

              {/* Sesame seeds */}
              <ellipse cx="48" cy="31" rx="3" ry="1.5" fill="#C17C12" transform="rotate(-15 48 31)" />
              <ellipse cx="62" cy="28" rx="3" ry="1.5" fill="#C17C12" transform="rotate(10 62 28)" />
              <ellipse cx="55" cy="35" rx="3" ry="1.5" fill="#C17C12" />

              {/* Warning badge */}
              <circle cx="84" cy="24" r="18" fill="white" />
              <circle cx="84" cy="24" r="15" fill="#9A1E29" />
              <rect x="82" y="14" width="4" height="10" rx="2" fill="white" />
              <circle cx="84" cy="29" r="2.5" fill="white" />
            </svg>
          </div>

          <h2 className="text-lg font-black text-gray-900 mb-1">Oops! There&apos;s a change in your cart</h2>
          <p className="text-sm text-gray-500">
            Something changed since you added items. Review the updates below.
          </p>
        </div>

        {/* Changes list — scrollable, takes remaining space */}
        <div className="px-6 py-4 overflow-y-auto space-y-2" style={{ minHeight: 0 }}>
          {changes.map((change, i) => (
            <div
              key={i}
              className="flex items-start gap-3 px-3.5 py-2.5 rounded-xl border"
              style={{
                backgroundColor: change.type === 'out_of_stock' ? '#FEF2F2' : change.type === 'price_change' ? '#FFFBEB' : accentLight,
                borderColor: change.type === 'out_of_stock' ? '#FECACA' : change.type === 'price_change' ? '#FDE68A' : accentBg,
              }}
            >
              <span className="leading-none mt-0.5 flex-shrink-0 flex">{changeTypeIcon(change.type)}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800 leading-snug">{change.message}</p>
                {change.type === 'price_change' && change.oldPrice !== undefined && change.newPrice !== undefined && (
                  <p className="text-xs text-gray-500 mt-0.5">
                    <span className="line-through mr-1">₹{change.oldPrice}</span>
                    <span className="font-semibold" style={{ color: accent }}>₹{change.newPrice}</span>
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Divider — pinned */}
        <div className="mx-6 border-t border-dashed border-gray-200 flex-shrink-0" />

        {/* Actions — always visible at bottom */}
        <div className="px-6 py-5 space-y-3 flex-shrink-0">
          {canProceed && hasUnavailable && (
            <button
              onClick={onProceed}
              className="w-full py-3.5 rounded-2xl text-sm font-bold text-white transition-all active:scale-[0.98]"
              style={{ backgroundColor: accent }}
            >
              Place Order with {availableItemCount} Available Item{availableItemCount !== 1 ? 's' : ''}
            </button>
          )}
          {canProceed && !hasUnavailable && (
            <button
              onClick={onProceed}
              className="w-full py-3.5 rounded-2xl text-sm font-bold text-white transition-all active:scale-[0.98]"
              style={{ backgroundColor: accent }}
            >
              Got it, Place Order
            </button>
          )}
          <button
            onClick={onReviewCart}
            className="w-full py-3 rounded-2xl text-sm font-semibold border-2 transition-all"
            style={{ borderColor: '#E5E7EB', color: '#6B7280' }}
          >
            Review Cart
          </button>
        </div>
      </div>
    </div>
  );

  if (!mounted) return null;
  return createPortal(content, document.body);
}
