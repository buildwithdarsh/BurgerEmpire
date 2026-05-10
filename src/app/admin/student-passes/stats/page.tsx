'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { ChevronIcon, RefreshIcon } from '@/components/icons';
import { TZ } from '@/lib/tz';
import type { AdminStudentPassStats } from '@buildwithdarsh/sdk';

const STATUS_COLORS: Record<string, string> = {
  PENDING: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  VERIFIED: 'bg-green-50 text-green-700 border-green-200',
  REJECTED: 'bg-red-50 text-red-700 border-red-200',
  EXPIRED: 'bg-gray-50 text-gray-600 border-gray-200',
  SUSPENDED: 'bg-red-50 text-red-700 border-red-200',
};

function formatDuration(ms: number | null): string {
  if (ms === null) return 'N/A';
  const hours = Math.floor(ms / (1000 * 60 * 60));
  const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
  if (hours > 24) return `${Math.round(hours / 24)}d ${hours % 24}h`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
}

export default function AdminStudentPassStats() {
  const [stats, setStats] = useState<AdminStudentPassStats | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const result = await TZ.admin.studentPasses.stats();
      setStats(result);
    } catch {
      // silently handle
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  return (
    <div className="space-y-6">
      {/* Breadcrumb + Header */}
      <div className="flex items-center justify-between">
        <div>
          <Link href="/admin/student-passes" className="text-sm text-orange-600 hover:underline flex items-center gap-1 w-fit mb-2">
            <ChevronIcon size={14} direction="left" /> Back to Student Passes
          </Link>
          <h1 className="text-2xl font-semibold text-gray-900">Student Pass Stats</h1>
          <p className="text-sm text-gray-400 mt-0.5">Overview of student pass verification metrics</p>
        </div>
        <button onClick={load} className="p-2.5 border border-gray-200 rounded-xl text-gray-400 hover:bg-gray-50 transition-colors">
          <RefreshIcon size={16} />
        </button>
      </div>

      {loading ? (
        <div className="space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-2">
                <div className="h-4 w-24 bg-gray-100 rounded animate-pulse" />
                <div className="h-7 w-20 bg-gray-50 rounded animate-pulse" />
              </div>
            ))}
          </div>
          <div className="grid lg:grid-cols-2 gap-6">
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <div className="h-5 w-48 bg-gray-100 rounded animate-pulse mb-4" />
                <div className="space-y-3">
                  <div className="h-4 bg-gray-50 rounded animate-pulse" />
                  <div className="h-4 bg-gray-50 rounded animate-pulse w-3/4" />
                  <div className="h-4 bg-gray-50 rounded animate-pulse w-1/2" />
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : !stats ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
          <svg className="w-12 h-12 mx-auto text-gray-200 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <p className="text-sm text-gray-500">Failed to load stats</p>
          <p className="text-xs text-gray-400 mt-1">Please try again or check your connection</p>
        </div>
      ) : (
        <>
          {/* KPI Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Passes by Status */}
            {stats.totalByStatus.map((s) => (
              <div key={s.status} className={`rounded-2xl border shadow-sm p-5 ${STATUS_COLORS[s.status] || 'bg-white border-gray-100'}`}>
                <p className="text-sm opacity-80">{s.status}</p>
                <p className="text-2xl font-semibold mt-1">{s.count}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <p className="text-sm text-gray-500">Auto-Verified %</p>
              <p className="text-2xl font-semibold text-gray-900 mt-1">{stats.autoVerifiedPct.toFixed(1)}%</p>
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <p className="text-sm text-gray-500">Currently Pending</p>
              <p className="text-2xl font-semibold text-yellow-600 mt-1">{stats.pendingCount}</p>
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <p className="text-sm text-gray-500">Avg Review Time</p>
              <p className="text-2xl font-semibold text-gray-900 mt-1">{formatDuration(stats.avgReviewTimeMs)}</p>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Top Institutions */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100">
                <h2 className="font-semibold text-gray-900">Top Institutions</h2>
              </div>
              {stats.topInstitutions.length === 0 ? (
                <div className="p-6 text-center">
                  <p className="text-sm text-gray-400">No institution data yet</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left text-gray-500 bg-gray-50/50">
                        <th className="px-6 py-2.5 font-medium text-xs">#</th>
                        <th className="px-6 py-2.5 font-medium text-xs">Institution</th>
                        <th className="px-6 py-2.5 font-medium text-xs text-right">Active Passes</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {stats.topInstitutions.map((inst, idx) => (
                        <tr key={inst.id} className="hover:bg-gray-50/50">
                          <td className="px-6 py-3 text-gray-400 font-medium">{idx + 1}</td>
                          <td className="px-6 py-3 font-medium text-gray-900">{inst.name}</td>
                          <td className="px-6 py-3 text-right font-semibold text-gray-900">{inst.activePassCount}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Top Discount Rules */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100">
                <h2 className="font-semibold text-gray-900">Top Discount Rules</h2>
              </div>
              {stats.topDiscountRules.length === 0 ? (
                <div className="p-6 text-center">
                  <p className="text-sm text-gray-400">No discount usage data yet</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left text-gray-500 bg-gray-50/50">
                        <th className="px-6 py-2.5 font-medium text-xs">#</th>
                        <th className="px-6 py-2.5 font-medium text-xs">Rule Name</th>
                        <th className="px-6 py-2.5 font-medium text-xs text-right">Total Discount Given</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {stats.topDiscountRules.map((rule, idx) => (
                        <tr key={rule.id} className="hover:bg-gray-50/50">
                          <td className="px-6 py-3 text-gray-400 font-medium">{idx + 1}</td>
                          <td className="px-6 py-3 font-medium text-gray-900">{rule.name}</td>
                          <td className="px-6 py-3 text-right font-semibold text-gray-900">
                            ₹{rule.totalDiscountGiven.toLocaleString('en-IN')}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
