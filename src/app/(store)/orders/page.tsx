'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useMode } from '@/hooks/useMode';
import { useConfig } from '@/hooks/useConfig';
import { useAuthStore } from '@/store/auth';
import { TZ } from '@/lib/tz';
import Skeleton from '@/components/Skeleton';
import EmptyState from '@/components/ui/EmptyState';
import SignInCard from '@/components/ui/SignInCard';
import { getErrorMessage } from '@/lib/error-messages';
import { formatCurrency, formatShortDateTime } from '@/lib/format';

interface OrderSummary {
  id: string;
  status: string;
  mode: string;
  orderType: string;
  totalAmount: number;
  customerName: string;
  createdAt: string;
  items: { itemName: string; quantity: number }[];
}

const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  pending: { bg: '#FEF3C7', text: '#D97706' },
  confirmed: { bg: '#D1FAE5', text: '#059669' },
  preparing: { bg: '#DBEAFE', text: '#2563EB' },
  ready: { bg: '#E0E7FF', text: '#4F46E5' },
  dispatched: { bg: '#FCE7F3', text: '#DB2777' },
  delivered: { bg: '#D1FAE5', text: '#047857' },
  cancelled: { bg: '#FEE2E2', text: '#DC2626' },
  failed: { bg: '#FEE2E2', text: '#DC2626' },
};

export default function OrdersPage() {
  const { isClassic } = useMode();
  const { config } = useConfig();
  const user = useAuthStore((s) => s.user);
  const [orders, setOrders] = useState<OrderSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const accent = isClassic ? '#9A1E29' : '#4AA056';
  const light = isClassic ? '#FFF9F0' : '#F5FBF7';
  const currency = config.branding?.currency || 'INR';
  const timezone = config.branding?.timezone || 'Asia/Kolkata';
  const dateFormat = config.branding?.date_format || 'DD/MM/YYYY';

  useEffect(() => {
    if (user && !user.isGuest) {
      loadOrders();
    } else {
      setLoading(false);
    }
  }, [user]);

  const loadOrders = async () => {
    setError('');
    setLoading(true);
    try {
      const data = await TZ.storefront.orders.list();
      setOrders(data.data as any);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: light }}>
      <div className="max-w-[600px] mx-auto px-5 py-5">
        {(!user || user.isGuest) ? (
          <SignInCard
            title="Sign in to view your orders"
            description="Track your current orders and browse your order history"
            accentColor={accent}
            icon={
              <svg className="w-12 h-12 mx-auto text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
              </svg>
            }
          />
        ) : loading ? (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-white rounded-xl lg:rounded-2xl p-4 border border-gray-100">
                <div className="flex items-start justify-between mb-3">
                  <div className="space-y-2">
                    <Skeleton className="h-5 w-20 rounded-md" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                  <Skeleton className="h-5 w-14" />
                </div>
                <Skeleton className="h-4 w-full mb-3" />
                <div className="flex items-center justify-between">
                  <Skeleton className="h-3 w-24" />
                  <Skeleton className="h-4 w-4 rounded-full" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-16">
            <svg className="w-12 h-12 text-gray-200 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
            <p className="text-sm text-gray-500 mb-4" role="alert">{error}</p>
            <button
              onClick={loadOrders}
              className="px-5 py-2 rounded-md lg:rounded-xl text-sm font-bold text-white transition-all hover:opacity-90"
              style={{ backgroundColor: accent }}
            >
              Try Again
            </button>
          </div>
        ) : orders.length === 0 ? (
          <EmptyState
            icon={
              <svg className="w-12 h-12 text-gray-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
              </svg>
            }
            title="No orders yet"
            description="Place your first order and it will appear here"
            action={{ label: 'Start Ordering', onClick: () => window.location.href = '/menu' }}
            accentColor={accent}
          />
        ) : (
          <div className="space-y-3">
            {orders.map((order) => {
              const statusStyle = STATUS_COLORS[order.status] || STATUS_COLORS.pending;
              return (
                <Link
                  key={order.id}
                  href={`/orders/${order.id}`}
                  className="block bg-white rounded-xl lg:rounded-2xl p-4 border border-gray-100 hover:border-gray-200 transition-colors"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <span
                        className="text-[0.625rem] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md"
                        style={{ backgroundColor: statusStyle.bg, color: statusStyle.text }}
                      >
                        {order.status}
                      </span>
                      <p className="text-xs text-gray-400 mt-1">
                        {formatShortDateTime(order.createdAt, timezone, dateFormat)}
                      </p>
                    </div>
                    <span className="text-base font-bold text-gray-900">
                      {formatCurrency(order.totalAmount, currency)}
                    </span>
                  </div>

                  <p className="text-sm text-gray-600 truncate">
                    {order.items.map((i) => `${i.quantity}x ${i.itemName}`).join(', ')}
                  </p>

                  <div className="flex items-center justify-between mt-2">
                    <span className="text-[0.625rem] text-gray-400 uppercase">
                      {order.orderType} · {order.mode}
                    </span>
                    <svg className="w-4 h-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
