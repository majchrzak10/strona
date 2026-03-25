export default function ContactDetailsSection() {
  return (
    <footer className="mx-auto w-full max-w-[1600px] overflow-hidden rounded-2xl bg-[#A32036] px-6 shadow-xl sm:px-10 lg:px-14">
      <div className="py-10">
        <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
          <h2 className="font-[var(--font-playfair)] text-2xl font-bold leading-tight text-white sm:text-3xl">
            Kontakt
          </h2>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/40">
            Napisz lub zadzwoń
          </p>
        </div>
        <div className="mt-3 h-px w-12 bg-white/25" />

        <div className="mt-8 grid grid-cols-1 gap-x-8 gap-y-8 md:grid-cols-3">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/40">
              Dane kontaktowe
            </p>
            <a
              href="tel:501769166"
              className="mt-4 flex items-center gap-3 text-white transition-opacity hover:opacity-75"
            >
              <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-white/10">
                <svg aria-hidden="true" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8.5 10.5c1.2 2.4 3.6 4.8 6 6l1.8-1.8c.3-.3.7-.4 1.1-.3 1.2.4 2.6.6 3.7.6.6 0 1.1.5 1.1 1.1V20c0 .6-.5 1.1-1.1 1.1C13.1 21.1 2.9 10.9 2.9 3.1c0-.6.5-1.1 1.1-1.1H7c.6 0 1.1.5 1.1 1.1 0 1.1.2 2.5.6 3.7.1.4 0 .8-.3 1.1L8.5 10.5Z" />
                </svg>
              </span>
              <span className="text-base font-semibold leading-snug">501 769 166</span>
            </a>
            <a
              href="mailto:biuro@dan-dom.pl"
              className="mt-3 flex items-center gap-3 text-white/75 transition-opacity hover:opacity-75"
            >
              <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-white/10">
                <svg aria-hidden="true" className="h-5 w-5" viewBox="0 0 24 24" fill="none">
                  <rect x="2" y="4" width="20" height="16" rx="2" stroke="currentColor" strokeWidth="1.7" />
                  <path d="M2 8l10 7 10-7" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              <span className="text-sm font-medium leading-snug">biuro@dan-dom.pl</span>
            </a>
          </div>

          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/40">
              Adresy biur
            </p>
            <div className="mt-4 flex items-start gap-3 text-white/75">
              <span className="mt-0.5 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-white/10">
                <svg aria-hidden="true" className="h-5 w-5" viewBox="0 0 24 24" fill="none">
                  <path d="M12 22s7-4.4 7-11A7 7 0 0 0 5 11c0 6.6 7 11 7 11Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
                  <circle cx="12" cy="11" r="2.5" stroke="currentColor" strokeWidth="1.7" />
                </svg>
              </span>
              <div className="text-sm leading-snug">
                <p className="font-semibold text-white">Wągrowiec</p>
                <p className="mt-1">ul. Kościuszki 28, 62-100</p>
              </div>
            </div>
            <div className="mt-3 flex items-start gap-3 text-white/75">
              <span className="mt-0.5 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-white/10">
                <svg aria-hidden="true" className="h-5 w-5" viewBox="0 0 24 24" fill="none">
                  <path d="M12 22s7-4.4 7-11A7 7 0 0 0 5 11c0 6.6 7 11 7 11Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
                  <circle cx="12" cy="11" r="2.5" stroke="currentColor" strokeWidth="1.7" />
                </svg>
              </span>
              <div className="text-sm leading-snug">
                <p className="font-semibold text-white">Rogoźno</p>
                <p className="mt-1">ul. Wielka Poznańska 29, 64-610</p>
              </div>
            </div>
          </div>

          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/40">
              Godziny otwarcia
            </p>
            <div className="mt-4 flex items-start gap-3 text-white/75">
              <span className="mt-0.5 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-white/10">
                <svg aria-hidden="true" className="h-5 w-5" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.7" />
                  <path d="M12 7v5l3.5 3.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              <div className="text-sm leading-snug">
                <p className="font-semibold text-white">Poniedziałek – Piątek</p>
                <p className="mt-1">9:00 – 16:00</p>
                <p className="mt-2 text-xs text-white/40">Sobota – Niedziela: zamknięte</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 py-4 text-center text-xs text-white/35">
        Copyright © {new Date().getFullYear()} Dan-Dom Nieruchomości. Wszelkie prawa zastrzeżone.
      </div>
    </footer>
  );
}
