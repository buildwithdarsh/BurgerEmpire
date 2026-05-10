import type { Metadata } from 'next';
import { cloudinaryUrl } from '@/lib/cloudinary-url';

export const metadata: Metadata = {
  title: 'Gift Cards | Burger Empire',
  description:
    'Give the gift of good food. Purchase Burger Empire gift cards for friends and family. Check your gift card balance online.',
  alternates: { canonical: 'https://burger-empire.build.withdarsh.com/gift-cards' },
  openGraph: {
    title: 'Gift Cards — Burger Empire Abc City',
    description:
      'Give the gift of good food. Purchase Burger Empire gift cards for friends and family.',
    url: 'https://burger-empire.build.withdarsh.com/gift-cards',
    images: [{ url: cloudinaryUrl('burgerempire/images/og-home'), width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Gift Cards — Burger Empire Abc City',
    description:
      'Purchase Burger Empire gift cards for friends and family. Check your balance online.',
    images: [cloudinaryUrl('burgerempire/images/og-home')],
  },
};

export default function GiftCardsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
