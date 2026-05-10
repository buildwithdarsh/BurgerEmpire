'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const COOKIE_KEY = 'bb-cookie-consent';

export default function CookieBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem(COOKIE_KEY);
    if (!consent) {
      const timer = setTimeout(() => setShow(true), 2000);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, []);

  const accept = () => {
    localStorage.setItem(COOKIE_KEY, JSON.stringify({ analytics: true, marketing: true, ts: Date.now() }));
    setShow(false);
  };

  const acceptEssential = () => {
    localStorage.setItem(COOKIE_KEY, JSON.stringify({ analytics: false, marketing: false, ts: Date.now() }));
    setShow(false);
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="fixed bottom-0 inset-x-0 z-50 p-4"
        >
          <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-2xl border border-gray-100 p-5">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-gray-900">We use cookies</h3>
                <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                  We use cookies to improve your experience, analyze site traffic, and serve personalized content.
                  You can choose to accept all cookies or only essential ones.
                </p>
              </div>
              <div className="flex gap-2 shrink-0">
                <button
                  onClick={acceptEssential}
                  className="px-4 py-2 text-xs font-medium text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Essential only
                </button>
                <button
                  onClick={accept}
                  className="px-4 py-2 text-xs font-medium text-white bg-gray-900 rounded-xl hover:bg-gray-800 transition-colors"
                >
                  Accept all
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
