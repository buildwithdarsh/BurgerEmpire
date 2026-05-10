interface ProductSchemaProps {
  name: string;
  description: string;
  image: string;
  price: string;
  sku: string;
  rating: number;
  reviewCount: number;
  url: string;
  inStock: boolean;
  dietType: string[];
}

export function ProductSchema(props: ProductSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": `${props.url}#product`,
    name: props.name,
    description: props.description,
    image: [props.image],
    sku: props.sku,
    brand: {
      "@type": "Brand",
      name: "Burger Empire",
    },
    category: "Fast Food / Burgers",
    suitableForDiet: props.dietType,
    offers: {
      "@type": "Offer",
      url: props.url,
      priceCurrency: "INR",
      price: props.price,
      priceValidUntil: "2026-12-31",
      itemCondition: "https://schema.org/NewCondition",
      availability: props.inStock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      seller: {
        "@type": "Organization",
        name: "Burger Empire",
      },
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: props.rating,
      reviewCount: props.reviewCount,
      bestRating: 5,
      worstRating: 1,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
