import type { Metadata, Viewport } from "next";
import CookieConsentRoot from "@/components/CookieConsentRoot";
import { Inter, Playfair_Display } from "next/font/google";
import { organizationJsonLd } from "@/lib/seo/organizationJsonLd";
import { canonicalUrl, SITE_INDEXABLE, SITE_URL } from "@/lib/seo/site";
import { faviconUrl } from "@/lib/seo/favicon";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

const defaultTitle = "Dan-Dom Nieruchomości — Wągrowiec i Rogoźno";
const defaultDescription =
  "Biuro nieruchomości z ponad 28-letnim doświadczeniem. Kompleksowa obsługa sprzedaży, zakupu i wynajmu nieruchomości w Wągrowcu i Rogoźnie.";

/** Kolor motywu PWA / meta — spójny z `--color-brand-primary` w `globals.css`. */
const BRAND_THEME_COLOR = "#800020";

/** GA4 — tylko przy ustawionym `NEXT_PUBLIC_GA_MEASUREMENT_ID` (np. `.env.local` / CI). */
const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: defaultTitle,
    template: "%s — Dan-Dom Nieruchomości",
  },
  description: defaultDescription,
  openGraph: {
    title: defaultTitle,
    description: defaultDescription,
    type: "website",
    locale: "pl_PL",
    siteName: "Dan-Dom Nieruchomości",
    url: canonicalUrl(""),
    images: [
      {
        url: "/hero-biuro.jpg.png",
        width: 1200,
        height: 800,
        alt: "Zespół Dan-Dom Nieruchomości",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: defaultTitle,
    description: defaultDescription,
    images: ["/hero-biuro.jpg.png"],
  },
  robots: SITE_INDEXABLE
    ? { index: true, follow: true }
    : { index: false, follow: true },
  /**
   * Jawny stos faviconów (public/) + cache-busting — bez duplikatów z `app/icon.*`.
   * Regeneracja: `npm run generate-favicons` (źródło: `public/icon.svg` lub `public/brand/logo.png`).
   */
  manifest: faviconUrl("/site.webmanifest"),
  icons: {
    icon: [
      { url: faviconUrl("/icon.svg"), type: "image/svg+xml" },
      {
        url: faviconUrl("/favicon.ico"),
        sizes: "any",
        type: "image/x-icon",
      },
    ],
    apple: [
      {
        url: faviconUrl("/apple-touch-icon.png"),
        sizes: "180x180",
        type: "image/png",
      },
    ],
  },
};

/** Poprawne skalowanie na telefonach + notch / home indicator (iOS). */
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
  themeColor: BRAND_THEME_COLOR,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pl"
      className={`${inter.variable} ${playfair.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col overflow-x-hidden bg-white text-black">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationJsonLd),
          }}
        />
        <CookieConsentRoot gaId={GA_MEASUREMENT_ID} />
        {children}
      </body>
    </html>
  );
}
