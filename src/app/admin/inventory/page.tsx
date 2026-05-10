'use client';

import { useEffect, useState, useCallback } from 'react';
import { PlusIcon, PencilIcon, TrashIcon, XIcon, CheckIcon } from '@/components/icons';
import { TZ } from '@/lib/tz';
import type { Ingredient as SDKIngredient, StockAlert, WasteLog } from '@buildwithdarsh/sdk';

// Extend SDK type — flatten supplier object to string for display
interface Ingredient extends Omit<SDKIngredient, 'supplier'> {
  supplier: string | null;
}

const TABS = ['Stock', 'Alerts', 'Waste'] as const;
type Tab = (typeof TABS)[number];

const EMPTY_FORM = { name: '', unit: 'kg', currentStock: 0, minStock: 0, costPerUnit: 0, supplier: '' };
const EMPTY_WASTE_FORM = { ingredientId: '', quantity: 0, reason: '' };

export default function AdminInventory() {
  const [tab, setTab] = useState<Tab>('Stock');

  // Stock state
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [editingStockId, setEditingStockId] = useState<string | null>(null);
  const [inlineStock, setInlineStock] = useState<number>(0);

  // Alerts state
  const [alerts, setAlerts] = useState<StockAlert[]>([]);
  const [alertsLoading, setAlertsLoading] = useState(true);

  // Waste state
  const [wasteLogs, setWasteLogs] = useState<WasteLog[]>([]);
  const [wasteLoading, setWasteLoading] = useState(true);
  const [showWasteForm, setShowWasteForm] = useState(false);
  const [wasteForm, setWasteForm] = useState(EMPTY_WASTE_FORM);
  const [wasteSaving, setWasteSaving] = useState(false);

  const loadIngredients = useCallback(async () => {
    setLoading(true);
    try {
      const result = await TZ.admin.inventory.list();
      setIngredients(result.data.map((i: any) => ({ ...i, supplier: i.supplier?.name || null })));
    } catch { /* ignore */ }
    finally { setLoading(false); }
  }, []);

  const loadAlerts = useCallback(async () => {
    setAlertsLoading(true);
    try {
      const data = await TZ.admin.inventory.alerts.list();
      setAlerts(data);
    } catch { /* ignore */ }
    finally { setAlertsLoading(false); }
  }, []);

  const loadWaste = useCallback(async () => {
    setWasteLoading(true);
    try {
      const data = await TZ.admin.inventory.waste.list();
      setWasteLogs(data);
    } catch { /* ignore */ }
    finally { setWasteLoading(false); }
  }, []);

  useEffect(() => { loadIngredients(); loadAlerts(); loadWaste(); }, [loadIngredients, loadAlerts, loadWaste]);

  // Stock CRUD
  const openNew = () => { setEditingId(null); setForm(EMPTY_FORM); setShowForm(true); };
  const openEdit = (ing: Ingredient) => {
    setEditingId(ing.id);
    setForm({ name: ing.name, unit: ing.unit, currentStock: ing.currentStock, minStock: ing.minStock, costPerUnit: ing.costPerUnit, supplier: ing.supplier || '' });
    setShowForm(true);
  };

  const save = async () => {
    setSaving(true);
    try {
      const payload = { name: form.name, unit: form.unit, currentStock: Number(form.currentStock), minStock: Number(form.minStock), costPerUnit: Number(form.costPerUnit) };
      if (editingId) {
        await TZ.admin.inventory.update(editingId, payload);
      } else {
        await TZ.admin.inventory.create(payload);
      }
      setShowForm(false);
      loadIngredients();
    } finally { setSaving(false); }
  };

  const deleteIngredient = async (id: string) => {
    if (!confirm('Delete this ingredient?')) return;
    await TZ.admin.inventory.remove(id);
    loadIngredients();
  };

  const startInlineEdit = (ing: Ingredient) => { setEditingStockId(ing.id); setInlineStock(ing.currentStock); };
  const saveInlineStock = async (id: string) => {
    await TZ.admin.inventory.update(id, { currentStock: Number(inlineStock) });
    setEditingStockId(null);
    loadIngredients();
  };

  // Alerts
  const resolveAlert = async (alertId: string) => {
    await TZ.admin.inventory.alerts.resolve(alertId);
    loadAlerts();
  };

  // Waste
  const saveWaste = async () => {
    setWasteSaving(true);
    try {
      await TZ.admin.inventory.waste.create({ ingredientId: wasteForm.ingredientId, quantity: Number(wasteForm.quantity), reason: wasteForm.reason });
      setShowWasteForm(false);
      setWasteForm(EMPTY_WASTE_FORM);
      loadWaste();
    } finally { setWasteSaving(false); }
  };

  const unresolvedCount = alerts.filter((a) => !a.isResolved).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Inventory</h1>
        <p className="text-sm text-gray-400 mt-0.5">Track stock levels, alerts, and waste</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        {TABS.map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors relative ${tab === t ? 'bg-gray-900 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
            {t}
            {t === 'Alerts' && unresolvedCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white text-[0.625rem] font-bold rounded-full flex items-center justify-center">{unresolvedCount}</span>
            )}
          </button>
        ))}
      </div>

      {/* ─── Stock Tab ─── */}
      {tab === 'Stock' && (
        <>
          <div className="flex justify-end">
            <button onClick={openNew} className="flex items-center gap-2 px-4 py-2.5 bg-gray-900 text-white rounded-xl text-sm font-medium hover:bg-gray-800 transition-colors">
              <PlusIcon size={15} /> Add Ingredient
            </button>
          </div>

          {showForm && (
            <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4" onClick={() => setShowForm(false)}>
              <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">{editingId ? 'Edit Ingredient' : 'New Ingredient'}</h2>
                  <button onClick={() => setShowForm(false)} className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"><XIcon size={18} /></button>
                </div>
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-medium text-gray-500">Name</label>
                    <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-200" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-medium text-gray-500">Unit</label>
                      <select value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })}
                        className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-200">
                        <option value="kg">kg</option>
                        <option value="g">g</option>
                        <option value="l">litre</option>
                        <option value="ml">ml</option>
                        <option value="pcs">pieces</option>
                        <option value="dozen">dozen</option>
                        <option value="pack">pack</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-500">Cost Per Unit</label>
                      <input type="number" value={form.costPerUnit} onChange={(e) => setForm({ ...form, costPerUnit: Number(e.target.value) })}
                        className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-200" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-medium text-gray-500">Current Stock</label>
                      <input type="number" value={form.currentStock} onChange={(e) => setForm({ ...form, currentStock: Number(e.target.value) })}
                        className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-200" />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-500">Min Stock</label>
                      <input type="number" value={form.minStock} onChange={(e) => setForm({ ...form, minStock: Number(e.target.value) })}
                        className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-200" />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500">Supplier</label>
                    <input value={form.supplier} onChange={(e) => setForm({ ...form, supplier: e.target.value })}
                      className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-200" />
                  </div>
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

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            {loading ? (
              <div className="divide-y divide-gray-50">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="px-6 py-4 flex gap-4">
                    <div className="w-32 h-4 bg-gray-100 rounded animate-pulse" />
                    <div className="w-12 h-4 bg-gray-50 rounded animate-pulse" />
                    <div className="w-16 h-4 bg-gray-50 rounded animate-pulse" />
                    <div className="flex-1 h-4 bg-gray-50 rounded animate-pulse" />
                    <div className="w-20 h-4 bg-gray-50 rounded animate-pulse" />
                  </div>
                ))}
              </div>
            ) : ingredients.length === 0 ? (
              <div className="p-12 text-center">
                <svg className="w-12 h-12 mx-auto text-gray-200 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" /></svg>
                <p className="text-sm text-gray-400">No ingredients yet</p>
                <p className="text-xs text-gray-300 mt-1">Add ingredients to track your inventory</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-gray-500 border-b border-gray-100 bg-gray-50/50">
                      <th className="px-6 py-3 font-medium">Name</th>
                      <th className="px-6 py-3 font-medium">Unit</th>
                      <th className="px-6 py-3 font-medium text-right">Stock</th>
                      <th className="px-6 py-3 font-medium text-right">Min Stock</th>
                      <th className="px-6 py-3 font-medium text-right">Cost/Unit</th>
                      <th className="px-6 py-3 font-medium">Supplier</th>
                      <th className="px-6 py-3 font-medium text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {ingredients.map((ing) => {
                      const isLow = ing.currentStock < ing.minStock;
                      return (
                        <tr key={ing.id} className={`hover:bg-gray-50/50 ${isLow ? 'bg-red-50/50' : ''}`}>
                          <td className="px-6 py-4">
                            <span className="font-medium text-gray-900">{ing.name}</span>
                            {isLow && <span className="ml-2 px-1.5 py-0.5 text-[0.625rem] font-bold rounded bg-red-100 text-red-700">LOW</span>}
                          </td>
                          <td className="px-6 py-4 text-gray-600">{ing.unit}</td>
                          <td className="px-6 py-4 text-right">
                            {editingStockId === ing.id ? (
                              <div className="flex items-center gap-1 justify-end">
                                <input type="number" value={inlineStock} onChange={(e) => setInlineStock(Number(e.target.value))}
                                  className="w-20 px-2 py-1 border border-gray-200 rounded-lg text-sm text-right focus:outline-none focus:ring-2 focus:ring-orange-200"
                                  autoFocus onKeyDown={(e) => { if (e.key === 'Enter') saveInlineStock(ing.id); if (e.key === 'Escape') setEditingStockId(null); }} />
                                <button onClick={() => saveInlineStock(ing.id)} className="p-1 text-green-600 hover:bg-green-50 rounded"><CheckIcon size={14} /></button>
                                <button onClick={() => setEditingStockId(null)} className="p-1 text-gray-400 hover:bg-gray-100 rounded"><XIcon size={14} /></button>
                              </div>
                            ) : (
                              <button onClick={() => startInlineEdit(ing)}
                                className={`font-medium hover:underline ${isLow ? 'text-red-600' : 'text-gray-900'}`}>
                                {ing.currentStock}
                              </button>
                            )}
                          </td>
                          <td className="px-6 py-4 text-right text-gray-600">{ing.minStock}</td>
                          <td className="px-6 py-4 text-right text-gray-600">{ing.costPerUnit}</td>
                          <td className="px-6 py-4 text-gray-600">{ing.supplier || '-'}</td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex gap-1 justify-end">
                              <button onClick={() => openEdit(ing)} className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"><PencilIcon size={15} /></button>
                              <button onClick={() => deleteIngredient(ing.id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"><TrashIcon size={15} /></button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}

      {/* ─── Alerts Tab ─── */}
      {tab === 'Alerts' && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {alertsLoading ? (
            <div className="divide-y divide-gray-50">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="px-6 py-4 flex gap-4">
                  <div className="w-32 h-4 bg-gray-100 rounded animate-pulse" />
                  <div className="flex-1 h-4 bg-gray-50 rounded animate-pulse" />
                  <div className="w-20 h-4 bg-gray-50 rounded animate-pulse" />
                </div>
              ))}
            </div>
          ) : alerts.filter((a) => !a.isResolved).length === 0 ? (
            <div className="p-12 text-center">
              <svg className="w-12 h-12 mx-auto text-gray-200 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <p className="text-sm text-gray-400">No unresolved alerts</p>
              <p className="text-xs text-gray-300 mt-1">All stock levels are within range</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {alerts.filter((a) => !a.isResolved).map((alert) => (
                <div key={alert.id} className="px-6 py-4 flex items-center gap-4">
                  <div className="w-2 h-2 rounded-full bg-orange-500 shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{alert.ingredientName}</p>
                    <p className="text-xs text-gray-500">{alert.message}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{new Date(alert.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</p>
                  </div>
                  <button onClick={() => resolveAlert(alert.id)}
                    className="px-3 py-1.5 text-xs font-medium text-green-700 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
                    Resolve
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ─── Waste Tab ─── */}
      {tab === 'Waste' && (
        <>
          <div className="flex justify-end">
            <button onClick={() => { setWasteForm(EMPTY_WASTE_FORM); setShowWasteForm(true); }}
              className="flex items-center gap-2 px-4 py-2.5 bg-gray-900 text-white rounded-xl text-sm font-medium hover:bg-gray-800 transition-colors">
              <PlusIcon size={15} /> Log Waste
            </button>
          </div>

          {showWasteForm && (
            <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4" onClick={() => setShowWasteForm(false)}>
              <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">Log Waste</h2>
                  <button onClick={() => setShowWasteForm(false)} className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"><XIcon size={18} /></button>
                </div>
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-medium text-gray-500">Ingredient</label>
                    <select value={wasteForm.ingredientId} onChange={(e) => setWasteForm({ ...wasteForm, ingredientId: e.target.value })}
                      className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-200">
                      <option value="">Select ingredient</option>
                      {ingredients.map((ing) => <option key={ing.id} value={ing.id}>{ing.name} ({ing.unit})</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500">Quantity</label>
                    <input type="number" value={wasteForm.quantity} onChange={(e) => setWasteForm({ ...wasteForm, quantity: Number(e.target.value) })}
                      className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-200" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500">Reason</label>
                    <input value={wasteForm.reason} onChange={(e) => setWasteForm({ ...wasteForm, reason: e.target.value })}
                      placeholder="e.g. Expired, Spillage, Quality issue"
                      className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-200" />
                  </div>
                </div>
                <div className="flex gap-3 mt-6">
                  <button onClick={saveWaste} disabled={wasteSaving}
                    className="flex items-center justify-center gap-2 flex-1 py-2.5 bg-gray-900 text-white rounded-xl text-sm font-medium hover:bg-gray-800 disabled:opacity-50 transition-colors">
                    <CheckIcon size={15} /> {wasteSaving ? 'Saving...' : 'Log Waste'}
                  </button>
                  <button onClick={() => setShowWasteForm(false)}
                    className="flex items-center gap-2 px-6 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
                    <XIcon size={15} /> Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            {wasteLoading ? (
              <div className="divide-y divide-gray-50">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="px-6 py-4 flex gap-4">
                    <div className="w-32 h-4 bg-gray-100 rounded animate-pulse" />
                    <div className="w-16 h-4 bg-gray-50 rounded animate-pulse" />
                    <div className="flex-1 h-4 bg-gray-50 rounded animate-pulse" />
                    <div className="w-20 h-4 bg-gray-50 rounded animate-pulse" />
                  </div>
                ))}
              </div>
            ) : wasteLogs.length === 0 ? (
              <div className="p-12 text-center">
                <svg className="w-12 h-12 mx-auto text-gray-200 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                <p className="text-sm text-gray-400">No waste logs yet</p>
                <p className="text-xs text-gray-300 mt-1">Log waste to track food waste and cost impact</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-gray-500 border-b border-gray-100 bg-gray-50/50">
                      <th className="px-6 py-3 font-medium">Ingredient</th>
                      <th className="px-6 py-3 font-medium text-right">Quantity</th>
                      <th className="px-6 py-3 font-medium">Reason</th>
                      <th className="px-6 py-3 font-medium text-right">Cost Impact</th>
                      <th className="px-6 py-3 font-medium text-right">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {wasteLogs.map((w) => (
                      <tr key={w.id} className="hover:bg-gray-50/50">
                        <td className="px-6 py-4 font-medium text-gray-900">{w.ingredientName}</td>
                        <td className="px-6 py-4 text-right text-gray-600">{w.quantity}</td>
                        <td className="px-6 py-4 text-gray-600">{w.reason}</td>
                        <td className="px-6 py-4 text-right font-medium text-red-600">{w.costImpact}</td>
                        <td className="px-6 py-4 text-right text-gray-500 text-xs">
                          {new Date(w.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
