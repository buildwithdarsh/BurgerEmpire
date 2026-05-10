'use client';

import { useMode } from '@/hooks/useMode';
import { useConfig } from '@/hooks/useConfig';
import { motion } from 'framer-motion';
import Link from 'next/link';

/* ── Animated graduation cap SVG ── */
function GradCapIllustration({ color }: { color: string }) {
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" aria-hidden="true">
      {/* Cap base — diamond shape */}
      <motion.path
        d="M20 8L38 18L20 28L2 18L20 8Z"
        fill={color} opacity={0.2}
        initial={{ scale: 0.5, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 0.2 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      />
      <motion.path
        d="M20 8L38 18L20 28L2 18L20 8Z"
        stroke={color} strokeWidth="2" strokeLinejoin="round" fill="none"
        initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }}
        viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.7, ease: 'easeOut' }}
      />
      {/* Tassel string */}
      <motion.path
        d="M38 18V26" stroke={color} strokeWidth="2" strokeLinecap="round"
        initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }}
        viewport={{ once: true, amount: 0.3 }} transition={{ delay: 0.4, duration: 0.3 }}
      />
      {/* Tassel */}
      <motion.circle cx="38" cy="28" r="2" fill={color}
        initial={{ scale: 0 }} whileInView={{ scale: 1 }}
        viewport={{ once: true, amount: 0.3 }} transition={{ delay: 0.6, type: 'spring', stiffness: 300 }}
      />
      {/* Side drape lines */}
      <motion.path
        d="M10 22V30C10 32 14 34 20 34C26 34 30 32 30 30V22"
        stroke={color} strokeWidth="1.5" strokeLinecap="round" fill="none" opacity={0.4}
        initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }}
        viewport={{ once: true, amount: 0.3 }} transition={{ delay: 0.5, duration: 0.6 }}
      />
      {/* Sparkle */}
      <motion.g
        initial={{ scale: 0, opacity: 0 }}
        whileInView={{ scale: [0, 1.4, 1], opacity: [0, 0.7, 0.5] }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ delay: 0.8, duration: 0.4 }}
      >
        <circle cx="6" cy="10" r="1" fill={color} />
        <line x1="3" y1="10" x2="9" y2="10" stroke={color} strokeWidth="0.8" />
        <line x1="6" y1="7" x2="6" y2="13" stroke={color} strokeWidth="0.8" />
      </motion.g>
    </svg>
  );
}

const institutions = ['IIT', 'NIT', 'DU', 'DTU', '+ more'];

export default function StudentPassStrip() {
  const { isClassic } = useMode();
  const { config } = useConfig();

  if (!config.features.student_pass_enabled) return null;

  const accentColor = isClassic ? '#EB7A29' : '#4AA056';
  const ctaColor = isClassic ? '#92400E' : '#3D8A48';

  return (
    <section
      className="py-8 md:py-10 px-5 transition-colors duration-500 overflow-hidden"
      style={{
        backgroundColor: isClassic ? 'rgba(235,122,41,0.1)' : 'rgba(74,160,86,0.1)',
      }}
    >
      <motion.div
        className="max-w-[1200px] mx-auto flex flex-col md:flex-row items-center gap-5 md:gap-8"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Left: Icon */}
        <motion.div
          className="flex-shrink-0 w-[64px] h-[64px] rounded-2xl flex items-center justify-center transition-colors duration-500"
          style={{ backgroundColor: isClassic ? 'rgba(235,122,41,0.15)' : 'rgba(74,160,86,0.15)' }}
          initial={{ scale: 0.8, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
          whileHover={{ scale: 1.08, rotate: 3 }}
        >
          <GradCapIllustration color={accentColor} />
        </motion.div>

        {/* Center: Content */}
        <div className="flex-1 text-center md:text-left">
          <motion.h2
            className="text-lg font-bold text-gray-900 leading-snug mb-1"
            style={{ fontFamily: "var(--font-poppins)" }}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ delay: 0.15, duration: 0.4 }}
          >
            Students eat smarter — show your ID, save every order
          </motion.h2>

          <motion.p
            className="text-sm text-gray-600 mb-3"
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ delay: 0.25, duration: 0.4 }}
          >
            Auto-applied at checkout. No code needed.
          </motion.p>

          {/* Institution pills */}
          <motion.div
            className="flex flex-wrap justify-center md:justify-start gap-2"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ delay: 0.35 }}
          >
            {institutions.map((inst, i) => (
              <motion.span
                key={inst}
                className="text-[0.6875rem] font-semibold px-3 py-1 rounded-full transition-colors duration-500"
                style={{
                  backgroundColor: isClassic ? 'rgba(235,122,41,0.12)' : 'rgba(74,160,86,0.12)',
                  color: isClassic ? '#92400E' : '#1E4D32',
                }}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ delay: 0.4 + i * 0.06, type: 'spring', stiffness: 250 }}
              >
                {inst}
              </motion.span>
            ))}
          </motion.div>
        </div>

        {/* Right: CTA */}
        <motion.div
          className="flex-shrink-0"
          initial={{ opacity: 0, x: 15 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <Link href="/student" aria-label="Get your student pass for exclusive discounts">
            <motion.span
              className="inline-block px-6 py-3 rounded-xl text-sm font-bold text-white transition-all duration-200"
              style={{ backgroundColor: ctaColor }}
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.97 }}
            >
              Get Your Student Pass &rarr;
            </motion.span>
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
}
