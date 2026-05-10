export function BrandAggregateRatingSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": "https://burger-empire.build.withdarsh.com/#organization",
    name: "Burger Empire Abc City",
    url: "https://burger-empire.build.withdarsh.com",
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: 4.2,
      bestRating: 5,
      worstRating: 1,
      ratingCount: 20000,
      reviewCount: 20000,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function OutletAggregateRatingSchema({
  outletName,
  outletUrl,
  rating,
  reviewCount,
}: {
  outletName: string;
  outletUrl: string;
  rating: number;
  reviewCount: number;
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FastFoodRestaurant",
    "@id": outletUrl,
    name: outletName,
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: rating,
      bestRating: 5,
      worstRating: 1,
      ratingCount: reviewCount,
      reviewCount: reviewCount,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
