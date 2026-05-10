'use client';

import { cn } from '@/lib/cn';

interface SkeletonBaseProps {
  className?: string;
}

/**
 * Base skeleton block — compose layouts by combining instances.
 * Uses pulse animation (opacity 0.5 → 1 → 0.5).
 */
function SkeletonBlock({ className }: SkeletonBaseProps) {
  return (
    <div
      aria-hidden="true"
      className={cn('animate-pulse rounded-lg bg-gray-200/70', className)}
    />
  );
}

// ── Skeleton Variants ──

interface TextProps {
  lines?: number;
  className?: string;
}

function Text({ lines = 3, className }: TextProps) {
  return (
    <div aria-hidden="true" className={cn('space-y-2', className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <SkeletonBlock
          key={i}
          className={cn('h-4', i === lines - 1 ? 'w-3/4' : 'w-full')}
        />
      ))}
    </div>
  );
}

function Card({ className }: SkeletonBaseProps) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        'bg-white rounded-2xl border border-gray-100 p-5 space-y-3',
        className
      )}
    >
      <SkeletonBlock className="h-40 w-full rounded-xl" />
      <SkeletonBlock className="h-4 w-3/4" />
      <SkeletonBlock className="h-3 w-1/2" />
      <SkeletonBlock className="h-8 w-24 rounded-lg" />
    </div>
  );
}

interface TableProps {
  rows?: number;
  cols?: number;
  className?: string;
}

function Table({ rows = 5, cols = 4, className }: TableProps) {
  return (
    <div aria-hidden="true" className={cn('space-y-2', className)}>
      {/* Header row */}
      <div className="flex gap-4 pb-2 border-b border-gray-100">
        {Array.from({ length: cols }).map((_, c) => (
          <SkeletonBlock key={c} className="h-4 flex-1" />
        ))}
      </div>
      {/* Data rows */}
      {Array.from({ length: rows }).map((_, r) => (
        <div key={r} className="flex gap-4 py-2">
          {Array.from({ length: cols }).map((_, c) => (
            <SkeletonBlock key={c} className="h-4 flex-1" />
          ))}
        </div>
      ))}
    </div>
  );
}

interface AvatarProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const AVATAR_SIZES = { sm: 'w-8 h-8', md: 'w-12 h-12', lg: 'w-16 h-16' };

function Avatar({ size = 'md', className }: AvatarProps) {
  return (
    <SkeletonBlock
      className={cn('rounded-full', AVATAR_SIZES[size], className)}
    />
  );
}

interface ImageProps {
  ratio?: '16/9' | '4/3' | '1/1';
  className?: string;
}

function Image({ ratio = '16/9', className }: ImageProps) {
  const aspectClass =
    ratio === '16/9'
      ? 'aspect-video'
      : ratio === '4/3'
      ? 'aspect-[4/3]'
      : 'aspect-square';

  return (
    <SkeletonBlock
      className={cn('w-full rounded-xl', aspectClass, className)}
    />
  );
}

// ── Compound Export ──

const Skeleton = Object.assign(SkeletonBlock, {
  Text,
  Card,
  Table,
  Avatar,
  Image,
});

export default Skeleton;
