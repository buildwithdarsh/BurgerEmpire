'use client';

import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

interface EmptyStateAction {
  label: string;
  onClick: () => void;
}

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: EmptyStateAction;
  className?: string;
  /** Accent color for the action button */
  accentColor?: string;
}

// Default empty state icon
function DefaultIcon() {
  return (
    <svg className="w-12 h-12 text-gray-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
    </svg>
  );
}

export default function EmptyState({
  icon,
  title,
  description,
  action,
  className,
  accentColor = '#6B7280',
}: EmptyStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center py-16 px-5 text-center', className)}>
      <div className="mb-4">
        {icon || <DefaultIcon />}
      </div>
      <h3 className="text-base font-bold text-gray-600 mb-1">{title}</h3>
      {description && (
        <p className="text-sm text-gray-400 max-w-sm mb-4">{description}</p>
      )}
      {action && (
        <button
          onClick={action.onClick}
          className="px-5 py-2 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90 active:scale-[0.97]"
          style={{ backgroundColor: accentColor }}
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
