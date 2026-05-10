import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  trailingSlash: false,
  compress: true,
  poweredByHeader: false,
  devIndicators: false,

  // Optimize production bundles
  experimental: {
    optimizeCss: true,
  },

  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [360, 414, 640, 750, 828, 1080, 1200, 1920],
    minimumCacheTTL: 60 * 60 * 24 * 30,
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "burger-empire.build.withdarsh.com" },
    ],
  },

  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(self)",
          },
          { key: "X-DNS-Prefetch-Control", value: "on" },
        ],
      },
      {
        source: "/_next/static/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/images/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=86400, stale-while-revalidate=604800",
          },
        ],
      },
    ];
  },

  async redirects() {
    return [
      {
        source: "/menu",
        destination: "/menu/burgers",
        permanent: false,
      },
      {
        source: "/order",
        destination: "/order-online",
        permanent: true,
      },
      {
        source: "/contact",
        destination: "/find-us",
        permanent: true,
      },
      {
        source: "/locations",
        destination: "/find-us",
        permanent: true,
      },
      {
        source: "/about",
        destination: "/our-story",
        permanent: true,
      },
      {
        source: "/franchise",
        destination: "/handshake",
        permanent: true,
      },
      {
        source: "/franchise-opportunity",
        destination: "/handshake",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
