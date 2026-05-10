import type { Metadata } from 'next';
import { cloudinaryUrl } from '@/lib/cloudinary-url';

export const metadata: Metadata = {
  title: 'Privacy Policy | Burger Empire',
  description:
    'Burger Empire privacy policy. Learn how we collect, use, and protect your personal information.',
  alternates: { canonical: 'https://burger-empire.build.withdarsh.com/privacy' },
  openGraph: {
    title: 'Privacy Policy — Burger Empire',
    description:
      'Learn how Burger Empire collects, uses, and protects your personal information.',
    url: 'https://burger-empire.build.withdarsh.com/privacy',
    images: [{ url: cloudinaryUrl('burgerempire/images/og-home'), width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary',
    title: 'Privacy Policy — Burger Empire',
    description:
      'Burger Empire privacy policy. How we collect, use, and protect your data.',
    images: [cloudinaryUrl('burgerempire/images/og-home')],
  },
};

export default function PrivacyLayout({ children }: { children: React.ReactNode }) {
  return children;
}
