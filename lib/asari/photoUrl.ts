/** Wyciąga nazwę pliku ze statycznego URL zdjęcia Asari (/zdjecia/...). */
export function photoNameFromApiUrl(src: string | null): string | null {
  if (!src) return null;
  const prefix = "/zdjecia/";
  if (!src.startsWith(prefix)) return null;
  try {
    return decodeURIComponent(src.slice(prefix.length));
  } catch {
    return null;
  }
}
