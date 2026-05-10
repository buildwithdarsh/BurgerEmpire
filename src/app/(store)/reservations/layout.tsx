import type { Metadata } from 'next';
import { cloudinaryUrl } from '@/lib/cloudinary-url';

export const metadata: Metadata = {
  title: 'Reservations | Burger Empire',
  description:
    'Reserve a table at Burger Empire Abc City. Choose your outlet, date, time, and party size for a quick dine-in experience.',
  alternates: { canonical: 'https://burger-empire.build.withdarsh.com/reservations' },
  openGraph: {
    title: 'Reserve a Table — Burger Empire Abc City',
    description:
      'Reserve a table at Burger Empire. Choose your date, time, and party size for the perfect dining experience.',
    url: 'https://burger-empire.build.withdarsh.com/reservations',
    images: [{ url: cloudinaryUrl('burgerempire/images/og-home'), width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Reserve a Table — Burger Empire Abc City',
    description:
      'Reserve a table at any of the 6 Burger Empire outlets in Abc City.',
    images: [cloudinaryUrl('burgerempire/images/og-home')],
  },
};

export default function ReservationsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
