'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useMode } from '@/hooks/useMode';
import { useConfig } from '@/hooks/useConfig';
import { TZ } from '@/lib/tz';
import { useToast } from '@/hooks/useToast';
import { getErrorMessage } from '@/lib/error-messages';
import Spinner from '@/components/ui/Spinner';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';

const DENOMINATIONS = [250, 500, 1000];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
};

export default function GiftCardsPage() {
  const { isClassic } = useMode();
  const { config } = useConfig();

  // All hooks must be called before any early return
  const [selectedAmount, setSelectedAmount] = useState<number>(500);
  const [customAmount, setCustomAmount] = useState('');
  const [useCustom, setUseCustom] = useState(false);
  const [recipientName, setRecipientName] = useState('');
  const [recipientEmail, setRecipientEmail] = useState('');
  const [recipientPhone, setRecipientPhone] = useState('');
  const [message, setMessage] = useState('');
  const [purchasing, setPurchasing] = useState(false);
  const [purchaseSuccess, setPurchaseSuccess] = useState(false);
  const [purchaseError, setPurchaseError] = useState('');
  const [balanceCode, setBalanceCode] = useState('');
  const [balance, setBalance] = useState<number | null>(null);
  const [checkingBalance, setCheckingBalance] = useState(false);
  const [balanceError, setBalanceError] = useState('');

  const { toast } = useToast();
  const accent = isClassic ? '#9A1E29' : '#4AA056';
  const light = isClassic ? '#FFF9F0' : '#F5FBF7';
  const accentLight = isClassic ? 'rgba(154,30,41,0.08)' : 'rgba(74,160,86,0.08)';
  const finalAmount = useCustom ? Number(customAmount) : selectedAmount;

  if (!config.features.gift_cards_enabled) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-5 text-center">
        <div className="text-4xl mb-4">🎁</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2" style={{ fontFamily: 'var(--font-poppins)' }}>
          Gift Cards Coming Soon
        </h1>
        <p className="text-sm text-gray-500 mb-6 max-w-sm">
          We&apos;re working on something special. Gift cards will be available soon!
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

  async function handlePurchase(e: React.FormEvent) {
    e.preventDefault();
    if (!finalAmount || finalAmount < 100) {
      setPurchaseError('Minimum gift card amount is ₹100');
      return;
    }
    setPurchasing(true);
    setPurchaseError('');
    setPurchaseSuccess(false);

    try {
      await TZ.storefront.giftCards.purchase({
        amount: finalAmount,
        recipientEmail,
        recipientPhone,
        message,
      });
      setPurchaseSuccess(true);
      setRecipientName('');
      setRecipientEmail('');
      setRecipientPhone('');
      setMessage('');
      toast.success('Gift card purchased!', { description: 'The recipient will receive it via email.' });
    } catch (err: any) {
      const msg = getErrorMessage(err);
      setPurchaseError(msg);
      toast.error('Purchase failed', { description: msg });
    } finally {
      setPurchasing(false);
    }
  }

  async function handleCheckBalance() {
    if (!balanceCode.trim()) return;
    setCheckingBalance(true);
    setBalanceError('');
    setBalance(null);

    try {
      const data = await TZ.storefront.giftCards.checkBalance(balanceCode);
      setBalance(data.balance);
    } catch (err: any) {
      setBalanceError(getErrorMessage(err));
    } finally {
      setCheckingBalance(false);
    }
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: light }}>
      {/* Hero */}
      <section
        className="py-16 px-5"
        style={{
          background: isClassic
            ? 'linear-gradient(135deg, #9A1E29, #7A1722)'
            : 'linear-gradient(135deg, #4AA056, #3D8A48)',
        }}
      >
        <div className="max-w-[800px] mx-auto text-center">
          <motion.div initial="hidden" animate="visible" variants={fadeUp}>
            <div className="text-5xl mb-4">🎁</div>
            <h1
              className="text-3xl md:text-5xl font-black text-white mb-3"
              style={{ fontFamily: 'var(--font-hero)' }}
            >
              Give the Gift of Good Food
            </h1>
            <p className="text-base text-white/70 max-w-md mx-auto">
              Share the love with a Burger Empire gift card. Perfect for birthdays,
              celebrations, or just because.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Purchase Section */}
      <section className="max-w-[700px] mx-auto px-5 -mt-8 relative z-10">
        <motion.form
          onSubmit={handlePurchase}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="bg-white rounded-md lg:rounded-xl lg:rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8"
        >
          <h2 className="text-xl font-bold text-gray-900 mb-6">Purchase a Gift Card</h2>

          {/* Denomination selector */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Select Amount
            </label>
            <div className="flex flex-wrap gap-3 mb-3">
              {DENOMINATIONS.map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => {
                    setSelectedAmount(amt);
                    setUseCustom(false);
                  }}
                  className="px-5 py-3 rounded-md lg:rounded-xl text-sm font-bold border-2 transition-all duration-200"
                  style={{
                    borderColor: !useCustom && selectedAmount === amt ? accent : '#E5E7EB',
                    backgroundColor: !useCustom && selectedAmount === amt ? accentLight : '#FFFFFF',
                    color: !useCustom && selectedAmount === amt ? accent : '#6B7280',
                  }}
                >
                  ₹{amt}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setUseCustom(true)}
                className="px-5 py-3 rounded-md lg:rounded-xl text-sm font-bold border-2 transition-all duration-200"
                style={{
                  borderColor: useCustom ? accent : '#E5E7EB',
                  backgroundColor: useCustom ? accentLight : '#FFFFFF',
                  color: useCustom ? accent : '#6B7280',
                }}
              >
                Custom
              </button>
            </div>
            {useCustom && (
              <Input
                prefix="₹"
                type="number"
                min="100"
                max="10000"
                value={customAmount}
                onChange={(e) => setCustomAmount(e.target.value)}
                placeholder="Enter amount (min ₹100)"
              />
            )}
          </div>

          {/* Recipient form */}
          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Recipient Name
              </label>
              <Input
                type="text"
                required
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
                placeholder="Who is this for?"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Email
                </label>
                <Input
                  type="email"
                  required
                  value={recipientEmail}
                  onChange={(e) => setRecipientEmail(e.target.value)}
                  placeholder="recipient@email.com"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Phone
                </label>
                <Input
                  type="tel"
                  value={recipientPhone}
                  onChange={(e) => setRecipientPhone(e.target.value)}
                  placeholder="+91 90000 00000"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Personal Message <span className="text-gray-400 font-normal">(optional)</span>
              </label>
              <Textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={3}
                maxLength={200}
                placeholder="Add a personal note..."
                showCount
              />
            </div>
          </div>

          {purchaseError && (
            <div className="mb-4 px-4 py-3 rounded-md lg:rounded-xl bg-red-50 text-red-600 text-sm">
              {purchaseError}
            </div>
          )}
          {purchaseSuccess && (
            <div className="mb-4 px-4 py-3 rounded-md lg:rounded-xl bg-green-50 text-green-700 text-sm">
              Gift card purchased successfully! The recipient will receive it via email shortly.
            </div>
          )}

          <button
            type="submit"
            disabled={purchasing}
            className="w-full py-3.5 rounded-md lg:rounded-xl text-sm font-bold text-white transition-all duration-200 hover:opacity-90 disabled:opacity-50 inline-flex items-center justify-center gap-2"
            style={{ backgroundColor: accent }}
          >
            {purchasing && <Spinner />}
            {purchasing
              ? 'Processing...'
              : `Purchase Gift Card — ₹${finalAmount || 0}`}
          </button>
        </motion.form>

        {/* Check Balance */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="bg-white rounded-md lg:rounded-xl lg:rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 mt-6"
        >
          <h2 className="text-xl font-bold text-gray-900 mb-2">Check Balance</h2>
          <p className="text-sm text-gray-500 mb-5">
            Enter your gift card code to check the remaining balance.
          </p>

          <div className="flex gap-3">
            <Input
              type="text"
              value={balanceCode}
              onChange={(e) => setBalanceCode(e.target.value.toUpperCase())}
              placeholder="e.g. BB-XXXX-XXXX"
              className="font-mono tracking-wider"
            />
            <button
              type="button"
              onClick={handleCheckBalance}
              disabled={checkingBalance || !balanceCode.trim()}
              className="px-6 py-3 rounded-md lg:rounded-xl text-sm font-bold border-2 transition-all duration-200 disabled:opacity-50 inline-flex items-center gap-1.5"
              style={{ borderColor: accent, color: accent }}
            >
              {checkingBalance && <Spinner size="xs" />}
              {checkingBalance ? 'Checking...' : 'Check'}
            </button>
          </div>

          {balanceError && (
            <div className="mt-4 px-4 py-3 rounded-md lg:rounded-xl bg-red-50 text-red-600 text-sm">
              {balanceError}
            </div>
          )}
          {balance !== null && (
            <div
              className="mt-4 px-5 py-4 rounded-md lg:rounded-xl text-center"
              style={{ backgroundColor: accentLight }}
            >
              <p className="text-sm text-gray-500 mb-1">Available Balance</p>
              <p className="text-3xl font-black" style={{ color: accent }}>
                ₹{balance.toLocaleString('en-IN')}
              </p>
            </div>
          )}
        </motion.div>
      </section>
    </div>
  );
}
