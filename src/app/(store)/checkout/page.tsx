'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useMode } from '@/hooks/useMode';
import { useCartStore } from '@/store/cart';
import { useAuthStore } from '@/store/auth';
import { TZ } from '@/lib/tz';
import AuthModal from '@/components/auth/AuthModal';
import SignInCard from '@/components/ui/SignInCard';
import PlacingOrderLoader from '@/components/PlacingOrderLoader';
import CartChangedPopup, { type CartChange } from '@/components/CartChangedPopup';
import Link from 'next/link';
import { useConfig } from '@/hooks/useConfig';
import { CoinIcon, LeafIcon, BanIcon, GiftIcon, UsersIcon, TruckIcon, LocationIcon, ClockIcon, ShieldIcon, LockIcon, HeartIcon, TagIcon, PencilIcon, CartIcon, CheckIcon, CreditCardIcon, WalletIcon, SparkleIcon, ChefIcon, BurgerIcon, FireIcon } from '@/components/icons';
import Skeleton from '@/components/Skeleton';
import { useToast } from '@/hooks/useToast';
import { getErrorMessage } from '@/lib/error-messages';
import Spinner from '@/components/ui/Spinner';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import AddressDrawer, { type AddressData } from '@/components/ui/AddressDrawer';

type OrderType = 'delivery' | 'pickup' | 'dine_in';

interface Address {
  id: string;
  label: string | null;
  line1: string;
  line2: string | null;
  city: string;
  pincode: string;
  isDefault: boolean;
}

interface CouponResult {
  code: string;
  name: string;
  discountType: string;
  discountValue: number;
  maxDiscount: number | null;
  calculatedDiscount: number;
}

interface LoyaltyInfo {
  balance: number;
  tier: string;
  totalEarned: number;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { isClassic } = useMode();
  const { items, clearCart } = useCartStore();
  const subtotal = useCartStore((s) => s.subtotal(isClassic ? 'classic' : 'healthy'));
  const user = useAuthStore((s) => s.user);

  const [orderType, setOrderType] = useState<OrderType>('delivery');
  const [paymentType, setPaymentType] = useState<'1' | '2'>('2');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [selectedTip, setSelectedTip] = useState<number>(0);
  const [customTip, setCustomTip] = useState('');
  const [giftWrap, setGiftWrap] = useState(false);
  const [scheduledTime, setScheduledTime] = useState('');
  const [contactlessDelivery, setContactlessDelivery] = useState(false);
  const [deliverySlot, setDeliverySlot] = useState('');
  const [onlineSubMethod, setOnlineSubMethod] = useState<'upi' | 'card' | 'netbanking' | 'emi' | ''>('');
  const [partialPayment, setPartialPayment] = useState(false);

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [addressesLoading, setAddressesLoading] = useState(true);
  const [selectedAddressId, setSelectedAddressId] = useState<string>();
  const [addressDrawerOpen, setAddressDrawerOpen] = useState(false);

  // Coupon state
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<CouponResult | null>(null);
  const [couponError, setCouponError] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);

  // Loyalty state
  const [loyalty, setLoyalty] = useState<LoyaltyInfo | null>(null);
  const [redeemCoins, setRedeemCoins] = useState(0);

  const [isPlacing, setIsPlacing] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [error, setError] = useState('');
  const [showAuth, setShowAuth] = useState(false);

  // Pre-checkout validation
  const [validationChanges, setValidationChanges] = useState<CartChange[]>([]);
  const [showCartChangedPopup, setShowCartChangedPopup] = useState(false);
  const [unavailableItemIds, setUnavailableItemIds] = useState<Set<string>>(new Set());
  const [validationPassed, setValidationPassed] = useState(false);

  // Collapsible sections for mobile
  const [showDetails, setShowDetails] = useState(!user || user.isGuest);
  const [showInstructions, setShowInstructions] = useState(false);
  const [showCoupon, setShowCoupon] = useState(false);
  const [showCoins, setShowCoins] = useState(false);

  const { config } = useConfig();
  const { toast } = useToast();
  const accent = isClassic ? '#9A1E29' : '#4AA056';
  const accentBg = isClassic ? '#FAF8F4' : '#F0FAF3';
  const mode = isClassic ? 'classic' : 'healthy';
  const baseDeliveryFee = subtotal >= config.delivery.free_above ? 0 : orderType === 'delivery' ? config.delivery.fee : 0;
  const deliveryFee = appliedCoupon?.discountType === 'freeDelivery' ? 0 : baseDeliveryFee;
  const packingCharges = config.checkout.packing_charges || 0;
  const couponDiscount = appliedCoupon?.discountType === 'freeDelivery' ? 0 : (appliedCoupon?.calculatedDiscount || 0);
  const totalDiscount = couponDiscount + redeemCoins;

  // Tax calculations
  const taxRate = config.tax?.rate || 0;
  const taxInclusive = config.tax?.inclusive ?? false;
  const taxLabel = config.tax?.label || 'Tax';
  const taxAmount = !taxInclusive && taxRate > 0 ? Math.round(subtotal * taxRate / 100) : 0;
  const serviceChargeEnabled = config.tax?.service_charge_enabled ?? false;
  const serviceChargePercent = config.tax?.service_charge_percent || 0;
  const serviceChargeAmount = serviceChargeEnabled ? Math.round(subtotal * serviceChargePercent / 100) : 0;

  // Tip
  const tipAmount = selectedTip > 0 ? selectedTip : (parseInt(customTip) || 0);

  // Gift wrap
  const giftWrapPrice = config.checkout?.gift_wrap_price || 0;
  const giftWrapCharge = giftWrap ? giftWrapPrice : 0;

  const total = Math.max(0, subtotal + deliveryFee + packingCharges + taxAmount + serviceChargeAmount + tipAmount + giftWrapCharge - totalDiscount);

  // Total items count
  const totalItemsCount = items.reduce((sum, item) => sum + item.quantity, 0);

  // Coins preview — per-item mode + tier multiplier
  const tierMultiplier = loyalty
    ? (loyalty.tier === 'gold' ? config.loyalty.tier_gold_multiplier
      : loyalty.tier === 'silver' ? config.loyalty.tier_silver_multiplier
      : 1)
    : 1;
  const coinsToEarn = config.loyalty.enabled
    ? Math.floor(
        items.reduce((sum, item) => {
          const price = item.variationPrice !== undefined ? item.variationPrice : item.mode === 'healthy' ? item.healthyPrice : item.classicPrice;
          const addonTotal = item.addons.reduce((s, a) => s + a.price * a.quantity, 0);
          const lineTotal = (price + addonTotal) * item.quantity;
          const itemBase = Math.floor(lineTotal / config.loyalty.points_per_amount);
          return sum + (item.mode === 'healthy' ? Math.floor(itemBase * config.loyalty.healthy_boost_multiplier) : itemBase);
        }, 0) * tierMultiplier
      )
    : 0;

  useEffect(() => {
    if (user) {
      setCustomerName(user.name || '');
      setCustomerPhone(user.phone || '');
      setCustomerEmail(user.email || '');
    }
  }, [user]);

  useEffect(() => {
    if (config.delivery?.contactless_default) {
      setContactlessDelivery(true);
    }
  }, [config.delivery?.contactless_default]);

  useEffect(() => {
    // Only fetch saved addresses & loyalty for logged-in (non-guest) users
    if (user && !user.isGuest) {
      // Fetch in parallel to avoid waterfall
      Promise.all([loadAddresses(), loadLoyalty()]);
    } else {
      setAddressesLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const loadAddresses = async () => {
    setAddressesLoading(true);
    try {
      const data = await TZ.storefront.addresses.list();
      setAddresses(data);
      const defaultAddr = data.find((a) => a.isDefault);
      if (defaultAddr) setSelectedAddressId(defaultAddr.id);
    } catch {
      // ignore — user may not have saved addresses yet
    } finally {
      setAddressesLoading(false);
    }
  };

  const loadLoyalty = async () => {
    if (!user || user.isGuest) return;
    try {
      const data = await TZ.storefront.loyalty.getAccount();
      setLoyalty(data as any);
    } catch {
      // ignore — guest users won't have loyalty
    }
  };

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    setCouponError('');
    setCouponLoading(true);
    try {
      const data = await TZ.storefront.coupons.validate({ code: couponCode.trim(), amount: subtotal, variantType: mode, orderType } as any);
      setAppliedCoupon(data as any);
    } catch (err) {
      const msg = getErrorMessage(err);
      setCouponError(msg);
      setAppliedCoupon(null);
    } finally {
      setCouponLoading(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
    setCouponError('');
  };

  const handleDrawerSaveAddress = async (data: AddressData) => {
    // Ensure user is authenticated (auto-guest if needed)
    if (!useAuthStore.getState().user) {
      await useAuthStore.getState().loginAsGuest();
    }
    await TZ.storefront.addresses.create({ ...data, isDefault: addresses.length === 0 } as any);
    await loadAddresses();
    toast.success('Address saved!');
  };

  /** Returns the Razorpay order ID on success, or null on failure/dismiss. */
  const initiateRazorpay = async (amount: number): Promise<string | null> => {
    try {
      const { orderId, keyId } = await TZ.storefront.payments.createOrder(amount as any) as unknown as {
        orderId: string;
        keyId: string;
      };

      return new Promise((resolve) => {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.onload = () => {
          const options = {
            key: keyId,
            amount: Math.round(amount * 100),
            currency: 'INR',
            name: 'Burger Empire',
            description: `${isClassic ? 'Classic' : 'Healthy'} Mode · ${items.length} item${items.length > 1 ? 's' : ''}`,
            image: '/brand/full-logo.png',
            order_id: orderId,
            handler: async (response: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) => {
              try {
                await TZ.storefront.payments.verify({
                  orderId,
                  razorpayPaymentId: response.razorpay_payment_id,
                  razorpaySignature: response.razorpay_signature,
                });
                resolve(orderId);
              } catch {
                setError('Payment verification failed');
                resolve(null);
              }
            },
            prefill: {
              name: customerName,
              email: customerEmail,
              contact: customerPhone,
            },
            theme: {
              color: isClassic ? '#EB7A29' : '#4AA056',
              backdrop_color: 'rgba(0, 0, 0, 0.5)',
            },
            modal: {
              ondismiss: () => resolve(null),
              confirm_close: true,
              animation: true,
            },
            notes: {
              mode,
              orderType,
            },
          };
          const rzp = new (window as any).Razorpay(options);
          rzp.open();
        };
        document.body.appendChild(script);
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Payment initiation failed';
      setError(msg);
      toast.error('Payment failed', { description: msg });
      return null;
    }
  };

  const handlePlaceOrder = async (skipValidation = false) => {
    setError('');

    if (!customerName.trim() || !customerPhone.trim()) {
      setError('Please fill in your name and phone number');
      return;
    }

    // If force_phone_for_orders is enabled, require a verified phone number
    if (config.auth?.force_phone_for_orders && (!user?.phone || user.isGuest)) {
      setError('A verified phone number is required to place orders. Please sign in with your phone number.');
      setShowAuth(true);
      return;
    }

    if (orderType === 'delivery' && !selectedAddressId) {
      setError('Please select or add a delivery address');
      return;
    }

    if (items.length === 0) {
      setError('Your cart is empty');
      return;
    }

    if (config.checkout?.min_order_amount && subtotal < config.checkout.min_order_amount) {
      setError(`Minimum order amount is ₹${config.checkout.min_order_amount}`);
      return;
    }

    if (config.orders?.max_order_amount && total > config.orders.max_order_amount) {
      setError(`Maximum order amount is ₹${config.orders.max_order_amount}`);
      return;
    }

    if (config.orders?.max_items_per_order && totalItemsCount > config.orders.max_items_per_order) {
      setError(`Maximum ${config.orders.max_items_per_order} items allowed per order`);
      return;
    }

    // COD amount bounds
    if (paymentType === '2') {
      if (config.payments?.cod_max_amount && total > config.payments.cod_max_amount) {
        setError(`Cash on Delivery is not available for orders above ₹${config.payments.cod_max_amount}. Please pay online.`);
        return;
      }
      if (config.payments?.cod_min_amount && total < config.payments.cod_min_amount) {
        setError(`Cash on Delivery requires a minimum order of ₹${config.payments.cod_min_amount}`);
        return;
      }
    }

    // Guest checkout: auth store's initialize() auto-creates a guest session if no token exists

    // Pre-checkout validation (skip on second attempt after user acknowledges)
    if (!skipValidation && !validationPassed) {
      setIsValidating(true);
      try {
        const result = await TZ.storefront.cart.validate() as unknown as { valid: boolean; changes: CartChange[]; unavailableItemIds: string[] };

        if (!result.valid) {
          setValidationChanges(result.changes);
          setUnavailableItemIds(new Set(result.unavailableItemIds));
          setShowCartChangedPopup(true);
          setIsValidating(false);
          return;
        }

        setValidationPassed(true);
      } catch (err) {
        // If validation endpoint fails, proceed anyway — server will catch real issues
        toast.error('Could not validate cart', { description: getErrorMessage(err) });
      } finally {
        setIsValidating(false);
      }
    }

    setIsPlacing(true);

    const minDelay = new Promise<void>((resolve) => setTimeout(resolve, 3000));

    try {
      // If online payment, initiate Razorpay first
      if (paymentType === '1') {
        const rzpOrderId = await initiateRazorpay(total);
        if (!rzpOrderId) {
          await minDelay;
          setIsPlacing(false);
          return;
        }
      }

      const orderData = {
        variantType: mode,
        orderType,
        paymentMethod: paymentType === '1' ? 'online' : 'cod',
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        customerEmail: customerEmail.trim() || undefined,
        addressId: selectedAddressId,
        specialInstructions: specialInstructions.trim() || undefined,
        couponCode: appliedCoupon?.code || undefined,
        loyaltyPointsToRedeem: redeemCoins > 0 ? redeemCoins : undefined,
      };

      const [result] = await Promise.all([
        TZ.storefront.orders.create(orderData as any),
        minDelay,
      ]);

      clearCart();
      router.push(`/orders/${result.id}`);
      // ↑ Keep isPlacing=true — loader stays visible during navigation.
      //   The component unmounts on page change, cleaning up the portal.
    } catch (err) {
      await minDelay;
      const msg = getErrorMessage(err);
      setError(msg);
      toast.error('Order failed', { description: msg });
      setIsPlacing(false);
    }
  };

  if (items.length === 0 && !isPlacing) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-5" style={{ backgroundColor: accentBg }}>
        <div className="w-24 h-24 rounded-full flex items-center justify-center mb-6" style={{ backgroundColor: `${accent}10` }}>
          <svg className="w-12 h-12" style={{ color: accent }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-gray-800 mb-2">Your cart is empty</h2>
        <p className="text-sm text-gray-500 mb-6">Add items from the menu to get started</p>
        <button
          onClick={() => router.push('/menu')}
          className="px-8 py-3 rounded-2xl text-sm font-bold text-white shadow-lg transition-all hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
          style={{ backgroundColor: accent }}
        >
          Browse Menu
        </button>
      </div>
    );
  }

  const percentCap = Math.floor(subtotal * config.loyalty.redemption_max_percent / 100);
  const maxRedeemable = loyalty ? Math.min(loyalty.balance, percentCap) : 0;
  const minRedeemCoins = config.loyalty.redemption_min_points;

  return (
    <div className="min-h-screen has-pattern" style={{ backgroundColor: accentBg }}>
      {/* Decorative top gradient bar */}
      <div className="h-1 w-full" style={{ background: `linear-gradient(90deg, ${accent}, ${isClassic ? '#EB7A29' : '#6DB88F'})` }} />

      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-5 lg:py-8">
        {/* Page header */}
        {/* <div className="flex items-center gap-3 mb-5 lg:mb-8">
          <button onClick={() => router.back()} className="w-9 h-9 rounded-xl bg-white border border-gray-100 flex items-center justify-center hover:bg-gray-50 transition-colors">
            <svg className="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>
          <div>
            <h1 className="text-lg lg:text-xl font-bold text-gray-900">Checkout</h1>
            <p className="text-xs text-gray-400">{totalItemsCount} {totalItemsCount === 1 ? 'item' : 'items'} in cart</p>
          </div>
        </div> */}

        {error && (
          <div className="mb-4 p-3.5 bg-red-50 border border-red-100 rounded-2xl text-sm text-red-600 flex items-center gap-2.5">
            <svg className="w-5 h-5 flex-shrink-0 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
            {error}
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-5 lg:gap-6">
          {/* Left Column */}
          <div className="flex-1 min-w-0 space-y-4">
            {/* ① Items with prices */}
            <section className="bg-white rounded-2xl p-4 lg:p-5 border border-gray-100">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-[0.8125rem] font-bold text-gray-800 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg text-[0.625rem] font-bold flex items-center justify-center text-white" style={{ backgroundColor: accent }}>
                    {items.length}
                  </span>
                  Your Order
                </h3>
                <Link href="/menu" className="text-xs font-semibold transition-colors hover:opacity-80" style={{ color: accent }}>
                  + Add more
                </Link>
              </div>
              <div className="space-y-2">
                {items.map((item) => {
                  const isUnavailable = unavailableItemIds.has(item.menuItemId);
                  const isHealthyItem = item.mode === 'healthy';
                  const itemPrice = item.variationPrice !== undefined ? item.variationPrice : isHealthyItem ? item.healthyPrice : item.classicPrice;
                  const addonTotal = item.addons.reduce((s, a) => s + a.price * a.quantity, 0);
                  const lineTotal = (itemPrice + addonTotal) * item.quantity;
                  return (
                    <div key={item.id} className={`flex items-center justify-between py-1.5 ${isUnavailable ? 'opacity-40' : ''}`}>
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className="w-5 h-5 rounded-md text-[0.625rem] font-bold flex items-center justify-center flex-shrink-0 border" style={{ borderColor: isHealthyItem ? '#4AA056' : '#E5E7EB', color: isHealthyItem ? '#4AA056' : '#6B7280', backgroundColor: isHealthyItem ? '#F0FAF3' : '#F9FAFB' }}>
                          {item.quantity}
                        </span>
                        <span className="text-[0.8125rem] truncate" style={{ color: isUnavailable ? '#EF4444' : isHealthyItem ? '#4AA056' : '#374151', textDecoration: isUnavailable ? 'line-through' : 'none' }}>
                          {isHealthyItem ? item.healthyName : item.classicName}
                          {isHealthyItem && !isUnavailable && <LeafIcon size={10} color="#4AA056" className="inline-block ml-1 align-middle" />}
                          {isUnavailable && <BanIcon size={10} color="#EF4444" className="inline-block ml-1 align-middle" />}
                          {item.addons.length > 0 && !isUnavailable && <span className="text-gray-400 text-[0.6875rem]"> +{item.addons.length} add-on{item.addons.length > 1 ? 's' : ''}</span>}
                        </span>
                      </div>
                      <span className={`text-[0.8125rem] font-semibold flex-shrink-0 ml-3 ${isUnavailable ? 'line-through text-red-300' : 'text-gray-900'}`}>₹{lineTotal}</span>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* ② Coupon + Instructions + Coins — collapsible rows */}
            <section className="bg-white rounded-2xl border border-gray-100 overflow-hidden divide-y divide-gray-100/60">
              {/* Special Instructions */}
              {config.checkout?.instructions_enabled !== false && (
                <div>
                  <button
                    onClick={() => setShowInstructions(!showInstructions)}
                    className="w-full flex items-center justify-between px-4 lg:px-5 py-3.5 text-left group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors" style={{ backgroundColor: showInstructions || specialInstructions ? accentBg : '#F3F4F6' }}>
                        <PencilIcon size={16} color={showInstructions || specialInstructions ? accent : '#9CA3AF'} />
                      </div>
                      <span className="text-[0.8125rem] font-medium text-gray-700">
                        {specialInstructions ? 'Special Instructions' : 'Add special instructions'}
                      </span>
                    </div>
                    {specialInstructions ? (
                      <span className="text-xs text-gray-400 max-w-[120px] truncate">{specialInstructions}</span>
                    ) : (
                      <svg className="w-4 h-4 text-gray-300 group-hover:text-gray-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                      </svg>
                    )}
                  </button>
                  {showInstructions && (
                    <div className="px-4 lg:px-5 pb-4">
                      <Textarea
                        placeholder="E.g. No onions, extra sauce, ring the bell..."
                        value={specialInstructions}
                        onChange={(e) => setSpecialInstructions(e.target.value)}
                        rows={2}
                        maxLength={500}
                      />
                    </div>
                  )}
                </div>
              )}

              {/* Coupon Code */}
              {config.features.coupons_enabled && config.checkout.promo_code_field && (
                <div>
                  <button
                    onClick={() => !appliedCoupon && setShowCoupon(!showCoupon)}
                    className="w-full flex items-center justify-between px-4 lg:px-5 py-3.5 text-left group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors" style={{ backgroundColor: appliedCoupon || showCoupon ? accentBg : '#F3F4F6' }}>
                        <TagIcon size={16} color={appliedCoupon || showCoupon ? accent : '#9CA3AF'} />
                      </div>
                      <span className="text-[0.8125rem] font-medium text-gray-700">
                        {appliedCoupon ? appliedCoupon.code : 'Apply coupon'}
                      </span>
                    </div>
                    {appliedCoupon ? (
                      <button onClick={handleRemoveCoupon} className="text-xs font-semibold px-2.5 py-1 rounded-lg text-red-500 bg-red-50 hover:bg-red-100 transition-colors">Remove</button>
                    ) : (
                      <svg className="w-4 h-4 text-gray-300 group-hover:text-gray-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                    )}
                  </button>
                  {appliedCoupon && (
                    <div className="px-4 lg:px-5 pb-4">
                      <div className="px-3.5 py-2.5 rounded-xl text-[0.75rem] font-medium flex items-center gap-2" style={{ backgroundColor: accentBg, color: accent }}>
                        <CheckIcon size={16} color={accent} />
                        {appliedCoupon.name} — saving ₹{appliedCoupon.calculatedDiscount}
                      </div>
                    </div>
                  )}
                  {showCoupon && !appliedCoupon && (
                    <div className="px-4 lg:px-5 pb-4">
                      <div className="flex gap-2">
                        <Input
                          placeholder="Enter code"
                          value={couponCode}
                          onChange={(e) => { setCouponCode(e.target.value.toUpperCase()); setCouponError(''); }}
                          className="flex-1 uppercase"
                          sizing='sm'
                        />
                        <button
                          onClick={handleApplyCoupon}
                          disabled={couponLoading || !couponCode.trim()}
                          className="px-5 py-2 rounded-xl text-[0.8125rem] font-bold text-white disabled:opacity-50 inline-flex items-center gap-1.5 transition-all hover:shadow-md active:scale-[0.97]"
                          style={{ backgroundColor: accent }}
                        >
                          {couponLoading && <Spinner size="xs" />}
                          Apply
                        </button>
                      </div>
                      {couponError && <p className="text-[0.6875rem] text-red-500 mt-1.5">{couponError}</p>}
                    </div>
                  )}
                </div>
              )}

              {/* Redeem Baby Coins */}
              {config.loyalty.enabled && loyalty && loyalty.balance > 0 && (
                <div>
                  <button
                    onClick={() => setShowCoins(!showCoins)}
                    className="w-full flex items-center justify-between px-4 lg:px-5 py-3.5 text-left group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors" style={{ backgroundColor: redeemCoins > 0 || showCoins ? accentBg : '#F3F4F6' }}>
                        <CoinIcon size={16} color={redeemCoins > 0 || showCoins ? accent : '#9CA3AF'} />
                      </div>
                      <span className="text-[0.8125rem] font-medium text-gray-700">
                        {redeemCoins > 0 ? `Using ${redeemCoins} coins (–₹${redeemCoins})` : `Use Baby Coins`}
                      </span>
                    </div>
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-lg" style={{ color: accent, backgroundColor: accentBg }}>{loyalty.balance} available</span>
                  </button>
                  {showCoins && (
                    <div className="px-4 lg:px-5 pb-4">
                      {maxRedeemable >= minRedeemCoins ? (
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-[0.6875rem] text-gray-500">1 coin = ₹{config.loyalty.point_value} · Min: {minRedeemCoins}</span>
                            <span className="text-[0.6875rem] text-gray-400">Max: {maxRedeemable}</span>
                          </div>
                          <div className="flex gap-2">
                            <Input
                              type="number"
                              min={minRedeemCoins}
                              max={maxRedeemable}
                              value={redeemCoins || ''}
                              onChange={(e) => {
                                const val = parseInt(e.target.value) || 0;
                                setRedeemCoins(val === 0 ? 0 : Math.min(Math.max(val, minRedeemCoins), maxRedeemable));
                              }}
                              placeholder="0"
                              className="flex-1"
                            />
                            <button
                              onClick={() => setRedeemCoins(maxRedeemable)}
                              className="px-4 py-2 rounded-xl text-[0.75rem] font-bold border-2 transition-all hover:shadow-sm active:scale-[0.97]"
                              style={{ borderColor: accent, color: accent, backgroundColor: accentBg }}
                            >
                              Use Max
                            </button>
                          </div>
                          {redeemCoins > 0 && redeemCoins < minRedeemCoins && (
                            <p className="text-[0.6875rem] mt-1.5 text-orange-500">Minimum {minRedeemCoins} coins required</p>
                          )}
                        </div>
                      ) : (
                        <p className="text-[0.6875rem] text-gray-400">Need at least {minRedeemCoins} coins to redeem</p>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Tip */}
              {config.checkout?.tip_enabled && (
                <div className="px-4 lg:px-5 py-3.5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: tipAmount > 0 ? accentBg : '#F3F4F6' }}>
                      <HeartIcon size={16} color={tipAmount > 0 ? accent : '#9CA3AF'} />
                    </div>
                    <p className="text-[0.8125rem] font-medium text-gray-700">Add a tip</p>
                  </div>
                  <div className="flex gap-2 flex-wrap ml-11">
                    {(config.checkout?.tip_presets || [10, 20, 50]).map((preset: number) => (
                      <button
                        key={preset}
                        onClick={() => { setSelectedTip(selectedTip === preset ? 0 : preset); setCustomTip(''); }}
                        className="px-4 py-2 rounded-xl text-[0.8125rem] font-semibold border-2 transition-all"
                        style={{
                          borderColor: selectedTip === preset ? accent : '#E5E7EB',
                          backgroundColor: selectedTip === preset ? accentBg : 'white',
                          color: selectedTip === preset ? accent : '#6B7280',
                        }}
                      >
                        ₹{preset}
                      </button>
                    ))}
                    <button
                      onClick={() => { setSelectedTip(selectedTip === -1 ? 0 : -1); if (selectedTip !== -1) setCustomTip(''); }}
                      className="px-4 py-2 rounded-xl text-[0.8125rem] font-semibold border-2 transition-all"
                      style={{
                        borderColor: selectedTip === -1 || (customTip && !selectedTip) ? accent : '#E5E7EB',
                        backgroundColor: selectedTip === -1 || (customTip && !selectedTip) ? accentBg : 'white',
                        color: selectedTip === -1 || (customTip && !selectedTip) ? accent : '#6B7280',
                      }}
                    >
                      Custom
                    </button>
                  </div>
                  {(selectedTip === -1 || (customTip && selectedTip === 0)) && (
                    <div className="ml-11 mt-2">
                      <Input
                        type="number"
                        placeholder="Enter amount"
                        value={customTip}
                        onChange={(e) => { setCustomTip(e.target.value); setSelectedTip(-1); }}
                        className="w-32"
                        sizing="sm"
                      />
                    </div>
                  )}
                </div>
              )}

              {/* Gift Wrap */}
              {config.checkout?.gift_wrap_enabled && (
                <div className="px-4 lg:px-5 py-3.5 flex items-center justify-between">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: giftWrap ? accentBg : '#F3F4F6' }}>
                      <GiftIcon size={16} color={giftWrap ? accent : '#9CA3AF'} />
                    </div>
                    <div className="flex items-center gap-2.5">
                      <input
                        type="checkbox"
                        checked={giftWrap}
                        onChange={(e) => setGiftWrap(e.target.checked)}
                        className="w-4 h-4 rounded"
                        style={{ accentColor: accent }}
                      />
                      <span className="text-[0.8125rem] font-medium text-gray-700">Gift wrap</span>
                    </div>
                  </label>
                  {giftWrapPrice > 0 && (
                    <span className="text-xs font-medium text-gray-400">+₹{giftWrapPrice}</span>
                  )}
                </div>
              )}

              {/* Scheduled Order — chips + custom picker */}
              {config.checkout?.scheduled_orders && (
                <div className="px-4 lg:px-5 py-3.5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: scheduledTime ? accentBg : '#F3F4F6' }}>
                      <ClockIcon size={16} color={scheduledTime ? accent : '#9CA3AF'} />
                    </div>
                    <label className="text-[0.8125rem] font-medium text-gray-700">Schedule order</label>
                  </div>
                  <div className="flex gap-2 flex-wrap ml-11">
                    <button
                      onClick={() => setScheduledTime('')}
                      className="px-4 py-2 rounded-xl text-[0.8125rem] font-semibold border-2 transition-all"
                      style={{
                        borderColor: !scheduledTime ? accent : '#E5E7EB',
                        backgroundColor: !scheduledTime ? accentBg : 'white',
                        color: !scheduledTime ? accent : '#6B7280',
                      }}
                    >
                      Now
                    </button>
                    <button
                      onClick={() => {
                        const d = new Date();
                        d.setMinutes(d.getMinutes() + 60);
                        setScheduledTime(d.toISOString().slice(0, 16));
                      }}
                      className="px-4 py-2 rounded-xl text-[0.8125rem] font-semibold border-2 transition-all"
                      style={{
                        borderColor: scheduledTime && Math.abs(new Date(scheduledTime).getTime() - Date.now() - 3600000) < 120000 ? accent : '#E5E7EB',
                        backgroundColor: scheduledTime && Math.abs(new Date(scheduledTime).getTime() - Date.now() - 3600000) < 120000 ? accentBg : 'white',
                        color: scheduledTime && Math.abs(new Date(scheduledTime).getTime() - Date.now() - 3600000) < 120000 ? accent : '#6B7280',
                      }}
                    >
                      In 1 hr
                    </button>
                    <button
                      onClick={() => {
                        const d = new Date();
                        d.setHours(d.getHours() + 2);
                        setScheduledTime(d.toISOString().slice(0, 16));
                      }}
                      className="px-4 py-2 rounded-xl text-[0.8125rem] font-semibold border-2 transition-all"
                      style={{
                        borderColor: scheduledTime && Math.abs(new Date(scheduledTime).getTime() - Date.now() - 7200000) < 120000 ? accent : '#E5E7EB',
                        backgroundColor: scheduledTime && Math.abs(new Date(scheduledTime).getTime() - Date.now() - 7200000) < 120000 ? accentBg : 'white',
                        color: scheduledTime && Math.abs(new Date(scheduledTime).getTime() - Date.now() - 7200000) < 120000 ? accent : '#6B7280',
                      }}
                    >
                      In 2 hrs
                    </button>
                    <button
                      onClick={() => {
                        // Toggle custom picker by setting a dummy value
                        if (scheduledTime === 'custom') setScheduledTime('');
                        else setScheduledTime('custom');
                      }}
                      className="px-4 py-2 rounded-xl text-[0.8125rem] font-semibold border-2 transition-all"
                      style={{
                        borderColor: scheduledTime === 'custom' || (scheduledTime && !['', 'custom'].includes(scheduledTime) && ![3600000, 7200000].some(ms => Math.abs(new Date(scheduledTime).getTime() - Date.now() - ms) < 120000)) ? accent : '#E5E7EB',
                        backgroundColor: scheduledTime === 'custom' || (scheduledTime && !['', 'custom'].includes(scheduledTime) && ![3600000, 7200000].some(ms => Math.abs(new Date(scheduledTime).getTime() - Date.now() - ms) < 120000)) ? accentBg : 'white',
                        color: scheduledTime === 'custom' || (scheduledTime && !['', 'custom'].includes(scheduledTime) && ![3600000, 7200000].some(ms => Math.abs(new Date(scheduledTime).getTime() - Date.now() - ms) < 120000)) ? accent : '#6B7280',
                      }}
                    >
                      Pick time
                    </button>
                  </div>
                  {(scheduledTime === 'custom' || (scheduledTime && !['', 'custom'].includes(scheduledTime) && ![3600000, 7200000].some(ms => Math.abs(new Date(scheduledTime).getTime() - Date.now() - ms) < 120000))) && (
                    <div className="ml-11 mt-2">
                      <Input
                        type="datetime-local"
                        value={scheduledTime === 'custom' ? '' : scheduledTime}
                        onChange={(e) => setScheduledTime(e.target.value)}
                        sizing="sm"
                      />
                    </div>
                  )}
                </div>
              )}
            </section>

            {/* ③ Billing breakdown — mobile only (desktop has it in sidebar) */}
            <section className="bg-white rounded-2xl p-4 lg:p-5 border border-gray-100 lg:hidden">
              <h3 className="text-[0.8125rem] font-bold text-gray-800 mb-3 flex items-center gap-2">
                <CreditCardIcon size={16} color={accent} />
                Bill Details
              </h3>
              <div className="space-y-1.5 text-[0.8125rem]">
                <div className="flex justify-between text-gray-500">
                  <span>Subtotal{taxInclusive && taxRate > 0 ? ` (incl. ${taxLabel})` : ''}</span>
                  <span>₹{subtotal.toFixed(0)}</span>
                </div>
                {orderType === 'delivery' && (
                  <div className="flex justify-between text-gray-500">
                    <span>Delivery</span>
                    <span>{deliveryFee === 0 ? <span className="text-green-600 font-semibold">FREE</span> : `₹${deliveryFee}`}</span>
                  </div>
                )}
                {packingCharges > 0 && (
                  <div className="flex justify-between text-gray-500">
                    <span>Packing</span>
                    <span>₹{packingCharges}</span>
                  </div>
                )}
                {taxAmount > 0 && (
                  <div className="flex justify-between text-gray-500">
                    <span>{taxLabel} ({taxRate}%)</span>
                    <span>₹{taxAmount}</span>
                  </div>
                )}
                {serviceChargeAmount > 0 && (
                  <div className="flex justify-between text-gray-500">
                    <span>Service Charge ({serviceChargePercent}%)</span>
                    <span>₹{serviceChargeAmount}</span>
                  </div>
                )}
                {tipAmount > 0 && (
                  <div className="flex justify-between text-gray-500">
                    <span>Tip</span>
                    <span>₹{tipAmount}</span>
                  </div>
                )}
                {giftWrapCharge > 0 && (
                  <div className="flex justify-between text-gray-500">
                    <span>Gift Wrap</span>
                    <span>₹{giftWrapCharge}</span>
                  </div>
                )}
                {totalDiscount > 0 && (
                  <div className="flex justify-between text-green-600 font-semibold">
                    <span>Discount</span>
                    <span>-₹{totalDiscount.toFixed(0)}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-gray-900 text-base pt-2 mt-1 border-t border-dashed border-gray-200">
                  <span>Total</span>
                  <span style={{ color: accent }}>₹{total.toFixed(0)}</span>
                </div>
              </div>
            </section>

            {/* ④ Order Type */}
            <section className="bg-white rounded-2xl p-4 lg:p-5 border border-gray-100">
              <h3 className="text-[0.8125rem] font-bold text-gray-800 mb-3 flex items-center gap-2">
                <TruckIcon size={16} color={accent} />
                Order Type
              </h3>
              <div className="grid grid-cols-3 gap-2">
                {config.delivery?.enabled !== false && (
                  <button
                    onClick={() => setOrderType('delivery')}
                    className="relative py-3 rounded-xl text-[0.8125rem] font-semibold border-2 transition-all hover:shadow-sm"
                    style={{
                      borderColor: orderType === 'delivery' ? accent : '#E5E7EB',
                      backgroundColor: orderType === 'delivery' ? accentBg : 'white',
                      color: orderType === 'delivery' ? accent : '#6B7280',
                    }}
                  >
                    {orderType === 'delivery' && (
                      <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full flex items-center justify-center text-white" style={{ backgroundColor: accent }}>
                        <CheckIcon size={12} color="white" />
                      </span>
                    )}
                    Delivery
                  </button>
                )}
                {config.delivery?.pickup_enabled && (
                  <button
                    onClick={() => setOrderType('pickup')}
                    className="relative py-3 rounded-xl text-[0.8125rem] font-semibold border-2 transition-all hover:shadow-sm"
                    style={{
                      borderColor: orderType === 'pickup' ? accent : '#E5E7EB',
                      backgroundColor: orderType === 'pickup' ? accentBg : 'white',
                      color: orderType === 'pickup' ? accent : '#6B7280',
                    }}
                  >
                    {orderType === 'pickup' && (
                      <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full flex items-center justify-center text-white" style={{ backgroundColor: accent }}>
                        <CheckIcon size={12} color="white" />
                      </span>
                    )}
                    Pickup
                  </button>
                )}
                {config.delivery?.dine_in_enabled && (
                  <button
                    onClick={() => setOrderType('dine_in')}
                    className="relative py-3 rounded-xl text-[0.8125rem] font-semibold border-2 transition-all hover:shadow-sm"
                    style={{
                      borderColor: orderType === 'dine_in' ? accent : '#E5E7EB',
                      backgroundColor: orderType === 'dine_in' ? accentBg : 'white',
                      color: orderType === 'dine_in' ? accent : '#6B7280',
                    }}
                  >
                    {orderType === 'dine_in' && (
                      <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full flex items-center justify-center text-white" style={{ backgroundColor: accent }}>
                        <CheckIcon size={12} color="white" />
                      </span>
                    )}
                    Dine In
                  </button>
                )}
              </div>
              {config.delivery?.prep_time_minutes > 0 && (
                <div className="flex items-center justify-center gap-2 mt-3 py-2 rounded-xl" style={{ backgroundColor: accentBg }}>
                  <ClockIcon size={14} color={accent} />
                  <p className="text-[0.75rem] font-medium" style={{ color: accent }}>
                    Ready in ~{config.delivery.prep_time_minutes} mins
                  </p>
                </div>
              )}
              {orderType === 'delivery' && config.delivery?.live_tracking_enabled && (
                <div className="flex items-center justify-center gap-2 mt-2">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500" />
                  </span>
                  <span className="text-[0.75rem] font-semibold text-green-600">Live tracking available</span>
                </div>
              )}
              {orderType === 'delivery' && (
                <div className="mt-3 space-y-2.5">
                  {config.delivery?.contactless_default !== undefined && (
                    <label className="flex items-center gap-2.5 cursor-pointer px-3 py-2.5 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
                      <input
                        type="checkbox"
                        checked={contactlessDelivery}
                        onChange={(e) => setContactlessDelivery(e.target.checked)}
                        className="w-4 h-4 rounded"
                        style={{ accentColor: accent }}
                      />
                      <span className="text-[0.8125rem] font-medium text-gray-700">Contactless delivery</span>
                    </label>
                  )}
                  {config.delivery?.slot_based_delivery && (
                    <div>
                      <label className="text-[0.8125rem] font-medium text-gray-700 mb-1.5 block">Delivery time slot</label>
                      <select
                        value={deliverySlot}
                        onChange={(e) => setDeliverySlot(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-[0.8125rem] text-gray-700 bg-white focus:ring-2 focus:border-transparent transition-all"
                        style={{ ['--tw-ring-color' as string]: `${accent}40` }}
                      >
                        <option value="">Select a slot</option>
                        <option value="morning">Morning (9 AM - 12 PM)</option>
                        <option value="afternoon">Afternoon (12 PM - 4 PM)</option>
                        <option value="evening">Evening (4 PM - 8 PM)</option>
                      </select>
                    </div>
                  )}
                </div>
              )}
            </section>

            {/* ⑤ Customer Details — collapsible */}
            <section className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              <button
                onClick={() => setShowDetails(!showDetails)}
                className="w-full flex items-center justify-between px-4 lg:px-5 py-3.5 text-left group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: accentBg }}>
                    <svg className="w-4.5 h-4.5" style={{ color: accent }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0" />
                    </svg>
                  </div>
                  <div className="min-w-0">
                    <p className="text-[0.8125rem] font-bold text-gray-900 truncate">
                      {customerName || 'Your Details'}
                    </p>
                    {customerPhone && !showDetails && (
                      <p className="text-xs text-gray-400 truncate">{customerPhone}{customerEmail ? ` · ${customerEmail}` : ''}</p>
                    )}
                  </div>
                </div>
                <svg className="w-4 h-4 text-gray-400 flex-shrink-0 transition-transform duration-200" style={{ transform: showDetails ? 'rotate(180deg)' : '' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {showDetails && (
                <div className="px-4 lg:px-5 pb-4 space-y-3">
                  <Input placeholder="Full Name *" value={customerName} onChange={(e) => setCustomerName(e.target.value)} required />
                  <Input type="tel" placeholder="Phone Number *" value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} required />
                  <Input type="email" placeholder="Email (optional)" value={customerEmail} onChange={(e) => setCustomerEmail(e.target.value)} />
                </div>
              )}
            </section>

            {/* ⑥ Delivery Address */}
            {orderType === 'delivery' && (
              <section className="bg-white rounded-2xl p-4 lg:p-5 border border-gray-100">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-[0.8125rem] font-bold text-gray-800 flex items-center gap-2">
                    <LocationIcon size={16} color={accent} />
                    Deliver to
                  </h3>
                  {config.delivery?.max_distance_km > 0 && (
                    <span className="text-[0.6875rem] text-gray-400 bg-gray-50 px-2.5 py-1 rounded-lg">Within {config.delivery.max_distance_km} km</span>
                  )}
                </div>
                {addressesLoading ? (
                  <div className="space-y-2.5">
                    {Array.from({ length: 2 }).map((_, i) => (
                      <div key={i} className="px-3.5 py-3 rounded-xl border border-gray-100 space-y-2">
                        <Skeleton className="h-3 w-16" />
                        <Skeleton className="h-3.5 w-full" />
                        <Skeleton className="h-3 w-2/3" />
                      </div>
                    ))}
                  </div>
                ) : (!user || user.isGuest) && addresses.length === 0 ? (
                  <SignInCard
                    title="Sign in for saved addresses"
                    description="Log in to quickly select from your saved delivery addresses"
                    buttonLabel="Sign In"
                    accentColor={accent}
                    secondaryAction={{ label: 'or add a new address', onClick: () => setAddressDrawerOpen(true) }}
                    className="border-0 p-3"
                  />
                ) : (
                  <>
                    {addresses.length > 0 && (
                      <div className="space-y-2.5 mb-3">
                        {addresses.map((addr) => (
                          <button
                            key={addr.id}
                            onClick={() => setSelectedAddressId(addr.id)}
                            className="w-full text-left px-3.5 py-3 rounded-xl border-2 transition-all relative overflow-hidden hover:shadow-sm"
                            style={{
                              borderColor: selectedAddressId === addr.id ? accent : '#E5E7EB',
                              backgroundColor: selectedAddressId === addr.id ? accentBg : 'white',
                            }}
                          >
                            {selectedAddressId === addr.id && (
                              <span className="absolute top-2 right-2 w-5 h-5 rounded-full flex items-center justify-center text-white" style={{ backgroundColor: accent }}>
                                <CheckIcon size={12} color="white" />
                              </span>
                            )}
                            {addr.label && (
                              <span className="inline-block text-[0.625rem] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md mb-1" style={{ color: accent, backgroundColor: `${accent}15` }}>
                                {addr.label}
                              </span>
                            )}
                            <p className="text-[0.8125rem] font-medium text-gray-700">{addr.line1}</p>
                            {addr.line2 && <p className="text-xs text-gray-500">{addr.line2}</p>}
                            <p className="text-xs text-gray-400">{addr.city} – {addr.pincode}</p>
                          </button>
                        ))}
                      </div>
                    )}
                    <button
                      onClick={() => setAddressDrawerOpen(true)}
                      className="w-full py-3 rounded-xl border-2 border-dashed text-[0.8125rem] font-semibold transition-all hover:border-gray-400 hover:shadow-sm"
                      style={{ borderColor: '#D1D5DB', color: accent }}
                    >
                      + Add New Address
                    </button>
                  </>
                )}
              </section>
            )}

            {/* ⑦ Payment */}
            <section className="bg-white rounded-2xl p-4 lg:p-5 border border-gray-100">
              <h3 className="text-[0.8125rem] font-bold text-gray-800 mb-3 flex items-center gap-2">
                <CreditCardIcon size={16} color={accent} />
                Payment Method
              </h3>
              {(() => {
                const codOutOfBounds = (config.payments?.cod_max_amount && total > config.payments.cod_max_amount) || (config.payments?.cod_min_amount && total < config.payments.cod_min_amount);
                const codDisabled = !config.checkout.cod_enabled || codOutOfBounds;
                return (
                  <>
                    <div className="grid grid-cols-2 gap-2.5">
                      <button
                        onClick={() => !codDisabled && setPaymentType('2')}
                        disabled={!!codDisabled}
                        className={`relative flex flex-col items-center gap-1.5 py-3.5 rounded-xl border-2 transition-all hover:shadow-sm ${codDisabled ? 'opacity-40 cursor-not-allowed' : ''}`}
                        style={{
                          borderColor: paymentType === '2' ? accent : '#E5E7EB',
                          backgroundColor: paymentType === '2' ? accentBg : 'white',
                          color: paymentType === '2' ? accent : '#6B7280',
                        }}
                      >
                        {paymentType === '2' && (
                          <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full flex items-center justify-center text-white" style={{ backgroundColor: accent }}>
                            <CheckIcon size={12} color="white" />
                          </span>
                        )}
                        <WalletIcon size={20} />
                        <span className="text-[0.8125rem] font-semibold">Cash on Delivery</span>
                      </button>
                      <button
                        onClick={() => !config.checkout.online_pay_enabled ? undefined : setPaymentType('1')}
                        disabled={!config.checkout.online_pay_enabled}
                        className={`relative flex flex-col items-center gap-1.5 py-3.5 rounded-xl border-2 transition-all hover:shadow-sm ${!config.checkout.online_pay_enabled ? 'opacity-40 cursor-not-allowed' : ''}`}
                        style={{
                          borderColor: paymentType === '1' ? accent : '#E5E7EB',
                          backgroundColor: paymentType === '1' ? accentBg : 'white',
                          color: paymentType === '1' ? accent : '#6B7280',
                        }}
                      >
                        {paymentType === '1' && (
                          <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full flex items-center justify-center text-white" style={{ backgroundColor: accent }}>
                            <CheckIcon size={12} color="white" />
                          </span>
                        )}
                        <CreditCardIcon size={20} />
                        <span className="text-[0.8125rem] font-semibold">Pay Online</span>
                      </button>
                    </div>
                    {config.payments?.wallet_enabled && (
                      <button
                        onClick={() => setPaymentType('1')}
                        className="w-full mt-2.5 flex items-center justify-center gap-2 py-2.5 rounded-xl text-[0.8125rem] font-semibold border-2 transition-all"
                        style={{ borderColor: '#E5E7EB', backgroundColor: 'white', color: '#6B7280' }}
                      >
                        <WalletIcon size={16} color="#6B7280" />
                        Wallet
                      </button>
                    )}

                    {/* Online payment sub-options */}
                    {paymentType === '1' && (config.payments?.upi_enabled || config.payments?.card_enabled || config.payments?.netbanking_enabled || config.payments?.emi_enabled) && (
                      <div className="mt-3 p-3 rounded-xl" style={{ backgroundColor: accentBg }}>
                        <p className="text-[0.6875rem] font-medium text-gray-500 mb-2">Pay via</p>
                        <div className="flex gap-2 flex-wrap">
                          {config.payments?.upi_enabled && (
                            <button
                              onClick={() => setOnlineSubMethod(onlineSubMethod === 'upi' ? '' : 'upi')}
                              className="px-3.5 py-2 rounded-xl text-[0.75rem] font-semibold border-2 transition-all bg-white hover:shadow-sm"
                              style={{
                                borderColor: onlineSubMethod === 'upi' ? accent : '#E5E7EB',
                                color: onlineSubMethod === 'upi' ? accent : '#6B7280',
                              }}
                            >
                              UPI
                            </button>
                          )}
                          {config.payments?.card_enabled && (
                            <button
                              onClick={() => setOnlineSubMethod(onlineSubMethod === 'card' ? '' : 'card')}
                              className="px-3.5 py-2 rounded-xl text-[0.75rem] font-semibold border-2 transition-all bg-white hover:shadow-sm"
                              style={{
                                borderColor: onlineSubMethod === 'card' ? accent : '#E5E7EB',
                                color: onlineSubMethod === 'card' ? accent : '#6B7280',
                              }}
                            >
                              Card
                            </button>
                          )}
                          {config.payments?.netbanking_enabled && (
                            <button
                              onClick={() => setOnlineSubMethod(onlineSubMethod === 'netbanking' ? '' : 'netbanking')}
                              className="px-3.5 py-2 rounded-xl text-[0.75rem] font-semibold border-2 transition-all bg-white hover:shadow-sm"
                              style={{
                                borderColor: onlineSubMethod === 'netbanking' ? accent : '#E5E7EB',
                                color: onlineSubMethod === 'netbanking' ? accent : '#6B7280',
                              }}
                            >
                              Netbanking
                            </button>
                          )}
                          {config.payments?.emi_enabled && (
                            <button
                              onClick={() => setOnlineSubMethod(onlineSubMethod === 'emi' ? '' : 'emi')}
                              className="px-3.5 py-2 rounded-xl text-[0.75rem] font-semibold border-2 transition-all bg-white hover:shadow-sm"
                              style={{
                                borderColor: onlineSubMethod === 'emi' ? accent : '#E5E7EB',
                                color: onlineSubMethod === 'emi' ? accent : '#6B7280',
                              }}
                            >
                              EMI
                            </button>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Partial payment option */}
                    {config.payments?.partial_payment && (
                      <label className="flex items-center gap-2.5 mt-3 cursor-pointer px-3 py-2.5 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
                        <input
                          type="checkbox"
                          checked={partialPayment}
                          onChange={(e) => setPartialPayment(e.target.checked)}
                          className="w-4 h-4 rounded"
                          style={{ accentColor: accent }}
                        />
                        <span className="text-[0.8125rem] font-medium text-gray-700">
                          Pay partially (min {config.payments?.partial_min_percent || 50}% now)
                        </span>
                      </label>
                    )}

                    {/* Wallet top-up */}
                    {config.payments?.wallet_enabled && config.payments?.wallet_topup_enabled && (
                      <div className="mt-2.5">
                        <button
                          className="text-[0.75rem] font-semibold underline hover:no-underline transition-all"
                          style={{ color: accent }}
                          onClick={() => toast.info('Wallet top-up coming soon!')}
                        >
                          Top up wallet
                        </button>
                      </div>
                    )}

                    {codOutOfBounds && config.checkout.cod_enabled && (
                      <p className="text-[0.6875rem] text-orange-500 mt-2 px-3 py-2 bg-orange-50 rounded-xl">
                        COD available for orders between {config.payments?.cod_min_amount ? `₹${config.payments.cod_min_amount}` : '₹0'} – {config.payments?.cod_max_amount ? `₹${config.payments.cod_max_amount}` : ''}
                      </p>
                    )}
                    {config.payments?.online_discount > 0 && paymentType !== '1' && (
                      <p className="text-[0.75rem] font-semibold mt-2.5 px-3 py-2 rounded-xl flex items-center gap-2" style={{ color: accent, backgroundColor: accentBg }}>
                        <SparkleIcon size={16} color={accent} />
                        Save ₹{config.payments.online_discount} by paying online
                      </p>
                    )}
                  </>
                );
              })()}
            </section>
          </div>

          {/* Right Column: desktop sticky sidebar */}
          <div className="lg:w-[420px] flex-shrink-0 hidden lg:block">
            <div className="lg:sticky lg:top-20 lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto lg:scrollbar-hide space-y-4">
              {/* Desktop Order Summary */}
              <section className="bg-white rounded-2xl p-5 border border-gray-100">
                <h3 className="text-[0.8125rem] font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <CartIcon size={16} color={accent} />
                  Order Summary
                </h3>
                <div className="space-y-2.5">
                  {items.map((item) => {
                    const isUnavailable = unavailableItemIds.has(item.menuItemId);
                    const isHealthyItem = item.mode === 'healthy';
                    const itemPrice = item.variationPrice !== undefined ? item.variationPrice : isHealthyItem ? item.healthyPrice : item.classicPrice;
                    const addonTotal = item.addons.reduce((s, a) => s + a.price * a.quantity, 0);
                    const lineTotal = (itemPrice + addonTotal) * item.quantity;
                    return (
                      <div key={item.id} className={`flex items-center justify-between ${isUnavailable ? 'opacity-40' : ''}`}>
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span className="w-5 h-5 rounded-md text-[0.625rem] font-bold flex items-center justify-center flex-shrink-0 border" style={{ borderColor: isHealthyItem ? '#4AA056' : '#E5E7EB', color: isHealthyItem ? '#4AA056' : '#6B7280', backgroundColor: isHealthyItem ? '#F0FAF3' : '#F9FAFB' }}>
                            {item.quantity}
                          </span>
                          <span className="text-[0.8125rem] truncate" style={{ color: isUnavailable ? '#EF4444' : isHealthyItem ? '#4AA056' : '#374151', textDecoration: isUnavailable ? 'line-through' : 'none' }}>
                            {isHealthyItem ? item.healthyName : item.classicName}
                            {isHealthyItem && !isUnavailable && <LeafIcon size={10} color="#4AA056" className="inline-block ml-1 align-middle" />}
                            {isUnavailable && <BanIcon size={10} color="#EF4444" className="inline-block ml-1 align-middle" />}
                            {item.addons.length > 0 && !isUnavailable && <span className="text-gray-400 text-[0.6875rem]"> +{item.addons.length}</span>}
                          </span>
                        </div>
                        <span className={`text-[0.8125rem] font-semibold flex-shrink-0 ml-3 ${isUnavailable ? 'line-through text-red-300' : 'text-gray-900'}`}>₹{lineTotal}</span>
                      </div>
                    );
                  })}
                </div>

                {/* Bill breakdown */}
                <div className="border-t border-dashed border-gray-200 mt-4 pt-4 space-y-2 text-[0.8125rem]">
                  <div className="flex justify-between text-gray-500">
                    <span>Subtotal{taxInclusive && taxRate > 0 ? ` (incl. ${taxLabel})` : ''}</span>
                    <span>₹{subtotal.toFixed(0)}</span>
                  </div>
                  {orderType === 'delivery' && (
                    <div className="flex justify-between text-gray-500">
                      <span>Delivery</span>
                      <span>{deliveryFee === 0 ? <span className="text-green-600 font-semibold">FREE</span> : `₹${deliveryFee}`}</span>
                    </div>
                  )}
                  {packingCharges > 0 && <div className="flex justify-between text-gray-500"><span>Packing</span><span>₹{packingCharges}</span></div>}
                  {taxAmount > 0 && <div className="flex justify-between text-gray-500"><span>{taxLabel} ({taxRate}%)</span><span>₹{taxAmount}</span></div>}
                  {serviceChargeAmount > 0 && <div className="flex justify-between text-gray-500"><span>Service Charge ({serviceChargePercent}%)</span><span>₹{serviceChargeAmount}</span></div>}
                  {tipAmount > 0 && <div className="flex justify-between text-gray-500"><span>Tip</span><span>₹{tipAmount}</span></div>}
                  {giftWrapCharge > 0 && <div className="flex justify-between text-gray-500"><span>Gift Wrap</span><span>₹{giftWrapCharge}</span></div>}
                  {totalDiscount > 0 && (
                    <div className="flex justify-between text-green-600 font-semibold">
                      <span>Discount</span>
                      <span>-₹{totalDiscount.toFixed(0)}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-baseline font-bold text-gray-900 pt-3 mt-1 border-t border-gray-100">
                    <span className="text-base">Total</span>
                    <span className="text-xl" style={{ color: accent }}>₹{total.toFixed(0)}</span>
                  </div>
                </div>
              </section>

              {/* Baby Coins Earn + Bonuses */}
              {config.loyalty.enabled && (coinsToEarn > 0 || config.loyalty.first_order_bonus > 0 || config.features.referral_enabled) && (
                <div className="rounded-2xl p-4 space-y-2 border" style={{ backgroundColor: accentBg, borderColor: isClassic ? '#F5E6C4' : '#D8EAD8' }}>
                  {coinsToEarn > 0 && (
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${accent}20` }}>
                        <CoinIcon size={14} color={accent} />
                      </div>
                      <p className="text-[0.75rem] font-bold" style={{ color: accent }}>
                        Earn {coinsToEarn} Baby Coins on this order
                      </p>
                    </div>
                  )}
                  {config.loyalty.first_order_bonus > 0 && !loyalty && (
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-green-100">
                        <GiftIcon size={14} color="#16A34A" />
                      </div>
                      <p className="text-[0.75rem] font-semibold text-green-600">
                        +{config.loyalty.first_order_bonus} first order bonus!
                      </p>
                    </div>
                  )}
                  {config.features.referral_enabled && (
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-gray-100">
                        <UsersIcon size={14} color="#6B7280" />
                      </div>
                      <p className="text-[0.6875rem] text-gray-500">
                        Refer friends · earn <span className="font-semibold">{config.features.referral_points}</span>, they get <span className="font-semibold">{config.features.referral_points}</span> coins
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Warnings */}
              {config.checkout?.min_order_amount > 0 && subtotal < config.checkout.min_order_amount && (
                <p className="text-[0.75rem] text-orange-600 font-medium text-center bg-orange-50 px-4 py-2.5 rounded-xl">
                  Minimum order ₹{config.checkout.min_order_amount}. Add ₹{(config.checkout.min_order_amount - subtotal).toFixed(0)} more.
                </p>
              )}
              {config.orders?.max_order_amount && total > config.orders.max_order_amount && (
                <p className="text-[0.75rem] text-red-600 font-medium text-center bg-red-50 px-4 py-2.5 rounded-xl">
                  Maximum order amount is ₹{config.orders.max_order_amount}
                </p>
              )}
              {config.orders?.max_items_per_order && totalItemsCount > config.orders.max_items_per_order && (
                <p className="text-[0.75rem] text-red-600 font-medium text-center bg-red-50 px-4 py-2.5 rounded-xl">
                  Maximum {config.orders.max_items_per_order} items per order
                </p>
              )}

              {/* Place Order button */}
              <button
                onClick={() => handlePlaceOrder()}
                disabled={isPlacing || isValidating || items.length === 0 || (!!config.checkout?.min_order_amount && subtotal < config.checkout.min_order_amount) || (!!config.orders?.max_order_amount && total > config.orders.max_order_amount) || (!!config.orders?.max_items_per_order && totalItemsCount > config.orders.max_items_per_order)}
                className="w-full py-4 rounded-2xl text-base font-bold text-white transition-all hover:shadow-lg hover:scale-[1.01] active:scale-[0.98] disabled:opacity-60 disabled:hover:scale-100 disabled:hover:shadow-none flex items-center justify-center gap-2.5"
                style={{ backgroundColor: accent, boxShadow: `0 4px 14px ${accent}40` }}
              >
                {(isValidating || isPlacing) && <Spinner />}
                {isValidating ? 'Checking cart...' : isPlacing ? 'Placing Order...' : `Place Order · ₹${total.toFixed(0)}`}
              </button>

              {/* Order Progress Tracker */}
              <section className="bg-white rounded-2xl p-5 border border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="flex flex-col items-center gap-1.5">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: accentBg }}>
                      <CartIcon size={20} color={accent} />
                    </div>
                    <span className="text-[0.625rem] font-semibold" style={{ color: accent }}>Order</span>
                  </div>
                  <div className="flex-1 mx-2 h-0.5 rounded-full bg-gray-200 relative">
                    <div className="absolute inset-y-0 left-0 rounded-full" style={{ background: accent, width: '50%' }} />
                  </div>
                  <div className="flex flex-col items-center gap-1.5">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center bg-gray-100">
                      <FireIcon size={20} color="#9CA3AF" />
                    </div>
                    <span className="text-[0.625rem] font-medium text-gray-400">Preparing</span>
                  </div>
                  <div className="flex-1 mx-2 h-0.5 rounded-full bg-gray-200" />
                  <div className="flex flex-col items-center gap-1.5">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center bg-gray-100">
                      {orderType === 'delivery' ? (
                        <TruckIcon size={20} color="#9CA3AF" />
                      ) : (
                        <CheckIcon size={20} color="#9CA3AF" />
                      )}
                    </div>
                    <span className="text-[0.625rem] font-medium text-gray-400">{orderType === 'delivery' ? 'On the way' : 'Ready'}</span>
                  </div>
                </div>
              </section>

              {/* Delivery / Pickup Info with SVG illustration */}
              <section className="rounded-2xl p-5 border overflow-hidden relative" style={{ backgroundColor: accentBg, borderColor: isClassic ? '#F5E6C4' : '#D8EAD8' }}>
                <div className="relative z-10">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 bg-white">
                      {orderType === 'delivery' ? (
                        <TruckIcon size={20} color={accent} />
                      ) : orderType === 'pickup' ? (
                        <CartIcon size={20} color={accent} />
                      ) : (
                        <ChefIcon size={20} color={accent} />
                      )}
                    </div>
                    <div>
                      <p className="text-[0.8125rem] font-bold text-gray-800">
                        {orderType === 'delivery' ? 'Delivery to your door' : orderType === 'pickup' ? 'Pick up at outlet' : 'Dine with us'}
                      </p>
                      <p className="text-[0.6875rem] text-gray-500 mt-0.5">
                        {orderType === 'delivery' && config.delivery?.prep_time_minutes ? `Estimated ${config.delivery.prep_time_minutes + 15}–${config.delivery.prep_time_minutes + 30} mins` : orderType === 'pickup' && config.delivery?.prep_time_minutes ? `Ready in ~${config.delivery.prep_time_minutes} mins` : 'Fresh from the kitchen'}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-2 ml-0.5">
                    {orderType === 'delivery' && config.delivery?.live_tracking_enabled && (
                      <div className="flex items-center gap-2">
                        <LocationIcon size={14} color="#22C55E" />
                        <span className="text-[0.6875rem] font-medium text-gray-600">Real-time GPS tracking</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <FireIcon size={14} color={accent} />
                      <span className="text-[0.6875rem] font-medium text-gray-600">Freshly made to order</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <ShieldIcon size={14} color={accent} />
                      <span className="text-[0.6875rem] font-medium text-gray-600">100% veg kitchen</span>
                    </div>
                  </div>
                </div>
                {/* Burger illustration watermark */}
                <div className="absolute -bottom-4 -right-4 opacity-[0.07]">
                  <BurgerIcon size={120} color={accent} />
                </div>
              </section>

              {/* Trust badges */}
              <div className="flex items-center justify-center gap-5 text-[0.6875rem] text-gray-400 pt-1">
                <span className="flex items-center gap-1.5">
                  <ShieldIcon size={14} color="#9CA3AF" />
                  Secure checkout
                </span>
                <span className="flex items-center gap-1.5">
                  <LockIcon size={14} color="#9CA3AF" />
                  SSL encrypted
                </span>
                <span className="flex items-center gap-1.5">
                  <ClockIcon size={14} color="#9CA3AF" />
                  Quick delivery
                </span>
              </div>
            </div>
          </div>
        </div>
        {/* Spacer for sticky bottom bar on mobile */}
        <div className="h-24 lg:hidden" />
      </div>

      {/* Sticky Place Order bar — mobile only */}
      <div className="fixed bottom-16 left-0 right-0 z-[45] bg-white/95 backdrop-blur-lg border-t border-gray-100 px-4 py-3 lg:hidden md:hidden safe-area-bottom">
        {config.checkout?.min_order_amount > 0 && subtotal < config.checkout.min_order_amount && (
          <p className="text-[0.6875rem] text-orange-600 font-medium text-center mb-2 bg-orange-50 py-1.5 rounded-lg">
            Add ₹{(config.checkout.min_order_amount - subtotal).toFixed(0)} more to place order
          </p>
        )}
        <div className="flex items-center gap-3">
          <div className="flex-1 min-w-0">
            <p className="text-[0.6875rem] text-gray-500">{totalItemsCount} {totalItemsCount === 1 ? 'item' : 'items'}</p>
            <p className="text-base font-bold" style={{ color: accent }}>₹{total.toFixed(0)}</p>
          </div>
          <button
            onClick={() => handlePlaceOrder()}
            disabled={isPlacing || isValidating || items.length === 0 || (!!config.checkout?.min_order_amount && subtotal < config.checkout.min_order_amount) || (!!config.orders?.max_order_amount && total > config.orders.max_order_amount) || (!!config.orders?.max_items_per_order && totalItemsCount > config.orders.max_items_per_order)}
            className="flex-1 py-3 rounded-2xl text-[0.9375rem] font-bold text-white transition-all active:scale-[0.97] disabled:opacity-60 flex items-center justify-center gap-2"
            style={{ backgroundColor: accent, boxShadow: `0 2px 10px ${accent}30` }}
          >
            {(isValidating || isPlacing) && <Spinner />}
            {isValidating ? 'Checking...' : isPlacing ? 'Placing...' : 'Place Order'}
          </button>
        </div>
      </div>

      <AddressDrawer
        isOpen={addressDrawerOpen}
        onClose={() => setAddressDrawerOpen(false)}
        onSave={handleDrawerSaveAddress}
        accent={accent}
        accentBg={accentBg}
      />

      <AuthModal
        isOpen={showAuth}
        onClose={() => setShowAuth(false)}
        onSuccess={handlePlaceOrder}
      />

      {showCartChangedPopup && (
        <CartChangedPopup
          changes={validationChanges}
          unavailableItemIds={[...unavailableItemIds]}
          availableItemCount={items.filter((i) => !unavailableItemIds.has(i.menuItemId)).length}
          isClassic={isClassic}
          onProceed={() => {
            setShowCartChangedPopup(false);
            setValidationPassed(true);
            handlePlaceOrder(true);
          }}
          onReviewCart={() => setShowCartChangedPopup(false)}
        />
      )}

      <PlacingOrderLoader isPlacing={isPlacing} isClassic={isClassic} />
    </div>
  );
}
