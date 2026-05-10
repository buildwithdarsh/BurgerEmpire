interface SpeakableSchemaProps {
  cssSelectors: string[];
  url: string;
}

export function SpeakableSchema(props: SpeakableSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: props.cssSelectors,
    },
    url: props.url,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
