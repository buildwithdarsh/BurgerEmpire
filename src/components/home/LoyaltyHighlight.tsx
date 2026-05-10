'use client';

import { useMode } from '@/hooks/useMode';
import { useConfig } from '@/hooks/useConfig';
import { motion } from 'framer-motion';
import Link from 'next/link';

/* ── Tier icon SVGs ── */

function BronzeMedalSVG({ color }: { color: string }) {
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
      <motion.circle cx="20" cy="18" r="14" fill={color} opacity={0.12}
        initial={{ scale: 0 }} whileInView={{ scale: 1 }}
        viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.4, type: 'spring', stiffness: 200 }}
      />
      <motion.circle cx="20" cy="18" r="14" stroke={color} strokeWidth="1.5" fill="none"
        initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }}
        viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.6, ease: 'easeOut' }}
      />
      <motion.path
        d="M20 10L22 14.5L27 15L23.5 18.5L24.5 23.5L20 21L15.5 23.5L16.5 18.5L13 15L18 14.5Z"
        fill={color} opacity={0.7}
        initial={{ scale: 0, rotate: -90 }}
        whileInView={{ scale: 1, rotate: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        style={{ transformOrigin: '20px 17px' }}
        transition={{ delay: 0.3, duration: 0.5, type: 'spring', stiffness: 200 }}
      />
      {/* Ribbon */}
      <motion.path d="M14 28L17 32L20 28L23 32L26 28" stroke={color} strokeWidth="1.5" strokeLinecap="round" fill="none"
        initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }}
        viewport={{ once: true, amount: 0.3 }} transition={{ delay: 0.5, duration: 0.4 }}
      />
    </svg>
  );
}

function SilverMedalSVG({ color }: { color: string }) {
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
      <motion.circle cx="20" cy="18" r="14" fill={color} opacity={0.15}
        initial={{ scale: 0 }} whileInView={{ scale: 1 }}
        viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.4, type: 'spring', stiffness: 200 }}
      />
      <motion.circle cx="20" cy="18" r="14" stroke={color} strokeWidth="2" fill="none"
        initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }}
        viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.6, ease: 'easeOut' }}
      />
      {/* Shield / medal shape */}
      <motion.path
        d="M14 12H26V22C26 26 20 30 20 30C20 30 14 26 14 22V12Z"
        fill={color} opacity={0.25}
        initial={{ scaleY: 0 }} whileInView={{ scaleY: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        style={{ transformOrigin: '20px 12px' }}
        transition={{ delay: 0.3, duration: 0.5, ease: 'easeOut' }}
      />
      {/* Check mark */}
      <motion.path d="M16 19L19 22L24 15" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"
        initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }}
        viewport={{ once: true, amount: 0.3 }} transition={{ delay: 0.5, duration: 0.4 }}
      />
      {/* Ribbon tails */}
      <motion.path d="M15 28L12 36" stroke={color} strokeWidth="1.5" strokeLinecap="round"
        initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }}
        viewport={{ once: true, amount: 0.3 }} transition={{ delay: 0.6, duration: 0.3 }}
      />
      <motion.path d="M25 28L28 36" stroke={color} strokeWidth="1.5" strokeLinecap="round"
        initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }}
        viewport={{ once: true, amount: 0.3 }} transition={{ delay: 0.65, duration: 0.3 }}
      />
    </svg>
  );
}

function GoldCrownSVG({ color }: { color: string }) {
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
      <motion.circle cx="20" cy="20" r="16" fill={color} opacity={0.1}
        initial={{ scale: 0 }} whileInView={{ scale: 1 }}
        viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.4, type: 'spring', stiffness: 200 }}
      />
      {/* Crown */}
      <motion.path
        d="M8 26L12 14L17 20L20 10L23 20L28 14L32 26H8Z"
        fill={color} opacity={0.3}
        initial={{ scaleY: 0 }} whileInView={{ scaleY: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        style={{ transformOrigin: '20px 26px' }}
        transition={{ delay: 0.2, duration: 0.5, ease: 'easeOut' }}
      />
      <motion.path
        d="M8 26L12 14L17 20L20 10L23 20L28 14L32 26H8Z"
        stroke={color} strokeWidth="1.5" strokeLinejoin="round" fill="none"
        initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }}
        viewport={{ once: true, amount: 0.3 }} transition={{ delay: 0.3, duration: 0.7 }}
      />
      {/* Crown base */}
      <motion.rect x="8" y="26" width="24" height="4" rx="1" fill={color} opacity={0.5}
        initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        style={{ transformOrigin: '20px 28px' }}
        transition={{ delay: 0.6, duration: 0.3 }}
      />
      {/* Crown jewels */}
      {[12, 20, 28].map((cx, i) => (
        <motion.circle key={i} cx={cx} cy={14 + (i === 1 ? -4 : 0)} r="2" fill={color}
          initial={{ scale: 0 }} whileInView={{ scale: [0, 1.4, 1] }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ delay: 0.7 + i * 0.08, duration: 0.3, type: 'spring', stiffness: 300 }}
        />
      ))}
      {/* Sparkles */}
      {[{ x: 6, y: 8 }, { x: 34, y: 10 }].map((p, i) => (
        <motion.g key={i}
          initial={{ scale: 0, opacity: 0 }}
          whileInView={{ scale: [0, 1.3, 1], opacity: [0, 0.7, 0.4] }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ delay: 0.9 + i * 0.1, duration: 0.4 }}
        >
          <circle cx={p.x} cy={p.y} r="1" fill={color} />
          <line x1={p.x - 2} y1={p.y} x2={p.x + 2} y2={p.y} stroke={color} strokeWidth="0.6" />
          <line x1={p.x} y1={p.y - 2} x2={p.x} y2={p.y + 2} stroke={color} strokeWidth="0.6" />
        </motion.g>
      ))}
    </svg>
  );
}

/* ── Inline step icons ── */

function ShoppingBagIcon({ color }: { color: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <rect x="3" y="7" width="14" height="11" rx="2" stroke={color} strokeWidth="1.5" />
      <path d="M7 7V5C7 3.34 8.34 2 10 2C11.66 2 13 3.34 13 5V7" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function CoinIcon({ color }: { color: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="10" r="7.5" stroke={color} strokeWidth="1.5" />
      <text x="10" y="14" textAnchor="middle" fontSize="10" fill={color} fontWeight="800">$</text>
    </svg>
  );
}

function GiftIcon({ color }: { color: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <rect x="3" y="9" width="14" height="9" rx="1.5" stroke={color} strokeWidth="1.5" />
      <rect x="2" y="6" width="16" height="3" rx="1" stroke={color} strokeWidth="1.5" />
      <line x1="10" y1="6" x2="10" y2="18" stroke={color} strokeWidth="1.5" />
      <path d="M10 6C10 6 8 4 6 4C4.5 4 4 5 4.5 5.5C5 6 10 6 10 6Z" stroke={color} strokeWidth="1" fill={color} opacity={0.3} />
      <path d="M10 6C10 6 12 4 14 4C15.5 4 16 5 15.5 5.5C15 6 10 6 10 6Z" stroke={color} strokeWidth="1" fill={color} opacity={0.3} />
    </svg>
  );
}

export default function LoyaltyHighlight() {
  const { isClassic } = useMode();
  const { config } = useConfig();

  if (!config.loyalty.enabled) return null;

  const accent = isClassic ? '#EB7A29' : '#4AA056';
  const accentDark = isClassic ? '#9A1E29' : '#3D8A48';

  const tierNames = config.loyalty.tier_names || ['Bronze', 'Silver', 'Gold'];

  const tiers = [
    {
      name: tierNames[0] || 'Bronze',
      icon: (color: string) => <BronzeMedalSVG color={color} />,
      threshold: 'Start',
      multiplier: '1x earnings',
      perk: 'Birthday treat',
      isGold: false,
    },
    {
      name: tierNames[1] || 'Silver',
      icon: (color: string) => <SilverMedalSVG color={color} />,
      threshold: `${config.loyalty.tier_silver_threshold}+ ${config.loyalty.point_name_plural}`,
      multiplier: `${config.loyalty.tier_silver_multiplier}x earnings`,
      perk: 'Early access',
      isGold: false,
    },
    {
      name: tierNames[2] || 'Gold',
      icon: (color: string) => <GoldCrownSVG color={color} />,
      threshold: `${config.loyalty.tier_gold_threshold.toLocaleString()}+ ${config.loyalty.point_name_plural}`,
      multiplier: `${config.loyalty.tier_gold_multiplier}x earnings`,
      perk: 'VIP perks',
      isGold: true,
    },
  ];

  const steps = [
    { label: 'Order', Icon: ShoppingBagIcon },
    { label: `Earn ${config.loyalty.point_name_plural}`, Icon: CoinIcon },
    { label: 'Redeem Savings', Icon: GiftIcon },
  ];

  return (
    <section
      className="py-14 px-5 transition-colors duration-500"
      style={{ backgroundColor: isClassic ? '#FDF5EC' : '#EDF7F0' }}
    >
      <div className="max-w-[1200px] mx-auto">
        {/* ── Heading ── */}
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <h2
            className="text-2xl md:text-[1.75rem] font-black text-gray-900"
            style={{ fontFamily: "var(--font-poppins)" }}
          >
            {isClassic ? 'Level Up. Earn More.' : 'Your Wellness Tiers'}
          </h2>
          <p className="text-sm text-gray-600 mt-2 max-w-md mx-auto">
            {isClassic
              ? 'Every order takes you closer to the next tier. More rewards, more perks.'
              : 'Climb the wellness ladder and unlock healthier rewards at every level.'}
          </p>
        </motion.div>

        {/* ── Tier cards grid ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
          {tiers.map((tier, i) => (
            <motion.div
              key={tier.name}
              className="bg-white rounded-2xl p-6 text-center"
              style={{
                boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
                ...(tier.isGold ? { border: `2px solid ${accent}` } : {}),
              }}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -4 }}
            >
              {/* Tier icon */}
              <motion.div
                className="w-[56px] h-[56px] mx-auto mb-4 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: isClassic ? 'rgba(235,122,41,0.1)' : 'rgba(74,160,86,0.1)' }}
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ delay: 0.2 + i * 0.1, type: 'spring', stiffness: 250 }}
              >
                {tier.icon(accent)}
              </motion.div>

              {/* Tier name */}
              <h3
                className="text-lg font-bold text-gray-900 mb-1"
                style={{ fontFamily: "var(--font-poppins)" }}
              >
                {tier.name}
              </h3>

              {/* Threshold */}
              <p className="text-xs text-gray-500 mb-3">{tier.threshold}</p>

              {/* Multiplier */}
              <motion.span
                className="inline-block text-sm font-bold px-3 py-1 rounded-full mb-3"
                style={{
                  backgroundColor: isClassic ? 'rgba(235,122,41,0.1)' : 'rgba(74,160,86,0.1)',
                  color: accent,
                }}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ delay: 0.3 + i * 0.1, type: 'spring', stiffness: 200 }}
              >
                {tier.multiplier}
              </motion.span>

              {/* Perk */}
              <p className="text-xs text-gray-600">{tier.perk}</p>
            </motion.div>
          ))}
        </div>

        {/* ── How It Works strip ── */}
        <motion.div
          className="flex flex-wrap items-center justify-center gap-4 md:gap-6 mb-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ delay: 0.4, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          {steps.map((step, i) => (
            <div key={step.label} className="inline-flex items-center gap-2">
              {/* Dashed connector (before steps 2 and 3) */}
              {i > 0 && (
                <motion.span
                  className="hidden md:inline-block w-10 border-t-2 border-dashed mr-2"
                  style={{ borderColor: isClassic ? 'rgba(235,122,41,0.35)' : 'rgba(74,160,86,0.35)' }}
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ delay: 0.5 + i * 0.1, duration: 0.3 }}
                />
              )}

              <motion.span
                className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full text-sm font-semibold text-gray-700"
                style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ delay: 0.5 + i * 0.1, type: 'spring', stiffness: 200 }}
              >
                <step.Icon color={accent} />
                {step.label}
              </motion.span>

              {/* Arrow between steps on mobile */}
              {i < steps.length - 1 && (
                <span className="md:hidden text-gray-400 ml-1" style={{ color: accent }}>
                  &rarr;
                </span>
              )}
            </div>
          ))}
        </motion.div>

        {/* ── CTA ── */}
        <motion.div
          className="flex justify-center"
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <Link href="/rewards">
            <motion.span
              className="inline-block px-7 py-3.5 rounded-xl text-sm font-bold text-white transition-all duration-200"
              style={{ backgroundColor: accentDark }}
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.97 }}
            >
              View Your Rewards &rarr;
            </motion.span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
