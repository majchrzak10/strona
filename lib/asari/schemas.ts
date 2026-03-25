import { z } from "zod";

/**
 * Minimalny kształt węzła oferty z XML Asari (po fast-xml-parser).
 * Passthrough zachowuje dodatkowe pola; walidacja odsiewa zupełnie zepsute obiekty.
 */
export const rawAsariOfferSchema = z
  .object({
    signature: z.union([z.string(), z.number()]).optional(),
    parameters: z.unknown().optional(),
    pictures: z.unknown().optional(),
    description: z.union([z.string(), z.number(), z.boolean()]).optional(),
  })
  .passthrough();

export function normalizeRawOffer(raw: unknown): Record<string, unknown> | null {
  const r = rawAsariOfferSchema.safeParse(raw);
  return r.success ? (r.data as Record<string, unknown>) : null;
}
