import { SITE_URL } from "./site";

type FaqItem = {
  question: string;
  answer: string;
};

/**
 * JSON-LD FAQPage helper for AI/SEO rich understanding.
 */
export function faqJsonLd(idSuffix: string, items: FaqItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${SITE_URL}/#faq-${idSuffix}`,
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  } as const;
}
