import type { Config } from "tailwindcss";
import typography from "@tailwindcss/typography";

export default {
  theme: {
    extend: {
      colors: {
        burgundy: "#800020",
      },
    },
  },
  plugins: [typography],
} satisfies Config;

