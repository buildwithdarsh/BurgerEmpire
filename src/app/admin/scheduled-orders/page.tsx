'use client';

import { useEffect, useState, useCallback } from 'react';
import { TZ } from '@/lib/tz';
import type { AdminScheduledOrder } from '@buildwithdarsh/sdk';

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-50 text-yellow-700',
  confirmed: 'bg-blue-50 text-blue-700',
  preparing: 'bg-orange-50 text-orange-700',
  delivered: 'bg-green-50 text-green-700',
  cancelled: 'bg-red-50 text-red-700',
};

const TABS = ['Scheduled', 'Catering'] as const;
type Tab = (typeof TABS)[number];

export default function AdminScheduledOrders() {
  const [tab, setTab] = useState<Tab>('Scheduled');
  const [orders, setOrders] = useState<AdminScheduledOrder[]>([]);
  const [catering, setCatering] = useState<AdminScheduledOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [dateFilter, setDateFilter] = useState('');

  const loadScheduled = useCallback(async () => {
    setLoading(true);
    try {
      const d = await TZ.admin.scheduledOrders.list({ date: dateFilter || undefined });
      setOrders(d);
    } catch {
      // silently handle
    } finally {
      setLoading(false);
    }
  }, [dateFilter]);

  const loadCatering = useCallback(async () => {
    try {
      const d = await TZ.admin.scheduledOrders.catering();
      setCatering(d);
    } catch {
      // silently handle
    }
  }, []);

  useEffect(() => { loadScheduled(); loadCatering(); }, [loadScheduled, loadCatering]);

  const activeList = tab === 'Scheduled' ? orders : catering;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Scheduled Orders</h1>
        <p className="text-sm text-gray-400 mt-0.5">Manage scheduled and catering orders</p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-3">
        <div className="flex gap-2">
          {TABS.map((t) => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${tab === t ? 'bg-gray-900 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
              {t}
            </button>
          ))}
        </div>
        {tab === 'Scheduled' && (
          <input type="date" value={dateFilter} onChange={(e) => setDateFilter(e.target.value)}
            className="ml-auto px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-200" />
        )}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="divide-y divide-gray-50">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="px-6 py-4 flex gap-4">
                <div className="w-20 h-4 bg-gray-100 rounded animate-pulse" />
                <div className="w-32 h-4 bg-gray-50 rounded animate-pulse" />
                <div className="flex-1 h-4 bg-gray-50 rounded animate-pulse" />
                <div className="w-24 h-4 bg-gray-50 rounded animate-pulse" />
                <div className="w-16 h-4 bg-gray-50 rounded animate-pulse" />
              </div>
            ))}
          </div>
        ) : activeList.length === 0 ? (
          <div className="p-12 text-center">
            <svg className="w-12 h-12 mx-auto text-gray-200 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <p className="text-sm text-gray-400">No {tab.toLowerCase()} orders found</p>
            <p className="text-xs text-gray-300 mt-1">{tab === 'Scheduled' ? 'Scheduled orders will appear here' : 'Catering orders will appear here'}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500 border-b border-gray-100 bg-gray-50/50">
                  <th className="px-6 py-3 font-medium">Order ID</th>
                  <th className="px-6 py-3 font-medium">Customer</th>
                  <th className="px-6 py-3 font-medium">Scheduled At</th>
                  <th className="px-6 py-3 font-medium">Type</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                  <th className="px-6 py-3 font-medium text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {activeList.map((o) => (
                  <tr key={o.id} className="hover:bg-gray-50/50">
                    <td className="px-6 py-4 font-mono text-xs text-orange-600">{o.orderID || o.id.slice(-8)}</td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-900">{o.customerName}</p>
                      <p className="text-xs text-gray-400">{o.customerPhone}</p>
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {new Date(o.scheduledAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      <p className="text-xs text-gray-400">{new Date(o.scheduledAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</p>
                    </td>
                    <td className="px-6 py-4 text-gray-600 capitalize">{o.orderType}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-lg text-xs font-medium capitalize ${STATUS_COLORS[o.status] || 'bg-gray-50 text-gray-600'}`}>
                        {o.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right font-medium text-gray-900">{o.totalAmount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
