'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, type PanInfo } from 'framer-motion';
import Spinner from '@/components/ui/Spinner';
import Input from '@/components/ui/Input';

/* ─── Types ────────────────────────────────────────────── */

/**
 * Address form data shape used by this drawer component.
 * Differs from SDK Address (which includes state, country and stricter nullability) —
 * this is a simplified form input type without fields the user doesn't fill in.
 * See: Address from @buildwithdarsh/sdk for the full API entity.
 */
export interface AddressData {
  id?: string;
  label: string;
  line1: string;
  line2: string;
  city: string;
  pincode: string;
  lat?: number | null;
  lng?: number | null;
  isDefault?: boolean;
}

type LabelOption = 'Home' | 'Work' | 'Other';

interface AddressDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (address: AddressData) => Promise<void>;
  /** Pre-fill for editing an existing address */
  initialData?: AddressData | null;
  /** Accent color for buttons/highlights */
  accent?: string;
  accentBg?: string;
}

/* ─── Label chip config ────────────────────────────────── */

const LABEL_OPTIONS: { key: LabelOption; icon: React.ReactNode }[] = [
  {
    key: 'Home',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
      </svg>
    ),
  },
  {
    key: 'Work',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0" />
      </svg>
    ),
  },
  {
    key: 'Other',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
      </svg>
    ),
  },
];

/* ─── Component ────────────────────────────────────────── */

export default function AddressDrawer({
  isOpen,
  onClose,
  onSave,
  initialData,
  accent = '#4AA056',
  accentBg = '#F0FAF3',
}: AddressDrawerProps) {
  const isEditing = !!initialData?.id;

  // Form state
  const [label, setLabel] = useState<LabelOption>('Home');
  const [customLabel, setCustomLabel] = useState('');
  const [line1, setLine1] = useState('');
  const [line2, setLine2] = useState('');
  const [city, setCity] = useState('');
  const [pincode, setPincode] = useState('');
  const [lat, setLat] = useState<number | null>(null);
  const [lng, setLng] = useState<number | null>(null);

  // Location state
  const [locating, setLocating] = useState(false);
  const [locationError, setLocationError] = useState('');
  const [locationLabel, setLocationLabel] = useState('');

  // Saving
  const [saving, setSaving] = useState(false);

  // Reset form when drawer opens with new data
  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        const matchedLabel = (['Home', 'Work'] as LabelOption[]).find(
          (l) => l.toLowerCase() === initialData.label?.toLowerCase()
        );
        if (matchedLabel) {
          setLabel(matchedLabel);
          setCustomLabel('');
        } else {
          setLabel('Other');
          setCustomLabel(initialData.label || '');
        }
        setLine1(initialData.line1);
        setLine2(initialData.line2 || '');
        setCity(initialData.city);
        setPincode(initialData.pincode);
        setLat(initialData.lat ?? null);
        setLng(initialData.lng ?? null);
        setLocationLabel('');
      } else {
        setLabel('Home');
        setCustomLabel('');
        setLine1('');
        setLine2('');
        setCity('');
        setPincode('');
        setLat(null);
        setLng(null);
        setLocationLabel('');
      }
      setLocationError('');
      setSaving(false);
    }
  }, [isOpen, initialData]);

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      return () => { document.body.style.overflow = ''; };
    }
    return undefined;
  }, [isOpen]);

  /* ── Geolocation + reverse geocode ── */
  const handleUseCurrentLocation = useCallback(async () => {
    setLocating(true);
    setLocationError('');

    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser');
      setLocating(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setLat(latitude);
        setLng(longitude);

        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
            { headers: { 'Accept-Language': 'en' } }
          );
          const data = await res.json();

          if (data.address) {
            const addr = data.address;
            const road = addr.road || addr.pedestrian || addr.neighbourhood || '';
            const suburb = addr.suburb || addr.neighbourhood || addr.hamlet || '';
            const houseNumber = addr.house_number || '';

            setLine1([houseNumber, road].filter(Boolean).join(', ') || data.display_name?.split(',')[0] || '');
            setLine2(suburb);
            setCity(addr.city || addr.town || addr.village || addr.state_district || '');
            setPincode(addr.postcode || '');
            setLocationLabel(
              [road, suburb].filter(Boolean).join(', ') || 'Location detected'
            );
          }
        } catch {
          setLocationError('Could not fetch address. Please enter manually.');
        } finally {
          setLocating(false);
        }
      },
      (err) => {
        setLocating(false);
        switch (err.code) {
          case err.PERMISSION_DENIED:
            setLocationError('Location permission denied. Please enable it in your browser settings.');
            break;
          case err.POSITION_UNAVAILABLE:
            setLocationError('Location unavailable. Please enter address manually.');
            break;
          case err.TIMEOUT:
            setLocationError('Location request timed out. Try again.');
            break;
          default:
            setLocationError('Could not get your location.');
        }
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, []);

  /* ── Save handler ── */
  const handleSave = async () => {
    const finalLabel = label === 'Other' ? customLabel.trim() || 'Other' : label;
    setSaving(true);
    try {
      await onSave({
        ...(initialData?.id ? { id: initialData.id } : {}),
        label: finalLabel,
        line1: line1.trim(),
        line2: line2.trim(),
        city: city.trim(),
        pincode: pincode.trim(),
        lat,
        lng,
        isDefault: initialData?.isDefault,
      });
      onClose();
    } catch {
      // Parent handles toast
    } finally {
      setSaving(false);
    }
  };

  const canSave = line1.trim() && city.trim() && pincode.trim().length >= 5;

  /* ── Drag to dismiss ── */
  const handleDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.y > 100 || info.velocity.y > 500) {
      onClose();
    }
  };

  /* ── Map tile URL ── */
  const mapTileUrl = lat && lng
    ? `https://www.openstreetmap.org/export/embed.html?bbox=${lng - 0.005},${lat - 0.003},${lng + 0.005},${lat + 0.003}&layer=mapnik&marker=${lat},${lng}`
    : null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[80]">
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Bottom sheet */}
          <motion.div
            className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl max-h-[92vh] flex flex-col"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            drag="y"
            dragConstraints={{ top: 0 }}
            dragElastic={0.2}
            onDragEnd={handleDragEnd}
          >
            {/* Drag handle */}
            <div className="flex justify-center pt-3 pb-1 cursor-grab active:cursor-grabbing">
              <div className="w-10 h-1 rounded-full bg-gray-300" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-5 pb-3 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900">
                {isEditing ? 'Edit Address' : 'Add New Address'}
              </h2>
              <button
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 transition-colors"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M1 1L13 13M13 1L1 13" />
                </svg>
              </button>
            </div>

            {/* Scrollable body */}
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">

              {/* ── Map / Location section ── */}
              <div className="rounded-md lg:rounded-xl lg:rounded-2xl border border-gray-100 overflow-hidden">
                {mapTileUrl ? (
                  <div className="relative">
                    <iframe
                      src={mapTileUrl}
                      className="w-full h-40 border-0"
                      title="Address location"
                      loading="lazy"
                    />
                    {/* Pin overlay for better visibility */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <svg className="w-8 h-8 drop-shadow-lg" viewBox="0 0 24 24" fill={accent} stroke="white" strokeWidth={1}>
                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                      </svg>
                    </div>
                    {locationLabel && (
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent px-3 py-2">
                        <p className="text-xs text-white font-medium truncate">{locationLabel}</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="h-40 bg-gray-50 flex flex-col items-center justify-center gap-2">
                    <svg className="w-10 h-10 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                    </svg>
                    <p className="text-xs text-gray-400">Use your location or enter manually</p>
                  </div>
                )}

                {/* Use current location button */}
                <button
                  onClick={handleUseCurrentLocation}
                  disabled={locating}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold transition-colors border-t border-gray-100 disabled:opacity-50"
                  style={{ color: accent }}
                >
                  {locating ? (
                    <Spinner size="xs" />
                  ) : (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 12m-3 0a3 3 0 106 0 3 3 0 10-6 0" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 2v2m0 16v2M2 12h2m16 0h2" />
                    </svg>
                  )}
                  {locating ? 'Detecting location...' : 'Use current location'}
                </button>

                {locationError && (
                  <p className="px-4 pb-3 text-xs text-red-500">{locationError}</p>
                )}
              </div>

              {/* ── Address type chips ── */}
              <div>
                <p className="text-xs font-semibold text-gray-500 mb-2">Save as</p>
                <div className="grid grid-cols-3 gap-2">
                  {LABEL_OPTIONS.map(({ key, icon }) => (
                    <button
                      key={key}
                      onClick={() => setLabel(key)}
                      className="flex items-center justify-center gap-1.5 py-2.5 rounded-md lg:rounded-xl text-xs font-semibold border-2 transition-all active:scale-[0.95]"
                      style={{
                        borderColor: label === key ? accent : '#E5E7EB',
                        backgroundColor: label === key ? accentBg : 'white',
                        color: label === key ? accent : '#6B7280',
                      }}
                    >
                      {icon}
                      {key}
                    </button>
                  ))}
                </div>
                {label === 'Other' && (
                  <Input
                    placeholder="Label name (e.g. Gym, College)"
                    value={customLabel}
                    onChange={(e) => setCustomLabel(e.target.value)}
                    className="mt-2"
                  />
                )}
              </div>

              {/* ── Address fields ── */}
              <div className="space-y-3">
                <Input
                  placeholder="Flat / House No. / Building *"
                  value={line1}
                  onChange={(e) => setLine1(e.target.value)}
                />
                <Input
                  placeholder="Area / Street / Landmark"
                  value={line2}
                  onChange={(e) => setLine2(e.target.value)}
                />
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    placeholder="City *"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                  />
                  <Input
                    placeholder="Pincode *"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    inputMode="numeric"
                    maxLength={6}
                  />
                </div>
              </div>
            </div>

            {/* Footer — sticky save button */}
            <div className="px-5 py-4 border-t border-gray-100 bg-white">
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={onClose}
                  disabled={saving}
                  className="py-3 rounded-md lg:rounded-xl text-sm font-semibold border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors active:scale-[0.97] disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving || !canSave}
                  className="flex items-center justify-center gap-2 py-3 rounded-md lg:rounded-xl text-sm font-bold text-white disabled:opacity-50 transition-all active:scale-[0.97]"
                  style={{ backgroundColor: accent }}
                >
                  {saving && <Spinner />}
                  {saving ? 'Saving...' : isEditing ? 'Update Address' : 'Save Address'}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
