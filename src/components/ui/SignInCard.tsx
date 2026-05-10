'use client';

import { useState, type ReactNode } from 'react';
import AuthModal from '@/components/auth/AuthModal';

interface SignInCardProps {
  /** Icon shown above the title */
  icon?: ReactNode;
  /** Heading text */
  title: string;
  /** Supporting description */
  description: string;
  /** Button label — defaults to "Sign In / Register" */
  buttonLabel?: string;
  /** Accent color (hex) for the button */
  accentColor?: string;
  /** Optional secondary action (e.g. "or add a new address") */
  secondaryAction?: { label: string; onClick: () => void };
  /** Called after successful auth */
  onAuthSuccess?: () => void;
  /**
   * Layout variant:
   * - "page"  → centered full-height (for full-page guards like Account, Rewards)
   * - "inline" → compact card (for sections like checkout address, reservation history)
   */
  variant?: 'page' | 'inline';
  /** Background color for page variant */
  backgroundColor?: string;
  className?: string;
}

// Default lock/user icon
function DefaultIcon({ color }: { color: string }) {
  return (
    <svg
      className="w-12 h-12 mx-auto"
      fill="none"
      viewBox="0 0 24 24"
      stroke={color}
      strokeWidth={1.2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
      />
    </svg>
  );
}

export default function SignInCard({
  icon,
  title,
  description,
  buttonLabel = 'Sign In / Register',
  accentColor = '#9A1E29',
  secondaryAction,
  onAuthSuccess,
  variant = 'inline',
  backgroundColor,
  className,
}: SignInCardProps) {
  const [showAuth, setShowAuth] = useState(false);

  const isPage = variant === 'page';

  return (
    <>
      <div
        className={
          isPage
            ? `min-h-screen flex flex-col items-center justify-center px-5 ${className || ''}`
            : `bg-white rounded-2xl border border-gray-100 p-6 text-center ${className || ''}`
        }
        style={isPage && backgroundColor ? { backgroundColor } : undefined}
      >
        <div className={isPage ? 'text-center' : ''}>
          <div className="mb-4">
            {icon || <DefaultIcon color={accentColor} />}
          </div>

          <h2
            className={`font-bold text-gray-900 ${
              isPage ? 'text-lg mb-2' : 'text-base mb-1'
            }`}
          >
            {title}
          </h2>

          <p
            className={`text-gray-500 ${
              isPage ? 'text-sm mb-5 max-w-sm mx-auto' : 'text-[0.8125rem] mb-4 max-w-xs mx-auto'
            }`}
          >
            {description}
          </p>

          <button
            onClick={() => setShowAuth(true)}
            className={`font-bold text-white transition-all hover:opacity-90 active:scale-[0.97] ${
              isPage
                ? 'px-6 py-2.5 rounded-full text-sm'
                : 'px-5 py-2.5 rounded-xl text-sm'
            }`}
            style={{ backgroundColor: accentColor }}
          >
            {buttonLabel}
          </button>

          {secondaryAction && (
            <button
              onClick={secondaryAction.onClick}
              className="block mx-auto mt-2.5 text-xs font-semibold transition-colors hover:opacity-80"
              style={{ color: accentColor }}
            >
              {secondaryAction.label}
            </button>
          )}
        </div>
      </div>

      <AuthModal
        isOpen={showAuth}
        onClose={() => {
          setShowAuth(false);
          onAuthSuccess?.();
        }}
      />
    </>
  );
}
