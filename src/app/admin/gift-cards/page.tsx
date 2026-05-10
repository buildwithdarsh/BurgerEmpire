'use client';

import { useEffect, useState, useCallback } from 'react';
import { PlusIcon, XIcon, CheckIcon, ChevronIcon } from '@/components/icons';
import { TZ } from '@/lib/tz';
import type { AdminGiftCard, AdminGiftCardTransaction } from '@buildwithdarsh/sdk';

const STATUS_COLORS: Record<string, string> = {
  active: 'bg-green-50 text-green-700',
  used: 'bg-gray-100 text-gray-600',
  expired: 'bg-red-50 text-red-600',
};

const STATUSES = ['all', 'active', 'used', 'expired'];

const EMPTY_FORM = {
  denomination: '',
  recipientName: '',
  recipientEmail: '',
  recipientPhone: '',
  personalMessage: '',
};

export default function AdminGiftCards() {
  const [giftCards, setGiftCards] = useState<AdminGiftCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [loadingTxns, setLoadingTxns] = useState(false);

  const adminApi = TZ.client.scoped('/api/v1', 'staff', false);

  const load = useCallback(() => {
    setLoading(true);
    const params: Record<string, string> = {};
    if (status !== 'all') params.status = status;

    TZ.admin.giftCards.list(params)
      .then((result) => setGiftCards(result.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [status]);

  useEffect(() => { load(); }, [load]);

  const toggleExpand = async (card: AdminGiftCard) => {
    if (expandedId === card.id) {
      setExpandedId(null);
      return;
    }
    setExpandedId(card.id);
    if (!card.transactions) {
      setLoadingTxns(true);
      try {
        const d = await adminApi.get<{ transactions: AdminGiftCardTransaction[] }>(`/admin/gift-cards/${card.id}/transactions`);
        setGiftCards((prev) =>
          prev.map((gc) => gc.id === card.id ? { ...gc, transactions: d.transactions } : gc)
        );
      } catch {
        // failed silently
      } finally {
        setLoadingTxns(false);
      }
    }
  };

  const openNew = () => {
    setForm(EMPTY_FORM);
    setShowForm(true);
  };

  const save = async () => {
    setSaving(true);
    try {
      const payload = {
        denomination: Number(form.denomination),
        recipientName: form.recipientName || null,
        recipientEmail: form.recipientEmail || null,
        recipientPhone: form.recipientPhone || null,
        personalMessage: form.personalMessage || null,
      };
      await TZ.admin.giftCards.create(payload);
      setShowForm(false);
      load();
    } catch {
      // failed silently
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Gift Cards</h1>
          <p className="text-sm text-gray-400 mt-0.5">Issue and manage gift cards</p>
        </div>
        <button onClick={openNew} className="flex items-center gap-2 px-4 py-2.5 bg-gray-900 text-white rounded-xl text-sm font-medium hover:bg-gray-800 transition-colors">
          <PlusIcon size={15} />
          Issue Gift Card
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-2 overflow-x-auto">
        {STATUSES.map((s) => (
          <button
            key={s}
            onClick={() => setStatus(s)}
            className={`px-3 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-colors ${
              status === s ? 'bg-gray-900 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
          >
            {s === 'all' ? 'All' : s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        ))}
      </div>

      {/* Issue Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4" onClick={() => setShowForm(false)}>
          <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Issue Gift Card</h2>
              <button onClick={() => setShowForm(false)} className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                <XIcon size={18} />
              </button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-gray-500">Denomination (₹)</label>
                <input type="number" value={form.denomination} onChange={(e) => setForm({ ...form, denomination: e.target.value })}
                  placeholder="e.g. 500"
                  className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-200" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-gray-500">Recipient Name</label>
                  <input value={form.recipientName} onChange={(e) => setForm({ ...form, recipientName: e.target.value })}
                    className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-200" />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500">Recipient Email</label>
                  <input type="email" value={form.recipientEmail} onChange={(e) => setForm({ ...form, recipientEmail: e.target.value })}
                    className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-200" />
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500">Recipient Phone</label>
                <input value={form.recipientPhone} onChange={(e) => setForm({ ...form, recipientPhone: e.target.value })}
                  className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-200" />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500">Personal Message</label>
                <textarea value={form.personalMessage} onChange={(e) => setForm({ ...form, personalMessage: e.target.value })}
                  rows={3}
                  className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-200 resize-none" />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={save} disabled={saving || !form.denomination}
                className="flex items-center justify-center gap-2 flex-1 py-2.5 bg-gray-900 text-white rounded-xl text-sm font-medium hover:bg-gray-800 disabled:opacity-50 transition-colors">
                <CheckIcon size={15} />
                {saving ? 'Issuing...' : 'Issue Gift Card'}
              </button>
              <button onClick={() => setShowForm(false)}
                className="flex items-center gap-2 px-6 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
                <XIcon size={15} />
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Gift Cards Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="divide-y divide-gray-50">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="px-6 py-4 flex gap-4">
                <div className="w-24 h-4 bg-gray-100 rounded animate-pulse" />
                <div className="w-16 h-4 bg-gray-50 rounded animate-pulse" />
                <div className="w-16 h-4 bg-gray-50 rounded animate-pulse" />
                <div className="flex-1 h-4 bg-gray-50 rounded animate-pulse" />
                <div className="w-20 h-4 bg-gray-50 rounded animate-pulse" />
                <div className="w-16 h-4 bg-gray-50 rounded animate-pulse" />
              </div>
            ))}
          </div>
        ) : giftCards.length === 0 ? (
          <div className="p-12 text-center">
            <svg className="w-12 h-12 mx-auto text-gray-200 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <polyline points="20,12 20,22 4,22 4,12" />
              <rect x="2" y="7" width="20" height="5" />
              <line x1="12" y1="22" x2="12" y2="7" />
              <path d="M12 7H7.5a2.5 2.5 0 010-5C11 2 12 7 12 7z" />
              <path d="M12 7h4.5a2.5 2.5 0 000-5C13 2 12 7 12 7z" />
            </svg>
            <p className="text-sm text-gray-400">No gift cards yet</p>
            <p className="text-xs text-gray-300 mt-1">Issue your first gift card to get started</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500 border-b border-gray-100 bg-gray-50/50">
                  <th className="px-6 py-3 font-medium w-8"></th>
                  <th className="px-6 py-3 font-medium">Code</th>
                  <th className="px-6 py-3 font-medium text-right">Denomination</th>
                  <th className="px-6 py-3 font-medium text-right">Balance</th>
                  <th className="px-6 py-3 font-medium">Purchaser</th>
                  <th className="px-6 py-3 font-medium">Recipient</th>
                  <th className="px-6 py-3 font-medium text-center">Status</th>
                  <th className="px-6 py-3 font-medium text-right">Expires</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {giftCards.map((gc) => (
                  <>
                    <tr key={gc.id} onClick={() => toggleExpand(gc)} className="hover:bg-gray-50/50 cursor-pointer">
                      <td className="pl-6 py-4">
                        <ChevronIcon size={14} direction={expandedId === gc.id ? 'down' : 'right'} color="#9CA3AF" />
                      </td>
                      <td className="px-6 py-4 font-mono font-semibold text-orange-600">{gc.code}</td>
                      <td className="px-6 py-4 text-right font-medium text-gray-900">₹{gc.denomination}</td>
                      <td className="px-6 py-4 text-right font-medium text-gray-900">₹{gc.balance}</td>
                      <td className="px-6 py-4 text-gray-600">{gc.purchaserName || gc.purchaserEmail || '-'}</td>
                      <td className="px-6 py-4">
                        <p className="text-gray-900">{gc.recipientName || '-'}</p>
                        {gc.recipientEmail && <p className="text-xs text-gray-400">{gc.recipientEmail}</p>}
                        {gc.recipientPhone && <p className="text-xs text-gray-400">{gc.recipientPhone}</p>}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`px-2.5 py-1 rounded-lg text-xs font-medium ${STATUS_COLORS[gc.status] || 'bg-gray-50 text-gray-600'}`}>
                          {gc.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right text-gray-500 text-xs">
                        {gc.expiresAt ? new Date(gc.expiresAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '-'}
                      </td>
                    </tr>
                    {expandedId === gc.id && (
                      <tr key={`${gc.id}-txns`}>
                        <td colSpan={8} className="px-6 py-4 bg-gray-50/50">
                          {gc.personalMessage && (
                            <p className="text-xs text-gray-500 italic mb-3">&ldquo;{gc.personalMessage}&rdquo;</p>
                          )}
                          <p className="text-xs font-medium text-gray-500 mb-2">Transactions</p>
                          {loadingTxns ? (
                            <div className="space-y-2">
                              {Array.from({ length: 3 }).map((_, i) => (
                                <div key={i} className="h-4 bg-gray-100 rounded animate-pulse w-3/4" />
                              ))}
                            </div>
                          ) : !gc.transactions || gc.transactions.length === 0 ? (
                            <p className="text-xs text-gray-400">No transactions yet</p>
                          ) : (
                            <table className="w-full text-xs">
                              <thead>
                                <tr className="text-gray-400">
                                  <th className="text-left py-1 font-medium">Type</th>
                                  <th className="text-right py-1 font-medium">Amount</th>
                                  <th className="text-left py-1 font-medium">Order</th>
                                  <th className="text-right py-1 font-medium">Date</th>
                                </tr>
                              </thead>
                              <tbody>
                                {gc.transactions.map((txn) => (
                                  <tr key={txn.id} className="border-t border-gray-100">
                                    <td className="py-1.5 capitalize text-gray-600">{txn.type}</td>
                                    <td className={`py-1.5 text-right font-medium ${txn.type === 'credit' ? 'text-green-600' : 'text-red-600'}`}>
                                      {txn.type === 'credit' ? '+' : '-'}₹{txn.amount}
                                    </td>
                                    <td className="py-1.5 text-gray-400 font-mono">{txn.orderId ? txn.orderId.slice(-8) : '-'}</td>
                                    <td className="py-1.5 text-right text-gray-400">
                                      {new Date(txn.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          )}
                        </td>
                      </tr>
                    )}
                  </>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
