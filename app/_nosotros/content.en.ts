import {
  ESTADOS_CON_PRESENCIA,
  PRESENCIA_INTERNACIONAL,
} from "@/lib/proyectos";
import * as ES from "./content";
import type { BloqueQuienes, FotoGaleria, SectorFirma } from "./content";

/**
 * Versión en inglés de app/_nosotros/content.ts. La estructura, los datos y
 * su razón de ser viven allí; aquí sólo cambia el texto visible. Los datos que
 * no son texto (rutas, proporciones, ids, cifras) se toman del módulo español.
 */

/* Traduce los campos de texto de una lista por `id`, conservando el resto. */
const porId = <T extends { id: string }>(
  xs: readonly T[],
  textos: Record<string, Partial<T>>,
): T[] => xs.map((x) => ({ ...x, ...textos[x.id] }));

/* ─── 1 · Hero ─────────────────────────────────────────────────────────── */

export const HERO = {
  lineas: [
    [{ texto: "We transform" }],
    [{ texto: "land into" }],
    [{ texto: "opportunities", acento: true }],
  ] as { texto: string; acento?: boolean }[][],
  bajada:
    "We are a full-service real estate developer based in Monterrey, Nuevo León, with solid experience and an extensive land bank.",
  pie: {
    isotipo: `${ESTADOS_CON_PRESENCIA.length} states · ${PRESENCIA_INTERNACIONAL.length + 1} countries`,
    piramide: "Four decades of building",
  },
};

export const ORIGEN = {
  title: "How did Altea begin?",
  frase: [
    { texto: "Over" },
    { texto: "40 years", acento: true },
    { texto: "transforming square meters into opportunities." },
  ] as { texto: string; acento?: boolean }[],
  parrafos: [
    "At Altea, we have more than 40 years of experience in real estate development in Mexico. Our history began as movie theater owners, where we developed entertainment venues and gained experience that, over time, allowed us to broaden our capabilities and vision.",
    "Through our constant evolution and adaptation, at Altea we continue to build the future with the same commitment we had at the outset: to generate value, quality and opportunities in every square meter we transform.",
  ],
  fotos: ES.ORIGEN.fotos.map((foto, i) => ({
    ...foto,
    alt: [
      "Altea's first movie theaters, where the group began",
      "Aerial view of an Altea development under construction",
    ][i] ?? foto.alt,
  })),
  etiquetaFoto: "Photo of Altea's origins",
};

/* ─── 3 · Pilares de identidad ─────────────────────────────────────────── */

export const PILARES = {
  title: "The pillars of our identity",
  bloques: porId(ES.PILARES.bloques, {
    innovacion: { title: "Disruptive innovation" },
    comunidades: { title: "Vibrant communities" },
    trascendencia: { title: "Transcendence" },
  }),
};

/* ─── 4 · Grupo Firmas Globales ────────────────────────────────────────── */

/* Las marcas se quedan como están; sólo cambian las categorías. "Deportes" en
   `marca` no es una marca sino el rótulo de respaldo de la caja, y se traduce. */
const SECTORES: SectorFirma[] = porId(ES.GRUPO_FIRMA.sectores, {
  medios: { categoria: "Media" },
  deportes: { categoria: "Sports", marca: "Sports" },
  inmobiliaria: { categoria: "Real estate" },
  alimentos: { categoria: "Food and entertainment" },
  vinos: { categoria: "Wines and spirits" },
  energia: { categoria: "Energy" },
});

export const GRUPO_FIRMA = {
  title: "We are part of Grupo Firmas Globales",
  intro:
    "At Altea, we are part of a business group that brings together different brands and capabilities, allowing us to work strategically alongside resources that strengthen every stage of our developments.",
  raiz: ES.GRUPO_FIRMA.raiz,
  sectores: SECTORES,
  pie: ["Six sectors", "One long-term vision"],
};

/* ─── 5 · Nuestra huella ───────────────────────────────────────────────── */

/* Los nombres en inglés de PRESENCIA_INTERNACIONAL. Tipado contra la lista
   española: si entra un país nuevo allí, esto no compila hasta traducirlo. */
const PAISES: Record<(typeof PRESENCIA_INTERNACIONAL)[number], string> = {
  "Estados Unidos": "the United States",
  España: "Spain",
  "Costa Rica": "Costa Rica",
};

/* "a, b and c" — sin coma serial, como el resto del sitio en inglés. */
const enumerar = (xs: readonly string[]) =>
  xs.length < 2
    ? (xs[0] ?? "")
    : `${xs.slice(0, -1).join(", ")} and ${xs.at(-1)}`;

export const HUELLA = {
  title: "Our Footprint",
  body: `We have a presence in ${ESTADOS_CON_PRESENCIA.length} states of Mexico, as well as in ${enumerar(
    PRESENCIA_INTERNACIONAL.map((p) => PAISES[p]),
  )}. This coverage reflects our capacity to develop projects across different territories.`,
  cta: {
    ...ES.HUELLA.cta,
    texto: "Discover our scale",
  },
  stats: ES.HUELLA.stats.map((stat, i) => ({
    ...stat,
    label: ["Properties", "Area"][i] ?? stat.label,
  })),
  desglose: ES.HUELLA.desglose.map((d, i) => ({
    ...d,
    label: ["Nuevo León", "Rest of Mexico", "Outside Mexico"][i] ?? d.label,
  })),
  mapa: {
    etiqueta: "Presence",
    titulo: `${ESTADOS_CON_PRESENCIA.length} states of Mexico`,
    pista: "Point to a state to see its built area.",
    pistaTactil: "Tap a state or choose it from the list.",
    elegir: "Choose a state",
    etiquetaEstado: "Built area",
    sinDato: "No built area on record",
  },
};

/* ─── Quiénes somos (sin consumidor, como en español) ──────────────────── */

export const QUIENES_SOMOS = {
  eyebrow: "Who we are",
  titulo:
    "Who we are, our purpose and the integrated model that sets us apart",
  bloques: [
    {
      id: "territorio",
      title:
        "Where others see a plot of land, we see the potential to transform a territory.",
      description:
        "Before designing a project, we understand the market, analyze the surroundings and discover how that space can generate value for people, businesses and communities.",
    },
    {
      id: "talento",
      title: "Our talent",
      description:
        "We have the talent needed to turn that vision into reality. Market research, strategy, finance, architectural development, legal, marketing, sales and operations work as a single team to give continuity to every decision and ensure that each project is conceived with an integrated vision.",
    },
    {
      id: "ecosistemas",
      title: "We create much more than infrastructure",
      description:
        "We develop ecosystems where industry, retail, housing, health care, education, tourism and entertainment converge, creating spaces that connect people, activities and opportunities.",
    },
  ] satisfies BloqueQuienes[],
};

/* ─── 6 · Responsabilidad social ───────────────────────────────────────── */

/* "Posada" y "lotería" se conservan: son tradiciones mexicanas con nombre propio. */
const GALERIA_RS: FotoGaleria[] = porId(ES.RESPONSABILIDAD.galeria, {
  "rs-1": {
    nota: "Children's event",
    alt: "Girl smiling in the ball pit during an Altea children's event",
  },
  "rs-2": {
    nota: "Senior care home",
    alt: "Altea volunteer accompanying a resident of a senior care home",
  },
  "rs-3": {
    nota: "Family activities",
    alt: "Mother and son playing together at a Christmas event organized by Altea",
  },
  "rs-4": {
    nota: "Gift giving",
    alt: "Schoolchildren showing the gifts they received at an Altea Christmas posada",
  },
  "rs-5": {
    nota: "Christmas posada",
    alt: "Group photo of the Altea Christmas posada, with children and volunteers under a shower of confetti",
  },
  "rs-6": {
    nota: "Time with seniors",
    alt: "Altea volunteers playing lotería with residents of a senior care home",
  },
});

const GALERIA_VERDES: FotoGaleria[] = porId(ES.RESPONSABILIDAD.verdes.galeria, {
  "verdes-1": {
    alt: "Rows of young container-grown trees with wooden stakes, at the foot of a wooded hill",
  },
  "verdes-2": {
    alt: "Young trees in nursery bags planted in rows, with mountains in the background",
  },
  "verdes-3": {
    alt: "Rows of citrus trees with a drip irrigation line",
  },
  "verdes-4": {
    alt: "Citrus orchard on green grass under a cloudy sky",
  },
});

export const RESPONSABILIDAD = {
  eyebrow: "Commitment",
  title: "Social responsibility",
  subtitulo: "Our commitment to communities",
  descripcion: [
    "At Altea, we believe our commitment to communities goes beyond the projects we develop. That is why we promote initiatives that allow us to contribute closely and actively to our surroundings.",
    "Because creating projects that make dreams come true also means helping to build more humane, connected and supportive communities.",
  ],
  galeria: GALERIA_RS,
  verdes: {
    titulo: "We promote the creation of greener environments",
    descripcion: [
      "We have more than 40,000 trees of various species and six ranches dedicated to forestry activities, together covering more than 350 hectares. Through these actions, we contribute to the conservation of green areas and the development of more sustainable spaces.",
    ],
    galeria: GALERIA_VERDES,
  },
};
