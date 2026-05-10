import { Metadata } from "next";
import { cloudinaryUrl } from "@/lib/cloudinary-url";
import { BreadcrumbSchema } from "@/components/seo/BreadcrumbSchema";
import BlogIndexClient from "./BlogIndexClient";
import { TZ } from "@/lib/tz";
import type { ContentPost } from "@buildwithdarsh/sdk";

export const metadata: Metadata = {
  title: "Blog — Burger Stories, Guides & Tips",
  description:
    "Stories, guides, and tips from Abc City's original burger brand. Read about burgers, food culture, student deals, and more.",
  alternates: { canonical: "https://burger-empire.build.withdarsh.com/blog" },
  openGraph: {
    title: "Burger Empire Blog — Stories from Abc City's Original Burger Brand",
    description:
      "Stories, guides, and tips from Abc City's original burger brand. Burgers, food culture, student deals, and more.",
    url: "https://burger-empire.build.withdarsh.com/blog",
    images: [{ url: cloudinaryUrl("burgerempire/images/og-home"), width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Burger Empire Blog — Stories & Guides",
    description:
      "Stories, guides, and tips from Abc City's original burger brand.",
    images: [cloudinaryUrl("burgerempire/images/og-home")],
  },
};

export default async function BlogPage() {
  let posts: ContentPost[] = [];
  try {
    const result = await TZ.storefront.content.list({ status: 'published' });
    posts = result.data;
  } catch {
    // Content API may not be available yet
  }

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "https://burger-empire.build.withdarsh.com" },
          { name: "Blog", url: "https://burger-empire.build.withdarsh.com/blog" },
        ]}
      />
      <BlogIndexClient posts={posts} />
    </>
  );
}
