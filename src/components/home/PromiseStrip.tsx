'use client';

import { useMode } from '@/hooks/useMode';
import { motion } from 'framer-motion';

/* ── Animated SVG illustrations for each stat ── */

function FreshPattyIllustration({ color }: { color: string }) {
  return (
    <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
      {/* Sizzling patty on grill */}
      <motion.rect x="8" y="28" width="40" height="12" rx="6" fill={color}
        initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }}
        viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.6, ease: 'easeOut' }}
      />
      {/* Grill lines */}
      {[16, 24, 32, 40].map((x, i) => (
        <motion.line key={x} x1={x} y1="42" x2={x} y2="48" stroke={color} strokeWidth="2" strokeLinecap="round" opacity={0.3}
          initial={{ scaleY: 0 }} whileInView={{ scaleY: 1 }}
          viewport={{ once: true, amount: 0.3 }} transition={{ delay: 0.5 + i * 0.08, duration: 0.3 }}
        />
      ))}
      {/* Steam wisps */}
      {[18, 28, 38].map((x, i) => (
        <motion.path key={x}
          d={`M${x} 26C${x - 2} 20 ${x + 2} 16 ${x} 10`}
          stroke={color} strokeWidth="1.5" strokeLinecap="round" fill="none" opacity={0.4}
          initial={{ pathLength: 0, opacity: 0 }}
          whileInView={{ pathLength: 1, opacity: 0.4 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ delay: 0.7 + i * 0.15, duration: 0.8, ease: 'easeOut' }}
        />
      ))}
      {/* Sparkle */}
      <motion.circle cx="44" cy="12" r="2" fill={color} opacity={0.6}
        initial={{ scale: 0 }} whileInView={{ scale: [0, 1.4, 1] }}
        viewport={{ once: true, amount: 0.3 }} transition={{ delay: 1.2, duration: 0.4 }}
      />
      <motion.path d="M44 8V6M44 18V16M40 12H38M50 12H48" stroke={color} strokeWidth="1" strokeLinecap="round" opacity={0.4}
        initial={{ scale: 0 }} whileInView={{ scale: 1 }}
        viewport={{ once: true, amount: 0.3 }} transition={{ delay: 1.3, duration: 0.3 }}
      />
    </svg>
  );
}

function DailyFreshIllustration({ color }: { color: string }) {
  return (
    <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
      {/* Flame base */}
      <motion.path
        d="M28 48C20 48 14 42 14 34C14 26 20 20 24 16C24 22 28 24 28 24C28 24 32 22 32 16C36 20 42 26 42 34C42 42 36 48 28 48Z"
        fill={color} opacity={0.15}
        initial={{ scale: 0.5, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 0.15 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      />
      {/* Inner flame */}
      <motion.path
        d="M28 44C23 44 19 40 19 35C19 30 23 26 25 23C25 27 28 28 28 28C28 28 31 27 31 23C33 26 37 30 37 35C37 40 33 44 28 44Z"
        fill={color} opacity={0.3}
        initial={{ scale: 0.3, y: 10 }}
        whileInView={{ scale: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ delay: 0.2, duration: 0.5, ease: 'easeOut' }}
      />
      {/* Flame core */}
      <motion.path
        d="M28 40C25 40 23 38 23 35C23 32 26 29 27 27C27.5 30 28 30 28 30C28 30 28.5 30 29 27C30 29 33 32 33 35C33 38 31 40 28 40Z"
        fill={color}
        initial={{ scale: 0, y: 8 }}
        whileInView={{ scale: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ delay: 0.4, duration: 0.5, type: 'spring' }}
      />
      {/* Flickering embers */}
      {[{ x: 16, y: 18 }, { x: 40, y: 16 }, { x: 12, y: 28 }].map((p, i) => (
        <motion.circle key={i} cx={p.x} cy={p.y} r="1.5" fill={color} opacity={0.5}
          initial={{ scale: 0, y: 10 }}
          whileInView={{ scale: [0, 1, 0], y: [10, -5] }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ delay: 0.8 + i * 0.2, duration: 1, ease: 'easeOut' }}
        />
      ))}
    </svg>
  );
}

function SpeedIllustration({ color }: { color: string }) {
  return (
    <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
      {/* Clock face */}
      <motion.circle cx="28" cy="28" r="18" stroke={color} strokeWidth="2.5" fill="none" opacity={0.2}
        initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }}
        viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.8, ease: 'easeOut' }}
      />
      {/* Progress arc */}
      <motion.circle cx="28" cy="28" r="18" stroke={color} strokeWidth="2.5" fill="none"
        strokeDasharray="113" strokeDashoffset="28" strokeLinecap="round"
        style={{ transformOrigin: '28px 28px', rotate: -90 }}
        initial={{ strokeDashoffset: 113 }}
        whileInView={{ strokeDashoffset: 28 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ delay: 0.3, duration: 1, ease: 'easeOut' }}
      />
      {/* Clock center */}
      <motion.circle cx="28" cy="28" r="2.5" fill={color}
        initial={{ scale: 0 }} whileInView={{ scale: 1 }}
        viewport={{ once: true, amount: 0.3 }} transition={{ delay: 0.5, type: 'spring', stiffness: 300 }}
      />
      {/* Minute hand */}
      <motion.line x1="28" y1="28" x2="28" y2="16" stroke={color} strokeWidth="2.5" strokeLinecap="round"
        style={{ transformOrigin: '28px 28px' }}
        initial={{ rotate: 0, opacity: 0 }}
        whileInView={{ rotate: 240, opacity: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ delay: 0.4, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      />
      {/* Speed lines */}
      {[0, 1, 2].map((i) => (
        <motion.line key={i}
          x1={4} y1={22 + i * 6} x2={10} y2={22 + i * 6}
          stroke={color} strokeWidth="1.5" strokeLinecap="round" opacity={0.4}
          initial={{ x: 10, opacity: 0 }}
          whileInView={{ x: 0, opacity: 0.4 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ delay: 1 + i * 0.1, duration: 0.4, ease: 'easeOut' }}
        />
      ))}
      {/* Lightning bolt */}
      <motion.path d="M44 10L40 20H44L40 28" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"
        initial={{ pathLength: 0, opacity: 0 }}
        whileInView={{ pathLength: 1, opacity: 0.6 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ delay: 1.2, duration: 0.5 }}
      />
    </svg>
  );
}

function TrophyIllustration({ color }: { color: string }) {
  return (
    <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
      {/* Trophy cup */}
      <motion.path
        d="M18 14H38V28C38 34 34 38 28 38C22 38 18 34 18 28V14Z"
        fill={color} opacity={0.15}
        initial={{ scaleY: 0 }} whileInView={{ scaleY: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        style={{ transformOrigin: '28px 38px' }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      />
      <motion.path
        d="M18 14H38V28C38 34 34 38 28 38C22 38 18 34 18 28V14Z"
        stroke={color} strokeWidth="2" fill="none"
        initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      />
      {/* Left handle */}
      <motion.path d="M18 18H14C12 18 10 20 10 22C10 24 12 26 14 26H18" stroke={color} strokeWidth="2" fill="none" strokeLinecap="round"
        initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }}
        viewport={{ once: true, amount: 0.3 }} transition={{ delay: 0.3, duration: 0.5 }}
      />
      {/* Right handle */}
      <motion.path d="M38 18H42C44 18 46 20 46 22C46 24 44 26 42 26H38" stroke={color} strokeWidth="2" fill="none" strokeLinecap="round"
        initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }}
        viewport={{ once: true, amount: 0.3 }} transition={{ delay: 0.3, duration: 0.5 }}
      />
      {/* Stem */}
      <motion.line x1="28" y1="38" x2="28" y2="44" stroke={color} strokeWidth="2" strokeLinecap="round"
        initial={{ scaleY: 0 }} whileInView={{ scaleY: 1 }}
        viewport={{ once: true, amount: 0.3 }} style={{ transformOrigin: '28px 38px' }}
        transition={{ delay: 0.6, duration: 0.3 }}
      />
      {/* Base */}
      <motion.rect x="20" y="44" width="16" height="3" rx="1.5" fill={color}
        initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }}
        viewport={{ once: true, amount: 0.3 }} transition={{ delay: 0.7, duration: 0.3 }}
      />
      {/* Star */}
      <motion.path d="M28 20L30 24L34 24.5L31 27.5L32 32L28 30L24 32L25 27.5L22 24.5L26 24Z" fill={color}
        initial={{ scale: 0, rotate: -180 }} whileInView={{ scale: 1, rotate: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        style={{ transformOrigin: '28px 26px' }}
        transition={{ delay: 0.9, duration: 0.5, type: 'spring', stiffness: 200 }}
      />
      {/* Celebration sparkles */}
      {[{ x: 10, y: 8 }, { x: 46, y: 10 }, { x: 8, y: 32 }].map((p, i) => (
        <motion.g key={i} initial={{ scale: 0, opacity: 0 }}
          whileInView={{ scale: [0, 1.3, 1], opacity: [0, 0.7, 0.5] }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ delay: 1.1 + i * 0.15, duration: 0.4 }}
        >
          <circle cx={p.x} cy={p.y} r="1" fill={color} />
          <line x1={p.x - 3} y1={p.y} x2={p.x + 3} y2={p.y} stroke={color} strokeWidth="0.8" />
          <line x1={p.x} y1={p.y - 3} x2={p.x} y2={p.y + 3} stroke={color} strokeWidth="0.8" />
        </motion.g>
      ))}
    </svg>
  );
}

/* ── Healthy mode illustrations ── */

function GrassFedIllustration({ color }: { color: string }) {
  return (
    <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
      {/* Cow silhouette stylized as badge */}
      <motion.circle cx="28" cy="28" r="20" stroke={color} strokeWidth="2" fill="none" opacity={0.2}
        initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }}
        viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.8 }}
      />
      <motion.path
        d="M18 30C18 26 20 22 24 20L22 16L26 18C27 17.5 29 17.5 30 18L34 16L32 20C36 22 38 26 38 30C38 34 34 38 28 38C22 38 18 34 18 30Z"
        fill={color} opacity={0.2}
        initial={{ scale: 0.5, opacity: 0 }} whileInView={{ scale: 1, opacity: 0.2 }}
        viewport={{ once: true, amount: 0.3 }} transition={{ delay: 0.3, duration: 0.5, type: 'spring' }}
      />
      {/* Checkmark */}
      <motion.path d="M22 28L26 32L34 24" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"
        initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }}
        viewport={{ once: true, amount: 0.3 }} transition={{ delay: 0.6, duration: 0.5, ease: 'easeOut' }}
      />
    </svg>
  );
}

function ZeroPreservativeIllustration({ color }: { color: string }) {
  return (
    <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
      {/* Leaf */}
      <motion.path
        d="M28 44C28 44 12 36 12 24C12 16 20 10 28 10C36 10 44 16 44 24C44 36 28 44 28 44Z"
        fill={color} opacity={0.12}
        initial={{ scale: 0, opacity: 0 }} whileInView={{ scale: 1, opacity: 0.12 }}
        viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.6 }}
      />
      {/* Leaf vein */}
      <motion.path d="M28 14V40M28 22L20 28M28 28L36 24" stroke={color} strokeWidth="1.5" strokeLinecap="round" fill="none" opacity={0.4}
        initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }}
        viewport={{ once: true, amount: 0.3 }} transition={{ delay: 0.3, duration: 0.8 }}
      />
      {/* Shield with 0 */}
      <motion.text x="28" y="32" textAnchor="middle" fontSize="14" fontWeight="800" fill={color}
        initial={{ opacity: 0, scale: 0.5 }} whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, amount: 0.3 }} transition={{ delay: 0.5, type: 'spring', stiffness: 200 }}
      >
        0
      </motion.text>
    </svg>
  );
}

function CalorieIllustration({ color }: { color: string }) {
  return (
    <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
      {/* Bowl */}
      <motion.path d="M12 28H44" stroke={color} strokeWidth="2.5" strokeLinecap="round"
        initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }}
        viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.5 }}
      />
      <motion.path d="M14 28C14 38 20 44 28 44C36 44 42 38 42 28"
        stroke={color} strokeWidth="2" fill="none"
        initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }}
        viewport={{ once: true, amount: 0.3 }} transition={{ delay: 0.2, duration: 0.6 }}
      />
      {/* Salad greens poking out */}
      {[20, 28, 36].map((x, i) => (
        <motion.ellipse key={x} cx={x} cy={24} rx="6" ry="4" fill={color} opacity={0.2}
          initial={{ scale: 0, y: 5 }} whileInView={{ scale: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }} transition={{ delay: 0.5 + i * 0.1, type: 'spring' }}
        />
      ))}
      {/* Small heart */}
      <motion.path d="M26 18C26 16 28 14 28 14C28 14 30 16 30 18C30 20 28 21 28 21C28 21 26 20 26 18Z"
        fill={color} opacity={0.6}
        initial={{ scale: 0 }} whileInView={{ scale: [0, 1.3, 1] }}
        viewport={{ once: true, amount: 0.3 }} transition={{ delay: 0.8, duration: 0.4 }}
      />
    </svg>
  );
}

function CleanLabelIllustration({ color }: { color: string }) {
  return (
    <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
      {/* Shield */}
      <motion.path
        d="M28 8L12 16V28C12 38 20 46 28 48C36 46 44 38 44 28V16L28 8Z"
        fill={color} opacity={0.1}
        initial={{ scale: 0.5, opacity: 0 }} whileInView={{ scale: 1, opacity: 0.1 }}
        viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.5 }}
      />
      <motion.path
        d="M28 8L12 16V28C12 38 20 46 28 48C36 46 44 38 44 28V16L28 8Z"
        stroke={color} strokeWidth="2" fill="none"
        initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }}
        viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.8, ease: 'easeOut' }}
      />
      {/* Leaf inside shield */}
      <motion.path d="M22 30C22 24 28 20 28 20C28 20 34 24 34 30C34 34 28 36 28 36C28 36 22 34 22 30Z"
        fill={color} opacity={0.25}
        initial={{ scale: 0 }} whileInView={{ scale: 1 }}
        viewport={{ once: true, amount: 0.3 }} transition={{ delay: 0.5, type: 'spring', stiffness: 200 }}
      />
      {/* Check */}
      <motion.path d="M24 28L27 31L33 25" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"
        initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }}
        viewport={{ once: true, amount: 0.3 }} transition={{ delay: 0.7, duration: 0.4 }}
      />
    </svg>
  );
}

type StatItem = {
  illustration: (color: string) => React.ReactNode;
  label: string;
  value: string;
};

const classicStats: StatItem[] = [
  { illustration: (c) => <FreshPattyIllustration color={c} />, label: 'Never Frozen, Ever', value: '100%' },
  { illustration: (c) => <DailyFreshIllustration color={c} />, label: 'Smashed Fresh Every Day', value: 'Daily' },
  { illustration: (c) => <SpeedIllustration color={c} />, label: 'Hot in Your Hands', value: '8 min' },
  { illustration: (c) => <TrophyIllustration color={c} />, label: 'Trusted Since Day One', value: '2018' },
];

const healthyStats: StatItem[] = [
  { illustration: (c) => <GrassFedIllustration color={c} />, label: 'Pasture-Raised Only', value: '100%' },
  { illustration: (c) => <ZeroPreservativeIllustration color={c} />, label: 'Nothing Artificial', value: 'Zero' },
  { illustration: (c) => <CalorieIllustration color={c} />, label: 'Smart Calories', value: '~650' },
  { illustration: (c) => <CleanLabelIllustration color={c} />, label: 'Clean Label Verified', value: 'Yes' },
];

export default function PromiseStrip() {
  const { isClassic } = useMode();
  const stats = isClassic ? classicStats : healthyStats;
  const accentColor = isClassic ? '#EB7A29' : '#4AA056';

  return (
    <section
      className="py-8 md:py-10 px-5 transition-colors duration-500 has-pattern overflow-hidden"
      style={{
        backgroundColor: isClassic ? '#FDF5EC' : '#EDF7F0',
      }}
    >
      {/* Decorative animated background line */}
      <motion.svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        viewBox="0 0 1200 120"
        preserveAspectRatio="none"
        fill="none"
      >
        <motion.path
          d="M0 60C150 30 300 90 450 60C600 30 750 90 900 60C1050 30 1200 90 1200 60"
          stroke={accentColor}
          strokeWidth="1"
          opacity={0.08}
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 2, ease: 'easeOut' }}
        />
      </motion.svg>

      <div className="promise-grid max-w-[1200px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            className="flex items-center gap-4 group rounded-2xl px-4 py-3 backdrop-blur-sm transition-colors duration-500"
            style={{ backgroundColor: isClassic ? 'rgba(255,255,255,0.55)' : 'rgba(255,255,255,0.5)' }}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
          >
            <motion.div
              className="w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0 transition-colors duration-500 relative overflow-hidden"
              style={{ backgroundColor: isClassic ? 'rgba(235,122,41,0.12)' : 'rgba(74,160,86,0.12)' }}
              whileHover={{ scale: 1.08, rotate: 2 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              {/* Subtle glow pulse */}
              <motion.div
                className="absolute inset-0 rounded-2xl"
                style={{ backgroundColor: accentColor, opacity: 0.05 }}
                animate={{ scale: [1, 1.3, 1], opacity: [0.05, 0.12, 0.05] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: i * 0.5 }}
              />
              {stat.illustration(accentColor)}
            </motion.div>
            <div>
              <motion.div
                className="text-lg font-black text-gray-900 leading-tight"
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ delay: 0.2 + i * 0.1, duration: 0.4 }}
              >
                {stat.value}
              </motion.div>
              <div className="text-[0.6875rem] text-gray-600 mt-0.5 font-medium">{stat.label}</div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
