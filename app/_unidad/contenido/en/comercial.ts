import type {
  Cifra,
  ContenidoUnidad,
  Giro,
  ParDato,
  ProximoProyecto,
  Proyecto,
} from "../../tipos";
import {
  CIFRAS_COMERCIAL,
  COMERCIAL as COMERCIAL_ES,
  OTROS_GIROS,
  PLAZAS,
} from "../comercial";

/**
 * Versión en inglés de app/_unidad/contenido/comercial.ts. La estructura, los
 * datos (fotos, ratios, anclas, marcas, colores) y su porqué viven allí; aquí
 * sólo se sustituyen los textos, por `id`/`slug` para no depender del orden.
 *
 * Si entra una plaza, giro o próximo proyecto en español sin su texto aquí, el
 * build falla con el id que falta: mejor eso que una ficha en español en /en.
 */

/** El texto inglés de una entrada, o un error con el id que falta. */
function texto<T>(tabla: Record<string, T>, id: string, seccion: string): T {
  const t = tabla[id];
  if (!t) {
    throw new Error(
      `Falta la traducción al inglés de "${id}" (${seccion}) en app/_unidad/contenido/en/comercial.ts`,
    );
  }
  return t;
}

/** Números pequeños en palabras, como `enLetras` en el archivo en español. */
const EN_WORDS = [
  "zero",
  "one",
  "two",
  "three",
  "four",
  "five",
  "six",
  "seven",
  "eight",
  "nine",
  "ten",
  "eleven",
  "twelve",
  "thirteen",
  "fourteen",
  "fifteen",
  "sixteen",
  "seventeen",
  "eighteen",
  "nineteen",
  "twenty",
];
const inWords = (n: number) => EN_WORDS[n] ?? String(n);

/* ============================ Cifras ============================== */

/* Mismo orden que CIFRAS_COMERCIAL. */
const ETIQUETAS_CIFRAS = [
  "monthly visitors",
  "shopping centers",
  "occupancy rate",
];

/* "3M+" y no "+3M" (12 nov 2026, texto de Altea): en inglés el "+" va detrás,
   así que pasa del prefijo al signo. CountUp lo sigue leyendo «more than». */
const CIFRAS: Cifra[] = CIFRAS_COMERCIAL.map((c, i) => ({
  ...c,
  ...(c.prefijo === "+" ? { prefijo: undefined, signo: `${c.signo ?? ""}+` } : {}),
  etiqueta: ETIQUETAS_CIFRAS[i] ?? c.etiqueta,
}));

/* ============================ Plazas ============================== */

const fashionMall = (visitantes: string): [ParDato, ...ParDato[]] => [
  { etiqueta: "Format", valor: "Fashion Mall" },
  { etiqueta: "Visitors", valor: visitantes },
];
const POWER_CENTER: [ParDato, ...ParDato[]] = [
  { etiqueta: "Format", valor: "Power Center" },
];

const TEXTOS_PLAZAS: Record<
  string,
  Pick<Proyecto, "descripcion" | "datos">
> = {
  "paseo-la-fe": {
    descripcion:
      "Paseo La Fe is a shopping center in San Nicolás de los Garza, Nuevo León, on Avenida Miguel Alemán, one of the main routes to Monterrey International Airport. It welcomes around one million visitors a month and is one of the leading shopping, entertainment, and leisure destinations in the Monterrey metropolitan area.",
    datos: fashionMall("1 million per month"),
  },
  "paseo-tec": {
    descripcion:
      "Strip Mall located on Eugenio Garza Sada Avenue, in Distrito Tec, in the south of Monterrey, Nuevo León, a few minutes from the city center. Its offering combines retail, dining, entertainment and services for a range of needs. The development also includes the Fiesta Inn hotel and the GRAND 2411 event venue, establishing it as a meeting point that complements urban life in the Tec area.",
    datos: [
      { etiqueta: "Format", valor: "Strip Mall" },
      { etiqueta: "Visitors", valor: "200,000 per month" },
    ],
  },
  "paseo-juarez": {
    descripcion:
      "Fashion Mall located in downtown Juárez, Nuevo León, receiving 580,000 visitors per month. Its retail offering brings together well-known brands such as Walmart, Cinemex, Suburbia, Coppel and Del Sol, along with a wide variety of stores, services and entertainment options, establishing it as a meeting point for the Juárez community.",
    datos: fashionMall("580,000 per month"),
  },
  "paseo-durango": {
    descripcion:
      "Located on Felipe Pescador Boulevard, in downtown Durango, it is the only shopping center in the city and brings together brands such as Sephora, Bershka, Pull&Bear, Maja, Liverpool, Sears and Play City Casino. Its retail, entertainment and services offering makes it one of the city's main destinations.",
    datos: fashionMall("600,000 per month"),
  },
  "paseo-los-mochis": {
    descripcion:
      "Fashion Mall located between Rosales Avenue and Centenario Boulevard, in Los Mochis, Sinaloa. It is the only Fashion Mall in the city, with a retail and entertainment offering led by brands such as Liverpool, Sears and Cinemex, establishing it as one of the main destinations for shopping, services and experiences in Los Mochis.",
    datos: fashionMall("500,000 per month"),
  },
  "paseo-gomez-palacio": {
    descripcion:
      "Fashion Mall located in the La Laguna region, in Gómez Palacio, Durango. It is the newest shopping center in our portfolio and the only Fashion Mall in the city. It features brands such as Cinemex, Suburbia and Del Sol, along with a broad retail, entertainment and services offering that makes it a new meeting point for the community.",
    datos: fashionMall("400,000 per month"),
  },
  "punto-huinala": {
    descripcion:
      "A power center at the intersection of Carretera Miguel Alemán and Carretera Huinalá in Apodaca, Nuevo León. Its location offers excellent access to Monterrey International Airport and one of the area's main industrial corridors. It is anchored by Bodega Aurrera and Cinépolis, complemented by a variety of shops and services.",
    datos: POWER_CENTER,
  },
  "punto-rio-nilo": {
    descripcion:
      "A power center on Avenida Río Nilo in Tonalá, Jalisco. It is anchored by Walmart and Cinépolis, complemented by a variety of shops and services.",
    datos: POWER_CENTER,
  },
  "punto-la-pastora": {
    descripcion:
      "A power center on Avenida Eloy Cavazos in Guadalupe, Nuevo León. Its high traffic volume and location on one of the city's main thoroughfares have made it a key spot in the area. It is home to brands such as Pastelería Lety, McDonald's, Firehouse Subs, Bolerama, Swiss Lab, Gorditas Doña Tota, Universidad INSUCO, and Helados Dreambox.",
    datos: POWER_CENTER,
  },
  "punto-cumbres": {
    descripcion:
      "A power center on Avenida Paseo de los Leones in Monterrey, Nuevo León. Set in an area known for its steady growth and strong purchasing power, the center brings together brands such as Arbolitos de Cajeme, Maxi Home, Las Espadas, Kuchen, Todo Empanadas, Bolerama, Helados Dreambox, and KFC. Its focus on dining and entertainment encourages longer visits and higher average spending.",
    datos: POWER_CENTER,
  },
  "punto-las-misiones": {
    descripcion:
      "A power center on Carretera Nacional in southern Monterrey, Nuevo León. It was developed to serve an affluent market. Its established tenants include KFC, Tim Hortons, Taco Palenque, U'gurt, Pescados Martínez Tijerina, Helados Dreambox, Firehouse Subs, Wok, John Ham, Blue Pilates, and Divisas La Rioja. By bringing together international franchises and local services, it offers a strong retail environment and a high tenant retention rate.",
    datos: POWER_CENTER,
  },
  "punto-guaymas": {
    descripcion:
      "Power Center located in Guaymas, Sonora. It is one of the most relevant retail complexes in the municipality. Its structure relies on anchor tenants that generate high daily foot traffic, such as Cinemex, Hotel City Express, City Salads, Dairy Queen and Muebles Dico. By combining entertainment, lodging, home goods and dining, the center maintains constant commercial activity, in addition to offering excellent visibility and accessibility from the main roads.",
    datos: POWER_CENTER,
  },
  "punto-versalles": {
    descripcion:
      "Power Center located in downtown Monterrey, Nuevo León. It stands out for its integration with the urban infrastructure and its proximity to major public transportation routes. Its mix spans retail, culture and lodging, with tenants such as Carl's Jr, Teatro Nena Delgado, Coppel, Hotel Fiesta Inn Express, Firehouse Subs, KFC and Helados Dreambox.",
    datos: POWER_CENTER,
  },
  "punto-lincoln": {
    descripcion:
      /* La primera frase es la de Altea (12 nov 2026); el resto, la traducción
         anterior, porque su texto sólo traía esa frase. */
      "A power center in Monterrey, Nuevo León, on Avenida Abraham Lincoln, one of the busiest and most densely populated corridors in the metropolitan area. Its business model is based on a concentration of essential services, bringing together the INE office, CFE, Capillas Éxodo, Farmacias Guadalajara, Universidad INSUCO, Quick Learning and AT&T, along with businesses such as Maxi Home, Little Caesars, Grease Monkey and KFC. This mix ensures daily visits driven by government procedures, everyday purchases or educational services.",
    datos: POWER_CENTER,
  },
};

const PLAZAS_EN: Proyecto[] = PLAZAS.map((p) => ({
  ...p,
  ...texto(TEXTOS_PLAZAS, p.id, "plaza"),
}));

/* ================ Hoteles, hospital y educación =================== */

const TEXTOS_GIROS: Record<
  string,
  Pick<Giro, "title" | "description" | "alt" | "datos">
> = {
  hoteles: {
    title: "Hotels",
    description:
      "Our experience also extends to the development of hotels for well-known brands, integrated into our shopping centers to create more complete and functional destinations. Through projects such as Fiesta Inn, One Hotels and NH Hotels, we have developed hospitality spaces across Mexico.",
    alt: "Fiesta Inn within an Altea development",
    datos: [{ etiqueta: "Brands", valor: "Fiesta Inn, One Hotels and NH Hotels" }],
  },
  hospital: {
    title: "Hospital",
    description:
      "Sierra Madre involved integrating new infrastructure with existing facilities, meeting the technical and operational requirements of a modern hospital, with the aim of delivering a fully equipped space ready to operate from day one. With this project, we strengthen our capacity to develop specialized spaces that demand high standards of planning and technology.",
    alt: "Hospital within an Altea development",
    datos: [{ etiqueta: "Project", valor: "Sierra Madre" }],
  },
  educacion: {
    title: "Education",
    description:
      "We repurposed an existing building in downtown Monterrey into an educational facility designed to Tálisis's standards. The project meets the growing demand for academic infrastructure in the area, featuring coworking areas, specialized labs, and modular spaces that adapt to different learning needs.",
    alt: "Educational center within an Altea development",
    datos: [
      { etiqueta: "Project", valor: "Tálisis" },
      { etiqueta: "Location", valor: "Downtown Monterrey" },
    ],
  },
};

const GIROS_EN: ContenidoUnidad["giros"] = {
  eyebrow: "Other sectors",
  titulo: "We develop, transform and adapt projects.",
  nota: "We unlock the potential of each property, turning it into functional spaces that meet the needs of different industries and offering solutions aligned with each client's goals.",
  bloques: OTROS_GIROS.bloques.map((g) => ({
    ...g,
    ...texto(TEXTOS_GIROS, g.id, "giro"),
  })),
};

/* ====================== Próximos proyectos ======================== */

const TEXTOS_PROXIMOS: Record<
  string,
  Pick<ProximoProyecto, "name" | "unit" | "descripcion">
> = {
  "paseo-la-fe-ampliacion": {
    name: "Paseo La Fe · Expansion",
    unit: "Commercial expansion",
    descripcion:
      "The project calls for a comprehensive three-phase master plan to expand its retail, services, entertainment, and residential offering. Planned components include Acuario Michin and future hotel, healthcare, and residential spaces. More than 36,000 m² of additional retail and entertainment space is planned, including about 19,000 m² of leasable area for the aquarium.",
  },
  "punto-lopez-mateos": {
    name: "Punto López Mateos · Expansion",
    unit: "Commercial expansion",
    descripcion:
      "The expansion of Punto López Mateos aims to strengthen its retail mix, which currently includes BBVA, and add businesses such as Firehouse Subs and Helados Dreambox. The project plans to renovate the complex's architecture and diversify the services available to visitors.",
  },
};

const PROXIMOS_EN: ContenidoUnidad["proximos"] = {
  titulo: "Upcoming\nprojects",
  /* fotoRatio: el mismo que fija la versión en español. */
  proyectos: COMERCIAL_ES.proximos.proyectos.map((p) => ({
    ...p,
    ...texto(TEXTOS_PROXIMOS, p.slug, "próximo proyecto"),
  })),
};

/* ======================= La página, ensamblada ===================== */

/* Para el conteo de la descripción: los estados de PLAZAS, como en español. */
const ESTADOS = new Set(PLAZAS.map((p) => p.ubicacion.split(", ").pop())).size;

export const COMERCIAL: ContenidoUnidad = {
  /* ⚠ Se queda en español: es el tipo `Unidad` de lib/contacto que compara el
     formulario de contacto. La palabra visible es `hero.palabra`. */
  unidad: COMERCIAL_ES.unidad,
  metadata: {
    title: "Commercial — Altea",
    description: `Altea shopping centers: ${inWords(PLAZAS_EN.length)} in operation across ${inWords(
      ESTADOS,
    )} states, with hotels, a hospital and education within the same developments.`,
  },
  hero: {
    ...COMERCIAL_ES.hero,
    palabra: "Commercial",
    descripcion:
      "Spaces that connect people, brands and experiences. Our developments bring together brands, services and entertainment in environments designed to connect with communities.",
  },
  cifras: CIFRAS,
  proyectos: { titulo: "Our shopping centers", lista: PLAZAS_EN },
  giros: GIROS_EN,
  marcas: {
    ...COMERCIAL_ES.marcas,
    titulo: "Brands operating in our shopping centers",
  },
  proximos: PROXIMOS_EN,
  cierre: COMERCIAL_ES.cierre && {
    ...COMERCIAL_ES.cierre,
    titulo: "We connect spaces, people and brands.",
  },
};
