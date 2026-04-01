/**
 * Minimalna sanityzacja HTML z eksportu Asari — usuwa wektory XSS.
 * Dane pochodzą z wewnętrznego CRM, ale ochrona jest wymagana.
 */
export function sanitizeHtml(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<iframe[\s\S]*?>/gi, "")
    .replace(/\son\w+\s*=\s*["'][^"']*["']/gi, "")
    .replace(/javascript\s*:/gi, "");
}
