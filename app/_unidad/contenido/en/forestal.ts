import type { ContenidoUnidad, FotoLinea, LineaNegocio } from "../../tipos";
import { FORESTAL as FORESTAL_ES } from "../forestal";
import { BUSINESS_UNITS } from "@/app/_home/content.en";

/**
 * Versión en inglés de app/_unidad/contenido/forestal.ts. La estructura, los
 * datos (fotos, ratios, anclas, logotipos, iconos, colores) y su porqué viven
 * allí; aquí sólo se sustituyen los textos, por `id` y por `src` para no
 * depender del orden.
 *
 * `unidad` se queda en español: es el tipo `Unidad` de lib/contacto.ts, que el
 * código compara y usa para armar la URL de contacto.
 */

/** El texto inglés de una entrada, o un error con la clave que falta. */
function texto<T>(tabla: Record<string, T>, id: string, seccion: string): T {
  const t = tabla[id];
  if (!t) {
    throw new Error(
      `Falta la traducción al inglés de "${id}" (${seccion}) en app/_unidad/contenido/en/forestal.ts`,
    );
  }
  return t;
}

const TARJETA = BUSINESS_UNITS.find((u) => u.slug === "forestal");
if (!TARJETA) throw new Error('No hay tarjeta de unidad "forestal" en app/_home/content.en.ts');

/* ======================== Líneas de negocio ======================== */

/** Los `alt` de las fotos de las líneas, por `src`. */
const ALTS: Record<string, string> = {
  "/images/forestal/teca/teca-forestal-altea.webp":
    "Altea teak plantation in the Yucatán Peninsula",
  "/images/forestal/teca/teca-forestal-altea-2.webp":
    "Dirt road between teak trees, with the ground covered in leaves",
  "/images/forestal/teca/teca-forestal-altea-3.webp":
    "Interior of the teak plantation, with tall, straight trunks and vegetation at their base",
  "/images/forestal/teca/teca-forestal-altea-4.webp":
    "Young teak trees on both sides of a track through the plantation",
  "/images/forestal/viveros-asturias/viveros-asturias-forestal-altea-4.webp":
    "Planter with grass and trimmed hedges in front of a retail store, landscaping work by Viveros Asturias",
  "/images/forestal/viveros-asturias/viveros-asturias-forestal-altea-5.webp":
    "Landscaped roundabout with palms at a vehicle entrance, with a potted palm in the foreground",
  "/images/forestal/viveros-asturias/viveros-asturias-forestal-altea-6.webp":
    "Planter with palms and shade plants next to the facade of a building",
  "/images/forestal/viveros-asturias/viveros-asturias-forestal-altea-8.webp":
    "Green area with grass, hedges and trees, maintained by Viveros Asturias",
};

const conAlt = (f: FotoLinea): FotoLinea => ({ ...f, alt: texto(ALTS, f.src, "fotos de las líneas") });

/**
 * Los textos de cada línea. Los títulos de la lista van por el `icono` de cada
 * elemento, que no se traduce.
 */
const TEXTOS_LINEAS: Record<
  string,
  { titulo: string; logoAlt?: string; parrafos: string[]; rotulo: string; items: Record<string, string> }
> = {
  teca: {
    titulo: "Teak",
    /* El nombre de la marca, como en el logotipo. */
    logoAlt: "Teca San Miguel",
    parrafos: [
      "A commercial forestry plantation in Tizimín, Yucatán, aimed at restoring forest use on land degraded by farming and ranching. In 2011, we began planting 682,853 teak trees across 841 hectares. The project seeks to support soil recovery and the livelihoods of at least 100 Maya families in the region.",
    ],
    rotulo: "Applications",
    items: {
      mobiliario: "Furniture",
      construccion: "Construction",
      hoteleria: "Hospitality",
      embarcaciones: "Boatbuilding",
    },
  },
  "viveros-asturias": {
    titulo: "Viveros Asturias",
    logoAlt: "Viveros Asturias",
    parrafos: [
      "We offer comprehensive solutions in urban trees, landscaping and green space conservation for corporate and government projects. Our services range from tree production and supply to maintenance and preservation, using specialized techniques that promote healthy growth.",
      "We currently provide landscaping services at 23 shopping centers and maintenance at 19 properties, with more than 40,000 m² of green areas serviced monthly and more than 18,000 new trees planted, contributing to the conservation and improvement of natural spaces.",
    ],
    rotulo: "Services",
    items: {
      jardineria: "Landscaping service",
      reforestacion: "Reforestation",
      mantenimiento: "Maintenance",
    },
  },
};

const LINEAS_EN: LineaNegocio[] = (FORESTAL_ES.lineas ?? []).map((l) => {
  const t = texto(TEXTOS_LINEAS, l.id, "líneas de negocio");
  const [primera, ...resto] = l.fotos;
  return {
    ...l,
    titulo: t.titulo,
    logo: l.logo && { ...l.logo, alt: t.logoAlt ?? l.logo.alt },
    parrafos: t.parrafos,
    fotos: [conAlt(primera), ...resto.map(conAlt)],
    lista: {
      rotulo: t.rotulo,
      items: l.lista.items.map((item) => ({
        ...item,
        titulo: texto(t.items, item.icono ?? item.titulo, `lista de ${l.id}`),
      })),
    },
  };
});

/* ============================= Página ============================== */

export const FORESTAL: ContenidoUnidad = {
  ...FORESTAL_ES,
  unidad: "Forestal",
  metadata: {
    title: "Forestry — Altea",
    description: TARJETA.descripcion,
  },
  hero: {
    ...FORESTAL_ES.hero,
    palabra: "Forestry",
    descripcion: TARJETA.descripcion,
  },
  /*
   * "18 mil" se escribe con todas sus cifras (18,000), como "700 mil" en
   * Comercial: "thousand" no cabe de sufijo.
   */
  cifras: [
    { valor: 1465, etiqueta: "hectares for forestry use" },
    { valor: 18000, etiqueta: "trees produced per year" },
  ],
  lineas: LINEAS_EN,
  proyectos: {
    titulo: "Our forest plantation project",
    lista: [],
  },
  giros: {
    ...FORESTAL_ES.giros,
    titulo: "Services",
  },
  marcas: {
    ...FORESTAL_ES.marcas,
    titulo: "Forestry · PENDING",
  },
  /* Sin `titulo`, como en el español: lleva el del cierre de contacto. */
  cierre: FORESTAL_ES.cierre,
  proximos: {
    titulo: "Upcoming\nprojects",
    proyectos: [],
  },
};
