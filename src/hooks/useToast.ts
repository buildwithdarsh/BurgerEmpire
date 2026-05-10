'use client';

import { useCallback } from 'react';
import { useToastStore, type ToastAction, type ToastType } from '@/store/toast';

interface ToastOptions {
  description?: string;
  action?: ToastAction;
  duration?: number;
}

const DEFAULT_DURATIONS: Record<ToastType, number> = {
  success: 3000,
  error: 5000,
  warning: 4000,
  info: 3000,
};

export function useToast() {
  const addToast = useToastStore((s) => s.addToast);

  const createToast = useCallback(
    (type: ToastType, title: string, options?: ToastOptions) => {
      return addToast({
        type,
        title,
        description: options?.description,
        action: options?.action,
        duration: options?.duration ?? DEFAULT_DURATIONS[type],
      });
    },
    [addToast]
  );

  const toast = {
    success: (title: string, options?: ToastOptions) => createToast('success', title, options),
    error: (title: string, options?: ToastOptions) => createToast('error', title, options),
    warning: (title: string, options?: ToastOptions) => createToast('warning', title, options),
    info: (title: string, options?: ToastOptions) => createToast('info', title, options),
  };

  return { toast };
}
