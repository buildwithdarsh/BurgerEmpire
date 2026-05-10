'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { useAuthStore } from '@/store/auth';
import { TZ } from '@/lib/tz';
import type { Notification } from '@buildwithdarsh/sdk';
import { AnimatePresence, motion } from 'framer-motion';
import Skeleton from '@/components/Skeleton';

export default function NotificationBell() {
  const { user, isInitialized } = useAuthStore();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const panelRef = useRef<HTMLDivElement>(null);

  const userIdRef = useRef(user?.id);
  userIdRef.current = user?.id;
  const isGuestRef = useRef(user?.isGuest);
  isGuestRef.current = user?.isGuest;

  const load = useCallback(async () => {
    if (!userIdRef.current || isGuestRef.current) return;
    try {
      const res = await TZ.storefront.notifications.list();
      const items = Array.isArray(res) ? res : (res as any)?.data ?? [];
      setNotifications(items);
      setUnreadCount((res as any)?.unreadCount ?? items.filter((n: any) => !n.isRead).length);
    } catch {
      // Silently ignore — endpoint may not be deployed yet
    } finally {
      setInitialLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isInitialized || !user || user.isGuest) return;
    load();
    const interval = setInterval(load, 30_000);
    return () => clearInterval(interval);
  }, [isInitialized, user?.id, user?.isGuest, load]);

  const markRead = async (id: string) => {
    await TZ.storefront.notifications.markRead(id);
    setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, isRead: true } : n));
    setUnreadCount((c) => Math.max(0, c - 1));
  };

  const markAllRead = async () => {
    setLoading(true);
    await TZ.storefront.notifications.markAllRead();
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    setUnreadCount(0);
    setLoading(false);
  };

  if (!user || user.isGuest) return null;

  const typeIcon: Record<string, string> = {
    order_update: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4',
    promotion: 'M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6',
    loyalty: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8V7m0 1v8m0 0v1',
    broadcast: 'M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75V9A6 6 0 006 9v.75',
  };

  const panel = (
    <>
      <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-900">Notifications</h3>
        <div className="flex items-center gap-3">
          {unreadCount > 0 && (
            <button onClick={markAllRead} disabled={loading} className="text-xs text-orange-600 hover:text-orange-700 font-medium">
              Mark all read
            </button>
          )}
          <button onClick={() => setIsOpen(false)} className="md:hidden text-gray-400 hover:text-gray-600">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
      <div className="max-h-[60vh] md:max-h-80 overflow-y-auto">
        {initialLoading ? (
          <div className="divide-y divide-gray-50">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="px-4 py-3 flex gap-3">
                <Skeleton className="w-8 h-8 rounded-full flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-2 w-16" />
                </div>
              </div>
            ))}
          </div>
        ) : notifications.length === 0 ? (
          <div className="py-12 text-center">
            <svg className="w-12 h-12 mx-auto text-gray-200 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
            </svg>
            <p className="text-sm text-gray-400">No notifications yet</p>
            <p className="text-xs text-gray-300 mt-1">We&apos;ll notify you about orders & offers</p>
          </div>
        ) : (
          notifications.map((n) => (
            <button
              key={n.id}
              onClick={() => !n.isRead && markRead(n.id)}
              className={`w-full text-left px-4 py-3 border-b border-gray-50 hover:bg-gray-50 transition-colors ${!n.isRead ? 'bg-orange-50/40' : ''}`}
            >
              <div className="flex gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${!n.isRead ? 'bg-orange-100 text-orange-600' : 'bg-gray-100 text-gray-400'}`}>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={typeIcon[n.type] || typeIcon.broadcast} />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm ${!n.isRead ? 'font-semibold text-gray-900' : 'text-gray-700'}`}>{n.title}</p>
                  <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{n.body}</p>
                  <p className="text-[0.625rem] text-gray-400 mt-1">{formatTimeAgo(n.createdAt)}</p>
                </div>
                {!n.isRead && <div className="w-2 h-2 bg-orange-500 rounded-full mt-1.5 shrink-0" />}
              </div>
            </button>
          ))
        )}
      </div>
    </>
  );

  return (
    <>
      {/* Bell button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative flex items-center justify-center w-10 h-10 rounded-xl active:scale-[0.95] transition-transform"
        aria-label="Notifications"
      >
        <svg className="w-[22px] h-[22px] text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[0.6rem] font-bold rounded-full flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Mobile: bottom sheet via portal (escapes header stacking context) */}
      {typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          {isOpen && (
            <div className="md:hidden">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/40 z-[80]"
                onClick={() => setIsOpen(false)}
              />
              <motion.div
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className="fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl z-[81] max-h-[75vh] overflow-hidden"
              >
                <div className="flex justify-center py-2">
                  <div className="w-10 h-1 rounded-full bg-gray-200" />
                </div>
                {panel}
              </motion.div>
            </div>
          )}
        </AnimatePresence>,
        document.body,
      )}

      {/* Desktop: floating dropdown */}
      <AnimatePresence>
        {isOpen && (
          <div className="hidden md:block" ref={panelRef}>
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50"
            >
              {panel}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

function formatTimeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString();
}
