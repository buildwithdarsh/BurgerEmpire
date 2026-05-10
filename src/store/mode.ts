import { create } from 'zustand';

export type Mode = 'classic' | 'healthy';

interface ModeState {
  mode: Mode;
  isTransitioning: boolean;
  toggleMode: () => void;
  setMode: (mode: Mode) => void;
  setTransitioning: (v: boolean) => void;
}

export const useModeStore = create<ModeState>((set, get) => ({
  mode: 'classic',
  isTransitioning: false,
  toggleMode: () => {
    const newMode = get().mode === 'classic' ? 'healthy' : 'classic';
    set({ isTransitioning: true });
    // Allow ripple to start before mode swap
    setTimeout(() => {
      set({ mode: newMode });
      if (typeof window !== 'undefined') {
        localStorage.setItem('burger-empire-mode', newMode);
        document.cookie = `burger-empire-mode=${newMode};path=/;max-age=31536000;SameSite=Lax`;
      }
    }, 150);
    // Transition complete
    setTimeout(() => {
      set({ isTransitioning: false });
    }, 800);
  },
  setMode: (mode) => {
    set({ mode });
    if (typeof window !== 'undefined') {
      document.cookie = `burger-empire-mode=${mode};path=/;max-age=31536000;SameSite=Lax`;
    }
  },
  setTransitioning: (v) => set({ isTransitioning: v }),
}));
