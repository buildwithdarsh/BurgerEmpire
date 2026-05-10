'use client';

type ConfigGroup = Record<string, any>;

// PublicConfig is kept local because the SDK's StorefrontConfig uses unknown for some groups
// and the hardcoded defaults here need full typing for consumer components.
export interface PublicConfig {
  auth: ConfigGroup;
  branding: ConfigGroup;
  catalog: ConfigGroup;
  checkout: ConfigGroup;
  contact: ConfigGroup;
  delivery: ConfigGroup;
  features: ConfigGroup;
  loyalty: ConfigGroup;
  notifications: ConfigGroup;
  orders: ConfigGroup;
  tax: ConfigGroup;
  payments: ConfigGroup;
  seo: ConfigGroup;
  analytics: ConfigGroup;
  app: ConfigGroup;
  system: ConfigGroup;
  rewards: ConfigGroup;
  otp: ConfigGroup;
  pos: ConfigGroup;
  property: ConfigGroup;
  integrations: ConfigGroup;
  email: ConfigGroup;
  [key: string]: ConfigGroup;
}

const DEFAULT_CONFIG: PublicConfig = {
  auth: {
    primary_login_id: 'phone',
    require_phone_verification: true,
    require_email_verification: false,
    allow_guest_checkout: false,
    otp_length: 6,
    otp_expiry_minutes: 5,
    allow_social_login: false,
    google_login_enabled: false,
    facebook_login_enabled: false,
    password_min_length: 8,
    force_phone_for_orders: true,
  },
  branding: {
    name: 'Burger Empire',
    tagline: 'Burgers that love you back',
    logo_url: '/logo-icon.svg',
    favicon_url: '',
    og_image_url: '',
    primary_color: '#EB7A29',
    secondary_color: '#4AA056',
    accent_color: '#EB7A29',
    font_family: 'Inter',
    currency: 'INR',
    currency_symbol: '₹',
    timezone: 'Asia/Kolkata',
    country_code: 'IN',
    date_format: 'DD/MM/YYYY',
    dark_mode_enabled: false,
    powered_by_visible: true,
  },
  catalog: {
    variant_types: ['classic', 'healthy'],
    default_variant_type: 'classic',
    show_calories: true,
    show_nutrition: true,
    show_allergens: true,
    show_diet_badges: true,
    diet_filter_default: 'all',
    show_ratings: true,
    show_out_of_stock: true,
    items_per_page: 20,
    search_enabled: true,
  },
  checkout: {
    cod_enabled: true,
    online_pay_enabled: true,
    min_order_amount: 0,
    packing_charges: 10,
    tip_enabled: true,
    tip_presets: [10, 20, 50],
    instructions_enabled: true,
    scheduled_orders: true,
    promo_code_field: true,
    gift_wrap_enabled: true,
    gift_wrap_price: 25,
  },
  contact: {
    phone: '',
    email: 'hello@build.withdarsh.com',
    address: 'Abc Foods Pvt Ltd, B-99, Near Main Garden, Abc Nagar, Abc City, MP 100001',
    instagram: '',
    facebook: '',
    twitter: '',
  },
  delivery: {
    enabled: true,
    fee: 40,
    free_above: 499,
    prep_time_minutes: 20,
    pickup_enabled: true,
    dine_in_enabled: true,
    live_tracking_enabled: true,
    max_distance_km: 10,
    contactless_default: false,
    slot_based_delivery: true,
  },
  features: {
    coupons_enabled: true,
    promotions_enabled: true,
    referral_enabled: true,
    referral_points: 50,
    reviews_enabled: true,
    gift_cards_enabled: true,
    reservations_enabled: true,
    whatsapp_enabled: true,
    whatsapp_phone: 'hello@build.withdarsh.com',
    blog_enabled: true,
    help_center_enabled: true,
    feedback_enabled: true,
    self_checkin_enabled: true,
    subscription_enabled: true,
    table_qr_enabled: true,
    student_pass_enabled: true,
    meal_plans_enabled: true,
  },
  loyalty: {
    enabled: true,
    point_name: 'coins',
    point_name_plural: 'coins',
    point_value: 1,
    points_per_amount: 10,
    points_per_amount_threshold: 100,
    healthy_boost_multiplier: 2,
    redemption_min_points: 10,
    redemption_max_percent: 50,
    first_order_bonus: 25,
    welcome_bonus: 50,
    birthday_bonus: 100,
    review_bonus: 10,
    expiry_days: 365,
    tier_names: ['Bronze', 'Silver', 'Gold'],
    tier_silver_threshold: 500,
    tier_gold_threshold: 2000,
    tier_silver_multiplier: 1.5,
    tier_gold_multiplier: 2,
    show_tier_progress: true,
  },
  notifications: {},
  orders: {
    prefix: 'BBY',
    auto_confirm: false,
    auto_accept_minutes: 0,
    reorder_enabled: true,
    order_tracking_enabled: true,
    receipt_enabled: true,
    rating_enabled: true,
    rating_mandatory: false,
    token_display_enabled: true,
    order_types: ['delivery', 'pickup', 'dine_in'],
    cancel_allowed_minutes: 5,
    cancel_refund_enabled: true,
    cancel_refund_percent: 100,
    max_order_amount: 10000,
    max_items_per_order: 50,
  },
  tax: {
    rate: 5,
    label: 'GST',
    inclusive: true,
    service_charge_enabled: false,
    service_charge_percent: 0,
  },
  payments: {
    cod_max_amount: 5000,
    cod_min_amount: 0,
    online_discount: 5,
    partial_payment: true,
    partial_min_percent: 50,
    wallet_enabled: true,
    wallet_topup_enabled: true,
    upi_enabled: true,
    card_enabled: true,
    netbanking_enabled: true,
    emi_enabled: true,
    refund_auto: true,
    refund_enabled: true,
    refund_percentage: 100,
    refund_window_hours: 24,
    partial_refund_enabled: true,
    refund_to_wallet: true,
  },
  seo: {
    meta_title: '',
    meta_description: '',
    canonical_url: '',
    og_type: 'website',
    twitter_handle: '',
  },
  analytics: {
    google_analytics_id: '',
    facebook_pixel_id: '',
    gtm_id: '',
  },
  app: {
    pwa_enabled: true,
    app_store_url: 'https://apps.apple.com/in/app/burger-empire',
    play_store_url: 'https://play.google.com/store/apps/details?id=in.burgerempire',
  },
  system: {
    maintenance_mode: false,
    maintenance_message: '',
    coming_soon: false,
  },
  rewards: {
    free_fries: 50,
    free_shake: 100,
    free_burger: 200,
    free_delivery: 75,
    free_combo: 350,
    free_smoothie: 150,
  },
  otp: {},
  pos: {},
  property: {},
  integrations: {},
  email: {},
};

/** Hook to access system config. Demo mode: returns DEFAULT_CONFIG immediately (no API call). */
export function useConfig(): { config: PublicConfig; isLoading: boolean } {
  return { config: DEFAULT_CONFIG, isLoading: false };
}
