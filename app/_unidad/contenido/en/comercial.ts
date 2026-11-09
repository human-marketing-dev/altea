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
  "visitors per month",
  "commercial developments",
  "occupancy rate",
];

const CIFRAS: Cifra[] = CIFRAS_COMERCIAL.map((c, i) => ({
  ...c,
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
      "Fashion Mall located on Miguel Alemán Avenue, the main access road to Monterrey International Airport, in San Nicolás de los Garza, Nuevo León. With a flow of 1 million visitors per month, it has established itself as one of the leading destinations for shopping, entertainment and experiences in the Monterrey metropolitan area.",
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
      "Located on Felipe Pescador Boulevard, in downtown Durango, it is the only shopping center in the city and brings together brands such as Sephora, Bershka, Pull and Bear, Maja, Liverpool, Sears and Play City Casino. Its retail, entertainment and services offering makes it one of the city's main destinations.",
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
      "Power Center located at the intersection of Miguel Alemán Highway and Huinalá Highway, in Apodaca, Nuevo León. Its location offers a privileged connection to Monterrey International Airport and to one of the area's main industrial corridors, while its retail offering is led by Bodega Aurrera and Cinépolis, complemented by a range of stores and services.",
    datos: POWER_CENTER,
  },
  "punto-rio-nilo": {
    descripcion:
      "Power Center located on Río Nilo Avenue, in Tonalá, Jalisco. Its offering is led by Walmart and Cinépolis, complemented by a variety of stores and services.",
    datos: POWER_CENTER,
  },
  "punto-la-pastora": {
    descripcion:
      "Power Center located on Eloy Cavazos Avenue, in Guadalupe, Nuevo León. It has become a key location in the area thanks to its high traffic volume and its connectivity on one of the municipality's main arteries. It features brands such as Pastelería Lety, McDonald's, Firehouse Subs, Bolerama, Swiss Lab, Gorditas Doña Tota, Universidad INSUCO and Helados Dreambox.",
    datos: POWER_CENTER,
  },
  "punto-cumbres": {
    descripcion:
      "Power Center located on Paseo de los Leones Avenue, in Monterrey, Nuevo León. Set in a sector characterized by sustained growth and purchasing power, the center brings together retailers such as Arbolitos de Cajeme, Maxi Home, Las Espadas, Kuchen, Todo Empanadas, Bolerama, Helados Dreambox and KFC. Its restaurant- and entertainment-oriented profile encourages longer visits and a high average ticket among consumers.",
    datos: POWER_CENTER,
  },
  "punto-las-misiones": {
    descripcion:
      "Power Center located in the south of the city on Carretera Nacional, in Monterrey, Nuevo León. The center was developed to serve a market with high purchasing power. Its established tenants include KFC, Tim Hortons, Taco Palenque, U'gurt, Pescados Martínez Tijerina, Helados Dreambox, Firehouse Subs, Wok, John Ham, Blue Pilates and Divisas La Rioja. By bringing together international franchises and local services, it offers a solid retail environment and a high retention rate among our tenants.",
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
      "Power Center located on Abraham Lincoln Avenue, one of the roads with the highest traffic and population density in the metropolitan area, in Monterrey, Nuevo León. Its business model is based on a concentration of essential services, bringing together the INE office, CFE, Capillas Éxodo, Farmacias Guadalajara, Universidad INSUCO, Quick Learning and AT&T, along with businesses such as Maxi Home, Little Caesars, Grease Monkey and KFC. This mix ensures daily visits driven by government procedures, everyday purchases or educational services.",
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
      "We adapted an existing building in downtown Monterrey into an educational space aligned with Tálisis guidelines. The project responds to the growing demand for academic infrastructure in the area, incorporating coworking areas, specialized laboratories and modular spaces that adapt to different learning needs.",
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
  nota: "We identify the potential of each property to turn it into functional spaces that meet the needs of different sectors, offering solutions aligned with each client's objectives.",
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
      "The project comprises a comprehensive three-phase master plan to expand the retail, services, entertainment and residential offering. Its planned components include the Acuario Michin and future hotel, hospital and residential spaces. More than 36,000 m² of additional retail and entertainment expansion is projected, including approximately 19,000 m² of leasable area for the aquarium.",
  },
  "punto-lopez-mateos": {
    name: "Punto López Mateos · Expansion",
    unit: "Commercial expansion",
    descripcion:
      "The expansion of Punto López Mateos seeks to strengthen its retail offering, which currently includes BBVA, and to incorporate establishments such as Firehouse and Dreambox. The project proposes renovating the architectural complex and diversifying the services available to its visitors.",
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
