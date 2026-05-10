'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMode } from '@/hooks/useMode';
import { TZ } from '@/lib/tz';
import PageLoader from '@/components/ui/PageLoader';

interface Article {
  id: string;
  title: string;
  body: string;
  category: string;
}

interface GroupedArticles {
  [category: string]: Article[];
}

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
};

export default function HelpPage() {
  const { isClassic } = useMode();
  const accent = isClassic ? '#9A1E29' : '#4AA056';
  const light = isClassic ? '#FFF9F0' : '#F5FBF7';

  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [openArticleId, setOpenArticleId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchArticles() {
      setLoading(true);
      try {
        const res = await TZ.storefront.content.list({ type: 'help' } as any);
        const articles = ((res as any)?.data ?? res) as any[];
        setArticles(articles);
      } catch {
        setError('Unable to load help articles. Please try again.');
      } finally {
        setLoading(false);
      }
    }
    fetchArticles();
  }, []);

  const filtered = useMemo(() => {
    const list = Array.isArray(articles) ? articles : [];
    if (!searchQuery.trim()) return list;
    const q = searchQuery.toLowerCase();
    return list.filter(
      (a) =>
        a.title.toLowerCase().includes(q) ||
        a.body.toLowerCase().includes(q) ||
        a.category.toLowerCase().includes(q)
    );
  }, [articles, searchQuery]);

  const grouped = useMemo(() => {
    const groups: GroupedArticles = {};
    for (const article of filtered ?? []) {
      if (!groups[article.category]) {
        groups[article.category] = [];
      }
      groups[article.category].push(article);
    }
    return groups;
  }, [filtered]);

  const categories = Object.keys(grouped);

  function toggleArticle(id: string) {
    setOpenArticleId((prev) => (prev === id ? null : id));
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: light }}>
      {/* Hero */}
      <section
        className="py-16 px-5"
        style={{
          background: isClassic
            ? 'linear-gradient(135deg, #9A1E29, #7A1722)'
            : 'linear-gradient(135deg, #4AA056, #3D8A48)',
        }}
      >
        <div className="max-w-[700px] mx-auto text-center">
          <motion.div initial="hidden" animate="visible" variants={fadeUp}>
            <h1
              className="text-3xl md:text-5xl font-black text-white mb-3"
              style={{ fontFamily: 'var(--font-hero)' }}
            >
              Help Centre
            </h1>
            <p className="text-base text-white/70 mb-8">
              Find answers to common questions or search for what you need.
            </p>

            {/* Search box */}
            <div className="relative max-w-[500px] mx-auto">
              <svg
                className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for help..."
                className="w-full pl-12 pr-4 py-4 rounded-xl lg:rounded-2xl text-sm text-gray-900 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-white/30 transition-shadow"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Articles */}
      <section className="max-w-[800px] mx-auto px-5 py-[80px]">
        {loading ? (
          <PageLoader text="Loading articles..." />
        ) : error ? (
          <div className="text-center py-16" role="alert">
            <svg className="w-12 h-12 text-gray-200 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
            <p className="text-sm text-gray-500 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-5 py-2 rounded-md lg:rounded-xl text-sm font-bold text-white transition-all hover:opacity-90"
              style={{ backgroundColor: accent }}
            >
              Try Again
            </button>
          </div>
        ) : categories.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">
              {searchQuery ? 'No results found.' : 'No help articles available.'}
            </p>
            {searchQuery && (
              <p className="text-gray-400 text-sm mt-1">
                Try a different search term or{' '}
                <button
                  onClick={() => setSearchQuery('')}
                  className="underline"
                  style={{ color: accent }}
                >
                  clear your search
                </button>
              </p>
            )}
          </div>
        ) : (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="space-y-8"
          >
            {categories.map((category) => (
              <div key={category}>
                <h2
                  className="text-lg font-bold mb-3 flex items-center gap-2"
                  style={{ color: accent }}
                >
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: accent }}
                  />
                  {category}
                </h2>

                <div className="bg-white rounded-xl lg:rounded-2xl shadow-sm border border-gray-100 overflow-hidden divide-y divide-gray-100">
                  {grouped[category].map((article) => {
                    const isOpen = openArticleId === article.id;
                    return (
                      <div key={article.id}>
                        <button
                          onClick={() => toggleArticle(article.id)}
                          className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-50 transition-colors"
                          aria-expanded={isOpen}
                        >
                          <span className="text-sm font-semibold text-gray-900 pr-4">
                            {article.title}
                          </span>
                          <svg
                            className="w-5 h-5 text-gray-400 flex-shrink-0 transition-transform duration-200"
                            style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M19 9l-7 7-7-7"
                            />
                          </svg>
                        </button>
                        <AnimatePresence>
                          {isOpen && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                              className="overflow-hidden"
                            >
                              <div
                                className="px-5 pb-5 text-sm text-gray-600 leading-relaxed"
                                style={{ borderLeft: `3px solid ${accent}`, marginLeft: '20px' }}
                              >
                                {article.body}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </section>
    </div>
  );
}
