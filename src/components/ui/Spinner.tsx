'use client';

import { cn } from '@/lib/cn';

interface SpinnerProps {
  size?: 'xs' | 'sm' | 'md';
  className?: string;
}

const SIZE_MAP = {
  xs: 'w-3 h-3',
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
};

/**
 * Consistent inline spinner for buttons and loading states.
 * Uses the same SVG animation across all buttons.
 */
export default function Spinner({ size = 'sm', className }: SpinnerProps) {
  return (
    <svg
      className={cn('animate-spin flex-shrink-0', SIZE_MAP[size], className)}
      viewBox="0 0 24 24"
      fill="none"
      role="status"
      aria-label="Loading"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8v8H4z"
      />
    </svg>
  );
}
