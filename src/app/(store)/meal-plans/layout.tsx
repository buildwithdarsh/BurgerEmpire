import type { Metadata } from 'next';
import { cloudinaryUrl } from '@/lib/cloudinary-url';

export const metadata: Metadata = {
  title: 'Meal Plans | Burger Empire',
  description:
    'Subscribe to Burger Empire meal plans. Save on your favourite meals with weekly and monthly subscription plans.',
  alternates: { canonical: 'https://burger-empire.build.withdarsh.com/meal-plans' },
  openGraph: {
    title: 'Meal Plans — Burger Empire Abc City',
    description:
      'Subscribe to Burger Empire meal plans. Save on your favourite meals with weekly and monthly plans.',
    url: 'https://burger-empire.build.withdarsh.com/meal-plans',
    images: [{ url: cloudinaryUrl('burgerempire/images/og-home'), width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Meal Plans — Burger Empire Abc City',
    description:
      'Save on your favourite Burger Empire meals with weekly and monthly subscription plans.',
    images: [cloudinaryUrl('burgerempire/images/og-home')],
  },
};

export default function MealPlansLayout({ children }: { children: React.ReactNode }) {
  return children;
}
