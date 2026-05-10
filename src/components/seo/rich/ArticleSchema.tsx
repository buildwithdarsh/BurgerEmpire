import { cloudinaryUrl } from "@/lib/cloudinary-url";

interface ArticleSchemaProps {
  headline: string;
  description: string;
  image: string;
  datePublished: string;
  dateModified: string;
  authorName: string;
  url: string;
  keywords: string[];
}

export function ArticleSchema(props: ArticleSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": props.url,
    headline: props.headline,
    description: props.description,
    image: {
      "@type": "ImageObject",
      url: props.image,
      width: 1200,
      height: 630,
    },
    datePublished: props.datePublished,
    dateModified: props.dateModified,
    author: {
      "@type": "Person",
      name: props.authorName,
    },
    publisher: {
      "@type": "Organization",
      "@id": "https://burger-empire.build.withdarsh.com/#organization",
      name: "Burger Empire",
      logo: {
        "@type": "ImageObject",
        url: cloudinaryUrl("burgerempire/images/logo"),
        width: 200,
        height: 60,
      },
    },
    url: props.url,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": props.url,
    },
    keywords: props.keywords.join(", "),
    articleSection: "Food & Restaurants",
    inLanguage: "en-IN",
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
