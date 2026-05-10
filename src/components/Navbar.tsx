'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useMode } from '@/hooks/useMode';
import { useConfig } from '@/hooks/useConfig';
import type { PublicConfig } from '@/hooks/useConfig';
import ModeToggle from './ModeToggle';
import NotificationBell from './NotificationBell';
import Logo from './Logo';
import { useCartStore } from '@/store/cart';
import { useAuthStore } from '@/store/auth';
import { motion, AnimatePresence } from 'framer-motion';
import { RocketIcon, LeafIcon } from '@/components/icons';

/* ── Navigation structure ── */

type NavChild = {
  label: string;
  href: string;
  description: string;
  isNew?: boolean;
  requiresLoyalty?: boolean;
  requiresStudentPass?: boolean;
};

type NavItem = {
  label: string;
  href?: string;
  children?: NavChild[];
};

const NAV_ITEMS: NavItem[] = [
  { label: 'Menu', href: '/menu' },
  {
    label: 'Offers',
    children: [
      { label: 'Combo Deals', href: '/combo-deals', description: 'Save more with bundles' },
      { label: 'Rewards', href: '/rewards', description: 'Earn & redeem points', requiresLoyalty: true },
    ],
  },
  {
    label: 'About Us',
    children: [
      { label: 'Our Story', href: '/our-story', description: 'How it all started' },
      { label: 'Find Us', href: '/find-us', description: 'Locate our restaurants' },
    ],
  },
  { label: 'Healthy', href: '/healthy' },
];

/* ── Desktop dropdown ── */

function NavDropdown({
  item,
  isTransparent,
  accent,
  pathname,
  config,
}: {
  item: NavItem;
  isTransparent: boolean;
  accent: string;
  pathname: string;
  config: PublicConfig;
}) {
  const [open, setOpen] = useState(false);
  const timeout = useRef<ReturnType<typeof setTimeout>>(undefined);
  const { isClassic } = useMode();

  const children = (item.children ?? []).filter((c) => {
    if (c.requiresLoyalty && !config.loyalty.enabled) return false;
    if (c.requiresStudentPass && !config.features.student_pass_enabled) return false;
    return true;
  });

  if (children.length === 0) return null;

  const isChildActive = children.some((c) => pathname === c.href);

  const handleEnter = () => {
    clearTimeout(timeout.current);
    setOpen(true);
  };
  const handleLeave = () => {
    timeout.current = setTimeout(() => setOpen(false), 150);
  };

  return (
    <div
      className="relative"
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      <button
        className="relative px-4 py-2 rounded-xl text-[0.75rem] font-semibold uppercase tracking-wide transition-all duration-200 group flex items-center gap-1"
        style={{
          color: isTransparent
            ? (isChildActive ? '#FFFFFF' : 'rgba(255,255,255,0.65)')
            : (isChildActive ? accent : '#6B7280'),
        }}
      >
        <span className="relative z-10">{item.label}</span>
        <svg
          width="10"
          height="10"
          viewBox="0 0 10 10"
          fill="none"
          className="transition-transform duration-200"
          style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}
        >
          <path d="M2.5 4L5 6.5L7.5 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        {/* Hover bg */}
        <span
          className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          style={{ backgroundColor: isTransparent ? 'rgba(255,255,255,0.08)' : '#F9FAFB' }}
        />
        {/* Active indicator */}
        {isChildActive && (
          <motion.span
            layoutId="nav-active"
            className="absolute bottom-0.5 left-4 right-4 h-[2px] rounded-full"
            style={{ backgroundColor: isTransparent ? '#FFFFFF' : accent }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          />
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="absolute top-full left-0 pt-2 z-50"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
          >
            <div
              className="min-w-[220px] rounded-2xl overflow-hidden py-2"
              style={{
                backgroundColor: 'rgba(255,255,255,0.97)',
                backdropFilter: 'blur(20px) saturate(180%)',
                WebkitBackdropFilter: 'blur(20px) saturate(180%)',
                boxShadow: '0 8px 32px rgba(0,0,0,0.1), 0 1px 4px rgba(0,0,0,0.05)',
                border: '1px solid rgba(0,0,0,0.06)',
              }}
            >
              {children.map((child) => {
                const isActive = pathname === child.href;
                return (
                  <Link
                    key={child.href}
                    href={child.href}
                    onClick={() => setOpen(false)}
                    className="flex flex-col px-4 py-2.5 transition-all duration-150 group/item"
                    style={{
                      backgroundColor: isActive ? (isClassic ? '#FAF8F4' : '#F0FAF3') : 'transparent',
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) e.currentTarget.style.backgroundColor = '#F9FAFB';
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    <span className="flex items-center gap-2">
                      <span
                        className="text-[0.8125rem] font-semibold"
                        style={{ color: isActive ? accent : '#374151' }}
                      >
                        {child.label}
                      </span>
                      {child.isNew && (
                        <span
                          className="px-1.5 py-0.5 rounded-full text-[0.5rem] font-black uppercase leading-none"
                          style={{ backgroundColor: accent, color: '#FFFFFF' }}
                        >
                          New
                        </span>
                      )}
                    </span>
                    <span className="text-[0.6875rem] text-gray-400 mt-0.5">
                      {child.description}
                    </span>
                  </Link>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ── Cart button ── */

function NavCartButton() {
  const { isClassic } = useMode();
  const toggleCart = useCartStore((s) => s.toggleDrawer);
  const totalItems = useCartStore((s) => s.totalItems());
  const accentBg = isClassic ? '#9A1E29' : '#4AA056';
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  return (
    <button
      onClick={toggleCart}
      className="relative inline-flex items-center gap-2 pl-4 pr-5 py-2.5 rounded-full text-[0.6875rem] font-bold uppercase tracking-wide transition-all duration-300 active:scale-[0.97] group"
      style={{
        backgroundColor: accentBg,
        color: '#FFFFFF',
      }}
    >
      <span className="absolute inset-0 rounded-full bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
      <span className="relative z-10 flex items-center gap-2">
        <svg className="w-4 h-4 transition-transform group-hover:-translate-y-px" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
        </svg>
        <span className="hidden sm:inline">Cart</span>
        <AnimatePresence>
          {mounted && totalItems > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="inline-flex items-center justify-center min-w-[20px] h-[20px] px-1 rounded-full text-[0.625rem] font-black"
              style={{ backgroundColor: 'rgba(255,255,255,0.25)' }}
            >
              {totalItems > 99 ? '99+' : totalItems}
            </motion.span>
          )}
        </AnimatePresence>
      </span>
    </button>
  );
}

/* ── Mobile accordion section ── */

function MobileNavSection({
  item,
  accent,
  isClassic,
  pathname,
  config,
  onClose,
  index,
}: {
  item: NavItem;
  accent: string;
  isClassic: boolean;
  pathname: string;
  config: PublicConfig;
  onClose: () => void;
  index: number;
}) {
  const [expanded, setExpanded] = useState(false);

  const children = (item.children ?? []).filter((c) => {
    if (c.requiresLoyalty && !config.loyalty.enabled) return false;
    if (c.requiresStudentPass && !config.features.student_pass_enabled) return false;
    return true;
  });

  if (children.length === 0) return null;

  const isChildActive = children.some((c) => pathname === c.href);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center justify-between w-full px-6 py-3.5 text-[0.875rem] font-semibold transition-all duration-200"
        style={{
          color: isChildActive ? accent : '#374151',
          backgroundColor: isChildActive ? (isClassic ? '#FAF8F4' : '#F0FAF3') : 'transparent',
          borderLeft: isChildActive ? `3px solid ${accent}` : '3px solid transparent',
        }}
      >
        {item.label}
        <svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          className="transition-transform duration-200"
          style={{ transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)', color: '#9CA3AF' }}
        >
          <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            {children.map((child) => {
              const isActive = pathname === child.href;
              return (
                <Link
                  key={child.href}
                  href={child.href}
                  onClick={onClose}
                  className="flex items-center pl-10 pr-6 py-3 text-[0.8125rem] font-medium transition-all duration-200"
                  style={{
                    color: isActive ? accent : '#6B7280',
                    backgroundColor: isActive ? (isClassic ? '#FAF8F4' : '#F0FAF3') : 'transparent',
                  }}
                >
                  {child.label}
                  {child.isNew && (
                    <span
                      className="ml-2 px-1.5 py-0.5 rounded-full text-[0.5rem] font-black uppercase leading-none"
                      style={{ backgroundColor: accent, color: '#FFFFFF' }}
                    >
                      New
                    </span>
                  )}
                  {isActive && (
                    <span className="ml-auto w-1.5 h-1.5 rounded-full" style={{ backgroundColor: accent }} />
                  )}
                </Link>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ── Main Navbar ── */

export default function Navbar() {
  const { isClassic } = useMode();
  const { config } = useConfig();
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const toggleCart = useCartStore((s) => s.toggleDrawer);
  const user = useAuthStore((s) => s.user);

  const isHome = pathname === '/';
  const isTransparent = isHome && !isScrolled;
  const accent = isClassic ? '#EB7A29' : '#4AA056';
  const accentBg = isClassic ? '#9A1E29' : '#4AA056';

  useEffect(() => {
    const handler = () => setIsScrolled(window.scrollY > 50);
    handler(); // check on mount
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  // Build flat mobile links list for direct-link items + sections for dropdown items
  const mobileDirectLinks = NAV_ITEMS.filter((item) => item.href);
  const mobileDropdowns = NAV_ITEMS.filter((item) => item.children);

  return (
    <>
      {/* Main navbar */}
      <nav
        className="sticky top-0 left-0 right-0 z-50 transition-all duration-500"
        style={{
          backgroundColor: isTransparent ? 'transparent' : 'rgba(255, 255, 255, 0.85)',
          backdropFilter: isTransparent ? 'none' : 'blur(20px) saturate(180%)',
          WebkitBackdropFilter: isTransparent ? 'none' : 'blur(20px) saturate(180%)',
          borderBottom: isScrolled ? '1px solid rgba(0,0,0,0.06)' : 'none',
          boxShadow: isScrolled && !isTransparent ? '0 1px 20px rgba(0,0,0,0.04)' : 'none',
        }}
      >
        {/* Top promo strip */}
        <div
          className="w-full py-1.5 text-center text-[0.6875rem] font-medium tracking-wide "
          style={{
            backgroundColor: isTransparent
              ? (isClassic ? 'rgb(190 100 33)' : 'rgb(60 130 70)')
              : (isClassic ? '#1A1A1A' : '#1C2B1E'),
            color: isTransparent ? (isClassic ? '#4A2200' : '#FFFFFF') : (isClassic ? '#EB7A29' : '#6ff891'),
          }}
        >
          <span className="inline-flex items-center gap-1.5">
            {isClassic ? (
              <><RocketIcon size={11} color="currentColor" className="inline-block" /> FREE delivery over {config?.branding?.currency_symbol || '₹'}{config.delivery.free_above} — Your burger is waiting!</>
            ) : (
              <><LeafIcon size={11} color="currentColor" className="inline-block" /> 2x Health Points on every Healthy order — Start earning!</>
            )}
          </span>
        </div>

        <div className="max-w-[1200px] mx-auto w-full px-5 flex items-center h-[60px]">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 mr-10 flex-shrink-0 group">
            <div className="transition-transform duration-300 group-hover:scale-105">
              <Logo size={40} />
            </div>
            <div className="hidden sm:block">
              <div
                className="text-[0.9375rem] font-extrabold leading-tight transition-colors duration-300 tracking-tight"
                style={{ color: isTransparent ? '#FFFFFF' : '#1A1A1A' }}
              >
                {config?.branding?.name || 'Burger Empire'}
              </div>
              <div
                className="text-[0.5625rem] font-semibold uppercase tracking-[0.15em] transition-colors duration-500"
                style={{ color: isTransparent ? 'rgba(255,255,255,0.5)' : accent }}
              >
                {config?.branding?.tagline || (isClassic ? 'Burgers that love you back' : 'Eat Clean, Live Royal')}
              </div>
            </div>
          </Link>

          {/* Desktop links */}
          <div className="hidden lg:flex items-center gap-1 flex-1">
            {NAV_ITEMS.map((item) => {
              if (item.children) {
                return (
                  <NavDropdown
                    key={item.label}
                    item={item}
                    isTransparent={isTransparent}
                    accent={accent}
                    pathname={pathname}
                    config={config}
                  />
                );
              }

              const isActive = pathname === item.href;
              const isHealthy = item.href === '/healthy';
              return (
                <Link
                  key={item.href}
                  href={item.href!}
                  className="relative px-4 py-2 rounded-xl text-[0.75rem] font-semibold uppercase tracking-wide transition-all duration-200 group"
                  style={{
                    color: isTransparent
                      ? (isActive ? '#FFFFFF' : 'rgba(255,255,255,0.65)')
                      : (isActive ? accent : '#6B7280'),
                  }}
                >
                  <span className="relative z-10 flex items-center gap-1.5">
                    {isHealthy && (
                      <span className="inline-block w-1.5 h-1.5 rounded-full" style={{ backgroundColor: '#4AA056' }} />
                    )}
                    {item.label}
                  </span>
                  {/* Hover bg */}
                  <span
                    className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                    style={{
                      backgroundColor: isTransparent ? 'rgba(255,255,255,0.08)' : '#F9FAFB',
                    }}
                  />
                  {/* Active indicator */}
                  {isActive && (
                    <motion.span
                      layoutId="nav-active"
                      className="absolute bottom-0.5 left-4 right-4 h-[2px] rounded-full"
                      style={{ backgroundColor: isTransparent ? '#FFFFFF' : accent }}
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2 ml-auto">
            {/* Mode toggle */}
            <div className="hidden md:block">
              <ModeToggle />
            </div>

            {/* Location pin */}
            <Link
              href="/find-us"
              className="hidden md:flex items-center gap-1.5 px-3 py-2 rounded-xl text-[0.6875rem] font-medium transition-all duration-200 group"
              style={{
                color: isTransparent ? 'rgba(255,255,255,0.55)' : '#9CA3AF',
              }}
            >
              <svg className="w-3.5 h-3.5 transition-transform group-hover:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="hidden xl:inline">Find Us</span>
            </Link>

            {/* User/Orders link */}
            {user && !user.isGuest && (
              <Link
                href="/orders"
                className="hidden md:flex items-center gap-1.5 px-3 py-2 rounded-xl text-[0.6875rem] font-medium transition-all duration-200 group"
                style={{
                  color: isTransparent ? 'rgba(255,255,255,0.55)' : '#9CA3AF',
                }}
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span className="hidden xl:inline">{user.name || 'Account'}</span>
              </Link>
            )}

            {/* Notifications */}
            <div className="hidden md:block">
              <NotificationBell />
            </div>

            {/* Cart CTA */}
            <NavCartButton />

            {/* Mobile hamburger */}
            <button
              className="lg:hidden flex flex-col items-center justify-center w-10 h-10 rounded-xl transition-colors hover:bg-black/5"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="rounded-full transition-all duration-300"
                  style={{
                    width: i === 1 ? '14px' : '18px',
                    height: '2px',
                    backgroundColor: isTransparent ? '#FFFFFF' : '#374151',
                    margin: i === 1 ? '3px 0' : 0,
                    opacity: i === 1 && mobileOpen ? 0 : 1,
                    transform: i === 0 && mobileOpen ? 'rotate(45deg) translate(2px, 2px)'
                      : i === 2 && mobileOpen ? 'rotate(-45deg) translate(2px, -2px)' : 'none',
                    marginLeft: i === 1 ? '4px' : 0,
                  }}
                />
              ))}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu overlay */}
      <AnimatePresence>
        {mobileOpen && (
            <div className="fixed inset-0 z-[60] lg:hidden">
            <motion.div
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
            />

            <motion.div
              className="absolute right-0 top-0 bottom-0 w-[300px] bg-white flex flex-col"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
              {/* Mobile menu header */}
              <div className="flex items-center justify-between p-5 border-b border-gray-50">
                <div className="flex items-center gap-2.5">
                  <Logo size={32} />
                  <span className="text-sm font-bold text-gray-900">{config?.branding?.name || 'Burger Empire'}</span>
                </div>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 transition-colors"
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="M1 1L13 13M13 1L1 13" />
                  </svg>
                </button>
              </div>

              {/* Mobile links */}
              <div className="flex-1 py-3 overflow-y-auto">
                {/* Direct links */}
                {mobileDirectLinks.map((item, i) => {
                  const isActive = pathname === item.href;
                  return (
                    <motion.div
                      key={item.href}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <Link
                        href={item.href!}
                        onClick={() => setMobileOpen(false)}
                        className="flex items-center px-6 py-3.5 text-[0.875rem] font-semibold transition-all duration-200"
                        style={{
                          color: isActive ? accent : '#374151',
                          backgroundColor: isActive ? (isClassic ? '#FAF8F4' : '#F0FAF3') : 'transparent',
                          borderLeft: isActive ? `3px solid ${accent}` : '3px solid transparent',
                        }}
                      >
                        {item.href === '/healthy' && (
                          <span className="inline-block w-2 h-2 rounded-full mr-2" style={{ backgroundColor: '#4AA056' }} />
                        )}
                        {item.label}
                        {isActive && (
                          <span className="ml-auto w-1.5 h-1.5 rounded-full" style={{ backgroundColor: accent }} />
                        )}
                      </Link>
                    </motion.div>
                  );
                })}

                {/* Dropdown sections */}
                <div className="border-t border-gray-100 mt-2 pt-2">
                  <p className="px-6 py-1.5 text-[0.625rem] font-bold text-gray-300 uppercase tracking-[0.15em]">More</p>
                  {mobileDropdowns.map((item, i) => (
                    <MobileNavSection
                      key={item.label}
                      item={item}
                      accent={accent}
                      isClassic={isClassic}
                      pathname={pathname}
                      config={config}
                      onClose={() => setMobileOpen(false)}
                      index={mobileDirectLinks.length + i}
                    />
                  ))}
                </div>

                {/* Account section */}
                <div className="border-t border-gray-100 mt-2 pt-2">
                  {user && !user.isGuest ? (
                    <>
                      <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                      >
                        <Link
                          href="/account"
                          onClick={() => setMobileOpen(false)}
                          className="flex items-center px-6 py-3.5 text-[0.875rem] font-semibold transition-all duration-200"
                          style={{
                            color: pathname === '/account' ? accent : '#374151',
                            backgroundColor: pathname === '/account' ? (isClassic ? '#FAF8F4' : '#F0FAF3') : 'transparent',
                            borderLeft: pathname === '/account' ? `3px solid ${accent}` : '3px solid transparent',
                          }}
                        >
                          <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          {user.name || 'My Account'}
                        </Link>
                      </motion.div>
                      <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.35 }}
                      >
                        <Link
                          href="/orders"
                          onClick={() => setMobileOpen(false)}
                          className="flex items-center px-6 py-3.5 text-[0.875rem] font-semibold transition-all duration-200"
                          style={{
                            color: pathname === '/orders' ? accent : '#374151',
                            backgroundColor: pathname === '/orders' ? (isClassic ? '#FAF8F4' : '#F0FAF3') : 'transparent',
                            borderLeft: pathname === '/orders' ? `3px solid ${accent}` : '3px solid transparent',
                          }}
                        >
                          <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                          </svg>
                          My Orders
                        </Link>
                      </motion.div>
                    </>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      <Link
                        href="/account"
                        onClick={() => setMobileOpen(false)}
                        className="flex items-center px-6 py-3.5 text-[0.875rem] font-semibold text-gray-500 transition-all duration-200"
                        style={{ borderLeft: '3px solid transparent' }}
                      >
                        <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        Sign In
                      </Link>
                    </motion.div>
                  )}
                </div>
              </div>

              {/* Mobile footer */}
              <div className="p-5 border-t border-gray-100 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[0.6875rem] font-bold text-gray-400 uppercase tracking-wider">Mode</span>
                  <ModeToggle />
                </div>
                <button
                  onClick={() => { setMobileOpen(false); toggleCart(); }}
                  className="flex items-center justify-center gap-2 w-full py-3 rounded-2xl text-[0.75rem] font-bold text-white uppercase tracking-wide transition-all duration-300 active:scale-[0.97]"
                  style={{ backgroundColor: accentBg }}
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
                  </svg>
                  View Cart
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
