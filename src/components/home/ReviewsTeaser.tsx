'use client';

import { useMode } from '@/hooks/useMode';
import { useConfig } from '@/hooks/useConfig';
import { motion } from 'framer-motion';
import Link from 'next/link';

const smoothEase = [0.16, 1, 0.3, 1] as const;

type Review = {
  id: number;
  name: string;
  date: string;
  text: string;
  stars: number;
};

const reviews: Review[] = [
  {
    id: 1,
    name: 'User C.',
    date: '2 days ago',
    text: 'The smash burger is insane. Crispy edges, juicy center — nothing else compares in Abc City.',
    stars: 5,
  },
  {
    id: 2,
    name: 'User A.',
    date: '1 week ago',
    text: 'Love the healthy mode! Finally a place that takes clean eating seriously without boring food.',
    stars: 5,
  },
  {
    id: 3,
    name: 'User B.',
    date: '3 days ago',
    text: 'Ordered for a party — 20 burgers delivered hot and on time. Absolutely crushed it.',
    stars: 5,
  },
];

function StarIcon({ color }: { color: string }) {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path
        d="M7 1.5L8.76 5.06L12.7 5.64L9.85 8.42L10.52 12.34L7 10.49L3.48 12.34L4.15 8.42L1.3 5.64L5.24 5.06L7 1.5Z"
        fill={color}
      />
    </svg>
  );
}

export default function ReviewsTeaser() {
  const { isClassic } = useMode();
  const { config } = useConfig();

  if (!config.features.reviews_enabled) return null;

  const accent = isClassic ? '#EB7A29' : '#4AA056';

  return (
    <section
      className="py-14 px-5 transition-colors duration-500"
      style={{ backgroundColor: '#FFFFFF' }}
    >
      <div className="max-w-[1200px] mx-auto">
        {/* Header */}
        <div className="flex items-end justify-between mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, ease: smoothEase }}
          >
            <h2
              className="text-2xl md:text-[1.75rem] font-black text-gray-900"
              style={{ fontFamily: "var(--font-poppins)" }}
            >
              {isClassic ? 'What Our Fans Are Saying' : 'Healthy Reviews From Real People'}
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              {isClassic
                ? 'Straight from the people who keep coming back'
                : 'Real feedback from our health-conscious community'}
            </p>
          </motion.div>
          <Link
            href="/menu"
            className="hidden md:inline-flex items-center gap-2 text-sm font-semibold group"
            style={{ color: accent }}
          >
            See all reviews
            <motion.span
              className="inline-block"
              animate={{ x: [0, 4, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            >
              →
            </motion.span>
          </Link>
        </div>

        {/* Horizontally scrollable review cards */}
        <div className="flex gap-5 overflow-x-auto pb-4 snap-x snap-mandatory" style={{ scrollbarWidth: 'none' }}>
          {reviews.map((review, i) => (
            <motion.div
              key={review.id}
              className="bg-white rounded-2xl p-6 min-w-[300px] flex-shrink-0 snap-start"
              style={{ boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }}
              initial={{ opacity: 0, y: 24, scale: 0.96 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, delay: i * 0.1, ease: smoothEase }}
            >
              {/* Star rating */}
              <div className="flex gap-0.5 mb-3">
                {Array.from({ length: review.stars }).map((_, si) => (
                  <StarIcon key={si} color={accent} />
                ))}
              </div>

              {/* Review text */}
              <p className="text-sm text-gray-700 leading-relaxed line-clamp-2 mb-4">
                &ldquo;{review.text}&rdquo;
              </p>

              {/* Reviewer info */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-gray-900">{review.name}</p>
                  <p className="text-xs text-gray-400">{review.date}</p>
                </div>
                {/* Verified badge */}
                <span
                  className="inline-flex items-center gap-1 text-[0.625rem] font-semibold px-2.5 py-1 rounded-full"
                  style={{
                    backgroundColor: isClassic ? 'rgba(74,160,86,0.08)' : 'rgba(74,160,86,0.08)',
                    color: '#4AA056',
                  }}
                >
                  {/* Checkmark inline SVG */}
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                    <path
                      d="M2 5.2L4 7.2L8 3"
                      stroke="#4AA056"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  Verified
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Placeholder label */}
        <p className="text-xs text-gray-500 text-center mt-4">Reviews coming soon</p>

        {/* Mobile CTA */}
        <div className="mt-6 text-center md:hidden">
          <Link href="/menu" className="text-sm font-semibold" style={{ color: accent }}>
            See all reviews →
          </Link>
        </div>
      </div>
    </section>
  );
}
