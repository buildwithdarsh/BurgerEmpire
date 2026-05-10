'use client';

import { useEffect, useState, useCallback } from 'react';
import { PlusIcon, PencilIcon, TrashIcon, XIcon, CheckIcon, ToggleOnIcon, ToggleOffIcon } from '@/components/icons';
import { TZ } from '@/lib/tz';
import type { AdminReservationTable } from '@buildwithdarsh/sdk';

const EMPTY_FORM = { tableNumber: '', capacity: 2, locationId: '', isActive: true };

export default function AdminReservationTables() {
  const [tables, setTables] = useState<AdminReservationTable[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  const load = useCallback(() => {
    setLoading(true);
    TZ.admin.reservations.resources()
      .then((result) => setTables(result))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  const openNew = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setShowForm(true);
  };

  const openEdit = (table: AdminReservationTable) => {
    setEditingId(table.id);
    setForm({
      tableNumber: table.tableNumber,
      capacity: table.capacity,
      locationId: table.locationId,
      isActive: table.isActive,
    });
    setShowForm(true);
  };

  const save = async () => {
    setSaving(true);
    try {
      const payload = {
        tableNumber: form.tableNumber,
        capacity: Number(form.capacity),
        locationId: form.locationId,
        isActive: form.isActive,
      };

      if (editingId) {
        await TZ.admin.reservations.updateResource(editingId, payload);
      } else {
        await TZ.admin.reservations.createResource(payload);
      }
      setShowForm(false);
      load();
    } catch {
      // failed silently
    } finally {
      setSaving(false);
    }
  };

  const toggleActive = async (table: AdminReservationTable) => {
    try {
      await TZ.admin.reservations.updateResource(table.id, { isActive: !table.isActive });
      load();
    } catch {
      // failed silently
    }
  };

  const deleteTable = async (id: string) => {
    if (!confirm('Delete this table? This cannot be undone.')) return;
    try {
      await TZ.admin.reservations.removeResource(id);
      load();
    } catch {
      // failed silently
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Restaurant Tables</h1>
          <p className="text-sm text-gray-400 mt-0.5">Manage table configurations for reservations</p>
        </div>
        <button onClick={openNew} className="flex items-center gap-2 px-4 py-2.5 bg-gray-900 text-white rounded-xl text-sm font-medium hover:bg-gray-800 transition-colors">
          <PlusIcon size={15} />
          Add Table
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4" onClick={() => setShowForm(false)}>
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">{editingId ? 'Edit Table' : 'New Table'}</h2>
              <button onClick={() => setShowForm(false)} className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                <XIcon size={18} />
              </button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-gray-500">Table Number</label>
                <input value={form.tableNumber} onChange={(e) => setForm({ ...form, tableNumber: e.target.value })}
                  placeholder="e.g. T1, A-01"
                  className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-200" />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500">Capacity</label>
                <input type="number" value={form.capacity} onChange={(e) => setForm({ ...form, capacity: Number(e.target.value) })}
                  min={1}
                  className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-200" />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500">Location ID</label>
                <input value={form.locationId} onChange={(e) => setForm({ ...form, locationId: e.target.value })}
                  placeholder="Location identifier"
                  className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-200" />
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                  className="w-4 h-4 rounded border-gray-300 text-orange-600" />
                <span className="text-sm text-gray-700">Active</span>
              </label>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={save} disabled={saving || !form.tableNumber}
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

      {/* Tables Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="divide-y divide-gray-50">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="px-6 py-4 flex gap-4">
                <div className="w-16 h-4 bg-gray-100 rounded animate-pulse" />
                <div className="w-12 h-4 bg-gray-50 rounded animate-pulse" />
                <div className="flex-1 h-4 bg-gray-50 rounded animate-pulse" />
                <div className="w-16 h-4 bg-gray-50 rounded animate-pulse" />
              </div>
            ))}
          </div>
        ) : tables.length === 0 ? (
          <div className="p-12 text-center">
            <svg className="w-12 h-12 mx-auto text-gray-200 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 6h16M4 10h16M4 14h16M4 18h16" /></svg>
            <p className="text-sm text-gray-400">No tables configured</p>
            <p className="text-xs text-gray-300 mt-1">Add tables to enable reservations</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500 border-b border-gray-100 bg-gray-50/50">
                  <th className="px-6 py-3 font-medium">Table Number</th>
                  <th className="px-6 py-3 font-medium text-center">Capacity</th>
                  <th className="px-6 py-3 font-medium">Location</th>
                  <th className="px-6 py-3 font-medium text-center">Status</th>
                  <th className="px-6 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {tables.map((table) => (
                  <tr key={table.id} className={`hover:bg-gray-50/50 ${!table.isActive ? 'opacity-50' : ''}`}>
                    <td className="px-6 py-4">
                      <span className="text-gray-900 font-semibold">{table.tableNumber}</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="inline-flex items-center gap-1 text-gray-700">
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" /></svg>
                        {table.capacity}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-500 text-xs font-mono">{table.locationName || table.locationId}</td>
                    <td className="px-6 py-4 text-center">
                      <button onClick={() => toggleActive(table)} title={table.isActive ? 'Deactivate' : 'Activate'}
                        className="transition-opacity hover:opacity-70">
                        {table.isActive
                          ? <ToggleOnIcon size={32} color="#16a34a" />
                          : <ToggleOffIcon size={32} />}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex gap-1 justify-end">
                        <button onClick={() => openEdit(table)} title="Edit table"
                          className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors">
                          <PencilIcon size={15} />
                        </button>
                        <button onClick={() => deleteTable(table.id)} title="Delete table"
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
