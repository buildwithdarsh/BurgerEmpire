export const OUTLETS = [
  {
    slug: "burger-empire-city-center-gwalior",
    name: "Burger Empire City Center",
    area: "City Center",
    address: "City Center, Patel Nagar, Mahalgaon, Gwalior",
    postalCode: "474011",
    lat: 26.2183,
    lng: 78.1828,
    timings: "11:00 AM – 11:00 PM",
    openingHours: ["Mo-Su 11:00-23:00"],
    telephone: "+91-9685182522",
    rating: 4.1,
    reviewCount: 15800,
    priceRange: "₹",
    zomatoUrl:
      "https://www.zomato.com/gwalior/burger-empire-city-center",
    swiggyUrl:
      "https://www.swiggy.com/city/gwalior/burger-empire",
    image: "burgerempire/images/outlets/city-center",
    description:
      "The original Burger Empire outlet in City Center, Gwalior. Open daily, dine-in available.",
  },
  {
    slug: "burger-empire-lashkar-gwalior",
    name: "Burger Empire Lashkar",
    area: "Lashkar",
    address: "Lashkar, Gwalior",
    postalCode: "474009",
    lat: 26.2124,
    lng: 78.1772,
    timings: "12:00 PM – 1:00 AM",
    openingHours: ["Mo-Su 12:00-25:00"],
    telephone: "+91-9685182522",
    rating: 4.1,
    reviewCount: 1500,
    priceRange: "₹",
    zomatoUrl:
      "https://www.zomato.com/gwalior/burger-empire-lashkar",
    swiggyUrl:
      "https://www.swiggy.com/city/gwalior/burger-empire-lashkar",
    image: "burgerempire/images/outlets/lashkar",
    description:
      "Burger Empire Lashkar — the late-night burger spot. Open till 1 AM.",
  },
  {
    slug: "burger-empire-mahalgaon-gwalior",
    name: "Burger Empire Mahalgaon",
    area: "Mahalgaon",
    address: "Main Road, Mahalgaon, Gwalior",
    postalCode: "474011",
    lat: 26.2291,
    lng: 78.1935,
    timings: "11:00 AM – 11:00 PM",
    openingHours: ["Mo-Su 11:00-23:00"],
    telephone: "+91-9685182522",
    rating: 4.3,
    reviewCount: 4500,
    priceRange: "₹",
    zomatoUrl:
      "https://www.zomato.com/gwalior/burger-empire-mahalgaon",
    swiggyUrl:
      "https://www.swiggy.com/city/gwalior/burger-empire-mahalgaon",
    image: "burgerempire/images/outlets/mahalgaon",
    description:
      "Burger Empire Mahalgaon — student favourite near Main Road. Rated 4.3 with 4,500+ reviews.",
  },
  {
    slug: "burger-empire-dd-nagar-gwalior",
    name: "Burger Empire DD Nagar",
    area: "Deen Dayal Nagar",
    address: "Deen Dayal Nagar, Gwalior",
    postalCode: "474020",
    lat: 26.1972,
    lng: 78.1589,
    timings: "11:00 AM – 11:00 PM",
    openingHours: ["Mo-Su 11:00-23:00"],
    telephone: "+91-9685182522",
    rating: 4.0,
    reviewCount: 1295,
    priceRange: "₹",
    zomatoUrl:
      "https://www.zomato.com/gwalior/burger-empire-deen-dayal-nagar",
    swiggyUrl:
      "https://www.swiggy.com/city/gwalior/burger-empire-dd-nagar",
    image: "burgerempire/images/outlets/dd-nagar",
    description:
      "Burger Empire DD Nagar. Dine-in and delivery available.",
  },
  {
    slug: "burger-empire-morar-gwalior",
    name: "Burger Empire Morar",
    area: "Morar",
    address: "Baijal Kothi, Near Head Post Office, Morar, Gwalior",
    postalCode: "474006",
    lat: 26.2272,
    lng: 78.2228,
    timings: "9:00 AM – 9:00 PM",
    openingHours: ["Mo-Su 09:00-21:00"],
    telephone: "+91-9685182522",
    rating: 4.5,
    reviewCount: 359,
    priceRange: "₹",
    zomatoUrl: "https://www.zomato.com/gwalior/burger-empire-morar",
    swiggyUrl:
      "https://www.swiggy.com/city/gwalior/burger-empire-morar",
    image: "burgerempire/images/outlets/morar",
    description:
      "Burger Empire Morar — near Head Post Office. Rated 4.5 on magicpin.",
  },
  {
    slug: "burger-empire-phool-bagh-gwalior",
    name: "Burger Empire Phool Bagh",
    area: "Phool Bagh",
    address: "Fort Road, Near Railway Crossing, Phool Bagh, Gwalior",
    postalCode: "474002",
    lat: 26.2218,
    lng: 78.1695,
    timings: "11:00 AM – 11:00 PM",
    openingHours: ["Mo-Su 11:00-23:00"],
    telephone: "+91-9685182522",
    rating: 4.1,
    reviewCount: 94,
    priceRange: "₹",
    zomatoUrl:
      "https://www.zomato.com/gwalior/burger-empire-phool-bagh",
    swiggyUrl: "https://www.swiggy.com/city/gwalior/burger-empire",
    image: "burgerempire/images/outlets/phool-bagh",
    description:
      "Burger Empire Phool Bagh — near Fort Road, Gwalior.",
  },
];

export type Outlet = (typeof OUTLETS)[number];

export function getOutletBySlug(slug: string) {
  return OUTLETS.find((o) => o.slug === slug);
}
