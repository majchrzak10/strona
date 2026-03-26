import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import ContactDetailsSection from "@/components/ContactDetailsSection";
import { canonicalUrl } from "@/lib/seo/site";

export const metadata: Metadata = {
  title: "Polityka prywatności",
  description:
    "Zasady przetwarzania danych osobowych i plików cookies w serwisie Dan-Dom Nieruchomości.",
  alternates: { canonical: canonicalUrl("polityka-prywatnosci") },
  openGraph: { url: canonicalUrl("polityka-prywatnosci") },
};

export default function PolitykaPrywatnosciPage() {
  return (
    <div className="min-h-screen bg-[#f4f4f4] text-black">
      <Navbar />

      <main className="px-4 py-10 sm:px-6 lg:px-10">
        <article className="mx-auto w-full max-w-[1600px] rounded-2xl bg-white px-5 py-10 shadow-[0_4px_15px_rgba(0,0,0,0.05)] sm:px-10 sm:py-14 lg:px-14">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-primary">
            Ochrona danych
          </p>
          <h1 className="mt-3 font-[var(--font-playfair)] text-2xl font-bold text-black sm:text-3xl lg:text-4xl">
            Polityka prywatności
          </h1>
          <div className="mt-4 h-px w-28 bg-brand-primary/80" />
          <p className="mt-4 text-sm text-zinc-500">Ostatnia aktualizacja: 25 marca 2026 r.</p>

          <div className="prose prose-sm prose-zinc mt-10 max-w-none text-zinc-800 prose-headings:font-semibold prose-headings:text-zinc-900 prose-a:text-burgundy prose-a:underline sm:prose-base lg:prose-lg">
            <p>
              Niniejszy dokument opisuje zasady przetwarzania danych osobowych i stosowania plików
              cookies w serwisie internetowym prowadzonym przez Dan-Dom Nieruchomości. Ma charakter
              informacyjny; w sprawach indywidualnych możesz skontaktować się z nami lub zwrócić się
              o doradztwo prawne.
            </p>

            <h2>1. Administrator danych</h2>
            <p>
              Administratorem Twoich danych osobowych jest Dan-Dom Nieruchomości (dalej: „Administrator”).
              Kontakt z Administratorem jest możliwy:
            </p>
            <ul>
              <li>
                e-mail:{" "}
                <a href="mailto:biuro@dan-dom.pl" className="text-burgundy">
                  biuro@dan-dom.pl
                </a>
              </li>
              <li>telefon: +48 501 769 166</li>
              <li>
                adresy biur: ul. Kościuszki 28, 62-100 Wągrowiec; ul. Wielka Poznańska 29, 64-610
                Rogoźno
              </li>
            </ul>

            <h2>2. Cele i podstawy przetwarzania</h2>
            <p>
              Przetwarzamy dane osobowe wyłącznie w zakresie niezbędnym do wybranych przez Ciebie
              celów, zgodnie z art. 6 ust. 1 RODO:
            </p>
            <ul>
              <li>
                <strong>Kontakt i obsługa zapytań</strong> (formularz, e-mail, telefon) — podstawa:
                wykonanie umowy lub podjęcie działań przed zawarciem umowy na żądanie osoby, której
                dane dotyczą (art. 6 ust. 1 lit. b), albo prawnie uzasadniony interes Administratora
                w odpowiedzi na zapytanie (art. 6 ust. 1 lit. f).
              </li>
              <li>
                <strong>Prowadzenie strony i bezpieczeństwo</strong> (np. logi serwera u dostawcy
                hostingu) — prawnie uzasadniony interes (art. 6 ust. 1 lit. f).
              </li>
              <li>
                <strong>Analityka ruchu w serwisie (Google Analytics 4)</strong> — wyłącznie po
                wyrażeniu przez Ciebie zgody na pliki cookies/analitykę w banerze cookies (art. 6
                ust. 1 lit. a RODO). W każdej chwili możesz wycofać zgodę, bez wpływu na zgodność z
                prawem przetwarzania przed jej cofnięciem.
              </li>
            </ul>

            <h2>3. Okres przechowywania</h2>
            <p>
              Dane z formularza i korespondencji przechowujemy przez czas potrzebny do obsługi
              sprawy, a następnie przez okres wymagany przepisami prawa lub przedawnienia roszczeń.
              Dane analityczne (po zgodzie) są przetwarzane zgodnie z ustawieniami i dokumentacją
              Google Analytics oraz standardami retencji Google.
            </p>

            <h2>4. Odbiorcy danych</h2>
            <p>
              Dane mogą być powierzane podmiotom wspierającym Administratora w świadczeniu usług IT
              (hosting), obsłudze formularza kontaktowego oraz — po zgodzie — dostawcy analityki
              internetowej:
            </p>
            <ul>
              <li>
                <strong>Web3Forms</strong> — usługa przekazania wiadomości z formularza na wskazany
                adres e-mail. Dane przetwarzane są zgodnie z polityką tego dostawcy:{" "}
                <a href="https://web3forms.com" target="_blank" rel="noopener noreferrer">
                  web3forms.com
                </a>
                .
              </li>
              <li>
                <strong>Google Ireland Limited</strong> (Google Analytics 4) — po wyrażeniu zgody
                w banerze cookies. Dane mogą być przekazywane do USA w oparciu o decyzje Komisji
                Europejskiej (np. Data Privacy Framework) lub inne mechanizmy zgodne z RODO.
              </li>
            </ul>

            <h2>5. Twoje prawa</h2>
            <p>Przysługuje Ci m.in. prawo do:</p>
            <ul>
              <li>dostępu do danych oraz ich kopii,</li>
              <li>sprostowania (poprawiania) danych,</li>
              <li>usunięcia danych,</li>
              <li>ograniczenia przetwarzania,</li>
              <li>przenoszenia danych,</li>
              <li>wniesienia sprzeciwu wobec przetwarzania opartego na prawnie uzasadnionym interesie,</li>
              <li>cofnięcia zgody w dowolnym momencie (gdy przetwarzanie opiera się na zgodzie),</li>
              <li>
                wniesienia skargi do Prezesa Urzędu Ochrony Danych Osobowych (
                <a href="https://uodo.gov.pl" target="_blank" rel="noopener noreferrer">
                  uodo.gov.pl
                </a>
                ).
              </li>
            </ul>
            <p>
              Aby skorzystać z praw, napisz na adres:{" "}
              <a href="mailto:biuro@dan-dom.pl">biuro@dan-dom.pl</a>.
            </p>

            <h2>6. Pliki cookies</h2>
            <p>
              Serwis może używać plików cookies niezbędnych do działania strony oraz — po
              wyrażeniu zgody — cookies analitycznych (Google Analytics 4). Zgodę możesz wyrazić
              lub odrzucić w banerze cookies; wybór „Tylko niezbędne” oznacza brak ładowania
              analityki. Ustawienia przechowywane są lokalnie w Twojej przeglądarce (np.{" "}
              <code className="rounded bg-zinc-100 px-1 text-sm">localStorage</code>). Usunięcie
              danych w przeglądarce spowoduje ponowne wyświetlenie banera.
            </p>

            <h2>7. Środki techniczne i organizacyjne</h2>
            <p>
              Stosujemy środki odpowiednie do ryzyka, m.in. szyfrowanie połączenia (HTTPS),
              ograniczenie dostępu do danych oraz wybór dostawców zapewniających zgodność z RODO.
            </p>

            <h2>8. Zmiany polityki</h2>
            <p>
              Zastrzegamy sobie prawo do aktualizacji niniejszej polityki. O istotnych zmianach
              możemy poinformować na stronie głównej lub w tej sekcji, aktualizując datę „ostatniej
              aktualizacji”.
            </p>
          </div>
        </article>

        <section className="mt-20" aria-label="Kontakt i nasze dane">
          <ContactDetailsSection />
        </section>
      </main>
    </div>
  );
}
