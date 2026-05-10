'use client';

import Link from 'next/link';
import { useMode } from '@/hooks/useMode';
import { useConfig } from '@/hooks/useConfig';
import Logo from './Logo';
import { MailIcon } from './icons';

interface FooterLinkItem {
  href: string;
  label: string;
  flag?: 'giftCards' | 'studentPass' | 'reservations' | 'blog' | 'feedback' | 'helpCenter' | 'selfCheckin' | 'subscription' | 'tableQr' | 'mealPlans';
}

const orderLinks: FooterLinkItem[] = [
  { href: '/menu', label: 'Menu' },
  { href: '/order-online', label: 'Order Online' },
  { href: '/combo-deals', label: 'Combo Deals' },
  { href: '/healthy', label: 'Healthy Menu' },
  { href: '/gift-cards', label: 'Gift Cards', flag: 'giftCards' },
  { href: '/meal-plans', label: 'Meal Plans', flag: 'mealPlans' },
  { href: '/subscriptions', label: 'Subscriptions', flag: 'subscription' },
];

const rewardsLinks: FooterLinkItem[] = [
  { href: '/rewards', label: 'Rewards & Coins' },
  { href: '/rewards#referral', label: 'Refer a Friend' },
  { href: '/order-online', label: 'Active Promotions' },
];

const experienceLinks: FooterLinkItem[] = [
  { href: '/our-story', label: 'Our Story' },
  { href: '/find-us', label: 'Find Us' },
  { href: '/blog', label: 'Blog', flag: 'blog' },
  { href: '/help', label: 'Help Centre', flag: 'helpCenter' },
  { href: '/support', label: 'Contact Us' },
];

const footerColumns: { title: string; links: FooterLinkItem[] }[] = [
  { title: 'Order', links: orderLinks },
  { title: 'Rewards & Offers', links: rewardsLinks },
  { title: 'Experience', links: experienceLinks },
];

const defaultSocialLinks = [
  { Icon: MailIcon, label: 'Email', url: 'mailto:hello@build.withdarsh.com' },
];

const bottomLinks = [
  { href: '/privacy', label: 'Privacy Policy' },
  { href: '/terms', label: 'Terms of Service' },
  { href: '/sitemap.xml', label: 'Sitemap' },
];

export default function Footer() {
  const { isClassic } = useMode();
  const { config } = useConfig();

  const brandName = config?.branding?.name || 'Burger Empire';

  const socialLinks = defaultSocialLinks;

  const featureFlagMap: Record<string, string> = {
    reservations: 'reservations_enabled',
    blog: 'blog_enabled',
    feedback: 'feedback_enabled',
    helpCenter: 'help_center_enabled',
    selfCheckin: 'self_checkin_enabled',
    subscription: 'subscription_enabled',
    tableQr: 'table_qr_enabled',
    mealPlans: 'meal_plans_enabled',
  };

  const flagEnabled = (flag?: string) => {
    if (!flag) return true;
    // Check feature flags
    if (featureFlagMap[flag]) {
      return !!(config.features as Record<string, unknown>)[featureFlagMap[flag]];
    }
    // Check section-level enabled (e.g. giftCards, studentPass)
    const section = config[flag as keyof typeof config];
    return section && typeof section === 'object' && 'enabled' in section ? section.enabled : true;
  };

  return (
    <footer className="bg-[#1A1A1A] relative z-10">
      {/* Main footer */}
      <div className="max-w-[1200px] mx-auto px-5 py-14">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10">
          {/* Brand */}
          <div className="col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <Logo size={40} />
              <div>
                <div className="text-[0.9375rem] font-extrabold text-white leading-tight">
                  {brandName}
                </div>
                <div
                  className="text-[0.625rem] font-medium uppercase tracking-widest transition-colors duration-500"
                  style={{ color: isClassic ? '#EB7A29' : '#6AAF7B' }}
                >
                  {config?.branding?.tagline || (isClassic ? 'Smash Burgers' : 'Eat Well')}
                </div>
              </div>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed max-w-[280px] mb-6">
              {isClassic
                ? 'The burger that started a movement. Smashed fresh, stacked bold, loved hard — since 2018.'
                : 'Where clean eating meets real flavor. No compromises, no gimmicks — just honest food since 2018.'}
            </p>
            {/* Social */}
            <div className="flex items-center gap-3">
              {socialLinks.map(({ Icon, label, url }) => (
                <a
                  key={label}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${brandName} on ${label}`}
                  className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center text-gray-400 hover:bg-white/10 hover:text-white cursor-pointer transition-colors"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {footerColumns.map(({ title, links }) => (
            <div key={title}>
              <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-4">
                {title}
              </p>
              <div className="flex flex-col gap-2.5">
                {links.map((link) =>
                  flagEnabled(link.flag) ? (
                    <Link
                      key={link.label}
                      href={link.href}
                      className="text-sm text-gray-400 hover:text-white transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  ) : null,
                )}
              </div>
            </div>
          ))}

          {/* Contact info from config */}
          {(config?.contact?.phone || config?.contact?.email || config?.contact?.address) && (
            <div className="col-span-2 md:col-span-5 mt-6 pt-6 border-t border-white/5">
              <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-4">
                Contact
              </p>
              <div className="flex flex-wrap gap-x-8 gap-y-3">
                {config.contact.phone && (
                  <a
                    href={`tel:${config.contact.phone}`}
                    className="text-sm text-gray-400 hover:text-white transition-colors duration-200 flex items-center gap-2"
                  >
                    <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    {config.contact.phone}
                  </a>
                )}
                {config.contact.email && (
                  <a
                    href={`mailto:${config.contact.email}`}
                    className="text-sm text-gray-400 hover:text-white transition-colors duration-200 flex items-center gap-2"
                  >
                    <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    {config.contact.email}
                  </a>
                )}
                {config.contact.address && (
                  <span className="text-sm text-gray-400 flex items-center gap-2">
                    <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {config.contact.address}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Student Pass badge strip */}
      {config.features.student_pass_enabled && (
        <div className="border-t border-white/5">
          <div className="max-w-[1200px] mx-auto px-5 py-3 flex items-center justify-center gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M12 3L1 9L5 11.18V17.18L12 21L19 17.18V11.18L21 10.09V17H23V9L12 3ZM18.82 9L12 12.72L5.18 9L12 5.28L18.82 9ZM17 15.99L12 18.72L7 15.99V12.27L12 15L17 12.27V15.99Z"
                fill={isClassic ? '#EB7A29' : '#6AAF7B'}
                opacity={0.7}
              />
            </svg>
            <span className="text-xs text-gray-400">
              Students save on every order
            </span>
            <Link
              href="/student"
              className="text-xs font-semibold underline underline-offset-2 transition-colors duration-200"
              style={{ color: isClassic ? '#EB7A29' : '#6AAF7B' }}
            >
              Learn more about Student Pass
            </Link>
          </div>
        </div>
      )}

      {/* Payment badges */}
      <div className="border-t border-white/5">
        <div className="max-w-[1200px] mx-auto px-5 py-4 flex items-center justify-center gap-6">
          <span className="text-[0.625rem] text-gray-400 uppercase tracking-wider font-medium">Accepted</span>
          {/* Visa */}
          <svg width="28" height="18" viewBox="0 0 28 18" fill="none" aria-hidden="true" className="opacity-40">
            <rect width="28" height="18" rx="2" fill="#fff" fillOpacity={0.1} />
            <text x="14" y="12" textAnchor="middle" fontSize="7" fill="#fff" fontWeight="700">VISA</text>
          </svg>
          {/* Mastercard */}
          <svg width="28" height="18" viewBox="0 0 28 18" fill="none" aria-hidden="true" className="opacity-40">
            <circle cx="11" cy="9" r="6" fill="#EB001B" fillOpacity={0.6} />
            <circle cx="17" cy="9" r="6" fill="#F79E1B" fillOpacity={0.6} />
          </svg>
          {/* UPI */}
          <svg width="28" height="18" viewBox="0 0 28 18" fill="none" aria-hidden="true" className="opacity-40">
            <rect width="28" height="18" rx="2" fill="#fff" fillOpacity={0.1} />
            <text x="14" y="12" textAnchor="middle" fontSize="6" fill="#fff" fontWeight="700">UPI</text>
          </svg>
          {/* COD */}
          <svg width="28" height="18" viewBox="0 0 28 18" fill="none" aria-hidden="true" className="opacity-40">
            <rect width="28" height="18" rx="2" fill="#fff" fillOpacity={0.1} />
            <text x="14" y="12" textAnchor="middle" fontSize="5.5" fill="#fff" fontWeight="700">COD</text>
          </svg>
          <span className="text-[0.625rem] text-gray-400 flex items-center gap-1.5">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" className="opacity-50" aria-hidden="true">
              <path d="M12 1L3 5V11C3 16.55 6.84 21.74 12 23C17.16 21.74 21 16.55 21 11V5L12 1ZM10 17L6 13L7.41 11.59L10 14.17L16.59 7.58L18 9L10 17Z" fill="#fff" />
            </svg>
            <span className="text-gray-400">Secure Checkout</span>
          </span>
        </div>
      </div>

      {/* App store links */}
      {(config?.app?.app_store_url || config?.app?.play_store_url) && (
        <div className="border-t border-white/5">
          <div className="max-w-[1200px] mx-auto px-5 py-4 flex items-center justify-center gap-4">
            <span className="text-[0.625rem] text-gray-400 uppercase tracking-wider font-medium">Get the App</span>
            {config.app.app_store_url && (
              <a href={config.app.app_store_url} target="_blank" rel="noopener noreferrer" className="text-xs text-gray-400 hover:text-white transition-colors font-medium">
                App Store
              </a>
            )}
            {config.app.play_store_url && (
              <a href={config.app.play_store_url} target="_blank" rel="noopener noreferrer" className="text-xs text-gray-400 hover:text-white transition-colors font-medium">
                Google Play
              </a>
            )}
          </div>
        </div>
      )}

      {/* Bottom bar */}
      <div className="border-t border-white/5">
        <div className="max-w-[1200px] mx-auto px-5 py-5 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-xs text-gray-400">
            &copy; {new Date().getFullYear()} {brandName}. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            {bottomLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-xs text-gray-400 hover:text-gray-300 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
          {config?.branding?.powered_by_visible && (
            <p className="text-[0.625rem] text-gray-500">
              Powered by <a href="https://build.withdarsh.com" target="_blank" rel="noopener noreferrer" className="hover:text-gray-300 transition-colors">Darsh Gupta</a>
            </p>
          )}
        </div>
      </div>
    </footer>
  );
}
