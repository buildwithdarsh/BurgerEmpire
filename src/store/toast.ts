'use client';

import { create } from 'zustand';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastAction {
  label: string;
  onClick: () => void;
}

export interface Toast {
  id: string;
  type: ToastType;
  title: string;
  description?: string;
  action?: ToastAction;
  duration: number; // ms
  createdAt: number;
}

interface ToastStore {
  toasts: Toast[];
  queue: Toast[];
  addToast: (toast: Omit<Toast, 'id' | 'createdAt'>) => string;
  removeToast: (id: string) => void;
  promoteFromQueue: () => void;
}

const MAX_VISIBLE = 3;

let toastCounter = 0;

export const useToastStore = create<ToastStore>((set, get) => ({
  toasts: [],
  queue: [],

  addToast: (toast) => {
    const id = `toast-${++toastCounter}-${Date.now()}`;
    const newToast: Toast = { ...toast, id, createdAt: Date.now() };

    const { toasts } = get();

    if (toasts.length >= MAX_VISIBLE) {
      set((s) => ({ queue: [...s.queue, newToast] }));
    } else {
      set((s) => ({ toasts: [...s.toasts, newToast] }));
    }

    return id;
  },

  removeToast: (id) => {
    set((s) => ({
      toasts: s.toasts.filter((t) => t.id !== id),
      queue: s.queue.filter((t) => t.id !== id),
    }));
    // After removing, promote from queue
    setTimeout(() => get().promoteFromQueue(), 50);
  },

  promoteFromQueue: () => {
    set((s) => {
      if (s.queue.length === 0 || s.toasts.length >= MAX_VISIBLE) return s;
      const [next, ...rest] = s.queue;
      return { toasts: [...s.toasts, next], queue: rest };
    });
  },
}));
