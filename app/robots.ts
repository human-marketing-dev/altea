import type { MetadataRoute } from "next";

/**
 * /robots.txt
 *
 * CIERRA EL SITIO COMPLETO A LOS RASTREADORES, y es a propósito: esto es una
 * maqueta para enseñar a Altea, no está publicada, y las fuentes Gotham que usa
 * no tienen licencia web todavía (ver app/layout.tsx).
 *
 * ⚠ ESTO ES LO QUE HAY QUE QUITAR PARA PUBLICAR. Son dos sitios, no uno:
 *   1. el `disallow: "/"` de aquí abajo, y
 *   2. el `robots: { index: false, follow: false }` del metadata de
 *      app/layout.tsx.
 *
 * Los dos NO son redundantes ni se refuerzan: son dos mecanismos que se
 * estorban. Una ruta bloqueada aquí no se descarga nunca, así que su
 * <meta name="robots"> jamás se lee. El cinturón de verdad es este `disallow`;
 * el `noindex` es la red por si alguien llega por un enlace externo y este
 * archivo cambia o se sirve mal.
 *
 * Antes el `disallow` apuntaba a /plantilla, el subárbol donde vivía la maqueta.
 * Al mover todo a la raíz pasó a "/" — OJO, no a BASE: con BASE vacío el valor
 * habría sido la cadena vacía, que en robots.txt significa "no bloquees nada" y
 * habría abierto el sitio entero sin que se notara.
 *
 * No hay `sitemap.ts` en el proyecto, así que no hace falta excluir nada de un
 * sitemap: no existe.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      disallow: "/",
    },
  };
}
