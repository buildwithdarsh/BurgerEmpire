'use client';

import { useEffect, useState, useCallback } from 'react';

/**
 * Admin-specific referral types for the referrals dashboard.
 * The SDK only exports ReferralInfo (user's own referral code/stats) and
 * ReferralValidation — these admin types (aggregated stats, top referrers,
 * full referral records) are not represented in the SDK.
 */
interface ReferralUser {
  id: string;
  name: string | null;
  email: string | null;
  phone: string | null;
}

interface Referral {
  id: string;
  referrer: ReferralUser;
  referee: ReferralUser;
  code: string;
  status: string;
  coinsAwarded: number;
  createdAt: string;
}

interface TopReferrer {
  referrerId: string;
  _count: { id: number };
  _sum: { coinsAwarded: number | null };
  user: ReferralUser | null;
}

interface Stats {
  total: number;
  completed: number;
  pending: number;
  conversionRate: number;
  totalCoinsAwarded: number;
}

interface PageData {
  stats: Stats;
  referrals: Referral[];
  topReferrers: TopReferrer[];
  pagination: { page: number; limit: number; total: number; pages: number };
}

function getAdminToken(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    const stored = localStorage.getItem('bb-auth');
    if (!stored) return null;
    return JSON.parse(stored)?.state?.accessToken ?? null;
  } catch {
    return null;
  }
}

const STATUS_STYLES: Record<string, { pill: string; dot: string; label: string }> = {
  COMPLETED: { pill: 'bg-emerald-50 text-emerald-700 border-emerald-100', dot: 'bg-emerald-400', label: 'Completed' },
  PENDING:   { pill: 'bg-amber-50 text-amber-700 border-amber-100',     dot: 'bg-amber-400',   label: 'Pending' },
};

export default function AdminReferralsPage() {
  const [data, setData] = useState<PageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  // Justified: Admin referral data (aggregated stats, top referrers, full records)
  // is not represented in the SDK — only ReferralInfo and ReferralValidation exist.
  // This needs a dedicated admin SDK method or Next.js API route.
  const load = useCallback(async (p: number) => {
    setLoading(true);
    try {
      const token = getAdminToken();
      const res = await fetch(`/api/admin/referrals?page=${p}&limit=20`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const json = await res.json();
      if (json.success) setData(json);
    } catch { /* ignore */ } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(page); }, [page, load]);

  const fmt = (d: string) =>
    new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: '2-digit' });

  const userLabel = (u: ReferralUser | null) =>
    u ? (u.name || u.email || u.phone || u.id.slice(0, 8)) : '—';

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Referral Program</h1>
        <p className="text-sm text-gray-400 mt-0.5">Track referrals, conversions, and coins awarded</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { label: 'Total Referrals',     value: data?.stats.total              ?? '—', color: 'text-gray-900' },
          { label: 'Completed',           value: data?.stats.completed          ?? '—', color: 'text-emerald-600' },
          { label: 'Pending',             value: data?.stats.pending            ?? '—', color: 'text-amber-600' },
          { label: 'Conversion Rate',     value: data ? `${data.stats.conversionRate}%` : '—', color: 'text-blue-600' },
          { label: 'Coins Awarded',       value: data?.stats.totalCoinsAwarded  ?? '—', color: 'text-orange-600' },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <p className="text-sm text-gray-500">{s.label}</p>
            <p className={`text-2xl font-semibold mt-1 ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Referrers */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Top Referrers</h2>
          {loading || !data ? (
            <div className="space-y-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-10 bg-gray-50 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : data.topReferrers.length === 0 ? (
            <div className="py-8 text-center">
              <svg className="w-10 h-10 mx-auto text-gray-200 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              <p className="text-sm text-gray-400">No referrals yet</p>
            </div>
          ) : (
            <div className="space-y-2">
              {data.topReferrers.map((r, i) => (
                <div key={r.referrerId} className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[0.625rem] font-bold ${
                    i === 0 ? 'bg-amber-100 text-amber-700' : i === 1 ? 'bg-gray-200 text-gray-600' : i === 2 ? 'bg-orange-100 text-orange-700' : 'bg-gray-100 text-gray-500'
                  }`}>{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{userLabel(r.user)}</p>
                    <p className="text-xs text-gray-400">{r._sum.coinsAwarded ?? 0} coins</p>
                  </div>
                  <span className="text-sm font-bold text-gray-700">{r._count.id}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Referrals Table */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">All Referrals</h2>
            {data && data.pagination.total > 0 && (
              <span className="text-xs text-gray-400">{data.pagination.total} total</span>
            )}
          </div>

          {loading ? (
            <div className="divide-y divide-gray-50">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="px-6 py-3.5 flex gap-4">
                  <div className="flex-1 h-4 bg-gray-50 rounded animate-pulse" />
                  <div className="w-20 h-4 bg-gray-50 rounded animate-pulse" />
                </div>
              ))}
            </div>
          ) : !data || data.referrals.length === 0 ? (
            <div className="p-12 text-center">
              <svg className="w-12 h-12 mx-auto text-gray-200 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              <p className="text-sm text-gray-400">No referrals yet</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-gray-500 border-b border-gray-100 bg-gray-50/50">
                      <th className="px-6 py-3 font-medium">Referrer</th>
                      <th className="px-6 py-3 font-medium">Friend</th>
                      <th className="px-6 py-3 font-medium">Code</th>
                      <th className="px-6 py-3 font-medium">Status</th>
                      <th className="px-6 py-3 font-medium text-right">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {data.referrals.map((ref) => {
                      const s = STATUS_STYLES[ref.status] ?? STATUS_STYLES.PENDING;
                      return (
                        <tr key={ref.id} className="hover:bg-gray-50/50">
                          <td className="px-6 py-3.5">
                            <p className="text-gray-900 font-medium">{userLabel(ref.referrer)}</p>
                            <p className="text-xs text-gray-400">{ref.referrer.phone || ref.referrer.email || ''}</p>
                          </td>
                          <td className="px-6 py-3.5">
                            <p className="text-gray-900 font-medium">{userLabel(ref.referee)}</p>
                          </td>
                          <td className="px-6 py-3.5">
                            <span className="font-mono text-xs text-gray-500 bg-gray-50 px-2 py-0.5 rounded border border-gray-100">{ref.code}</span>
                          </td>
                          <td className="px-6 py-3.5">
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border ${s.pill}`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
                              {s.label}
                            </span>
                            {ref.coinsAwarded > 0 && (
                              <span className="text-xs text-gray-400 ml-2">+{ref.coinsAwarded}</span>
                            )}
                          </td>
                          <td className="px-6 py-3.5 text-right text-gray-500 text-xs">{fmt(ref.createdAt)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {data.pagination.pages > 1 && (
                <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-sm text-gray-500">
                    Page {data.pagination.page} of {data.pagination.pages}
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm disabled:opacity-40 hover:bg-gray-50 transition-colors"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => setPage((p) => Math.min(data.pagination.pages, p + 1))}
                      disabled={page === data.pagination.pages}
                      className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm disabled:opacity-40 hover:bg-gray-50 transition-colors"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
