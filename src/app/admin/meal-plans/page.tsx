'use client';

import { useEffect, useState, useCallback } from 'react';
import { PlusIcon, PencilIcon, TrashIcon, XIcon, CheckIcon, ToggleOnIcon, ToggleOffIcon } from '@/components/icons';
import { TZ } from '@/lib/tz';
import type { MealPlan as SDKMealPlan } from '@buildwithdarsh/sdk';

// Extend SDK type — items can also be a string (for textarea form editing)
interface MealPlan extends Omit<SDKMealPlan, 'items'> {
  items: Record<string, unknown> | string | null;
}

const EMPTY_FORM = { name: '', description: '', price: 0, durationDays: 7, items: '', isActive: true };

export default function AdminMealPlans() {
  const [plans, setPlans] = useState<MealPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const result = await TZ.admin.mealPlans.list();
      setPlans(result.data as any);
    } catch { /* ignore */ }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const openNew = () => { setEditingId(null); setForm(EMPTY_FORM); setShowForm(true); };
  const openEdit = (p: MealPlan) => {
    setEditingId(p.id);
    setForm({
      name: p.name, description: p.description || '', price: p.price,
      durationDays: p.durationDays, items: p.items ? (typeof p.items === 'string' ? p.items : JSON.stringify(p.items, null, 2)) : '', isActive: p.isActive,
    });
    setShowForm(true);
  };

  const save = async () => {
    setSaving(true);
    try {
      let parsedItems = null;
      if (form.items) {
        try { parsedItems = JSON.parse(form.items); } catch { parsedItems = form.items; }
      }
      const payload = {
        name: form.name, description: form.description || undefined,
        price: Number(form.price), durationDays: Number(form.durationDays),
        items: parsedItems, isActive: form.isActive,
      };
      if (editingId) {
        await TZ.admin.mealPlans.update(editingId, payload);
      } else {
        await TZ.admin.mealPlans.create(payload);
      }
      setShowForm(false);
      load();
    } catch {
      alert('Error saving meal plan. Check items JSON format.');
    } finally { setSaving(false); }
  };

  const toggleActive = async (p: MealPlan) => {
    await TZ.admin.mealPlans.update(p.id, { isActive: !p.isActive });
    load();
  };

  const deletePlan = async (id: string) => {
    if (!confirm('Delete this meal plan?')) return;
    await TZ.admin.mealPlans.remove(id);
    load();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Meal Plans</h1>
          <p className="text-sm text-gray-400 mt-0.5">Create and manage subscription meal plans</p>
        </div>
        <button onClick={openNew} className="flex items-center gap-2 px-4 py-2.5 bg-gray-900 text-white rounded-xl text-sm font-medium hover:bg-gray-800 transition-colors">
          <PlusIcon size={15} /> New Meal Plan
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4" onClick={() => setShowForm(false)}>
          <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">{editingId ? 'Edit Meal Plan' : 'New Meal Plan'}</h2>
              <button onClick={() => setShowForm(false)} className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"><XIcon size={18} /></button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-gray-500">Name</label>
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-200" />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500">Description</label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2}
                  className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-200" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-gray-500">Price</label>
                  <input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                    className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-200" />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500">Duration (days)</label>
                  <input type="number" value={form.durationDays} onChange={(e) => setForm({ ...form, durationDays: Number(e.target.value) })}
                    className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-200" />
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500">Items (JSON)</label>
                <textarea value={form.items} onChange={(e) => setForm({ ...form, items: e.target.value })} rows={4}
                  placeholder='[{"menuItemId": "...", "day": 1, "meal": "lunch"}]'
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
                <CheckIcon size={15} /> {saving ? 'Saving...' : editingId ? 'Update' : 'Create'}
              </button>
              <button onClick={() => setShowForm(false)}
                className="flex items-center gap-2 px-6 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
                <XIcon size={15} /> Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Meal Plans Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="divide-y divide-gray-50">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="px-6 py-4 flex gap-4">
                <div className="w-32 h-4 bg-gray-100 rounded animate-pulse" />
                <div className="w-16 h-4 bg-gray-50 rounded animate-pulse" />
                <div className="w-16 h-4 bg-gray-50 rounded animate-pulse" />
                <div className="flex-1 h-4 bg-gray-50 rounded animate-pulse" />
                <div className="w-16 h-4 bg-gray-50 rounded animate-pulse" />
              </div>
            ))}
          </div>
        ) : plans.length === 0 ? (
          <div className="p-12 text-center">
            <svg className="w-12 h-12 mx-auto text-gray-200 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8.25v-1.5m0 1.5c-1.355 0-2.697.056-4.024.166C6.845 8.51 6 9.473 6 10.608v2.513m6-4.87c1.355 0 2.697.055 4.024.165C17.155 8.51 18 9.473 18 10.608v2.513M15 8.25v-1.5m-6 1.5v-1.5m12 9.75l-1.5.75a3.354 3.354 0 01-3 0 3.354 3.354 0 00-3 0 3.354 3.354 0 01-3 0 3.354 3.354 0 00-3 0 3.354 3.354 0 01-3 0L3 16.5m15-3.38a48.474 48.474 0 00-6-.37c-2.032 0-4.034.126-6 .37m12 0c.39.049.777.102 1.163.16 1.07.16 1.837 1.094 1.837 2.175v5.17c0 .62-.504 1.124-1.125 1.124H4.125A1.125 1.125 0 013 20.625v-5.17c0-1.08.768-2.014 1.837-2.174A47.78 47.78 0 016 13.12M16.5 8.25V6.75a4.5 4.5 0 10-9 0v1.5" /></svg>
            <p className="text-sm text-gray-400">No meal plans yet</p>
            <p className="text-xs text-gray-300 mt-1">Create your first meal plan to offer subscriptions</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500 border-b border-gray-100 bg-gray-50/50">
                  <th className="px-6 py-3 font-medium">Name</th>
                  <th className="px-6 py-3 font-medium text-right">Price</th>
                  <th className="px-6 py-3 font-medium text-center">Duration</th>
                  <th className="px-6 py-3 font-medium text-center">Subscriptions</th>
                  <th className="px-6 py-3 font-medium text-center">Status</th>
                  <th className="px-6 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {plans.map((p) => (
                  <tr key={p.id} className={`hover:bg-gray-50/50 ${!p.isActive ? 'opacity-50' : ''}`}>
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-900">{p.name}</p>
                      {p.description && <p className="text-xs text-gray-400 mt-0.5 truncate max-w-xs">{p.description}</p>}
                    </td>
                    <td className="px-6 py-4 text-right font-medium text-gray-900">{p.price}</td>
                    <td className="px-6 py-4 text-center text-gray-600">{p.durationDays}d</td>
                    <td className="px-6 py-4 text-center">
                      <span className="px-2 py-0.5 rounded-lg text-xs font-medium bg-blue-50 text-blue-700">{p.subscriptionsCount}</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button onClick={() => toggleActive(p)} className="transition-opacity hover:opacity-70">
                        {p.isActive ? <ToggleOnIcon size={32} color="#16a34a" /> : <ToggleOffIcon size={32} />}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex gap-1 justify-end">
                        <button onClick={() => openEdit(p)} className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"><PencilIcon size={15} /></button>
                        <button onClick={() => deletePlan(p.id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"><TrashIcon size={15} /></button>
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
