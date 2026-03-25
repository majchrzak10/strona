"use client";

import { useState, type FormEvent } from "react";

const inputClass =
  "min-h-[44px] w-full rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-base text-zinc-900 shadow-sm transition-colors placeholder:text-zinc-400 focus:border-burgundy focus:outline-none focus:ring-2 focus:ring-burgundy/35 sm:text-sm";

/**
 * Formularz wysyła POST bezpośrednio do Web3Forms (https://web3forms.com).
 * Aby aktywować:
 *  1. Zarejestruj darmowe konto na web3forms.com
 *  2. Wygeneruj Access Key dla biuro@dan-dom.pl
 *  3. Wklej klucz w stałą WEB3FORMS_KEY poniżej
 */
const WEB3FORMS_KEY = "WKLEJ_TUTAJ_SWOJ_KLUCZ_WEB3FORMS";

export default function ContactSection() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      const payload = {
        access_key: WEB3FORMS_KEY,
        subject: `Zapytanie ze strony dan-dom.pl — ${form.name}`,
        from_name: form.name,
        email: form.email,
        phone: form.phone,
        message: form.message,
        botcheck: "",
      };
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await res.json().catch(() => ({}))) as {
        success?: boolean;
        message?: string;
      };
      if (!res.ok || !data.success) {
        setError(data.message ?? "Wystąpił błąd. Spróbuj ponownie.");
        return;
      }
      setIsSuccess(true);
      setForm({ name: "", email: "", phone: "", message: "" });
    } catch {
      setError("Brak połączenia z serwerem. Sprawdź sieć i spróbuj ponownie.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-[1600px] rounded-2xl bg-white px-6 py-16 shadow-[0_4px_15px_rgba(0,0,0,0.05)] sm:px-8 lg:px-10">
      <div className="mx-auto max-w-2xl">
        <h3 className="text-center font-[var(--font-playfair)] text-2xl font-bold text-zinc-900 sm:text-[1.65rem]">
          Porozmawiajmy o Twojej nieruchomości
        </h3>
        <p className="mt-2 text-center text-sm leading-6 text-zinc-600">
          Zostaw kontakt — nasz agent oddzwoni z propozycją kolejnych kroków i gotowymi
          rozwiązaniami dopasowanymi do Twojej sytuacji.
        </p>

        {isSuccess ? (
          <div
            className="mt-6 rounded-xl border border-burgundy/20 bg-burgundy/[0.06] px-6 py-8 text-center"
            role="status"
          >
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-burgundy text-white">
              <svg
                className="h-7 w-7"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                aria-hidden
              >
                <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <p className="mt-5 font-[var(--font-playfair)] text-lg font-semibold text-zinc-900">
              Dziękujemy! Twoja wiadomość została wysłana.
            </p>
            <p className="mt-2 text-sm text-zinc-600">
              Skontaktujemy się z Tobą najszybciej, jak to możliwe.
            </p>
          </div>
        ) : (
          <form className="mt-6 space-y-4" onSubmit={handleSubmit} noValidate>
            {error ? (
              <p
                className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
                role="alert"
              >
                {error}
              </p>
            ) : null}

            <div>
              <label
                htmlFor="contact-name"
                className="mb-1 block text-xs font-semibold text-zinc-700"
              >
                Imię i nazwisko <span className="text-burgundy">*</span>
              </label>
              <input
                id="contact-name"
                type="text"
                name="name"
                required
                autoComplete="name"
                placeholder="Jan Kowalski"
                className={inputClass}
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              />
            </div>

            <div>
              <label
                htmlFor="contact-email"
                className="mb-1 block text-xs font-semibold text-zinc-700"
              >
                E-mail <span className="text-burgundy">*</span>
              </label>
              <input
                id="contact-email"
                type="email"
                name="email"
                required
                autoComplete="email"
                placeholder="jan@example.pl"
                className={inputClass}
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              />
            </div>

            <div>
              <label
                htmlFor="contact-phone"
                className="mb-1 block text-xs font-semibold text-zinc-700"
              >
                Telefon <span className="text-burgundy">*</span>
              </label>
              <input
                id="contact-phone"
                type="tel"
                name="phone"
                required
                autoComplete="tel"
                placeholder="np. 501 000 000"
                className={inputClass}
                value={form.phone}
                onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
              />
            </div>

            <div>
              <label
                htmlFor="contact-message"
                className="mb-1 block text-xs font-semibold text-zinc-700"
              >
                Wiadomość <span className="text-burgundy">*</span>
              </label>
              <textarea
                id="contact-message"
                name="message"
                required
                rows={4}
                placeholder="Napisz, czego szukasz lub jaką nieruchomość chcesz sprzedać..."
                className={`${inputClass} min-h-[6.5rem] resize-y`}
                value={form.message}
                onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
              />
            </div>

            <div className="flex justify-center pt-1">
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex min-h-[48px] w-full touch-manipulation items-center justify-center gap-2 rounded-lg bg-burgundy px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-burgundy/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-burgundy focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-60 active:scale-[0.99] sm:w-auto sm:min-w-[200px]"
              >
                {isSubmitting ? (
                  <>
                    <span
                      className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white"
                      aria-hidden
                    />
                    Wysyłanie...
                  </>
                ) : (
                  "Wyślij wiadomość"
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
