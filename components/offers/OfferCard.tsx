import Image from "next/image";
import Link from "next/link";
import type { AsariOfferCard } from "@/lib/asari/types";
import { PLACEHOLDER_IMG } from "@/lib/asari/placeholderImg";

type Props = {
  offer: AsariOfferCard;
  href: string;
};

export default function OfferCard({ offer, href }: Props) {
  const imgSrc = offer.mainImageSrc ?? PLACEHOLDER_IMG;
  const showArea = Boolean(offer.areaLabel?.trim());
  const showRooms = Boolean(offer.roomsLabel?.trim());
  const showFloor = Boolean(offer.floorLabel?.trim());

  return (
    <article className="group min-w-0 overflow-hidden rounded-xl border border-zinc-100 bg-brand-primary/[0.03] transition-all duration-300 hover:-translate-y-1 hover:border-brand-primary/20 hover:bg-brand-primary/[0.06] hover:shadow-[0_8px_24px_rgba(128,0,32,0.10)]">
      <Link href={href} className="block touch-manipulation text-left active:bg-black/[0.02]">
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-t-xl bg-zinc-100">
          <Image
            src={imgSrc}
            alt={offer.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            unoptimized
          />
          <div className="absolute left-3 top-3 rounded-md bg-burgundy px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-white sm:left-4 sm:top-4 sm:px-3 sm:text-xs">
            {offer.tag}
          </div>
        </div>

        <div className="p-4 sm:p-5">
          <p className="text-xs text-zinc-500">{offer.locationLabel}</p>

          <h3 className="mt-1 line-clamp-2 font-[var(--font-playfair)] text-base font-semibold leading-snug text-zinc-900 sm:text-[1.05rem]">
            {offer.title}
          </h3>

          <p className="mt-1.5 text-[11px] font-semibold uppercase tracking-wider text-burgundy/90">
            {offer.category}
          </p>

          <div className="mt-3">
            <p className="text-xl font-bold leading-tight text-burgundy">
              {offer.priceLabel}
            </p>
            {offer.pricePerM2Label ? (
              <p className="mt-1 text-sm font-semibold text-zinc-600">
                {offer.pricePerM2Label}
              </p>
            ) : null}
          </div>

          {showArea || showRooms || showFloor ? (
            <div className="mt-2.5 flex flex-wrap items-center gap-x-5 gap-y-1.5 text-sm text-zinc-600">
              {showArea ? (
                <span className="inline-flex items-center gap-1.5">
                  <svg
                    aria-hidden
                    className="h-4 w-4 shrink-0 text-burgundy"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <rect
                      x="3"
                      y="3"
                      width="18"
                      height="18"
                      rx="2"
                      stroke="currentColor"
                      strokeWidth="1.7"
                    />
                    <path
                      d="M3 9h18M9 21V9"
                      stroke="currentColor"
                      strokeWidth="1.7"
                      strokeLinecap="round"
                    />
                  </svg>
                  <span>
                    <span className="sr-only">Powierzchnia: </span>
                    {offer.areaLabel}
                  </span>
                </span>
              ) : null}

              {showRooms ? (
                <span className="inline-flex items-center gap-1.5">
                  <svg
                    aria-hidden
                    className="h-4 w-4 shrink-0 text-burgundy"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <path
                      d="M3 7h18v10H3V7Z"
                      stroke="currentColor"
                      strokeWidth="1.7"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M7 17V9M17 17V9"
                      stroke="currentColor"
                      strokeWidth="1.7"
                      strokeLinecap="round"
                    />
                  </svg>
                  <span>
                    <span className="sr-only">Liczba pokoi: </span>
                    {offer.roomsLabel}
                  </span>
                </span>
              ) : null}

              {showFloor ? (
                <span className="inline-flex items-center gap-1.5">
                  <svg
                    aria-hidden
                    className="h-4 w-4 shrink-0 text-burgundy"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <path
                      d="M4 21h16M6 9l6-6 6 6M4 21V10h16v11"
                      stroke="currentColor"
                      strokeWidth="1.7"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span>
                    <span className="sr-only">Piętro: </span>
                    {offer.floorLabel}
                  </span>
                </span>
              ) : null}
            </div>
          ) : null}
        </div>
      </Link>
    </article>
  );
}
