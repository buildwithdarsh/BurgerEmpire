'use client';

import { useRef, useState, useEffect } from 'react';
import { useMode } from '@/hooks/useMode';
import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import { loaderDidRun } from '@/components/BurgerLoader';

function AnimatedBurgerSVG() {
  return (
    <svg width="400" height="400" viewBox="0 0 400 400" fill="none" className="w-full h-full max-w-[400px]">
      <defs>
        <filter id="burgerGlow">
          <feDropShadow dx="0" dy="4" stdDeviation="8" floodColor="rgba(0,0,0,0.25)" />
        </filter>
      </defs>
      <g filter="url(#burgerGlow)">
        {/* Top bun — warm golden brown with white outline */}
        <motion.path
          d="M75 210C75 135 128 75 200 75C272 75 325 135 325 210H75Z"
          fill="#C8851E" stroke="white" strokeWidth="3"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
        {/* Bun highlight */}
        <motion.path
          d="M110 170C120 120 160 95 200 90C240 95 280 120 290 170"
          fill="none" stroke="#D99A30" strokeWidth="20" strokeLinecap="round" opacity={0.4}
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
          transition={{ delay: 0.5, duration: 0.6, ease: 'easeOut' }}
        />
        {/* Sesame seeds */}
        <motion.ellipse cx="148" cy="145" rx="6" ry="10" fill="#F5E6C8"
          initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.9, duration: 0.3, type: 'spring' }} />
        <motion.ellipse cx="200" cy="125" rx="6" ry="10" fill="#F5E6C8"
          initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 1, duration: 0.3, type: 'spring' }} />
        <motion.ellipse cx="252" cy="148" rx="6" ry="10" fill="#F5E6C8"
          initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 1.1, duration: 0.3, type: 'spring' }} />
        <motion.ellipse cx="175" cy="170" rx="5" ry="9" fill="#F5E6C8"
          initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 1.15, duration: 0.3, type: 'spring' }} />
        <motion.ellipse cx="225" cy="165" rx="5" ry="9" fill="#F5E6C8"
          initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 1.2, duration: 0.3, type: 'spring' }} />
        {/* Cheese — dripping yellow */}
        <motion.path
          d="M68 222L72 248L95 252L100 260L130 248L170 252L200 244L230 252L270 248L300 256L310 248L328 248L332 222"
          fill="#FFC107" stroke="#FFB300" strokeWidth="1"
          initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
        />
        {/* Lettuce — bright green wavy, rendered after cheese so it shows on top */}
        <motion.path
          d="M58 218C58 218 90 244 134 228C178 212 196 244 238 228C280 212 308 244 342 218"
          stroke="#43A047" strokeWidth="14" strokeLinecap="round" fill="none"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
          transition={{ delay: 0.6, duration: 0.8, ease: 'easeOut' }}
        />
        {/* Tomato slices */}
        <motion.rect x="78" y="255" width="244" height="20" rx="10" fill="#E53935" stroke="#C62828" strokeWidth="1"
          initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
          transition={{ delay: 0.7, duration: 0.5, ease: 'easeOut' }}
        />
        <motion.line x1="130" y1="258" x2="130" y2="272" stroke="#EF5350" strokeWidth="1" opacity={0.5}
          initial={{ scaleY: 0 }} animate={{ scaleY: 1 }} transition={{ delay: 1.1, duration: 0.3 }} />
        <motion.line x1="200" y1="258" x2="200" y2="272" stroke="#EF5350" strokeWidth="1" opacity={0.5}
          initial={{ scaleY: 0 }} animate={{ scaleY: 1 }} transition={{ delay: 1.15, duration: 0.3 }} />
        <motion.line x1="270" y1="258" x2="270" y2="272" stroke="#EF5350" strokeWidth="1" opacity={0.5}
          initial={{ scaleY: 0 }} animate={{ scaleY: 1 }} transition={{ delay: 1.2, duration: 0.3 }} />
        {/* Patty — dark brown, thick */}
        <motion.rect x="68" y="280" width="264" height="40" rx="20" fill="#3E2723" stroke="#2C1A11" strokeWidth="1.5"
          initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
          transition={{ delay: 0.4, duration: 0.6, ease: 'easeOut' }}
        />
        {/* Patty grill marks */}
        <motion.line x1="105" y1="295" x2="140" y2="295" stroke="#5D4037" strokeWidth="2.5" strokeLinecap="round"
          initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 1.2, duration: 0.3 }} />
        <motion.line x1="170" y1="302" x2="210" y2="302" stroke="#5D4037" strokeWidth="2.5" strokeLinecap="round"
          initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 1.3, duration: 0.3 }} />
        <motion.line x1="240" y1="293" x2="280" y2="293" stroke="#5D4037" strokeWidth="2.5" strokeLinecap="round"
          initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 1.4, duration: 0.3 }} />
        {/* Bottom bun — matching golden brown */}
        <motion.path
          d="M75 325H325C325 358 278 382 200 382C122 382 75 358 75 325Z"
          fill="#C8851E" stroke="white" strokeWidth="3"
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6, ease: 'easeOut' }}
        />
        {/* Bottom bun highlight */}
        <motion.path
          d="M100 330H300" stroke="#D99A30" strokeWidth="3" strokeLinecap="round" opacity={0.3}
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
          transition={{ delay: 0.8, duration: 0.4 }}
        />
      </g>
    </svg>
  );
}

function AnimatedSaladSVG() {
  return (
    <svg width="400" height="400" viewBox="0 0 400 400" fill="none" className="w-full h-full max-w-[400px]">
      {/* Bowl */}
      <motion.path
        d="M60 230C60 310 120 360 200 360C280 360 340 310 340 230H60Z"
        fill="white" opacity={0.12}
        initial={{ opacity: 0 }} animate={{ opacity: 0.12 }}
        transition={{ duration: 1, ease: 'easeOut' }}
      />
      <motion.path d="M50 230H350" stroke="white" strokeWidth="8" strokeLinecap="round"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      />
      {/* Stems */}
      {[
        { d: "M200 230C180 190 140 170 120 150", delay: 0.5 },
        { d: "M200 230C220 190 260 170 280 150", delay: 0.7 },
        { d: "M200 230C190 180 160 140 150 110", delay: 0.9 },
        { d: "M200 230C210 180 240 140 250 110", delay: 1.1 },
        { d: "M200 230C200 170 200 130 200 90", delay: 0.6 },
      ].map((leaf, i) => (
        <motion.path
          key={i} d={leaf.d}
          stroke="white" strokeWidth="5" strokeLinecap="round" fill="none" opacity={0.7}
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
          transition={{ delay: leaf.delay, duration: 0.8, ease: 'easeOut' }}
        />
      ))}
      {/* Leaf shapes */}
      {[
        { cx: 120, cy: 150, delay: 1 },
        { cx: 280, cy: 150, delay: 1.2 },
        { cx: 150, cy: 110, delay: 1.4 },
        { cx: 250, cy: 110, delay: 1.6 },
        { cx: 200, cy: 90, delay: 1.1 },
      ].map((l, i) => (
        <motion.ellipse
          key={i} cx={l.cx} cy={l.cy} rx="28" ry="16" fill="white"
          initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 0.5 }}
          transition={{ delay: l.delay, duration: 0.4, type: 'spring', stiffness: 200 }}
        />
      ))}
      {/* Small accent leaves */}
      {[
        { cx: 100, cy: 180, rx: 15, ry: 10, delay: 1.3 },
        { cx: 300, cy: 180, rx: 15, ry: 10, delay: 1.5 },
      ].map((l, i) => (
        <motion.ellipse
          key={`sm-${i}`} cx={l.cx} cy={l.cy} rx={l.rx} ry={l.ry} fill="#8BC34A"
          initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 0.6 }}
          transition={{ delay: l.delay, duration: 0.4, type: 'spring', stiffness: 200 }}
        />
      ))}
      {/* Cherry tomato */}
      <motion.circle cx="200" cy="185" r="20" fill="#FF5722"
        initial={{ scale: 0 }} animate={{ scale: 1 }}
        transition={{ delay: 1.5, duration: 0.3, type: 'spring', stiffness: 300 }}
      />
      <motion.circle cx="197" cy="179" r="5" fill="white" opacity={0.4}
        initial={{ scale: 0 }} animate={{ scale: 1 }}
        transition={{ delay: 1.7, duration: 0.2 }}
      />
      {/* Cucumber slices */}
      <motion.circle cx="160" cy="210" r="12" fill="white" opacity={0.25}
        initial={{ scale: 0 }} animate={{ scale: 1 }}
        transition={{ delay: 1.6, duration: 0.3, type: 'spring' }}
      />
      <motion.circle cx="240" cy="205" r="10" fill="white" opacity={0.2}
        initial={{ scale: 0 }} animate={{ scale: 1 }}
        transition={{ delay: 1.8, duration: 0.3, type: 'spring' }}
      />
    </svg>
  );
}

export default function HeroSection() {
  const { isClassic } = useMode();
  const heroRef = useRef<HTMLDivElement>(null);

  // Mount the SVG only after the loader finishes (4 s) so animations play fresh.
  // On client-side navigation the loader never ran, so show immediately.
  const [svgReady, setSvgReady] = useState(false);
  useEffect(() => {
    if (!loaderDidRun) { setSvgReady(true); return; }
    const t = setTimeout(() => setSvgReady(true), 4000);
    return () => clearTimeout(t);
  }, []);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });

  const textY = useTransform(scrollYProgress, [0, 1], [0, -80]);
  const imageY = useTransform(scrollYProgress, [0, 1], [0, 60]);
  const imageScale = useTransform(scrollYProgress, [0, 1], [1, 0.85]);
  const bgY = useTransform(scrollYProgress, [0, 1], [0, 150]);

  return (
    <section ref={heroRef} className="relative min-h-screen overflow-hidden flex items-center -mt-[84px] pt-[84px]">
      <motion.div className="absolute inset-0 z-0" style={{ y: bgY }}>
        <div
          className="absolute inset-0 transition-all duration-700"
          style={{
            background: isClassic
              ? 'radial-gradient(ellipse at 30% 50%, #EB7A29 0%, #D46E1F 40%, #C06820 100%)'
              : 'radial-gradient(ellipse at 30% 50%, #4AA056 0%, #3D8A48 40%, #3D8A48 100%)',
          }}
        />
        <div
          className="absolute -right-32 -top-32 w-[600px] h-[600px] rounded-full transition-colors duration-700"
          style={{ backgroundColor: isClassic ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.03)' }}
        />
        <div
          className="absolute -left-20 -bottom-20 w-[400px] h-[400px] rounded-full transition-colors duration-700"
          style={{ backgroundColor: isClassic ? 'rgba(0,0,0,0.05)' : 'rgba(0,0,0,0.03)' }}
        />
      </motion.div>

      <div className="relative z-10 max-w-[1200px] mx-auto px-5 w-full py-16">
        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-16">
          <motion.div className="flex-1 text-center lg:text-left" style={{ y: textY }}>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              <span
                className="inline-block text-[0.6875rem] font-bold uppercase tracking-[0.25em] mb-5 px-4 py-1.5 rounded-full"
                style={{ backgroundColor: 'rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.9)' }}
              >
                {isClassic ? 'Craving Something Legendary?' : 'Fuel Your Body, Feed Your Soul'}
              </span>
            </motion.div>

            <motion.h1
              className="text-5xl md:text-6xl lg:text-[4.25rem] font-bold leading-[1.08] mb-6"
              style={{
                color: '#FFFFFF',
                fontFamily: "var(--font-hero)",
                letterSpacing: isClassic ? '-1.5px' : '-0.5px',
              }}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            >
              {isClassic ? (
                <>Bite Into<br />Pure, Juicy<br />Obsession.</>
              ) : (
                <>Guilt-Free.<br />Crave-Worthy.<br />All Yours.</>
              )}
            </motion.h1>

            <motion.p
              className="text-lg md:text-xl mb-10 max-w-[520px] leading-relaxed text-white/75 mx-auto lg:mx-0"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            >
              {isClassic
                ? 'Crispy-edged, juice-dripping patties smashed on a screaming-hot flat-top. One bite and you\'ll never settle for ordinary again.'
                : 'Grass-fed beef, stone-ground buns, zero junk. Every bite proves healthy food can make your taste buds dance.'}
            </motion.p>

            <motion.div
              className="hero-cta-row flex items-center gap-4 justify-center lg:justify-start"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
            >
              <Link
                href="/order-online"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl text-[0.875rem] font-bold uppercase tracking-wide transition-all duration-300 active:scale-[0.97] hover:-translate-y-0.5"
                style={{ backgroundColor: '#FFFFFF', color: isClassic ? '#9A1E29' : '#3D8A48' }}
              >
                Order Now
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </Link>
              <Link
                href="/menu"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl text-[0.875rem] font-bold uppercase tracking-wide border-2 border-white/30 text-white transition-all duration-300 hover:bg-white/10 hover:-translate-y-0.5"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
                </svg>
                Menu
              </Link>
            </motion.div>

            <motion.div
              className="flex items-center gap-8 mt-12 justify-center lg:justify-start"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.6 }}
            >
              {(isClassic
                ? [
                    { value: '50K+', label: 'Fans & Counting' },
                    { value: '15+', label: 'Spots Nationwide' },
                    { value: '8 min', label: 'From Grill to You' },
                  ]
                : [
                    { value: '0', label: 'Nasty Additives' },
                    { value: '100%', label: 'Pasture-Raised' },
                    { value: '2x', label: 'Reward Points' },
                  ]
              ).map((stat) => (
                <div key={stat.label} className="text-center lg:text-left">
                  <div className="text-2xl font-black text-white">{stat.value}</div>
                  <div className="text-[0.6875rem] text-white/50 font-medium uppercase tracking-wider">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>

          <motion.div
            className="flex-shrink-0 w-[320px] h-[320px] md:w-[440px] md:h-[440px] relative"
            style={{ y: imageY, scale: imageScale }}
          >
            <motion.div
              className="absolute inset-0 rounded-full"
              style={{ backgroundColor: 'rgba(255,255,255,0.06)' }}
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            />
            <motion.div
              className="absolute inset-4 rounded-full"
              style={{ backgroundColor: 'rgba(255,255,255,0.04)' }}
              animate={{ scale: [1, 1.03, 1] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
            />
            <div className="relative z-10 w-full h-full flex items-center justify-center">
              {svgReady && (isClassic ? <AnimatedBurgerSVG /> : <AnimatedSaladSVG />)}
            </div>
          </motion.div>
        </div>
      </div>

      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      >
        <span className="text-[0.625rem] uppercase tracking-widest text-white/40 font-semibold">Scroll</span>
        <svg width="20" height="24" viewBox="0 0 20 24" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2">
          <path d="M10 4L10 20M10 20L4 14M10 20L16 14" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </motion.div>
    </section>
  );
}
