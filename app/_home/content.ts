/**
 * Contenido de la portada, tal como aparece en el wireframe.
 *
 * Todo lo marcado PENDIENTE es texto provisional escrito para poder maquetar:
 * respeta el tono de marca pero NO está confirmado por Altea. Reemplazar antes
 * de publicar.
 */

/** Las tres cifras y sus etiquetas, confirmadas por Altea. */
export interface HomeStat {
  prefix?: string;
  to: number;
  suffix?: string;
  /** Segunda línea bajo la cifra, p. ej. "de m²". */
  note?: string;
  label: string;
}

/*
 * Las tres las dio Altea. NINGUNA se puede derivar de lib/proyectos.ts: allí
 * hay 8 proyectos con ficha documentada —y la propia lista avisa de que faltan
 * los de otros 15 estados—, así que contarlos daría 8, no 88. Son dato de
 * Altea, no cifra calculada.
 */
export const STATS: HomeStat[] = [
  { prefix: "+", to: 44, suffix: "M", note: "de m²", label: "de territorio" },
  { to: 960, suffix: " mil", note: "m²", label: "construidos" },
  { to: 88, label: "proyectos desarrollados" },
];

/*
 * Copy confirmado por Altea.
 *
 * Sin la coma antes de "y turismo" que traía el original: en una enumeración
 * española la conjunción no la lleva.
 */
export const STATS_INTRO =
  "Desarrollamos industria, comercio, vivienda, salud, educación y turismo bajo una misma visión estratégica para generar entornos que respondan a las necesidades del presente y evolucionen con las del futuro.";

export const VIDEO = {
  /** Clip mudo de 20s en 1080p, en bucle. */
  url: "/video/altea-institucional.mp4" as string | undefined,
  /**
   * Lo que se ve mientras carga y, en iOS con ahorro de batería, lo único que
   * se ve si el autoplay no arranca.
   */
  poster: "/video/poster.webp" as string | undefined,
  caption: "Video corporativo",
  /*
   * PENDIENTE: el video completo con audio va a Vimeo. Cuando esté, aquí va su
   * URL y el componente ya tiene el hueco donde cuelga el enlace de "ver
   * completo" — ver .home-video__acciones en CorporateVideo.tsx.
   */
};

/** Sección que responde: ¿por qué confiar y hacer alianzas con nosotros? */
export const WHY_ALTEA = {
  eyebrow: "Por qué Altea",
  title: "Transformamos oportunidades en proyectos de alto impacto.",
  /*
   * En el original los dos primeros periodos iban unidos por coma —"integral,
   * nuestro modelo"—; se separaron en dos oraciones.
   */
  body: [
    "Altea es una empresa de desarrollo inmobiliario integral. Nuestro modelo reúne en un mismo equipo las capacidades estratégicas, financieras, legales, comerciales y operativas necesarias para desarrollar un proyecto desde su concepción hasta su consolidación.",
    "Más que desarrollar espacios, diseñamos ecosistemas donde personas, empresas y comunidades encuentran oportunidades para crecer.",
  ],
};

export interface BusinessUnitCard {
  name: string;
  slug: string;
  /**
   * Frase de apertura, una línea. Campo NUEVO: el copy de Altea trae la
   * descripción en dos partes y antes sólo había una.
   */
  apertura: string;
  /** Se revela al pasar el cursor sobre la tarjeta, bajo la apertura. */
  descripcion: string;
  /** Sin imagen, la tarjeta muestra el hueco etiquetado. */
  image?: string;
  alt?: string;
}

/** Encabezado de la sección: título a la izquierda, entrada a la derecha. */
export const BUSINESS_UNITS_INTRO = {
  /** Va entero en coral; ver .home-units__titulo. */
  titulo: "Unidades de Negocio",
  descripcion: "Una visión integral, múltiples formas de transformar el territorio.",
};

/** Fotografía de /images/home/unidades-de-negocio/, la carpeta que Altea armó
 *  específicamente para esta sección. */
export const BUSINESS_UNITS: BusinessUnitCard[] = [
  {
    name: "Comercial",
    slug: "comercial",
    apertura: "Activamos la energía de la ciudad.",
    descripcion:
      "Creamos espacios comerciales que conectan personas, marcas y experiencias, integrando entretenimiento, servicios, hoteles, salud y educación para dar vida a entornos urbanos.",
    image: "/images/home/unidades-de-negocio/comercial-paseo-la-fe-altea.webp",
    alt: "Paseo La Fe, desarrollo comercial de Altea",
  },
  {
    name: "Industrial",
    slug: "industrial",
    apertura: "Infraestructura que impulsa el futuro.",
    descripcion:
      "Desarrollamos proyectos industriales, logísticos y de conectividad que facilitan nuevas operaciones y fortalecen los vínculos entre empresas, ciudades y regiones.",
    image:
      "/images/home/unidades-de-negocio/industrial-huinala-industrial-park-altea.webp",
    alt: "Huinala Industrial Park, desarrollo industrial de Altea",
  },
  {
    name: "Vivienda",
    slug: "vivienda",
    apertura: "Creamos espacios donde comienza una nueva forma de vivir.",
    descripcion:
      "Desarrollamos proyectos habitacionales, integramos planeación y alianzas estratégicas para transformar oportunidades en comunidades.",
    image: "/images/home/unidades-de-negocio/vivienda-unidad-altea.webp",
    alt: "Desarrollo de vivienda de Altea",
  },
  // Cuarta unidad del wireframe. El design system aún no tiene lockup ni color
  // para Forestal — ver app/ui/README.md.
  {
    name: "Forestal",
    slug: "forestal",
    apertura: "Plantación y manejo forestal a largo plazo.",
    descripcion:
      "Servicios que sostienen el compromiso ambiental.",
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
/** Titular del hero de la intro. Copy confirmado por Altea. */
export const TITULO_HERO = "Creando proyectos que materializan sueños";

export const EMBLEM = {
  /* Van partidas en palabras porque .home-emblem__text es un flex con
     `gap: 0 0.26em`: ese hueco es el espaciado entre palabras, no un espacio
     de texto. */
  palabras: [
    "Nuestra", "verdadera", "escala", "no", "se", "mide", "en", "el",
    "concreto", "que", "levantamos,", "sino", "en", "la", "vida", "que",
    "detonamos.",
  ],
  /**
   * Índice de la palabra en coral: "detonamos.", la última.
   *
   * Es el remate de la antítesis —"no se mide en X, SINO EN Y"— y el verbo que
   * carga la afirmación, igual que "sueños" lo era en la frase anterior. El
   * mecanismo acentúa UNA palabra, así que "la vida que detonamos" entero no
   * cabe sin cambiarlo.
   */
  acento: 16,
};

export const CONTACT_CTA = {
  eyebrow: "Trabajemos juntos",
  title: "Cuéntanos sobre tu proyecto, terreno o necesidad.",
  /*
   * Sin descripción a propósito: Altea la retiró. <SectionHeading> ya la trae
   * opcional, así que no hace falta tocar el componente ni su CSS —
   * .altea-section-heading__description sigue sirviendo a /nosotros, /comercial
   * y al bloque de captación, que sí la usan.
   */
  /* Recorte con fondo transparente, no una foto de caja completa: el 27% del
     archivo es alfa. Por eso el hueco lleva la proporción exacta del archivo y
     el fondo de la ranura se quita — ver ContactCTA.tsx y .home-cta__media. */
  image: "/images/home/altea-casco.webp",
};

/** Dos líneas; la segunda va en un tono más apagado. */
export const FEATURED_PROJECTS_INTRO = {
  /**
   * Un solo string, y el salto en el propio texto: se pinta con
   * `white-space: pre-line`, así que el \n es lo que parte las dos líneas.
   *
   * NO volver a partirlo en dos elementos. Estaba en dos <span>, y entre un
   * bloque y el siguiente no hay ningún carácter: el salto se veía en pantalla
   * pero al copiar el titular salía "Nuestros proyectosmás relevantes".
   */
  titulo: "Nuestros proyectos\nmás relevantes",
};

/**
 * Proyectos del wireframe, en seis paneles repartidos en dos bandas de tres:
 * los tres primeros acompañan al título en la banda de arriba.
 */
export interface FeaturedProject {
  /** Cuerpo de la ficha del diálogo. Campo NUEVO; ver ProyectoPanel. */
  descripcion?: string;
  slug: string;
  name: string;
  unit: string;
  location: string;
  /** Sin imagen, el panel muestra el hueco etiquetado. */
  image?: string;
  /**
   * PENDIENTE: no hay páginas por proyecto todavía, así que cada panel apunta a
   * la página de su unidad de negocio. Cuando existan, se cambia aquí y el
   * componente no se entera.
   */
  href: string;
}

export const FEATURED_PROJECTS: FeaturedProject[] = [
  {
    slug: "paseo-la-fe",
    href: "/comercial",
    name: "Paseo La Fe",
    unit: "Comercial",
    location: "San Nicolás, Nuevo León",
    image: "/images/comercial/centros-comerciales/paseo-la-fe-altea.webp",
    descripcion:
      "Fashion Mall ubicado sobre Av. Miguel Alemán, principal vía de acceso al Aeropuerto Internacional de Monterrey, en San Nicolás de los Garza, Nuevo León. Cuenta con una afluencia de 1 millón de visitantes al mes, consolidándose como uno de los principales destinos comerciales, de entretenimiento y experiencias de la zona metropolitana de Monterrey."
  },
  {
    slug: "paseo-durango",
    href: "/comercial",
    name: "Paseo Durango",
    unit: "Comercial",
    location: "Durango, Durango",
    image: "/images/comercial/centros-comerciales/paseo-durango-altea.webp",
    descripcion:
      "Fashion Mall ubicado sobre Blvd. Felipe Pescador, en la zona centro de Durango, Durango. Único Fashion Mall de la ciudad, cuenta con marcas como Liverpool, Sears y Play City Casino, además de una amplia oferta comercial, de entretenimiento y servicios que lo convierte en uno de los principales destinos de la ciudad."
  },
  {
    slug: "aeropuerto-saltillo",
    href: "/industrial",
    name: "Aeropuerto Saltillo",
    unit: "Industrial",
    // PENDIENTE: ubicación sin confirmar.
    location: "Saltillo, Coahuila",
    image: "/images/industrial/aeropuerto/aeropuerto-saltillo-altea.webp",
    descripcion:
      "Proyecto de remodelación desarrollado en colaboración con el Aeropuerto Internacional Plan de Guadalupe, en Saltillo, Coahuila; enfocado en la reactivación del aeropuerto y en la generación de nuevas oportunidades de negocio para la región."
  },
  {
    slug: "bajio-industrial-park",
    href: "/industrial",
    name: "Bajío Industrial Park",
    unit: "Industrial",
    // ⚠ CONTRADICE la descripción de abajo, que es copy confirmado por Altea
    // y sitúa el proyecto en Salamanca–Irapuato y León, o sea Guanajuato. Sin tocar hasta que Altea diga cuál vale:
    // hoy la ficha muestra las dos cosas, una encima de la otra.
    location: "Bajío, México",
    // El nombre del archivo trae una errata de origen ("undustrial").
    image: "/images/industrial/naves-industriales/bajio-undustrial-park-altea.webp",
    descripcion:
      "Parque industrial estratégicamente ubicado en la entrada de la planta Mazda, con acceso directo a la carretera libre (45) Salamanca-Irapuato y lateral a la carretera de cuota a León. Su conectividad facilita las operaciones industriales, logísticas y el acceso a los principales corredores productivos de la región."
  },
  {
    slug: "aeropuerto-industrial-center",
    href: "/industrial",
    name: "Aeropuerto Industrial Center",
    unit: "Industrial",
    // ⚠ CONTRADICE la descripción de abajo, que es copy confirmado por Altea
    // y sitúa el proyecto en Apodaca, Nuevo León. Sin tocar hasta que Altea diga cuál vale:
    // hoy la ficha muestra las dos cosas, una encima de la otra.
    location: "Saltillo, Coahuila",
    // PENDIENTE: el archivo se llama "Aeropuerto Industrial Park" y vive en
    // proximos-proyectos/. Confirmar si es el mismo desarrollo y qué nombre va.
    image: "/images/industrial/proximos-proyectos/aeropuerto-industrial-park.webp",
    descripcion:
      "Próximo parque industrial ubicado sobre la Autopista al Aeropuerto Internacional de Monterrey, en Apodaca, Nuevo León. Forma parte de un entorno empresarial consolidado, se encuentra próximo a Pocket Park Aeropuerto, parque industrial que desarrollamos en colaboración con Garza Ponce, y a un costado el Centro de Innovación y Diseño Estratégico de Productos del Tecnológico de Monterrey."
  },
  {
    slug: "amarantha",
    href: "/vivienda",
    name: "Amarantha",
    unit: "Vivienda",
    // ⚠ CONTRADICE la descripción de abajo, que es copy confirmado por Altea
    // y sitúa el proyecto en Zona Sur de Monterrey, sobre Carretera Nacional. Sin tocar hasta que Altea diga cuál vale:
    // hoy la ficha muestra las dos cosas, una encima de la otra.
    location: "Saltillo, Coahuila",
    image: "/images/vivienda/amarantha/amarantha-vivienda-altea.webp",
    descripcion:
      "Próximo desarrollo de lotes residenciales ubicado en la Zona Sur de Monterrey, sobre Carretera Nacional. Un proyecto que integra ubicación estratégica y amenidades de alto nivel, creando un entorno pensado para vivir, crecer y construir patrimonio."
  },
];

