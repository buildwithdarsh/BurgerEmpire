'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import { cn } from '@/lib/cn';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'default';
  isLoading?: boolean;
  icon?: ReactNode;
}

// Default warning icon
function WarningIcon() {
  return (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
    </svg>
  );
}

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'default',
  isLoading = false,
  icon,
}: ConfirmModalProps) {
  const confirmRef = useRef<HTMLButtonElement>(null);

  // Focus the confirm button when modal opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => confirmRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    function handleEsc(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const isDanger = variant === 'danger';

  return (
    <div
      className="fixed inset-0 z-[9997] flex items-center justify-center p-4 bg-black/50"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-title"
    >
      <div
        className="bg-white rounded-2xl max-w-sm w-full p-6 animate-[toastSlideIn_0.2s_ease-out]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Icon */}
        <div
          className={cn(
            'w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4',
            isDanger ? 'bg-red-50 text-red-500' : 'bg-gray-100 text-gray-500'
          )}
        >
          {icon || <WarningIcon />}
        </div>

        <h3
          id="confirm-title"
          className="text-lg font-bold text-gray-900 text-center mb-1"
        >
          {title}
        </h3>

        {description && (
          <p className="text-sm text-gray-500 text-center mb-6">{description}</p>
        )}

        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            {cancelLabel}
          </button>
          <button
            ref={confirmRef}
            onClick={onConfirm}
            disabled={isLoading}
            className={cn(
              'flex-1 py-2.5 rounded-xl text-sm font-bold text-white transition-all disabled:opacity-50 flex items-center justify-center gap-2',
              isDanger ? 'bg-red-500 hover:bg-red-600' : 'bg-gray-900 hover:bg-gray-800'
            )}
          >
            {isLoading && (
              <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
            )}
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
