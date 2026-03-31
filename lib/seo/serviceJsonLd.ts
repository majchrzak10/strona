import { canonicalUrl, SITE_URL } from "./site";

type ServiceJsonLdOptions = {
  name: string;
  description: string;
  url: string;
  areaName: string;
};

/**
 * JSON-LD Service helper — usługa biura nieruchomości z lokalizacją.
 */
export function serviceJsonLd({ name, description, url, areaName }: ServiceJsonLdOptions) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${url}#service`,
    name,
    description,
    url,
    provider: {
      "@type": "RealEstateAgent",
      "@id": `${SITE_URL}/#organization`,
      name: "Dan-Dom Nieruchomości",
      url: canonicalUrl(""),
      telephone: "+48501769166",
      email: "biuro@dan-dom.pl",
    },
    areaServed: {
      "@type": "City",
      name: areaName,
    },
    serviceType: "Pośrednictwo w obrocie nieruchomościami",
    availableChannel: {
      "@type": "ServiceChannel",
      serviceUrl: url,
      servicePhone: "+48501769166",
      availableLanguage: { "@type": "Language", name: "Polish" },
    },
  } as const;
}
