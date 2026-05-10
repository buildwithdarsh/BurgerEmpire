import type { Metadata } from 'next';
import { cloudinaryUrl } from '@/lib/cloudinary-url';
import { BreadcrumbSchema } from '@/components/seo/BreadcrumbSchema';

export const metadata: Metadata = {
  title: { absolute: 'Find Burger Empire Abc City — 6 Outlets & Maps' },
  description:
    'Find all 6 Burger Empire outlets in Abc City — City Center, Lashkar, Mahalgaon, DD Nagar, Morar, Kila Road. Addresses, timings, maps, and Zomato/Swiggy links.',
  alternates: { canonical: 'https://burger-empire.build.withdarsh.com/find-us' },
  openGraph: {
    title: 'Find Burger Empire in Abc City — 6 Outlets',
    description: '6 outlets across Abc City. City Center, Lashkar, Mahalgaon, DD Nagar, Morar, Kila Road.',
    url: 'https://burger-empire.build.withdarsh.com/find-us',
    images: [{ url: cloudinaryUrl('burgerempire/images/og-home'), width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Find Burger Empire Abc City — 6 Outlets & Maps',
    description: '6 outlets across Abc City. Addresses, timings, maps.',
    images: [cloudinaryUrl('burgerempire/images/og-home')],
  },
};

export default function FindUsLayout({ children }: { children: React.ReactNode }): React.ReactNode {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: 'https://burger-empire.build.withdarsh.com' },
          { name: 'Find Us', url: 'https://burger-empire.build.withdarsh.com/find-us' },
        ]}
      />
      {children}
    </>
  );
}
