import { MetadataRoute } from "next";
import { TZ } from "@/lib/tz";

const BASE = "https://burger-empire.build.withdarsh.com";

const staticRoutes: MetadataRoute.Sitemap = [
  { url: BASE, priority: 1.0, changeFrequency: "weekly" },
  { url: `${BASE}/menu/burgers`, priority: 0.95, changeFrequency: "weekly" },
  { url: `${BASE}/combo-deals`, priority: 0.9, changeFrequency: "weekly" },
  { url: `${BASE}/order-online`, priority: 0.95, changeFrequency: "daily" },
  { url: `${BASE}/find-us`, priority: 0.9, changeFrequency: "monthly" },
  { url: `${BASE}/our-story`, priority: 0.7, changeFrequency: "monthly" },
  { url: `${BASE}/healthy`, priority: 0.8, changeFrequency: "monthly" },
  { url: `${BASE}/handshake`, priority: 0.75, changeFrequency: "monthly" },
  { url: `${BASE}/outlets/burger-empire-city-center-abc-city`, priority: 0.95, changeFrequency: "weekly" },
  { url: `${BASE}/outlets/burger-empire-lashkar-abc-city`, priority: 0.9, changeFrequency: "weekly" },
  { url: `${BASE}/outlets/burger-empire-mahalgaon-abc-city`, priority: 0.9, changeFrequency: "weekly" },
  { url: `${BASE}/outlets/burger-empire-dd-nagar-abc-city`, priority: 0.85, changeFrequency: "weekly" },
  { url: `${BASE}/outlets/burger-empire-morar-abc-city`, priority: 0.85, changeFrequency: "weekly" },
  { url: `${BASE}/outlets/burger-empire-kila-road-abc-city`, priority: 0.85, changeFrequency: "weekly" },
  { url: `${BASE}/best-burgers-in-abc-city`, priority: 0.9, changeFrequency: "monthly" },
  { url: `${BASE}/veg-burgers-abc-city`, priority: 0.88, changeFrequency: "monthly" },
  { url: `${BASE}/cheap-burgers-abc-city`, priority: 0.88, changeFrequency: "monthly" },
  { url: `${BASE}/burger-delivery-abc-city`, priority: 0.85, changeFrequency: "monthly" },
  { url: `${BASE}/late-night-food-abc-city`, priority: 0.8, changeFrequency: "monthly" },
  { url: `${BASE}/student-food-abc-city`, priority: 0.8, changeFrequency: "monthly" },
  { url: `${BASE}/aloo-tikki-burger-abc-city`, priority: 0.82, changeFrequency: "monthly" },
  { url: `${BASE}/paneer-wrap-abc-city`, priority: 0.75, changeFrequency: "monthly" },
  { url: `${BASE}/peri-peri-fries-abc-city`, priority: 0.75, changeFrequency: "monthly" },
  { url: `${BASE}/burger-franchise-abc-city`, priority: 0.7, changeFrequency: "monthly" },
  { url: `${BASE}/burger-franchise-abc-state`, priority: 0.7, changeFrequency: "monthly" },
  { url: `${BASE}/blog`, priority: 0.65, changeFrequency: "weekly" },
  { url: `${BASE}/gift-cards`, priority: 0.7, changeFrequency: "monthly" },
  { url: `${BASE}/reservations`, priority: 0.7, changeFrequency: "monthly" },
  { url: `${BASE}/meal-plans`, priority: 0.65, changeFrequency: "monthly" },
  { url: `${BASE}/help`, priority: 0.5, changeFrequency: "monthly" },
  { url: `${BASE}/privacy`, priority: 0.3, changeFrequency: "yearly" },
  { url: `${BASE}/terms`, priority: 0.3, changeFrequency: "yearly" },
  { url: `${BASE}/support`, priority: 0.4, changeFrequency: "monthly" },
  { url: `${BASE}/student`, priority: 0.8, changeFrequency: "monthly" },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  let blogRoutes: MetadataRoute.Sitemap = [];
  try {
    const result = await TZ.storefront.content.list({ status: 'published' } as any);
    const posts = (result as any)?.data ?? result ?? [];
    blogRoutes = posts.map((post: { slug: string; updatedAt?: string }) => ({
      url: `${BASE}/blog/${post.slug}`,
      lastModified: post.updatedAt ? new Date(post.updatedAt) : now,
      priority: 0.7,
      changeFrequency: "monthly" as const,
    }));
  } catch {
    // Content API may not be available yet
  }

  return [
    ...staticRoutes.map((r) => ({ ...r, lastModified: now })),
    ...blogRoutes,
  ];
}
