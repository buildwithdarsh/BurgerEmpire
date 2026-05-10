'use client';

import { useCartStore } from '@/store/cart';
import { useMode } from '@/hooks/useMode';
import { motion, AnimatePresence } from 'framer-motion';
import CartItemRow from './CartItemRow';
import Link from 'next/link';
import { useConfig } from '@/hooks/useConfig';
import { CoinIcon } from '@/components/icons';
import Skeleton from '@/components/Skeleton';
import { formatCurrency } from '@/lib/format';

function EmptyCartIllustration({ accent: _accent, isClassic }: { accent: string; isClassic: boolean }) {
  const bagColor = isClassic ? '#EB7A29' : '#4AA056';
  const bgTint = isClassic ? 'rgba(235,122,41,0.08)' : 'rgba(74,160,86,0.08)';

  return (
    <div className="relative w-40 h-40 mx-auto mb-4">
      {/* Background glow */}
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{ backgroundColor: bgTint }}
        animate={{ scale: [1, 1.08, 1], opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      />

      <svg viewBox="0 0 160 160" fill="none" className="w-full h-full relative z-10">
        {/* Shopping bag */}
        <motion.g
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Bag body */}
          <motion.path
            d="M44 62H116L110 136H50L44 62Z"
            fill={bagColor}
            opacity={0.12}
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            style={{ transformOrigin: '80px 136px' }}
            transition={{ delay: 0.2, duration: 0.5, ease: 'easeOut' }}
          />
          <motion.path
            d="M44 62H116L110 136H50L44 62Z"
            stroke={bagColor}
            strokeWidth="2.5"
            strokeLinejoin="round"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          />

          {/* Bag handles */}
          <motion.path
            d="M62 62V48C62 38 70 30 80 30C90 30 98 38 98 48V62"
            stroke={bagColor}
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ delay: 0.4, duration: 0.6, ease: 'easeOut' }}
          />
        </motion.g>

        {/* Dashed line (empty indicator) */}
        <motion.line
          x1="60" y1="90" x2="100" y2="90"
          stroke={bagColor}
          strokeWidth="2"
          strokeDasharray="6 4"
          strokeLinecap="round"
          opacity={0.3}
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
        />
        <motion.line
          x1="65" y1="102" x2="95" y2="102"
          stroke={bagColor}
          strokeWidth="2"
          strokeDasharray="6 4"
          strokeLinecap="round"
          opacity={0.2}
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ delay: 0.9, duration: 0.5 }}
        />

        {/* Floating burger icon (above bag) */}
        <motion.g
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          {/* Mini burger */}
          <motion.g
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 1, duration: 0.4, type: 'spring', stiffness: 200 }}
          >
            {/* Top bun */}
            <path d="M70 44C70 38 74 34 80 34C86 34 90 38 90 44H70Z" fill={bagColor} opacity={0.5} />
            {/* Lettuce */}
            <path d="M68 46C72 43 76 47 80 44C84 47 88 43 92 46" stroke="#43A047" strokeWidth="1.5" fill="none" opacity={0.6} />
            {/* Patty */}
            <rect x="70" y="47" width="20" height="4" rx="2" fill={bagColor} opacity={0.4} />
            {/* Bottom bun */}
            <path d="M70 53H90C90 56 86 58 80 58C74 58 70 56 70 53Z" fill={bagColor} opacity={0.5} />
          </motion.g>
        </motion.g>

        {/* Question mark */}
        <motion.text
          x="80" y="122"
          textAnchor="middle"
          fontSize="22"
          fontWeight="800"
          fill={bagColor}
          opacity={0.25}
          initial={{ scale: 0 }}
          animate={{ scale: [0, 1.2, 1] }}
          transition={{ delay: 1.2, duration: 0.5, type: 'spring' }}
        >
          ?
        </motion.text>

        {/* Sparkles */}
        {[
          { x: 30, y: 50, delay: 1.4 },
          { x: 130, y: 45, delay: 1.6 },
          { x: 125, y: 110, delay: 1.8 },
        ].map((s, i) => (
          <motion.g key={i}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: [0, 1.3, 1], opacity: [0, 0.5, 0.3] }}
            transition={{ delay: s.delay, duration: 0.4 }}
          >
            <circle cx={s.x} cy={s.y} r="1.5" fill={bagColor} />
            <line x1={s.x - 4} y1={s.y} x2={s.x + 4} y2={s.y} stroke={bagColor} strokeWidth="1" />
            <line x1={s.x} y1={s.y - 4} x2={s.x} y2={s.y + 4} stroke={bagColor} strokeWidth="1" />
          </motion.g>
        ))}
      </svg>
    </div>
  );
}

export default function CartDrawer() {
  const { isClassic } = useMode();
  const { config } = useConfig();
  const { items, isOpen, setOpen, clearCart, isLoading } = useCartStore();
  const subtotal = useCartStore((s) => s.subtotal(isClassic ? 'classic' : 'healthy'));
  const totalItems = useCartStore((s) => s.totalItems());

  const accent = isClassic ? '#9A1E29' : '#4AA056';
  const accentBg = isClassic ? '#FAF8F4' : '#F0FAF3';
  const light = isClassic ? '#FFFCF5' : '#F8FDF9';

  const currency = config.branding?.currency || 'INR';
  const fmt = (amount: number) => formatCurrency(amount, currency);

  const deliveryFee = subtotal >= config.delivery.free_above ? 0 : config.delivery.fee;
  const estimatedTotal = subtotal + deliveryFee;

  // Baby Coins preview — per-item mode (base only, no tier since we don't know user tier here)
  const burgerPoints = config.loyalty.enabled
    ? items.reduce((sum, item) => {
        const price = item.variationPrice !== undefined ? item.variationPrice : item.mode === 'healthy' ? item.healthyPrice : item.classicPrice;
        const addonTotal = item.addons.reduce((s, a) => s + a.price * a.quantity, 0);
        const lineTotal = (price + addonTotal) * item.quantity;
        const itemBase = Math.floor(lineTotal / config.loyalty.points_per_amount);
        return sum + (item.mode === 'healthy' ? Math.floor(itemBase * config.loyalty.healthy_boost_multiplier) : itemBase);
      }, 0)
    : 0;

  const hasUnavailable = items.some((i) => !i.inStock);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[70]">
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
          />

          {/* Drawer */}
          <motion.div
            className="absolute right-0 top-0 bottom-0 w-full max-w-[400px] flex flex-col border-l border-gray-200"
            style={{ backgroundColor: light }}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 bg-white border-b border-gray-100">
              <div>
                <h2 className="text-lg font-bold text-gray-900">Your Order</h2>
                <p className="text-xs text-gray-400">
                  {totalItems} {totalItems === 1 ? 'item' : 'items'}
                </p>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 transition-colors"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M1 1L13 13M13 1L1 13" />
                </svg>
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-4 py-3">
              {isLoading ? (
                <div className="space-y-3 py-2">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="flex gap-3 p-3 rounded-2xl" style={{ backgroundColor: accentBg }}>
                      <Skeleton className="w-16 h-16 rounded-xl flex-shrink-0" />
                      <div className="flex-1 space-y-2 py-1">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-3 w-1/2" />
                        <div className="flex items-center justify-between pt-1">
                          <Skeleton className="h-7 w-20 rounded-lg" />
                          <Skeleton className="h-4 w-12" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center py-8">
                  <EmptyCartIllustration accent={accent} isClassic={isClassic} />
                  <p className="text-base font-bold text-gray-800">
                    {isClassic ? 'Hungry yet?' : 'Ready to eat clean?'}
                  </p>
                  <p className="text-sm text-gray-400 mt-1 max-w-[220px]">
                    {isClassic
                      ? 'Your bag is waiting for something delicious'
                      : 'Fresh, wholesome meals are just a tap away'}
                  </p>
                  <Link
                    href="/menu"
                    onClick={() => setOpen(false)}
                    className="mt-5 px-6 py-2.5 rounded-full text-sm font-bold text-white transition-all active:scale-[0.97]"
                    style={{ backgroundColor: accent }}
                  >
                    Browse Menu
                  </Link>
                </div>
              ) : (
                <AnimatePresence mode="popLayout">
                  {items.map((item) => (
                    <CartItemRow key={item.id} item={item} />
                  ))}
                </AnimatePresence>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="bg-white border-t border-gray-100 px-5 py-4 space-y-3">
                {/* Baby Coins */}
                {burgerPoints > 0 && (
                  <div
                    className="flex items-center gap-2 px-3 py-2 rounded-xl"
                    style={{ backgroundColor: accentBg }}
                  >
                    <CoinIcon size={18} color={accent} />
                    <div className="flex-1 min-w-0">
                      <p className="text-[0.6875rem] font-bold" style={{ color: accent }}>
                        You&apos;ll earn {burgerPoints} Baby Coins!
                      </p>
                      <p className="text-[0.625rem] text-gray-400">Redeem on your next order</p>
                    </div>
                  </div>
                )}

                {/* Pricing breakdown */}
                <div className="space-y-1.5 text-sm">
                  <div className="flex justify-between text-gray-500">
                    <span>Subtotal</span>
                    <span>{fmt(subtotal)}</span>
                  </div>
                  {config.delivery?.enabled !== false && (
                    <>
                      <div className="flex justify-between text-gray-500">
                        <span>Delivery</span>
                        <span>
                          {deliveryFee === 0 ? (
                            <span className="text-green-600 font-medium">FREE</span>
                          ) : (
                            fmt(deliveryFee)
                          )}
                        </span>
                      </div>
                      {deliveryFee > 0 && (
                        <p
                          className="text-[0.6875rem] font-medium px-2 py-1 rounded-md"
                          style={{ backgroundColor: accentBg, color: accent }}
                        >
                          Add {fmt(config.delivery.free_above - subtotal)} more for free delivery
                        </p>
                      )}
                    </>
                  )}
                  <div className="flex justify-between font-bold text-gray-900 text-base pt-2 border-t border-dashed border-gray-200">
                    <span>Estimated Total</span>
                    <span>{fmt(estimatedTotal)}</span>
                  </div>
                </div>

                {hasUnavailable && (
                  <p className="text-[0.6875rem] text-red-500 font-medium bg-red-50 px-3 py-2 rounded-lg">
                    Some items are unavailable. Please remove them before checkout.
                  </p>
                )}

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={clearCart}
                    className="px-4 py-2.5 rounded-xl text-xs font-semibold text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors border border-gray-100"
                  >
                    Clear
                  </button>
                  <Link
                    href="/checkout"
                    onClick={() => setOpen(false)}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold text-white transition-all ${
                      hasUnavailable ? 'opacity-50 pointer-events-none' : 'active:scale-[0.98]'
                    }`}
                    style={{ backgroundColor: accent }}
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                    Checkout
                  </Link>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
