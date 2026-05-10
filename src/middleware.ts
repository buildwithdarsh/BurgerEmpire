import { NextResponse, type NextRequest } from 'next/server';
import {
  RATE_LIMIT_WINDOW_MS,
  RATE_LIMIT_MAX_REQUESTS,
  SENSITIVE_RATE_LIMIT_MAX_REQUESTS,
  RATE_LIMIT_CLEANUP_INTERVAL_MS,
  RATE_LIMIT_RETRY_AFTER_SECONDS,
} from '@/lib/constants';

// ─── Rate limiting (bounded to prevent OOM) ─────────────
const MAX_RATE_LIMIT_ENTRIES = 10_000;
const rateLimit = new Map<string, { count: number; resetAt: number }>();
const SENSITIVE_ROUTES = [
  '/api/auth/login',
  '/api/auth/register',
  '/api/auth/send-otp',
  '/api/auth/verify-otp',
  '/api/auth/request-reset',
  '/api/auth/reset-password',
  '/api/payments/',
];

function getRateLimitKey(ip: string, pathname: string): { key: string; max: number } {
  const isSensitive = SENSITIVE_ROUTES.some((route) => pathname.startsWith(route));
  if (isSensitive) {
    return { key: `sensitive:${ip}:${pathname}`, max: SENSITIVE_RATE_LIMIT_MAX_REQUESTS };
  }
  return { key: ip, max: RATE_LIMIT_MAX_REQUESTS };
}

function checkRateLimit(key: string, max: number): boolean {
  const now = Date.now();
  const entry = rateLimit.get(key);

  if (!entry || now > entry.resetAt) {
    // Evict expired entries if map is at capacity
    if (rateLimit.size >= MAX_RATE_LIMIT_ENTRIES) {
      for (const [k, v] of rateLimit) {
        if (now > v.resetAt) rateLimit.delete(k);
        if (rateLimit.size < MAX_RATE_LIMIT_ENTRIES) break;
      }
    }
    rateLimit.set(key, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return true;
  }

  if (entry.count >= max) {
    return false;
  }

  entry.count++;
  return true;
}

// Cleanup old entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of rateLimit) {
    if (now > entry.resetAt) rateLimit.delete(key);
  }
}, RATE_LIMIT_CLEANUP_INTERVAL_MS);

// ─── Security headers ──────────────────────────────
function addSecurityHeaders(response: NextResponse): NextResponse {
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'SAMEORIGIN');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=(self)');

  // HSTS — only in production (when served over HTTPS)
  if (process.env.NODE_ENV === 'production') {
    response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  }

  return response;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Apply security headers to all responses
  if (!pathname.startsWith('/api/')) {
    const url = request.nextUrl;

    // Preview mode — persist token to cookie and redirect to clean URL
    const previewToken = url.searchParams.get('preview');
    if (previewToken) {
      const cleanUrl = request.nextUrl.clone();
      cleanUrl.searchParams.delete('preview');
      const response = NextResponse.redirect(cleanUrl);
      response.cookies.set('bb-preview', previewToken, {
        maxAge: 60 * 60 * 24 * 7,
        path: '/',
        httpOnly: true,
        sameSite: 'lax',
      });
      return addSecurityHeaders(response);
    }

    const response = NextResponse.next();

    // UTM tracking — persist UTM params to cookie for affiliate attribution
    const utmSource = url.searchParams.get('utm_source');
    if (utmSource) {
      const utmData = JSON.stringify({
        utm_source: utmSource,
        utm_medium: url.searchParams.get('utm_medium') || '',
        utm_campaign: url.searchParams.get('utm_campaign') || '',
        utm_content: url.searchParams.get('utm_content') || '',
        referrer: request.headers.get('referer') || '',
        ts: Date.now(),
      });
      response.cookies.set('bb-utm', utmData, { maxAge: 60 * 60 * 24 * 30, path: '/' });
    }

    return addSecurityHeaders(response);
  }

  // ─── API routes ────────────────────────────────────
  // Rate limiting — use x-real-ip (set by reverse proxy/Vercel), fall back to x-forwarded-for
  const ip = request.headers.get('x-real-ip')
    || request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    || 'unknown';

  const { key, max } = getRateLimitKey(ip, pathname);
  if (!checkRateLimit(key, max)) {
    const res = NextResponse.json(
      { success: false, message: 'Too many requests', code: 'RATE_LIMIT' },
      { status: 429 }
    );
    res.headers.set('Retry-After', RATE_LIMIT_RETRY_AFTER_SECONDS);
    return addSecurityHeaders(res);
  }

  // Public routes - no auth needed
  const publicRoutes = [
    '/api/auth/guest',
    '/api/auth/login',
    '/api/auth/register',
    '/api/auth/refresh',
    '/api/auth/request-reset',
    '/api/auth/reset-password',
    '/api/menu',
    '/api/config',
    '/api/promotions',
    '/api/cart',
    '/api/webhooks/',
    '/api/cron/',
    '/api/self-checkin/',
    '/api/dev/',
    '/api/gift-cards/balance',
    '/api/reservations/availability',
    '/api/locations',
    '/api/meal-plans',
    '/api/help/',
    '/api/slots/',
    '/api/referral/validate',
    '/api/student/status',
    '/api/student/discount-preview',
    '/api/preview/',
  ];

  const isPublic = publicRoutes.some((route) => pathname.startsWith(route));
  if (isPublic) {
    return addSecurityHeaders(NextResponse.next());
  }

  // Protected routes - require auth header
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return addSecurityHeaders(
      NextResponse.json(
        { success: false, message: 'Unauthorized', code: 'AUTH_ERROR' },
        { status: 401 }
      )
    );
  }

  return addSecurityHeaders(NextResponse.next());
}

export const config = {
  matcher: [
    // Skip static assets, images, icons, and manifests — they don't need middleware
    '/((?!_next/static|_next/image|favicon.ico|images/|icon|apple-icon|manifest).*)',
  ],
};
