import { ruta } from "./rutas";

/**
 * Los dos idiomas del sitio (noviembre de 2026).
 *
 * El español vive en la raíz, como siempre: sus URLs y las redirecciones del
 * sitio viejo no se tocan. El inglés vive bajo /en, con las rutas traducidas
 * —/en/about-us, /en/commercial…—, que es lo que lee natural un visitante
 * extranjero y lo que mejor posiciona en buscadores en inglés.
 *
 * TODO ENLACE INTERNO SE ESCRIBE CON LA RUTA EN ESPAÑOL y pasa por `rutaDe`,
 * que la traduce si toca. Así la lista de abajo es el único sitio donde vive la
 * correspondencia entre las dos.
 */
export type Idioma = "es" | "en";

/** La ruta en español → su equivalente en inglés. */
const RUTAS_EN: Record<string, string> = {
  "/": "/en",
  "/nosotros": "/en/about-us",
  "/comercial": "/en/commercial",
  "/industrial": "/en/industrial",
  "/vivienda": "/en/residential",
  "/forestal": "/en/forestry",
  "/contacto": "/en/contact",
  "/aviso-de-privacidad": "/en/privacy-notice",
  "/terminos": "/en/terms",
};

const RUTAS_ES: Record<string, string> = Object.fromEntries(
  Object.entries(RUTAS_EN).map(([es, en]) => [en, es]),
);

/**
 * `rutaDe("/comercial", "en")` → `/en/commercial`; en español, la de siempre.
 * Conserva la query y el ancla: `rutaDe("/contacto?unidad=vivienda", "en")` →
 * `/en/contact?unidad=vivienda`. Pasa además por `ruta()`, así que respeta
 * BASE si algún día el sitio vuelve a vivir bajo un subárbol.
 */
export function rutaDe(camino: string, idioma: Idioma): string {
  if (idioma === "es") return ruta(camino);
  const corte = camino.search(/[?#]/);
  const base = corte < 0 ? camino : camino.slice(0, corte);
  const resto = corte < 0 ? "" : camino.slice(corte);
  return ruta(`${RUTAS_EN[base] ?? `/en${base}`}${resto}`);
}

/** El idioma de una ruta: inglés si cuelga de /en. */
export const idiomaDeRuta = (pathname: string | null | undefined): Idioma =>
  pathname === "/en" || pathname?.startsWith("/en/") ? "en" : "es";

/**
 * La misma página en el otro idioma: lo que necesita el botón ES | EN. Una ruta
 * sin equivalente —no debería haberla— lleva a la portada del otro idioma.
 */
export function rutaEquivalente(pathname: string, destino: Idioma): string {
  const actual = idiomaDeRuta(pathname);
  if (actual === destino) return ruta(pathname);
  if (destino === "en") return ruta(RUTAS_EN[pathname] ?? "/en");
  return ruta(RUTAS_ES[pathname] ?? "/");
}

/**
 * El dominio de producción, para lo que necesita URLs absolutas: canónicas,
 * `hreflang`, sitemap, robots.txt y la imagen de vista previa.
 *
 * SIN WWW (13 nov 2026, decidido): el servidor sirve el sitio en
 * alteadesarrollos.com y manda www.alteadesarrollos.com ahí con un 301. Esto
 * tiene que coincidir con esa redirección: si dijera www, cada página
 * declararía como oficial una dirección que redirige a otra.
 */
export const SITIO = "https://alteadesarrollos.com";

/** Las rutas indexables, en español. Cada una tiene su versión en /en. */
export const RUTAS_PUBLICAS = Object.keys(RUTAS_EN);

/** El `lang` del documento, con la región: el español es el de México. */
export const LANG: Record<Idioma, string> = { es: "es-MX", en: "en" };

/**
 * LOS METADATOS DE UNA PÁGINA QUE DEPENDEN DE SU RUTA Y SU IDIOMA (9 nov 2026):
 * la canónica, los `hreflang` y la vista previa al compartir (Open Graph).
 *
 * · Las rutas van relativas y Next las vuelve absolutas con el `metadataBase`
 *   de app/layout.tsx. Antes no había `metadataBase` y los `hreflang` salían
 *   relativos, que Google ignora.
 * · LA CANÓNICA ES LA DE CADA IDIOMA, no la española: /en/commercial es la
 *   canónica de sí misma. Va sin query, así /contacto?unidad=vivienda declara
 *   /contacto. Y no puede ir en el layout, porque todas la heredarían.
 * · `openGraph` se repite entero en cada página porque Next no lo combina con el
 *   del layout: el de la página lo sustituye. Por lo mismo la imagen va aquí y
 *   no como app/opengraph-image.jpg: así sólo la llevaba el home (probado).
 */
/**
 * La imagen al compartir un enlace (WhatsApp, LinkedIn, Facebook…): 1200×630,
 * una nave de Huinala Industrial Park con el logotipo. Una para todo el sitio.
 */
export const VISTA_PREVIA = {
  url: "/images/compartir/altea-vista-previa.jpg",
  width: 1200,
  height: 630,
  alt: "Altea: nave de Huinala Industrial Park al atardecer, con el logotipo de Altea",
};

export function metadatosDe(
  caminoEs: string,
  idioma: Idioma,
  { title, description }: { title: string; description: string },
) {
  const url = rutaDe(caminoEs, idioma);
  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: {
        "es-MX": rutaDe(caminoEs, "es"),
        en: rutaDe(caminoEs, "en"),
        "x-default": rutaDe(caminoEs, "es"),
      },
    },
    openGraph: {
      type: "website" as const,
      siteName: "Altea",
      locale: idioma === "en" ? "en_US" : "es_MX",
      alternateLocale: idioma === "en" ? "es_MX" : "en_US",
      url,
      title,
      description,
      images: [VISTA_PREVIA],
    },
    twitter: {
      card: "summary_large_image" as const,
      title,
      description,
      images: [VISTA_PREVIA],
    },
  };
}
