/**
 * Versión en inglés de app/_home/content.ts (contenido de la portada). La
 * estructura, los datos y el porqué de cada decisión viven allí; aquí sólo
 * cambia el texto visible.
 */

import { colorDeUnidad } from "@/lib/color-unidad";
import { rutaDe } from "@/lib/idioma";
import type {
  BusinessUnitCard,
  FeaturedProject,
  HomeStat,
  TrozoTitular,
} from "./content";
import { VIDEO as VIDEO_ES } from "./content";

/*
 * "960 mil" se escribe "960K": mismo esquema que el "44M" de al lado (cifra +
 * sufijo corto), y es la forma natural en inglés para una cifra destacada.
 *
 * "44M+" y no "+44M" (12 nov 2026, texto de Altea): en inglés el "+" va detrás.
 * Por eso va en el sufijo y no en el prefijo; CountUp lo lee «more than 44
 * million».
 */
export const STATS: HomeStat[] = [
  { to: 44, suffix: "M+", note: "m²", label: "of land" },
  { to: 960, suffix: "K", note: "m²", label: "built" },
  { to: 88, label: "projects developed" },
];

export const STATS_INTRO =
  "We create solutions tailored to a wide range of needs, uses, and opportunities.";

export const VIDEO: typeof VIDEO_ES = {
  ...VIDEO_ES,
  caption: "Corporate video",
  titulo: "Altea corporate video",
};

export const BUSINESS_UNITS_INTRO = {
  titulo: "Business Units",
  descripcion:
    "An integrated vision, many ways to shape the land.",
};

/* El slug se queda en español: es la ruta en español que luego traduce rutaDe. */
export const BUSINESS_UNITS: BusinessUnitCard[] = [
  {
    name: "Commercial",
    slug: "comercial",
    color: colorDeUnidad("Comercial"),
    apertura: "We activate the energy of the city.",
    descripcion:
      "We create commercial spaces that connect people, brands, and experiences, combining entertainment, services, hotels, healthcare, and education to bring urban environments to life.",
    image: "/images/home/unidades-de-negocio/comercial-paseo-la-fe-altea.webp",
    alt: "Paseo La Fe, a commercial development by Altea",
  },
  {
    name: "Industrial",
    slug: "industrial",
    color: colorDeUnidad("Industrial"),
    apertura: "Infrastructure that powers the future.",
    descripcion:
      "We develop industrial, logistics, and connectivity projects that enable new operations and strengthen ties between businesses, cities, and regions.",
    image:
      "/images/home/unidades-de-negocio/industrial-huinala-industrial-park-altea.webp",
    alt: "Huinala Industrial Park, an industrial development by Altea",
  },
  {
    name: "Residential",
    slug: "vivienda",
    color: colorDeUnidad("Vivienda"),
    apertura: "We create spaces where a new way of living begins.",
    descripcion:
      "We develop residential projects and integrate planning and strategic alliances to transform opportunities into communities.",
    image: "/images/home/unidades-de-negocio/vivienda-unidad-altea.webp",
    alt: "Residential development by Altea",
  },
  {
    name: "Forestry",
    slug: "forestal",
    color: colorDeUnidad("Forestal"),
    apertura: "Long-term forest plantation and management.",
    descripcion: "Services that sustain our environmental commitment.",
    image: "/images/home/unidades-de-negocio/forestal-teca-altea.webp",
    alt: "Teak plantation, Altea's forestry division",
  },
];

export const TITULO_HERO = "Creating developments that turn dreams into reality";

/* Mismos trozos que en español: se atenúa el "that", el equivalente del "que". */
export const HERO_A = {
  lineas: [
    [{ texto: "Creating developments" }],
    [{ texto: "that", atenuado: true }, { texto: "turn dreams into reality" }],
  ] as TrozoTitular[][],
};

export const EMBLEM = {
  palabras: [
    "Our",
    "true",
    "scale",
    "is",
    "not",
    "measured",
    "in",
    "the",
    "concrete",
    "we",
    "raise,",
    "but",
    "in",
    "the",
    "life",
    "we",
    "spark.",
  ],
  /* Mismo índice que en español: "the life we spark.", las cuatro últimas. */
  acento: { desde: 13, hasta: 16 },
};

export const CONTACT_CTA = {
  eyebrow: "Let's work together",
  title: "Tell us about your project, land, or needs.",
  image: "/images/home/altea-casco.webp",
};

export const FEATURED_PROJECTS_INTRO = {
  titulo: "Our most\nsignificant projects",
};

/*
 * El tipo en español fija `estado` a los dos literales en español. Aquí sólo se
 * muestra (CarrilProyectos lo pinta tal cual, nadie lo compara), así que va
 * traducido con su propio par de literales.
 */
export type FeaturedProjectEn = Omit<FeaturedProject, "estado"> & {
  estado: "In operation" | "Under development";
};

export const FEATURED_PROJECTS: FeaturedProjectEn[] = [
  {
    estado: "In operation",
    slug: "paseo-la-fe",
    href: rutaDe("/comercial", "en"),
    name: "Paseo La Fe",
    unit: "Commercial",
    location: "San Nicolás, Nuevo León",
    image: "/images/comercial/centros-comerciales/paseo-la-fe-altea.webp",
    descripcion:
      "Paseo La Fe is a shopping center located on Miguel Alemán Avenue, one of the main access routes to Monterrey International Airport, in San Nicolás de los Garza, Nuevo León. It receives approximately one million visitors per month and is one of the leading shopping, entertainment, and experience destinations in the Monterrey metropolitan area.",
  },
  {
    estado: "In operation",
    slug: "paseo-durango",
    href: rutaDe("/comercial", "en"),
    name: "Paseo Durango",
    unit: "Commercial",
    location: "Durango, Durango",
    image: "/images/comercial/centros-comerciales/paseo-durango-altea-1.webp",
    descripcion:
      "Located on Felipe Pescador Boulevard in downtown Durango, it is the city's only shopping center and brings together brands such as Sephora, Bershka, Pull&Bear, Maja, Liverpool, Sears, and Play City Casino. Its retail, entertainment, and service offering makes it one of the city's main destinations.",
  },
  {
    estado: "In operation",
    slug: "aeropuerto-saltillo",
    href: rutaDe("/industrial", "en"),
    name: "Aeropuerto Saltillo",
    unit: "Industrial",
    // PENDIENTE (como en español): ubicación sin confirmar.
    location: "Saltillo, Coahuila",
    image: "/images/industrial/aeropuerto/aeropuerto-saltillo-altea-2.webp",
    descripcion:
      "Renovation project developed in collaboration with Plan de Guadalupe International Airport in Saltillo, Coahuila, focused on reactivating the airport and generating new business opportunities for the region.",
  },
  {
    estado: "In operation",
    slug: "bajio-industrial-park",
    href: rutaDe("/industrial", "en"),
    name: "Bajío Industrial Park",
    unit: "Industrial",
    location: "Salamanca, Guanajuato",
    image:
      "/images/industrial/naves-industriales/bajio-undustrial-park-altea.webp",
    descripcion:
      "Industrial park strategically located at the entrance to the Mazda plant, with direct access to the Salamanca-Irapuato toll-free highway (45) and adjacent to the toll highway to León. Its connectivity facilitates industrial and logistics operations and access to the region's main production corridors.",
  },
  {
    estado: "Under development",
    slug: "aeropuerto-industrial-park",
    href: rutaDe("/industrial", "en"),
    name: "Aeropuerto Industrial Park",
    unit: "Industrial",
    location: "Apodaca, Nuevo León",
    image:
      "/images/industrial/proximos-proyectos/aeropuerto-industrial-park.webp",
    descripcion:
      "Upcoming industrial park located on the Monterrey International Airport Highway in Apodaca, Nuevo León. It is set in a consolidated business environment, near Pocket Park Aeropuerto (developed by Altea in collaboration with Garza Ponce), next to the Tecnológico de Monterrey Center for Innovation and Strategic Product Design.",
  },
  {
    estado: "Under development",
    slug: "amarantha",
    href: rutaDe("/vivienda", "en"),
    name: "Amarantha",
    unit: "Residential",
    location: "Southern Monterrey, Nuevo León",
    image: "/images/vivienda/amarantha/amarantha-vivienda-altea.webp",
    descripcion:
      "Upcoming residential lot development near Carretera Nacional, south of Monterrey. It combines a strategic location and high-end amenities in a setting designed for living and building wealth.",
  },
];
