'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { TZ } from '@/lib/tz';
import type { AdminDashboardData } from '@buildwithdarsh/sdk';

const STATUS_COLORS: Record<string, { pill: string; dot: string }> = {
  pending: { pill: 'bg-amber-50 text-amber-700', dot: 'bg-amber-400' },
  confirmed: { pill: 'bg-blue-50 text-blue-700', dot: 'bg-blue-400' },
  preparing: { pill: 'bg-orange-50 text-orange-700', dot: 'bg-orange-400' },
  out_for_delivery: { pill: 'bg-purple-50 text-purple-700', dot: 'bg-purple-400' },
  delivered: { pill: 'bg-emerald-50 text-emerald-700', dot: 'bg-emerald-400' },
  cancelled: { pill: 'bg-red-50 text-red-600', dot: 'bg-red-400' },
  failed: { pill: 'bg-red-50 text-red-600', dot: 'bg-red-400' },
};

const STAT_ICONS: Record<string, React.ReactNode> = {
  orders: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>,
  revenue: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
  active: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>,
  users: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
};

export default function AdminDashboard() {
  const [data, setData] = useState<AdminDashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    TZ.admin.dashboard.get()
      .then((d) => setData(d))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="text-2xl font-semibold text-gray-900" role="heading" aria-level={1}>Dashboard</div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 animate-pulse">
              <div className="h-4 bg-gray-100 rounded w-20 mb-3" />
              <div className="h-7 bg-gray-100 rounded w-24 mb-2" />
              <div className="h-3 bg-gray-50 rounded w-16" />
            </div>
          ))}
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 animate-pulse">
          <div className="h-5 bg-gray-100 rounded w-32 mb-4" />
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => <div key={i} className="h-10 bg-gray-50 rounded-xl" />)}
          </div>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="space-y-6">
        <div className="text-2xl font-semibold text-gray-900" role="heading" aria-level={1}>Dashboard</div>
        <div className="bg-white rounded-2xl border border-red-100 p-12 text-center">
          <svg className="w-12 h-12 mx-auto text-red-200 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <p className="text-red-600 font-medium">Failed to load dashboard</p>
          <p className="text-sm text-gray-400 mt-1">Please refresh the page or check your connection</p>
        </div>
      </div>
    );
  }

  const { stats, recentOrders, ordersByStatus } = data;

  const statCards = [
    { key: 'orders', label: 'Total Orders', value: stats.totalOrders.toLocaleString(), sub: `${stats.ordersToday} today`, color: 'text-blue-600', bg: 'bg-blue-50' },
    { key: 'revenue', label: 'Revenue', value: `₹${stats.totalRevenue.toLocaleString('en-IN')}`, sub: `₹${stats.revenueToday.toLocaleString('en-IN')} today`, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { key: 'active', label: 'Active Orders', value: stats.activeOrders.toString(), sub: 'In progress', color: 'text-orange-600', bg: 'bg-orange-50' },
    { key: 'users', label: 'Customers', value: stats.totalUsers.toLocaleString(), sub: `${stats.totalMenuItems} menu items`, color: 'text-purple-600', bg: 'bg-purple-50' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-400 mt-0.5">Overview of your store performance</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => (
          <div key={stat.key} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-medium text-gray-500">{stat.label}</p>
              <div className={`w-9 h-9 rounded-xl ${stat.bg} flex items-center justify-center ${stat.color}`}>
                {STAT_ICONS[stat.key]}
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            <p className="text-xs text-gray-400 mt-1">{stat.sub}</p>
          </div>
        ))}
      </div>

      {/* Order Status Breakdown */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Orders by Status</h2>
          <Link href="/admin/orders" className="text-xs text-gray-400 hover:text-gray-600 font-medium transition-colors">
            View all
          </Link>
        </div>
        <div className="flex flex-wrap gap-2.5">
          {ordersByStatus.map((s) => {
            const style = STATUS_COLORS[s.status] || { pill: 'bg-gray-50 text-gray-600', dot: 'bg-gray-400' };
            return (
              <div key={s.status} className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-medium ${style.pill}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
                <span className="capitalize">{s.status.replace(/_/g, ' ')}</span>
                <span className="font-bold ml-0.5">{s.count}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">Recent Orders</h2>
          <Link href="/admin/orders" className="text-sm text-orange-600 hover:text-orange-700 font-medium transition-colors">
            View all &rarr;
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <div className="p-12 text-center">
            <svg className="w-12 h-12 mx-auto text-gray-200 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
            <p className="text-sm text-gray-400">No orders yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500 border-b border-gray-100 bg-gray-50/50">
                  <th className="px-6 py-3 font-medium">Order</th>
                  <th className="px-6 py-3 font-medium">Customer</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                  <th className="px-6 py-3 font-medium">Mode</th>
                  <th className="px-6 py-3 font-medium text-right">Total</th>
                  <th className="px-6 py-3 font-medium text-right">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {recentOrders.map((order) => {
                  const style = STATUS_COLORS[order.status] || { pill: 'bg-gray-50 text-gray-600', dot: 'bg-gray-400' };
                  return (
                    <tr key={order.id} className="hover:bg-gray-50/50">
                      <td className="px-6 py-3.5">
                        <Link href={`/admin/orders/${order.id}`} className="text-orange-600 hover:text-orange-700 font-mono text-xs font-medium">
                          #{order.id.slice(-8)}
                        </Link>
                      </td>
                      <td className="px-6 py-3.5 text-gray-900 font-medium">{order.customerName}</td>
                      <td className="px-6 py-3.5">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium ${style.pill}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
                          {order.status.replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-3.5">
                        <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-md ${
                          order.mode === 'healthy' ? 'bg-green-50 text-green-700' : 'bg-orange-50 text-orange-700'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${order.mode === 'healthy' ? 'bg-green-400' : 'bg-orange-400'}`} />
                          {order.mode}
                        </span>
                      </td>
                      <td className="px-6 py-3.5 text-right font-semibold text-gray-900">₹{order.totalAmount}</td>
                      <td className="px-6 py-3.5 text-right text-gray-400 text-xs">
                        {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
