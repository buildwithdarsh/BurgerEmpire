import type { Metadata } from 'next';
import { cloudinaryUrl } from '@/lib/cloudinary-url';
import { BreadcrumbSchema } from '@/components/seo/BreadcrumbSchema';

export const metadata: Metadata = {
  title: { absolute: 'BurgerEmpire × ViCity | Official Partnership' },
  description:
    'BabyBurger and Velora join forces. In-villa dining, double loyalty points, exclusive combos and priority room service.',
  alternates: { canonical: 'https://burger-empire.build.withdarsh.com/handshake' },
  openGraph: {
    title: 'BurgerEmpire × ViCity Partnership',
    description: 'When flame-grilled perfection meets luxury hospitality. Limited-edition combos and exclusive experiences.',
    url: 'https://burger-empire.build.withdarsh.com/handshake',
    images: [{ url: cloudinaryUrl('burgerempire/images/og-home'), width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BurgerEmpire × ViCity Partnership',
    description: 'Flame-grilled perfection meets luxury hospitality.',
    images: [cloudinaryUrl('burgerempire/images/og-home')],
  },
};

export default function HandshakeLayout({ children }: { children: React.ReactNode }): React.ReactNode {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: 'https://burger-empire.build.withdarsh.com' },
          { name: 'BurgerEmpire × ViCity', url: 'https://burger-empire.build.withdarsh.com/handshake' },
        ]}
      />
      {children}
    </>
  );
}
