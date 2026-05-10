'use client';

import { useRef } from 'react';
import { useMode } from '@/hooks/useMode';
import { motion, useScroll, useTransform } from 'framer-motion';
import { BreadIcon, WheatIcon, MeatIcon, LeafIcon, CheeseIcon, SaladIcon, FireIcon } from '@/components/icons';

/* ── Animated exploded burger illustration ── */
function ExplodedBurgerSVG() {
  return (
    <svg width="360" height="480" viewBox="0 0 360 480" fill="none" className="w-full h-full">
      <defs>
        <filter id="layerShadow">
          <feDropShadow dx="0" dy="6" stdDeviation="8" floodColor="rgba(0,0,0,0.15)" />
        </filter>
        <filter id="softGlow">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <linearGradient id="bunGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#D4952A" />
          <stop offset="100%" stopColor="#B07818" />
        </linearGradient>
        <linearGradient id="pattyGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#5D3A1A" />
          <stop offset="100%" stopColor="#3E2213" />
        </linearGradient>
        <linearGradient id="cheeseGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FFD54F" />
          <stop offset="100%" stopColor="#FF8F00" />
        </linearGradient>
      </defs>

      <g filter="url(#layerShadow)">
        {/* ── Top Bun ── */}
        <motion.g
          initial={{ opacity: 0, y: -60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        >
          <path d="M80 120C80 60 130 20 180 20C230 20 280 60 280 120H80Z" fill="url(#bunGrad)" />
          {/* Bun highlight arc */}
          <path d="M110 85C125 50 155 35 180 32C205 35 235 50 250 85" fill="none" stroke="#E8B84D" strokeWidth="12" strokeLinecap="round" opacity={0.3} />
          {/* Sesame seeds with pop-in */}
          {[
            { cx: 135, cy: 70, rx: 5, ry: 9, delay: 0.9 },
            { cx: 180, cy: 52, rx: 5, ry: 9, delay: 1.0 },
            { cx: 225, cy: 72, rx: 5, ry: 9, delay: 1.1 },
            { cx: 155, cy: 95, rx: 4, ry: 7, delay: 1.15 },
            { cx: 205, cy: 90, rx: 4, ry: 7, delay: 1.2 },
          ].map((s, i) => (
            <motion.ellipse key={i} cx={s.cx} cy={s.cy} rx={s.rx} ry={s.ry} fill="#F5E6C8"
              initial={{ scale: 0 }} whileInView={{ scale: 1 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ delay: s.delay, duration: 0.3, type: 'spring', stiffness: 300 }}
            />
          ))}
        </motion.g>

        {/* ── Lettuce ── */}
        <motion.g
          initial={{ opacity: 0, y: -40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        >
          <motion.path
            d="M65 160C65 160 95 135 120 148C145 161 155 138 180 148C205 158 215 135 240 148C265 161 295 140 295 160"
            fill="#43A047" opacity={0.85}
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          />
          <path d="M65 160C65 160 95 175 120 162C145 149 155 172 180 162C205 152 215 175 240 162C265 149 295 170 295 160"
            fill="#388E3C" opacity={0.6}
          />
          {/* Leaf vein details */}
          <motion.path d="M100 152L110 145M150 155L160 148M200 152L210 145M250 155L260 148"
            stroke="#2E7D32" strokeWidth="1" strokeLinecap="round" opacity={0.3}
            initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }}
            viewport={{ once: true, amount: 0.3 }} transition={{ delay: 0.8, duration: 0.6 }}
          />
        </motion.g>

        {/* ── Cheese ── */}
        <motion.g
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
        >
          <path d="M72 195H288L282 175H78L72 195Z" fill="url(#cheeseGrad)" />
          {/* Cheese drips */}
          <motion.path d="M85 195L80 215Q78 222 82 222Q86 222 84 215Z" fill="#FFD54F"
            initial={{ scaleY: 0, opacity: 0 }}
            whileInView={{ scaleY: 1, opacity: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            style={{ transformOrigin: '82px 195px' }}
            transition={{ delay: 1.0, duration: 0.5, ease: 'easeOut' }}
          />
          <motion.path d="M250 195L248 210Q247 216 251 216Q255 216 253 210Z" fill="#FFCA28"
            initial={{ scaleY: 0, opacity: 0 }}
            whileInView={{ scaleY: 1, opacity: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            style={{ transformOrigin: '250px 195px' }}
            transition={{ delay: 1.15, duration: 0.5, ease: 'easeOut' }}
          />
          {/* Cheese shine */}
          <motion.line x1="100" y1="183" x2="170" y2="183" stroke="white" strokeWidth="2" strokeLinecap="round" opacity={0.2}
            initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }}
            viewport={{ once: true, amount: 0.3 }} transition={{ delay: 0.8, duration: 0.4 }}
          />
        </motion.g>

        {/* ── Tomato ── */}
        <motion.g
          initial={{ opacity: 0, y: -20, scaleX: 0.3 }}
          whileInView={{ opacity: 1, y: 0, scaleX: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          style={{ transformOrigin: '180px 240px' }}
          transition={{ duration: 0.6, delay: 0.55, ease: [0.16, 1, 0.3, 1] }}
        >
          <rect x="78" y="225" width="204" height="24" rx="12" fill="#E53935" />
          <rect x="78" y="225" width="204" height="12" rx="6" fill="#EF5350" opacity={0.4} />
          {/* Tomato seed lines */}
          {[120, 160, 200, 240].map((x, i) => (
            <motion.line key={x} x1={x} y1="228" x2={x} y2="246"
              stroke="#C62828" strokeWidth="1" opacity={0.2}
              initial={{ scaleY: 0 }} whileInView={{ scaleY: 1 }}
              viewport={{ once: true, amount: 0.3 }} transition={{ delay: 1.0 + i * 0.05, duration: 0.3 }}
            />
          ))}
        </motion.g>

        {/* ── Onion rings ── */}
        <motion.g
          initial={{ opacity: 0, y: -15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, delay: 0.65, ease: [0.16, 1, 0.3, 1] }}
        >
          {[{ cx: 130, w: 50 }, { cx: 190, w: 40 }, { cx: 240, w: 45 }].map((ring, i) => (
            <motion.g key={i}>
              <ellipse cx={ring.cx} cy="268" rx={ring.w / 2} ry="6" fill="#E8D5F0" opacity={0.7} />
              <ellipse cx={ring.cx} cy="268" rx={ring.w / 2} ry="6" fill="none" stroke="#D1A8E0" strokeWidth="1.5" />
              <ellipse cx={ring.cx} cy="268" rx={ring.w / 2 - 3} ry="4" fill="none" stroke="white" strokeWidth="0.8" opacity={0.3} />
            </motion.g>
          ))}
        </motion.g>

        {/* ── Patty ── */}
        <motion.g
          initial={{ opacity: 0, y: -10, scaleX: 0 }}
          whileInView={{ opacity: 1, y: 0, scaleX: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          style={{ transformOrigin: '180px 310px' }}
          transition={{ duration: 0.7, delay: 0.75, ease: [0.16, 1, 0.3, 1] }}
        >
          <rect x="72" y="290" width="216" height="40" rx="20" fill="url(#pattyGrad)" />
          {/* Grill marks */}
          {[110, 150, 190, 230].map((x, i) => (
            <motion.line key={x} x1={x} y1="298" x2={x + 25} y2="298"
              stroke="#7B4A2A" strokeWidth="2.5" strokeLinecap="round"
              initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ delay: 1.3 + i * 0.08, duration: 0.3 }}
            />
          ))}
          {/* Sizzle particles */}
          {[90, 140, 200, 260].map((x, i) => (
            <motion.circle key={`sizzle-${x}`} cx={x} cy={288} r="1.5" fill="#FF9800" opacity={0.6}
              initial={{ y: 0, opacity: 0 }}
              whileInView={{ y: [-2, -10], opacity: [0.6, 0] }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ delay: 1.5 + i * 0.1, duration: 0.8, ease: 'easeOut' }}
            />
          ))}
        </motion.g>

        {/* ── Bottom Bun ── */}
        <motion.g
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, delay: 0.85, ease: [0.16, 1, 0.3, 1] }}
        >
          <path d="M80 365H280C280 395 240 415 180 415C120 415 80 395 80 365Z" fill="url(#bunGrad)" />
          {/* Bottom bun top surface */}
          <rect x="80" y="355" width="200" height="14" rx="3" fill="#C8851E" />
          {/* Bun texture line */}
          <motion.line x1="110" y1="362" x2="250" y2="362" stroke="#D99A30" strokeWidth="2" strokeLinecap="round" opacity={0.25}
            initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }}
            viewport={{ once: true, amount: 0.3 }} transition={{ delay: 1.2, duration: 0.4 }}
          />
        </motion.g>
      </g>

      {/* ── Floating flavor sparkles ── */}
      {[
        { x: 40, y: 80, delay: 1.5 },
        { x: 320, y: 120, delay: 1.7 },
        { x: 30, y: 250, delay: 1.9 },
        { x: 330, y: 300, delay: 2.0 },
        { x: 50, y: 380, delay: 2.1 },
      ].map((s, i) => (
        <motion.g key={i}
          initial={{ scale: 0, opacity: 0 }}
          whileInView={{ scale: [0, 1.5, 1], opacity: [0, 0.8, 0.4] }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ delay: s.delay, duration: 0.5 }}
        >
          <circle cx={s.x} cy={s.y} r="2" fill="#EB7A29" />
          <line x1={s.x - 5} y1={s.y} x2={s.x + 5} y2={s.y} stroke="#EB7A29" strokeWidth="1" opacity={0.6} />
          <line x1={s.x} y1={s.y - 5} x2={s.x} y2={s.y + 5} stroke="#EB7A29" strokeWidth="1" opacity={0.6} />
        </motion.g>
      ))}
    </svg>
  );
}

/* ── Animated exploded salad illustration (healthy mode) ── */
function ExplodedSaladSVG() {
  return (
    <svg width="360" height="480" viewBox="0 0 360 480" fill="none" className="w-full h-full">
      <defs>
        <filter id="saladShadow">
          <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="rgba(0,0,0,0.12)" />
        </filter>
        <linearGradient id="bowlGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#F5EDE0" />
          <stop offset="100%" stopColor="#E8D5C0" />
        </linearGradient>
      </defs>

      <g filter="url(#saladShadow)">
        {/* Bowl rim */}
        <motion.ellipse cx="180" cy="280" rx="140" ry="20" fill="#E8D5C0"
          initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }}
          viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.6 }}
        />
        {/* Bowl body */}
        <motion.path d="M40 280C40 360 100 420 180 420C260 420 320 360 320 280" fill="url(#bowlGrad)"
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }} transition={{ delay: 0.2, duration: 0.6 }}
        />

        {/* Leafy greens - multiple layers floating */}
        {[
          { d: 'M100 240C100 200 140 170 180 170C220 170 260 200 260 240', fill: '#66BB6A', delay: 0.4 },
          { d: 'M120 250C120 220 150 195 180 195C210 195 240 220 240 250', fill: '#43A047', delay: 0.5 },
          { d: 'M80 260C80 230 130 200 180 200C230 200 280 230 280 260', fill: '#81C784', delay: 0.6 },
        ].map((leaf, i) => (
          <motion.path key={i} d={leaf.d} fill={leaf.fill} opacity={0.7}
            initial={{ opacity: 0, y: -30 - i * 10 }}
            whileInView={{ opacity: 0.7, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ delay: leaf.delay, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          />
        ))}

        {/* Avocado slices */}
        <motion.g initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }} transition={{ delay: 0.7, duration: 0.5 }}>
          <ellipse cx="130" cy="230" rx="25" ry="16" fill="#8BC34A" />
          <ellipse cx="130" cy="230" rx="12" ry="8" fill="#689F38" />
          <circle cx="130" cy="230" r="4" fill="#5D4037" />
        </motion.g>

        {/* Cherry tomatoes */}
        {[{ cx: 220, cy: 215 }, { cx: 200, cy: 240 }, { cx: 250, cy: 245 }].map((t, i) => (
          <motion.g key={i} initial={{ scale: 0 }} whileInView={{ scale: 1 }}
            viewport={{ once: true, amount: 0.3 }} transition={{ delay: 0.8 + i * 0.1, type: 'spring', stiffness: 300 }}>
            <circle cx={t.cx} cy={t.cy} r="10" fill="#EF5350" />
            <circle cx={t.cx - 2} cy={t.cy - 3} r="3" fill="white" opacity={0.3} />
            <path d={`M${t.cx} ${t.cy - 10}L${t.cx - 3} ${t.cy - 14}L${t.cx + 3} ${t.cy - 14}Z`} fill="#43A047" />
          </motion.g>
        ))}

        {/* Cucumber slices */}
        {[{ cx: 150, cy: 255 }, { cx: 210, cy: 260 }].map((c, i) => (
          <motion.g key={i} initial={{ scale: 0, rotate: -30 }} whileInView={{ scale: 1, rotate: 0 }}
            viewport={{ once: true, amount: 0.3 }} transition={{ delay: 1.0 + i * 0.1, type: 'spring' }}>
            <circle cx={c.cx} cy={c.cy} r="12" fill="#A5D6A7" />
            <circle cx={c.cx} cy={c.cy} r="9" fill="#C8E6C9" />
            <circle cx={c.cx} cy={c.cy} r="3" fill="#E8F5E9" opacity={0.5} />
          </motion.g>
        ))}

        {/* Radish slices */}
        <motion.g initial={{ opacity: 0, rotate: 20 }} whileInView={{ opacity: 1, rotate: 0 }}
          viewport={{ once: true, amount: 0.3 }} transition={{ delay: 1.1, duration: 0.4 }}>
          <circle cx="170" cy="220" r="8" fill="#F8BBD0" />
          <circle cx="170" cy="220" r="5" fill="white" opacity={0.4} />
        </motion.g>

        {/* Seeds scatter */}
        {[110, 140, 190, 230, 260].map((x, i) => (
          <motion.ellipse key={x} cx={x} cy={265 + (i % 2) * 5} rx="2" ry="1" fill="#FFE082"
            initial={{ scale: 0 }} whileInView={{ scale: 1 }}
            viewport={{ once: true, amount: 0.3 }} transition={{ delay: 1.2 + i * 0.05, type: 'spring' }}
          />
        ))}
      </g>

      {/* Floating nutritional sparkles */}
      {[
        { x: 50, y: 150, delay: 1.5 },
        { x: 310, y: 180, delay: 1.7 },
        { x: 40, y: 320, delay: 1.9 },
        { x: 320, y: 350, delay: 2.0 },
      ].map((s, i) => (
        <motion.g key={i}
          initial={{ scale: 0, opacity: 0 }}
          whileInView={{ scale: [0, 1.5, 1], opacity: [0, 0.7, 0.4] }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ delay: s.delay, duration: 0.5 }}
        >
          <circle cx={s.x} cy={s.y} r="2" fill="#4AA056" />
          <line x1={s.x - 4} y1={s.y} x2={s.x + 4} y2={s.y} stroke="#4AA056" strokeWidth="1" opacity={0.5} />
          <line x1={s.x} y1={s.y - 4} x2={s.x} y2={s.y + 4} stroke="#4AA056" strokeWidth="1" opacity={0.5} />
        </motion.g>
      ))}
    </svg>
  );
}

const layers = [
  {
    classicTitle: 'The Golden Crown',
    classicFact: 'Toasted fresh every morning. Buttery brioche that shatters, then melts. Your first bite starts here.',
    healthyTitle: 'Stone-Ground Wheat Bun',
    healthyFact: 'Zero artificial junk. Packed with fiber. A bun that nourishes as good as it tastes.',
    classicIcon: <BreadIcon size={28} color="#D46E1F" />,
    healthyIcon: <WheatIcon size={28} color="#4AA056" />,
    classicAccent: '#D46E1F',
    healthyAccent: '#4AA056',
  },
  {
    classicTitle: 'The 180g Smash',
    classicFact: 'Hand-pressed on a ripping-hot flat-top. Lacy, caramelized edges. Juicy, beefy center. This is the one.',
    healthyTitle: 'Pasture-Raised Patty',
    healthyFact: '22g protein per patty. Hormone-free, ethically raised. The cleanest beef you\'ll ever sink your teeth into.',
    classicIcon: <MeatIcon size={28} />,
    healthyIcon: <LeafIcon size={28} color="#2E7D32" />,
    classicAccent: '#5D4037',
    healthyAccent: '#2E7D32',
  },
  {
    classicTitle: 'The Flavor Explosion',
    classicFact: '12 handpicked ingredients. Melty cheese, crisp lettuce, tangy pickles — every layer fights for your attention.',
    healthyTitle: 'Farm-Fresh Garden Stack',
    healthyFact: 'Picked locally, plated within 24 hours. Vegetables so fresh, they still remember the soil.',
    classicIcon: <CheeseIcon size={28} />,
    healthyIcon: <SaladIcon size={28} color="#8BC34A" />,
    classicAccent: '#FFC107',
    healthyAccent: '#8BC34A',
  },
];

export default function ExplodedBurger() {
  const { isClassic } = useMode();
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  const titleY = useTransform(scrollYProgress, [0, 0.5], [60, 0]);
  const titleOpacity = useTransform(scrollYProgress, [0, 0.3], [0, 1]);
  const illustrationRotate = useTransform(scrollYProgress, [0, 1], [-3, 3]);

  return (
    <section
      ref={sectionRef}
      className="py-16 md:py-20 px-5 relative overflow-hidden has-pattern"
      style={{ backgroundColor: isClassic ? '#FDF3E7' : '#E8F5EC' }}
    >
      {/* Decorative animated background curves */}
      <motion.svg
        className="absolute top-0 left-0 w-full h-full pointer-events-none"
        viewBox="0 0 1200 800"
        fill="none"
        style={{ opacity: 0.04 }}
      >
        <motion.path
          d="M0 400C200 300 400 500 600 400C800 300 1000 500 1200 400"
          stroke={isClassic ? '#EB7A29' : '#4AA056'}
          strokeWidth="3"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 2, ease: 'easeOut' }}
        />
        <motion.path
          d="M0 200C300 100 600 300 900 200C1050 150 1150 250 1200 200"
          stroke={isClassic ? '#EB7A29' : '#4AA056'}
          strokeWidth="2"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 2.5, delay: 0.3, ease: 'easeOut' }}
        />
        <motion.circle
          cx="100" cy="600" r="150"
          stroke={isClassic ? '#EB7A29' : '#4AA056'}
          strokeWidth="1.5"
          fill="none"
          initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }}
          viewport={{ once: true, amount: 0.3 }} transition={{ duration: 2, delay: 0.5 }}
        />
        <motion.circle
          cx="1100" cy="150" r="100"
          stroke={isClassic ? '#EB7A29' : '#4AA056'}
          strokeWidth="1.5"
          fill="none"
          initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }}
          viewport={{ once: true, amount: 0.3 }} transition={{ duration: 2, delay: 0.7 }}
        />
      </motion.svg>

      <div className="max-w-[1200px] mx-auto relative z-10">
        <motion.div className="text-center mb-10 md:mb-14" style={{ y: titleY, opacity: titleOpacity }}>
          <motion.span
            className="inline-block text-[0.6875rem] font-bold uppercase tracking-[0.25em] mb-4 px-4 py-1.5 rounded-full"
            style={{
              backgroundColor: isClassic ? 'rgba(235,122,41,0.1)' : 'rgba(74,160,86,0.1)',
              color: isClassic ? '#D46E1F' : '#4AA056',
            }}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5 }}
          >
            {isClassic ? 'What Makes Them Obsess-Worthy' : 'Ingredients You Can Trust'}
          </motion.span>
          <h2 className="text-3xl md:text-[2.5rem] font-black text-gray-900 mb-3" style={{ fontFamily: "var(--font-poppins)" }}>
            {isClassic ? 'Built Layer by Glorious Layer' : 'Clean Eating, Stacked Your Way'}
          </h2>
          <p className="text-base text-gray-600 max-w-lg mx-auto">
            {isClassic ? 'We don\'t just stack ingredients — we engineer cravings.' : 'Know exactly what you\'re eating. Love every single bite.'}
          </p>
        </motion.div>

        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          {/* Center animated illustration */}
          <motion.div
            className="w-[280px] h-[380px] md:w-[340px] md:h-[460px] flex-shrink-0 order-1 lg:order-2"
            style={{ rotate: illustrationRotate }}
          >
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            >
              {isClassic ? <ExplodedBurgerSVG /> : <ExplodedSaladSVG />}
            </motion.div>
          </motion.div>

          {/* Layer cards - left side */}
          <div className="flex-1 space-y-6 order-2 lg:order-1">
            {layers.slice(0, 2).map((layer, i) => (
              <motion.div
                key={layer.classicTitle}
                className="relative rounded-2xl overflow-hidden"
                style={{
                  background: 'white',
                  boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
                }}
                initial={{ opacity: 0, x: -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6, delay: i * 0.15, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ y: -4 }}
              >
                {/* Accent bar */}
                <div
                  className="absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl"
                  style={{ backgroundColor: isClassic ? layer.classicAccent : layer.healthyAccent }}
                />
                <div className="p-6 pl-7 flex items-start gap-5">
                  <div
                    className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: isClassic ? `${layer.classicAccent}14` : `${layer.healthyAccent}14` }}
                  >
                    {isClassic ? layer.classicIcon : layer.healthyIcon}
                  </div>
                  <div>
                    <div
                      className="text-[0.625rem] font-bold uppercase tracking-wider mb-1 transition-colors duration-500"
                      style={{ color: isClassic ? layer.classicAccent : layer.healthyAccent }}
                    >
                      Layer {i + 1}
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-1" style={{ fontFamily: "var(--font-poppins)" }}>
                      {isClassic ? layer.classicTitle : layer.healthyTitle}
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {isClassic ? layer.classicFact : layer.healthyFact}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Layer card - right side */}
          <div className="flex-1 order-3">
            {layers.slice(2).map((layer) => (
              <motion.div
                key={layer.classicTitle}
                className="relative rounded-2xl overflow-hidden"
                style={{
                  background: 'white',
                  boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
                }}
                initial={{ opacity: 0, x: 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ y: -4 }}
              >
                <div
                  className="absolute right-0 top-0 bottom-0 w-1 rounded-r-2xl"
                  style={{ backgroundColor: isClassic ? layer.classicAccent : layer.healthyAccent }}
                />
                <div className="p-6 pr-7 flex items-start gap-5">
                  <div
                    className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: isClassic ? `${layer.classicAccent}14` : `${layer.healthyAccent}14` }}
                  >
                    {isClassic ? layer.classicIcon : layer.healthyIcon}
                  </div>
                  <div>
                    <div
                      className="text-[0.625rem] font-bold uppercase tracking-wider mb-1 transition-colors duration-500"
                      style={{ color: isClassic ? layer.classicAccent : layer.healthyAccent }}
                    >
                      Layer 3
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-1" style={{ fontFamily: "var(--font-poppins)" }}>
                      {isClassic ? layer.classicTitle : layer.healthyTitle}
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {isClassic ? layer.classicFact : layer.healthyFact}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}

            {/* Fun fact callout */}
            <motion.div
              className="mt-6 p-5 rounded-xl border border-dashed"
              style={{
                borderColor: isClassic ? 'rgba(235,122,41,0.3)' : 'rgba(74,160,86,0.3)',
                backgroundColor: 'rgba(255,255,255,0.85)',
              }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              <div className="flex items-center gap-3">
                {isClassic
                  ? <FireIcon size={24} color="#EB7A29" />
                  : <LeafIcon size={24} color="#4AA056" />}
                <div>
                  <div className="text-xs font-bold text-gray-900">
                    {isClassic ? 'Did You Know?' : 'Body Bonus'}
                  </div>
                  <div className="text-xs text-gray-600 mt-0.5">
                    {isClassic
                      ? '3 seconds. That\'s how fast we smash each patty — creating a crust so crispy, it crackles when you bite.'
                      : 'One wholesome stack = 40% of your daily fiber. Your gut will thank you.'}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
