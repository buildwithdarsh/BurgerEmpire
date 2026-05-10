'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { TZ } from '@/lib/tz';
import type { AdminTicket } from '@buildwithdarsh/sdk';

const STATUS_OPTIONS = ['all', 'open', 'in_progress', 'resolved', 'closed'] as const;
const PRIORITY_OPTIONS = ['all', 'low', 'medium', 'high', 'urgent'] as const;

const STATUS_COLORS: Record<string, string> = {
  open: 'bg-blue-50 text-blue-700',
  in_progress: 'bg-orange-50 text-orange-700',
  resolved: 'bg-green-50 text-green-700',
  closed: 'bg-gray-100 text-gray-600',
};

const PRIORITY_COLORS: Record<string, string> = {
  urgent: 'bg-red-50 text-red-700 border border-red-200',
  high: 'bg-orange-50 text-orange-700 border border-orange-200',
  medium: 'bg-yellow-50 text-yellow-700 border border-yellow-200',
  low: 'bg-gray-50 text-gray-600 border border-gray-200',
};

export default function AdminSupport() {
  const router = useRouter();
  const [tickets, setTickets] = useState<AdminTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<string>('all');
  const [priority, setPriority] = useState<string>('all');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, totalPages: 1 });

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, unknown> = { page, limit: 20 };
      if (status !== 'all') params.status = status;
      if (priority !== 'all') params.priority = priority;

      const result = await TZ.admin.support.list(params);
      setTickets(result.data);
      setPagination({ total: result.pagination.total, totalPages: result.pagination.totalPages });
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  }, [page, status, priority]);

  useEffect(() => { load(); }, [load]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Support Tickets</h1>
        <p className="text-sm text-gray-400 mt-0.5">View and manage customer support tickets</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div>
          <p className="text-xs font-medium text-gray-500 mb-1.5">Status</p>
          <div className="flex gap-2 overflow-x-auto">
            {STATUS_OPTIONS.map((s) => (
              <button
                key={s}
                onClick={() => { setStatus(s); setPage(1); }}
                className={`px-3 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-colors ${
                  status === s ? 'bg-gray-900 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                {s === 'all' ? 'All' : s.replace(/_/g, ' ')}
              </button>
            ))}
          </div>
        </div>
        <div>
          <p className="text-xs font-medium text-gray-500 mb-1.5">Priority</p>
          <div className="flex gap-2 overflow-x-auto">
            {PRIORITY_OPTIONS.map((p) => (
              <button
                key={p}
                onClick={() => { setPriority(p); setPage(1); }}
                className={`px-3 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-colors ${
                  priority === p ? 'bg-gray-900 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                {p === 'all' ? 'All' : p}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tickets Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="divide-y divide-gray-50">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="px-6 py-4 flex gap-4">
                <div className="w-16 h-4 bg-gray-100 rounded animate-pulse" />
                <div className="flex-1 h-4 bg-gray-50 rounded animate-pulse" />
                <div className="w-20 h-4 bg-gray-50 rounded animate-pulse" />
                <div className="w-16 h-4 bg-gray-50 rounded animate-pulse" />
                <div className="w-24 h-4 bg-gray-50 rounded animate-pulse" />
              </div>
            ))}
          </div>
        ) : tickets.length === 0 ? (
          <div className="p-12 text-center">
            <svg className="w-12 h-12 mx-auto text-gray-200 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16.712 4.33a9.027 9.027 0 011.652 1.306c.51.51.944 1.064 1.306 1.652M16.712 4.33l-3.448 4.138m3.448-4.138a9.014 9.014 0 00-9.424 0M19.67 7.288l-4.138 3.448m4.138-3.448a9.014 9.014 0 010 9.424m-4.138-5.976a3.736 3.736 0 00-.88-1.388 3.737 3.737 0 00-1.388-.88m2.268 2.268a3.765 3.765 0 010 2.528m-2.268-4.796a3.765 3.765 0 00-2.528 0m4.796 4.796c-.181.506-.475.982-.88 1.388a3.736 3.736 0 01-1.388.88m2.268-2.268l4.138 3.448m0 0a9.027 9.027 0 01-1.306 1.652c-.51.51-1.064.944-1.652 1.306m0 0l-3.448-4.138m3.448 4.138a9.014 9.014 0 01-9.424 0m5.976-4.138a3.765 3.765 0 01-2.528 0m0 0a3.736 3.736 0 01-1.388-.88 3.737 3.737 0 01-.88-1.388m2.268 2.268L7.288 19.67m0 0a9.024 9.024 0 01-1.652-1.306 9.027 9.027 0 01-1.306-1.652m0 0l4.138-3.448M4.33 16.712a9.014 9.014 0 010-9.424m4.138 5.976a3.765 3.765 0 010-2.528m0 0c.181-.506.475-.982.88-1.388a3.736 3.736 0 011.388-.88m-2.268 2.268L4.33 7.288m6.406 1.18L7.288 4.33" /></svg>
            <p className="text-sm text-gray-400">No support tickets found</p>
            <p className="text-xs text-gray-300 mt-1">Tickets will appear here when customers reach out</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500 border-b border-gray-100 bg-gray-50/50">
                  <th className="px-6 py-3 font-medium">Ticket #</th>
                  <th className="px-6 py-3 font-medium">Customer</th>
                  <th className="px-6 py-3 font-medium">Subject</th>
                  <th className="px-6 py-3 font-medium">Category</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                  <th className="px-6 py-3 font-medium">Priority</th>
                  <th className="px-6 py-3 font-medium">Assigned To</th>
                  <th className="px-6 py-3 font-medium text-right">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {tickets.map((ticket) => (
                  <tr
                    key={ticket.id}
                    onClick={() => router.push(`/admin/support/${ticket.id}`)}
                    className="hover:bg-gray-50/50 cursor-pointer transition-colors"
                  >
                    <td className="px-6 py-4">
                      <span className="text-orange-600 font-mono text-xs font-medium">{ticket.ticketNumber}</span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-gray-900 font-medium">{ticket.customerName}</p>
                      {ticket.customerEmail && <p className="text-xs text-gray-400">{ticket.customerEmail}</p>}
                    </td>
                    <td className="px-6 py-4 text-gray-700 max-w-[200px] truncate">{ticket.subject}</td>
                    <td className="px-6 py-4 text-gray-500 capitalize text-xs">{ticket.category}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-lg text-xs font-medium ${STATUS_COLORS[ticket.status] || 'bg-gray-50 text-gray-600'}`}>
                        {ticket.status.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-lg text-xs font-medium ${PRIORITY_COLORS[ticket.priority] || 'bg-gray-50 text-gray-600'}`}>
                        {ticket.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-500 text-xs">{ticket.assignedTo || <span className="text-gray-300">Unassigned</span>}</td>
                    <td className="px-6 py-4 text-right text-gray-500 text-xs">
                      {new Date(ticket.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
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
            <p className="text-sm text-gray-500">{pagination.total} tickets total</p>
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
