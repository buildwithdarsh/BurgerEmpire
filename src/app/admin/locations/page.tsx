'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { PlusIcon, PencilIcon, TrashIcon, XIcon, CheckIcon, ToggleOnIcon, ToggleOffIcon } from '@/components/icons';
import { TZ } from '@/lib/tz';
import type { AdminLocation } from '@buildwithdarsh/sdk';

const EMPTY_FORM = {
  name: '', slug: '', address: '', city: '', pincode: '',
  lat: '', lng: '', phone: '', email: '', isActive: true, isPrimary: false,
};

export default function AdminLocations() {
  const [locations, setLocations] = useState<AdminLocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const result = await TZ.admin.locations.list();
      setLocations(result);
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const openNew = () => { setEditingId(null); setForm(EMPTY_FORM); setShowForm(true); };
  const openEdit = (loc: AdminLocation) => {
    setEditingId(loc.id);
    setForm({
      name: loc.name, slug: loc.slug, address: loc.address, city: loc.city,
      pincode: loc.pincode, lat: loc.lat?.toString() || '', lng: loc.lng?.toString() || '',
      phone: loc.phone || '', email: loc.email || '', isActive: loc.isActive, isPrimary: loc.isPrimary,
    });
    setShowForm(true);
  };

  const save = async () => {
    setSaving(true);
    try {
      const payload = {
        name: form.name, slug: form.slug, address: form.address, city: form.city, pincode: form.pincode,
        lat: form.lat ? Number(form.lat) : null, lng: form.lng ? Number(form.lng) : null,
        phone: form.phone || null, email: form.email || null, isActive: form.isActive, isPrimary: form.isPrimary,
      };
      if (editingId) {
        await TZ.admin.locations.update(editingId, payload);
      } else {
        await TZ.admin.locations.create(payload);
      }
      setShowForm(false);
      load();
    } catch {
      // silently fail
    } finally { setSaving(false); }
  };

  const toggleActive = async (loc: AdminLocation) => {
    try {
      await TZ.admin.locations.update(loc.id, { isActive: !loc.isActive });
      load();
    } catch {
      // silently fail
    }
  };

  const deleteLocation = async (id: string) => {
    if (!confirm('Delete this location? This cannot be undone.')) return;
    try {
      await TZ.admin.locations.remove(id);
      load();
    } catch {
      // silently fail
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Locations</h1>
          <p className="text-sm text-gray-400 mt-0.5">Manage store locations and branches</p>
        </div>
        <button onClick={openNew} className="flex items-center gap-2 px-4 py-2.5 bg-gray-900 text-white rounded-xl text-sm font-medium hover:bg-gray-800 transition-colors">
          <PlusIcon size={15} /> New Location
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4" onClick={() => setShowForm(false)}>
          <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">{editingId ? 'Edit Location' : 'New Location'}</h2>
              <button onClick={() => setShowForm(false)} className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"><XIcon size={18} /></button>
            </div>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-gray-500">Name</label>
                  <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-200" />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500">Slug</label>
                  <input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })}
                    className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-200" />
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500">Address</label>
                <input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })}
                  className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-200" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-gray-500">City</label>
                  <input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })}
                    className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-200" />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500">Pincode</label>
                  <input value={form.pincode} onChange={(e) => setForm({ ...form, pincode: e.target.value })}
                    className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-200" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-gray-500">Latitude</label>
                  <input type="number" step="any" value={form.lat} onChange={(e) => setForm({ ...form, lat: e.target.value })}
                    className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-200" />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500">Longitude</label>
                  <input type="number" step="any" value={form.lng} onChange={(e) => setForm({ ...form, lng: e.target.value })}
                    className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-200" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-gray-500">Phone</label>
                  <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-200" />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500">Email</label>
                  <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-200" />
                </div>
              </div>
              <div className="flex gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                    className="w-4 h-4 rounded border-gray-300 text-orange-600" />
                  <span className="text-sm text-gray-700">Active</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.isPrimary} onChange={(e) => setForm({ ...form, isPrimary: e.target.checked })}
                    className="w-4 h-4 rounded border-gray-300 text-orange-600" />
                  <span className="text-sm text-gray-700">Primary</span>
                </label>
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

      {/* Locations Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="divide-y divide-gray-50">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="px-6 py-4 flex gap-4">
                <div className="w-32 h-4 bg-gray-100 rounded animate-pulse" />
                <div className="flex-1 h-4 bg-gray-50 rounded animate-pulse" />
                <div className="w-20 h-4 bg-gray-50 rounded animate-pulse" />
                <div className="w-16 h-4 bg-gray-50 rounded animate-pulse" />
              </div>
            ))}
          </div>
        ) : locations.length === 0 ? (
          <div className="p-12 text-center">
            <svg className="w-12 h-12 mx-auto text-gray-200 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" /></svg>
            <p className="text-sm text-gray-400">No locations yet</p>
            <p className="text-xs text-gray-300 mt-1">Add your first location to get started</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500 border-b border-gray-100 bg-gray-50/50">
                  <th className="px-6 py-3 font-medium">Name</th>
                  <th className="px-6 py-3 font-medium">Address</th>
                  <th className="px-6 py-3 font-medium">City</th>
                  <th className="px-6 py-3 font-medium text-center">Status</th>
                  <th className="px-6 py-3 font-medium text-center">Primary</th>
                  <th className="px-6 py-3 font-medium text-center">Config</th>
                  <th className="px-6 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {locations.map((loc) => (
                  <tr key={loc.id} className={`hover:bg-gray-50/50 ${!loc.isActive ? 'opacity-50' : ''}`}>
                    <td className="px-6 py-4">
                      <Link href={`/admin/locations/${loc.id}`} className="font-medium text-orange-600 hover:underline">{loc.name}</Link>
                      <p className="text-xs text-gray-400 mt-0.5">{loc.slug}</p>
                    </td>
                    <td className="px-6 py-4 text-gray-600 max-w-xs truncate">{loc.address}</td>
                    <td className="px-6 py-4 text-gray-600">{loc.city}</td>
                    <td className="px-6 py-4 text-center">
                      <button onClick={() => toggleActive(loc)} className="transition-opacity hover:opacity-70">
                        {loc.isActive ? <ToggleOnIcon size={32} color="#16a34a" /> : <ToggleOffIcon size={32} />}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-center">
                      {loc.isPrimary && <span className="px-2 py-0.5 rounded-lg text-xs font-medium bg-orange-50 text-orange-600">Primary</span>}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex gap-1 justify-center">
                        <Link href={`/admin/locations/${loc.id}?tab=menu`} className="px-2 py-1 text-xs text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">Menu</Link>
                        <Link href={`/admin/locations/${loc.id}?tab=hours`} className="px-2 py-1 text-xs text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">Hours</Link>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex gap-1 justify-end">
                        <button onClick={() => openEdit(loc)} className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"><PencilIcon size={15} /></button>
                        <button onClick={() => deleteLocation(loc.id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"><TrashIcon size={15} /></button>
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
