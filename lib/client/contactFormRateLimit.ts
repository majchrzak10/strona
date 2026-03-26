/**
 * Limit wysyłek formularza w sesji (sessionStorage). Sprawdzenie przed fetch,
 * zapis znacznika czasu dopiero po udanej odpowiedzi Web3Forms.
 */
const STORAGE_KEY = "dd-contact-form-ts";
const WINDOW_MS = 15 * 60 * 1000;
const MAX_SUBMITS = 6;

export function isContactFormRateLimitOk(): boolean {
  if (typeof window === "undefined") return true;
  try {
    const now = Date.now();
    const raw = sessionStorage.getItem(STORAGE_KEY);
    const prev: number[] = raw ? (JSON.parse(raw) as number[]) : [];
    const recent = prev.filter((t) => now - t < WINDOW_MS);
    return recent.length < MAX_SUBMITS;
  } catch {
    return true;
  }
}

export function recordContactFormSubmit(): void {
  if (typeof window === "undefined") return;
  try {
    const now = Date.now();
    const raw = sessionStorage.getItem(STORAGE_KEY);
    const prev: number[] = raw ? (JSON.parse(raw) as number[]) : [];
    const recent = prev.filter((t) => now - t < WINDOW_MS);
    recent.push(now);
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(recent));
  } catch {
    /* ignore */
  }
}
