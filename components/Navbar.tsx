"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";

const NAV_LINKS = [
  { href: "/", label: "Strona główna" },
  { href: "/#o-biurze", label: "O biurze" },
];

const PROPERTY_LINKS = [
  { href: "/nieruchomosci/sprzedaz", label: "Sprzedaż" },
  { href: "/nieruchomosci/wynajem", label: "Wynajem" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleOutsideClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  function closeMobile() {
    setMobileOpen(false);
    setDropdownOpen(false);
  }

  return (
    <>
      <header className="sticky top-0 z-50 bg-neutral-50 pt-[env(safe-area-inset-top,0px)] shadow-[0_1px_0_rgba(0,0,0,0.06)]">
        <div className="mx-auto w-full max-w-[1600px] px-[max(1rem,env(safe-area-inset-left))] pr-[max(1rem,env(safe-area-inset-right))] sm:px-6 lg:px-8">
          <div className="flex h-[4.25rem] items-center justify-between sm:h-[4.5rem]">

            {/* Logo */}
            <Link
              href="/"
              aria-label="Strona główna Dan-Dom Biuro Obrotu Nieruchomościami"
              className="flex-shrink-0 transition-opacity duration-200 hover:opacity-80"
            >
              <Image
                src="/images/logo-secondary.png"
                alt="Dan-Dom Biuro Obrotu Nieruchomościami — logo firmy"
                width={280}
                height={112}
                className="h-11 w-auto object-contain sm:h-[3.25rem] lg:h-14"
                priority
              />
            </Link>

            {/* Desktop nav */}
            <nav className="hidden items-center gap-9 md:flex lg:gap-10">
              {NAV_LINKS.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="text-base font-semibold text-black/80 transition-colors hover:text-black"
                >
                  {l.label}
                </Link>
              ))}

              {/* Dropdown — Nieruchomości */}
              <div className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  aria-expanded={dropdownOpen}
                  aria-haspopup="true"
                  onClick={() => setDropdownOpen((v) => !v)}
                  className="inline-flex items-center gap-2 text-base font-semibold text-black/80 transition-colors hover:text-black"
                >
                  Nieruchomości
                  <svg
                    aria-hidden="true"
                    className={`h-5 w-5 text-[#A32036] transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`}
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>

                {dropdownOpen && (
                  <div className="absolute left-1/2 top-full z-50 -translate-x-1/2 pt-3">
                    <div className="min-w-[180px] overflow-hidden rounded-xl bg-white shadow-[0_8px_24px_rgba(0,0,0,0.12)] ring-1 ring-black/5">
                      {PROPERTY_LINKS.map((l, i) => (
                        <div key={l.href}>
                          {i > 0 && <div className="mx-4 h-px bg-zinc-100" />}
                          <Link
                            href={l.href}
                            onClick={() => setDropdownOpen(false)}
                            className="flex items-center gap-2 px-4 py-3.5 text-[0.95rem] font-medium text-zinc-700 transition-colors hover:bg-[#800020]/5 hover:text-[#800020]"
                          >
                            {l.label}
                          </Link>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </nav>

            {/* Desktop CTA */}
            <div className="hidden md:flex">
              <Link
                href="/#kontakt"
                className="inline-flex items-center gap-2 rounded-full bg-[#A32036] px-7 py-3 text-base font-semibold text-white shadow-sm transition-all hover:brightness-90"
              >
                Kontakt
                <svg aria-hidden="true" className="h-[1.1rem] w-[1.1rem]" viewBox="0 0 24 24" fill="none">
                  <path d="M5 12h13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                  <path d="M13 6l6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            </div>

            {/* Mobile right side: CTA + hamburger */}
            <div className="flex items-center gap-2 md:hidden">
              <Link
                href="/#kontakt"
                onClick={closeMobile}
                className="inline-flex items-center gap-1.5 rounded-full bg-[#A32036] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:brightness-90"
              >
                Kontakt
              </Link>
              <button
                type="button"
                aria-label={mobileOpen ? "Zamknij menu" : "Otwórz menu"}
                aria-expanded={mobileOpen}
                onClick={() => setMobileOpen((v) => !v)}
                className="flex h-11 min-h-[44px] min-w-[44px] touch-manipulation items-center justify-center rounded-lg text-zinc-700 transition-colors hover:bg-zinc-100"
              >
                {mobileOpen ? (
                  <svg aria-hidden="true" className="h-6 w-6" viewBox="0 0 24 24" fill="none">
                    <path d="M6 6l12 12M6 18L18 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                  </svg>
                ) : (
                  <svg aria-hidden="true" className="h-6 w-6" viewBox="0 0 24 24" fill="none">
                    <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                  </svg>
                )}
              </button>
            </div>

          </div>
        </div>
      </header>

      {/* Mobile drawer overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
          aria-hidden="true"
          onClick={closeMobile}
        />
      )}

      {/* Mobile drawer panel */}
      <div
        ref={mobileMenuRef}
        className={`fixed inset-y-0 right-0 z-50 w-72 max-w-[85vw] transform bg-white pb-[env(safe-area-inset-bottom,0px)] pt-[env(safe-area-inset-top,0px)] shadow-2xl transition-transform duration-300 ease-in-out md:hidden ${
          mobileOpen ? "translate-x-0" : "translate-x-full"
        }`}
        aria-label="Menu nawigacyjne"
      >
        <div className="flex h-[4.25rem] items-center justify-between border-b border-zinc-100 px-5">
          <span className="text-base font-semibold text-zinc-700">Menu</span>
          <button
            type="button"
            aria-label="Zamknij menu"
            onClick={closeMobile}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-zinc-500 transition-colors hover:bg-zinc-100"
          >
            <svg aria-hidden="true" className="h-5 w-5" viewBox="0 0 24 24" fill="none">
              <path d="M6 6l12 12M6 18L18 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <nav className="flex flex-col px-4 py-4">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={closeMobile}
              className="flex items-center rounded-lg px-3 py-4 text-[1.05rem] font-semibold text-zinc-800 transition-colors hover:bg-zinc-50 hover:text-[#800020]"
            >
              {l.label}
            </Link>
          ))}

          {/* Accordion — Nieruchomości */}
          <div className="mt-1">
            <button
              type="button"
              aria-expanded={dropdownOpen}
              onClick={() => setDropdownOpen((v) => !v)}
              className="flex w-full items-center justify-between rounded-lg px-3 py-4 text-[1.05rem] font-semibold text-zinc-800 transition-colors hover:bg-zinc-50 hover:text-[#800020]"
            >
              Nieruchomości
              <svg
                aria-hidden="true"
                className={`h-5 w-5 text-[#A32036] transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`}
                viewBox="0 0 24 24"
                fill="none"
              >
                <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            {dropdownOpen && (
              <div className="ml-3 mt-1 overflow-hidden rounded-lg border border-zinc-100 bg-zinc-50">
                {PROPERTY_LINKS.map((l) => (
                  <Link
                    key={l.href}
                    href={l.href}
                    onClick={closeMobile}
                    className="flex items-center px-4 py-3.5 text-[0.95rem] font-medium text-zinc-700 transition-colors hover:bg-[#800020]/5 hover:text-[#800020]"
                  >
                    {l.label}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <div className="mt-6 border-t border-zinc-100 pt-6">
            <Link
              href="/#kontakt"
              onClick={closeMobile}
              className="flex items-center justify-center gap-2 rounded-xl bg-[#A32036] px-6 py-4 text-base font-semibold text-white shadow-sm transition-all hover:brightness-90"
            >
              Skontaktuj się z nami
              <svg aria-hidden="true" className="h-4 w-4" viewBox="0 0 24 24" fill="none">
                <path d="M5 12h13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                <path d="M13 6l6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </div>
        </nav>
      </div>
    </>
  );
}
