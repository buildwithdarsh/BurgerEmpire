'use client';

import { useState } from 'react';
import Image from 'next/image';
import { cloudinaryUrl } from '@/lib/cloudinary-url';
import { BurgerIcon, TrophyIcon } from '@/components/icons';

interface Addon {
  id: string;
  name: string;
  price: number;
  inStock: boolean;
}

interface AddonGroup {
  id: string;
  name: string;
  minSelection: number;
  maxSelection: number;
  addons: Addon[];
}

interface Variation {
  id: string;
  name: string;
  groupName: string;
  price: number;
  inStock: boolean;
}

export interface KioskModalItem {
  id: string;
  image?: string;
  healthyImage?: string;
  diet: 'veg' | 'nonveg' | 'egg';
  isBestseller: boolean;
  isNew: boolean;
  classic: { name: string; description: string; price: number; calories: number };
  healthy: { name: string; description: string; price: number; calories: number };
  variations: Variation[];
  addonGroups: AddonGroup[];
}

export interface KioskAddonRef {
  addonId: string;
  addonName: string;
  price: number;
  quantity: number;
}

export interface KioskItemConfig {
  variationId?: string;
  variationName?: string;
  addons: KioskAddonRef[];
  quantity: number;
  unitPrice: number;
}

interface Props {
  item: KioskModalItem;
  mode: 'classic' | 'healthy';
  onClose: () => void;
  onConfirm: (config: KioskItemConfig) => void;
}

const DIET_DOT: Record<string, string> = {
  veg: '#22C55E',
  nonveg: '#EF4444',
  egg: '#EAB308',
};

export default function KioskItemModal({ item, mode, onClose, onConfirm }: Props) {
  const [selectedVariation, setSelectedVariation] = useState<Variation | null>(null);
  const [selectedAddons, setSelectedAddons] = useState<Record<string, boolean>>({});
  const [quantity, setQuantity] = useState(1);

  const data = mode === 'healthy' ? item.healthy : item.classic;
  const rawImage = mode === 'healthy' ? item.healthyImage : item.image;
  const image = rawImage ? cloudinaryUrl(rawImage) : undefined;
  const accent = mode === 'healthy' ? '#4AA056' : '#EB7A29';
  const accentLight = mode === 'healthy' ? '#EDF7F0' : '#FDF5EC';
  const accentGlow = mode === 'healthy' ? 'rgba(74,160,86,0.2)' : 'rgba(235,122,41,0.2)';

  const basePrice = selectedVariation ? selectedVariation.price : data.price;
  const addonTotal = item.addonGroups.reduce(
    (sum, group) => sum + group.addons.reduce((s, a) => s + (selectedAddons[a.id] && a.inStock ? a.price : 0), 0),
    0
  );
  const unitPrice = basePrice + addonTotal;
  const totalPrice = unitPrice * quantity;

  const toggleAddon = (addon: Addon, group: AddonGroup) => {
    setSelectedAddons((prev) => {
      if (prev[addon.id]) {
        const next = { ...prev };
        delete next[addon.id];
        return next;
      }
      const groupCount = group.addons.filter((a) => prev[a.id]).length;
      if (group.maxSelection > 0 && groupCount >= group.maxSelection) return prev;
      return { ...prev, [addon.id]: true };
    });
  };

  const handleConfirm = () => {
    const addons: KioskAddonRef[] = item.addonGroups.flatMap((group) =>
      group.addons
        .filter((a) => selectedAddons[a.id])
        .map((a) => ({ addonId: a.id, addonName: a.name, price: a.price, quantity: 1 }))
    );
    onConfirm({ variationId: selectedVariation?.id, variationName: selectedVariation?.name, addons, quantity, unitPrice });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Modal — light surface matching main site */}
      <div className="relative bg-white rounded-3xl w-full max-w-2xl max-h-[92vh] flex flex-col overflow-hidden shadow-2xl">
        {/* Image */}
        <div
          className="relative h-52 shrink-0 flex items-center justify-center"
          style={{
            background: mode === 'healthy'
              ? 'linear-gradient(160deg, #E8F8EC 0%, #C5E8CF 50%, #B8E0C4 100%)'
              : 'linear-gradient(160deg, #FFF8E7 0%, #FFE9B0 50%, #FFDEA0 100%)',
          }}
        >
          {image ? (
            <Image src={image} alt={data.name} fill className="object-contain p-6 drop-shadow-xl" sizes="672px" />
          ) : (
            <BurgerIcon size={72} color={mode === 'healthy' ? '#4AA056' : '#EB7A29'} className="opacity-40" />
          )}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/80 hover:bg-white text-gray-500 flex items-center justify-center text-lg shadow transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
          {/* Item info */}
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span
                className="w-3 h-3 rounded-sm border shrink-0"
                style={{ backgroundColor: DIET_DOT[item.diet], borderColor: '#E5E7EB' }}
              />
              {item.isBestseller && (
                <span className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-bold text-white" style={{ backgroundColor: '#EB7A29' }}>
                  <TrophyIcon size={12} color="white" /> Best Seller
                </span>
              )}
              {item.isNew && (
                <span className="text-xs px-2 py-0.5 rounded-full font-bold text-white bg-blue-500">NEW</span>
              )}
            </div>
            <h2 className="text-2xl font-black leading-tight" style={{ color: '#1A1A1A' }}>
              {data.name}
            </h2>
            <p className="text-gray-400 text-sm mt-1">{data.description}</p>
            {data.calories > 0 && <p className="text-gray-300 text-xs mt-1">{data.calories} kcal</p>}
          </div>

          {/* Variations */}
          {item.variations.length > 0 && (
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider mb-3" style={{ color: '#1A1A1A' }}>
                {item.variations[0]?.groupName || 'Size'}
                <span className="text-gray-400 font-normal normal-case ml-1">— pick one (optional)</span>
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {item.variations.map((v) => (
                  <button
                    key={v.id}
                    onClick={() => setSelectedVariation(v.id === selectedVariation?.id ? null : v)}
                    disabled={!v.inStock}
                    className="flex items-center justify-between px-4 py-3 rounded-xl border-2 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                    style={{
                      borderColor: selectedVariation?.id === v.id ? accent : '#E5E7EB',
                      backgroundColor: selectedVariation?.id === v.id ? accentLight : '#FAFAFA',
                    }}
                  >
                    <span className="font-semibold text-sm" style={{ color: '#1A1A1A' }}>{v.name}</span>
                    <span className="font-black text-sm" style={{ color: accent }}>₹{v.price}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Addon groups */}
          {item.addonGroups.map((group) => {
            const inStockAddons = group.addons.filter((a) => a.inStock);
            if (!inStockAddons.length) return null;
            const groupSelected = inStockAddons.filter((a) => selectedAddons[a.id]).length;
            return (
              <div key={group.id}>
                <h3 className="text-sm font-bold uppercase tracking-wider mb-3" style={{ color: '#1A1A1A' }}>
                  {group.name}
                  {group.maxSelection > 0 && (
                    <span className="text-gray-400 font-normal normal-case ml-1">
                      — {group.minSelection > 0 ? `choose ${group.minSelection}–${group.maxSelection}` : `up to ${group.maxSelection}`}
                    </span>
                  )}
                  {groupSelected > 0 && (
                    <span className="ml-2 text-xs font-bold" style={{ color: accent }}>
                      {groupSelected} selected
                    </span>
                  )}
                </h3>
                <div className="space-y-2">
                  {inStockAddons.map((addon) => {
                    const isSelected = !!selectedAddons[addon.id];
                    return (
                      <button
                        key={addon.id}
                        onClick={() => toggleAddon(addon, group)}
                        className="w-full flex items-center justify-between px-4 py-3.5 rounded-xl border-2 transition-all text-left"
                        style={{
                          borderColor: isSelected ? accent : '#F3F4F6',
                          backgroundColor: isSelected ? accentLight : '#FAFAFA',
                        }}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className="w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 transition-all"
                            style={{
                              borderColor: isSelected ? accent : '#D1D5DB',
                              backgroundColor: isSelected ? accent : 'transparent',
                            }}
                          >
                            {isSelected && (
                              <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M2 5L4 7L8 3" />
                              </svg>
                            )}
                          </div>
                          <span className="font-medium text-sm" style={{ color: '#1A1A1A' }}>{addon.name}</span>
                        </div>
                        <span className="font-semibold text-sm text-gray-400">
                          {addon.price > 0 ? `+₹${addon.price}` : 'Free'}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="px-6 py-5 border-t border-gray-100">
          <div className="flex items-center gap-4">
            {/* Quantity stepper */}
            <div className="flex items-center gap-3 rounded-xl px-3 py-2 border border-gray-200 bg-gray-50 shrink-0">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="w-9 h-9 rounded-full bg-white border border-gray-200 font-bold text-xl flex items-center justify-center transition-colors hover:bg-gray-100"
                style={{ color: '#1A1A1A' }}
              >
                −
              </button>
              <span className="font-black text-xl w-6 text-center" style={{ color: '#1A1A1A' }}>
                {quantity}
              </span>
              <button
                onClick={() => setQuantity((q) => q + 1)}
                className="w-9 h-9 rounded-full font-bold text-xl flex items-center justify-center transition-colors text-white"
                style={{ backgroundColor: accent }}
              >
                +
              </button>
            </div>

            {/* Add to order */}
            <button
              onClick={handleConfirm}
              className="flex-1 py-4 rounded-xl text-lg font-black text-white transition-all flex items-center justify-between px-5"
              style={{ backgroundColor: accent, boxShadow: `0 4px 16px ${accentGlow}` }}
            >
              <span>Add to Order</span>
              <span>₹{totalPrice.toFixed(0)}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
