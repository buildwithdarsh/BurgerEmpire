'use client';

import { useMode } from '@/hooks/useMode';
import { motion } from 'framer-motion';
import { BurgerIcon, LeafIcon } from './icons';

export default function FloatingModePill() {
  const { isClassic, toggleMode, isTransitioning } = useMode();

  return (
    <motion.button
      onClick={() => !isTransitioning && toggleMode()}
      disabled={isTransitioning}
      className="fixed bottom-20 right-4 z-50 flex items-center gap-2 px-3.5 py-2 rounded-full shadow-lg border backdrop-blur-sm transition-colors duration-500"
      style={{
        backgroundColor: isClassic ? 'rgba(235, 122, 41, 0.95)' : 'rgba(74, 160, 86, 0.95)',
        borderColor: isClassic ? 'rgba(235, 122, 41, 0.3)' : 'rgba(74, 160, 86, 0.3)',
      }}
      whileTap={{ scale: 0.92 }}
      layout
    >
      <div className="relative flex items-center gap-1.5 overflow-hidden">
        <span className="w-5 h-5 rounded-full bg-white/90 flex items-center justify-center flex-shrink-0">
          <motion.span
            animate={{ y: isClassic ? 0 : -20 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            className="absolute"
          >
            <BurgerIcon size={11} color="#EB7A29" />
          </motion.span>
          <motion.span
            animate={{ y: isClassic ? 20 : 0 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            className="absolute"
          >
            <LeafIcon size={11} color="#4AA056" />
          </motion.span>
        </span>
        <div className="relative h-[14px] overflow-hidden">
          <motion.span
            animate={{ y: isClassic ? 0 : -16 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            className="block text-[11px] font-bold text-white tracking-wide uppercase leading-[14px]"
          >
            Classic
          </motion.span>
          <motion.span
            animate={{ y: isClassic ? 0 : -16 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            className="block text-[11px] font-bold text-white tracking-wide uppercase leading-[14px]"
          >
            Healthy
          </motion.span>
        </div>
      </div>
    </motion.button>
  );
}
