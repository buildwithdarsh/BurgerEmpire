/**
 * Formatting utilities that honour org-level branding config
 * (currency, timezone, country_code, date_format).
 */

/** Format a number as currency using the org's configured currency code. */
export function formatCurrency(
  amount: number,
  currency = 'INR',
  locale = 'en-IN',
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/** Map a date_format config string to Intl.DateTimeFormat options. */
function dateFormatOptions(dateFormat?: string): Intl.DateTimeFormatOptions {
  switch (dateFormat) {
    case 'MM/DD/YYYY':
      return { month: '2-digit', day: '2-digit', year: 'numeric' };
    case 'YYYY-MM-DD':
      return { year: 'numeric', month: '2-digit', day: '2-digit' };
    case 'DD-MM-YYYY':
      return { day: '2-digit', month: '2-digit', year: 'numeric' };
    case 'DD/MM/YYYY':
    default:
      return { day: '2-digit', month: '2-digit', year: 'numeric' };
  }
}

/** Format a date string or Date using the org's timezone and date format. */
export function formatDateTime(
  date: string | Date,
  timezone = 'Asia/Kolkata',
  opts?: Intl.DateTimeFormatOptions,
  dateFormat?: string,
): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const mergedOpts = opts ?? dateFormatOptions(dateFormat);
  return d.toLocaleString('en-IN', { timeZone: timezone, ...mergedOpts });
}

/** Format a date string as time-only using the org's timezone. */
export function formatTime(
  date: string | Date,
  timezone = 'Asia/Kolkata',
): string {
  return formatDateTime(date, timezone, { hour: '2-digit', minute: '2-digit' });
}

/** Format a date string as short date+time using the org's timezone and date format. */
export function formatShortDateTime(
  date: string | Date,
  timezone = 'Asia/Kolkata',
  dateFormat?: string,
): string {
  return formatDateTime(date, timezone, {
    ...dateFormatOptions(dateFormat),
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Map a country_code like "IN" to a phone dial prefix like "+91".
 * Covers common codes; defaults to "+91" for unknown.
 */
const DIAL_CODES: Record<string, string> = {
  IN: '+91',
  US: '+1',
  GB: '+44',
  AE: '+971',
  SG: '+65',
  AU: '+61',
  CA: '+1',
  DE: '+49',
  FR: '+33',
  JP: '+81',
};

export function dialCodeForCountry(countryCode: string): string {
  return DIAL_CODES[countryCode?.toUpperCase()] || '+91';
}
