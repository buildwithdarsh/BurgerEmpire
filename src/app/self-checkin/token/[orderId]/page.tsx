import { notFound } from 'next/navigation';
import Image from 'next/image';
import TokenActions from '@/components/self-checkin/TokenActions';
import { classicPatternUri, healthyPatternUri } from '@/components/FloatingBackground';
import { CheckIcon } from '@/components/icons';
import { TZ } from '@/lib/tz';
import type { Order, OrderItem } from '@buildwithdarsh/sdk';

interface PageProps {
  params: Promise<{ orderId: string }>;
}

export default async function TokenPage({ params }: PageProps) {
  const { orderId } = await params;

  let order: Order | null = null;
  try {
    order = await TZ.storefront.orders.get(orderId);
  } catch {
    // API unavailable
  }

  if (!order || order.orderType !== 'dine_in') notFound();

  const tokenDisplay = String(order.tokenNumber ?? '—').padStart(3, '0');
  const isHealthy = order.variantType === 'healthy';
  const patternUri = isHealthy ? healthyPatternUri : classicPatternUri;
  const pageBg = isHealthy ? '#F2F7F2' : '#FAF8F4';
  const accent = isHealthy ? '#4AA056' : '#EB7A29';
  const now = new Date();
  const dateStr = now.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  const timeStr = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });

  return (
    <>
      {/* Screen view */}
      <div
        className="min-h-screen flex flex-col items-center justify-center p-8 print:hidden relative overflow-hidden"
        style={{ backgroundColor: pageBg, backgroundImage: patternUri, backgroundRepeat: 'repeat', backgroundSize: '200px 200px' }}
      >
        <div className="flex items-center gap-3 mb-10 relative z-10">
          <Image src={'/logo-icon.svg'} alt="Burger Empire" width={52} height={52} />
          <div>
            <p className="font-black text-2xl leading-tight tracking-wide" style={{ color: '#1A1A1A' }}>
              BURGER BUDDY
            </p>
            <p className="text-sm font-medium" style={{ color: '#1A1A1A', opacity: 0.4 }}>
              Self Check-in
            </p>
          </div>
        </div>

        <div
          className="rounded-2xl px-8 py-3 mb-8 border relative z-10"
          style={{ backgroundColor: 'rgba(74,160,86,0.1)', borderColor: 'rgba(74,160,86,0.3)' }}
        >
          <p className="font-bold text-lg text-center" style={{ color: '#4AA056' }}>
            <CheckIcon size={16} color="#4AA056" className="inline mr-1" /> Order Placed Successfully!
          </p>
        </div>

        <div
          className="rounded-3xl px-16 py-10 mb-8 text-center relative z-10"
          style={{ backgroundColor: '#FFFFFF', border: `2px solid ${accent}` }}
        >
          <p className="text-sm uppercase tracking-widest mb-1 font-bold" style={{ color: accent }}>
            Your Token Number
          </p>
          <p className="text-xs mb-5" style={{ color: '#9CA3AF' }}>
            Show this when your number is called
          </p>
          <div className="flex items-center justify-center gap-3">
            <span className="text-5xl font-black" style={{ color: `${accent}33` }}>T</span>
            {tokenDisplay.split('').map((digit, i) => (
              <span
                key={i}
                className="w-20 h-24 rounded-2xl flex items-center justify-center text-white font-black text-6xl"
                style={{ backgroundColor: accent }}
              >
                {digit}
              </span>
            ))}
          </div>
          <p className="text-sm mt-6 font-medium" style={{ color: '#6B7280' }}>
            Hi, {order.customerName}!
          </p>
        </div>

        <div
          className="rounded-2xl w-full max-w-sm shadow-sm overflow-hidden relative z-10"
          style={{ backgroundColor: '#FFFFFF', border: '1.5px solid #EEEEEE' }}
        >
          <div className="px-5 py-4 border-b" style={{ borderColor: '#EEEEEE' }}>
            <p className="font-bold text-base" style={{ color: '#1A1A1A' }}>Order Summary</p>
            <p className="text-xs mt-0.5 text-gray-400">{dateStr} · {timeStr}</p>
          </div>
          <div className="px-5 py-4 space-y-2">
            {order.items.map((item: OrderItem) => (
              <div key={item.id} className="flex justify-between text-sm">
                <span className="text-gray-700">{item.itemName} × {item.quantity}</span>
                <span className="text-gray-500 font-medium">₹{Number(item.totalPrice).toFixed(0)}</span>
              </div>
            ))}
            {order.taxAmount > 0 && (
              <div className="flex justify-between text-xs text-gray-400 pt-1">
                <span>Tax</span>
                <span>₹{Number(order.taxAmount).toFixed(2)}</span>
              </div>
            )}
          </div>
          <div className="px-5 py-4 border-t flex justify-between items-center" style={{ borderColor: '#EEEEEE' }}>
            <span className="font-bold" style={{ color: '#1A1A1A' }}>Total</span>
            <span className="font-black text-xl" style={{ color: accent }}>₹{Number(order.totalAmount).toFixed(2)}</span>
          </div>
          <div className="px-5 py-3 border-t text-center" style={{ borderColor: '#EEEEEE', backgroundColor: order.paymentMethod === 'online' ? '#F0FDF4' : '#FAF8F4' }}>
            <p className="text-xs text-gray-400">
              {order.paymentMethod === 'online' ? 'Paid online' : 'Pay at the counter · Cash'}
            </p>
          </div>
        </div>

        <div className="relative z-10">
          <TokenActions />
        </div>
      </div>

      {/* Print-only thermal receipt */}
      <div className="hidden print:block font-mono text-black bg-white p-4 text-sm w-72 mx-auto">
        <div className="text-center mb-3">
          <p className="font-black text-xl tracking-widest">BURGER BUDDY</p>
          <p className="text-xs text-gray-500">Dine-in Receipt</p>
          <p className="text-xs text-gray-500">{dateStr} · {timeStr}</p>
        </div>
        <div className="border-t border-dashed border-gray-400 my-2" />
        <div className="text-center my-4">
          <p className="text-xs uppercase tracking-widest text-gray-500 mb-1">Token Number</p>
          <p className="text-6xl font-black tracking-widest">T{tokenDisplay}</p>
        </div>
        <div className="border-t border-dashed border-gray-400 my-2" />
        <p className="font-bold mb-1">Customer: {order.customerName}</p>
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-gray-300">
              <th className="text-left py-1">Item</th>
              <th className="text-center py-1">Qty</th>
              <th className="text-right py-1">Amt</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map((item: OrderItem) => (
              <tr key={item.id} className="border-b border-gray-100">
                <td className="py-1 pr-1 leading-tight">{item.itemName}</td>
                <td className="text-center py-1">{item.quantity}</td>
                <td className="text-right py-1">₹{Number(item.totalPrice).toFixed(0)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="border-t border-dashed border-gray-400 my-2" />
        <div className="flex justify-between text-xs"><span>Subtotal</span><span>₹{Number(order.subtotal).toFixed(2)}</span></div>
        {order.taxAmount > 0 && (
          <div className="flex justify-between text-xs"><span>Tax</span><span>₹{Number(order.taxAmount).toFixed(2)}</span></div>
        )}
        <div className="flex justify-between font-black text-base mt-1">
          <span>TOTAL</span><span>₹{Number(order.totalAmount).toFixed(2)}</span>
        </div>
        <div className="border-t border-dashed border-gray-400 my-2" />
        <div className="text-center text-xs text-gray-500">
          <p>{order.paymentMethod === 'online' ? 'Paid online' : 'Pay at the counter'}</p>
          <p className="mt-1 font-bold">Thank you! Enjoy your meal!</p>
        </div>
      </div>
    </>
  );
}
