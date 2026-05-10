// Server-side config fetcher — fetches from Central Backend OrgSettings.

import { TZ } from '@/lib/tz';
import type { StorefrontConfig } from '@buildwithdarsh/sdk';

let _cache: StorefrontConfig | null = null;
let _cacheTime = 0;
const CACHE_TTL = 60_000; // 1 minute

export async function getConfig(): Promise<StorefrontConfig> {
  const now = Date.now();
  if (_cache && now - _cacheTime < CACHE_TTL) return _cache;

  try {
    const config = await TZ.storefront.config.get();
    _cache = config;
    _cacheTime = now;
    return _cache;
  } catch {
    // fallback
  }
  return _cache ?? {} as StorefrontConfig;
}
