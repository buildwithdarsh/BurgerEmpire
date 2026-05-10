import type { Metadata } from 'next';
import { cloudinaryUrl } from '@/lib/cloudinary-url';

export const metadata: Metadata = {
  title: 'Customer Support | Burger Empire',
  description:
    'Get help with your Burger Empire orders. Raise a support ticket or browse our help centre for quick answers.',
  alternates: { canonical: 'https://burger-empire.build.withdarsh.com/support' },
  openGraph: {
    title: 'Customer Support — Burger Empire Abc City',
    description:
      'Get help with your Burger Empire orders. Raise a support ticket or browse our help centre.',
    url: 'https://burger-empire.build.withdarsh.com/support',
    images: [{ url: cloudinaryUrl('burgerempire/images/og-home'), width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Customer Support — Burger Empire',
    description:
      'Raise a support ticket or browse the Burger Empire help centre for quick answers.',
    images: [cloudinaryUrl('burgerempire/images/og-home')],
  },
};

export default function SupportLayout({ children }: { children: React.ReactNode }) {
  return children;
}
