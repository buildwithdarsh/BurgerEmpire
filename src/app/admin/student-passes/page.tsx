'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { SearchIcon, CheckIcon, XIcon, RefreshIcon } from '@/components/icons';
import { TZ } from '@/lib/tz';
import type { AdminStudentPass } from '@buildwithdarsh/sdk';

const adminApi = TZ.client.scoped('/api/v1', 'staff', false);

type TabType = 'pending' | 'all' | 'flagged';

const TABS: { id: TabType; label: string }[] = [
  { id: 'pending', label: 'Pending Review' },
  { id: 'all', label: 'All Passes' },
  { id: 'flagged', label: 'Flagged' },
];

const STATUS_COLORS: Record<string, string> = {
  PENDING: 'bg-yellow-50 text-yellow-700',
  VERIFIED: 'bg-green-50 text-green-700',
  REJECTED: 'bg-red-50 text-red-700',
  EXPIRED: 'bg-gray-100 text-gray-600',
  SUSPENDED: 'bg-red-50 text-red-700',
};

function isPastSLA(createdAt: string): boolean {
  const created = new Date(createdAt).getTime();
  const now = Date.now();
  return now - created > 48 * 60 * 60 * 1000;
}

export default function AdminStudentPasses() {
  const router = useRouter();
  const [tab, setTab] = useState<TabType>('pending');
  const [passes, setPasses] = useState<AdminStudentPass[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [institutionFilter, setInstitutionFilter] = useState('');
  const [institutions, setInstitutions] = useState<{ id: string; name: string }[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [bulkLoading, setBulkLoading] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const listParams: Record<string, string> = {};
      if (tab === 'pending') listParams.status = 'PENDING';
      if (tab === 'flagged') listParams.flagged = 'true';
      if (statusFilter && tab === 'all') listParams.status = statusFilter;
      if (institutionFilter) listParams.institutionId = institutionFilter;
      if (search) listParams.search = search;

      const [passResult, instResult] = await Promise.all([
        TZ.admin.studentPasses.list(listParams),
        TZ.admin.institutions.list(),
      ]);
      setPasses(passResult.data || []);
      setInstitutions(instResult.data || []);
    } catch {
      // silently handle
    } finally {
      setLoading(false);
    }
  }, [tab, statusFilter, institutionFilter, search]);

  useEffect(() => { load(); }, [load]);

  useEffect(() => { setSelected(new Set()); }, [tab, statusFilter, institutionFilter, search]);

  const toggleSelect = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selected.size === passes.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(passes.map((p) => p.id)));
    }
  };

  const bulkAction = async (action: 'approve' | 'reject') => {
    if (selected.size === 0) return;
    const msg = action === 'approve'
      ? `Approve ${selected.size} pass(es)?`
      : `Reject ${selected.size} pass(es)?`;
    if (!confirm(msg)) return;
    setBulkLoading(true);
    try {
      await adminApi.patch('/admin/student-passes', { ids: Array.from(selected), action });
      setSelected(new Set());
      load();
    } catch {
      // silently handle
    } finally {
      setBulkLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Student Passes</h1>
          <p className="text-sm text-gray-400 mt-0.5">Review and manage student verification passes</p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/admin/student-passes/stats/"
            className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
            View Stats
          </Link>
          <button onClick={load} className="p-2.5 border border-gray-200 rounded-xl text-gray-400 hover:bg-gray-50 transition-colors">
            <RefreshIcon size={16} />
          </button>
        </div>
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

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <SearchIcon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, or student ID..."
            className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-200"
          />
        </div>
        {tab === 'all' && (
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-200"
          >
            <option value="">All Statuses</option>
            <option value="PENDING">Pending</option>
            <option value="VERIFIED">Verified</option>
            <option value="REJECTED">Rejected</option>
            <option value="EXPIRED">Expired</option>
            <option value="SUSPENDED">Suspended</option>
          </select>
        )}
        <select
          value={institutionFilter}
          onChange={(e) => setInstitutionFilter(e.target.value)}
          className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-200"
        >
          <option value="">All Institutions</option>
          {institutions.map((inst) => (
            <option key={inst.id} value={inst.id}>{inst.name}</option>
          ))}
        </select>
      </div>

      {/* Bulk Actions */}
      {selected.size > 0 && (
        <div className="flex items-center gap-3 px-4 py-3 bg-orange-50 border border-orange-200 rounded-xl">
          <span className="text-sm font-medium text-orange-700">{selected.size} selected</span>
          <button
            onClick={() => bulkAction('approve')}
            disabled={bulkLoading}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-green-600 text-white rounded-lg text-xs font-medium hover:bg-green-700 disabled:opacity-50 transition-colors"
          >
            <CheckIcon size={13} />
            Bulk Approve
          </button>
          <button
            onClick={() => bulkAction('reject')}
            disabled={bulkLoading}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-red-600 text-white rounded-lg text-xs font-medium hover:bg-red-700 disabled:opacity-50 transition-colors"
          >
            <XIcon size={13} />
            Bulk Reject
          </button>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="divide-y divide-gray-50">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="px-6 py-4 flex gap-4">
                <div className="w-4 h-4 bg-gray-100 rounded animate-pulse" />
                <div className="w-28 h-4 bg-gray-100 rounded animate-pulse" />
                <div className="flex-1 h-4 bg-gray-50 rounded animate-pulse" />
                <div className="w-24 h-4 bg-gray-50 rounded animate-pulse" />
                <div className="w-20 h-4 bg-gray-50 rounded animate-pulse" />
                <div className="w-16 h-4 bg-gray-50 rounded animate-pulse" />
              </div>
            ))}
          </div>
        ) : passes.length === 0 ? (
          <div className="p-12 text-center">
            <svg className="w-12 h-12 mx-auto text-gray-200 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
            </svg>
            <p className="text-sm text-gray-400">
              {tab === 'pending' ? 'No passes pending review' : tab === 'flagged' ? 'No flagged passes' : 'No student passes found'}
            </p>
            <p className="text-xs text-gray-300 mt-1">Passes will appear here once students submit verification</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500 border-b border-gray-100 bg-gray-50/50">
                  <th className="px-6 py-3 font-medium w-10">
                    <input
                      type="checkbox"
                      checked={selected.size === passes.length && passes.length > 0}
                      onChange={toggleSelectAll}
                      className="w-4 h-4 rounded border-gray-300 text-orange-600"
                    />
                  </th>
                  <th className="px-6 py-3 font-medium">Student</th>
                  <th className="px-6 py-3 font-medium">Institution</th>
                  <th className="px-6 py-3 font-medium">Student ID</th>
                  <th className="px-6 py-3 font-medium">Submitted</th>
                  <th className="px-6 py-3 font-medium text-center">Status</th>
                  <th className="px-6 py-3 font-medium">Expiry</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {passes.map((pass) => {
                  const overSLA = pass.status === 'PENDING' && isPastSLA(pass.createdAt);
                  return (
                    <tr
                      key={pass.id}
                      onClick={() => router.push(`/admin/student-passes/${pass.id}`)}
                      className={`hover:bg-gray-50/50 cursor-pointer ${overSLA ? 'bg-red-50/30' : ''}`}
                    >
                      <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={selected.has(pass.id)}
                          onChange={() => toggleSelect(pass.id)}
                          className="w-4 h-4 rounded border-gray-300 text-orange-600"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-medium text-gray-900">{pass.user.name || 'Unknown'}</p>
                        <p className="text-xs text-gray-400">{pass.user.email || '-'}</p>
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        {pass.institution?.name || <span className="text-gray-300">-</span>}
                      </td>
                      <td className="px-6 py-4 font-mono text-xs text-gray-600">{pass.studentIdNumber}</td>
                      <td className="px-6 py-4">
                        <span className="text-gray-600 text-xs">
                          {new Date(pass.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </span>
                        {overSLA && (
                          <span className="ml-1.5 px-1.5 py-0.5 bg-red-100 text-red-700 text-[0.625rem] font-medium rounded">
                            SLA BREACH
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`px-2.5 py-1 rounded-lg text-xs font-medium ${STATUS_COLORS[pass.status] || 'bg-gray-50 text-gray-600'}`}>
                          {pass.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-500 text-xs">
                        {pass.expiresAt
                          ? new Date(pass.expiresAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
                          : '-'}
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
