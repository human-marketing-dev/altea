import type { ContenidoUnidad, ParDato, ProximoProyecto, Proyecto } from "../../tipos";
import { VIVIENDA as VIVIENDA_ES } from "../vivienda";
import { BUSINESS_UNITS } from "@/app/_home/content.en";

/**
 * Versión en inglés de app/_unidad/contenido/vivienda.ts. La estructura, los
 * datos (fotos, ratios, anclas, colores, sitio) y su porqué viven allí; aquí
 * sólo se sustituyen los textos, por `id`/`slug` para no depender del orden.
 *
 * `unidad` se queda en español: es el tipo `Unidad` de lib/contacto.ts, que el
 * código compara y usa para armar la URL de contacto.
 */

/** El texto inglés de una entrada, o un error con el id que falta. */
function texto<T>(tabla: Record<string, T>, id: string, seccion: string): T {
  const t = tabla[id];
  if (!t) {
    throw new Error(
      `Falta la traducción al inglés de "${id}" (${seccion}) en app/_unidad/contenido/en/vivienda.ts`,
    );
  }
  return t;
}

const TARJETA = BUSINESS_UNITS.find((u) => u.slug === "vivienda");
if (!TARJETA) throw new Error('No hay tarjeta de unidad "vivienda" en app/_home/content.en.ts');

const LOTES: ParDato = { etiqueta: "Format", valor: "Residential lots" };

/* ============================ Proyectos ============================ */

const TEXTOS_PROYECTOS: Record<
  string,
  Pick<Proyecto, "nombre" | "ubicacion" | "alt" | "label" | "descripcion" | "datos" | "aviso">
> = {
  amarantha: {
    nombre: "Amarantha",
    ubicacion: "Santiago, Nuevo León",
    alt: "",
    label: "Amarantha",
    descripcion:
      "An upcoming residential lot development in southern Monterrey, on Carretera Nacional. It will offer approximately 323 lots starting at 200 m², along with amenities such as a clubhouse, swimming pool, gym, padel court, playground, pet park, coworking space, sports bar, barbecue area, and social areas. A project that combines a strategic location with high-end amenities, creating a place designed for living, growing, and building long-term wealth.",
    datos: [
      LOTES,
      { etiqueta: "Lots", valor: "Approximately 323" },
      { etiqueta: "From", valor: "200 m²" },
    ],
    aviso: "Coming soon",
  },
  "reserva-mezquital": {
    nombre: "Reserva Mezquital",
    ubicacion: "Apodaca, Nuevo León",
    alt: "",
    label: "Reserva Mezquital",
    descripcion:
      "Reserva Mezquital is a development of 238 residential lots in Apodaca, Nuevo León, with lot sizes starting at 127.5 m². It is located in a well-connected area with growth potential and includes gated access, green areas, a social area, a playground, a sports court, outdoor fitness equipment, and a pet area.",
    datos: [
      LOTES,
      { etiqueta: "In partnership with", valor: "Terra Regia" },
      { etiqueta: "Lots", valor: "238" },
      { etiqueta: "From", valor: "127.5 m²" },
    ],
  },
};

const PROYECTOS_EN: Proyecto[] = VIVIENDA_ES.proyectos.lista.map((p) => ({
  ...p,
  ...texto(TEXTOS_PROYECTOS, p.id, "proyectos"),
}));

/* ======================== Próximos proyectos ======================= */

const TEXTOS_PROXIMOS: Record<
  string,
  Pick<ProximoProyecto, "name" | "unit" | "location" | "descripcion">
> = {
  "valle-de-los-altos": {
    name: "Valle de los Altos",
    unit: "Residential",
    location: "Juárez, Nuevo León",
    descripcion:
      "A residential development on Prolongación Eloy Cavazos, with connections to main roads and close to schools, shops, and healthcare services. It offers well-connected housing in an area with growth potential.",
  },
  huajuquito: {
    name: "Huajuquito",
    unit: "Residential",
    location: "Santiago, Nuevo León",
    descripcion:
      "Residential lot project that allows owners to build a custom home, with nearby access to a commercial area. It integrates housing and services to make daily life easier.",
  },
  margaritas: {
    name: "Margaritas",
    unit: "Residential",
    location: "Santiago, Nuevo León",
    descripcion:
      "Residential lot development located in the Carretera Nacional area. A project that combines urban planning, security and a residential environment designed for building a home and enjoying a better quality of life.",
  },
  "cumbres-de-loreto": {
    name: "Cumbres de Loreto",
    unit: "Residential",
    location: "Monterrey, Nuevo León",
    descripcion:
      "A residential development in the Cumbres area of western Monterrey. It pairs contemporary architecture with mountain views in a setting that combines connectivity, nature, and quality of life.",
  },
};

const PROXIMOS_EN: ProximoProyecto[] = VIVIENDA_ES.proximos.proyectos.map((p) => ({
  ...p,
  ...texto(TEXTOS_PROXIMOS, p.slug, "próximos"),
}));

/* ============================= Página ============================== */

export const VIVIENDA: ContenidoUnidad = {
  ...VIVIENDA_ES,
  unidad: "Vivienda",
  metadata: {
    title: "Residential — Altea",
    description: TARJETA.descripcion,
  },
  hero: {
    ...VIVIENDA_ES.hero,
    palabra: "Residential",
    descripcion: TARJETA.descripcion,
  },
  cifras: [
    /* "18.8M+", con el "+" detrás, como lo escribe Altea en inglés (12 nov
       2026). La de abajo la dejó con el "+" delante: así va. */
    {
      valor: 18.8,
      signo: "M+",
      etiqueta: "developable m², equivalent to 30+ land parcels",
    },
    { prefijo: "+", valor: 376034, etiqueta: "m² under development" },
  ],
  proyectos: {
    titulo: "Our residential developments",
    lista: PROYECTOS_EN,
  },
  giros: {
    ...VIVIENDA_ES.giros,
    eyebrow: "PENDING",
    titulo: "Residential · PENDING",
  },
  marcas: {
    ...VIVIENDA_ES.marcas,
    titulo: "Residential · PENDING",
  },
  cierre: VIVIENDA_ES.cierre && {
    ...VIVIENDA_ES.cierre,
    titulo: "Developments that connect community and well-being.",
  },
  proximos: {
    titulo: "Upcoming\nprojects",
    proyectos: PROXIMOS_EN,
  },
};
