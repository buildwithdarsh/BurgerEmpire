'use client';

import { useMode } from '@/hooks/useMode';
import { useConfig } from '@/hooks/useConfig';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { RocketIcon, UsersIcon, SparkleIcon } from '@/components/icons';

/* ── Animated referral flow SVG — light-background version ── */
function ReferralFlowSVG({ isClassic }: { isClassic: boolean }) {
  const accent   = isClassic ? '#D46E1F' : '#3D7A52';
  const accent2  = isClassic ? '#EB7A29' : '#4AA056';
  const coinFill = isClassic ? '#EB7A29' : '#4AA056';

  // Card geometry — cardY=55 keeps coin arc (apex ~y=22) fully inside viewBox
  const cardW = 140; const cardH = 170; const cardRx = 22;
  const youX = 8;   const youCx = youX + cardW / 2;   // 78
  const frdX = 352; const frdCx = frdX + cardW / 2;   // 422
  const cardY = 55; const avatarCy = cardY + 72;
  const shareCx = 250; const shareCy = cardY + cardH / 2; // 140

  return (
    <svg width="500" height="250" viewBox="0 0 500 250" fill="none" className="w-full h-full">

      {/* ── LEFT: YOU ── */}
      <motion.g
        initial={{ opacity: 0, x: -24 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <rect x={youX} y={cardY} width={cardW} height={cardH} rx={cardRx} fill="white" />
        {/* avatar tinted bg circle */}
        <circle cx={youCx} cy={avatarCy} r="30" fill={accent} opacity={0.10} />
        {/* head */}
        <circle cx={youCx} cy={avatarCy - 6} r="16" fill={accent} opacity={0.80} />
        {/* shoulders */}
        <path d={`M${youCx - 24} ${avatarCy + 34} Q${youCx - 24} ${avatarCy + 18} ${youCx} ${avatarCy + 18} Q${youCx + 24} ${avatarCy + 18} ${youCx + 24} ${avatarCy + 34}`}
          fill={accent} opacity={0.40} />
        <text x={youCx} y={cardY + cardH - 32} textAnchor="middle" fontSize="12" fill="#111" fontWeight="800">You</text>
        <text x={youCx} y={cardY + cardH - 16} textAnchor="middle" fontSize="9" fill="#999">Share code</text>
      </motion.g>

      {/* ── CENTER: SHARE BURST ── */}
      <motion.g
        initial={{ opacity: 0, scale: 0 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ delay: 0.4, duration: 0.5, type: 'spring', stiffness: 200 }}
        style={{ transformOrigin: `${shareCx}px ${shareCy}px` }}
      >
        {/* glow rings */}
        <circle cx={shareCx} cy={shareCy} r="46" fill={accent} opacity={0.07} />
        <circle cx={shareCx} cy={shareCy} r="32" fill={accent} opacity={0.11} />
        {/* solid circle */}
        <circle cx={shareCx} cy={shareCy} r="22" fill={accent} />
        {/* Share icon: 3 nodes + 2 lines — standard network share */}
        {/* node left */}
        <circle cx={shareCx - 8} cy={shareCy} r="4" fill="white" />
        {/* node top-right */}
        <circle cx={shareCx + 8} cy={shareCy - 10} r="4" fill="white" />
        {/* node bottom-right */}
        <circle cx={shareCx + 8} cy={shareCy + 10} r="4" fill="white" />
        {/* line left → top-right */}
        <line
          x1={shareCx - 4} y1={shareCy - 1.5}
          x2={shareCx + 4} y2={shareCy - 8.5}
          stroke="white" strokeWidth="2" strokeLinecap="round"
        />
        {/* line left → bottom-right */}
        <line
          x1={shareCx - 4} y1={shareCy + 1.5}
          x2={shareCx + 4} y2={shareCy + 8.5}
          stroke="white" strokeWidth="2" strokeLinecap="round"
        />
        {/* pulse ring */}
        <motion.circle cx={shareCx} cy={shareCy} r="46"
          stroke={accent} strokeWidth="1.5" fill="none"
          animate={{ r: [46, 60, 46], opacity: [0.18, 0, 0.18] }}
          transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
        />
      </motion.g>

      {/* ── Dashed line: You → Share ── */}
      <motion.line
        x1={youX + cardW} y1={shareCy} x2={shareCx - 48} y2={shareCy}
        stroke={accent} strokeWidth="2" strokeDasharray="5 4" opacity={0.45}
        initial={{ pathLength: 0, opacity: 0 }}
        whileInView={{ pathLength: 1, opacity: 0.45 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      />
      <motion.polygon
        points={`${shareCx - 48},${shareCy - 5} ${shareCx - 36},${shareCy} ${shareCx - 48},${shareCy + 5}`}
        fill={accent} opacity={0.5}
        initial={{ opacity: 0 }} whileInView={{ opacity: 0.5 }}
        viewport={{ once: true, amount: 0.3 }} transition={{ delay: 0.75 }}
      />

      {/* ── Dashed line: Share → Friend ── */}
      <motion.line
        x1={shareCx + 48} y1={shareCy} x2={frdX} y2={shareCy}
        stroke={accent2} strokeWidth="2" strokeDasharray="5 4" opacity={0.45}
        initial={{ pathLength: 0, opacity: 0 }}
        whileInView={{ pathLength: 1, opacity: 0.45 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ delay: 0.6, duration: 0.5 }}
      />
      <motion.polygon
        points={`${frdX},${shareCy - 5} ${frdX + 12},${shareCy} ${frdX},${shareCy + 5}`}
        fill={accent2} opacity={0.5}
        initial={{ opacity: 0 }} whileInView={{ opacity: 0.5 }}
        viewport={{ once: true, amount: 0.3 }} transition={{ delay: 1.05 }}
      />

      {/* ── RIGHT: FRIEND ── */}
      <motion.g
        initial={{ opacity: 0, x: 24 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ delay: 0.5, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <rect x={frdX} y={cardY} width={cardW} height={cardH} rx={cardRx} fill="white" />
        <circle cx={frdCx} cy={avatarCy} r="30" fill={accent2} opacity={0.10} />
        <circle cx={frdCx} cy={avatarCy - 6} r="16" fill={accent2} opacity={0.80} />
        <path d={`M${frdCx - 24} ${avatarCy + 34} Q${frdCx - 24} ${avatarCy + 18} ${frdCx} ${avatarCy + 18} Q${frdCx + 24} ${avatarCy + 18} ${frdCx + 24} ${avatarCy + 34}`}
          fill={accent2} opacity={0.40} />
        <text x={frdCx} y={cardY + cardH - 32} textAnchor="middle" fontSize="12" fill="#111" fontWeight="800">Friend</text>
        <text x={frdCx} y={cardY + cardH - 16} textAnchor="middle" fontSize="9" fill="#999">First order</text>
      </motion.g>

      {/* ── Coin arc (Friend → You) — apex at y=22, all within viewBox ── */}
      <motion.path
        d={`M${frdX + 20} ${cardY + 8} Q420 22 250 30 Q80 22 ${youX + 120} ${cardY + 8}`}
        stroke={coinFill} strokeWidth="1.2" strokeDasharray="3 5" fill="none" opacity={0.25}
        initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }}
        viewport={{ once: true, amount: 0.3 }} transition={{ delay: 1.0, duration: 1.0 }}
      />

      {/* Coins along arc */}
      {[
        { cx: 398, cy: 43, delay: 1.2,  r: 11 },
        { cx: 340, cy: 24, delay: 1.45, r: 10 },
        { cx: 250, cy: 30, delay: 1.7,  r:  9 },
        { cx: 160, cy: 24, delay: 1.95, r: 10 },
        { cx: 102, cy: 43, delay: 2.2,  r: 11 },
      ].map((c, i) => (
        <motion.g key={i}
          initial={{ opacity: 0, scale: 0 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ delay: c.delay, duration: 0.4, type: 'spring', stiffness: 260 }}
        >
          <circle cx={c.cx} cy={c.cy} r={c.r} fill={coinFill} opacity={0.92} />
          <text x={c.cx} y={c.cy + 4} textAnchor="middle" fontSize={c.r - 2} fill="white" fontWeight="900">₹</text>
        </motion.g>
      ))}
    </svg>
  );
}

export default function ReferAndEarn() {
  const { isClassic } = useMode();
  const { config } = useConfig();

  if (!config.features.referral_enabled) return null;

  const sectionBg  = isClassic ? '#FEF3C7' : '#EDF7F0';
  const accent      = isClassic ? '#D46E1F' : '#3D7A52';
  const badgeBg    = isClassic ? 'rgba(232,148,26,0.13)' : 'rgba(61,122,82,0.13)';
  const badgeText  = isClassic ? '#92400E' : '#1E4D32';

  const refereeCoins  = config.features.referral_points ?? 25;
  const referrerCoins = config.features.referral_points ?? 50;

  const steps = [
    {
      Icon: RocketIcon,
      title: 'Share Your Code',
      desc: 'Send your personal referral link or code to any friend',
    },
    {
      Icon: UsersIcon,
      title: 'Friend Signs Up',
      desc: `They get ${refereeCoins} bonus coins when they place their first order`,
    },
    {
      Icon: SparkleIcon,
      title: 'You Both Win',
      desc: `Your account is credited ${referrerCoins} coins — no cap, no limits`,
    },
  ];

  return (
    <section
      className="py-14 md:py-20 px-5 transition-colors duration-500 has-pattern overflow-hidden"
      style={{ backgroundColor: sectionBg }}
    >
      <div className="max-w-[1100px] mx-auto">

        {/* ── Badge ── */}
        <motion.div
          className="flex justify-center mb-5"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.4 }}
        >
          <span
            className="inline-flex items-center gap-2 text-[0.625rem] font-bold uppercase tracking-[0.18em] px-4 py-1.5 rounded-full"
            style={{ backgroundColor: badgeBg, color: badgeText }}
          >
            <motion.span
              animate={{ scale: [1, 1.35, 1] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            >
              <UsersIcon size={12} color={badgeText} />
            </motion.span>
            Refer &amp; Earn
          </span>
        </motion.div>

        {/* ── Headline ── */}
        <motion.h2
          className="text-center text-3xl md:text-[2.5rem] font-black text-gray-900 leading-tight mb-3"
          style={{ fontFamily: "var(--font-poppins)" }}
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ delay: 0.15, duration: 0.5 }}
        >
          {isClassic
            ? <>Bring a friend. Get{' '}
                <span style={{ color: accent }}>{referrerCoins} coins</span> free.
              </>
            : <>Share healthy vibes.{' '}
                <span style={{ color: accent }}>Earn {referrerCoins} coins.</span>
              </>}
        </motion.h2>

        {/* ── Subtext ── */}
        <motion.p
          className="text-center text-sm md:text-[0.9375rem] text-gray-600 mb-10 max-w-[500px] mx-auto leading-relaxed"
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ delay: 0.25, duration: 0.5 }}
        >
          {isClassic
            ? `Your friend gets ${refereeCoins} coins on their first order, and you earn ${referrerCoins} coins automatically. Repeat with every friend — no limits.`
            : `Spread the love. Every friend who joins unlocks ${refereeCoins} coins for them and ${referrerCoins} coins for you. The more you share, the more you earn.`}
        </motion.p>

        {/* ── Animated illustration ── */}
        <motion.div
          className="flex justify-center mb-10"
          initial={{ opacity: 0, scale: 0.94 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ delay: 0.3, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="w-full max-w-[560px] h-[200px] md:h-[250px]">
            <ReferralFlowSVG isClassic={isClassic} />
          </div>
        </motion.div>

        {/* ── Step cards ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              className="bg-white rounded-2xl p-6 flex flex-col items-center text-center"
              style={{ boxShadow: '0 2px 16px rgba(0,0,0,0.06)' }}
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ delay: 0.45 + i * 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              <motion.span
                className="flex items-center justify-center mb-3"
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ delay: 0.55 + i * 0.1, type: 'spring', stiffness: 250 }}
              >
                <step.Icon size={32} color={accent} />
              </motion.span>
              <p className="text-sm font-bold text-gray-900 mb-1">{step.title}</p>
              <p className="text-xs text-gray-600 leading-relaxed">{step.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* ── CTA ── */}
        <motion.div
          className="flex justify-center"
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ delay: 0.75, duration: 0.5 }}
        >
          <Link href="/rewards">
            <motion.span
              className="inline-block px-8 py-3.5 rounded-xl text-sm font-bold text-white transition-all duration-200"
              style={{ backgroundColor: accent }}
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.97 }}
            >
              Get My Referral Code →
            </motion.span>
          </Link>
        </motion.div>

      </div>
    </section>
  );
}
