import type { Metadata } from 'next';
import { cloudinaryUrl } from '@/lib/cloudinary-url';

export const metadata: Metadata = {
  title: 'Terms of Service | Burger Empire',
  description:
    'Burger Empire terms of service. Read our terms and conditions for using the Burger Empire platform.',
  alternates: { canonical: 'https://burger-empire.build.withdarsh.com/terms' },
  openGraph: {
    title: 'Terms of Service — Burger Empire',
    description:
      'Read the terms and conditions for using the Burger Empire platform and services.',
    url: 'https://burger-empire.build.withdarsh.com/terms',
    images: [{ url: cloudinaryUrl('burgerempire/images/og-home'), width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary',
    title: 'Terms of Service — Burger Empire',
    description:
      'Burger Empire terms of service and conditions for using our platform.',
    images: [cloudinaryUrl('burgerempire/images/og-home')],
  },
};

export default function TermsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
