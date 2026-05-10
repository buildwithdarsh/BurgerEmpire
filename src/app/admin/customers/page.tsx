'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { SearchIcon } from '@/components/icons';
import { TZ } from '@/lib/tz';
import type { AdminCustomer } from '@buildwithdarsh/sdk';

const TIER_COLORS: Record<string, string> = {
  gold: 'bg-yellow-50 text-yellow-700',
  silver: 'bg-gray-100 text-gray-600',
  bronze: 'bg-orange-50 text-orange-700',
};

export default function AdminCustomers() {
  const [customers, setCustomers] = useState<AdminCustomer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, totalPages: 1 });

  const load = useCallback(() => {
    setLoading(true);
    TZ.admin.endUsers.list({ page, limit: 20, search: search || undefined })
      .then((result) => {
        setCustomers(result.data);
        setPagination({ total: result.pagination.total, totalPages: result.pagination.totalPages });
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [page, search]);

  useEffect(() => { load(); }, [load]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Customers</h1>
        <p className="text-sm text-gray-400 mt-0.5">View and manage customer accounts</p>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
          <SearchIcon size={16} color="#9CA3AF" />
        </div>
        <input
          type="text"
          placeholder="Search by name, email, or phone..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-300"
        />
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="divide-y divide-gray-50">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="px-6 py-4 flex gap-4">
                <div className="w-32 h-4 bg-gray-100 rounded animate-pulse" />
                <div className="w-40 h-4 bg-gray-50 rounded animate-pulse" />
                <div className="w-24 h-4 bg-gray-50 rounded animate-pulse" />
                <div className="w-12 h-4 bg-gray-50 rounded animate-pulse" />
                <div className="w-16 h-4 bg-gray-50 rounded animate-pulse" />
                <div className="w-20 h-4 bg-gray-50 rounded animate-pulse" />
              </div>
            ))}
          </div>
        ) : customers.length === 0 ? (
          <div className="p-12 text-center">
            <svg className="w-12 h-12 mx-auto text-gray-200 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
            </svg>
            <p className="text-sm text-gray-400">{search ? 'No customers match your search' : 'No customers yet'}</p>
            <p className="text-xs text-gray-300 mt-1">{search ? 'Try a different search term' : 'Customers will appear here when they sign up'}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500 border-b border-gray-100 bg-gray-50/50">
                  <th className="px-6 py-3 font-medium">Name</th>
                  <th className="px-6 py-3 font-medium">Email</th>
                  <th className="px-6 py-3 font-medium">Phone</th>
                  <th className="px-6 py-3 font-medium text-center">Orders</th>
                  <th className="px-6 py-3 font-medium text-center">Tier</th>
                  <th className="px-6 py-3 font-medium text-right">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {customers.map((customer) => (
                  <tr key={customer.id} className="hover:bg-gray-50/50">
                    <td className="px-6 py-4">
                      <Link href={`/admin/customers/${customer.id}`} className="text-gray-900 font-medium hover:text-orange-600 transition-colors">
                        {customer.name}
                      </Link>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{customer.email || '-'}</td>
                    <td className="px-6 py-4 text-gray-600">{customer.phone || '-'}</td>
                    <td className="px-6 py-4 text-center font-medium text-gray-900">{customer.ordersCount}</td>
                    <td className="px-6 py-4 text-center">
                      {customer.loyaltyTier ? (
                        <span className={`px-2.5 py-1 rounded-lg text-xs font-medium capitalize ${TIER_COLORS[customer.loyaltyTier] || 'bg-gray-50 text-gray-600'}`}>
                          {customer.loyaltyTier}
                        </span>
                      ) : (
                        <span className="text-gray-300">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right text-gray-500 text-xs">
                      {new Date(customer.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
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
            <p className="text-sm text-gray-500">{pagination.total} customers total</p>
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
