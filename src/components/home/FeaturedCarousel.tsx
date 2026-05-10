'use client';

import { useState, useEffect } from 'react';
import { useMode } from '@/hooks/useMode';
import { catalogItemToMenuItem, type MenuItem } from '@/lib/menu-adapter';
import { TZ } from '@/lib/tz';
import MenuItemCard from '../MenuItemCard';
import ItemDetailModal from '../menu/ItemDetailModal';
import Link from 'next/link';
import Skeleton from '@/components/Skeleton';

interface ExtendedMenuItem extends MenuItem {
  variations?: { id: string; name: string; groupName: string; price: number; inStock: boolean }[];
  addonGroups?: { id: string; name: string; minSelection: number; maxSelection: number; addons: { id: string; name: string; price: number; inStock: boolean }[] }[];
}

export default function FeaturedCarousel() {
  const { isClassic } = useMode();
  const [selectedItem, setSelectedItem] = useState<ExtendedMenuItem | null>(null);
  const [featured, setFeatured] = useState<ExtendedMenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadFeatured() {
      try {
        const [cats, itemsRes] = await Promise.all([
          TZ.storefront.catalog.getCategories(),
          TZ.storefront.catalog.getItems(),
        ]);
        const items: any[] = (itemsRes as any)?.data ?? itemsRes;
        const categoryMap = new Map(cats.map((c) => [c.id, c.name]));
        const mapped: ExtendedMenuItem[] = items
          .filter((item) => item.isFeatured)
          .map((item) => {
            const mi = catalogItemToMenuItem(item, categoryMap.get(item.categoryId));
            return {
              ...mi,
              variations: mi.sizeVariations.map((sv: any) => ({
                id: sv.id,
                name: sv.name,
                groupName: sv.groupName,
                price: sv.price,
                inStock: sv.inStock,
              })),
              addonGroups: mi.optionGroups.map((og: any) => ({
                id: og.id,
                name: og.name,
                minSelection: og.minSelection,
                maxSelection: og.maxSelection,
                addons: og.options.map((o: any) => ({
                  id: o.id,
                  name: o.name,
                  price: o.price,
                  inStock: o.inStock,
                })),
              })),
            };
          });
        setFeatured(mapped);
      } catch (err) {
        console.error('Failed to load featured items:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadFeatured();
  }, []);

  return (
    <section id="featured-menu" className="py-14 px-5 bg-white has-pattern">
      <div className="max-w-[1200px] mx-auto">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-2xl md:text-[1.75rem] font-black text-gray-900" style={{ fontFamily: "var(--font-poppins)" }}>
              {isClassic ? 'Everyone\'s Obsessed With These' : 'Healthy Never Tasted This Good'}
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              {isClassic ? 'The ones that keep people coming back for more' : 'Community favorites that prove clean eating is delicious'}
            </p>
          </div>
          <Link
            href="/menu"
            className="hidden md:inline-flex items-center gap-1 text-sm font-semibold transition-colors duration-300 hover:gap-2"
            style={{ color: isClassic ? '#9A1E29' : '#4AA056' }}
          >
            Explore the Full Menu →
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="bg-white rounded-[20px] overflow-hidden">
                <Skeleton className="aspect-[4/3] w-full rounded-none" />
                <div className="p-4 space-y-3">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-1/2" />
                  <div className="flex items-center justify-between pt-2">
                    <Skeleton className="h-6 w-16" />
                    <Skeleton className="h-9 w-20 rounded-xl" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : featured.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-gray-400 text-sm">No featured items available right now.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {featured.map((item, i) => (
              <MenuItemCard
                key={item.id}
                item={item}
                index={i}
                onAddToCart={(clickedItem) => {
                  setSelectedItem(clickedItem as ExtendedMenuItem);
                }}
              />
            ))}
          </div>
        )}

        <div className="mt-8 text-center md:hidden">
          <Link href="/menu" className="text-sm font-semibold" style={{ color: isClassic ? '#9A1E29' : '#4AA056' }}>
            Explore the Full Menu →
          </Link>
        </div>
      </div>

      {selectedItem && (
        <ItemDetailModal
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
        />
      )}
    </section>
  );
}
