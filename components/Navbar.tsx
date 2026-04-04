"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const NAV_LINKS = [
  { href: "/", label: "Strona główna" },
  { href: "/#o-biurze", label: "O biurze" },
];

const PROPERTY_LINKS = [
  { href: "/nieruchomosci/?typ=sprzedaz", label: "Sprzedaż" },
  { href: "/nieruchomosci/?typ=wynajem", label: "Wynajem" },
];

const SERVICE_LINKS = [
  { href: "/uslugi/sprzedaz-nieruchomosci/", label: "Sprzedaż nieruchomości" },
  { href: "/uslugi/wynajem-nieruchomosci/", label: "Wynajem nieruchomości" },
  { href: "/uslugi/wycena-nieruchomosci/", label: "Wycena nieruchomości" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [desktopDropdownOpen, setDesktopDropdownOpen] = useState(false);
  const [desktopServicesOpen, setDesktopServicesOpen] = useState(false);
  const [mobilePropertyOpen, setMobilePropertyOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const servicesDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleOutsideClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDesktopDropdownOpen(false);
      }
      if (servicesDropdownRef.current && !servicesDropdownRef.current.contains(e.target as Node)) {
        setDesktopServicesOpen(false);
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
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  useEffect(() => {
    setMobileOpen(false);
    setMobilePropertyOpen(false);
    setMobileServicesOpen(false);
  }, [pathname]);

  function closeMobile() {
    setMobileOpen(false);
    setMobilePropertyOpen(false);
    setMobileServicesOpen(false);
    setDesktopDropdownOpen(false);
    setDesktopServicesOpen(false);
  }

  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-brand-primary focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white focus:shadow-lg"
      >
        Przejdź do treści
      </a>
      <header className="sticky top-0 z-50 bg-neutral-50 pt-[env(safe-area-inset-top,0px)] shadow-[0_1px_0_rgba(0,0,0,0.06)]">
        <div className="mx-auto w-full max-w-[1600px] px-[max(1rem,env(safe-area-inset-left))] pr-[max(1rem,env(safe-area-inset-right))] sm:px-6 lg:px-8">
          <div className="flex h-[4.25rem] items-center justify-between sm:h-[4.5rem]">
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
                sizes="(max-width: 768px) 200px, 280px"
                className="h-11 w-auto max-w-[min(72vw,280px)] object-contain sm:h-[3.25rem] lg:h-14"
                priority
              />
            </Link>

            <nav className="hidden items-center gap-9 md:flex lg:gap-10">
              {NAV_LINKS.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  aria-current={pathname === l.href ? "page" : undefined}
                  className="text-base font-semibold text-black/80 transition-colors hover:text-black"
                >
                  {l.label}
                </Link>
              ))}

              {/* Dropdown — Nieruchomości */}
              <div className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  aria-expanded={desktopDropdownOpen}
                  aria-haspopup="true"
                  onClick={() => { setDesktopDropdownOpen((v) => !v); setDesktopServicesOpen(false); }}
                  className="inline-flex min-h-[44px] items-center gap-2 rounded-md px-1 text-base font-semibold text-black/80 transition-colors hover:text-black"
                >
                  Nieruchomości
                  <svg
                    aria-hidden="true"
                    className={`h-5 w-5 text-brand-primary transition-transform duration-200 ${desktopDropdownOpen ? "rotate-180" : ""}`}
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>

                {desktopDropdownOpen && (
                  <div className="absolute left-1/2 top-full z-50 -translate-x-1/2 pt-3">
                    <div className="min-w-[180px] overflow-hidden rounded-xl bg-white shadow-[0_8px_24px_rgba(0,0,0,0.12)] ring-1 ring-black/5">
                      {PROPERTY_LINKS.map((l, i) => (
                        <div key={l.href}>
                          {i > 0 && <div className="mx-4 h-px bg-zinc-100" />}
                          <Link
                            href={l.href}
                            onClick={() => setDesktopDropdownOpen(false)}
                            className="flex min-h-[44px] items-center gap-2 px-4 py-3 text-[0.95rem] font-medium text-zinc-700 transition-colors hover:bg-brand-primary/5 hover:text-brand-primary"
                          >
                            {l.label}
                          </Link>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Dropdown — Usługi */}
              <div className="relative" ref={servicesDropdownRef}>
                <button
                  type="button"
                  aria-expanded={desktopServicesOpen}
                  aria-haspopup="true"
                  onClick={() => { setDesktopServicesOpen((v) => !v); setDesktopDropdownOpen(false); }}
                  className="inline-flex min-h-[44px] items-center gap-2 rounded-md px-1 text-base font-semibold text-black/80 transition-colors hover:text-black"
                >
                  Usługi
                  <svg
                    aria-hidden="true"
                    className={`h-5 w-5 text-brand-primary transition-transform duration-200 ${desktopServicesOpen ? "rotate-180" : ""}`}
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>

                {desktopServicesOpen && (
                  <div className="absolute left-1/2 top-full z-50 -translate-x-1/2 pt-3">
                    <div className="min-w-[220px] overflow-hidden rounded-xl bg-white shadow-[0_8px_24px_rgba(0,0,0,0.12)] ring-1 ring-black/5">
                      {SERVICE_LINKS.map((l, i) => (
                        <div key={l.href}>
                          {i > 0 && <div className="mx-4 h-px bg-zinc-100" />}
                          <Link
                            href={l.href}
                            onClick={() => setDesktopServicesOpen(false)}
                            className="flex min-h-[44px] items-center gap-2 px-4 py-3 text-[0.95rem] font-medium text-zinc-700 transition-colors hover:bg-brand-primary/5 hover:text-brand-primary"
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

            <div className="hidden md:flex">
              <Link
                href="/#kontakt"
                className="inline-flex min-h-[44px] items-center gap-2 rounded-full bg-brand-primary px-7 py-3 text-base font-semibold text-white shadow-sm transition-colors hover:bg-brand-hover"
              >
                Kontakt
                <svg aria-hidden="true" className="h-[1.1rem] w-[1.1rem]" viewBox="0 0 24 24" fill="none">
                  <path d="M5 12h13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                  <path d="M13 6l6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            </div>

            <div className="flex items-center gap-2 md:hidden">
              <Link
                href="/#kontakt"
                onClick={closeMobile}
                className="inline-flex min-h-[44px] items-center gap-1.5 rounded-full bg-brand-primary px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-hover"
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

      {mobileOpen && (
        <>
          {/* Wizualne ściemnienie — cały ekran, bez przechwytywania kliknięć */}
          <div
            className="fixed inset-0 z-[100] bg-black/40 md:hidden"
            aria-hidden="true"
            style={{ pointerEvents: "none" }}
          />
          {/* Klikalna strefa zamknięcia — tylko obszar poza szufladą */}
          <div
            className="fixed inset-y-0 left-0 z-[105] cursor-pointer md:hidden"
            style={{ right: "min(18rem, 85vw)" }}
            onClick={closeMobile}
            aria-hidden="true"
          />
        </>
      )}

      {mobileOpen && (
      <div
        className="animate-slide-in-right fixed inset-y-0 right-0 z-[110] flex w-72 max-w-[85vw] flex-col bg-white pb-[env(safe-area-inset-bottom,0px)] pt-[env(safe-area-inset-top,0px)] shadow-2xl md:hidden"
        aria-label="Menu nawigacyjne"
        id="mobile-nav-drawer"
      >
        <div className="flex h-[4.25rem] shrink-0 items-center justify-between border-b border-zinc-100 px-5">
          <span className="text-base font-semibold text-zinc-700">Menu</span>
          <button
            type="button"
            aria-label="Zamknij menu"
            onClick={closeMobile}
            className="flex h-11 min-h-[44px] min-w-[44px] items-center justify-center rounded-lg text-zinc-500 transition-colors hover:bg-zinc-100"
          >
            <svg aria-hidden="true" className="h-5 w-5" viewBox="0 0 24 24" fill="none">
              <path d="M6 6l12 12M6 18L18 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <nav className="flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-contain px-4 py-4">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={closeMobile}
              className="flex min-h-[44px] items-center rounded-lg px-3 py-3 text-[1.05rem] font-semibold text-zinc-800 transition-colors hover:bg-zinc-50 hover:text-brand-primary"
            >
              {l.label}
            </Link>
          ))}

          {/* Mobile akordeon — Nieruchomości */}
          <div className="mt-1 border-t border-transparent">
            <button
              type="button"
              aria-expanded={mobilePropertyOpen}
              aria-controls="mobile-property-submenu"
              onClick={() => setMobilePropertyOpen((v) => !v)}
              className="flex min-h-[48px] w-full touch-manipulation items-center justify-between rounded-lg px-3 py-3 text-left text-[1.05rem] font-semibold text-zinc-800 transition-colors hover:bg-zinc-50 hover:text-brand-primary"
            >
              Nieruchomości
              <svg
                aria-hidden="true"
                className={`h-5 w-5 shrink-0 text-brand-primary transition-transform duration-200 ${mobilePropertyOpen ? "rotate-180" : ""}`}
                viewBox="0 0 24 24"
                fill="none"
              >
                <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            <div
              id="mobile-property-submenu"
              className={`${mobilePropertyOpen ? "block" : "hidden"} relative z-10 mt-1 overflow-hidden rounded-lg border border-zinc-100 bg-zinc-50`}
            >
              {PROPERTY_LINKS.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  prefetch
                  scroll
                  onClick={closeMobile}
                  className="flex min-h-[48px] items-center px-4 py-3 text-[0.95rem] font-medium text-zinc-800 transition-colors hover:bg-brand-primary/10 hover:text-brand-primary active:bg-brand-primary/15"
                >
                  {l.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Mobile akordeon — Usługi */}
          <div className="mt-1">
            <button
              type="button"
              aria-expanded={mobileServicesOpen}
              aria-controls="mobile-services-submenu"
              onClick={() => setMobileServicesOpen((v) => !v)}
              className="flex min-h-[48px] w-full touch-manipulation items-center justify-between rounded-lg px-3 py-3 text-left text-[1.05rem] font-semibold text-zinc-800 transition-colors hover:bg-zinc-50 hover:text-brand-primary"
            >
              Usługi
              <svg
                aria-hidden="true"
                className={`h-5 w-5 shrink-0 text-brand-primary transition-transform duration-200 ${mobileServicesOpen ? "rotate-180" : ""}`}
                viewBox="0 0 24 24"
                fill="none"
              >
                <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            <div
              id="mobile-services-submenu"
              className={`${mobileServicesOpen ? "block" : "hidden"} relative z-10 mt-1 overflow-hidden rounded-lg border border-zinc-100 bg-zinc-50`}
            >
              {SERVICE_LINKS.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={closeMobile}
                  className="flex min-h-[48px] items-center px-4 py-3 text-[0.95rem] font-medium text-zinc-800 transition-colors hover:bg-brand-primary/10 hover:text-brand-primary active:bg-brand-primary/15"
                >
                  {l.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="mt-auto border-t border-zinc-100 pt-6">
            <Link
              href="/#kontakt"
              onClick={closeMobile}
              className="flex min-h-[48px] items-center justify-center gap-2 rounded-xl bg-brand-primary px-6 py-3 text-base font-semibold text-white shadow-sm transition-colors hover:bg-brand-hover"
            >
              Skontaktuj się z nami
              <svg aria-hidden="true" className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none">
                <path d="M5 12h13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                <path d="M13 6l6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </div>
        </nav>
      </div>
      )}
    </>
  );
}
