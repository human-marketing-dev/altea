import type { MetadataRoute } from "next";
import { RUTAS_PUBLICAS, SITIO, rutaDe } from "@/lib/idioma";

/**
 * /sitemap.xml (noviembre de 2026)
 *
 * Las nueve páginas en los dos idiomas: dieciocho URLs absolutas. Cada una
 * declara además su pareja en el otro idioma (`xhtml:link` con hreflang), que
 * es la forma que Google recomienda para sitios bilingües.
 *
 * Sin `lastModified`, `changeFrequency` ni `priority`, a propósito: Google
 * ignora los dos últimos, y una fecha que no refleja cambios reales le enseña a
 * desconfiar de la fecha.
 *
 * La lista sale de lib/idioma.ts: una página nueva entra aquí al sumarse a
 * RUTAS_EN. Mientras robots.txt bloquee el sitio, Google no lo lee; ver
 * app/robots.ts.
 */
const absoluta = (camino: string) => new URL(camino, SITIO).href;

export default function sitemap(): MetadataRoute.Sitemap {
  return RUTAS_PUBLICAS.flatMap((camino) => {
    const languages = {
      "es-MX": absoluta(rutaDe(camino, "es")),
      en: absoluta(rutaDe(camino, "en")),
    };
    return [
      { url: languages["es-MX"], alternates: { languages } },
      { url: languages.en, alternates: { languages } },
    ];
  });
}
