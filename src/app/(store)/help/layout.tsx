import type { Metadata } from 'next';
import { cloudinaryUrl } from '@/lib/cloudinary-url';

export const metadata: Metadata = {
  title: 'Help Centre | Burger Empire',
  description:
    'Find answers to frequently asked questions about Burger Empire orders, delivery, payments, and more.',
  alternates: { canonical: 'https://burger-empire.build.withdarsh.com/help' },
  openGraph: {
    title: 'Help Centre — Burger Empire Abc City',
    description:
      'Find answers to frequently asked questions about Burger Empire orders, delivery, payments, and more.',
    url: 'https://burger-empire.build.withdarsh.com/help',
    images: [{ url: cloudinaryUrl('burgerempire/images/og-home'), width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Help Centre — Burger Empire Abc City',
    description:
      'Find answers to FAQs about Burger Empire orders, delivery, payments, and more.',
    images: [cloudinaryUrl('burgerempire/images/og-home')],
  },
};

export default function HelpLayout({ children }: { children: React.ReactNode }) {
  return children;
}
