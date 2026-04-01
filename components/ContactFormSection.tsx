"use client";

import { useState, type FormEvent } from "react";
import {
  isContactFormRateLimitOk,
  recordContactFormSubmit,
} from "@/lib/client/contactFormRateLimit";
import { trackEvent } from "@/lib/client/analytics";
import { SITE_URL } from "@/lib/seo/site";
import { contactFormSchema } from "@/lib/validation/contactForm";

const labelClass = "mb-0.5 block text-[11px] font-semibold uppercase tracking-wide text-zinc-700";

function fieldClass(extra = ""): string {
  return [
    "w-full min-w-0 border-0 border-b border-zinc-300 bg-transparent px-0 py-2 text-sm text-zinc-900",
    "placeholder:text-zinc-400 transition-colors",
    "focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/35 focus:ring-offset-0",
    extra,
  ].join(" ");
}

function getWeb3FormsAccessKey(): string {
  return process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY?.trim() ?? "";
}

function fullNameFromParts(firstName: string, lastName: string): string {
  return `${firstName} ${lastName}`.replace(/\s+/g, " ").trim();
}

export default function ContactFormSection() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
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

    const formEl = e.currentTarget;
    const botField = formEl.elements.namedItem("botcheck");
    const botValue = botField instanceof HTMLInputElement ? botField.value : "";
    if (botValue.trim() !== "") {
      return;
    }

    const accessKey = getWeb3FormsAccessKey();
    if (!accessKey) {
      setError(
        "Formularz nie jest skonfigurowany (brak klucza Web3Forms). Dodaj NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY w .env.local — patrz .env.example.",
      );
      return;
    }

    const parsed = contactFormSchema.safeParse(form);
    if (!parsed.success) {
      const first = parsed.error.flatten().fieldErrors;
      const msg =
        first.firstName?.[0] ??
        first.lastName?.[0] ??
        first.email?.[0] ??
        first.phone?.[0] ??
        first.message?.[0] ??
        "Sprawdź poprawność pól.";
      setError(msg);
      return;
    }

    const data = parsed.data;

    if (!isContactFormRateLimitOk()) {
      setError(
        "Zbyt wiele wysyłek z tej przeglądarki. Spróbuj ponownie za kilkanaście minut lub napisz na biuro@dan-dom.pl.",
      );
      return;
    }

    const fromName = fullNameFromParts(data.firstName, data.lastName);

    setIsSubmitting(true);
    try {
      const payload = {
        access_key: accessKey,
        subject: `Zapytanie ze strony ${new URL(SITE_URL).hostname} — ${fromName}`,
        from_name: fromName,
        email: data.email,
        phone: data.phone,
        message: data.message,
        botcheck: "",
      };
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(payload),
      });
      const jsonBody = (await res.json().catch(() => ({}))) as {
        success?: boolean;
        message?: string;
      };
      if (!res.ok || !jsonBody.success) {
        setError(jsonBody.message ?? "Wystąpił błąd. Spróbuj ponownie.");
        return;
      }
      recordContactFormSubmit();
      trackEvent("generate_lead", {
        lead_type: "contact_form",
        form_name: "contact_main",
      });
      setIsSuccess(true);
      setForm({ firstName: "", lastName: "", email: "", phone: "", message: "" });
    } catch {
      setError("Brak połączenia z serwerem. Sprawdź sieć i spróbuj ponownie.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div
      className="motion-safe:animate-[contact-strip-in_0.45s_ease-out_both] motion-reduce:animate-none -mx-5 mt-10 border-t border-zinc-100 bg-zinc-50/60 px-5 pb-8 pt-10 sm:-mx-10 sm:px-10 sm:pb-10 lg:-mx-14 lg:px-14 lg:pb-10"
      aria-labelledby="contact-form-heading"
    >
      <div className="mx-auto w-full max-w-[1400px]">
        <div className="grid gap-6 lg:grid-cols-10 lg:gap-8 lg:items-start">
          <div className="lg:col-span-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-zinc-500">
              Kontakt
            </p>
            <h3
              id="contact-form-heading"
              className="mt-2 font-[var(--font-playfair)] text-xl font-bold leading-snug text-zinc-900 sm:text-2xl"
            >
              Porozmawiajmy o Twojej nieruchomości
            </h3>
          </div>

          <div className="lg:col-span-6">
            {isSuccess ? (
              <div
                className="rounded-lg border border-zinc-200 bg-white px-4 py-6 text-center shadow-sm"
                role="status"
              >
                <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-brand-primary text-white">
                  <svg
                    className="h-5 w-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    aria-hidden
                  >
                    <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <p className="mt-3 font-[var(--font-playfair)] text-base font-semibold text-zinc-900">
                  Dziękujemy! Wiadomość wysłana.
                </p>
                <p className="mt-1 text-sm text-zinc-600">
                  Skontaktujemy się najszybciej, jak to możliwe.
                </p>
              </div>
            ) : (
              <form className="flex w-full min-w-0 flex-col gap-3" onSubmit={handleSubmit} noValidate>
                <input
                  type="text"
                  name="botcheck"
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                  className="pointer-events-none absolute left-[-9999px] h-0 w-0 opacity-0"
                />
                {error ? (
                  <p
                    className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800"
                    role="alert"
                  >
                    {error}
                  </p>
                ) : null}

                <div className="grid grid-cols-1 gap-x-4 gap-y-3 sm:grid-cols-2">
                  <div>
                    <label htmlFor="contact-first-name" className={labelClass}>
                      Imię <span className="text-brand-primary">*</span>
                    </label>
                    <input
                      id="contact-first-name"
                      type="text"
                      name="firstName"
                      required
                      autoComplete="given-name"
                      placeholder="Jan"
                      className={fieldClass()}
                      value={form.firstName}
                      onChange={(e) => setForm((f) => ({ ...f, firstName: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label htmlFor="contact-last-name" className={labelClass}>
                      Nazwisko <span className="text-brand-primary">*</span>
                    </label>
                    <input
                      id="contact-last-name"
                      type="text"
                      name="lastName"
                      required
                      autoComplete="family-name"
                      placeholder="Kowalski"
                      className={fieldClass()}
                      value={form.lastName}
                      onChange={(e) => setForm((f) => ({ ...f, lastName: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-x-4 gap-y-3 sm:grid-cols-2">
                  <div>
                    <label htmlFor="contact-phone" className={labelClass}>
                      Telefon <span className="text-brand-primary">*</span>
                    </label>
                    <input
                      id="contact-phone"
                      type="tel"
                      name="phone"
                      required
                      autoComplete="tel"
                      placeholder="501 000 000"
                      className={fieldClass()}
                      value={form.phone}
                      onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label htmlFor="contact-email" className={labelClass}>
                      E-mail <span className="text-brand-primary">*</span>
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      name="email"
                      required
                      autoComplete="email"
                      placeholder="jan@example.pl"
                      className={fieldClass()}
                      value={form.email}
                      onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="contact-message" className={labelClass}>
                    Wiadomość <span className="text-brand-primary">*</span>
                  </label>
                  <textarea
                    id="contact-message"
                    name="message"
                    required
                    rows={2}
                    placeholder="Krótko: czego szukasz lub co chcesz sprzedać…"
                    className={fieldClass("min-h-[4.5rem] resize-y py-2")}
                    value={form.message}
                    onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                  />
                </div>

                <div className="flex flex-col gap-2 pt-1 sm:flex-row sm:justify-end">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex min-h-[44px] w-full touch-manipulation items-center justify-center gap-2 rounded-full bg-brand-primary px-6 py-2.5 text-sm font-semibold uppercase tracking-wide text-white shadow-sm transition-colors hover:bg-brand-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-60 sm:w-auto sm:min-w-[200px]"
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
      </div>
    </div>
  );
}
