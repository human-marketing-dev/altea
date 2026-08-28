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
  /** PROVISIONAL: foto de galería como fondo, solo para que el hero no se vea
   *  vacío. El banner definitivo debe ser el collage de las divisiones con sus
   *  colores, o la animación del triángulo que sugirió Humberto. */
  image: "/images/comercial/galeria/galeria-altea-2.webp",
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
  /** PENDIENTE: URL del video corporativo. Sin ella se renderiza el placeholder. */
  url: undefined as string | undefined,
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
}

export const BUSINESS_UNITS: BusinessUnitCard[] = [
  {
    name: "Comercial",
    slug: "comercial",
    image: "/images/comercial/centros-comerciales/paseo-la-fe-altea.webp",
  },
  // PENDIENTE: no hay fotografía de estas tres divisiones todavía.
  { name: "Industrial", slug: "industrial" },
  { name: "Vivienda", slug: "vivienda" },
  // Cuarta unidad del wireframe. El design system aún no tiene lockup ni color
  // para Forestal — ver app/ui/README.md.
  { name: "Forestal", slug: "forestal" },
];

export const EMBLEM = "Creamos proyectos que materializan sueños";

export const CONTACT_CTA = {
  eyebrow: "Trabajemos juntos",
  /** PENDIENTE */
  title: "Cuéntanos qué necesitas construir",
  /** PENDIENTE */
  description:
    "Escríbenos y un asesor te contacta para revisar superficie, ubicación y tiempos de tu proyecto.",
  image: "/images/comercial/galeria/galeria-altea-4.webp",
  /** PENDIENTE: número real de WhatsApp de Altea. */
  whatsappNumber: "528110000000",
  whatsappMessage: "Hola Altea, me interesa conocer más sobre sus proyectos.",
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
  // PENDIENTE: los cuatro siguientes no tienen render. Deliberadamente NO se
  // les puso una foto de otro proyecto: sería atribuir una imagen equivocada.
  { slug: "aeropuerto-saltillo", name: "Aeropuerto Saltillo", unit: "Industrial", location: "Saltillo, Coahuila" },
  { slug: "bajio-industrial-park", name: "Bajío Industrial Park", unit: "Industrial", location: "Bajío, México" },
  { slug: "aeropuerto-industrial-center", name: "Aeropuerto Industrial Center", unit: "Industrial", location: "Saltillo, Coahuila" },
  { slug: "amarantha", name: "Amarantha", unit: "Vivienda", location: "Saltillo, Coahuila" },
];
