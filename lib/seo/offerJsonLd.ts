import type { AsariOfferDetail } from "@/lib/asari/types";
import { canonicalUrl, SITE_URL } from "./site";

type OfferJsonLdInput = {
  offer: AsariOfferDetail;
};

/**
 * JSON-LD dla pojedynczej oferty nieruchomości.
 * Nie ingeruje w Asari — korzysta z już zmapowanych danych oferty.
 */
export function offerJsonLd({ offer }: OfferJsonLdInput) {
  const offerUrl = canonicalUrl(`oferty/${offer.slug}`);
  const images = offer.images.map((img) =>
    img.src.startsWith("http") ? img.src : `${SITE_URL}${img.src}`,
  );
  const primaryImage =
    offer.mainImageSrc != null
      ? offer.mainImageSrc.startsWith("http")
        ? offer.mainImageSrc
        : `${SITE_URL}${offer.mainImageSrc}`
      : null;

  return {
    "@context": "https://schema.org",
    "@type": "Offer",
    "@id": `${offerUrl}#offer`,
    url: offerUrl,
    price: offer.pricePln ?? undefined,
    priceCurrency: offer.pricePln != null ? "PLN" : undefined,
    availability: "https://schema.org/InStock",
    itemOffered: {
      "@type": "Product",
      "@id": `${offerUrl}#product`,
      name: offer.title,
      category: offer.category,
      description: `${offer.transaction} · ${offer.locationLabel} · ${offer.areaLabel}`.trim(),
      image: primaryImage ?? images[0] ?? `${SITE_URL}/hero-biuro.jpg`,
      sku: offer.signature,
      brand: {
        "@type": "Brand",
        name: "Dan-Dom Nieruchomości",
      },
    },
    areaServed: {
      "@type": "AdministrativeArea",
      name: offer.locationLabel,
    },
    seller: {
      "@type": "RealEstateAgent",
      "@id": `${SITE_URL}/#organization`,
      name: "Dan-Dom Nieruchomości",
      url: canonicalUrl(""),
      telephone: "+48501769166",
      email: "biuro@dan-dom.pl",
    },
  } as const;
}
