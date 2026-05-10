'use client';

import { useEffect, useState, useCallback } from 'react';
import { ToggleOnIcon, ToggleOffIcon } from '@/components/icons';
import { TZ } from '@/lib/tz';
import type { AdminSetting } from '@buildwithdarsh/sdk';

const GROUP_LABELS: Record<string, string> = {
  loyalty: 'Loyalty Program',
  delivery: 'Delivery',
  checkout: 'Checkout',
  features: 'Features & Toggles',
  catalog: 'Catalog',
  branding: 'Branding',
  contact: 'Contact',
  tax: 'Tax',
  orders: 'Orders',
  notifications: 'Notifications',
  pos: 'POS Integration',
  otp: 'OTP / Auth (Dev)',
};

const GROUP_ORDER = [
  'branding', 'loyalty', 'delivery', 'checkout', 'features',
  'catalog', 'orders', 'tax', 'notifications', 'contact',
  'pos', 'otp',
];

export default function AdminSettings() {
  const [grouped, setGrouped] = useState<Record<string, AdminSetting[]>>({});
  const [loading, setLoading] = useState(true);
  const [editValues, setEditValues] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState<string | null>(null);
  const [saved, setSaved] = useState<string | null>(null);

  const loadSettings = useCallback(async () => {
    setLoading(true);
    try {
      const result = await TZ.admin.settings.getAll();
      setGrouped(result.grouped || {});
      const vals: Record<string, string> = {};
      for (const s of (result.settings || [])) {
        vals[s.key] = s.value as string;
      }
      setEditValues(vals);
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadSettings(); }, [loadSettings]);

  const saveSetting = async (key: string) => {
    setSaving(key);
    try {
      let parsed: unknown;
      try {
        parsed = JSON.parse(editValues[key]);
      } catch {
        parsed = editValues[key];
      }

      await TZ.admin.settings.bulkUpdate({ settings: [{ key, value: parsed, group: 'general' }] });
      setSaved(key);
      setTimeout(() => setSaved(null), 2000);
    } catch {
      // silently fail
    } finally {
      setSaving(null);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <div className="text-2xl font-semibold text-gray-900" role="heading" aria-level={1}>System Settings</div>
          <p className="text-sm text-gray-400 mt-0.5">Configure loyalty, delivery, checkout, and feature settings</p>
        </div>
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 animate-pulse">
            <div className="h-5 bg-gray-100 rounded w-32 mb-4" />
            <div className="space-y-4">
              {[...Array(3)].map((_, j) => <div key={j} className="h-10 bg-gray-50 rounded-xl" />)}
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">System Settings</h1>
        <p className="text-sm text-gray-400 mt-0.5">Configure all system settings — loyalty, delivery, rewards, features, and more. Changes take effect within 60 seconds.</p>
      </div>

      {GROUP_ORDER.filter((g) => grouped[g]?.length).map((group) => (
        <div key={group} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">{GROUP_LABELS[group] || group}</h2>
          <div className="space-y-4">
            {grouped[group].map((setting) => (
              <div key={setting.key} className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                <div className="sm:w-1/3">
                  <p className="text-sm font-medium text-gray-700">{setting.label || setting.key}</p>
                  <p className="text-xs text-gray-400 font-mono">{setting.key}</p>
                </div>
                <div className="flex-1 flex gap-2 items-center">
                  {editValues[setting.key] === 'true' || editValues[setting.key] === 'false' ? (
                    <button
                      onClick={async () => {
                        const newVal = editValues[setting.key] === 'true' ? 'false' : 'true';
                        setEditValues((prev) => ({ ...prev, [setting.key]: newVal }));
                        setSaving(setting.key);
                        try {
                          await TZ.admin.settings.bulkUpdate({ settings: [{ key: setting.key, value: newVal === 'true', group: 'general' }] });
                          setSaved(setting.key);
                          setTimeout(() => setSaved(null), 2000);
                        } catch {
                          // silently fail
                        } finally {
                          setSaving(null);
                        }
                      }}
                      disabled={saving === setting.key}
                      className="transition-opacity hover:opacity-70 disabled:opacity-40"
                      title={editValues[setting.key] === 'true' ? 'Click to disable' : 'Click to enable'}
                    >
                      {editValues[setting.key] === 'true'
                        ? <ToggleOnIcon size={32} color="#16a34a" />
                        : <ToggleOffIcon size={32} />}
                    </button>
                  ) : (
                    <>
                      <input
                        type="text"
                        value={editValues[setting.key] || ''}
                        onChange={(e) => setEditValues((prev) => ({ ...prev, [setting.key]: e.target.value }))}
                        className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-300"
                      />
                      <button
                        onClick={() => saveSetting(setting.key)}
                        disabled={saving === setting.key}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                          saved === setting.key
                            ? 'bg-green-50 text-green-700'
                            : 'bg-gray-900 text-white hover:bg-gray-800 disabled:opacity-50'
                        }`}
                      >
                        {saving === setting.key ? '...' : saved === setting.key ? 'Saved!' : 'Save'}
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
