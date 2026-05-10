'use client';

import { useEffect, useState, useCallback } from 'react';
import { TZ } from '@/lib/tz';
import type { AdminMealSubscription } from '@buildwithdarsh/sdk';

type Subscription = AdminMealSubscription;

const STATUS_COLORS: Record<string, string> = {
  active: 'bg-green-50 text-green-700',
  paused: 'bg-yellow-50 text-yellow-700',
  cancelled: 'bg-red-50 text-red-700',
  expired: 'bg-gray-100 text-gray-600',
};

const STATUSES = ['all', 'active', 'paused', 'cancelled', 'expired'];

export default function AdminSubscriptions() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, string> = {};
      if (statusFilter !== 'all') params.status = statusFilter;
      const result = await TZ.admin.mealSubscriptions.list(params);
      setSubscriptions(result.data);
    } catch { /* ignore */ }
    finally { setLoading(false); }
  }, [statusFilter]);

  useEffect(() => { load(); }, [load]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Subscriptions</h1>
        <p className="text-sm text-gray-400 mt-0.5">View and manage customer meal plan subscriptions</p>
      </div>

      {/* Status Filter */}
      <div className="flex gap-2 overflow-x-auto">
        {STATUSES.map((s) => (
          <button key={s} onClick={() => setStatusFilter(s)}
            className={`px-3 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-colors capitalize ${statusFilter === s ? 'bg-gray-900 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
            {s === 'all' ? 'All' : s}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="divide-y divide-gray-50">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="px-6 py-4 flex gap-4">
                <div className="w-32 h-4 bg-gray-100 rounded animate-pulse" />
                <div className="w-28 h-4 bg-gray-50 rounded animate-pulse" />
                <div className="flex-1 h-4 bg-gray-50 rounded animate-pulse" />
                <div className="w-20 h-4 bg-gray-50 rounded animate-pulse" />
                <div className="w-16 h-4 bg-gray-50 rounded animate-pulse" />
              </div>
            ))}
          </div>
        ) : subscriptions.length === 0 ? (
          <div className="p-12 text-center">
            <svg className="w-12 h-12 mx-auto text-gray-200 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 00-3.7-3.7 48.678 48.678 0 00-7.324 0 4.006 4.006 0 00-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3l-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 003.7 3.7 48.656 48.656 0 007.324 0 4.006 4.006 0 003.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3l-3 3" /></svg>
            <p className="text-sm text-gray-400">No subscriptions found</p>
            <p className="text-xs text-gray-300 mt-1">Customer subscriptions will appear here once meal plans are active</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500 border-b border-gray-100 bg-gray-50/50">
                  <th className="px-6 py-3 font-medium">Customer</th>
                  <th className="px-6 py-3 font-medium">Meal Plan</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                  <th className="px-6 py-3 font-medium">Start</th>
                  <th className="px-6 py-3 font-medium">End</th>
                  <th className="px-6 py-3 font-medium">Delivery Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {subscriptions.map((sub) => (
                  <tr key={sub.id} className="hover:bg-gray-50/50">
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-900">{sub.userName}</p>
                      <p className="text-xs text-gray-400">{sub.userPhone}</p>
                    </td>
                    <td className="px-6 py-4 text-gray-900">{sub.mealPlanName}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-lg text-xs font-medium capitalize ${STATUS_COLORS[sub.status] || 'bg-gray-50 text-gray-600'}`}>
                        {sub.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-600 text-xs">
                      {new Date(sub.startDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="px-6 py-4 text-gray-600 text-xs">
                      {new Date(sub.endDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="px-6 py-4 text-gray-600">{sub.deliveryTime || '-'}</td>
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
