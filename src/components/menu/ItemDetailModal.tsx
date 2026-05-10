'use client';

import { useState } from 'react';
import { createPortal } from 'react-dom';
import { useMode } from '@/hooks/useMode';
import { useConfig } from '@/hooks/useConfig';
import { useCartStore } from '@/store/cart';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { cloudinaryUrl } from '@/lib/cloudinary-url';
import { VegIcon, NonVegIcon } from '../icons';
import type { MenuItem } from '@/lib/menu-adapter';

interface Variation {
  id: string;
  name: string;
  groupName: string;
  price: number;
  inStock: boolean;
}

interface AddonGroup {
  id: string;
  name: string;
  minSelection: number;
  maxSelection: number;
  addons: { id: string; name: string; price: number; inStock: boolean }[];
}

interface ExtendedMenuItem extends MenuItem {
  variations?: Variation[];
  addonGroups?: AddonGroup[];
}

interface ItemDetailModalProps {
  item: ExtendedMenuItem | null;
  onClose: () => void;
}

export default function ItemDetailModal({ item, onClose }: ItemDetailModalProps) {
  const { isClassic } = useMode();
  const { config } = useConfig();
  const addItem = useCartStore((s) => s.addItem);
  const setOpen = useCartStore((s) => s.setOpen);
  const currencySymbol = config.branding?.currency_symbol || '₹';

  const [selectedVariation, setSelectedVariation] = useState<Variation | null>(null);
  const [selectedAddons, setSelectedAddons] = useState<Record<string, number>>({});
  const [quantity, setQuantity] = useState(1);
  const [didAutoSelect, setDidAutoSelect] = useState(false);

  // Auto-select the default variant type from config on first render
  if (item && !didAutoSelect && item.variations && item.variations.length > 0) {
    const defaultType = config.catalog?.default_variant_type;
    if (defaultType) {
      const match = item.variations.find(
        (v) => v.name.toLowerCase() === defaultType.toLowerCase() && v.inStock,
      );
      if (match) {
        setSelectedVariation(match);
      }
    }
    setDidAutoSelect(true);
  }

  if (!item) return null;

  const data = isClassic ? item.classic : item.healthy;
  const rawImage = isClassic ? item.image : item.healthyImage || item.image;
  const imageUrl = rawImage ? cloudinaryUrl(rawImage) : undefined;
  const accent = isClassic ? '#9A1E29' : '#4AA056';
  const accentLight = isClassic ? '#FAF8F4' : '#F0FAF3';
  const mode = isClassic ? 'classic' : 'healthy';

  const basePrice = selectedVariation
    ? selectedVariation.price
    : data.price;

  const addonTotal = Object.entries(selectedAddons).reduce((sum, [addonId, qty]) => {
    if (qty <= 0) return sum;
    for (const group of item.addonGroups || []) {
      const addon = group.addons.find((a) => a.id === addonId);
      if (addon) return sum + addon.price * qty;
    }
    return sum;
  }, 0);

  const totalPrice = (basePrice + addonTotal) * quantity;

  const isOutOfStock = item.inStock === false;

  const toggleAddon = (addonId: string) => {
    setSelectedAddons((prev) => ({
      ...prev,
      [addonId]: prev[addonId] ? 0 : 1,
    }));
  };

  const handleAddToCart = () => {
    const addons = Object.entries(selectedAddons)
      .filter(([, qty]) => qty > 0)
      .map(([addonId, qty]) => {
        for (const group of item.addonGroups || []) {
          const addon = group.addons.find((a) => a.id === addonId);
          if (addon) return { addonId, name: addon.name, price: addon.price, quantity: qty };
        }
        return { addonId, name: '', price: 0, quantity: qty };
      });

    addItem({
      menuItemId: item.id,
      quantity,
      mode,
      classicName: item.classic.name,
      healthyName: item.healthy.name,
      classicPrice: item.classic.price,
      healthyPrice: item.healthy.price,
      image: item.image,
      healthyImage: item.healthyImage,
      diet: item.diet,
      inStock: item.inStock,
      variationId: selectedVariation?.id,
      variationName: selectedVariation?.name,
      variationPrice: selectedVariation?.price,
      addons,
    });
    setOpen(true);
    onClose();
  };

  return createPortal(
    <AnimatePresence>
      <div className="fixed inset-0 z-[110]">
        <motion.div
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        />

        <motion.div
          className="absolute bottom-0 left-0 right-0 md:bottom-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:max-w-[480px] md:rounded-2xl bg-white rounded-t-3xl overflow-hidden max-h-[85vh] flex flex-col"
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '100%', opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        >
          {/* Close handle (mobile) */}
          <div className="flex justify-center py-2 md:hidden flex-shrink-0">
            <div className="w-10 h-1 rounded-full bg-gray-200" />
          </div>

          {/* Close button (desktop) */}
          <button
            onClick={onClose}
            className="hidden md:flex absolute top-3 right-3 z-10 w-8 h-8 items-center justify-center rounded-full bg-white/90 shadow-sm text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M1 1L11 11M11 1L1 11" />
            </svg>
          </button>

          <div className="overflow-y-auto flex-1 min-h-0">
            {/* Image */}
            {imageUrl && (
              <div
                className="relative aspect-[16/9] w-full"
                style={{
                  background: isClassic
                    ? 'linear-gradient(160deg, #FFF8E7 0%, #FFE9B0 50%, #FFDEA0 100%)'
                    : 'linear-gradient(160deg, #E8F8EC 0%, #C5E8CF 50%, #B8E0C4 100%)',
                }}
              >
                <Image src={imageUrl} alt={data.name} fill sizes="(max-width: 768px) 100vw, 672px" className="object-cover drop-shadow-xl" />
              </div>
            )}

            <div className="px-5 py-4 space-y-4">
              {/* Header */}
              <div>
                <div className="flex items-center gap-2 mb-1">
                  {item.diet === 'veg' ? <VegIcon size={14} /> : <NonVegIcon size={14} />}
                  {isOutOfStock && (
                    <span className="text-[0.625rem] font-bold text-red-500 uppercase bg-red-50 px-2 py-0.5 rounded">
                      Out of Stock
                    </span>
                  )}
                </div>
                <h3 className="text-xl font-bold text-gray-900">{data.name}</h3>
                <p className="text-sm text-gray-400 mt-1">{data.description}</p>

                {/* Nutrition chips */}
                <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                  <span
                    className="text-[0.625rem] px-2 py-[3px] rounded-full font-medium"
                    style={{ backgroundColor: accentLight, color: accent }}
                  >
                    {data.calories} cal
                  </span>
                  {!isClassic && (
                    <>
                      <span className="text-[0.625rem] px-2 py-[3px] rounded-full bg-emerald-50 text-emerald-600 font-medium">
                        {item.healthy.protein}g protein
                      </span>
                      <span className="text-[0.625rem] px-2 py-[3px] rounded-full bg-purple-50 text-purple-600 font-medium">
                        {item.healthy.fats}g fat
                      </span>
                      <span className="text-[0.625rem] px-2 py-[3px] rounded-full bg-blue-50 text-blue-600 font-medium">
                        {item.healthy.carbs}g carb
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* Variations */}
              {item.variations && item.variations.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wide mb-2">
                    {item.variations[0]?.groupName || (config.catalog?.variant_types?.[0] !== 'default' ? config.catalog.variant_types[0] : 'Size')}
                  </h4>
                  <div className="space-y-1.5">
                    {item.variations.map((v) => (
                      <button
                        key={v.id}
                        onClick={() => setSelectedVariation(v.id === selectedVariation?.id ? null : v)}
                        disabled={!v.inStock}
                        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl border transition-all text-sm ${
                          !v.inStock ? 'opacity-40 cursor-not-allowed' : ''
                        }`}
                        style={{
                          borderColor: selectedVariation?.id === v.id ? accent : '#E5E7EB',
                          backgroundColor: selectedVariation?.id === v.id ? accentLight : 'white',
                        }}
                      >
                        <span className="font-medium text-gray-700">{v.name}</span>
                        <span className="font-bold" style={{ color: accent }}>
                          {currencySymbol}{v.price}
                          {!v.inStock && (
                            <span className="text-[0.625rem] text-red-400 ml-1">Unavailable</span>
                          )}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Addon Groups */}
              {item.addonGroups?.map((group) => (
                <div key={group.id}>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wide">
                      {group.name}
                    </h4>
                    {group.maxSelection > 0 && (
                      <span className="text-[0.625rem] text-gray-400">
                        {group.minSelection > 0 ? `Choose ${group.minSelection}-${group.maxSelection}` : `Up to ${group.maxSelection}`}
                      </span>
                    )}
                  </div>
                  <div className="space-y-1">
                    {group.addons.map((addon) => {
                      const isSelected = (selectedAddons[addon.id] || 0) > 0;
                      return (
                        <button
                          key={addon.id}
                          onClick={() => toggleAddon(addon.id)}
                          disabled={!addon.inStock}
                          className={`w-full flex items-center justify-between px-3 py-2 rounded-lg border transition-all text-sm ${
                            !addon.inStock ? 'opacity-40 cursor-not-allowed' : ''
                          }`}
                          style={{
                            borderColor: isSelected ? accent : '#F3F4F6',
                            backgroundColor: isSelected ? accentLight : '#FAFAFA',
                          }}
                        >
                          <div className="flex items-center gap-2">
                            <div
                              className="w-4 h-4 rounded border-2 flex items-center justify-center transition-colors"
                              style={{
                                borderColor: isSelected ? accent : '#D1D5DB',
                                backgroundColor: isSelected ? accent : 'transparent',
                              }}
                            >
                              {isSelected && (
                                <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <path d="M2 5L4 7L8 3" />
                                </svg>
                              )}
                            </div>
                            <span className="font-medium text-gray-700">{addon.name}</span>
                          </div>
                          <span className="text-xs font-semibold text-gray-500">
                            {addon.price > 0 ? `+${currencySymbol}${addon.price}` : 'Free'}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="px-5 py-4 border-t border-gray-100 bg-white" style={{ paddingBottom: 'max(1rem, env(safe-area-inset-bottom, 1rem))' }}>
            <div className="flex items-center gap-3">
              {/* Quantity */}
              <div
                className="flex items-center rounded-xl overflow-hidden border"
                style={{ borderColor: isClassic ? '#F5E6C4' : '#D8EAD8' }}
              >
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-9 h-10 flex items-center justify-center text-gray-500 hover:bg-gray-50 text-lg"
                >
                  -
                </button>
                <span className="w-8 h-10 flex items-center justify-center text-sm font-bold">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-9 h-10 flex items-center justify-center hover:bg-gray-50 text-lg font-bold"
                  style={{ color: accent }}
                >
                  +
                </button>
              </div>

              {/* Add to cart */}
              <button
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className={`flex-1 flex items-center justify-center gap-2 h-10 rounded-xl text-sm font-bold text-white transition-all ${
                  isOutOfStock ? 'opacity-50 cursor-not-allowed' : 'active:scale-[0.98]'
                }`}
                style={{ backgroundColor: accent }}
              >
                <span>Add to Cart</span>
                <span className="text-white/80">·</span>
                <span>{currencySymbol}{totalPrice}</span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>,
    document.body
  );
}
