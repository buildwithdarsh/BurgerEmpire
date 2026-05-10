'use client';

import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useMode } from '@/hooks/useMode';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '@/store/auth';
import { useConfig } from '@/hooks/useConfig';
import { SparkleIcon, TruckIcon, ClockIcon, UsersIcon, FireIcon, GiftIcon, LeafIcon } from '@/components/icons';
import Skeleton from '@/components/Skeleton';
import { TZ } from '@/lib/tz';
import type { Promotion as SDKPromotion } from '@buildwithdarsh/sdk';

/**
 * Personalized promotion shape returned by the promotions endpoint.
 * Differs from SDK Promotion (which is the raw DB entity) — this includes
 * eligibility, coupon codes, and user-specific fields computed server-side.
 */
interface Promotion {
  id: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  type: string;
  imageUrl: string | null;
  couponCode: string | null;
  eligible: boolean;
  reason?: string;
  autoApply?: boolean;
  personalCode?: string | null;
}

type IconFC = React.FC<{ size?: number; color?: string; className?: string }>;
const TYPE_ICON_COMPONENTS: Record<string, IconFC> = {
  firstOrder: SparkleIcon,
  freeDelivery: TruckIcon,
  happyHour: ClockIcon,
  referral: UsersIcon,
  banner: FireIcon,
};

const TYPE_LABELS: Record<string, string> = {
  firstOrder: 'New Customer',
  freeDelivery: 'Free Delivery',
  happyHour: 'Happy Hour',
  referral: 'Refer & Earn',
  banner: 'Limited Offer',
};

export default function PromotionsBanner() {
  const { isClassic } = useMode();
  const { config } = useConfig();
  const { user } = useAuthStore();
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!config.features.promotions_enabled) return;

    TZ.storefront.promotions.list()
      .then((data: SDKPromotion[]) => {
        // Backend extends SDK Promotion with eligibility/coupon fields at runtime
        const list = data as unknown as Promotion[];
        if (list.length) {
          setPromotions(list);
        }
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, [config.features.promotions_enabled, user]);

  // Auto-rotate every 5s
  useEffect(() => {
    if (promotions.length <= 1) return;
    intervalRef.current = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % promotions.length);
    }, 5000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [promotions.length]);

  const goTo = useCallback((index: number) => {
    setActiveIndex(index);
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % promotions.length);
    }, 5000);
  }, [promotions.length]);

  const copyCode = useCallback((code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  }, []);

  if (!config.features.promotions_enabled) return null;

  if (isLoading) {
    return (
      <section
        className="py-10 md:py-12 px-5 transition-colors duration-500"
        style={{ backgroundColor: isClassic ? '#FDF5EC' : '#EDF7F0' }}
      >
        <div className="max-w-[1200px] mx-auto">
          <div className="mb-6 space-y-2">
            <Skeleton className="h-5 w-28 rounded-full" />
            <Skeleton className="h-8 w-56" />
          </div>
          <Skeleton className="h-[250px] w-full rounded-3xl" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-20 rounded-2xl" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (promotions.length === 0) return null;

  const accent = isClassic ? '#EB7A29' : '#4AA056';

  const promo = promotions[activeIndex];
  const isEligible = promo.eligible;
  const IconComponent = TYPE_ICON_COMPONENTS[promo.type] || FireIcon;
  const label = TYPE_LABELS[promo.type] || 'Special Offer';

  // Gradient backgrounds per type
  const gradients: Record<string, { classic: string; healthy: string }> = {
    firstOrder: {
      classic: 'linear-gradient(135deg, #E53935 0%, #C62828 50%, #B71C1C 100%)',
      healthy: 'linear-gradient(135deg, #2E7D32 0%, #1B5E20 50%, #004D40 100%)',
    },
    freeDelivery: {
      classic: 'linear-gradient(135deg, #F57C00 0%, #E65100 50%, #BF360C 100%)',
      healthy: 'linear-gradient(135deg, #00695C 0%, #004D40 50%, #00332C 100%)',
    },
    happyHour: {
      classic: 'linear-gradient(135deg, #7B1FA2 0%, #6A1B9A 50%, #4A148C 100%)',
      healthy: 'linear-gradient(135deg, #1565C0 0%, #0D47A1 50%, #002171 100%)',
    },
    referral: {
      classic: 'linear-gradient(135deg, #00897B 0%, #00695C 50%, #004D40 100%)',
      healthy: 'linear-gradient(135deg, #558B2F 0%, #33691E 50%, #1B5E20 100%)',
    },
    banner: {
      classic: 'linear-gradient(135deg, #EB7A29 0%, #D46E1F 50%, #D4811A 100%)',
      healthy: 'linear-gradient(135deg, #4AA056 0%, #3D8A48 50%, #3D8A48 100%)',
    },
  };

  const bg = gradients[promo.type]?.[isClassic ? 'classic' : 'healthy'] || gradients.banner[isClassic ? 'classic' : 'healthy'];

  return (
    <section
      className="py-10 md:py-12 px-5 has-pattern transition-colors duration-500"
      style={{ backgroundColor: isClassic ? '#FDF5EC' : '#EDF7F0' }}
    >
      <div className="max-w-[1200px] mx-auto">
        {/* Section header */}
        <motion.div
          className="mb-6"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5 }}
        >
          <motion.span
            className="inline-block text-[0.6875rem] font-bold uppercase tracking-[0.2em] mb-2 px-3 py-1 rounded-full"
            style={{
              backgroundColor: isClassic ? 'rgba(154,30,41,0.08)' : 'rgba(74,160,86,0.08)',
              color: isClassic ? '#9A1E29' : '#4AA056',
            }}
          >
            <span className="inline-flex items-center gap-1.5">
              {isClassic
                ? <><GiftIcon size={11} color="#9A1E29" className="inline-block" /> Offers For You</>
                : <><LeafIcon size={11} color="#4AA056" className="inline-block" /> Your Deals</>}
            </span>
          </motion.span>
          <h2
            className="text-2xl md:text-[2rem] font-black text-gray-900"
            style={{ fontFamily: "var(--font-poppins)" }}
          >
            {isClassic ? "Today's Hot Deals" : 'Healthy Savings'}
          </h2>
        </motion.div>

        {/* Promotion carousel card */}
        <motion.div
          className="relative rounded-3xl overflow-hidden"
          style={{ background: bg, height: 250 }}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Decorative elements */}
          <div className="absolute -right-10 -top-10 w-48 h-48 rounded-full bg-white/5" />
          <div className="absolute -left-16 -bottom-16 w-40 h-40 rounded-full bg-black/5" />

          {/* Dashed border */}
          <motion.div
            className="absolute inset-3 rounded-2xl border border-dashed border-white/15 pointer-events-none"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          />

          <AnimatePresence mode="wait">
            <motion.div
              key={promo.id}
              className="relative z-10 flex flex-col md:flex-row items-center gap-6 p-8 md:p-10"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.35 }}
            >
              {/* Icon + Type badge area */}
              <div className="flex-shrink-0 flex flex-col items-center gap-3">
                <span className="flex items-center justify-center">
                  <IconComponent size={56} color="white" />
                </span>
                <span className="text-[0.625rem] font-bold uppercase tracking-wider text-white/50 px-3 py-1 rounded-full bg-white/10 border border-white/10">
                  {label}
                </span>
              </div>

              {/* Content */}
              <div className="flex-1 text-center md:text-left min-w-0">
                <h3
                  className="text-xl md:text-2xl font-black text-white mb-2 leading-tight"
                  style={{ fontFamily: "var(--font-poppins)" }}
                >
                  {promo.title}
                </h3>
                {promo.subtitle && (
                  <p className="text-sm md:text-base text-white/70 mb-3">{promo.subtitle}</p>
                )}
                {promo.description && (
                  <p className="text-xs text-white/50 mb-4 max-w-lg leading-relaxed">{promo.description}</p>
                )}

                {/* Reason / eligibility message */}
                {promo.reason && (
                  <p className={`text-xs font-semibold mb-3 ${isEligible ? 'text-white/80' : 'text-white/40 italic'}`}>
                    {promo.reason}
                  </p>
                )}

                {/* Coupon / referral code + copy button */}
                {(() => {
                  const displayCode = promo.type === 'referral'
                    ? (promo.personalCode ?? promo.couponCode)
                    : promo.couponCode;
                  const codeLabel = promo.type === 'referral' ? 'Your code:' : 'Use code:';
                  if (!displayCode || !isEligible) return null;
                  return (
                    <div className="flex items-center gap-3 justify-center md:justify-start">
                      <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/15 border border-dashed border-white/30 backdrop-blur-sm">
                        <span className="text-xs text-white/50 font-medium">{codeLabel}</span>
                        <span className="font-black text-white tracking-widest text-sm">{displayCode}</span>
                      </div>
                      <motion.button
                        className="px-4 py-2 rounded-xl text-xs font-bold bg-white transition-colors"
                        style={{ color: isClassic ? '#9A1E29' : '#3D8A48' }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => copyCode(displayCode)}
                      >
                        {copiedCode === displayCode ? 'Copied!' : promo.type === 'referral' ? 'Share Code' : 'Copy Code'}
                      </motion.button>
                    </div>
                  );
                })()}

                {/* Not eligible message for firstOrder when user already ordered */}
                {!isEligible && promo.type === 'firstOrder' && user && !user.isGuest && (
                  <p className="text-xs text-white/30 italic">You&apos;ve already placed an order — check our other deals!</p>
                )}
              </div>

              {/* Auto-apply badge */}
              {promo.autoApply && isEligible && (
                <motion.div
                  className="absolute top-4 right-4 px-3 py-1.5 rounded-full text-[0.625rem] font-bold uppercase bg-white/20 text-white border border-white/25 backdrop-blur-sm"
                  initial={{ scale: 0, rotate: -15 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.5, type: 'spring', stiffness: 300 }}
                >
                  Just For You
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Dot indicators */}
          {promotions.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 z-20">
              {promotions.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i)}
                  className={`rounded-full transition-all duration-300 ${
                    i === activeIndex
                      ? 'w-6 h-2 bg-white'
                      : 'w-2 h-2 bg-white/30 hover:bg-white/50'
                  }`}
                  aria-label={`Go to promotion ${i + 1}`}
                />
              ))}
            </div>
          )}
        </motion.div>

        {/* Mini cards for other promotions */}
        {promotions.length > 1 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
            {promotions.slice(0,4).map((p, i) => {
              const PIcon = TYPE_ICON_COMPONENTS[p.type] || FireIcon;
              const isActive = i === activeIndex;
              return (
                <motion.button
                  key={p.id}
                  onClick={() => goTo(i)}
                  className={`relative rounded-2xl p-4 text-left transition-all duration-300 border ${
                    isActive
                      ? 'bg-white shadow-lg border-transparent'
                      : 'bg-white/60 border-transparent hover:bg-white hover:shadow-md'
                  }`}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ delay: 0.1 * i, duration: 0.4 }}
                  whileHover={{ y: -2 }}
                >
                  <PIcon size={20} color={isActive ? accent : '#666'} className="mb-1 block" />
                  <span
                    className="text-xs font-bold block truncate"
                    style={{ color: isActive ? accent : '#666' }}
                  >
                    {p.title}
                  </span>
                  {p.eligible && (p.type === 'referral' ? (p.personalCode ?? p.couponCode) : p.couponCode) && (
                    <span className="text-[0.625rem] font-mono text-gray-600 mt-0.5 block">
                      {p.type === 'referral' ? (p.personalCode ?? p.couponCode) : p.couponCode}
                    </span>
                  )}
                  {!p.eligible && (
                    <span className="text-[0.625rem] text-gray-600 italic mt-0.5 block">
                      {p.reason || 'Not available'}
                    </span>
                  )}
                  {isActive && (
                    <motion.div
                      className="absolute bottom-0 left-4 right-4 h-0.5 rounded-full"
                      style={{ backgroundColor: accent }}
                      layoutId="activePromoIndicator"
                    />
                  )}
                </motion.button>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
