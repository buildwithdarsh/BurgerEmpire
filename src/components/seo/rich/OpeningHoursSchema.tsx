export const STANDARD_HOURS = [
  {
    "@type": "OpeningHoursSpecification" as const,
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
];

export const LASHKAR_HOURS = [
  {
    "@type": "OpeningHoursSpecification" as const,
    dayOfWeek: [
      "https://schema.org/Monday",
      "https://schema.org/Tuesday",
      "https://schema.org/Wednesday",
      "https://schema.org/Thursday",
      "https://schema.org/Friday",
    ],
    opens: "12:00",
    closes: "01:00",
  },
  {
    "@type": "OpeningHoursSpecification" as const,
    dayOfWeek: [
      "https://schema.org/Saturday",
      "https://schema.org/Sunday",
    ],
    opens: "11:00",
    closes: "01:00",
  },
];
