"use client";

import { useEffect } from "react";
import { trackEvent } from "@/lib/client/analytics";

type Props = {
  signature: string;
  slug: string;
  category: string;
  transaction: string;
  locationLabel: string;
  pricePln: number | null;
};

export default function OfferViewTracker({
  signature,
  slug,
  category,
  transaction,
  locationLabel,
  pricePln,
}: Props) {
  useEffect(() => {
    trackEvent("view_offer", {
      offer_id: signature,
      offer_slug: slug,
      offer_category: category,
      offer_transaction: transaction,
      offer_location: locationLabel,
      offer_price_pln: pricePln ?? undefined,
    });
  }, [category, locationLabel, pricePln, signature, slug, transaction]);

  return null;
}
