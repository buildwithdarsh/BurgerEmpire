'use client';

import { useEffect, useState } from 'react';
import { useMode } from '@/hooks/useMode';
import { motion } from 'framer-motion';

/* ─── Countdown target: March 25 2026, midnight IST ─── */
const LAUNCH_DATE = new Date('2026-03-25T00:00:00+05:30').getTime();

function useCountdown() {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  const diff = Math.max(0, LAUNCH_DATE - now);
  return {
    days: Math.floor(diff / 86_400_000),
    hours: Math.floor((diff / 3_600_000) % 24),
    minutes: Math.floor((diff / 60_000) % 60),
    seconds: Math.floor((diff / 1_000) % 60),
  };
}

/* ─── Animated burger SVG (classic mode) ─── */
function FloatingBurger() {
  return (
    <motion.svg
      width="360" height="360" viewBox="0 0 400 400" fill="none"
      className="w-[260px] h-[260px] md:w-[360px] md:h-[360px]"
      animate={{ y: [0, -14, 0] }}
      transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
    >
      <defs>
        <filter id="csGlow">
          <feDropShadow dx="0" dy="6" stdDeviation="12" floodColor="rgba(0,0,0,0.18)" />
        </filter>
      </defs>
      <g filter="url(#csGlow)">
        {/* Top bun */}
        <motion.path
          d="M80 210C80 140 130 85 200 85C270 85 320 140 320 210H80Z"
          fill="#C8851E" stroke="white" strokeWidth="3"
          initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        />
        {/* Bun highlight */}
        <motion.path
          d="M115 170C125 125 162 100 200 96C238 100 275 125 285 170"
          fill="none" stroke="#D99A30" strokeWidth="18" strokeLinecap="round" opacity={0.35}
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        />
        {/* Sesame seeds */}
        {[
          { cx: 150, cy: 148, d: 0.9 },
          { cx: 200, cy: 128, d: 1.0 },
          { cx: 250, cy: 150, d: 1.1 },
          { cx: 178, cy: 172, d: 1.15 },
          { cx: 224, cy: 167, d: 1.2 },
        ].map((s, i) => (
          <motion.ellipse
            key={i} cx={s.cx} cy={s.cy} rx="5" ry="9" fill="#F5E6C8"
            initial={{ scale: 0 }} animate={{ scale: 1 }}
            transition={{ delay: s.d, duration: 0.3, type: 'spring' }}
          />
        ))}
        {/* Lettuce */}
        <motion.path
          d="M62 218C62 218 94 242 138 228C182 214 198 242 240 228C282 214 310 242 346 218"
          stroke="#43A047" strokeWidth="13" strokeLinecap="round" fill="none"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
        />
        {/* Cheese drip */}
        <motion.path
          d="M70 222L74 246L98 250L104 258L134 248L172 252L200 244L228 252L268 248L298 254L308 248L326 248L330 222"
          fill="#FFC107" stroke="#FFB300" strokeWidth="1"
          initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
        />
        {/* Tomato */}
        <motion.rect
          x="82" y="255" width="236" height="18" rx="9" fill="#E53935" stroke="#C62828" strokeWidth="1"
          initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
          transition={{ delay: 0.7, duration: 0.5 }}
        />
        {/* Patty */}
        <motion.rect
          x="72" y="280" width="256" height="38" rx="19" fill="#3E2723" stroke="#2C1A11" strokeWidth="1.5"
          initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        />
        {/* Grill marks */}
        {[
          { x1: 108, x2: 142, y: 296, d: 1.2 },
          { x1: 172, x2: 212, y: 302, d: 1.3 },
          { x1: 242, x2: 280, y: 294, d: 1.4 },
        ].map((g, i) => (
          <motion.line
            key={i} x1={g.x1} y1={g.y} x2={g.x2} y2={g.y}
            stroke="#5D4037" strokeWidth="2.5" strokeLinecap="round"
            initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
            transition={{ delay: g.d, duration: 0.3 }}
          />
        ))}
        {/* Bottom bun */}
        <motion.path
          d="M80 325H320C320 356 274 378 200 378C126 378 80 356 80 325Z"
          fill="#C8851E" stroke="white" strokeWidth="3"
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        />
        <motion.path
          d="M104 330H296" stroke="#D99A30" strokeWidth="3" strokeLinecap="round" opacity={0.3}
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
          transition={{ delay: 0.8, duration: 0.4 }}
        />
      </g>
      {/* Steam lines */}
      {[160, 200, 240].map((x, i) => (
        <motion.path
          key={i}
          d={`M${x} 78 Q${x + (i % 2 === 0 ? 8 : -8)} 58 ${x} 38`}
          stroke="white" strokeWidth="2.5" strokeLinecap="round" fill="none"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.5, 0], y: [0, -10, -20] }}
          transition={{ duration: 2, repeat: Infinity, delay: i * 0.5, ease: 'easeOut' }}
        />
      ))}
    </motion.svg>
  );
}

/* ─── Animated salad SVG (healthy mode) ─── */
function FloatingSalad() {
  return (
    <motion.svg
      width="360" height="360" viewBox="0 0 400 400" fill="none"
      className="w-[260px] h-[260px] md:w-[360px] md:h-[360px]"
      animate={{ y: [0, -14, 0] }}
      transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
    >
      {/* Bowl */}
      <motion.path
        d="M65 230C65 306 122 355 200 355C278 355 335 306 335 230H65Z"
        fill="white" opacity={0.1}
        initial={{ opacity: 0 }} animate={{ opacity: 0.1 }}
        transition={{ duration: 1 }}
      />
      <motion.path d="M55 230H345" stroke="white" strokeWidth="7" strokeLinecap="round"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ duration: 0.8 }}
      />
      {/* Stems */}
      {[
        { d: 'M200 230C182 192 148 172 128 154', delay: 0.5 },
        { d: 'M200 230C218 192 252 172 272 154', delay: 0.7 },
        { d: 'M200 230C192 182 164 142 154 114', delay: 0.9 },
        { d: 'M200 230C208 182 236 142 246 114', delay: 1.1 },
        { d: 'M200 230C200 172 200 132 200 94', delay: 0.6 },
      ].map((s, i) => (
        <motion.path
          key={i} d={s.d}
          stroke="white" strokeWidth="4.5" strokeLinecap="round" fill="none" opacity={0.6}
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
          transition={{ delay: s.delay, duration: 0.8 }}
        />
      ))}
      {/* Leaves */}
      {[
        { cx: 128, cy: 154, d: 1.0 },
        { cx: 272, cy: 154, d: 1.2 },
        { cx: 154, cy: 114, d: 1.4 },
        { cx: 246, cy: 114, d: 1.6 },
        { cx: 200, cy: 94, d: 1.1 },
      ].map((l, i) => (
        <motion.ellipse
          key={i} cx={l.cx} cy={l.cy} rx="26" ry="15" fill="white"
          initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 0.45 }}
          transition={{ delay: l.d, duration: 0.4, type: 'spring', stiffness: 200 }}
        />
      ))}
      {/* Accent leaves */}
      <motion.ellipse cx="104" cy="182" rx="14" ry="9" fill="#8BC34A"
        initial={{ scale: 0 }} animate={{ scale: 1, opacity: 0.55 }}
        transition={{ delay: 1.3, type: 'spring' }}
      />
      <motion.ellipse cx="296" cy="182" rx="14" ry="9" fill="#8BC34A"
        initial={{ scale: 0 }} animate={{ scale: 1, opacity: 0.55 }}
        transition={{ delay: 1.5, type: 'spring' }}
      />
      {/* Cherry tomato */}
      <motion.circle cx="200" cy="188" r="18" fill="#FF5722"
        initial={{ scale: 0 }} animate={{ scale: 1 }}
        transition={{ delay: 1.5, type: 'spring', stiffness: 300 }}
      />
      <motion.circle cx="196" cy="182" r="5" fill="white" opacity={0.4}
        initial={{ scale: 0 }} animate={{ scale: 1 }}
        transition={{ delay: 1.7, duration: 0.2 }}
      />
      {/* Cucumber */}
      <motion.circle cx="164" cy="212" r="11" fill="white" opacity={0.22}
        initial={{ scale: 0 }} animate={{ scale: 1 }}
        transition={{ delay: 1.6, type: 'spring' }}
      />
      <motion.circle cx="236" cy="208" r="9" fill="white" opacity={0.18}
        initial={{ scale: 0 }} animate={{ scale: 1 }}
        transition={{ delay: 1.8, type: 'spring' }}
      />
    </motion.svg>
  );
}

/* ─── Countdown digit box ─── */
function CountdownUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <div
        className="relative w-[64px] h-[72px] md:w-[80px] md:h-[88px] rounded-2xl flex items-center justify-center overflow-hidden"
        style={{ backgroundColor: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(8px)' }}
      >
        {/* Divider line */}
        <div className="absolute left-1 right-1 top-1/2 h-px bg-white/10" />
        <span className="text-3xl md:text-4xl font-black text-white tabular-nums" style={{ fontFamily: "var(--font-space-grotesk)" }}>
          {String(value).padStart(2, '0')}
        </span>
      </div>
      <span className="text-[0.625rem] md:text-[0.6875rem] uppercase tracking-[0.2em] text-white/40 font-semibold mt-2.5">
        {label}
      </span>
    </div>
  );
}

/* ─── Colon separator ─── */
function ColonSep() {
  return (
    <motion.div
      className="flex flex-col gap-1.5 pb-5"
      animate={{ opacity: [1, 0.3, 1] }}
      transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
    >
      <div className="w-1.5 h-1.5 rounded-full bg-white/40" />
      <div className="w-1.5 h-1.5 rounded-full bg-white/40" />
    </motion.div>
  );
}

/* ─── Pulse rings behind illustration ─── */
function PulseRing({ delay }: { delay: number }) {
  return (
    <motion.div
      className="absolute rounded-full border border-white/[0.06]"
      style={{ width: '120%', height: '120%', top: '-10%', left: '-10%' }}
      animate={{ scale: [0.85, 1.15, 0.85], opacity: [0, 0.2, 0] }}
      transition={{ duration: 4, repeat: Infinity, delay, ease: 'easeInOut' }}
    />
  );
}

/* ─── Main component ─── */
export default function ComingSoonLanding() {
  const { isClassic } = useMode();
  const countdown = useCountdown();

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0 transition-all duration-700"
        style={{
          background: isClassic
            ? 'radial-gradient(ellipse at 30% 40%, #EB7A29 0%, #D46E1F 40%, #C06820 100%)'
            : 'radial-gradient(ellipse at 30% 40%, #4AA056 0%, #3D8A48 40%, #3D8A48 100%)',
        }}
      />
      {/* Decorative circles */}
      <div className="absolute -right-40 -top-40 w-[600px] h-[600px] rounded-full" style={{ backgroundColor: 'rgba(255,255,255,0.04)' }} />
      <div className="absolute -left-24 bottom-0 w-[400px] h-[400px] rounded-full" style={{ backgroundColor: 'rgba(0,0,0,0.04)' }} />
      <div className="absolute right-[10%] bottom-[15%] w-[200px] h-[200px] rounded-full" style={{ backgroundColor: 'rgba(255,255,255,0.02)' }} />

      {/* Content */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-5 py-12">
        {/* Illustration with pulse rings */}
        <motion.div
          className="relative mb-8"
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, type: 'spring', stiffness: 100 }}
        >
          <PulseRing delay={0} />
          <PulseRing delay={1.3} />
          <PulseRing delay={2.6} />
          <div className="relative z-10">
            {isClassic ? <FloatingBurger /> : <FloatingSalad />}
          </div>
        </motion.div>

        {/* Badge */}
        <motion.span
          className="inline-block text-[0.6875rem] font-bold uppercase tracking-[0.25em] mb-4 px-4 py-1.5 rounded-full"
          style={{ backgroundColor: 'rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.85)' }}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          {isClassic ? 'Something Big Is Cooking' : 'Fresh Things Are Growing'}
        </motion.span>

        {/* Heading */}
        <motion.h1
          className="text-4xl md:text-6xl lg:text-7xl font-bold text-center leading-[1.05] mb-4 text-white max-w-[700px]"
          style={{
            fontFamily: "var(--font-hero)",
            letterSpacing: isClassic ? '-1.5px' : '-0.5px',
          }}
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          {isClassic ? 'We\'re Almost Ready.' : 'Good Things Take Time.'}
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          className="text-base md:text-lg text-white/60 text-center max-w-[460px] mb-10 leading-relaxed"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55, duration: 0.6 }}
        >
          {isClassic
            ? 'Our grills are heating up and the patties are stacked. Get ready for the juiciest smash burgers in town.'
            : 'We\'re perfecting every recipe, sourcing the freshest ingredients. A healthier way to eat is almost here.'}
        </motion.p>

        {/* Countdown */}
        <motion.div
          className="flex items-center gap-3 md:gap-4 mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.6 }}
        >
          <CountdownUnit value={countdown.days} label="Days" />
          <ColonSep />
          <CountdownUnit value={countdown.hours} label="Hours" />
          <ColonSep />
          <CountdownUnit value={countdown.minutes} label="Min" />
          <ColonSep />
          <CountdownUnit value={countdown.seconds} label="Sec" />
        </motion.div>

        {/* Links */}
        <motion.div
          className="flex flex-col items-center gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
        >
          <div className="flex items-center gap-3">
            {[
              { label: 'hello@build.withdarsh.com', href: 'mailto:hello@build.withdarsh.com' },
            ].map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-[0.75rem] font-semibold text-white/70 transition-all duration-200 hover:bg-white/15 hover:-translate-y-0.5 hover:text-white"
                style={{ backgroundColor: 'rgba(255,255,255,0.08)' }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="4" width="20" height="16" rx="2" />
                  <path d="M22 7l-10 7L2 7" />
                </svg>
                {link.label}
              </a>
            ))}
          </div>
          <a
            href="mailto:hello@build.withdarsh.com"
            className="text-[0.75rem] text-white/35 hover:text-white/60 transition-colors"
          >
            hello@build.withdarsh.com
          </a>
        </motion.div>
      </div>

      {/* Footer bar */}
      <div className="relative z-10 py-4 text-center">
        <span className="text-[0.6875rem] text-white/25 font-medium">
          &copy; {new Date().getFullYear()} Burger Empire (Abc Foods Pvt Ltd). All rights reserved.
        </span>
      </div>
    </div>
  );
}
