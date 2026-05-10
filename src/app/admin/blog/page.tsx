'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { PlusIcon, PencilIcon, TrashIcon, SearchIcon } from '@/components/icons';
import { TZ } from '@/lib/tz';
import type { AdminBlogPost } from '@buildwithdarsh/sdk';

type StatusFilter = 'all' | 'published' | 'draft' | 'archived';

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

const STATUS_STYLES: Record<string, string> = {
  published: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
  draft: 'bg-amber-50 text-amber-700 border border-amber-200',
  archived: 'bg-gray-100 text-gray-500 border border-gray-200',
};

// ─── Component ──────────────────────────────────────────────────────────────────

export default function AdminBlogList() {
  const [posts, setPosts] = useState<AdminBlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [search, setSearch] = useState('');
  const [searchDebounced, setSearchDebounced] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => setSearchDebounced(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  const loadPosts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await TZ.admin.content.list({
        ...(statusFilter !== 'all' && { status: statusFilter }),
        ...(searchDebounced && { search: searchDebounced }),
      });
      setPosts(result.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }, [statusFilter, searchDebounced]);

  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  const deletePost = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}"? This action cannot be undone.`)) return;

    setDeletingId(id);
    try {
      await TZ.admin.content.remove(id);
      setPosts((prev) => prev.filter((p) => p.id !== id));
    } catch {
      alert('Failed to delete post. Please try again.');
    } finally {
      setDeletingId(null);
    }
  };

  const statusTabs: { label: string; value: StatusFilter }[] = [
    { label: 'All', value: 'all' },
    { label: 'Published', value: 'published' },
    { label: 'Draft', value: 'draft' },
    { label: 'Archived', value: 'archived' },
  ];

  const filteredCount = posts.length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <h1 className="text-lg font-bold text-gray-900">Blog Posts</h1>
          <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold bg-orange-50 text-orange-600 border border-orange-200">
            {filteredCount}
          </span>
        </div>
        <Link
          href="/admin/blog/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl text-sm font-medium hover:from-orange-600 hover:to-orange-700 transition-all shadow-sm"
        >
          <PlusIcon size={15} />
          New Post
        </Link>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          {/* Status Tabs */}
          <div className="flex items-center gap-1.5 bg-gray-50 rounded-xl p-1">
            {statusTabs.map((tab) => (
              <button
                key={tab.value}
                onClick={() => setStatusFilter(tab.value)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  statusFilter === tab.value
                    ? 'bg-orange-500 text-white shadow-sm'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative flex-1 w-full sm:max-w-xs">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <SearchIcon size={15} color="#9CA3AF" />
            </div>
            <input
              type="text"
              placeholder="Search posts..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-300 placeholder-gray-400"
            />
          </div>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-sm text-red-700 flex items-center justify-between">
          <span>{error}</span>
          <button
            onClick={loadPosts}
            className="text-red-600 font-medium hover:underline text-xs"
          >
            Retry
          </button>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="divide-y divide-gray-50">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="px-5 py-4 flex items-center gap-4">
                <div className="w-16 h-16 bg-gray-100 rounded-lg animate-pulse shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-2/3 bg-gray-100 rounded animate-pulse" />
                  <div className="h-3 w-1/3 bg-gray-50 rounded animate-pulse" />
                </div>
                <div className="h-5 w-16 bg-gray-50 rounded-full animate-pulse" />
                <div className="h-4 w-20 bg-gray-50 rounded animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Posts List */}
      {!loading && !error && posts.length === 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-16 text-center">
          <svg
            className="w-14 h-14 mx-auto text-gray-200 mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <p className="text-sm font-medium text-gray-500">No blog posts yet</p>
          <p className="text-xs text-gray-400 mt-1.5">
            Create your first post to get started!
          </p>
          <Link
            href="/admin/blog/new"
            className="inline-flex items-center gap-2 mt-5 px-4 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl text-sm font-medium hover:from-orange-600 hover:to-orange-700 transition-all shadow-sm"
          >
            <PlusIcon size={15} />
            Create First Post
          </Link>
        </div>
      )}

      {!loading && !error && posts.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="divide-y divide-gray-50">
            {posts.map((post) => (
              <div
                key={post.id}
                className={`px-5 py-4 flex items-center gap-4 hover:bg-gray-50/60 transition-colors ${
                  deletingId === post.id ? 'opacity-50 pointer-events-none' : ''
                }`}
              >
                {/* Thumbnail */}
                <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 shrink-0 flex items-center justify-center">
                  {post.featuredImage ? (
                    <Image
                      src={post.featuredImage}
                      alt={post.title}
                      width={64}
                      height={64}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <svg
                      className="w-7 h-7 text-gray-300"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-gray-900 text-sm truncate">
                      {post.title}
                    </h3>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-gray-400">
                    <span>{post.author}</span>
                    <span className="text-gray-200">|</span>
                    <span>
                      {post.status === 'published' && post.datePublished
                        ? formatDate(post.datePublished)
                        : formatDate(post.createdAt)}
                    </span>
                    {post.viewCount > 0 && (
                      <>
                        <span className="text-gray-200">|</span>
                        <span>{post.viewCount.toLocaleString('en-IN')} views</span>
                      </>
                    )}
                  </div>
                </div>

                {/* Category */}
                {post.category && (
                  <span className="hidden md:inline-flex items-center px-2.5 py-1 rounded-lg text-[0.6875rem] font-medium bg-gray-50 text-gray-500 border border-gray-100 capitalize shrink-0">
                    {post.category}
                  </span>
                )}

                {/* Status Badge */}
                <span
                  className={`inline-flex items-center px-2.5 py-1 rounded-full text-[0.6875rem] font-semibold capitalize shrink-0 ${
                    STATUS_STYLES[post.status] || STATUS_STYLES.draft
                  }`}
                >
                  {post.status}
                </span>

                {/* Actions */}
                <div className="flex items-center gap-1 shrink-0">
                  <Link
                    href={`/admin/blog/${post.id}/edit`}
                    className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Edit post"
                  >
                    <PencilIcon size={15} />
                  </Link>
                  <button
                    onClick={() => deletePost(post.id, post.title)}
                    disabled={deletingId === post.id}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-40"
                    title="Delete post"
                  >
                    <TrashIcon size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
