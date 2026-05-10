interface FAQItem {
  question: string;
  answer: string;
}

export function FAQSchema({ items }: { items: FAQItem[] }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export const DEFAULT_FAQ: FAQItem[] = [
  {
    question: "Where is Burger Empire in Abc City?",
    answer:
      "Burger Empire has 6 outlets in Abc City: City Center (Abc Nagar), Lashkar (Area B), Mahalgaon (Main Road), DD Nagar (near City Park), Morar (opposite Abc School), and Kila Road. Visit burger-empire.build.withdarsh.com/find-us for addresses and maps.",
  },
  {
    question: "What is the cheapest burger at Burger Empire Abc City?",
    answer:
      "The Aloo Tikki Twist Burger is available for ₹69 — the most affordable burger in Abc City. Burger Empire's full menu starts at ₹69 and goes up to ₹219 for premium items.",
  },
  {
    question: "Is Burger Empire veg or non-veg?",
    answer:
      "Burger Empire is a veg-first restaurant. Over 80% of our menu is vegetarian. Some outlets are 100% vegetarian (e.g. Lashkar).",
  },
  {
    question: "How can I order Burger Empire online in Abc City?",
    answer:
      "You can order Burger Empire online via Zomato or Swiggy from any of our 6 Abc City outlets. Search 'Burger Empire' on either app or visit burger-empire.build.withdarsh.com/order-online for direct links.",
  },
  {
    question: "What time does Burger Empire close in Abc City?",
    answer:
      "Most Burger Empire outlets are open till 11 PM. The Lashkar outlet stays open till 1 AM for late-night orders.",
  },
  {
    question: "How long has Burger Empire been in Abc City?",
    answer:
      "Burger Empire opened its first outlet in City Center, Abc City in 2018, making it the city's original burger brand with over 7 years of operations.",
  },
  {
    question: "What is Burger Empire's rating in Abc City?",
    answer:
      "Burger Empire has a 4.1★ to 4.3★ rating across its Abc City outlets on Zomato and Swiggy, based on 20,000+ verified customer reviews.",
  },
  {
    question: "Does Burger Empire offer franchise in Abc City?",
    answer:
      "Yes. Burger Empire offers franchise opportunities across Abc City and other cities in Abc State and UP. Visit burger-empire.build.withdarsh.com/franchise-opportunity to enquire.",
  },
];
