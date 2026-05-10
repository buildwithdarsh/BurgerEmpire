import type { Metadata } from 'next';
import { cloudinaryUrl } from '@/lib/cloudinary-url';
import HomeContent from './HomeContent';
import { HomepageSchemas } from '@/components/seo/rich/HomepageSchemas';
import { BrandAggregateRatingSchema } from '@/components/seo/rich/AggregateRatingSchema';

export const metadata: Metadata = {
  title: {
    absolute:
      "Burger Empire Abc City — Veg Burgers from ₹69 Since 2018 | 4.2★ Rated",
  },
  description:
    "Burger Empire is Abc City's original burger brand since 2018. Veg-first kitchen, burgers from ₹69, 6 outlets. Order on Zomato or Swiggy.",
  alternates: { canonical: 'https://burger-empire.build.withdarsh.com' },
  openGraph: {
    type: 'website',
    title: "Burger Empire Abc City — Veg Burgers from ₹69 Since 2018",
    description:
      "Abc City's original burger brand. Veg-first. 6 outlets. Burgers from ₹69. Order now on Zomato or Swiggy.",
    url: 'https://burger-empire.build.withdarsh.com',
    images: [
      {
        url: cloudinaryUrl('burgerempire/images/og-home'),
        width: 1200,
        height: 630,
        alt: 'Burger Empire Abc City — Fresh Veg Burgers from ₹69',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Burger Empire Abc City — Veg Burgers from ₹69 Since 2018",
    description:
      "Abc City's original burger brand. Veg-first. ₹69 onwards. 6 outlets.",
    images: [cloudinaryUrl('burgerempire/images/og-home')],
  },
};

export default function HomePage() {
  return (
    <>
      <HomepageSchemas />
      <BrandAggregateRatingSchema />
      <HomeContent />
    </>
  );
}
