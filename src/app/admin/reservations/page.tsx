'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { TZ } from '@/lib/tz';
import type { AdminReservation } from '@buildwithdarsh/sdk';

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-50 text-yellow-700',
  confirmed: 'bg-blue-50 text-blue-700',
  seated: 'bg-green-50 text-green-700',
  completed: 'bg-gray-100 text-gray-600',
  no_show: 'bg-red-50 text-red-600',
  cancelled: 'bg-red-50 text-red-600',
};

const STATUSES = ['all', 'pending', 'confirmed', 'seated', 'completed', 'no_show', 'cancelled'];
const STATUS_ACTIONS = ['confirmed', 'seated', 'completed', 'no_show', 'cancelled'];

export default function AdminReservations() {
  const [reservations, setReservations] = useState<AdminReservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('all');
  const [dateFilter, setDateFilter] = useState('');
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const load = useCallback(() => {
    setLoading(true);
    const params: Record<string, string> = {};
    if (status !== 'all') params.status = status;
    if (dateFilter) params.date = dateFilter;

    TZ.admin.reservations.list(params)
      .then((result) => setReservations(result.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [status, dateFilter]);

  useEffect(() => { load(); }, [load]);

  const updateStatus = async (reservationId: string, newStatus: string) => {
    setActionLoading(reservationId);
    try {
      await TZ.admin.reservations.updateStatus(reservationId, { status: newStatus });
      load();
    } catch {
      // failed silently
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Reservations</h1>
          <p className="text-sm text-gray-400 mt-0.5">Manage table reservations and guest seating</p>
        </div>
        <div className="flex gap-2">
          <Link href="/admin/reservations/tables"
            className="px-4 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors">
            Tables
          </Link>
          <Link href="/admin/reservations/slots"
            className="px-4 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors">
            Slots
          </Link>
          <Link href="/admin/reservations/waitlist"
            className="px-4 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors">
            Waitlist
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="date"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-300"
        />
        <div className="flex gap-2 overflow-x-auto">
          {STATUSES.map((s) => (
            <button
              key={s}
              onClick={() => setStatus(s)}
              className={`px-3 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-colors ${
                status === s ? 'bg-gray-900 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              {s === 'all' ? 'All' : s === 'no_show' ? 'No Show' : s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Reservations Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="divide-y divide-gray-50">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="px-6 py-4 flex gap-4">
                <div className="w-32 h-4 bg-gray-100 rounded animate-pulse" />
                <div className="w-12 h-4 bg-gray-50 rounded animate-pulse" />
                <div className="w-20 h-4 bg-gray-50 rounded animate-pulse" />
                <div className="w-16 h-4 bg-gray-50 rounded animate-pulse" />
                <div className="w-20 h-4 bg-gray-50 rounded animate-pulse" />
                <div className="w-16 h-4 bg-gray-50 rounded animate-pulse" />
                <div className="flex-1 h-4 bg-gray-50 rounded animate-pulse" />
              </div>
            ))}
          </div>
        ) : reservations.length === 0 ? (
          <div className="p-12 text-center">
            <svg className="w-12 h-12 mx-auto text-gray-200 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-sm text-gray-400">{dateFilter || status !== 'all' ? 'No reservations match your filters' : 'No reservations yet'}</p>
            <p className="text-xs text-gray-300 mt-1">{dateFilter || status !== 'all' ? 'Try adjusting your filters' : 'Reservations will appear here when guests book a table'}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500 border-b border-gray-100 bg-gray-50/50">
                  <th className="px-6 py-3 font-medium">Guest</th>
                  <th className="px-6 py-3 font-medium text-center">Party</th>
                  <th className="px-6 py-3 font-medium">Date</th>
                  <th className="px-6 py-3 font-medium">Time</th>
                  <th className="px-6 py-3 font-medium text-center">Status</th>
                  <th className="px-6 py-3 font-medium">Table</th>
                  <th className="px-6 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {reservations.map((res) => (
                  <tr key={res.id} className="hover:bg-gray-50/50">
                    <td className="px-6 py-4">
                      <p className="text-gray-900 font-medium">{res.guestName}</p>
                      {res.guestPhone && <p className="text-xs text-gray-400">{res.guestPhone}</p>}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="inline-flex items-center justify-center w-8 h-8 bg-gray-100 rounded-lg text-sm font-medium text-gray-700">
                        {res.partySize}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {new Date(res.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="px-6 py-4 text-gray-900 font-medium">{res.timeSlot}</td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-2.5 py-1 rounded-lg text-xs font-medium ${STATUS_COLORS[res.status] || 'bg-gray-50 text-gray-600'}`}>
                        {res.status === 'no_show' ? 'No Show' : res.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{res.table || '-'}</td>
                    <td className="px-6 py-4 text-right">
                      <select
                        value=""
                        onChange={(e) => {
                          if (e.target.value) updateStatus(res.id, e.target.value);
                        }}
                        disabled={actionLoading === res.id}
                        className="px-2 py-1.5 border border-gray-200 rounded-lg text-xs text-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-200 disabled:opacity-50 bg-white"
                      >
                        <option value="">Update status...</option>
                        {STATUS_ACTIONS.filter((s) => s !== res.status).map((s) => (
                          <option key={s} value={s}>
                            {s === 'no_show' ? 'No Show' : s.charAt(0).toUpperCase() + s.slice(1)}
                          </option>
                        ))}
                      </select>
                    </td>
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
