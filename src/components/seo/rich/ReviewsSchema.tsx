interface ReviewItem {
  author: string;
  datePublished: string;
  reviewBody: string;
  ratingValue: number;
  platform: string;
}

export function ReviewsSchema({
  outletName,
  outletUrl,
  reviews,
}: {
  outletName: string;
  outletUrl: string;
  reviews: ReviewItem[];
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FastFoodRestaurant",
    "@id": outletUrl,
    name: outletName,
    review: reviews.map((r) => ({
      "@type": "Review",
      author: {
        "@type": "Person",
        name: r.author,
      },
      datePublished: r.datePublished,
      reviewBody: r.reviewBody,
      reviewRating: {
        "@type": "Rating",
        ratingValue: r.ratingValue,
        bestRating: 5,
        worstRating: 1,
      },
      publisher: {
        "@type": "Organization",
        name: r.platform,
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

export const REAL_REVIEWS: ReviewItem[] = [
  {
    author: "User A.",
    datePublished: "2025-07-14",
    reviewBody:
      "Aloo tikki burger is crispy, authentic and affordable — best in town for the price. The peri peri fries were amazing too.",
    ratingValue: 5,
    platform: "Zomato",
  },
  {
    author: "User B.",
    datePublished: "2025-08-02",
    reviewBody:
      "Best burgers in Abc City. Good ambience, affordable prices, and family-friendly. The veg king burger is my go-to every week.",
    ratingValue: 5,
    platform: "Google",
  },
  {
    author: "User C.",
    datePublished: "2025-09-20",
    reviewBody:
      "Student crowd favourite for good reason. ₹69 burger actually tastes amazing. Quick service and the staff is always polite.",
    ratingValue: 5,
    platform: "Zomato",
  },
  {
    author: "User D.",
    datePublished: "2025-10-05",
    reviewBody:
      "Cold coffee is probably the best in Abc City at this price. Paneer wrap was packed well and tasted fresh on delivery.",
    ratingValue: 5,
    platform: "Swiggy",
  },
];
