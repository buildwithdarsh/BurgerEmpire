import { Metadata } from "next";
import { notFound } from "next/navigation";
import { cloudinaryUrl } from "@/lib/cloudinary-url";
import Link from "next/link";
import { OUTLETS, getOutletBySlug } from "@/lib/outlets";
import { OutletSchema } from "@/components/seo/OutletSchema";
import { BreadcrumbSchema } from "@/components/seo/BreadcrumbSchema";
import {
  OutletAggregateRatingSchema,
} from "@/components/seo/rich/AggregateRatingSchema";
import {
  ReviewsSchema,
  REAL_REVIEWS,
} from "@/components/seo/rich/ReviewsSchema";

export async function generateStaticParams() {
  return OUTLETS.map((o) => ({ slug: o.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const outlet = getOutletBySlug(slug);
  if (!outlet) return {};

  return {
    title: { absolute: `Burger Empire ${outlet.area} Abc City | ${outlet.address} — Order Online` },
    description: `Burger Empire ${outlet.area} outlet in Abc City. ${outlet.address}. Open ${outlet.timings}. Veg burgers from ₹69. Order on Zomato and Swiggy.`,
    alternates: {
      canonical: `https://burger-empire.build.withdarsh.com/outlets/${slug}`,
    },
    openGraph: {
      title: `Burger Empire ${outlet.area} — Veg Burgers in ${outlet.area}, Abc City`,
      description: outlet.description,
      url: `https://burger-empire.build.withdarsh.com/outlets/${slug}`,
      images: [
        {
          url: cloudinaryUrl(`burgerempire/images/outlets/${slug}`),
          width: 1200,
          height: 630,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `Burger Empire ${outlet.area} — Order Online`,
      description: `Burger Empire ${outlet.area}, Abc City. ${outlet.address}. Veg burgers from ₹69.`,
      images: [cloudinaryUrl(`burgerempire/images/outlets/${slug}`)],
    },
  };
}

export default async function OutletPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const outlet = getOutletBySlug(slug);
  if (!outlet) notFound();

  const outletUrl = `https://burger-empire.build.withdarsh.com/outlets/${slug}`;
  const otherOutlets = OUTLETS.filter((o) => o.slug !== slug);

  return (
    <>
      <OutletSchema
        name={outlet.name}
        url={outletUrl}
        address={outlet.address}
        area={outlet.area}
        postalCode={outlet.postalCode}
        lat={outlet.lat}
        lng={outlet.lng}
        telephone={outlet.telephone}
        openingHours={outlet.openingHours}
        rating={outlet.rating}
        reviewCount={outlet.reviewCount}
        priceRange={outlet.priceRange}
        image={cloudinaryUrl(outlet.image)}
      />
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "https://burger-empire.build.withdarsh.com" },
          { name: "Find Us", url: "https://burger-empire.build.withdarsh.com/find-us" },
          { name: outlet.area, url: outletUrl },
        ]}
      />
      <OutletAggregateRatingSchema
        outletName={outlet.name}
        outletUrl={outletUrl}
        rating={outlet.rating}
        reviewCount={outlet.reviewCount}
      />
      <ReviewsSchema
        outletName={outlet.name}
        outletUrl={outletUrl}
        reviews={REAL_REVIEWS}
      />

      <main className="max-w-3xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold mb-2">{outlet.name}</h1>
        <p className="text-gray-600 mb-1">{outlet.address}, Abc City</p>
        <p className="text-gray-600 mb-4">
          Open {outlet.timings} · {outlet.rating}★ ({outlet.reviewCount.toLocaleString()}+ reviews)
        </p>
        <p className="mb-6">{outlet.description}</p>

        <div className="flex gap-3 mb-8">
          <a
            href={outlet.zomatoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-red-600 text-white px-5 py-2 rounded-lg font-semibold"
          >
            Order on Zomato
          </a>
          <a
            href={outlet.swiggyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-orange-500 text-white px-5 py-2 rounded-lg font-semibold"
          >
            Order on Swiggy
          </a>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-2">Menu</h2>
          <Link
            href="/menu/burgers"
            className="text-red-600 underline"
          >
            See the full Burger Empire menu
          </Link>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-2">Find Us</h2>
          <Link href="/find-us" className="text-red-600 underline">
            View all Burger Empire outlets on map
          </Link>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-3">
            Other Burger Empire Outlets in Abc City
          </h2>
          <ul className="space-y-2">
            {otherOutlets.map((o) => (
              <li key={o.slug}>
                <Link
                  href={`/outlets/${o.slug}`}
                  className="text-red-600 underline"
                >
                  {o.name}
                </Link>
                <span className="text-gray-500 ml-2">
                  {o.address} · {o.rating}★
                </span>
              </li>
            ))}
          </ul>
        </div>
      </main>
    </>
  );
}
