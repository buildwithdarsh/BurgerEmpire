'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useMode } from '@/hooks/useMode';
import { useConfig } from '@/hooks/useConfig';
import { TZ } from '@/lib/tz';
import { useCartStore } from '@/store/cart';
import { CheckIcon, LeafIcon, CoinIcon, TicketIcon } from '@/components/icons';
import { useToast } from '@/hooks/useToast';
import { getErrorMessage } from '@/lib/error-messages';
import { formatCurrency, formatTime, formatDateTime } from '@/lib/format';
import Spinner from '@/components/ui/Spinner';
import PageLoader from '@/components/ui/PageLoader';
import { motion, AnimatePresence } from 'framer-motion';
import {
  PlacedIllustration,
  ConfirmedIllustration,
  PreparingIllustration,
  ReadyIllustration,
  DispatchedIllustration,
} from '@/components/order/StatusIllustrations';
interface OrderDetail {
  id: string;
  status: string;
  posOrderId: string | null;
  mode: string;
  orderType: string;
  paymentMethod: string | null;
  subtotal: number;
  taxAmount: number;
  deliveryFee: number;
  discountAmount: number;
  totalAmount: number;
  couponCode: string | null;
  coinsEarned: number;
  coinsRedeemed: number;
  customerName: string;
  customerPhone: string;
  specialInstructions: string | null;
  address: { line1: string; line2: string | null; city: string; pincode: string } | null;
  items: {
    id: string;
    menuItemId: string;
    itemName: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    mode: string;
    variationId: string | null;
    image: string | null;
    healthyImage: string | null;
    diet: string;
    classicName: string;
    healthyName: string;
    classicPrice: number;
    healthyPrice: number;
    addons: { id: string; name: string; price: number; quantity: number }[];
  }[];
  statusHistory: { status: string; source: string; note: string | null; timestamp: string }[];
  createdAt: string;
}

const STATUS_STEPS = ['pending', 'confirmed', 'preparing', 'ready', 'out_for_delivery', 'delivered'];

export default function OrderDetailPage({ params }: { params: Promise<{ orderId: string }> }) {
  const { orderId } = use(params);
  const { isClassic } = useMode();
  const { config } = useConfig();
  const addItem = useCartStore((s) => s.addItem);

  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reordering, setReordering] = useState(false);
  const { toast } = useToast();

  const accent = isClassic ? '#9A1E29' : '#4AA056';
  const accentBg = isClassic ? '#FAF8F4' : '#F0FAF3';
  const currency = config.branding?.currency || 'INR';
  const timezone = config.branding?.timezone || 'Asia/Kolkata';
  const dateFormat = config.branding?.date_format || 'DD/MM/YYYY';
  const fmt = (amount: number) => formatCurrency(amount, currency);

  useEffect(() => {
    loadOrder();
    // Poll for updates every 15s if order is active
    const interval = setInterval(() => {
      if (order && !['delivered', 'cancelled', 'failed'].includes(order.status)) {
        loadOrder();
      }
    }, 15000);
    return () => clearInterval(interval);
  }, [orderId]); // eslint-disable-line react-hooks/exhaustive-deps

  // Demo: reset to 'pending' on load, then auto-advance every 4s
  const [demoStarted, setDemoStarted] = useState(false);

  useEffect(() => {
    if (!order || demoStarted) return;
    // Reset to pending regardless of original status
    setDemoStarted(true);
    setOrder((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        status: 'pending',
        statusHistory: [{ status: 'pending', source: 'system', note: null, timestamp: new Date().toISOString() }],
      };
    });
  }, [order !== null]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!order || !demoStarted) return;
    if (['delivered', 'cancelled', 'failed'].includes(order.status)) return;

    const idx = STATUS_STEPS.indexOf(order.status);
    if (idx < 0 || idx >= STATUS_STEPS.length - 1) return;

    const timer = setTimeout(() => {
      const nextStatus = STATUS_STEPS[idx + 1];
      const now = new Date().toISOString();
      setOrder((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          status: nextStatus,
          statusHistory: [
            ...(prev.statusHistory || []),
            { status: nextStatus, source: 'system', note: null, timestamp: now },
          ],
        };
      });
    }, 4000);

    return () => clearTimeout(timer);
  }, [order?.status, demoStarted]); // eslint-disable-line react-hooks/exhaustive-deps

  const loadOrder = async () => {
    try {
      const data = await TZ.storefront.orders.get(orderId);
      setOrder(data as any);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleReorder = () => {
    if (!order || reordering) return;
    setReordering(true);
    for (const item of order.items) {
      addItem({
        menuItemId: item.menuItemId,
        quantity: item.quantity,
        mode: (item.mode as 'classic' | 'healthy') || 'classic',
        classicName: item.classicName,
        healthyName: item.healthyName,
        classicPrice: item.classicPrice,
        healthyPrice: item.healthyPrice,
        image: item.image ?? undefined,
        healthyImage: item.healthyImage ?? undefined,
        diet: item.diet,
        inStock: true,
        variationId: item.variationId || undefined,
        addons: item.addons.map((a) => ({
          addonId: a.id,
          name: a.name,
          price: a.price,
          quantity: a.quantity,
        })),
      });
    }
    useCartStore.getState().setOpen(true);
    toast.success('Items added to cart!');
    setReordering(false);
  };

  if (loading) {
    return <PageLoader text="Loading order..." />;
  }

  if (error || !order) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-5">
        <p className="text-red-500 mb-4">{error || 'Order not found'}</p>
        <Link href="/orders" className="text-sm font-semibold" style={{ color: accent }}>
          Back to Orders
        </Link>
      </div>
    );
  }

  // Normalize: treat legacy 'dispatched' as 'out_for_delivery'
  const normalizedStatus = order.status === 'dispatched' ? 'out_for_delivery' : order.status;
  const currentStepIndex = STATUS_STEPS.indexOf(normalizedStatus);
  const isFinal = ['delivered', 'cancelled', 'failed'].includes(order.status);

  return (
    <div className="min-h-screen" style={{ backgroundColor: accentBg }}>
      <div className="max-w-[600px] mx-auto px-5 py-5">
        {/* Status: Illustration + Timeline */}
        {config.orders.order_tracking_enabled && !isFinal && normalizedStatus !== 'cancelled' && normalizedStatus !== 'failed' && (() => {
          const illustrations: Record<string, (props: { color: string }) => React.ReactNode> = {
            pending: (p) => <PlacedIllustration {...p} />,
            confirmed: (p) => <ConfirmedIllustration {...p} />,
            preparing: (p) => <PreparingIllustration {...p} />,
            ready: (p) => <ReadyIllustration {...p} />,
            out_for_delivery: (p) => <DispatchedIllustration {...p} />,
          };

          const statusMessages: Record<string, { title: string; subtitle: string }> = {
            pending: { title: 'Order sent to kitchen!', subtitle: 'Waiting for the restaurant to confirm' },
            confirmed: { title: 'Chef says yes!', subtitle: 'Your order has been accepted' },
            preparing: { title: 'Cooking in progress', subtitle: 'Fresh food being made just for you' },
            ready: { title: 'Almost there!', subtitle: 'Your order is packed and ready' },
            out_for_delivery: { title: 'On the way!', subtitle: 'Your rider is heading to you now' },
          };

          const currentMsg = statusMessages[normalizedStatus] || statusMessages.pending;
          const CurrentIllustration = illustrations[normalizedStatus];

          const stepMeta: Record<string, { icon: React.ReactNode; label: string; desc: string }> = {
            pending: {
              icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
              label: 'Order Placed',
              desc: 'We received your order',
            },
            confirmed: {
              icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
              label: 'Confirmed',
              desc: 'Restaurant accepted your order',
            },
            preparing: {
              icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 18a3.75 3.75 0 00.495-7.467 5.99 5.99 0 00-1.925 3.546 5.974 5.974 0 01-2.133-1.001A3.75 3.75 0 0012 18z" /></svg>,
              label: 'Preparing',
              desc: 'Your food is being made fresh',
            },
            ready: {
              icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" /></svg>,
              label: 'Ready',
              desc: 'Packed and ready for pickup',
            },
            out_for_delivery: {
              icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0H6.375m11.25-3V6.75a1.125 1.125 0 00-1.125-1.125H3.375a1.125 1.125 0 00-1.125 1.125v9m16.5 0h.375a1.125 1.125 0 001.125-1.125V14.25" /></svg>,
              label: 'Out for Delivery',
              desc: 'Your rider is heading to you',
            },
          };

          const visibleSteps = STATUS_STEPS.slice(0, -1); // exclude 'delivered'
          const historyMap = new Map((order.statusHistory || []).map((h) => [h.status === 'dispatched' ? 'out_for_delivery' : h.status, h]));

          return (
            <>
            {/* Hero illustration for current status */}
            <section className="rounded-xl lg:rounded-2xl mb-4 overflow-hidden border border-gray-100" style={{ backgroundColor: `${accent}08` }}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={order.status}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.4 }}
                >
                  <div className="w-48 h-40 mx-auto mt-4">
                    {CurrentIllustration && CurrentIllustration({ color: accent })}
                  </div>
                  <div className="text-center pb-5 px-5">
                    <h3 className="text-lg font-bold text-gray-900">{currentMsg.title}</h3>
                    <p className="text-sm text-gray-400 mt-0.5">{currentMsg.subtitle}</p>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Compact horizontal progress dots */}
              <div className="flex items-center justify-center gap-1.5 pb-5">
                {visibleSteps.map((step, i) => {
                  const done = i <= currentStepIndex;
                  const active = i === currentStepIndex;
                  return (
                    <motion.div
                      key={step}
                      className="rounded-full"
                      style={{
                        width: active ? 24 : 8,
                        height: 8,
                        backgroundColor: done ? accent : '#E5E7EB',
                      }}
                      layout
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  );
                })}
              </div>
            </section>

            {/* Detailed vertical timeline */}
            <section className="bg-white rounded-xl lg:rounded-2xl p-5 mb-4 border border-gray-100">
              <h3 className="text-sm font-bold text-gray-700 mb-5">Order Progress</h3>
              <div className="space-y-0">
                {visibleSteps.map((step, i) => {
                  const isComplete = i < currentStepIndex;
                  const isCurrent = i === currentStepIndex;
                  const isPending = i > currentStepIndex;
                  const meta = stepMeta[step];
                  const history = historyMap.get(step);
                  const isLast = i === visibleSteps.length - 1;

                  return (
                    <div key={step} className="flex gap-4">
                      {/* Icon column with connecting line */}
                      <div className="flex flex-col items-center">
                        <div
                          className="relative flex items-center justify-center w-10 h-10 rounded-full flex-shrink-0"
                          style={{
                            backgroundColor: isComplete || isCurrent ? accent : '#F3F4F6',
                            color: isComplete || isCurrent ? '#FFFFFF' : '#D1D5DB',
                          }}
                        >
                          {isComplete ? (
                            <CheckIcon size={18} color="white" />
                          ) : (
                            meta?.icon
                          )}
                          {/* Glow ring on current step — uses box-shadow to avoid repaint flicker */}
                          {isCurrent && (
                            <motion.div
                              className="absolute inset-0 rounded-full pointer-events-none"
                              style={{ willChange: 'opacity', boxShadow: `0 0 0 4px ${accent}30` }}
                              animate={{ opacity: [1, 0.4, 1] }}
                              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                            />
                          )}
                        </div>
                        {/* Connecting line */}
                        {!isLast && (
                          <div className="w-0.5 flex-1 min-h-[2rem] my-1" style={{ backgroundColor: isComplete ? accent : '#E5E7EB' }} />
                        )}
                      </div>

                      {/* Content */}
                      <div className={`pb-5 ${isLast ? 'pb-0' : ''}`}>
                        <p
                          className="text-sm font-bold leading-tight"
                          style={{ color: isPending ? '#D1D5DB' : '#111827' }}
                        >
                          {meta?.label || step}
                        </p>
                        <p
                          className="text-xs mt-0.5"
                          style={{ color: isPending ? '#E5E7EB' : '#9CA3AF' }}
                        >
                          {meta?.desc}
                        </p>
                        {history && (
                          <p className="text-[0.625rem] mt-1" style={{ color: accent }}>
                            {formatTime(history.timestamp, timezone)}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
            </>
          );
        })()}

        {/* Token / Order type / info bar */}
        {(config.orders.token_display_enabled || config.orders.order_types) && (
          <section className="bg-white rounded-xl lg:rounded-2xl p-4 mb-4 border border-gray-100 flex items-center justify-between">
            {config.orders.token_display_enabled && order.posOrderId && (
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-gray-400 uppercase">Token</span>
                <span className="text-lg font-black" style={{ color: accent }}>#{order.posOrderId}</span>
              </div>
            )}
            {config.orders.order_types && (
              <span
                className="text-[0.6875rem] font-semibold px-2.5 py-1 rounded-full capitalize"
                style={{ backgroundColor: accentBg, color: accent }}
              >
                {order.orderType.replace(/_/g, ' ')}
              </span>
            )}
          </section>
        )}

        {/* Order Items */}
        <section className="bg-white rounded-xl lg:rounded-2xl p-5 mb-4 border border-gray-100">
          <h3 className="text-sm font-bold text-gray-700 mb-3">Items</h3>
          <div className="space-y-3">
            {order.items.map((item) => {
              const isHealthyItem = item.mode === 'healthy';
              return (
                <div key={item.id} className="flex justify-between">
                  <div>
                    <p className="text-sm font-medium" style={{ color: isHealthyItem ? '#4AA056' : '#111827' }}>
                      {item.quantity}x {item.itemName}
                      {isHealthyItem && <LeafIcon size={10} color="#4AA056" className="inline-block ml-1 align-middle" />}
                    </p>
                    {item.addons.length > 0 && (
                      <p className="text-xs text-gray-400">
                        + {item.addons.map((a) => a.name).join(', ')}
                      </p>
                    )}
                  </div>
                  <span className="text-sm font-semibold text-gray-700">{fmt(item.totalPrice)}</span>
                </div>
              );
            })}
          </div>

          <div className="border-t border-dashed border-gray-200 mt-4 pt-3 space-y-1 text-sm">
            <div className="flex justify-between text-gray-500">
              <span>Subtotal</span><span>{fmt(order.subtotal)}</span>
            </div>
            {order.taxAmount > 0 && (
              <div className="flex justify-between text-gray-500">
                <span>Tax</span><span>{fmt(order.taxAmount)}</span>
              </div>
            )}
            {order.deliveryFee > 0 && (
              <div className="flex justify-between text-gray-500">
                <span>Delivery</span><span>{fmt(order.deliveryFee)}</span>
              </div>
            )}
            {order.discountAmount > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Discount</span><span>-{fmt(order.discountAmount)}</span>
              </div>
            )}
            <div className="flex justify-between font-bold text-gray-900 text-base pt-1 border-t border-gray-100">
              <span>Total</span><span>{fmt(order.totalAmount)}</span>
            </div>
          </div>
        </section>

        {/* Baby Coins Info */}
        {(order.coinsEarned > 0 || order.coinsRedeemed > 0 || order.couponCode) && (
          <section className="bg-white rounded-xl lg:rounded-2xl p-5 mb-4 border border-gray-100">
            <h3 className="text-sm font-bold text-gray-700 mb-3">Savings & Rewards</h3>
            <div className="space-y-2">
              {order.coinsEarned > 0 && (
                <div className="flex items-center gap-2 px-3 py-2 rounded-md lg:rounded-xl" style={{ backgroundColor: accentBg }}>
                  <CoinIcon size={18} color={accent} />
                  <p className="text-[0.75rem] font-bold" style={{ color: accent }}>
                    +{order.coinsEarned} {config.loyalty.point_name_plural} earned
                  </p>
                </div>
              )}
              {order.coinsRedeemed > 0 && (
                <div className="flex items-center gap-2 px-3 py-2 rounded-md lg:rounded-xl bg-green-50">
                  <CoinIcon size={18} color="#047857" />
                  <p className="text-[0.75rem] font-bold text-green-700">
                    {order.coinsRedeemed} {config.loyalty.point_name_plural} redeemed (saved {fmt(order.coinsRedeemed)})
                  </p>
                </div>
              )}
              {order.couponCode && (
                <div className="flex items-center gap-2 px-3 py-2 rounded-md lg:rounded-xl bg-blue-50">
                  <TicketIcon size={18} color="#2563EB" />
                  <p className="text-[0.75rem] font-bold text-blue-700">
                    Coupon applied: {order.couponCode}
                  </p>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Delivery Info */}
        {order.address && (
          <section className="bg-white rounded-xl lg:rounded-2xl p-5 mb-4 border border-gray-100">
            <h3 className="text-sm font-bold text-gray-700 mb-2">Delivery Address</h3>
            <p className="text-sm text-gray-600">{order.address.line1}</p>
            {order.address.line2 && <p className="text-sm text-gray-500">{order.address.line2}</p>}
            <p className="text-xs text-gray-400">{order.address.city} - {order.address.pincode}</p>
          </section>
        )}

        {/* Status History */}
        {(order.statusHistory || []).length > 0 && (
          <section className="bg-white rounded-xl lg:rounded-2xl p-5 mb-4 border border-gray-100">
            <h3 className="text-sm font-bold text-gray-700 mb-3">Activity</h3>
            <div className="space-y-3">
              {(order.statusHistory || []).map((entry, i) => (
                <div key={i} className="flex gap-3">
                  <div className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0" style={{ backgroundColor: accent }} />
                  <div>
                    <p className="text-sm font-medium text-gray-700 capitalize">{entry.status.replace(/_/g, ' ')}</p>
                    {entry.note && <p className="text-xs text-gray-400">{entry.note}</p>}
                    <p className="text-[0.625rem] text-gray-300">
                      {formatDateTime(entry.timestamp, timezone, undefined, dateFormat)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Cancel info */}
        {!isFinal && config.orders.cancel_allowed_minutes > 0 && (
          <div className="text-xs text-gray-400 mb-4 text-center">
            <p>You can cancel this order within {config.orders.cancel_allowed_minutes} minutes of placing it.</p>
            {config.orders.cancel_refund_enabled && (
              <p className="mt-0.5 text-gray-500">
                {config.orders.cancel_refund_percent
                  ? `You'll receive ${config.orders.cancel_refund_percent}% refund`
                  : 'Refund will be processed'}
              </p>
            )}
          </div>
        )}

        {/* Refund Policy */}
        {isFinal && config.payments?.refund_enabled && (
          <section className="bg-white rounded-xl lg:rounded-2xl p-5 mb-4 border border-gray-100">
            <h3 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
              <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z" />
              </svg>
              Refund Policy
            </h3>
            <div className="space-y-1.5 text-xs text-gray-500">
              {config.payments.refund_percentage != null && (
                <p>Up to {config.payments.refund_percentage}% refund</p>
              )}
              {config.payments.refund_window_hours != null && config.payments.refund_window_hours > 0 && (
                <p>Request within {config.payments.refund_window_hours} hours of delivery</p>
              )}
              {config.payments.refund_auto && (
                <p className="text-green-600 font-medium">Refunds are processed automatically</p>
              )}
              {config.payments.partial_refund_enabled && (
                <p>Partial refunds available</p>
              )}
              <p>
                {config.payments.refund_to_wallet
                  ? 'Refunded to wallet balance'
                  : 'Refunded to original payment method'}
              </p>
            </div>
          </section>
        )}

        {/* Rating prompt */}
        {config.orders.rating_enabled && order.status === 'delivered' && (
          <section className="bg-white rounded-xl lg:rounded-2xl p-5 mb-4 border border-gray-100 text-center">
            <p className="text-sm font-bold text-gray-700 mb-1">How was your order?</p>
            <p className="text-xs text-gray-400">
              {config.orders.rating_mandatory ? 'Rating required' : 'We would love to hear your feedback!'}
            </p>
          </section>
        )}

        {/* Receipt */}
        {config.orders.receipt_enabled && isFinal && order.status !== 'cancelled' && order.status !== 'failed' && (
          <div className="mb-4">
            <button
              onClick={() => toast.info('Receipt download coming soon!')}
              className="w-full py-2.5 rounded-xl lg:rounded-2xl text-sm font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
              </svg>
              View Receipt
            </button>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3">
          {config.orders.reorder_enabled && (
            <button
              onClick={handleReorder}
              disabled={reordering}
              className="flex-1 py-3 rounded-xl lg:rounded-2xl text-sm font-bold text-white transition-all active:scale-[0.98] disabled:opacity-60 flex items-center justify-center gap-2"
              style={{ backgroundColor: accent }}
            >
              {reordering && <Spinner />}
              {reordering ? 'Adding to Cart...' : 'Reorder'}
            </button>
          )}
          <Link
            href="/menu"
            className="py-3 px-5 rounded-xl lg:rounded-2xl text-sm font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors text-center flex-1"
          >
            Menu
          </Link>
        </div>
      </div>
    </div>
  );
}
