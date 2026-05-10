import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/admin/",
          "/_next/",
          "/checkout",
          "/orders",
          "/account",
          "/cart",
          "/rewards",
          "/self-checkin",
        ],
      },
    ],
    sitemap: "https://burger-empire.build.withdarsh.com/sitemap.xml",
    host: "https://burger-empire.build.withdarsh.com",
  };
}
