'use client';

import { CartIcon, CheckIcon, CreditCardIcon, WalletIcon } from '@/components/icons';

export type KioskPaymentType = '1' | '2'; // 1 = online, 2 = cash

export interface KioskCartItem {
  menuItemId: string;
  variationId?: string;
  addons: { addonId: string; quantity: number }[];
  addonSummary: string[];
  name: string;
  unitPrice: number;
  image?: string;
  quantity: number;
  mode: 'classic' | 'healthy';
}

interface KioskCartProps {
  items: KioskCartItem[];
  mode: 'classic' | 'healthy';
  onIncrement: (menuItemId: string) => void;
  onDecrement: (menuItemId: string) => void;
  onPlaceOrder: () => void;
  isPlacing: boolean;
  error: string;
  paymentType: KioskPaymentType;
  onPaymentTypeChange: (type: KioskPaymentType) => void;
  onlinePayEnabled: boolean;
}

export default function KioskCart({
  items,
  mode,
  onIncrement,
  onDecrement,
  onPlaceOrder,
  isPlacing,
  error,
  paymentType,
  onPaymentTypeChange,
  onlinePayEnabled,
}: KioskCartProps) {
  const subtotal   = items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0);
  const totalQty   = items.reduce((s, i) => s + i.quantity, 0);
  const isEmpty    = items.length === 0;

  const accent      = mode === 'healthy' ? '#4AA056' : '#EB7A29';
  const accentLight = mode === 'healthy' ? '#EDF7F0' : '#FDF5EC';
  const accentGlow  = mode === 'healthy' ? 'rgba(74,160,86,0.22)' : 'rgba(235,122,41,0.28)';

  return (
    <aside
      className="w-80 flex flex-col shrink-0 border-l"
      style={{ backgroundColor: '#FFFFFF', borderColor: '#EEEEEE' }}
    >
      {/* Header */}
      <div
        className="px-5 py-4 border-b"
        style={{ backgroundColor: accentLight, borderColor: '#EEEEEE' }}
      >
        <h2 className="text-lg font-black tracking-wide" style={{ color: '#1A1A1A' }}>
          Your Order
        </h2>
        <p className="text-sm mt-0.5" style={{ color: '#6B7280' }}>
          {isEmpty
            ? 'Add items from the menu'
            : `${totalQty} item${totalQty !== 1 ? 's' : ''}`}
        </p>
      </div>

      {/* Items */}
      <div className="flex-1 overflow-y-auto px-4 py-3">
        {isEmpty ? (
          <div className="flex flex-col items-center justify-center h-full py-16">
            <CartIcon size={48} color="#9CA3AF" className="mb-3 opacity-20" />
            <p className="text-sm text-center leading-relaxed" style={{ color: '#9CA3AF' }}>
              Your cart is empty.<br />Pick something delicious!
            </p>
          </div>
        ) : (
          items.map((item) => (
            <div
              key={item.menuItemId}
              className="py-3 border-b"
              style={{ borderColor: '#F3F4F6' }}
            >
              <div className="flex items-start gap-3">
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm leading-tight" style={{ color: '#1A1A1A' }}>
                    {item.name}
                  </p>
                  {item.addonSummary.length > 0 && (
                    <p className="text-xs mt-0.5 leading-tight" style={{ color: '#9CA3AF' }}>
                      + {item.addonSummary.join(', ')}
                    </p>
                  )}
                  <p className="text-xs mt-0.5" style={{ color: '#D1D5DB' }}>
                    ₹{item.unitPrice.toFixed(0)} each
                  </p>
                </div>

                {/* Qty controls */}
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => onDecrement(item.menuItemId)}
                    className="w-8 h-8 rounded-full flex items-center justify-center text-lg leading-none font-bold transition-colors"
                    style={{ backgroundColor: '#F3F4F6', color: '#374151' }}
                  >
                    −
                  </button>
                  <span className="font-black w-5 text-center text-sm" style={{ color: '#1A1A1A' }}>
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => onIncrement(item.menuItemId)}
                    className="w-8 h-8 rounded-full flex items-center justify-center text-lg leading-none font-bold text-white transition-colors"
                    style={{ backgroundColor: accent }}
                  >
                    +
                  </button>
                </div>
              </div>

              <p className="text-right text-sm font-bold mt-1" style={{ color: accent }}>
                ₹{(item.unitPrice * item.quantity).toFixed(0)}
              </p>
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t space-y-3" style={{ borderColor: '#EEEEEE' }}>
        <div className="flex justify-between text-sm" style={{ color: '#6B7280' }}>
          <span>Subtotal</span>
          <span>₹{subtotal.toFixed(2)}</span>
        </div>
        <p className="text-xs" style={{ color: '#D1D5DB' }}>+ taxes applied at checkout</p>

        <div
          className="flex items-center justify-between text-xl font-black pt-2 border-t"
          style={{ borderColor: '#EEEEEE' }}
        >
          <span style={{ color: '#1A1A1A' }}>Total</span>
          <span style={{ color: accent }}>₹{subtotal.toFixed(0)}</span>
        </div>

        {/* Payment method selector */}
        {!isEmpty && (
          <div className="space-y-1.5">
            <p className="text-xs font-bold" style={{ color: '#6B7280' }}>Payment</p>
            <div className="flex gap-2">
              <button
                onClick={() => onPaymentTypeChange('2')}
                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold border-2 transition-all"
                style={{
                  borderColor: paymentType === '2' ? accent : '#E5E7EB',
                  backgroundColor: paymentType === '2' ? accentLight : '#FFFFFF',
                  color: paymentType === '2' ? accent : '#6B7280',
                }}
              >
                <WalletIcon size={14} color={paymentType === '2' ? accent : '#9CA3AF'} />
                Cash
              </button>
              <button
                onClick={() => onlinePayEnabled && onPaymentTypeChange('1')}
                disabled={!onlinePayEnabled}
                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold border-2 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                style={{
                  borderColor: paymentType === '1' ? accent : '#E5E7EB',
                  backgroundColor: paymentType === '1' ? accentLight : '#FFFFFF',
                  color: paymentType === '1' ? accent : '#6B7280',
                }}
              >
                <CreditCardIcon size={14} color={paymentType === '1' ? accent : '#9CA3AF'} />
                Pay Online
              </button>
            </div>
          </div>
        )}

        {error && (
          <p
            className="text-xs text-center rounded-xl py-2 px-3 border"
            style={{ color: '#DC2626', backgroundColor: '#FEF2F2', borderColor: '#FECACA' }}
          >
            {error}
          </p>
        )}

        <button
          onClick={onPlaceOrder}
          disabled={isEmpty || isPlacing}
          className="w-full py-4 rounded-2xl text-lg font-black tracking-wide transition-all disabled:opacity-30 disabled:cursor-not-allowed text-white"
          style={{
            backgroundColor: isEmpty ? '#E5E7EB' : accent,
            color: isEmpty ? '#9CA3AF' : '#FFFFFF',
            boxShadow: isEmpty ? 'none' : `0 4px 20px ${accentGlow}`,
          }}
        >
          {isPlacing ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
              {paymentType === '1' ? 'Processing Payment…' : 'Placing Order…'}
            </span>
          ) : (
            <><CheckIcon size={16} color="white" className="mr-1" /> {paymentType === '1' ? 'Pay & Place Order' : 'Place Order'}</>
          )}
        </button>

        <p className="text-xs text-center" style={{ color: '#D1D5DB' }}>
          {paymentType === '1' ? 'Secure payment via Razorpay' : 'Pay at the counter when your token is called'}
        </p>
      </div>
    </aside>
  );
}
