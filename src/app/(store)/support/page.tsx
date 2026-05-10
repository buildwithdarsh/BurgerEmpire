'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useMode } from '@/hooks/useMode';
import { useAuthStore } from '@/store/auth';
import { TZ } from '@/lib/tz';
import { useToast } from '@/hooks/useToast';
import { getErrorMessage } from '@/lib/error-messages';
import Spinner from '@/components/ui/Spinner';
import PageLoader from '@/components/ui/PageLoader';
import SignInCard from '@/components/ui/SignInCard';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Textarea from '@/components/ui/Textarea';

interface TicketMessage {
  id: string;
  body: string;
  sender: 'user' | 'support';
  createdAt: string;
}

interface Ticket {
  id: string;
  subject: string;
  description: string;
  category: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  createdAt: string;
  messages: TicketMessage[];
}

const CATEGORIES = [
  { value: 'general', label: 'General Enquiry' },
  { value: 'order_issue', label: 'Order Issue' },
  { value: 'payment', label: 'Payment' },
  { value: 'delivery', label: 'Delivery' },
  { value: 'other', label: 'Other' },
];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
};

export default function SupportPage() {
  const { isClassic } = useMode();
  const { user } = useAuthStore();
  const accent = isClassic ? '#9A1E29' : '#4AA056';
  const light = isClassic ? '#FFF9F0' : '#F5FBF7';
  const accentLight = isClassic ? 'rgba(154,30,41,0.08)' : 'rgba(74,160,86,0.08)';

  // Ticket form
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('general');
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');

  // My tickets
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loadingTickets, setLoadingTickets] = useState(false);
  const [expandedTicketId, setExpandedTicketId] = useState<string | null>(null);

  // Reply
  const [replyBody, setReplyBody] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);

  const { toast } = useToast();

  useEffect(() => {
    if (!user || user.isGuest) return;
    fetchTickets();
  }, [user]);

  async function fetchTickets() {
    setLoadingTickets(true);
    try {
      const tickets = await TZ.storefront.support.list();
      setTickets(tickets as any);
    } catch {
      // Silently fail
    } finally {
      setLoadingTickets(false);
    }
  }

  async function handleSubmitTicket(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError('');
    setSubmitSuccess(false);

    try {
      const ticket = await TZ.storefront.support.create({ subject, body: description, category });
      setSubmitSuccess(true);
      setSubject('');
      setDescription('');
      setCategory('general');
      if (ticket) {
        setTickets((prev) => [ticket as any, ...prev]);
      }
      toast.success('Ticket submitted!', { description: "We'll get back to you soon." });
    } catch (err: any) {
      const msg = getErrorMessage(err);
      setSubmitError(msg);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleReply(ticketId: string) {
    if (!replyBody.trim()) return;
    setReplyingTo(ticketId);

    try {
      const message = await TZ.storefront.support.reply(ticketId, { body: replyBody } as any);
      setTickets((prev) =>
        prev.map((t) =>
          t.id === ticketId
            ? { ...t, messages: [...t.messages, message as any] }
            : t
        )
      );
      setReplyBody('');
      toast.success('Reply sent');
    } catch (err) {
      toast.error('Failed to send reply', { description: getErrorMessage(err) });
    } finally {
      setReplyingTo(null);
    }
  }

  function getStatusStyle(status: string) {
    switch (status) {
      case 'open':
        return { bg: '#EEF2FF', text: '#4338CA' };
      case 'in_progress':
        return { bg: '#FFF9F0', text: '#C06820' };
      case 'resolved':
        return { bg: '#F0FAF3', text: '#3D8A48' };
      case 'closed':
        return { bg: '#F3F4F6', text: '#6B7280' };
      default:
        return { bg: '#F3F4F6', text: '#6B7280' };
    }
  }

  function formatStatus(status: string) {
    return status.replace('_', ' ');
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: light }}>
      {/* Hero */}
      <section
        className="py-12 px-5"
        style={{
          background: isClassic
            ? 'linear-gradient(135deg, #9A1E29, #7A1722)'
            : 'linear-gradient(135deg, #4AA056, #3D8A48)',
        }}
      >
        <div className="max-w-[800px] mx-auto">
          <h1
            className="text-3xl md:text-4xl font-black text-white mb-2"
            style={{ fontFamily: 'var(--font-hero)' }}
          >
            Need Help?
          </h1>
          <p className="text-sm text-white/70">
            We&apos;re here for you. Get quick answers or raise a support ticket.
          </p>
        </div>
      </section>

      <section className="max-w-[800px] mx-auto px-5 py-[80px]">
        {/* Quick actions */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8"
        >
          <Link
            href="/help"
            className="bg-white rounded-md lg:rounded-xl lg:rounded-2xl shadow-sm border border-gray-100 p-5 flex items-center gap-4 hover:border-gray-200 transition-colors group"
          >
            <div
              className="w-12 h-12 rounded-md lg:rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: accentLight }}
            >
              <svg
                className="w-6 h-6"
                style={{ color: accent }}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.331 0 4.512.89 6.042 2.36M12 6.042A8.967 8.967 0 0118 3.75c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18c-2.331 0-4.512.89-6.042 2.36M12 6.042V20.4"
                />
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-900">Help Centre</h3>
              <p className="text-xs text-gray-500 mt-0.5">
                Browse FAQs and guides
              </p>
            </div>
          </Link>

          <Link
            href="/help"
            className="bg-white rounded-md lg:rounded-xl lg:rounded-2xl shadow-sm border border-gray-100 p-5 flex items-center gap-4 hover:border-gray-200 transition-colors group"
          >
            <div
              className="w-12 h-12 rounded-md lg:rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: accentLight }}
            >
              <svg
                className="w-6 h-6"
                style={{ color: accent }}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m8.25 3v6.75m0 0l-3-3m3 3l3-3M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z"
                />
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-900">Order Issues</h3>
              <p className="text-xs text-gray-500 mt-0.5">
                Report a problem with your order
              </p>
            </div>
          </Link>
        </motion.div>

        {/* Raise a Ticket */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="bg-white rounded-md lg:rounded-xl lg:rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 mb-8"
        >
          <h2 className="text-lg font-bold text-gray-900 mb-5">Raise a Ticket</h2>

          <form onSubmit={handleSubmitTicket} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Category
              </label>
              <Select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </Select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Subject
              </label>
              <Input
                type="text"
                required
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Brief summary of your issue"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Description
              </label>
              <Textarea
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                placeholder="Describe your issue in detail..."
              />
            </div>

            {submitError && (
              <div className="px-4 py-3 rounded-md lg:rounded-xl bg-red-50 text-red-600 text-sm">
                {submitError}
              </div>
            )}
            {submitSuccess && (
              <div className="px-4 py-3 rounded-md lg:rounded-xl bg-green-50 text-green-700 text-sm">
                Your ticket has been submitted. We&apos;ll get back to you as soon as possible.
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 rounded-md lg:rounded-xl text-sm font-bold text-white transition-all duration-200 hover:opacity-90 disabled:opacity-50 inline-flex items-center justify-center gap-2"
              style={{ backgroundColor: accent }}
            >
              {submitting && <Spinner />}
              {submitting ? 'Submitting...' : 'Submit Ticket'}
            </button>
          </form>
        </motion.div>

        {/* My Tickets */}
        {(!user || user.isGuest) ? (
          <SignInCard
            title="Sign in to view your tickets"
            description="Track your support requests and conversation history"
            accentColor={accent}
            icon={
              <svg className="w-12 h-12 mx-auto text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
              </svg>
            }
          />
        ) : (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="bg-white rounded-md lg:rounded-xl lg:rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8"
          >
            <h2 className="text-lg font-bold text-gray-900 mb-5">My Tickets</h2>

            {loadingTickets ? (
              <PageLoader size="sm" text="Loading tickets..." />
            ) : tickets.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-6">
                You haven&apos;t raised any tickets yet.
              </p>
            ) : (
              <div className="space-y-3">
                {tickets.map((ticket) => {
                  const isExpanded = expandedTicketId === ticket.id;
                  const statusStyle = getStatusStyle(ticket.status);

                  return (
                    <div
                      key={ticket.id}
                      className="rounded-md lg:rounded-xl border border-gray-100 overflow-hidden"
                    >
                      {/* Ticket header */}
                      <button
                        onClick={() =>
                          setExpandedTicketId(isExpanded ? null : ticket.id)
                        }
                        className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex-1 min-w-0 mr-3">
                          <div className="flex items-center gap-2 mb-1">
                            <span
                              className="text-[0.625rem] font-bold px-2 py-0.5 rounded-full capitalize"
                              style={{
                                backgroundColor: statusStyle.bg,
                                color: statusStyle.text,
                              }}
                            >
                              {formatStatus(ticket.status)}
                            </span>
                            <span className="text-[0.625rem] text-gray-400 font-medium px-2 py-0.5 rounded-full bg-gray-50">
                              {CATEGORIES.find((c) => c.value === ticket.category)?.label ||
                                ticket.category}
                            </span>
                          </div>
                          <p className="text-sm font-semibold text-gray-900 truncate">
                            {ticket.subject}
                          </p>
                          <p className="text-xs text-gray-400 mt-0.5">
                            {new Date(ticket.createdAt).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            })}
                          </p>
                        </div>
                        <svg
                          className="w-5 h-5 text-gray-400 flex-shrink-0 transition-transform duration-200"
                          style={{
                            transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                          }}
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </button>

                      {/* Ticket body */}
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                            className="overflow-hidden"
                          >
                            <div className="px-4 pb-4 border-t border-gray-100">
                              {/* Original description */}
                              <div className="py-3">
                                <p className="text-sm text-gray-600 leading-relaxed">
                                  {ticket.description}
                                </p>
                              </div>

                              {/* Messages */}
                              {ticket.messages.length > 0 && (
                                <div className="space-y-3 mb-4">
                                  {ticket.messages.map((msg) => (
                                    <div
                                      key={msg.id}
                                      className="p-3 rounded-lg text-sm"
                                      style={{
                                        backgroundColor:
                                          msg.sender === 'support'
                                            ? accentLight
                                            : '#F9FAFB',
                                        borderLeft:
                                          msg.sender === 'support'
                                            ? `3px solid ${accent}`
                                            : '3px solid #E5E7EB',
                                      }}
                                    >
                                      <div className="flex items-center gap-2 mb-1">
                                        <span className="text-xs font-bold text-gray-700">
                                          {msg.sender === 'support'
                                            ? 'Support Team'
                                            : 'You'}
                                        </span>
                                        <span className="text-[0.625rem] text-gray-400">
                                          {new Date(msg.createdAt).toLocaleDateString(
                                            'en-IN',
                                            {
                                              day: 'numeric',
                                              month: 'short',
                                              hour: '2-digit',
                                              minute: '2-digit',
                                            }
                                          )}
                                        </span>
                                      </div>
                                      <p className="text-gray-600">{msg.body}</p>
                                    </div>
                                  ))}
                                </div>
                              )}

                              {/* Reply form */}
                              {ticket.status !== 'closed' && (
                                <div className="flex gap-2">
                                  <Input
                                    type="text"
                                    value={
                                      expandedTicketId === ticket.id ? replyBody : ''
                                    }
                                    onChange={(e) => setReplyBody(e.target.value)}
                                    placeholder="Type your reply..."
                                    className="flex-1"
                                    onKeyDown={(e) => {
                                      if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault();
                                        handleReply(ticket.id);
                                      }
                                    }}
                                  />
                                  <button
                                    onClick={() => handleReply(ticket.id)}
                                    disabled={
                                      replyingTo === ticket.id || !replyBody.trim()
                                    }
                                    className="px-5 py-2.5 rounded-md lg:rounded-xl text-sm font-bold text-white transition-all hover:opacity-90 disabled:opacity-50 inline-flex items-center gap-1.5"
                                    style={{ backgroundColor: accent }}
                                  >
                                    {replyingTo === ticket.id && <Spinner size="xs" />}
                                    {replyingTo === ticket.id ? 'Sending...' : 'Reply'}
                                  </button>
                                </div>
                              )}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            )}
          </motion.div>
        )}
      </section>
    </div>
  );
}
