'use client';

import { useEffect, useState, useCallback } from 'react';
import { PlusIcon, PencilIcon, TrashIcon, XIcon, CheckIcon, ToggleOnIcon, ToggleOffIcon, MapIcon } from '@/components/icons';
import { TZ } from '@/lib/tz';
import type { AdminDeliveryAgent, AdminDeliveryZone } from '@buildwithdarsh/sdk';

const STATUS_COLORS: Record<string, string> = {
  available: 'bg-green-50 text-green-700',
  busy: 'bg-orange-50 text-orange-700',
  offline: 'bg-gray-100 text-gray-600',
};

const TABS = ['Agents', 'Zones', 'Live'] as const;
type Tab = (typeof TABS)[number];

const EMPTY_AGENT_FORM = { name: '', phone: '', status: 'available', isActive: true };
const EMPTY_ZONE_FORM = { name: '', pincodes: '', deliveryFee: 0, isActive: true };

export default function AdminDelivery() {
  const [tab, setTab] = useState<Tab>('Agents');

  // Agents state
  const [agents, setAgents] = useState<AdminDeliveryAgent[]>([]);
  const [agentsLoading, setAgentsLoading] = useState(true);
  const [showAgentForm, setShowAgentForm] = useState(false);
  const [editingAgentId, setEditingAgentId] = useState<string | null>(null);
  const [agentForm, setAgentForm] = useState(EMPTY_AGENT_FORM);
  const [agentSaving, setAgentSaving] = useState(false);

  // Zones state
  const [zones, setZones] = useState<AdminDeliveryZone[]>([]);
  const [zonesLoading, setZonesLoading] = useState(true);
  const [showZoneForm, setShowZoneForm] = useState(false);
  const [editingZoneId, setEditingZoneId] = useState<string | null>(null);
  const [zoneForm, setZoneForm] = useState(EMPTY_ZONE_FORM);
  const [zoneSaving, setZoneSaving] = useState(false);

  const loadAgents = useCallback(async () => {
    setAgentsLoading(true);
    try {
      const d = await TZ.admin.deliveryAgents.list();
      setAgents(d);
    } catch {
      // silently handle
    } finally {
      setAgentsLoading(false);
    }
  }, []);

  const loadZones = useCallback(async () => {
    setZonesLoading(true);
    try {
      const d = await TZ.admin.deliveryZones.list();
      setZones(d);
    } catch {
      // silently handle
    } finally {
      setZonesLoading(false);
    }
  }, []);

  useEffect(() => { loadAgents(); loadZones(); }, [loadAgents, loadZones]);

  // Agent CRUD
  const openNewAgent = () => { setEditingAgentId(null); setAgentForm(EMPTY_AGENT_FORM); setShowAgentForm(true); };
  const openEditAgent = (a: AdminDeliveryAgent) => {
    setEditingAgentId(a.id);
    setAgentForm({ name: a.name, phone: a.phone, status: a.status, isActive: a.isActive });
    setShowAgentForm(true);
  };
  const saveAgent = async () => {
    setAgentSaving(true);
    try {
      const payload = { ...agentForm };
      if (editingAgentId) {
        await TZ.admin.deliveryAgents.update(editingAgentId, payload);
      } else {
        await TZ.admin.deliveryAgents.create(payload);
      }
      setShowAgentForm(false);
      loadAgents();
    } catch {
      // silently handle
    } finally { setAgentSaving(false); }
  };
  const toggleAgent = async (a: AdminDeliveryAgent) => {
    try {
      await TZ.admin.deliveryAgents.update(a.id, { isActive: !a.isActive });
      loadAgents();
    } catch {
      // silently handle
    }
  };
  const deleteAgent = async (id: string) => {
    if (!confirm('Delete this delivery agent?')) return;
    try {
      await TZ.admin.deliveryAgents.remove(id);
      loadAgents();
    } catch {
      // silently handle
    }
  };

  // Zone CRUD
  const openNewZone = () => { setEditingZoneId(null); setZoneForm(EMPTY_ZONE_FORM); setShowZoneForm(true); };
  const openEditZone = (z: AdminDeliveryZone) => {
    setEditingZoneId(z.id);
    setZoneForm({ name: z.name, pincodes: z.pincodes.join(', '), deliveryFee: z.deliveryFee, isActive: z.isActive });
    setShowZoneForm(true);
  };
  const saveZone = async () => {
    setZoneSaving(true);
    try {
      const payload = {
        name: zoneForm.name,
        pincodes: zoneForm.pincodes.split(',').map((p) => p.trim()).filter(Boolean),
        deliveryFee: Number(zoneForm.deliveryFee),
        isActive: zoneForm.isActive,
      };
      if (editingZoneId) {
        await TZ.admin.deliveryZones.update(editingZoneId, payload);
      } else {
        await TZ.admin.deliveryZones.create(payload);
      }
      setShowZoneForm(false);
      loadZones();
    } catch {
      // silently handle
    } finally { setZoneSaving(false); }
  };
  const toggleZone = async (z: AdminDeliveryZone) => {
    try {
      await TZ.admin.deliveryZones.update(z.id, { isActive: !z.isActive });
      loadZones();
    } catch {
      // silently handle
    }
  };
  const deleteZone = async (id: string) => {
    if (!confirm('Delete this delivery zone?')) return;
    try {
      await TZ.admin.deliveryZones.remove(id);
      loadZones();
    } catch {
      // silently handle
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Delivery</h1>
        <p className="text-sm text-gray-400 mt-0.5">Manage delivery agents, zones, and live dispatch</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        {TABS.map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${tab === t ? 'bg-gray-900 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
            {t}
          </button>
        ))}
      </div>

      {/* ─── Agents Tab ─── */}
      {tab === 'Agents' && (
        <>
          <div className="flex justify-end">
            <button onClick={openNewAgent} className="flex items-center gap-2 px-4 py-2.5 bg-gray-900 text-white rounded-xl text-sm font-medium hover:bg-gray-800 transition-colors">
              <PlusIcon size={15} /> New Agent
            </button>
          </div>

          {showAgentForm && (
            <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4" onClick={() => setShowAgentForm(false)}>
              <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">{editingAgentId ? 'Edit Agent' : 'New Agent'}</h2>
                  <button onClick={() => setShowAgentForm(false)} className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"><XIcon size={18} /></button>
                </div>
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-medium text-gray-500">Name</label>
                    <input value={agentForm.name} onChange={(e) => setAgentForm({ ...agentForm, name: e.target.value })}
                      className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-200" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500">Phone</label>
                    <input value={agentForm.phone} onChange={(e) => setAgentForm({ ...agentForm, phone: e.target.value })}
                      className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-200" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500">Status</label>
                    <select value={agentForm.status} onChange={(e) => setAgentForm({ ...agentForm, status: e.target.value })}
                      className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-200">
                      <option value="available">Available</option>
                      <option value="busy">Busy</option>
                      <option value="offline">Offline</option>
                    </select>
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={agentForm.isActive} onChange={(e) => setAgentForm({ ...agentForm, isActive: e.target.checked })}
                      className="w-4 h-4 rounded border-gray-300 text-orange-600" />
                    <span className="text-sm text-gray-700">Active</span>
                  </label>
                </div>
                <div className="flex gap-3 mt-6">
                  <button onClick={saveAgent} disabled={agentSaving}
                    className="flex items-center justify-center gap-2 flex-1 py-2.5 bg-gray-900 text-white rounded-xl text-sm font-medium hover:bg-gray-800 disabled:opacity-50 transition-colors">
                    <CheckIcon size={15} /> {agentSaving ? 'Saving...' : editingAgentId ? 'Update' : 'Create'}
                  </button>
                  <button onClick={() => setShowAgentForm(false)}
                    className="flex items-center gap-2 px-6 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
                    <XIcon size={15} /> Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            {agentsLoading ? (
              <div className="divide-y divide-gray-50">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="px-6 py-4 flex gap-4">
                    <div className="w-32 h-4 bg-gray-100 rounded animate-pulse" />
                    <div className="w-24 h-4 bg-gray-50 rounded animate-pulse" />
                    <div className="flex-1 h-4 bg-gray-50 rounded animate-pulse" />
                    <div className="w-16 h-4 bg-gray-50 rounded animate-pulse" />
                  </div>
                ))}
              </div>
            ) : agents.length === 0 ? (
              <div className="p-12 text-center">
                <svg className="w-12 h-12 mx-auto text-gray-200 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                <p className="text-sm text-gray-400">No delivery agents yet</p>
                <p className="text-xs text-gray-300 mt-1">Add your first delivery agent to get started</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-gray-500 border-b border-gray-100 bg-gray-50/50">
                      <th className="px-6 py-3 font-medium">Name</th>
                      <th className="px-6 py-3 font-medium">Phone</th>
                      <th className="px-6 py-3 font-medium">Status</th>
                      <th className="px-6 py-3 font-medium text-center">Active</th>
                      <th className="px-6 py-3 font-medium text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {agents.map((a) => (
                      <tr key={a.id} className={`hover:bg-gray-50/50 ${!a.isActive ? 'opacity-50' : ''}`}>
                        <td className="px-6 py-4 font-medium text-gray-900">{a.name}</td>
                        <td className="px-6 py-4 text-gray-600">{a.phone}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-1 rounded-lg text-xs font-medium capitalize ${STATUS_COLORS[a.status] || 'bg-gray-50 text-gray-600'}`}>
                            {a.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <button onClick={() => toggleAgent(a)} className="transition-opacity hover:opacity-70">
                            {a.isActive ? <ToggleOnIcon size={32} color="#16a34a" /> : <ToggleOffIcon size={32} />}
                          </button>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex gap-1 justify-end">
                            <button onClick={() => openEditAgent(a)} className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"><PencilIcon size={15} /></button>
                            <button onClick={() => deleteAgent(a.id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"><TrashIcon size={15} /></button>
                          </div>
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

      {/* ─── Zones Tab ─── */}
      {tab === 'Zones' && (
        <>
          <div className="flex justify-end">
            <button onClick={openNewZone} className="flex items-center gap-2 px-4 py-2.5 bg-gray-900 text-white rounded-xl text-sm font-medium hover:bg-gray-800 transition-colors">
              <PlusIcon size={15} /> New Zone
            </button>
          </div>

          {showZoneForm && (
            <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4" onClick={() => setShowZoneForm(false)}>
              <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">{editingZoneId ? 'Edit Zone' : 'New Zone'}</h2>
                  <button onClick={() => setShowZoneForm(false)} className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"><XIcon size={18} /></button>
                </div>
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-medium text-gray-500">Zone Name</label>
                    <input value={zoneForm.name} onChange={(e) => setZoneForm({ ...zoneForm, name: e.target.value })}
                      className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-200" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500">Pincodes (comma-separated)</label>
                    <input value={zoneForm.pincodes} onChange={(e) => setZoneForm({ ...zoneForm, pincodes: e.target.value })} placeholder="560001, 560002, 560003"
                      className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-200" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500">Delivery Fee</label>
                    <input type="number" value={zoneForm.deliveryFee} onChange={(e) => setZoneForm({ ...zoneForm, deliveryFee: Number(e.target.value) })}
                      className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-200" />
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={zoneForm.isActive} onChange={(e) => setZoneForm({ ...zoneForm, isActive: e.target.checked })}
                      className="w-4 h-4 rounded border-gray-300 text-orange-600" />
                    <span className="text-sm text-gray-700">Active</span>
                  </label>
                </div>
                <div className="flex gap-3 mt-6">
                  <button onClick={saveZone} disabled={zoneSaving}
                    className="flex items-center justify-center gap-2 flex-1 py-2.5 bg-gray-900 text-white rounded-xl text-sm font-medium hover:bg-gray-800 disabled:opacity-50 transition-colors">
                    <CheckIcon size={15} /> {zoneSaving ? 'Saving...' : editingZoneId ? 'Update' : 'Create'}
                  </button>
                  <button onClick={() => setShowZoneForm(false)}
                    className="flex items-center gap-2 px-6 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
                    <XIcon size={15} /> Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            {zonesLoading ? (
              <div className="divide-y divide-gray-50">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="px-6 py-4 flex gap-4">
                    <div className="w-32 h-4 bg-gray-100 rounded animate-pulse" />
                    <div className="w-16 h-4 bg-gray-50 rounded animate-pulse" />
                    <div className="flex-1 h-4 bg-gray-50 rounded animate-pulse" />
                    <div className="w-12 h-4 bg-gray-50 rounded animate-pulse" />
                  </div>
                ))}
              </div>
            ) : zones.length === 0 ? (
              <div className="p-12 text-center">
                <svg className="w-12 h-12 mx-auto text-gray-200 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><polygon points="1,6 1,22 8,18 16,22 23,18 23,2 16,6 8,2" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} /></svg>
                <p className="text-sm text-gray-400">No delivery zones yet</p>
                <p className="text-xs text-gray-300 mt-1">Define delivery zones with pincodes and fees</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-gray-500 border-b border-gray-100 bg-gray-50/50">
                      <th className="px-6 py-3 font-medium">Zone Name</th>
                      <th className="px-6 py-3 font-medium text-center">Pincodes</th>
                      <th className="px-6 py-3 font-medium text-right">Delivery Fee</th>
                      <th className="px-6 py-3 font-medium text-center">Active</th>
                      <th className="px-6 py-3 font-medium text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {zones.map((z) => (
                      <tr key={z.id} className={`hover:bg-gray-50/50 ${!z.isActive ? 'opacity-50' : ''}`}>
                        <td className="px-6 py-4 font-medium text-gray-900">{z.name}</td>
                        <td className="px-6 py-4 text-center text-gray-600">{z.pincodes.length}</td>
                        <td className="px-6 py-4 text-right font-medium text-gray-900">{z.deliveryFee}</td>
                        <td className="px-6 py-4 text-center">
                          <button onClick={() => toggleZone(z)} className="transition-opacity hover:opacity-70">
                            {z.isActive ? <ToggleOnIcon size={32} color="#16a34a" /> : <ToggleOffIcon size={32} />}
                          </button>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex gap-1 justify-end">
                            <button onClick={() => openEditZone(z)} className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"><PencilIcon size={15} /></button>
                            <button onClick={() => deleteZone(z.id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"><TrashIcon size={15} /></button>
                          </div>
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

      {/* ─── Live Tab ─── */}
      {tab === 'Live' && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-16 text-center">
          <MapIcon size={48} className="mx-auto text-gray-200 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-1">Live Dispatch Board</h3>
          <p className="text-sm text-gray-400">Coming soon</p>
          <p className="text-xs text-gray-300 mt-2">Real-time tracking of active deliveries, agent locations, and dispatch management</p>
        </div>
      )}
    </div>
  );
}
