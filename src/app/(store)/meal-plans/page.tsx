'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useMode } from '@/hooks/useMode';
import { useAuthStore } from '@/store/auth';
import { TZ } from '@/lib/tz';
import { useToast } from '@/hooks/useToast';
import { getErrorMessage } from '@/lib/error-messages';
import Spinner from '@/components/ui/Spinner';
import PageLoader from '@/components/ui/PageLoader';
import SignInCard from '@/components/ui/SignInCard';

interface MealPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: string;
  items: string[];
}

interface Subscription {
  id: string;
  planId: string;
  planName: string;
  status: 'active' | 'paused' | 'cancelled';
  nextDelivery: string | null;
  startedAt: string;
}

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

export default function MealPlansPage() {
  const { isClassic } = useMode();
  const { user } = useAuthStore();
  const accent = isClassic ? '#9A1E29' : '#4AA056';
  const light = isClassic ? '#FFF9F0' : '#F5FBF7';

  const [plans, setPlans] = useState<MealPlan[]>([]);
  const [loadingPlans, setLoadingPlans] = useState(true);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loadingSubs, setLoadingSubs] = useState(false);
  const [subscribingId, setSubscribingId] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const { toast } = useToast();

  // Fetch meal plans
  useEffect(() => {
    async function fetchPlans() {
      setLoadingPlans(true);
      try {
        const plans = await TZ.storefront.mealPlans.list();
        setPlans(plans as any);
      } catch {
        // Silently fail
      } finally {
        setLoadingPlans(false);
      }
    }
    fetchPlans();
  }, []);

  // Fetch user subscriptions
  useEffect(() => {
    if (!user || user.isGuest) return;
    async function fetchSubs() {
      setLoadingSubs(true);
      try {
        const subs = await TZ.storefront.mealPlans.mySubscriptions();
        setSubscriptions(subs as any);
      } catch {
        // Silently fail
      } finally {
        setLoadingSubs(false);
      }
    }
    fetchSubs();
  }, [user]);

  async function handleSubscribe(planId: string) {
    setSubscribingId(planId);
    try {
      const subscription = await TZ.storefront.mealPlans.subscribe({ mealPlanId: planId });
      setSubscriptions((prev) => [...prev, subscription as any]);
      toast.success('Subscribed!', { description: 'Your meal plan is now active.' });
    } catch (err) {
      toast.error('Subscription failed', { description: getErrorMessage(err) });
    } finally {
      setSubscribingId(null);
    }
  }

  async function handleAction(subId: string, action: 'pause' | 'resume' | 'cancel' | 'skip') {
    setActionLoading(`${subId}-${action}`);
    try {
      const subscription = await TZ.storefront.mealPlans.cancelSubscription(subId);
      setSubscriptions((prev) =>
        prev.map((s) => (s.id === subId ? subscription as any : s))
      );
      const actionLabels: Record<string, string> = { pause: 'Paused', resume: 'Resumed', cancel: 'Cancelled', skip: 'Next delivery skipped' };
      toast.success(actionLabels[action] || 'Updated');
    } catch (err) {
      toast.error(`Failed to ${action}`, { description: getErrorMessage(err) });
    } finally {
      setActionLoading(null);
    }
  }

  function getStatusStyle(status: string) {
    switch (status) {
      case 'active':
        return { bg: '#F0FAF3', text: '#3D8A48' };
      case 'paused':
        return { bg: '#FFF9F0', text: '#C06820' };
      case 'cancelled':
        return { bg: '#FEF2F2', text: '#991B1B' };
      default:
        return { bg: '#F3F4F6', text: '#6B7280' };
    }
  }

  const isSubscribed = (planId: string) =>
    subscriptions.some((s) => s.planId === planId && s.status !== 'cancelled');

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
        <div className="max-w-[1200px] mx-auto">
          <h1
            className="text-3xl md:text-4xl font-black text-white mb-2"
            style={{ fontFamily: 'var(--font-hero)' }}
          >
            Meal Plans
          </h1>
          <p className="text-sm text-white/70">
            Subscribe to your favourite meals and save. Fresh food, delivered on schedule.
          </p>
        </div>
      </section>

      <section className="max-w-[1200px] mx-auto px-5 py-10">
        {/* Plans Grid */}
        {loadingPlans ? (
          <PageLoader text="Loading meal plans..." />
        ) : plans.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">No meal plans available right now.</p>
            <p className="text-gray-400 text-sm mt-1">Check back soon for exciting plans!</p>
          </div>
        ) : (
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-10"
          >
            {plans.map((plan) => {
              const subscribed = isSubscribed(plan.id);
              return (
                <motion.div
                  key={plan.id}
                  variants={fadeUp}
                  className="bg-white rounded-xl lg:rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col"
                >
                  <h3 className="text-lg font-bold text-gray-900 mb-1">{plan.name}</h3>
                  <p className="text-sm text-gray-500 mb-4 flex-grow">{plan.description}</p>

                  <div className="mb-4">
                    <span className="text-2xl font-black" style={{ color: accent }}>
                      ₹{plan.price.toLocaleString('en-IN')}
                    </span>
                    <span className="text-sm text-gray-400 ml-1">/ {plan.duration}</span>
                  </div>

                  {plan.items.length > 0 && (
                    <div className="mb-5">
                      <p className="text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wider">
                        Includes
                      </p>
                      <ul className="space-y-1.5">
                        {plan.items.map((item, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                            <span
                              className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0"
                              style={{ backgroundColor: accent }}
                            />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <button
                    onClick={() => handleSubscribe(plan.id)}
                    disabled={subscribingId === plan.id || subscribed}
                    className="w-full py-3 rounded-md lg:rounded-xl text-sm font-bold transition-all duration-200 hover:opacity-90 disabled:opacity-50 inline-flex items-center justify-center gap-2"
                    style={{
                      backgroundColor: subscribed ? '#E5E7EB' : accent,
                      color: subscribed ? '#9CA3AF' : '#FFFFFF',
                    }}
                  >
                    {subscribingId === plan.id && <Spinner />}
                    {subscribingId === plan.id
                      ? 'Subscribing...'
                      : subscribed
                      ? 'Already Subscribed'
                      : 'Subscribe'}
                  </button>
                </motion.div>
              );
            })}
          </motion.div>
        )}

        {/* My Subscriptions */}
        {(!user || user.isGuest) ? (
          <SignInCard
            title="Sign in to manage subscriptions"
            description="View and manage your active meal plan subscriptions"
            accentColor={accent}
            icon={
              <svg className="w-12 h-12 mx-auto text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182M21.015 4.356v4.992" />
              </svg>
            }
          />
        ) : (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="bg-white rounded-xl lg:rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8"
          >
            <h2 className="text-lg font-bold text-gray-900 mb-5">My Subscriptions</h2>

            {loadingSubs ? (
              <PageLoader size="sm" text="Loading..." />
            ) : subscriptions.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-6">
                You don&apos;t have any subscriptions yet.
              </p>
            ) : (
              <div className="space-y-4">
                {subscriptions.map((sub) => {
                  const statusStyle = getStatusStyle(sub.status);
                  return (
                    <div
                      key={sub.id}
                      className="p-5 rounded-md lg:rounded-xl border border-gray-100 bg-gray-50"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="text-sm font-bold text-gray-900">{sub.planName}</h3>
                          <p className="text-xs text-gray-500 mt-0.5">
                            Started{' '}
                            {new Date(sub.startedAt).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            })}
                          </p>
                        </div>
                        <span
                          className="text-[0.6875rem] font-bold px-3 py-1 rounded-full capitalize"
                          style={{ backgroundColor: statusStyle.bg, color: statusStyle.text }}
                        >
                          {sub.status}
                        </span>
                      </div>

                      {sub.nextDelivery && sub.status === 'active' && (
                        <p className="text-xs text-gray-500 mb-3">
                          Next delivery:{' '}
                          <span className="font-semibold text-gray-700">
                            {new Date(sub.nextDelivery).toLocaleDateString('en-IN', {
                              weekday: 'short',
                              day: 'numeric',
                              month: 'short',
                            })}
                          </span>
                        </p>
                      )}

                      {sub.status !== 'cancelled' && (
                        <div className="flex flex-wrap gap-2">
                          {sub.status === 'active' && (
                            <>
                              <button
                                onClick={() => handleAction(sub.id, 'pause')}
                                disabled={actionLoading === `${sub.id}-pause`}
                                className="px-4 py-2 rounded-lg text-xs font-bold border border-gray-200 text-gray-600 hover:bg-gray-100 transition-colors disabled:opacity-50 inline-flex items-center gap-1.5"
                              >
                                {actionLoading === `${sub.id}-pause` && <Spinner size="xs" />}
                                {actionLoading === `${sub.id}-pause` ? 'Pausing...' : 'Pause'}
                              </button>
                              <button
                                onClick={() => handleAction(sub.id, 'skip')}
                                disabled={actionLoading === `${sub.id}-skip`}
                                className="px-4 py-2 rounded-lg text-xs font-bold border border-gray-200 text-gray-600 hover:bg-gray-100 transition-colors disabled:opacity-50 inline-flex items-center gap-1.5"
                              >
                                {actionLoading === `${sub.id}-skip` && <Spinner size="xs" />}
                                {actionLoading === `${sub.id}-skip`
                                  ? 'Skipping...'
                                  : 'Skip Next'}
                              </button>
                            </>
                          )}
                          {sub.status === 'paused' && (
                            <button
                              onClick={() => handleAction(sub.id, 'resume')}
                              disabled={actionLoading === `${sub.id}-resume`}
                              className="px-4 py-2 rounded-lg text-xs font-bold text-white transition-colors disabled:opacity-50 inline-flex items-center gap-1.5"
                              style={{ backgroundColor: accent }}
                            >
                              {actionLoading === `${sub.id}-resume` && <Spinner size="xs" />}
                              {actionLoading === `${sub.id}-resume`
                                ? 'Resuming...'
                                : 'Resume'}
                            </button>
                          )}
                          <button
                            onClick={() => handleAction(sub.id, 'cancel')}
                            disabled={actionLoading === `${sub.id}-cancel`}
                            className="px-4 py-2 rounded-lg text-xs font-bold border border-red-200 text-red-500 hover:bg-red-50 transition-colors disabled:opacity-50 inline-flex items-center gap-1.5"
                          >
                            {actionLoading === `${sub.id}-cancel` && <Spinner size="xs" />}
                            {actionLoading === `${sub.id}-cancel`
                              ? 'Cancelling...'
                              : 'Cancel'}
                          </button>
                        </div>
                      )}
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
