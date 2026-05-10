'use client';

import { useMode } from '@/hooks/useMode';
import { useConfig } from '@/hooks/useConfig';
import { useCartStore, type CartItem } from '@/store/cart';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { cloudinaryUrl } from '@/lib/cloudinary-url';
import { VegIcon, NonVegIcon } from '../icons';

interface CartItemRowProps {
  item: CartItem;
}

export default function CartItemRow({ item }: CartItemRowProps) {
  const { isClassic } = useMode();
  const { config } = useConfig();
  const currencySymbol = config.branding?.currency_symbol || '₹';
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);

  const itemMode = item.mode || (isClassic ? 'classic' : 'healthy');
  const name = itemMode === 'classic' ? item.classicName : item.healthyName;
  const price =
    item.variationPrice !== undefined
      ? item.variationPrice
      : itemMode === 'classic'
        ? item.classicPrice
        : item.healthyPrice;

  const addonTotal = item.addons.reduce((sum, a) => sum + a.price * a.quantity, 0);
  const lineTotal = (price + addonTotal) * item.quantity;

  const isHealthyItem = itemMode === 'healthy';
  const accent = isHealthyItem ? '#4AA056' : '#9A1E29';
  const cardBg = isHealthyItem ? '#F0FAF3' : '#FAF8F4';
  const borderColor = isHealthyItem ? '#D8EAD8' : '#F5E6C4';

  const rawImage = isHealthyItem
    ? (item.healthyImage || item.image)
    : item.image;
  const imageUrl = rawImage ? cloudinaryUrl(rawImage) : undefined;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="rounded-2xl overflow-hidden mb-2.5"
      style={{ backgroundColor: cardBg, border: `1px solid ${borderColor}` }}
    >
      <div className="flex gap-3 p-3">
        {/* Image */}
        {imageUrl && (
          <div className="relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
            <Image src={imageUrl} alt={name} fill className="object-cover" sizes="64px" />
          </div>
        )}

        <div className="flex-1 min-w-0">
          {/* Name + remove */}
          <div className="flex items-start justify-between gap-1.5">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5 mb-0.5">
                {item.diet === 'veg' ? <VegIcon size={12} /> : <NonVegIcon size={12} />}
                <p className="text-[0.8125rem] font-bold text-gray-900 truncate">{name}</p>
              </div>
              {item.variationName && (
                <p className="text-[0.625rem] text-gray-400 font-medium">{item.variationName}</p>
              )}
              {item.addons.length > 0 && (
                <p className="text-[0.625rem] text-gray-400 truncate">
                  + {item.addons.map((a) => a.name).join(', ')}
                </p>
              )}
            </div>
            <button
              onClick={() => removeItem(item.id)}
              className="flex-shrink-0 w-5 h-5 flex items-center justify-center rounded-full text-gray-300 hover:text-red-400 hover:bg-red-50 transition-colors"
            >
              <svg width="10" height="10" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                <path d="M2 2L10 10M10 2L2 10" />
              </svg>
            </button>
          </div>

          {/* Qty + price */}
          <div className="flex items-center justify-between mt-2">
            <div
              className="flex items-center rounded-lg overflow-hidden border bg-white"
              style={{ borderColor }}
            >
              <button
                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                className="w-6 h-6 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors text-xs font-medium"
              >
                -
              </button>
              <span className="w-6 h-6 flex items-center justify-center text-[0.6875rem] font-bold text-gray-900">
                {item.quantity}
              </span>
              <button
                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                className="w-6 h-6 flex items-center justify-center hover:bg-gray-50 transition-colors text-xs font-bold"
                style={{ color: accent }}
              >
                +
              </button>
            </div>

            <span className="text-sm font-black" style={{ color: accent }}>
              {currencySymbol}{lineTotal}
            </span>
          </div>

          {!item.inStock && (
            <p className="text-[0.625rem] text-red-500 font-medium mt-1 bg-red-50 px-2 py-0.5 rounded-md inline-block">
              Currently unavailable
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
}
