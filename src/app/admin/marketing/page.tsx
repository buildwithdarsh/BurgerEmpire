'use client';

import { useEffect, useState, useCallback } from 'react';
import { TZ } from '@/lib/tz';
import type { AdminAffiliate, AdminPopupSettings } from '@buildwithdarsh/sdk';

type Tab = 'affiliates' | 'popups';

// ─── Tab: AdminAffiliates ─────────────────────────────────────────────────────────

function AdminAffiliatesTab() {
  const [affiliates, setAffiliates] = useState<AdminAffiliate[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const d = await TZ.admin.affiliates.list();
      setAffiliates(d);
    } catch {
      // silently handle
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      {loading ? (
        <div className="divide-y divide-gray-50">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="px-6 py-4 flex gap-4">
              <div className="w-24 h-4 bg-gray-100 rounded animate-pulse" />
              <div className="flex-1 h-4 bg-gray-50 rounded animate-pulse" />
              <div className="w-16 h-4 bg-gray-50 rounded animate-pulse" />
              <div className="w-16 h-4 bg-gray-50 rounded animate-pulse" />
              <div className="w-16 h-4 bg-gray-50 rounded animate-pulse" />
            </div>
          ))}
        </div>
      ) : affiliates.length === 0 ? (
        <div className="p-12 text-center">
          <svg className="w-12 h-12 mx-auto text-gray-200 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" /></svg>
          <p className="text-sm text-gray-400">No affiliate data yet</p>
          <p className="text-xs text-gray-300 mt-1">UTM-tracked traffic will appear here</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 border-b border-gray-100 bg-gray-50/50">
                <th className="px-6 py-3 font-medium">UTM Source</th>
                <th className="px-6 py-3 font-medium">Campaign</th>
                <th className="px-6 py-3 font-medium text-right">Clicks</th>
                <th className="px-6 py-3 font-medium text-right">Conversions</th>
                <th className="px-6 py-3 font-medium text-right">Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {affiliates.map((a) => (
                <tr key={a.id} className="hover:bg-gray-50/50">
                  <td className="px-6 py-4">
                    <span className="text-gray-900 font-medium">{a.utmSource}</span>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{a.utmCampaign}</td>
                  <td className="px-6 py-4 text-right text-gray-900 font-medium">{a.clicks.toLocaleString()}</td>
                  <td className="px-6 py-4 text-right text-gray-900 font-medium">{a.conversions.toLocaleString()}</td>
                  <td className="px-6 py-4 text-right">
                    <span className={`px-2 py-0.5 rounded-md text-xs font-medium ${
                      a.conversionRate >= 5 ? 'bg-green-50 text-green-700' :
                      a.conversionRate >= 2 ? 'bg-yellow-50 text-yellow-700' :
                      'bg-gray-50 text-gray-600'
                    }`}>
                      {a.conversionRate}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ─── Tab: Popups ─────────────────────────────────────────────────────────────

function PopupsTab() {
  const [_popup, setPopup] = useState<AdminPopupSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const [content, setContent] = useState('');
  const [trigger, setTrigger] = useState('first_visit');
  const [isActive, setIsActive] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const d = await TZ.admin.popups.get();
      if (d) {
        const p = (d as any).popup ?? d;
        setPopup(p);
        setContent(p.content);
        setTrigger(p.trigger);
        setIsActive(p.isActive);
      }
    } catch {
      // silently handle
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const save = async () => {
    setSaving(true);
    try {
      await TZ.admin.popups.update({ content, trigger, isActive });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
      load();
    } catch {
      // silently handle
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 max-w-lg animate-pulse">
        <div className="h-5 bg-gray-100 rounded w-40 mb-4" />
        <div className="space-y-4">
          <div className="h-24 bg-gray-50 rounded-xl" />
          <div className="h-10 bg-gray-50 rounded-xl" />
          <div className="h-10 bg-gray-50 rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 max-w-lg">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Exit-Intent Popup Settings</h3>
      <div className="space-y-4">
        <div>
          <label className="text-xs font-medium text-gray-500">Popup Content</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={4}
            placeholder="Enter popup message or HTML content..."
            className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-200 resize-none"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-gray-500">Trigger</label>
          <select
            value={trigger}
            onChange={(e) => setTrigger(e.target.value)}
            className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-200"
          >
            <option value="first_visit">First Visit</option>
            <option value="exit_intent">Exit Intent</option>
          </select>
        </div>
        <label className="flex items-center gap-3 cursor-pointer">
          <button
            type="button"
            onClick={() => setIsActive(!isActive)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${isActive ? 'bg-green-500' : 'bg-gray-200'}`}
          >
            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isActive ? 'translate-x-6' : 'translate-x-1'}`} />
          </button>
          <span className="text-sm text-gray-700">{isActive ? 'Active' : 'Inactive'}</span>
        </label>
        <button
          onClick={save}
          disabled={saving}
          className={`w-full py-2.5 rounded-xl text-sm font-medium transition-colors ${
            saved
              ? 'bg-green-50 text-green-700'
              : 'bg-gray-900 text-white hover:bg-gray-800 disabled:opacity-50'
          }`}
        >
          {saving ? 'Saving...' : saved ? 'Saved!' : 'Save Settings'}
        </button>
      </div>
    </div>
  );
}

// ─── Main Marketing Page ─────────────────────────────────────────────────────

export default function AdminMarketing() {
  const [tab, setTab] = useState<Tab>('affiliates');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Marketing</h1>
        <p className="text-sm text-gray-400 mt-0.5">AdminAffiliate tracking and popup management</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit">
        <button
          onClick={() => setTab('affiliates')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            tab === 'affiliates' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          AdminAffiliates
        </button>
        <button
          onClick={() => setTab('popups')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            tab === 'popups' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Popups
        </button>
      </div>

      {/* Tab Content */}
      {tab === 'affiliates' && <AdminAffiliatesTab />}
      {tab === 'popups' && <PopupsTab />}
    </div>
  );
}
