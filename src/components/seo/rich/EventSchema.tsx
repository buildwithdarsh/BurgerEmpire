interface EventSchemaProps {
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  locationName: string;
  locationAddress: string;
  url: string;
  image: string;
  offers?: {
    price: string;
    priceCurrency: string;
    url: string;
    validFrom: string;
    availability: string;
  };
}

export function EventSchema(props: EventSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: props.name,
    description: props.description,
    startDate: props.startDate,
    endDate: props.endDate,
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode:
      "https://schema.org/OfflineEventAttendanceMode",
    location: {
      "@type": "Place",
      name: props.locationName,
      address: {
        "@type": "PostalAddress",
        streetAddress: props.locationAddress,
        addressLocality: "Abc City",
        addressRegion: "Abc State",
        addressCountry: "IN",
      },
    },
    image: [props.image],
    url: props.url,
    organizer: {
      "@type": "Organization",
      name: "Burger Empire",
      url: "https://burger-empire.build.withdarsh.com",
    },
    offers: props.offers
      ? {
          "@type": "Offer",
          price: props.offers.price,
          priceCurrency: props.offers.priceCurrency,
          url: props.offers.url,
          validFrom: props.offers.validFrom,
          availability: props.offers.availability,
        }
      : undefined,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
