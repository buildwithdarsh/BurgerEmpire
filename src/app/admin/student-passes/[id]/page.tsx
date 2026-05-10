'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ChevronIcon, CheckIcon, XIcon, ShieldIcon, BanIcon } from '@/components/icons';
import { TZ } from '@/lib/tz';
import type { AdminStudentPassDetail } from '@buildwithdarsh/sdk';

const STATUS_COLORS: Record<string, string> = {
  PENDING: 'bg-yellow-50 text-yellow-700',
  VERIFIED: 'bg-green-50 text-green-700',
  REJECTED: 'bg-red-50 text-red-700',
  EXPIRED: 'bg-gray-100 text-gray-600',
  SUSPENDED: 'bg-red-50 text-red-700',
};

export default function AdminStudentPassDetail() {
  const params = useParams();
  const id = params.id as string;
  const [pass, setPass] = useState<AdminStudentPassDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Approve form state
  const [validityDaysOverride, setValidityDaysOverride] = useState('');
  const [approveNote, setApproveNote] = useState('');

  // Reject form state
  const [rejectionReason, setRejectionReason] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const result = await TZ.admin.studentPasses.get(id);
      setPass(result);
    } catch {
      // silently handle
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { load(); }, [load]);

  const handleApprove = async () => {
    if (!confirm('Approve this student pass?')) return;
    setSaving(true);
    try {
      const payload: Record<string, unknown> = {
        status: 'approved',
        internalNote: approveNote || null,
      };
      if (validityDaysOverride) payload.validityDays = Number(validityDaysOverride);
      await TZ.admin.studentPasses.review(id, payload as any);
      setApproveNote('');
      setValidityDaysOverride('');
      load();
    } finally {
      setSaving(false);
    }
  };

  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      alert('Please provide a rejection reason.');
      return;
    }
    if (!confirm('Reject this student pass?')) return;
    setSaving(true);
    try {
      await TZ.admin.studentPasses.review(id, { status: 'rejected', rejectionReason });
      setRejectionReason('');
      load();
    } finally {
      setSaving(false);
    }
  };

  const handleToggleSuspend = async () => {
    if (!pass) return;
    const action = pass.status === 'SUSPENDED' ? 'unsuspend' : 'suspend';
    if (!confirm(`${action === 'suspend' ? 'Suspend' : 'Unsuspend'} this student pass?`)) return;
    setSaving(true);
    try {
      const adminApi = TZ.client.scoped('/api/v1', 'staff', false);
      await adminApi.post(`/admin/student-passes/${id}/${action}`, {});
      load();
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <div className="w-24 h-4 bg-gray-100 rounded animate-pulse" />
          <ChevronIcon size={14} direction="right" />
          <div className="w-32 h-4 bg-gray-100 rounded animate-pulse" />
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="space-y-4">
            <div className="w-48 h-6 bg-gray-100 rounded animate-pulse" />
            <div className="w-64 h-4 bg-gray-50 rounded animate-pulse" />
            <div className="w-40 h-4 bg-gray-50 rounded animate-pulse" />
          </div>
        </div>
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="w-32 h-5 bg-gray-100 rounded animate-pulse mb-4" />
            <div className="space-y-3">
              <div className="h-4 bg-gray-50 rounded animate-pulse" />
              <div className="h-4 bg-gray-50 rounded animate-pulse w-3/4" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!pass) {
    return (
      <div className="space-y-6">
        <Link href="/admin/student-passes" className="text-sm text-orange-600 hover:underline flex items-center gap-1">
          <ChevronIcon size={14} direction="left" /> Back to Student Passes
        </Link>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
          <p className="text-sm text-gray-400">Student pass not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm">
        <Link href="/admin/student-passes" className="text-orange-600 hover:underline flex items-center gap-1">
          <ChevronIcon size={14} direction="left" /> Student Passes
        </Link>
        <ChevronIcon size={14} direction="right" className="text-gray-300" />
        <span className="text-gray-500">{pass.user.name || 'Unknown'}</span>
      </div>

      {/* Student Profile Card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-semibold text-gray-900">{pass.user.name || 'Unknown Student'}</h1>
              <span className={`px-2.5 py-1 rounded-lg text-xs font-medium ${STATUS_COLORS[pass.status] || 'bg-gray-50 text-gray-600'}`}>
                {pass.status}
              </span>
            </div>
            <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-sm text-gray-500">
              {pass.user.email && <span>{pass.user.email}</span>}
              {pass.user.phone && <span>{pass.user.phone}</span>}
            </div>
            <p className="text-xs text-gray-400 mt-1">
              Student ID: <span className="font-mono">{pass.studentIdNumber}</span>
              {pass.year && <> &middot; {pass.year}</>}
            </p>
            {pass.aadhaarLast4 && (
              <p className="text-xs text-gray-400 mt-0.5">
                Aadhaar: <span className="font-mono">XXXX XXXX {pass.aadhaarLast4}</span>
              </p>
            )}
            <p className="text-xs text-gray-400 mt-0.5">
              Submitted {new Date(pass.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
            </p>
            {pass.reviewedAt && (
              <p className="text-xs text-gray-400 mt-0.5">
                Reviewed {new Date(pass.reviewedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
              </p>
            )}
          </div>
          <div className="flex items-center gap-3">
            {pass.expiresAt && (
              <div className="text-center px-4 py-2 bg-gray-50 rounded-xl">
                <p className="text-sm font-semibold text-gray-900">
                  {new Date(pass.expiresAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                </p>
                <p className="text-xs text-gray-400">Expires</p>
              </div>
            )}
            {pass.status === 'VERIFIED' || pass.status === 'SUSPENDED' ? (
              <button
                onClick={handleToggleSuspend}
                disabled={saving}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors disabled:opacity-50 ${
                  pass.status === 'SUSPENDED'
                    ? 'bg-green-600 text-white hover:bg-green-700'
                    : 'bg-red-600 text-white hover:bg-red-700'
                }`}
              >
                {pass.status === 'SUSPENDED' ? <ShieldIcon size={15} /> : <BanIcon size={15} />}
                {pass.status === 'SUSPENDED' ? 'Unsuspend' : 'Suspend'}
              </button>
            ) : null}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Student Info */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900">Student Info</h2>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">Student ID</p>
              <p className="text-sm font-mono font-semibold text-gray-900 mt-0.5">{pass.studentIdNumber}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">Year</p>
              <p className="text-sm font-semibold text-gray-900 mt-0.5">{pass.year || '-'}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">Aadhaar (last 4)</p>
              <p className="text-sm font-mono font-semibold text-gray-900 mt-0.5">
                {pass.aadhaarLast4 ? `XXXX XXXX ${pass.aadhaarLast4}` : '-'}
              </p>
            </div>
          </div>
        </div>

        {/* Institution Info */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900">Institution</h2>
          </div>
          {pass.institution ? (
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-3">
                <h3 className="text-lg font-semibold text-gray-900">{pass.institution.name}</h3>
                <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs font-mono">
                  {pass.institution.shortCode}
                </span>
              </div>
              {pass.institution.emailDomain && (
                <p className="text-sm text-gray-500">Email domain: <span className="font-mono">{pass.institution.emailDomain}</span></p>
              )}
              <div className="flex flex-wrap gap-2">
                <span className={`px-2.5 py-1 rounded-lg text-xs font-medium ${
                  pass.institution.requiresManualReview ? 'bg-yellow-50 text-yellow-700' : 'bg-green-50 text-green-700'
                }`}>
                  {pass.institution.requiresManualReview ? 'Manual Review Required' : 'Auto-Verify Eligible'}
                </span>
                {pass.institution.customValidityDays && (
                  <span className="px-2.5 py-1 bg-blue-50 text-blue-700 rounded-lg text-xs font-medium">
                    {pass.institution.customValidityDays} days validity
                  </span>
                )}
              </div>

              {/* Fraud Signals */}
              <div className="pt-4 border-t border-gray-100">
                <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Fraud Signals</h4>
                <div className="flex gap-4">
                  <div className={`text-center px-4 py-2 rounded-xl ${
                    pass.fraudSignals.dailyUsageCount > 5 ? 'bg-red-50' : 'bg-gray-50'
                  }`}>
                    <p className={`text-lg font-semibold ${pass.fraudSignals.dailyUsageCount > 5 ? 'text-red-700' : 'text-gray-900'}`}>
                      {pass.fraudSignals.dailyUsageCount}
                    </p>
                    <p className="text-xs text-gray-400">Uses Today</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-6 text-center">
              <p className="text-sm text-gray-400">No institution linked</p>
            </div>
          )}
        </div>

        {/* Approve Form */}
        {pass.status === 'PENDING' && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-green-50/50">
              <h2 className="font-semibold text-green-800">Approve Pass</h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="text-xs font-medium text-gray-500">Validity Days Override (optional)</label>
                <input
                  type="number"
                  value={validityDaysOverride}
                  onChange={(e) => setValidityDaysOverride(e.target.value)}
                  placeholder={pass.institution?.customValidityDays ? `Default: ${pass.institution.customValidityDays}` : 'Default: 365'}
                  className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-200"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500">Internal Note (optional)</label>
                <textarea
                  value={approveNote}
                  onChange={(e) => setApproveNote(e.target.value)}
                  rows={2}
                  placeholder="Add an internal note..."
                  className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-200 resize-none"
                />
              </div>
              <button
                onClick={handleApprove}
                disabled={saving}
                className="flex items-center gap-2 px-4 py-2.5 bg-green-600 text-white rounded-xl text-sm font-medium hover:bg-green-700 disabled:opacity-50 transition-colors"
              >
                <CheckIcon size={15} />
                {saving ? 'Approving...' : 'Approve Pass'}
              </button>
            </div>
          </div>
        )}

        {/* Reject Form */}
        {pass.status === 'PENDING' && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-red-50/50">
              <h2 className="font-semibold text-red-800">Reject Pass</h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="text-xs font-medium text-gray-500">Rejection Reason</label>
                <textarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  rows={3}
                  placeholder="Explain why this pass is being rejected..."
                  className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-200 resize-none"
                />
              </div>
              <button
                onClick={handleReject}
                disabled={saving}
                className="flex items-center gap-2 px-4 py-2.5 bg-red-600 text-white rounded-xl text-sm font-medium hover:bg-red-700 disabled:opacity-50 transition-colors"
              >
                <XIcon size={15} />
                {saving ? 'Rejecting...' : 'Reject Pass'}
              </button>
            </div>
          </div>
        )}

        {/* Rejection Info (if already rejected) */}
        {pass.status === 'REJECTED' && pass.rejectionReason && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-red-50/50">
              <h2 className="font-semibold text-red-800">Rejection Details</h2>
            </div>
            <div className="p-6">
              <p className="text-sm text-gray-700 whitespace-pre-wrap">{pass.rejectionReason}</p>
            </div>
          </div>
        )}

        {/* Internal Note (if present) */}
        {pass.internalNote && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="font-semibold text-gray-900">Internal Note</h2>
            </div>
            <div className="p-6">
              <p className="text-sm text-gray-700 whitespace-pre-wrap">{pass.internalNote}</p>
            </div>
          </div>
        )}
      </div>

      {/* Usage History */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900">Usage History</h2>
        </div>
        {pass.usageHistory.length === 0 ? (
          <div className="p-6 text-center">
            <p className="text-sm text-gray-400">No usage history yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500 bg-gray-50/50">
                  <th className="px-6 py-2.5 font-medium text-xs">Date</th>
                  <th className="px-6 py-2.5 font-medium text-xs">Order ID</th>
                  <th className="px-6 py-2.5 font-medium text-xs text-right">Discount Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {pass.usageHistory.map((usage) => (
                  <tr key={usage.id} className="hover:bg-gray-50/50">
                    <td className="px-6 py-3 text-gray-600 text-xs">
                      {new Date(usage.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="px-6 py-3">
                      <Link href={`/admin/orders/${usage.orderId}`} className="text-orange-600 hover:underline font-mono text-xs">
                        {usage.orderId.slice(-8)}
                      </Link>
                    </td>
                    <td className="px-6 py-3 text-right font-medium text-gray-900">
                      ₹{usage.discountAmount}
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
