import type { MetadataRoute } from "next";
import { loadAsariOffers } from "@/lib/asari/loadOffers";
import { canonicalUrl, SITE_INDEXABLE } from "@/lib/seo/site";

export const dynamic = "force-static";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  if (!SITE_INDEXABLE) {
    return [];
  }

  const { offers } = await loadAsariOffers();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: canonicalUrl(""), lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: canonicalUrl("oferty"), lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: canonicalUrl("nieruchomosci"), lastModified: new Date(), changeFrequency: "daily", priority: 0.85 },
    {
      url: canonicalUrl("uslugi/sprzedaz-nieruchomosci"),
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: canonicalUrl("uslugi/wynajem-nieruchomosci"),
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.75,
    },
    {
      url: canonicalUrl("uslugi/wycena-nieruchomosci"),
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.75,
    },
    {
      url: canonicalUrl("polityka-prywatnosci"),
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.35,
    },
  ];

  const offerRoutes: MetadataRoute.Sitemap = offers.map((o) => ({
    url: canonicalUrl(`oferty/${o.slug}`),
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  return [...staticRoutes, ...offerRoutes];
}
