/** Placeholder CLS — stała wysokość siatki do czasu streamu sekcji serwerowej. */
export default function RecentOffersSkeleton() {
  return (
    <section className="w-full" aria-busy="true" aria-label="Ładowanie ofert">
      <div className="mx-auto max-w-[1600px] px-4 py-10">
        <div className="rounded-2xl bg-white px-4 py-8 shadow-[0_4px_15px_rgba(0,0,0,0.05)] sm:px-8 sm:py-10">
          <div className="mb-6 h-9 w-56 max-w-full animate-pulse rounded-lg bg-zinc-200" />
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="flex flex-col overflow-hidden rounded-2xl border border-zinc-100 bg-zinc-50/80"
              >
                <div className="aspect-[4/3] w-full animate-pulse bg-zinc-200" />
                <div className="flex flex-1 flex-col gap-2 p-4 sm:p-5">
                  <div className="h-3 w-24 animate-pulse rounded bg-zinc-200" />
                  <div className="h-5 w-full animate-pulse rounded bg-zinc-200" />
                  <div className="h-5 w-[80%] animate-pulse rounded bg-zinc-200" />
                  <div className="mt-2 h-7 w-28 animate-pulse rounded bg-zinc-200" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
