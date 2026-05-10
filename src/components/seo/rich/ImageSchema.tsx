interface ImageObjectSchemaProps {
  url: string;
  caption: string;
  width: number;
  height: number;
  name: string;
  description?: string;
  pageUrl: string;
}

export function ImageObjectSchema(props: ImageObjectSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "ImageObject",
    url: props.url,
    name: props.name,
    caption: props.caption,
    description: props.description,
    width: { "@type": "QuantitativeValue", value: props.width },
    height: { "@type": "QuantitativeValue", value: props.height },
    representativeOfPage: true,
    contentUrl: props.url,
    acquireLicensePage: "https://burger-empire.build.withdarsh.com",
    creditText: "Burger Empire Abc City",
    copyrightNotice: `© ${new Date().getFullYear()} Burger Empire`,
    creator: {
      "@type": "Organization",
      name: "Burger Empire",
      url: "https://burger-empire.build.withdarsh.com",
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": props.pageUrl,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
