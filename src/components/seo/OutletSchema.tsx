interface OutletSchemaProps {
  name: string;
  url: string;
  address: string;
  area: string;
  postalCode: string;
  lat: number;
  lng: number;
  telephone: string;
  openingHours: string[];
  rating: number;
  reviewCount: number;
  priceRange: string;
  image: string;
}

export function OutletSchema(props: OutletSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FastFoodRestaurant",
    "@id": props.url,
    name: props.name,
    url: props.url,
    image: props.image,
    description: `${props.name} — Burger Empire outlet in ${props.area}, Abc City. Veg burgers from ₹69. Open for dine-in and delivery.`,
    address: {
      "@type": "PostalAddress",
      streetAddress: props.address,
      addressLocality: "Abc City",
      addressRegion: "Abc State",
      postalCode: props.postalCode,
      addressCountry: "IN",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: props.lat,
      longitude: props.lng,
    },
    telephone: props.telephone,
    openingHoursSpecification: props.openingHours,
    servesCuisine: ["Burgers", "Fast Food", "Wraps", "Vegetarian"],
    priceRange: props.priceRange,
    currenciesAccepted: "INR",
    paymentAccepted: ["Cash", "Credit Card", "UPI"],
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: props.rating,
      reviewCount: props.reviewCount,
      bestRating: 5,
      worstRating: 1,
    },
    hasMap: `https://www.google.com/maps/search/${encodeURIComponent(props.name + " " + props.area + " Abc City")}`,
    menu: "https://burger-empire.build.withdarsh.com/menu/burgers",
    parentOrganization: {
      "@type": "Organization",
      name: "Burger Empire",
      url: "https://burger-empire.build.withdarsh.com",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
