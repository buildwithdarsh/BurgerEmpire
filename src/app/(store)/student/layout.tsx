import type { Metadata } from 'next';
import { cloudinaryUrl } from '@/lib/cloudinary-url';

export const metadata: Metadata = {
  title: 'Student Pass | Burger Empire',
  description:
    'Get exclusive student discounts on every order with Burger Empire Student Pass. Verify your student ID and start saving.',
  alternates: { canonical: 'https://burger-empire.build.withdarsh.com/student' },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Student Pass — Save on Every Burger Empire Order',
    description:
      'Exclusive student discounts at Burger Empire Abc City. Verify your student ID and save on every order.',
    url: 'https://burger-empire.build.withdarsh.com/student',
    images: [{ url: cloudinaryUrl('burgerempire/images/og-home'), width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Student Pass — Burger Empire Abc City',
    description:
      'Exclusive student discounts on every Burger Empire order. Verify your ID and start saving.',
    images: [cloudinaryUrl('burgerempire/images/og-home')],
  },
};

export default function StudentLayout({ children }: { children: React.ReactNode }): React.ReactNode {
  return children;
}
