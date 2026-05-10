'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useMode } from '@/hooks/useMode';
import { TZ } from '@/lib/tz';
import type { StoreLocation } from '@buildwithdarsh/sdk';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { ClockIcon } from '@/components/icons';
import WaveDivider from '@/components/WaveDivider';
import Skeleton from '@/components/Skeleton';

interface LeafletWindow extends Window {
  L?: any;
}

export default function FindUsPage() {
  const router = useRouter();
  const { isClassic } = useMode();
  const [locations, setLocations] = useState<StoreLocation[]>([]);
  const [isLoadingLocations, setIsLoadingLocations] = useState(true);
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const { ref, isVisible } = useScrollAnimation();
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersInitialized = useRef(false);

  const filtered = locations;

  const heroEdge = isClassic ? '#D46E1F' : '#3D8A48';
  const light = isClassic ? '#FFF9F0' : '#F5FBF7';
  const accent = isClassic ? '#9A1E29' : '#4AA056';

  // Fetch locations from Central Backend
  useEffect(() => {
    async function loadLocations() {
      try {
        const locs = await TZ.storefront.locations.list();
        setLocations(locs);
      } catch (err) {
        console.error('Failed to load locations:', err);
      } finally {
        setIsLoadingLocations(false);
      }
    }
    loadLocations();
  }, []);

  // Initialize Leaflet map
  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    document.head.appendChild(link);

    const script = document.createElement('script');
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    script.onload = () => {
      const L = (window as LeafletWindow).L;
      if (!L || !mapRef.current) return;

      const map = L.map(mapRef.current).setView([26.2183, 78.1828], 12);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" rel="noopener noreferrer">OpenStreetMap</a>',
        maxZoom: 19,
      }).addTo(map);

      mapInstanceRef.current = map;
    };
    document.body.appendChild(script);

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Add markers when locations are loaded and map is ready
  useEffect(() => {
    if (!mapInstanceRef.current || locations.length === 0 || markersInitialized.current) return;

    const L = (window as LeafletWindow).L;
    if (!L) return;

    const validLocs = locations.filter((loc) => loc.lat !== null && loc.lng !== null);

    validLocs.forEach((loc) => {
      const marker = L.marker([loc.lat, loc.lng]).addTo(mapInstanceRef.current);
      marker.bindPopup(`
        <div style="font-family:system-ui;min-width:180px">
          <strong style="font-size:13px">${loc.name}</strong>
          ${loc.address ? `<p style="font-size:11px;color:#666;margin:4px 0">${loc.address}</p>` : ''}
          ${loc.city ? `<p style="font-size:10px;color:#999">${loc.city}</p>` : ''}
        </div>
      `);
      marker.on('click', () => setSelectedLocation(loc.id));
    });

    // Fit bounds to show all markers
    if (validLocs.length > 0) {
      const bounds = L.latLngBounds(validLocs.map((l: StoreLocation) => [l.lat, l.lng]));
      mapInstanceRef.current.fitBounds(bounds, { padding: [30, 30] });
    }

    markersInitialized.current = true;
  }, [locations]);

  useEffect(() => {
    if (!selectedLocation || !mapInstanceRef.current) return;
    const loc = locations.find((l) => l.id === selectedLocation);
    if (!loc || loc.lat === null || loc.lng === null) return;
    mapInstanceRef.current.setView([loc.lat, loc.lng], 15, { animate: true });
  }, [selectedLocation, locations]);

  const handleGetDirections = (lat: number, lng: number) => {
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`, '_blank');
  };

  return (
    <div className="min-h-screen has-pattern" style={{ backgroundColor: light }}>
      {/* Header */}
      <section
        className="py-12 px-5"
        style={{
          background: isClassic
            ? 'linear-gradient(135deg, #EB7A29, #D46E1F)'
            : 'linear-gradient(135deg, #4AA056, #3D8A48)',
        }}
      >
        <div className="max-w-[1200px] mx-auto">
          <h1
            className="text-3xl md:text-4xl font-black text-white mb-2"
            style={{ fontFamily: "var(--font-hero)" }}
          >
            Find Burger Empire — 6 Outlets in Abc City
          </h1>
          <p className="text-sm text-white/70">
            {isClassic ? '15+ locations across India. Your next craving is just minutes away.' : 'Find a Healthy Mode spot near you and eat clean today.'}
          </p>
        </div>
      </section>

      <WaveDivider variant="curve" topColor={heroEdge} bottomColor={light} />

      {/* Map + List */}
      <section ref={ref} className="max-w-[1200px] mx-auto px-5 py-8 flex flex-col lg:flex-row gap-6">
        {/* Map */}
        <div className="flex-1 min-h-[400px] lg:min-h-[600px] rounded-xl lg:rounded-2xl overflow-hidden bg-white border border-gray-100">
          <div ref={mapRef} className="w-full h-full min-h-[400px] lg:min-h-[600px]" />
        </div>

        {/* Store list */}
        <div className="w-full lg:w-[380px] flex flex-col gap-3">
          <h2 className="text-lg font-bold text-gray-900">Our Outlets</h2>

          {isLoadingLocations ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-white rounded-md lg:rounded-xl border border-gray-100 p-5">
                <Skeleton className="h-5 w-3/4 mb-2" />
                <Skeleton className="h-3 w-full mb-1" />
                <Skeleton className="h-3 w-1/2 mb-3" />
                <div className="flex gap-2">
                  <Skeleton className="h-9 flex-1 rounded-lg" />
                  <Skeleton className="h-9 flex-1 rounded-lg" />
                </div>
              </div>
            ))
          ) : filtered.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-gray-400 text-sm">No locations available right now.</p>
            </div>
          ) : (
            filtered.map((location, i) => (
              <div
                key={location.id}
                onClick={() => setSelectedLocation(location.id)}
                className="bg-white rounded-md lg:rounded-xl border p-5 cursor-pointer transition-all duration-200 hover:border-gray-300"
                style={{
                  borderColor: selectedLocation === location.id ? (isClassic ? '#EB7A29' : '#4AA056') : '#F3F4F6',
                  opacity: isVisible ? 1 : 0,
                  transform: isVisible ? 'translateY(0)' : 'translateY(15px)',
                  transitionDelay: `${i * 60}ms`,
                }}
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-[0.9375rem] font-bold text-gray-900">{location.name}</h3>
                  {location.isPrimary && (
                    <span className="text-[0.625rem] px-2 py-0.5 rounded bg-amber-50 text-amber-600 font-semibold flex-shrink-0">
                      Primary
                    </span>
                  )}
                </div>
                {location.address && (
                  <p className="text-xs text-gray-400 mb-1">{location.address}</p>
                )}
                {location.city && (
                  <p className="text-xs text-gray-300 mb-1">{location.city}{location.pincode ? ` - ${location.pincode}` : ''}</p>
                )}
                {location.phone && (
                  <p className="text-xs text-gray-300 mb-3 flex items-center gap-1">
                    <ClockIcon size={12} color="#D1D5DB" /> {location.phone}
                  </p>
                )}

                <div className="flex gap-2">
                  {location.lat !== null && location.lng !== null && (
                    <button
                      onClick={(e) => { e.stopPropagation(); handleGetDirections(location.lat!, location.lng!); }}
                      className="flex-1 py-2 rounded-lg text-[0.6875rem] font-bold border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
                    >
                      Get Directions
                    </button>
                  )}
                  <button
                    onClick={(e) => { e.stopPropagation(); router.push('/menu'); }}
                    className="flex-1 py-2 rounded-lg text-[0.6875rem] font-bold text-white transition-colors"
                    style={{ backgroundColor: accent }}
                  >
                    Order Now
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
