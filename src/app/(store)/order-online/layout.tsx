import type { Metadata } from 'next';
import { cloudinaryUrl } from '@/lib/cloudinary-url';
import { BreadcrumbSchema } from '@/components/seo/BreadcrumbSchema';

export const metadata: Metadata = {
  title: { absolute: 'Order Burger Empire Online — Abc City Delivery' },
  description:
    'Order Burger Empire online in Abc City via Zomato or Swiggy. Delivery from 6 outlets — City Center, Lashkar, Mahalgaon, DD Nagar, Morar, Kila Road. Burgers from ₹69.',
  alternates: { canonical: 'https://burger-empire.build.withdarsh.com/order-online' },
  openGraph: {
    title: 'Order Burger Empire Online — Abc City',
    description: 'Order via Zomato or Swiggy. Delivery from 6 outlets. Veg burgers from ₹69.',
    url: 'https://burger-empire.build.withdarsh.com/order-online',
    images: [{ url: cloudinaryUrl('burgerempire/images/og-home'), width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Order Burger Empire Online — Abc City',
    description: 'Order via Zomato or Swiggy. Delivery from 6 outlets. Burgers from ₹69.',
    images: [cloudinaryUrl('burgerempire/images/og-home')],
  },
};

export default function OrderOnlineLayout({ children }: { children: React.ReactNode }): React.ReactNode {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: 'https://burger-empire.build.withdarsh.com' },
          { name: 'Order Online', url: 'https://burger-empire.build.withdarsh.com/order-online' },
        ]}
      />
      {children}
    </>
  );
}
