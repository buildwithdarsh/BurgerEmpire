import { Metadata } from "next";
import { notFound } from "next/navigation";
import { cloudinaryUrl } from "@/lib/cloudinary-url";
import { ArticleSchema } from "@/components/seo/rich/ArticleSchema";
import { BreadcrumbSchema } from "@/components/seo/BreadcrumbSchema";
import BlogPostClient from "./BlogPostClient";
import { TZ } from "@/lib/tz";
import type { ContentPost } from "@buildwithdarsh/sdk";

async function fetchPost(slug: string): Promise<ContentPost | null> {
  try {
    return await TZ.storefront.content.getBySlug(slug);
  } catch {
    return null;
  }
}

export async function generateStaticParams() {
  try {
    const result = await TZ.storefront.content.list({ status: 'published' });
    const posts = result.data;
    return posts.map((p) => ({ slug: p.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await fetchPost(slug);
  if (!post || post.status !== "published") return {};

  const keywords = (() => {
    try {
      return typeof post.keywords === "string" ? JSON.parse(post.keywords) : post.keywords ?? [];
    } catch {
      return [];
    }
  })();

  return {
    title: post.title,
    description: post.metaDescription || post.excerpt || undefined,
    keywords,
    alternates: {
      canonical: post.canonical || `https://burger-empire.build.withdarsh.com/blog/${post.slug}`,
    },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.metaDescription || post.excerpt || undefined,
      url: post.canonical || `https://burger-empire.build.withdarsh.com/blog/${post.slug}`,
      images: post.ogImage ? [{ url: post.ogImage, width: 1200, height: 630 }] : undefined,
      publishedTime: post.datePublished ?? undefined,
      modifiedTime: post.dateModified ?? undefined,
      authors: post.author ? [post.author] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.metaDescription || post.excerpt || undefined,
      images: post.ogImage ? [post.ogImage] : undefined,
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await fetchPost(slug);
  if (!post || post.status !== "published") notFound();

  // Fetch related posts
  let relatedPosts: ContentPost[] = [];
  try {
    const result = await TZ.storefront.content.list({ status: 'published', limit: 3, exclude: slug });
    relatedPosts = result.data;
  } catch {
    // ignore
  }

  const postUrl = post.canonical || `https://burger-empire.build.withdarsh.com/blog/${post.slug}`;

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "https://burger-empire.build.withdarsh.com" },
          { name: "Blog", url: "https://burger-empire.build.withdarsh.com/blog" },
          { name: post.h1 || post.title, url: postUrl },
        ]}
      />
      <ArticleSchema
        headline={post.h1 || post.title}
        description={post.metaDescription || post.excerpt || ""}
        image={post.ogImage ? cloudinaryUrl(post.ogImage) : cloudinaryUrl("burgerempire/images/og-home")}
        datePublished={post.datePublished || post.createdAt}
        dateModified={post.dateModified || post.updatedAt}
        authorName={post.author ?? ""}
        url={postUrl}
        keywords={(() => {
          try {
            return typeof post.keywords === "string" ? JSON.parse(post.keywords) : post.keywords ?? [];
          } catch {
            return [];
          }
        })()}
      />
      <BlogPostClient post={post} relatedPosts={relatedPosts} />
    </>
  );
}
