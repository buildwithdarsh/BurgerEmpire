'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useMode } from '@/hooks/useMode';
import { catalogItemToMenuItem, type MenuItem } from '@/lib/menu-adapter';
import { TZ } from '@/lib/tz';
import { motion, AnimatePresence } from 'framer-motion';
import { LeafIcon, MeatIcon, WheatIcon, SaladIcon } from '@/components/icons';
import WaveDivider from '@/components/WaveDivider';
import { useCartStore } from '@/store/cart';
import Spinner from '@/components/ui/Spinner';

const counterCategories = ['All', 'Pocket Friendly', 'Veg Burger', 'Non-Veg Burger', 'Maharaja', 'Wraps', 'Sides', 'Shakes', 'Beverages'] as const;

function MacroRing({ label, value, max, color, unit }: { label: string; value: number; max: number; color: string; unit: string }) {
  const pct = Math.min(value / max, 1);
  const circumference = 2 * Math.PI * 42;
  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className="relative w-[72px] h-[72px]">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="42" fill="none" stroke="#F3F4F6" strokeWidth="7" />
          <motion.circle
            cx="50" cy="50" r="42" fill="none" stroke={color} strokeWidth="7" strokeLinecap="round"
            initial={{ strokeDasharray: `0 ${circumference}` }}
            animate={{ strokeDasharray: `${pct * circumference} ${circumference}` }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            key={value}
            className="text-sm font-black leading-none"
            style={{ color }}
            initial={{ scale: 1.3, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {value}
          </motion.span>
          <span className="text-[0.5rem] text-gray-300 font-medium">{unit}</span>
        </div>
      </div>
      <p className="text-[0.625rem] text-gray-500 font-semibold tracking-wide uppercase">{label}</p>
    </div>
  );
}

export default function HealthyPage() {
  const router = useRouter();
  const { setMode } = useMode();
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [menuItems, setMenuItems] = useState<(MenuItem & { inStock?: boolean })[]>([]);
  const [isLoadingMenu, setIsLoadingMenu] = useState(true);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const tabsRef = useRef<HTMLDivElement>(null);
  const addItem = useCartStore((s) => s.addItem);

  useEffect(() => { setMode('healthy'); }, [setMode]);

  useEffect(() => {
    async function loadMenu() {
      try {
        const [cats, itemsRes] = await Promise.all([
          TZ.storefront.catalog.getCategories(),
          TZ.storefront.catalog.getItems(),
        ]);
        const items: any[] = (itemsRes as any)?.data ?? itemsRes;
        const categoryMap = new Map(cats.map((c) => [c.id, c.name]));
        const mapped = items.map((item) => ({
          ...catalogItemToMenuItem(item, categoryMap.get(item.categoryId)),
          inStock: item.inStock,
        }));
        setMenuItems(mapped);
      } catch (err) {
        console.error('Failed to load menu:', err);
        setMenuItems([]);
      } finally {
        setIsLoadingMenu(false);
      }
    }
    loadMenu();
  }, []);

  const handleAddAllToCart = () => {
    const selected = menuItems.filter((item) => selectedItems.includes(item.id));
    if (selected.length === 0) return;
    setIsAddingToCart(true);
    for (const item of selected) {
      addItem({
        menuItemId: item.id,
        quantity: 1,
        mode: 'healthy',
        classicName: item.classic.name,
        healthyName: item.healthy.name,
        classicPrice: item.classic.price,
        healthyPrice: item.healthy.price,
        image: item.image,
        healthyImage: item.healthyImage,
        diet: item.diet,
        inStock: item.inStock ?? true,
        addons: [],
      });
    }
    setSelectedItems([]);
    router.push('/checkout');
  };

  const totals = useMemo(() => {
    const selected = menuItems.filter((item) => selectedItems.includes(item.id));
    return selected.reduce(
      (acc, item) => ({
        calories: acc.calories + item.healthy.calories,
        protein: acc.protein + item.healthy.protein,
        fats: acc.fats + item.healthy.fats,
        carbs: acc.carbs + item.healthy.carbs,
        price: acc.price + item.healthy.price,
      }),
      { calories: 0, protein: 0, fats: 0, carbs: 0, price: 0 }
    );
  }, [selectedItems, menuItems]);

  const filteredItems = useMemo(() => {
    return menuItems
      .filter((item) => item.category !== 'Combos')
      .filter((item) => item.inStock !== false)
      .filter((item) => activeCategory === 'All' || item.category === activeCategory);
  }, [activeCategory, menuItems]);

  const toggleItem = (id: string) => {
    setSelectedItems((prev) => prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]);
  };

  const light = '#F5FBF7';

  return (
    <div className="min-h-screen has-pattern" style={{ backgroundColor: '#FFFFFF' }}>
      {/* Hero */}
      <section
        className="py-20 px-5 text-center"
        style={{ background: 'linear-gradient(135deg, #4AA056, #3D8A48)' }}
      >
        <motion.div
          className="flex justify-center mb-6"
          initial={{ scale: 0 }} animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200 }}
        >
          <LeafIcon size={56} color="white" />
        </motion.div>
        <motion.h1
          className="text-3xl md:text-5xl font-black text-white mb-4"
          style={{ fontFamily: "var(--font-playfair)" }}
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          Healthy Burgers &amp; Wraps with Full Nutritional Info
        </motion.h1>
        <motion.p
          className="text-base text-white/75 max-w-lg mx-auto"
          style={{ fontFamily: "var(--font-nunito)" }}
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          Same crave-worthy flavor. Grass-fed beef. Zero junk. Your body and taste buds finally agree.
        </motion.p>
      </section>

      <WaveDivider variant="curve" topColor="#3D8A48" bottomColor="#FFFFFF" />

      {/* What Makes It Healthy */}
      <section className="py-14 px-5">
        <div className="max-w-[900px] mx-auto">
          <motion.h2
            className="text-2xl font-black text-gray-900 text-center mb-10"
            style={{ fontFamily: "var(--font-poppins)" }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Why Your Body Will Thank You
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              { icon: <MeatIcon size={36} color="#4AA056" />, title: 'Pasture-Raised Beef', desc: 'Hormone-free, omega-3 rich. The cleanest beef you can eat.' },
              { icon: <WheatIcon size={36} color="#4AA056" />, title: 'Real Whole Grains', desc: 'Stone-ground buns, brown rice coatings. Not a gram of refined flour.' },
              { icon: <SaladIcon size={36} color="#4AA056" />, title: 'Fresh Every Morning', desc: 'Sourced locally, prepped daily. Never frozen, never preserved.' },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                className="bg-[#FAFAFA] rounded-md lg:rounded-xl border border-gray-100 p-6 text-center"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                whileHover={{ y: -4 }}
              >
                <div className="flex justify-center mb-3">{item.icon}</div>
                <h3 className="text-[0.9375rem] font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Calorie Counter */}
      <section className="py-14 px-5" style={{ backgroundColor: light }}>
        <div className="max-w-[1100px] mx-auto">
          <h2 className="text-2xl font-black text-gray-900 text-center mb-1" style={{ fontFamily: "var(--font-poppins)" }}>
            Build Your Meal, Know Your Macros
          </h2>
          <p className="text-sm text-gray-600 text-center mb-8">Tap to add items and watch your nutrition stack up — calories, protein, fats, carbs, all live</p>

          {/* Category Tabs */}
          <div ref={tabsRef} className="flex gap-2 overflow-x-auto pb-4 mb-6 scrollbar-hide -mx-2 px-2">
            {counterCategories.map((cat) => {
              const isActive = activeCategory === cat;
              const count = cat === 'All'
                ? selectedItems.length
                : menuItems.filter(i => i.category === cat && selectedItems.includes(i.id)).length;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className="flex-shrink-0 px-4 py-2 rounded-full text-xs font-semibold transition-all duration-200 border whitespace-nowrap"
                  style={{
                    backgroundColor: isActive ? '#4AA056' : '#FFFFFF',
                    color: isActive ? '#FFFFFF' : '#6B7280',
                    borderColor: isActive ? '#4AA056' : '#E5E7EB',
                  }}
                >
                  {cat}
                  {count > 0 && (
                    <span className="ml-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full text-[0.5625rem] font-bold"
                      style={{
                        backgroundColor: isActive ? 'rgba(255,255,255,0.25)' : '#4AA056',
                        color: '#FFFFFF',
                      }}
                    >{count}</span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Split layout: items grid + sticky macro panel */}
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Items Grid */}
            <div className="flex-1 min-w-0">
              {isLoadingMenu ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2.5">
                  {Array.from({ length: 9 }).map((_, i) => (
                    <div key={i} className="p-3.5 rounded-xl lg:rounded-2xl border border-gray-100 bg-white animate-pulse">
                      <div className="h-3 w-12 bg-gray-100 rounded mb-3" />
                      <div className="h-4 w-3/4 bg-gray-100 rounded mb-3" />
                      <div className="grid grid-cols-4 gap-1 mb-2">
                        {Array.from({ length: 4 }).map((_, j) => (
                          <div key={j} className="h-8 bg-gray-50 rounded-lg" />
                        ))}
                      </div>
                      <div className="h-3 w-10 bg-gray-100 rounded" />
                    </div>
                  ))}
                </div>
              ) : filteredItems.length === 0 ? (
                <div className="text-center py-16">
                  <p className="text-sm text-gray-400">No items available right now.</p>
                </div>
              ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2.5">
                <AnimatePresence mode="popLayout">
                  {filteredItems.map((item) => {
                    const isSelected = selectedItems.includes(item.id);
                    return (
                      <motion.button
                        key={item.id}
                        layout
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.2 }}
                        onClick={() => toggleItem(item.id)}
                        className="relative p-3.5 rounded-xl lg:rounded-2xl text-left transition-all duration-200 border group"
                        style={{
                          backgroundColor: isSelected ? '#ECFDF3' : '#FFFFFF',
                          borderColor: isSelected ? '#4AA056' : '#F3F4F6',
                          boxShadow: isSelected ? '0 0 0 1px #4AA056' : 'none',
                        }}
                      >
                        {/* Check indicator */}
                        <div className="absolute top-2.5 right-2.5 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200"
                          style={{
                            borderColor: isSelected ? '#4AA056' : '#E5E7EB',
                            backgroundColor: isSelected ? '#4AA056' : 'transparent',
                          }}
                        >
                          {isSelected && (
                            <motion.svg initial={{ scale: 0 }} animate={{ scale: 1 }} width="10" height="10" viewBox="0 0 12 12" fill="none">
                              <path d="M2 6L5 9L10 3" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </motion.svg>
                          )}
                        </div>

                        {/* Diet badge */}
                        <div className="flex items-center gap-1.5 mb-2">
                          <span className="w-2.5 h-2.5 rounded-sm border-2" style={{
                            borderColor: item.diet === 'veg' ? '#22C55E' : item.diet === 'egg' ? '#F59E0B' : '#EF4444',
                          }}>
                            <span className="block w-1 h-1 rounded-full m-[1.5px]" style={{
                              backgroundColor: item.diet === 'veg' ? '#22C55E' : item.diet === 'egg' ? '#F59E0B' : '#EF4444',
                            }} />
                          </span>
                          <span className="text-[0.5625rem] font-bold uppercase tracking-wider text-gray-300">
                            {item.diet === 'veg' ? 'Veg' : item.diet === 'egg' ? 'Egg' : 'Non-veg'}
                          </span>
                        </div>

                        <p className="text-[0.8125rem] font-bold text-gray-900 mb-1.5 pr-6 leading-tight">{item.healthy.name}</p>
                        <div className="grid grid-cols-4 gap-1 mb-2">
                          {[
                            { label: 'Cal', val: item.healthy.calories, color: '#D46E1F', unit: '' },
                            { label: 'Pro', val: item.healthy.protein, color: '#4AA056', unit: 'g' },
                            { label: 'Fat', val: item.healthy.fats, color: '#8B5CF6', unit: 'g' },
                            { label: 'Carb', val: item.healthy.carbs, color: '#3B82F6', unit: 'g' },
                          ].map((m) => (
                            <div key={m.label} className="text-center rounded-lg py-1" style={{ backgroundColor: `${m.color}08` }}>
                              <p className="text-[0.5rem] text-gray-400 font-medium leading-none mb-0.5">{m.label}</p>
                              <p className="text-[0.625rem] font-bold leading-none" style={{ color: m.color }}>{m.val}{m.unit}</p>
                            </div>
                          ))}
                        </div>
                        <p className="text-[0.6875rem] font-bold" style={{ color: '#4AA056' }}>₹{item.healthy.price}</p>
                      </motion.button>
                    );
                  })}
                </AnimatePresence>
              </div>
              )}
            </div>

            {/* Sticky Nutrition Sidebar - Desktop */}
            <div className="hidden lg:block w-[280px] flex-shrink-0">
              <div className="sticky top-24">
                <div className="bg-white rounded-3xl border border-gray-100 p-6">
                  <div className="flex items-center justify-between mb-5">
                    <h3 className="text-sm font-bold text-gray-900">Your Meal</h3>
                    {selectedItems.length > 0 && (
                      <button onClick={() => setSelectedItems([])} className="text-[0.625rem] font-semibold text-red-400 hover:text-red-500 transition-colors">
                        Clear all
                      </button>
                    )}
                  </div>

                  {selectedItems.length === 0 ? (
                    <div className="py-8 text-center">
                      <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center mx-auto mb-3">
                        <LeafIcon size={20} color="#D1D5DB" />
                      </div>
                      <p className="text-xs text-gray-300 font-medium">Select items to start<br/>building your meal</p>
                    </div>
                  ) : (
                    <>
                      {/* Macro Rings */}
                      <div className="grid grid-cols-2 gap-4 mb-5">
                        <MacroRing label="Calories" value={totals.calories} max={800} color="#D46E1F" unit="kcal" />
                        <MacroRing label="Protein" value={totals.protein} max={60} color="#4AA056" unit="g" />
                        <MacroRing label="Fats" value={totals.fats} max={40} color="#8B5CF6" unit="g" />
                        <MacroRing label="Carbs" value={totals.carbs} max={120} color="#3B82F6" unit="g" />
                      </div>

                      {/* Macro bars compact */}
                      <div className="space-y-2 mb-5">
                        {[
                          { label: 'Calories', val: totals.calories, max: 800, color: '#D46E1F', unit: 'kcal' },
                          { label: 'Protein', val: totals.protein, max: 60, color: '#4AA056', unit: 'g' },
                          { label: 'Fats', val: totals.fats, max: 40, color: '#8B5CF6', unit: 'g' },
                          { label: 'Carbs', val: totals.carbs, max: 120, color: '#3B82F6', unit: 'g' },
                        ].map((m) => (
                          <div key={m.label}>
                            <div className="flex justify-between text-[0.625rem] mb-1">
                              <span className="text-gray-400 font-medium">{m.label}</span>
                              <span className="font-bold" style={{ color: m.color }}>{m.val}{m.unit}</span>
                            </div>
                            <div className="h-1.5 rounded-full bg-gray-100 overflow-hidden">
                              <motion.div
                                className="h-full rounded-full"
                                style={{ backgroundColor: m.color, width: `${Math.min((m.val / m.max) * 100, 100)}%`, transformOrigin: 'left' }}
                                initial={{ scaleX: 0 }}
                                animate={{ scaleX: 1 }}
                                transition={{ duration: 0.5, ease: 'easeOut' }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Selected items list */}
                      <div className="border-t border-gray-50 pt-4">
                        <p className="text-[0.625rem] font-semibold text-gray-300 uppercase tracking-wider mb-2">
                          {selectedItems.length} item{selectedItems.length !== 1 ? 's' : ''} selected
                        </p>
                        <div className="max-h-[180px] overflow-y-auto space-y-1 scrollbar-hide">
                          {menuItems.filter(i => selectedItems.includes(i.id)).map((item) => (
                            <div key={item.id} className="flex items-center justify-between py-1.5 group/item">
                              <span className="text-[0.6875rem] text-gray-600 font-medium truncate pr-2">{item.healthy.name}</span>
                              <button onClick={(e) => { e.stopPropagation(); toggleItem(item.id); }}
                                className="text-gray-300 hover:text-red-400 transition-colors flex-shrink-0"
                              >
                                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2"><line x1="2" y1="2" x2="10" y2="10"/><line x1="10" y1="2" x2="2" y2="10"/></svg>
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Total price + Add to Cart */}
                      <div className="mt-4 pt-4 border-t border-gray-100 space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-gray-400 font-medium">Total price</span>
                          <span className="text-lg font-black" style={{ color: '#4AA056' }}>₹{totals.price}</span>
                        </div>
                        <button
                          onClick={handleAddAllToCart}
                          disabled={isAddingToCart}
                          className="w-full py-2.5 rounded-md lg:rounded-xl text-sm font-bold text-white transition-all active:scale-[0.98] disabled:opacity-60"
                          style={{ backgroundColor: '#4AA056' }}
                        >
                          {isAddingToCart ? (
                            <span className="flex items-center justify-center gap-2">
                              <Spinner size="xs" className="text-white" /> Adding…
                            </span>
                          ) : (
                            <>Add {selectedItems.length} item{selectedItems.length !== 1 ? 's' : ''} to Cart</>
                          )}
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Floating Mobile Nutrition Bar */}
      <AnimatePresence>
        {selectedItems.length > 0 && (
          <motion.div
            className="fixed bottom-16 left-0 right-0 z-40 lg:hidden"
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            <div className="bg-white/95 backdrop-blur-xl border-t border-gray-100 shadow-[0_-8px_30px_rgba(0,0,0,0.08)] px-4 pb-3 pt-3">
              {/* Macro pills row */}
              <div className="flex items-center justify-between gap-2 mb-2">
                {[
                  { label: 'Cal', val: totals.calories, color: '#D46E1F', unit: '' },
                  { label: 'Protein', val: totals.protein, color: '#4AA056', unit: 'g' },
                  { label: 'Fats', val: totals.fats, color: '#8B5CF6', unit: 'g' },
                  { label: 'Carbs', val: totals.carbs, color: '#3B82F6', unit: 'g' },
                ].map((m) => (
                  <div key={m.label} className="flex-1 text-center py-1.5 rounded-md lg:rounded-xl" style={{ backgroundColor: `${m.color}10` }}>
                    <p className="text-[0.625rem] text-gray-400 font-medium">{m.label}</p>
                    <p className="text-xs font-black" style={{ color: m.color }}>{m.val}{m.unit}</p>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <span className="text-[0.625rem] text-gray-400">{selectedItems.length} item{selectedItems.length !== 1 ? 's' : ''}</span>
                  <span className="text-sm font-black ml-2" style={{ color: '#4AA056' }}>₹{totals.price}</span>
                </div>
                <button onClick={() => setSelectedItems([])}
                  className="text-[0.625rem] font-semibold text-red-400 hover:text-red-500 px-3 py-1.5 rounded-lg border border-red-100 transition-colors flex-shrink-0"
                >
                  Clear
                </button>
                <button
                  onClick={handleAddAllToCart}
                  disabled={isAddingToCart}
                  className="px-4 py-1.5 rounded-lg text-[0.6875rem] font-bold text-white transition-all active:scale-[0.97] flex-shrink-0 disabled:opacity-60"
                  style={{ backgroundColor: '#4AA056' }}
                >
                  {isAddingToCart ? (
                    <span className="flex items-center gap-1.5">
                      <Spinner size="xs" className="text-white" /> Adding…
                    </span>
                  ) : (
                    'Add to Cart'
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Upgrade Explained */}
      <section className="py-14 px-5">
        <div className="max-w-[900px] mx-auto">
          <motion.h2
            className="text-2xl font-black text-gray-900 text-center mb-10"
            style={{ fontFamily: "var(--font-poppins)" }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            See the Difference for Yourself
          </motion.h2>

          <div className="flex flex-col gap-4">
            {menuItems.filter((item) => item.category === 'Veg Burger').slice(0, 4).map((item, i) => (
              <motion.div
                key={item.id}
                className="bg-[#FAFAFA] rounded-md lg:rounded-xl border border-gray-100 p-5 flex flex-col md:flex-row gap-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
              >
                <div className="flex-1 bg-white rounded-lg p-4">
                  <span className="text-[0.625rem] font-bold uppercase tracking-wider text-gray-300">Classic</span>
                  <h4 className="text-sm font-bold text-gray-900 mt-1">{item.classic.name}</h4>
                  <p className="text-xs text-gray-400 mt-1">{item.classic.description}</p>
                  <div className="mt-2 text-sm font-bold text-gray-700">₹{item.classic.price} <span className="text-xs font-normal text-gray-300">· {item.classic.calories} cal</span></div>
                </div>
                <div className="flex items-center justify-center text-gray-300">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12,5 19,12 12,19" /></svg>
                </div>
                <div className="flex-1 bg-white rounded-lg p-4 border-l-2" style={{ borderColor: '#4AA056' }}>
                  <span className="text-[0.625rem] font-bold uppercase tracking-wider" style={{ color: '#4AA056' }}>Healthy</span>
                  <h4 className="text-sm font-bold text-gray-900 mt-1">{item.healthy.name}</h4>
                  <p className="text-xs text-gray-400 mt-1">{item.healthy.description}</p>
                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-sm font-bold" style={{ color: '#4AA056' }}>₹{item.healthy.price}</span>
                    <span className="text-[0.625rem] px-1.5 py-0.5 rounded bg-green-50 text-green-600 font-semibold">+₹{item.healthy.price - item.classic.price}</span>
                    <span className="text-xs text-gray-300">{item.healthy.calories} cal</span>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {item.healthy.swaps.map((swap) => (
                      <span key={swap} className="text-[0.5625rem] px-1.5 py-0.5 rounded bg-green-50 text-green-600 flex items-center gap-0.5">
                        <LeafIcon size={8} /> {swap}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
