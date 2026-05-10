'use client';

import { useEffect, useState, useCallback } from 'react';
import { TZ } from '@/lib/tz';
import type { AdminAbandonedCart } from '@buildwithdarsh/sdk';

const FILTER_OPTIONS = ['all', 'not_recovered', 'recovered'] as const;

export default function AdminAbandonedCarts() {
  const [carts, setCarts] = useState<AdminAbandonedCart[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');
  const [sendingId, setSendingId] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, totalPages: 1 });

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const d = await TZ.admin.abandonedCarts.list({ page, limit: 20, filter: filter !== 'all' ? filter : undefined });
      setCarts(d.data ?? d);
      if (d.pagination?.total != null) setPagination({ total: d.pagination.total, totalPages: d.pagination.totalPages });
    } catch {
      // silently handle
    } finally {
      setLoading(false);
    }
  }, [page, filter]);

  useEffect(() => { load(); }, [load]);

  const sendRecoveryEmail = async (cartId: string) => {
    if (sendingId) return;
    setSendingId(cartId);
    try {
      await TZ.admin.abandonedCarts.recover(cartId);
      load();
    } catch {
      // silently handle
    } finally {
      setSendingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Abandoned Carts</h1>
        <p className="text-sm text-gray-400 mt-0.5">Track and recover abandoned shopping carts</p>
      </div>

      {/* Filter */}
      <div className="flex gap-2 overflow-x-auto">
        {FILTER_OPTIONS.map((f) => (
          <button
            key={f}
            onClick={() => { setFilter(f); setPage(1); }}
            className={`px-3 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-colors ${
              filter === f ? 'bg-gray-900 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
          >
            {f === 'all' ? 'All' : f === 'not_recovered' ? 'Not Recovered' : 'Recovered'}
          </button>
        ))}
      </div>

      {/* Carts Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="divide-y divide-gray-50">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="px-6 py-4 flex gap-4">
                <div className="w-20 h-4 bg-gray-100 rounded animate-pulse" />
                <div className="flex-1 h-4 bg-gray-50 rounded animate-pulse" />
                <div className="w-16 h-4 bg-gray-50 rounded animate-pulse" />
                <div className="w-12 h-4 bg-gray-50 rounded animate-pulse" />
                <div className="w-24 h-4 bg-gray-50 rounded animate-pulse" />
              </div>
            ))}
          </div>
        ) : carts.length === 0 ? (
          <div className="p-12 text-center">
            <svg className="w-12 h-12 mx-auto text-gray-200 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" /></svg>
            <p className="text-sm text-gray-400">No abandoned carts found</p>
            <p className="text-xs text-gray-300 mt-1">Abandoned carts will appear here</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500 border-b border-gray-100 bg-gray-50/50">
                  <th className="px-6 py-3 font-medium">Cart ID</th>
                  <th className="px-6 py-3 font-medium">Contact</th>
                  <th className="px-6 py-3 font-medium text-right">Subtotal</th>
                  <th className="px-6 py-3 font-medium text-center">Items</th>
                  <th className="px-6 py-3 font-medium text-center">Email Sent</th>
                  <th className="px-6 py-3 font-medium text-center">Recovered</th>
                  <th className="px-6 py-3 font-medium text-right">Created</th>
                  <th className="px-6 py-3 font-medium text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {carts.map((cart) => (
                  <tr key={cart.id} className="hover:bg-gray-50/50">
                    <td className="px-6 py-4">
                      <span className="font-mono text-xs text-orange-600">{cart.id.slice(-8)}</span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-gray-900 text-sm">{cart.email || cart.phone || <span className="text-gray-300">Unknown</span>}</p>
                    </td>
                    <td className="px-6 py-4 text-right font-medium text-gray-900">
                      &#8377;{cart.subtotal}
                    </td>
                    <td className="px-6 py-4 text-center text-gray-600">{cart.itemCount}</td>
                    <td className="px-6 py-4 text-center">
                      {cart.recoveryEmailSent ? (
                        <span className="inline-flex items-center gap-1 text-xs text-green-700">
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><polyline points="20,6 9,17 4,12" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" /></svg>
                          Sent
                        </span>
                      ) : (
                        <span className="text-xs text-gray-300">No</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {cart.recoveredAt ? (
                        <span className="px-2 py-0.5 rounded-md text-xs font-medium bg-green-50 text-green-700">
                          {new Date(cart.recoveredAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                        </span>
                      ) : (
                        <span className="text-xs text-gray-300">No</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right text-gray-500 text-xs">
                      {new Date(cart.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {!cart.recoveredAt && (
                        <button
                          onClick={() => sendRecoveryEmail(cart.id)}
                          disabled={sendingId === cart.id || cart.recoveryEmailSent}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                            cart.recoveryEmailSent
                              ? 'bg-gray-50 text-gray-400 cursor-not-allowed'
                              : 'bg-orange-50 text-orange-700 hover:bg-orange-100 border border-orange-200 disabled:opacity-50'
                          }`}
                        >
                          {sendingId === cart.id ? 'Sending...' : cart.recoveryEmailSent ? 'Already Sent' : 'Send Recovery Email'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
            <p className="text-sm text-gray-500">{pagination.total} carts total</p>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm disabled:opacity-40 hover:bg-gray-50"
              >
                Previous
              </button>
              <span className="px-3 py-1.5 text-sm text-gray-600">
                Page {page} of {pagination.totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
                disabled={page === pagination.totalPages}
                className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm disabled:opacity-40 hover:bg-gray-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
