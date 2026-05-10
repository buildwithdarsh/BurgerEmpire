import type { Metadata, Viewport } from "next";
import { cloudinaryUrl } from "@/lib/cloudinary-url";
import {
  Space_Grotesk,
  Playfair_Display,
  Poppins,
  DM_Sans,
  Cormorant_Garamond,
  Nunito,
} from "next/font/google";
import Script from "next/script";
import { WebsiteSchema } from "@/components/seo/rich/WebsiteSchema";
import BrandingHead from "@/components/BrandingHead";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--nf-space-grotesk",
  display: "swap",
});

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
  variable: "--nf-playfair",
  display: "swap",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--nf-poppins",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--nf-dm-sans",
  display: "swap",
});

const cormorantGaramond = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "600"],
  variable: "--nf-cormorant",
  display: "swap",
});

const nunito = Nunito({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--nf-nunito",
  display: "swap",
});

const BASE_URL = "https://burger-empire.build.withdarsh.com";

const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),

  title: {
    default:
      "Burger Empire Gwalior — Veg Burgers from ₹69 Since 2019",
    template: "%s — Burger Empire Gwalior",
  },

  description:
    "Burger Empire is Gwalior's original burger brand since 2019. India's most-loved burger chain. 19+ outlets across 15+ cities. Order on Zomato or Swiggy.",

  keywords: [
    "burger gwalior",
    "best burger gwalior",
    "veg burger gwalior",
    "cheap burger gwalior",
    "burger delivery gwalior",
    "burger near me gwalior",
    "burger empire gwalior",
    "aloo tikki burger gwalior",
    "crispy veg burger gwalior",
    "paneer wrap gwalior",
    "peri peri fries gwalior",
    "fast food gwalior",
    "cheap food gwalior",
    "student food gwalior",
    "late night food gwalior",
    "online food delivery gwalior",
    "burger city center gwalior",
    "burger lashkar gwalior",
    "burger mahalgaon gwalior",
    "food near me gwalior",
  ],

  authors: [{ name: "Burger Empire", url: BASE_URL }],
  creator: "Burger Empire — Burger Empire India",
  publisher: "Burger Empire",

  openGraph: {
    type: "website",
    locale: "en_IN",
    url: BASE_URL,
    siteName: "Burger Empire",
    title: "Burger Empire Gwalior | Veg Burgers from ₹69 Since 2019",
    description:
      "India's most-loved burger chain. 19+ outlets. 15+ cities. Burgers from ₹69. Order now on Zomato or Swiggy.",
    images: [
      {
        url: cloudinaryUrl("burgerempire/images/og-home"),
        width: 1200,
        height: 630,
        alt: "Burger Empire Gwalior — Fresh Veg Burgers from ₹69",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    site: "",
    creator: "",
    title: "Burger Empire Gwalior | Veg Burgers from ₹69 Since 2019",
    description:
      "Gwalior's original burger brand. Veg-first. ₹69 onwards. 6 outlets.",
    images: [cloudinaryUrl("burgerempire/images/og-home")],
  },

  alternates: {
    canonical: BASE_URL,
    languages: { "en-IN": BASE_URL },
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  // verification: {
  //   google: /* INJECT: token from Google Search Console > Settings > Ownership verification */,
  // },

  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/icon-192.png", type: "image/png", sizes: "192x192" },
      { url: "/icon-512.png", type: "image/png", sizes: "512x512" },
    ],
    apple: [{ url: "/apple-icon.png", sizes: "180x180" }],
  },

  manifest: "/site.webmanifest",
  category: "food",
};

export const viewport: Viewport = {
  themeColor: "#D72B2B",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en-IN"
      className={`${spaceGrotesk.variable} ${playfairDisplay.variable} ${poppins.variable} ${dmSans.variable} ${cormorantGaramond.variable} ${nunito.variable}`}
    >
      <body className="antialiased">
        <WebsiteSchema />
        <BrandingHead />
        {children}
        <noscript>
          <div
            style={{
              padding: "2rem",
              textAlign: "center",
              fontFamily: "sans-serif",
            }}
          >
            <h1>Burger Empire</h1>
            <p>
              Please enable JavaScript to use Burger Empire. Order online from
              Gwalior&apos;s original burger brand since 2019.
            </p>
          </div>
        </noscript>
        {GA_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="ga-init" strategy="afterInteractive">
              {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${GA_ID}',{page_path:window.location.pathname});`}
            </Script>
          </>
        )}
      </body>
    </html>
  );
}
