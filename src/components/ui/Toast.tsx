'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useToastStore, type Toast as ToastType, type ToastType as TType } from '@/store/toast';
import { cn } from '@/lib/cn';

// ── Inline SVG Icons (no external library) ──

function SuccessIcon() {
  return (
    <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function ErrorIcon() {
  return (
    <svg className="w-5 h-5 text-red-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
    </svg>
  );
}

function WarningIcon() {
  return (
    <svg className="w-5 h-5 text-amber-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
    </svg>
  );
}

function InfoIcon() {
  return (
    <svg className="w-5 h-5 text-blue-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}

const ICON_MAP: Record<TType, () => React.ReactElement> = {
  success: SuccessIcon,
  error: ErrorIcon,
  warning: WarningIcon,
  info: InfoIcon,
};

const BORDER_COLORS: Record<TType, string> = {
  success: 'border-l-green-500',
  error: 'border-l-red-500',
  warning: 'border-l-amber-500',
  info: 'border-l-blue-500',
};

// ── Single Toast Item ──

function ToastItem({ toast }: { toast: ToastType }) {
  const removeToast = useToastStore((s) => s.removeToast);
  const [isExiting, setIsExiting] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    timerRef.current = setTimeout(() => {
      setIsExiting(true);
      setTimeout(() => removeToast(toast.id), 300);
    }, toast.duration);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [toast.id, toast.duration, removeToast]);

  const handleDismiss = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setIsExiting(true);
    setTimeout(() => removeToast(toast.id), 300);
  };

  const Icon = ICON_MAP[toast.type];

  return (
    <div
      role={toast.type === 'error' ? 'alert' : 'status'}
      aria-live={toast.type === 'error' ? 'assertive' : 'polite'}
      className={cn(
        'relative flex items-start gap-3 w-full max-w-sm bg-white rounded-xl shadow-lg border border-gray-100 border-l-4 p-4',
        'transition-all duration-300 ease-out',
        BORDER_COLORS[toast.type],
        isExiting ? 'opacity-0 translate-x-4' : 'opacity-100 translate-x-0',
        // Entry animation is handled via CSS animation class
        !isExiting && 'animate-[toastSlideIn_0.3s_ease-out]'
      )}
    >
      <Icon />

      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-gray-900 leading-tight">
          {toast.title}
        </p>
        {toast.description && (
          <p className="text-[0.8125rem] text-gray-500 mt-0.5 line-clamp-2 leading-snug">
            {toast.description}
          </p>
        )}
        {toast.action && (
          <button
            onClick={() => {
              toast.action!.onClick();
              handleDismiss();
            }}
            className="mt-1.5 text-[0.8125rem] font-semibold text-blue-600 hover:text-blue-700 transition-colors"
          >
            {toast.action.label}
          </button>
        )}
      </div>

      <button
        onClick={handleDismiss}
        className="flex-shrink-0 p-0.5 rounded-lg text-gray-300 hover:text-gray-500 hover:bg-gray-50 transition-colors"
        aria-label="Dismiss notification"
      >
        <CloseIcon />
      </button>
    </div>
  );
}

// ── Toast Container (rendered at root) ──

export default function ToastContainer() {
  const toasts = useToastStore((s) => s.toasts);

  if (toasts.length === 0) return null;

  return (
    <div
      aria-label="Notifications"
      className={cn(
        'fixed z-[9999] flex flex-col gap-2 pointer-events-none',
        // Desktop: top-right. Mobile: top-center
        'top-4 right-4 left-4 sm:left-auto sm:right-6 sm:top-6',
        'items-center sm:items-end'
      )}
    >
      {toasts.map((toast) => (
        <div key={toast.id} className="pointer-events-auto w-full sm:w-auto">
          <ToastItem toast={toast} />
        </div>
      ))}
    </div>
  );
}
