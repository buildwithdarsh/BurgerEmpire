import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getSeoPage, getAllSeoSlugs } from "@/lib/seo-pages";
import { FAQSchema, DEFAULT_FAQ } from "@/components/seo/FAQSchema";
import { BreadcrumbSchema } from "@/components/seo/BreadcrumbSchema";
import { ProductSchema } from "@/components/seo/rich/ProductSchema";
import { OUTLETS } from "@/lib/outlets";
import { cloudinaryUrl } from "@/lib/cloudinary-url";
import Link from "next/link";

export async function generateStaticParams() {
  return getAllSeoSlugs().map((slug) => ({ "seo-slug": slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ "seo-slug": string }>;
}): Promise<Metadata> {
  const { "seo-slug": slug } = await params;
  const page = getSeoPage(slug);
  if (!page) return {};

  return {
    title: { absolute: page.title },
    description: page.metaDescription,
    keywords: page.keywords,
    alternates: { canonical: page.canonical },
    openGraph: {
      title: page.title,
      description: page.metaDescription,
      url: page.canonical,
      images: [{ url: page.ogImage, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: page.title,
      description: page.metaDescription,
      images: [page.ogImage],
    },
  };
}

function extractPrice(title: string): string {
  const match = title.match(/₹(\d+)/);
  return match ? match[1] : "69";
}

export default async function SeoPage({
  params,
}: {
  params: Promise<{ "seo-slug": string }>;
}) {
  const { "seo-slug": slug } = await params;
  const page = getSeoPage(slug);
  if (!page) notFound();

  const faqItems = page.faqOverride ?? DEFAULT_FAQ;

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "https://burger-empire.build.withdarsh.com" },
          { name: page.h1, url: page.canonical },
        ]}
      />
      <FAQSchema items={faqItems} />
      {page.type === "product" && (
        <ProductSchema
          name={page.h1}
          description={page.metaDescription}
          image={cloudinaryUrl(page.ogImage)}
          price={extractPrice(page.title)}
          sku={`BB-${page.slug.toUpperCase().slice(0, 8)}`}
          rating={4.3}
          reviewCount={500}
          url={page.canonical}
          inStock={true}
          dietType={["https://schema.org/VegetarianDiet"]}
        />
      )}

      <main className="max-w-3xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold mb-4">{page.h1}</h1>
        <p className="text-lg mb-4">{page.intro}</p>
        <p className="mb-6">{page.body}</p>

        {page.ctaUrl.startsWith("http") ? (
          <a
            href={page.ctaUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-red-600 text-white px-6 py-3 rounded-lg font-semibold"
          >
            {page.cta}
          </a>
        ) : (
          <Link
            href={page.ctaUrl}
            className="inline-block bg-red-600 text-white px-6 py-3 rounded-lg font-semibold"
          >
            {page.cta}
          </Link>
        )}

        {page.showMenu && (
          <div className="mt-10">
            <h2 className="text-xl font-semibold mb-3">Menu Highlights</h2>
            <ul className="space-y-2 text-gray-700">
              <li>Aloo Tikki Twist Burger — ₹69</li>
              <li>Classic Veg Burger — ₹99</li>
              <li>Crispy Veg Burger — ₹139</li>
              <li>Veg King Burger — ₹159</li>
              <li>Paneer Wrap — ₹169</li>
              <li>Peri Peri Fries — ₹109</li>
            </ul>
            <Link
              href="/menu/burgers"
              className="text-red-600 underline mt-2 inline-block"
            >
              See the full Burger Empire menu
            </Link>
          </div>
        )}

        {page.showOutlets && (
          <div className="mt-10">
            <h2 className="text-xl font-semibold mb-3">
              Burger Empire Outlets in Abc City
            </h2>
            <ul className="space-y-3">
              {OUTLETS.map((o) => (
                <li key={o.slug}>
                  <Link
                    href={`/outlets/${o.slug}`}
                    className="text-red-600 underline font-medium"
                  >
                    {o.name}
                  </Link>
                  <span className="text-gray-500 ml-2">
                    {o.address} · {o.timings} · {o.rating}★
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {page.relatedSlugs.length > 0 && (
          <div className="mt-10">
            <h2 className="text-xl font-semibold mb-3">Also See</h2>
            <ul className="space-y-1">
              {page.relatedSlugs.map((s) => {
                const related = getSeoPage(s);
                return related ? (
                  <li key={s}>
                    <Link href={`/${s}`} className="text-red-600 underline">
                      {related.h1}
                    </Link>
                  </li>
                ) : null;
              })}
            </ul>
          </div>
        )}

        <div className="mt-10">
          <h2 className="text-xl font-semibold mb-4">
            Frequently Asked Questions
          </h2>
          {faqItems.map((item, i) => (
            <div key={i} className="mb-4">
              <h3 className="font-medium">{item.question}</h3>
              <p className="text-gray-600">{item.answer}</p>
            </div>
          ))}
        </div>
      </main>
    </>
  );
}
