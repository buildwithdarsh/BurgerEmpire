'use client';

import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useMode } from '@/hooks/useMode';
import Logo from './Logo';
import { useCartStore } from '@/store/cart';
import NotificationBell from './NotificationBell';
import { useState, useEffect } from 'react';

const ROUTE_TITLES: Record<string, string> = {
  '/': 'Burger Empire',
  '/menu': 'Menu',
  '/combo-deals': 'Combo Deals',
  '/healthy': 'Healthy',
  '/our-story': 'Our Story',
  '/find-us': 'Find Us',
  '/orders': 'My Orders',
  '/account': 'Account',
  '/student': 'Student Pass',
  '/rewards': 'Rewards',
  '/blog': 'Blog',
  '/order-online': 'Order Online',
  '/help': 'Help',
  '/privacy': 'Privacy',
  '/terms': 'Terms',
  '/gift-cards': 'Gift Cards',
  '/meal-plans': 'Meal Plans',
  '/reservations': 'Reservations',
  '/support': 'Support',
};

// Prefix-based titles for dynamic routes (e.g. /orders/[id] → "Order Details")
const PREFIX_TITLES: [string, string][] = [
  ['/orders/', 'Order Details'],
  ['/blog/', 'Blog'],
  ['/menu/', 'Menu'],
  ['/admin/', 'Admin'],
];

function getTitle(pathname: string): string {
  if (ROUTE_TITLES[pathname]) return ROUTE_TITLES[pathname];
  for (const [prefix, title] of PREFIX_TITLES) {
    if (pathname.startsWith(prefix)) return title;
  }
  const segment = pathname.split('/').filter(Boolean).pop();
  if (!segment) return 'Burger Empire';
  return segment
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function MobileHeader() {
  const router = useRouter();
  const pathname = usePathname();
  const { isClassic } = useMode();
  const totalItems = useCartStore((s) => s.totalItems());
  const toggleCart = useCartStore((s) => s.toggleDrawer);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isHome = pathname === '/';
  const title = getTitle(pathname);

  return (
    <header
      className="sticky top-0 z-50 md:hidden"
      style={{
        paddingTop: 'env(safe-area-inset-top, 0px)',
        backgroundColor: 'rgba(255, 255, 255, 0.85)',
        backdropFilter: 'blur(20px) saturate(180%)',
        WebkitBackdropFilter: 'blur(20px) saturate(180%)',
        borderBottom: '1px solid rgba(0, 0, 0, 0.06)',
      }}
    >
      <div className="flex items-center h-14 px-4">
        {/* Left: Logo on home, back button on subpages */}
        {isHome ? (
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <Logo size={32} />
            <span className="text-[0.9375rem] font-extrabold text-gray-900 tracking-tight">
              Burger Empire
            </span>
          </Link>
        ) : (
          <button
            onClick={() => router.back()}
            className="flex items-center justify-center w-10 h-10 -ml-2 rounded-xl active:scale-[0.95] transition-transform"
            style={{ touchAction: 'manipulation' }}
            aria-label="Go back"
          >
            <svg
              className="w-5 h-5 text-gray-700"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 19.5L8.25 12l7.5-7.5"
              />
            </svg>
          </button>
        )}

        {/* Center: Page title (non-home pages) */}
        {!isHome && (
          <h1 className="absolute left-1/2 -translate-x-1/2 text-[0.9375rem] font-bold text-gray-900 truncate max-w-[55%] text-center pointer-events-none">
            {title}
          </h1>
        )}

        {/* Right: Notifications + Cart */}
        <div className="ml-auto flex items-center gap-0.5">
        <NotificationBell />
        <button
          onClick={toggleCart}
          className="relative flex items-center justify-center w-10 h-10 rounded-xl active:scale-[0.95] transition-transform"
          style={{ touchAction: 'manipulation' }}
          aria-label="Open cart"
        >
          <svg
            className="w-[22px] h-[22px] text-gray-700"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
            />
          </svg>
          {mounted && totalItems > 0 && (
            <span
              className="absolute top-0 right-0 min-w-[18px] h-[18px] flex items-center justify-center rounded-full text-[0.625rem] font-black text-white px-1"
              style={{
                backgroundColor: isClassic ? '#9A1E29' : '#4AA056',
                animation: 'badgePop 0.3s var(--bounce-entry)',
              }}
            >
              {totalItems > 99 ? '99+' : totalItems}
            </span>
          )}
        </button>
        </div>
      </div>
    </header>
  );
}
