import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { TZ } from '@/lib/tz';
import type { EndUser } from '@buildwithdarsh/sdk';

/** Extends SDK EndUser with client-only `isGuest` flag for guest browsing sessions. */
type User = EndUser & { isGuest: boolean };

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isInitialized: boolean;

  initialize: () => Promise<void>;
  login: (identifier: string, password: string) => Promise<void>;
  register: (data: { name: string; email?: string; phone: string; password: string; referralCode?: string }) => Promise<void>;
  loginAsGuest: () => Promise<void>;
  logout: () => void;
  setUser: (user: User) => void;
}

// Demo mode: user is always logged in with the mock user.
const DEMO_USER: User = {
  id: 'usr_demo_001',
  name: 'Abc User',
  email: 'abc@example.com',
  phone: '+91 90000 00000',
  orgId: 'demo',
  isGuest: false,
  isPhoneVerified: true,
  isEmailVerified: true,
  onboardingStep: 0,
  avatarUrl: null,
  referralCode: 'ABC2024',
  attributes: null,
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: DEMO_USER,
      isLoading: false,
      isInitialized: true,

      initialize: async () => {
        if (get().isInitialized && get().user) return;
        try {
          const profile = await TZ.storefront.auth.me();
          set({ user: { ...profile, isGuest: false } as User, isInitialized: true, isLoading: false });
        } catch {
          set({ user: null, isInitialized: true, isLoading: false });
        }
      },

      login: async (identifier: string, password: string) => {
        set({ isLoading: true });
        try {
          // The SDK expects email/phone separately; send identifier as both and let backend resolve
          const isPhone = /^\+?\d[\d\s-]{7,}$/.test(identifier);
          const res = await TZ.storefront.auth.login(isPhone ? { phone: identifier, password } : { email: identifier, password });
          if (res.user) set({ user: { ...res.user, isGuest: false } as User });
        } finally {
          set({ isLoading: false });
        }
      },

      register: async (data: { name: string; email?: string; phone: string; password: string; referralCode?: string }) => {
        set({ isLoading: true });
        try {
          const res = await TZ.storefront.auth.register(data);
          if (res.user) set({ user: { ...res.user, isGuest: false } as User });
        } finally {
          set({ isLoading: false });
        }
      },

      loginAsGuest: async () => {
        // Guest sessions removed — use demo user for browsing
        set({ user: DEMO_USER });
      },

      logout: () => {
        TZ.storefront.auth.logout().catch(() => {});
        set({ user: null, isInitialized: true });
      },

      setUser: (user) => set({ user }),
    }),
    {
      name: 'bb-auth',
      partialize: (state) => ({ user: state.user }),
    }
  )
);
