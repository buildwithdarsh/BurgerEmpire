'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckIcon } from '@/components/icons';
import { TZ } from '@/lib/tz';
import type { AdminLocationDetail } from '@buildwithdarsh/sdk';

const adminApi = TZ.client.scoped('/api/v1', 'staff', false);

// Sub-types used locally for menu and hours tabs
interface LocationMenuItem {
  id: string;
  name: string;
  category: string;
  basePrice: number;
  isAvailable: boolean;
  priceOverride: number | null;
}

interface DayHours {
  day: string;
  openTime: string;
  closeTime: string;
  isClosed: boolean;
}

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const TABS = ['Overview', 'Menu', 'Hours'] as const;
type Tab = (typeof TABS)[number];

export default function AdminLocationDetail() {
  const params = useParams();
  const searchParams = useSearchParams();
  const id = params.id as string;

  const initialTab = (searchParams.get('tab') as Tab) || 'Overview';
  const [tab, setTab] = useState<Tab>(TABS.includes(initialTab) ? initialTab : 'Overview');

  const [location, setLocation] = useState<AdminLocationDetail | null>(null);
  const [loading, setLoading] = useState(true);

  // Menu state
  const [menuItems, setMenuItems] = useState<LocationMenuItem[]>([]);
  const [menuLoading, setMenuLoading] = useState(true);
  const [menuSaving, setMenuSaving] = useState(false);

  // Hours state
  const [hours, setHours] = useState<DayHours[]>(DAYS.map((d) => ({ day: d, openTime: '09:00', closeTime: '22:00', isClosed: false })));
  const [hoursLoading, setHoursLoading] = useState(true);
  const [hoursSaving, setHoursSaving] = useState(false);

  const loadLocation = useCallback(async () => {
    setLoading(true);
    try {
      const result = await TZ.admin.locations.get(id);
      setLocation(result);
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  }, [id]);

  const loadMenu = useCallback(async () => {
    setMenuLoading(true);
    try {
      const result = await adminApi.get<{ items: LocationMenuItem[] }>(`/admin/locations/${id}/menu`);
      setMenuItems((result as { items: LocationMenuItem[] }).items);
    } catch {
      // silently fail
    } finally {
      setMenuLoading(false);
    }
  }, [id]);

  const loadHours = useCallback(async () => {
    setHoursLoading(true);
    try {
      const result = await adminApi.get<{ hours: DayHours[] }>(`/admin/locations/${id}/hours`);
      if ((result as { hours: DayHours[] }).hours) {
        setHours(DAYS.map((day) => {
          const found = (result as { hours: DayHours[] }).hours.find((h: DayHours) => h.day === day);
          return found || { day, openTime: '09:00', closeTime: '22:00', isClosed: false };
        }));
      }
    } catch {
      // silently fail
    } finally {
      setHoursLoading(false);
    }
  }, [id]);

  useEffect(() => { loadLocation(); loadMenu(); loadHours(); }, [loadLocation, loadMenu, loadHours]);

  const toggleMenuItem = (itemId: string) => {
    setMenuItems((prev) => prev.map((item) =>
      item.id === itemId ? { ...item, isAvailable: !item.isAvailable } : item
    ));
  };

  const updatePriceOverride = (itemId: string, value: string) => {
    setMenuItems((prev) => prev.map((item) =>
      item.id === itemId ? { ...item, priceOverride: value ? Number(value) : null } : item
    ));
  };

  const saveMenu = async () => {
    setMenuSaving(true);
    try {
      await adminApi.put(`/admin/locations/${id}/menu`, {
        items: menuItems.map((item) => ({
          id: item.id, isAvailable: item.isAvailable, priceOverride: item.priceOverride,
        })),
      });
    } catch {
      // silently fail
    } finally { setMenuSaving(false); }
  };

  const updateHour = (day: string, field: keyof DayHours, value: string | boolean) => {
    setHours((prev) => prev.map((h) => h.day === day ? { ...h, [field]: value } : h));
  };

  const saveHours = async () => {
    setHoursSaving(true);
    try {
      await TZ.admin.locations.setHours(id, { hours } as any);
    } catch {
      // silently fail
    } finally { setHoursSaving(false); }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-6 w-48 bg-gray-100 rounded animate-pulse" />
        <div className="h-4 w-64 bg-gray-50 rounded animate-pulse" />
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
          <div className="space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-4 bg-gray-50 rounded animate-pulse" style={{ width: `${60 + i * 10}%` }} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!location) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-400">Location not found</p>
        <Link href="/admin/locations" className="text-orange-600 hover:underline text-sm mt-2 inline-block">Back to Locations</Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/admin/locations" className="text-sm text-gray-400 hover:text-gray-600 transition-colors">Locations</Link>
        <span className="text-gray-300">/</span>
        <h1 className="text-2xl font-semibold text-gray-900">{location.name}</h1>
        {location.isPrimary && <span className="px-2 py-0.5 rounded-lg text-xs font-medium bg-orange-50 text-orange-600">Primary</span>}
        <span className={`px-2 py-0.5 rounded-lg text-xs font-medium ${location.isActive ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
          {location.isActive ? 'Active' : 'Inactive'}
        </span>
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

      {/* ─── Overview Tab ─── */}
      {tab === 'Overview' && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="text-xs font-medium text-gray-500 mb-1">Address</p>
              <p className="text-sm text-gray-900">{location.address}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 mb-1">City</p>
              <p className="text-sm text-gray-900">{location.city}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 mb-1">Pincode</p>
              <p className="text-sm text-gray-900">{location.pincode}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 mb-1">Slug</p>
              <p className="text-sm text-gray-900 font-mono">{location.slug}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 mb-1">Phone</p>
              <p className="text-sm text-gray-900">{location.phone || '-'}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 mb-1">Email</p>
              <p className="text-sm text-gray-900">{location.email || '-'}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 mb-1">Coordinates</p>
              <p className="text-sm text-gray-900">{location.lat && location.lng ? `${location.lat}, ${location.lng}` : 'Not set'}</p>
            </div>
          </div>
        </div>
      )}

      {/* ─── Menu Tab ─── */}
      {tab === 'Menu' && (
        <>
          <div className="flex justify-end">
            <button onClick={saveMenu} disabled={menuSaving}
              className="flex items-center gap-2 px-4 py-2.5 bg-gray-900 text-white rounded-xl text-sm font-medium hover:bg-gray-800 disabled:opacity-50 transition-colors">
              <CheckIcon size={15} /> {menuSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            {menuLoading ? (
              <div className="divide-y divide-gray-50">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="px-6 py-4 flex gap-4">
                    <div className="w-6 h-4 bg-gray-100 rounded animate-pulse" />
                    <div className="w-40 h-4 bg-gray-50 rounded animate-pulse" />
                    <div className="flex-1 h-4 bg-gray-50 rounded animate-pulse" />
                    <div className="w-20 h-4 bg-gray-50 rounded animate-pulse" />
                  </div>
                ))}
              </div>
            ) : menuItems.length === 0 ? (
              <div className="p-12 text-center">
                <p className="text-sm text-gray-400">No menu items found</p>
                <p className="text-xs text-gray-300 mt-1">Menu items from the main catalog will appear here</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-gray-500 border-b border-gray-100 bg-gray-50/50">
                      <th className="px-6 py-3 font-medium w-12">Available</th>
                      <th className="px-6 py-3 font-medium">Item</th>
                      <th className="px-6 py-3 font-medium">Category</th>
                      <th className="px-6 py-3 font-medium text-right">Base Price</th>
                      <th className="px-6 py-3 font-medium text-right">Price Override</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {menuItems.map((item) => (
                      <tr key={item.id} className={`hover:bg-gray-50/50 ${!item.isAvailable ? 'opacity-50' : ''}`}>
                        <td className="px-6 py-3">
                          <input type="checkbox" checked={item.isAvailable} onChange={() => toggleMenuItem(item.id)}
                            className="w-4 h-4 rounded border-gray-300 text-orange-600 focus:ring-orange-200" />
                        </td>
                        <td className="px-6 py-3 font-medium text-gray-900">{item.name}</td>
                        <td className="px-6 py-3 text-gray-600 capitalize">{item.category}</td>
                        <td className="px-6 py-3 text-right text-gray-600">{item.basePrice}</td>
                        <td className="px-6 py-3 text-right">
                          <input type="number" value={item.priceOverride ?? ''} placeholder="-"
                            onChange={(e) => updatePriceOverride(item.id, e.target.value)}
                            className="w-24 px-2 py-1 border border-gray-200 rounded-lg text-sm text-right focus:outline-none focus:ring-2 focus:ring-orange-200" />
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

      {/* ─── Hours Tab ─── */}
      {tab === 'Hours' && (
        <>
          <div className="flex justify-end">
            <button onClick={saveHours} disabled={hoursSaving}
              className="flex items-center gap-2 px-4 py-2.5 bg-gray-900 text-white rounded-xl text-sm font-medium hover:bg-gray-800 disabled:opacity-50 transition-colors">
              <CheckIcon size={15} /> {hoursSaving ? 'Saving...' : 'Save Hours'}
            </button>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            {hoursLoading ? (
              <div className="divide-y divide-gray-50">
                {Array.from({ length: 7 }).map((_, i) => (
                  <div key={i} className="px-6 py-4 flex gap-4">
                    <div className="w-24 h-4 bg-gray-100 rounded animate-pulse" />
                    <div className="w-20 h-4 bg-gray-50 rounded animate-pulse" />
                    <div className="w-20 h-4 bg-gray-50 rounded animate-pulse" />
                    <div className="w-16 h-4 bg-gray-50 rounded animate-pulse" />
                  </div>
                ))}
              </div>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-500 border-b border-gray-100 bg-gray-50/50">
                    <th className="px-6 py-3 font-medium">Day</th>
                    <th className="px-6 py-3 font-medium">Open</th>
                    <th className="px-6 py-3 font-medium">Close</th>
                    <th className="px-6 py-3 font-medium text-center">Closed</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {hours.map((h) => (
                    <tr key={h.day} className={`hover:bg-gray-50/50 ${h.isClosed ? 'opacity-50' : ''}`}>
                      <td className="px-6 py-3 font-medium text-gray-900">{h.day}</td>
                      <td className="px-6 py-3">
                        <input type="time" value={h.openTime} disabled={h.isClosed}
                          onChange={(e) => updateHour(h.day, 'openTime', e.target.value)}
                          className="px-2 py-1 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-200 disabled:opacity-40" />
                      </td>
                      <td className="px-6 py-3">
                        <input type="time" value={h.closeTime} disabled={h.isClosed}
                          onChange={(e) => updateHour(h.day, 'closeTime', e.target.value)}
                          className="px-2 py-1 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-200 disabled:opacity-40" />
                      </td>
                      <td className="px-6 py-3 text-center">
                        <input type="checkbox" checked={h.isClosed}
                          onChange={(e) => updateHour(h.day, 'isClosed', e.target.checked)}
                          className="w-4 h-4 rounded border-gray-300 text-orange-600 focus:ring-orange-200" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </>
      )}
    </div>
  );
}
