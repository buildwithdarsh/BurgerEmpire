'use client';

import { useEffect, useState, useCallback, Fragment } from 'react';
import { TZ } from '@/lib/tz';
import type { AdminLoyaltyAccount } from '@buildwithdarsh/sdk';

const TIER_COLORS: Record<string, string> = {
  bronze: 'bg-orange-50 text-orange-700',
  silver: 'bg-gray-100 text-gray-700',
  gold: 'bg-yellow-50 text-yellow-700',
};

export default function AdminLoyalty() {
  const [accounts, setAccounts] = useState<AdminLoyaltyAccount[]>([]);
  const [summary, setSummary] = useState({ totalAccounts: 0, totalBalance: 0, totalEarned: 0, totalRedeemed: 0 });
  const [tierCounts, setTierCounts] = useState<{ tier: string; count: number }[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const load = useCallback(() => {
    setLoading(true);
    TZ.admin.loyaltyAdmin.get({ search })
      .then((d) => {
        setAccounts(d.accounts);
        setSummary(d.summary);
        setTierCounts(d.tierCounts);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [search]);

  useEffect(() => { load(); }, [load]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Loyalty Program</h1>
        <p className="text-sm text-gray-400 mt-0.5">Track accounts, balances, and tier distribution</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <p className="text-sm text-gray-500">Total Accounts</p>
          <p className="text-2xl font-semibold text-gray-900 mt-1">{summary.totalAccounts}</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <p className="text-sm text-gray-500">Active Balance</p>
          <p className="text-2xl font-semibold text-gray-900 mt-1">{summary.totalBalance.toLocaleString()}</p>
          <p className="text-xs text-gray-400">coins in circulation</p>
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

      {/* Tier Distribution */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-3">Tier Distribution</h2>
        <div className="flex gap-4">
          {tierCounts.map((t) => (
            <div key={t.tier} className={`px-4 py-2 rounded-xl text-sm font-medium ${TIER_COLORS[t.tier] || 'bg-gray-50 text-gray-600'}`}>
              <span className="capitalize">{t.tier}</span>
              <span className="ml-2 font-semibold">{t.count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Search */}
      <input
        type="text"
        placeholder="Search by name, email, or phone..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full max-w-md px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-300"
      />

      {/* Accounts Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-400">Loading...</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 border-b border-gray-100 bg-gray-50/50">
                <th className="px-6 py-3 font-medium">User</th>
                <th className="px-6 py-3 font-medium">Tier</th>
                <th className="px-6 py-3 font-medium text-right">Balance</th>
                <th className="px-6 py-3 font-medium text-right">Earned</th>
                <th className="px-6 py-3 font-medium text-right">Redeemed</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {accounts.map((acc) => (
                <Fragment key={acc.id}>
                  <tr
                    className="hover:bg-gray-50/50 cursor-pointer"
                    onClick={() => setExpandedId(expandedId === acc.id ? null : acc.id)}
                  >
                    <td className="px-6 py-4">
                      <p className="text-gray-900 font-medium">{acc.user.name || 'Unknown'}</p>
                      <p className="text-xs text-gray-400">{acc.user.email || acc.user.phone}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-lg text-xs font-medium capitalize ${TIER_COLORS[acc.tier]}`}>
                        {acc.tier}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right font-semibold text-gray-900">{acc.balance}</td>
                    <td className="px-6 py-4 text-right text-green-600">{acc.totalEarned}</td>
                    <td className="px-6 py-4 text-right text-orange-600">{acc.totalRedeemed}</td>
                  </tr>
                  {expandedId === acc.id && (
                    <tr key={`${acc.id}-txns`}>
                      <td colSpan={5} className="px-6 py-4 bg-gray-50/50">
                        <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2">Recent Transactions</h4>
                        {acc.transactions.length === 0 ? (
                          <p className="text-xs text-gray-400">No transactions</p>
                        ) : (
                          <div className="space-y-1">
                            {acc.transactions.map((txn) => (
                              <div key={txn.id} className="flex justify-between text-xs">
                                <span className="text-gray-600">
                                  <span className={`font-medium ${txn.coins > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                    {txn.coins > 0 ? '+' : ''}{txn.coins}
                                  </span>
                                  {' '}{txn.description}
                                </span>
                                <span className="text-gray-400">
                                  {new Date(txn.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                      </td>
                    </tr>
                  )}
                </Fragment>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
