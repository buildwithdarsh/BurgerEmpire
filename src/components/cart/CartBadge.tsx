'use client';

import { useCartStore } from '@/store/cart';
import { useMode } from '@/hooks/useMode';
import { motion, AnimatePresence } from 'framer-motion';

export default function CartBadge() {
  const totalItems = useCartStore((s) => s.totalItems());
  const { isClassic } = useMode();

  return (
    <AnimatePresence>
      {totalItems > 0 && (
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0 }}
          className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] rounded-full flex items-center justify-center text-[0.625rem] font-bold text-white"
          style={{ backgroundColor: isClassic ? '#9A1E29' : '#3D8A48' }}
        >
          {totalItems > 99 ? '99+' : totalItems}
        </motion.span>
      )}
    </AnimatePresence>
  );
}
