'use client';

import { useState, useEffect } from 'react';
import { useMode } from '@/hooks/useMode';
import { catalogItemToMenuItem, type MenuItem } from '@/lib/menu-adapter';
import { TZ } from '@/lib/tz';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FireIcon, SaladIcon } from '@/components/icons';

/* ── Animated combo illustration SVGs ── */

function ComboMealSVG({ index }: { index: number }) {
  const isFirst = index === 0;
  return (
    <svg width="180" height="160" viewBox="0 0 180 160" fill="none" className="w-full h-full">
      <defs>
        <filter id={`comboGlow${index}`}>
          <feDropShadow dx="0" dy="3" stdDeviation="4" floodColor="rgba(0,0,0,0.2)" />
        </filter>
      </defs>
      <g filter={`url(#comboGlow${index})`}>
        {/* Burger */}
        <motion.g
          initial={{ opacity: 0, x: -20, rotate: -10 }}
          whileInView={{ opacity: 1, x: 0, rotate: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, delay: 0.2 + index * 0.1, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Top bun */}
          <path d={isFirst ? 'M15 70C15 45 35 28 55 28C75 28 95 45 95 70H15Z' : 'M20 65C20 42 38 26 56 26C74 26 92 42 92 65H20Z'}
            fill="#C8851E" />
          <ellipse cx={isFirst ? 40 : 42} cy={isFirst ? 50 : 46} rx="3" ry="5" fill="#F5E6C8" />
          <ellipse cx={isFirst ? 55 : 56} cy={isFirst ? 42 : 38} rx="3" ry="5" fill="#F5E6C8" />
          <ellipse cx={isFirst ? 70 : 70} cy={isFirst ? 52 : 48} rx="3" ry="5" fill="#F5E6C8" />
          {/* Lettuce */}
          <motion.path
            d={isFirst
              ? 'M12 74C12 74 30 64 55 74C80 84 98 72 98 72'
              : 'M17 69C17 69 34 60 56 69C78 78 95 67 95 67'}
            fill="#43A047" opacity={0.8}
            initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }}
            viewport={{ once: true, amount: 0.3 }} transition={{ delay: 0.5 + index * 0.1, duration: 0.5 }}
          />
          {/* Cheese */}
          <rect x={isFirst ? 14 : 18} y={isFirst ? 76 : 71} width={isFirst ? 82 : 76} height="8" rx="2" fill="#FFD54F" />
          {/* Cheese drip */}
          <motion.path d={isFirst ? 'M22 84L20 94Q19 97 22 97Q25 97 24 94Z' : 'M26 79L24 88Q23 91 26 91Q29 91 28 88Z'}
            fill="#FFCA28"
            initial={{ scaleY: 0 }} whileInView={{ scaleY: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            style={{ transformOrigin: isFirst ? '22px 84px' : '26px 79px' }}
            transition={{ delay: 0.8 + index * 0.1, duration: 0.4 }}
          />
          {/* Patty */}
          <rect x={isFirst ? 14 : 18} y={isFirst ? 86 : 80} width={isFirst ? 82 : 76} height="16" rx="8" fill="#3E2723" />
          {/* Bottom bun */}
          <path d={isFirst
            ? 'M15 108H95C95 120 80 128 55 128C30 128 15 120 15 108Z'
            : 'M20 102H92C92 113 78 120 56 120C34 120 20 113 20 102Z'}
            fill="#C8851E" />
        </motion.g>

        {/* Fries container */}
        <motion.g
          initial={{ opacity: 0, y: 20, rotate: 5 }}
          whileInView={{ opacity: 1, y: 0, rotate: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, delay: 0.4 + index * 0.1, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Fries container */}
          <path d={isFirst
            ? 'M110 72L105 130H150L145 72H110Z'
            : 'M108 68L103 124H146L141 68H108Z'}
            fill="#9A1E29" />
          {/* Container stripe */}
          <rect x={isFirst ? 108 : 106} y={isFirst ? 95 : 90} width={isFirst ? 40 : 38} height="4" fill="#FFD54F" />
          {/* Individual fries sticking out */}
          {(isFirst
            ? [
                { x1: 115, y1: 72, x2: 112, y2: 48 },
                { x1: 122, y1: 72, x2: 120, y2: 42 },
                { x1: 128, y1: 72, x2: 130, y2: 45 },
                { x1: 135, y1: 72, x2: 138, y2: 50 },
                { x1: 141, y1: 72, x2: 144, y2: 46 },
              ]
            : [
                { x1: 113, y1: 68, x2: 110, y2: 45 },
                { x1: 119, y1: 68, x2: 117, y2: 38 },
                { x1: 125, y1: 68, x2: 127, y2: 42 },
                { x1: 131, y1: 68, x2: 134, y2: 47 },
                { x1: 137, y1: 68, x2: 140, y2: 42 },
              ]
          ).map((fry, fi) => (
            <motion.line key={fi}
              x1={fry.x1} y1={fry.y1} x2={fry.x2} y2={fry.y2}
              stroke="#FFD54F" strokeWidth="5" strokeLinecap="round"
              initial={{ scaleY: 0 }}
              whileInView={{ scaleY: 1 }}
              viewport={{ once: true, amount: 0.3 }}
              style={{ transformOrigin: `${fry.x1}px ${fry.y1}px` }}
              transition={{ delay: 0.6 + fi * 0.06 + index * 0.1, duration: 0.3, ease: 'easeOut' }}
            />
          ))}
        </motion.g>

        {/* Drink cup */}
        <motion.g
          initial={{ opacity: 0, y: 15, scale: 0.8 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5, delay: 0.6 + index * 0.1, type: 'spring', stiffness: 200 }}
        >
          {isFirst ? (
            <>
              {/* Coke cup */}
              <path d="M155 55L150 130H170L165 55H155Z" fill="white" opacity={0.9} />
              <rect x="152" y="55" width="16" height="6" rx="2" fill="white" />
              <rect x="153" y="80" width="14" height="20" rx="2" fill="#9A1E29" opacity={0.3} />
              {/* Straw */}
              <motion.line x1="160" y1="55" x2="158" y2="30" stroke="white" strokeWidth="2.5" strokeLinecap="round"
                initial={{ scaleY: 0 }} whileInView={{ scaleY: 1 }}
                viewport={{ once: true, amount: 0.3 }}
                style={{ transformOrigin: '160px 55px' }}
                transition={{ delay: 0.9, duration: 0.3 }}
              />
            </>
          ) : (
            <>
              {/* Shake cup */}
              <path d="M150 55L146 125H168L164 55H150Z" fill="white" opacity={0.9} />
              <rect x="148" y="55" width="18" height="6" rx="2" fill="white" />
              {/* Whipped cream dome */}
              <motion.path d="M148 55C148 42 152 35 157 35C162 35 166 42 166 55"
                fill="white" opacity={0.7}
                initial={{ scaleY: 0 }} whileInView={{ scaleY: 1 }}
                viewport={{ once: true, amount: 0.3 }}
                style={{ transformOrigin: '157px 55px' }}
                transition={{ delay: 0.85, duration: 0.3 }}
              />
              {/* Cherry on top */}
              <motion.circle cx="157" cy="33" r="4" fill="#E53935"
                initial={{ scale: 0 }} whileInView={{ scale: [0, 1.3, 1] }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ delay: 1.0, duration: 0.3 }}
              />
              <motion.line x1="157" y1="30" x2="157" y2="24" stroke="#43A047" strokeWidth="1.5" strokeLinecap="round"
                initial={{ scaleY: 0 }} whileInView={{ scaleY: 1 }}
                viewport={{ once: true, amount: 0.3 }}
                style={{ transformOrigin: '157px 30px' }}
                transition={{ delay: 1.1, duration: 0.2 }}
              />
            </>
          )}
        </motion.g>
      </g>

      {/* Steam / aroma wisps */}
      {[
        { x: 55, y: 22, delay: 1.2 },
        { x: 130, y: 35, delay: 1.4 },
      ].map((w, i) => (
        <motion.path key={i}
          d={`M${w.x} ${w.y}C${w.x - 3} ${w.y - 8} ${w.x + 3} ${w.y - 14} ${w.x} ${w.y - 20}`}
          stroke="white" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity={0.3}
          initial={{ pathLength: 0, opacity: 0 }}
          whileInView={{ pathLength: 1, opacity: 0.3 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ delay: w.delay, duration: 0.8, ease: 'easeOut' }}
        />
      ))}
    </svg>
  );
}

function HealthyComboSVG({ index }: { index: number }) {
  return (
    <svg width="180" height="160" viewBox="0 0 180 160" fill="none" className="w-full h-full">
      <defs>
        <filter id={`healthyGlow${index}`}>
          <feDropShadow dx="0" dy="3" stdDeviation="4" floodColor="rgba(0,0,0,0.15)" />
        </filter>
      </defs>
      <g filter={`url(#healthyGlow${index})`}>
        {/* Salad bowl */}
        <motion.g
          initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.3 }} transition={{ delay: 0.2, duration: 0.5, type: 'spring' }}
        >
          <ellipse cx="60" cy="95" rx="50" ry="10" fill="#E8D5C0" />
          <path d="M10 95C10 120 30 140 60 140C90 140 110 120 110 95" fill="#F5EDE0" />
          {/* Greens */}
          <ellipse cx="45" cy="82" rx="20" ry="10" fill="#66BB6A" opacity={0.8} />
          <ellipse cx="75" cy="85" rx="18" ry="8" fill="#43A047" opacity={0.7} />
          <ellipse cx="55" cy="78" rx="15" ry="8" fill="#81C784" opacity={0.6} />
          {/* Tomato */}
          <motion.circle cx="70" cy="75" r="6" fill="#EF5350"
            initial={{ scale: 0 }} whileInView={{ scale: 1 }}
            viewport={{ once: true, amount: 0.3 }} transition={{ delay: 0.5, type: 'spring', stiffness: 300 }}
          />
          {/* Avocado */}
          <motion.ellipse cx="42" cy="78" rx="8" ry="5" fill="#8BC34A"
            initial={{ scale: 0 }} whileInView={{ scale: 1 }}
            viewport={{ once: true, amount: 0.3 }} transition={{ delay: 0.6, type: 'spring' }}
          />
        </motion.g>

        {/* Smoothie */}
        <motion.g
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }} transition={{ delay: 0.4, duration: 0.5 }}
        >
          <path d="M130 50L126 130H152L148 50H130Z" fill="white" opacity={0.9} />
          <rect x="128" y="50" width="22" height="5" rx="2" fill="white" />
          {/* Green smoothie fill */}
          <path d="M129 65L126 130H152L149 65H129Z" fill="#81C784" opacity={0.4} />
          {/* Leaf garnish */}
          <motion.path d="M139 48C135 42 130 38 128 36C132 36 138 40 139 48Z" fill="#43A047"
            initial={{ scale: 0 }} whileInView={{ scale: 1 }}
            viewport={{ once: true, amount: 0.3 }} transition={{ delay: 0.7, type: 'spring' }}
          />
          {/* Straw */}
          <motion.line x1="139" y1="50" x2="137" y2="28" stroke="#43A047" strokeWidth="2.5" strokeLinecap="round"
            initial={{ scaleY: 0 }} whileInView={{ scaleY: 1 }}
            viewport={{ once: true, amount: 0.3 }} style={{ transformOrigin: '139px 50px' }}
            transition={{ delay: 0.8, duration: 0.3 }}
          />
        </motion.g>
      </g>
    </svg>
  );
}

export default function ComboDealTeaser() {
  const { isClassic } = useMode();
  const [combos, setCombos] = useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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
            .map((item) => catalogItemToMenuItem(item, comboCategory.name));
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

  return (
    <section
      className="py-12 md:py-14 px-5 has-pattern overflow-hidden transition-colors duration-500"
      style={{ backgroundColor: isClassic ? '#FDF5EC' : '#EDF7F0' }}
    >
      <div className="max-w-[1200px] mx-auto">
        <div className="flex items-end justify-between mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5 }}
          >
            <motion.span
              className="inline-block text-[0.6875rem] font-bold uppercase tracking-[0.2em] mb-2 px-3 py-1 rounded-full"
              style={{
                backgroundColor: isClassic ? 'rgba(154,30,41,0.08)' : 'rgba(74,160,86,0.08)',
                color: isClassic ? '#9A1E29' : '#4AA056',
              }}
            >
              <span className="inline-flex items-center gap-1.5">
                {isClassic
                  ? <><FireIcon size={11} color="#9A1E29" className="inline-block" /> More Bite, Less Spend</>
                  : <><SaladIcon size={11} color="#4AA056" className="inline-block" /> Complete &amp; Clean</>}
              </span>
            </motion.span>
            <h2 className="text-2xl md:text-[2rem] font-black text-gray-900" style={{ fontFamily: "var(--font-poppins)" }}>
              {isClassic ? 'Bundles That Hit Different' : 'Wholesome Meal Bundles'}
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              {isClassic ? 'Burger + fries + drink = your wallet says thanks' : 'Protein, fiber, flavor — one meal, fully balanced'}
            </p>
          </motion.div>
          <Link
            href="/menu"
            className="hidden md:inline-flex items-center gap-2 text-sm font-semibold group"
            style={{ color: isClassic ? '#9A1E29' : '#4AA056' }}
          >
            See All Bundles
            <motion.span
              className="inline-block"
              animate={{ x: [0, 4, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            >
              →
            </motion.span>
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="rounded-3xl overflow-hidden p-5 md:p-8 animate-pulse" style={{ background: isClassic ? 'linear-gradient(135deg, #EB7A29, #D46E1F)' : 'linear-gradient(135deg, #4AA056, #3D8A48)' }}>
                <div className="space-y-3">
                  <div className="h-3 w-24 rounded bg-white/20" />
                  <div className="h-7 w-3/4 rounded bg-white/20" />
                  <div className="h-4 w-full rounded bg-white/20" />
                  <div className="h-10 w-28 rounded-xl bg-white/20" />
                </div>
              </div>
            ))}
          </div>
        ) : combos.length === 0 ? null : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {combos.map((combo, i) => {
            const data = isClassic ? combo.classic : combo.healthy;
            return (
              <motion.div
                key={combo.id}
                className="relative rounded-3xl overflow-hidden group cursor-pointer"
                style={{
                  background: isClassic
                    ? 'linear-gradient(135deg, #EB7A29 0%, #D46E1F 50%, #D4811A 100%)'
                    : 'linear-gradient(135deg, #4AA056 0%, #3D8A48 50%, #3D8A48 100%)',
                }}
                initial={{ opacity: 0, y: 30, scale: 0.96 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6, delay: i * 0.15, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ y: -4, scale: 1.01 }}
              >
                {/* Decorative circles */}
                <div className="absolute -right-8 -top-8 w-40 h-40 rounded-full bg-white/5 group-hover:scale-125 transition-transform duration-500" />
                <div className="absolute -left-12 -bottom-12 w-32 h-32 rounded-full bg-black/5" />

                {/* Animated dashed border accent */}
                <motion.div
                  className="absolute inset-3 rounded-2xl border border-dashed border-white/15 pointer-events-none"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ delay: 0.5 + i * 0.15, duration: 0.5 }}
                />

                <div className="p-5 md:p-8 relative z-10">
                  <div className="flex gap-3 md:gap-4 items-start md:items-center">
                    <div className="flex-1 min-w-0">
                      <span className="text-[0.625rem] font-bold uppercase tracking-wider text-white/50 mb-1.5 block">
                        {isClassic ? 'Fan Favorite Bundle' : 'Balanced & Delicious'}
                      </span>
                      <h3 className="text-xl md:text-2xl font-black text-white mb-2 line-clamp-2 md:truncate" style={{ fontFamily: "var(--font-poppins)" }}>
                        {data.name}
                      </h3>
                      <p className="text-sm text-white/60 leading-relaxed line-clamp-2">{data.description}</p>

                      {/* Desktop: price + button inline (unchanged) */}
                      <div className="hidden md:flex items-center gap-3 mt-5">
                        <motion.span
                          className="text-3xl font-black text-white"
                          initial={{ opacity: 0, scale: 0.5 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          viewport={{ once: true, amount: 0.3 }}
                          transition={{ delay: 0.3 + i * 0.15, type: 'spring', stiffness: 200 }}
                        >
                          ₹{data.price}
                        </motion.span>
                        <Link
                          href="/order-online"
                          className="px-6 py-2.5 rounded-xl text-xs font-bold uppercase bg-white transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 active:scale-[0.97]"
                          style={{ color: isClassic ? '#9A1E29' : '#3D8A48' }}
                        >
                          Order Now
                        </Link>
                      </div>
                    </div>

                    {/* Animated SVG illustration */}
                    <div className="flex-shrink-0 w-[105px] h-[100px] md:w-[180px] md:h-[160px] group-hover:scale-105 transition-transform duration-500">
                      {isClassic ? <ComboMealSVG index={i} /> : <HealthyComboSVG index={i} />}
                    </div>
                  </div>

                  {/* Mobile: price left, Order Now right with arrow */}
                  <div className="flex items-center justify-between mt-4 md:hidden">
                    <motion.span
                      className="text-2xl font-black text-white"
                      initial={{ opacity: 0, scale: 0.5 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true, amount: 0.3 }}
                      transition={{ delay: 0.3 + i * 0.15, type: 'spring', stiffness: 200 }}
                    >
                      ₹{data.price}
                    </motion.span>
                    <Link
                      href="/order-online"
                      className="inline-flex items-center gap-1.5 pl-5 pr-4 py-2.5 rounded-full bg-white text-xs font-bold uppercase shadow-lg active:scale-[0.95] transition-all"
                      style={{ color: isClassic ? '#9A1E29' : '#3D8A48', touchAction: 'manipulation' }}
                    >
                      Order Now
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                      </svg>
                    </Link>
                  </div>
                </div>

                {/* Savings badge */}
                <motion.div
                  className="absolute top-4 right-4 px-3 py-1 rounded-full text-[0.625rem] font-bold uppercase bg-white/15 text-white border border-white/20 backdrop-blur-sm"
                  initial={{ scale: 0, rotate: -20 }}
                  whileInView={{ scale: 1, rotate: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ delay: 0.7 + i * 0.15, type: 'spring', stiffness: 300 }}
                >
                  {isClassic ? `You Save ₹${Math.round(data.price * 0.2)}` : 'Top Pick'}
                </motion.div>
              </motion.div>
            );
          })}
        </div>
        )}

        <div className="mt-8 text-center md:hidden">
          <Link href="/menu" className="text-sm font-semibold" style={{ color: isClassic ? '#9A1E29' : '#4AA056' }}>
            See All Bundles →
          </Link>
        </div>
      </div>
    </section>
  );
}
