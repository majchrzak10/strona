/**
 * Sekcje „O biurze” i „Nasze usługi” (strona główna).
 * Blok „O biurze”: zachowany gradient, tekst bez kafelka.
 */

export default function CompanyOverview() {
  return (
    <>
      <div
        className="-mx-5 -mt-10 rounded-t-2xl px-5 py-10 sm:-mx-10 sm:px-10 sm:py-12 lg:-mx-14 lg:px-14 lg:py-14"
        style={{
          background:
            "linear-gradient(180deg, #2F0811 0%, #4A0D1A 24%, #6B1226 48%, #8B1832 64%, #A64C61 76%, #D7B8C2 90%, #FFFFFF 100%)",
        }}
      >
        <div className="mx-auto max-w-2xl text-center">
          <div>
            <h2 className="mb-5 mt-0 font-[var(--font-playfair)] text-lg font-semibold leading-tight text-white sm:text-xl lg:text-2xl">
              O biurze — Kim jesteśmy
            </h2>
            <div className="mx-auto h-0.5 w-12 rounded bg-white/40" />
          </div>
          <div className="mt-5">
            <p className="font-[var(--font-inter)] text-sm font-normal leading-relaxed text-rose-50/90">
              Od ponad 28 lat specjalizujemy się w kompleksowej obsłudze rynku nieruchomości.
              Łączymy bogatą bazę ofert z profesjonalnym doradztwem w zakresie negocjacji,
              sporządzania umów oraz wycen. Doskonale znamy lokalny rynek, co pozwala nam działać
              szybko i skutecznie. Jesteśmy z Tobą od pierwszej prezentacji aż po przekazanie kluczy.
              Dzięki sprawdzonej współpracy z doradcą kredytowym, agencją ubezpieczeniową i kancelarią
              notarialną, zdejmujemy z Twoich barków ciężar formalności. Oferujemy rozwiązania, które
              przyspieszają transakcje, minimalizują koszty i gwarantują 100% bezpieczeństwa prawnego.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-2 sm:mt-4 lg:mt-6">
        <div
          className="h-px bg-gradient-to-r from-transparent via-brand-primary/25 to-transparent"
          aria-hidden
        />
        <div className="pt-12">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-brand-primary">
            Nasze usługi
          </p>
          <h3 className="mt-3 font-[var(--font-playfair)] text-xl font-bold text-brand-primary sm:text-2xl lg:text-3xl">
            Nasze usługi — Sprawdź w jakich obszarach możemy Cię wspierać
          </h3>
          <div className="mt-3 h-0.5 w-14 rounded bg-brand-primary" />
        </div>
        <div className="mx-auto mt-10 grid max-w-[1400px] grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
          {[
            {
              title: "Sprzedaż nieruchomości",
              desc: "Przeprowadzamy przez cały proces – od stworzenia profesjonalnej oferty z atrakcyjnymi zdjęciami, przez skuteczny marketing i negocjacje cenowe, aż po bezstresową finalizację transakcji u notariusza.",
              icon: (
                <svg
                  aria-hidden="true"
                  className="h-5 w-5 text-brand-primary"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <path
                    d="M9 12l2 2 4-4"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M20 13c0 5-3.5 8.5-7.66 9.93a1 1 0 0 1-.68 0C7.5 21.5 4 18 4 13V6a1 1 0 0 1 .77-.97l7-2a1 1 0 0 1 .46 0l7 2A1 1 0 0 1 20 6v7Z"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              ),
            },
            {
              title: "Wynajem nieruchomości",
              desc: "Szybko i bezpiecznie łączymy właścicieli z najemcami. Znajdujemy oferty idealnie dopasowane do oczekiwań, pomagamy wynegocjować najlepsze warunki i przygotowujemy solidne umowy chroniące obie strony.",
              icon: (
                <svg
                  aria-hidden="true"
                  className="h-5 w-5 text-brand-primary"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <path
                    d="M3 10.5 12 4l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-9.5Z"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M9 21V12h6v9"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              ),
            },
            {
              title: "Pomoc prawna i formalności",
              desc: "Analizujemy stan prawny nieruchomości — badamy księgi wieczyste, umowy i pozwolenia. Reprezentujemy klientów w urzędach i dbamy o to, by każda transakcja była wolna od ryzyka.",
              icon: (
                <svg
                  aria-hidden="true"
                  className="h-5 w-5 text-brand-primary"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <path
                    d="M12 22V12M12 12 7 7m5 5 5-5"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M5 21h14"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                  />
                  <path
                    d="M4 10l4-8 4 8H4ZM12 10l4-8 4 8h-8Z"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinejoin="round"
                  />
                </svg>
              ),
            },
            {
              title: "Wyceny nieruchomości",
              desc: "Dostarczamy rzetelne wyceny oparte na bieżących, realnych danych z lokalnego rynku. Oszacujemy właściwą wartość Twojego majątku na potrzeby sprzedaży, zakupu lub podziału.",
              icon: (
                <svg
                  aria-hidden="true"
                  className="h-5 w-5 text-brand-primary"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <path
                    d="M3 3v18h18"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M7 16l4-5 4 3 4-6"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              ),
            },
            {
              title: "Pośrednictwo w obrocie gruntami",
              desc: "Eksperckie wsparcie w transakcjach kupna i sprzedaży gruntów rolnych, budowlanych, rekreacyjnych oraz inwestycyjnych. Doradzamy w sprawach zagospodarowania przestrzennego i potencjału zabudowy.",
              icon: (
                <svg
                  aria-hidden="true"
                  className="h-5 w-5 text-brand-primary"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <path
                    d="M3 20h18"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                  />
                  <path
                    d="M5 20V10l7-7 7 7v10"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M9 20v-5h6v5"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              ),
            },
            {
              title: "Doradztwo inwestycyjne",
              desc: "Pomagamy w mądrym lokowaniu kapitału. Wybieramy nieruchomości pod inwestycję (tzw. flipy, lokale na wynajem długoterminowy), prognozujemy rentowność i oceniamy opłacalność projektu.",
              icon: (
                <svg
                  aria-hidden="true"
                  className="h-5 w-5 text-brand-primary"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.7" />
                  <path
                    d="M12 8v4l3 3"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M9.5 3.5C6 5 4 8.5 4 12"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                  />
                </svg>
              ),
            },
          ].map((service) => (
            <article
              key={service.title}
              className="group relative flex min-w-0 flex-col overflow-hidden rounded-xl border border-zinc-100 bg-brand-primary/[0.03] p-7 shadow-sm transition-all duration-300 ease-in-out hover:-translate-y-1 hover:border-brand-primary/20 hover:bg-brand-primary/[0.06] hover:shadow-[0_10px_28px_rgba(128,0,32,0.09)]"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-primary/10 transition-colors group-hover:bg-brand-primary/20">
                {service.icon}
              </div>
              <h4 className="mt-5 font-[var(--font-playfair)] text-lg font-bold text-brand-primary">
                {service.title}
              </h4>
              <p className="mt-3 min-h-0 flex-1 text-sm leading-relaxed text-zinc-600">
                {service.desc}
              </p>
              <div className="absolute bottom-0 left-0 h-0.5 w-0 rounded-b-xl bg-brand-primary transition-all duration-300 group-hover:w-full" />
            </article>
          ))}
        </div>
      </div>
    </>
  );
}
