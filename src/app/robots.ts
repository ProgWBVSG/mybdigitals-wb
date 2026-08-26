import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

/**
 * El sitio no tenía robots.txt, así que el sitemap no estaba declarado en
 * ningún lado y los buscadores dependían de encontrarlo por su cuenta.
 *
 * Los bots de IA quedan permitidos a propósito: bloquearlos deja al sitio
 * fuera de las respuestas de ChatGPT, Claude y Perplexity.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
