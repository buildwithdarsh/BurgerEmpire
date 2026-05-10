'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { classicPatternUri, healthyPatternUri } from '@/components/FloatingBackground';
import { FireIcon, SaladIcon } from '@/components/icons';

export default function SelfCheckinLanding() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [mode, setMode] = useState<'classic' | 'healthy'>('classic');

  useEffect(() => {
    sessionStorage.removeItem('kiosk_name');
    sessionStorage.removeItem('kiosk_mode');
  }, []);

  const handleStart = () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    sessionStorage.setItem('kiosk_name', trimmed);
    sessionStorage.setItem('kiosk_mode', mode);
    router.push('/self-checkin/menu');
  };

  const isHealthy = mode === 'healthy';
  const pageBg = isHealthy ? '#F2F7F2' : '#FAF8F4';
  const accent = isHealthy ? '#4AA056' : '#EB7A29';

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-8 select-none transition-colors duration-500 relative"
      style={{
        backgroundColor: pageBg,
        backgroundImage: isHealthy ? healthyPatternUri : classicPatternUri,
        backgroundRepeat: 'repeat',
        backgroundSize: '200px 200px',
      }}
    >
      {/* Branding */}
      <div className="flex flex-col items-center mb-12">
        <div className="w-24 h-24 flex items-center justify-center">
          <Image src={'/brand/full-logo.png'} alt="Burger Empire" width={96} height={96} priority />
        </div>
        <h1 className="text-5xl font-black mt-4 tracking-tight" style={{ color: accent }}>
          BURGER BUDDY
        </h1>
        <p className="text-base mt-2 tracking-widest uppercase font-semibold" style={{ color: '#1A1A1A', opacity: 0.45 }}>
          Self Check-in Kiosk
        </p>
      </div>

      {/* Name input */}
      <div className="w-full max-w-lg">
        <label className="block text-lg font-bold mb-3" style={{ color: '#1A1A1A' }}>
          What&apos;s your name?
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleStart()}
          placeholder="Enter your name"
          className="w-full rounded-2xl px-6 py-5 text-2xl outline-none transition-all placeholder-gray-300 font-medium"
          style={{
            backgroundColor: '#FFFFFF',
            border: `2px solid ${name.trim() ? accent : '#E5E7EB'}`,
            color: '#1A1A1A',
          }}
          autoFocus
        />
      </div>

      {/* Mode toggle */}
      <div className="w-full max-w-lg mt-8">
        <label className="block text-lg font-bold mb-3" style={{ color: '#1A1A1A' }}>
          Choose your vibe
        </label>
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => setMode('classic')}
            className="py-5 rounded-2xl text-xl font-bold transition-all border-2"
            style={
              mode === 'classic'
                ? { backgroundColor: '#EB7A29', borderColor: '#EB7A29', color: '#FFFFFF' }
                : { backgroundColor: '#FFFFFF', borderColor: '#E5E7EB', color: '#6B7280' }
            }
          >
            <FireIcon size={20} color={mode === 'classic' ? '#FFFFFF' : '#6B7280'} className="inline mb-0.5 mr-1" /> Classic
            <span className="block text-sm font-normal mt-1 opacity-70">Bold &amp; indulgent</span>
          </button>
          <button
            onClick={() => setMode('healthy')}
            className="py-5 rounded-2xl text-xl font-bold transition-all border-2"
            style={
              mode === 'healthy'
                ? { backgroundColor: '#4AA056', borderColor: '#4AA056', color: '#FFFFFF' }
                : { backgroundColor: '#FFFFFF', borderColor: '#E5E7EB', color: '#6B7280' }
            }
          >
            <SaladIcon size={20} color={mode === 'healthy' ? '#FFFFFF' : '#6B7280'} className="inline mb-0.5 mr-1" /> Healthy
            <span className="block text-sm font-normal mt-1 opacity-70">Guilt-free upgrades</span>
          </button>
        </div>
      </div>

      {/* CTA */}
      <button
        onClick={handleStart}
        disabled={!name.trim()}
        className="mt-10 w-full max-w-lg py-6 rounded-2xl text-2xl font-black tracking-wide transition-all text-white shadow-xl disabled:opacity-30 disabled:cursor-not-allowed"
        style={{ backgroundColor: accent, boxShadow: `0 8px 32px ${accent}40` }}
      >
        Start Ordering →
      </button>

      <p className="mt-8 text-sm font-medium" style={{ color: '#1A1A1A', opacity: 0.35 }}>
        Dine-in only · Pay at counter
      </p>
    </div>
  );
}
