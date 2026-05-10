'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

const DISMISSED_KEY = 'bb-exit-intent-dismissed';

export default function ExitIntentModal() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Don't show if already dismissed this session
    if (sessionStorage.getItem(DISMISSED_KEY)) return;

    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0) {
        setShow(true);
        document.removeEventListener('mouseleave', handleMouseLeave);
      }
    };

    // Wait 5 seconds before enabling exit intent
    const timer = setTimeout(() => {
      document.addEventListener('mouseleave', handleMouseLeave);
    }, 5000);

    return () => {
      clearTimeout(timer);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  const dismiss = () => {
    sessionStorage.setItem(DISMISSED_KEY, '1');
    setShow(false);
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={dismiss}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', damping: 25 }}
            className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header with gradient */}
            <div className="bg-gradient-to-br from-orange-500 to-red-500 p-6 text-white text-center">
              <div className="text-4xl mb-2">🍔</div>
              <h2 className="text-xl font-bold">Wait! Don&apos;t leave hungry!</h2>
              <p className="text-sm text-white/80 mt-1">
                Get 15% off your first order
              </p>
            </div>

            <div className="p-6 text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-50 rounded-full mb-4">
                <span className="text-orange-700 font-mono font-bold text-lg">WELCOME15</span>
              </div>
              <p className="text-sm text-gray-500 mb-5">
                Use code <strong>WELCOME15</strong> at checkout for 15% off your first order. Valid on orders above ₹299.
              </p>
              <div className="flex flex-col gap-2">
                <Link
                  href="/order-online"
                  className="w-full py-3 bg-gray-900 text-white rounded-xl text-sm font-semibold hover:bg-gray-800 transition-colors text-center block"
                >
                  Order Now
                </Link>
                <button
                  onClick={dismiss}
                  className="w-full py-2.5 text-sm text-gray-500 hover:text-gray-700 transition-colors"
                >
                  No thanks, I&apos;ll pass
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
