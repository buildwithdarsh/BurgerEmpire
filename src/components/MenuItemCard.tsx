// @ts-nocheck — React 19 + framer-motion@11 type incompatibility (motion.div children typed as unknown)
'use client';

import { useMode } from '@/hooks/useMode';
import { useConfig } from '@/hooks/useConfig';
import PriceTag from './PriceTag';
import type { MenuItem } from '@/lib/menu-adapter';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { BurgerIcon, LeafIcon, VegIcon, NonVegIcon, PlusIcon, FireIcon, StarIcon, SlidersIcon } from './icons';
import Image from 'next/image';
import { cloudinaryUrl } from '@/lib/cloudinary-url';
import { motion } from 'framer-motion';

interface ExtendedMenuItem extends MenuItem {
  variations?: unknown[];
  addonGroups?: unknown[];
  avgRating?: number;
  reviewCount?: number;
  allergens?: string[];
}

interface MenuItemCardProps {
  item: ExtendedMenuItem;
  index: number;
  onAddToCart?: (item: ExtendedMenuItem) => void;
}

// Decorative burger-bun shaped SVG clip for the image area
function BunClipBottom({ color }: { color: string }) {
  return (
    <svg
      className="absolute bottom-0 left-0 w-full"
      viewBox="0 0 400 30"
      preserveAspectRatio="none"
      style={{ height: '20px' }}
    >
      <path
        d="M0,30 L0,12 Q50,0 100,8 Q150,18 200,6 Q250,-4 300,10 Q350,20 400,8 L400,30 Z"
        fill={color}
      />
    </svg>
  );
}

// Small decorative corner SVG — burger bun shape for classic, leaf for healthy
function CornerDecor({ isClassic }: { isClassic: boolean }) {
  if (isClassic) {
    return (
      <svg className="absolute -bottom-1 -right-1 w-[48px] h-[48px] opacity-[0.07]" viewBox="0 0 48 48">
        <path d="M8 28C8 20 16 12 24 12C32 12 40 20 40 28H8Z" fill="#C06820" />
        <rect x="6" y="29" width="36" height="5" rx="2.5" fill="#4E342E" />
        <path d="M6 36H42C42 42 34 46 24 46C14 46 6 42 6 36Z" fill="#C06820" />
      </svg>
    );
  }
  return (
    <svg className="absolute -bottom-1 -right-1 w-[48px] h-[48px] opacity-[0.07]" viewBox="0 0 48 48">
      <path d="M12 28C12 28 18 24 24 18C30 12 38 8 38 8C38 8 36 18 28 24C20 30 12 28 12 28Z" fill="#4AA056" />
      <path d="M24 18L16 38" stroke="#3D8A48" strokeWidth="2" />
    </svg>
  );
}

function RatingDisplay({ show, avgRating, reviewCount }: { show: boolean; avgRating: number; reviewCount: number }) {
  if (!show) return null;
  return (
    <div className="flex items-center gap-1 mb-2">
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg key={star} className="w-3 h-3" fill={star <= Math.round(avgRating) ? '#F59E0B' : '#E5E7EB'} viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
      <span className="text-[0.625rem] text-gray-500 font-medium">
        {avgRating.toFixed(1)} ({reviewCount})
      </span>
    </div>
  );
}

export default function MenuItemCard({ item, index, onAddToCart }: MenuItemCardProps) {
  const { isClassic } = useMode();
  const { config } = useConfig();
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.05 });
  const data = isClassic ? item.classic : item.healthy;
  const rawImage = isClassic ? item.image : (item.healthyImage || item.image);
  const imageUrl = rawImage ? cloudinaryUrl(rawImage) : undefined;
  const isOutOfStock = item.inStock === false;
  const hasAddons = (item.addonGroups?.length ?? 0) > 0;

  // If show_out_of_stock is false and item is out of stock, don't render
  if (isOutOfStock && !config.catalog.show_out_of_stock) return null;

  const accentDark = isClassic ? '#9A1E29' : '#4AA056';
  const showRating = config.catalog.show_ratings && (item.avgRating ?? 0) > 0;

  const handleClick = () => {
    if (!isOutOfStock && onAddToCart) {
      onAddToCart(item);
    }
  };

  return (
    <motion.div
      ref={ref}
      className={`group relative bg-white rounded-[20px] overflow-hidden cursor-pointer ${isOutOfStock ? 'opacity-60' : ''}`}
      style={{
        border: `1.5px solid ${isClassic ? '#F5E6C4' : '#D8EAD8'}`,
      }}
      initial={{ opacity: 0, y: 30 }}
      animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.5, delay: Math.min(index * 0.06, 0.3), ease: [0.16, 1, 0.3, 1] }}
      whileHover={isOutOfStock ? undefined : { y: -6 }}
      onClick={handleClick}
    >
      {/* Image area with wavy bottom */}
      <div
        className="relative aspect-[4/3] overflow-hidden"
        style={{
          background: isClassic
            ? 'linear-gradient(160deg, #FFF8E7 0%, #FFE9B0 50%, #FFDEA0 100%)'
            : 'linear-gradient(160deg, #E8F8EC 0%, #C5E8CF 50%, #B8E0C4 100%)',
        }}
      >
        {imageUrl ? (
          <motion.div
            className="w-full h-full"
            whileHover={{ scale: 1.08 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <Image
              src={imageUrl}
              alt={data.name}
              fill
              className="object-cover drop-shadow-md"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            />
          </motion.div>
        ) : (
          <motion.div
            className="w-full h-full flex items-center justify-center"
            whileHover={{ scale: 1.06 }}
            transition={{ duration: 0.6 }}
          >
            {isClassic ? (
              <BurgerIcon size={80} color="#D46E1F" className="opacity-60" />
            ) : (
              <LeafIcon size={80} color="#4AA056" className="opacity-50" />
            )}
          </motion.div>
        )}

        {/* Wavy bun-shaped bottom clip */}
        <BunClipBottom color="white" />

        {/* Top-left badges */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5">
          {config.catalog.show_diet_badges && (item.diet === 'veg' ? <VegIcon size={14} /> : <NonVegIcon size={14} />)}
          {item.isBestseller && (
            <span className="flex items-center gap-0.5 text-[0.5625rem] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-amber-500/90 text-white backdrop-blur-sm">
              <StarIcon size={10} color="white" /> Best
            </span>
          )}
          {item.isNew && (
            <span className="flex items-center gap-0.5 text-[0.5625rem] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-blue-500/90 text-white backdrop-blur-sm">
              <FireIcon size={10} color="white" /> New
            </span>
          )}
        </div>

        {/* Out of stock overlay */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
            <span className="text-sm font-bold text-red-500 bg-white px-4 py-1.5 rounded-full shadow-sm">
              Out of Stock
            </span>
          </div>
        )}

        {/* Quick add floating button */}
        {!isOutOfStock && (
          <motion.button
            className="absolute bottom-5 right-3 w-9 h-9 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            style={{ backgroundColor: accentDark }}
            whileHover={{ scale: 1.1 }}
            onClick={(e) => {
              e.stopPropagation();
              if (onAddToCart) onAddToCart(item);
            }}
            aria-label={`Add ${data.name} to cart`}
          >
            <PlusIcon size={16} color="white" />
          </motion.button>
        )}
      </div>

      {/* Content */}
      <div className="relative px-4 pb-4 pt-1">
        {/* Decorative corner element */}
        <CornerDecor isClassic={isClassic} />

        <h3 className="text-[0.875rem] font-semibold text-gray-900 mb-1 line-clamp-1 tracking-[-0.01em]">
          {data.name}
        </h3>

        <p className="text-[0.75rem] text-gray-600 mb-1.5 line-clamp-1 leading-relaxed">
          {data.description}
        </p>

        {/* Review rating */}
        <RatingDisplay show={showRating} avgRating={item.avgRating ?? 0} reviewCount={item.reviewCount ?? 0} />

        {/* Allergen badges */}
        {config.catalog.show_allergens && item.allergens && item.allergens.length > 0 && (
          <div className="flex items-center gap-1 mb-2 flex-wrap">
            {item.allergens.map((allergen) => (
              <span
                key={allergen}
                className="text-[0.5625rem] px-1.5 py-[2px] rounded-md font-medium bg-red-50 text-red-600 border border-red-100"
              >
                {allergen}
              </span>
            ))}
          </div>
        )}

        {/* Nutrition info */}
        {config.catalog.show_nutrition && (item as unknown as Record<string, unknown>).nutritionInfo && (
          <div className="text-[0.625rem] text-gray-500 mb-2">
            {String((item as unknown as Record<string, unknown>).nutritionInfo)}
          </div>
        )}

        {/* Chips */}
        <div className="flex items-center gap-1.5 mb-3 flex-wrap">
          {config.catalog.show_calories && (
            <span
              className="text-[0.625rem] px-2 py-[3px] rounded-full font-medium"
              style={{
                backgroundColor: isClassic ? '#FAF8F4' : '#F0FAF3',
                color: isClassic ? '#B8860B' : '#3D8A48',
              }}
            >
              {data.calories} cal
            </span>
          )}
          {/* {hasAddons && (
            <span
              className="flex items-center gap-[3px] text-[0.625rem] px-2 py-[3px] rounded-full font-medium"
              style={{ backgroundColor: '#F5F0FF', color: '#7C3AED' }}
            >
              <SlidersIcon size={9} color="#7C3AED" />
              Customisable
            </span>
          )} */}
          {!isClassic && (
            <>
              <span className="text-[0.625rem] px-2 py-[3px] rounded-full bg-emerald-50 text-emerald-600 font-medium">
                {item.healthy.protein}g protein
              </span>
              <span className="text-[0.625rem] px-2 py-[3px] rounded-full font-medium" style={{ backgroundColor: '#F5F3FF', color: '#8B5CF6' }}>
                {item.healthy.fats}g fat
              </span>
              <span className="text-[0.625rem] px-2 py-[3px] rounded-full font-medium" style={{ backgroundColor: '#EFF6FF', color: '#3B82F6' }}>
                {item.healthy.carbs}g carb
              </span>
            </>
          )}
        </div>

        {/* Price row with themed divider */}
        <div
          className="flex items-center justify-between pt-3"
          style={{ borderTop: `1.5px dashed ${isClassic ? '#F5E6C4' : '#D8EAD8'}` }}
        >
          <PriceTag classicPrice={item.classic.price} healthyPrice={item.healthy.price} size="sm" />
          <span
            className={`text-[0.6875rem] font-bold uppercase tracking-wide px-3 py-1 rounded-full transition-all duration-300 group-hover:text-white ${
              isOutOfStock ? 'opacity-40 cursor-not-allowed' : ''
            }`}
            style={{
              color: accentDark,
              backgroundColor: 'transparent',
              border: `1.5px solid ${isClassic ? '#F5E6C4' : '#D8EAD8'}`,
            }}
            onMouseEnter={(e) => {
              if (isOutOfStock) return;
              e.currentTarget.style.backgroundColor = accentDark;
              e.currentTarget.style.color = 'white';
              e.currentTarget.style.borderColor = accentDark;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = accentDark;
              e.currentTarget.style.borderColor = isClassic ? '#F5E6C4' : '#D8EAD8';
            }}
          >
            {isOutOfStock ? 'Unavailable' : 'Add +'}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
