'use client';

import { useMode } from '@/hooks/useMode';
import { motion } from 'framer-motion';

/* ── SVG Illustrations for each award ── */

function ZomatoTrophySVG({ color }: { color: string }) {
  return (
    <svg width="72" height="72" viewBox="0 0 72 72" fill="none">
      {/* Zomato-style badge circle */}
      <motion.circle cx="36" cy="32" r="22" fill={color} opacity={0.1}
        initial={{ scale: 0 }} whileInView={{ scale: 1 }}
        viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.5, type: 'spring', stiffness: 200 }}
      />
      <motion.circle cx="36" cy="32" r="22" stroke={color} strokeWidth="2" fill="none"
        initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }}
        viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.8, ease: 'easeOut' }}
      />
      {/* Inner ribbon badge */}
      <motion.path
        d="M36 14L40 22L49 23.5L42.5 30L44 39L36 35L28 39L29.5 30L23 23.5L32 22Z"
        fill={color} opacity={0.25}
        initial={{ scale: 0, rotate: -180 }}
        whileInView={{ scale: 1, rotate: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        style={{ transformOrigin: '36px 26px' }}
        transition={{ delay: 0.3, duration: 0.6, type: 'spring', stiffness: 200 }}
      />
      {/* Star in center */}
      <motion.path
        d="M36 20L38.5 25L44 25.8L40 29.7L41 35.2L36 32.5L31 35.2L32 29.7L28 25.8L33.5 25Z"
        fill={color}
        initial={{ scale: 0 }} whileInView={{ scale: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        style={{ transformOrigin: '36px 27px' }}
        transition={{ delay: 0.5, duration: 0.4, type: 'spring', stiffness: 300 }}
      />
      {/* Ribbon tails */}
      <motion.path d="M28 39L24 50L30 46L33 54" stroke={color} strokeWidth="2" strokeLinecap="round" fill="none"
        initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }}
        viewport={{ once: true, amount: 0.3 }} transition={{ delay: 0.7, duration: 0.5 }}
      />
      <motion.path d="M44 39L48 50L42 46L39 54" stroke={color} strokeWidth="2" strokeLinecap="round" fill="none"
        initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }}
        viewport={{ once: true, amount: 0.3 }} transition={{ delay: 0.8, duration: 0.5 }}
      />
      {/* Sparkles */}
      {[{ x: 12, y: 16 }, { x: 58, y: 18 }, { x: 56, y: 44 }].map((p, i) => (
        <motion.g key={i}
          initial={{ scale: 0, opacity: 0 }}
          whileInView={{ scale: [0, 1.4, 1], opacity: [0, 0.8, 0.5] }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ delay: 1 + i * 0.12, duration: 0.4 }}
        >
          <circle cx={p.x} cy={p.y} r="1.5" fill={color} />
          <line x1={p.x - 3} y1={p.y} x2={p.x + 3} y2={p.y} stroke={color} strokeWidth="0.8" />
          <line x1={p.x} y1={p.y - 3} x2={p.x} y2={p.y + 3} stroke={color} strokeWidth="0.8" />
        </motion.g>
      ))}
    </svg>
  );
}

function HappyCustomersSVG({ color }: { color: string }) {
  return (
    <svg width="72" height="72" viewBox="0 0 72 72" fill="none">
      {/* Heart background */}
      <motion.path
        d="M36 58C36 58 10 42 10 26C10 18 16 12 24 12C29 12 33 14.5 36 18C39 14.5 43 12 48 12C56 12 62 18 62 26C62 42 36 58 36 58Z"
        fill={color} opacity={0.08}
        initial={{ scale: 0 }} whileInView={{ scale: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        style={{ transformOrigin: '36px 36px' }}
        transition={{ duration: 0.6, type: 'spring' }}
      />
      {/* Heart outline */}
      <motion.path
        d="M36 58C36 58 10 42 10 26C10 18 16 12 24 12C29 12 33 14.5 36 18C39 14.5 43 12 48 12C56 12 62 18 62 26C62 42 36 58 36 58Z"
        stroke={color} strokeWidth="2" fill="none"
        initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }}
        viewport={{ once: true, amount: 0.3 }} transition={{ duration: 1, ease: 'easeOut' }}
      />
      {/* Center person */}
      <motion.circle cx="36" cy="28" r="4" fill={color}
        initial={{ scale: 0 }} whileInView={{ scale: 1 }}
        viewport={{ once: true, amount: 0.3 }} transition={{ delay: 0.5, type: 'spring', stiffness: 300 }}
      />
      <motion.path d="M28 42C28 36 31 33 36 33C41 33 44 36 44 42" stroke={color} strokeWidth="2" strokeLinecap="round" fill="none"
        initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }}
        viewport={{ once: true, amount: 0.3 }} transition={{ delay: 0.6, duration: 0.5 }}
      />
      {/* Left person */}
      <motion.circle cx="24" cy="32" r="3" fill={color} opacity={0.6}
        initial={{ scale: 0 }} whileInView={{ scale: 1 }}
        viewport={{ once: true, amount: 0.3 }} transition={{ delay: 0.7, type: 'spring', stiffness: 300 }}
      />
      <motion.path d="M18 44C18 40 20.5 37 24 37C27.5 37 30 40 30 44" stroke={color} strokeWidth="1.5" strokeLinecap="round" fill="none" opacity={0.6}
        initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }}
        viewport={{ once: true, amount: 0.3 }} transition={{ delay: 0.8, duration: 0.4 }}
      />
      {/* Right person */}
      <motion.circle cx="48" cy="32" r="3" fill={color} opacity={0.6}
        initial={{ scale: 0 }} whileInView={{ scale: 1 }}
        viewport={{ once: true, amount: 0.3 }} transition={{ delay: 0.7, type: 'spring', stiffness: 300 }}
      />
      <motion.path d="M42 44C42 40 44.5 37 48 37C51.5 37 54 40 54 44" stroke={color} strokeWidth="1.5" strokeLinecap="round" fill="none" opacity={0.6}
        initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }}
        viewport={{ once: true, amount: 0.3 }} transition={{ delay: 0.8, duration: 0.4 }}
      />
      {/* Celebration dots */}
      {[{ x: 18, y: 18 }, { x: 54, y: 20 }, { x: 36, y: 14 }].map((p, i) => (
        <motion.circle key={i} cx={p.x} cy={p.y} r="2" fill={color} opacity={0.4}
          initial={{ scale: 0, y: 5 }}
          whileInView={{ scale: [0, 1.3, 1], y: [5, -2, 0] }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ delay: 1 + i * 0.15, duration: 0.5 }}
        />
      ))}
    </svg>
  );
}

function BestStoreSVG({ color }: { color: string }) {
  return (
    <svg width="72" height="72" viewBox="0 0 72 72" fill="none">
      {/* Store building */}
      <motion.rect x="14" y="28" width="44" height="30" rx="3" fill={color} opacity={0.08}
        initial={{ scaleY: 0 }} whileInView={{ scaleY: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        style={{ transformOrigin: '36px 58px' }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      />
      <motion.rect x="14" y="28" width="44" height="30" rx="3" stroke={color} strokeWidth="2" fill="none"
        initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }}
        viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.8, ease: 'easeOut' }}
      />
      {/* Awning/roof */}
      <motion.path
        d="M10 28C10 28 18 20 24 28C30 20 36 28 36 28C36 28 42 20 48 28C54 20 62 28 62 28"
        stroke={color} strokeWidth="2.5" strokeLinecap="round" fill="none"
        initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }}
        viewport={{ once: true, amount: 0.3 }} transition={{ delay: 0.3, duration: 0.8, ease: 'easeOut' }}
      />
      {/* Awning fill scallops */}
      <motion.path d="M10 28C18 20 24 28 24 28C18 28 10 28 10 28Z" fill={color} opacity={0.15}
        initial={{ scale: 0 }} whileInView={{ scale: 1 }}
        viewport={{ once: true, amount: 0.3 }} transition={{ delay: 0.5, duration: 0.3 }}
      />
      <motion.path d="M24 28C30 20 36 28 36 28C30 28 24 28 24 28Z" fill={color} opacity={0.12}
        initial={{ scale: 0 }} whileInView={{ scale: 1 }}
        viewport={{ once: true, amount: 0.3 }} transition={{ delay: 0.55, duration: 0.3 }}
      />
      <motion.path d="M36 28C42 20 48 28 48 28C42 28 36 28 36 28Z" fill={color} opacity={0.15}
        initial={{ scale: 0 }} whileInView={{ scale: 1 }}
        viewport={{ once: true, amount: 0.3 }} transition={{ delay: 0.6, duration: 0.3 }}
      />
      <motion.path d="M48 28C54 20 62 28 62 28C56 28 48 28 48 28Z" fill={color} opacity={0.12}
        initial={{ scale: 0 }} whileInView={{ scale: 1 }}
        viewport={{ once: true, amount: 0.3 }} transition={{ delay: 0.65, duration: 0.3 }}
      />
      {/* Door */}
      <motion.rect x="30" y="42" width="12" height="16" rx="2" stroke={color} strokeWidth="1.5" fill={color} fillOpacity={0.12}
        initial={{ scaleY: 0 }} whileInView={{ scaleY: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        style={{ transformOrigin: '36px 58px' }}
        transition={{ delay: 0.6, duration: 0.4, ease: 'easeOut' }}
      />
      <motion.circle cx="39" cy="50" r="1" fill={color}
        initial={{ scale: 0 }} whileInView={{ scale: 1 }}
        viewport={{ once: true, amount: 0.3 }} transition={{ delay: 0.9, type: 'spring' }}
      />
      {/* Windows */}
      <motion.rect x="18" y="34" width="8" height="6" rx="1" stroke={color} strokeWidth="1.5" fill={color} fillOpacity={0.1}
        initial={{ scale: 0 }} whileInView={{ scale: 1 }}
        viewport={{ once: true, amount: 0.3 }} transition={{ delay: 0.7, type: 'spring', stiffness: 200 }}
      />
      <motion.rect x="46" y="34" width="8" height="6" rx="1" stroke={color} strokeWidth="1.5" fill={color} fillOpacity={0.1}
        initial={{ scale: 0 }} whileInView={{ scale: 1 }}
        viewport={{ once: true, amount: 0.3 }} transition={{ delay: 0.75, type: 'spring', stiffness: 200 }}
      />
      {/* Crown on top */}
      <motion.path
        d="M30 18L33 14L36 10L39 14L42 18L39 16L36 18L33 16Z"
        fill={color}
        initial={{ scale: 0, y: 5 }} whileInView={{ scale: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        style={{ transformOrigin: '36px 14px' }}
        transition={{ delay: 0.9, duration: 0.4, type: 'spring', stiffness: 200 }}
      />
      {/* Sparkles */}
      {[{ x: 8, y: 14 }, { x: 64, y: 16 }].map((p, i) => (
        <motion.g key={i}
          initial={{ scale: 0, opacity: 0 }}
          whileInView={{ scale: [0, 1.3, 1], opacity: [0, 0.6, 0.4] }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ delay: 1.1 + i * 0.12, duration: 0.4 }}
        >
          <circle cx={p.x} cy={p.y} r="1.5" fill={color} />
          <line x1={p.x - 3} y1={p.y} x2={p.x + 3} y2={p.y} stroke={color} strokeWidth="0.8" />
          <line x1={p.x} y1={p.y - 3} x2={p.x} y2={p.y + 3} stroke={color} strokeWidth="0.8" />
        </motion.g>
      ))}
    </svg>
  );
}

function StarRatingSVG({ color }: { color: string }) {
  return (
    <svg width="72" height="72" viewBox="0 0 72 72" fill="none">
      {/* Circular badge */}
      <motion.circle cx="36" cy="36" r="26" stroke={color} strokeWidth="2" fill="none" opacity={0.15}
        initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }}
        viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.8 }}
      />
      {/* Progress arc — nearly full (4.9/5 = 98%) */}
      <motion.circle cx="36" cy="36" r="26" stroke={color} strokeWidth="2.5" fill="none"
        strokeDasharray="163.4" strokeDashoffset="3.3" strokeLinecap="round"
        style={{ transformOrigin: '36px 36px', rotate: -90 }}
        initial={{ strokeDashoffset: 163.4 }}
        whileInView={{ strokeDashoffset: 3.3 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ delay: 0.3, duration: 1.2, ease: 'easeOut' }}
      />
      {/* Big star */}
      <motion.path
        d="M36 18L40 28L51 29.5L43.5 37L45.5 48L36 43L26.5 48L28.5 37L21 29.5L32 28Z"
        fill={color} opacity={0.2}
        initial={{ scale: 0, rotate: -90 }}
        whileInView={{ scale: 1, rotate: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        style={{ transformOrigin: '36px 33px' }}
        transition={{ delay: 0.4, duration: 0.6, type: 'spring', stiffness: 200 }}
      />
      <motion.path
        d="M36 18L40 28L51 29.5L43.5 37L45.5 48L36 43L26.5 48L28.5 37L21 29.5L32 28Z"
        stroke={color} strokeWidth="1.5" fill="none"
        initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }}
        viewport={{ once: true, amount: 0.3 }} transition={{ delay: 0.5, duration: 0.8 }}
      />
      {/* 4.9 text */}
      <motion.text x="36" y="38" textAnchor="middle" fontSize="12" fontWeight="900" fill={color}
        initial={{ opacity: 0, scale: 0.5 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ delay: 0.8, duration: 0.4, type: 'spring', stiffness: 200 }}
      >
        4.9
      </motion.text>
      {/* Small star rating row */}
      {[0, 1, 2, 3, 4].map((i) => (
        <motion.path
          key={i}
          d={`M${22 + i * 7} 52L${23.2 + i * 7} 54.5L${26 + i * 7} 54.8L${24 + i * 7} 56.8L${24.5 + i * 7} 59.5L${22 + i * 7} 58L${19.5 + i * 7} 59.5L${20 + i * 7} 56.8L${18 + i * 7} 54.8L${20.8 + i * 7} 54.5Z`}
          fill={color}
          opacity={0.7}
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          style={{ transformOrigin: `${22 + i * 7}px 56px` }}
          transition={{ delay: 1 + i * 0.08, duration: 0.3, type: 'spring', stiffness: 300 }}
        />
      ))}
      {/* Sparkle accents */}
      {[{ x: 10, y: 22 }, { x: 62, y: 24 }].map((p, i) => (
        <motion.g key={i}
          initial={{ scale: 0, opacity: 0 }}
          whileInView={{ scale: [0, 1.4, 1], opacity: [0, 0.7, 0.4] }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ delay: 1.3 + i * 0.15, duration: 0.4 }}
        >
          <circle cx={p.x} cy={p.y} r="1.5" fill={color} />
          <line x1={p.x - 3} y1={p.y} x2={p.x + 3} y2={p.y} stroke={color} strokeWidth="0.8" />
          <line x1={p.x} y1={p.y - 3} x2={p.x} y2={p.y + 3} stroke={color} strokeWidth="0.8" />
        </motion.g>
      ))}
    </svg>
  );
}

/* ── Award card data ── */

type AwardItem = {
  illustration: (color: string) => React.ReactNode;
  title: string;
  subtitle: string;
  highlight: string;
};

const awards: AwardItem[] = [
  {
    illustration: (c) => <ZomatoTrophySVG color={c} />,
    title: 'Best Burger',
    subtitle: 'Awarded by Zomato',
    highlight: '#1 Burger',
  },
  {
    illustration: (c) => <HappyCustomersSVG color={c} />,
    title: '50K+ Happy Customers',
    subtitle: 'And counting every day',
    highlight: '50,000+',
  },
  {
    illustration: (c) => <BestStoreSVG color={c} />,
    title: 'Best Store',
    subtitle: 'Top-rated in the city',
    highlight: 'Best Store',
  },
  {
    illustration: (c) => <StarRatingSVG color={c} />,
    title: '4.9 Star Rating',
    subtitle: 'By 40K+ loyal customers',
    highlight: '4.9 / 5',
  },
];

/* ── Decorative background wave ── */
function BackgroundDecor({ color }: { color: string }) {
  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 1200 300" preserveAspectRatio="none" fill="none">
      <motion.path
        d="M0 150C200 100 400 200 600 150C800 100 1000 200 1200 150"
        stroke={color} strokeWidth="1" opacity={0.06}
        initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }}
        viewport={{ once: true, amount: 0.3 }} transition={{ duration: 2.5, ease: 'easeOut' }}
      />
      <motion.path
        d="M0 180C300 130 600 230 900 180C1050 155 1200 200 1200 200"
        stroke={color} strokeWidth="0.8" opacity={0.04}
        initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }}
        viewport={{ once: true, amount: 0.3 }} transition={{ delay: 0.5, duration: 2, ease: 'easeOut' }}
      />
    </svg>
  );
}

export default function AwardsSection() {
  const { isClassic } = useMode();
  const accent = isClassic ? '#EB7A29' : '#4AA056';
  const sectionBg = isClassic ? '#FCF0DE' : '#E0F2E6';

  return (
    <section
      className="py-14 md:py-20 px-5 has-pattern overflow-hidden relative"
      style={{ backgroundColor: sectionBg }}
    >
      <BackgroundDecor color={accent} />

      <div className="max-w-[1200px] mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.span
            className="inline-flex items-center gap-2 text-[0.625rem] font-bold uppercase tracking-[0.2em] mb-3 px-3 py-1 rounded-full border"
            style={{
              color: accent,
              borderColor: isClassic ? 'rgba(235,122,41,0.25)' : 'rgba(74,160,86,0.25)',
              backgroundColor: isClassic ? 'rgba(235,122,41,0.08)' : 'rgba(74,160,86,0.08)',
            }}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.4 }}
          >
            {isClassic ? 'Award-Winning Burgers' : 'Award-Winning Quality'}
          </motion.span>

          <motion.h2
            className="text-2xl md:text-[2.25rem] font-black text-gray-900 leading-tight"
            style={{ fontFamily: "var(--font-poppins)" }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ delay: 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            {isClassic ? "Don't Just Take Our Word For It" : 'Recognized for Excellence'}
          </motion.h2>

          <motion.p
            className="text-sm text-gray-600 mt-2 max-w-md mx-auto"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ delay: 0.2, duration: 0.4 }}
          >
            {isClassic
              ? 'From food critics to 50K+ fans — the love is real and the burgers speak for themselves.'
              : 'Quality you can trust, recognized by industry leaders and thousands of happy customers.'}
          </motion.p>
        </div>

        {/* Awards Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {awards.map((award, i) => (
            <motion.div
              key={award.title}
              className="relative group rounded-2xl p-5 md:p-6 text-center backdrop-blur-sm transition-colors duration-500"
              style={{
                backgroundColor: isClassic ? 'rgba(255,255,255,0.65)' : 'rgba(255,255,255,0.6)',
              }}
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -6, scale: 1.02 }}
            >
              {/* Subtle glow pulse */}
              <motion.div
                className="absolute inset-0 rounded-2xl pointer-events-none"
                style={{ backgroundColor: accent, opacity: 0.03 }}
                animate={{ scale: [1, 1.05, 1], opacity: [0.03, 0.08, 0.03] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: i * 0.7 }}
              />

              {/* Illustration */}
              <motion.div
                className="w-[72px] h-[72px] mx-auto mb-4 rounded-2xl flex items-center justify-center relative overflow-hidden"
                style={{ backgroundColor: isClassic ? 'rgba(235,122,41,0.1)' : 'rgba(74,160,86,0.1)' }}
                whileHover={{ scale: 1.08, rotate: 3 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                {award.illustration(accent)}
              </motion.div>

              {/* Highlight number */}
              <motion.div
                className="text-xl md:text-2xl font-black leading-tight"
                style={{ color: accent }}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ delay: 0.3 + i * 0.12, duration: 0.4, type: 'spring', stiffness: 200 }}
              >
                {award.highlight}
              </motion.div>

              {/* Title */}
              <motion.h3
                className="text-sm font-bold text-gray-900 mt-1"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ delay: 0.4 + i * 0.12, duration: 0.3 }}
              >
                {award.title}
              </motion.h3>

              {/* Subtitle */}
              <motion.p
                className="text-[0.6875rem] text-gray-600 mt-0.5"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ delay: 0.5 + i * 0.12, duration: 0.3 }}
              >
                {award.subtitle}
              </motion.p>

              {/* Decorative bottom accent line */}
              <motion.div
                className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[3px] rounded-full w-[40%]"
                style={{ backgroundColor: accent, transformOrigin: 'center' }}
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ delay: 0.6 + i * 0.12, duration: 0.5, ease: 'easeOut' }}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
