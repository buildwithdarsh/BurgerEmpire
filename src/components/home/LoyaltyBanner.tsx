'use client';

import { useMode } from '@/hooks/useMode';
import { useConfig } from '@/hooks/useConfig';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { TrophyIcon, LeafIcon } from '@/components/icons';

/* ── Animated phone mockup with rewards UI ── */
function RewardsPhoneSVG({ isClassic }: { isClassic: boolean }) {
  const accent = isClassic ? '#EB7A29' : '#4AA056';
  const accentLight = isClassic ? '#FFD54F' : '#81C784';

  return (
    <svg width="220" height="340" viewBox="0 0 220 340" fill="none" className="w-full h-full">
      <defs>
        <filter id="phoneShadow">
          <feDropShadow dx="0" dy="8" stdDeviation="12" floodColor="rgba(0,0,0,0.3)" />
        </filter>
        <clipPath id="phoneScreen">
          <rect x="24" y="32" width="172" height="276" rx="4" />
        </clipPath>
        <linearGradient id="rewardGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={accent} />
          <stop offset="100%" stopColor={accentLight} />
        </linearGradient>
      </defs>

      {/* Phone body */}
      <motion.g
        filter="url(#phoneShadow)"
        initial={{ opacity: 0, y: 30, rotate: 5 }}
        whileInView={{ opacity: 1, y: 0, rotate: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Phone frame */}
        <rect x="16" y="8" width="188" height="324" rx="28" fill="#1A1A1A" />
        <rect x="20" y="12" width="180" height="316" rx="26" fill="#2C2C2C" />

        {/* Screen */}
        <rect x="24" y="32" width="172" height="276" rx="4" fill="#111111" />

        {/* Dynamic island / notch */}
        <rect x="82" y="16" width="56" height="14" rx="7" fill="#111111" />
        <circle cx="110" cy="23" r="3" fill="#222" />

        {/* Screen content - clipped */}
        <g clipPath="url(#phoneScreen)">
          {/* Status bar */}
          <rect x="24" y="32" width="172" height="20" fill="#1a1a1a" />
          <text x="36" y="46" fontSize="7" fill="white" opacity={0.5} fontWeight="500">9:41</text>

          {/* App header */}
          <motion.rect x="24" y="52" width="172" height="48" fill={accent} opacity={0.15}
            initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }}
            viewport={{ once: true, amount: 0.3 }} transition={{ delay: 0.5, duration: 0.4 }}
          />
          <motion.text x="40" y="72" fontSize="9" fill="white" fontWeight="700"
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.3 }} transition={{ delay: 0.6 }}
          >
            Buddy Rewards
          </motion.text>
          <motion.text x="40" y="90" fontSize="7" fill="white" opacity={0.4}
            initial={{ opacity: 0 }} whileInView={{ opacity: 0.4 }}
            viewport={{ once: true, amount: 0.3 }} transition={{ delay: 0.7 }}
          >
            {isClassic ? '2,450 points' : '4,800 health pts'}
          </motion.text>

          {/* Burger stamp card */}
          <motion.g
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ delay: 0.8, duration: 0.5 }}
          >
            <rect x="34" y="110" width="152" height="70" rx="10" fill="rgba(255,255,255,0.06)" />
            <text x="48" y="128" fontSize="7" fill={accent} fontWeight="700">STAMP CARD</text>

            {/* Stamp circles */}
            {Array.from({ length: 10 }).map((_, si) => {
              const row = Math.floor(si / 5);
              const col = si % 5;
              const cx = 56 + col * 26;
              const cy = 145 + row * 22;
              const filled = si < 7;
              return (
                <motion.g key={si}>
                  <circle cx={cx} cy={cy} r="8" fill={filled ? accent : 'rgba(255,255,255,0.08)'}
                    stroke={filled ? accent : 'rgba(255,255,255,0.15)'} strokeWidth="1"
                  />
                  {filled && (
                    <motion.path
                      d={`M${cx - 3} ${cy}L${cx - 1} ${cy + 2}L${cx + 3} ${cy - 2}`}
                      stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"
                      initial={{ pathLength: 0 }}
                      whileInView={{ pathLength: 1 }}
                      viewport={{ once: true, amount: 0.3 }}
                      transition={{ delay: 1.0 + si * 0.06, duration: 0.2 }}
                    />
                  )}
                </motion.g>
              );
            })}
          </motion.g>

          {/* Reward item cards */}
          {[
            { y: 195, label: isClassic ? 'Free Fries Upgrade' : 'Free Smoothie', pts: '500 pts', done: true },
            { y: 230, label: isClassic ? 'Free Buddy Burger' : 'Free Salad Bowl', pts: '1000 pts', done: false },
          ].map((item, ri) => (
            <motion.g key={ri}
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ delay: 1.3 + ri * 0.15, duration: 0.4 }}
            >
              <rect x="34" y={item.y} width="152" height="28" rx="6" fill="rgba(255,255,255,0.05)" />
              <text x="48" y={item.y + 18} fontSize="7" fill="white" fontWeight="600">{item.label}</text>
              <text x={160} y={item.y + 18} fontSize="6" fill={item.done ? accent : 'rgba(255,255,255,0.3)'} fontWeight="700" textAnchor="end">
                {item.done ? '✓' : item.pts}
              </text>
            </motion.g>
          ))}

          {/* Bottom CTA */}
          <motion.rect x="34" y="270" width="152" height="30" rx="8" fill={accent}
            initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }}
            viewport={{ once: true, amount: 0.3 }} transition={{ delay: 1.5, duration: 0.4 }}
          />
          <motion.text x="110" y="290" fontSize="8" fill="white" fontWeight="700" textAnchor="middle"
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.3 }} transition={{ delay: 1.7 }}
          >
            Claim Reward
          </motion.text>
        </g>

        {/* Home indicator */}
        <rect x="80" y="316" width="60" height="4" rx="2" fill="rgba(255,255,255,0.2)" />
      </motion.g>

      {/* Floating reward particles */}
      {[
        { x: 10, y: 60, delay: 1.8, symbol: '★' },
        { x: 200, y: 100, delay: 2.0, symbol: '₹' },
        { x: 5, y: 200, delay: 2.2, symbol: '♦' },
        { x: 205, y: 260, delay: 2.4, symbol: '●' },
      ].map((p, i) => (
        <motion.text key={i} x={p.x} y={p.y} fontSize="14" textAnchor="middle" fill="white"
          initial={{ opacity: 0, scale: 0, y: p.y + 10 }}
          whileInView={{ opacity: [0, 0.5, 0.3], scale: [0, 1.2, 1], y: [p.y + 10, p.y - 5, p.y] }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ delay: p.delay, duration: 0.6 }}
        >
          {p.symbol}
        </motion.text>
      ))}
    </svg>
  );
}

/* ── Animated confetti/sparkles background ── */
function ConfettiBurst({ isClassic }: { isClassic: boolean }) {
  const particles = [
    { x: 50, y: 30, size: 4, color: isClassic ? '#EB7A29' : '#66BB6A', delay: 0.5, rotation: 45 },
    { x: 900, y: 50, size: 3, color: isClassic ? '#FFD54F' : '#81C784', delay: 0.7, rotation: -30 },
    { x: 200, y: 180, size: 5, color: isClassic ? '#D46E1F' : '#43A047', delay: 0.9, rotation: 60 },
    { x: 800, y: 160, size: 4, color: isClassic ? '#EB7A29' : '#4AA056', delay: 1.1, rotation: -45 },
    { x: 100, y: 100, size: 3, color: 'white', delay: 1.3, rotation: 20 },
    { x: 700, y: 80, size: 3, color: 'white', delay: 1.5, rotation: -60 },
  ];

  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 1000 220" preserveAspectRatio="none" fill="none">
      {particles.map((p, i) => (
        <motion.rect key={i}
          x={p.x} y={p.y} width={p.size} height={p.size}
          fill={p.color} rx="1"
          opacity={0.15}
          initial={{ opacity: 0, scale: 0, rotate: 0 }}
          whileInView={{ opacity: [0, 0.2, 0.1], scale: [0, 1.5, 1], rotate: p.rotation }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ delay: p.delay, duration: 0.8 }}
        />
      ))}
      {/* Decorative arcs */}
      <motion.path
        d="M0 200C250 150 500 220 750 170C900 140 1000 180 1000 180"
        stroke={isClassic ? '#EB7A29' : '#4AA056'} strokeWidth="1" opacity={0.06} fill="none"
        initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }}
        viewport={{ once: true, amount: 0.3 }} transition={{ duration: 2 }}
      />
    </svg>
  );
}

export default function LoyaltyBanner() {
  const { isClassic } = useMode();
  const { config } = useConfig();

  if (!config.loyalty.enabled) return null;

  return (
    <section
      className="py-10 md:py-14 px-5 has-pattern transition-colors duration-500"
      style={{ backgroundColor: '#FFFFFF' }}
    >
      <motion.div
        className="max-w-[1200px] mx-auto rounded-3xl overflow-hidden relative"
        style={{
          background: isClassic
            ? 'linear-gradient(135deg, #1A1A1A 0%, #2C2C2C 50%, #1F1F1F 100%)'
            : 'linear-gradient(135deg, #1C2B1E 0%, #2D4A35 50%, #1A2E1F 100%)',
        }}
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      >
        <ConfettiBurst isClassic={isClassic} />

        {/* Decorative glow orbs */}
        <div
          className="absolute -left-20 -top-20 w-64 h-64 rounded-full blur-3xl"
          style={{ backgroundColor: isClassic ? 'rgba(235,122,41,0.1)' : 'rgba(74,160,86,0.1)' }}
        />
        <div
          className="absolute -right-16 -bottom-16 w-48 h-48 rounded-full blur-2xl"
          style={{ backgroundColor: isClassic ? 'rgba(235,122,41,0.06)' : 'rgba(74,160,86,0.06)' }}
        />

        <div className="flex flex-col md:flex-row items-center relative z-10">
          <div className="flex-1 p-8 md:p-14">
            <motion.span
              className="inline-flex items-center gap-2 text-[0.625rem] font-bold uppercase tracking-[0.2em] mb-4 px-3 py-1 rounded-full border"
              style={{
                color: isClassic ? '#EB7A29' : '#6AAF7B',
                borderColor: isClassic ? 'rgba(235,122,41,0.2)' : 'rgba(106,175,123,0.2)',
                backgroundColor: isClassic ? 'rgba(235,122,41,0.08)' : 'rgba(106,175,123,0.08)',
              }}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ delay: 0.2 }}
            >
              <motion.span
                animate={{ rotate: [0, 15, -15, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              >
                {isClassic
                  ? <TrophyIcon size={14} color="#EB7A29" />
                  : <LeafIcon size={14} color="#6AAF7B" />}
              </motion.span>
              {isClassic ? 'Your Burgers Pay You Back' : 'Healthy Choices, Real Rewards'}
            </motion.span>

            <motion.h2
              className="text-2xl md:text-[2.125rem] font-black text-white mb-4 leading-tight"
              style={{ fontFamily: "var(--font-poppins)" }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              {isClassic
                ? <>Your 11th burger? It&apos;s <span style={{ color: '#EB7A29' }}>ON US</span>.</>
                : <>Every healthy bite earns you <span style={{ color: '#6AAF7B' }}>double</span> the love.</>}
            </motion.h2>
            <motion.p
              className="text-sm md:text-base text-white/50 mb-8 max-w-md leading-relaxed"
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              {isClassic
                ? 'Every order stacks up. Birthday treats, first-dibs on new drops, and free food — 50,000+ Buddies are already cashing in.'
                : 'Your body wins. Your wallet wins. Unlock free meals, personal nutrition guidance, and recipes you can\'t find anywhere else.'}
            </motion.p>

            {/* Feature pills */}
            <motion.div
              className="flex flex-wrap gap-2 mb-8"
              initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
              viewport={{ once: true, amount: 0.3 }} transition={{ delay: 0.5 }}
            >
              {(isClassic
                ? ['Birthday Freebies', 'First-Dibs Drops', 'Surprise Rewards']
                : ['Personal Macro Tracking', 'Chef-Curated Recipes', 'Milestone Unlocks']
              ).map((pill, pi) => (
                <motion.span
                  key={pill}
                  className="text-[0.6875rem] px-3 py-1.5 rounded-full border border-white/10 text-white/60 bg-white/5"
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ delay: 0.6 + pi * 0.08, type: 'spring', stiffness: 200 }}
                >
                  {pill}
                </motion.span>
              ))}
            </motion.div>

            <motion.div
              className="loyalty-cta-row flex items-center gap-3"
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              <Link
                href="/rewards"
                className="loyalty-cta-btn inline-flex items-center justify-center px-7 py-3.5 rounded-xl text-sm font-bold transition-all duration-200 active:scale-[0.97]"
                style={{
                  backgroundColor: isClassic ? '#EB7A29' : '#4AA056',
                  color: isClassic ? '#1A1A1A' : '#FFFFFF',
                }}
              >
                Start Earning — Free to Join
              </Link>
              <Link
                href="/rewards"
                className="loyalty-cta-btn inline-flex items-center justify-center px-7 py-3.5 rounded-xl text-sm font-bold border border-white/15 text-white/70 hover:bg-white/5 transition-colors"
              >
                See How It Works
              </Link>
            </motion.div>

            {/* Social proof */}
            <motion.div
              className="flex items-center gap-3 mt-8"
              initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
              viewport={{ once: true, amount: 0.3 }} transition={{ delay: 0.8 }}
            >
              {/* Stacked avatars */}
              <div className="flex -space-x-2">
                {['#EB7A29', '#E53935', '#2196F3', '#9C27B0'].map((c, ai) => (
                  <motion.div key={ai}
                    className="w-7 h-7 rounded-full border-2 border-[#1A1A1A] flex items-center justify-center text-[0.5rem] font-bold text-white"
                    style={{ backgroundColor: c, zIndex: 4 - ai }}
                    initial={{ scale: 0, x: -10 }}
                    whileInView={{ scale: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ delay: 0.9 + ai * 0.05, type: 'spring', stiffness: 300 }}
                  >
                    {['A', 'R', 'M', 'S'][ai]}
                  </motion.div>
                ))}
              </div>
              <span className="text-[0.6875rem] text-white/40">
                <span className="font-bold text-white/60">50,000+</span> Buddies already eating free
              </span>
            </motion.div>
          </div>

          {/* Phone mockup illustration */}
          <div className="flex-shrink-0 p-6 md:p-10 flex items-center justify-center">
            <div className="w-[180px] h-[300px] md:w-[220px] md:h-[340px]">
              <RewardsPhoneSVG isClassic={isClassic} />
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
