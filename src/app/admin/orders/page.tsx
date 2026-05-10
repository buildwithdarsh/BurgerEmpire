'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { TZ } from '@/lib/tz';
import type { AdminOrder } from '@buildwithdarsh/sdk';

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-50 text-yellow-700',
  confirmed: 'bg-blue-50 text-blue-700',
  preparing: 'bg-orange-50 text-orange-700',
  out_for_delivery: 'bg-purple-50 text-purple-700',
  delivered: 'bg-green-50 text-green-700',
  cancelled: 'bg-red-50 text-red-700',
  failed: 'bg-red-50 text-red-700',
};

const STATUSES = ['all', 'pending', 'confirmed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled', 'failed'];

export default function AdminOrders() {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('all');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, totalPages: 1 });

  const loadOrders = useCallback(() => {
    setLoading(true);
    TZ.admin.orders.list({
      page,
      limit: 20,
      ...(status !== 'all' && { status }),
      ...(search && { search }),
    })
      .then((result) => {
        setOrders(result.data);
        setPagination({ total: result.pagination.total, totalPages: result.pagination.totalPages });
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [page, status, search]);

  useEffect(() => { loadOrders(); }, [loadOrders]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Orders</h1>
        <p className="text-sm text-gray-400 mt-0.5">View and manage customer orders</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          placeholder="Search by name, phone, or order ID..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-300"
        />
        <div className="flex gap-2 overflow-x-auto">
          {STATUSES.map((s) => (
            <button
              key={s}
              onClick={() => { setStatus(s); setPage(1); }}
              className={`px-3 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-colors ${
                status === s ? 'bg-gray-900 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              {s === 'all' ? 'All' : s.replace(/_/g, ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-400">Loading orders...</div>
        ) : orders.length === 0 ? (
          <div className="p-12 text-center text-gray-400">No orders found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500 border-b border-gray-100 bg-gray-50/50">
                  <th className="px-6 py-3 font-medium">Order</th>
                  <th className="px-6 py-3 font-medium">Customer</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                  <th className="px-6 py-3 font-medium">Items</th>
                  <th className="px-6 py-3 font-medium">Type</th>
                  <th className="px-6 py-3 font-medium text-right">Total</th>
                  <th className="px-6 py-3 font-medium text-right">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50/50">
                    <td className="px-6 py-4">
                      <Link href={`/admin/orders/${order.id}`} className="text-orange-600 hover:underline font-mono text-xs">
                        {order.id.slice(-8)}
                      </Link>
                      {order.posOrderId && <p className="text-[0.625rem] text-gray-400 mt-0.5">POS: {order.posOrderId}</p>}
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-gray-900 font-medium">{order.customerName}</p>
                      <p className="text-xs text-gray-400">{order.customerPhone}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-lg text-xs font-medium ${STATUS_COLORS[order.status] || 'bg-gray-50 text-gray-600'}`}>
                        {order.status.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{order.itemCount}</td>
                    <td className="px-6 py-4">
                      <span className={`text-xs font-medium ${order.mode === 'healthy' ? 'text-green-600' : 'text-orange-600'}`}>
                        {order.mode}
                      </span>
                      <span className="text-gray-400 text-xs ml-1">/ {order.orderType}</span>
                    </td>
                    <td className="px-6 py-4 text-right font-medium text-gray-900">₹{order.totalAmount}</td>
                    <td className="px-6 py-4 text-right text-gray-500 text-xs">
                      {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
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
            <p className="text-sm text-gray-500">{pagination.total} orders total</p>
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
