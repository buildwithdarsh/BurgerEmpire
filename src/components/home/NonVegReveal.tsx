'use client';

import { useRef, useState } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';

/* ── Nonveg Burger SVG illustration ── */
function NonVegBurgerSVG() {
  return (
    <motion.svg
      width="360" height="360" viewBox="0 0 400 400" fill="none"
      className="w-[240px] h-[240px] md:w-[320px] md:h-[320px]"
      animate={{ y: [0, -10, 0] }}
      transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
    >
      <defs>
        <filter id="nvGlow">
          <feDropShadow dx="0" dy="6" stdDeviation="14" floodColor="rgba(0,0,0,0.22)" />
        </filter>
        <linearGradient id="nvPattyGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#6D3A1F" />
          <stop offset="100%" stopColor="#3E1F0E" />
        </linearGradient>
        <linearGradient id="nvBunGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#D4952A" />
          <stop offset="100%" stopColor="#B07818" />
        </linearGradient>
        <radialGradient id="fireGlow" cx="50%" cy="100%" r="60%">
          <stop offset="0%" stopColor="#EB7A29" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#EB7A29" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Warm glow behind burger */}
      <motion.circle
        cx="200" cy="220" r="140" fill="url(#fireGlow)"
        animate={{ scale: [1, 1.1, 1], opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
      />

      <g filter="url(#nvGlow)">
        {/* ── Top Bun ── */}
        <motion.path
          d="M80 200C80 130 130 75 200 75C270 75 320 130 320 200H80Z"
          fill="url(#nvBunGrad)"
          initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        />
        {/* Bun highlight */}
        <motion.path
          d="M115 160C125 115 162 90 200 86C238 90 275 115 285 160"
          fill="none" stroke="#E8B84D" strokeWidth="14" strokeLinecap="round" opacity={0.3}
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        />
        {/* Sesame seeds */}
        {[
          { cx: 145, cy: 138, d: 1.0 },
          { cx: 200, cy: 118, d: 1.1 },
          { cx: 255, cy: 140, d: 1.2 },
          { cx: 175, cy: 165, d: 1.25 },
          { cx: 228, cy: 160, d: 1.3 },
        ].map((s, i) => (
          <motion.ellipse
            key={i} cx={s.cx} cy={s.cy} rx="5" ry="9" fill="#F5E6C8"
            initial={{ scale: 0 }} animate={{ scale: 1 }}
            transition={{ delay: s.d, duration: 0.3, type: 'spring' }}
          />
        ))}

        {/* ── Lettuce ── */}
        <motion.path
          d="M60 208C60 208 92 232 136 218C180 204 198 232 240 218C282 204 310 232 346 208"
          stroke="#43A047" strokeWidth="14" strokeLinecap="round" fill="none"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
          transition={{ delay: 0.7, duration: 0.8 }}
        />

        {/* ── Cheese (melty, dripping over patty) ── */}
        <motion.path
          d="M68 214L72 238L96 242L102 254L132 240L170 244L200 236L228 244L268 240L298 248L308 240L326 240L330 214"
          fill="#FFC107" stroke="#FFB300" strokeWidth="1"
          initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.5 }}
        />

        {/* ── Chicken Patty (thick, juicy, crispy-edged) ── */}
        <motion.rect
          x="68" y="252" width="264" height="44" rx="22" fill="url(#nvPattyGrad)"
          initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
          transition={{ delay: 0.5, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        />
        {/* Crispy texture marks */}
        {[
          { x1: 100, x2: 140, y: 268, d: 1.3 },
          { x1: 160, x2: 205, y: 274, d: 1.4 },
          { x1: 225, x2: 270, y: 266, d: 1.5 },
          { x1: 130, x2: 175, y: 282, d: 1.55 },
          { x1: 200, x2: 245, y: 280, d: 1.6 },
        ].map((g, i) => (
          <motion.line
            key={i} x1={g.x1} y1={g.y} x2={g.x2} y2={g.y}
            stroke="#8B5E3C" strokeWidth="2" strokeLinecap="round"
            initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
            transition={{ delay: g.d, duration: 0.3 }}
          />
        ))}

        {/* ── Spicy sauce drizzle ── */}
        <motion.path
          d="M90 250C110 258 130 248 150 256C170 264 190 252 210 260C230 268 250 254 270 262C290 270 310 256 320 260"
          stroke="#D32F2F" strokeWidth="3" strokeLinecap="round" fill="none" opacity={0.7}
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
        />

        {/* ── Onion rings ── */}
        {[{ cx: 130, r: 14, d: 1.4 }, { cx: 200, r: 12, d: 1.5 }, { cx: 265, r: 13, d: 1.6 }].map((ring, i) => (
          <motion.g key={i}>
            <motion.circle
              cx={ring.cx} cy="300" r={ring.r} fill="none"
              stroke="#E8D0A0" strokeWidth="5"
              initial={{ scale: 0 }} animate={{ scale: 1 }}
              transition={{ delay: ring.d, type: 'spring', stiffness: 300 }}
            />
            <motion.circle
              cx={ring.cx} cy="300" r={ring.r - 3} fill="none"
              stroke="#D4B880" strokeWidth="2" opacity={0.5}
              initial={{ scale: 0 }} animate={{ scale: 1 }}
              transition={{ delay: ring.d + 0.1, type: 'spring' }}
            />
          </motion.g>
        ))}

        {/* ── Bottom Bun ── */}
        <motion.path
          d="M80 320H320C320 351 274 373 200 373C126 373 80 351 80 320Z"
          fill="url(#nvBunGrad)"
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        />
        <motion.rect
          x="80" y="312" width="240" height="12" rx="3" fill="#C8851E"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.4 }}
        />
      </g>

      {/* ── Sizzle particles ── */}
      {[85, 140, 200, 260, 315].map((x, i) => (
        <motion.circle
          key={`sz-${x}`} cx={x} cy={248} r="2" fill="#EB7A29"
          animate={{ y: [0, -18, -30], opacity: [0.8, 0.5, 0], scale: [1, 1.3, 0.6] }}
          transition={{ duration: 1.4, repeat: Infinity, delay: i * 0.3, ease: 'easeOut' }}
        />
      ))}

      {/* ── Steam wisps ── */}
      {[155, 200, 245].map((x, i) => (
        <motion.path
          key={`st-${x}`}
          d={`M${x} 68 Q${x + (i % 2 === 0 ? 10 : -10)} 46 ${x} 26`}
          stroke="white" strokeWidth="2.5" strokeLinecap="round" fill="none"
          animate={{ opacity: [0, 0.5, 0], y: [0, -12, -24] }}
          transition={{ duration: 2.2, repeat: Infinity, delay: i * 0.6, ease: 'easeOut' }}
        />
      ))}

      {/* ── Flame accents on sides ── */}
      {[
        { x: 48, y: 260, d: 0, flip: false },
        { x: 352, y: 255, d: 0.4, flip: true },
      ].map((f, i) => (
        <motion.path
          key={`fl-${i}`}
          d={f.flip
            ? `M${f.x} ${f.y}C${f.x + 8} ${f.y - 20} ${f.x - 4} ${f.y - 35} ${f.x + 6} ${f.y - 50}C${f.x + 10} ${f.y - 35} ${f.x + 16} ${f.y - 18} ${f.x} ${f.y}Z`
            : `M${f.x} ${f.y}C${f.x - 8} ${f.y - 20} ${f.x + 4} ${f.y - 35} ${f.x - 6} ${f.y - 50}C${f.x - 10} ${f.y - 35} ${f.x - 16} ${f.y - 18} ${f.x} ${f.y}Z`
          }
          fill="#EB7A29" opacity={0.6}
          animate={{ scaleY: [0.8, 1.2, 0.8], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 1.5, repeat: Infinity, delay: f.d, ease: 'easeInOut' }}
        />
      ))}
    </motion.svg>
  );
}

/* ── Sparkle burst particles ── */
function SparkleParticles() {
  const particles = Array.from({ length: 16 }, (_, i) => {
    const angle = (i / 16) * Math.PI * 2;
    const radius = 120 + Math.random() * 80;
    return {
      x: Math.cos(angle) * radius,
      y: Math.sin(angle) * radius,
      size: 2 + Math.random() * 4,
      delay: i * 0.06,
      color: ['#EB7A29', '#FFC107', '#FF3D00', '#FFD54F', '#9A1E29'][i % 5],
    };
  });

  return (
    <>
      {particles.map((p, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            left: '50%',
            top: '50%',
          }}
          initial={{ x: 0, y: 0, opacity: 0, scale: 0 }}
          animate={{
            x: p.x,
            y: p.y,
            opacity: [0, 1, 1, 0],
            scale: [0, 1.5, 1, 0],
          }}
          transition={{
            duration: 1.2,
            delay: 1.8 + p.delay,
            ease: 'easeOut',
          }}
        />
      ))}
    </>
  );
}

/* ── Confetti pieces ── */
function ConfettiPieces() {
  const pieces = Array.from({ length: 24 }, (_, i) => ({
    x: -150 + Math.random() * 300,
    delay: 1.6 + Math.random() * 0.6,
    color: ['#EB7A29', '#FFC107', '#9A1E29', '#FF3D00', '#FFD54F', '#E53935'][i % 6],
    rotation: Math.random() * 720 - 360,
    width: 4 + Math.random() * 6,
    height: 8 + Math.random() * 10,
  }));

  return (
    <>
      {pieces.map((p, i) => (
        <motion.div
          key={i}
          className="absolute rounded-sm"
          style={{
            width: p.width,
            height: p.height,
            backgroundColor: p.color,
            left: '50%',
            top: '20%',
          }}
          initial={{ x: 0, y: 0, opacity: 0, rotate: 0 }}
          animate={{
            x: p.x,
            y: [0, -80, 300],
            opacity: [0, 1, 1, 0],
            rotate: p.rotation,
          }}
          transition={{
            duration: 2.5,
            delay: p.delay,
            ease: [0.16, 1, 0.3, 1],
          }}
        />
      ))}
    </>
  );
}

/* ── Single curtain panel ── */
function CurtainPanel({ side }: { side: 'left' | 'right' }) {
  const isLeft = side === 'left';

  return (
    <motion.div
      className="absolute top-0 bottom-0 z-20"
      style={{
        width: '52%',
        [isLeft ? 'left' : 'right']: 0,
        background: isLeft
          ? 'linear-gradient(135deg, #8B1A1A 0%, #B22222 30%, #A01818 60%, #8B1A1A 100%)'
          : 'linear-gradient(225deg, #8B1A1A 0%, #B22222 30%, #A01818 60%, #8B1A1A 100%)',
        transformOrigin: isLeft ? 'left center' : 'right center',
      }}
      initial={{ x: 0 }}
      animate={{ x: isLeft ? '-100%' : '100%' }}
      transition={{ duration: 1.4, delay: 0.6, ease: [0.65, 0, 0.35, 1] }}
    >
      {/* Curtain folds */}
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 100 200"
        preserveAspectRatio="none"
        fill="none"
      >
        {/* Vertical fold highlights */}
        {[15, 30, 50, 70, 85].map((x, i) => (
          <motion.line
            key={i}
            x1={x} y1="0" x2={x} y2="200"
            stroke={i % 2 === 0 ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.12)'}
            strokeWidth="3"
          />
        ))}
        {/* Swooping drape curves */}
        <path
          d="M0 0 C20 10, 30 5, 50 12 C70 5, 80 10, 100 0"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth="2"
          fill="none"
        />
        <path
          d="M0 200 C25 190, 40 195, 50 188 C60 195, 75 190, 100 200"
          stroke="rgba(0,0,0,0.08)"
          strokeWidth="2"
          fill="none"
        />
      </svg>

      {/* Gold trim on inner edge */}
      <div
        className="absolute top-0 bottom-0 w-[6px]"
        style={{
          [isLeft ? 'right' : 'left']: 0,
          background: 'linear-gradient(180deg, #D4A030 0%, #E8C054 30%, #B8862D 60%, #D4A030 100%)',
          boxShadow: isLeft
            ? '2px 0 12px rgba(212,160,48,0.3)'
            : '-2px 0 12px rgba(212,160,48,0.3)',
        }}
      />

      {/* Tassels */}
      <div
        className="absolute bottom-0 flex gap-[2px]"
        style={{ [isLeft ? 'right' : 'left']: 0 }}
      >
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-[3px] h-8 rounded-b-full"
            style={{
              background: 'linear-gradient(180deg, #D4A030, #B8862D)',
            }}
            animate={{ y: [0, 3, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
          />
        ))}
      </div>
    </motion.div>
  );
}

/* ── Curtain rod ── */
function CurtainRod() {
  return (
    <motion.div
      className="absolute top-0 left-0 right-0 z-30 h-4"
      style={{
        background: 'linear-gradient(180deg, #D4A030 0%, #8B6914 60%, #D4A030 100%)',
        boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      {/* Rod finials */}
      {['left', 'right'].map((side) => (
        <div
          key={side}
          className="absolute top-1/2 -translate-y-1/2 w-5 h-5 rounded-full"
          style={{
            [side]: -4,
            background: 'radial-gradient(circle at 35% 35%, #E8C054, #8B6914)',
            boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
          }}
        />
      ))}
    </motion.div>
  );
}

/* ── Main component ── */
export default function NonVegReveal() {
  const [hasRevealed, setHasRevealed] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.4 });

  // Trigger reveal when section comes into view
  if (isInView && !hasRevealed) {
    setHasRevealed(true);
  }

  return (
    <section
      ref={sectionRef}
      className="py-16 md:py-24 px-5 relative overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, #1A1A1A 0%, #2C1810 50%, #1A1A1A 100%)',
      }}
    >
      {/* Ambient background glow */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 50% 50%, rgba(255,107,53,0.12) 0%, transparent 70%)',
        }}
        animate={hasRevealed ? { opacity: [0, 1] } : {}}
        transition={{ delay: 2, duration: 1 }}
      />

      <div className="max-w-[900px] mx-auto relative z-10">
        {/* Curtain stage */}
        <div
          className="relative mx-auto rounded-2xl overflow-hidden"
          style={{
            aspectRatio: '4 / 3',
            maxWidth: 600,
            background: 'radial-gradient(ellipse at 50% 60%, #3D1F10 0%, #1A0E08 100%)',
            boxShadow: '0 0 60px rgba(255,107,53,0.15), 0 20px 60px rgba(0,0,0,0.5)',
          }}
        >
          <CurtainRod />

          {/* Curtain panels */}
          <AnimatePresence>
            {!hasRevealed ? null : (
              <>
                <CurtainPanel side="left" />
                <CurtainPanel side="right" />
              </>
            )}
          </AnimatePresence>

          {/* Pre-reveal static curtains */}
          {!hasRevealed && (
            <>
              <div
                className="absolute top-0 bottom-0 left-0 z-20"
                style={{
                  width: '52%',
                  background: 'linear-gradient(135deg, #8B1A1A 0%, #B22222 30%, #A01818 60%, #8B1A1A 100%)',
                }}
              >
                <div
                  className="absolute top-0 bottom-0 right-0 w-[6px]"
                  style={{ background: 'linear-gradient(180deg, #D4A030 0%, #E8C054 30%, #B8862D 60%, #D4A030 100%)' }}
                />
              </div>
              <div
                className="absolute top-0 bottom-0 right-0 z-20"
                style={{
                  width: '52%',
                  background: 'linear-gradient(225deg, #8B1A1A 0%, #B22222 30%, #A01818 60%, #8B1A1A 100%)',
                }}
              >
                <div
                  className="absolute top-0 bottom-0 left-0 w-[6px]"
                  style={{ background: 'linear-gradient(180deg, #D4A030 0%, #E8C054 30%, #B8862D 60%, #D4A030 100%)' }}
                />
              </div>
            </>
          )}

          {/* Revealed content behind curtains */}
          <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
            {/* Spotlight beam */}
            <motion.div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: 'radial-gradient(ellipse at 50% 40%, rgba(255,180,80,0.15) 0%, transparent 60%)',
              }}
              initial={{ opacity: 0 }}
              animate={hasRevealed ? { opacity: [0, 0, 1] } : {}}
              transition={{ duration: 0.5, delay: 1.2 }}
            />

            {/* Sparkle burst */}
            {hasRevealed && <SparkleParticles />}
            {hasRevealed && <ConfettiPieces />}

            {/* Burger illustration */}
            <motion.div
              initial={{ scale: 0.6, opacity: 0 }}
              animate={hasRevealed ? { scale: 1, opacity: 1 } : {}}
              transition={{ delay: 1.6, duration: 0.8, type: 'spring', stiffness: 100, damping: 12 }}
            >
              <NonVegBurgerSVG />
            </motion.div>
          </div>
        </div>

        {/* Text reveal below the stage */}
        <motion.div
          className="text-center mt-10 md:mt-14"
          initial={{ opacity: 0, y: 30 }}
          animate={hasRevealed ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 2.2, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Badge */}
          <motion.span
            className="inline-block text-[0.6875rem] font-bold uppercase tracking-[0.25em] mb-4 px-5 py-2 rounded-full"
            style={{
              background: 'linear-gradient(135deg, rgba(255,107,53,0.2), rgba(154,30,41,0.2))',
              color: '#EB7A29',
              border: '1px solid rgba(255,107,53,0.2)',
            }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={hasRevealed ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 2.4, duration: 0.5, type: 'spring' }}
          >
            It&apos;s Back &amp; Better Than Ever
          </motion.span>

          {/* Heading */}
          <motion.h2
            className="text-3xl md:text-5xl lg:text-[3.5rem] font-black text-white leading-[1.1] mb-4"
            style={{ fontFamily: 'var(--font-hero)' }}
            initial={{ opacity: 0, y: 20 }}
            animate={hasRevealed ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 2.5, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            Nonveg is{' '}
            <span
              style={{
                background: 'linear-gradient(135deg, #EB7A29, #FF3D00, #9A1E29)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Back!
            </span>
          </motion.h2>

          {/* Subtitle */}
          <motion.p
            className="text-base md:text-lg text-white/50 max-w-[520px] mx-auto leading-relaxed mb-8"
            initial={{ opacity: 0, y: 15 }}
            animate={hasRevealed ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 2.7, duration: 0.6 }}
          >
            The wait is over. Our legendary chicken burgers are making a sizzling comeback
            — crispier, juicier, and loaded with more flavor than ever before.
          </motion.p>

          {/* Flame divider */}
          <motion.div
            className="flex items-center justify-center gap-2 mb-8"
            initial={{ opacity: 0 }}
            animate={hasRevealed ? { opacity: 1 } : {}}
            transition={{ delay: 2.9, duration: 0.5 }}
          >
            {[0, 1, 2, 3, 4].map((i) => (
              <motion.div
                key={i}
                className="w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: '#EB7A29' }}
                animate={{
                  scale: [1, 1.4, 1],
                  opacity: [0.4, 1, 0.4],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 0.2,
                  ease: 'easeInOut',
                }}
              />
            ))}
          </motion.div>

          {/* Feature pills */}
          <motion.div
            className="flex flex-wrap justify-center gap-3"
            initial={{ opacity: 0, y: 15 }}
            animate={hasRevealed ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 3.0, duration: 0.6 }}
          >
            {[
              { label: 'Crispy Fried Chicken', icon: '🍗' },
              { label: 'Smoky Tandoori', icon: '🔥' },
              { label: 'Spicy Peri-Peri', icon: '🌶️' },
            ].map((item) => (
              <span
                key={item.label}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-[0.8125rem] font-semibold text-white/70"
                style={{
                  backgroundColor: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.08)',
                }}
              >
                <span>{item.icon}</span>
                {item.label}
              </span>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
