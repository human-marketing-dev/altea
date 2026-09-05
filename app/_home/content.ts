/**
 * Contenido de la portada, tal como aparece en el wireframe.
 *
 * Todo lo marcado PENDIENTE es texto provisional escrito para poder maquetar:
 * respeta el tono de marca pero NO está confirmado por Altea. Reemplazar antes
 * de publicar.
 */

/**
 * PENDIENTE — el wireframe muestra las cifras sin etiqueta. Los números son los
 * del dibujo; las etiquetas son suposiciones y hay que confirmarlas.
 */
export interface HomeStat {
  prefix?: string;
  to: number;
  suffix?: string;
  /** Segunda línea bajo la cifra, p. ej. "de m²". */
  note?: string;
  label: string;
}

export const STATS: HomeStat[] = [
  { prefix: "+", to: 44, suffix: "M", note: "de m²", label: "Reserva territorial" },
  { prefix: "+", to: 1000, label: "Hectáreas desarrolladas" },
  { prefix: "+", to: 20, label: "Años de experiencia" },
  { prefix: "+", to: 50, label: "Proyectos entregados" },
];

/** PENDIENTE: texto introductorio que acompaña a las cifras. */
export const STATS_INTRO =
  "Una reserva territorial construida durante dos décadas, que hoy sostiene proyectos comerciales, industriales, de vivienda y forestales en todo el norte del país.";

export const VIDEO = {
  /**
   * PROVISIONAL: video de prueba. El archivo venía con espacios y paréntesis en
   * el nombre, que rompen la URL; se renombró y se movió a /public/video/.
   * Reemplazar por el institucional definitivo.
   */
  url: "/video/institucional-prueba.mp4" as string | undefined,
  poster: undefined as string | undefined,
  caption: "Video corporativo",
};

/** Sección que responde: ¿por qué confiar y hacer alianzas con nosotros? */
export const WHY_ALTEA = {
  eyebrow: "Por qué Altea",
  /** PENDIENTE */
  title: "Aliados que construyen a largo plazo",
  /** PENDIENTE */
  body: [
    "Cada proyecto nace de tierra propia. Esa reserva es la que nos permite comprometernos con plazos, superficies y usos de suelo desde la primera conversación, sin depender de terceros.",
    "Operamos las cuatro divisiones bajo una sola estructura, así que un desarrollo comercial, una nave industrial o un fraccionamiento se planean con el mismo equipo, el mismo estándar y la misma visión de ciudad.",
  ],
};

export interface BusinessUnitCard {
  name: string;
  slug: string;
  /** Se revela al pasar el cursor sobre la tarjeta. */
  descripcion: string;
  /** Sin imagen, la tarjeta muestra el hueco etiquetado. */
  image?: string;
  alt?: string;
}

/** Encabezado de la sección: título a la izquierda, entrada a la derecha. */
export const BUSINESS_UNITS_INTRO = {
  /** La segunda palabra va en coral. */
  titulo: ["Unidades de", "Negocio"] as const,
  /** PENDIENTE: texto sin confirmar por Altea. */
  descripcion:
    "Cuatro divisiones que operan sobre una misma reserva territorial. Cada una con su propia visión, y con el mismo equipo detrás de cada decisión.",
};

/** Fotografía de /images/home/unidades-de-negocio/, la carpeta que Altea armó
 *  específicamente para esta sección. */
export const BUSINESS_UNITS: BusinessUnitCard[] = [
  {
    name: "Comercial",
    slug: "comercial",
    descripcion:
      "Activar la energía de la ciudad en un solo lugar. Paseos, puntos y locales en operación, con hoteles, hospital y educación integrados al mismo entorno urbano.",
    image: "/images/home/unidades-de-negocio/comercial-paseo-la-fe-altea.webp",
    alt: "Paseo La Fe, desarrollo comercial de Altea",
  },
  {
    name: "Industrial",
    slug: "industrial",
    descripcion:
      "Desarrollar infraestructura con visión de futuro. Parques y naves industriales pensados para décadas, con el Aeropuerto Internacional de Saltillo como pieza de conectividad.",
    image:
      "/images/home/unidades-de-negocio/industrial-huinala-industrial-park-altea.webp",
    alt: "Huinala Industrial Park, desarrollo industrial de Altea",
  },
  {
    name: "Vivienda",
    slug: "vivienda",
    descripcion:
      "Crear hogares donde comienza tu historia. Desarrollos residenciales sobre una amplia reserva territorial, con un compromiso firme de reforestación.",
    image: "/images/home/unidades-de-negocio/vivienda-unidad-altea.webp",
    alt: "Desarrollo de vivienda de Altea",
  },
  // Cuarta unidad del wireframe. El design system aún no tiene lockup ni color
  // para Forestal — ver app/ui/README.md.
  {
    name: "Forestal",
    slug: "forestal",
    descripcion:
      "Plantación y manejo forestal de largo plazo. Viveros, teca y servicios que sostienen el compromiso ambiental del grupo.",
    image: "/images/home/unidades-de-negocio/forestal-teca-altea.webp",
    alt: "Plantación de teca, división forestal de Altea",
  },
];

/**
 * Frase de marca de Altea.
 *
 * Va por palabras porque cada una entra por separado al hacer scroll, y porque
 * una de ellas lleva el acento coral.
 */
export const EMBLEM = {
  palabras: ["Creamos", "proyectos", "que", "materializan", "sueños"],
  /** Índice de la palabra en coral. */
  acento: 4,
};

export const CONTACT_CTA = {
  eyebrow: "Trabajemos juntos",
  /** PENDIENTE */
  title: "Cuéntanos qué necesitas construir",
  /** PENDIENTE */
  description:
    "Escríbenos y un asesor te contacta para revisar superficie, ubicación y tiempos de tu proyecto.",
  image: "/images/comercial/galeria/galeria-altea-4.webp",
};

/**
 * Proyectos del wireframe. `image` queda vacío hasta tener los renders; cada
 * ficha abre con la información general al dar click.
 */
export interface FeaturedProject {
  slug: string;
  name: string;
  unit: string;
  location: string;
  /** Sin imagen, el panel muestra el hueco etiquetado. */
  image?: string;
}

export const FEATURED_PROJECTS: FeaturedProject[] = [
  {
    slug: "paseo-la-fe",
    name: "Paseo La Fe",
    unit: "Comercial",
    location: "San Nicolás, Nuevo León",
    image: "/images/comercial/centros-comerciales/paseo-la-fe-altea.webp",
  },
  {
    slug: "paseo-durango",
    name: "Paseo Durango",
    unit: "Comercial",
    location: "Durango, Durango",
    image: "/images/comercial/centros-comerciales/paseo-durango-altea.webp",
  },
  {
    slug: "aeropuerto-saltillo",
    name: "Aeropuerto Saltillo",
    unit: "Industrial",
    // PENDIENTE: ubicación sin confirmar.
    location: "Saltillo, Coahuila",
    image: "/images/industrial/aeropuerto/aeropuerto-saltillo-altea.webp",
  },
  {
    slug: "bajio-industrial-park",
    name: "Bajío Industrial Park",
    unit: "Industrial",
    // PENDIENTE: ubicación sin confirmar.
    location: "Bajío, México",
    // El nombre del archivo trae una errata de origen ("undustrial").
    image: "/images/industrial/naves-industriales/bajio-undustrial-park-altea.webp",
  },
  {
    slug: "aeropuerto-industrial-center",
    name: "Aeropuerto Industrial Center",
    unit: "Industrial",
    // PENDIENTE: ubicación sin confirmar.
    location: "Saltillo, Coahuila",
    // PENDIENTE: el archivo se llama "Aeropuerto Industrial Park" y vive en
    // proximos-proyectos/. Confirmar si es el mismo desarrollo y qué nombre va.
    image: "/images/industrial/proximos-proyectos/aeropuerto-industrial-park.webp",
  },
  {
    slug: "amarantha",
    name: "Amarantha",
    unit: "Vivienda",
    // PENDIENTE: ubicación sin confirmar.
    location: "Saltillo, Coahuila",
    image: "/images/vivienda/amarantha/amarantha-vivienda-altea.webp",
  },
];

