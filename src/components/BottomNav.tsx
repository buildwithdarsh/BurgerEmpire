'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useMode } from '@/hooks/useMode';
import { useCartStore } from '@/store/cart';
import { useState, useEffect } from 'react';

type Tab = {
  label: string;
  href?: string;
  action?: 'cart';
  icon: (active: boolean) => React.ReactNode;
  match?: (pathname: string) => boolean;
};

const tabs: Tab[] = [
  {
    label: 'Home',
    href: '/',
    icon: (active) => (
      <svg
        className="w-6 h-6"
        fill={active ? 'currentColor' : 'none'}
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={active ? 0 : 1.5}
      >
        {active ? (
          <path d="M11.47 3.84a.75.75 0 011.06 0l8.69 8.69a.75.75 0 01-.53 1.28H18.75v7.5a.75.75 0 01-.75.75h-3.75a.75.75 0 01-.75-.75v-4.5a.75.75 0 00-.75-.75h-1.5a.75.75 0 00-.75.75v4.5a.75.75 0 01-.75.75H6a.75.75 0 01-.75-.75v-7.5H3.31a.75.75 0 01-.53-1.28l8.69-8.69z" />
        ) : (
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
          />
        )}
      </svg>
    ),
    match: (p) => p === '/',
  },
  {
    label: 'Menu',
    href: '/menu',
    icon: (active) => (
      <svg
        className="w-6 h-6"
        fill={active ? 'currentColor' : 'none'}
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={active ? 0 : 1.5}
      >
        {active ? (
          <path
            fillRule="evenodd"
            d="M3 6a3 3 0 013-3h2.25a3 3 0 013 3v2.25a3 3 0 01-3 3H6a3 3 0 01-3-3V6zm9.75 0a3 3 0 013-3H18a3 3 0 013 3v2.25a3 3 0 01-3 3h-2.25a3 3 0 01-3-3V6zM3 15.75a3 3 0 013-3h2.25a3 3 0 013 3V18a3 3 0 01-3 3H6a3 3 0 01-3-3v-2.25zm9.75 0a3 3 0 013-3H18a3 3 0 013 3V18a3 3 0 01-3 3h-2.25a3 3 0 01-3-3v-2.25z"
            clipRule="evenodd"
          />
        ) : (
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z"
          />
        )}
      </svg>
    ),
    match: (p) => p.startsWith('/menu'),
  },
  {
    label: 'Cart',
    action: 'cart',
    icon: (active) => (
      <svg
        className="w-6 h-6"
        fill={active ? 'currentColor' : 'none'}
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={active ? 0 : 1.5}
      >
        {active ? (
          <path
            fillRule="evenodd"
            d="M7.5 6v.75H5.513c-.96 0-1.764.724-1.865 1.679l-1.263 12A1.875 1.875 0 004.25 22.5h15.5a1.875 1.875 0 001.865-2.071l-1.263-12a1.875 1.875 0 00-1.865-1.679H16.5V6a4.5 4.5 0 10-9 0zM12 3a3 3 0 00-3 3v.75h6V6a3 3 0 00-3-3zm-3 8.25a3 3 0 106 0v-.75a.75.75 0 011.5 0v.75a4.5 4.5 0 11-9 0v-.75a.75.75 0 011.5 0v.75z"
            clipRule="evenodd"
          />
        ) : (
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
          />
        )}
      </svg>
    ),
  },
  {
    label: 'Offers',
    href: '/combo-deals',
    icon: (active) => (
      <svg
        className="w-6 h-6"
        fill={active ? 'currentColor' : 'none'}
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={active ? 0 : 1.5}
      >
        {active ? (
          <path
            fillRule="evenodd"
            d="M5.25 2.25a3 3 0 00-3 3v4.318a3 3 0 00.879 2.121l9.58 9.581c.92.92 2.39.92 3.31 0l4.318-4.318a2.343 2.343 0 000-3.311l-9.58-9.581a3 3 0 00-2.121-.879H5.25zM6.375 7.5a1.125 1.125 0 100-2.25 1.125 1.125 0 000 2.25z"
            clipRule="evenodd"
          />
        ) : (
          <>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 6h.008v.008H6V6z"
            />
          </>
        )}
      </svg>
    ),
    match: (p) =>
      p.startsWith('/combo-deals') ||
      p.startsWith('/rewards'),
  },
  {
    label: 'Account',
    href: '/account',
    icon: (active) => (
      <svg
        className="w-6 h-6"
        fill={active ? 'currentColor' : 'none'}
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={active ? 0 : 1.5}
      >
        {active ? (
          <path
            fillRule="evenodd"
            d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z"
            clipRule="evenodd"
          />
        ) : (
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
          />
        )}
      </svg>
    ),
    match: (p) => p.startsWith('/account') || p.startsWith('/orders'),
  },
];

export default function BottomNav() {
  const pathname = usePathname();
  const { isClassic } = useMode();
  const toggleCart = useCartStore((s) => s.toggleDrawer);
  const totalItems = useCartStore((s) => s.totalItems());
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const accent = isClassic ? '#EB7A29' : '#4AA056';
  const badgeBg = isClassic ? '#9A1E29' : '#4AA056';

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 md:hidden"
      style={{
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
        backgroundColor: 'rgba(255, 255, 255, 0.92)',
        backdropFilter: 'blur(20px) saturate(180%)',
        WebkitBackdropFilter: 'blur(20px) saturate(180%)',
        borderTop: '1px solid rgba(0, 0, 0, 0.06)',
      }}
    >
      <div className="flex items-center justify-around h-16 px-1">
        {tabs.map((tab) => {
          const isActive = tab.match ? tab.match(pathname) : false;
          const isCart = tab.action === 'cart';

          const content = (
            <div className="flex flex-col items-center gap-0.5 min-w-[48px] min-h-[44px] justify-center relative">
              <div className="relative">
                <span style={{ color: isActive ? accent : '#9CA3AF' }}>
                  {tab.icon(isActive)}
                </span>
                {isCart && mounted && totalItems > 0 && (
                  <span
                    className="absolute -top-1.5 -right-2.5 min-w-[16px] h-[16px] flex items-center justify-center rounded-full text-[0.5625rem] font-black text-white px-0.5"
                    style={{
                      backgroundColor: badgeBg,
                      animation: 'badgePop 0.3s var(--bounce-entry)',
                    }}
                  >
                    {totalItems > 99 ? '99+' : totalItems}
                  </span>
                )}
              </div>
              <span
                className="text-[0.625rem] font-semibold leading-none"
                style={{ color: isActive ? accent : '#9CA3AF' }}
              >
                {tab.label}
              </span>
              {/* Active indicator dot */}
              {isActive && (
                <span
                  className="absolute -bottom-1 w-1 h-1 rounded-full"
                  style={{ backgroundColor: accent }}
                />
              )}
            </div>
          );

          if (isCart) {
            return (
              <button
                key="cart"
                onClick={toggleCart}
                className="active:scale-[0.93] transition-transform"
                style={{ touchAction: 'manipulation' }}
                aria-label="Open cart"
              >
                {content}
              </button>
            );
          }

          return (
            <Link
              key={tab.href}
              href={tab.href!}
              className="active:scale-[0.93] transition-transform"
              style={{ touchAction: 'manipulation' }}
              prefetch
            >
              {content}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
