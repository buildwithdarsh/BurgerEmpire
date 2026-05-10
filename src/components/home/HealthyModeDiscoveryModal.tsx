'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMode } from '@/hooks/useMode';
import { BurgerIcon, LeafIcon } from '../icons';

const STORAGE_KEY = 'bb-healthy-discovered';

/* ─────────────────────────────────────────
   Sparkle — a 4-pointed twinkling star
   ───────────────────────────────────────── */
function Sparkle({
  cx,
  cy,
  delay,
  size = 4,
  color = '#FFD700',
}: {
  cx: number;
  cy: number;
  delay: number;
  size?: number;
  color?: string;
}) {
  return (
    <motion.g
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: [0, 1, 0], scale: [0, 1, 0] }}
      transition={{ duration: 1.6, delay, repeat: Infinity, repeatDelay: 2.5 }}
    >
      <line
        x1={cx - size}
        y1={cy}
        x2={cx + size}
        y2={cy}
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <line
        x1={cx}
        y1={cy - size}
        x2={cx}
        y2={cy + size}
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </motion.g>
  );
}

/* ─────────────────────────────────────────
   Steam wisp — wavy line rising from burger
   ───────────────────────────────────────── */
function SteamWisp({ x, delay }: { x: number; delay: number }) {
  return (
    <motion.path
      d={`M${x},-40 Q${x - 4},-48 ${x + 2},-55 Q${x - 2},-62 ${x},-68`}
      fill="none"
      stroke="#C06820"
      strokeWidth="1.2"
      strokeLinecap="round"
      initial={{ pathLength: 0, opacity: 0 }}
      animate={{ pathLength: [0, 1], opacity: [0, 0.25, 0] }}
      transition={{
        duration: 2.5,
        repeat: Infinity,
        delay,
        ease: 'easeOut',
      }}
    />
  );
}

/* ─────────────────────────────────────────
   Discovery Illustration — Burger ➜ Salad
   ───────────────────────────────────────── */
function DiscoveryIllustration() {
  return (
    <svg
      viewBox="0 0 360 200"
      className="w-full h-auto"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="hm-bun-t" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#EDAA45" />
          <stop offset="100%" stopColor="#C06820" />
        </linearGradient>
        <linearGradient id="hm-bun-b" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#C06820" />
          <stop offset="100%" stopColor="#B87215" />
        </linearGradient>
        <linearGradient id="hm-bowl-g" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#F5F5F5" />
          <stop offset="100%" stopColor="#E0E0E0" />
        </linearGradient>
        <linearGradient id="hm-bg-lr" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#FFF8F0" />
          <stop offset="42%" stopColor="#FFFFFF" />
          <stop offset="58%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#F0F9F2" />
        </linearGradient>
        <filter id="hm-shadow">
          <feDropShadow
            dx="0"
            dy="3"
            stdDeviation="4"
            floodOpacity="0.12"
          />
        </filter>
      </defs>

      {/* Background */}
      <rect width="360" height="200" rx="16" fill="url(#hm-bg-lr)" />

      {/* ── Burger (left side) ── */}
      <motion.g
        filter="url(#hm-shadow)"
        initial={{ x: -40, opacity: 0, rotate: -8 }}
        animate={{ x: 0, opacity: 1, rotate: 0 }}
        transition={{
          type: 'spring',
          stiffness: 180,
          damping: 18,
          delay: 0.25,
        }}
      >
        <motion.g
          animate={{ y: [0, -5, 0] }}
          transition={{
            duration: 3.2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          <g transform="translate(90, 105)">
            {/* Steam */}
            <SteamWisp x={-8} delay={0.2} />
            <SteamWisp x={4} delay={0.6} />
            <SteamWisp x={14} delay={1.0} />

            {/* Top bun */}
            <path
              d="M-36,-5 C-36,-28 -22,-36 0,-36 C22,-36 36,-28 36,-5 Z"
              fill="url(#hm-bun-t)"
            />
            {/* Sesame seeds */}
            <ellipse
              cx="-14"
              cy="-22"
              rx="3.5"
              ry="1.8"
              fill="#F5D6A0"
              transform="rotate(-12 -14 -22)"
            />
            <ellipse
              cx="6"
              cy="-27"
              rx="3"
              ry="1.6"
              fill="#F5D6A0"
              transform="rotate(8 6 -27)"
            />
            <ellipse
              cx="18"
              cy="-18"
              rx="3"
              ry="1.6"
              fill="#F5D6A0"
              transform="rotate(18 18 -18)"
            />
            <ellipse
              cx="-4"
              cy="-31"
              rx="2.5"
              ry="1.4"
              fill="#F5D6A0"
              transform="rotate(-5 -4 -31)"
            />

            {/* Lettuce */}
            <path
              d="M-38,-2 Q-28,-9 -16,0 Q-6,-8 6,-1 Q16,-7 26,1 Q34,-4 38,-1"
              fill="none"
              stroke="#66BB6A"
              strokeWidth="4"
              strokeLinecap="round"
            />
            {/* Cheese */}
            <polygon
              points="-38,2 38,2 40,10 -36,10 -44,16 -40,8"
              fill="#FFD54F"
            />
            {/* Patty */}
            <rect
              x="-36"
              y="12"
              width="72"
              height="14"
              rx="4"
              fill="#5D4037"
            />
            <rect
              x="-34"
              y="15"
              width="68"
              height="3"
              rx="1.5"
              fill="#6D4C41"
              opacity="0.4"
            />
            {/* Bottom bun */}
            <path
              d="M-36,28 L36,28 C36,39 22,43 0,43 C-22,43 -36,39 -36,28 Z"
              fill="url(#hm-bun-b)"
            />
          </g>
        </motion.g>
      </motion.g>

      {/* ── Curved arrow path ── */}
      <motion.path
        d="M138,95 C155,72 205,72 222,95"
        fill="none"
        stroke="#BDBDBD"
        strokeWidth="2"
        strokeDasharray="5 4"
        strokeLinecap="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 1, delay: 0.7, ease: 'easeInOut' }}
      />
      <motion.polygon
        points="222,95 215,89 216,101"
        fill="#9E9E9E"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.5, type: 'spring', stiffness: 400 }}
      />
      {/* Glow dot at arrow tip */}
      <motion.circle
        cx="222"
        cy="95"
        r="3"
        fill="#FFD700"
        initial={{ scale: 0 }}
        animate={{
          scale: [0, 1.5, 1],
          opacity: [0, 0.8, 0.4],
        }}
        transition={{ delay: 1.6, duration: 0.6 }}
      />

      {/* ── Salad bowl (right side) ── */}
      <motion.g
        filter="url(#hm-shadow)"
        initial={{ x: 40, opacity: 0, rotate: 8 }}
        animate={{ x: 0, opacity: 1, rotate: 0 }}
        transition={{
          type: 'spring',
          stiffness: 180,
          damping: 18,
          delay: 0.45,
        }}
      >
        <motion.g
          animate={{ y: [0, -4, 0] }}
          transition={{
            duration: 3.6,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 0.4,
          }}
        >
          <g transform="translate(270, 100)">
            {/* Bowl */}
            <ellipse cx="0" cy="20" rx="44" ry="14" fill="url(#hm-bowl-g)" />
            <path
              d="M-44,17 Q-40,42 0,44 Q40,42 44,17"
              fill="#E8E8E8"
            />
            <path
              d="M-44,17 Q-40,42 0,44 Q40,42 44,17"
              fill="none"
              stroke="#D5D5D5"
              strokeWidth="0.8"
            />

            {/* Leaves — grow in with spring */}
            <motion.path
              d="M-24,-6 Q-16,-28 -4,-4"
              fill="#66BB6A"
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{ delay: 0.8, type: 'spring' }}
              style={{ transformOrigin: '-14px 0px' }}
            />
            <motion.path
              d="M-10,-10 Q0,-34 12,-6"
              fill="#81C784"
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{ delay: 0.95, type: 'spring' }}
              style={{ transformOrigin: '1px -2px' }}
            />
            <motion.path
              d="M4,-4 Q14,-26 24,-1"
              fill="#4CAF50"
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{ delay: 1.1, type: 'spring' }}
              style={{ transformOrigin: '14px 0px' }}
            />
            <path
              d="M-16,-2 Q-6,-18 6,-1"
              fill="#A5D6A7"
              opacity="0.6"
            />

            {/* Tomato */}
            <motion.g
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                delay: 1.2,
                type: 'spring',
                stiffness: 400,
              }}
            >
              <circle cx="-18" cy="3" r="7.5" fill="#EF5350" />
              <circle
                cx="-18"
                cy="3"
                r="7.5"
                fill="none"
                stroke="#E53935"
                strokeWidth="0.5"
              />
              <path d="M-19,-4 Q-17,-7 -15,-4" fill="#66BB6A" />
            </motion.g>

            {/* Avocado */}
            <motion.g
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                delay: 1.3,
                type: 'spring',
                stiffness: 400,
              }}
            >
              <ellipse cx="17" cy="7" rx="10" ry="6.5" fill="#8BC34A" />
              <ellipse cx="17" cy="7" rx="5" ry="3.2" fill="#689F38" />
            </motion.g>

            {/* Cucumber slice */}
            <motion.g
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                delay: 1.4,
                type: 'spring',
                stiffness: 400,
              }}
            >
              <ellipse
                cx="0"
                cy="12"
                rx="6"
                ry="4"
                fill="#81C784"
                stroke="#66BB6A"
                strokeWidth="0.5"
              />
              <circle
                cx="0"
                cy="12"
                r="2.2"
                fill="#A5D6A7"
                opacity="0.5"
              />
            </motion.g>
          </g>
        </motion.g>
      </motion.g>

      {/* ── Sparkles ── */}
      <Sparkle cx={48} cy={42} delay={1.0} size={3.5} color="#EB7A29" />
      <Sparkle cx={128} cy={58} delay={1.5} size={4} />
      <Sparkle cx={180} cy={48} delay={2.0} size={5} />
      <Sparkle cx={232} cy={58} delay={0.8} size={3.5} />
      <Sparkle cx={312} cy={44} delay={1.3} size={4} color="#4AA056" />
      <Sparkle cx={60} cy={158} delay={2.2} size={3} color="#EB7A29" />
      <Sparkle cx={300} cy={158} delay={1.7} size={3} color="#4AA056" />
    </svg>
  );
}

/* ─────────────────────────────────────────
   Enhanced Mode Toggle for the modal
   ───────────────────────────────────────── */
function ModalModeToggle({ onToggle }: { onToggle: () => void }) {
  const { isClassic, isTransitioning } = useMode();

  return (
    <button
      onClick={() => !isTransitioning && onToggle()}
      disabled={isTransitioning}
      className="group relative flex items-center w-full max-w-[280px] h-[50px] rounded-full p-[3px] cursor-pointer focus:outline-none mx-auto transition-shadow duration-300 hover:shadow-lg"
      style={{
        backgroundColor: '#F3F4F6',
        boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.08)',
      }}
      aria-label={`Switch to ${isClassic ? 'Healthy' : 'Classic'} mode`}
    >
      {/* Classic label */}
      <span
        className="flex-1 flex items-center justify-center gap-1.5 z-10 text-sm font-bold transition-colors duration-400"
        style={{ color: isClassic ? '#FFFFFF' : '#6B7280' }}
      >
        <BurgerIcon size={14} color={isClassic ? '#FFFFFF' : '#9CA3AF'} />
        Classic
      </span>

      {/* Healthy label */}
      <span
        className="flex-1 flex items-center justify-center gap-1.5 z-10 text-sm font-bold transition-colors duration-400"
        style={{ color: isClassic ? '#6B7280' : '#FFFFFF' }}
      >
        <LeafIcon size={14} color={isClassic ? '#9CA3AF' : '#FFFFFF'} />
        Healthy
      </span>

      {/* Sliding pill */}
      <div
        className="absolute top-[3px] h-[calc(100%-6px)] w-[calc(50%-3px)] rounded-full transition-all duration-500 shadow-md"
        style={{
          left: isClassic ? '3px' : 'calc(50%)',
          backgroundColor: isClassic ? '#EB7A29' : '#4AA056',
          transitionTimingFunction:
            'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        }}
      />
    </button>
  );
}

/* ─────────────────────────────────────────
   Healthy Mode Discovery Modal
   ───────────────────────────────────────── */
export default function HealthyModeDiscoveryModal() {
  const { toggleMode } = useMode();
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (localStorage.getItem(STORAGE_KEY)) return;

    // If user already chose healthy mode before, they know about it
    const savedMode = localStorage.getItem('burger-empire-mode');
    if (savedMode === 'healthy') return;

    let observer: IntersectionObserver | null = null;

    // Small delay so the featured-menu element is definitely in the DOM
    const timer = setTimeout(() => {
      const target = document.getElementById('featured-menu');
      if (!target) return;

      observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setTimeout(() => setShow(true), 500);
            observer?.disconnect();
          }
        },
        { threshold: 0.15 },
      );

      observer.observe(target);
    }, 100);

    return () => {
      clearTimeout(timer);
      observer?.disconnect();
    };
  }, []);

  const dismiss = useCallback(() => {
    setShow(false);
    localStorage.setItem(STORAGE_KEY, '1');
  }, []);

  const handleToggle = useCallback(() => {
    toggleMode();
    setTimeout(dismiss, 1000);
  }, [toggleMode, dismiss]);

  // Close on Escape key
  useEffect(() => {
    if (!show) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') dismiss();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [show, dismiss]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
          onClick={dismiss}
          role="dialog"
          aria-modal="true"
          aria-label="Discover Healthy Mode"
        >
          <motion.div
            initial={{ scale: 0.88, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.92, opacity: 0, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 24 }}
            className="relative bg-white rounded-3xl shadow-2xl max-w-[400px] w-full overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={dismiss}
              className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors z-10 cursor-pointer"
              aria-label="Close"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
              >
                <path
                  d="M1 1L13 13M13 1L1 13"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </button>

            {/* SVG Illustration */}
            <div className="px-4 pt-5 pb-1">
              <DiscoveryIllustration />
            </div>

            {/* Content */}
            <div className="px-6 pb-6 text-center">
              <motion.h2
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
                className="text-xl font-black text-gray-900 mb-1.5"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                Discover Healthy Mode
              </motion.h2>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-sm text-gray-500 mb-5 leading-relaxed"
              >
                Same crave-worthy taste, just cleaner ingredients.
                <br />
                Flip the switch — you can always switch back!
              </motion.p>

              {/* Toggle */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: 0.65,
                  type: 'spring',
                  stiffness: 200,
                }}
              >
                <ModalModeToggle onToggle={handleToggle} />
              </motion.div>

              {/* Dismiss */}
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.85 }}
                onClick={dismiss}
                className="mt-4 text-xs text-gray-400 hover:text-gray-600 hover:underline transition-colors cursor-pointer"
              >
                Maybe later
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
