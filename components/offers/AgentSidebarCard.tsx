"use client";

import { useState } from "react";
import type { AsariOfferDetail } from "@/lib/asari/types";

function telHref(phone: string): string {
  const digits = phone.replace(/[\s\u00A0\-()./]/g, "");
  return `tel:${digits}`;
}

function initialsFromName(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function localAgentImageByName(name: string): string | null {
  const n = name.toLowerCase();
  if (n.includes("danuta")) return "/images/danuta.png";
  if (n.includes("joanna")) return "/images/joanna.png";
  if (n.includes("marta")) return "/images/marta.png";
  if (n.includes("jan")) return "/images/jan.png";
  return null;
}

function GenericAvatarIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 48 48"
      fill="none"
      aria-hidden
    >
      <circle cx="24" cy="24" r="22" fill="currentColor" opacity="0.12" />
      <circle cx="24" cy="19" r="7" stroke="currentColor" strokeWidth="2" />
      <path
        d="M12 40c2-6 7-10 12-10s10 4 12 10"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

type Props = {
  offer: AsariOfferDetail;
  /** `panel` — poziomo w karcie oferty. `rail` / `embedded` — alias do `panel`. */
  variant?: "card" | "embedded" | "rail" | "panel";
};

export default function AgentSidebarCard({
  offer,
  variant = "card",
}: Props) {
  const name = offer.agentName.trim();
  const phone = offer.agentPhone.trim();
  const mappedLocalImage = localAgentImageByName(name);
  const imageSrc = mappedLocalImage ?? offer.agentImageSrc?.trim() ?? null;
  const [photoFailed, setPhotoFailed] = useState(false);
  const isPanel =
    variant === "embedded" || variant === "rail" || variant === "panel";

  if (!name && !phone) {
    if (isPanel) {
      return (
        <p className="text-sm leading-relaxed text-zinc-500">
          Dane kontaktowe agenta nie są dostępne w eksporcie.
        </p>
      );
    }
    return (
      <div className="rounded-2xl border border-zinc-100 bg-[#f4f4f4]/80 p-8 text-center text-sm text-zinc-500">
        Dane kontaktowe agenta nie są dostępne w eksporcie.
      </div>
    );
  }

  const displayName = name || "Agent";
  const roleLabel = "Agent nieruchomości";
  const initials = initialsFromName(displayName);
  const showPhoto = Boolean(imageSrc) && !photoFailed;

  if (isPanel) {
    const avatarSm = (
      <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full border-2 border-burgundy/25 bg-zinc-200">
        {showPhoto ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={imageSrc!}
            alt=""
            className="h-full w-full object-cover"
            onError={() => setPhotoFailed(true)}
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center text-burgundy">
            {initials ? (
              <span className="font-[var(--font-playfair)] text-sm font-semibold tracking-tight">
                {initials}
              </span>
            ) : (
              <GenericAvatarIcon className="h-9 w-9 text-burgundy" />
            )}
          </div>
        )}
      </div>
    );

    return (
      <div className="w-full">
        <div className="flex items-start gap-3">
          {avatarSm}
          <div className="min-w-0 flex-1 pt-0.5">
            <p className="font-[var(--font-playfair)] text-[0.95rem] font-semibold leading-snug text-zinc-900">
              {displayName}
            </p>
            <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-burgundy">
              {roleLabel}
            </p>
          </div>
        </div>
        {phone ? (
          <a
            href={telHref(phone)}
            className="mt-4 flex w-full min-w-0 items-center justify-center gap-2 rounded-lg border border-zinc-200/90 bg-zinc-50/90 px-3 py-2.5 text-center text-sm font-semibold text-burgundy transition-colors hover:bg-zinc-100"
          >
            <svg
              className="h-4 w-4 shrink-0 text-burgundy"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden
            >
              <path
                d="M5 4h4l2 5-2 1a12 12 0 006 6l1-2 5 2v4a2 2 0 01-2 2A18 18 0 015 6a2 2 0 012-2z"
                strokeLinejoin="round"
              />
            </svg>
            <span className="min-w-0 break-all leading-snug">{phone}</span>
          </a>
        ) : null}
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-zinc-100 bg-white p-8 shadow-[0_4px_15px_rgba(0,0,0,0.05)] sm:p-10">
      <div className="flex w-full max-w-full flex-col items-center text-center">
        <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-full border-2 border-burgundy/25 bg-zinc-200">
          {showPhoto ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={imageSrc!}
              alt=""
              className="h-full w-full object-cover"
              onError={() => setPhotoFailed(true)}
            />
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center text-burgundy">
              {initials ? (
                <span className="font-[var(--font-playfair)] text-2xl font-semibold tracking-tight sm:text-3xl">
                  {initials}
                </span>
              ) : (
                <GenericAvatarIcon className="h-16 w-16 text-burgundy sm:h-20 sm:w-20" />
              )}
            </div>
          )}
        </div>

        <h3 className="mt-6 w-full max-w-full whitespace-normal break-words font-[var(--font-playfair)] text-2xl font-bold leading-snug text-zinc-900">
          {displayName}
        </h3>
        <p className="mt-2 text-xs font-medium uppercase tracking-wide text-burgundy">
          {roleLabel}
        </p>

        {phone ? (
          <div className="mt-8 w-full max-w-full border-t border-zinc-100 pt-6">
            <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
              Telefon
            </p>
            <a
              href={telHref(phone)}
              className="mt-3 inline-flex max-w-full flex-wrap items-center justify-center gap-2 break-all text-lg font-semibold text-burgundy transition-colors hover:text-burgundy/80"
            >
              <svg
                className="h-5 w-5 shrink-0 text-burgundy"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden
              >
                <path
                  d="M5 4h4l2 5-2 1a12 12 0 006 6l1-2 5 2v4a2 2 0 01-2 2A18 18 0 015 6a2 2 0 012-2z"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="whitespace-normal break-all">{phone}</span>
            </a>
          </div>
        ) : null}
      </div>
    </div>
  );
}
