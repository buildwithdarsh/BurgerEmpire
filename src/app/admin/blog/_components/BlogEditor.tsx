'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

/* ---------- Auth helper ---------- */
const getToken = () => {
  try {
    const stored = localStorage.getItem('bb-auth');
    if (stored) {
      const parsed = JSON.parse(stored);
      return parsed?.state?.accessToken || '';
    }
  } catch {}
  return '';
};

const apiFetch = (url: string, options?: RequestInit) =>
  fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getToken()}`,
      ...options?.headers,
    },
  });

/* ---------- Types ---------- */
interface MediaItem {
  id: string;
  type: 'image' | 'video';
  url: string;
  thumbnailUrl?: string | null;
  alt?: string | null;
  caption?: string | null;
  sortOrder: number;
}

interface ReviewItem {
  id: string;
  reviewerName: string;
  reviewerImage?: string | null;
  rating: number;
  content: string;
  isApproved: boolean;
  createdAt: string;
}

interface PostData {
  id?: string;
  title: string;
  slug: string;
  h1: string;
  excerpt: string;
  body: string;
  status: 'draft' | 'published' | 'archived';
  author: string;
  category: string;
  tags: string;
  featuredImage: string;
  metaDescription: string;
  keywords: string;
  ogImage: string;
  canonical: string;
}

const EMPTY_POST: PostData = {
  title: '',
  slug: '',
  h1: '',
  excerpt: '',
  body: '',
  status: 'draft',
  author: '',
  category: '',
  tags: '',
  featuredImage: '',
  metaDescription: '',
  keywords: '',
  ogImage: '',
  canonical: '',
};

/* ---------- Slug generator ---------- */
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

/* ---------- Toast ---------- */
function Toast({ message, type, onClose }: { message: string; type: 'success' | 'error'; onClose: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top-2 fade-in duration-200">
      <div
        className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg border ${
          type === 'success'
            ? 'bg-green-50 border-green-200 text-green-800'
            : 'bg-red-50 border-red-200 text-red-800'
        }`}
      >
        {type === 'success' ? (
          <svg className="w-5 h-5 text-green-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        ) : (
          <svg className="w-5 h-5 text-red-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )}
        <p className="text-sm font-medium">{message}</p>
        <button onClick={onClose} className="ml-2 text-current opacity-50 hover:opacity-100 transition-opacity">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}

/* ---------- Reusable Card ---------- */
function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100">
        <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
}

/* ---------- Form field helpers ---------- */
function FieldLabel({ label, htmlFor }: { label: string; htmlFor?: string }) {
  return (
    <label htmlFor={htmlFor} className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
      {label}
    </label>
  );
}

function TextInput({
  id,
  value,
  onChange,
  placeholder,
  className = '',
}: {
  id?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  className?: string;
}) {
  return (
    <input
      id={id}
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={`w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-300 transition-shadow placeholder:text-gray-300 ${className}`}
    />
  );
}

function TextArea({
  id,
  value,
  onChange,
  placeholder,
  rows = 3,
  className = '',
}: {
  id?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  rows?: number;
  className?: string;
}) {
  return (
    <textarea
      id={id}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      className={`w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-300 transition-shadow resize-y placeholder:text-gray-300 ${className}`}
    />
  );
}

/* ---------- Star rating display ---------- */
function Stars({ rating, size = 'sm' }: { rating: number; size?: 'sm' | 'md' }) {
  const cls = size === 'sm' ? 'w-4 h-4' : 'w-5 h-5';
  return (
    <span className="inline-flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <svg
          key={i}
          className={`${cls} ${i <= rating ? 'text-orange-400' : 'text-gray-200'}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </span>
  );
}

/* ---------- Spinner ---------- */
function Spinner() {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="w-8 h-8 border-2 border-gray-200 border-t-orange-500 rounded-full animate-spin" />
    </div>
  );
}

/* ========== Main component ========== */
export default function BlogEditor({ postId }: { postId?: string }) {
  const router = useRouter();
  const isEditing = Boolean(postId);

  // Form state
  const [post, setPost] = useState<PostData>(EMPTY_POST);
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [reviews, setReviews] = useState<ReviewItem[]>([]);

  // UI state
  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Media form
  const [newMedia, setNewMedia] = useState({ type: 'image' as 'image' | 'video', url: '', alt: '', caption: '' });
  const [addingMedia, setAddingMedia] = useState(false);

  // Review form
  const [newReview, setNewReview] = useState({ reviewerName: '', rating: 5, content: '', isApproved: false });
  const [addingReview, setAddingReview] = useState(false);

  // Editing review state
  const [editingReviewId, setEditingReviewId] = useState<string | null>(null);
  const [editReview, setEditReview] = useState({ reviewerName: '', rating: 5, content: '', isApproved: false });
  const [updatingReview, setUpdatingReview] = useState(false);

  // Deleting states
  const [deletingMediaId, setDeletingMediaId] = useState<string | null>(null);
  const [deletingReviewId, setDeletingReviewId] = useState<string | null>(null);

  const showToast = useCallback((message: string, type: 'success' | 'error') => {
    setToast({ message, type });
  }, []);

  /* ---------- Fetch existing post ---------- */
  useEffect(() => {
    if (!postId) return;

    setLoading(true);
    apiFetch(`/api/admin/blog/${postId}`)
      .then((r) => r.json())
      .then((data) => {
        if (!data.success) {
          showToast(data.message || 'Failed to load post', 'error');
          return;
        }
        const p = data.post;

        let parsedTags = '';
        try {
          const t = typeof p.tags === 'string' ? JSON.parse(p.tags) : p.tags;
          parsedTags = Array.isArray(t) ? t.join(', ') : '';
        } catch {
          parsedTags = '';
        }

        let parsedKeywords = '';
        try {
          const k = typeof p.keywords === 'string' ? JSON.parse(p.keywords) : p.keywords;
          parsedKeywords = Array.isArray(k) ? k.join(', ') : '';
        } catch {
          parsedKeywords = '';
        }

        setPost({
          id: p.id,
          title: p.title || '',
          slug: p.slug || '',
          h1: p.h1 || '',
          excerpt: p.excerpt || '',
          body: p.body || '',
          status: p.status || 'draft',
          author: p.author || '',
          category: p.category || '',
          tags: parsedTags,
          featuredImage: p.featuredImage || '',
          metaDescription: p.metaDescription || '',
          keywords: parsedKeywords,
          ogImage: p.ogImage || '',
          canonical: p.canonical || '',
        });

        setMedia(p.media || []);
        setReviews(p.reviews || []);
      })
      .catch(() => {
        showToast('Failed to load post', 'error');
      })
      .finally(() => setLoading(false));
  }, [postId, showToast]);

  /* ---------- Field updater ---------- */
  const updateField = <K extends keyof PostData>(key: K, value: PostData[K]) => {
    setPost((prev) => ({ ...prev, [key]: value }));
  };

  /* ---------- Slug auto-generate on blur ---------- */
  const handleTitleBlur = () => {
    if (!post.slug && post.title) {
      updateField('slug', generateSlug(post.title));
    }
  };

  /* ---------- Save post ---------- */
  const handleSave = async () => {
    if (!post.title.trim()) {
      showToast('Title is required', 'error');
      return;
    }
    if (!post.body.trim()) {
      showToast('Body content is required', 'error');
      return;
    }

    setSaving(true);

    const tagsArray = post.tags
      ? post.tags.split(',').map((t) => t.trim()).filter(Boolean)
      : [];
    const keywordsArray = post.keywords
      ? post.keywords.split(',').map((k) => k.trim()).filter(Boolean)
      : [];

    const payload = {
      title: post.title,
      slug: post.slug || generateSlug(post.title),
      h1: post.h1 || post.title,
      excerpt: post.excerpt || null,
      body: post.body,
      status: post.status,
      author: post.author || 'Burger Empire Team',
      category: post.category || null,
      tags: tagsArray,
      featuredImage: post.featuredImage || null,
      metaDescription: post.metaDescription || null,
      keywords: keywordsArray,
      ogImage: post.ogImage || null,
      canonical: post.canonical || null,
    };

    try {
      const url = isEditing ? `/api/admin/blog/${postId}` : '/api/admin/blog';
      const method = isEditing ? 'PATCH' : 'POST';

      const res = await apiFetch(url, {
        method,
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (!data.success) {
        showToast(data.message || 'Failed to save post', 'error');
        return;
      }

      showToast(isEditing ? 'Post updated successfully' : 'Post created successfully', 'success');

      // Short delay so the user sees the toast before navigation
      setTimeout(() => {
        router.push('/admin/blog');
      }, 800);
    } catch {
      showToast('Network error while saving', 'error');
    } finally {
      setSaving(false);
    }
  };

  /* ---------- Media actions ---------- */
  const handleAddMedia = async () => {
    if (!newMedia.url.trim()) {
      showToast('Media URL is required', 'error');
      return;
    }

    setAddingMedia(true);
    try {
      const res = await apiFetch(`/api/admin/blog/${postId}/media`, {
        method: 'POST',
        body: JSON.stringify({
          type: newMedia.type,
          url: newMedia.url,
          alt: newMedia.alt || null,
          caption: newMedia.caption || null,
          sortOrder: media.length,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setMedia((prev) => [...prev, data.media]);
        setNewMedia({ type: 'image', url: '', alt: '', caption: '' });
        showToast('Media added', 'success');
      } else {
        showToast(data.message || 'Failed to add media', 'error');
      }
    } catch {
      showToast('Network error', 'error');
    } finally {
      setAddingMedia(false);
    }
  };

  const handleDeleteMedia = async (mediaId: string) => {
    setDeletingMediaId(mediaId);
    try {
      const res = await apiFetch(`/api/admin/blog/${postId}/media`, {
        method: 'DELETE',
        body: JSON.stringify({ mediaId }),
      });
      const data = await res.json();
      if (data.success) {
        setMedia((prev) => prev.filter((m) => m.id !== mediaId));
        showToast('Media removed', 'success');
      } else {
        showToast(data.message || 'Failed to remove media', 'error');
      }
    } catch {
      showToast('Network error', 'error');
    } finally {
      setDeletingMediaId(null);
    }
  };

  /* ---------- Review actions ---------- */
  const handleAddReview = async () => {
    if (!newReview.reviewerName.trim() || !newReview.content.trim()) {
      showToast('Reviewer name and content are required', 'error');
      return;
    }

    setAddingReview(true);
    try {
      const res = await apiFetch(`/api/admin/blog/${postId}/reviews`, {
        method: 'POST',
        body: JSON.stringify({
          reviewerName: newReview.reviewerName,
          rating: newReview.rating,
          content: newReview.content,
          isApproved: newReview.isApproved,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setReviews((prev) => [data.review, ...prev]);
        setNewReview({ reviewerName: '', rating: 5, content: '', isApproved: false });
        showToast('Review added', 'success');
      } else {
        showToast(data.message || 'Failed to add review', 'error');
      }
    } catch {
      showToast('Network error', 'error');
    } finally {
      setAddingReview(false);
    }
  };

  const handleUpdateReview = async (reviewId: string) => {
    setUpdatingReview(true);
    try {
      const res = await apiFetch(`/api/admin/blog/${postId}/reviews`, {
        method: 'PATCH',
        body: JSON.stringify({
          reviewId,
          reviewerName: editReview.reviewerName,
          rating: editReview.rating,
          content: editReview.content,
          isApproved: editReview.isApproved,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setReviews((prev) => prev.map((r) => (r.id === reviewId ? { ...r, ...data.review } : r)));
        setEditingReviewId(null);
        showToast('Review updated', 'success');
      } else {
        showToast(data.message || 'Failed to update review', 'error');
      }
    } catch {
      showToast('Network error', 'error');
    } finally {
      setUpdatingReview(false);
    }
  };

  const handleDeleteReview = async (reviewId: string) => {
    setDeletingReviewId(reviewId);
    try {
      const res = await apiFetch(`/api/admin/blog/${postId}/reviews`, {
        method: 'DELETE',
        body: JSON.stringify({ reviewId }),
      });
      const data = await res.json();
      if (data.success) {
        setReviews((prev) => prev.filter((r) => r.id !== reviewId));
        showToast('Review deleted', 'success');
      } else {
        showToast(data.message || 'Failed to delete review', 'error');
      }
    } catch {
      showToast('Network error', 'error');
    } finally {
      setDeletingReviewId(null);
    }
  };

  const startEditReview = (review: ReviewItem) => {
    setEditingReviewId(review.id);
    setEditReview({
      reviewerName: review.reviewerName,
      rating: review.rating,
      content: review.content,
      isApproved: review.isApproved,
    });
  };

  /* ---------- Render ---------- */
  if (loading) {
    return <Spinner />;
  }

  return (
    <>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* Page header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 text-sm text-gray-400 mb-1">
          <Link href="/admin/blog" className="hover:text-orange-600 transition-colors">
            Blog
          </Link>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
          </svg>
          <span className="text-gray-600">{isEditing ? 'Edit Post' : 'New Post'}</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900">{isEditing ? 'Edit Post' : 'New Post'}</h1>
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ===== Left Column (2/3) ===== */}
        <div className="lg:col-span-2 space-y-6">
          {/* Card: Post Content */}
          <Card title="Post Content">
            <div className="space-y-5">
              <div>
                <FieldLabel label="Title" htmlFor="post-title" />
                <input
                  id="post-title"
                  type="text"
                  value={post.title}
                  onChange={(e) => updateField('title', e.target.value)}
                  onBlur={handleTitleBlur}
                  placeholder="Enter post title"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-300 transition-shadow placeholder:text-gray-300"
                />
              </div>

              <div>
                <FieldLabel label="Slug" htmlFor="post-slug" />
                <div className="flex gap-2">
                  <TextInput
                    id="post-slug"
                    value={post.slug}
                    onChange={(v) => updateField('slug', v)}
                    placeholder="auto-generated-from-title"
                    className="text-sm font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (post.title) updateField('slug', generateSlug(post.title));
                    }}
                    className="shrink-0 px-4 py-2.5 text-xs font-semibold text-orange-700 bg-orange-50 border border-orange-200 rounded-xl hover:bg-orange-100 transition-colors"
                  >
                    Generate
                  </button>
                </div>
              </div>

              <div>
                <FieldLabel label="H1 Heading" htmlFor="post-h1" />
                <TextInput
                  id="post-h1"
                  value={post.h1}
                  onChange={(v) => updateField('h1', v)}
                  placeholder="Page heading (defaults to title)"
                />
              </div>

              <div>
                <FieldLabel label="Excerpt" htmlFor="post-excerpt" />
                <TextArea
                  id="post-excerpt"
                  value={post.excerpt}
                  onChange={(v) => updateField('excerpt', v)}
                  placeholder="Short description of the post..."
                  rows={3}
                />
              </div>

              <div>
                <FieldLabel label="Body" htmlFor="post-body" />
                <TextArea
                  id="post-body"
                  value={post.body}
                  onChange={(v) => updateField('body', v)}
                  placeholder="Write your post content here (HTML supported)..."
                  rows={16}
                  className="min-h-[400px] font-mono text-[0.8125rem] leading-relaxed"
                />
              </div>
            </div>

          </Card>

          {/* Card: Media Gallery */}
          <Card title="Media Gallery">
            {!isEditing ? (
              <div className="text-center py-8">
                <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <p className="text-sm text-gray-500">Save post first to add media and reviews</p>
              </div>
            ) : (
              <div className="space-y-5">
                {/* Existing media grid */}
                {media.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {media.map((item) => (
                      <div
                        key={item.id}
                        className="relative group border border-gray-100 rounded-xl overflow-hidden bg-gray-50"
                      >
                        {item.type === 'image' ? (
                          <div className="aspect-video relative">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={item.url}
                              alt={item.alt || 'Media'}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ) : (
                          <div className="aspect-video bg-gray-900 flex items-center justify-center">
                            <svg className="w-10 h-10 text-white/70" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M8 5v14l11-7z" />
                            </svg>
                          </div>
                        )}
                        <div className="p-2.5">
                          <div className="flex items-center justify-between mb-1">
                            <span
                              className={`inline-flex items-center px-2 py-0.5 rounded-md text-[0.625rem] font-bold uppercase tracking-wider ${
                                item.type === 'image'
                                  ? 'bg-blue-50 text-blue-600'
                                  : 'bg-purple-50 text-purple-600'
                              }`}
                            >
                              {item.type}
                            </span>
                            <button
                              onClick={() => handleDeleteMedia(item.id)}
                              disabled={deletingMediaId === item.id}
                              className="p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                              title="Remove media"
                            >
                              {deletingMediaId === item.id ? (
                                <div className="w-4 h-4 border-2 border-gray-200 border-t-red-400 rounded-full animate-spin" />
                              ) : (
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              )}
                            </button>
                          </div>
                          {item.alt && (
                            <p className="text-xs text-gray-500 truncate">{item.alt}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <p className="text-sm text-gray-400">No media added yet</p>
                  </div>
                )}

                {/* Add media form */}
                <div className="border-t border-gray-100 pt-5">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Add Media</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Type</label>
                      <select
                        value={newMedia.type}
                        onChange={(e) => setNewMedia((prev) => ({ ...prev, type: e.target.value as 'image' | 'video' }))}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-300 transition-shadow bg-white"
                      >
                        <option value="image">Image</option>
                        <option value="video">Video</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">URL</label>
                      <TextInput
                        value={newMedia.url}
                        onChange={(v) => setNewMedia((prev) => ({ ...prev, url: v }))}
                        placeholder="https://..."
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Alt Text</label>
                      <TextInput
                        value={newMedia.alt}
                        onChange={(v) => setNewMedia((prev) => ({ ...prev, alt: v }))}
                        placeholder="Describe the media"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Caption</label>
                      <TextInput
                        value={newMedia.caption}
                        onChange={(v) => setNewMedia((prev) => ({ ...prev, caption: v }))}
                        placeholder="Optional caption"
                      />
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddMedia}
                    disabled={addingMedia}
                    className="mt-3 inline-flex items-center gap-2 px-4 py-2.5 bg-gray-900 text-white text-sm font-semibold rounded-xl hover:bg-gray-800 disabled:opacity-50 transition-all active:scale-[0.98]"
                  >
                    {addingMedia ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Adding...
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Add Media
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </Card>

          {/* Card: Reviews & Testimonials */}
          <Card title="Reviews & Testimonials">
            {!isEditing ? (
              <div className="text-center py-8">
                <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <p className="text-sm text-gray-500">Save post first to add media and reviews</p>
              </div>
            ) : (
              <div className="space-y-5">
                {/* Existing reviews */}
                {reviews.length > 0 ? (
                  <div className="space-y-3">
                    {reviews.map((review) => (
                      <div
                        key={review.id}
                        className="border border-gray-100 rounded-xl p-4"
                      >
                        {editingReviewId === review.id ? (
                          /* Inline edit form */
                          <div className="space-y-3">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              <div>
                                <label className="block text-xs text-gray-500 mb-1">Reviewer Name</label>
                                <TextInput
                                  value={editReview.reviewerName}
                                  onChange={(v) => setEditReview((prev) => ({ ...prev, reviewerName: v }))}
                                />
                              </div>
                              <div>
                                <label className="block text-xs text-gray-500 mb-1">Rating</label>
                                <select
                                  value={editReview.rating}
                                  onChange={(e) => setEditReview((prev) => ({ ...prev, rating: Number(e.target.value) }))}
                                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-300 transition-shadow bg-white"
                                >
                                  {[1, 2, 3, 4, 5].map((n) => (
                                    <option key={n} value={n}>{n} Star{n !== 1 ? 's' : ''}</option>
                                  ))}
                                </select>
                              </div>
                            </div>
                            <div>
                              <label className="block text-xs text-gray-500 mb-1">Content</label>
                              <TextArea
                                value={editReview.content}
                                onChange={(v) => setEditReview((prev) => ({ ...prev, content: v }))}
                                rows={3}
                              />
                            </div>
                            <div className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                id={`edit-approved-${review.id}`}
                                checked={editReview.isApproved}
                                onChange={(e) => setEditReview((prev) => ({ ...prev, isApproved: e.target.checked }))}
                                className="w-4 h-4 rounded border-gray-300 text-orange-500 focus:ring-orange-200"
                              />
                              <label htmlFor={`edit-approved-${review.id}`} className="text-sm text-gray-600">Approved</label>
                            </div>
                            <div className="flex items-center gap-2 pt-1">
                              <button
                                type="button"
                                onClick={() => handleUpdateReview(review.id)}
                                disabled={updatingReview}
                                className="px-4 py-2 bg-gray-900 text-white text-sm font-semibold rounded-xl hover:bg-gray-800 disabled:opacity-50 transition-all active:scale-[0.98]"
                              >
                                {updatingReview ? 'Saving...' : 'Save Changes'}
                              </button>
                              <button
                                type="button"
                                onClick={() => setEditingReviewId(null)}
                                className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          /* Review display */
                          <div>
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="font-semibold text-sm text-gray-900">{review.reviewerName}</span>
                                  <Stars rating={review.rating} />
                                  {review.isApproved && (
                                    <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[0.625rem] font-bold uppercase tracking-wider bg-green-50 text-green-600">
                                      Approved
                                    </span>
                                  )}
                                </div>
                                <p className="text-sm text-gray-600 mt-1.5 line-clamp-2">{review.content}</p>
                              </div>
                              <div className="flex items-center gap-1 shrink-0">
                                <button
                                  type="button"
                                  onClick={() => startEditReview(review)}
                                  className="p-1.5 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                                  title="Edit review"
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                  </svg>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteReview(review.id)}
                                  disabled={deletingReviewId === review.id}
                                  className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                                  title="Delete review"
                                >
                                  {deletingReviewId === review.id ? (
                                    <div className="w-4 h-4 border-2 border-gray-200 border-t-red-400 rounded-full animate-spin" />
                                  ) : (
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                  )}
                                </button>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <p className="text-sm text-gray-400">No reviews yet</p>
                  </div>
                )}

                {/* Add review form */}
                <div className="border-t border-gray-100 pt-5">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Add Review</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Reviewer Name</label>
                      <TextInput
                        value={newReview.reviewerName}
                        onChange={(v) => setNewReview((prev) => ({ ...prev, reviewerName: v }))}
                        placeholder="John Doe"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Rating</label>
                      <select
                        value={newReview.rating}
                        onChange={(e) => setNewReview((prev) => ({ ...prev, rating: Number(e.target.value) }))}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-300 transition-shadow bg-white"
                      >
                        {[1, 2, 3, 4, 5].map((n) => (
                          <option key={n} value={n}>{n} Star{n !== 1 ? 's' : ''}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="mt-3">
                    <label className="block text-xs text-gray-500 mb-1">Content</label>
                    <TextArea
                      value={newReview.content}
                      onChange={(v) => setNewReview((prev) => ({ ...prev, content: v }))}
                      placeholder="Write the review content..."
                      rows={3}
                    />
                  </div>
                  <div className="flex items-center gap-2 mt-3">
                    <input
                      type="checkbox"
                      id="new-review-approved"
                      checked={newReview.isApproved}
                      onChange={(e) => setNewReview((prev) => ({ ...prev, isApproved: e.target.checked }))}
                      className="w-4 h-4 rounded border-gray-300 text-orange-500 focus:ring-orange-200"
                    />
                    <label htmlFor="new-review-approved" className="text-sm text-gray-600">Approved</label>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddReview}
                    disabled={addingReview}
                    className="mt-3 inline-flex items-center gap-2 px-4 py-2.5 bg-gray-900 text-white text-sm font-semibold rounded-xl hover:bg-gray-800 disabled:opacity-50 transition-all active:scale-[0.98]"
                  >
                    {addingReview ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Adding...
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Add Review
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </Card>
        </div>

        {/* ===== Right Column (1/3) ===== */}
        <div className="space-y-6">
          {/* Card: Publish */}
          <Card title="Publish">
            <div className="space-y-4">
              <div>
                <FieldLabel label="Status" htmlFor="post-status" />
                <select
                  id="post-status"
                  value={post.status}
                  onChange={(e) => updateField('status', e.target.value as PostData['status'])}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-300 transition-shadow bg-white"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="archived">Archived</option>
                </select>
              </div>

              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="w-full py-3 bg-gray-900 text-white rounded-xl text-sm font-semibold hover:bg-gray-800 disabled:opacity-50 transition-all active:scale-[0.98]"
              >
                {saving ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Saving...
                  </span>
                ) : isEditing ? (
                  'Update Post'
                ) : (
                  'Create Post'
                )}
              </button>

              <Link
                href="/admin/blog"
                className="block text-center text-sm text-gray-500 hover:text-orange-600 transition-colors py-1.5"
              >
                Back to Blog
              </Link>
            </div>
          </Card>

          {/* Card: Details */}
          <Card title="Details">
            <div className="space-y-4">
              <div>
                <FieldLabel label="Author" htmlFor="post-author" />
                <TextInput
                  id="post-author"
                  value={post.author}
                  onChange={(v) => updateField('author', v)}
                  placeholder="Burger Empire Team"
                />
              </div>

              <div>
                <FieldLabel label="Category" htmlFor="post-category" />
                <TextInput
                  id="post-category"
                  value={post.category}
                  onChange={(v) => updateField('category', v)}
                  placeholder="e.g., Recipes, News"
                />
              </div>

              <div>
                <FieldLabel label="Tags" htmlFor="post-tags" />
                <TextInput
                  id="post-tags"
                  value={post.tags}
                  onChange={(v) => updateField('tags', v)}
                  placeholder="burger, recipe, healthy (comma separated)"
                />
                <p className="text-[0.6875rem] text-gray-400 mt-1">Comma separated values</p>
              </div>

              <div>
                <FieldLabel label="Featured Image URL" htmlFor="post-featured-image" />
                <TextInput
                  id="post-featured-image"
                  value={post.featuredImage}
                  onChange={(v) => updateField('featuredImage', v)}
                  placeholder="https://..."
                />
                {post.featuredImage && (
                  <div className="mt-2 border border-gray-100 rounded-xl overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={post.featuredImage}
                      alt="Featured preview"
                      className="w-full h-32 object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
          </Card>

          {/* Card: SEO */}
          <Card title="SEO">
            <div className="space-y-4">
              <div>
                <FieldLabel label="Meta Description" htmlFor="post-meta-desc" />
                <TextArea
                  id="post-meta-desc"
                  value={post.metaDescription}
                  onChange={(v) => updateField('metaDescription', v)}
                  placeholder="SEO description for search results..."
                  rows={3}
                />
              </div>

              <div>
                <FieldLabel label="Keywords" htmlFor="post-keywords" />
                <TextInput
                  id="post-keywords"
                  value={post.keywords}
                  onChange={(v) => updateField('keywords', v)}
                  placeholder="seo, keywords, here (comma separated)"
                />
                <p className="text-[0.6875rem] text-gray-400 mt-1">Comma separated values</p>
              </div>

              <div>
                <FieldLabel label="OG Image URL" htmlFor="post-og-image" />
                <TextInput
                  id="post-og-image"
                  value={post.ogImage}
                  onChange={(v) => updateField('ogImage', v)}
                  placeholder="https://..."
                />
              </div>

              <div>
                <FieldLabel label="Canonical URL" htmlFor="post-canonical" />
                <TextInput
                  id="post-canonical"
                  value={post.canonical}
                  onChange={(v) => updateField('canonical', v)}
                  placeholder="https://burger-empire.build.withdarsh.com/blog/..."
                />
              </div>
            </div>
          </Card>
        </div>
      </div>

    </>
  );
}
