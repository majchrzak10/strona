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
};

export default function AgentSidebarCard({ offer }: Props) {
  const name = offer.agentName.trim();
  const phone = offer.agentPhone.trim();
  const mappedLocalImage = localAgentImageByName(name);
  const imageSrc = mappedLocalImage ?? offer.agentImageSrc?.trim() ?? null;
  const [photoFailed, setPhotoFailed] = useState(false);

  if (!name && !phone) {
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
