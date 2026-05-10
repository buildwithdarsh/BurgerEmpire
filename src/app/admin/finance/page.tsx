'use client';

import { useEffect, useState, useCallback } from 'react';
import { TZ } from '@/lib/tz';
import type { AdminInvoice, AdminTaxSummary, AdminSettlement, AdminPayout } from '@buildwithdarsh/sdk';

type Tab = 'invoices' | 'tax' | 'settlements' | 'payouts' | 'export';

const TABS: { key: Tab; label: string }[] = [
  { key: 'invoices', label: 'AdminInvoices' },
  { key: 'tax', label: 'Tax Report' },
  { key: 'settlements', label: 'AdminSettlements' },
  { key: 'payouts', label: 'AdminPayouts' },
  { key: 'export', label: 'Export' },
];

// ─── Tab: AdminInvoices ───────────────────────────────────────────────────────────

function AdminInvoicesTab() {
  const [invoices, setInvoices] = useState<AdminInvoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, totalPages: 1 });

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const d = await TZ.admin.finance.invoices({ page, limit: 20 });
      setInvoices(d.data ?? d);
      if (d.pagination?.total != null) setPagination({ total: d.pagination.total, totalPages: d.pagination.totalPages });
    } catch {
      // silently handle
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => { load(); }, [load]);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      {loading ? (
        <div className="divide-y divide-gray-50">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="px-6 py-4 flex gap-4">
              <div className="w-24 h-4 bg-gray-100 rounded animate-pulse" />
              <div className="flex-1 h-4 bg-gray-50 rounded animate-pulse" />
              <div className="w-20 h-4 bg-gray-50 rounded animate-pulse" />
            </div>
          ))}
        </div>
      ) : invoices.length === 0 ? (
        <div className="p-12 text-center">
          <svg className="w-12 h-12 mx-auto text-gray-200 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>
          <p className="text-sm text-gray-400">No invoices yet</p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500 border-b border-gray-100 bg-gray-50/50">
                  <th className="px-6 py-3 font-medium">AdminInvoice #</th>
                  <th className="px-6 py-3 font-medium">Order ID</th>
                  <th className="px-6 py-3 font-medium text-right">Total</th>
                  <th className="px-6 py-3 font-medium text-right">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {invoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-gray-50/50">
                    <td className="px-6 py-4 font-mono text-xs text-orange-600 font-medium">{inv.invoiceNumber}</td>
                    <td className="px-6 py-4 font-mono text-xs text-gray-600">{inv.orderId.slice(-8)}</td>
                    <td className="px-6 py-4 text-right font-medium text-gray-900">&#8377;{inv.total}</td>
                    <td className="px-6 py-4 text-right text-gray-500 text-xs">
                      {new Date(inv.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
              <p className="text-sm text-gray-500">{pagination.total} invoices total</p>
              <div className="flex gap-2">
                <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
                  className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm disabled:opacity-40 hover:bg-gray-50">Previous</button>
                <span className="px-3 py-1.5 text-sm text-gray-600">Page {page} of {pagination.totalPages}</span>
                <button onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))} disabled={page === pagination.totalPages}
                  className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm disabled:opacity-40 hover:bg-gray-50">Next</button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

// ─── Tab: Tax Report ─────────────────────────────────────────────────────────

function TaxTab() {
  const [summary, setSummary] = useState<AdminTaxSummary | null>(null);
  const [loading, setLoading] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const load = async () => {
    if (!startDate || !endDate) return;
    setLoading(true);
    try {
      const d = await TZ.admin.finance.tax({ startDate, endDate });
      setSummary(d);
    } catch {
      // silently handle
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">GST Summary</h3>
        <div className="flex flex-col sm:flex-row gap-3 items-end">
          <div>
            <label className="text-xs font-medium text-gray-500">Start Date</label>
            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)}
              className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-200" />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500">End Date</label>
            <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)}
              className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-200" />
          </div>
          <button onClick={load} disabled={loading || !startDate || !endDate}
            className="px-5 py-2 bg-gray-900 text-white rounded-xl text-sm font-medium hover:bg-gray-800 disabled:opacity-50 transition-colors">
            {loading ? 'Loading...' : 'Generate'}
          </button>
        </div>
      </div>

      {summary && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <p className="text-sm text-gray-500">SGST</p>
            <p className="text-2xl font-semibold text-gray-900 mt-1">&#8377;{summary.sgst.toLocaleString()}</p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <p className="text-sm text-gray-500">CGST</p>
            <p className="text-2xl font-semibold text-gray-900 mt-1">&#8377;{summary.cgst.toLocaleString()}</p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <p className="text-sm text-gray-500">IGST</p>
            <p className="text-2xl font-semibold text-gray-900 mt-1">&#8377;{summary.igst.toLocaleString()}</p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <p className="text-sm text-gray-500">Total Tax</p>
            <p className="text-2xl font-semibold text-orange-600 mt-1">&#8377;{summary.totalTax.toLocaleString()}</p>
          </div>
        </div>
      )}

      {!summary && !loading && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
          <svg className="w-12 h-12 mx-auto text-gray-200 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
          <p className="text-sm text-gray-400">Select a date range and generate the report</p>
        </div>
      )}
    </div>
  );
}

// ─── Tab: AdminSettlements ────────────────────────────────────────────────────────

function AdminSettlementsTab() {
  const [settlements, setSettlements] = useState<AdminSettlement[]>([]);
  const [loading, setLoading] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const load = async () => {
    if (!startDate || !endDate) return;
    setLoading(true);
    try {
      const d = await TZ.admin.finance.settlements({ startDate, endDate });
      setSettlements(d.data ?? d);
    } catch {
      // silently handle
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div className="flex flex-col sm:flex-row gap-3 items-end">
          <div>
            <label className="text-xs font-medium text-gray-500">Start Date</label>
            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)}
              className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-200" />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500">End Date</label>
            <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)}
              className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-200" />
          </div>
          <button onClick={load} disabled={loading || !startDate || !endDate}
            className="px-5 py-2 bg-gray-900 text-white rounded-xl text-sm font-medium hover:bg-gray-800 disabled:opacity-50 transition-colors">
            {loading ? 'Loading...' : 'Fetch'}
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="divide-y divide-gray-50">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="px-6 py-4 flex gap-4">
                <div className="w-24 h-4 bg-gray-100 rounded animate-pulse" />
                <div className="flex-1 h-4 bg-gray-50 rounded animate-pulse" />
                <div className="w-16 h-4 bg-gray-50 rounded animate-pulse" />
              </div>
            ))}
          </div>
        ) : settlements.length === 0 ? (
          <div className="p-12 text-center">
            <svg className="w-12 h-12 mx-auto text-gray-200 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" /></svg>
            <p className="text-sm text-gray-400">{startDate && endDate ? 'No settlements found for this period' : 'Select a date range to view settlements'}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500 border-b border-gray-100 bg-gray-50/50">
                  <th className="px-6 py-3 font-medium">Payment ID</th>
                  <th className="px-6 py-3 font-medium text-right">Amount</th>
                  <th className="px-6 py-3 font-medium">Method</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                  <th className="px-6 py-3 font-medium text-right">Settled At</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {settlements.map((s) => (
                  <tr key={s.id} className="hover:bg-gray-50/50">
                    <td className="px-6 py-4 font-mono text-xs text-gray-600">{s.paymentId}</td>
                    <td className="px-6 py-4 text-right font-medium text-gray-900">&#8377;{s.amount}</td>
                    <td className="px-6 py-4 text-gray-600 capitalize text-xs">{s.method}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-lg text-xs font-medium ${
                        s.status === 'settled' ? 'bg-green-50 text-green-700' : 'bg-yellow-50 text-yellow-700'
                      }`}>{s.status}</span>
                    </td>
                    <td className="px-6 py-4 text-right text-gray-500 text-xs">
                      {new Date(s.settledAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
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

// ─── Tab: AdminPayouts ────────────────────────────────────────────────────────────

function AdminPayoutsTab() {
  const [payouts, setPayouts] = useState<AdminPayout[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [markingId, setMarkingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ agentId: '', amount: '', period: '', orderCount: '' });

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const d = await TZ.admin.finance.payouts();
      setPayouts(d.data ?? d);
    } catch {
      // silently handle
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const createAdminPayout = async () => {
    setSaving(true);
    try {
      await TZ.admin.finance.createPayout({
        agentId: form.agentId,
        amount: Number(form.amount),
        period: form.period,
        orderCount: Number(form.orderCount),
      });
      setShowModal(false);
      setForm({ agentId: '', amount: '', period: '', orderCount: '' });
      load();
    } catch {
      // silently handle
    } finally {
      setSaving(false);
    }
  };

  const markAsPaid = async (id: string) => {
    setMarkingId(id);
    try {
      await TZ.admin.finance.markPayoutPaid(id);
      load();
    } catch {
      // silently handle
    } finally {
      setMarkingId(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-gray-900 text-white rounded-xl text-sm font-medium hover:bg-gray-800 transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
          Create AdminPayout
        </button>
      </div>

      {/* Create Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Create AdminPayout</h2>
              <button onClick={() => setShowModal(false)} className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
              </button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-gray-500">Agent ID</label>
                <input value={form.agentId} onChange={(e) => setForm({ ...form, agentId: e.target.value })}
                  className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-200" />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500">Amount (&#8377;)</label>
                <input type="number" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })}
                  className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-200" />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500">Period</label>
                <input value={form.period} onChange={(e) => setForm({ ...form, period: e.target.value })} placeholder="e.g. March 2026"
                  className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-200" />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500">Order Count</label>
                <input type="number" value={form.orderCount} onChange={(e) => setForm({ ...form, orderCount: e.target.value })}
                  className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-200" />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={createAdminPayout} disabled={saving || !form.agentId || !form.amount}
                className="flex-1 py-2.5 bg-gray-900 text-white rounded-xl text-sm font-medium hover:bg-gray-800 disabled:opacity-50 transition-colors">
                {saving ? 'Creating...' : 'Create'}
              </button>
              <button onClick={() => setShowModal(false)}
                className="px-6 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="divide-y divide-gray-50">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="px-6 py-4 flex gap-4">
                <div className="w-24 h-4 bg-gray-100 rounded animate-pulse" />
                <div className="flex-1 h-4 bg-gray-50 rounded animate-pulse" />
                <div className="w-20 h-4 bg-gray-50 rounded animate-pulse" />
              </div>
            ))}
          </div>
        ) : payouts.length === 0 ? (
          <div className="p-12 text-center">
            <svg className="w-12 h-12 mx-auto text-gray-200 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 12V7H5a2 2 0 010-4h14v4M3 5v14a2 2 0 002 2h16v-5M18 12a2 2 0 100 4h4v-4h-4z" /></svg>
            <p className="text-sm text-gray-400">No payouts yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500 border-b border-gray-100 bg-gray-50/50">
                  <th className="px-6 py-3 font-medium">Agent</th>
                  <th className="px-6 py-3 font-medium text-right">Amount</th>
                  <th className="px-6 py-3 font-medium">Period</th>
                  <th className="px-6 py-3 font-medium text-center">Orders</th>
                  <th className="px-6 py-3 font-medium text-center">Status</th>
                  <th className="px-6 py-3 font-medium text-right">Date</th>
                  <th className="px-6 py-3 font-medium text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {payouts.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50/50">
                    <td className="px-6 py-4">
                      <p className="text-gray-900 font-medium">{p.agentName}</p>
                      <p className="text-xs text-gray-400 font-mono">{p.agentId.slice(-8)}</p>
                    </td>
                    <td className="px-6 py-4 text-right font-medium text-gray-900">&#8377;{p.amount.toLocaleString()}</td>
                    <td className="px-6 py-4 text-gray-600 text-xs">{p.period}</td>
                    <td className="px-6 py-4 text-center text-gray-600">{p.orderCount}</td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-2.5 py-1 rounded-lg text-xs font-medium ${
                        p.isPaid ? 'bg-green-50 text-green-700' : 'bg-yellow-50 text-yellow-700'
                      }`}>{p.isPaid ? 'Paid' : 'Pending'}</span>
                    </td>
                    <td className="px-6 py-4 text-right text-gray-500 text-xs">
                      {new Date(p.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {!p.isPaid && (
                        <button onClick={() => markAsPaid(p.id)} disabled={markingId === p.id}
                          className="px-3 py-1.5 bg-green-50 text-green-700 border border-green-200 rounded-lg text-xs font-medium hover:bg-green-100 disabled:opacity-50 transition-colors">
                          {markingId === p.id ? '...' : 'Mark Paid'}
                        </button>
                      )}
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

// ─── Tab: Export ──────────────────────────────────────────────────────────────

function ExportTab() {
  const [reportType, setReportType] = useState('orders');
  const [format, setFormat] = useState('csv');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [downloading, setDownloading] = useState(false);

  const download = async () => {
    if (!startDate || !endDate) return;
    setDownloading(true);
    try {
      const result = await TZ.admin.finance.exportReport({ type: reportType, format, startDate, endDate });
      const blob = result instanceof Blob ? result : new Blob([result as unknown as string]);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${reportType}-report-${startDate}-to-${endDate}.${format}`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      // silently handle
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 max-w-lg">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Export Reports</h3>
      <div className="space-y-4">
        <div>
          <label className="text-xs font-medium text-gray-500">Report Type</label>
          <select value={reportType} onChange={(e) => setReportType(e.target.value)}
            className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-200">
            <option value="orders">Orders</option>
            <option value="invoices">AdminInvoices</option>
            <option value="tax">Tax Summary</option>
            <option value="settlements">AdminSettlements</option>
            <option value="payouts">AdminPayouts</option>
            <option value="customers">Customers</option>
          </select>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-medium text-gray-500">Start Date</label>
            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)}
              className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-200" />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500">End Date</label>
            <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)}
              className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-200" />
          </div>
        </div>
        <div>
          <label className="text-xs font-medium text-gray-500">Format</label>
          <select value={format} onChange={(e) => setFormat(e.target.value)}
            className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-200">
            <option value="csv">CSV</option>
            <option value="xlsx">Excel (XLSX)</option>
            <option value="pdf">PDF</option>
          </select>
        </div>
        <button onClick={download} disabled={downloading || !startDate || !endDate}
          className="w-full flex items-center justify-center gap-2 py-2.5 bg-gray-900 text-white rounded-xl text-sm font-medium hover:bg-gray-800 disabled:opacity-50 transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" /><polyline points="7,10 12,15 17,10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
          {downloading ? 'Downloading...' : 'Download Report'}
        </button>
      </div>
    </div>
  );
}

// ─── Main Finance Page ───────────────────────────────────────────────────────

export default function AdminFinance() {
  const [tab, setTab] = useState<Tab>('invoices');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Finance</h1>
        <p className="text-sm text-gray-400 mt-0.5">AdminInvoices, tax reports, settlements, and payouts</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              tab === t.key ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {tab === 'invoices' && <AdminInvoicesTab />}
      {tab === 'tax' && <TaxTab />}
      {tab === 'settlements' && <AdminSettlementsTab />}
      {tab === 'payouts' && <AdminPayoutsTab />}
      {tab === 'export' && <ExportTab />}
    </div>
  );
}
