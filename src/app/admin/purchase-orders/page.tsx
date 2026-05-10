'use client';

import { useEffect, useState, useCallback, Fragment } from 'react';
import { PlusIcon, TrashIcon, XIcon, CheckIcon } from '@/components/icons';
import { TZ } from '@/lib/tz';
import type { PurchaseOrder, Supplier, Ingredient } from '@buildwithdarsh/sdk';


const STATUS_COLORS: Record<string, string> = {
  draft: 'bg-gray-100 text-gray-600',
  sent: 'bg-blue-50 text-blue-700',
  received: 'bg-green-50 text-green-700',
  cancelled: 'bg-red-50 text-red-700',
};

const STATUSES = ['all', 'draft', 'sent', 'received', 'cancelled'];

interface NewItem {
  ingredientId: string;
  quantity: number;
  unitPrice: number;
}

export default function AdminPurchaseOrders() {
  const [orders, setOrders] = useState<PurchaseOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Create form
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [formSupplierId, setFormSupplierId] = useState('');
  const [formItems, setFormItems] = useState<NewItem[]>([{ ingredientId: '', quantity: 0, unitPrice: 0 }]);

  const loadOrders = useCallback(async () => {
    setLoading(true);
    try {
      const params: any = {};
      if (statusFilter !== 'all') params.status = statusFilter;
      const result = await TZ.admin.purchaseOrders.list(params);
      setOrders(result.data);
    } catch { /* ignore */ }
    finally { setLoading(false); }
  }, [statusFilter]);

  const loadLookups = useCallback(async () => {
    try {
      const [suppResult, invResult] = await Promise.all([
        TZ.admin.suppliers.list(),
        TZ.admin.inventory.list(),
      ]);
      setSuppliers(suppResult.data);
      setIngredients(invResult.data);
    } catch { /* ignore */ }
  }, []);

  useEffect(() => { loadOrders(); loadLookups(); }, [loadOrders, loadLookups]);

  const openCreate = () => {
    setFormSupplierId('');
    setFormItems([{ ingredientId: '', quantity: 0, unitPrice: 0 }]);
    setShowForm(true);
  };

  const addItem = () => setFormItems([...formItems, { ingredientId: '', quantity: 0, unitPrice: 0 }]);
  const removeItem = (idx: number) => setFormItems(formItems.filter((_, i) => i !== idx));
  const updateItem = (idx: number, field: keyof NewItem, value: string | number) => {
    setFormItems(formItems.map((item, i) => i === idx ? { ...item, [field]: value } : item));
  };

  const savePO = async () => {
    setSaving(true);
    try {
      const payload = {
        supplierId: formSupplierId,
        items: formItems.filter((i) => i.ingredientId).map((i) => ({
          ingredientId: i.ingredientId,
          quantity: Number(i.quantity),
          unitPrice: Number(i.unitPrice),
        })),
      };
      await TZ.admin.purchaseOrders.create(payload);
      setShowForm(false);
      loadOrders();
    } finally { setSaving(false); }
  };

  const updateStatus = async (id: string, status: string) => {
    await TZ.admin.purchaseOrders.update(id, { status });
    loadOrders();
  };

  const deletePO = async (id: string) => {
    if (!confirm('Delete this purchase order?')) return;
    await TZ.admin.purchaseOrders.remove(id);
    loadOrders();
  };

  const formTotal = formItems.reduce((sum, i) => sum + (Number(i.quantity) * Number(i.unitPrice)), 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Purchase Orders</h1>
          <p className="text-sm text-gray-400 mt-0.5">Create and track supplier purchase orders</p>
        </div>
        <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2.5 bg-gray-900 text-white rounded-xl text-sm font-medium hover:bg-gray-800 transition-colors">
          <PlusIcon size={15} /> New PO
        </button>
      </div>

      {/* Status Filter */}
      <div className="flex gap-2 overflow-x-auto">
        {STATUSES.map((s) => (
          <button key={s} onClick={() => setStatusFilter(s)}
            className={`px-3 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-colors capitalize ${statusFilter === s ? 'bg-gray-900 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
            {s === 'all' ? 'All' : s}
          </button>
        ))}
      </div>

      {/* Create PO Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4" onClick={() => setShowForm(false)}>
          <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">New Purchase Order</h2>
              <button onClick={() => setShowForm(false)} className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"><XIcon size={18} /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-medium text-gray-500">Supplier</label>
                <select value={formSupplierId} onChange={(e) => setFormSupplierId(e.target.value)}
                  className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-200">
                  <option value="">Select supplier</option>
                  {suppliers.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-medium text-gray-500">Items</label>
                  <button onClick={addItem} className="text-xs text-orange-600 hover:text-orange-700 font-medium">+ Add item</button>
                </div>
                <div className="space-y-2">
                  {formItems.map((item, idx) => (
                    <div key={idx} className="flex gap-2 items-end">
                      <div className="flex-1">
                        {idx === 0 && <label className="text-[0.625rem] text-gray-400">Ingredient</label>}
                        <select value={item.ingredientId} onChange={(e) => updateItem(idx, 'ingredientId', e.target.value)}
                          className="w-full px-2 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-200">
                          <option value="">Select...</option>
                          {ingredients.map((ing) => <option key={ing.id} value={ing.id}>{ing.name} ({ing.unit})</option>)}
                        </select>
                      </div>
                      <div className="w-24">
                        {idx === 0 && <label className="text-[0.625rem] text-gray-400">Qty</label>}
                        <input type="number" value={item.quantity} onChange={(e) => updateItem(idx, 'quantity', e.target.value)}
                          className="w-full px-2 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-200" />
                      </div>
                      <div className="w-28">
                        {idx === 0 && <label className="text-[0.625rem] text-gray-400">Unit Price</label>}
                        <input type="number" value={item.unitPrice} onChange={(e) => updateItem(idx, 'unitPrice', e.target.value)}
                          className="w-full px-2 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-200" />
                      </div>
                      <div className="w-20 text-right text-sm font-medium text-gray-700 py-2">
                        {(Number(item.quantity) * Number(item.unitPrice)).toFixed(0)}
                      </div>
                      {formItems.length > 1 && (
                        <button onClick={() => removeItem(idx)} className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                          <TrashIcon size={14} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                <div className="flex justify-end mt-3 pt-3 border-t border-gray-100">
                  <p className="text-sm font-semibold text-gray-900">Total: {formTotal.toFixed(0)}</p>
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={savePO} disabled={saving || !formSupplierId}
                className="flex items-center justify-center gap-2 flex-1 py-2.5 bg-gray-900 text-white rounded-xl text-sm font-medium hover:bg-gray-800 disabled:opacity-50 transition-colors">
                <CheckIcon size={15} /> {saving ? 'Creating...' : 'Create PO'}
              </button>
              <button onClick={() => setShowForm(false)}
                className="flex items-center gap-2 px-6 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
                <XIcon size={15} /> Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Orders Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="divide-y divide-gray-50">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="px-6 py-4 flex gap-4">
                <div className="w-20 h-4 bg-gray-100 rounded animate-pulse" />
                <div className="w-32 h-4 bg-gray-50 rounded animate-pulse" />
                <div className="flex-1 h-4 bg-gray-50 rounded animate-pulse" />
                <div className="w-16 h-4 bg-gray-50 rounded animate-pulse" />
                <div className="w-20 h-4 bg-gray-50 rounded animate-pulse" />
              </div>
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div className="p-12 text-center">
            <svg className="w-12 h-12 mx-auto text-gray-200 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15a2.25 2.25 0 012.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z" /></svg>
            <p className="text-sm text-gray-400">No purchase orders yet</p>
            <p className="text-xs text-gray-300 mt-1">Create your first purchase order</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500 border-b border-gray-100 bg-gray-50/50">
                  <th className="px-6 py-3 font-medium">PO #</th>
                  <th className="px-6 py-3 font-medium">Supplier</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                  <th className="px-6 py-3 font-medium text-center">Items</th>
                  <th className="px-6 py-3 font-medium text-right">Total</th>
                  <th className="px-6 py-3 font-medium text-right">Date</th>
                  <th className="px-6 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {orders.map((po) => (
                  <Fragment key={po.id}>
                    <tr className="hover:bg-gray-50/50 cursor-pointer" onClick={() => setExpandedId(expandedId === po.id ? null : po.id)}>
                      <td className="px-6 py-4 font-mono text-xs text-orange-600 font-semibold">{po.poNumber}</td>
                      <td className="px-6 py-4 font-medium text-gray-900">{po.supplierName}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-lg text-xs font-medium capitalize ${STATUS_COLORS[po.status] || 'bg-gray-50 text-gray-600'}`}>
                          {po.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center text-gray-600">{po.items?.length || 0}</td>
                      <td className="px-6 py-4 text-right font-medium text-gray-900">{po.totalAmount}</td>
                      <td className="px-6 py-4 text-right text-gray-500 text-xs">
                        {new Date(po.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                      </td>
                      <td className="px-6 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex gap-1 justify-end">
                          {po.status === 'draft' && (
                            <button onClick={() => updateStatus(po.id, 'sent')}
                              className="px-2 py-1 text-xs text-blue-600 hover:bg-blue-50 rounded-lg transition-colors font-medium">Send</button>
                          )}
                          {po.status === 'sent' && (
                            <button onClick={() => updateStatus(po.id, 'received')}
                              className="px-2 py-1 text-xs text-green-600 hover:bg-green-50 rounded-lg transition-colors font-medium">Received</button>
                          )}
                          {(po.status === 'draft' || po.status === 'sent') && (
                            <button onClick={() => updateStatus(po.id, 'cancelled')}
                              className="px-2 py-1 text-xs text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium">Cancel</button>
                          )}
                          <button onClick={() => deletePO(po.id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"><TrashIcon size={14} /></button>
                        </div>
                      </td>
                    </tr>
                    {expandedId === po.id && po.items && po.items.length > 0 && (
                      <tr>
                        <td colSpan={7} className="px-6 py-4 bg-gray-50/50">
                          <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2">Order Items</h4>
                          <table className="w-full text-xs">
                            <thead>
                              <tr className="text-gray-400">
                                <th className="text-left py-1 font-medium">Ingredient</th>
                                <th className="text-right py-1 font-medium">Qty</th>
                                <th className="text-right py-1 font-medium">Unit Price</th>
                                <th className="text-right py-1 font-medium">Total</th>
                              </tr>
                            </thead>
                            <tbody>
                              {po.items.map((item) => (
                                <tr key={item.id} className="text-gray-600">
                                  <td className="py-1">{item.ingredientName}</td>
                                  <td className="py-1 text-right">{item.quantity}</td>
                                  <td className="py-1 text-right">{item.unitPrice}</td>
                                  <td className="py-1 text-right font-medium">{item.total}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
