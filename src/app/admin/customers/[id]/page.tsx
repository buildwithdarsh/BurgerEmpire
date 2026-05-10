'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ChevronIcon, CheckIcon } from '@/components/icons';
import { TZ } from '@/lib/tz';
import type { AdminCustomerDetail } from '@buildwithdarsh/sdk';

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-50 text-yellow-700',
  confirmed: 'bg-blue-50 text-blue-700',
  preparing: 'bg-orange-50 text-orange-700',
  delivered: 'bg-green-50 text-green-700',
  cancelled: 'bg-red-50 text-red-700',
  open: 'bg-blue-50 text-blue-700',
  closed: 'bg-gray-100 text-gray-600',
  resolved: 'bg-green-50 text-green-700',
};

const TIER_COLORS: Record<string, string> = {
  gold: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  silver: 'bg-gray-50 text-gray-700 border-gray-200',
  bronze: 'bg-orange-50 text-orange-700 border-orange-200',
};

function StarRating({ rating, size = 14 }: { rating: number; size?: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} width={size} height={size} viewBox="0 0 24 24" fill={i < rating ? '#F59E0B' : 'none'} stroke={i < rating ? '#F59E0B' : '#D1D5DB'} strokeWidth="2">
          <path d="M12 2L14.9 8.6L22 9.2L16.8 13.9L18.4 21L12 17.3L5.6 21L7.2 13.9L2 9.2L9.1 8.6L12 2Z" />
        </svg>
      ))}
    </div>
  );
}

export default function AdminCustomerDetail() {
  const params = useParams();
  const id = params.id as string;
  const [customer, setCustomer] = useState<AdminCustomerDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [noteContent, setNoteContent] = useState('');
  const [savingNote, setSavingNote] = useState(false);

  const adminApi = TZ.client.scoped('/api/v1', 'staff', false);

  const load = useCallback(() => {
    setLoading(true);
    TZ.admin.endUsers.get(id)
      .then((customer) => { setCustomer(customer); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => { load(); }, [load]);

  const addNote = async () => {
    if (!noteContent.trim()) return;
    setSavingNote(true);
    try {
      await adminApi.post('/admin/customers/' + id, { note: noteContent });
      setNoteContent('');
      load();
    } catch {
      // failed silently
    } finally {
      setSavingNote(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <div className="w-20 h-4 bg-gray-100 rounded animate-pulse" />
          <ChevronIcon size={14} direction="right" />
          <div className="w-32 h-4 bg-gray-100 rounded animate-pulse" />
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="space-y-4">
            <div className="w-48 h-6 bg-gray-100 rounded animate-pulse" />
            <div className="w-64 h-4 bg-gray-50 rounded animate-pulse" />
            <div className="w-40 h-4 bg-gray-50 rounded animate-pulse" />
          </div>
        </div>
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="w-32 h-5 bg-gray-100 rounded animate-pulse mb-4" />
            <div className="space-y-3">
              <div className="h-4 bg-gray-50 rounded animate-pulse" />
              <div className="h-4 bg-gray-50 rounded animate-pulse w-3/4" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="space-y-6">
        <Link href="/admin/customers" className="text-sm text-orange-600 hover:underline flex items-center gap-1">
          <ChevronIcon size={14} direction="left" /> Back to Customers
        </Link>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
          <p className="text-sm text-gray-400">Customer not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <Link href="/admin/customers" className="text-sm text-orange-600 hover:underline flex items-center gap-1 w-fit">
        <ChevronIcon size={14} direction="left" /> Back to Customers
      </Link>

      {/* Profile Info */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">{customer.name}</h1>
            <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-sm text-gray-500">
              {customer.email && <span>{customer.email}</span>}
              {customer.phone && <span>{customer.phone}</span>}
            </div>
            <p className="text-xs text-gray-400 mt-1">
              Joined {new Date(customer.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-center px-4 py-2 bg-gray-50 rounded-xl">
              <p className="text-lg font-semibold text-gray-900">{customer.ordersCount}</p>
              <p className="text-xs text-gray-400">Orders</p>
            </div>
            {customer.loyaltyTier && (
              <div className={`text-center px-4 py-2 rounded-xl border ${TIER_COLORS[customer.loyaltyTier] || 'bg-gray-50 border-gray-200'}`}>
                <p className="text-lg font-semibold capitalize">{customer.loyaltyTier}</p>
                <p className="text-xs opacity-70">Tier</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900">Recent Orders</h2>
          </div>
          {customer.recentOrders.length === 0 ? (
            <div className="p-6 text-center">
              <p className="text-sm text-gray-400">No orders yet</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-500 bg-gray-50/50">
                    <th className="px-6 py-2.5 font-medium text-xs">Order</th>
                    <th className="px-6 py-2.5 font-medium text-xs">Status</th>
                    <th className="px-6 py-2.5 font-medium text-xs text-right">Total</th>
                    <th className="px-6 py-2.5 font-medium text-xs text-right">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {customer.recentOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50/50">
                      <td className="px-6 py-3">
                        <Link href={`/admin/orders/${order.id}`} className="text-orange-600 hover:underline font-mono text-xs">
                          {order.id.slice(-8)}
                        </Link>
                        <p className="text-xs text-gray-400">{order.itemCount} items</p>
                      </td>
                      <td className="px-6 py-3">
                        <span className={`px-2 py-0.5 rounded-lg text-xs font-medium ${STATUS_COLORS[order.status] || 'bg-gray-50 text-gray-600'}`}>
                          {order.status.replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-3 text-right font-medium text-gray-900">₹{order.totalAmount}</td>
                      <td className="px-6 py-3 text-right text-gray-500 text-xs">
                        {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Loyalty Account */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900">Loyalty Account</h2>
          </div>
          {!customer.loyalty ? (
            <div className="p-6 text-center">
              <p className="text-sm text-gray-400">No loyalty account</p>
            </div>
          ) : (
            <div className="p-6">
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-3 bg-gray-50 rounded-xl">
                  <p className="text-xl font-semibold text-gray-900">{customer.loyalty.balance}</p>
                  <p className="text-xs text-gray-400 mt-0.5">Balance</p>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-xl">
                  <p className="text-xl font-semibold text-gray-900 capitalize">{customer.loyalty.tier}</p>
                  <p className="text-xs text-gray-400 mt-0.5">Tier</p>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-xl">
                  <p className="text-xl font-semibold text-gray-900">{customer.loyalty.lifetimePoints}</p>
                  <p className="text-xs text-gray-400 mt-0.5">Lifetime Pts</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Reviews */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900">Reviews</h2>
          </div>
          {customer.reviews.length === 0 ? (
            <div className="p-6 text-center">
              <p className="text-sm text-gray-400">No reviews yet</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {customer.reviews.map((review) => (
                <div key={review.id} className="px-6 py-4">
                  <div className="flex items-center justify-between mb-1">
                    <StarRating rating={review.rating} />
                    <span className={`px-2 py-0.5 rounded-lg text-xs font-medium ${STATUS_COLORS[review.status] || 'bg-gray-50 text-gray-600'}`}>
                      {review.status}
                    </span>
                  </div>
                  {review.comment && <p className="text-sm text-gray-600 mt-1">{review.comment}</p>}
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(review.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Support Tickets */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900">Support Tickets</h2>
          </div>
          {customer.supportTickets.length === 0 ? (
            <div className="p-6 text-center">
              <p className="text-sm text-gray-400">No support tickets</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {customer.supportTickets.map((ticket) => (
                <div key={ticket.id} className="px-6 py-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{ticket.subject}</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {new Date(ticket.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>
                  </div>
                  <span className={`px-2.5 py-1 rounded-lg text-xs font-medium ${STATUS_COLORS[ticket.status] || 'bg-gray-50 text-gray-600'}`}>
                    {ticket.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Customer Notes */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900">Customer Notes</h2>
        </div>
        {customer.notes.length > 0 && (
          <div className="divide-y divide-gray-50">
            {customer.notes.map((note) => (
              <div key={note.id} className="px-6 py-4">
                <p className="text-sm text-gray-700 whitespace-pre-wrap">{note.content}</p>
                <p className="text-xs text-gray-400 mt-1.5">
                  {note.author} &middot; {new Date(note.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            ))}
          </div>
        )}
        <div className="px-6 py-4 border-t border-gray-100">
          <label className="text-xs font-medium text-gray-500">Add a note</label>
          <textarea
            value={noteContent}
            onChange={(e) => setNoteContent(e.target.value)}
            rows={3}
            placeholder="Type a note about this customer..."
            className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-200 resize-none"
          />
          <button
            onClick={addNote}
            disabled={savingNote || !noteContent.trim()}
            className="mt-2 flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-xl text-sm font-medium hover:bg-gray-800 disabled:opacity-50 transition-colors"
          >
            <CheckIcon size={14} />
            {savingNote ? 'Saving...' : 'Add Note'}
          </button>
        </div>
      </div>
    </div>
  );
}
