'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { cloudinaryUrl } from '@/lib/cloudinary-url';
import { TZ } from '@/lib/tz';
import type { PaginatedResponse, CatalogItem, StorefrontConfig } from '@buildwithdarsh/sdk';
import KioskCart, { type KioskCartItem, type KioskPaymentType } from '@/components/self-checkin/KioskCart';
import KioskItemModal, { type KioskModalItem, type KioskItemConfig } from '@/components/self-checkin/KioskItemModal';
import { classicPatternUri, healthyPatternUri } from '@/components/FloatingBackground';
import { FireIcon, SaladIcon, XIcon, BurgerIcon, TrophyIcon } from '@/components/icons';

interface KioskMenuItem extends KioskModalItem {
  category: string;
  inStock: boolean;
  isBestseller: boolean;
  isNew: boolean;
}

const DIET_DOT: Record<string, string> = {
  veg: '#22C55E',
  nonveg: '#EF4444',
  egg: '#EAB308',
};

export default function SelfCheckinMenuPage() {
  const router = useRouter();

  const [customerName, setCustomerName] = useState('Guest');
  const [mode, setMode] = useState<'classic' | 'healthy'>('classic');
  const [menuItems, setMenuItems] = useState<KioskMenuItem[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [isLoadingMenu, setIsLoadingMenu] = useState(true);

  // Cart state — uses the full KioskCartItem shape
  const [cart, setCart] = useState<KioskCartItem[]>([]);

  // Modal state
  const [modalItem, setModalItem] = useState<KioskMenuItem | null>(null);

  const [isPlacing, setIsPlacing] = useState(false);
  const [error, setError] = useState('');
  const [paymentType, setPaymentType] = useState<KioskPaymentType>('2');
  const [onlinePayEnabled, setOnlinePayEnabled] = useState(false);

  // ── Session restore ────────────────────────────────
  useEffect(() => {
    const savedName = sessionStorage.getItem('kiosk_name');
    const savedMode = sessionStorage.getItem('kiosk_mode') as 'classic' | 'healthy' | null;
    if (!savedName) { router.replace('/self-checkin'); return; }
    setCustomerName(savedName);
    if (savedMode) setMode(savedMode);
  }, [router]);

  // ── Fetch menu + config ──────────────────────────────
  useEffect(() => {
    TZ.storefront.catalog.getItems()
      .then((result: PaginatedResponse<CatalogItem>) => {
        const items = result.data as unknown as KioskMenuItem[];
        if (items.length > 0) {
          setMenuItems(items);
          const cats = [...new Set<string>(items.map((i) => i.category))];
          setCategories(cats);
          setSelectedCategory(cats[0] ?? '');
        }
      })
      .catch(() => {})
      .finally(() => setIsLoadingMenu(false));

    TZ.storefront.config.get()
      .then((data: StorefrontConfig) => {
        const checkout = data['checkout'] as Record<string, boolean> | undefined;
        if (checkout?.['onlinePayEnabled']) {
          setOnlinePayEnabled(true);
        }
      })
      .catch(() => {});
  }, []);

  // ── Helpers ────────────────────────────────────────
  const getQty = (menuItemId: string) =>
    cart.find((c) => c.menuItemId === menuItemId)?.quantity ?? 0;

  const hasCustomizations = (item: KioskMenuItem) =>
    item.variations.length > 0 ||
    item.addonGroups.some((g) => g.addons.some((a) => a.inStock));

  // Direct add (no customizations)
  const addSimple = useCallback(
    (item: KioskMenuItem) => {
      const name = mode === 'healthy' ? item.healthy.name : item.classic.name;
      const unitPrice = mode === 'healthy' ? item.healthy.price : item.classic.price;
      const image = mode === 'healthy' ? item.healthyImage : item.image;
      setCart((prev) => {
        const existing = prev.find((c) => c.menuItemId === item.id);
        if (existing) return prev.map((c) => c.menuItemId === item.id ? { ...c, quantity: c.quantity + 1 } : c);
        return [...prev, { menuItemId: item.id, variationId: undefined, addons: [], addonSummary: [], name, unitPrice, image, quantity: 1, mode }];
      });
    },
    [mode]
  );

  // Add from modal with full config
  const addWithConfig = useCallback(
    (item: KioskMenuItem, config: KioskItemConfig) => {
      const baseName = mode === 'healthy' ? item.healthy.name : item.classic.name;
      const name = config.variationName ? `${baseName} (${config.variationName})` : baseName;
      const image = mode === 'healthy' ? item.healthyImage : item.image;
      const addonSummary = config.addons.map((a) => a.addonName);
      const apiAddons = config.addons.map((a) => ({ addonId: a.addonId, quantity: a.quantity }));

      setCart((prev) => {
        const existing = prev.find((c) => c.menuItemId === item.id);
        if (existing) {
          // Update existing entry with new config
          return prev.map((c) =>
            c.menuItemId === item.id
              ? { ...c, quantity: c.quantity + config.quantity, variationId: config.variationId, addons: apiAddons, addonSummary, unitPrice: config.unitPrice, name }
              : c
          );
        }
        return [
          ...prev,
          { menuItemId: item.id, variationId: config.variationId, addons: apiAddons, addonSummary, name, unitPrice: config.unitPrice, image, quantity: config.quantity, mode },
        ];
      });
    },
    [mode]
  );

  // "Add +" button on card
  const handleCardAdd = useCallback(
    (item: KioskMenuItem) => {
      const qty = getQty(item.id);
      if (qty > 0) {
        // Already in cart — just increment
        setCart((prev) => prev.map((c) => c.menuItemId === item.id ? { ...c, quantity: c.quantity + 1 } : c));
        return;
      }
      if (hasCustomizations(item)) {
        setModalItem(item);
      } else {
        addSimple(item);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [cart, addSimple]
  );

  const increment = useCallback((menuItemId: string) => {
    setCart((prev) => prev.map((c) => c.menuItemId === menuItemId ? { ...c, quantity: c.quantity + 1 } : c));
  }, []);

  const decrement = useCallback((menuItemId: string) => {
    setCart((prev) => {
      const item = prev.find((c) => c.menuItemId === menuItemId);
      if (!item) return prev;
      if (item.quantity === 1) return prev.filter((c) => c.menuItemId !== menuItemId);
      return prev.map((c) => c.menuItemId === menuItemId ? { ...c, quantity: c.quantity - 1 } : c);
    });
  }, []);

  // ── Razorpay for kiosk ────────────────────────────────
  // Justified: Kiosk payment creation uses a simplified Razorpay flow
  // (amount-only, no productId) that doesn't match the SDK's typed
  // TZ.storefront.payments.createOrder() DTO.
  const initiateKioskRazorpay = async (amount: number): Promise<{
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
  } | null> => {
    try {
      const res = await fetch('/api/self-checkin/create-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || 'Failed to create payment');

      return new Promise((resolve) => {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.onload = () => {
          const isHealthy = mode === 'healthy';
          const options = {
            key: data.keyId,
            amount: data.amount,
            currency: data.currency,
            name: 'Burger Empire',
            description: `Self Check-in · ${isHealthy ? 'Healthy' : 'Classic'} Mode`,
            image: '/brand/full-logo.png',
            order_id: data.orderId,
            handler: (response: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) => {
              resolve(response);
            },
            prefill: { name: customerName },
            theme: {
              color: isHealthy ? '#4AA056' : '#EB7A29',
              backdrop_color: 'rgba(0, 0, 0, 0.5)',
            },
            modal: {
              ondismiss: () => resolve(null),
              confirm_close: true,
              animation: true,
            },
            notes: { source: 'self-checkin', mode },
          };
          const win = window as unknown as { Razorpay: new (opts: Record<string, unknown>) => { open(): void } };
          const rzp = new win.Razorpay(options as unknown as Record<string, unknown>);
          rzp.open();
        };
        document.body.appendChild(script);
      });
    } catch {
      return null;
    }
  };

  // ── Place order ────────────────────────────────────
  const handlePlaceOrder = async () => {
    if (!cart.length) return;
    setIsPlacing(true);
    setError('');

    try {
      // Calculate subtotal for Razorpay
      let razorpayFields: {
        razorpay_order_id: string;
        razorpay_payment_id: string;
        razorpay_signature: string;
      } | undefined;

      if (paymentType === '1') {
        const subtotal = cart.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0);
        const result = await initiateKioskRazorpay(subtotal);
        if (!result) {
          // User dismissed or payment failed
          setIsPlacing(false);
          return;
        }
        razorpayFields = result;
      }

      // TODO: Kiosk order payload (mode, paymentType, items with addons) doesn't
      // match the SDK's CreateOrderDto shape. Needs a dedicated kiosk API route
      // or an SDK extension for self-checkin orders.
      const res = await fetch('/api/self-checkin/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName,
          mode,
          paymentType,
          items: cart.map((item) => ({
            menuItemId: item.menuItemId,
            variationId: item.variationId,
            quantity: item.quantity,
            addons: item.addons,
          })),
          ...razorpayFields,
        }),
      });
      const data = await res.json();
      if (data.success) {
        sessionStorage.removeItem('kiosk_name');
        sessionStorage.removeItem('kiosk_mode');
        router.push(`/self-checkin/token/${data.orderId}?token=${data.tokenNumber}&total=${data.total}`);
      } else {
        setError(data.error || 'Failed to place order. Please try again.');
        setIsPlacing(false);
      }
    } catch {
      setError('Network error. Please try again.');
      setIsPlacing(false);
    }
  };

  // ── Theme ──────────────────────────────────────────
  const isHealthy = mode === 'healthy';
  const pageBg = isHealthy ? '#F2F7F2' : '#FAF8F4';
  const accent = isHealthy ? '#4AA056' : '#EB7A29';
  const accentLight = isHealthy ? '#EDF7F0' : '#FDF5EC';

  const displayedItems = menuItems.filter((i) => i.category === selectedCategory && i.inStock);

  return (
    <div className="h-screen flex flex-col overflow-hidden" style={{ backgroundColor: pageBg }}>
      {/* ── Header ─────────────────────────────────── */}
      <header className="h-16 shrink-0 flex items-center justify-between px-6 bg-white border-b border-gray-200 shadow-sm">
        <div className="flex items-center gap-3">
          <Image src={'/logo-icon.svg'} alt="Burger Empire" width={36} height={36} />
          <div>
            <p className="font-black text-base leading-tight" style={{ color: '#1A1A1A' }}>
              BURGER BUDDY
            </p>
            <p className="text-xs font-medium" style={{ color: '#1A1A1A', opacity: 0.4 }}>
              Self Check-in
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span
            className="px-3 py-1.5 rounded-full text-sm font-bold"
            style={{ backgroundColor: accentLight, color: accent }}
          >
            {isHealthy ? <SaladIcon size={14} color={accent} /> : <FireIcon size={14} color={accent} />}
            {isHealthy ? ' Healthy' : ' Classic'} Mode
          </span>
          <span className="text-sm font-medium" style={{ color: '#1A1A1A', opacity: 0.6 }}>
            Hi, {customerName}!
          </span>
          <Link
            href="/self-checkin"
            className="text-sm font-semibold border rounded-lg px-3 py-1.5 transition-colors hover:bg-gray-50"
            style={{ color: '#6B7280', borderColor: '#E5E7EB' }}
          >
            <XIcon size={12} color="#6B7280" className="inline mr-1" /> Start Over
          </Link>
        </div>
      </header>

      {/* ── Main ───────────────────────────────────── */}
      <div className="flex-1 flex overflow-hidden">
        {/* Category sidebar */}
        <nav className="w-44 shrink-0 bg-white border-r border-gray-200 overflow-y-auto py-2">
          {isLoadingMenu
            ? Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="mx-3 mb-2 h-10 rounded-xl bg-gray-100 animate-pulse" />
              ))
            : categories.map((cat) => {
                const isActive = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className="w-full text-left px-4 py-3 text-sm font-semibold transition-colors border-l-2"
                    style={{
                      borderLeftColor: isActive ? accent : 'transparent',
                      backgroundColor: isActive ? accentLight : 'transparent',
                      color: isActive ? accent : '#6B7280',
                    }}
                  >
                    {cat}
                  </button>
                );
              })}
        </nav>

        {/* Menu grid */}
        <main
          className="flex-1 overflow-y-auto p-5"
          style={{
            backgroundImage: isHealthy ? healthyPatternUri : classicPatternUri,
            backgroundRepeat: 'repeat',
            backgroundSize: '200px 200px',
          }}
        >
          {isLoadingMenu ? (
            <div className="grid grid-cols-2 xl:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-white rounded-2xl h-56 animate-pulse shadow-sm" />
              ))}
            </div>
          ) : displayedItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full" style={{ color: '#9CA3AF' }}>
              <BurgerIcon size={48} color="#9CA3AF" className="mb-3 opacity-40" />
              <p className="font-medium">No items in this category.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 xl:grid-cols-3 gap-4">
              {displayedItems.map((item) => {
                const qty = getQty(item.id);
                const name = isHealthy ? item.healthy.name : item.classic.name;
                const desc = isHealthy ? item.healthy.description : item.classic.description;
                const price = isHealthy ? item.healthy.price : item.classic.price;
                const rawImg = isHealthy ? item.healthyImage : item.image;
                const image = rawImg ? cloudinaryUrl(rawImg) : undefined;
                const cals = isHealthy ? item.healthy.calories : item.classic.calories;

                return (
                  <div
                    key={item.id}
                    className="bg-white rounded-2xl overflow-hidden flex flex-col transition-all hover:shadow-md"
                    style={{ border: `1.5px solid ${qty > 0 ? accent : '#F3F4F6'}`, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}
                  >
                    {/* Image */}
                    <div
                      className="relative h-36 shrink-0"
                      style={{
                        background: isHealthy
                          ? 'linear-gradient(160deg, #E8F8EC 0%, #C5E8CF 50%, #B8E0C4 100%)'
                          : 'linear-gradient(160deg, #FFF8E7 0%, #FFE9B0 50%, #FFDEA0 100%)',
                      }}
                    >
                      {image ? (
                        <Image src={image} alt={name} fill className="object-contain p-3 drop-shadow-md" sizes="(max-width: 768px) 50vw, 33vw" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <BurgerIcon size={48} color={isHealthy ? '#4AA056' : '#EB7A29'} className="opacity-40" />
                        </div>
                      )}
                      {item.isBestseller && (
                        <span className="absolute top-2 left-2 flex items-center gap-1 bg-[#EB7A29] text-white text-xs font-bold px-2 py-0.5 rounded-full">
                          <TrophyIcon size={10} color="white" /> Best Seller
                        </span>
                      )}
                      {item.isNew && (
                        <span className="absolute top-2 right-2 bg-blue-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                          NEW
                        </span>
                      )}
                    </div>

                    {/* Info */}
                    <div className="p-4 flex flex-col flex-1">
                      <div className="flex items-start gap-2 mb-1">
                        <span
                          className="w-2.5 h-2.5 rounded-sm border shrink-0 mt-[3px]"
                          style={{ backgroundColor: DIET_DOT[item.diet], borderColor: '#D1D5DB' }}
                        />
                        <h3 className="font-bold text-sm leading-tight flex-1" style={{ color: '#1A1A1A' }}>
                          {name}
                        </h3>
                      </div>
                      <p className="text-gray-400 text-xs line-clamp-2 mb-2">{desc}</p>
                      {cals > 0 && <p className="text-gray-300 text-xs mb-2">{cals} kcal</p>}

                      {/* Addon indicator */}
                      {hasCustomizations(item) && (
                        <p className="text-xs font-medium mb-2" style={{ color: accent }}>
                          + Customizable
                        </p>
                      )}

                      {/* Price + controls */}
                      <div className="flex items-center justify-between mt-auto pt-2 border-t border-gray-100">
                        <span className="font-black text-lg" style={{ color: accent }}>
                          ₹{price}
                        </span>

                        {qty === 0 ? (
                          <button
                            onClick={() => handleCardAdd(item)}
                            className="px-4 py-2 rounded-xl text-sm font-bold text-white transition-all active:scale-95"
                            style={{ backgroundColor: accent }}
                          >
                            Add +
                          </button>
                        ) : (
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => decrement(item.id)}
                              className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 font-bold flex items-center justify-center text-lg leading-none transition-colors"
                              style={{ color: '#1A1A1A' }}
                            >
                              −
                            </button>
                            <span className="font-black text-sm w-4 text-center" style={{ color: '#1A1A1A' }}>
                              {qty}
                            </span>
                            <button
                              onClick={() => handleCardAdd(item)}
                              className="w-8 h-8 rounded-full text-white font-bold flex items-center justify-center text-lg leading-none transition-colors active:scale-95"
                              style={{ backgroundColor: accent }}
                            >
                              +
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </main>

        {/* Cart sidebar */}
        <KioskCart
          items={cart}
          mode={mode}
          onIncrement={increment}
          onDecrement={decrement}
          onPlaceOrder={handlePlaceOrder}
          isPlacing={isPlacing}
          error={error}
          paymentType={paymentType}
          onPaymentTypeChange={setPaymentType}
          onlinePayEnabled={onlinePayEnabled}
        />
      </div>

      {/* Item customization modal */}
      {modalItem && (
        <KioskItemModal
          item={modalItem}
          mode={mode}
          onClose={() => setModalItem(null)}
          onConfirm={(config) => addWithConfig(modalItem, config)}
        />
      )}
    </div>
  );
}
