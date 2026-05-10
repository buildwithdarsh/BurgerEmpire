/**
 * Runtime validation for critical environment variables.
 * Import this in the app's root layout or API entry point to fail fast.
 */

const REQUIRED_VARS = [
  'JWT_SECRET',
  'JWT_REFRESH_SECRET',
] as const;

const INSECURE_DEFAULTS = [
  'change-this-to-a-random-secret-in-production',
  'change-this-to-another-random-secret-in-production',
  'secret',
  'password',
  'jwt-secret',
];

let _validated = false;

export function validateEnv() {
  // Only validate once
  if (_validated) return;
  _validated = true;

  // Skip during build phase (next build sets NODE_ENV=production but NEXT_PHASE indicates build)
  if (process.env.NEXT_PHASE === 'phase-production-build') return;

  // Skip when in coming-soon mode — DB and auth aren't needed
  if (process.env.NEXT_PUBLIC_COMING_SOON !== 'false') return;

  const errors: string[] = [];

  for (const key of REQUIRED_VARS) {
    const value = process.env[key];
    if (!value) {
      errors.push(`Missing required env var: ${key}`);
      continue;
    }

    if (process.env.NODE_ENV === 'production') {
      if (INSECURE_DEFAULTS.some((d) => value.toLowerCase().includes(d))) {
        errors.push(`${key} is using an insecure default value. Change it for production!`);
      }
      if ((key === 'JWT_SECRET' || key === 'JWT_REFRESH_SECRET') && value.length < 32) {
        errors.push(`${key} should be at least 32 characters in production`);
      }
    }
  }

  if (errors.length > 0) {
    const msg = `Environment validation failed:\n${errors.map((e) => `  - ${e}`).join('\n')}`;
    if (process.env.NODE_ENV === 'production') {
      throw new Error(msg);
    } else {
      console.warn(`[ENV WARNING] ${msg}`);
    }
  }
}
