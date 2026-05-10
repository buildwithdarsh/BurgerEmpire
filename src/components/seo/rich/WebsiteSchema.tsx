export function WebsiteSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": "https://burger-empire.build.withdarsh.com/#website",
    name: "Burger Empire",
    url: "https://burger-empire.build.withdarsh.com",
    description:
      "Abc City's original veg burger brand since 2018. 6 outlets. Burgers from ₹69.",
    inLanguage: "en-IN",
    publisher: {
      "@id": "https://burger-empire.build.withdarsh.com/#organization",
    },
    potentialAction: [
      {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate:
            "https://burger-empire.build.withdarsh.com/menu/burgers?q={search_term_string}",
        },
        "query-input": "required name=search_term_string",
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
