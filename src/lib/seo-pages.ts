export type SeoPageType =
  | "keyword"
  | "product"
  | "location"
  | "franchise"
  | "comparison";

export interface SeoPage {
  slug: string;
  type: SeoPageType;
  title: string;
  h1: string;
  metaDescription: string;
  ogImage: string;
  keywords: string[];
  intro: string;
  body: string;
  cta: string;
  ctaUrl: string;
  relatedSlugs: string[];
  showOutlets: boolean;
  showMenu: boolean;
  faqOverride?: {
    question: string;
    answer: string;
  }[];
  canonical: string;
  priority: number;
  changeFrequency: "daily" | "weekly" | "monthly";
}

export const SEO_PAGES: SeoPage[] = [
  {
    slug: "best-burgers-in-abc-city",
    type: "keyword",
    title: "Burgers in Abc City 2026 — Burger Empire | Rated 4.2★",
    h1: "Top-Rated Burgers in Abc City",
    metaDescription:
      "Burger Empire — Abc City's 4.2★-rated burger restaurant across 20,000+ reviews. Veg burgers from ₹69. 6 outlets. Order now.",
    ogImage: "/images/og/best-burgers-in-abc-city.jpg",
    keywords: ["burger abc-city", "top burger abc-city", "top rated burger abc-city"],
    intro:
      "If you're looking for top-rated burgers in Abc City, Burger Empire has been the answer since 2018. We've served over 35,000 orders in 2025 alone, earning a 4.2★ average rating across 20,000+ verified reviews on Zomato and Swiggy.",
    body:
      "Our menu starts at ₹69 with the Aloo Tikki Twist Burger — Abc City's most reordered veg burger. Every item is made fresh per order. No reheating. No shortcuts. With 6 outlets across City Center, Lashkar, Mahalgaon, DD Nagar, Morar, and Kila Road, there's always a Burger Empire near you.",
    cta: "Order Now",
    ctaUrl: "/order-online",
    relatedSlugs: [
      "veg-burgers-abc-city",
      "cheap-burgers-abc-city",
      "burger-delivery-abc-city",
    ],
    showOutlets: true,
    showMenu: true,
    canonical: "https://burger-empire.build.withdarsh.com/best-burgers-in-abc-city",
    priority: 0.9,
    changeFrequency: "monthly",
  },
  {
    slug: "veg-burgers-abc-city",
    type: "keyword",
    title: "Veg Burgers in Abc City — 100% Vegetarian | Burger Empire",
    h1: "Veg Burgers in Abc City",
    metaDescription:
      "Looking for veg burgers in Abc City? Burger Empire is a 4.2★-rated veg-first kitchen with burgers from ₹69. Aloo Tikki, Crispy Veg, Veg King & more. 6 outlets, order on Zomato.",
    ogImage: "/images/og/veg-burgers-abc-city.jpg",
    keywords: [
      "veg burger abc-city",
      "vegetarian burger abc-city",
      "pure veg burger abc-city",
    ],
    intro:
      "Burger Empire is Abc City's only major veg-first burger brand. Over 80% of our menu is vegetarian, and several outlets are 100% veg. We use no meat stock, no hidden ingredients.",
    body:
      "Our vegetarian menu includes the Aloo Tikki Twist Burger (₹69), Crispy Veg Burger (₹139), Veg King Burger (₹159), and Paneer Wrap (₹169). Every item is prepared in a dedicated veg kitchen. Perfect for families, students, and anyone who wants clean food at an honest price.",
    cta: "See Veg Menu",
    ctaUrl: "/menu/veg-burgers",
    relatedSlugs: [
      "best-burgers-in-abc-city",
      "aloo-tikki-burger-abc-city",
      "cheap-burgers-abc-city",
    ],
    showOutlets: false,
    showMenu: true,
    canonical: "https://burger-empire.build.withdarsh.com/veg-burgers-abc-city",
    priority: 0.88,
    changeFrequency: "monthly",
  },
  {
    slug: "cheap-burgers-abc-city",
    type: "keyword",
    title: "Cheap Burgers in Abc City from ₹69 — Burger Empire",
    h1: "Cheap Burgers in Abc City",
    metaDescription:
      "Cheap burgers in Abc City starting at just ₹69. Burger Empire offers honest prices, fresh ingredients, and 6 outlets across the city. Zomato rated 'Very Affordable'.",
    ogImage: "/images/og/cheap-burgers-abc-city.jpg",
    keywords: [
      "cheap burger abc-city",
      "affordable burger abc-city",
      "budget food abc-city",
    ],
    intro:
      "At Burger Empire, ₹69 gets you a freshly made Aloo Tikki Twist Burger — not a frozen patty reheated from a bag. We've kept our prices honest since 2018 because we believe good food shouldn't be expensive.",
    body:
      "Our value menu: Aloo Tikki Twist ₹69 · Classic Veg Burger ₹99 · Crispy Veg ₹139 · Veg King ₹159 · Paneer Wrap ₹169. Combo deals available from ₹149. No hidden charges. No delivery-only inflation.",
    cta: "See Full Menu",
    ctaUrl: "/menu/burgers",
    relatedSlugs: [
      "student-food-abc-city",
      "best-burgers-in-abc-city",
      "veg-burgers-abc-city",
    ],
    showOutlets: false,
    showMenu: true,
    canonical: "https://burger-empire.build.withdarsh.com/cheap-burgers-abc-city",
    priority: 0.88,
    changeFrequency: "monthly",
  },
  {
    slug: "burger-delivery-abc-city",
    type: "location",
    title: "Burger Delivery in Abc City — Fast Delivery | Burger Empire",
    h1: "Burger Delivery in Abc City",
    metaDescription:
      "Order burger delivery in Abc City from Burger Empire. Available on Zomato and Swiggy from 6 outlets — City Center, Lashkar, Mahalgaon, DD Nagar, Morar, Kila Road. Burgers from ₹69.",
    ogImage: "/images/og/burger-delivery-abc-city.jpg",
    keywords: [
      "burger delivery abc-city",
      "burger order online abc-city",
      "food delivery abc-city burger",
    ],
    intro:
      "Burger Empire delivers to most areas of Abc City via Zomato and Swiggy. With 6 outlets spread across the city, chances are there's a kitchen within 3–4 km of you.",
    body:
      "Delivery is available from City Center (Abc Nagar), Lashkar (Area B), Mahalgaon (Main Road), DD Nagar (near City Park), Morar, and Kila Road. Most orders are delivered within 30–40 minutes. Track in real time on Zomato or Swiggy.",
    cta: "Order on Zomato",
    ctaUrl: "https://www.zomato.com/abc-city/restaurants/burger-empire",
    relatedSlugs: ["best-burgers-in-abc-city", "late-night-food-abc-city"],
    showOutlets: true,
    showMenu: false,
    canonical: "https://burger-empire.build.withdarsh.com/burger-delivery-abc-city",
    priority: 0.85,
    changeFrequency: "monthly",
  },
  {
    slug: "late-night-food-abc-city",
    type: "location",
    title: "Late Night Food Abc City — Open Till 1 AM | Burger Empire",
    h1: "Late Night Food in Abc City",
    metaDescription:
      "Hungry late at night in Abc City? Burger Empire Lashkar is open till 1 AM. Burgers, wraps, fries for delivery or pickup.",
    ogImage: "/images/og/late-night-food-abc-city.jpg",
    keywords: [
      "late night food abc-city",
      "food open late abc-city",
      "midnight food abc-city",
    ],
    intro:
      "Most food in Abc City shuts by 10 PM. Burger Empire Lashkar stays open till 1 AM — the only burger brand in Abc City with confirmed late-night hours.",
    body:
      "Whether you're coming back from a late shift, studying for exams, or just craving something after midnight — the Lashkar outlet on Area B has you covered. Full menu available till closing. Order via Zomato or Swiggy, or walk in.",
    cta: "Order Late Night",
    ctaUrl: "https://www.zomato.com/abc-city/burger-empire-lashkar/info",
    relatedSlugs: ["burger-delivery-abc-city", "student-food-abc-city"],
    showOutlets: false,
    showMenu: false,
    faqOverride: [
      {
        question:
          "Which Burger Empire outlet in Abc City is open latest?",
        answer:
          "Burger Empire Lashkar (Area B) is open till 1 AM every day — the latest of all 6 Abc City outlets.",
      },
      {
        question:
          "Is there food delivery in Abc City after midnight?",
        answer:
          "Yes. Burger Empire Lashkar accepts Zomato and Swiggy orders till 1 AM.",
      },
    ],
    canonical: "https://burger-empire.build.withdarsh.com/late-night-food-abc-city",
    priority: 0.8,
    changeFrequency: "monthly",
  },
  {
    slug: "student-food-abc-city",
    type: "keyword",
    title:
      "Cheap Student Food Abc City — Burgers from ₹69 | Burger Empire",
    h1: "Affordable Student Food in Abc City",
    metaDescription:
      "Cheap food for students in Abc City. Burger Empire has burgers from ₹69, combo deals from ₹149, and outlets near colleges. Zomato rated 'Student Crowd, Very Affordable'.",
    ogImage: "/images/og/student-food-abc-city.jpg",
    keywords: [
      "student food abc-city",
      "cheap food abc-city students",
      "affordable food near college abc-city",
    ],
    intro:
      "Burger Empire is Abc City's go-to for students on a budget. A full meal — burger + fries + drink — costs ₹149 in our combo deals. No student discount card required. Always this price.",
    body:
      "Our Mahalgaon outlet (Main Road) is popular with students from nearby colleges. The DD Nagar outlet is close to coaching centres. Both are rated 4.0★+ on Zomato and consistently tagged as 'student-friendly' and 'great value'.",
    cta: "See Combo Deals",
    ctaUrl: "/menu/combos",
    relatedSlugs: ["cheap-burgers-abc-city", "veg-burgers-abc-city"],
    showOutlets: false,
    showMenu: true,
    canonical: "https://burger-empire.build.withdarsh.com/student-food-abc-city",
    priority: 0.8,
    changeFrequency: "monthly",
  },
  {
    slug: "aloo-tikki-burger-abc-city",
    type: "product",
    title:
      "Aloo Tikki Burger Abc City ₹69 — Burger Empire's Bestseller",
    h1: "Aloo Tikki Burger in Abc City",
    metaDescription:
      "The Aloo Tikki Twist Burger at Burger Empire Abc City is just ₹69. Crispy homestyle aloo tikki patty, fresh veggies, signature sauce. Abc City's most reordered burger. Order now.",
    ogImage: "/images/og/aloo-tikki-burger-abc-city.jpg",
    keywords: [
      "aloo tikki burger abc-city",
      "aloo burger abc-city",
      "cheapest burger abc-city",
    ],
    intro:
      "The Aloo Tikki Twist Burger is Burger Empire's original, and Abc City's most reordered veg burger. At ₹69, it's the most affordable freshly-made burger in the city.",
    body:
      "Made with a hand-seasoned aloo tikki patty, shredded lettuce, fresh tomato, and our signature sauce — all in a soft toasted bun. No frozen patties. No shortcuts. Available at all 6 Burger Empire outlets in Abc City, and for delivery via Zomato and Swiggy.",
    cta: "Order Now — ₹69",
    ctaUrl: "/order-online",
    relatedSlugs: [
      "best-burgers-in-abc-city",
      "cheap-burgers-abc-city",
      "veg-burgers-abc-city",
    ],
    showOutlets: false,
    showMenu: true,
    canonical: "https://burger-empire.build.withdarsh.com/aloo-tikki-burger-abc-city",
    priority: 0.82,
    changeFrequency: "monthly",
  },
  {
    slug: "paneer-wrap-abc-city",
    type: "product",
    title:
      "Paneer Wrap Abc City ₹169 — Top-Rated Veg Wrap | Burger Empire",
    h1: "Paneer Wrap in Abc City",
    metaDescription:
      "Burger Empire's Paneer Wrap in Abc City is priced at ₹169. Spiced paneer filling, fresh veggies, mint chutney in a soft wrap. Order on Zomato or Swiggy.",
    ogImage: "/images/og/paneer-wrap-abc-city.jpg",
    keywords: [
      "paneer wrap abc-city",
      "veg wrap abc-city",
      "wrap food abc-city",
    ],
    intro:
      "The Paneer Wrap at Burger Empire is one of the most reordered non-burger items on our menu. Soft flour tortilla, spiced paneer, fresh onion, capsicum, and mint chutney.",
    body:
      "Priced at ₹169, it's a filling meal on its own. Available at all 6 outlets and on Zomato and Swiggy. Pair it with Peri Peri Fries (₹109) for a complete meal under ₹300.",
    cta: "Order Now",
    ctaUrl: "/order-online",
    relatedSlugs: ["veg-burgers-abc-city", "peri-peri-fries-abc-city"],
    showOutlets: false,
    showMenu: true,
    canonical: "https://burger-empire.build.withdarsh.com/paneer-wrap-abc-city",
    priority: 0.75,
    changeFrequency: "monthly",
  },
  {
    slug: "peri-peri-fries-abc-city",
    type: "product",
    title:
      "Peri Peri Fries Abc City ₹109 — Burger Empire's #1 Side",
    h1: "Peri Peri Fries in Abc City",
    metaDescription:
      "Burger Empire's Peri Peri Fries in Abc City — crispy fries tossed in peri peri spice, ₹109. Abc City's most ordered side dish. Order on Zomato or Swiggy.",
    ogImage: "/images/og/peri-peri-fries-abc-city.jpg",
    keywords: [
      "peri peri fries abc-city",
      "spicy fries abc-city",
      "best fries abc-city",
    ],
    intro:
      "Our Peri Peri Fries are the most ordered side at Burger Empire Abc City — crispy golden fries tossed in a house peri peri spice blend for ₹109.",
    body:
      "Available as a standalone side or in combo deals. Pairs perfectly with any burger or wrap. The spice level is medium — not too mild, not too hot. Loaded Fries (with cheese sauce) also available at ₹149.",
    cta: "Order Now",
    ctaUrl: "/order-online",
    relatedSlugs: ["best-burgers-in-abc-city", "paneer-wrap-abc-city"],
    showOutlets: false,
    showMenu: true,
    canonical: "https://burger-empire.build.withdarsh.com/peri-peri-fries-abc-city",
    priority: 0.75,
    changeFrequency: "monthly",
  },
  {
    slug: "burger-franchise-abc-city",
    type: "franchise",
    title:
      "Burger Franchise in Abc City — Open a Burger Empire | Enquire Now",
    h1: "Burger Franchise Opportunity in Abc City",
    metaDescription:
      "Want to open a burger franchise in Abc City? Burger Empire offers franchise opportunities with proven operations since 2018. 6 outlets running profitably. Enquire now.",
    ogImage: "/images/og/burger-franchise-abc-city.jpg",
    keywords: [
      "burger franchise abc-city",
      "food franchise abc-city",
      "qsr franchise abc-city",
    ],
    intro:
      "Burger Empire has operated successfully in Abc City since 2018, scaling from 1 outlet to 6. We're now offering franchise partnerships to qualified operators in Abc City and nearby cities.",
    body:
      "Our franchise model includes full setup support, supply chain access, brand and marketing materials, and ongoing operations guidance. Ideal for first-time food entrepreneurs and experienced restaurateurs alike. Fill the form at burger-empire.build.withdarsh.com/franchise-opportunity to receive our franchise brochure.",
    cta: "Enquire About Franchise",
    ctaUrl: "/handshake",
    relatedSlugs: ["burger-franchise-abc-state"],
    showOutlets: false,
    showMenu: false,
    canonical: "https://burger-empire.build.withdarsh.com/burger-franchise-abc-city",
    priority: 0.7,
    changeFrequency: "monthly",
  },
  {
    slug: "burger-franchise-abc-state",
    type: "franchise",
    title:
      "Burger Franchise Abc State — Burger Empire | Apply Now",
    h1: "Burger Franchise Opportunity in Abc State",
    metaDescription:
      "Burger Empire is expanding across Abc State. Franchise opportunities available in Abc City and other cities across Abc State. QSR model, proven brand since 2018.",
    ogImage: "/images/og/burger-franchise-mp.jpg",
    keywords: [
      "burger franchise abc state",
      "food franchise mp",
      "qsr franchise abc state",
    ],
    intro:
      "Burger Empire is a proven quick service restaurant brand from Abc City, now expanding across Abc State. We're looking for franchise partners across Abc State and neighbouring regions.",
    body:
      "With 6 profitable outlets running in Abc City since 2018 and 35,000+ orders served in 2025, our operations model is tested and documented. Franchise partners receive complete brand, supply, and ops support from day one.",
    cta: "Apply for Franchise",
    ctaUrl: "/handshake",
    relatedSlugs: ["burger-franchise-abc-city"],
    showOutlets: false,
    showMenu: false,
    canonical:
      "https://burger-empire.build.withdarsh.com/burger-franchise-abc-state",
    priority: 0.7,
    changeFrequency: "monthly",
  },
];

export function getSeoPage(slug: string): SeoPage | undefined {
  return SEO_PAGES.find((p) => p.slug === slug);
}

export function getAllSeoSlugs(): string[] {
  return SEO_PAGES.map((p) => p.slug);
}
