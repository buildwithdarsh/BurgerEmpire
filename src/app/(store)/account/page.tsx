'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useMode } from '@/hooks/useMode';
import { useAuthStore } from '@/store/auth';
import { TZ } from '@/lib/tz';
import ConfirmModal from '@/components/ui/ConfirmModal';
import SignInCard from '@/components/ui/SignInCard';
import AddressDrawer, { type AddressData } from '@/components/ui/AddressDrawer';
import Input from '@/components/ui/Input';
import { useToast } from '@/hooks/useToast';
import { getErrorMessage } from '@/lib/error-messages';
import Spinner from '@/components/ui/Spinner';
import Skeleton from '@/components/Skeleton';

interface Address {
  id: string;
  label: string | null;
  line1: string;
  line2: string | null;
  city: string;
  pincode: string;
  isDefault: boolean;
}

export default function AccountPage() {
  const router = useRouter();
  const { isClassic } = useMode();
  const { user, logout, setUser } = useAuthStore();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [addressesLoading, setAddressesLoading] = useState(true);

  // Profile edit
  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState('');

  // Phone verification
  const [phoneVerified, setPhoneVerified] = useState(true);
  const [originalPhone, setOriginalPhone] = useState('');
  const [verifyingPhone, setVerifyingPhone] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpMessage, setOtpMessage] = useState('');

  // Address drawer
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerAddress, setDrawerAddress] = useState<AddressData | null>(null);

  // Delete confirmation
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Section expansion
  const [showAddresses, setShowAddresses] = useState(false);

  const { toast } = useToast();

  const accent = isClassic ? '#9A1E29' : '#4AA056';
  const accentBg = isClassic ? '#FAF8F4' : '#F0FAF3';
  const light = isClassic ? '#FFF9F0' : '#F5FBF7';

  useEffect(() => {
    if (user && !user.isGuest) {
      loadAddresses();
      setEditName(user.name || '');
      setEditEmail(user.email || '');
      setEditPhone(user.phone || '');
      setOriginalPhone(user.phone || '');
      setPhoneVerified(user.isPhoneVerified ?? false);
    }
  }, [user]);

  const loadAddresses = async () => {
    setAddressesLoading(true);
    try {
      const data = await TZ.storefront.addresses.list();
      setAddresses(data);
    } catch {
      // ignore
    } finally {
      setAddressesLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const handleSaveProfile = async () => {
    setProfileError('');
    setProfileLoading(true);
    try {
      const data = await TZ.storefront.auth.updateProfile({
        name: editName.trim(),
        email: editEmail.trim() || undefined,
        phone: editPhone.trim() || undefined,
      });
      setUser({ ...data, isGuest: false } as any);
      setEditing(false);
      toast.success('Profile updated!');
    } catch (err) {
      const msg = getErrorMessage(err);
      setProfileError(msg);
      toast.error('Failed to update profile', { description: msg });
    } finally {
      setProfileLoading(false);
    }
  };

  const handleSendOTP = async () => {
    setOtpMessage('');
    setOtpLoading(true);
    try {
      await TZ.storefront.auth.sendOtp({ identifier: editPhone.trim(), type: 'phone_verify' });
      setOtpSent(true);
      setOtpMessage('OTP sent! Check your phone.');
    } catch (err) {
      setOtpMessage(err instanceof Error ? err.message : 'Failed to send OTP');
    } finally {
      setOtpLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    setOtpMessage('');
    setOtpLoading(true);
    try {
      await TZ.storefront.auth.verifyOtp({ identifier: editPhone.trim(), type: 'phone_verify', otp: otpCode });
      setOtpMessage('Phone verified!');
      setVerifyingPhone(false);
      setOtpSent(false);
      setOtpCode('');
    } catch (err) {
      setOtpMessage(err instanceof Error ? err.message : 'Verification failed');
    } finally {
      setOtpLoading(false);
    }
  };

  const openAddDrawer = () => {
    setDrawerAddress(null);
    setDrawerOpen(true);
  };

  const openEditDrawer = (addr: Address) => {
    setDrawerAddress({
      id: addr.id,
      label: addr.label || '',
      line1: addr.line1,
      line2: addr.line2 || '',
      city: addr.city,
      pincode: addr.pincode,
      isDefault: addr.isDefault,
    });
    setDrawerOpen(true);
  };

  const handleDrawerSave = async (data: AddressData) => {
    if (data.id) {
      await TZ.storefront.addresses.update(data.id, {
        label: data.label,
        line1: data.line1,
        line2: data.line2,
        city: data.city,
        pincode: data.pincode,
        lat: data.lat,
        lng: data.lng,
      } as any);
      toast.success('Address updated');
    } else {
      await TZ.storefront.addresses.create({
        ...data,
        isDefault: addresses.length === 0,
      } as any);
      toast.success('Address saved!');
    }
    await loadAddresses();
  };

  const handleDeleteAddress = async (addressId: string) => {
    setDeleteLoading(true);
    try {
      await TZ.storefront.addresses.remove(addressId);
      setDeleteConfirm(null);
      await loadAddresses();
      toast.success('Address deleted');
    } catch (err) {
      toast.error('Failed to delete address', { description: getErrorMessage(err) });
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleSetDefault = async (addressId: string) => {
    try {
      await TZ.storefront.addresses.update(addressId, { isDefault: true });
      await loadAddresses();
      toast.success('Default address updated');
    } catch (err) {
      toast.error('Failed to set default', { description: getErrorMessage(err) });
    }
  };

  // Avatar initials
  const initials = user?.name
    ? user.name.split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2)
    : '?';

  const isGuest = !user || user.isGuest;

  return (
    <div className="min-h-screen" style={{ backgroundColor: light }}>
      {/* ── Profile Header ── */}
      <div
        className="pt-6 pb-10 px-5"
        style={{
          background: isClassic
            ? 'linear-gradient(135deg, #9A1E29, #7A1722)'
            : 'linear-gradient(135deg, #4AA056, #3D8A48)',
        }}
      >
        <div className="max-w-[600px] mx-auto flex items-center gap-4">
          {/* Avatar */}
          <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0 border-2 border-white/30">
            <span className="text-xl font-bold text-white">{isGuest ? '?' : initials}</span>
          </div>
          <div className="flex-1 min-w-0">
            {isGuest ? (
              <>
                <h1 className="text-xl font-bold text-white">Hey there!</h1>
                <p className="text-sm text-white/60">Sign in for orders, rewards & more</p>
              </>
            ) : (
              <>
                <h1 className="text-xl font-bold text-white truncate">{user.name || 'Hey there!'}</h1>
                <p className="text-sm text-white/60 truncate">{user.phone || user.email || ''}</p>
              </>
            )}
          </div>
          {!isGuest && (
            <button
              onClick={() => setEditing(true)}
              className="w-9 h-9 rounded-full bg-white/15 backdrop-blur-sm flex items-center justify-center text-white/80 hover:bg-white/25 transition-colors flex-shrink-0"
              title="Edit profile"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </button>
          )}
        </div>
      </div>

      <div className="max-w-[600px] mx-auto px-5 -mt-5">
        {/* ── Guest: Sign In Card ── */}
        {isGuest && (
          <SignInCard
            title="Sign in to your account"
            description="View orders, manage addresses, and more"
            accentColor={accent}
            className="mb-4 rounded-xl lg:rounded-2xl"
          />
        )}

        {/* ── Profile Edit Card (overlay when editing) ── */}
        {!isGuest && editing && (
          <section className="bg-white rounded-md lg:rounded-xl lg:rounded-2xl p-5 mb-4 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-gray-900">Edit Profile</h3>
              <button
                onClick={() => { setEditing(false); setProfileError(''); setVerifyingPhone(false); }}
                className="w-7 h-7 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-400"
              >
                <svg width="12" height="12" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M1 1L13 13M13 1L1 13" />
                </svg>
              </button>
            </div>

            {profileError && (
              <div className="mb-4 p-3 bg-red-50 rounded-md lg:rounded-xl text-xs text-red-600 flex items-center gap-2">
                <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                </svg>
                {profileError}
              </div>
            )}

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Full Name</label>
                <Input value={editName} onChange={(e) => setEditName(e.target.value)} placeholder="Your name" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Email</label>
                <Input type="email" value={editEmail} onChange={(e) => setEditEmail(e.target.value)} placeholder="you@email.com" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Phone</label>
                <div className="flex gap-2 items-center">
                  <Input
                    type="tel"
                    value={editPhone}
                    onChange={(e) => { setEditPhone(e.target.value); setVerifyingPhone(false); }}
                    placeholder="+91 90000 00000"
                    className="flex-1"
                    disabled={phoneVerified && editPhone === originalPhone}
                  />
                  {phoneVerified && editPhone === originalPhone ? (
                    <span className="flex items-center gap-1 text-xs font-medium text-emerald-600 flex-shrink-0 px-2">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" /></svg>
                      Verified
                    </span>
                  ) : editPhone !== originalPhone && editPhone.length >= 10 ? (
                    <button
                      onClick={() => setVerifyingPhone(true)}
                      className="px-3 py-2 rounded-lg text-xs font-bold border transition-all active:scale-[0.95] flex-shrink-0"
                      style={{ borderColor: accent, color: accent }}
                    >
                      Verify
                    </button>
                  ) : null}
                </div>
              </div>

              {verifyingPhone && (
                <div className="p-3 rounded-md lg:rounded-xl bg-gray-50 border border-gray-100 space-y-2.5">
                  <p className="text-xs text-gray-500">Verify: <span className="font-semibold text-gray-700">{editPhone}</span></p>
                  {otpMessage && (
                    <p className="text-xs px-2.5 py-1.5 rounded-lg bg-blue-50 text-blue-600">{otpMessage}</p>
                  )}
                  {!otpSent ? (
                    <button
                      onClick={handleSendOTP}
                      disabled={otpLoading}
                      className="px-4 py-2 rounded-md lg:rounded-xl text-xs font-bold text-white disabled:opacity-50 inline-flex items-center gap-1.5 transition-all active:scale-[0.97]"
                      style={{ backgroundColor: accent }}
                    >
                      {otpLoading && <Spinner size="xs" />}
                      {otpLoading ? 'Sending...' : 'Send OTP'}
                    </button>
                  ) : (
                    <div className="flex gap-2">
                      <Input
                        value={otpCode}
                        onChange={(e) => setOtpCode(e.target.value)}
                        maxLength={6}
                        placeholder="------"
                        className="flex-1 text-center tracking-[0.25em] font-bold"
                        inputMode="numeric"
                      />
                      <button
                        onClick={handleVerifyOTP}
                        disabled={otpLoading || otpCode.length < 6}
                        className="px-4 py-2 rounded-md lg:rounded-xl text-xs font-bold text-white disabled:opacity-50 inline-flex items-center gap-1.5 transition-all active:scale-[0.97]"
                        style={{ backgroundColor: accent }}
                      >
                        {otpLoading && <Spinner size="xs" />}
                        {otpLoading ? 'Verifying...' : 'Verify'}
                      </button>
                    </div>
                  )}
                  <button
                    onClick={() => { setVerifyingPhone(false); setOtpSent(false); setOtpCode(''); setOtpMessage(''); }}
                    className="text-[0.6875rem] text-gray-400 hover:text-gray-600"
                  >
                    Cancel verification
                  </button>
                </div>
              )}
            </div>

            <div className="flex gap-3 mt-5">
              <button
                onClick={() => { setEditing(false); setProfileError(''); setVerifyingPhone(false); }}
                className="flex-1 py-2.5 rounded-md lg:rounded-xl text-sm font-semibold border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors active:scale-[0.97]"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveProfile}
                disabled={profileLoading}
                className="flex-1 py-2.5 rounded-md lg:rounded-xl text-sm font-bold text-white disabled:opacity-50 transition-all active:scale-[0.97] inline-flex items-center justify-center gap-2"
                style={{ backgroundColor: accent }}
              >
                {profileLoading && <Spinner />}
                {profileLoading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </section>
        )}

        {/* ── Profile Info Card (when not editing, logged in only) ── */}
        {!isGuest && !editing && (
          <section className="bg-white rounded-md lg:rounded-xl lg:rounded-2xl border border-gray-100 overflow-hidden mb-4">
            <ProfileRow icon={<UserIcon />} label="Name" value={user.name || '-'} />
            <ProfileRow icon={<PhoneIcon />} label="Phone" value={user.phone || '-'} />
            <ProfileRow icon={<EmailIcon />} label="Email" value={user.email || '-'} last />
          </section>
        )}

        {/* ── Navigation Menu (logged in) ── */}
        {!isGuest && (
          <section className="bg-white rounded-xl lg:rounded-2xl border border-gray-100 overflow-hidden mb-4">
            <NavItem
              icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" /></svg>}
              label="My Orders"
              sublabel="Track, reorder, or review past orders"
              href="/orders"
              accent={accent}
            />
            <NavItem
              icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M21 11.25v8.25a1.5 1.5 0 01-1.5 1.5H5.25a1.5 1.5 0 01-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 109.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1114.625 7.5H12m0 0V21m-8.625-9.75h18c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125h-18c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" /></svg>}
              label="Rewards & Coins"
              sublabel="Earn points on every order"
              href="/rewards"
              accent={accent}
            />
            <NavItem
              icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" /></svg>}
              label="Saved Addresses"
              sublabel={addressesLoading ? 'Loading...' : `${addresses.length} address${addresses.length !== 1 ? 'es' : ''} saved`}
              onClick={() => setShowAddresses(!showAddresses)}
              accent={accent}
              expanded={showAddresses}
              last
            />
          </section>
        )}

        {/* ── Addresses (expandable) ── */}
        {showAddresses && (
          <section className="bg-white rounded-md lg:rounded-xl lg:rounded-2xl border border-gray-100 p-4 mb-4 animate-[fadeIn_0.2s_ease-out]">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wide">Addresses</h3>
              <button
                onClick={openAddDrawer}
                className="text-xs font-bold px-3 py-1.5 rounded-lg transition-all active:scale-[0.95]"
                style={{ backgroundColor: accentBg, color: accent }}
              >
                + Add New
              </button>
            </div>

            {addressesLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 2 }).map((_, i) => (
                  <div key={i} className="p-3 rounded-md lg:rounded-xl border border-gray-100 space-y-2">
                    <Skeleton className="h-3 w-16" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-3 w-2/3" />
                  </div>
                ))}
              </div>
            ) : addresses.length === 0 ? (
              <div className="text-center py-5">
                <svg className="w-12 h-12 mx-auto mb-2 text-gray-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                </svg>
                <p className="text-sm text-gray-500 mb-1">No saved addresses</p>
                <p className="text-xs text-gray-400">Add one for faster checkout</p>
              </div>
            ) : (
              <div className="space-y-2">
                {addresses.map((addr) => (
                  <div
                    key={addr.id}
                    className="flex items-start gap-3 p-3 rounded-md lg:rounded-xl border border-gray-100 hover:border-gray-200 transition-colors group"
                  >
                    {/* Address type icon */}
                    <div
                      className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                      style={{ backgroundColor: accentBg }}
                    >
                      {addr.label?.toLowerCase() === 'home' ? (
                        <svg className="w-4 h-4" style={{ color: accent }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" /></svg>
                      ) : addr.label?.toLowerCase() === 'work' ? (
                        <svg className="w-4 h-4" style={{ color: accent }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>
                      ) : (
                        <svg className="w-4 h-4" style={{ color: accent }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" /></svg>
                      )}
                    </div>

                    {/* Address content */}
                    <button onClick={() => openEditDrawer(addr)} className="flex-1 text-left min-w-0">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <span className="text-xs font-bold text-gray-900 uppercase tracking-wide">
                          {addr.label || 'Address'}
                        </span>
                        {addr.isDefault && (
                          <span
                            className="text-[0.5625rem] font-bold px-1.5 py-0.5 rounded-md"
                            style={{ backgroundColor: accentBg, color: accent }}
                          >
                            DEFAULT
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-700 truncate">{addr.line1}</p>
                      {addr.line2 && <p className="text-xs text-gray-500 truncate">{addr.line2}</p>}
                      <p className="text-xs text-gray-400">{addr.city} — {addr.pincode}</p>
                    </button>

                    {/* Actions */}
                    <div className="flex items-center gap-0.5 opacity-60 group-hover:opacity-100 transition-opacity flex-shrink-0">
                      {!addr.isDefault && (
                        <button
                          onClick={() => handleSetDefault(addr.id)}
                          className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
                          title="Set as default"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>
                        </button>
                      )}
                      <button
                        onClick={() => setDeleteConfirm(addr.id)}
                        className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
                        title="Delete"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* ── Order & Eat ── */}
        <SectionLabel>Order & Eat</SectionLabel>
        <section className="bg-white rounded-xl lg:rounded-2xl border border-gray-100 overflow-hidden mb-4">
          <NavItem icon={<IconMenu />} label="Browse Menu" sublabel="Burgers, sides, drinks & more" href="/menu" accent={accent} />
          <NavItem icon={<IconCombo />} label="Combo Deals" sublabel="Save more with value combos" href="/combo-deals" accent={accent} />
          <NavItem icon={<IconLeaf />} label="Healthy Menu" sublabel="Clean eating, guilt-free" href="/healthy" accent={accent} />
          <NavItem icon={<IconReservation />} label="Book a Table" sublabel="Reserve a spot, skip the wait" href="/reservations" accent={accent} last />
        </section>

        {/* ── Save & Earn ── */}
        <SectionLabel>Save & Earn</SectionLabel>
        <section className="bg-white rounded-xl lg:rounded-2xl border border-gray-100 overflow-hidden mb-4">
          <NavItem icon={<IconCoin />} label="Rewards & Coins" sublabel="Earn on every order, redeem anytime" href="/rewards" accent={accent} />
          <NavItem icon={<IconStudent />} label="Student Pass" sublabel="Exclusive discounts for students" href="/student" accent={accent} />
          <NavItem icon={<IconGift />} label="Gift Cards" sublabel="Send the gift of good food" href="/gift-cards" accent={accent} />
          <NavItem icon={<IconCalendar />} label="Meal Plans" sublabel="Weekly & monthly subscriptions" href="/meal-plans" accent={accent} last />
        </section>

        {/* ── About ── */}
        <SectionLabel>About</SectionLabel>
        <section className="bg-white rounded-xl lg:rounded-2xl border border-gray-100 overflow-hidden mb-4">
          <NavItem icon={<IconBook />} label="Our Story" sublabel="How Burger Empire started" href="/our-story" accent={accent} />
          <NavItem icon={<IconPin />} label="Find Us" sublabel="Locations & directions" href="/find-us" accent={accent} />
          <NavItem icon={<IconHandshake />} label="Franchise" sublabel="Partner with us" href="/handshake" accent={accent} />
          <NavItem icon={<IconHelp />} label="Help & Support" sublabel="FAQs, tickets & contact" href="/support" accent={accent} last />
        </section>

        {/* ── Legal ── */}
        <section className="bg-white rounded-xl lg:rounded-2xl border border-gray-100 overflow-hidden mb-4">
          <NavItem icon={<IconPrivacy />} label="Privacy Policy" href="/privacy" accent={accent} />
          <NavItem icon={<IconTerms />} label="Terms & Conditions" href="/terms" accent={accent} last />
        </section>

        {/* ── Sign Out (logged in only) ── */}
        {!isGuest && (
          <section className="bg-white rounded-xl lg:rounded-2xl border border-gray-100 overflow-hidden mb-4">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3.5 px-5 py-4 text-left hover:bg-red-50/50 transition-colors active:bg-red-100/50"
            >
              <div className="w-10 h-10 rounded-md lg:rounded-xl flex items-center justify-center flex-shrink-0 bg-red-50 text-red-500">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
                </svg>
              </div>
              <p className="text-sm font-semibold text-red-500">Sign Out</p>
            </button>
          </section>
        )}

        {/* ── Copyright ── */}
        <p className="text-center text-xs text-gray-300 mb-4">
          &copy; {new Date().getFullYear()} Burger Empire
        </p>
      </div>

      {/* Modals & Drawers */}
      <AddressDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onSave={handleDrawerSave}
        initialData={drawerAddress}
        accent={accent}
        accentBg={accentBg}
      />

      <ConfirmModal
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        onConfirm={() => deleteConfirm && handleDeleteAddress(deleteConfirm)}
        title="Delete this address?"
        description="This action cannot be undone."
        confirmLabel="Delete"
        variant="danger"
        isLoading={deleteLoading}
      />
    </div>
  );
}

/* ── Sub-components ── */

function ProfileRow({ icon, label, value, last }: { icon: React.ReactNode; label: string; value: string; last?: boolean }) {
  return (
    <div className={`flex items-center gap-3 px-5 py-3.5 ${last ? '' : 'border-b border-gray-50'}`}>
      <div className="text-gray-400">{icon}</div>
      <div className="flex-1 min-w-0">
        <p className="text-[0.6875rem] text-gray-400 leading-none mb-0.5">{label}</p>
        <p className="text-sm font-medium text-gray-900 truncate">{value}</p>
      </div>
    </div>
  );
}

function NavItem({
  icon,
  label,
  sublabel,
  href,
  onClick,
  accent,
  expanded,
  last,
}: {
  icon: React.ReactNode;
  label: string;
  sublabel?: string;
  href?: string;
  onClick?: () => void;
  accent: string;
  expanded?: boolean;
  last?: boolean;
}) {
  const content = (
    <div className={`flex items-center gap-3.5 px-5 py-4 ${last ? '' : 'border-b border-gray-50'} hover:bg-gray-50/50 transition-colors active:bg-gray-100/50`}>
      <div
        className="w-10 h-10 rounded-md lg:rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ backgroundColor: `${accent}10`, color: accent }}
      >
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-gray-900">{label}</p>
        {sublabel && <p className="text-xs text-gray-400 mt-0.5">{sublabel}</p>}
      </div>
      {expanded !== undefined ? (
        <svg
          className="w-4 h-4 text-gray-300 transition-transform duration-200"
          style={{ transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)' }}
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      ) : (
        <svg className="w-4 h-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      )}
    </div>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }

  return <button className="w-full text-left" onClick={onClick}>{content}</button>;
}

function UserIcon() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
    </svg>
  );
}

function EmailIcon() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
    </svg>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <p className="text-[0.6875rem] font-bold text-gray-400 uppercase tracking-wider px-1 mb-1.5">{children}</p>;
}

/* ── Nav list icons ── */
const I = "w-5 h-5";
const S = 1.5;
function IconMenu() { return <svg className={I} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={S}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" /></svg>; }
function IconCombo() { return <svg className={I} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={S}><path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" /><path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" /></svg>; }
function IconLeaf() { return <svg className={I} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={S}><path strokeLinecap="round" strokeLinejoin="round" d="M12 21c-4-4-8-7.5-8-12a8 8 0 0116 0c0 4.5-4 8-8 12z" /></svg>; }
function IconCalendar() { return <svg className={I} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={S}><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" /></svg>; }
function IconGift() { return <svg className={I} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={S}><path strokeLinecap="round" strokeLinejoin="round" d="M21 11.25v8.25a1.5 1.5 0 01-1.5 1.5H5.25a1.5 1.5 0 01-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 109.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1114.625 7.5H12m0 0V21m-8.625-9.75h18c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125h-18c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" /></svg>; }
function IconReservation() { return <svg className={I} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={S}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>; }
function IconCoin() { return <svg className={I} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={S}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>; }
function IconStudent() { return <svg className={I} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={S}><path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" /></svg>; }
function IconBook() { return <svg className={I} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={S}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.331 0 4.512.89 6.042 2.36M12 6.042A8.967 8.967 0 0118 3.75c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18c-2.331 0-4.512.89-6.042 2.36M12 6.042V20.4" /></svg>; }
function IconPin() { return <svg className={I} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={S}><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" /></svg>; }
function IconHandshake() { return <svg className={I} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={S}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" /></svg>; }
function IconHelp() { return <svg className={I} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={S}><path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" /></svg>; }
function IconPrivacy() { return <svg className={I} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={S}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" /></svg>; }
function IconTerms() { return <svg className={I} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={S}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>; }
