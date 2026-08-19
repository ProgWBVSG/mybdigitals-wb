/**
 * El dominio, en un solo lugar.
 *
 * Estaba escrito a mano en 12 archivos, y con el host equivocado: el servidor
 * redirige mybdigitals.com a www.mybdigitals.com, pero el sitemap, los
 * canonical y los datos estructurados apuntaban al dominio sin www. Resultado:
 * cada URL del sitemap era un redirect, y Search Console las marca como
 * "página con redirección".
 *
 * Si algún día se cambia el dominio principal en Vercel al que no lleva www,
 * se corrige acá y en ningún otro lado.
 */
export const SITE_URL = "https://www.mybdigitals.com";

/** URL absoluta para una ruta interna. */
export function urlDe(ruta: string): string {
  return `${SITE_URL}${ruta.startsWith("/") ? ruta : `/${ruta}`}`;
}
