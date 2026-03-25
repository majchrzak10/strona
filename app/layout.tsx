import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { organizationJsonLd } from "@/lib/seo/organizationJsonLd";
import { canonicalUrl, SITE_URL } from "@/lib/seo/site";
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
  robots: {
    index: true,
    follow: true,
  },
};

/** Poprawne skalowanie na telefonach + notch / home indicator (iOS). */
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pl"
      className={`${inter.variable} ${playfair.variable} h-full scroll-smooth antialiased`}
    >
      <body className="min-h-full flex flex-col overflow-x-hidden bg-white text-black">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationJsonLd),
          }}
        />
        {children}
      </body>
    </html>
  );
}
