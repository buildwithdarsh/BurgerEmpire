import type { Metadata } from 'next';
import { cloudinaryUrl } from '@/lib/cloudinary-url';
import { BreadcrumbSchema } from '@/components/seo/BreadcrumbSchema';

export const metadata: Metadata = {
  title: { absolute: 'Combo Deals Abc City — Burger Empire from ₹149' },
  description:
    'Save with Burger Empire combo deals in Abc City. Bundled meals with veg burgers, fries and drinks from ₹149. Order on Zomato or Swiggy.',
  alternates: { canonical: 'https://burger-empire.build.withdarsh.com/combo-deals' },
  openGraph: {
    title: 'Combo Deals — Burger Empire Abc City',
    description: 'Bundled meals with veg burgers, fries and drinks from ₹149. Order on Zomato or Swiggy.',
    url: 'https://burger-empire.build.withdarsh.com/combo-deals',
    images: [{ url: cloudinaryUrl('burgerempire/images/og-home'), width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Combo Deals — Burger Empire Abc City',
    description: 'Bundled meals from ₹149. Veg burgers, fries and drinks.',
    images: [cloudinaryUrl('burgerempire/images/og-home')],
  },
};

export default function ComboDealsLayout({ children }: { children: React.ReactNode }): React.ReactNode {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: 'https://burger-empire.build.withdarsh.com' },
          { name: 'Combo Deals', url: 'https://burger-empire.build.withdarsh.com/combo-deals' },
        ]}
      />
      {children}
    </>
  );
}
