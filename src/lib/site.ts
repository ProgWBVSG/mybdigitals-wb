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

/**
 * Los dos fundadores. Google arma la respuesta a "quién es el dueño de MYB
 * Digitals" con los datos estructurados `founder`, así que van acá, en un solo
 * lugar, para que la home y /nosotros digan siempre lo mismo.
 */
export const FUNDADORES = [
  { nombre: "Benjamín Vidal", cargo: "Cofundador" },
  { nombre: "Matías König", cargo: "Cofundador" },
] as const;

/** Los fundadores como nodos Person de schema.org. */
export const FUNDADORES_JSONLD = FUNDADORES.map((f) => ({
  "@type": "Person",
  name: f.nombre,
  jobTitle: f.cargo,
}));

/** Identificador de la empresa: une los datos de la home con los de /nosotros. */
export const EMPRESA_ID = `${SITE_URL}/#empresa`;

/** URL absoluta para una ruta interna. */
export function urlDe(ruta: string): string {
  return `${SITE_URL}${ruta.startsWith("/") ? ruta : `/${ruta}`}`;
}
