import { z } from "zod";

/** Usuwa znaki ryzykowne dla HTML i sterujące; nie zastępuje serwerowej walidacji Web3Forms. */
export function sanitizePlainText(input: string): string {
  return input.replace(/[\u0000-\u001F\u007F<>]/g, "").trim();
}

export const contactFormSchema = z.object({
  firstName: z
    .string()
    .min(1, "Podaj imię.")
    .max(80)
    .transform(sanitizePlainText)
    .refine((s) => s.length > 0, "Podaj imię."),
  lastName: z
    .string()
    .min(1, "Podaj nazwisko.")
    .max(80)
    .transform(sanitizePlainText)
    .refine((s) => s.length > 0, "Podaj nazwisko."),
  email: z.string().min(1).max(120).email("Podaj poprawny adres e-mail."),
  phone: z
    .string()
    .min(6, "Podaj numer telefonu.")
    .max(40)
    .transform(sanitizePlainText),
  message: z
    .string()
    .min(1, "Wpisz wiadomość.")
    .max(8000)
    .transform(sanitizePlainText)
    .refine((s) => s.length > 0, "Wpisz wiadomość."),
});

export type ContactFormValues = z.infer<typeof contactFormSchema>;
