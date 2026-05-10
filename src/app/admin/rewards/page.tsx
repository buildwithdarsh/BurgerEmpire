'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { TZ } from '@/lib/tz';
import type { AdminRedemption } from '@buildwithdarsh/sdk';

const STATUS_STYLES: Record<string, { pill: string; dot: string }> = {
  pending: { pill: 'bg-amber-50 text-amber-700 border-amber-100', dot: 'bg-amber-400' },
  fulfilled: { pill: 'bg-emerald-50 text-emerald-700 border-emerald-100', dot: 'bg-emerald-400' },
  expired: { pill: 'bg-red-50 text-red-600 border-red-100', dot: 'bg-red-400' },
};

const FILTER_LABELS: Record<string, string> = {
  all: 'All',
  pending: 'Pending',
  fulfilled: 'Fulfilled',
  expired: 'Expired',
};

export default function AdminRewardsPage() {
  const [code, setCode] = useState('');
  const [fulfilling, setFulfilling] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string; redemption?: { rewardName?: string; customerName?: string; coins?: number } } | null>(null);
  const [redemptions, setRedemptions] = useState<AdminRedemption[]>([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const loadRedemptions = useCallback(() => {
    setLoading(true);
    TZ.admin.redemptions.list({ status: filter })
      .then((d) => setRedemptions(d))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [filter]);

  useEffect(() => { loadRedemptions(); }, [loadRedemptions]);

  const handleFulfill = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim() || fulfilling) return;
    setFulfilling(true);
    setResult(null);

    try {
      const data = await TZ.admin.redemptions.fulfill({ code: code.trim() });
      setResult({ success: true, message: data.message || 'Fulfilled', redemption: data.redemption });
      setCode('');
      loadRedemptions();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Network error';
      setResult({ success: false, message: msg });
    } finally {
      setFulfilling(false);
      inputRef.current?.focus();
    }
  };

  // Quick-fulfill from table row
  const handleQuickFulfill = async (redeemCode: string) => {
    setFulfilling(true);
    setResult(null);
    try {
      const data = await TZ.admin.redemptions.fulfill({ code: redeemCode });
      setResult({ success: true, message: data.message || 'Fulfilled', redemption: data.redemption });
      loadRedemptions();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Network error';
      setResult({ success: false, message: msg });
    } finally {
      setFulfilling(false);
    }
  };

  // Computed stats
  const pendingCount = redemptions.filter((r) => r.status === 'pending').length;
  const fulfilledCount = redemptions.filter((r) => r.status === 'fulfilled').length;
  const totalCoinsRedeemed = redemptions.reduce((sum, r) => sum + r.coins, 0);

  // Filtered by search
  const filtered = search
    ? redemptions.filter((r) =>
        r.code.toLowerCase().includes(search.toLowerCase()) ||
        r.rewardName.toLowerCase().includes(search.toLowerCase()) ||
        r.user.name?.toLowerCase().includes(search.toLowerCase()) ||
        r.user.phone?.includes(search) ||
        r.user.email?.toLowerCase().includes(search.toLowerCase())
      )
    : redemptions;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Reward AdminRedemptions</h1>
          <p className="text-sm text-gray-500 mt-0.5">Manage customer reward codes and fulfillments</p>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <p className="text-sm text-gray-500">Total AdminRedemptions</p>
          <p className="text-2xl font-semibold text-gray-900 mt-1">{redemptions.length}</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-amber-400" />
            <p className="text-sm text-gray-500">Pending</p>
          </div>
          <p className="text-2xl font-semibold text-amber-600 mt-1">{pendingCount}</p>
          <p className="text-xs text-gray-400">awaiting fulfillment</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-400" />
            <p className="text-sm text-gray-500">Fulfilled</p>
          </div>
          <p className="text-2xl font-semibold text-emerald-600 mt-1">{fulfilledCount}</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <p className="text-sm text-gray-500">Coins Redeemed</p>
          <p className="text-2xl font-semibold text-orange-600 mt-1">{totalCoinsRedeemed.toLocaleString()}</p>
          <p className="text-xs text-gray-400">total coins spent</p>
        </div>
      </div>

      {/* Fulfill Code Card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Fulfill Reward Code</h2>
            <p className="text-sm text-gray-400 mt-0.5">Enter the customer&apos;s 6-digit reward code</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center">
            <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" /></svg>
          </div>
        </div>

        <form onSubmit={handleFulfill} className="flex gap-3">
          <div className="relative flex-1 max-w-xs">
            <input
              ref={inputRef}
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ''))}
              placeholder="A1B2C3"
              maxLength={6}
              autoFocus
              className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-xl text-xl font-mono tracking-[0.4em] text-center text-gray-900 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-300 uppercase"
            />
            {code.length > 0 && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-0.5">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className={`w-1.5 h-1.5 rounded-full transition-colors ${i < code.length ? 'bg-orange-400' : 'bg-gray-200'}`}
                  />
                ))}
              </div>
            )}
          </div>
          <button
            type="submit"
            disabled={code.trim().length < 4 || fulfilling}
            className="px-8 py-3 bg-gray-900 text-white rounded-xl text-sm font-semibold hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all active:scale-[0.98]"
          >
            {fulfilling ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                Verifying
              </span>
            ) : (
              'Fulfill'
            )}
          </button>
        </form>

        {result && (
          <div className={`mt-4 rounded-xl p-4 ${result.success ? 'bg-emerald-50 border border-emerald-100' : 'bg-red-50 border border-red-100'}`}>
            <div className="flex items-start gap-3">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${result.success ? 'bg-emerald-500' : 'bg-red-500'}`}>
                {result.success ? (
                  <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                ) : (
                  <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
                )}
              </div>
              <div>
                <p className={`text-sm font-medium ${result.success ? 'text-emerald-700' : 'text-red-700'}`}>
                  {result.message}
                </p>
                {result.success && result.redemption && (
                  <div className="mt-1.5 text-xs text-gray-500 space-y-0.5">
                    <p>Reward: <span className="text-gray-900 font-medium">{result.redemption.rewardName}</span></p>
                    <p>Customer: <span className="text-gray-900 font-medium">{result.redemption.customerName}</span></p>
                    <p>Coins: <span className="text-gray-900 font-medium">{result.redemption.coins}</span></p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          placeholder="Search by code, name, phone, or reward..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-300"
        />
        <div className="flex gap-2">
          {Object.entries(FILTER_LABELS).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`px-3 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-colors ${
                filter === key ? 'bg-gray-900 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              {label}
              {key === 'pending' && pendingCount > 0 && (
                <span className="ml-1.5 inline-flex items-center justify-center w-5 h-5 rounded-full text-[0.625rem] font-bold bg-amber-100 text-amber-700">
                  {pendingCount}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* AdminRedemption Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-400">Loading redemptions...</div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center">
            <svg className="w-12 h-12 mx-auto text-gray-200 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" /></svg>
            <p className="text-sm text-gray-400">{search ? 'No redemptions match your search' : 'No redemptions found'}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500 border-b border-gray-100 bg-gray-50/50">
                  <th className="px-6 py-3 font-medium">Code</th>
                  <th className="px-6 py-3 font-medium">Reward</th>
                  <th className="px-6 py-3 font-medium">Customer</th>
                  <th className="px-6 py-3 font-medium text-right">Coins</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                  <th className="px-6 py-3 font-medium text-right">Date</th>
                  <th className="px-6 py-3 font-medium text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((r) => {
                  const style = STATUS_STYLES[r.status] || STATUS_STYLES.pending;
                  return (
                    <tr key={r.id} className="hover:bg-gray-50/50">
                      <td className="px-6 py-4">
                        <span className="font-mono font-bold tracking-[0.15em] text-gray-900 bg-gray-50 px-2.5 py-1 rounded-lg border border-gray-100">
                          {r.code}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-gray-900 font-medium">{r.rewardName}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-gray-900 font-medium">{r.user.name || '—'}</p>
                        <p className="text-xs text-gray-400">{r.user.phone || r.user.email || ''}</p>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="font-semibold text-orange-600">{r.coins}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border ${style.pill}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
                          {r.status.charAt(0).toUpperCase() + r.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right text-gray-500 text-xs">
                        <p>{new Date(r.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                        <p className="text-gray-300">{new Date(r.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</p>
                      </td>
                      <td className="px-6 py-4 text-right">
                        {r.status === 'pending' ? (
                          <button
                            onClick={() => handleQuickFulfill(r.code)}
                            disabled={fulfilling}
                            className="px-3 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg text-xs font-medium hover:bg-emerald-100 disabled:opacity-40 transition-colors"
                          >
                            Fulfill
                          </button>
                        ) : r.status === 'fulfilled' ? (
                          <span className="text-xs text-gray-400">
                            {r.fulfilledAt ? new Date(r.fulfilledAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : '—'}
                          </span>
                        ) : (
                          <span className="text-xs text-gray-300">—</span>
                        )}
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
