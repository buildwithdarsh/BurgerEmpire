'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useMode } from '@/hooks/useMode';
import { useConfig } from '@/hooks/useConfig';
import { useAuthStore } from '@/store/auth';
import { TZ } from '@/lib/tz';
import PageLoader from '@/components/ui/PageLoader';

import WaveDivider from '@/components/WaveDivider';
import StudentPassStatusBadge from '@/components/StudentPassStatusBadge';
import StudentPassApplyModal from '@/components/StudentPassApplyModal';
import AuthModal from '@/components/auth/AuthModal';

interface PassStatus {
  hasPass: boolean;
  status: string | null;
  studentId: string | null;
  year: string | null;
  aadhaarLast4: string | null;
  institution: string | null;
  discountPercent: number | null;
  expiresAt: string | null;
}

const HOW_IT_WORKS = [
  {
    step: '1',
    title: 'Sign Up',
    description: 'Create your free Burger Empire account or log in if you already have one.',
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
      </svg>
    ),
  },
  {
    step: '2',
    title: 'Verify Your ID',
    description: 'Submit your student ID, year, and Aadhaar number. We verify it in 24-48 hours.',
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5zm6-10.125a1.875 1.875 0 11-3.75 0 1.875 1.875 0 013.75 0zm1.294 6.336a6.721 6.721 0 01-3.17.789 6.721 6.721 0 01-3.168-.789 3.376 3.376 0 016.338 0z" />
      </svg>
    ),
  },
  {
    step: '3',
    title: 'Save Automatically',
    description: 'Once verified, your student discount applies on every order. No coupons needed.',
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
      </svg>
    ),
  },
];

const BENEFITS = [
  {
    title: 'Automatic Discounts',
    description: 'Your student discount is applied at checkout every time. No codes to remember.',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" />
      </svg>
    ),
  },
  {
    title: 'No Coupon Needed',
    description: 'Forget about searching for promo codes. Your pass does the work.',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026a2.999 2.999 0 010 5.198v3.026c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-3.026a2.999 2.999 0 010-5.198V6.375c0-.621-.504-1.125-1.125-1.125H3.375z" />
      </svg>
    ),
  },
  {
    title: 'Works on Every Order',
    description: 'Dine-in, takeaway, or delivery — your student discount works everywhere.',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
      </svg>
    ),
  },
  {
    title: 'Stack with Rewards',
    description: 'Student Pass works alongside Baby Coins. Earn rewards while saving.',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
      </svg>
    ),
  },
];

export default function StudentPassPage() {
  const { isClassic } = useMode();
  const { config } = useConfig();
  const user = useAuthStore((s) => s.user);

  const [passStatus, setPassStatus] = useState<PassStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [showAuth, setShowAuth] = useState(false);

  const accent = isClassic ? '#9A1E29' : '#4AA056';
  const lightBg = isClassic ? '#FFF9F0' : '#F5FBF7';
  const heroEdge = isClassic ? '#7A1722' : '#3D8A48';

  const fetchStatus = useCallback(async () => {
    if (!user || user.isGuest) {
      setPassStatus(null);
      setLoading(false);
      return;
    }

    try {
      const data = await TZ.storefront.student.getPassStatus();
      setPassStatus(data as any);
    } catch {
      setPassStatus(null);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchStatus();
  }, [fetchStatus]);

  if (!config.features.student_pass_enabled) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-5 text-center">
        <span className="text-4xl mb-4 block">&#127891;</span>
        <h1 className="text-2xl font-bold text-gray-900 mb-2" style={{ fontFamily: 'var(--font-poppins)' }}>
          Student Pass Unavailable
        </h1>
        <p className="text-sm text-gray-500 mb-6 max-w-sm">
          The Student Pass program is currently not available. Check back later!
        </p>
        <Link
          href="/menu"
          className="px-6 py-3 rounded-md lg:rounded-xl text-sm font-bold text-white transition-opacity hover:opacity-90"
          style={{ backgroundColor: accent }}
        >
          Browse Menu
        </Link>
      </div>
    );
  }

  const handleApplyClick = () => {
    if (!user || user.isGuest) {
      setShowAuth(true);
    } else {
      setShowApplyModal(true);
    }
  };

  const handleApplySuccess = () => {
    fetchStatus();
  };

  return (
    <div className="min-h-screen has-pattern" style={{ backgroundColor: lightBg }}>
      {/* Hero Section */}
      <section
        className="py-16 px-5"
        style={{
          background: isClassic
            ? 'linear-gradient(135deg, #EB7A29, #9A1E29)'
            : 'linear-gradient(135deg, #81C784, #4AA056)',
        }}
      >
        <div className="max-w-[800px] mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="text-5xl mb-4 block">&#127891;</span>
            <h1
              className="text-3xl md:text-5xl font-black text-white mb-3"
              style={{ fontFamily: 'var(--font-poppins)' }}
            >
              Student Pass
            </h1>
            <p className="text-base md:text-lg text-white/80 max-w-lg mx-auto leading-relaxed">
              Verify your student ID and unlock exclusive discounts on every Burger Empire order. No coupons, no hassle — just savings.
            </p>
          </motion.div>

          {/* Hero CTA */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-8"
          >
            {loading ? (
              <PageLoader text="Checking status..." />
            ) : passStatus?.hasPass ? (
              <div className="inline-flex flex-col items-center gap-3">
                <StudentPassStatusBadge status={passStatus.status || 'PENDING'} />
                {passStatus.status === 'VERIFIED' && passStatus.discountPercent && (
                  <p className="text-white/90 text-sm font-semibold">
                    You&apos;re saving {passStatus.discountPercent}% on every order
                  </p>
                )}
                {passStatus.expiresAt && (
                  <p className="text-white/50 text-xs">
                    Valid until {new Date(passStatus.expiresAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </p>
                )}
              </div>
            ) : (
              <button
                onClick={handleApplyClick}
                className="px-8 py-3.5 rounded-xl lg:rounded-2xl text-sm font-bold bg-white transition-all active:scale-[0.98] hover:shadow-lg"
                style={{ color: accent }}
              >
                Apply Now
              </button>
            )}
          </motion.div>
        </div>
      </section>

      <WaveDivider variant="curve" topColor={heroEdge} bottomColor={lightBg} />

      <div className="max-w-[800px] mx-auto px-5 -mt-2">
        {/* Current Pass Status (for logged-in users with a pass) */}
        {passStatus?.hasPass && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-white rounded-xl lg:rounded-2xl border border-gray-100 shadow-sm p-6 mb-8"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900" style={{ fontFamily: 'var(--font-poppins)' }}>
                Your Student Pass
              </h2>
              <StudentPassStatusBadge status={passStatus.status || 'PENDING'} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-md lg:rounded-xl bg-gray-50 p-3">
                <p className="text-[0.625rem] font-bold uppercase tracking-wider text-gray-400 mb-1">Student ID</p>
                <p className="text-sm font-semibold text-gray-900">{passStatus.studentId || '-'}</p>
              </div>
              <div className="rounded-md lg:rounded-xl bg-gray-50 p-3">
                <p className="text-[0.625rem] font-bold uppercase tracking-wider text-gray-400 mb-1">Year</p>
                <p className="text-sm font-semibold text-gray-900">{passStatus.year || '-'}</p>
              </div>
              {passStatus.aadhaarLast4 && (
                <div className="rounded-md lg:rounded-xl bg-gray-50 p-3">
                  <p className="text-[0.625rem] font-bold uppercase tracking-wider text-gray-400 mb-1">Aadhaar</p>
                  <p className="text-sm font-semibold text-gray-900">{passStatus.aadhaarLast4}</p>
                </div>
              )}
              {passStatus.discountPercent && (
                <div className="rounded-md lg:rounded-xl bg-gray-50 p-3">
                  <p className="text-[0.625rem] font-bold uppercase tracking-wider text-gray-400 mb-1">Discount</p>
                  <p className="text-sm font-bold" style={{ color: accent }}>{passStatus.discountPercent}% off</p>
                </div>
              )}
              {passStatus.expiresAt && (
                <div className="rounded-md lg:rounded-xl bg-gray-50 p-3">
                  <p className="text-[0.625rem] font-bold uppercase tracking-wider text-gray-400 mb-1">Valid Until</p>
                  <p className="text-sm font-semibold text-gray-900">
                    {new Date(passStatus.expiresAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </p>
                </div>
              )}
            </div>

            {passStatus.status === 'REJECTED' && (
              <div className="mt-4 rounded-md lg:rounded-xl bg-red-50 border border-red-100 p-3">
                <p className="text-xs text-red-700">
                  Your application was not approved. Please verify your student ID is correct and try applying again.
                </p>
                <button
                  onClick={() => setShowApplyModal(true)}
                  className="mt-2 text-xs font-bold underline"
                  style={{ color: accent }}
                >
                  Re-apply
                </button>
              </div>
            )}

            {passStatus.status === 'EXPIRED' && (
              <div className="mt-4 rounded-md lg:rounded-xl bg-gray-50 border border-gray-100 p-3">
                <p className="text-xs text-gray-600">
                  Your Student Pass has expired. Apply again to renew your discount.
                </p>
                <button
                  onClick={() => setShowApplyModal(true)}
                  className="mt-2 text-xs font-bold underline"
                  style={{ color: accent }}
                >
                  Renew Pass
                </button>
              </div>
            )}
          </motion.section>
        )}

        {/* Benefits Section */}
        <section className="mb-10">
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="text-xl font-bold text-gray-900 mb-6 text-center"
            style={{ fontFamily: 'var(--font-poppins)' }}
          >
            Why Get a Student Pass?
          </motion.h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {BENEFITS.map((benefit, i) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.15 + i * 0.08 }}
                className="bg-white rounded-xl lg:rounded-2xl border border-gray-100 shadow-sm p-5"
              >
                <div
                  className="w-10 h-10 rounded-md lg:rounded-xl flex items-center justify-center mb-3"
                  style={{ backgroundColor: `${accent}10`, color: accent }}
                >
                  {benefit.icon}
                </div>
                <h3 className="text-sm font-bold text-gray-900 mb-1">{benefit.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* How It Works */}
        <section className="mb-10">
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="text-xl font-bold text-gray-900 mb-6 text-center"
            style={{ fontFamily: 'var(--font-poppins)' }}
          >
            How It Works
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {HOW_IT_WORKS.map((item, i) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.25 + i * 0.1 }}
                className="bg-white rounded-xl lg:rounded-2xl border border-gray-100 shadow-sm p-6 text-center relative"
              >
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-black mx-auto mb-3"
                  style={{ backgroundColor: accent }}
                >
                  {item.step}
                </div>
                <div
                  className="flex justify-center mb-3"
                  style={{ color: accent }}
                >
                  {item.icon}
                </div>
                <h3 className="text-sm font-bold text-gray-900 mb-1">{item.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Participating Institutions */}
        <section className="mb-10">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="bg-white rounded-xl lg:rounded-2xl border border-gray-100 shadow-sm p-6 text-center"
          >
            <h2
              className="text-lg font-bold text-gray-900 mb-2"
              style={{ fontFamily: 'var(--font-poppins)' }}
            >
              Participating Institutions
            </h2>
            <p className="text-sm text-gray-500 mb-4">
              Students from all recognized Indian universities, colleges, and educational institutions are eligible for the Student Pass.
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {[
                'All UGC-recognized Universities',
                'AICTE-approved Colleges',
                'IITs & NITs',
                'State Universities',
                'Polytechnics & ITIs',
                'Coaching Institutes',
              ].map((inst) => (
                <span
                  key={inst}
                  className="px-3 py-1.5 rounded-full text-[0.6875rem] font-semibold border"
                  style={{
                    borderColor: isClassic ? '#FDE8B0' : '#D8EAD8',
                    backgroundColor: isClassic ? '#FFFBF0' : '#F0FAF3',
                    color: isClassic ? '#C06820' : '#3D8A48',
                  }}
                >
                  {inst}
                </span>
              ))}
            </div>
          </motion.div>
        </section>

        {/* Bottom CTA */}
        {!passStatus?.hasPass && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.35 }}
            className="mb-12"
          >
            <div
              className="rounded-xl lg:rounded-2xl p-8 text-center text-white"
              style={{
                background: isClassic
                  ? 'linear-gradient(135deg, #9A1E29, #7A1722)'
                  : 'linear-gradient(135deg, #4AA056, #3D8A48)',
              }}
            >
              <h2 className="text-xl md:text-2xl font-black mb-2" style={{ fontFamily: 'var(--font-poppins)' }}>
                Ready to start saving?
              </h2>
              <p className="text-sm text-white/70 mb-6 max-w-md mx-auto">
                Apply for your Student Pass today and enjoy automatic discounts on every order.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  onClick={handleApplyClick}
                  className="px-8 py-3 rounded-xl lg:rounded-2xl text-sm font-bold bg-white transition-all active:scale-[0.98] hover:shadow-lg"
                  style={{ color: accent }}
                >
                  Apply Now
                </button>
                <Link
                  href="/menu"
                  className="px-8 py-3 rounded-xl lg:rounded-2xl text-sm font-semibold border border-white/30 text-white hover:bg-white/10 transition-colors"
                >
                  Browse Menu
                </Link>
              </div>
            </div>
          </motion.section>
        )}

        {/* FAQ */}
        <section className="mb-12">
          <h2
            className="text-lg font-bold text-gray-900 mb-4 text-center"
            style={{ fontFamily: 'var(--font-poppins)' }}
          >
            Frequently Asked Questions
          </h2>
          <div className="space-y-3">
            {[
              {
                q: 'Is the Student Pass free?',
                a: 'Yes! The Student Pass is completely free. Just verify your student ID and start saving.',
              },
              {
                q: 'How long does verification take?',
                a: 'Verification usually takes 24-48 hours. You will receive a notification once your pass is approved.',
              },
              {
                q: 'Can I use it with other offers?',
                a: 'The Student Pass stacks with Baby Coins rewards. However, it cannot be combined with coupon codes or other promotional discounts.',
              },
              {
                q: 'How long is the pass valid?',
                a: 'Your Student Pass is valid for one academic year from the date of verification. You can renew it by re-verifying your student status.',
              },
              {
                q: 'What if my application is rejected?',
                a: 'If rejected, double-check your student ID and institution details, then re-apply. Make sure you are currently enrolled at a recognized institution.',
              },
            ].map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.4 + i * 0.05 }}
                className="bg-white rounded-xl lg:rounded-2xl border border-gray-100 shadow-sm p-5"
              >
                <h3 className="text-sm font-bold text-gray-900 mb-1">{faq.q}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{faq.a}</p>
              </motion.div>
            ))}
          </div>
        </section>
      </div>

      {/* Modals */}
      <StudentPassApplyModal
        isOpen={showApplyModal}
        onClose={() => setShowApplyModal(false)}
        onSuccess={handleApplySuccess}
      />
      <AuthModal
        isOpen={showAuth}
        onClose={() => {
          setShowAuth(false);
          // After auth, if user is now logged in, re-check status
          fetchStatus();
        }}
      />
    </div>
  );
}
