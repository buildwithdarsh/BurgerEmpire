'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { TZ } from '@/lib/tz';
import type { AdminTicketDetail } from '@buildwithdarsh/sdk';

const STATUS_OPTIONS = ['open', 'in_progress', 'resolved', 'closed'];
const PRIORITY_OPTIONS = ['low', 'medium', 'high', 'urgent'];

const STATUS_STYLES: Record<string, string> = {
  open: 'bg-blue-50 text-blue-700 border-blue-200',
  in_progress: 'bg-orange-50 text-orange-700 border-orange-200',
  resolved: 'bg-green-50 text-green-700 border-green-200',
  closed: 'bg-gray-100 text-gray-600 border-gray-200',
};

const PRIORITY_STYLES: Record<string, string> = {
  urgent: 'bg-red-50 text-red-700 border-red-200',
  high: 'bg-orange-50 text-orange-700 border-orange-200',
  medium: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  low: 'bg-gray-50 text-gray-600 border-gray-200',
};

export default function AdminSupportDetail() {
  const params = useParams();
  const router = useRouter();
  const ticketId = params.id as string;

  const [ticket, setTicket] = useState<AdminTicketDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [replyText, setReplyText] = useState('');
  const [sending, setSending] = useState(false);
  const [updating, setUpdating] = useState(false);

  // Side panel form state
  const [editStatus, setEditStatus] = useState('');
  const [editPriority, setEditPriority] = useState('');
  const [editAssignedTo, setEditAssignedTo] = useState('');

  const loadTicket = useCallback(async () => {
    try {
      const result = await TZ.admin.support.get(ticketId);
      setTicket(result);
      setEditStatus(result.status);
      setEditPriority(result.priority);
      setEditAssignedTo(result.assignedTo || '');
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  }, [ticketId]);

  useEffect(() => { loadTicket(); }, [loadTicket]);

  const sendReply = async () => {
    if (!replyText.trim() || sending) return;
    setSending(true);
    try {
      const adminApi = TZ.client.scoped('/api/v1', 'staff', false);
      await adminApi.post(`/admin/support/${ticketId}/reply`, { message: replyText.trim() });
      setReplyText('');
      loadTicket();
    } catch {
      // silently fail
    } finally {
      setSending(false);
    }
  };

  const updateTicket = async () => {
    if (updating) return;
    setUpdating(true);
    try {
      const payload: Record<string, string> = {};
      if (editStatus !== ticket?.status) payload.status = editStatus;
      if (editPriority !== ticket?.priority) payload.priority = editPriority;
      if (editAssignedTo !== (ticket?.assignedTo || '')) payload.assignedTo = editAssignedTo || '';

      if (Object.keys(payload).length === 0) { setUpdating(false); return; }

      await TZ.admin.support.update(ticketId, payload);
      loadTicket();
    } catch {
      // silently fail
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <div className="h-6 w-6 bg-gray-100 rounded animate-pulse" />
          <div className="h-7 w-64 bg-gray-100 rounded animate-pulse" />
        </div>
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-6 animate-pulse">
            <div className="h-5 bg-gray-100 rounded w-32 mb-4" />
            {[...Array(4)].map((_, i) => <div key={i} className="h-16 bg-gray-50 rounded-xl mb-3" />)}
          </div>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 animate-pulse h-24" />)}
          </div>
        </div>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="space-y-6">
        <button onClick={() => router.push('/admin/support')} className="flex items-center gap-2 text-gray-400 hover:text-gray-600 transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          Back to Tickets
        </button>
        <div className="bg-white rounded-2xl border border-red-100 p-12 text-center">
          <svg className="w-12 h-12 mx-auto text-red-200 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <p className="text-red-600 font-medium">Ticket not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button onClick={() => router.push('/admin/support')} className="p-2 -ml-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        </button>
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-semibold text-gray-900">{ticket.subject}</h1>
          <div className="flex items-center gap-2 mt-0.5 flex-wrap">
            <span className="text-xs text-gray-400 font-mono">{ticket.ticketNumber}</span>
            <span className="text-xs text-gray-300">|</span>
            <span className="text-xs text-gray-500 capitalize">{ticket.category}</span>
            <span className={`px-2 py-0.5 rounded-md text-xs font-medium border ${PRIORITY_STYLES[ticket.priority] || ''}`}>
              {ticket.priority}
            </span>
            <span className={`px-2 py-0.5 rounded-md text-xs font-medium border ${STATUS_STYLES[ticket.status] || ''}`}>
              {ticket.status.replace(/_/g, ' ')}
            </span>
          </div>
        </div>
      </div>

      {/* Order Link */}
      {ticket.orderId && (
        <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 flex items-center gap-2">
          <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
          <span className="text-sm text-blue-700">Linked to order:</span>
          <Link href={`/admin/orders/${ticket.orderId}`} className="text-sm text-blue-600 hover:underline font-mono">
            {ticket.orderId.slice(-8)}
          </Link>
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Message Thread */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Conversation</h2>

            {ticket.messages.length === 0 ? (
              <div className="py-8 text-center">
                <svg className="w-10 h-10 mx-auto text-gray-200 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                <p className="text-sm text-gray-400">No messages yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {ticket.messages.map((msg) => {
                  const isAdmin = msg.sender === 'admin';
                  return (
                    <div key={msg.id} className={`flex ${isAdmin ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[80%] ${isAdmin ? 'order-2' : ''}`}>
                        <div className={`rounded-2xl px-4 py-3 ${
                          isAdmin
                            ? 'bg-gray-900 text-white rounded-br-md'
                            : 'bg-gray-100 text-gray-900 rounded-bl-md'
                        }`}>
                          <p className="text-sm whitespace-pre-wrap">{msg.body}</p>
                        </div>
                        <div className={`flex items-center gap-1.5 mt-1 ${isAdmin ? 'justify-end' : ''}`}>
                          <span className="text-[0.625rem] text-gray-400 font-medium">{msg.senderName}</span>
                          <span className="text-[0.625rem] text-gray-300">
                            {new Date(msg.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Reply Form */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
            <textarea
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Type your reply..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-300 resize-none"
            />
            <div className="flex justify-end mt-3">
              <button
                onClick={sendReply}
                disabled={!replyText.trim() || sending}
                className="flex items-center gap-2 px-5 py-2.5 bg-gray-900 text-white rounded-xl text-sm font-medium hover:bg-gray-800 disabled:opacity-50 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                {sending ? 'Sending...' : 'Send Reply'}
              </button>
            </div>
          </div>
        </div>

        {/* Side Panel */}
        <div className="space-y-4">
          {/* Customer Info */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h3 className="text-sm font-medium text-gray-500 mb-3">Customer</h3>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 font-bold text-sm">
                {ticket.customerName.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-gray-900 font-medium">{ticket.customerName}</p>
                {ticket.customerEmail && <p className="text-xs text-gray-400">{ticket.customerEmail}</p>}
                {ticket.customerPhone && <p className="text-xs text-gray-400">{ticket.customerPhone}</p>}
              </div>
            </div>
          </div>

          {/* Update Ticket */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h3 className="text-sm font-medium text-gray-500 mb-4">Update Ticket</h3>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-gray-500">Status</label>
                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value)}
                  className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-200 capitalize"
                >
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500">Priority</label>
                <select
                  value={editPriority}
                  onChange={(e) => setEditPriority(e.target.value)}
                  className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-200 capitalize"
                >
                  {PRIORITY_OPTIONS.map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500">Assigned To</label>
                <input
                  type="text"
                  value={editAssignedTo}
                  onChange={(e) => setEditAssignedTo(e.target.value)}
                  placeholder="Agent name"
                  className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-200"
                />
              </div>
              <button
                onClick={updateTicket}
                disabled={updating}
                className="w-full py-2.5 bg-gray-900 text-white rounded-xl text-sm font-medium hover:bg-gray-800 disabled:opacity-50 transition-colors"
              >
                {updating ? 'Updating...' : 'Update Ticket'}
              </button>
            </div>
          </div>

          {/* Ticket Details */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h3 className="text-sm font-medium text-gray-500 mb-3">Details</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Created</span>
                <span className="text-gray-700">{new Date(ticket.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Updated</span>
                <span className="text-gray-700">{new Date(ticket.updatedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Messages</span>
                <span className="text-gray-700">{ticket.messages.length}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
