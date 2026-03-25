import Link from "next/link";
import {
  GOOGLE_REVIEWS_LIST_URL,
  REVIEW_SNIPPETS,
} from "@/lib/data/googleReviews";

function Stars() {
  return (
    <div className="flex gap-0.5" aria-hidden>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          className="h-3.5 w-3.5 text-amber-400"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
  );
}

export default function ClientReviewsSection() {
  return (
    <section
      id="opinie"
      className="mx-auto w-full max-w-[1600px] scroll-mt-24 rounded-2xl border border-zinc-100 bg-white px-5 py-5 shadow-[0_4px_15px_rgba(0,0,0,0.05)] sm:px-8 sm:py-6 lg:px-10 lg:py-7"
      aria-labelledby="opinie-heading"
    >
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between sm:gap-6">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-brand-primary">
            Zaufali nam
          </p>
          <h2
            id="opinie-heading"
            className="mt-2 font-[var(--font-playfair)] text-xl font-bold text-zinc-900 sm:text-2xl"
          >
            Opinie klientów
          </h2>
          <p className="mt-1 max-w-xl text-sm text-zinc-500">
            Fragmenty opinii z wizytówki Google — klienci polecają naszą obsługę i doświadczenie na
            lokalnym rynku.
          </p>
        </div>
        <Link
          href={GOOGLE_REVIEWS_LIST_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex shrink-0 items-center gap-2 self-start rounded-full border border-zinc-200 bg-white px-4 py-2 text-sm font-semibold text-brand-primary shadow-sm transition hover:border-brand-primary/30 hover:bg-brand-primary/[0.04] sm:self-auto"
        >
          Zobacz opinie na Google
          <svg
            className="h-3.5 w-3.5"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden
          >
            <path
              d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <path
              d="M15 3h6v6M10 14 21 3"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </Link>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-3 md:gap-4">
        {REVIEW_SNIPPETS.map((r) => (
          <blockquote
            key={r.id}
            className="flex flex-col rounded-xl border border-zinc-100 bg-brand-primary/[0.03] p-3.5 sm:p-4"
          >
            <Stars />
            <p className="mt-2.5 flex-1 text-sm leading-snug text-zinc-700">
              <span className="font-[var(--font-playfair)] text-lg leading-none text-brand-primary/25">
                „
              </span>
              {r.quote}
              <span className="font-[var(--font-playfair)] text-lg leading-none text-brand-primary/25">
                ”
              </span>
            </p>
            <footer className="mt-4 border-t border-zinc-200/80 pt-3 text-xs font-semibold text-zinc-500">
              — {r.author}
            </footer>
          </blockquote>
        ))}
      </div>
    </section>
  );
}
