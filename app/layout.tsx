import type { Metadata, Viewport } from "next";
import CookieConsentRoot from "@/components/CookieConsentRoot";
import { Inter, Playfair_Display } from "next/font/google";
import { organizationJsonLd } from "@/lib/seo/organizationJsonLd";
import { canonicalUrl, SITE_INDEXABLE, SITE_URL } from "@/lib/seo/site";
import { faviconUrl } from "@/lib/seo/favicon";
import Script from "next/script";
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

const defaultTitle = "Biuro Nieruchomości Wągrowiec i Rogoźno — Dan-Dom | Od 1996";
const defaultDescription =
  "Biuro nieruchomości Wągrowiec i Rogoźno. 30 lat doświadczenia, 60 opinii ★4.9. Sprzedaż, zakup i wynajem nieruchomości. Zadzwoń: 501 769 166";

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
        url: "/hero-biuro.jpg",
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
    images: ["/hero-biuro.jpg"],
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
      {
        url: faviconUrl("/icon-192.png"),
        sizes: "192x192",
        type: "image/png",
      },
      {
        url: faviconUrl("/favicon.ico"),
        sizes: "any",
        type: "image/x-icon",
      },
    ],
    shortcut: [{ url: faviconUrl("/favicon.ico"), type: "image/x-icon" }],
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
        {/* Google Ads tag */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=AW-18073325436"
          strategy="afterInteractive"
        />
        <Script id="google-ads-config" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'AW-18073325436');
          `}
        </Script>
        <CookieConsentRoot gaId={GA_MEASUREMENT_ID} />
        {children}
      </body>
    </html>
  );
}
