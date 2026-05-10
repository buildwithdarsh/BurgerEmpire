'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { TZ } from '@/lib/tz';
import type { AdminOrderDetail } from '@buildwithdarsh/sdk';

const STATUS_STYLES: Record<string, { pill: string; dot: string }> = {
  pending: { pill: 'bg-amber-50 text-amber-700 border-amber-100', dot: 'bg-amber-400' },
  confirmed: { pill: 'bg-blue-50 text-blue-700 border-blue-100', dot: 'bg-blue-400' },
  preparing: { pill: 'bg-orange-50 text-orange-700 border-orange-100', dot: 'bg-orange-400' },
  ready: { pill: 'bg-cyan-50 text-cyan-700 border-cyan-100', dot: 'bg-cyan-400' },
  out_for_delivery: { pill: 'bg-purple-50 text-purple-700 border-purple-100', dot: 'bg-purple-400' },
  delivered: { pill: 'bg-emerald-50 text-emerald-700 border-emerald-100', dot: 'bg-emerald-400' },
  cancelled: { pill: 'bg-red-50 text-red-600 border-red-100', dot: 'bg-red-400' },
  failed: { pill: 'bg-red-50 text-red-600 border-red-100', dot: 'bg-red-400' },
};

const STATUS_FLOW = ['pending', 'confirmed', 'preparing', 'ready', 'out_for_delivery', 'delivered'];

export default function AdminOrderDetail() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.orderId as string;
  const [order, setOrder] = useState<AdminOrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    TZ.admin.orders.get(orderId)
      .then((d) => setOrder(d))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [orderId]);

  const updateStatus = async (newStatus: string) => {
    if (updating) return;
    setUpdating(true);
    try {
      await TZ.admin.orders.updateStatus(orderId, { status: newStatus });
      const updated = await TZ.admin.orders.get(orderId);
      setOrder(updated);
    } catch {
      // error handled by SDK
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <div className="h-6 w-6 bg-gray-100 rounded animate-pulse" />
          <div className="h-7 w-48 bg-gray-100 rounded animate-pulse" />
        </div>
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-6 animate-pulse">
            <div className="h-5 bg-gray-100 rounded w-20 mb-4" />
            {[...Array(4)].map((_, i) => <div key={i} className="h-12 bg-gray-50 rounded-xl mb-2" />)}
          </div>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 animate-pulse h-24" />)}
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="space-y-6">
        <button onClick={() => router.push('/admin/orders')} className="flex items-center gap-2 text-gray-400 hover:text-gray-600 transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          Back to Orders
        </button>
        <div className="bg-white rounded-2xl border border-red-100 p-12 text-center">
          <svg className="w-12 h-12 mx-auto text-red-200 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <p className="text-red-600 font-medium">Order not found</p>
        </div>
      </div>
    );
  }

  const currentIdx = STATUS_FLOW.indexOf(order.status);
  const statusStyle = STATUS_STYLES[order.status] || { pill: 'bg-gray-50 text-gray-600 border-gray-100', dot: 'bg-gray-400' };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button onClick={() => router.push('/admin/orders')} className="p-2 -ml-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        </button>
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-semibold text-gray-900">
            Order <span className="font-mono text-lg">#{order.id.slice(-8)}</span>
          </h1>
          <div className="flex items-center gap-2 mt-0.5">
            <p className="text-sm text-gray-400">
              {new Date(order.createdAt).toLocaleString('en-IN')}
            </p>
            <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-md ${
              order.mode === 'healthy' ? 'bg-green-50 text-green-700' : 'bg-orange-50 text-orange-700'
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full ${order.mode === 'healthy' ? 'bg-green-400' : 'bg-orange-400'}`} />
              {order.mode}
            </span>
            <span className="text-xs text-gray-400 capitalize">{order.orderType.replace(/_/g, ' ')}</span>
          </div>
        </div>
        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-medium border ${statusStyle.pill}`}>
          <span className={`w-2 h-2 rounded-full ${statusStyle.dot}`} />
          {order.status.replace(/_/g, ' ')}
        </span>
      </div>

      {/* Status Actions */}
      {order.status !== 'delivered' && order.status !== 'cancelled' && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h3 className="text-sm font-medium text-gray-500 mb-3">Update Status</h3>
          <div className="flex flex-wrap gap-2">
            {STATUS_FLOW.filter((_, i) => i > currentIdx).map((s) => (
              <button
                key={s}
                onClick={() => updateStatus(s)}
                disabled={updating}
                className="px-4 py-2 bg-gray-900 text-white rounded-xl text-sm font-medium hover:bg-gray-800 disabled:opacity-50 transition-all active:scale-[0.98]"
              >
                {updating ? '...' : `Mark ${s.replace(/_/g, ' ')}`}
              </button>
            ))}
            <button
              onClick={() => updateStatus('cancelled')}
              disabled={updating}
              className="px-4 py-2 bg-red-50 text-red-700 border border-red-100 rounded-xl text-sm font-medium hover:bg-red-100 disabled:opacity-50 transition-colors"
            >
              Cancel Order
            </button>
          </div>
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Items */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Items</h2>
          <div className="space-y-3">
            {order.items.map((item) => {
              const isHealthy = item.mode === 'healthy';
              return (
                <div key={item.id} className="flex justify-between items-start py-2 border-b border-gray-50 last:border-0">
                  <div>
                    <p className={`font-medium flex items-center gap-1.5 ${isHealthy ? 'text-green-800' : 'text-gray-900'}`}>
                      {item.itemName}
                      {isHealthy && (
                        <span className="text-[0.625rem] px-1.5 py-0.5 rounded-full bg-green-50 text-green-600 border border-green-100 font-semibold">
                          Healthy
                        </span>
                      )}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">Qty: {item.quantity} x ₹{item.unitPrice}</p>
                    {item.addons.map((a, i) => (
                      <p key={i} className="text-xs text-gray-400 ml-2">+ {a.addonName} (₹{a.price})</p>
                    ))}
                  </div>
                  <p className="text-sm font-semibold text-gray-900">₹{item.totalPrice}</p>
                </div>
              );
            })}
          </div>

          {/* Totals */}
          <div className="mt-4 pt-4 border-t border-gray-100 space-y-1.5 text-sm">
            <div className="flex justify-between text-gray-500"><span>Subtotal</span><span>₹{order.subtotal}</span></div>
            <div className="flex justify-between text-gray-500"><span>Tax</span><span>₹{order.taxAmount}</span></div>
            {order.deliveryFee > 0 && <div className="flex justify-between text-gray-500"><span>Delivery</span><span>₹{order.deliveryFee}</span></div>}
            {order.discountAmount > 0 && <div className="flex justify-between text-emerald-600"><span>Discount</span><span>-₹{order.discountAmount}</span></div>}
            {order.packingCharges > 0 && <div className="flex justify-between text-gray-500"><span>Packing</span><span>₹{order.packingCharges}</span></div>}
            <div className="flex justify-between font-bold text-gray-900 pt-2 border-t border-gray-100"><span>Total</span><span>₹{order.totalAmount}</span></div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Customer */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h3 className="text-sm font-medium text-gray-500 mb-3">Customer</h3>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 font-bold text-sm">
                {order.customerName.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-gray-900 font-medium">{order.customerName}</p>
                <p className="text-xs text-gray-400">{order.customerPhone}</p>
              </div>
            </div>
            {order.customerEmail && <p className="text-sm text-gray-500 mt-2">{order.customerEmail}</p>}
          </div>

          {/* Address */}
          {order.address && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <h3 className="text-sm font-medium text-gray-500 mb-3">Delivery Address</h3>
              <p className="text-sm text-gray-700">{order.address.line1}</p>
              {order.address.line2 && <p className="text-sm text-gray-500">{order.address.line2}</p>}
              <p className="text-sm text-gray-500">{order.address.city} {order.address.pincode}</p>
            </div>
          )}

          {/* Payment & Loyalty */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h3 className="text-sm font-medium text-gray-500 mb-3">Payment</h3>
            <p className="text-sm text-gray-700 capitalize font-medium">{order.paymentType === '1' ? 'Online (Razorpay)' : 'Cash on Delivery'}</p>
            {order.couponCode && (
              <div className="flex items-center gap-1.5 mt-2">
                <span className="text-xs bg-orange-50 text-orange-700 border border-orange-100 px-2 py-0.5 rounded-md font-medium">Coupon: {order.couponCode}</span>
              </div>
            )}
            {(order.coinsEarned > 0 || order.coinsRedeemed > 0) && (
              <div className="flex items-center gap-3 mt-2 text-xs">
                {order.coinsEarned > 0 && <span className="text-emerald-600 font-medium">+{order.coinsEarned} earned</span>}
                {order.coinsRedeemed > 0 && <span className="text-orange-600 font-medium">-{order.coinsRedeemed} redeemed</span>}
              </div>
            )}
          </div>

          {/* POS Info */}
          {order.posOrderId && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <h3 className="text-sm font-medium text-gray-500 mb-3">POS Info</h3>
              <p className="text-sm text-gray-700 font-mono bg-gray-50 px-2 py-1 rounded inline-block">{order.posOrderId}</p>
              {order.posRawStatus && <p className="text-xs text-gray-400 mt-1">Raw: {order.posRawStatus}</p>}
            </div>
          )}

          {/* Special Instructions */}
          {order.specialInstructions && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <h3 className="text-sm font-medium text-gray-500 mb-3">Special Instructions</h3>
              <p className="text-sm text-gray-700 bg-amber-50 border border-amber-100 rounded-xl px-3 py-2">{order.specialInstructions}</p>
            </div>
          )}
        </div>
      </div>

      {/* Status History */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Status History</h2>
        <div className="space-y-0">
          {order.statusHistory.map((h, i) => {
            const style = STATUS_STYLES[h.status] || { pill: '', dot: 'bg-gray-300' };
            return (
              <div key={i} className="flex items-start gap-3 relative">
                {/* Timeline line */}
                {i < order.statusHistory.length - 1 && (
                  <div className="absolute left-[7px] top-5 bottom-0 w-px bg-gray-100" />
                )}
                <div className={`w-4 h-4 rounded-full mt-0.5 border-2 border-white shadow-sm shrink-0 ${style.dot}`} />
                <div className="pb-4">
                  <p className="text-sm text-gray-900 font-medium capitalize">{h.status.replace(/_/g, ' ')}</p>
                  <p className="text-xs text-gray-400">
                    {new Date(h.createdAt).toLocaleString('en-IN')} &middot; {h.source}
                    {h.note && <span className="text-gray-500"> — {h.note}</span>}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
