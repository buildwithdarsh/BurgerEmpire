import type { Metadata } from 'next';
import { cloudinaryUrl } from '@/lib/cloudinary-url';
import { BreadcrumbSchema } from '@/components/seo/BreadcrumbSchema';

export const metadata: Metadata = {
  title: { absolute: 'Healthy Mode — Guilt-Free Burgers | Burger Empire' },
  description:
    'Burger Empire Healthy Mode in Abc City — guilt-free veg burgers, wraps and meals with full nutritional transparency. Same bold flavours, honest ingredients.',
  alternates: { canonical: 'https://burger-empire.build.withdarsh.com/healthy' },
  openGraph: {
    title: 'Healthy Mode — Burger Empire Abc City',
    description: 'Guilt-free veg burgers, wraps and meals with full nutritional transparency.',
    url: 'https://burger-empire.build.withdarsh.com/healthy',
    images: [{ url: cloudinaryUrl('burgerempire/images/og-home'), width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Healthy Mode — Burger Empire Abc City',
    description: 'Guilt-free veg burgers with full nutritional transparency.',
    images: [cloudinaryUrl('burgerempire/images/og-home')],
  },
};

export default function HealthyLayout({ children }: { children: React.ReactNode }): React.ReactNode {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: 'https://burger-empire.build.withdarsh.com' },
          { name: 'Healthy Mode', url: 'https://burger-empire.build.withdarsh.com/healthy' },
        ]}
      />
      {children}
    </>
  );
}
