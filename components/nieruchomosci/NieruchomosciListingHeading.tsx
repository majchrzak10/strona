"use client";

import { useSearchParams } from "next/navigation";

export default function NieruchomosciListingHeading() {
  const sp = useSearchParams();
  const typ = (sp.get("typ") ?? "").toLowerCase();
  const isRent = typ === "wynajem";
  return (
    <h1 className="mt-3 font-[var(--font-playfair)] text-[clamp(1.35rem,4.5vw,2.25rem)] font-bold leading-tight text-black lg:text-4xl">
      {isRent ? "Nieruchomości na wynajem" : "Nieruchomości na sprzedaż"}
    </h1>
  );
}
