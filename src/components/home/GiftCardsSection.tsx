'use client';

import { useMode } from '@/hooks/useMode';
import { useConfig } from '@/hooks/useConfig';
import { motion } from 'framer-motion';
import Link from 'next/link';

/* ── Inline gift icon for the section badge ── */
function GiftBadgeIcon({ color }: { color: string }) {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="inline-block">
      <rect x="1.5" y="5.5" width="9" height="5.5" rx="1" stroke={color} strokeWidth="1" />
      <rect x="1" y="3.5" width="10" height="2" rx="0.5" stroke={color} strokeWidth="1" />
      <line x1="6" y1="3.5" x2="6" y2="11" stroke={color} strokeWidth="1" />
      <path d="M6 3.5C6 3.5 4.5 2 3.5 2C2.8 2 2.5 2.5 2.8 2.8C3 3 6 3.5 6 3.5Z" fill={color} opacity={0.5} />
      <path d="M6 3.5C6 3.5 7.5 2 8.5 2C9.2 2 9.5 2.5 9.2 2.8C9 3 6 3.5 6 3.5Z" fill={color} opacity={0.5} />
    </svg>
  );
}

export default function GiftCardsSection() {
  const { isClassic } = useMode();
  const { config } = useConfig();

  if (!config.features.gift_cards_enabled) return null;

  const accent = isClassic ? '#EB7A29' : '#4AA056';
  const accentDark = isClassic ? '#9A1E29' : '#3D8A48';

  const denominations = [
    { label: '\u20B9250', value: 250 },
    { label: '\u20B9500', value: 500 },
    { label: '\u20B91000', value: 1000 },
    { label: 'Custom', value: 0 },
  ];

  return (
    <section
      className="py-14 px-5 transition-colors duration-500"
      style={{ backgroundColor: '#FFFFFF' }}
    >
      <div className="max-w-[1200px] overflow-hidden mx-auto">
        <div className="flex flex-col md:flex-row items-center gap-10 md:gap-14">

          {/* ── Left column (60%) ── */}
          <motion.div
            className="flex-1 md:basis-[60%]"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Section badge pill */}
            <motion.span
              className="inline-flex items-center gap-1.5 text-[0.6875rem] font-bold uppercase tracking-[0.2em] mb-4 px-3 py-1 rounded-full"
              style={{
                backgroundColor: isClassic ? 'rgba(235,122,41,0.08)' : 'rgba(74,160,86,0.08)',
                color: accent,
              }}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ delay: 0.1, duration: 0.4 }}
            >
              <GiftBadgeIcon color={accent} />
              Gift Cards
            </motion.span>

            {/* Headline */}
            <motion.h2
              className="text-2xl md:text-[2rem] font-black text-gray-900 mb-3 leading-tight"
              style={{ fontFamily: "var(--font-poppins)" }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ delay: 0.2, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              {isClassic ? 'Give the Gift of Great Food' : 'Give the Gift of Healthy Eating'}
            </motion.h2>

            {/* Sub-copy */}
            <motion.p
              className="text-sm md:text-[0.9375rem] text-gray-600 mb-6 max-w-md leading-relaxed"
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              Delivered digitally, redeemed instantly. The perfect present for any food lover.
            </motion.p>

            {/* Denomination pills */}
            <motion.div
              className="flex flex-wrap gap-2 mb-8"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ delay: 0.4 }}
            >
              {denominations.map((denom, i) => (
                <motion.span
                  key={denom.label}
                  className="px-5 py-2 rounded-full text-sm font-semibold border cursor-pointer transition-colors duration-200"
                  style={{
                    borderColor: isClassic ? 'rgba(235,122,41,0.3)' : 'rgba(74,160,86,0.3)',
                    color: isClassic ? '#92400E' : '#1E4D32',
                  }}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ delay: 0.45 + i * 0.08, type: 'spring', stiffness: 200 }}
                  whileHover={{
                    backgroundColor: isClassic ? 'rgba(235,122,41,0.12)' : 'rgba(74,160,86,0.12)',
                    borderColor: accent,
                    scale: 1.05,
                  }}
                >
                  {denom.label}
                </motion.span>
              ))}
            </motion.div>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              <Link href="/gift-cards">
                <motion.span
                  className="inline-block px-7 py-3.5 rounded-xl text-sm font-bold text-white transition-all duration-200"
                  style={{ backgroundColor: accentDark }}
                  whileHover={{ scale: 1.04, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                >
                  Send a Gift Card &rarr;
                </motion.span>
              </Link>
            </motion.div>
          </motion.div>

          {/* ── Right column (40%) — Gift card mockup ── */}
          <motion.div
            className="md:basis-[40%] flex items-center justify-center w-full"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ delay: 0.3, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <motion.div
              className="relative w-full max-w-[340px] rounded-2xl p-6 md:p-8 rotate-3 hover:-rotate-1 transition-transform duration-500"
              style={{
                background: isClassic
                  ? 'linear-gradient(135deg, #EB7A29, #9A1E29)'
                  : 'linear-gradient(135deg, #4AA056, #3D8A48)',
                boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
                aspectRatio: '16 / 10',
              }}
              whileHover={{ scale: 1.03 }}
            >
              {/* Decorative circles */}
              <div className="absolute top-4 right-4 w-20 h-20 rounded-full bg-white/10" />
              <div className="absolute -bottom-4 -left-4 w-28 h-28 rounded-full bg-white/5" />

              {/* Logo text */}
              <motion.p
                className="text-lg md:text-xl font-black text-white mb-1 relative z-10"
                style={{ fontFamily: "var(--font-poppins)" }}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ delay: 0.5, duration: 0.4 }}
              >
                Burger Empire
              </motion.p>

              <motion.p
                className="text-[0.625rem] text-white/50 uppercase tracking-[0.15em] mb-6 relative z-10"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ delay: 0.6 }}
              >
                Gift Card
              </motion.p>

              {/* Card number */}
              <motion.p
                className="text-sm md:text-base text-white/70 tracking-[0.2em] mb-4 relative z-10"
                style={{ fontFamily: 'monospace' }}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ delay: 0.65, duration: 0.4 }}
              >
                &bull;&bull;&bull;&bull; &bull;&bull;&bull;&bull; &bull;&bull;&bull;&bull; 1234
              </motion.p>

              {/* Amount */}
              <motion.p
                className="text-3xl md:text-4xl font-black text-white relative z-10"
                style={{ fontFamily: "var(--font-poppins)" }}
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ delay: 0.75, duration: 0.4, type: 'spring', stiffness: 200 }}
              >
                &#x20B9;500
              </motion.p>

              {/* Shimmer effect */}
              <motion.div
                className="absolute inset-0 rounded-2xl pointer-events-none"
                style={{
                  background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.12) 50%, transparent 60%)',
                }}
                animate={{ x: ['-100%', '200%'] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', repeatDelay: 2 }}
              />
            </motion.div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
