import type { Metadata } from 'next';
import { cloudinaryUrl } from '@/lib/cloudinary-url';
import { MenuCatalogSchema } from '@/components/seo/rich/MenuCatalogSchema';

export const metadata: Metadata = {
  title: { absolute: 'Burger Empire Menu Abc City — Veg Burgers from ₹69' },
  description:
    'Full veg burger menu at Burger Empire Abc City. Aloo Tikki ₹69, Crispy Veg ₹139, Veg King ₹159, Paneer Wrap ₹169. Order on Zomato or Swiggy.',
  alternates: { canonical: 'https://burger-empire.build.withdarsh.com/menu/burgers' },
  openGraph: {
    title: 'Veg Burger Menu — Burger Empire Abc City',
    description: 'Burgers from ₹69. Crispy Veg, Aloo Tikki, Veg King, Paneer Wrap & more. Order online.',
    url: 'https://burger-empire.build.withdarsh.com/menu/burgers',
    images: [{ url: cloudinaryUrl('burgerempire/images/og-menu'), width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Veg Burger Menu — Burger Empire Abc City',
    description: 'Burgers from ₹69. Aloo Tikki, Crispy Veg, Veg King & more.',
    images: [cloudinaryUrl('burgerempire/images/og-menu')],
  },
};

export default function MenuLayout({ children }: { children: React.ReactNode }): React.ReactNode {
  return (
    <>
      <MenuCatalogSchema />
      {children}
    </>
  );
}
