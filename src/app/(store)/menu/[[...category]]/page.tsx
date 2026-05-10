'use client';

import { useState, useMemo, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useMode } from '@/hooks/useMode';
import { useConfig } from '@/hooks/useConfig';
import { catalogItemToMenuItem, type MenuItem } from '@/lib/menu-adapter';
import { TZ } from '@/lib/tz';
import type { CatalogCategory } from '@buildwithdarsh/sdk';
import MenuItemCard from '@/components/MenuItemCard';
import WaveDivider from '@/components/WaveDivider';
import ItemDetailModal from '@/components/menu/ItemDetailModal';
import Skeleton from '@/components/Skeleton';

const classicFilters = ['Veg Only', 'Non-Veg', 'Bestseller', 'Under \u20B9100', 'Spicy'];
const healthyFilters = ['Veg Only', 'High Protein', 'Under 300 cal', 'Under \u20B9150', 'New'];

interface ExtendedMenuItem extends MenuItem {
  variations?: { id: string; name: string; groupName: string; price: number; inStock: boolean }[];
  addonGroups?: { id: string; name: string; minSelection: number; maxSelection: number; addons: { id: string; name: string; price: number; inStock: boolean }[] }[];
}

export default function MenuPage() {
  const { isClassic } = useMode();
  const { config } = useConfig();
  const params = useParams<{ category?: string[] }>();

  const slugCategory = params.category?.[0];

  const [activeCategory, setActiveCategory] = useState('All');
  const [activeFilters, setActiveFilters] = useState<Set<string>>(() => {
    // Apply diet_filter_default from config
    const dietDefault = config.catalog.diet_filter_default;
    if (dietDefault === 'veg') return new Set(['Veg Only']);
    if (dietDefault === 'nonveg') return new Set(['Non-Veg']);
    return new Set<string>();
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ExtendedMenuItem | null>(null);
  const [menuData, setMenuData] = useState<ExtendedMenuItem[]>([]);
  const [categories, setCategories] = useState<CatalogCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState(config.catalog.items_per_page);

  const filters = isClassic ? classicFilters : healthyFilters;

  // Fetch categories and menu items from Central Backend
  useEffect(() => {
    async function loadMenu() {
      try {
        const [cats, itemsRes] = await Promise.all([
          TZ.storefront.catalog.getCategories(),
          TZ.storefront.catalog.getItems(),
        ]);
        const items: any[] = (itemsRes as any)?.data ?? itemsRes;
        setCategories(cats);
        const categoryMap = new Map(cats.map((c) => [c.id, c.name]));
        const mapped: ExtendedMenuItem[] = items.map((item) => {
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
        setMenuData(mapped);

        // Set initial category from URL slug
        if (slugCategory) {
          const matchedCat = cats.find(
            (c) => c.name.toLowerCase() === slugCategory.toLowerCase() || c.slug === slugCategory
          );
          if (matchedCat) setActiveCategory(matchedCat.name);
        }
      } catch (err) {
        console.error('Failed to load menu:', err);
        setLoadError(err instanceof Error ? err.message : 'Failed to load menu');
      } finally {
        setIsLoading(false);
      }
    }
    loadMenu();
  }, [slugCategory]);

  // Derive category names from fetched categories
  const dynamicCategories = useMemo(() => {
    const catNames = categories.map((c) => c.name);
    const menuCats = new Set(menuData.map((i) => i.category));
    return ['All', ...catNames.filter((c) => menuCats.has(c))];
  }, [menuData, categories]);

  const toggleFilter = (filter: string) => {
    setActiveFilters((prev) => {
      const next = new Set(prev);
      if (next.has(filter)) next.delete(filter);
      else next.add(filter);
      return next;
    });
  };

  const filtered = useMemo(() => {
    let items = menuData;
    if (activeCategory !== 'All') {
      items = items.filter((item) => item.category === activeCategory);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      items = items.filter(
        (item) =>
          item.classic.name.toLowerCase().includes(q) ||
          item.healthy.name.toLowerCase().includes(q) ||
          item.classic.description.toLowerCase().includes(q) ||
          item.healthy.description.toLowerCase().includes(q)
      );
    }
    // Apply filter chips (all active filters must match)
    for (const f of activeFilters) {
      items = items.filter((item) => {
        const data = isClassic ? item.classic : item.healthy;
        switch (f) {
          case 'Veg Only': return item.diet === 'veg';
          case 'Non-Veg': return item.diet === 'nonveg';
          case 'Bestseller': return !!item.isBestseller;
          case 'Under ₹100': return data.price < 100;
          case 'Under ₹150': return data.price < 150;
          case 'Spicy': {
            const text = `${data.name} ${data.description}`.toLowerCase();
            return text.includes('spic') || text.includes('peri') || text.includes('chilli');
          }
          case 'High Protein': return !isClassic && item.healthy.protein >= 15;
          case 'Under 300 cal': return data.calories < 300;
          case 'New': return !!item.isNew;
          default: return true;
        }
      });
    }
    return items;
  }, [activeCategory, searchQuery, menuData, activeFilters, isClassic]);

  // Reset visible count when filters/category change
  useEffect(() => {
    setVisibleCount(config.catalog.items_per_page);
  }, [activeCategory, activeFilters, searchQuery, config.catalog.items_per_page]);

  const paginatedItems = useMemo(() => {
    return filtered.slice(0, visibleCount);
  }, [filtered, visibleCount]);

  const hasMore = visibleCount < filtered.length;

  const heroEdge = isClassic ? '#D46E1F' : '#3D8A48';
  const light = isClassic ? '#FFF9F0' : '#F5FBF7';

  return (
    <div className="min-h-screen has-pattern" style={{ backgroundColor: light }}>
      {/* Page header */}
      <section
        className="py-12 px-5 transition-colors duration-600"
        style={{
          background: isClassic
            ? 'linear-gradient(135deg, #EB7A29, #D46E1F)'
            : 'linear-gradient(135deg, #4AA056, #3D8A48)',
        }}
      >
        <div className="max-w-[1200px] mx-auto">
          <h1
            className="text-3xl md:text-4xl font-black text-white mb-2"
            style={{ fontFamily: "var(--font-hero)" }}
          >
            {isClassic ? 'Burger Empire Menu — Veg Burgers from ₹69' : 'Burger Empire Healthy Menu'}
          </h1>
          <p className="text-sm text-white/70">
            {isClassic ? 'Every item made fresh when you order it. No shortcuts, no compromises.' : 'Wholesome meals that prove healthy food can be the most delicious thing you eat today.'}
          </p>
        </div>
      </section>

      <WaveDivider variant="wave" topColor={heroEdge} bottomColor="#FFFFFF" />

      {/* Sticky category nav */}
      <div className="sticky top-14 md:top-[90px] z-30 bg-white border-b border-gray-100">
        <div className="max-w-[1200px] mx-auto px-5">
          {/* Categories */}
          <div className="flex mb-3 items-center gap-0 overflow-x-auto scrollbar-hide py-0">
            {dynamicCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className="relative px-5 py-3 text-[0.8125rem] font-semibold whitespace-nowrap transition-colors duration-200"
                style={{
                  color: activeCategory === cat
                    ? isClassic ? '#9A1E29' : '#4AA056'
                    : '#9CA3AF',
                }}
              >
                {cat}
                {activeCategory === cat && (
                  <span
                    className="absolute bottom-0 left-3 right-3 h-[2px] rounded-full"
                    style={{ backgroundColor: isClassic ? '#9A1E29' : '#4AA056' }}
                  />
                )}
              </button>
            ))}

            {/* Search */}
            {config.catalog.search_enabled && (
              <div className="ml-auto flex-shrink-0 py-2">
                <div
                  className="flex items-center rounded-lg overflow-hidden transition-all duration-300 border"
                  style={{
                    width: searchOpen ? '240px' : '40px',
                    borderColor: searchOpen ? (isClassic ? '#EB7A29' : '#4AA056') : '#E5E7EB',
                    backgroundColor: '#F9FAFB',
                  }}
                >
                  <button
                    onClick={() => setSearchOpen(!searchOpen)}
                    className="w-10 h-10 flex items-center justify-center flex-shrink-0 text-gray-400"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </button>
                  {searchOpen && (
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search menu..."
                      autoFocus
                      className="flex-1 bg-transparent outline-none text-sm pr-3 text-gray-700"
                    />
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Filter chips */}
          <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-3">
            {filters.map((filter) => {
              const isActive = activeFilters.has(filter);
              return (
                <button
                  key={filter}
                  onClick={() => toggleFilter(filter)}
                  className="px-3 py-1.5 rounded-lg text-[0.6875rem] font-semibold whitespace-nowrap cursor-pointer transition-all duration-200 border active:scale-[0.95]"
                  style={{
                    borderColor: isActive
                      ? (isClassic ? '#9A1E29' : '#4AA056')
                      : (isClassic ? '#FDE8B0' : '#D8EAD8'),
                    backgroundColor: isActive
                      ? (isClassic ? '#9A1E29' : '#4AA056')
                      : (isClassic ? '#FFFBF0' : '#F0FAF3'),
                    color: isActive
                      ? '#FFFFFF'
                      : (isClassic ? '#C06820' : '#3D8A48'),
                  }}
                >
                  {filter}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Menu grid */}
      <section className="py-8 px-5">
        <div className="max-w-[1200px] mx-auto">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {Array.from({ length: 8 }).map((_, i) => (
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
          ) : loadError ? (
            <div className="text-center py-20">
              <p className="text-red-600 text-lg font-medium">Something went wrong</p>
              <p className="text-gray-500 text-sm mt-1">{loadError}</p>
              <button onClick={() => window.location.reload()} className="mt-4 px-4 py-2 text-sm rounded-lg bg-gray-900 text-white hover:bg-gray-800">
                Try Again
              </button>
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20">
              <div className="flex justify-center mb-4 opacity-40">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
              </div>
              <p className="text-gray-600 text-lg">Nothing here yet</p>
              <p className="text-gray-600 text-sm mt-1">Try a different search or browse another category</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {paginatedItems.map((item, i) => (
                  <MenuItemCard
                    key={item.id}
                    item={item}
                    index={i}
                    onAddToCart={(clickedItem) => setSelectedItem(clickedItem as ExtendedMenuItem)}
                  />
                ))}
              </div>
              {hasMore && (
                <div className="flex justify-center mt-8">
                  <button
                    onClick={() => setVisibleCount((prev: number) => prev + config.catalog.items_per_page)}
                    className="px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 border"
                    style={{
                      borderColor: isClassic ? '#EB7A29' : '#4AA056',
                      color: isClassic ? '#D46E1F' : '#4AA056',
                      backgroundColor: isClassic ? '#FAF8F4' : '#F0FAF3',
                    }}
                  >
                    Load More ({filtered.length - visibleCount} remaining)
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Item Detail Modal */}
      {selectedItem && (
        <ItemDetailModal
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
        />
      )}
    </div>
  );
}
