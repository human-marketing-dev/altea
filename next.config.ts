import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* Que las respuestas no anuncien «X-Powered-By: Next.js» (9 nov 2026). */
  poweredByHeader: false,

  /*
   * Las extensiones por defecto, más `dev.tsx` sólo en desarrollo.
   *
   * Es lo que mantiene app/mapa-demo/page.dev.tsx fuera del build de
   * producción: al no estar `dev.tsx` en la lista, Next no reconoce el archivo
   * como página y la ruta no existe — no es que responda 404, es que no se
   * compila. En `next dev` sí está y se puede probar el mapa aislado.
   *
   * La lista base tiene que ir completa: `pageExtensions` REEMPLAZA el valor por
   * defecto, y resuelve también layout, route y demás archivos especiales. Si se
   * omitiera `tsx`, no habría sitio.
   */
  pageExtensions:
    process.env.NODE_ENV === "development"
      ? ["js", "jsx", "mdx", "ts", "tsx", "dev.tsx"]
      : ["js", "jsx", "mdx", "ts", "tsx"],
  images: {
    /*
     * 75 es el valor por defecto de Next 16 y el único que acepta sin esta
     * lista: cualquier otro `quality` se rebaja al más cercano. El 90 es para
     * los PNG recortados con alfa —el del cierre de /comercial—, donde el filo
     * del recorte es lo primero que se ensucia al comprimir.
     */
    qualities: [75, 90],
  },

  /*
   * ⚠ LA BARRA FINAL LA QUITAMOS NOSOTROS, NO NEXT. Next trae una regla interna
   * (`/:path+/` → `/:path+`, 308) que va con prioridad, ANTES que cualquier
   * redirección de la lista de abajo. Con ella, una URL vieja de WordPress con
   * barra —`/privacidad/`— daba dos saltos: 308 a `/privacidad` y luego otro a
   * `/aviso-de-privacidad`. Apagándola, las reglas específicas atrapan la URL
   * con barra o sin ella en un solo salto, y la regla genérica de la barra va
   * al final de la lista para todo lo demás (`/nosotros/` → `/nosotros`).
   */
  skipTrailingSlashRedirect: true,

  /*
   * CACHÉ DE LOS ARCHIVOS DE /public (noviembre de 2026). Next los sirve con
   * `max-age=0`: el navegador vuelve a preguntar por cada foto, logo y textura
   * en cada visita, de 13 a 60 consultas por página.
   *
   * Un día fresco y una semana de margen, no un año: los nombres de estos
   * archivos no llevan huella (`paseo-la-fe.webp`, no `paseo-la-fe.a81f.webp`),
   * así que una foto reemplazada con el mismo nombre tiene que poder llegar. Con
   * esto, quien vuelve el mismo día no consulta nada; después, el navegador
   * enseña la que tiene y la revisa por detrás, y la nueva se ve en la visita
   * siguiente.
   *
   * Lo de /_next/static ya va como inmutable y /_next/image trae sus 4 horas;
   * eso lo pone Next y no se toca.
   */
  async headers() {
    const cache = [
      {
        key: "Cache-Control",
        value: "public, max-age=86400, stale-while-revalidate=604800",
      },
    ];
    /*
     * ENCABEZADOS DE SEGURIDAD (9 nov 2026), en todas las respuestas. No cambian
     * nada de lo que se ve; le dicen al navegador qué no permitir:
     *
     * · X-Frame-Options: que otro sitio no pueda meter éste en un <iframe> (el
     *   truco de poner botones invisibles encima). SAMEORIGIN y no DENY para
     *   que el propio Studio de Sanity, que vive en el mismo dominio, pueda
     *   enseñar el sitio dentro si algún día se usa su vista previa.
     * · X-Content-Type-Options: que el navegador no adivine el tipo de un
     *   archivo; si dice imagen, se trata como imagen.
     * · Referrer-Policy: a otros sitios sólo se les dice el dominio de donde
     *   viene el visitante, no la página. Es lo que ya hacen los navegadores por
     *   defecto; aquí queda explícito. YouTube necesita ese dato (error 153 sin
     *   él), y con esto lo sigue recibiendo.
     * · Permissions-Policy: el sitio no usa cámara, micrófono ni ubicación, así
     *   que nadie dentro de él —tampoco un iframe— puede pedirlos. Lo que sí usa
     *   el video de YouTube (autoplay, pantalla completa) no se toca.
     *
     * Sin Content-Security-Policy, a propósito: una mal ajustada rompe Google
     * Analytics, YouTube o el Studio sin dar error visible. Y sin HSTS: ése va en
     * el servidor (RunCloud) cuando el certificado SSL esté puesto y probado.
     */
    const seguridad = [
      { key: "X-Frame-Options", value: "SAMEORIGIN" },
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
    ];
    return [
      { source: "/:path*", headers: seguridad },
      ...["/images/:path*", "/brand/:path*", "/video/:path*"].map(
        (source) => ({ source, headers: cache }),
      ),
    ];
  },

  /*
   * LAS URLs DEL SITIO VIEJO (el WordPress de www.alteadesarrollos.com), para
   * que lo que Google tiene indexado no acabe en 404. Ver docs/seo.md, §3.
   *
   * 301 y no `permanent: true` (que es 308) en las de contenido: las dos son
   * permanentes y Google las trata igual, pero 301 es la que entiende cualquier
   * rastreador. La de la barra queda en 308, como la tenía Next.
   *
   * `{/}?` es la barra final opcional: atrapa la URL con barra y sin ella.
   *
   * ⚠ Van en la configuración de Next y no en el servidor para que viajen con
   * el repositorio, y tienen que estar desplegadas ANTES de que el dominio
   * apunte al servidor nuevo.
   */
  async redirects() {
    return [
      /* El aviso de privacidad. Arregla de paso el texto del propio aviso, que
         cita www.alteadesarrollos.com/privacidad (sin barra). */
      {
        source: "/privacidad{/}?",
        destination: "/aviso-de-privacidad",
        statusCode: 301,
      },
      /* Las fichas por plaza: en el sitio nuevo no hay página por plaza, y las
         ocho del sitio viejo son centros comerciales. */
      {
        source: "/desarrollos/:plaza{/}?",
        destination: "/comercial",
        statusCode: 301,
      },
      /* Las tres categorías de plazas. `uncategorized` NO va aquí: no tiene
         equivalente (pendiente de decidir). */
      {
        source:
          "/category/:categoria(plazas-comerciales|plaza-comerciales-2|plaza-comerciales-3){/}?",
        destination: "/comercial",
        statusCode: 301,
      },
      /* Al final: la barra final, para todo lo demás. Sustituye a la regla
         interna de Next (ver skipTrailingSlashRedirect). */
      {
        source: "/:path+/",
        destination: "/:path+",
        statusCode: 308,
      },
    ];
  },
};

export default nextConfig;
