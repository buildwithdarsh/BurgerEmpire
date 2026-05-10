'use client';

import { useMode } from '@/hooks/useMode';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import {
  PencilIcon,
  StarIcon,
  ClockIcon,
  ArrowRightIcon,
  BurgerIcon,
  LeafIcon,
  SparkleIcon,
} from '@/components/icons';
import WaveDivider from '@/components/WaveDivider';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';

/* ────────────────────────────────────────────────── */
/*  Types                                             */
/* ────────────────────────────────────────────────── */

type SerializedPost = {
  id: string;
  slug: string;
  title: string;
  h1: string | null;
  excerpt: string | null;
  body: string;
  featuredImage: string | null;
  ogImage: string | null;
  author: string | null;
  category: string | null;
  tags: string | string[];
  keywords: string | string[];
  status: string;
  viewCount?: number;
  datePublished: string | null;
  dateModified: string | null;
  createdAt: string;
  updatedAt: string;
  _count?: { media: number; reviews: number };
};

/* ────────────────────────────────────────────────── */
/*  Helpers                                           */
/* ────────────────────────────────────────────────── */

function AnimatedSection({
  children,
  delay = 0,
  className = '',
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const { ref, isVisible } = useScrollAnimation();
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
        transition: `opacity 600ms ${delay}ms cubic-bezier(0.16, 1, 0.3, 1), transform 600ms ${delay}ms cubic-bezier(0.16, 1, 0.3, 1)`,
      }}
    >
      {children}
    </div>
  );
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

function parseTags(tagsStr: string | string[]): string[] {
  if (Array.isArray(tagsStr)) return tagsStr;
  try {
    const parsed = JSON.parse(tagsStr);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

/* ────────────────────────────────────────────────── */
/*  SVG Illustrations                                 */
/* ────────────────────────────────────────────────── */

function ClassicHeroIllustration() {
  return (
    <motion.svg
      viewBox="0 0 200 200"
      className="w-40 h-40 lg:w-48 lg:h-48 opacity-20"
      animate={{ y: [0, -10, 0] }}
      transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
    >
      {/* Open book shape */}
      <path
        d="M30 140 L30 60 Q100 40 100 60 L100 140 Q100 120 30 140Z"
        fill="white"
        opacity="0.6"
      />
      <path
        d="M170 140 L170 60 Q100 40 100 60 L100 140 Q100 120 170 140Z"
        fill="white"
        opacity="0.5"
      />
      {/* Page lines */}
      <line x1="45" y1="80" x2="90" y2="75" stroke="white" strokeWidth="1.5" opacity="0.3" />
      <line x1="45" y1="95" x2="85" y2="90" stroke="white" strokeWidth="1.5" opacity="0.3" />
      <line x1="45" y1="110" x2="88" y2="106" stroke="white" strokeWidth="1.5" opacity="0.3" />
      <line x1="110" y1="75" x2="155" y2="80" stroke="white" strokeWidth="1.5" opacity="0.3" />
      <line x1="110" y1="90" x2="150" y2="95" stroke="white" strokeWidth="1.5" opacity="0.3" />
      {/* Mini burger icon on right page */}
      <circle cx="130" cy="115" r="12" fill="white" opacity="0.4" />
      <rect x="122" y="113" width="16" height="4" rx="2" fill="white" opacity="0.6" />
    </motion.svg>
  );
}

function HealthyHeroIllustration() {
  return (
    <motion.svg
      viewBox="0 0 200 200"
      className="w-40 h-40 lg:w-48 lg:h-48 opacity-20"
      animate={{ y: [0, -10, 0] }}
      transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
    >
      {/* Journal shape */}
      <rect x="45" y="40" width="110" height="130" rx="8" fill="white" opacity="0.5" />
      <rect x="55" y="40" width="100" height="130" rx="6" fill="white" opacity="0.35" />
      {/* Spine */}
      <line x1="55" y1="40" x2="55" y2="170" stroke="white" strokeWidth="2" opacity="0.4" />
      {/* Lines */}
      <line x1="70" y1="70" x2="135" y2="70" stroke="white" strokeWidth="1.5" opacity="0.25" />
      <line x1="70" y1="85" x2="125" y2="85" stroke="white" strokeWidth="1.5" opacity="0.25" />
      <line x1="70" y1="100" x2="130" y2="100" stroke="white" strokeWidth="1.5" opacity="0.25" />
      {/* Leaf icon */}
      <path
        d="M115 125 C105 120 100 130 95 140 C100 135 108 132 115 125Z"
        fill="white"
        opacity="0.5"
      />
      <path
        d="M95 125 C105 120 112 128 118 138 C113 133 105 130 95 125Z"
        fill="white"
        opacity="0.35"
      />
      <line x1="105" y1="128" x2="102" y2="142" stroke="white" strokeWidth="1" opacity="0.3" />
    </motion.svg>
  );
}

function SectionDividerDecoration({ brand, isClassic }: { brand: string; isClassic: boolean }) {
  return (
    <div className="flex items-center justify-center gap-4 py-8">
      <motion.div
        className="h-px flex-1 max-w-[100px]"
        style={{ backgroundColor: `${brand}30` }}
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      />
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        whileInView={{ scale: 1, rotate: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.3, type: 'spring' }}
      >
        {isClassic ? (
          <BurgerIcon size={24} color={`${brand}60`} />
        ) : (
          <LeafIcon size={24} color={`${brand}60`} />
        )}
      </motion.div>
      <motion.div
        className="h-px flex-1 max-w-[100px]"
        style={{ backgroundColor: `${brand}30` }}
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      />
    </div>
  );
}

/* ────────────────────────────────────────────────── */
/*  Sub-components                                    */
/* ────────────────────────────────────────────────── */

function CategoryPill({
  category,
  brand,
  variant = 'default',
}: {
  category: string | null;
  brand: string;
  variant?: 'default' | 'overlay';
}) {
  if (!category) return null;

  if (variant === 'overlay') {
    return (
      <span
        className="inline-block px-3 py-1 text-[0.6875rem] font-bold rounded-full capitalize backdrop-blur-sm"
        style={{
          backgroundColor: 'rgba(255,255,255,0.9)',
          color: brand,
        }}
      >
        {category}
      </span>
    );
  }

  return (
    <span
      className="inline-block px-3 py-1 text-xs font-semibold rounded-full capitalize"
      style={{ backgroundColor: `${brand}15`, color: brand }}
    >
      {category}
    </span>
  );
}

function ImagePlaceholder({
  brand,
  isClassic,
  size = 'md',
}: {
  brand: string;
  isClassic: boolean;
  size?: 'sm' | 'md' | 'lg';
}) {
  const iconSize = size === 'lg' ? 72 : size === 'md' ? 48 : 36;
  return (
    <div
      className="w-full h-full flex items-center justify-center relative overflow-hidden"
      style={{
        background: `linear-gradient(135deg, ${brand}18, ${brand}35)`,
      }}
    >
      <motion.div
        animate={{ y: [0, -8, 0], rotate: [0, 3, -3, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        className="opacity-30"
      >
        {isClassic ? (
          <BurgerIcon size={iconSize} color={brand} />
        ) : (
          <LeafIcon size={iconSize} color={brand} />
        )}
      </motion.div>
      {/* Subtle dot pattern */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `radial-gradient(${brand} 1px, transparent 1px)`,
          backgroundSize: '20px 20px',
        }}
      />
    </div>
  );
}

/* ────────────────────────────────────────────────── */
/*  Featured Post Card                                */
/* ────────────────────────────────────────────────── */

function FeaturedPostCard({
  post,
  accent: _accent,
  brand,
  isClassic,
}: {
  post: SerializedPost;
  accent: string;
  brand: string;
  isClassic: boolean;
}) {
  const tags = parseTags(post.tags).slice(0, 3);

  return (
    <AnimatedSection>
      <Link href={`/blog/${post.slug}`} className="block group">
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow duration-500">
          <div className="grid grid-cols-1 md:grid-cols-5">
            {/* Image — 60% */}
            <div className="relative h-64 md:h-auto md:min-h-[400px] md:col-span-3 overflow-hidden">
              {post.featuredImage ? (
                <>
                  <Image
                    src={post.featuredImage}
                    alt={post.h1 || post.title || ""}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                    sizes="(max-width: 768px) 100vw, 60vw"
                    priority
                  />
                  {/* Gradient overlay at bottom */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                </>
              ) : (
                <ImagePlaceholder brand={brand} isClassic={isClassic} size="lg" />
              )}

              {/* FEATURED badge */}
              <div className="absolute top-4 left-4 z-10">
                <motion.div
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full backdrop-blur-md"
                  style={{ backgroundColor: 'rgba(255,255,255,0.92)' }}
                >
                  <SparkleIcon size={12} color={brand} />
                  <span
                    className="text-[0.6875rem] font-extrabold uppercase tracking-wider"
                    style={{ color: brand }}
                  >
                    Featured
                  </span>
                </motion.div>
              </div>
            </div>

            {/* Content — 40% */}
            <div className="md:col-span-2 p-6 md:p-8 flex flex-col justify-center relative">
              {/* Decorative top accent line */}
              <div
                className="hidden md:block absolute top-8 left-8 h-[3px] w-10 rounded-full"
                style={{ backgroundColor: brand }}
              />

              <div className="md:mt-6">
                <CategoryPill category={post.category} brand={brand} />

                <h2
                  className="text-2xl md:text-3xl font-black text-gray-900 mt-3 mb-3 leading-tight group-hover:text-gray-700 transition-colors duration-300"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  {post.h1 || post.title}
                </h2>

                {post.excerpt && (
                  <p className="text-gray-500 text-sm leading-relaxed mb-5 line-clamp-3">
                    {post.excerpt}
                  </p>
                )}

                <hr className="border-gray-100 mb-4" />

                {/* Meta row */}
                <div className="flex items-center gap-3 mb-4">
                  {/* Author avatar */}
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                    style={{ backgroundColor: brand }}
                  >
                    {getInitials(post.author ?? "")}
                  </div>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-400">
                    <span className="font-medium text-gray-600">{post.author ?? ""}</span>
                    {post.datePublished && <span>{formatDate(post.datePublished)}</span>}
                    {(post.viewCount ?? 0) > 0 && (
                      <span className="flex items-center gap-1">
                        <ClockIcon size={11} color="#9CA3AF" />
                        {(post.viewCount ?? 0).toLocaleString('en-IN')} views
                      </span>
                    )}
                    {(post._count?.reviews ?? 0) > 0 && (
                      <span className="flex items-center gap-1">
                        <StarIcon size={11} color="#9CA3AF" />
                        {(post._count?.reviews ?? 0)}{' '}
                        {(post._count?.reviews ?? 0) === 1 ? 'review' : 'reviews'}
                      </span>
                    )}
                  </div>
                </div>

                {/* Tags */}
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-5">
                    {tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2.5 py-0.5 text-[0.6875rem] rounded-md bg-gray-50 text-gray-500 border border-gray-100"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* CTA button */}
                <motion.span
                  className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-white rounded-xl group-hover:gap-3 transition-all duration-300"
                  style={{ backgroundColor: brand }}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Read Article
                  <ArrowRightIcon size={16} color="#FFFFFF" />
                </motion.span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </AnimatedSection>
  );
}

/* ────────────────────────────────────────────────── */
/*  Post Grid Card                                    */
/* ────────────────────────────────────────────────── */

function PostCard({
  post,
  accent,
  brand,
  isClassic,
  index,
}: {
  post: SerializedPost;
  accent: string;
  brand: string;
  isClassic: boolean;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{
        duration: 0.5,
        delay: index * 0.1,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      <Link href={`/blog/${post.slug}`} className="block group h-full">
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden h-full flex flex-col hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
          {/* Image */}
          <div className="relative h-52 flex-shrink-0 overflow-hidden">
            {post.featuredImage ? (
              <>
                <Image
                  src={post.featuredImage}
                  alt={post.h1 || post.title || ""}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                {/* Gradient overlay on bottom of image */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent" />
              </>
            ) : (
              <ImagePlaceholder brand={brand} isClassic={isClassic} size="sm" />
            )}

            {/* Category pill on image */}
            {post.category && (
              <div className="absolute top-3 left-3 z-10">
                <CategoryPill category={post.category} brand={brand} variant="overlay" />
              </div>
            )}
          </div>

          {/* Body */}
          <div className="p-6 flex flex-col flex-1">
            <h3
              className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-gray-700 transition-colors duration-200"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              {post.h1 || post.title}
            </h3>

            {post.excerpt && (
              <p className="text-sm text-gray-500 line-clamp-2 mb-4 leading-relaxed">
                {post.excerpt}
              </p>
            )}

            {/* Decorative dot separator */}
            <div className="flex items-center gap-1 mb-3">
              <span className="w-1 h-1 rounded-full" style={{ backgroundColor: `${brand}40` }} />
              <span className="w-1 h-1 rounded-full" style={{ backgroundColor: `${brand}25` }} />
              <span className="w-1 h-1 rounded-full" style={{ backgroundColor: `${brand}15` }} />
            </div>

            {/* Meta */}
            <div className="mt-auto flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-400 mb-4">
              <span className="font-medium text-gray-500">{post.author ?? ""}</span>
              {post.datePublished && <span>{formatDate(post.datePublished)}</span>}
            </div>

            {/* Bottom row */}
            <div className="flex items-center justify-between">
              {(post.viewCount ?? 0) > 0 && (
                <span className="flex items-center gap-1 text-xs text-gray-400">
                  <ClockIcon size={11} color="#9CA3AF" />
                  {(post.viewCount ?? 0).toLocaleString('en-IN')} views
                </span>
              )}
              <span
                className="inline-flex items-center gap-1 text-sm font-semibold ml-auto group-hover:gap-2 transition-all duration-300"
                style={{ color: accent }}
              >
                Read
                <motion.span
                  className="inline-block"
                  initial={false}
                  animate={{ x: 0 }}
                  whileHover={{ x: 3 }}
                >
                  <ArrowRightIcon size={14} color={accent} />
                </motion.span>
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

/* ────────────────────────────────────────────────── */
/*  Empty State                                       */
/* ────────────────────────────────────────────────── */

function EmptyState({ brand, isClassic }: { brand: string; isClassic: boolean }) {
  return (
    <AnimatedSection>
      <div className="text-center py-28 px-5 relative">
        {/* Floating icon */}
        <div className="flex justify-center mb-8 relative">
          <motion.div
            animate={{ y: [0, -12, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          >
            {isClassic ? (
              <BurgerIcon size={80} color={brand} />
            ) : (
              <LeafIcon size={80} color={brand} />
            )}
          </motion.div>

          {/* 3 sparkles around the icon */}
          {[
            { x: -40, y: -10, delay: 0, size: 10 },
            { x: 45, y: -20, delay: 0.8, size: 8 },
            { x: 30, y: 25, delay: 1.5, size: 6 },
          ].map((s, i) => (
            <motion.div
              key={i}
              className="absolute"
              style={{
                left: `calc(50% + ${s.x}px)`,
                top: `calc(50% + ${s.y}px)`,
              }}
              animate={{
                opacity: [0.2, 0.7, 0.2],
                scale: [0.8, 1.3, 0.8],
              }}
              transition={{
                duration: 2.5,
                delay: s.delay,
                repeat: Infinity,
              }}
            >
              <SparkleIcon size={s.size} color={`${brand}80`} />
            </motion.div>
          ))}
        </div>

        <h2
          className="text-3xl md:text-4xl font-black text-gray-900 mb-3"
          style={{ fontFamily: 'var(--font-hero)' }}
        >
          No stories yet
        </h2>
        <p className="text-gray-500 text-base max-w-md mx-auto leading-relaxed">
          {isClassic
            ? "We're firing up the grill and cooking up some amazing stories. Check back soon for articles about burgers, food culture, and more."
            : "We're planting the seeds for nourishing stories. Check back soon for articles about healthy eating, wellness, and mindful living."}
        </p>
      </div>
    </AnimatedSection>
  );
}

/* ────────────────────────────────────────────────── */
/*  Main Component                                    */
/* ────────────────────────────────────────────────── */

export default function BlogIndexClient({ posts }: { posts: SerializedPost[] }) {
  const { isClassic } = useMode();

  const heroEdge = isClassic ? '#D46E1F' : '#3D8A48';
  const light = isClassic ? '#FFF9F0' : '#F5FBF7';
  const accent = isClassic ? '#9A1E29' : '#4AA056';
  const brand = isClassic ? '#EB7A29' : '#4AA056';

  const featuredPost = posts[0] ?? null;
  const gridPosts = posts.slice(1);

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FFFFFF' }}>
      {/* ══════════════════════════════════════════════ */}
      {/*  HERO SECTION                                 */}
      {/* ══════════════════════════════════════════════ */}
      <section
        className="relative overflow-hidden py-20 md:py-28 px-5"
        style={{
          background: isClassic
            ? 'radial-gradient(ellipse at 30% 50%, rgba(154,30,41,0.15), transparent 60%), linear-gradient(135deg, #EB7A29, #D46E1F)'
            : 'radial-gradient(ellipse at 30% 50%, rgba(45,90,61,0.2), transparent 60%), linear-gradient(135deg, #4AA056, #3D8A48)',
        }}
      >
        {/* Floating sparkle elements */}
        {[
          { x: '15%', y: '25%', delay: 0, size: 8 },
          { x: '80%', y: '35%', delay: 1.5, size: 6 },
          { x: '70%', y: '75%', delay: 0.8, size: 10 },
        ].map((sparkle, i) => (
          <motion.div
            key={i}
            className="absolute hidden md:block"
            style={{ left: sparkle.x, top: sparkle.y }}
            animate={{
              opacity: [0.3, 0.8, 0.3],
              scale: [0.8, 1.2, 0.8],
            }}
            transition={{
              duration: 3,
              delay: sparkle.delay,
              repeat: Infinity,
            }}
          >
            <SparkleIcon size={sparkle.size} color="rgba(255,255,255,0.5)" />
          </motion.div>
        ))}

        {/* Floating SVG illustration — right side, desktop only */}
        <div className="absolute right-8 lg:right-16 top-1/2 -translate-y-1/2 hidden md:flex items-center justify-center">
          {isClassic ? <ClassicHeroIllustration /> : <HealthyHeroIllustration />}
        </div>

        {/* Hero content */}
        <div className="max-w-[800px] mx-auto text-center relative z-10">
          {/* Pencil icon pop-in */}
          <motion.div
            className="flex justify-center mb-5"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, type: 'spring', stiffness: 200 }}
          >
            <PencilIcon size={32} color="#FFFFFF" />
          </motion.div>

          {/* Title with staggered word animation */}
          <h1
            className="text-4xl md:text-5xl font-black text-white mb-5 leading-tight"
            style={{ fontFamily: 'var(--font-hero)' }}
          >
            {(isClassic ? 'Stories from the Grill' : 'Nourishing Stories').split(' ').map(
              (word, i) => (
                <motion.span
                  key={i}
                  className="inline-block mr-[0.3em]"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.5,
                    delay: 0.2 + i * 0.1,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                >
                  {word}
                </motion.span>
              )
            )}
          </h1>

          {/* Subtitle */}
          <motion.p
            className="text-base md:text-lg text-white/70 max-w-lg mx-auto mb-6"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            {isClassic
              ? 'Behind-the-grill stories, city food guides, and everything burger lovers crave.'
              : 'Nutrition tips, clean-eating hacks, and the science behind guilt-free flavour.'}
          </motion.p>

          {/* Post count pill */}
          {posts.length > 0 && (
            <motion.div
              className="flex justify-center"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.8 }}
            >
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium text-white bg-white/20 backdrop-blur-sm">
                <PencilIcon size={14} color="rgba(255,255,255,0.8)" />
                {posts.length} {posts.length === 1 ? 'Article' : 'Articles'}
              </span>
            </motion.div>
          )}
        </div>
      </section>

      {/* ══════════════════════════════════════════════ */}
      {/*  WAVE DIVIDER                                 */}
      {/* ══════════════════════════════════════════════ */}
      <WaveDivider variant="wave" topColor={heroEdge} bottomColor="#FFFFFF" />

      {/* ══════════════════════════════════════════════ */}
      {/*  CONTENT                                      */}
      {/* ══════════════════════════════════════════════ */}
      {posts.length === 0 ? (
        <EmptyState brand={brand} isClassic={isClassic} />
      ) : (
        <>
          {/* ── Featured Post ── */}
          {featuredPost && (
            <section className="py-16 md:py-20 px-5 has-pattern" style={{ backgroundColor: light }}>
              <div className="max-w-[1100px] mx-auto">
                <AnimatedSection>
                  <div className="flex items-center justify-center gap-2 mb-8">
                    <motion.div
                      animate={{ rotate: [0, 15, -15, 0] }}
                      transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                    >
                      <SparkleIcon size={16} color={brand} />
                    </motion.div>
                    <p
                      className="text-xs font-bold uppercase tracking-[0.2em]"
                      style={{ color: brand }}
                    >
                      Featured Story
                    </p>
                    <motion.div
                      animate={{ rotate: [0, -15, 15, 0] }}
                      transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
                    >
                      <SparkleIcon size={16} color={brand} />
                    </motion.div>
                  </div>
                </AnimatedSection>

                <FeaturedPostCard
                  post={featuredPost}
                  accent={accent}
                  brand={brand}
                  isClassic={isClassic}
                />
              </div>
            </section>
          )}

          {/* ── Section Divider ── */}
          {gridPosts.length > 0 && (
            <SectionDividerDecoration brand={brand} isClassic={isClassic} />
          )}

          {/* ── Post Grid ── */}
          {gridPosts.length > 0 && (
            <section className="py-12 md:py-16 px-5">
              <div className="max-w-[1100px] mx-auto">
                <AnimatedSection>
                  <div className="text-center mb-12">
                    <h2
                      className="text-2xl md:text-3xl font-black text-gray-900 mb-3"
                      style={{ fontFamily: 'var(--font-heading)' }}
                    >
                      Latest Posts
                    </h2>
                    {/* Decorative underline with draw animation */}
                    <div className="flex justify-center">
                      <motion.div
                        className="h-[3px] w-12 rounded-full"
                        style={{ backgroundColor: brand, transformOrigin: 'center' }}
                        initial={{ scaleX: 0 }}
                        whileInView={{ scaleX: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
                      />
                    </div>
                  </div>
                </AnimatedSection>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
                  {gridPosts.map((post, i) => (
                    <PostCard
                      key={post.id}
                      post={post}
                      accent={accent}
                      brand={brand}
                      isClassic={isClassic}
                      index={i}
                    />
                  ))}
                </div>
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
}
