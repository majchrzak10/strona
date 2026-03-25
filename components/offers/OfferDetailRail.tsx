import type { AsariOfferDetail } from "@/lib/asari/types";
import AgentSidebarCard from "@/components/offers/AgentSidebarCard";

const eyebrow =
  "text-[11px] font-semibold uppercase tracking-[0.18em] text-burgundy";

function ParamRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-3 py-2.5">
      <dt className="text-[11px] font-medium text-zinc-500">{label}</dt>
      <dd className="min-w-0 text-right text-[11px] font-medium leading-snug text-zinc-800">
        {value}
      </dd>
    </div>
  );
}

/**
 * Jedna „karta oferty” obok galerii — zamknięty blok (tytuł, cena, parametry, kontakt).
 * Nie rozciąga się na wysokość opisu; opis jest osobną sekcją pod spodem.
 */
export default function OfferDetailRail({ offer: o }: { offer: AsariOfferDetail }) {
  return (
    <div className="flex flex-col rounded-2xl border border-zinc-200/90 bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.06)] ring-1 ring-zinc-200/60 sm:p-6">
      <header className="min-w-0">
        <h1 className="font-[var(--font-playfair)] text-lg font-bold leading-snug text-zinc-950 sm:text-xl">
          {o.title}
        </h1>
        <div className="mt-3 flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <span className="text-xl font-bold text-burgundy sm:text-2xl">{o.priceLabel}</span>
          {o.pricePerM2Label ? (
            <span className="text-xs font-semibold text-zinc-600 sm:text-sm">
              {o.pricePerM2Label}
            </span>
          ) : null}
        </div>
      </header>

      <div className="my-5 h-px w-full shrink-0 bg-zinc-200/90" aria-hidden />

      <section>
        <p className={eyebrow}>Parametry</p>
        <dl className="mt-3 divide-y divide-zinc-200/70">
          {o.transaction?.trim() ? (
            <ParamRow label="Transakcja" value={o.transaction} />
          ) : null}
          {o.category?.trim() ? (
            <ParamRow label="Typ oferty" value={o.category} />
          ) : null}
          {o.locationLabel?.trim() ? (
            <ParamRow label="Lokalizacja" value={o.locationLabel} />
          ) : null}
          {o.areaLabel?.trim() ? (
            <ParamRow label="Powierzchnia" value={o.areaLabel} />
          ) : null}
          {o.roomsLabel?.trim() ? (
            <ParamRow label="Pokoje" value={o.roomsLabel} />
          ) : null}
          {o.floorLabel?.trim() ? (
            <ParamRow label="Piętro" value={o.floorLabel} />
          ) : null}
          <div className="flex justify-between gap-3 py-2.5 text-[10px] text-zinc-400">
            <dt>Nr oferty</dt>
            <dd className="font-mono text-zinc-500">{o.signature}</dd>
          </div>
        </dl>
      </section>

      <div className="my-5 h-px w-full shrink-0 bg-zinc-200/90" aria-hidden />

      <section>
        <p className={eyebrow}>Kontakt</p>
        <div className="mt-4">
          <AgentSidebarCard offer={o} variant="panel" />
        </div>
      </section>
    </div>
  );
}
