'use client';

import { useState, useEffect, useCallback } from 'react';
import { useMode } from '@/hooks/useMode';
import { useAuthStore } from '@/store/auth';
import { TZ } from '@/lib/tz';
import { useToast } from '@/hooks/useToast';
import { getErrorMessage } from '@/lib/error-messages';
import Spinner from '@/components/ui/Spinner';
import Link from 'next/link';
import SignInCard from '@/components/ui/SignInCard';
import WaveDivider from '@/components/WaveDivider';
import { useConfig } from '@/hooks/useConfig';
import { BurgerIcon, FriesIcon, ShakeIcon, TruckIcon, SparkleIcon, SaladIcon, CartIcon, CoinIcon, GiftIcon } from '@/components/icons';
import Skeleton from '@/components/Skeleton';
import type { ReactNode } from 'react';

interface Transaction {
  id: string;
  type: string;
  coins: number;
  description: string;
  orderId: string | null;
  createdAt: string;
}

interface LoyaltyData {
  balance: number;
  totalEarned: number;
  totalRedeemed: number;
  tier: string;
  benefits: {
    multiplier: number;
    perks: string[];
  };
  transactions: Transaction[];
}

const DEFAULT_TIER_STYLES = [
  { key: 'bronze', color: '#CD7F32', bg: '#FDF4E8' },
  { key: 'silver', color: '#8B8B8B', bg: '#F5F5F5' },
  { key: 'gold', color: '#D4A017', bg: '#FFF9E6' },
];

const REWARDS_CATALOG_TEMPLATE: { id: string; name: string; configKey: string; icon: ReactNode }[] = [
  { id: 'free-fries', name: 'Free Fries Upgrade', configKey: 'free_fries', icon: <FriesIcon size={28} /> },
  { id: 'free-shake', name: 'Free Milkshake', configKey: 'free_shake', icon: <ShakeIcon size={28} /> },
  { id: 'free-burger', name: 'Free Buddy Burger', configKey: 'free_burger', icon: <BurgerIcon size={28} color="#EB7A29" /> },
  { id: 'free-delivery', name: 'Free Delivery (3x)', configKey: 'free_delivery', icon: <TruckIcon size={28} color="#6B7280" /> },
  { id: 'free-combo', name: 'Free Combo Meal', configKey: 'free_combo', icon: <SparkleIcon size={28} color="#F59E0B" /> },
  { id: 'free-smoothie', name: 'Free Smoothie Bowl', configKey: 'free_smoothie', icon: <SaladIcon size={28} /> },
];

export default function RewardsPage() {
  const { isClassic } = useMode();
  const { config } = useConfig();
  const user = useAuthStore((s) => s.user);
  const [loyalty, setLoyalty] = useState<LoyaltyData | null>(null);
  const [referral, setReferral] = useState<{ referralCode: string | null; totalReferrals: number; completedReferrals: number; coinsEarned: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [redeeming, setRedeeming] = useState<string | null>(null);
  const [codeCopied, setCodeCopied] = useState(false);
  const { toast } = useToast();
  const [redeemPopup, setRedeemPopup] = useState<{ code: string; rewardName: string } | null>(null);
  const [activeRedemptions, setActiveRedemptions] = useState<{ id: string; code: string; rewardName: string; status: string; createdAt: string }[]>([]);

  const loadLoyalty = useCallback(async () => {
    try {
      const loyaltyData = await TZ.storefront.loyalty.getAccount();
      setLoyalty(loyaltyData as any);
    } catch {
      // Guest or error
    } finally {
      setLoading(false);
    }

    // Fetch active reward redemptions
    try {
      const redeemData = await TZ.storefront.loyalty.getRedemptions();
      const redemptions = Array.isArray(redeemData) ? redeemData : (redeemData as any)?.redemptions ?? [];
      setActiveRedemptions(redemptions.filter((r: any) => r.status === 'pending') as any);
    } catch {
      // Not critical
    }

    // Referral fetch is independent — a 403 (disabled) must not break loyalty display
    if (config.features.referral_enabled) {
      try {
        const referralData = await TZ.storefront.referrals.getMyCode();
        setReferral(referralData as any);
      } catch {
        // Referral disabled or error
      }
    }
  }, [config.features.referral_enabled]);

  useEffect(() => {
    loadLoyalty();
  }, [user, loadLoyalty]);

  if (!config.loyalty.enabled) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8 text-center">
        <div>
          <BurgerIcon size={52} color={isClassic ? '#9A1E29' : '#4AA056'} className="mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-800 mb-2">Rewards Coming Soon</h2>
          <p className="text-sm text-gray-500">Our loyalty program is not available right now. Check back soon!</p>
          <Link href="/" className="mt-6 inline-block px-6 py-2.5 rounded-md lg:rounded-xl text-sm font-bold text-white" style={{ backgroundColor: isClassic ? '#9A1E29' : '#4AA056' }}>Back to Home</Link>
        </div>
      </div>
    );
  }

  const accent = isClassic ? '#9A1E29' : '#4AA056';
  const heroEdge = isClassic ? '#7A1722' : '#3D8A48';
  const light = isClassic ? '#FFF9F0' : '#F5FBF7';

  const handleCopyCode = () => {
    if (!referral?.referralCode) return;
    navigator.clipboard.writeText(referral.referralCode);
    setCodeCopied(true);
    setTimeout(() => setCodeCopied(false), 2000);
  };

  const handleShareCode = () => {
    if (!referral?.referralCode) return;
    if (navigator.share) {
      navigator.share({
        title: 'Burger Empire — Join & Earn Coins!',
        text: `Use my referral code ${referral.referralCode} when you sign up at Burger Empire and get bonus coins on your first order!`,
      }).catch(() => handleCopyCode());
    } else {
      handleCopyCode();
    }
  };

  const handleRedeem = async (rewardId: string, _coins: number, name: string) => {
    if (redeeming) return;
    setRedeeming(rewardId);
    try {
      const res = await TZ.storefront.loyalty.redeem({ rewardId } as any);
      setRedeemPopup({ code: (res as any).code, rewardName: name });
      await loadLoyalty();
    } catch (err) {
      toast.error('Failed to redeem', { description: getErrorMessage(err) });
    } finally {
      setRedeeming(null);
    }
  };

  if (!user || user.isGuest) {
    return (
      <SignInCard
        variant="page"
        icon={<BurgerIcon size={60} color={accent} className="mx-auto" />}
        title="Join Burger Empire Rewards"
        description={`Sign in to earn ${config.loyalty.point_name_plural} on every order, unlock rewards, and level up your tier.`}
        buttonLabel="Sign In to Start Earning"
        accentColor={accent}
        backgroundColor={light}
        className="has-pattern"
      />
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen has-pattern" style={{ backgroundColor: light }}>
        {/* Hero (same as loaded) */}
        <section
          className="py-12 px-5"
          style={{
            background: isClassic
              ? 'linear-gradient(135deg, #9A1E29, #7A1722)'
              : 'linear-gradient(135deg, #4AA056, #3D8A48)',
          }}
        >
          <div className="max-w-[800px] mx-auto text-center">
            <BurgerIcon size={48} color={isClassic ? '#EB7A29' : '#81C784'} className="mx-auto block mb-3" />
            <h1
              className="text-3xl md:text-4xl font-black text-white mb-2"
              style={{ fontFamily: "var(--font-poppins)" }}
            >
              Burger Empire Rewards
            </h1>
            <p className="text-sm text-white/60">Earn {config.loyalty.point_name_plural}, redeem rewards, level up your tier</p>
          </div>
        </section>
        <WaveDivider variant="curve" topColor={heroEdge} bottomColor={light} />

        {/* Skeleton content */}
        <div className="max-w-[800px] mx-auto px-5 -mt-2 space-y-6">
          {/* Balance card */}
          <div className="bg-white rounded-xl lg:rounded-2xl border border-gray-100 p-6">
            <div className="flex flex-col md:flex-row md:items-center gap-6">
              <div className="flex-1 space-y-3">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-10 w-40" />
                <div className="flex gap-4">
                  <Skeleton className="h-3 w-24" />
                  <Skeleton className="h-3 w-28" />
                </div>
              </div>
              <div className="space-y-3 flex flex-col items-center">
                <Skeleton className="h-8 w-28 rounded-full" />
                <Skeleton className="h-2 w-40 rounded-full" />
              </div>
            </div>
          </div>
          {/* Quick actions */}
          <div className="flex gap-3">
            <Skeleton className="flex-1 h-12 rounded-xl lg:rounded-2xl" />
            <Skeleton className="h-12 w-24 rounded-xl lg:rounded-2xl" />
          </div>
          {/* Rewards catalog */}
          <div>
            <Skeleton className="h-6 w-36 mb-4" />
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-white rounded-xl lg:rounded-2xl border border-gray-100 p-4 space-y-3">
                  <Skeleton className="h-8 w-8 mx-auto rounded-lg" />
                  <Skeleton className="h-4 w-3/4 mx-auto" />
                  <Skeleton className="h-3 w-1/2 mx-auto" />
                  <Skeleton className="h-8 w-full rounded-lg" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const tierNames = config.loyalty.tier_names || ['Bronze', 'Silver', 'Gold'];
  const TIER_STYLES = Object.fromEntries(
    DEFAULT_TIER_STYLES.map((t, i) => [t.key, { label: tierNames[i] || t.key, color: t.color, bg: t.bg, next: tierNames[i + 1] || null }])
  ) as Record<string, { label: string; color: string; bg: string; next: string | null }>;

  const tierKey = (loyalty?.tier || 'bronze') as keyof typeof TIER_STYLES;
  const tierStyle = TIER_STYLES[tierKey] || TIER_STYLES.bronze;
  const nextAt = tierKey === 'bronze' ? config.loyalty.tier_silver_threshold
    : tierKey === 'silver' ? config.loyalty.tier_gold_threshold
    : null;
  const progress = nextAt ? Math.min(((loyalty?.totalEarned || 0) / nextAt) * 100, 100) : 100;

  return (
    <div className="min-h-screen has-pattern" style={{ backgroundColor: light }}>
      {/* Hero */}
      <section
        className="py-12 px-5"
        style={{
          background: isClassic
            ? 'linear-gradient(135deg, #9A1E29, #7A1722)'
            : 'linear-gradient(135deg, #4AA056, #3D8A48)',
        }}
      >
        <div className="max-w-[800px] mx-auto text-center">
          <BurgerIcon size={48} color={isClassic ? '#EB7A29' : '#81C784'} className="mx-auto block mb-3" />
          <h1
            className="text-3xl md:text-4xl font-black text-white mb-2"
            style={{ fontFamily: "var(--font-poppins)" }}
          >
            Burger Empire Rewards
          </h1>
          <p className="text-sm text-white/60">
            Earn {config.loyalty.point_name_plural}, redeem rewards, level up your tier
          </p>
        </div>
      </section>

      <WaveDivider variant="curve" topColor={heroEdge} bottomColor={light} />

      <div className="max-w-[800px] mx-auto px-5 -mt-2">
        {/* Balance Card */}
        <section className="bg-white rounded-xl lg:rounded-2xl border border-gray-100 p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            {/* Coin Balance */}
            <div className="flex-1 text-center md:text-left">
              <p className="text-[0.6875rem] font-bold uppercase tracking-wider text-gray-400 mb-1">Your Balance</p>
              <div className="flex items-center justify-center md:justify-start gap-2">
                <span className="text-4xl font-black" style={{ color: accent }}>
                  {loyalty?.balance || 0}
                </span>
                <span className="text-sm text-gray-400 font-medium">{config.loyalty.point_name_plural}</span>
              </div>
              <div className="flex items-center justify-center md:justify-start gap-4 mt-2 text-[0.6875rem] text-gray-400">
                <span>Earned: <strong className="text-gray-600">{loyalty?.totalEarned || 0}</strong></span>
                <span>Redeemed: <strong className="text-gray-600">{loyalty?.totalRedeemed || 0}</strong></span>
              </div>
            </div>

            {/* Tier */}
            <div className="flex-shrink-0 text-center">
              <div
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold"
                style={{ backgroundColor: tierStyle.bg, color: tierStyle.color }}
              >
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: tierStyle.color }} />
                {tierStyle.label} Tier
              </div>
              {config.loyalty.show_tier_progress && nextAt && (
                <div className="mt-3">
                  <div className="flex items-center justify-between text-[0.625rem] text-gray-400 mb-1">
                    <span>{loyalty?.totalEarned || 0} / {nextAt}</span>
                    <span>{tierStyle.next}</span>
                  </div>
                  <div className="w-40 h-1.5 rounded-full bg-gray-100 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${progress}%`, backgroundColor: tierStyle.color }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Tier Perks */}
          {loyalty?.benefits?.perks && (
            <div className="mt-5 pt-4 border-t border-gray-100">
              <p className="text-[0.625rem] font-bold uppercase tracking-wider text-gray-400 mb-2">Your Perks</p>
              <div className="flex flex-wrap gap-2">
                {loyalty.benefits.perks.map((perk) => (
                  <span key={perk} className="text-[0.6875rem] px-2.5 py-1 rounded-full border border-gray-100 text-gray-600 font-medium">
                    {perk}
                  </span>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* Quick Actions */}
        <div className="flex gap-3 mb-6">
          <Link
            href="/checkout"
            className="flex-1 py-3 rounded-xl lg:rounded-2xl text-center text-sm font-bold text-white transition-all active:scale-[0.98]"
            style={{ backgroundColor: accent }}
          >
            Order Now & Earn {config.loyalty.point_name_plural}
          </Link>
          <Link
            href="/menu"
            className="py-3 px-5 rounded-xl lg:rounded-2xl text-sm font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors text-center"
          >
            Menu
          </Link>
        </div>

        {/* Referral Section */}
        {referral && (
          <section className="mb-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4" style={{ fontFamily: "var(--font-poppins)" }}>
              Refer & Earn
            </h2>
            <div className="bg-white rounded-xl lg:rounded-2xl border border-gray-100 p-5">
              <p className="text-sm text-gray-600 mb-4">
                Share your code with friends. They get <strong style={{ color: accent }}>{config.features.referral_points} {config.loyalty.point_name_plural}</strong> on signup — you get <strong style={{ color: accent }}>{config.features.referral_points} {config.loyalty.point_name_plural}</strong> when they complete their first order.
              </p>

              {/* Code display */}
              <div className="flex items-center gap-3 mb-4">
                <div className="flex-1 flex items-center gap-3 px-4 py-3 rounded-md lg:rounded-xl bg-gray-50 border border-gray-100">
                  <span className="text-[0.6875rem] font-medium text-gray-400">Your code</span>
                  <span className="font-black tracking-widest text-gray-900" style={{ fontFamily: 'monospace', fontSize: '0.9375rem' }}>
                    {referral.referralCode ?? '—'}
                  </span>
                </div>
                <button
                  onClick={handleCopyCode}
                  disabled={!referral.referralCode}
                  className="px-4 py-3 rounded-md lg:rounded-xl text-xs font-bold border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-40"
                >
                  {codeCopied ? 'Copied!' : 'Copy'}
                </button>
                <button
                  onClick={handleShareCode}
                  disabled={!referral.referralCode}
                  className="px-4 py-3 rounded-md lg:rounded-xl text-xs font-bold text-white disabled:opacity-40 transition-all active:scale-[0.97]"
                  style={{ backgroundColor: accent }}
                >
                  Share
                </button>
              </div>

              {/* Stats */}
              <div className="flex gap-6 pt-3 border-t border-gray-100">
                <div className="text-center">
                  <p className="text-xl font-black text-gray-900">{referral.totalReferrals}</p>
                  <p className="text-[0.6875rem] text-gray-400">Friends Referred</p>
                </div>
                <div className="text-center">
                  <p className="text-xl font-black text-gray-900">{referral.completedReferrals}</p>
                  <p className="text-[0.6875rem] text-gray-400">Completed</p>
                </div>
                <div className="text-center">
                  <p className="text-xl font-black" style={{ color: accent }}>{referral.coinsEarned}</p>
                  <p className="text-[0.6875rem] text-gray-400">{config.loyalty.point_name_plural} Earned</p>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Active Reward Codes */}
        {activeRedemptions.length > 0 && (
          <section className="mb-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4" style={{ fontFamily: "var(--font-poppins)" }}>
              Your Active Codes
            </h2>
            <div className="space-y-3">
              {activeRedemptions.map((r) => (
                <div key={r.id} className="bg-white rounded-xl lg:rounded-2xl border border-gray-100 p-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-gray-900">{r.rewardName}</p>
                    <p className="text-[0.6875rem] text-gray-400 mt-0.5">
                      {new Date(r.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-black text-lg tracking-[0.2em] font-mono" style={{ color: accent }}>{r.code}</p>
                    <p className="text-[0.625rem] text-gray-400">Show at counter</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Rewards Catalog */}
        <section className="mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4" style={{ fontFamily: "var(--font-poppins)" }}>
            Rewards Catalog
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {REWARDS_CATALOG_TEMPLATE.filter((r) => config.rewards[r.configKey] > 0).map((reward) => {
              const coins = config.rewards[reward.configKey];
              const canRedeem = (loyalty?.balance || 0) >= coins;
              return (
                <div
                  key={reward.id}
                  className={`bg-white rounded-xl lg:rounded-2xl border p-4 text-center transition-all ${canRedeem ? 'border-gray-100 hover:border-gray-200' : 'border-gray-100 opacity-60'}`}
                >
                  <div className="flex justify-center mb-2">{reward.icon}</div>
                  <p className="text-[0.8125rem] font-bold text-gray-900 mb-1">{reward.name}</p>
                  <p className="text-[0.6875rem] font-bold" style={{ color: accent }}>{coins} {config.loyalty.point_name_plural}</p>
                  <button
                    disabled={!canRedeem || redeeming === reward.id}
                    onClick={() => handleRedeem(reward.id, coins, reward.name)}
                    className="mt-2 w-full py-1.5 rounded-lg text-[0.6875rem] font-bold text-white disabled:opacity-50 transition-all active:scale-[0.97] inline-flex items-center justify-center gap-1.5"
                    style={{ backgroundColor: accent }}
                  >
                    {redeeming === reward.id && <Spinner size="xs" />}
                    {redeeming === reward.id ? 'Redeeming...' : canRedeem ? 'Redeem' : `Not enough ${config.loyalty.point_name_plural}`}
                  </button>
                </div>
              );
            })}
          </div>
        </section>

        {/* Transaction History */}
        <section className="mb-12">
          <h2 className="text-lg font-bold text-gray-900 mb-4" style={{ fontFamily: "var(--font-poppins)" }}>
            Transaction History
          </h2>
          {(!loyalty?.transactions || loyalty.transactions.length === 0) ? (
            <div className="bg-white rounded-xl lg:rounded-2xl border border-gray-100 p-8 text-center">
              <p className="text-gray-600 text-sm">No transactions yet</p>
              <p className="text-gray-600 text-xs mt-1">Place your first order to start earning {config.loyalty.point_name_plural}</p>
            </div>
          ) : (
            <div className="bg-white rounded-xl lg:rounded-2xl border border-gray-100 overflow-hidden">
              {loyalty.transactions.map((tx, i) => {
                const isEarn = tx.coins > 0;
                const typeLabel = tx.type === 'earn' ? 'Earned' : tx.type === 'redeem' ? 'Redeemed' : tx.type === 'bonus' ? 'Bonus' : 'Expired';
                const date = new Date(tx.createdAt);
                return (
                  <div
                    key={tx.id}
                    className={`flex items-center justify-between px-5 py-3.5 ${i > 0 ? 'border-t border-gray-50' : ''}`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-sm"
                        style={{
                          backgroundColor: isEarn ? '#D1FAE5' : '#FEE2E2',
                          color: isEarn ? '#047857' : '#DC2626',
                        }}
                      >
                        {isEarn ? '+' : '-'}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{typeLabel}</p>
                        <p className="text-[0.6875rem] text-gray-400">{tx.description}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-sm font-bold ${isEarn ? 'text-green-600' : 'text-red-500'}`}>
                        {isEarn ? '+' : ''}{tx.coins} {config.loyalty.point_name_plural}
                      </p>
                      <p className="text-[0.625rem] text-gray-300">
                        {date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* How It Works */}
        <section className="mb-12">
          <h2 className="text-lg font-bold text-gray-900 mb-4" style={{ fontFamily: "var(--font-poppins)" }}>
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { step: '1', title: 'Order', desc: 'Place any order from the menu — classic or healthy', icon: <CartIcon size={28} color={accent} /> },
              { step: '2', title: 'Earn', desc: `Get 1 ${config.loyalty.point_name} for every ₹${config.loyalty.points_per_amount_threshold} you spend${config.loyalty.healthy_boost_multiplier > 1 ? ` (${config.loyalty.healthy_boost_multiplier}x on healthy!)` : ''}`, icon: <CoinIcon size={28} color={accent} /> },
              { step: '3', title: 'Redeem', desc: `Use your ${config.loyalty.point_name_plural} for free food, delivery & more (1 ${config.loyalty.point_name} = ₹${config.loyalty.point_value})`, icon: <GiftIcon size={28} color={accent} /> },
            ].map((item) => (
              <div key={item.step} className="bg-white rounded-xl lg:rounded-2xl border border-gray-100 p-5 text-center">
                <div className="flex justify-center mb-2">{item.icon}</div>
                <p className="text-sm font-bold text-gray-900 mb-1">{item.title}</p>
                <p className="text-xs text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>

          {/* Bonus & expiry info */}
          <div className="mt-4 flex flex-wrap gap-3">
            {config.loyalty.welcome_bonus > 0 && (
              <span className="text-xs px-3 py-1.5 rounded-full border border-gray-100 text-gray-600 font-medium bg-white">
                Get {config.loyalty.welcome_bonus} {config.loyalty.point_name_plural} on signup!
              </span>
            )}
            {config.loyalty.birthday_bonus > 0 && (
              <span className="text-xs px-3 py-1.5 rounded-full border border-gray-100 text-gray-600 font-medium bg-white">
                Get {config.loyalty.birthday_bonus} {config.loyalty.point_name_plural} on your birthday!
              </span>
            )}
            {config.loyalty.review_bonus > 0 && (
              <span className="text-xs px-3 py-1.5 rounded-full border border-gray-100 text-gray-600 font-medium bg-white">
                Get {config.loyalty.review_bonus} {config.loyalty.point_name_plural} per review
              </span>
            )}
            {config.loyalty.expiry_days > 0 && (
              <span className="text-xs px-3 py-1.5 rounded-full border border-gray-100 text-gray-400 font-medium bg-white">
                Points expire after {config.loyalty.expiry_days} days
              </span>
            )}
          </div>
        </section>
      </div>

      {/* Redemption Code Popup */}
      {redeemPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={() => setRedeemPopup(null)}>
          <div
            className="bg-white rounded-3xl max-w-sm w-full p-8 text-center relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ backgroundColor: `${accent}15` }}>
              <GiftIcon size={32} color={accent} />
            </div>
            <h3 className="text-xl font-black text-gray-900 mb-1">Reward Redeemed!</h3>
            <p className="text-sm text-gray-500 mb-6">{redeemPopup.rewardName}</p>

            <div className="rounded-xl lg:rounded-2xl py-5 px-6 mb-4" style={{ backgroundColor: `${accent}08`, border: `2px dashed ${accent}40` }}>
              <p className="text-[0.625rem] uppercase tracking-widest text-gray-400 mb-2 font-bold">Your Redemption Code</p>
              <p className="text-4xl font-black tracking-[0.3em] font-mono" style={{ color: accent }}>
                {redeemPopup.code}
              </p>
            </div>

            <p className="text-xs text-gray-400 mb-6">Show this code at the counter to claim your reward</p>

            <button
              onClick={() => setRedeemPopup(null)}
              className="w-full py-3 rounded-xl lg:rounded-2xl text-sm font-bold text-white transition-all active:scale-[0.98]"
              style={{ backgroundColor: accent }}
            >
              Got it!
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
