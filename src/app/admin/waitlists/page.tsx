'use client';

import { useEffect, useState, useCallback } from 'react';
import Image from 'next/image';
import { cloudinaryUrl } from '@/lib/cloudinary-url';
import { TZ } from '@/lib/tz';
import type { AdminWaitlistGroup } from '@buildwithdarsh/sdk';

export default function AdminWaitlists() {
  const [groups, setGroups] = useState<AdminWaitlistGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [notifyingId, setNotifyingId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const d = await TZ.admin.waitlists.list();
      setGroups(d);
    } catch {
      // silently handle
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const notifyAll = async (menuItemId: string) => {
    if (notifyingId) return;
    setNotifyingId(menuItemId);
    try {
      await TZ.admin.waitlists.notify(menuItemId);
      load();
    } catch {
      // silently handle
    } finally {
      setNotifyingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Waitlists</h1>
        <p className="text-sm text-gray-400 mt-0.5">Manage customer waitlists for out-of-stock items</p>
      </div>

      {/* Waitlist Groups */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="divide-y divide-gray-50">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="px-6 py-5 flex items-center gap-4">
                <div className="w-10 h-10 bg-gray-100 rounded-xl animate-pulse" />
                <div className="flex-1">
                  <div className="h-4 bg-gray-100 rounded w-32 animate-pulse" />
                  <div className="h-3 bg-gray-50 rounded w-20 mt-2 animate-pulse" />
                </div>
                <div className="w-24 h-8 bg-gray-50 rounded-lg animate-pulse" />
              </div>
            ))}
          </div>
        ) : groups.length === 0 ? (
          <div className="p-12 text-center">
            <svg className="w-12 h-12 mx-auto text-gray-200 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" /></svg>
            <p className="text-sm text-gray-400">No waitlist entries</p>
            <p className="text-xs text-gray-300 mt-1">When customers join waitlists for out-of-stock items, they will appear here</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {groups.map((group) => (
              <div key={group.menuItemId}>
                {/* Group Header */}
                <div
                  className="px-6 py-4 flex items-center gap-4 hover:bg-gray-50/50 cursor-pointer transition-colors"
                  onClick={() => setExpandedId(expandedId === group.menuItemId ? null : group.menuItemId)}
                >
                  {group.menuItemImage ? (
                    <Image src={cloudinaryUrl(group.menuItemImage)} alt={group.menuItemName} width={40} height={40} className="w-10 h-10 rounded-xl object-cover" />
                  ) : (
                    <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center">
                      <svg className="w-5 h-5 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6V2m0 4c-1.1 0-2 .9-2 2v4h4V8c0-1.1-.9-2-2-2zm-2 6v8m4-8v8" /></svg>
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-gray-900 font-medium">{group.menuItemName}</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {group.count} {group.count === 1 ? 'person' : 'people'} waiting
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-orange-50 text-orange-700">
                      {group.count}
                    </span>
                    <button
                      onClick={(e) => { e.stopPropagation(); notifyAll(group.menuItemId); }}
                      disabled={notifyingId === group.menuItemId}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-900 text-white rounded-lg text-xs font-medium hover:bg-gray-800 disabled:opacity-50 transition-colors"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" /></svg>
                      {notifyingId === group.menuItemId ? 'Notifying...' : 'Notify All'}
                    </button>
                    <svg className={`w-4 h-4 text-gray-400 transition-transform ${expandedId === group.menuItemId ? 'rotate-180' : ''}`}
                      fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                  </div>
                </div>

                {/* Expanded Entries */}
                {expandedId === group.menuItemId && (
                  <div className="px-6 pb-4 bg-gray-50/50">
                    <div className="ml-14 space-y-1.5">
                      {group.entries.map((entry) => (
                        <div key={entry.id} className="flex items-center justify-between text-xs py-1.5 px-3 bg-white rounded-lg border border-gray-100">
                          <span className="text-gray-700">{entry.email || entry.phone || <span className="text-gray-300">No contact</span>}</span>
                          <span className="text-gray-400">
                            {new Date(entry.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
