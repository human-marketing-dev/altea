import type { ContenidoUnidad, ParDato, ProximoProyecto, Proyecto } from "../../tipos";
import { INDUSTRIAL as INDUSTRIAL_ES } from "../industrial";
import { BUSINESS_UNITS } from "@/app/_home/content.en";

/**
 * Versión en inglés de app/_unidad/contenido/industrial.ts. La estructura, los
 * datos (fotos, ratios, anclas, colores) y su porqué viven allí; aquí sólo se
 * sustituyen los textos, por `id`/`slug` para no depender del orden.
 *
 * `unidad` se queda en español: es el tipo `Unidad` de lib/contacto.ts, que el
 * código compara y usa para armar la URL de contacto.
 */

/** El texto inglés de una entrada, o un error con el id que falta. */
function texto<T>(tabla: Record<string, T>, id: string, seccion: string): T {
  const t = tabla[id];
  if (!t) {
    throw new Error(
      `Falta la traducción al inglés de "${id}" (${seccion}) en app/_unidad/contenido/en/industrial.ts`,
    );
  }
  return t;
}

const TARJETA = BUSINESS_UNITS.find((u) => u.slug === "industrial");
if (!TARJETA) throw new Error('No hay tarjeta de unidad "industrial" en app/_home/content.en.ts');

const PARQUE: ParDato = { etiqueta: "Format", valor: "Industrial park" };
const OPCION: ParDato = { etiqueta: "Option", valor: "Speculative Buildings and Build to Suit" };

/* ============================ Proyectos ============================ */

const TEXTOS_PROYECTOS: Record<
  string,
  Pick<Proyecto, "nombre" | "ubicacion" | "alt" | "label" | "descripcion" | "datos">
> = {
  "aeropuerto-saltillo": {
    nombre: "Saltillo Airport",
    ubicacion: "Saltillo, Coahuila",
    alt: "",
    label: "Saltillo Airport",
    descripcion:
      "Renovation, modernization and expansion project for the Plan de Guadalupe International Airport in Saltillo, Coahuila, in which we participate as partners in both its development and its operation. The project seeks to revitalize and modernize its facilities, comprehensively improve its waiting areas and generate new business opportunities that contribute to the growth and development of the region.",
    datos: [{ etiqueta: "Format", valor: "Airport infrastructure" }],
  },
  "bajio-industrial-park": {
    nombre: "Bajío Industrial Park",
    ubicacion: "Salamanca, Guanajuato",
    alt: "",
    label: "Bajío Industrial Park",
    descripcion:
      "Industrial park strategically located at the entrance to the Mazda plant, with direct access to the Salamanca-Irapuato toll-free highway (45) and alongside the toll highway to León. Its connectivity facilitates industrial and logistics operations and access to the region's main production corridors.",
    datos: [PARQUE, { etiqueta: "Total area", valor: "107,374 m²" }],
  },
  "pocket-park-aeropuerto": {
    nombre: "Pocket Park Aeropuerto",
    ubicacion: "Apodaca, Nuevo León",
    alt: "",
    label: "Pocket Park Aeropuerto",
    descripcion:
      "Industrial park located on the Monterrey International Airport Highway, in Apodaca, Nuevo León. Designed for logistics and light manufacturing, it offers flexible spaces that facilitate the operations of companies requiring an accessible location and connection to major transportation routes.",
    datos: [PARQUE, { etiqueta: "Total area", valor: "53,140 m²" }],
  },
  "primavera-industrial-park": {
    nombre: "Primavera Industrial Park",
    ubicacion: "Apodaca, Nuevo León",
    alt: "",
    label: "Primavera Industrial Park",
    descripcion:
      "Industrial park located on Miguel Alemán Avenue, in Apodaca, Nuevo León. It features SME industrial buildings and modular spaces designed to adapt to the needs of supply chain providers and regional distribution companies, with access to one of the area's main industrial corridors.",
    datos: [PARQUE, { etiqueta: "Total area", valor: "6,538 m²" }],
  },
  "huinala-industrial-park": {
    nombre: "Huinalá Industrial Park",
    ubicacion: "Apodaca, Nuevo León",
    alt: "",
    label: "Huinalá Industrial Park",
    descripcion:
      "Industrial park located on Miguel Alemán Avenue, in Apodaca, Nuevo León. Its direct connection to the highway facilitates access to Monterrey International Airport and the main roads of the metropolitan area, supporting the operations and mobility of industrial and logistics companies.",
    datos: [PARQUE, { etiqueta: "Total area", valor: "18,410 m²" }],
  },
  "lopez-mateos-industrial-park": {
    nombre: "López Mateos Industrial Park",
    ubicacion: "San Nicolás de los Garza, Nuevo León",
    alt: "",
    label: "López Mateos Industrial Park",
    descripcion:
      "Industrial park located on López Mateos Avenue, in San Nicolás de los Garza, Nuevo León. Its direct connection to this major artery facilitates logistics integration with the Monterrey metropolitan area and provides access to a broad local labor pool, supporting the operations and growth of companies.",
    datos: [PARQUE, { etiqueta: "Total area", valor: "20,825 m²" }],
  },
};

const PROYECTOS_EN: Proyecto[] = INDUSTRIAL_ES.proyectos.lista.map((p) => ({
  ...p,
  ...texto(TEXTOS_PROYECTOS, p.id, "proyectos"),
}));

/* ======================== Próximos proyectos ======================= */

const TEXTOS_PROXIMOS: Record<
  string,
  Pick<ProximoProyecto, "name" | "unit" | "location" | "descripcion" | "datos">
> = {
  "aeropuerto-industrial-park": {
    name: "Aeropuerto Industrial Park",
    unit: "Industrial",
    location: "Apodaca, Nuevo León",
    /* Los guiones del inciso, igual que en el español. */
    descripcion:
      "Upcoming industrial park located on the Monterrey International Airport Highway, in Apodaca, Nuevo León. It is situated in a consolidated business environment, near Pocket Park Aeropuerto - developed by Altea in collaboration with Garza Ponce - next to the Tecnológico de Monterrey Center for Innovation and Strategic Product Design.",
    datos: [
      { etiqueta: "4 Industrial Buildings", valor: "From 10,087 m² to 13,891 m²" },
      { etiqueta: "Total Leasable Area", valor: "50,712 m²" },
      OPCION,
    ],
  },
  "cadereyta-industrial-park": {
    name: "Cadereyta Industrial Park",
    unit: "Industrial",
    location: "Cadereyta Jiménez, Nuevo León",
    descripcion:
      "Industrial park located at km 25.1 of the toll-free highway to Reynosa, in Cadereyta Jiménez, Nuevo León. Its direct access to this major route facilitates the connection with Monterrey and other points in the region, offering a functional location for industrial, logistics and commercial operations.",
    datos: [
      { etiqueta: "Site 1", valor: "Lots from 21,820 m² to 41,920 m² · Leasable area: 730,965 m²" },
      { etiqueta: "Site 2", valor: "Lots from 12,241 m² to 33,655 m² · Leasable area: 644,324 m²" },
      { etiqueta: "Site 3", valor: "Lots from 23,507 m² to 28,598 m² · Leasable area: 363,511 m²" },
      OPCION,
    ],
  },
  "salinas-victoria-industrial-park": {
    name: "Salinas Victoria Industrial Park",
    unit: "Industrial",
    location: "Salinas Victoria, Nuevo León",
    descripcion:
      "Industrial park located at km 14.4 of the Colombia highway, in Salinas Victoria, Nuevo León. It is part of one of the fastest-growing industrial corridors in the north of the state and has a direct connection to the border via the Colombia–Laredo route, facilitating access to major markets and trade routes.",
    datos: [
      { etiqueta: "Lots", valor: "From 40,977 m² to 135,228 m²" },
      { etiqueta: "Total Leasable Area", valor: "517,361 m²" },
      OPCION,
    ],
  },
};

const PROXIMOS_EN: ProximoProyecto[] = INDUSTRIAL_ES.proximos.proyectos.map((p) => ({
  ...p,
  ...texto(TEXTOS_PROXIMOS, p.slug, "próximos"),
}));

/* ============================= Página ============================== */

export const INDUSTRIAL: ContenidoUnidad = {
  ...INDUSTRIAL_ES,
  unidad: "Industrial",
  metadata: {
    title: "Industrial — Altea",
    description: TARJETA.descripcion,
  },
  hero: {
    ...INDUSTRIAL_ES.hero,
    palabra: "Industrial",
    descripcion: TARJETA.descripcion,
  },
  /*
   * "+400 mil" se escribe con todas sus cifras (400,000), como "700 mil" en
   * Comercial: "thousand" no cabe de sufijo.
   */
  cifras: [
    { prefijo: "+", valor: 400000, etiqueta: "m² developed" },
    { valor: 4, signo: "M", etiqueta: "developable m²" },
  ],
  atributos: [
    { titulo: "Strategic location", icono: "ubicacion" },
    { titulo: "Operational sustainability", icono: "sustentabilidad" },
    { titulo: "World-class infrastructure", icono: "infraestructura" },
  ],
  proyectos: {
    titulo: "Our industrial projects",
    lista: PROYECTOS_EN,
  },
  giros: {
    ...INDUSTRIAL_ES.giros,
    eyebrow: "PENDING",
    titulo: "Industrial · PENDING",
  },
  marcas: {
    ...INDUSTRIAL_ES.marcas,
    titulo: "Industrial · PENDING",
  },
  cierre: INDUSTRIAL_ES.cierre && {
    ...INDUSTRIAL_ES.cierre,
    titulo: "Projects that transform the country's land and connectivity",
  },
  proximos: {
    titulo: "Upcoming\nprojects",
    proyectos: PROXIMOS_EN,
  },
};
