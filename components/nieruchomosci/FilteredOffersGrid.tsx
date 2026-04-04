"use client";

import OfferCard from "@/components/offers/OfferCard";
import type { AsariOfferCard } from "@/lib/asari/types";
import {
  filterOffers,
  matchesTransactionTag,
  sortOffers,
  type CategoryFilterKey,
  type OfferFilterQuery,
  type SortKey,
  type TransactionTypeKey,
} from "@/lib/asari/filterOffers";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";

const PAGE_SIZE = 12;

const KAT_OPTIONS: { key: CategoryFilterKey; label: string }[] = [
  { key: "all", label: "Wszystkie typy" },
  { key: "mieszkanie", label: "Mieszkanie" },
  { key: "dom", label: "Dom" },
  { key: "dzialka", label: "Działka" },
  { key: "lokal", label: "Lokal" },
];

const POK_OPTIONS = [
  { v: null as number | null, label: "Dowolnie" },
  { v: 1, label: "1" },
  { v: 2, label: "2" },
  { v: 3, label: "3" },
  { v: 4, label: "4" },
  { v: 5, label: "5+" },
];

const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: "newest", label: "Najnowsze" },
  { key: "price_asc", label: "Cena: od najniższej" },
  { key: "price_desc", label: "Cena: od najwyższej" },
];

function parseQuery(sp: URLSearchParams): OfferFilterQuery {
  const katRaw = (sp.get("kat") ?? "").toLowerCase();
  const kat = (KAT_OPTIONS.some((x) => x.key === katRaw) ? katRaw : "all") as CategoryFilterKey;

  const minS = sp.get("min");
  const maxS = sp.get("max");
  const minPln = minS && /^\d+$/.test(minS) ? Number(minS) : null;
  const maxPln = maxS && /^\d+$/.test(maxS) ? Number(maxS) : null;

  const pokS = sp.get("pok");
  let pok: number | null = null;
  if (pokS === "1" || pokS === "2" || pokS === "3" || pokS === "4") pok = Number(pokS);
  else if (pokS === "5") pok = 5;

  const typRaw = (sp.get("typ") ?? "").toLowerCase();
  const typ: TransactionTypeKey = typRaw === "wynajem" ? "wynajem" : "sprzedaz";

  const sortRaw = (sp.get("sort") ?? "").toLowerCase();
  const sort: SortKey =
    sortRaw === "price_asc" || sortRaw === "price_desc" || sortRaw === "newest"
      ? (sortRaw as SortKey)
      : "newest";

  return { kat, minPln, maxPln, pok, typ, sort };
}

function buildSearchParams(q: OfferFilterQuery): string {
  const p = new URLSearchParams();
  p.set("typ", q.typ);
  if (q.kat !== "all") p.set("kat", q.kat);
  if (q.minPln != null) p.set("min", String(Math.round(q.minPln)));
  if (q.maxPln != null) p.set("max", String(Math.round(q.maxPln)));
  if (q.pok != null) p.set("pok", q.pok >= 5 ? "5" : String(q.pok));
  if (q.sort !== "newest") p.set("sort", q.sort);
  return p.toString();
}

type Props = {
  offers: AsariOfferCard[];
};

export default function FilteredOffersGrid({ offers }: Props) {
  const searchParams = useSearchParams();

  const q = useMemo(() => parseQuery(searchParams), [searchParams]);

  const [minDraft, setMinDraft] = useState(() =>
    q.minPln != null ? String(q.minPln) : "",
  );
  const [maxDraft, setMaxDraft] = useState(() =>
    q.maxPln != null ? String(q.maxPln) : "",
  );

  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const offersForTyp = useMemo(
    () => offers.filter((o) => matchesTransactionTag(o.tag, q.typ)),
    [offers, q.typ],
  );

  const filteredSorted = useMemo(() => {
    const f = filterOffers(offers, q);
    return sortOffers(f, q.sort);
  }, [offers, q]);

  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [searchParams.toString()]);

  useEffect(() => {
    setMinDraft(q.minPln != null ? String(q.minPln) : "");
    setMaxDraft(q.maxPln != null ? String(q.maxPln) : "");
  }, [q.minPln, q.maxPln]);

  const showRooms =
    q.kat === "all" || q.kat === "mieszkanie" || q.kat === "dom";

  const listLabel = q.typ === "wynajem" ? "Wynajem" : "Sprzedaż";

  const pushQuery = useCallback(
    (next: OfferFilterQuery) => {
      const s = buildSearchParams(next);
      window.history.replaceState(null, "", s ? `?${s}` : "?");
    },
    [],
  );

  const reset = useCallback(() => {
    setMinDraft("");
    setMaxDraft("");
    const next: OfferFilterQuery = {
      kat: "all",
      minPln: null,
      maxPln: null,
      pok: null,
      typ: q.typ,
      sort: q.sort,
    };
    const s = buildSearchParams(next);
    window.history.replaceState(null, "", s ? `?${s}` : "?");
  }, [q.typ, q.sort]);

  const applyPriceFromInputs = useCallback(() => {
    const minV = minDraft.trim() === "" ? null : Number(minDraft.replace(/\s/g, ""));
    const maxV = maxDraft.trim() === "" ? null : Number(maxDraft.replace(/\s/g, ""));
    const minPln =
      minV != null && Number.isFinite(minV) && minV >= 0 ? minV : null;
    const maxPln =
      maxV != null && Number.isFinite(maxV) && maxV >= 0 ? maxV : null;
    pushQuery({
      ...q,
      minPln,
      maxPln: maxPln != null && minPln != null && maxPln < minPln ? minPln : maxPln,
    });
  }, [minDraft, maxDraft, pushQuery, q]);

  const filterFields = (idSuffix: string) => {
    const minId = `filter-min-price-${idSuffix}`;
    const maxId = `filter-max-price-${idSuffix}`;
    return (
      <div className="space-y-6">
        <fieldset>
          <legend className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
            Typ nieruchomości
          </legend>
          <div className="mt-2 flex flex-col gap-1.5">
            {KAT_OPTIONS.map((opt) => (
              <button
                key={opt.key}
                type="button"
                onClick={() =>
                  pushQuery({
                    ...q,
                    kat: opt.key,
                    pok:
                      opt.key === "dzialka" ||
                      opt.key === "lokal" ||
                      opt.key === "inne"
                        ? null
                        : q.pok,
                  })
                }
                className={`min-h-[44px] rounded-lg px-3 py-2 text-left text-sm font-medium transition-colors ${
                  q.kat === opt.key
                    ? "bg-brand-primary text-white"
                    : "bg-white text-zinc-700 ring-1 ring-zinc-200 hover:bg-zinc-50"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
            Cena (zł)
          </legend>
          <p className="mt-1 text-[11px] text-zinc-500">
            Oferty bez ceny w XML nadal są widoczne przy filtrze ceny.
          </p>
          <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:items-center">
            <label className="sr-only" htmlFor={minId}>
              Cena od
            </label>
            <input
              id={minId}
              type="text"
              inputMode="numeric"
              placeholder="Od"
              value={minDraft}
              onChange={(e) => setMinDraft(e.target.value)}
              onBlur={applyPriceFromInputs}
              onKeyDown={(e) => e.key === "Enter" && applyPriceFromInputs()}
              className="w-full min-w-0 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 outline-none ring-brand-primary/30 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/35"
            />
            <label className="sr-only" htmlFor={maxId}>
              Cena do
            </label>
            <input
              id={maxId}
              type="text"
              inputMode="numeric"
              placeholder="Do"
              value={maxDraft}
              onChange={(e) => setMaxDraft(e.target.value)}
              onBlur={applyPriceFromInputs}
              onKeyDown={(e) => e.key === "Enter" && applyPriceFromInputs()}
              className="w-full min-w-0 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 outline-none ring-brand-primary/30 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/35"
            />
          </div>
        </fieldset>

        {showRooms ? (
          <fieldset>
            <legend className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
              Liczba pokoi (mieszkanie i dom)
            </legend>
            <div className="mt-2 flex flex-wrap gap-2">
              {POK_OPTIONS.map(({ v, label }) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => pushQuery({ ...q, pok: v })}
                  className={`min-h-[44px] min-w-[2.5rem] rounded-lg px-2.5 text-sm font-semibold transition-colors ${
                    (v == null && q.pok == null) || v === q.pok
                      ? "bg-brand-primary text-white"
                      : "bg-white text-zinc-700 ring-1 ring-zinc-200 hover:bg-zinc-50"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </fieldset>
        ) : null}

        <button
          type="button"
          onClick={reset}
          className="w-full rounded-lg border border-zinc-300 bg-white py-2.5 text-sm font-semibold text-zinc-800 transition-colors hover:bg-zinc-50"
        >
          Resetuj filtry
        </button>
      </div>
    );
  };

  const displayed = filteredSorted.slice(0, visibleCount);
  const canLoadMore = visibleCount < filteredSorted.length;

  return (
    <div className="mt-8 lg:mt-10">
      <div className="mb-6 flex flex-col gap-4 border-b border-zinc-200 pb-6 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:gap-6">
        <div className="flex min-w-0 flex-wrap items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
            Transakcja
          </span>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => pushQuery({ ...q, typ: "sprzedaz" })}
              className={`min-h-[44px] rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                q.typ === "sprzedaz"
                  ? "bg-brand-primary text-white"
                  : "bg-white text-zinc-700 ring-1 ring-zinc-200 hover:bg-zinc-50"
              }`}
            >
              Sprzedaż
            </button>
            <button
              type="button"
              onClick={() => pushQuery({ ...q, typ: "wynajem" })}
              className={`min-h-[44px] rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                q.typ === "wynajem"
                  ? "bg-brand-primary text-white"
                  : "bg-white text-zinc-700 ring-1 ring-zinc-200 hover:bg-zinc-50"
              }`}
            >
              Wynajem
            </button>
          </div>
        </div>
        <div className="flex min-w-0 flex-wrap items-center gap-2 sm:justify-end">
          <label htmlFor="offers-sort" className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
            Sortuj
          </label>
          <select
            id="offers-sort"
            value={q.sort}
            onChange={(e) =>
              pushQuery({ ...q, sort: e.target.value as SortKey })
            }
            className="min-h-[44px] min-w-[12rem] max-w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm font-medium text-zinc-900 outline-none ring-brand-primary/30 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/35"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.key} value={o.key}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="lg:grid lg:grid-cols-[minmax(0,17rem)_1fr] lg:items-start lg:gap-10 xl:grid-cols-[minmax(0,19rem)_1fr] xl:gap-12">
        {/* Mobile / tablet: zwijane filtry */}
        <details open className="group mb-6 rounded-2xl border border-zinc-200 bg-zinc-50/80 p-4 lg:hidden">
          <summary className="cursor-pointer list-none font-semibold text-zinc-900 [&::-webkit-details-marker]:hidden">
            <span className="flex items-center justify-between gap-2">
              Filtry
              <svg
                aria-hidden
                className="h-5 w-5 shrink-0 text-zinc-500 transition-transform group-open:rotate-180"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M6 9l6 6 6-6"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </summary>

          <div className="mt-4 border-t border-zinc-200 pt-4">{filterFields("mobile")}</div>
        </details>

        {/* Desktop (lg+): filtry zawsze widoczne, bez klikania */}
        <aside
          className="mb-6 hidden rounded-xl border border-zinc-200 bg-white p-5 shadow-sm lg:sticky lg:top-24 lg:mb-0 lg:block"
          aria-label="Filtry ofert"
        >
          <h2 className="text-sm font-semibold text-zinc-900">Filtry</h2>
          <div className="mt-4">{filterFields("desktop")}</div>
        </aside>

        <div className="min-w-0">
          {filteredSorted.length > 0 ? (
            <p className="text-sm text-zinc-600">
              <span className="font-medium text-zinc-800">{listLabel}</span>
              {" — "}
              {filteredSorted.length === offersForTyp.length
                ? `wszystkie ${offersForTyp.length} ofert`
                : `wyświetlono ${filteredSorted.length} z ${offersForTyp.length}`}
            </p>
          ) : null}

          {filteredSorted.length === 0 ? (
            <div
              className="mt-8 rounded-xl border border-dashed border-zinc-200 bg-zinc-50/80 px-6 py-12 text-center"
              role="status"
            >
              <p className="text-zinc-700">Brak ofert spełniających kryteria.</p>
              <button
                type="button"
                onClick={reset}
                className="mt-4 text-sm font-semibold text-brand-primary underline underline-offset-2 hover:text-zinc-900"
              >
                Resetuj filtry
              </button>
            </div>
          ) : (
            <>
              <div className="mt-8 grid min-w-0 grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8 lg:mt-10 lg:grid-cols-2 xl:grid-cols-3">
                {displayed.map((o) => (
                  <div
                    key={o.signature}
                    className="motion-safe:transition-opacity motion-safe:duration-200"
                  >
                    <OfferCard offer={o} href={`/oferty/${o.slug}/`} />
                  </div>
                ))}
              </div>
              {canLoadMore ? (
                <div className="mt-10 flex justify-center">
                  <button
                    type="button"
                    onClick={() =>
                      setVisibleCount((c) =>
                        Math.min(c + PAGE_SIZE, filteredSorted.length),
                      )
                    }
                    className="rounded-full bg-brand-primary px-8 py-3 text-sm font-semibold uppercase tracking-wide text-white shadow-sm transition-colors hover:bg-brand-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2"
                  >
                    Załaduj więcej
                  </button>
                </div>
              ) : null}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
