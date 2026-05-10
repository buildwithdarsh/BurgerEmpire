'use client';

import { useState, useEffect, useCallback } from 'react';
import { useMode } from '@/hooks/useMode';
import { useConfig } from '@/hooks/useConfig';
import { useAuthStore } from '@/store/auth';
import { motion, AnimatePresence } from 'framer-motion';
import { TZ } from '@/lib/tz';
import { dialCodeForCountry } from '@/lib/format';
import Input from '@/components/ui/Input';
import OtpInput from './OtpInput';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

type Tab = 'login' | 'register';
type View = 'auth' | 'forgot' | 'forgot-otp' | 'forgot-reset';

function Spinner({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={`animate-spin ${className}`} viewBox="0 0 24 24" fill="none">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
    </svg>
  );
}


const icons = {
  user: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0" /></svg>,
  phone: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 0 0 6 3.75v16.5a2.25 2.25 0 0 0 2.25 2.25h7.5A2.25 2.25 0 0 0 18 20.25V3.75a2.25 2.25 0 0 0-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3" /></svg>,
  email: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" /></svg>,
  lock: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" /></svg>,
  gift: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M21 11.25v8.25a1.5 1.5 0 0 1-1.5 1.5H4.5a1.5 1.5 0 0 1-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 1 0 9.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1 1 14.625 7.5H12m0 0V21m-8.625-9.75h18c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125h-18c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" /></svg>,
  key: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 0 1 3 3m3 0a6 6 0 0 1-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1 1 21.75 8.25Z" /></svg>,
  back: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>,
  check: <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>,
};

/* ── Step Progress Bar ──────────────────────────────── */

function StepProgress({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex gap-1.5 mb-6">
      {Array.from({ length: total }, (_, i) => (
        <div
          key={i}
          className={`h-1 rounded-full flex-1 transition-all duration-300 ${
            i < current ? 'bg-gray-900' : i === current ? 'bg-gray-400' : 'bg-gray-200'
          }`}
        />
      ))}
    </div>
  );
}

/* ── Resend Timer ───────────────────────────────────── */

function ResendTimer({ onResend, initialSeconds = 30 }: { onResend: () => void; initialSeconds?: number }) {
  const [seconds, setSeconds] = useState(initialSeconds);

  useEffect(() => {
    if (seconds <= 0) return;
    const timer = setInterval(() => setSeconds(s => s - 1), 1000);
    return () => clearInterval(timer);
  }, [seconds]);

  return seconds > 0 ? (
    <p className="text-xs text-gray-400 text-center">
      Resend code in <span className="font-medium text-gray-600">{seconds}s</span>
    </p>
  ) : (
    <button
      type="button"
      onClick={() => { onResend(); setSeconds(initialSeconds); }}
      className="text-xs font-medium text-center w-full hover:text-gray-600 transition-colors"
      style={{ color: 'inherit' }}
    >
      Resend Code
    </button>
  );
}

/* ── Slide animation variants ───────────────────────── */

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 60 : -60,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -60 : 60,
    opacity: 0,
  }),
};

/* ── Error display helper ───────────────────────────── */

function formatError(err: unknown): string {
  if (err instanceof Error) return err.message;
  if (typeof err === 'string') return err;
  if (err && typeof err === 'object' && 'message' in err) return String((err as { message: unknown }).message);
  return 'Something went wrong. Please try again.';
}

/* ── Main AuthModal ─────────────────────────────────── */

export default function AuthModal({ isOpen, onClose, onSuccess }: AuthModalProps) {
  const { isClassic } = useMode();
  const { config } = useConfig();
  const { login, setUser, isLoading } = useAuthStore();
  const authConfig = config.auth;
  const otpResendSeconds = (authConfig.otp_expiry_minutes ?? 5) * 60;
  const [tab, setTab] = useState<Tab>('login');
  const [view, setView] = useState<View>('auth');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Login state
  const [loginId, setLoginId] = useState('');
  const [loginPass, setLoginPass] = useState('');

  // Signup multi-step state
  const [signupStep, setSignupStep] = useState(0);
  const [signupDirection, setSignupDirection] = useState(1);
  const [regPhone, setRegPhone] = useState('');
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPass, setRegPass] = useState('');
  const [regReferral, setRegReferral] = useState('');
  const [showReferral, setShowReferral] = useState(false);
  const [signupLoading, setSignupLoading] = useState(false);
  const [otpError, setOtpError] = useState(false);

  // Forgot password state
  const [resetIdentifier, setResetIdentifier] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [resetLoading, setResetLoading] = useState(false);
  const [forgotOtpError, setForgotOtpError] = useState(false);

  const accent = isClassic ? '#9A1E29' : '#4AA056';
  const accentLight = isClassic ? 'bg-red-50' : 'bg-green-50';
  const phonePrefix = dialCodeForCountry(config.branding?.country_code || 'IN');

  const goToSignupStep = useCallback((step: number) => {
    setSignupDirection(step > signupStep ? 1 : -1);
    setSignupStep(step);
    setError('');
  }, [signupStep]);

  /* ── Login ─────────────────────────────────────────── */

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await login(loginId, loginPass);
      onSuccess?.();
      onClose();
    } catch (err) {
      setError(formatError(err));
    }
  };

  /* ── Signup Step 1: Phone ──────────────────────────── */

  const handleStartSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSignupLoading(true);
    try {
      await TZ.storefront.auth.startSignup({ phone: regPhone });
      // Skip OTP verification step if require_phone_verification is false
      if (authConfig.require_phone_verification) {
        goToSignupStep(1);
      } else {
        goToSignupStep(2);
      }
    } catch (err) {
      setError(formatError(err));
    } finally {
      setSignupLoading(false);
    }
  };

  /* ── Signup Step 2: Verify OTP ─────────────────────── */

  const handleVerifySignupOtp = async (otp: string) => {
    setError('');
    setSignupLoading(true);
    setOtpError(false);
    try {
      const res = await TZ.storefront.auth.verifySignupOtp({ phone: regPhone, otp });
      if (res.user) setUser({ ...res.user, isGuest: false } as any);
      goToSignupStep(2);
    } catch (err) {
      setOtpError(true);
      setError(formatError(err));
    } finally {
      setSignupLoading(false);
    }
  };

  const handleResendSignupOtp = async () => {
    setError('');
    try {
      await TZ.storefront.auth.startSignup({ phone: regPhone });
    } catch (err) {
      setError(formatError(err));
    }
  };

  // Compute the "success" step index dynamically based on whether email verification is required
  const needsEmailVerification = authConfig.require_email_verification && !!regEmail;
  const successStep = needsEmailVerification ? 4 : 3;

  // Total visible progress steps (excluding the success screen):
  // Phone (0) + OTP (1, if require_phone_verification) + Profile (2) + Email notice (3, if email verification)
  const totalProgressSteps = 1 + (authConfig.require_phone_verification ? 1 : 0) + 1 + (needsEmailVerification ? 1 : 0);

  /* ── Signup Step 3: Complete Profile ───────────────── */

  const handleCompleteSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSignupLoading(true);
    try {
      const res = await TZ.storefront.auth.completeSignup({
        name: regName,
        email: regEmail || undefined,
        password: regPass,
      });
      if (res.user) setUser({ ...res.user, isGuest: false } as any);

      if (needsEmailVerification) {
        // Show email verification pending notice before success
        goToSignupStep(3);
      } else {
        goToSignupStep(successStep);
        // Auto-close after success flash
        setTimeout(() => {
          onSuccess?.();
          onClose();
        }, 1500);
      }
    } catch (err) {
      setError(formatError(err));
    } finally {
      setSignupLoading(false);
    }
  };

  /* ── Signup Step 3b: Email verification acknowledged ─ */

  const handleEmailVerificationContinue = () => {
    goToSignupStep(successStep);
    setTimeout(() => {
      onSuccess?.();
      onClose();
    }, 1500);
  };

  /* ── Forgot Password ──────────────────────────────── */

  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setResetLoading(true);
    try {
      await TZ.storefront.auth.requestPasswordReset({ identifier: resetIdentifier });
      setView('forgot-otp');
      setSuccess('A reset code has been sent to your email/phone.');
    } catch {
      setError('Failed to send reset code. Please try again.');
    } finally {
      setResetLoading(false);
    }
  };

  const handleForgotOtpComplete = (otp: string) => {
    setForgotOtpError(false);
    setError('');
    // Store the OTP and advance to new-password step
    setResetOtpValue(otp);
    setView('forgot-reset');
  };

  const [resetOtpValue, setResetOtpValue] = useState('');

  const handleResendResetOtp = async () => {
    setError('');
    try {
      await TZ.storefront.auth.requestPasswordReset({ identifier: resetIdentifier });
    } catch {
      setError('Failed to resend code. Please try again.');
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setResetLoading(true);
    try {
      await TZ.storefront.auth.resetPassword({ token: resetOtpValue, newPassword });
      setSuccess('Password reset successfully!');
      setTimeout(() => {
        setView('auth');
        setSuccess('');
        setNewPassword('');
        setResetOtpValue('');
      }, 2000);
    } catch {
      setError('Invalid or expired code. Please try again.');
    } finally {
      setResetLoading(false);
    }
  };

  /* ── Reset state when switching tabs ──────────────── */

  const switchTab = (t: Tab) => {
    setTab(t);
    setError('');
    setSuccess('');
    if (t === 'register') {
      setSignupStep(0);
      setSignupDirection(1);
    }
  };

  if (!isOpen) return null;

  /* ── Render: Error Banner ─────────────────────────── */

  const errorBanner = (
    <AnimatePresence>
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -8, height: 0 }}
          animate={{ opacity: 1, y: 0, height: 'auto' }}
          exit={{ opacity: 0, y: -8, height: 0 }}
          className="mb-4"
        >
          <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-100 rounded-lg text-sm text-red-600">
            <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
            </svg>
            {error}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  const successBanner = (
    <AnimatePresence>
      {success && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className={`mb-4 p-3 ${accentLight} border border-green-100 rounded-lg text-sm text-green-700`}>
          {success}
        </motion.div>
      )}
    </AnimatePresence>
  );

  /* ── Render: Register Steps ───────────────────────── */

  const renderSignupStep = () => {
    return (
      <AnimatePresence mode="wait" custom={signupDirection}>
        {signupStep === 0 && (
          <motion.div
            key="step-phone"
            custom={signupDirection}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.2 }}
          >
            <form onSubmit={handleStartSignup} className="space-y-3">
              <Input sizing="lg"
                icon={icons.phone}
                label={`Phone Number (${phonePrefix})`}
                type="tel"
                value={regPhone}
                onChange={(e) => setRegPhone(e.target.value)}
                required
                autoFocus
              />
              <button
                type="submit"
                disabled={signupLoading}
                className="w-full py-3 rounded-xl text-sm font-bold text-white transition-all active:scale-[0.98] disabled:opacity-60 flex items-center justify-center gap-2"
                style={{ backgroundColor: accent }}
              >
                {signupLoading ? <><Spinner /> Sending code...</> : 'Continue'}
              </button>
              <p className="text-[10px] text-gray-300 text-center leading-relaxed">
                By creating an account, you agree to our Terms of Service and Privacy Policy
              </p>
            </form>
          </motion.div>
        )}

        {signupStep === 1 && (
          <motion.div
            key="step-otp"
            custom={signupDirection}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.2 }}
          >
            <div className="space-y-4">
              <p className="text-sm text-gray-500 text-center">
                Enter the {authConfig.otp_length}-digit code sent to <span className="font-semibold text-gray-900">{regPhone}</span>
              </p>
              <OtpInput
                length={authConfig.otp_length}
                onComplete={handleVerifySignupOtp}
                disabled={signupLoading}
                error={otpError}
              />
              {signupLoading && (
                <div className="flex justify-center">
                  <Spinner className="w-5 h-5 text-gray-400" />
                </div>
              )}
              <ResendTimer onResend={handleResendSignupOtp} initialSeconds={otpResendSeconds} />
              <button
                type="button"
                onClick={() => goToSignupStep(0)}
                className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600 transition-colors mx-auto"
              >
                {icons.back} Change phone number
              </button>
            </div>
          </motion.div>
        )}

        {signupStep === 2 && (
          <motion.div
            key="step-details"
            custom={signupDirection}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.2 }}
          >
            <form onSubmit={handleCompleteSignup} className="space-y-3">
              <Input sizing="lg"
                icon={icons.user}
                label="Full Name"
                type="text"
                value={regName}
                onChange={(e) => setRegName(e.target.value)}
                required
                autoFocus
              />
              <Input sizing="lg"
                icon={icons.email}
                label="Email (optional)"
                type="email"
                value={regEmail}
                onChange={(e) => setRegEmail(e.target.value)}
              />
              <Input sizing="lg"
                icon={icons.lock}
                label={`Password (min ${authConfig.password_min_length} characters)`}
                type="password"
                value={regPass}
                onChange={(e) => setRegPass(e.target.value)}
                required
                minLength={authConfig.password_min_length}
              />

              {/* Referral toggle */}
              {!showReferral && (
                <button
                  type="button"
                  onClick={() => setShowReferral(true)}
                  className="flex items-center gap-1.5 text-xs font-medium transition-colors hover:text-gray-600"
                  style={{ color: accent }}
                >
                  {icons.gift}
                  Have a referral code?
                </button>
              )}
              {showReferral && (
                <Input sizing="lg"
                  icon={icons.gift}
                  label="Referral Code"
                  type="text"
                  value={regReferral}
                  onChange={(e) => setRegReferral(e.target.value.toUpperCase())}
                  autoFocus
                />
              )}

              <button
                type="submit"
                disabled={signupLoading}
                className="w-full py-3 rounded-xl text-sm font-bold text-white transition-all active:scale-[0.98] disabled:opacity-60 flex items-center justify-center gap-2"
                style={{ backgroundColor: accent }}
              >
                {signupLoading ? <><Spinner /> Creating account...</> : 'Create Account'}
              </button>
            </form>
          </motion.div>
        )}

        {/* Email verification pending notice (only when require_email_verification is on) */}
        {signupStep === 3 && needsEmailVerification && (
          <motion.div
            key="step-email-verify"
            custom={signupDirection}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.2 }}
            className="flex flex-col items-center py-6"
          >
            <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-4 ${accentLight}`}>
              {icons.email}
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Verify your email</h3>
            <p className="text-sm text-gray-500 text-center mb-5 leading-relaxed">
              We&apos;ve sent a verification link to <span className="font-semibold text-gray-900">{regEmail}</span>. Please check your inbox to verify your email address.
            </p>
            <button
              type="button"
              onClick={handleEmailVerificationContinue}
              className="w-full py-3 rounded-xl text-sm font-bold text-white transition-all active:scale-[0.98]"
              style={{ backgroundColor: accent }}
            >
              Continue
            </button>
          </motion.div>
        )}

        {signupStep === successStep && (
          <motion.div
            key="step-success"
            custom={signupDirection}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.2 }}
            className="flex flex-col items-center py-8"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.1 }}
              className="w-16 h-16 rounded-full flex items-center justify-center mb-4 text-white"
              style={{ backgroundColor: accent }}
            >
              {icons.check}
            </motion.div>
            <motion.h3
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-lg font-bold text-gray-900"
            >
              Welcome, {regName}!
            </motion.h3>
          </motion.div>
        )}
      </AnimatePresence>
    );
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[90]">
        <motion.div
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        />

        <motion.div
          className="absolute bottom-0 left-0 right-0 max-h-[90dvh] overflow-y-auto md:bottom-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:max-w-[400px] md:max-h-[90vh] md:rounded-2xl bg-white rounded-t-2xl shadow-2xl"
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        >
          {/* Drag handle (mobile) */}
          <div className="flex justify-center py-3 md:hidden">
            <div className="w-10 h-1 rounded-full bg-gray-200" />
          </div>

          <div className="px-6 pb-8 pt-2 md:pt-6">
            {view === 'auth' ? (
              <>
                {/* Header */}
                <div className="text-center mb-6">
                  <div className="w-11 h-11 rounded-xl mx-auto mb-3 flex items-center justify-center" style={{ backgroundColor: accent }}>
                    <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0" />
                    </svg>
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">
                    {tab === 'login' ? 'Welcome back' : signupStep === 0 ? 'Create account' : signupStep === 1 ? 'Verify phone' : signupStep === 2 ? 'Complete profile' : signupStep === 3 && needsEmailVerification ? 'Verify email' : 'All set!'}
                  </h2>
                  <p className="text-sm text-gray-400 mt-1">
                    {tab === 'login' ? 'Sign in to your account' : signupStep === 0 ? 'Join us for exclusive rewards' : signupStep === 1 ? 'One quick verification' : signupStep === 2 ? 'Just a few more details' : signupStep === 3 && needsEmailVerification ? 'One last step' : ''}
                  </p>
                </div>

                {/* Tabs */}
                <div className="flex gap-1 bg-gray-100 rounded-xl p-1 mb-5">
                  {(['login', 'register'] as Tab[]).map((t) => (
                    <button
                      key={t}
                      onClick={() => switchTab(t)}
                      className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${
                        tab === t ? 'bg-white shadow-sm text-gray-900' : 'text-gray-400 hover:text-gray-500'
                      }`}
                    >
                      {t === 'login' ? 'Sign In' : 'Register'}
                    </button>
                  ))}
                </div>

                {/* Step Progress (register only) */}
                {tab === 'register' && signupStep < successStep && (
                  <StepProgress current={signupStep} total={totalProgressSteps} />
                )}

                {/* Error */}
                {errorBanner}

                {tab === 'login' ? (
                  <form onSubmit={handleLogin} className="space-y-3">
                    <Input sizing="lg"
                      icon={authConfig.primary_login_id === 'phone' ? icons.phone : icons.email}
                      label={authConfig.primary_login_id === 'phone' ? 'Phone or Email' : 'Email or Phone'}
                      type="text"
                      value={loginId}
                      onChange={(e) => setLoginId(e.target.value)}
                      required
                    />
                    <Input sizing="lg"
                      icon={icons.lock}
                      label="Password"
                      type="password"
                      value={loginPass}
                      onChange={(e) => setLoginPass(e.target.value)}
                      required
                    />
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full py-3 rounded-xl text-sm font-bold text-white transition-all active:scale-[0.98] disabled:opacity-60 flex items-center justify-center gap-2"
                      style={{ backgroundColor: accent }}
                    >
                      {isLoading ? <><Spinner /> Signing in...</> : 'Sign In'}
                    </button>
                    <button
                      type="button"
                      onClick={() => { setView('forgot'); setError(''); setResetIdentifier(loginId); }}
                      className="w-full text-center text-xs text-gray-400 hover:text-gray-600 transition-colors py-1"
                    >
                      Forgot your password?
                    </button>

                    {authConfig.allow_social_login && (
                      <div className="mt-4 space-y-2">
                        <div className="flex items-center gap-3 text-xs text-gray-300">
                          <div className="flex-1 h-px bg-gray-200" />
                          <span>or continue with</span>
                          <div className="flex-1 h-px bg-gray-200" />
                        </div>
                        <div className="flex gap-2">
                          {authConfig.google_login_enabled && (
                            <button
                              type="button"
                              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                              <svg className="w-4 h-4" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                              Google
                            </button>
                          )}
                          {authConfig.facebook_login_enabled && (
                            <button
                              type="button"
                              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="#1877F2"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                              Facebook
                            </button>
                          )}
                        </div>
                      </div>
                    )}

                    {authConfig.allow_guest_checkout && (
                      <button
                        type="button"
                        onClick={() => { onSuccess?.(); onClose(); }}
                        className="w-full mt-3 py-2.5 rounded-xl text-sm font-medium text-gray-500 border border-gray-200 hover:bg-gray-50 transition-colors"
                      >
                        Continue as Guest
                      </button>
                    )}
                  </form>
                ) : (
                  renderSignupStep()
                )}
              </>
            ) : view === 'forgot' ? (
              <>
                <button
                  onClick={() => { setView('auth'); setError(''); setSuccess(''); }}
                  className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600 mb-4 transition-colors"
                >
                  {icons.back} Back to Sign In
                </button>

                <div className="mb-5">
                  <h2 className="text-xl font-bold text-gray-900">Forgot password?</h2>
                  <p className="text-sm text-gray-400 mt-1">We&apos;ll send a reset code to your email or phone</p>
                </div>

                {errorBanner}

                <form onSubmit={handleRequestReset} className="space-y-3">
                  <Input sizing="lg"
                    icon={icons.email}
                    label="Email or Phone"
                    type="text"
                    value={resetIdentifier}
                    onChange={(e) => setResetIdentifier(e.target.value)}
                    required
                  />
                  <button
                    type="submit"
                    disabled={resetLoading}
                    className="w-full py-3 rounded-xl text-sm font-bold text-white transition-all active:scale-[0.98] disabled:opacity-60 flex items-center justify-center gap-2"
                    style={{ backgroundColor: accent }}
                  >
                    {resetLoading ? <><Spinner /> Sending...</> : 'Send Reset Code'}
                  </button>
                </form>
              </>
            ) : view === 'forgot-otp' ? (
              <>
                <button
                  onClick={() => { setView('forgot'); setError(''); setSuccess(''); }}
                  className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600 mb-4 transition-colors"
                >
                  {icons.back} Back
                </button>

                <div className="mb-5">
                  <h2 className="text-xl font-bold text-gray-900">Enter reset code</h2>
                  <p className="text-sm text-gray-400 mt-1">
                    Enter the {authConfig.otp_length}-digit code sent to <span className="font-semibold text-gray-700">{resetIdentifier}</span>
                  </p>
                </div>

                {errorBanner}
                {successBanner}

                <div className="space-y-4">
                  <OtpInput
                    length={authConfig.otp_length}
                    onComplete={handleForgotOtpComplete}
                    disabled={resetLoading}
                    error={forgotOtpError}
                  />
                  <ResendTimer onResend={handleResendResetOtp} initialSeconds={otpResendSeconds} />
                </div>
              </>
            ) : (
              <>
                <button
                  onClick={() => { setView('forgot-otp'); setError(''); setSuccess(''); }}
                  className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600 mb-4 transition-colors"
                >
                  {icons.back} Back
                </button>

                <div className="mb-5">
                  <h2 className="text-xl font-bold text-gray-900">Reset password</h2>
                  <p className="text-sm text-gray-400 mt-1">Enter your new password</p>
                </div>

                {errorBanner}
                {successBanner}

                <form onSubmit={handleResetPassword} className="space-y-3">
                  <Input sizing="lg"
                    icon={icons.lock}
                    label={`New Password (min ${authConfig.password_min_length} characters)`}
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    minLength={authConfig.password_min_length}
                  />
                  <button
                    type="submit"
                    disabled={resetLoading}
                    className="w-full py-3 rounded-xl text-sm font-bold text-white transition-all active:scale-[0.98] disabled:opacity-60 flex items-center justify-center gap-2"
                    style={{ backgroundColor: accent }}
                  >
                    {resetLoading ? <><Spinner /> Resetting...</> : 'Reset Password'}
                  </button>
                </form>
              </>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
