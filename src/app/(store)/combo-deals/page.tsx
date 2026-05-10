'use client';

import { useState, useEffect } from 'react';
import { useMode } from '@/hooks/useMode';
import { catalogItemToMenuItem, type MenuItem } from '@/lib/menu-adapter';
import { TZ } from '@/lib/tz';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import Link from 'next/link';
import { BurgerIcon, FriesIcon, ShakeIcon, LeafIcon } from '@/components/icons';
import WaveDivider from '@/components/WaveDivider';
import ItemDetailModal from '@/components/menu/ItemDetailModal';
import Skeleton from '@/components/Skeleton';

function AnimatedSection({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const { ref, isVisible } = useScrollAnimation();
  return (
    <div ref={ref} style={{ opacity: isVisible ? 1 : 0, transform: isVisible ? 'translateY(0)' : 'translateY(25px)', transition: `opacity 500ms ${delay}ms ease-out, transform 500ms ${delay}ms ease-out` }}>
      {children}
    </div>
  );
}

interface ExtendedMenuItem extends MenuItem {
  variations?: { id: string; name: string; groupName: string; price: number; inStock: boolean }[];
  addonGroups?: { id: string; name: string; minSelection: number; maxSelection: number; addons: { id: string; name: string; price: number; inStock: boolean }[] }[];
}

export default function ComboDealsPage() {
  const { isClassic } = useMode();
  const [combos, setCombos] = useState<ExtendedMenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<ExtendedMenuItem | null>(null);

  useEffect(() => {
    async function loadCombos() {
      try {
        const [cats, itemsRes] = await Promise.all([
          TZ.storefront.catalog.getCategories(),
          TZ.storefront.catalog.getItems(),
        ]);
        const items: any[] = (itemsRes as any)?.data ?? itemsRes;
        const comboCategory = cats.find(
          (c) => c.name.toLowerCase() === 'combos' || c.slug === 'combos'
        );
        if (comboCategory) {
          const comboItems = items
            .filter((item) => item.categoryId === comboCategory.id)
            .map((item) => {
              const mi = catalogItemToMenuItem(item, comboCategory.name);
              return { ...mi, inStock: mi.inStock, variations: [], addonGroups: [] } as ExtendedMenuItem;
            });
          setCombos(comboItems);
        }
      } catch (err) {
        console.error('Failed to load combos:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadCombos();
  }, []);

  const heroEdge = isClassic ? '#7A1722' : '#3D8A48';
  const light = isClassic ? '#FFF9F0' : '#F5FBF7';

  return (
    <div className="min-h-screen has-pattern" style={{ backgroundColor: light }}>
      {/* Header */}
      <section
        className="py-12 px-5"
        style={{
          background: isClassic
            ? 'linear-gradient(135deg, #9A1E29, #7A1722)'
            : 'linear-gradient(135deg, #4AA056, #3D8A48)',
        }}
      >
        <div className="max-w-[1200px] mx-auto">
          <h1
            className="text-3xl md:text-4xl font-black text-white mb-2"
            style={{ fontFamily: "var(--font-hero)" }}
          >
            {isClassic ? 'Burger Empire Combo Deals from ₹149' : 'Healthy Combo Meals at Burger Empire'}
          </h1>
          <p className="text-sm text-white/70">
            {isClassic ? 'Burger + fries + drink at prices that make you smile.' : 'Balanced macros, incredible flavor, one simple price.'}
          </p>
        </div>
      </section>

      <WaveDivider variant="curve" topColor={heroEdge} bottomColor={light} />

      {/* Combos */}
      <section className="py-10 px-5">
        <div className="max-w-[1200px] mx-auto flex flex-col gap-6">
          {isLoading ? (
            Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="rounded-xl lg:rounded-2xl overflow-hidden p-8" style={{ background: isClassic ? 'linear-gradient(135deg, #EB7A29, #D46E1F)' : 'linear-gradient(135deg, #4AA056, #3D8A48)' }}>
                <div className="flex flex-col md:flex-row items-center gap-8">
                  <div className="flex-1 space-y-3">
                    <Skeleton className="h-3 w-24 !bg-white/20" />
                    <Skeleton className="h-8 w-3/4 !bg-white/20" />
                    <Skeleton className="h-4 w-full !bg-white/20" />
                    <Skeleton className="h-10 w-32 !bg-white/20 rounded-xl" />
                  </div>
                </div>
              </div>
            ))
          ) : combos.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-600 text-lg">No combos available right now</p>
              <p className="text-gray-400 text-sm mt-1">Check back soon for awesome deals!</p>
            </div>
          ) : combos.map((combo, i) => {
            const data = isClassic ? combo.classic : combo.healthy;
            return (
              <AnimatedSection key={combo.id} delay={i * 80}>
                <div
                  className="rounded-xl lg:rounded-2xl overflow-hidden transition-all"
                  style={{
                    background: isClassic
                      ? 'linear-gradient(135deg, #EB7A29, #D46E1F)'
                      : 'linear-gradient(135deg, #4AA056, #3D8A48)',
                  }}
                >
                  <div className="flex flex-col md:flex-row items-center p-8 md:p-10 gap-8">
                    <div className="flex-1">
                      <span className="text-[0.625rem] font-bold uppercase tracking-widest text-white/50 block mb-2">
                        {isClassic ? 'Most Popular' : 'Perfectly Balanced'}
                      </span>
                      <h2 className="text-2xl md:text-3xl font-black text-white mb-3" style={{ fontFamily: "var(--font-poppins)" }}>
                        {data.name}
                      </h2>
                      <p className="text-sm text-white/70 mb-2 leading-relaxed">{data.description}</p>
                      <div className="flex items-center gap-2 mb-6">
                        <span className="text-[0.6875rem] px-2 py-1 rounded bg-white/10 text-white/80">{data.calories} cal</span>
                        {!isClassic && (
                          <span className="text-[0.6875rem] px-2 py-1 rounded bg-white/10 text-white/80">{combo.healthy.protein}g protein</span>
                        )}
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-3xl font-black text-white">₹{data.price}</span>
                        <button
                          onClick={() => setSelectedItem(combo)}
                          className="px-6 py-3 rounded-md lg:rounded-xl text-sm font-bold bg-white transition-colors"
                          style={{ color: isClassic ? '#9A1E29' : '#3D8A48' }}
                        >
                          Grab This Deal
                        </button>
                      </div>
                    </div>
                    <div className="flex-shrink-0 flex items-center gap-3 opacity-60">
                      {isClassic ? (
                        <>
                          <BurgerIcon size={72} color="white" />
                          <FriesIcon size={56} color="white" />
                          <ShakeIcon size={56} color="white" />
                        </>
                      ) : (
                        <LeafIcon size={96} color="white" />
                      )}
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            );
          })}
        </div>
      </section>

      {/* Item Detail Modal */}
      {selectedItem && (
        <ItemDetailModal
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
        />
      )}

      {/* Build your own */}
      <section className="py-14 px-5" style={{ backgroundColor: '#FFFFFF' }}>
        <div className="max-w-[600px] mx-auto text-center">
          <h2 className="text-xl font-black text-gray-900 mb-3" style={{ fontFamily: "var(--font-poppins)" }}>
            Want It Your Way? Build Your Own.
          </h2>
          <p className="text-sm text-gray-600 mb-6">
            Pick your burger, choose your sides, add a drink — your perfect meal, your rules.
          </p>
          <Link
            href="/menu"
            className="inline-flex items-center px-6 py-3 rounded-md lg:rounded-xl text-sm font-bold text-white"
            style={{ backgroundColor: isClassic ? '#9A1E29' : '#4AA056' }}
          >
            Start Building
          </Link>
        </div>
      </section>
    </div>
  );
}
