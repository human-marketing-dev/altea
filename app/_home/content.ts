/**
 * Contenido de la portada, tal como aparece en el wireframe.
 *
 * Todo lo marcado PENDIENTE es texto provisional escrito para poder maquetar:
 * respeta el tono de marca pero NO está confirmado por Altea. Reemplazar antes
 * de publicar.
 */

export const HERO = {
  // Las tres palabras del wireframe, una por línea.
  words: ["Crear", "Desarrollar", "Activar"],
  /** PENDIENTE: descripción sin confirmar por Altea. */
  description:
    "Diseñamos y ejecutamos proyectos comerciales, industriales, de vivienda y forestales sobre reserva territorial propia, con presencia en 21 estados de México.",
  /**
   * Carrusel del banner: una imagen por división, que es la idea del wireframe
   * —"collage con nuestras tres divisiones"— resuelta como secuencia.
   * PROVISIONAL hasta que exista el collage o la animación del triángulo.
   */
  slides: [
    {
      src: "/images/home/unidades-de-negocio/comercial-paseo-la-fe-altea.webp",
      alt: "Desarrollo comercial de Altea",
    },
    {
      src: "/images/home/unidades-de-negocio/industrial-huinala-industrial-park-altea.webp",
      alt: "Parque industrial de Altea",
    },
    {
      src: "/images/home/unidades-de-negocio/vivienda-unidad-altea.webp",
      alt: "Desarrollo de vivienda de Altea",
    },
    {
      src: "/images/home/unidades-de-negocio/forestal-teca-altea.webp",
      alt: "Plantación forestal de Altea",
    },
  ],
  bannerNote: "Collage de divisiones / animación del triángulo",
};

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
  /** Sin imagen, la tarjeta muestra el hueco etiquetado. */
  image?: string;
  alt?: string;
}

/** Fotografía de /images/home/unidades-de-negocio/, la carpeta que Altea armó
 *  específicamente para esta sección. */
export const BUSINESS_UNITS: BusinessUnitCard[] = [
  {
    name: "Comercial",
    slug: "comercial",
    image: "/images/home/unidades-de-negocio/comercial-paseo-la-fe-altea.webp",
    alt: "Paseo La Fe, desarrollo comercial de Altea",
  },
  {
    name: "Industrial",
    slug: "industrial",
    image:
      "/images/home/unidades-de-negocio/industrial-huinala-industrial-park-altea.webp",
    alt: "Huinala Industrial Park, desarrollo industrial de Altea",
  },
  {
    name: "Vivienda",
    slug: "vivienda",
    image: "/images/home/unidades-de-negocio/vivienda-unidad-altea.webp",
    alt: "Desarrollo de vivienda de Altea",
  },
  // Cuarta unidad del wireframe. El design system aún no tiene lockup ni color
  // para Forestal — ver app/ui/README.md.
  {
    name: "Forestal",
    slug: "forestal",
    image: "/images/home/unidades-de-negocio/forestal-teca-altea.webp",
    alt: "Plantación de teca, división forestal de Altea",
  },
];

export const EMBLEM = "Creamos proyectos que materializan sueños";

/**
 * Fondo del emblema, muy atenuado: da textura sin competir con la frase.
 * PROVISIONAL — foto de un centro comercial en operación.
 */
export const EMBLEM_IMAGE = "/images/comercial/galeria/galeria-altea-3.webp";

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

