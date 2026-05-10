'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useMode } from '@/hooks/useMode';
import { useConfig } from '@/hooks/useConfig';
import { MailIcon } from './icons';

interface LinkItem {
  href: string;
  label: string;
  flag?: 'giftCards' | 'studentPass' | 'reservations' | 'blog' | 'feedback' | 'helpCenter' | 'selfCheckin' | 'subscription' | 'tableQr' | 'mealPlans';
}

const sections: { title: string; links: LinkItem[] }[] = [
  {
    title: 'Order',
    links: [
      { href: '/menu', label: 'Menu' },
      { href: '/order-online', label: 'Order Online' },
      { href: '/combo-deals', label: 'Combo Deals' },
      { href: '/healthy', label: 'Healthy Menu' },
      { href: '/gift-cards', label: 'Gift Cards', flag: 'giftCards' },
      { href: '/meal-plans', label: 'Meal Plans', flag: 'mealPlans' },
      { href: '/subscriptions', label: 'Subscriptions', flag: 'subscription' },
    ],
  },
  {
    title: 'Rewards & Offers',
    links: [
      { href: '/rewards', label: 'Rewards & Coins' },
      { href: '/rewards#referral', label: 'Refer a Friend' },
    ],
  },
  {
    title: 'Burger Empire',
    links: [
      { href: '/our-story', label: 'Our Story' },
      { href: '/find-us', label: 'Find Us' },
      { href: '/blog', label: 'Blog', flag: 'blog' },
      { href: '/help', label: 'Help Centre', flag: 'helpCenter' },
      { href: '/support', label: 'Contact Us' },
    ],
  },
];

const socialLinks = [
  { Icon: MailIcon, label: 'Email', url: 'mailto:hello@build.withdarsh.com' },
];

export default function MobileFooterLinks() {
  const { isClassic } = useMode();
  const { config } = useConfig();
  const [openSection, setOpenSection] = useState<string | null>(null);

  const accent = isClassic ? '#EB7A29' : '#6AAF7B';

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
    if (featureFlagMap[flag]) {
      return !!(config.features as Record<string, unknown>)[featureFlagMap[flag]];
    }
    const section = config[flag as keyof typeof config];
    return section && typeof section === 'object' && 'enabled' in section
      ? section.enabled
      : true;
  };

  const toggle = (title: string) => {
    setOpenSection((prev) => (prev === title ? null : title));
  };

  return (
    <div className="md:hidden bg-[#1A1A1A]" style={{ paddingBottom: 'calc(5rem + env(safe-area-inset-bottom, 0px))' }}>
      {/* Header */}
      <div className="px-5 pt-8 pb-4">
        <p
          className="text-[0.6875rem] font-bold uppercase tracking-[0.15em]"
          style={{ color: accent }}
        >
          More from Burger Empire
        </p>
      </div>

      {/* Accordion sections */}
      {sections.map(({ title, links }) => {
        const isOpen = openSection === title;
        const visibleLinks = links.filter((l) => flagEnabled(l.flag));
        if (visibleLinks.length === 0) return null;

        return (
          <div key={title} className="border-t border-white/5">
            <button
              onClick={() => toggle(title)}
              className="flex items-center justify-between w-full px-5 py-3.5"
              style={{ touchAction: 'manipulation' }}
            >
              <span className="text-sm font-semibold text-white">{title}</span>
              <svg
                className="w-4 h-4 text-gray-500 transition-transform duration-200"
                style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                />
              </svg>
            </button>

            {isOpen && (
              <div className="px-5 pb-3 flex flex-wrap gap-2">
                {visibleLinks.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    className="px-3.5 py-2 rounded-xl text-[0.75rem] font-medium text-gray-400 bg-white/5 active:bg-white/10 transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        );
      })}

      {/* Social + Legal */}
      <div className="border-t border-white/5 px-5 py-5 space-y-4">
        {/* Social icons */}
        <div className="flex items-center gap-3">
          {socialLinks.map(({ Icon, label, url }) => (
            <a
              key={label}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Burger Empire on ${label}`}
              className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center text-gray-500 active:bg-white/10 transition-colors"
            >
              <Icon size={16} />
            </a>
          ))}
        </div>

        {/* Legal links */}
        <div className="flex items-center gap-4">
          <Link href="/privacy" className="text-[0.6875rem] text-gray-500">
            Privacy
          </Link>
          <Link href="/terms" className="text-[0.6875rem] text-gray-500">
            Terms
          </Link>
          <span className="text-[0.6875rem] text-gray-600">
            &copy; {new Date().getFullYear()} Burger Empire
          </span>
        </div>
      </div>
    </div>
  );
}
