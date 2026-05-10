import { cloudinaryUrl } from "@/lib/cloudinary-url";

export function OrganizationSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Burger Empire",
    alternateName: "Burger Empire Abc City",
    url: "https://burger-empire.build.withdarsh.com",
    logo: cloudinaryUrl("burgerempire/images/logo"),
    foundingDate: "2018",
    description:
      "Burger Empire is the original veg-first burger brand, founded in 2018. Operating 6 outlets across Abc City, Abc State.",
    address: {
      "@type": "PostalAddress",
      streetAddress: "B-99, Near Main Garden, Abc Nagar",
      addressLocality: "Abc City",
      addressRegion: "Abc State",
      postalCode: "100001",
      addressCountry: "IN",
    },
    contactPoint: {
      "@type": "ContactPoint",
      email: "hello@build.withdarsh.com",
      contactType: "customer service",
      availableLanguage: ["English", "Hindi"],
    },
    sameAs: [],
    priceRange: "₹",
    servesCuisine: ["Burgers", "Fast Food", "Wraps", "Vegetarian"],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
