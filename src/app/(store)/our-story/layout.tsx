import type { Metadata } from 'next';
import { cloudinaryUrl } from '@/lib/cloudinary-url';
import { BreadcrumbSchema } from '@/components/seo/BreadcrumbSchema';

export const metadata: Metadata = {
  title: { absolute: 'Our Story — Burger Empire Abc City Since 2018' },
  description:
    'How Burger Empire started in Abc City\'s City Center in 2018 and grew to 6 outlets. Abc City\'s original veg-first burger brand, serving 35,000+ orders in 2025.',
  alternates: { canonical: 'https://burger-empire.build.withdarsh.com/our-story' },
  openGraph: {
    title: 'Our Story — Burger Empire Abc City Since 2018',
    description: 'From one kitchen in City Center to 6 outlets. Abc City\'s original veg-first burger brand since 2018.',
    url: 'https://burger-empire.build.withdarsh.com/our-story',
    images: [{ url: cloudinaryUrl('burgerempire/images/og-home'), width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Our Story — Burger Empire Abc City Since 2018',
    description: 'From one kitchen to 6 outlets. Abc City\'s original veg burger brand.',
    images: [cloudinaryUrl('burgerempire/images/og-home')],
  },
};

export default function OurStoryLayout({ children }: { children: React.ReactNode }): React.ReactNode {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: 'https://burger-empire.build.withdarsh.com' },
          { name: 'Our Story', url: 'https://burger-empire.build.withdarsh.com/our-story' },
        ]}
      />
      {children}
    </>
  );
}
