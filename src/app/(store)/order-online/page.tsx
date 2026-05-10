'use client';

import { useMode } from '@/hooks/useMode';
import { useConfig } from '@/hooks/useConfig';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { PhoneIcon, GlobeIcon, ZapIcon, TruckIcon, ShieldIcon } from '@/components/icons';
import WaveDivider from '@/components/WaveDivider';

export default function OrderOnlinePage() {
  const { isClassic } = useMode();
  const { config } = useConfig();

  const heroEdge = isClassic ? '#D46E1F' : '#3D8A48';
  const light = isClassic ? '#FFF9F0' : '#F5FBF7';

  return (
    <div className="min-h-screen has-pattern" style={{ backgroundColor: '#FFFFFF' }}>
      {/* Hero */}
      <section
        className="py-20 px-5"
        style={{
          background: isClassic
            ? 'linear-gradient(135deg, #EB7A29, #D46E1F)'
            : 'linear-gradient(135deg, #4AA056, #3D8A48)',
        }}
      >
        <div className="max-w-[800px] mx-auto text-center">
          <motion.div
            className="flex justify-center mb-6"
            initial={{ scale: 0 }} animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
          >
            {isClassic ? (
              <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
                <path d="M8 28C8 16 18 8 32 8C46 8 56 16 56 28H8Z" fill="white" opacity={0.9} />
                <rect x="7" y="33" width="50" height="8" rx="4" fill="white" opacity={0.7} />
                <path d="M8 44H56C56 50 48 56 32 56C16 56 8 50 8 44Z" fill="white" opacity={0.8} />
              </svg>
            ) : (
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none">
                <path d="M6.5 12C6.5 12 9 11 12 7C15 3 20 2 20 2C20 2 19 7 15 10C11 13 6.5 12 6.5 12Z" fill="white" opacity={0.8} />
                <path d="M12 7L8 18" stroke="white" strokeWidth="1" opacity={0.4} />
              </svg>
            )}
          </motion.div>
          <motion.h1
            className="text-3xl md:text-5xl font-black text-white mb-4"
            style={{ fontFamily: "var(--font-hero)" }}
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
          >
            {isClassic ? 'Order Burger Empire Online in Abc City' : 'Order Healthy Meals Online in Abc City'}
          </motion.h1>
          <motion.p
            className="text-base text-white/75 max-w-md mx-auto"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            {isClassic
              ? 'Hot off the flat-top, wrapped tight, and at your door before you can say "I\'m hungry" twice.'
              : 'Farm-fresh ingredients, perfectly portioned, delivered warm to your doorstep. Zero guilt included.'}
          </motion.p>
        </div>
      </section>

      <WaveDivider variant="wave" topColor={heroEdge} bottomColor="#FFFFFF" />

      {/* Order options */}
      <section className="py-14 px-5">
        <div className="max-w-[900px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-5">
          {[
            { icon: <PhoneIcon size={36} color={isClassic ? '#EB7A29' : '#4AA056'} />, title: 'Fastest: The App', desc: 'Skip the line. Track your order in real-time.', cta: 'Get the App' },
            { icon: <GlobeIcon size={36} color={isClassic ? '#EB7A29' : '#4AA056'} />, title: 'Order From Here', desc: 'No downloads needed. Order straight from your browser.', cta: 'Start My Order' },
            { icon: <PhoneIcon size={36} color={isClassic ? '#EB7A29' : '#4AA056'} />, title: 'Talk to a Human', desc: 'Prefer a real voice? We\'re here for you.', cta: '+91 80 4567 8901' },
          ].map((option, i) => (
            <motion.div
              key={option.title}
              className="bg-[#FAFAFA] rounded-xl lg:rounded-2xl border border-gray-100 p-8 text-center group hover:border-gray-300 transition-all cursor-pointer"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              whileHover={{ y: -4 }}
            >
              <motion.div
                className="flex justify-center mb-4"
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.3 }}
              >
                {option.icon}
              </motion.div>
              <h3 className="text-[0.9375rem] font-bold text-gray-900 mb-2">{option.title}</h3>
              <p className="text-xs text-gray-600 mb-5">{option.desc}</p>
              <button
                className="px-5 py-2.5 rounded-md lg:rounded-xl text-xs font-bold uppercase tracking-wide text-white transition-colors"
                style={{ backgroundColor: isClassic ? '#9A1E29' : '#4AA056' }}
              >
                {option.cta}
              </button>
            </motion.div>
          ))}
        </div>

        {/* Quick links */}
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <Link href="/menu" className="px-5 py-2.5 rounded-md lg:rounded-xl text-xs font-bold border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors">
            See the Full Menu
          </Link>
          <Link href="/find-us" className="px-5 py-2.5 rounded-md lg:rounded-xl text-xs font-bold border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors">
            Find Your Nearest Spot
          </Link>
        </div>
      </section>

      {/* Delivery info */}
      <section className="py-12 px-5" style={{ backgroundColor: light }}>
        <div className="max-w-[800px] mx-auto grid grid-cols-3 gap-6 text-center">
          {[
            { icon: <ZapIcon size={28} color={isClassic ? '#EB7A29' : '#4AA056'} />, title: 'Done in 15 min', desc: 'From grill to your bag' },
            { icon: <TruckIcon size={28} color={isClassic ? '#EB7A29' : '#4AA056'} />, title: 'Free delivery', desc: `On orders over ₹${config.delivery.free_above}` },
            { icon: <ShieldIcon size={28} color={isClassic ? '#EB7A29' : '#4AA056'} />, title: 'Arrives Hot', desc: 'Double-insulated packing' },
          ].map((info, i) => (
            <motion.div
              key={info.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
            >
              <div className="flex justify-center mb-2">{info.icon}</div>
              <h3 className="text-sm font-bold text-gray-900">{info.title}</h3>
              <p className="text-[0.6875rem] text-gray-400 mt-0.5">{info.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
