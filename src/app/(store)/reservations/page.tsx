'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useMode } from '@/hooks/useMode';
import { useAuthStore } from '@/store/auth';
import { TZ } from '@/lib/tz';
import type { ReservationSlot, Reservation } from '@buildwithdarsh/sdk';
import { useToast } from '@/hooks/useToast';
import { getErrorMessage } from '@/lib/error-messages';
import Spinner from '@/components/ui/Spinner';
import PageLoader from '@/components/ui/PageLoader';
import SignInCard from '@/components/ui/SignInCard';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
};

export default function ReservationsPage() {
  const { isClassic } = useMode();
  const { user } = useAuthStore();
  const accent = isClassic ? '#9A1E29' : '#4AA056';
  const light = isClassic ? '#FFF9F0' : '#F5FBF7';
  const accentLight = isClassic ? 'rgba(154,30,41,0.08)' : 'rgba(74,160,86,0.08)';

  // Step 1: Date, party size, time
  const [date, setDate] = useState('');
  const [partySize, setPartySize] = useState(2);
  const [slots, setSlots] = useState<ReservationSlot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [loadingSlots, setLoadingSlots] = useState(false);

  // Step 2: Guest details
  const [guestName, setGuestName] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [specialRequests, setSpecialRequests] = useState('');

  // Submission
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [confirmation, setConfirmation] = useState<Reservation | null>(null);

  const { toast } = useToast();

  // My reservations
  const [myReservations, setMyReservations] = useState<Reservation[]>([]);
  const [loadingReservations, setLoadingReservations] = useState(false);

  // Get today's date in YYYY-MM-DD for min attribute
  const today = new Date().toISOString().split('T')[0];

  // Fetch slots when date + partySize change
  useEffect(() => {
    if (!date) {
      setSlots([]);
      setSelectedSlot(null);
      return;
    }

    async function fetchSlots() {
      setLoadingSlots(true);
      setSlots([]);
      setSelectedSlot(null);
      try {
        const data = await TZ.storefront.reservations.checkAvailability({ date, partySize });
        setSlots(data || []);
      } catch {
        setSlots([]);
      } finally {
        setLoadingSlots(false);
      }
    }
    fetchSlots();
  }, [date, partySize]);

  // Fetch user reservations
  useEffect(() => {
    if (!user || user.isGuest) return;
    async function fetchReservations() {
      setLoadingReservations(true);
      try {
        const res = await TZ.storefront.reservations.list();
        setMyReservations(res.data || []);
      } catch {
        // Silently fail
      } finally {
        setLoadingReservations(false);
      }
    }
    fetchReservations();
  }, [user]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedSlot || !date) {
      setError('Please select a date and time slot.');
      return;
    }
    setSubmitting(true);
    setError('');

    try {
      const data = await TZ.storefront.reservations.create({
        date,
        startTime: selectedSlot!,
        partySize,
        customerName: guestName,
        customerPhone: guestPhone,
        notes: specialRequests || undefined,
      });
      setConfirmation(data);
      toast.success('Reservation confirmed!');
    } catch (err: unknown) {
      const msg = getErrorMessage(err);
      setError(msg);
      toast.error('Reservation failed', { description: msg });
    } finally {
      setSubmitting(false);
    }
  }

  function getStatusColor(status: string) {
    switch (status) {
      case 'confirmed':
        return { bg: '#F0FAF3', text: '#3D8A48' };
      case 'pending':
        return { bg: '#FFF9F0', text: '#C06820' };
      case 'cancelled':
        return { bg: '#FEF2F2', text: '#991B1B' };
      default:
        return { bg: '#F3F4F6', text: '#6B7280' };
    }
  }

  if (confirmation) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: light }}>
        <section
          className="py-16 px-5"
          style={{
            background: isClassic
              ? 'linear-gradient(135deg, #9A1E29, #7A1722)'
              : 'linear-gradient(135deg, #4AA056, #3D8A48)',
          }}
        >
          <div className="max-w-[600px] mx-auto text-center">
            <h1
              className="text-3xl md:text-4xl font-black text-white mb-2"
              style={{ fontFamily: 'var(--font-hero)' }}
            >
              Reservation Confirmed
            </h1>
          </div>
        </section>
        <section className="max-w-[600px] mx-auto px-5 -mt-6 relative z-10">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="bg-white rounded-md lg:rounded-xl lg:rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 text-center"
          >
            <div className="text-5xl mb-4">✓</div>
            <h2 className="text-xl font-bold text-gray-900 mb-6">You&apos;re all set!</h2>
            <div className="space-y-3 text-left bg-gray-50 rounded-md lg:rounded-xl p-5">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Date</span>
                <span className="font-semibold text-gray-900">
                  {new Date(confirmation.date).toLocaleDateString('en-IN', {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Time</span>
                <span className="font-semibold text-gray-900">{confirmation.startTime}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Party Size</span>
                <span className="font-semibold text-gray-900">
                  {confirmation.partySize ?? 0} {confirmation.partySize === 1 ? 'guest' : 'guests'}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Name</span>
                <span className="font-semibold text-gray-900">{confirmation.customerName}</span>
              </div>
              {confirmation.notes && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Requests</span>
                  <span className="font-semibold text-gray-900 text-right max-w-[200px]">
                    {confirmation.notes}
                  </span>
                </div>
              )}
            </div>
            <button
              onClick={() => {
                setConfirmation(null);
                setDate('');
                setSelectedSlot(null);
                setGuestName('');
                setGuestPhone('');
                setGuestEmail('');
                setSpecialRequests('');
              }}
              className="mt-6 px-6 py-3 rounded-md lg:rounded-xl text-sm font-bold text-white transition-all hover:opacity-90"
              style={{ backgroundColor: accent }}
            >
              Make Another Reservation
            </button>
          </motion.div>
        </section>
      </div>
    );
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
            Reserve a Table
          </h1>
          <p className="text-sm text-white/70">
            Book your spot and skip the wait. Walk in ready.
          </p>
        </div>
      </section>

      <section className="max-w-[800px] mx-auto px-5 py-[80px]">
        <motion.form
          onSubmit={handleSubmit}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="bg-white rounded-md lg:rounded-xl lg:rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8"
        >
          {/* Step 1: Date, Party Size, Time */}
          <h2 className="text-lg font-bold text-gray-900 mb-5">
            <span
              className="inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold text-white mr-2"
              style={{ backgroundColor: accent }}
            >
              1
            </span>
            Choose Date &amp; Time
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Date</label>
              <Input
                type="date"
                required
                min={today}
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Party Size
              </label>
              <Input
                type="number"
                required
                min={1}
                max={20}
                value={partySize}
                onChange={(e) => setPartySize(Number(e.target.value))}
              />
            </div>
          </div>

          {/* Time slots */}
          {date && (
            <div className="mb-8">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Available Time Slots
              </label>
              {loadingSlots ? (
                <PageLoader size="sm" text="Checking availability..." />
              ) : slots.length === 0 ? (
                <p className="text-sm text-gray-400 py-4 text-center">
                  No slots available for this date and party size. Try another date.
                </p>
              ) : (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {slots.map((slot) => (
                    <button
                      key={(slot as any).id}
                      type="button"
                      disabled={!slot.available}
                      onClick={() => setSelectedSlot((slot as any).id)}
                      className="px-3 py-3 rounded-md lg:rounded-xl text-sm font-semibold border-2 transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
                      style={{
                        borderColor: selectedSlot === (slot as any).id ? accent : '#E5E7EB',
                        backgroundColor: selectedSlot === (slot as any).id ? accentLight : '#FFFFFF',
                        color: selectedSlot === (slot as any).id ? accent : '#6B7280',
                      }}
                    >
                      {slot.time}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Divider */}
          <div className="border-t border-gray-100 my-6" />

          {/* Step 2: Guest details */}
          <h2 className="text-lg font-bold text-gray-900 mb-5">
            <span
              className="inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold text-white mr-2"
              style={{ backgroundColor: accent }}
            >
              2
            </span>
            Guest Details
          </h2>

          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Name</label>
              <Input
                type="text"
                required
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                placeholder="Your name"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Phone</label>
                <Input
                  type="tel"
                  required
                  value={guestPhone}
                  onChange={(e) => setGuestPhone(e.target.value)}
                  placeholder="+91 90000 00000"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email</label>
                <Input
                  type="email"
                  value={guestEmail}
                  onChange={(e) => setGuestEmail(e.target.value)}
                  placeholder="you@email.com"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Special Requests <span className="text-gray-400 font-normal">(optional)</span>
              </label>
              <Textarea
                value={specialRequests}
                onChange={(e) => setSpecialRequests(e.target.value)}
                rows={3}
                placeholder="Any dietary requirements, seating preferences..."
              />
            </div>
          </div>

          {error && (
            <div className="mb-4 px-4 py-3 rounded-md lg:rounded-xl bg-red-50 text-red-600 text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting || !selectedSlot}
            className="w-full py-3.5 rounded-md lg:rounded-xl text-sm font-bold text-white transition-all duration-200 hover:opacity-90 disabled:opacity-50 inline-flex items-center justify-center gap-2"
            style={{ backgroundColor: accent }}
          >
            {submitting && <Spinner />}
            {submitting ? 'Booking...' : 'Confirm Reservation'}
          </button>
        </motion.form>

        {/* My Reservations */}
        {(!user || user.isGuest) ? (
          <div className="mt-6">
            <SignInCard
              title="Sign in to view your reservations"
              description="Track your upcoming bookings and reservation history"
              accentColor={accent}
              icon={
                <svg className="w-12 h-12 mx-auto text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                </svg>
              }
            />
          </div>
        ) : (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="bg-white rounded-md lg:rounded-xl lg:rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 mt-6"
          >
            <h2 className="text-lg font-bold text-gray-900 mb-5">My Reservations</h2>

            {loadingReservations ? (
              <PageLoader size="sm" text="Loading..." />
            ) : myReservations.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-6">
                No upcoming reservations.
              </p>
            ) : (
              <div className="space-y-3">
                {myReservations.map((r) => {
                  const statusColor = getStatusColor(r.status);
                  return (
                    <div
                      key={r.id}
                      className="flex items-center justify-between p-4 rounded-md lg:rounded-xl bg-gray-50 border border-gray-100"
                    >
                      <div>
                        <p className="text-sm font-semibold text-gray-900">
                          {new Date(r.date).toLocaleDateString('en-IN', {
                            weekday: 'short',
                            day: 'numeric',
                            month: 'short',
                          })}{' '}
                          at {(r as any).time}
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {r.partySize} {r.partySize === 1 ? 'guest' : 'guests'}
                          {(r as any).specialRequests ? ` — ${(r as any).specialRequests}` : ''}
                        </p>
                      </div>
                      <span
                        className="text-[0.6875rem] font-bold px-3 py-1 rounded-full capitalize"
                        style={{ backgroundColor: statusColor.bg, color: statusColor.text }}
                      >
                        {r.status}
                      </span>
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
