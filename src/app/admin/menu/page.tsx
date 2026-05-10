'use client';

import { useEffect, useState, useCallback, Fragment } from 'react';
import { PlusIcon, XIcon, TrashIcon, DownloadIcon, UploadIcon } from '@/components/icons';
import { TZ } from '@/lib/tz';
import type { AdminMenuItem, AdminSyncLog } from '@buildwithdarsh/sdk';

export default function AdminMenu() {
  const [items, setItems] = useState<AdminMenuItem[]>([]);
  const [syncLogs, setSyncLogs] = useState<AdminSyncLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [syncing, setSyncing] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [pushing, setPushing] = useState(false);
  const [syncMsg, setSyncMsg] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [creating, setCreating] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [newItem, setNewItem] = useState({
    classicName: '',
    healthyName: '',
    categoryId: '',
    diet: 'veg' as 'veg' | 'nonveg' | 'egg',
    classicPrice: 0,
    healthyPrice: 0,
    classicDescription: '',
    healthyDescription: '',
    classicCalories: 0,
    healthyCalories: 0,
  });

  const adminApi = TZ.client.scoped('/api/v1', 'staff', false);

  const loadMenu = useCallback(() => {
    setLoading(true);
    adminApi.get<{ items: AdminMenuItem[]; syncLogs: AdminSyncLog[] }>('/admin/menu')
      .then((d) => {
        setItems(d.items);
        setSyncLogs(d.syncLogs);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { loadMenu(); }, [loadMenu]);

  const toggleStock = async (itemId: string, inStock: boolean) => {
    try {
      const adminApi = TZ.client.scoped('/api/v1', 'staff', false);
      const data = await adminApi.patch<{posSync?: {success: boolean}}>('/admin/menu/' + itemId, { inStock });
      setItems((prev) => prev.map((i) => (i.id === itemId ? { ...i, inStock } : i)));
      if (data.posSync) {
        setSyncMsg(data.posSync.success ? `Stock synced to POS` : `Local updated, POS sync failed`);
        setTimeout(() => setSyncMsg(null), 3000);
      }
    } catch {
      // failed silently
    }
  };

  const triggerPull = async () => {
    setSyncing(true);
    try {
      await TZ.admin.pos.sync();
      loadMenu();
    } catch {
      // failed silently
    } finally {
      setSyncing(false);
    }
  };

  const triggerPush = async () => {
    setPushing(true);
    setSyncMsg(null);
    try {
      const data = await adminApi.put<{ updated: number }>('/admin/menu');
      setSyncMsg(`Pushed ${data.updated} items to POS`);
      setTimeout(() => setSyncMsg(null), 5000);
    } catch (err: any) {
      setSyncMsg(err?.message || 'Push to POS failed');
      setTimeout(() => setSyncMsg(null), 5000);
    } finally {
      setPushing(false);
    }
  };

  const categories = Array.from(
    new Map(items.map((i) => [i.category.id, i.category])).values()
  );

  const createItem = async () => {
    if (!newItem.classicName || !newItem.categoryId) return;
    setCreating(true);
    try {
      await TZ.admin.catalog.createItem(newItem);
      setShowCreateForm(false);
      setNewItem({
        classicName: '', healthyName: '', categoryId: '', diet: 'veg',
        classicPrice: 0, healthyPrice: 0, classicDescription: '', healthyDescription: '',
        classicCalories: 0, healthyCalories: 0,
      });
      loadMenu();
    } catch {
      // failed silently
    } finally {
      setCreating(false);
    }
  };

  const deleteItem = async (itemId: string) => {
    if (!confirm('Are you sure you want to delete this menu item? This action cannot be undone.')) return;
    setDeletingId(itemId);
    try {
      await TZ.admin.catalog.removeItem(itemId);
      setItems((prev) => prev.filter((i) => i.id !== itemId));
    } catch {
      // failed silently
    } finally {
      setDeletingId(null);
    }
  };

  const filtered = items.filter((i) =>
    i.classicName.toLowerCase().includes(search.toLowerCase()) ||
    i.healthyName.toLowerCase().includes(search.toLowerCase()) ||
    i.category.name.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-2xl font-semibold text-gray-900" role="heading" aria-level={1}>Menu Management</div>
          <p className="text-sm text-gray-400 mt-0.5">Manage items, pricing, and POS sync</p>
        </div>
      </div>
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="divide-y divide-gray-50">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="px-6 py-4 flex gap-4">
              <div className="flex-1 h-4 bg-gray-100 rounded animate-pulse" />
              <div className="w-20 h-4 bg-gray-50 rounded animate-pulse" />
              <div className="w-16 h-4 bg-gray-50 rounded animate-pulse" />
              <div className="w-12 h-4 bg-gray-50 rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Menu Management</h1>
          <p className="text-sm text-gray-400 mt-0.5">Manage items, pricing, and POS sync</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="flex items-center gap-2 px-4 py-2.5 bg-orange-600 text-white rounded-xl text-sm font-medium hover:bg-orange-500 transition-colors"
          >
            {showCreateForm ? <XIcon size={15} /> : <PlusIcon size={15} />}
            {showCreateForm ? 'Cancel' : 'Add Item'}
          </button>
          <button
            onClick={triggerPull}
            disabled={syncing}
            className="flex items-center gap-2 px-4 py-2.5 bg-gray-900 text-white rounded-xl text-sm font-medium hover:bg-gray-800 disabled:opacity-50 transition-colors"
          >
            <DownloadIcon size={15} />
            {syncing ? 'Pulling...' : 'Pull from POS'}
          </button>
          <button
            onClick={triggerPush}
            disabled={pushing}
            className="flex items-center gap-2 px-4 py-2.5 bg-emerald-700 text-white rounded-xl text-sm font-medium hover:bg-emerald-600 disabled:opacity-50 transition-colors"
          >
            <UploadIcon size={15} />
            {pushing ? 'Pushing...' : 'Push to POS'}
          </button>
        </div>
      </div>
      {syncMsg && (
        <div className="px-4 py-2.5 rounded-xl text-sm font-medium bg-blue-50 text-blue-700 border border-blue-100">
          {syncMsg}
        </div>
      )}

      <input
        type="text"
        placeholder="Search items..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full max-w-md px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-300"
      />

      {/* Create Form */}
      {showCreateForm && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">Add New Menu Item</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Classic Name *</label>
              <input
                type="text"
                value={newItem.classicName}
                onChange={(e) => setNewItem({ ...newItem, classicName: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-300"
                placeholder="e.g. Classic Burger"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Healthy Name</label>
              <input
                type="text"
                value={newItem.healthyName}
                onChange={(e) => setNewItem({ ...newItem, healthyName: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-300"
                placeholder="e.g. Healthy Burger"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Category *</label>
              <select
                value={newItem.categoryId}
                onChange={(e) => setNewItem({ ...newItem, categoryId: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-300 bg-white"
              >
                <option value="">Select category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Diet</label>
              <select
                value={newItem.diet}
                onChange={(e) => setNewItem({ ...newItem, diet: e.target.value as 'veg' | 'nonveg' | 'egg' })}
                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-300 bg-white"
              >
                <option value="veg">Veg</option>
                <option value="nonveg">Non-Veg</option>
                <option value="egg">Egg</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Classic Price (₹)</label>
              <input
                type="number"
                value={newItem.classicPrice || ''}
                onChange={(e) => setNewItem({ ...newItem, classicPrice: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-300"
                placeholder="0"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Healthy Price (₹)</label>
              <input
                type="number"
                value={newItem.healthyPrice || ''}
                onChange={(e) => setNewItem({ ...newItem, healthyPrice: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-300"
                placeholder="0"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Classic Description</label>
              <input
                type="text"
                value={newItem.classicDescription}
                onChange={(e) => setNewItem({ ...newItem, classicDescription: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-300"
                placeholder="Description for classic variant"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Healthy Description</label>
              <input
                type="text"
                value={newItem.healthyDescription}
                onChange={(e) => setNewItem({ ...newItem, healthyDescription: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-300"
                placeholder="Description for healthy variant"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Classic Calories</label>
              <input
                type="number"
                value={newItem.classicCalories || ''}
                onChange={(e) => setNewItem({ ...newItem, classicCalories: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-300"
                placeholder="0"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Healthy Calories</label>
              <input
                type="number"
                value={newItem.healthyCalories || ''}
                onChange={(e) => setNewItem({ ...newItem, healthyCalories: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-300"
                placeholder="0"
              />
            </div>
          </div>
          <div className="flex justify-end pt-2">
            <button
              onClick={createItem}
              disabled={creating || !newItem.classicName || !newItem.categoryId}
              className="px-5 py-2.5 bg-orange-600 text-white rounded-xl text-sm font-medium hover:bg-orange-500 disabled:opacity-50 transition-colors"
            >
              {creating ? 'Creating...' : 'Create Item'}
            </button>
          </div>
        </div>
      )}

      {/* Menu Items */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-500 border-b border-gray-100 bg-gray-50/50">
              <th className="px-6 py-3 font-medium">Item</th>
              <th className="px-6 py-3 font-medium">Category</th>
              <th className="px-6 py-3 font-medium">Diet</th>
              <th className="px-6 py-3 font-medium text-right">Classic ₹</th>
              <th className="px-6 py-3 font-medium text-right">Healthy ₹</th>
              <th className="px-6 py-3 font-medium text-center">Stock</th>
              <th className="px-6 py-3 font-medium text-center">Badges</th>
              <th className="px-6 py-3 font-medium text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filtered.map((item) => (
              <Fragment key={item.id}>
                <tr
                  className={`hover:bg-gray-50/50 cursor-pointer ${!item.inStock ? 'opacity-50' : ''}`}
                  onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}
                >
                  <td className="px-6 py-4">
                    <p className="text-gray-900 font-medium">{item.classicName}</p>
                    {item.healthyName !== item.classicName && (
                      <p className="text-xs text-green-600">{item.healthyName}</p>
                    )}
                  </td>
                  <td className="px-6 py-4 text-gray-600">{item.category.name}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                      item.diet === 'veg' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                    }`}>
                      {item.diet}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right font-medium">₹{item.classicPrice}</td>
                  <td className="px-6 py-4 text-right font-medium text-green-700">₹{item.healthyPrice}</td>
                  <td className="px-6 py-4 text-center">
                    <input
                      type="checkbox"
                      checked={item.inStock}
                      onChange={(e) => { e.stopPropagation(); toggleStock(item.id, e.target.checked); }}
                      className="w-4 h-4 rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                    />
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex gap-1 justify-center">
                      {item.isBestseller && <span className="px-1.5 py-0.5 bg-orange-50 text-orange-700 rounded text-[0.625rem] font-medium">Best</span>}
                      {item.isNew && <span className="px-1.5 py-0.5 bg-blue-50 text-blue-700 rounded text-[0.625rem] font-medium">New</span>}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={(e) => { e.stopPropagation(); deleteItem(item.id); }}
                      disabled={deletingId === item.id}
                      title="Delete item"
                      className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-40"
                    >
                      <TrashIcon size={15} />
                    </button>
                  </td>
                </tr>
                {expandedId === item.id && (
                  <tr key={`${item.id}-detail`}>
                    <td colSpan={8} className="px-6 py-4 bg-gray-50/50">
                      <div className="grid md:grid-cols-2 gap-4">
                        {item.variations.length > 0 && (
                          <div>
                            <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2">Variations</h4>
                            <div className="space-y-1">
                              {item.variations.map((v) => (
                                <div key={v.id} className="flex justify-between text-sm">
                                  <span className="text-gray-700">{v.name} ({v.groupName})</span>
                                  <span className="font-medium">₹{v.price} {!v.inStock && <span className="text-red-500 text-xs">(OOS)</span>}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        {item.addonGroups.length > 0 && (
                          <div>
                            <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2">Addon Groups</h4>
                            {item.addonGroups.map((g) => (
                              <div key={g.id} className="mb-2">
                                <p className="text-xs font-medium text-gray-600">{g.name} (min: {g.minSelection}, max: {g.maxSelection})</p>
                                <div className="ml-2 space-y-0.5">
                                  {g.addons.map((a) => (
                                    <div key={a.id} className="flex justify-between text-xs text-gray-500">
                                      <span>{a.name}</span>
                                      <span>{a.price > 0 ? `₹${a.price}` : 'Free'}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                        {item.variations.length === 0 && item.addonGroups.length === 0 && (
                          <p className="text-xs text-gray-400">No variations or addons</p>
                        )}
                      </div>
                    </td>
                  </tr>
                )}
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>

      {/* Sync Logs */}
      {syncLogs.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Sync Logs</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500 border-b border-gray-100">
                  <th className="pb-3 font-medium">Source</th>
                  <th className="pb-3 font-medium">Status</th>
                  <th className="pb-3 font-medium">Items</th>
                  <th className="pb-3 font-medium">Duration</th>
                  <th className="pb-3 font-medium">Error</th>
                  <th className="pb-3 font-medium text-right">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {syncLogs.map((log) => (
                  <tr key={log.id}>
                    <td className="py-2 text-gray-700">{log.source}</td>
                    <td className="py-2">
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${log.success ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                        {log.success ? 'Success' : 'Failed'}
                      </span>
                    </td>
                    <td className="py-2 text-gray-600">{log.itemCount}</td>
                    <td className="py-2 text-gray-600">{log.duration ? `${log.duration}ms` : '-'}</td>
                    <td className="py-2 text-red-500 text-xs">{log.errorMsg || '-'}</td>
                    <td className="py-2 text-right text-gray-500 text-xs">{new Date(log.createdAt).toLocaleString('en-IN')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
