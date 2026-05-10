'use client';

import { useEffect, useState, useCallback } from 'react';
import { PlusIcon, PencilIcon, TrashIcon, XIcon, CheckIcon } from '@/components/icons';
import { TZ } from '@/lib/tz';
import type { AdminHelpArticle } from '@buildwithdarsh/sdk';

const EMPTY_FORM = {
  slug: '',
  title: '',
  body: '',
  category: '',
  sortOrder: 0,
  isPublished: true,
};

export default function AdminHelp() {
  const [articles, setArticles] = useState<AdminHelpArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const result = await TZ.admin.helpArticles.list();
      setArticles(result.data || []);
    } catch {
      // silently handle
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const openNew = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setShowForm(true);
  };

  const openEdit = (article: AdminHelpArticle) => {
    setEditingId(article.id);
    setForm({
      slug: article.slug,
      title: article.title,
      body: article.body,
      category: article.category,
      sortOrder: article.sortOrder,
      isPublished: article.isPublished,
    });
    setShowForm(true);
  };

  const save = async () => {
    setSaving(true);
    try {
      const payload = {
        slug: form.slug,
        title: form.title,
        body: form.body,
        category: form.category,
        sortOrder: Number(form.sortOrder),
        isPublished: form.isPublished,
      };

      if (editingId) {
        await TZ.admin.helpArticles.update(editingId, payload);
      } else {
        await TZ.admin.helpArticles.create(payload);
      }
      setShowForm(false);
      load();
    } finally {
      setSaving(false);
    }
  };

  const deleteArticle = async (id: string) => {
    if (!confirm('Delete this article? This cannot be undone.')) return;
    try {
      await TZ.admin.helpArticles.remove(id);
      load();
    } catch {
      // silently handle
    }
  };

  const moveOrder = async (article: AdminHelpArticle, direction: 'up' | 'down') => {
    const newOrder = direction === 'up' ? article.sortOrder - 1 : article.sortOrder + 1;
    try {
      await TZ.admin.helpArticles.update(article.id, { sortOrder: newOrder });
      load();
    } catch {
      // silently handle
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Help Centre</h1>
          <p className="text-sm text-gray-400 mt-0.5">Manage help articles and FAQs</p>
        </div>
        <button onClick={openNew} className="flex items-center gap-2 px-4 py-2.5 bg-gray-900 text-white rounded-xl text-sm font-medium hover:bg-gray-800 transition-colors">
          <PlusIcon size={15} />
          New Article
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4" onClick={() => setShowForm(false)}>
          <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">{editingId ? 'Edit Article' : 'New Article'}</h2>
              <button onClick={() => setShowForm(false)} className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                <XIcon size={18} />
              </button>
            </div>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-gray-500">Title</label>
                  <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
                    className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-200" />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500">Slug</label>
                  <input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })}
                    placeholder="how-to-order"
                    className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-orange-200" />
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500">Body</label>
                <textarea value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })}
                  rows={10}
                  className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-200 resize-none font-mono" />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-medium text-gray-500">Category</label>
                  <input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
                    placeholder="e.g. ordering, delivery"
                    className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-200" />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500">Sort Order</label>
                  <input type="number" value={form.sortOrder} onChange={(e) => setForm({ ...form, sortOrder: Number(e.target.value) })}
                    className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-200" />
                </div>
                <div className="flex items-end">
                  <label className="flex items-center gap-2 cursor-pointer pb-2">
                    <input type="checkbox" checked={form.isPublished} onChange={(e) => setForm({ ...form, isPublished: e.target.checked })}
                      className="w-4 h-4 rounded border-gray-300 text-orange-600" />
                    <span className="text-sm text-gray-700">Published</span>
                  </label>
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={save} disabled={saving || !form.title || !form.slug}
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

      {/* Articles Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="divide-y divide-gray-50">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="px-6 py-4 flex gap-4">
                <div className="w-8 h-4 bg-gray-100 rounded animate-pulse" />
                <div className="flex-1 h-4 bg-gray-50 rounded animate-pulse" />
                <div className="w-20 h-4 bg-gray-50 rounded animate-pulse" />
                <div className="w-16 h-4 bg-gray-50 rounded animate-pulse" />
              </div>
            ))}
          </div>
        ) : articles.length === 0 ? (
          <div className="p-12 text-center">
            <svg className="w-12 h-12 mx-auto text-gray-200 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827m0 0v.75m0-3.768a.75.75 0 01.75-.75h.008a.75.75 0 01.75.75v.008a.75.75 0 01-.75.75H12a.75.75 0 01-.75-.75V15m0 2.25h.008v.008H12v-.008zM21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <p className="text-sm text-gray-400">No help articles yet</p>
            <p className="text-xs text-gray-300 mt-1">Create your first article to get started</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500 border-b border-gray-100 bg-gray-50/50">
                  <th className="px-6 py-3 font-medium w-12">Order</th>
                  <th className="px-6 py-3 font-medium">Title</th>
                  <th className="px-6 py-3 font-medium">Category</th>
                  <th className="px-6 py-3 font-medium text-center">Published</th>
                  <th className="px-6 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {articles.map((article, idx) => (
                  <tr key={article.id} className={`hover:bg-gray-50/50 ${!article.isPublished ? 'opacity-50' : ''}`}>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => moveOrder(article, 'up')}
                          disabled={idx === 0}
                          className="p-0.5 text-gray-400 hover:text-gray-600 disabled:opacity-20 transition-colors"
                          title="Move up"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" /></svg>
                        </button>
                        <span className="text-xs text-gray-400 w-4 text-center">{article.sortOrder}</span>
                        <button
                          onClick={() => moveOrder(article, 'down')}
                          disabled={idx === articles.length - 1}
                          className="p-0.5 text-gray-400 hover:text-gray-600 disabled:opacity-20 transition-colors"
                          title="Move down"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-gray-900 font-medium">{article.title}</p>
                      <p className="text-xs text-gray-400 font-mono mt-0.5">/{article.slug}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs text-gray-500 capitalize bg-gray-50 px-2 py-0.5 rounded border border-gray-100">{article.category}</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      {article.isPublished ? (
                        <span className="inline-flex items-center gap-1 text-xs text-green-700">
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><polyline points="20,6 9,17 4,12" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" /></svg>
                          Published
                        </span>
                      ) : (
                        <span className="text-xs text-gray-400">Draft</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex gap-1 justify-end">
                        <button onClick={() => openEdit(article)} title="Edit article"
                          className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors">
                          <PencilIcon size={15} />
                        </button>
                        <button onClick={() => deleteArticle(article.id)} title="Delete article"
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
