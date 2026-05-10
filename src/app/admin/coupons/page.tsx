'use client';

import { useEffect, useState, useCallback } from 'react';
import { PlusIcon, PencilIcon, TrashIcon, XIcon, CheckIcon, ToggleOnIcon, ToggleOffIcon } from '@/components/icons';
import { TZ } from '@/lib/tz';
import type { AdminCoupon } from '@buildwithdarsh/sdk';

const EMPTY_FORM = {
  code: '', name: '', description: '', discountType: 'percentage', discountValue: 0,
  minOrderAmount: '', maxDiscount: '', maxUsageTotal: '', maxUsagePerUser: 1,
  isActive: true, startDate: '', endDate: '', applicableModes: 'both',
};

export default function AdminCoupons() {
  const [coupons, setCoupons] = useState<AdminCoupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const result = await TZ.admin.coupons.list();
      setCoupons(result.data);
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const openEdit = (coupon: AdminCoupon) => {
    setEditingId(coupon.id);
    setForm({
      code: coupon.code,
      name: coupon.name,
      description: coupon.description || '',
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      minOrderAmount: coupon.minOrderAmount?.toString() || '',
      maxDiscount: coupon.maxDiscount?.toString() || '',
      maxUsageTotal: coupon.maxUsageTotal?.toString() || '',
      maxUsagePerUser: coupon.maxUsagePerUser,
      isActive: coupon.isActive,
      startDate: coupon.startDate ? coupon.startDate.split('T')[0] : '',
      endDate: coupon.endDate ? coupon.endDate.split('T')[0] : '',
      applicableModes: coupon.applicableModes,
    });
    setShowForm(true);
  };

  const openNew = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setShowForm(true);
  };

  const save = async () => {
    setSaving(true);
    try {
      const payload = {
        code: form.code,
        name: form.name,
        description: form.description || null,
        discountType: form.discountType,
        discountValue: Number(form.discountValue),
        minOrderAmount: form.minOrderAmount ? Number(form.minOrderAmount) : null,
        maxDiscount: form.maxDiscount ? Number(form.maxDiscount) : null,
        maxUsageTotal: form.maxUsageTotal ? Number(form.maxUsageTotal) : null,
        maxUsagePerUser: Number(form.maxUsagePerUser),
        isActive: form.isActive,
        startDate: form.startDate || null,
        endDate: form.endDate || null,
        applicableModes: form.applicableModes,
      };

      if (editingId) {
        await TZ.admin.coupons.update(editingId, payload);
      } else {
        await TZ.admin.coupons.create(payload);
      }
      setShowForm(false);
      load();
    } finally {
      setSaving(false);
    }
  };

  const toggleActive = async (coupon: AdminCoupon) => {
    await TZ.admin.coupons.update(coupon.id, { isActive: !coupon.isActive });
    load();
  };

  const deleteCoupon = async (id: string) => {
    if (!confirm('Delete this coupon? This cannot be undone.')) return;
    await TZ.admin.coupons.remove(id);
    load();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Coupons</h1>
          <p className="text-sm text-gray-400 mt-0.5">Create and manage discount codes</p>
        </div>
        <button onClick={openNew} className="flex items-center gap-2 px-4 py-2.5 bg-gray-900 text-white rounded-xl text-sm font-medium hover:bg-gray-800 transition-colors">
          <PlusIcon size={15} />
          New Coupon
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4" onClick={() => setShowForm(false)}>
          <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">{editingId ? 'Edit Coupon' : 'New Coupon'}</h2>
              <button onClick={() => setShowForm(false)} className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                <XIcon size={18} />
              </button>
            </div>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-gray-500">Code</label>
                  <input value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                    className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-200" />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500">Name</label>
                  <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-200" />
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500">Description</label>
                <input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-200" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-gray-500">Discount Type</label>
                  <select value={form.discountType} onChange={(e) => setForm({ ...form, discountType: e.target.value })}
                    className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-200">
                    <option value="percentage">Percentage</option>
                    <option value="fixed">Fixed Amount</option>
                    <option value="freeDelivery">Free Delivery</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500">Discount Value</label>
                  <input type="number" value={form.discountValue} onChange={(e) => setForm({ ...form, discountValue: Number(e.target.value) })}
                    className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-200" />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-medium text-gray-500">Min Order ₹</label>
                  <input type="number" value={form.minOrderAmount} onChange={(e) => setForm({ ...form, minOrderAmount: e.target.value })}
                    className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-200" />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500">Max Discount ₹</label>
                  <input type="number" value={form.maxDiscount} onChange={(e) => setForm({ ...form, maxDiscount: e.target.value })}
                    className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-200" />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500">Max Usage</label>
                  <input type="number" value={form.maxUsageTotal} onChange={(e) => setForm({ ...form, maxUsageTotal: e.target.value })}
                    className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-200" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-gray-500">Start Date</label>
                  <input type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                    className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-200" />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500">End Date</label>
                  <input type="date" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                    className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-200" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-gray-500">Applicable Modes</label>
                  <select value={form.applicableModes} onChange={(e) => setForm({ ...form, applicableModes: e.target.value })}
                    className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-200">
                    <option value="both">Both</option>
                    <option value="classic">Classic Only</option>
                    <option value="healthy">Healthy Only</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500">Per User Limit</label>
                  <input type="number" value={form.maxUsagePerUser} onChange={(e) => setForm({ ...form, maxUsagePerUser: Number(e.target.value) })}
                    className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-200" />
                </div>
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                  className="w-4 h-4 rounded border-gray-300 text-orange-600" />
                <span className="text-sm text-gray-700">Active</span>
              </label>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={save} disabled={saving}
                className="flex items-center justify-center gap-2 flex-1 py-2.5 bg-gray-900 text-white rounded-xl text-sm font-medium hover:bg-gray-800 disabled:opacity-50 transition-colors">
                <CheckIcon size={15} />
                {saving ? 'Saving...' : editingId ? 'Update' : 'Create'}
              </button>
              <button onClick={() => setShowForm(false)}
                className="flex items-center gap-2 px-6 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
                <XIcon size={15} />
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Coupons Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="divide-y divide-gray-50">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="px-6 py-4 flex gap-4">
                <div className="w-20 h-4 bg-gray-100 rounded animate-pulse" />
                <div className="flex-1 h-4 bg-gray-50 rounded animate-pulse" />
                <div className="w-16 h-4 bg-gray-50 rounded animate-pulse" />
                <div className="w-12 h-4 bg-gray-50 rounded animate-pulse" />
              </div>
            ))}
          </div>
        ) : coupons.length === 0 ? (
          <div className="p-12 text-center">
            <svg className="w-12 h-12 mx-auto text-gray-200 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" /></svg>
            <p className="text-sm text-gray-400">No coupons yet</p>
            <p className="text-xs text-gray-300 mt-1">Create your first coupon to get started</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500 border-b border-gray-100 bg-gray-50/50">
                  <th className="px-6 py-3 font-medium">Code</th>
                  <th className="px-6 py-3 font-medium">Name</th>
                  <th className="px-6 py-3 font-medium">Type</th>
                  <th className="px-6 py-3 font-medium text-right">Value</th>
                  <th className="px-6 py-3 font-medium text-center">Used</th>
                  <th className="px-6 py-3 font-medium text-center">Status</th>
                  <th className="px-6 py-3 font-medium text-center">Modes</th>
                  <th className="px-6 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {coupons.map((c) => (
                  <tr key={c.id} className={`hover:bg-gray-50/50 ${!c.isActive ? 'opacity-50' : ''}`}>
                    <td className="px-6 py-4 font-mono font-semibold text-orange-600">{c.code}</td>
                    <td className="px-6 py-4 text-gray-900">{c.name}</td>
                    <td className="px-6 py-4 text-gray-600 capitalize">{c.discountType}</td>
                    <td className="px-6 py-4 text-right font-medium">
                      {c.discountType === 'percentage' ? `${c.discountValue}%` : c.discountType === 'freeDelivery' ? 'Free' : `₹${c.discountValue}`}
                    </td>
                    <td className="px-6 py-4 text-center text-gray-600">
                      {c.usageCount}{c.maxUsageTotal ? `/${c.maxUsageTotal}` : ''}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button onClick={() => toggleActive(c)} title={c.isActive ? 'Deactivate' : 'Activate'}
                        className="transition-opacity hover:opacity-70">
                        {c.isActive
                          ? <ToggleOnIcon size={32} color="#16a34a" />
                          : <ToggleOffIcon size={32} />}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-center text-xs text-gray-500 capitalize">{c.applicableModes}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex gap-1 justify-end">
                        <button onClick={() => openEdit(c)} title="Edit coupon"
                          className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors">
                          <PencilIcon size={15} />
                        </button>
                        <button onClick={() => deleteCoupon(c.id)} title="Delete coupon"
                          className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                          <TrashIcon size={15} />
                        </button>
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
