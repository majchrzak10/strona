"use client";

import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";

type ImageItem = { name: string; weight: number };

function srcFor(name: string) {
  return `/zdjecia/${encodeURIComponent(name)}`;
}

const heroNavClass =
  "absolute top-1/2 z-20 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/80 bg-white/95 text-burgundy shadow-md transition-colors duration-200 hover:border-burgundy hover:bg-burgundy hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-burgundy touch-manipulation sm:h-13 sm:w-13";

const lightboxNavBtnClass =
  "flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-zinc-200 bg-white text-burgundy shadow-lg transition-colors duration-200 hover:border-burgundy hover:bg-burgundy hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-burgundy touch-manipulation";

const closeBtnClass =
  "flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-2 border-white bg-white text-burgundy shadow-lg transition-colors duration-200 hover:border-burgundy hover:bg-burgundy hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-burgundy touch-manipulation";

type LightboxProps = {
  images: ImageItem[];
  index: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
};

function Lightbox({
  images,
  index,
  onClose,
  onPrev,
  onNext,
}: LightboxProps) {
  const [mounted, setMounted] = useState(false);
  const [overlayIn, setOverlayIn] = useState(false);
  const [imgIn, setImgIn] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setOverlayIn(false);
    const id = requestAnimationFrame(() => {
      requestAnimationFrame(() => setOverlayIn(true));
    });
    return () => cancelAnimationFrame(id);
  }, []);

  useEffect(() => {
    setImgIn(false);
    const id = requestAnimationFrame(() => {
      requestAnimationFrame(() => setImgIn(true));
    });
    return () => cancelAnimationFrame(id);
  }, [index]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "ArrowRight") onNext();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, onPrev, onNext]);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  if (!mounted || typeof document === "undefined") return null;

  const item = images[index];
  if (!item) return null;

  const showNav = images.length > 1;

  return createPortal(
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-label="Galeria zdjęć"
    >
      <button
        type="button"
        aria-label="Zamknij"
        className={`absolute inset-0 bg-black/60 transition-opacity duration-300 ease-out ${
          overlayIn ? "opacity-100" : "opacity-0"
        }`}
        onClick={onClose}
      />

      <button
        type="button"
        onClick={onClose}
        className={`absolute right-3 top-3 z-[210] sm:right-5 sm:top-5 ${closeBtnClass}`}
        aria-label="Zamknij"
      >
        <svg
          className="h-7 w-7"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          aria-hidden
        >
          <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
        </svg>
      </button>

      {showNav ? (
        <>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onPrev();
            }}
            className={`absolute left-2 top-1/2 z-[210] -translate-y-1/2 sm:left-4 ${lightboxNavBtnClass}`}
            aria-label="Poprzednie zdjęcie"
          >
            <svg
              className="h-7 w-7"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden
            >
              <path
                d="M14 6l-6 6 6 6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onNext();
            }}
            className={`absolute right-2 top-1/2 z-[210] -translate-y-1/2 sm:right-4 ${lightboxNavBtnClass}`}
            aria-label="Następne zdjęcie"
          >
            <svg
              className="h-7 w-7"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden
            >
              <path
                d="M10 6l6 6-6 6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </>
      ) : null}

      <div
        className={`relative z-[205] mx-4 max-h-[min(92vh,100%)] w-full max-w-[min(1200px,94vw)] rounded-2xl bg-white p-3 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.45)] transition-opacity duration-300 ease-out sm:p-5 ${
          overlayIn ? "opacity-100" : "opacity-0"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex max-h-[min(82vh,100%)] min-h-[40vh] items-center justify-center overflow-hidden pt-2 sm:min-h-[45vh] sm:pt-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            key={item.name}
            src={srcFor(item.name)}
            alt=""
            className={`max-h-[min(78vh,100%)] max-w-full object-contain transition-transform duration-300 ease-out ${
              imgIn ? "scale-100" : "scale-95"
            }`}
          />
        </div>

        {showNav ? (
          <p className="mt-3 text-center text-xs font-medium text-zinc-500">
            {index + 1} / {images.length}
          </p>
        ) : null}
      </div>
    </div>,
    document.body,
  );
}

type Props = {
  images: ImageItem[];
};

export default function PropertyGallery({ images }: Props) {
  const sorted = [...images].sort((a, b) => a.weight - b.weight);
  const n = sorted.length;
  const [heroIndex, setHeroIndex] = useState(0);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const close = useCallback(() => setOpenIndex(null), []);

  const goPrevLightbox = useCallback(() => {
    setOpenIndex((i) => {
      if (i === null || sorted.length === 0) return i;
      return (i - 1 + sorted.length) % sorted.length;
    });
  }, [sorted.length]);

  const goNextLightbox = useCallback(() => {
    setOpenIndex((i) => {
      if (i === null || sorted.length === 0) return i;
      return (i + 1) % sorted.length;
    });
  }, [sorted.length]);

  const openAt = useCallback((idx: number) => {
    setOpenIndex(idx);
  }, []);

  const goPrevHero = useCallback(() => {
    setHeroIndex((i) => (i - 1 + n) % n);
  }, [n]);

  const goNextHero = useCallback(() => {
    setHeroIndex((i) => (i + 1) % n);
  }, [n]);

  useEffect(() => {
    setHeroIndex((i) => Math.min(i, Math.max(0, n - 1)));
  }, [n]);

  if (sorted.length === 0) return null;

  const showHeroNav = n > 1;
  const slidePct = 100 / n;

  return (
    <>
      <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-zinc-100 ring-1 ring-zinc-100">
        <div
          className="flex h-full transition-transform duration-300 ease-out"
          style={{
            width: `${n * 100}%`,
            transform: `translateX(-${heroIndex * slidePct}%)`,
          }}
        >
          {sorted.map((im) => (
            <div
              key={im.name}
              className="h-full shrink-0"
              style={{ width: `${slidePct}%` }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={srcFor(im.name)}
                alt=""
                className="h-full w-full object-cover"
              />
            </div>
          ))}
        </div>

        <button
          type="button"
          className="absolute inset-0 z-10 cursor-zoom-in bg-transparent focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-burgundy"
          onClick={() => openAt(heroIndex)}
          aria-label="Powiększ zdjęcie"
        />

        {showHeroNav ? (
          <>
            <button
              type="button"
              className={`${heroNavClass} left-3 sm:left-4`}
              onClick={(e) => {
                e.stopPropagation();
                goPrevHero();
              }}
              aria-label="Poprzednie zdjęcie"
            >
              <svg
                className="h-6 w-6"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden
              >
                <path
                  d="M14 6l-6 6 6 6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <button
              type="button"
              className={`${heroNavClass} right-3 sm:right-4`}
              onClick={(e) => {
                e.stopPropagation();
                goNextHero();
              }}
              aria-label="Następne zdjęcie"
            >
              <svg
                className="h-6 w-6"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden
              >
                <path
                  d="M10 6l6 6-6 6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </>
        ) : null}

        {showHeroNav ? (
          <div className="pointer-events-none absolute bottom-3 left-1/2 z-20 flex -translate-x-1/2 gap-1.5 rounded-full bg-black/35 px-3 py-1.5">
            {sorted.map((im, i) => (
              <span
                key={im.name}
                className={`h-1.5 w-1.5 rounded-full transition-colors ${
                  i === heroIndex ? "bg-white" : "bg-white/40"
                }`}
              />
            ))}
          </div>
        ) : null}
      </div>

      {openIndex !== null ? (
        <Lightbox
          images={sorted}
          index={openIndex}
          onClose={close}
          onPrev={goPrevLightbox}
          onNext={goNextLightbox}
        />
      ) : null}
    </>
  );
}
