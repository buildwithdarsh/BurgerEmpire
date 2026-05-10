'use client';

import { useEffect, useState, useCallback } from 'react';
import Image from 'next/image';
import { XIcon, CheckIcon } from '@/components/icons';
import { TZ } from '@/lib/tz';
import type { AdminReview } from '@buildwithdarsh/sdk';

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-50 text-yellow-700',
  approved: 'bg-green-50 text-green-700',
  hidden: 'bg-gray-100 text-gray-600',
  flagged: 'bg-red-50 text-red-600',
};

const STATUSES = ['all', 'pending', 'approved', 'hidden', 'flagged'];

function StarRating({ rating, size = 16 }: { rating: number; size?: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} width={size} height={size} viewBox="0 0 24 24" fill={i < rating ? '#F59E0B' : 'none'} stroke={i < rating ? '#F59E0B' : '#D1D5DB'} strokeWidth="2">
          <path d="M12 2L14.9 8.6L22 9.2L16.8 13.9L18.4 21L12 17.3L5.6 21L7.2 13.9L2 9.2L9.1 8.6L12 2Z" />
        </svg>
      ))}
    </div>
  );
}

export default function AdminReviews() {
  const [reviews, setReviews] = useState<AdminReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('all');
  const [selectedReview, setSelectedReview] = useState<AdminReview | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, string> = {};
      if (status !== 'all') params.status = status;
      const result = await TZ.admin.reviews.list(params);
      setReviews(result.data || []);
    } catch {
      // silently handle
    } finally {
      setLoading(false);
    }
  }, [status]);

  useEffect(() => { load(); }, [load]);

  const updateStatus = async (reviewId: string, newStatus: string) => {
    setActionLoading(reviewId);
    try {
      await TZ.admin.reviews.updateStatus(reviewId, { status: newStatus as 'approved' | 'rejected' });
      load();
      if (selectedReview?.id === reviewId) {
        setSelectedReview((prev) => prev ? { ...prev, status: newStatus } : null);
      }
    } catch {
      // silently handle
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Reviews</h1>
        <p className="text-sm text-gray-400 mt-0.5">Manage customer reviews and ratings</p>
      </div>

      {/* Filters */}
      <div className="flex gap-2 overflow-x-auto">
        {STATUSES.map((s) => (
          <button
            key={s}
            onClick={() => setStatus(s)}
            className={`px-3 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-colors ${
              status === s ? 'bg-gray-900 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
          >
            {s === 'all' ? 'All' : s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        ))}
      </div>

      {/* Detail Modal */}
      {selectedReview && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4" onClick={() => setSelectedReview(null)}>
          <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Review Detail</h2>
              <button onClick={() => setSelectedReview(null)} className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                <XIcon size={18} />
              </button>
            </div>

            <div className="space-y-4">
              {/* Customer & Rating */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">{selectedReview.customerName}</p>
                  {selectedReview.customerEmail && <p className="text-xs text-gray-400">{selectedReview.customerEmail}</p>}
                  {selectedReview.orderNumber && (
                    <p className="text-xs text-gray-400 mt-0.5">Order #{selectedReview.orderNumber}</p>
                  )}
                </div>
                <div className="text-right">
                  <StarRating rating={selectedReview.rating} size={20} />
                  <span className={`inline-block mt-1 px-2.5 py-1 rounded-lg text-xs font-medium ${STATUS_COLORS[selectedReview.status] || 'bg-gray-50 text-gray-600'}`}>
                    {selectedReview.status}
                  </span>
                </div>
              </div>

              {/* Comment */}
              {selectedReview.comment && (
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">{selectedReview.comment}</p>
                </div>
              )}

              {/* Photos */}
              {selectedReview.photos && selectedReview.photos.length > 0 && (
                <div>
                  <p className="text-xs font-medium text-gray-500 mb-2">Photos</p>
                  <div className="flex gap-2 overflow-x-auto">
                    {selectedReview.photos.map((photo, i) => (
                      <Image key={i} src={photo} alt={`Review photo ${i + 1}`} width={96} height={96} className="w-24 h-24 rounded-xl object-cover border border-gray-100" />
                    ))}
                  </div>
                </div>
              )}

              {/* Item Ratings */}
              {selectedReview.itemRatings && selectedReview.itemRatings.length > 0 && (
                <div>
                  <p className="text-xs font-medium text-gray-500 mb-2">Item Ratings</p>
                  <div className="space-y-2">
                    {selectedReview.itemRatings.map((item, i) => (
                      <div key={i} className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2">
                        <div>
                          <p className="text-sm text-gray-900">{item.itemName}</p>
                          {item.comment && <p className="text-xs text-gray-400 mt-0.5">{item.comment}</p>}
                        </div>
                        <StarRating rating={item.rating} size={12} />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Date */}
              <p className="text-xs text-gray-400">
                {new Date(selectedReview.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
              </p>

              {/* Actions */}
              <div className="flex gap-2 pt-2 border-t border-gray-100">
                {selectedReview.status !== 'approved' && (
                  <button onClick={() => updateStatus(selectedReview.id, 'approved')}
                    disabled={actionLoading === selectedReview.id}
                    className="flex items-center gap-1.5 px-4 py-2 bg-green-600 text-white rounded-xl text-xs font-medium hover:bg-green-700 disabled:opacity-50 transition-colors">
                    <CheckIcon size={13} /> Approve
                  </button>
                )}
                {selectedReview.status !== 'hidden' && (
                  <button onClick={() => updateStatus(selectedReview.id, 'hidden')}
                    disabled={actionLoading === selectedReview.id}
                    className="flex items-center gap-1.5 px-4 py-2 bg-gray-600 text-white rounded-xl text-xs font-medium hover:bg-gray-700 disabled:opacity-50 transition-colors">
                    <svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94" />
                      <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                    Hide
                  </button>
                )}
                {selectedReview.status !== 'flagged' && (
                  <button onClick={() => updateStatus(selectedReview.id, 'flagged')}
                    disabled={actionLoading === selectedReview.id}
                    className="flex items-center gap-1.5 px-4 py-2 bg-red-600 text-white rounded-xl text-xs font-medium hover:bg-red-700 disabled:opacity-50 transition-colors">
                    <svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
                      <line x1="4" y1="22" x2="4" y2="15" />
                    </svg>
                    Flag
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reviews Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="divide-y divide-gray-50">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="px-6 py-4 flex gap-4">
                <div className="w-32 h-4 bg-gray-100 rounded animate-pulse" />
                <div className="w-16 h-4 bg-gray-50 rounded animate-pulse" />
                <div className="w-20 h-4 bg-gray-50 rounded animate-pulse" />
                <div className="flex-1 h-4 bg-gray-50 rounded animate-pulse" />
                <div className="w-16 h-4 bg-gray-50 rounded animate-pulse" />
                <div className="w-24 h-4 bg-gray-50 rounded animate-pulse" />
              </div>
            ))}
          </div>
        ) : reviews.length === 0 ? (
          <div className="p-12 text-center">
            <svg className="w-12 h-12 mx-auto text-gray-200 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}>
              <path d="M12 2L14.9 8.6L22 9.2L16.8 13.9L18.4 21L12 17.3L5.6 21L7.2 13.9L2 9.2L9.1 8.6L12 2Z" />
            </svg>
            <p className="text-sm text-gray-400">No reviews yet</p>
            <p className="text-xs text-gray-300 mt-1">Reviews will appear here when customers submit them</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500 border-b border-gray-100 bg-gray-50/50">
                  <th className="px-6 py-3 font-medium">Customer</th>
                  <th className="px-6 py-3 font-medium">Order</th>
                  <th className="px-6 py-3 font-medium">Rating</th>
                  <th className="px-6 py-3 font-medium">Comment</th>
                  <th className="px-6 py-3 font-medium text-center">Status</th>
                  <th className="px-6 py-3 font-medium text-right">Date</th>
                  <th className="px-6 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {reviews.map((review) => (
                  <tr key={review.id} className="hover:bg-gray-50/50">
                    <td className="px-6 py-4">
                      <button onClick={() => setSelectedReview(review)} className="text-left hover:underline">
                        <p className="text-gray-900 font-medium">{review.customerName}</p>
                      </button>
                    </td>
                    <td className="px-6 py-4 text-gray-500 font-mono text-xs">
                      {review.orderNumber || (review.orderId ? review.orderId.slice(-8) : '-')}
                    </td>
                    <td className="px-6 py-4">
                      <StarRating rating={review.rating} size={14} />
                    </td>
                    <td className="px-6 py-4 text-gray-600 max-w-xs">
                      <button onClick={() => setSelectedReview(review)} className="text-left">
                        <p className="truncate">{review.comment || <span className="text-gray-300 italic">No comment</span>}</p>
                      </button>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-2.5 py-1 rounded-lg text-xs font-medium ${STATUS_COLORS[review.status] || 'bg-gray-50 text-gray-600'}`}>
                        {review.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right text-gray-500 text-xs">
                      {new Date(review.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex gap-1 justify-end">
                        {review.status !== 'approved' && (
                          <button onClick={() => updateStatus(review.id, 'approved')}
                            disabled={actionLoading === review.id}
                            title="Approve"
                            className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition-colors disabled:opacity-50">
                            <CheckIcon size={15} />
                          </button>
                        )}
                        {review.status !== 'hidden' && (
                          <button onClick={() => updateStatus(review.id, 'hidden')}
                            disabled={actionLoading === review.id}
                            title="Hide"
                            className="p-1.5 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50">
                            <svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94" />
                              <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19" />
                              <line x1="1" y1="1" x2="23" y2="23" />
                            </svg>
                          </button>
                        )}
                        {review.status !== 'flagged' && (
                          <button onClick={() => updateStatus(review.id, 'flagged')}
                            disabled={actionLoading === review.id}
                            title="Flag"
                            className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50">
                            <svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
                              <line x1="4" y1="22" x2="4" y2="15" />
                            </svg>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
