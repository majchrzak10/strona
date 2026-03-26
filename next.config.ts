import type { NextConfig } from "next";

/**
 * `output: "export"` — hosting statyczny; wbudowana optymalizacja obrazów Next jest wyłączona.
 * Lekkie payloady: WebP generuje `scripts/copy-photos.mjs` (sharp); w UI używaj `next/image` + `sizes`.
 *
 * Nagłówki bezpieczeństwa (CSP, HSTS, itd.) na produkcji: `public/.htaccess` — Next nie dodaje ich do `out/` z `headers()`.
 */
const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  /** Dev: HMR gdy otwierasz stronę przez 127.0.0.1 zamiast localhost (np. skrypt / inna zakładka). */
  allowedDevOrigins: ["127.0.0.1", "localhost"],
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
