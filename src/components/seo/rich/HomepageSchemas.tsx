import { OUTLETS } from "@/lib/outlets";
import { cloudinaryUrl } from "@/lib/cloudinary-url";

export function HomepageSchemas() {
  const schema = [
    // 1. Organization
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      "@id": "https://burger-empire.build.withdarsh.com/#organization",
      name: "Burger Empire",
      alternateName: ["Burger Empire Abc City", "Burger Empire India"],
      url: "https://burger-empire.build.withdarsh.com",
      logo: {
        "@type": "ImageObject",
        "@id": "https://burger-empire.build.withdarsh.com/#logo",
        url: cloudinaryUrl("burgerempire/images/logo"),
        contentUrl: cloudinaryUrl("burgerempire/images/logo"),
        width: 200,
        height: 60,
        caption: "Burger Empire",
      },
      image: { "@id": "https://burger-empire.build.withdarsh.com/#logo" },
      description:
        "Burger Empire is the original burger brand, founded in 2018. Veg-first kitchen, burgers from ₹69, 6 outlets across Abc City, Abc State.",
      foundingDate: "2018",
      foundingLocation: {
        "@type": "Place",
        name: "Abc City, Abc State, India",
      },
      address: {
        "@type": "PostalAddress",
        streetAddress: "B-99, Near Main Garden, Abc Nagar",
        addressLocality: "Abc City",
        addressRegion: "Abc State",
        postalCode: "100001",
        addressCountry: "IN",
      },
      contactPoint: [
        {
          "@type": "ContactPoint",
          contactType: "customer service",
          email: "hello@build.withdarsh.com",
          availableLanguage: ["English", "Hindi"],
          areaServed: "IN-MP",
        },
        {
          "@type": "ContactPoint",
          email: "hello@build.withdarsh.com",
          contactType: "sales",
        },
      ],
      sameAs: [
        "mailto:hello@build.withdarsh.com",
      ],
      numberOfEmployees: {
        "@type": "QuantitativeValue",
        minValue: 30,
        maxValue: 60,
      },
    },

    // 2. All outlet LocalBusiness schemas
    ...OUTLETS.map((outlet) => ({
      "@context": "https://schema.org",
      "@type": "FastFoodRestaurant",
      "@id": `https://burger-empire.build.withdarsh.com/outlets/${outlet.slug}`,
      name: outlet.name,
      url: `https://burger-empire.build.withdarsh.com/outlets/${outlet.slug}`,
      image: cloudinaryUrl(outlet.image),
      description: outlet.description,
      telephone: outlet.telephone,
      priceRange: "₹",
      currenciesAccepted: "INR",
      paymentAccepted: ["Cash", "Credit Card", "Debit Card", "UPI"],
      servesCuisine: ["Burgers", "Wraps", "Fast Food", "Vegetarian"],
      menu: "https://burger-empire.build.withdarsh.com/menu/burgers",
      hasMap: `https://www.google.com/maps/search/${encodeURIComponent(outlet.name + " Abc City")}`,
      address: {
        "@type": "PostalAddress",
        streetAddress: outlet.address,
        addressLocality: "Abc City",
        addressRegion: "Abc State",
        postalCode: outlet.postalCode,
        addressCountry: "IN",
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: outlet.lat,
        longitude: outlet.lng,
      },
      openingHoursSpecification:
        outlet.slug === "burger-empire-lashkar-abc-city"
          ? [
              {
                "@type": "OpeningHoursSpecification",
                dayOfWeek: [
                  "https://schema.org/Monday",
                  "https://schema.org/Tuesday",
                  "https://schema.org/Wednesday",
                  "https://schema.org/Thursday",
                  "https://schema.org/Friday",
                  "https://schema.org/Saturday",
                  "https://schema.org/Sunday",
                ],
                opens: "12:00",
                closes: "01:00",
              },
            ]
          : [
              {
                "@type": "OpeningHoursSpecification",
                dayOfWeek: [
                  "https://schema.org/Monday",
                  "https://schema.org/Tuesday",
                  "https://schema.org/Wednesday",
                  "https://schema.org/Thursday",
                  "https://schema.org/Friday",
                  "https://schema.org/Saturday",
                  "https://schema.org/Sunday",
                ],
                opens: "11:00",
                closes: "23:00",
              },
            ],
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: outlet.rating,
        reviewCount: outlet.reviewCount,
        bestRating: 5,
        worstRating: 1,
      },
      parentOrganization: {
        "@id": "https://burger-empire.build.withdarsh.com/#organization",
      },
      potentialAction: {
        "@type": "OrderAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: outlet.zomatoUrl,
          actionPlatform: [
            "http://schema.org/DesktopWebPlatform",
            "http://schema.org/MobileWebPlatform",
          ],
        },
      },
    })),
  ];

  return (
    <>
      {schema.map((s, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(s) }}
        />
      ))}
    </>
  );
}
