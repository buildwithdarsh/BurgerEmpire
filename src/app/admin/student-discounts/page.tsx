'use client';

import { useEffect, useState, useCallback } from 'react';
import { PlusIcon, PencilIcon, TrashIcon, XIcon, CheckIcon, ToggleOnIcon, ToggleOffIcon } from '@/components/icons';
import { TZ } from '@/lib/tz';
import type { AdminStudentDiscount } from '@buildwithdarsh/sdk';

interface Institution {
  id: string;
  name: string;
}

const DISCOUNT_TYPES = [
  { value: 'PERCENTAGE', label: 'Percentage' },
  { value: 'FIXED', label: 'Fixed Amount' },
  { value: 'FREE_DELIVERY', label: 'Free Delivery' },
  { value: 'BOGO', label: 'Buy One Get One' },
];

const SCOPE_OPTIONS = [
  { value: 'ALL', label: 'All Items' },
  { value: 'CATEGORY', label: 'Specific Categories' },
  { value: 'ITEM', label: 'Specific Items' },
];

const ORDER_TYPES = ['DELIVERY', 'PICKUP', 'DINE_IN'];
const CART_MODES = ['classic', 'healthy'];
const DAYS_OF_WEEK = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const TYPE_COLORS: Record<string, string> = {
  PERCENTAGE: 'bg-blue-50 text-blue-700',
  FIXED: 'bg-green-50 text-green-700',
  FREE_DELIVERY: 'bg-purple-50 text-purple-700',
  BOGO: 'bg-orange-50 text-orange-700',
};

const EMPTY_FORM = {
  name: '', description: '', institutionId: '', priority: 0, isActive: true,
  discountType: 'PERCENTAGE', discountValue: '', maxDiscountCap: '', minDiscountFloor: '', maxDiscountPctOfOrder: '',
  minOrderAmount: '', maxOrderAmount: '', minItemCount: '', maxItemCount: '',
  orderTypes: [] as string[], cartModes: [] as string[],
  scope: 'ALL', categoryIds: '', itemIds: '', exclusionCategoryIds: '', exclusionItemIds: '',
  validFrom: '', validTo: '',
  daysOfWeek: [] as string[], timeFrom: '', timeTo: '', blackoutDates: '',
  maxUsageTotal: '', maxUsagePerUser: '', maxUsagePerDay: '', maxUsagePerUserPerDay: '', maxUsagePerUserPerWeek: '', maxUsagePerUserPerMonth: '',
  stackWithCoupons: true, stackWithPromotions: true, stackWithLoyalty: true, stackWithOtherStudentDiscounts: false,
  earnLoyaltyCoins: true, loyaltyMultiplier: '',
};

type FormState = typeof EMPTY_FORM;

export default function AdminStudentDiscounts() {
  const [discounts, setDiscounts] = useState<AdminStudentDiscount[]>([]);
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [dRes, iRes] = await Promise.all([
        TZ.admin.studentDiscounts.list(),
        TZ.admin.institutions.list(),
      ]);
      setDiscounts(dRes.data || []);
      setInstitutions(iRes.data || []);
    } catch {
      // silently handle
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const parseArray = (val: string | null): string[] => {
    if (!val) return [];
    try { return JSON.parse(val); } catch { return val.split(',').map((s) => s.trim()).filter(Boolean); }
  };

  const openEdit = (d: AdminStudentDiscount) => {
    setEditingId(d.id);
    setForm({
      name: d.name,
      description: d.description || '',
      institutionId: d.institutionId || '',
      priority: d.priority,
      isActive: d.isActive,
      discountType: d.discountType,
      discountValue: d.discountValue?.toString() || '',
      maxDiscountCap: d.maxDiscountCap?.toString() || '',
      minDiscountFloor: d.minDiscountFloor?.toString() || '',
      maxDiscountPctOfOrder: d.maxDiscountPctOfOrder?.toString() || '',
      minOrderAmount: d.minOrderAmount?.toString() || '',
      maxOrderAmount: d.maxOrderAmount?.toString() || '',
      minItemCount: d.minItemCount?.toString() || '',
      maxItemCount: d.maxItemCount?.toString() || '',
      orderTypes: parseArray(d.orderTypes),
      cartModes: parseArray(d.cartModes),
      scope: d.scope || 'ALL',
      categoryIds: d.categoryIds || '',
      itemIds: d.itemIds || '',
      exclusionCategoryIds: d.exclusionCategoryIds || '',
      exclusionItemIds: d.exclusionItemIds || '',
      validFrom: d.validFrom ? d.validFrom.split('T')[0] : '',
      validTo: d.validTo ? d.validTo.split('T')[0] : '',
      daysOfWeek: parseArray(d.daysOfWeek),
      timeFrom: d.timeFrom || '',
      timeTo: d.timeTo || '',
      blackoutDates: d.blackoutDates || '',
      maxUsageTotal: d.maxUsageTotal?.toString() || '',
      maxUsagePerUser: d.maxUsagePerUser?.toString() || '',
      maxUsagePerDay: d.maxUsagePerDay?.toString() || '',
      maxUsagePerUserPerDay: d.maxUsagePerUserPerDay?.toString() || '',
      maxUsagePerUserPerWeek: d.maxUsagePerUserPerWeek?.toString() || '',
      maxUsagePerUserPerMonth: d.maxUsagePerUserPerMonth?.toString() || '',
      stackWithCoupons: d.stackWithCoupons,
      stackWithPromotions: d.stackWithPromotions,
      stackWithLoyalty: d.stackWithLoyalty,
      stackWithOtherStudentDiscounts: d.stackWithOtherStudentDiscounts,
      earnLoyaltyCoins: d.earnLoyaltyCoins,
      loyaltyMultiplier: d.loyaltyMultiplier?.toString() || '',
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
        description: form.description || null,
        institutionId: form.institutionId || null,
        priority: Number(form.priority),
        isActive: form.isActive,
        discountType: form.discountType,
        discountValue: form.discountValue ? Number(form.discountValue) : null,
        maxDiscountCap: form.maxDiscountCap ? Number(form.maxDiscountCap) : null,
        minDiscountFloor: form.minDiscountFloor ? Number(form.minDiscountFloor) : null,
        maxDiscountPctOfOrder: form.maxDiscountPctOfOrder ? Number(form.maxDiscountPctOfOrder) : null,
        minOrderAmount: form.minOrderAmount ? Number(form.minOrderAmount) : null,
        maxOrderAmount: form.maxOrderAmount ? Number(form.maxOrderAmount) : null,
        minItemCount: form.minItemCount ? Number(form.minItemCount) : null,
        maxItemCount: form.maxItemCount ? Number(form.maxItemCount) : null,
        orderTypes: form.orderTypes.length > 0 ? JSON.stringify(form.orderTypes) : null,
        cartModes: form.cartModes.length > 0 ? JSON.stringify(form.cartModes) : null,
        scope: form.scope,
        categoryIds: form.categoryIds || null,
        itemIds: form.itemIds || null,
        exclusionCategoryIds: form.exclusionCategoryIds || null,
        exclusionItemIds: form.exclusionItemIds || null,
        validFrom: form.validFrom || null,
        validTo: form.validTo || null,
        daysOfWeek: form.daysOfWeek.length > 0 ? JSON.stringify(form.daysOfWeek) : null,
        timeFrom: form.timeFrom || null,
        timeTo: form.timeTo || null,
        blackoutDates: form.blackoutDates || null,
        maxUsageTotal: form.maxUsageTotal ? Number(form.maxUsageTotal) : null,
        maxUsagePerUser: form.maxUsagePerUser ? Number(form.maxUsagePerUser) : null,
        maxUsagePerDay: form.maxUsagePerDay ? Number(form.maxUsagePerDay) : null,
        maxUsagePerUserPerDay: form.maxUsagePerUserPerDay ? Number(form.maxUsagePerUserPerDay) : null,
        maxUsagePerUserPerWeek: form.maxUsagePerUserPerWeek ? Number(form.maxUsagePerUserPerWeek) : null,
        maxUsagePerUserPerMonth: form.maxUsagePerUserPerMonth ? Number(form.maxUsagePerUserPerMonth) : null,
        stackWithCoupons: form.stackWithCoupons,
        stackWithPromotions: form.stackWithPromotions,
        stackWithLoyalty: form.stackWithLoyalty,
        stackWithOtherStudentDiscounts: form.stackWithOtherStudentDiscounts,
        earnLoyaltyCoins: form.earnLoyaltyCoins,
        loyaltyMultiplier: form.loyaltyMultiplier ? Number(form.loyaltyMultiplier) : null,
      };

      if (editingId) {
        await TZ.admin.studentDiscounts.update(editingId, payload as any);
      } else {
        await TZ.admin.studentDiscounts.create(payload as any);
      }
      setShowForm(false);
      load();
    } finally {
      setSaving(false);
    }
  };

  const toggleActive = async (d: AdminStudentDiscount) => {
    try {
      await TZ.admin.studentDiscounts.update(d.id, { isActive: !d.isActive });
      load();
    } catch {
      // silently handle
    }
  };

  const deleteDiscount = async (id: string) => {
    if (!confirm('Delete this discount rule? This cannot be undone.')) return;
    try {
      await TZ.admin.studentDiscounts.remove(id);
      load();
    } catch {
      // silently handle
    }
  };

  const toggleArrayField = (field: 'orderTypes' | 'cartModes' | 'daysOfWeek', value: string) => {
    setForm((prev) => {
      const arr = prev[field] as string[];
      return { ...prev, [field]: arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value] };
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Student Discounts</h1>
          <p className="text-sm text-gray-400 mt-0.5">Configure discount rules for verified student pass holders</p>
        </div>
        <button onClick={openNew} className="flex items-center gap-2 px-4 py-2.5 bg-gray-900 text-white rounded-xl text-sm font-medium hover:bg-gray-800 transition-colors">
          <PlusIcon size={15} />
          New Discount Rule
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4" onClick={() => setShowForm(false)}>
          <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">{editingId ? 'Edit Discount Rule' : 'New Discount Rule'}</h2>
              <button onClick={() => setShowForm(false)} className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                <XIcon size={18} />
              </button>
            </div>

            <div className="space-y-6">
              {/* Basic */}
              <fieldset className="space-y-3">
                <legend className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Basic</legend>
                <div>
                  <label className="text-xs font-medium text-gray-500">Rule Name</label>
                  <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="e.g. Student 10% Off"
                    className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-200" />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500">Description</label>
                  <input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                    className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-200" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-gray-500">Institution (optional)</label>
                    <select value={form.institutionId} onChange={(e) => setForm({ ...form, institutionId: e.target.value })}
                      className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-200">
                      <option value="">Global (All Institutions)</option>
                      {institutions.map((inst) => (
                        <option key={inst.id} value={inst.id}>{inst.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500">Priority</label>
                    <input type="number" value={form.priority} onChange={(e) => setForm({ ...form, priority: Number(e.target.value) })}
                      className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-200" />
                  </div>
                </div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                    className="w-4 h-4 rounded border-gray-300 text-orange-600" />
                  <span className="text-sm text-gray-700">Active</span>
                </label>
              </fieldset>

              {/* Discount Value */}
              <fieldset className="space-y-3">
                <legend className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Discount Value</legend>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-gray-500">Discount Type</label>
                    <select value={form.discountType} onChange={(e) => setForm({ ...form, discountType: e.target.value })}
                      className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-200">
                      {DISCOUNT_TYPES.map((t) => (
                        <option key={t.value} value={t.value}>{t.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500">Value {form.discountType === 'PERCENTAGE' ? '(%)' : '(₹)'}</label>
                    <input type="number" value={form.discountValue} onChange={(e) => setForm({ ...form, discountValue: e.target.value })}
                      className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-200" />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="text-xs font-medium text-gray-500">Max Discount Cap ₹</label>
                    <input type="number" value={form.maxDiscountCap} onChange={(e) => setForm({ ...form, maxDiscountCap: e.target.value })}
                      className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-200" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500">Min Discount Floor ₹</label>
                    <input type="number" value={form.minDiscountFloor} onChange={(e) => setForm({ ...form, minDiscountFloor: e.target.value })}
                      className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-200" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500">Max % of Order</label>
                    <input type="number" value={form.maxDiscountPctOfOrder} onChange={(e) => setForm({ ...form, maxDiscountPctOfOrder: e.target.value })}
                      className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-200" />
                  </div>
                </div>
              </fieldset>

              {/* Order Eligibility */}
              <fieldset className="space-y-3">
                <legend className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Order Eligibility</legend>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-gray-500">Min Order Amount ₹</label>
                    <input type="number" value={form.minOrderAmount} onChange={(e) => setForm({ ...form, minOrderAmount: e.target.value })}
                      className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-200" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500">Max Order Amount ₹</label>
                    <input type="number" value={form.maxOrderAmount} onChange={(e) => setForm({ ...form, maxOrderAmount: e.target.value })}
                      className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-200" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-gray-500">Min Item Count</label>
                    <input type="number" value={form.minItemCount} onChange={(e) => setForm({ ...form, minItemCount: e.target.value })}
                      className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-200" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500">Max Item Count</label>
                    <input type="number" value={form.maxItemCount} onChange={(e) => setForm({ ...form, maxItemCount: e.target.value })}
                      className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-200" />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 mb-1.5 block">Order Types</label>
                  <div className="flex flex-wrap gap-2">
                    {ORDER_TYPES.map((ot) => (
                      <label key={ot} className="flex items-center gap-1.5 cursor-pointer">
                        <input type="checkbox" checked={form.orderTypes.includes(ot)} onChange={() => toggleArrayField('orderTypes', ot)}
                          className="w-3.5 h-3.5 rounded border-gray-300 text-orange-600" />
                        <span className="text-xs text-gray-600">{ot}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 mb-1.5 block">Cart Modes</label>
                  <div className="flex flex-wrap gap-2">
                    {CART_MODES.map((cm) => (
                      <label key={cm} className="flex items-center gap-1.5 cursor-pointer">
                        <input type="checkbox" checked={form.cartModes.includes(cm)} onChange={() => toggleArrayField('cartModes', cm)}
                          className="w-3.5 h-3.5 rounded border-gray-300 text-orange-600" />
                        <span className="text-xs text-gray-600 capitalize">{cm}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </fieldset>

              {/* Item Scope */}
              <fieldset className="space-y-3">
                <legend className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Item Scope</legend>
                <div>
                  <label className="text-xs font-medium text-gray-500">Scope</label>
                  <select value={form.scope} onChange={(e) => setForm({ ...form, scope: e.target.value })}
                    className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-200">
                    {SCOPE_OPTIONS.map((s) => (
                      <option key={s.value} value={s.value}>{s.label}</option>
                    ))}
                  </select>
                </div>
                {form.scope === 'CATEGORY' && (
                  <div>
                    <label className="text-xs font-medium text-gray-500">Category IDs (comma-separated)</label>
                    <input value={form.categoryIds} onChange={(e) => setForm({ ...form, categoryIds: e.target.value })}
                      placeholder="cat-id-1, cat-id-2"
                      className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-orange-200" />
                  </div>
                )}
                {form.scope === 'ITEM' && (
                  <div>
                    <label className="text-xs font-medium text-gray-500">Item IDs (comma-separated)</label>
                    <input value={form.itemIds} onChange={(e) => setForm({ ...form, itemIds: e.target.value })}
                      placeholder="item-id-1, item-id-2"
                      className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-orange-200" />
                  </div>
                )}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-gray-500">Exclusion Category IDs</label>
                    <input value={form.exclusionCategoryIds} onChange={(e) => setForm({ ...form, exclusionCategoryIds: e.target.value })}
                      placeholder="Comma-separated"
                      className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-orange-200" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500">Exclusion Item IDs</label>
                    <input value={form.exclusionItemIds} onChange={(e) => setForm({ ...form, exclusionItemIds: e.target.value })}
                      placeholder="Comma-separated"
                      className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-orange-200" />
                  </div>
                </div>
              </fieldset>

              {/* Validity */}
              <fieldset className="space-y-3">
                <legend className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Validity</legend>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-gray-500">Valid From</label>
                    <input type="date" value={form.validFrom} onChange={(e) => setForm({ ...form, validFrom: e.target.value })}
                      className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-200" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500">Valid To</label>
                    <input type="date" value={form.validTo} onChange={(e) => setForm({ ...form, validTo: e.target.value })}
                      className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-200" />
                  </div>
                </div>
              </fieldset>

              {/* Time Restrictions */}
              <fieldset className="space-y-3">
                <legend className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Time Restrictions</legend>
                <div>
                  <label className="text-xs font-medium text-gray-500 mb-1.5 block">Days of Week</label>
                  <div className="flex flex-wrap gap-2">
                    {DAYS_OF_WEEK.map((day) => (
                      <label key={day} className="flex items-center gap-1.5 cursor-pointer">
                        <input type="checkbox" checked={form.daysOfWeek.includes(day)} onChange={() => toggleArrayField('daysOfWeek', day)}
                          className="w-3.5 h-3.5 rounded border-gray-300 text-orange-600" />
                        <span className="text-xs text-gray-600">{day}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-gray-500">Time From</label>
                    <input type="time" value={form.timeFrom} onChange={(e) => setForm({ ...form, timeFrom: e.target.value })}
                      className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-200" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500">Time To</label>
                    <input type="time" value={form.timeTo} onChange={(e) => setForm({ ...form, timeTo: e.target.value })}
                      className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-200" />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500">Blackout Dates (comma-separated YYYY-MM-DD)</label>
                  <input value={form.blackoutDates} onChange={(e) => setForm({ ...form, blackoutDates: e.target.value })}
                    placeholder="2026-01-26, 2026-08-15"
                    className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-orange-200" />
                </div>
              </fieldset>

              {/* Usage Quotas */}
              <fieldset className="space-y-3">
                <legend className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Usage Quotas</legend>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="text-xs font-medium text-gray-500">Max Total Uses</label>
                    <input type="number" value={form.maxUsageTotal} onChange={(e) => setForm({ ...form, maxUsageTotal: e.target.value })}
                      className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-200" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500">Max Per User</label>
                    <input type="number" value={form.maxUsagePerUser} onChange={(e) => setForm({ ...form, maxUsagePerUser: e.target.value })}
                      className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-200" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500">Max Per Day</label>
                    <input type="number" value={form.maxUsagePerDay} onChange={(e) => setForm({ ...form, maxUsagePerDay: e.target.value })}
                      className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-200" />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="text-xs font-medium text-gray-500">Per User/Day</label>
                    <input type="number" value={form.maxUsagePerUserPerDay} onChange={(e) => setForm({ ...form, maxUsagePerUserPerDay: e.target.value })}
                      className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-200" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500">Per User/Week</label>
                    <input type="number" value={form.maxUsagePerUserPerWeek} onChange={(e) => setForm({ ...form, maxUsagePerUserPerWeek: e.target.value })}
                      className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-200" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500">Per User/Month</label>
                    <input type="number" value={form.maxUsagePerUserPerMonth} onChange={(e) => setForm({ ...form, maxUsagePerUserPerMonth: e.target.value })}
                      className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-200" />
                  </div>
                </div>
              </fieldset>

              {/* Stacking */}
              <fieldset className="space-y-3">
                <legend className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Stacking</legend>
                <div className="grid grid-cols-2 gap-3">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={form.stackWithCoupons} onChange={(e) => setForm({ ...form, stackWithCoupons: e.target.checked })}
                      className="w-4 h-4 rounded border-gray-300 text-orange-600" />
                    <span className="text-sm text-gray-700">Stack with Coupons</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={form.stackWithPromotions} onChange={(e) => setForm({ ...form, stackWithPromotions: e.target.checked })}
                      className="w-4 h-4 rounded border-gray-300 text-orange-600" />
                    <span className="text-sm text-gray-700">Stack with Promotions</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={form.stackWithLoyalty} onChange={(e) => setForm({ ...form, stackWithLoyalty: e.target.checked })}
                      className="w-4 h-4 rounded border-gray-300 text-orange-600" />
                    <span className="text-sm text-gray-700">Stack with Loyalty</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={form.stackWithOtherStudentDiscounts} onChange={(e) => setForm({ ...form, stackWithOtherStudentDiscounts: e.target.checked })}
                      className="w-4 h-4 rounded border-gray-300 text-orange-600" />
                    <span className="text-sm text-gray-700">Stack with Other Student Discounts</span>
                  </label>
                </div>
              </fieldset>

              {/* Loyalty */}
              <fieldset className="space-y-3">
                <legend className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Loyalty</legend>
                <div className="grid grid-cols-2 gap-3">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={form.earnLoyaltyCoins} onChange={(e) => setForm({ ...form, earnLoyaltyCoins: e.target.checked })}
                      className="w-4 h-4 rounded border-gray-300 text-orange-600" />
                    <span className="text-sm text-gray-700">Earn Loyalty Coins</span>
                  </label>
                  <div>
                    <label className="text-xs font-medium text-gray-500">Loyalty Multiplier</label>
                    <input type="number" step="0.1" value={form.loyaltyMultiplier} onChange={(e) => setForm({ ...form, loyaltyMultiplier: e.target.value })}
                      placeholder="e.g. 1.5"
                      className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-200" />
                  </div>
                </div>
              </fieldset>
            </div>

            <div className="flex gap-3 mt-6 pt-4 border-t border-gray-100">
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

      {/* Discounts Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="divide-y divide-gray-50">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="px-6 py-4 flex gap-4">
                <div className="w-32 h-4 bg-gray-100 rounded animate-pulse" />
                <div className="flex-1 h-4 bg-gray-50 rounded animate-pulse" />
                <div className="w-20 h-4 bg-gray-50 rounded animate-pulse" />
                <div className="w-16 h-4 bg-gray-50 rounded animate-pulse" />
                <div className="w-12 h-4 bg-gray-50 rounded animate-pulse" />
              </div>
            ))}
          </div>
        ) : discounts.length === 0 ? (
          <div className="p-12 text-center">
            <svg className="w-12 h-12 mx-auto text-gray-200 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
            <p className="text-sm text-gray-400">No student discount rules yet</p>
            <p className="text-xs text-gray-300 mt-1">Create your first discount rule for student pass holders</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500 border-b border-gray-100 bg-gray-50/50">
                  <th className="px-6 py-3 font-medium">Rule Name</th>
                  <th className="px-6 py-3 font-medium">Institution</th>
                  <th className="px-6 py-3 font-medium text-center">Type</th>
                  <th className="px-6 py-3 font-medium text-right">Value</th>
                  <th className="px-6 py-3 font-medium text-center">Active</th>
                  <th className="px-6 py-3 font-medium text-center">Uses</th>
                  <th className="px-6 py-3 font-medium text-right">Total Discount</th>
                  <th className="px-6 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {discounts.map((d) => (
                  <tr key={d.id} className={`hover:bg-gray-50/50 ${!d.isActive ? 'opacity-50' : ''}`}>
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-900">{d.name}</p>
                      {d.description && <p className="text-xs text-gray-400 mt-0.5">{d.description}</p>}
                    </td>
                    <td className="px-6 py-4 text-gray-600 text-xs">
                      {d.institution?.name || <span className="text-orange-600 font-medium">Global</span>}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-2.5 py-1 rounded-lg text-xs font-medium ${TYPE_COLORS[d.discountType] || 'bg-gray-50 text-gray-600'}`}>
                        {d.discountType}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right font-medium">
                      {d.discountType === 'PERCENTAGE' ? `${d.discountValue}%` : d.discountType === 'FREE_DELIVERY' ? 'Free' : d.discountType === 'BOGO' ? 'BOGO' : `₹${d.discountValue}`}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button onClick={() => toggleActive(d)} title={d.isActive ? 'Deactivate' : 'Activate'}
                        className="transition-opacity hover:opacity-70">
                        {d.isActive
                          ? <ToggleOnIcon size={32} color="#16a34a" />
                          : <ToggleOffIcon size={32} />}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-center text-gray-600">{d.totalUses}</td>
                    <td className="px-6 py-4 text-right font-medium text-gray-900">
                      ₹{d.totalDiscountGiven.toLocaleString('en-IN')}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex gap-1 justify-end">
                        <button onClick={() => openEdit(d)} title="Edit discount rule"
                          className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors">
                          <PencilIcon size={15} />
                        </button>
                        <button onClick={() => deleteDiscount(d.id)} title="Delete discount rule"
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
