import type { Metadata } from 'next';
import { cloudinaryUrl } from '@/lib/cloudinary-url';

export const metadata: Metadata = {
  title: 'Rewards — Earn Buddy Coins at Burger Empire Abc City',
  description:
    'Earn Buddy Coins with every Burger Empire order in Abc City and redeem them for free burgers, fries and drinks. Join the rewards program today.',
  alternates: { canonical: 'https://burger-empire.build.withdarsh.com/rewards' },
  robots: { index: false, follow: true },
  openGraph: {
    title: 'Rewards — Earn Buddy Coins at Burger Empire',
    description:
      'Earn Buddy Coins with every order and redeem them for free burgers, fries and drinks.',
    url: 'https://burger-empire.build.withdarsh.com/rewards',
    images: [{ url: cloudinaryUrl('burgerempire/images/og-home'), width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Rewards — Burger Empire Abc City',
    description:
      'Earn Buddy Coins with every order. Redeem for free burgers, fries and drinks.',
    images: [cloudinaryUrl('burgerempire/images/og-home')],
  },
};

export default function RewardsLayout({ children }: { children: React.ReactNode }): React.ReactNode {
  return children;
}
