'use client';

import { useState, useRef, useCallback, type ReactNode } from 'react';
import { cn } from '@/lib/cn';

type ButtonState = 'idle' | 'loading' | 'success' | 'error';

interface ApiButtonProps {
  onClick: () => Promise<void>;
  children: ReactNode;
  loadingText?: string;
  successText?: string;
  errorText?: string;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  className?: string;
  icon?: ReactNode;
  /** Accent color override (hex) — used for primary variant */
  accentColor?: string;
}

// ── Inline SVG Icons ──

function SpinnerIcon() {
  return (
    <svg
      className="animate-spin w-4 h-4 flex-shrink-0"
      viewBox="0 0 24 24"
      fill="none"
      role="status"
      aria-label="Loading"
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}

// ── Variant styles ──

const VARIANT_CLASSES: Record<string, string> = {
  primary: 'text-white',
  secondary: 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50',
  danger: 'bg-red-500 text-white hover:bg-red-600',
  ghost: 'bg-transparent text-gray-600 hover:bg-gray-100',
};

const SIZE_CLASSES: Record<string, string> = {
  sm: 'px-3 py-1.5 text-xs rounded-lg min-w-[80px]',
  md: 'px-4 py-2.5 text-sm rounded-xl min-w-[100px]',
  lg: 'px-6 py-3.5 text-base rounded-2xl min-w-[120px]',
};

export default function ApiButton({
  onClick,
  children,
  loadingText,
  successText,
  errorText,
  variant = 'primary',
  size = 'md',
  disabled = false,
  className,
  icon,
  accentColor,
}: ApiButtonProps) {
  const [state, setState] = useState<ButtonState>('idle');
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleClick = useCallback(async () => {
    if (state === 'loading' || disabled) return;

    setState('loading');

    try {
      await onClick();
      setState('success');
      timerRef.current = setTimeout(() => setState('idle'), 2000);
    } catch {
      setState('error');
      timerRef.current = setTimeout(() => setState('idle'), 3000);
    }
  }, [onClick, state, disabled]);

  const isDisabled = disabled || state === 'loading';

  const stateContent: Record<ButtonState, ReactNode> = {
    idle: (
      <>
        {icon && <span className="flex-shrink-0">{icon}</span>}
        {children}
      </>
    ),
    loading: (
      <>
        <SpinnerIcon />
        {loadingText || children}
      </>
    ),
    success: (
      <>
        <CheckIcon />
        {successText || 'Done!'}
      </>
    ),
    error: (
      <>
        <XIcon />
        {errorText || 'Failed'}
      </>
    ),
  };

  const stateStyles: Record<ButtonState, string | undefined> = {
    idle: undefined,
    loading: 'opacity-75 cursor-not-allowed',
    success: variant === 'primary' ? undefined : 'bg-green-50 border-green-200 text-green-700',
    error: variant === 'primary' ? undefined : 'bg-red-50 border-red-200 text-red-600',
  };

  const primaryBg =
    variant === 'primary'
      ? {
          backgroundColor:
            state === 'success'
              ? '#16A34A'
              : state === 'error'
              ? '#DC2626'
              : accentColor || '#9A1E29',
        }
      : undefined;

  return (
    <button
      onClick={handleClick}
      disabled={isDisabled}
      aria-disabled={isDisabled}
      aria-busy={state === 'loading'}
      className={cn(
        'inline-flex items-center justify-center gap-2 font-bold transition-all duration-200 active:scale-[0.97]',
        'disabled:cursor-not-allowed',
        VARIANT_CLASSES[variant],
        SIZE_CLASSES[size],
        stateStyles[state],
        className
      )}
      style={primaryBg}
    >
      {stateContent[state]}
    </button>
  );
}
