'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { useMode } from '@/hooks/useMode';
import { HeartIcon, CameraIcon, LeafIcon } from '../icons';

type GalleryItem = {
  id: number;
  type: 'photo' | 'video';
  creator: string;
  likes: number;
  classicLabel: string;
  healthyLabel: string;
  classicTag: string;
  healthyTag: string;
  duration?: string;
  classicImg: string;
  healthyImg: string;
};

const galleryItems: GalleryItem[] = [
  {
    id: 1,
    type: 'video',
    creator: '@grill.city',
    likes: 842,
    classicLabel: 'Smash Station Slow-Mo',
    healthyLabel: 'Farm to Bowl Process',
    classicTag: '#BabyBurger',
    healthyTag: '#BuddyHealthy',
    duration: '00:26',
    classicImg: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&h=900&fit=crop',
    healthyImg: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&h=900&fit=crop',
  },
  {
    id: 2,
    type: 'photo',
    creator: '@cheese.diary',
    likes: 413,
    classicLabel: 'Golden Crunch Stack',
    healthyLabel: 'Avocado Green Bowl',
    classicTag: '#CheesePull',
    healthyTag: '#CleanEats',
    classicImg: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=600&h=400&fit=crop',
    healthyImg: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&h=400&fit=crop',
  },
  {
    id: 3,
    type: 'video',
    creator: '@midnight.bite',
    likes: 516,
    classicLabel: 'Flame Kissed Patty',
    healthyLabel: 'Grilled Veggie Prep',
    classicTag: '#GrillVibes',
    healthyTag: '#GreenGrill',
    duration: '00:14',
    classicImg: 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=600&h=400&fit=crop',
    healthyImg: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600&h=400&fit=crop',
  },
  {
    id: 4,
    type: 'photo',
    creator: '@smashcrew',
    likes: 352,
    classicLabel: 'Double Melt Portrait',
    healthyLabel: 'Quinoa Power Stack',
    classicTag: '#SmashCrew',
    healthyTag: '#PowerBowl',
    classicImg: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=800&h=400&fit=crop',
    healthyImg: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&h=400&fit=crop',
  },
  {
    id: 5,
    type: 'photo',
    creator: '@bunstackers',
    likes: 448,
    classicLabel: 'Midnight Fries Drop',
    healthyLabel: 'Sweet Potato Wedges',
    classicTag: '#BunStack',
    healthyTag: '#HealthySnack',
    classicImg: 'https://images.unsplash.com/photo-1551782450-a2132b4ba21d?w=600&h=400&fit=crop',
    healthyImg: 'https://images.unsplash.com/photo-1623428187969-5da2dcea5ebf?w=600&h=400&fit=crop',
  },
  {
    id: 6,
    type: 'video',
    creator: '@sweetside.story',
    likes: 467,
    classicLabel: 'Shake Swirl B-Roll',
    healthyLabel: 'Green Smoothie Pour',
    classicTag: '#ShakeTime',
    healthyTag: '#SmoothieDrop',
    duration: '00:19',
    classicImg: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=600&h=400&fit=crop',
    healthyImg: 'https://images.unsplash.com/photo-1638176066666-ffb2f013c7dd?w=600&h=400&fit=crop',
  },
  {
    id: 7,
    type: 'photo',
    creator: '@bun.chronicles',
    likes: 629,
    classicLabel: 'BBQ Sauce Drizzle',
    healthyLabel: 'Acai Bowl Art',
    classicTag: '#SauceGame',
    healthyTag: '#BowlGoals',
    classicImg: 'https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=800&h=900&fit=crop',
    healthyImg: 'https://images.unsplash.com/photo-1590301157890-4810ed352733?w=800&h=900&fit=crop',
  },
  {
    id: 8,
    type: 'video',
    creator: '@late.night.bites',
    likes: 531,
    classicLabel: 'Cheese Pull Close-Up',
    healthyLabel: 'Smoothie Bowl Swirl',
    classicTag: '#CheesePull',
    healthyTag: '#SmoothieBowl',
    duration: '00:11',
    classicImg: 'https://images.unsplash.com/photo-1561758033-d89a9ad46330?w=800&h=400&fit=crop',
    healthyImg: 'https://images.unsplash.com/photo-1502741338009-cac2772e18bc?w=800&h=400&fit=crop',
  },
];

/*
  Each item gets an explicit Tailwind grid-placement class string.
  Desktop (md+) = 4 cols × 4 rows, asymmetric mosaic:
  ┌──────┬──────┬──────┬──────┐
  │  1   │  1   │  2   │  3   │  row 1
  │  1   │  1   │  4   │  4   │  row 2
  ├──────┼──────┼──────┼──────┤
  │  5   │  6   │  7   │  7   │  row 3
  │  8   │  8   │  7   │  7   │  row 4
  └──────┴──────┴──────┴──────┘
*/
const itemLayout: string[] = [
  /* 0 */ 'col-span-2 row-span-2 md:col-span-2 md:row-span-2',           // big
  /* 1 */ 'col-span-1 row-span-1 md:col-span-1 md:row-span-1',           // small
  /* 2 */ 'col-span-1 row-span-1 md:col-span-1 md:row-span-1',           // small
  /* 3 */ 'col-span-2 row-span-1 md:col-span-2 md:row-span-1',           // wide
  /* 4 */ 'col-span-1 row-span-1 md:col-span-1 md:row-span-1',           // small
  /* 5 */ 'col-span-1 row-span-1 md:col-span-1 md:row-span-1',           // small
  /* 6 */ 'col-span-2 row-span-2 md:col-span-2 md:row-span-2',           // big
  /* 7 */ 'col-span-2 row-span-1 md:col-span-2 md:row-span-1',           // wide
];

const smoothEase = [0.16, 1, 0.3, 1] as const;

/*
  Burger-themed decorative border overlay.
  Uses individually positioned fixed-size SVGs to avoid stretching.
  Decorations: accent ring, corner bun dots, top sesame seeds,
  side cheese drip triangles, bottom lettuce wave.
*/
function BurgerBorder({ accent, delay }: { accent: string; delay: number }) {
  return (
    <>
      {/* Accent ring border */}
      <motion.div
        className="absolute inset-0 rounded-2xl pointer-events-none z-20"
        style={{ border: `2.5px solid ${accent}`, opacity: 0.55 }}
        initial={{ opacity: 0, scale: 0.97 }}
        whileInView={{ opacity: 0.55, scale: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ delay: delay + 0.1, duration: 0.8, ease: 'easeOut' }}
      />

      {/* Corner bun dots — 4 fixed-size circles */}
      {[
        { top: 6, left: 6 },
        { top: 6, right: 6 },
        { bottom: 6, left: 6 },
        { bottom: 6, right: 6 },
      ].map((pos, i) => (
        <motion.div
          key={`dot-${i}`}
          className="absolute w-2.5 h-2.5 rounded-full pointer-events-none z-20"
          style={{ ...pos, backgroundColor: accent, opacity: 0.45 }}
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ delay: delay + 0.9 + i * 0.06, type: 'spring', stiffness: 300 }}
        />
      ))}

      {/* Top-center sesame seeds */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 flex gap-3 pointer-events-none z-20">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={`seed-${i}`}
            className="w-[6px] h-[10px] rounded-full"
            style={{ backgroundColor: accent, opacity: 0.4 }}
            initial={{ scale: 0, y: 4 }}
            whileInView={{ scale: 1, y: -3 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ delay: delay + 0.7 + i * 0.1, type: 'spring', stiffness: 300 }}
          />
        ))}
      </div>

      {/* Top bun arch — small fixed SVG */}
      <motion.svg
        className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-[6px] pointer-events-none z-20"
        width="80" height="16" viewBox="0 0 80 16" fill="none" aria-hidden="true"
        initial={{ pathLength: 0, opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ delay: delay + 0.4, duration: 0.4 }}
      >
        <motion.path
          d="M8 14 C8 2, 40 -2, 40 -2 C40 -2, 72 2, 72 14"
          stroke={accent}
          strokeWidth="2"
          strokeOpacity="0.5"
          strokeLinecap="round"
          fill="none"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ delay: delay + 0.4, duration: 0.6, ease: 'easeOut' }}
        />
      </motion.svg>

      {/* Bottom bun curve — small fixed SVG */}
      <motion.svg
        className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-[6px] pointer-events-none z-20"
        width="80" height="16" viewBox="0 0 80 16" fill="none" aria-hidden="true"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ delay: delay + 0.5, duration: 0.4 }}
      >
        <motion.path
          d="M8 2 C8 14, 40 18, 40 18 C40 18, 72 14, 72 2"
          stroke={accent}
          strokeWidth="2"
          strokeOpacity="0.5"
          strokeLinecap="round"
          fill="none"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ delay: delay + 0.5, duration: 0.6, ease: 'easeOut' }}
        />
      </motion.svg>

      {/* Left cheese drips — fixed-size SVGs */}
      <motion.svg
        className="absolute left-0 top-[30%] -translate-x-[5px] pointer-events-none z-20"
        width="12" height="20" viewBox="0 0 12 20" fill="none" aria-hidden="true"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ delay: delay + 0.8, duration: 0.3 }}
      >
        <motion.path
          d="M10 0 L2 10 L10 10" stroke={accent} strokeWidth="1.5" strokeOpacity="0.35"
          strokeLinejoin="round" fill="none"
          initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }}
          viewport={{ once: true, amount: 0.3 }} transition={{ delay: delay + 0.8, duration: 0.3 }}
        />
      </motion.svg>
      <motion.svg
        className="absolute left-0 top-[60%] -translate-x-[5px] pointer-events-none z-20"
        width="12" height="22" viewBox="0 0 12 22" fill="none" aria-hidden="true"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ delay: delay + 0.9, duration: 0.3 }}
      >
        <motion.path
          d="M10 0 L1 12 L10 12" stroke={accent} strokeWidth="1.5" strokeOpacity="0.3"
          strokeLinejoin="round" fill="none"
          initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }}
          viewport={{ once: true, amount: 0.3 }} transition={{ delay: delay + 0.9, duration: 0.3 }}
        />
      </motion.svg>

      {/* Right cheese drips — fixed-size SVGs */}
      <motion.svg
        className="absolute right-0 top-[35%] translate-x-[5px] pointer-events-none z-20"
        width="12" height="20" viewBox="0 0 12 20" fill="none" aria-hidden="true"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ delay: delay + 0.85, duration: 0.3 }}
      >
        <motion.path
          d="M2 0 L10 10 L2 10" stroke={accent} strokeWidth="1.5" strokeOpacity="0.35"
          strokeLinejoin="round" fill="none"
          initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }}
          viewport={{ once: true, amount: 0.3 }} transition={{ delay: delay + 0.85, duration: 0.3 }}
        />
      </motion.svg>
      <motion.svg
        className="absolute right-0 top-[65%] translate-x-[5px] pointer-events-none z-20"
        width="12" height="22" viewBox="0 0 12 22" fill="none" aria-hidden="true"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ delay: delay + 0.95, duration: 0.3 }}
      >
        <motion.path
          d="M2 0 L11 12 L2 12" stroke={accent} strokeWidth="1.5" strokeOpacity="0.3"
          strokeLinejoin="round" fill="none"
          initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }}
          viewport={{ once: true, amount: 0.3 }} transition={{ delay: delay + 0.95, duration: 0.3 }}
        />
      </motion.svg>

      {/* Lettuce wave — spans near top inside the card */}
      <motion.svg
        className="absolute top-3 left-3 right-3 h-[8px] pointer-events-none z-20"
        viewBox="0 0 200 8" fill="none" preserveAspectRatio="none" aria-hidden="true"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ delay: delay + 0.5, duration: 0.4 }}
      >
        <motion.path
          d="M0 4 C12 0, 25 8, 37 4 C50 0, 62 8, 75 4 C87 0, 100 8, 112 4 C125 0, 137 8, 150 4 C162 0, 175 8, 187 4 L200 4"
          stroke="#43A047"
          strokeWidth="1.5"
          strokeOpacity="0.45"
          strokeLinecap="round"
          fill="none"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ delay: delay + 0.5, duration: 0.8, ease: 'easeOut' }}
        />
      </motion.svg>
    </>
  );
}

function GalleryCard({ item, index, isClassic, accent, accentRed }: {
  item: GalleryItem;
  index: number;
  isClassic: boolean;
  accent: string;
  accentRed: string;
}) {
  const label = isClassic ? item.classicLabel : item.healthyLabel;
  const tag = isClassic ? item.classicTag : item.healthyTag;
  const img = isClassic ? item.classicImg : item.healthyImg;

  return (
    <motion.div
      className={`${itemLayout[index]} group relative cursor-pointer rounded-2xl overflow-hidden`}
      initial={{ opacity: 0, y: 30, scale: 0.96 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6, delay: index * 0.08, ease: smoothEase }}
      whileHover={{ y: -4, scale: 1.015 }}
    >
      <Image
        src={img}
        alt={`${label} — Burger Empire Abc City community post by ${item.creator}`}
        fill
        sizes="(max-width: 768px) 50vw, 25vw"
        className="object-cover transition-transform duration-500 group-hover:scale-105"
        loading="lazy"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Top badges */}
      <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
        <motion.span
          className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[0.625rem] font-bold uppercase tracking-wider text-white backdrop-blur-md bg-black/30"
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ delay: 0.3 + index * 0.08, type: 'spring', stiffness: 200 }}
        >
          {item.type === 'video' ? (
            <svg width="10" height="10" viewBox="0 0 12 12" fill="none"><path d="M3 2.2L9.1 6L3 9.8V2.2Z" fill="white" /></svg>
          ) : (
            <CameraIcon size={10} color="white" />
          )}
          {item.type}
        </motion.span>
        <motion.span
          className="rounded-full px-2.5 py-1 text-[0.625rem] font-semibold text-white backdrop-blur-md bg-black/30"
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ delay: 0.35 + index * 0.08, type: 'spring', stiffness: 200 }}
        >
          {item.type === 'video' ? item.duration : `${item.likes} likes`}
        </motion.span>
      </div>

      {/* Video play button */}
      {item.type === 'video' && (
        <motion.div
          className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none"
          initial={{ opacity: 0, scale: 0 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ delay: 0.4 + index * 0.08, type: 'spring', stiffness: 300 }}
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/90 shadow-lg group-hover:scale-110 transition-transform duration-300">
            <svg width="18" height="18" viewBox="0 0 16 16" fill="none">
              <path d="M4 2.5L13 8L4 13.5V2.5Z" fill={accentRed} />
            </svg>
          </div>
        </motion.div>
      )}

      {/* Bottom info */}
      <div className="absolute bottom-0 left-0 right-0 p-4 z-10">
        <motion.span
          className="text-[0.625rem] font-bold uppercase tracking-wider block transition-colors duration-500"
          style={{ color: accent }}
          initial={{ opacity: 0, x: -10 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ delay: 0.4 + index * 0.08, duration: 0.4 }}
        >
          {tag}
        </motion.span>
        <motion.h3
          className="text-sm md:text-base font-bold text-white leading-tight mt-0.5"
          style={{ fontFamily: "var(--font-poppins)" }}
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ delay: 0.45 + index * 0.08, duration: 0.5, ease: smoothEase }}
        >
          {label}
        </motion.h3>
        <motion.div
          className="flex items-center justify-between mt-2 text-[0.6875rem] text-white/70"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ delay: 0.55 + index * 0.08, duration: 0.4 }}
        >
          <span className="font-medium">{item.creator}</span>
          <span className="inline-flex items-center gap-1">
            <HeartIcon size={11} color="white" />
            {item.likes}
          </span>
        </motion.div>
      </div>

      {/* Burger-themed decorative border overlay */}
      <BurgerBorder accent={accent} delay={index * 0.08} />
    </motion.div>
  );
}

export default function SocialWall() {
  const { isClassic } = useMode();

  const accent = isClassic ? '#EB7A29' : '#4AA056';
  const accentRed = isClassic ? '#9A1E29' : '#4AA056';
  const sectionBg = isClassic ? '#FDF3E7' : '#E8F5EC';
  const borderColor = isClassic ? '#F5E6C4' : '#D8EAD8';
  const hashtag = isClassic ? '#BabyBurger' : '#BuddyHealthy';

  return (
    <section className="py-14 px-5 has-pattern overflow-hidden" style={{ backgroundColor: sectionBg }}>
      <div className="max-w-[1400px] mx-auto">
        {/* Header */}
        <div className="flex items-end justify-between mb-8">
          <div>
            <motion.span
              className="text-[0.625rem] font-bold uppercase tracking-widest mb-2 block transition-colors duration-500"
              style={{ color: accent }}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.4 }}
            >
              <span className="inline-flex items-center gap-1.5">
                {isClassic
                  ? <><CameraIcon size={10} color={accent} className="inline-block" /> The Buddy Feed</>
                  : <><LeafIcon size={10} color={accent} className="inline-block" /> The Healthy Feed</>}
              </span>
            </motion.span>
            <motion.h2
              className="text-2xl md:text-[1.75rem] font-black text-gray-900"
              style={{ fontFamily: "var(--font-poppins)" }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ delay: 0.1, duration: 0.5, ease: smoothEase }}
            >
              {isClassic ? 'Real People. Real Cravings.' : 'Your Wholesome Moments, Celebrated.'}
            </motion.h2>
            <motion.p
              className="text-sm text-gray-600 mt-1"
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              {isClassic
                ? 'Drop a tag @BabyBurger — your post could be next up here'
                : 'Show us your plate with #BuddyHealthy and get featured'}
            </motion.p>
          </div>
          <motion.div
            className="hidden md:flex items-center gap-3 text-xs"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <span
              className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 font-semibold transition-colors duration-500"
              style={{ borderColor, color: accent }}
            >
              <CameraIcon size={13} color={accent} /> 4 Photos
            </span>
            <span
              className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 font-semibold transition-colors duration-500"
              style={{ borderColor, color: accent }}
            >
              <svg width="13" height="13" viewBox="0 0 12 12" fill="none"><path d="M3 2.2L9.1 6L3 9.8V2.2Z" fill={accent} /></svg>
              4 Videos
            </span>
          </motion.div>
        </div>

        {/* Full-width asymmetric mosaic: 4 cols, uneven sizes */}
        <div className="grid grid-cols-2 md:grid-cols-4 auto-rows-[140px] md:auto-rows-[180px] gap-3">
          {galleryItems.map((item, i) => (
            <GalleryCard
              key={item.id}
              item={item}
              index={i}
              isClassic={isClassic}
              accent={accent}
              accentRed={accentRed}
            />
          ))}
        </div>

        {/* Footer CTA */}
        <motion.p
          className="mt-10 text-center text-sm text-gray-600"
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          Tag{' '}
          <span className="font-bold transition-colors duration-500" style={{ color: accentRed }}>
            @BabyBurger
          </span>{' '}
          and use{' '}
          <span className="font-bold transition-colors duration-500" style={{ color: accentRed }}>
            {hashtag}
          </span>{' '}
          to get featured.
        </motion.p>
      </div>
    </section>
  );
}
