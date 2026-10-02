/**
 * Contenido de la portada, tal como aparece en el wireframe.
 *
 * Todo lo marcado PENDIENTE es texto provisional escrito para poder maquetar:
 * respeta el tono de marca pero NO está confirmado por Altea. Reemplazar antes
 * de publicar.
 */

import { ruta } from "@/lib/rutas";

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

export interface BusinessUnitCard {
  name: string;
  slug: string;
  /**
   * Color de la unidad, para el fondo de su carpeta.
   *
   * Sin color, la carpeta se queda en ink con el texto en cream, que es el
   * tratamiento original. Es el caso de Forestal: Altea no le ha dado color, y no
   * tiene ni lockup propio en el sistema de diseño.
   *
   * Los tres colores son claros, así que en esas tarjetas TODO el texto va en ink
   * —medido, es la única tinta que funciona en las tres— y el coral desaparece.
   * Ver el bloque [data-tono="color"] en secciones.css.
   */
  color?: string;
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
    color: "#FDCE5B",
    apertura: "Activamos la energía de la ciudad.",
    descripcion:
      "Creamos espacios comerciales que conectan personas, marcas y experiencias, integrando entretenimiento, servicios, hoteles, salud y educación para dar vida a entornos urbanos.",
    image: "/images/home/unidades-de-negocio/comercial-paseo-la-fe-altea.webp",
    alt: "Paseo La Fe, desarrollo comercial de Altea",
  },
  {
    name: "Industrial",
    slug: "industrial",
    color: "#5697D0",
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
    color: "#9CD5AA",
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

/* ─── Hero «la A que se construye» ──────────────────────────────────────── */

/** Un trozo de titular. `atenuado` baja peso y opacidad: es jerarquía, no color. */
export type TrozoTitular = { texto: string; atenuado?: boolean };

export const HERO_A = {
  eyebrow: "Desarrollo inmobiliario integral",
  /**
   * El titular partido en líneas y trozos.
   *
   * Es la misma frase que TITULO_HERO —el copy que confirmó Altea—, partida para
   * que cada línea entre por separado y para atenuar el "que", que es la única
   * palabra sin carga de las cinco. El aria-label del <h1> se calcula uniendo
   * estos trozos, así que lo que se lee en voz alta y lo que se ve no pueden
   * separarse. ⚠ Lo que sí puede separarse es esto de TITULO_HERO: si cambia el
   * copy, hay que cambiar los dos.
   */
  lineas: [
    [{ texto: "Creando proyectos" }],
    [{ texto: "que", atenuado: true }, { texto: "materializan sueños" }],
  ] as TrozoTitular[][],
};

/**
 * Las hojas del muro que se pliega detrás de la A.
 *
 * Son los ocho centros comerciales, y las fichas de verdad —ubicación, formato,
 * afluencia, descripción— viven en app/_comercial/content.ts. Aquí solo
 * hacen falta el nombre y la foto: el muro es FONDO, va velado y desenfocado por
 * sus cuatro cantos, y nada de lo que lleva encima es legible del todo.
 *
 * Por eso `alt` va vacío en las ocho y las hojas son aria-hidden: es decoración,
 * y describir ocho fotos que nadie puede ver bien solo alarga el lector de
 * pantalla sin aportar nada. Lo que sí se anuncia es el titular.
 */
export const MURO_HERO: { nombre: string; foto: string }[] = [
  { nombre: "Paseo La Fe", foto: "/images/comercial/centros-comerciales/paseo-la-fe-altea.webp" },
  { nombre: "Paseo Tec", foto: "/images/comercial/centros-comerciales/paso-tec-altea.webp" },
  { nombre: "Paseo Durango", foto: "/images/comercial/centros-comerciales/paseo-durango-altea.webp" },
  { nombre: "Punto Huinalá", foto: "/images/comercial/centros-comerciales/punto-huinala-altea.webp" },
  { nombre: "Paseo Juárez", foto: "/images/comercial/centros-comerciales/paseo-juarez-altea.webp" },
  { nombre: "Paseo Los Mochis", foto: "/images/comercial/centros-comerciales/paseo-los-mochis-altea.webp" },
  { nombre: "Punto Río Nilo", foto: "/images/comercial/centros-comerciales/punto-rio-nilo.webp" },
  { nombre: "Paseo Gómez Palacio", foto: "/images/comercial/centros-comerciales/paseo-gomez-palacio-altea.webp" },
];

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
   * El tramo acentuado: "la vida que detonamos.", las cuatro últimas palabras.
   *
   * Es el remate de la antítesis —"no se mide en X, SINO EN Y"—, y va entero y no
   * sólo en el verbo porque es la afirmación completa la que carga la frase.
   *
   * Antes era un índice suelto y acentuaba UNA palabra: el mecanismo de entonces
   * envolvía cada palabra en su propio <span> y no daba para más. La máquina de
   * escribir trabaja carácter a carácter, así que un rango le sale gratis.
   */
  acento: { desde: 13, hasta: 16 },
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
  /**
   * En qué punto está el proyecto. Campo NUEVO: la ficha del carril lo muestra
   * como tercer dato, junto a la unidad y la ubicación.
   *
   * Es un literal y no un booleano "terminado" porque Altea escribe estas dos
   * frases tal cual y no hay una tercera; si mañana aparece "En construcción",
   * se añade aquí y el componente no se entera.
   */
  estado: "En operación" | "En desarrollo";
  /** Sin imagen, el panel muestra el hueco etiquetado. */
  image?: string;
  /**
   * PENDIENTE: no hay páginas por proyecto todavía, así que cada panel apunta a
   * la página de su unidad de negocio. Cuando existan, se cambia aquí y el
   * componente no se entera.
   *
   * ⚠ Ahora mismo NADIE lo lee: <ProyectosPaneles> abre un diálogo en vez de
   * navegar, así que el campo está huérfano. Se conserva porque es el destino
   * que quiere el panel cuando existan esas páginas, y pasa por ruta() para que
   * no nazca roto el día que vuelva a tener consumidor.
   */
  href: string;
}

export const FEATURED_PROJECTS: FeaturedProject[] = [
  {
    estado: "En operación",
    slug: "paseo-la-fe",
    href: ruta("/comercial"),
    name: "Paseo La Fe",
    unit: "Comercial",
    location: "San Nicolás, Nuevo León",
    image: "/images/comercial/centros-comerciales/paseo-la-fe-altea.webp",
    descripcion:
      "Fashion Mall ubicado sobre Av. Miguel Alemán, principal vía de acceso al Aeropuerto Internacional de Monterrey, en San Nicolás de los Garza, Nuevo León. Cuenta con una afluencia de 1 millón de visitantes al mes, consolidándose como uno de los principales destinos comerciales, de entretenimiento y experiencias de la zona metropolitana de Monterrey."
  },
  {
    estado: "En operación",
    slug: "paseo-durango",
    href: ruta("/comercial"),
    name: "Paseo Durango",
    unit: "Comercial",
    location: "Durango, Durango",
    image: "/images/comercial/centros-comerciales/paseo-durango-altea.webp",
    descripcion:
      "Fashion Mall ubicado sobre Blvd. Felipe Pescador, en la zona centro de Durango, Durango. Único Fashion Mall de la ciudad, cuenta con marcas como Liverpool, Sears y Play City Casino, además de una amplia oferta comercial, de entretenimiento y servicios que lo convierte en uno de los principales destinos de la ciudad."
  },
  {
    estado: "En operación",
    slug: "aeropuerto-saltillo",
    href: ruta("/industrial"),
    name: "Aeropuerto Saltillo",
    unit: "Industrial",
    // PENDIENTE: ubicación sin confirmar.
    location: "Saltillo, Coahuila",
    image: "/images/industrial/aeropuerto/aeropuerto-saltillo-altea.webp",
    descripcion:
      "Proyecto de remodelación desarrollado en colaboración con el Aeropuerto Internacional Plan de Guadalupe, en Saltillo, Coahuila; enfocado en la reactivación del aeropuerto y en la generación de nuevas oportunidades de negocio para la región."
  },
  {
    estado: "En operación",
    slug: "bajio-industrial-park",
    href: ruta("/industrial"),
    name: "Bajío Industrial Park",
    unit: "Industrial",
    // Resuelto. Decía "Bajío, México" y contradecía su propia descripción, que
    // sitúa el proyecto en el eje Salamanca-Irapuato-León. El copy del carril de
    // proyectos lo zanja en Salamanca, Guanajuato.
    location: "Salamanca, Guanajuato",
    // El nombre del archivo trae una errata de origen ("undustrial").
    image: "/images/industrial/naves-industriales/bajio-undustrial-park-altea.webp",
    descripcion:
      "Parque industrial estratégicamente ubicado en la entrada de la planta Mazda, con acceso directo a la carretera libre (45) Salamanca-Irapuato y lateral a la carretera de cuota a León. Su conectividad facilita las operaciones industriales, logísticas y el acceso a los principales corredores productivos de la región."
  },
  {
    estado: "En desarrollo",
    slug: "aeropuerto-industrial-center",
    href: ruta("/industrial"),
    name: "Aeropuerto Industrial Center",
    unit: "Industrial",
    // Resuelto: decía Saltillo y su descripción decía Apodaca. Vale Apodaca.
    location: "Apodaca, Nuevo León",
    // PENDIENTE: el archivo se llama "Aeropuerto Industrial Park" y vive en
    // proximos-proyectos/. Confirmar si es el mismo desarrollo y qué nombre va.
    image: "/images/industrial/proximos-proyectos/aeropuerto-industrial-park.webp",
    descripcion:
      "Próximo parque industrial ubicado sobre la Autopista al Aeropuerto Internacional de Monterrey, en Apodaca, Nuevo León. Forma parte de un entorno empresarial consolidado, se encuentra próximo a Pocket Park Aeropuerto, parque industrial que desarrollamos en colaboración con Garza Ponce, y a un costado el Centro de Innovación y Diseño Estratégico de Productos del Tecnológico de Monterrey."
  },
  {
    estado: "En desarrollo",
    slug: "amarantha",
    href: ruta("/vivienda"),
    name: "Amarantha",
    unit: "Vivienda",
    // Resuelto: decía Saltillo y su descripción decía Carretera Nacional. Vale
    // la Zona Sur de Monterrey.
    location: "Zona Sur de Monterrey, Nuevo León",
    image: "/images/vivienda/amarantha/amarantha-vivienda-altea.webp",
    descripcion:
      "Próximo desarrollo de lotes residenciales ubicado en la Zona Sur de Monterrey, sobre Carretera Nacional. Un proyecto que integra ubicación estratégica y amenidades de alto nivel, creando un entorno pensado para vivir, crecer y construir patrimonio."
  },
];

