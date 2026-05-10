'use client';

import { useEffect, useState, useCallback } from 'react';
import { PlusIcon, PencilIcon, TrashIcon, XIcon, CheckIcon, ToggleOnIcon, ToggleOffIcon } from '@/components/icons';
import { TZ } from '@/lib/tz';
import type { AdminReservationSlot } from '@buildwithdarsh/sdk';

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const EMPTY_FORM = { dayOfWeek: 0, startTime: '11:00', endTime: '14:00', maxCovers: 20, isActive: true };

export default function AdminReservationSlots() {
  const [slots, setSlots] = useState<AdminReservationSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  const load = useCallback(() => {
    setLoading(true);
    TZ.admin.reservationSlots.list()
      .then((d) => setSlots(d))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  const openNew = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setShowForm(true);
  };

  const openEdit = (slot: AdminReservationSlot) => {
    setEditingId(slot.id);
    setForm({
      dayOfWeek: slot.dayOfWeek,
      startTime: slot.startTime,
      endTime: slot.endTime,
      maxCovers: slot.maxCovers,
      isActive: slot.isActive,
    });
    setShowForm(true);
  };

  const save = async () => {
    setSaving(true);
    try {
      const payload = {
        dayOfWeek: Number(form.dayOfWeek),
        startTime: form.startTime,
        endTime: form.endTime,
        maxCovers: Number(form.maxCovers),
        isActive: form.isActive,
      };

      if (editingId) {
        await TZ.admin.reservationSlots.update(editingId, payload);
      } else {
        await TZ.admin.reservationSlots.create(payload);
      }
      setShowForm(false);
      load();
    } catch {
      // failed silently
    } finally {
      setSaving(false);
    }
  };

  const toggleActive = async (slot: AdminReservationSlot) => {
    try {
      await TZ.admin.reservationSlots.update(slot.id, { isActive: !slot.isActive });
      load();
    } catch {
      // failed silently
    }
  };

  const deleteSlot = async (id: string) => {
    if (!confirm('Delete this time slot? This cannot be undone.')) return;
    try {
      await TZ.admin.reservationSlots.remove(id);
      load();
    } catch {
      // failed silently
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Reservation Time Slots</h1>
          <p className="text-sm text-gray-400 mt-0.5">Configure available time slots for reservations</p>
        </div>
        <button onClick={openNew} className="flex items-center gap-2 px-4 py-2.5 bg-gray-900 text-white rounded-xl text-sm font-medium hover:bg-gray-800 transition-colors">
          <PlusIcon size={15} />
          Add Slot
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4" onClick={() => setShowForm(false)}>
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">{editingId ? 'Edit Slot' : 'New Slot'}</h2>
              <button onClick={() => setShowForm(false)} className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                <XIcon size={18} />
              </button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-gray-500">Day of Week</label>
                <select value={form.dayOfWeek} onChange={(e) => setForm({ ...form, dayOfWeek: Number(e.target.value) })}
                  className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-200">
                  {DAY_NAMES.map((name, i) => (
                    <option key={i} value={i}>{name}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-gray-500">Start Time</label>
                  <input type="time" value={form.startTime} onChange={(e) => setForm({ ...form, startTime: e.target.value })}
                    className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-200" />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500">End Time</label>
                  <input type="time" value={form.endTime} onChange={(e) => setForm({ ...form, endTime: e.target.value })}
                    className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-200" />
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500">Max Covers</label>
                <input type="number" value={form.maxCovers} onChange={(e) => setForm({ ...form, maxCovers: Number(e.target.value) })}
                  min={1}
                  className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-200" />
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

      {/* Slots Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="divide-y divide-gray-50">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="px-6 py-4 flex gap-4">
                <div className="w-20 h-4 bg-gray-100 rounded animate-pulse" />
                <div className="w-16 h-4 bg-gray-50 rounded animate-pulse" />
                <div className="w-16 h-4 bg-gray-50 rounded animate-pulse" />
                <div className="w-12 h-4 bg-gray-50 rounded animate-pulse" />
                <div className="flex-1 h-4 bg-gray-50 rounded animate-pulse" />
              </div>
            ))}
          </div>
        ) : slots.length === 0 ? (
          <div className="p-12 text-center">
            <svg className="w-12 h-12 mx-auto text-gray-200 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <p className="text-sm text-gray-400">No time slots configured</p>
            <p className="text-xs text-gray-300 mt-1">Add time slots to enable reservations</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500 border-b border-gray-100 bg-gray-50/50">
                  <th className="px-6 py-3 font-medium">Day</th>
                  <th className="px-6 py-3 font-medium">Start Time</th>
                  <th className="px-6 py-3 font-medium">End Time</th>
                  <th className="px-6 py-3 font-medium text-center">Max Covers</th>
                  <th className="px-6 py-3 font-medium text-center">Status</th>
                  <th className="px-6 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {slots.map((slot) => (
                  <tr key={slot.id} className={`hover:bg-gray-50/50 ${!slot.isActive ? 'opacity-50' : ''}`}>
                    <td className="px-6 py-4">
                      <span className="text-gray-900 font-medium">{DAY_NAMES[slot.dayOfWeek] || `Day ${slot.dayOfWeek}`}</span>
                    </td>
                    <td className="px-6 py-4 text-gray-700 font-mono text-xs">{slot.startTime}</td>
                    <td className="px-6 py-4 text-gray-700 font-mono text-xs">{slot.endTime}</td>
                    <td className="px-6 py-4 text-center text-gray-700 font-medium">{slot.maxCovers}</td>
                    <td className="px-6 py-4 text-center">
                      <button onClick={() => toggleActive(slot)} title={slot.isActive ? 'Deactivate' : 'Activate'}
                        className="transition-opacity hover:opacity-70">
                        {slot.isActive
                          ? <ToggleOnIcon size={32} color="#16a34a" />
                          : <ToggleOffIcon size={32} />}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex gap-1 justify-end">
                        <button onClick={() => openEdit(slot)} title="Edit slot"
                          className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors">
                          <PencilIcon size={15} />
                        </button>
                        <button onClick={() => deleteSlot(slot.id)} title="Delete slot"
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
