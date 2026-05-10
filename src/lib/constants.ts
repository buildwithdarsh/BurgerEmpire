// ─── Cache Configuration ─────────────────────────────────
export const MENU_CACHE_MAX_ENTRIES = 500;
export const MENU_CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

export const COUPON_CACHE_MAX_ENTRIES = 100;
export const COUPON_CACHE_TTL_MS = 2 * 60 * 1000; // 2 minutes

export const PROMOTIONS_CACHE_MAX_ENTRIES = 10;
export const PROMOTIONS_CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

export const CONFIG_CACHE_TTL_MS = 60_000; // 60 seconds

export const CART_RESPONSE_CACHE_MAX = 200;
export const CART_RESPONSE_CACHE_TTL_MS = 30_000; // 30 seconds
export const CART_ID_CACHE_MAX = 500;
export const CART_ID_CACHE_TTL_MS = 5 * 60_000; // 5 minutes

// ─── Rate Limiting ───────────────────────────────────────
export const RATE_LIMIT_WINDOW_MS = 60_000; // 1 minute
export const RATE_LIMIT_MAX_REQUESTS = 60;
export const SENSITIVE_RATE_LIMIT_MAX_REQUESTS = 10;
export const RATE_LIMIT_CLEANUP_INTERVAL_MS = 60_000;
export const RATE_LIMIT_RETRY_AFTER_SECONDS = '60';

// ─── OTP ─────────────────────────────────────────────────
export const OTP_MAX_ATTEMPTS = 3;
export const OTP_TTL_MS = 10 * 60_000; // 10 minutes
export const OTP_COOLDOWN_MS = 60_000; // 1 minute between sends
export const OTP_CLEANUP_INTERVAL_MS = 60_000;
export const OTP_CODE_MIN = 100000;
export const OTP_CODE_MAX = 999999;

// ─── Order Types (PetPooja numeric enums) ────────────────
export const ORDER_TYPE_DELIVERY = 1;
export const ORDER_TYPE_PICKUP = 2;
export const ORDER_TYPE_DINE_IN = 3;

// ─── Tax Types ───────────────────────────────────────────
export const TAX_TYPE_PERCENTAGE = 1;

// ─── Payment Types ───────────────────────────────────────
export const PAYMENT_TYPE_ONLINE = '1';
export const PAYMENT_TYPE_COD = '2';

// ─── Currency & Math ─────────────────────────────────────
export const PERCENTAGE_DIVISOR = 100;
export const CURRENCY_PRECISION = 100; // multiply then divide for 2 decimal rounding

// ─── Validation Limits ───────────────────────────────────
export const NAME_MIN_LENGTH = 2;
export const NAME_MAX_LENGTH = 100;
export const PHONE_MIN_LENGTH = 10;
export const PHONE_MAX_LENGTH = 15;
export const PASSWORD_MIN_LENGTH = 8;
export const PASSWORD_MAX_LENGTH = 100;
export const REFERRAL_CODE_INPUT_MAX_LENGTH = 20;
export const MAX_ITEM_QUANTITY = 50;
export const ADDRESS_LINE_MAX_LENGTH = 500;
export const CITY_MAX_LENGTH = 100;
export const PINCODE_MIN_LENGTH = 5;
export const PINCODE_MAX_LENGTH = 10;
export const SPECIAL_INSTRUCTIONS_MAX_LENGTH = 500;
export const COUPON_CODE_MAX_LENGTH = 50;

// ─── Referral Code Generation ────────────────────────────
export const REFERRAL_CODE_LENGTH = 8;
export const REFERRAL_CODE_MAX_ATTEMPTS = 10;
export const REFERRAL_CODE_FALLBACK_RADIX = 36;

// ─── Reward Redemption ───────────────────────────────────
export const REDEEM_CODE_LENGTH = 6;
export const REDEEM_CODE_MAX_ATTEMPTS = 5;
export const REDEMPTIONS_DEFAULT_LIMIT = 20;
export const TRANSACTIONS_DEFAULT_LIMIT = 20;

// ─── Dashboard ───────────────────────────────────────────
export const DASHBOARD_RECENT_ORDERS_LIMIT = 5;

// ─── PetPooja ────────────────────────────────────────────
export const PETPOOJA_ACTIVE_STATUS = '1';
export const PETPOOJA_SUCCESS_CODE = '1';
export const PETPOOJA_DEFAULT_MIN_PREP_TIME = '20';

// ─── Menu Sync Defaults ─────────────────────────────────
export const DEFAULT_TAX_FALLBACK = 1;
export const DEFAULT_MIN_ADDON_SELECTION = 0;
export const DEFAULT_MAX_ADDON_SELECTION = 10;

// ─── Happy Hour Defaults ─────────────────────────────────
export const DEFAULT_HAPPY_HOUR_START = 0;
export const DEFAULT_HAPPY_HOUR_END = 24;
export const HOURS_IN_HALF_DAY = 12;

// ─── WhatsApp Ordering ───────────────────────────────────
export const WA_MENU_PAGE_SIZE = 8;          // items shown per list message
export const WA_SESSION_IDLE_TIMEOUT_MS = 30 * 60 * 1000; // 30 min
export const WA_MAX_CART_ITEMS = 10;
export const WA_PHONE_COUNTRY_CODE = '91';   // India
export const WA_API_VERSION = 'v18.0';
export const WA_GRAPH_BASE = 'https://graph.facebook.com';
