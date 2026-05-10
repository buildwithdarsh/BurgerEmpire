'use client';

import { useEffect, useState, useCallback } from 'react';
import { PlusIcon, PencilIcon, TrashIcon, XIcon, CheckIcon, ToggleOnIcon, ToggleOffIcon } from '@/components/icons';
import { TZ } from '@/lib/tz';
import type { AdminPromotion } from '@buildwithdarsh/sdk';

const TYPE_COLORS: Record<string, string> = {
  banner: 'bg-blue-50 text-blue-700',
  firstOrder: 'bg-green-50 text-green-700',
  freeDelivery: 'bg-purple-50 text-purple-700',
  happyHour: 'bg-orange-50 text-orange-700',
  referral: 'bg-pink-50 text-pink-700',
};

const EMPTY_FORM = {
  title: '', subtitle: '', description: '', type: 'banner', imageUrl: '',
  couponCode: '', isActive: true, priority: 0, startDate: '', endDate: '', config: '',
};

export default function AdminPromotions() {
  const [promotions, setPromotions] = useState<AdminPromotion[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const result = await TZ.admin.promotions.list();
      setPromotions(result.data);
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const openEdit = (promo: AdminPromotion) => {
    setEditingId(promo.id);
    setForm({
      title: promo.title,
      subtitle: promo.subtitle || '',
      description: promo.description || '',
      type: promo.type,
      imageUrl: promo.imageUrl || '',
      couponCode: promo.couponCode || '',
      isActive: promo.isActive,
      priority: promo.priority,
      startDate: promo.startDate ? promo.startDate.split('T')[0] : '',
      endDate: promo.endDate ? promo.endDate.split('T')[0] : '',
      config: promo.config || '',
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
        title: form.title,
        subtitle: form.subtitle || null,
        description: form.description || null,
        type: form.type,
        imageUrl: form.imageUrl || null,
        couponCode: form.couponCode || null,
        isActive: form.isActive,
        priority: Number(form.priority),
        startDate: form.startDate || null,
        endDate: form.endDate || null,
        config: form.config ? JSON.parse(form.config) : null,
      };

      if (editingId) {
        await TZ.admin.promotions.update(editingId, payload);
      } else {
        await TZ.admin.promotions.create(payload);
      }
      setShowForm(false);
      load();
    } catch {
      alert('Error saving promotion. Check JSON config format.');
    } finally {
      setSaving(false);
    }
  };

  const toggleActive = async (promo: AdminPromotion) => {
    await TZ.admin.promotions.update(promo.id, { isActive: !promo.isActive });
    load();
  };

  const deletePromo = async (id: string) => {
    if (!confirm('Delete this promotion?')) return;
    await TZ.admin.promotions.remove(id);
    load();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Promotions</h1>
          <p className="text-sm text-gray-400 mt-0.5">Manage banners, offers, and campaigns</p>
        </div>
        <button onClick={openNew} className="flex items-center gap-2 px-4 py-2.5 bg-gray-900 text-white rounded-xl text-sm font-medium hover:bg-gray-800 transition-colors">
          <PlusIcon size={15} />
          New Promotion
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4" onClick={() => setShowForm(false)}>
          <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">{editingId ? 'Edit Promotion' : 'New Promotion'}</h2>
              <button onClick={() => setShowForm(false)} className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                <XIcon size={18} />
              </button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-gray-500">Title</label>
                <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-200" />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500">Subtitle</label>
                <input value={form.subtitle} onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
                  className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-200" />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500">Description</label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2}
                  className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-200" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-gray-500">Type</label>
                  <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}
                    className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-200">
                    <option value="banner">Banner</option>
                    <option value="firstOrder">First Order</option>
                    <option value="freeDelivery">Free Delivery</option>
                    <option value="happyHour">Happy Hour</option>
                    <option value="referral">Referral</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500">Priority</label>
                  <input type="number" value={form.priority} onChange={(e) => setForm({ ...form, priority: Number(e.target.value) })}
                    className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-200" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-gray-500">Coupon Code (optional)</label>
                  <input value={form.couponCode} onChange={(e) => setForm({ ...form, couponCode: e.target.value })}
                    className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-200" />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500">Image URL (optional)</label>
                  <input value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
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
              <div>
                <label className="text-xs font-medium text-gray-500">Config JSON (optional)</label>
                <textarea value={form.config} onChange={(e) => setForm({ ...form, config: e.target.value })} rows={2} placeholder='{"key": "value"}'
                  className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-orange-200" />
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

      {/* Promotions Grid */}
      {loading ? (
        <div className="grid md:grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-3">
              <div className="flex justify-between">
                <div className="h-5 w-40 bg-gray-100 rounded animate-pulse" />
                <div className="h-5 w-16 bg-gray-50 rounded animate-pulse" />
              </div>
              <div className="h-4 w-full bg-gray-50 rounded animate-pulse" />
              <div className="h-4 w-2/3 bg-gray-50 rounded animate-pulse" />
            </div>
          ))}
        </div>
      ) : promotions.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
          <svg className="w-12 h-12 mx-auto text-gray-200 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" /></svg>
          <p className="text-sm text-gray-400">No promotions yet</p>
          <p className="text-xs text-gray-300 mt-1">Create your first promotion to get started</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {promotions.map((promo) => (
            <div key={promo.id} className={`bg-white rounded-2xl border border-gray-100 shadow-sm p-5 ${!promo.isActive ? 'opacity-50' : ''}`}>
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-gray-900">{promo.title}</h3>
                  {promo.subtitle && <p className="text-sm text-gray-500">{promo.subtitle}</p>}
                </div>
                <span className={`px-2.5 py-1 rounded-lg text-xs font-medium ${TYPE_COLORS[promo.type] || 'bg-gray-50 text-gray-600'}`}>
                  {promo.type}
                </span>
              </div>
              {promo.description && <p className="text-sm text-gray-600 mb-3">{promo.description}</p>}
              <div className="flex items-center gap-2 text-xs text-gray-400 mb-4">
                {promo.couponCode && <span className="text-orange-600 font-mono">{promo.couponCode}</span>}
                <span>Priority: {promo.priority}</span>
                {promo.startDate && <span>From {new Date(promo.startDate).toLocaleDateString('en-IN')}</span>}
                {promo.endDate && <span>Until {new Date(promo.endDate).toLocaleDateString('en-IN')}</span>}
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => toggleActive(promo)} title={promo.isActive ? 'Deactivate' : 'Activate'}
                  className="transition-opacity hover:opacity-70">
                  {promo.isActive
                    ? <ToggleOnIcon size={32} color="#16a34a" />
                    : <ToggleOffIcon size={32} />}
                </button>
                <button onClick={() => openEdit(promo)} title="Edit promotion"
                  className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors">
                  <PencilIcon size={16} />
                </button>
                <button onClick={() => deletePromo(promo.id)} title="Delete promotion"
                  className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                  <TrashIcon size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
