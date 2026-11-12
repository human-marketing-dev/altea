import type { MetadataRoute } from "next";
import { SITIO } from "@/lib/idioma";

/**
 * /robots.txt
 *
 * ABIERTO A LOS RASTREADORES DESDE EL LANZAMIENTO (13 nov 2026). Mientras el
 * sitio fue maqueta, aquí había un `disallow: "/"` y el layout llevaba
 * `noindex`; se quitaron los dos juntos.
 *
 * Sólo queda fuera /studio, el Studio de Sanity: es el panel de edición, no
 * contenido. (next-sanity le pone además su propio `noindex`.)
 *
 * ⚠ OJO si alguna vez se vuelve a cerrar: el valor es "/", nunca la cadena
 * vacía, que en robots.txt significa «no bloquees nada».
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: "/studio",
    },
    sitemap: `${SITIO}/sitemap.xml`,
  };
}
