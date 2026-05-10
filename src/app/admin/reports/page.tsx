'use client';

import { useEffect, useState, useCallback } from 'react';
import { TZ } from '@/lib/tz';

type ReportType = 'revenue' | 'items' | 'loyalty' | 'orders';

const TABS: { id: ReportType; label: string }[] = [
  { id: 'revenue', label: 'Revenue' },
  { id: 'items', label: 'Popular Items' },
  { id: 'loyalty', label: 'Loyalty' },
  { id: 'orders', label: 'Orders' },
];

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-50 text-yellow-700',
  confirmed: 'bg-blue-50 text-blue-700',
  preparing: 'bg-orange-50 text-orange-700',
  out_for_delivery: 'bg-purple-50 text-purple-700',
  delivered: 'bg-green-50 text-green-700',
  cancelled: 'bg-red-50 text-red-700',
  failed: 'bg-red-50 text-red-700',
};

export default function AdminReports() {
  const [tab, setTab] = useState<ReportType>('revenue');
  const [report, setReport] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const d = await TZ.admin.reports.get(tab);
      setReport(d);
    } catch {
      // silently handle
    } finally {
      setLoading(false);
    }
  }, [tab]);

  useEffect(() => { load(); }, [load]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Reports</h1>
        <p className="text-sm text-gray-400 mt-0.5">Analytics and insights across your business</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
              tab === t.id ? 'bg-gray-900 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-6">
          <div className="grid grid-cols-3 gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-2">
                <div className="h-4 w-24 bg-gray-100 rounded animate-pulse" />
                <div className="h-7 w-20 bg-gray-50 rounded animate-pulse" />
              </div>
            ))}
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="h-5 w-48 bg-gray-100 rounded animate-pulse mb-4" />
            <div className="h-48 bg-gray-50 rounded-xl animate-pulse" />
          </div>
        </div>
      ) : !report ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
          <svg className="w-12 h-12 mx-auto text-gray-200 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" /></svg>
          <p className="text-sm text-gray-500">Failed to load report</p>
          <p className="text-xs text-gray-400 mt-1">Please try again or check your connection</p>
        </div>
      ) : (
        <>
          {/* Revenue Report */}
          {tab === 'revenue' && <RevenueReport data={report} />}
          {tab === 'items' && <ItemsReport data={report} />}
          {tab === 'loyalty' && <LoyaltyReport data={report} />}
          {tab === 'orders' && <OrdersReport data={report} />}
        </>
      )}
    </div>
  );
}

function RevenueReport({ data }: { data: Record<string, unknown> }) {
  const daily = (data.daily || []) as { date: string; revenue: number; orders: number }[];
  const totalRevenue = (data.totalRevenue as number) ?? 0;
  const totalOrders = (data.totalOrders as number) ?? 0;
  const avgOrderValue = (data.avgOrderValue as number) ?? 0;
  const maxRevenue = Math.max(...daily.map((d) => d.revenue), 1);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <p className="text-sm text-gray-500">Total Revenue (30d)</p>
          <p className="text-2xl font-semibold text-gray-900 mt-1">₹{totalRevenue.toLocaleString('en-IN')}</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <p className="text-sm text-gray-500">Orders (30d)</p>
          <p className="text-2xl font-semibold text-gray-900 mt-1">{totalOrders}</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <p className="text-sm text-gray-500">Avg Order Value</p>
          <p className="text-2xl font-semibold text-gray-900 mt-1">₹{avgOrderValue}</p>
        </div>
      </div>

      {/* Bar Chart */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Daily Revenue (Last 30 Days)</h2>
        {daily.length === 0 ? (
          <p className="text-gray-400 text-sm">No data for this period</p>
        ) : (
          <div className="flex items-end gap-1 h-48">
            {daily.map((d) => (
              <div key={d.date} className="flex-1 h-full flex items-end group relative">
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[0.625rem] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                  {d.date}: ₹{Math.round(d.revenue)} ({d.orders} orders)
                </div>
                <div
                  className="w-full bg-orange-200 hover:bg-orange-400 rounded-t transition-colors"
                  style={{ height: `${Math.max((d.revenue / maxRevenue) * 100, 2)}%` }}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ItemsReport({ data }: { data: Record<string, unknown> }) {
  const topItems = (data.topItems || []) as { menuItemId: string; itemName: string; orderCount: number; totalRevenue: number }[];
  const maxCount = Math.max(...topItems.map((i) => i.orderCount), 1);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Top 10 Items by Orders</h2>
      <div className="space-y-3">
        {topItems.map((item, idx) => (
          <div key={`${item.menuItemId}-${idx}`} className="flex items-center gap-4">
            <span className="text-sm font-medium text-gray-400 w-6">#{idx + 1}</span>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-gray-900">{item.itemName}</span>
                <span className="text-sm text-gray-500">{item.orderCount} orders &middot; ₹{Math.round(item.totalRevenue)}</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-orange-400 rounded-full" style={{ width: `${(item.orderCount / maxCount) * 100}%` }} />
              </div>
            </div>
          </div>
        ))}
        {topItems.length === 0 && <p className="text-gray-400 text-sm">No order data yet</p>}
      </div>
    </div>
  );
}

function LoyaltyReport({ data }: { data: Record<string, unknown> }) {
  const summary = (data.summary as { totalAccounts: number; totalBalance: number; totalEarned: number; totalRedeemed: number }) ?? { totalAccounts: 0, totalBalance: 0, totalEarned: 0, totalRedeemed: 0 };
  const tierCounts = (data.tierCounts || []) as { tier: string; count: number }[];
  const recentTransactions = (data.recentTransactions || []) as {
    id: string; type: string; coins: number; description: string; createdAt: string;
    account: { user: { name: string | null } };
  }[];

  const TIER_COLORS: Record<string, string> = {
    bronze: 'bg-orange-50 text-orange-700',
    silver: 'bg-gray-100 text-gray-700',
    gold: 'bg-yellow-50 text-yellow-700',
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <p className="text-sm text-gray-500">Accounts</p>
          <p className="text-2xl font-semibold text-gray-900 mt-1">{summary.totalAccounts}</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <p className="text-sm text-gray-500">Active Balance</p>
          <p className="text-2xl font-semibold text-gray-900 mt-1">{summary.totalBalance.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <p className="text-sm text-gray-500">Total Earned</p>
          <p className="text-2xl font-semibold text-green-600 mt-1">{summary.totalEarned.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <p className="text-sm text-gray-500">Total Redeemed</p>
          <p className="text-2xl font-semibold text-orange-600 mt-1">{summary.totalRedeemed.toLocaleString()}</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Tier Distribution</h2>
          <div className="flex gap-4">
            {tierCounts.map((t) => (
              <div key={t.tier} className={`px-4 py-3 rounded-xl font-medium ${TIER_COLORS[t.tier] || 'bg-gray-50 text-gray-600'}`}>
                <p className="text-2xl font-semibold">{t.count}</p>
                <p className="text-xs capitalize">{t.tier}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Recent Transactions</h2>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {recentTransactions.map((txn) => (
              <div key={txn.id} className="flex justify-between items-center text-sm">
                <div>
                  <span className={`font-medium ${txn.coins > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {txn.coins > 0 ? '+' : ''}{txn.coins}
                  </span>
                  <span className="text-gray-500 ml-2">{txn.account.user.name || 'Unknown'}</span>
                </div>
                <span className="text-xs text-gray-400">
                  {new Date(txn.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function OrdersReport({ data }: { data: Record<string, unknown> }) {
  const byStatus = (data.byStatus || []) as { status: string; count: number }[];
  const byOrderType = (data.byOrderType || []) as { orderType: string; count: number }[];
  const byMode = (data.byMode || []) as { mode: string; count: number }[];

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">By Status</h2>
        <div className="space-y-2">
          {byStatus.map((s) => (
            <div key={s.status} className="flex items-center justify-between">
              <span className={`px-2.5 py-1 rounded-lg text-xs font-medium ${STATUS_COLORS[s.status] || 'bg-gray-50 text-gray-600'}`}>
                {s.status.replace(/_/g, ' ')}
              </span>
              <span className="font-semibold text-gray-900">{s.count}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">By Order Type</h2>
        <div className="space-y-3">
          {byOrderType.map((t) => (
            <div key={t.orderType} className="flex items-center justify-between">
              <span className="text-sm text-gray-600 capitalize">{t.orderType}</span>
              <span className="font-semibold text-gray-900">{t.count}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">By Mode</h2>
        <div className="space-y-3">
          {byMode.map((m) => (
            <div key={m.mode} className="flex items-center justify-between">
              <span className={`text-sm font-medium ${m.mode === 'healthy' ? 'text-green-600' : 'text-orange-600'}`}>
                {m.mode}
              </span>
              <span className="font-semibold text-gray-900">{m.count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
