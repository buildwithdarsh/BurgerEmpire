'use client';

import { useEffect, useState, useCallback } from 'react';
import { CheckIcon } from '@/components/icons';
import { TZ } from '@/lib/tz';
import type { AdminBroadcast } from '@buildwithdarsh/sdk';

const STATUS_COLORS: Record<string, string> = {
  sent: 'bg-green-50 text-green-700',
  scheduled: 'bg-blue-50 text-blue-700',
  draft: 'bg-gray-100 text-gray-600',
  sending: 'bg-yellow-50 text-yellow-700',
  failed: 'bg-red-50 text-red-600',
};

const CHANNELS = ['push', 'email', 'whatsapp', 'sms'];
const SEGMENTS = ['all', 'tier:gold', 'tier:silver', 'tier:bronze'];

const EMPTY_FORM = {
  title: '',
  body: '',
  channel: 'push',
  segment: 'all',
  scheduledAt: '',
};

export default function AdminNotifications() {
  const [tab, setTab] = useState<'broadcasts' | 'compose'>('broadcasts');
  const [broadcasts, setBroadcasts] = useState<AdminBroadcast[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(EMPTY_FORM);
  const [sending, setSending] = useState(false);
  const [sendResult, setSendResult] = useState<{ success: boolean; message: string } | null>(null);

  const loadBroadcasts = useCallback(async () => {
    setLoading(true);
    try {
      const result = await TZ.admin.broadcast.list();
      setBroadcasts(result);
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (tab === 'broadcasts') loadBroadcasts();
  }, [tab, loadBroadcasts]);

  const sendBroadcast = async () => {
    setSending(true);
    setSendResult(null);
    try {
      const payload = {
        title: form.title,
        body: form.body,
        channel: form.channel,
        segment: form.segment,
        scheduledAt: form.scheduledAt || undefined,
      };
      await TZ.admin.broadcast.send(payload);
      setSendResult({ success: true, message: form.scheduledAt ? 'Broadcast scheduled successfully' : 'Broadcast sent successfully' });
      setForm(EMPTY_FORM);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Network error';
      setSendResult({ success: false, message });
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Notifications</h1>
        <p className="text-sm text-gray-400 mt-0.5">Send broadcasts and manage notifications</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 rounded-xl p-1 w-fit">
        <button
          onClick={() => setTab('broadcasts')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            tab === 'broadcasts' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Broadcasts
        </button>
        <button
          onClick={() => setTab('compose')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            tab === 'compose' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Compose
        </button>
      </div>

      {/* Broadcasts Tab */}
      {tab === 'broadcasts' && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {loading ? (
            <div className="divide-y divide-gray-50">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="px-6 py-4 flex gap-4">
                  <div className="flex-1 h-4 bg-gray-100 rounded animate-pulse" />
                  <div className="w-16 h-4 bg-gray-50 rounded animate-pulse" />
                  <div className="w-16 h-4 bg-gray-50 rounded animate-pulse" />
                  <div className="w-12 h-4 bg-gray-50 rounded animate-pulse" />
                  <div className="w-12 h-4 bg-gray-50 rounded animate-pulse" />
                  <div className="w-16 h-4 bg-gray-50 rounded animate-pulse" />
                </div>
              ))}
            </div>
          ) : broadcasts.length === 0 ? (
            <div className="p-12 text-center">
              <svg className="w-12 h-12 mx-auto text-gray-200 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <p className="text-sm text-gray-400">No broadcasts yet</p>
              <p className="text-xs text-gray-300 mt-1">Switch to Compose to send your first broadcast</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-500 border-b border-gray-100 bg-gray-50/50">
                    <th className="px-6 py-3 font-medium">Title</th>
                    <th className="px-6 py-3 font-medium">Channel</th>
                    <th className="px-6 py-3 font-medium">Segment</th>
                    <th className="px-6 py-3 font-medium text-right">Sent</th>
                    <th className="px-6 py-3 font-medium text-right">Opened</th>
                    <th className="px-6 py-3 font-medium text-center">Status</th>
                    <th className="px-6 py-3 font-medium text-right">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {broadcasts.map((b) => (
                    <tr key={b.id} className="hover:bg-gray-50/50">
                      <td className="px-6 py-4">
                        <p className="text-gray-900 font-medium">{b.title}</p>
                        <p className="text-xs text-gray-400 truncate max-w-xs mt-0.5">{b.body}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-0.5 bg-gray-100 rounded text-xs font-medium text-gray-600 uppercase">{b.channel}</span>
                      </td>
                      <td className="px-6 py-4 text-gray-600 text-xs">{b.segment}</td>
                      <td className="px-6 py-4 text-right font-medium text-gray-900">{b.sentCount.toLocaleString()}</td>
                      <td className="px-6 py-4 text-right text-gray-600">
                        {b.openCount.toLocaleString()}
                        {b.sentCount > 0 && (
                          <span className="text-xs text-gray-400 ml-1">({Math.round((b.openCount / b.sentCount) * 100)}%)</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`px-2.5 py-1 rounded-lg text-xs font-medium ${STATUS_COLORS[b.status] || 'bg-gray-50 text-gray-600'}`}>
                          {b.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right text-gray-500 text-xs">
                        {new Date(b.scheduledAt || b.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Compose Tab */}
      {tab === 'compose' && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 max-w-2xl">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Compose Broadcast</h2>

          {sendResult && (
            <div className={`mb-4 px-4 py-3 rounded-xl text-sm ${sendResult.success ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
              {sendResult.message}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="text-xs font-medium text-gray-500">Title</label>
              <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="Notification title"
                className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-200" />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500">Body</label>
              <textarea value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })}
                rows={5}
                placeholder="Write your notification message..."
                className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-200 resize-none" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-gray-500">Channel</label>
                <select value={form.channel} onChange={(e) => setForm({ ...form, channel: e.target.value })}
                  className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-200">
                  {CHANNELS.map((ch) => (
                    <option key={ch} value={ch}>{ch.charAt(0).toUpperCase() + ch.slice(1)}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500">Segment</label>
                <select value={form.segment} onChange={(e) => setForm({ ...form, segment: e.target.value })}
                  className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-200">
                  {SEGMENTS.map((seg) => (
                    <option key={seg} value={seg}>
                      {seg === 'all' ? 'All Customers' : seg.replace('tier:', 'Tier: ').replace(/^\w/, (c) => c.toUpperCase())}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500">Schedule (optional)</label>
              <input type="datetime-local" value={form.scheduledAt} onChange={(e) => setForm({ ...form, scheduledAt: e.target.value })}
                className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-200" />
              <p className="text-xs text-gray-400 mt-1">Leave empty to send immediately</p>
            </div>
            <div className="pt-2">
              <button onClick={sendBroadcast} disabled={sending || !form.title || !form.body}
                className="flex items-center justify-center gap-2 px-6 py-2.5 bg-gray-900 text-white rounded-xl text-sm font-medium hover:bg-gray-800 disabled:opacity-50 transition-colors">
                <CheckIcon size={15} />
                {sending ? 'Sending...' : form.scheduledAt ? 'Schedule Broadcast' : 'Send Broadcast'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
