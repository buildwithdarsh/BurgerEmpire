'use client';

import { motion } from 'framer-motion';
import { useMode } from '@/hooks/useMode';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import {
  BurgerIcon,
  LeafIcon,
  StarIcon,
  FireIcon,
  ClockIcon,
  ArrowRightIcon,
  ChevronIcon,
  SparkleIcon,
  CameraIcon,
} from '@/components/icons';
import WaveDivider from '@/components/WaveDivider';
import Link from 'next/link';
import Image from 'next/image';

/* ─── Serialized Types ────────────────────────────────────────────────────── */

interface SerializedMedia {
  id: string;
  blogPostId: string;
  type: string;
  url: string;
  alt: string | null;
  caption: string | null;
  sortOrder: number;
  createdAt: string;
}

interface SerializedReview {
  id: string;
  blogPostId: string;
  reviewerName: string;
  reviewerImage: string | null;
  rating: number;
  content: string;
  isApproved: boolean;
  createdAt: string;
}

interface SerializedPost {
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
  metaDescription: string | null;
  canonical: string | null;
  status: string;
  viewCount?: number;
  datePublished: string | null;
  dateModified: string | null;
  createdAt?: string;
  updatedAt?: string;
  media?: SerializedMedia[];
  reviews?: SerializedReview[];
}

interface SerializedRelatedPost {
  slug: string;
  h1: string | null;
  excerpt: string | null;
  featuredImage: string | null;
  category: string | null;
  datePublished: string | null;
  author: string | null;
}

interface BlogPostClientProps {
  post: SerializedPost;
  relatedPosts: SerializedRelatedPost[];
}

/* ─── Helpers ─────────────────────────────────────────────────────────────── */

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
        transform: isVisible ? 'translateY(0)' : 'translateY(25px)',
        transition: `opacity 600ms ${delay}ms cubic-bezier(0.22, 1, 0.36, 1), transform 600ms ${delay}ms cubic-bezier(0.22, 1, 0.36, 1)`,
      }}
    >
      {children}
    </div>
  );
}

function formatDate(iso: string | null): string {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function getReadingTime(html: string): number {
  const text = html.replace(/<[^>]+>/g, '');
  const words = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

function parseTags(raw: string | string[]): string[] {
  if (Array.isArray(raw)) return raw;
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function getYouTubeId(url: string): string | null {
  const watchMatch = url.match(/youtube\.com\/watch\?v=([^&]+)/);
  if (watchMatch) return watchMatch[1] ?? null;
  const shortMatch = url.match(/youtu\.be\/([^?]+)/);
  if (shortMatch) return shortMatch[1] ?? null;
  return null;
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

/* ─── Decorative Sub-Components ───────────────────────────────────────────── */

function SectionHeader({
  icon,
  title,
  brand,
}: {
  icon: React.ReactNode;
  title: string;
  brand: string;
}) {
  return (
    <div className="flex items-center justify-center gap-4 mb-10">
      <div
        className="h-px flex-1 max-w-[80px]"
        style={{ backgroundColor: `${brand}30` }}
      />
      <div className="flex items-center gap-2">
        {icon}
        <h2
          className="text-2xl md:text-3xl font-black text-gray-900"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          {title}
        </h2>
      </div>
      <div
        className="h-px flex-1 max-w-[80px]"
        style={{ backgroundColor: `${brand}30` }}
      />
    </div>
  );
}

function DecorativeSeparator({
  brand,
  isClassic,
}: {
  brand: string;
  isClassic: boolean;
}) {
  return (
    <div className="flex items-center justify-center gap-3 py-4">
      <div className="w-8 h-px" style={{ backgroundColor: `${brand}40` }} />
      {isClassic ? (
        <BurgerIcon size={20} color={`${brand}60`} />
      ) : (
        <LeafIcon size={20} color={`${brand}60`} />
      )}
      <div className="w-8 h-px" style={{ backgroundColor: `${brand}40` }} />
    </div>
  );
}

function QuoteMarkSvg({ color }: { color: string }) {
  return (
    <svg className="w-8 h-8 mb-2 opacity-15" viewBox="0 0 24 24" fill={color}>
      <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10H14.017zM0 21v-7.391c0-5.704 3.73-9.57 8.982-10.609L9.977 5.15C7.545 6.067 5.982 8.789 5.982 11h4v10H0z" />
    </svg>
  );
}

/* ─── Main Component ──────────────────────────────────────────────────────── */

export default function BlogPostClient({
  post,
  relatedPosts,
}: BlogPostClientProps) {
  const { isClassic } = useMode();

  const heroEdge = isClassic ? '#D46E1F' : '#3D8A48';
  const light = isClassic ? '#FFF9F0' : '#F5FBF7';
  const accent = isClassic ? '#9A1E29' : '#4AA056';
  const brand = isClassic ? '#EB7A29' : '#4AA056';

  const readingTime = getReadingTime(post.body);
  const tags = parseTags(post.tags);

  const heroSparkles = [
    { x: '10%', y: '20%', delay: 0, size: 8 },
    { x: '85%', y: '30%', delay: 1.2, size: 6 },
    { x: '75%', y: '80%', delay: 0.5, size: 10 },
  ];

  return (
    <div className="min-h-screen has-pattern" style={{ backgroundColor: '#FFFFFF' }}>
      {/* ── Scoped blog prose styles ─────────────────────────────────────── */}
      <style>{`
        .blog-prose h2 {
          font-family: var(--font-heading);
          font-size: 1.5rem;
          font-weight: 800;
          color: #111;
          margin-top: 2.5rem;
          margin-bottom: 1rem;
        }
        .blog-prose h3 {
          font-family: var(--font-heading);
          font-size: 1.25rem;
          font-weight: 700;
          color: #222;
          margin-top: 2rem;
          margin-bottom: 0.75rem;
        }
        .blog-prose p {
          font-size: 1.05rem;
          line-height: 1.85;
          color: #444;
          margin-bottom: 1.5rem;
        }
        .blog-prose a {
          color: ${accent};
          text-decoration: underline;
          text-underline-offset: 3px;
          transition: opacity 0.2s;
        }
        .blog-prose a:hover {
          opacity: 0.75;
        }
        .blog-prose ul,
        .blog-prose ol {
          margin-left: 1.5rem;
          margin-bottom: 1.5rem;
          color: #444;
        }
        .blog-prose li {
          margin-bottom: 0.5rem;
          line-height: 1.75;
        }
        .blog-prose ul {
          list-style-type: disc;
        }
        .blog-prose ol {
          list-style-type: decimal;
        }
        .blog-prose blockquote {
          border-left: 4px solid ${brand};
          background: ${light};
          padding: 1.5rem 1.5rem 1.5rem 2rem;
          margin: 2rem 0;
          border-radius: 0 0.75rem 0.75rem 0;
          font-style: italic;
          color: #555;
          font-size: 1.05rem;
          line-height: 1.8;
        }
        .blog-prose blockquote p {
          margin-bottom: 0;
        }
        .blog-prose table {
          width: 100%;
          border-collapse: collapse;
          margin: 1.5rem 0;
        }
        .blog-prose th,
        .blog-prose td {
          border: 1px solid #e5e7eb;
          padding: 0.75rem 1rem;
          text-align: left;
          font-size: 0.875rem;
        }
        .blog-prose th {
          background: #f9fafb;
          font-weight: 600;
        }
        .blog-prose strong {
          color: #111;
          font-weight: 600;
        }
        .blog-prose img {
          border-radius: 0.75rem;
          margin: 1.5rem 0;
        }
        .blog-prose hr {
          border: none;
          height: 1px;
          background: #e5e7eb;
          margin: 2.5rem 0;
        }
      `}</style>

      {/* ══════════════════════════════════════════════════════════════════════
          1. HERO SECTION
      ══════════════════════════════════════════════════════════════════════ */}
      <section
        className="relative pt-14 pb-20 px-5 overflow-hidden"
        style={{
          background: isClassic
            ? 'radial-gradient(ellipse at 70% 30%, rgba(154,30,41,0.15), transparent 50%), linear-gradient(135deg, #EB7A29, #D46E1F)'
            : 'radial-gradient(ellipse at 70% 30%, rgba(45,90,61,0.2), transparent 50%), linear-gradient(135deg, #4AA056, #3D8A48)',
        }}
      >
        {/* Floating sparkles */}
        {heroSparkles.map((s, i) => (
          <motion.div
            key={i}
            className="absolute hidden md:block"
            style={{ left: s.x, top: s.y }}
            animate={{
              opacity: [0.2, 0.7, 0.2],
              scale: [0.8, 1.2, 0.8],
            }}
            transition={{
              duration: 3,
              delay: s.delay,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            <SparkleIcon size={s.size} color="rgba(255,255,255,0.4)" />
          </motion.div>
        ))}

        {/* Subtle radial light bloom */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(circle at 50% 40%, rgba(255,255,255,0.08), transparent 60%)',
          }}
        />

        <div className="relative max-w-4xl mx-auto text-center">
          {/* Breadcrumb */}
          <motion.nav
            className="flex items-center justify-center gap-1.5 text-xs mb-6"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0 }}
          >
            <Link
              href="/"
              className="text-white/70 hover:text-white transition-colors"
            >
              Home
            </Link>
            <ChevronIcon
              size={12}
              color="rgba(255,255,255,0.45)"
              direction="right"
            />
            <Link
              href="/blog"
              className="text-white/70 hover:text-white transition-colors"
            >
              Blog
            </Link>
            <ChevronIcon
              size={12}
              color="rgba(255,255,255,0.45)"
              direction="right"
            />
            <span className="text-white/60 truncate max-w-[200px]">
              {post.h1 || post.title}
            </span>
          </motion.nav>

          {/* Category badge */}
          {post.category && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="mb-5"
            >
              <span
                className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold text-white"
                style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
              >
                {isClassic ? (
                  <FireIcon size={13} color="rgba(255,255,255,0.85)" />
                ) : (
                  <LeafIcon size={13} color="rgba(255,255,255,0.85)" />
                )}
                {post.category}
              </span>
            </motion.div>
          )}

          {/* H1 */}
          <motion.h1
            className="text-3xl md:text-4xl lg:text-5xl font-black text-white mb-6 max-w-4xl mx-auto leading-tight"
            style={{ fontFamily: 'var(--font-hero)' }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            {post.h1 || post.title}
          </motion.h1>

          {/* Meta row */}
          <motion.div
            className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm text-white/70 mb-6"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25 }}
          >
            {/* Author */}
            <span className="flex items-center gap-2">
              <span
                className="w-6 h-6 rounded-full flex items-center justify-center text-[0.625rem] font-bold"
                style={{
                  backgroundColor: 'rgba(255,255,255,0.25)',
                  color: '#FFFFFF',
                }}
              >
                {getInitials(post.author ?? "")}
              </span>
              <span className="text-white/80 font-medium">{post.author ?? ""}</span>
            </span>

            {/* Date */}
            {post.datePublished && (
              <span className="flex items-center gap-1.5">
                <ClockIcon size={14} color="rgba(255,255,255,0.55)" />
                {formatDate(post.datePublished)}
              </span>
            )}

            {/* Reading time */}
            <span className="flex items-center gap-1.5">
              <svg
                width={14}
                height={14}
                viewBox="0 0 24 24"
                fill="none"
                stroke="rgba(255,255,255,0.55)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z" />
                <path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z" />
              </svg>
              {readingTime} min read
            </span>

            {/* Views */}
            <span className="flex items-center gap-1.5">
              <svg
                width={14}
                height={14}
                viewBox="0 0 24 24"
                fill="none"
                stroke="rgba(255,255,255,0.55)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
              {(post.viewCount ?? 0).toLocaleString()} views
            </span>
          </motion.div>

          {/* Tags */}
          {tags.length > 0 && (
            <motion.div
              className="flex flex-wrap items-center justify-center gap-2"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.35 }}
            >
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 rounded-full text-[0.6875rem] font-medium text-white/90 hover:text-white hover:bg-white/30 transition-all duration-200 cursor-default"
                  style={{ backgroundColor: 'rgba(255,255,255,0.15)' }}
                >
                  {tag}
                </span>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          2. WAVE DIVIDER
      ══════════════════════════════════════════════════════════════════════ */}
      <WaveDivider variant="wave" topColor={heroEdge} bottomColor="#FFFFFF" />

      {/* ══════════════════════════════════════════════════════════════════════
          3. FEATURED IMAGE
      ══════════════════════════════════════════════════════════════════════ */}
      {post.featuredImage && (
        <section className="px-4 mt-8 mb-4">
          <AnimatedSection>
            <div className="max-w-4xl mx-auto">
              <div className="relative rounded-2xl overflow-hidden">
                <Image
                  src={post.featuredImage}
                  alt={post.h1 || post.title}
                  width={1200}
                  height={675}
                  className="w-full h-auto object-cover aspect-video"
                  priority
                />
                {/* Subtle bottom gradient overlay */}
                <div
                  className="absolute inset-x-0 bottom-0 h-24 pointer-events-none"
                  style={{
                    background:
                      'linear-gradient(to top, rgba(0,0,0,0.15), transparent)',
                  }}
                />
              </div>
            </div>
          </AnimatedSection>
        </section>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          4. ARTICLE BODY
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="py-12 px-4">
        <AnimatedSection>
          <article
            className="blog-prose max-w-3xl mx-auto"
            dangerouslySetInnerHTML={{ __html: post.body }}
          />
        </AnimatedSection>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          9. DECORATIVE SEPARATOR (article -> gallery)
      ══════════════════════════════════════════════════════════════════════ */}
      {((post.media?.length ?? 0) > 0 || (post.reviews?.length ?? 0) > 0) && (
        <DecorativeSeparator brand={brand} isClassic={isClassic} />
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          5. MEDIA GALLERY
      ══════════════════════════════════════════════════════════════════════ */}
      {(post.media?.length ?? 0) > 0 && (
        <section className="py-16 px-5" style={{ backgroundColor: light }}>
          <div className="max-w-5xl mx-auto">
            <AnimatedSection>
              <SectionHeader
                icon={
                  <CameraIcon size={22} color={brand} />
                }
                title="Gallery"
                brand={brand}
              />
            </AnimatedSection>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {post.media?.map((item, i) => {
                const youtubeId =
                  item.type === 'video' ? getYouTubeId(item.url) : null;

                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 0.5,
                      delay: i * 0.08,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                  >
                    <div className="rounded-xl overflow-hidden group hover:shadow-lg transition-all duration-300 bg-white">
                      {item.type === 'image' ? (
                        <div className="relative overflow-hidden">
                          <Image
                            src={item.url}
                            alt={item.alt || item.caption || 'Gallery image'}
                            width={600}
                            height={400}
                            className="w-full h-auto object-cover aspect-[3/2] group-hover:scale-[1.03] transition-transform duration-500"
                          />
                          {/* Caption overlay on hover */}
                          {item.caption && (
                            <div className="absolute inset-x-0 bottom-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                              <div
                                className="absolute inset-0"
                                style={{
                                  background:
                                    'linear-gradient(to top, rgba(0,0,0,0.65), transparent)',
                                }}
                              />
                              <p className="relative text-sm text-white font-medium">
                                {item.caption}
                              </p>
                            </div>
                          )}
                        </div>
                      ) : youtubeId ? (
                        <div className="relative w-full rounded-xl overflow-hidden" style={{ paddingBottom: '56.25%' }}>
                          <iframe
                            src={`https://www.youtube-nocookie.com/embed/${youtubeId}`}
                            title={item.caption || 'Video'}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            className="absolute inset-0 w-full h-full"
                          />
                        </div>
                      ) : (
                        <video
                          src={item.url}
                          controls
                          className="w-full aspect-video object-cover"
                          preload="metadata"
                        />
                      )}

                      {/* Non-image captions below the media (images use overlay) */}
                      {item.caption && item.type !== 'image' && (
                        <p className="px-4 py-3 text-sm text-gray-500">
                          {item.caption}
                        </p>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          SEPARATOR (gallery -> reviews)
      ══════════════════════════════════════════════════════════════════════ */}
      {(post.media?.length ?? 0) > 0 && (post.reviews?.length ?? 0) > 0 && (
        <DecorativeSeparator brand={brand} isClassic={isClassic} />
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          6. REVIEWS / TESTIMONIALS
      ══════════════════════════════════════════════════════════════════════ */}
      {(post.reviews?.length ?? 0) > 0 && (
        <section className="py-16 px-5">
          <div className="max-w-4xl mx-auto">
            <AnimatedSection>
              <SectionHeader
                icon={<StarIcon size={22} color={brand} />}
                title="What People Say"
                brand={brand}
              />
            </AnimatedSection>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {post.reviews?.map((review, i) => (
                <motion.div
                  key={review.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.5,
                    delay: i * 0.1,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  <div
                    className="rounded-2xl p-8 transition-shadow duration-300 hover:shadow-md"
                    style={{ backgroundColor: light }}
                  >
                    {/* Star rating */}
                    <div className="flex items-center gap-1 mb-4">
                      {Array.from({ length: 5 }).map((_, idx) => (
                        <StarIcon
                          key={idx}
                          size={20}
                          color={idx < review.rating ? brand : '#D1D5DB'}
                        />
                      ))}
                    </div>

                    {/* Decorative quote mark */}
                    <QuoteMarkSvg color={brand} />

                    {/* Quote content */}
                    <p
                      className="text-base text-gray-600 italic leading-relaxed mb-6"
                      style={{ fontFamily: 'var(--font-playfair)' }}
                    >
                      {review.content}
                    </p>

                    {/* Reviewer info */}
                    <div className="flex items-center gap-3">
                      {review.reviewerImage ? (
                        <Image
                          src={review.reviewerImage}
                          alt={review.reviewerName}
                          width={40}
                          height={40}
                          className="rounded-full object-cover"
                          style={{ width: 40, height: 40 }}
                        />
                      ) : (
                        <div
                          className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold"
                          style={{
                            backgroundColor: `${brand}15`,
                            color: brand,
                          }}
                        >
                          {getInitials(review.reviewerName)}
                        </div>
                      )}
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm font-bold text-gray-900">
                          {review.reviewerName}
                        </span>
                        {/* Verified star */}
                        <svg
                          width={14}
                          height={14}
                          viewBox="0 0 24 24"
                          fill={brand}
                          className="opacity-50"
                        >
                          <path d="M12 2L14.9 8.6L22 9.2L16.8 13.9L18.4 21L12 17.3L5.6 21L7.2 13.9L2 9.2L9.1 8.6L12 2Z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          SEPARATOR (reviews -> related)
      ══════════════════════════════════════════════════════════════════════ */}
      {relatedPosts.length > 0 && (
        <DecorativeSeparator brand={brand} isClassic={isClassic} />
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          7. RELATED POSTS
      ══════════════════════════════════════════════════════════════════════ */}
      {relatedPosts.length > 0 && (
        <section className="py-16 px-5" style={{ backgroundColor: light }}>
          <div className="max-w-5xl mx-auto">
            <AnimatedSection>
              <SectionHeader
                icon={<SparkleIcon size={20} color={brand} />}
                title="More from the Blog"
                brand={brand}
              />
            </AnimatedSection>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedPosts.map((related, i) => (
                <motion.div
                  key={related.slug}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.5,
                    delay: i * 0.1,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  <Link href={`/blog/${related.slug}`} className="group block h-full">
                    <div className="bg-white rounded-2xl overflow-hidden group-hover:shadow-xl transition-all duration-300 h-full flex flex-col">
                      {/* Image */}
                      <div className="relative overflow-hidden">
                        {related.featuredImage ? (
                          <Image
                            src={related.featuredImage}
                            alt={related.h1 || related.slug}
                            width={400}
                            height={225}
                            className="w-full h-auto object-cover aspect-video group-hover:scale-[1.04] transition-transform duration-500"
                          />
                        ) : (
                          <div
                            className="w-full aspect-video flex items-center justify-center"
                            style={{ backgroundColor: `${brand}08` }}
                          >
                            {isClassic ? (
                              <BurgerIcon size={40} color={`${brand}25`} />
                            ) : (
                              <LeafIcon size={40} color={`${brand}25`} />
                            )}
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="p-5 flex flex-col flex-1">
                        {related.category && (
                          <span
                            className="text-[0.6875rem] font-bold uppercase tracking-wider mb-1"
                            style={{ color: brand }}
                          >
                            {related.category}
                          </span>
                        )}
                        <h3 className="text-[0.9375rem] font-bold text-gray-900 mt-1 mb-2 line-clamp-2 group-hover:text-gray-700 transition-colors leading-snug">
                          {related.h1 || related.slug}
                        </h3>
                        {related.excerpt && (
                          <p className="text-xs text-gray-500 line-clamp-2 mb-3 leading-relaxed">
                            {related.excerpt}
                          </p>
                        )}
                        {related.datePublished && (
                          <p className="text-[0.6875rem] text-gray-400 mb-4">
                            {formatDate(related.datePublished)}
                          </p>
                        )}

                        {/* Read more - pushed to bottom */}
                        <div className="mt-auto">
                          <span
                            className="inline-flex items-center gap-1 text-xs font-bold transition-colors"
                            style={{ color: accent }}
                            aria-label={`Read more about ${related.h1 || related.slug}`}
                          >
                            Read more about {(related.h1 || related.slug).split(' ').slice(0, 4).join(' ')}{(related.h1 || related.slug).split(' ').length > 4 ? '…' : ''}
                            <motion.span
                              className="inline-block"
                              whileHover={{ x: 4 }}
                              transition={{ type: 'spring', stiffness: 300 }}
                            >
                              <ArrowRightIcon size={13} color={accent} />
                            </motion.span>
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          8. BACK TO BLOG
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="py-12 px-5">
        <AnimatedSection>
          <div className="max-w-3xl mx-auto text-center">
            <Link href="/blog">
              <motion.span
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl text-sm font-bold text-white cursor-pointer"
                style={{ backgroundColor: brand }}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: 'spring', stiffness: 400, damping: 20 }}
              >
                <ChevronIcon size={16} color="#FFFFFF" direction="left" />
                Back to Blog
              </motion.span>
            </Link>
          </div>
        </AnimatedSection>
      </section>
    </div>
  );
}
