'use client';

import { useEffect, useState, useCallback } from 'react';
import { PlusIcon, PencilIcon, TrashIcon, XIcon, CheckIcon, ToggleOnIcon, ToggleOffIcon } from '@/components/icons';
import { TZ } from '@/lib/tz';
import type { AdminInstitution } from '@buildwithdarsh/sdk';

const EMPTY_FORM = {
  name: '',
  shortCode: '',
  emailDomain: '',
  logoUrl: '',
  customValidityDays: '',
  requiresManualReview: true,
  isActive: true,
};

export default function AdminInstitutions() {
  const [institutions, setInstitutions] = useState<AdminInstitution[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const result = await TZ.admin.institutions.list();
      setInstitutions(result.data || []);
    } catch {
      // silently handle
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const openEdit = (inst: AdminInstitution) => {
    setEditingId(inst.id);
    setForm({
      name: inst.name,
      shortCode: inst.shortCode,
      emailDomain: inst.emailDomain || '',
      logoUrl: inst.logoUrl || '',
      customValidityDays: inst.customValidityDays?.toString() || '',
      requiresManualReview: inst.requiresManualReview,
      isActive: inst.isActive,
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
        name: form.name,
        shortCode: form.shortCode,
        emailDomain: form.emailDomain || null,
        logoUrl: form.logoUrl || null,
        customValidityDays: form.customValidityDays ? Number(form.customValidityDays) : null,
        requiresManualReview: form.requiresManualReview,
        isActive: form.isActive,
      };

      if (editingId) {
        await TZ.admin.institutions.update(editingId, payload);
      } else {
        await TZ.admin.institutions.create(payload);
      }
      setShowForm(false);
      load();
    } finally {
      setSaving(false);
    }
  };

  const toggleActive = async (inst: AdminInstitution) => {
    try {
      await TZ.admin.institutions.update(inst.id, { isActive: !inst.isActive });
      load();
    } catch {
      // silently handle
    }
  };

  const deleteInstitution = async (id: string) => {
    if (!confirm('Delete this institution? This cannot be undone.')) return;
    try {
      await TZ.admin.institutions.remove(id);
      load();
    } catch {
      // silently handle
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Institutions</h1>
          <p className="text-sm text-gray-400 mt-0.5">Manage universities and colleges for student pass verification</p>
        </div>
        <button onClick={openNew} className="flex items-center gap-2 px-4 py-2.5 bg-gray-900 text-white rounded-xl text-sm font-medium hover:bg-gray-800 transition-colors">
          <PlusIcon size={15} />
          New Institution
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4" onClick={() => setShowForm(false)}>
          <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">{editingId ? 'Edit Institution' : 'New Institution'}</h2>
              <button onClick={() => setShowForm(false)} className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                <XIcon size={18} />
              </button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-gray-500">Name</label>
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Abc University"
                  className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-200" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-gray-500">Short Code</label>
                  <input value={form.shortCode} onChange={(e) => setForm({ ...form, shortCode: e.target.value.toUpperCase() })}
                    placeholder="e.g. DU"
                    className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-orange-200" />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500">Email Domain</label>
                  <input value={form.emailDomain} onChange={(e) => setForm({ ...form, emailDomain: e.target.value })}
                    placeholder="e.g. du.ac.in"
                    className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-orange-200" />
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500">Logo URL (optional)</label>
                <input value={form.logoUrl} onChange={(e) => setForm({ ...form, logoUrl: e.target.value })}
                  placeholder="https://..."
                  className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-200" />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500">Custom Validity Days (optional)</label>
                <input type="number" value={form.customValidityDays} onChange={(e) => setForm({ ...form, customValidityDays: e.target.value })}
                  placeholder="Leave blank for default (365 days)"
                  className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-200" />
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.requiresManualReview} onChange={(e) => setForm({ ...form, requiresManualReview: e.target.checked })}
                  className="w-4 h-4 rounded border-gray-300 text-orange-600" />
                <span className="text-sm text-gray-700">Requires Manual Review</span>
              </label>
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

      {/* Institutions Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="divide-y divide-gray-50">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="px-6 py-4 flex gap-4">
                <div className="w-32 h-4 bg-gray-100 rounded animate-pulse" />
                <div className="w-16 h-4 bg-gray-50 rounded animate-pulse" />
                <div className="flex-1 h-4 bg-gray-50 rounded animate-pulse" />
                <div className="w-12 h-4 bg-gray-50 rounded animate-pulse" />
                <div className="w-16 h-4 bg-gray-50 rounded animate-pulse" />
              </div>
            ))}
          </div>
        ) : institutions.length === 0 ? (
          <div className="p-12 text-center">
            <svg className="w-12 h-12 mx-auto text-gray-200 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            <p className="text-sm text-gray-400">No institutions yet</p>
            <p className="text-xs text-gray-300 mt-1">Add your first institution to enable student pass verification</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500 border-b border-gray-100 bg-gray-50/50">
                  <th className="px-6 py-3 font-medium">Name</th>
                  <th className="px-6 py-3 font-medium">Short Code</th>
                  <th className="px-6 py-3 font-medium">Email Domain</th>
                  <th className="px-6 py-3 font-medium text-center">Passes</th>
                  <th className="px-6 py-3 font-medium text-center">Validity</th>
                  <th className="px-6 py-3 font-medium text-center">Review</th>
                  <th className="px-6 py-3 font-medium text-center">Active</th>
                  <th className="px-6 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {institutions.map((inst) => (
                  <tr key={inst.id} className={`hover:bg-gray-50/50 ${!inst.isActive ? 'opacity-50' : ''}`}>
                    <td className="px-6 py-4 font-medium text-gray-900">{inst.name}</td>
                    <td className="px-6 py-4 font-mono text-xs text-orange-600">{inst.shortCode}</td>
                    <td className="px-6 py-4 text-gray-600 font-mono text-xs">
                      {inst.emailDomain || <span className="text-gray-300">-</span>}
                    </td>
                    <td className="px-6 py-4 text-center text-gray-600">
                      {inst._count?.studentPasses ?? 0}
                    </td>
                    <td className="px-6 py-4 text-center text-gray-600 text-xs">
                      {inst.customValidityDays ? `${inst.customValidityDays}d` : 'Default'}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-2 py-0.5 rounded-lg text-xs font-medium ${
                        inst.requiresManualReview ? 'bg-yellow-50 text-yellow-700' : 'bg-green-50 text-green-700'
                      }`}>
                        {inst.requiresManualReview ? 'Manual' : 'Auto'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button onClick={() => toggleActive(inst)} title={inst.isActive ? 'Deactivate' : 'Activate'}
                        className="transition-opacity hover:opacity-70">
                        {inst.isActive
                          ? <ToggleOnIcon size={32} color="#16a34a" />
                          : <ToggleOffIcon size={32} />}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex gap-1 justify-end">
                        <button onClick={() => openEdit(inst)} title="Edit institution"
                          className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors">
                          <PencilIcon size={15} />
                        </button>
                        <button onClick={() => deleteInstitution(inst.id)} title="Delete institution"
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
