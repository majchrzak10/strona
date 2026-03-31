import { canonicalUrl, SITE_URL } from "./site";

type BreadcrumbItem = {
  name: string;
  route: string;
};

/**
 * JSON-LD BreadcrumbList helper for static pages.
 */
export function breadcrumbJsonLd(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "@id": `${SITE_URL}/#breadcrumbs-${items.map((i) => i.route || "home").join("-")}`,
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: canonicalUrl(item.route),
    })),
  } as const;
}
