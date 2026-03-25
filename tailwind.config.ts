import type { Config } from "tailwindcss";
import typography from "@tailwindcss/typography";

/** Głęboki burgund marki (oryginalny) + hover ~12% ciemniej — spójne z `globals.css` */
const BRAND_BURGUNDY = "#800020";
const BRAND_BURGUNDY_HOVER = "#5c0018";

export default {
  theme: {
    extend: {
      colors: {
        burgundy: BRAND_BURGUNDY,
        brand: {
          /** Alias semantyczny — ten sam hex co `primary`, żeby uniknąć dryfu kolorów */
          burgundy: BRAND_BURGUNDY,
          primary: BRAND_BURGUNDY,
          hover: BRAND_BURGUNDY_HOVER,
        },
      },
    },
  },
  plugins: [typography],
} satisfies Config;
