import { PROYECTOS } from "@/lib/proyectos";

/**
 * Contenido de la página de Comercial.
 *
 * Vive fuera de los componentes por la misma razón que en _home y _nosotros:
 * casi nada está confirmado por Altea y cambiarlo no debería ser tocar JSX.
 * Todo lo marcado PENDIENTE es provisional.
 */

const CENTROS = "/images/comercial/centros-comerciales";

/* ============================ 1 · Hero ============================= */

export interface DiapositivaHero {
  id: string;
  foto?: string;
  alt: string;
  label: string;
  dato: string;
  proyecto: string;
  ubicacion: string;
}

/**
 * Las cifras de Paseo La Fe salen de lib/proyectos.ts, que es la fuente.
 *
 * PENDIENTE: de los siete centros sólo Paseo La Fe tiene datos documentados.
 * Para los otros seis la frase del pie está redactada aquí y hay que
 * confirmarla —o, mejor, llevar el dato a lib/proyectos.ts y leerlo de allí.
 */
export const HERO_DIAPOSITIVAS: DiapositivaHero[] = [
  {
    id: "paseo-la-fe",
    foto: `${CENTROS}/paseo-la-fe-altea.webp`,
    alt: "Paseo La Fe, centro comercial de Altea en San Nicolás, Nuevo León",
    label: "Paseo La Fe",
    dato: "34 locales comerciales y 94% de ocupación.",
    proyecto: "Paseo La Fe",
    ubicacion: "San Nicolás, Nuevo León",
  },
  {
    id: "paseo-durango",
    foto: `${CENTROS}/paseo-durango-altea.webp`,
    alt: "Paseo Durango, centro comercial de Altea",
    label: "Paseo Durango",
    /** PENDIENTE */
    dato: "Centro comercial regional en el corredor norte de la ciudad.",
    proyecto: "Paseo Durango",
    ubicacion: "Durango, Durango",
  },
  {
    id: "paseo-juarez",
    foto: `${CENTROS}/paseo-juarez-altea.webp`,
    alt: "Paseo Juárez, centro comercial de Altea",
    label: "Paseo Juárez",
    /** PENDIENTE */
    dato: "Mezcla de comercio, servicios y entretenimiento en un solo punto.",
    proyecto: "Paseo Juárez",
    ubicacion: "Ciudad Juárez, Chihuahua",
  },
  {
    id: "paseo-los-mochis",
    foto: `${CENTROS}/paseo-los-mochis-altea.webp`,
    alt: "Paseo Los Mochis, centro comercial de Altea",
    label: "Paseo Los Mochis",
    /** PENDIENTE */
    dato: "Ancla regional en una de las zonas de mayor crecimiento del estado.",
    proyecto: "Paseo Los Mochis",
    ubicacion: "Los Mochis, Sinaloa",
  },
];

export const HERO_COMERCIAL = {
  ceja: "Comercial",
  /**
   * PENDIENTE: es la frase de la unidad que ya venía en el deck corporativo
   * —la misma que usaba <Proximamente>—, pero nadie ha confirmado que sirva
   * como titular de página.
   */
  titulo: "Activar la energía de la ciudad en un solo lugar.",
  /** PENDIENTE: párrafo sin confirmar por Altea. */
  descripcion:
    "Desarrollamos y operamos centros comerciales que se vuelven el punto de reunión de su zona. Cada plaza se define por el tejido que la rodea: la mezcla de marcas, el ancla y el ritmo de crecimiento del entorno.",
  diapositivas: HERO_DIAPOSITIVAS,
};

/* ====================== 2 · Banda a todo lo ancho ================== */

export const BANDA_COMERCIAL = {
  /** PENDIENTE: confirmar cuál de las cuatro de /galeria es la buena. */
  foto: "/images/comercial/galeria/galeria-altea-1.webp",
  alt: "",
  label: "Imagen de banda",
};

/* ============================ 3 · Cifras =========================== */

/*
 * Derivadas de lib/proyectos.ts, NO escritas a mano: si mañana entra un centro
 * más, la cifra sube sola. `descripcion` es lo único que distingue un centro
 * comercial del aeropuerto, que también está en la lista y no es de esta unidad.
 */
const CENTROS_COMERCIALES = PROYECTOS.filter((p) =>
  p.descripcion?.startsWith("Centro comercial"),
);
const ESTADOS_COMERCIAL = new Set(CENTROS_COMERCIALES.map((p) => p.estado));

export interface Cifra {
  /** El número, sin la unidad. */
  valor: string;
  /** El "%" o el "M²", que va en coral y a 0.45em. Vacío si no lleva. */
  signo?: string;
  etiqueta: string;
  /** Lo que lee el lector de pantalla: la cifra entera, sin partir. */
  lectura: string;
  /** true = inventada, no publicar. Ver la nota de abajo. */
  pendiente?: boolean;
}

export const CIFRAS_COMERCIAL: Cifra[] = [
  {
    valor: String(CENTROS_COMERCIALES.length),
    etiqueta: "Centros comerciales en operación",
    lectura: `${CENTROS_COMERCIALES.length} centros comerciales en operación`,
  },
  {
    valor: String(ESTADOS_COMERCIAL.size),
    etiqueta: "Estados con presencia comercial",
    lectura: `${ESTADOS_COMERCIAL.size} estados con presencia comercial`,
  },
  /*
   * ⚠⚠ LAS DOS DE ABAJO SON INVENTADAS. NO PUBLICAR. ⚠⚠
   *
   * Ni los 250,000 m² ni el 92% salen de ningún dato del repositorio: están
   * puestos para ver la composición de la rejilla y HAY QUE CONFIRMARLOS CON
   * ALTEA antes de que esta página salga a producción.
   *
   * El 94% que sí existe en lib/proyectos.ts es de Paseo La Fe SOLO —una plaza
   * de siete—, así que tampoco sirve como cifra de portafolio.
   *
   * Cuando lleguen los datos buenos: quitar el `pendiente: true` de las dos.
   * Si no llegan, se borran las dos entradas y la rejilla vuelve a dos —ya lo
   * estuvo, y el reparto aguanta.
   */
  {
    valor: "250,000",
    signo: "M²",
    etiqueta: "De área rentable",
    lectura: "250,000 metros cuadrados de área rentable",
    pendiente: true,
  },
  {
    valor: "92",
    signo: "%",
    etiqueta: "De ocupación promedio del portafolio",
    lectura: "92 por ciento de ocupación promedio del portafolio",
    pendiente: true,
  },
];

/* ====================== 4 · Descripción de la unidad =============== */

export const DESCRIPCION_COMERCIAL = {
  /** PENDIENTE */
  titulo: "Centros que ordenan la vida de su zona",
  /** PENDIENTE */
  parrafos: [
    "Un centro comercial de Altea no se planta sobre un terreno disponible: se coloca donde la ciudad ya está creciendo y le falta un punto de encuentro. Primero se lee el tejido —cuánta vivienda hay alrededor, qué servicios faltan, por dónde pasa la gente— y de ahí sale la mezcla de locales.",
    "Operamos lo que desarrollamos. Eso cambia las decisiones: la ocupación no es un número de cierre de obra sino algo que se sostiene año con año, y el trato con los inquilinos es una relación larga, no una venta.",
    "Hoy son siete centros en cinco estados, con anclas nacionales y comercio local conviviendo en la misma plaza.",
  ],
};

/* ====================== 5 · Galería de plazas ====================== */

export interface Plaza {
  id: string;
  nombre: string;
  ubicacion: string;
  foto?: string;
  alt: string;
  label: string;
  /** Sale de `descripcion` en lib/proyectos.ts. */
  descripcion: string;
  /**
   * Exactamente dos pares para el <dl> de la ficha.
   *
   * De las siete plazas SÓLO Paseo La Fe tiene locales y ocupación
   * documentados en lib/proyectos.ts. En las demás el hueco va marcado con un
   * guion, no relleno: inventar una cifra por plaza sería peor que no darla.
   */
  datos: [ParDato, ParDato];
}

export interface ParDato {
  etiqueta: string;
  /** `undefined` = dato que Altea todavía no entregó; la ficha pinta un guion. */
  valor?: string;
}

/**
 * PENDIENTE: sólo Paseo La Fe tiene datos en lib/proyectos.ts. Los de las otras
 * seis plazas están sin confirmar y hay que pedírselos a Altea.
 */
/**
 * Las siete plazas. `descripcion` y las cifras salen de lib/proyectos.ts; donde
 * allí no hay dato, aquí va `undefined` y la ficha pinta un guion.
 *
 * PENDIENTE: los locales y la ocupación de las seis que no son Paseo La Fe.
 */
export const PLAZAS: Plaza[] = [
  {
    id: "paseo-la-fe",
    nombre: "Paseo La Fe",
    ubicacion: "San Nicolás, Nuevo León",
    foto: `${CENTROS}/paseo-la-fe-altea.webp`,
    alt: "",
    label: "Paseo La Fe",
    descripcion: "Centro comercial de Altea en San Nicolás.",
    datos: [
      { etiqueta: "Locales", valor: "34" },
      { etiqueta: "Ocupación", valor: "94%" },
    ],
  },
  {
    id: "punto-huinala",
    nombre: "Punto Huinala",
    ubicacion: "Apodaca, Nuevo León",
    foto: `${CENTROS}/punto-huinala-altea.webp`,
    alt: "",
    label: "Punto Huinala",
    descripcion: "Centro comercial de barrio de Altea en Apodaca.",
    datos: [
      { etiqueta: "Locales", valor: undefined },
      { etiqueta: "Ocupación", valor: undefined },
    ],
  },
  {
    id: "paseo-durango",
    nombre: "Paseo Durango",
    ubicacion: "Durango, Durango",
    foto: `${CENTROS}/paseo-durango-altea.webp`,
    alt: "",
    label: "Paseo Durango",
    descripcion: "Centro comercial de Altea en Durango.",
    datos: [
      { etiqueta: "Locales", valor: undefined },
      { etiqueta: "Ocupación", valor: undefined },
    ],
  },
  {
    id: "paseo-gomez-palacio",
    nombre: "Paseo Gómez Palacio",
    ubicacion: "Gómez Palacio, Durango",
    foto: `${CENTROS}/paseo-gomez-palacio-altea.webp`,
    alt: "",
    label: "Paseo Gómez Palacio",
    descripcion: "Centro comercial de Altea en Gómez Palacio.",
    datos: [
      { etiqueta: "Locales", valor: undefined },
      { etiqueta: "Ocupación", valor: undefined },
    ],
  },
  {
    id: "paseo-juarez",
    nombre: "Paseo Juárez",
    ubicacion: "Ciudad Juárez, Chihuahua",
    foto: `${CENTROS}/paseo-juarez-altea.webp`,
    alt: "",
    label: "Paseo Juárez",
    descripcion: "Centro comercial de Altea en Ciudad Juárez.",
    datos: [
      { etiqueta: "Locales", valor: undefined },
      { etiqueta: "Ocupación", valor: undefined },
    ],
  },
  {
    id: "paseo-los-mochis",
    nombre: "Paseo Los Mochis",
    ubicacion: "Los Mochis, Sinaloa",
    foto: `${CENTROS}/paseo-los-mochis-altea.webp`,
    alt: "",
    label: "Paseo Los Mochis",
    descripcion: "Centro comercial de Altea en Los Mochis.",
    datos: [
      { etiqueta: "Locales", valor: undefined },
      { etiqueta: "Ocupación", valor: undefined },
    ],
  },
  {
    id: "punto-rio-nilo",
    nombre: "Punto Río Nilo",
    ubicacion: "Guadalajara, Jalisco",
    foto: `${CENTROS}/punto-rio-nilo.webp`,
    alt: "",
    label: "Punto Río Nilo",
    descripcion: "Centro comercial de barrio de Altea en Guadalajara.",
    datos: [
      { etiqueta: "Locales", valor: undefined },
      { etiqueta: "Ocupación", valor: undefined },
    ],
  },
];

/*
 * PENDIENTE — Paso Tec. Hay foto en
 * /images/comercial/centros-comerciales/paso-tec-altea.webp, pero el proyecto
 * NO está en lib/proyectos.ts y Altea no lo ha confirmado. Fuera de la lista
 * hasta entonces; para publicarlo basta con volver a añadir su entrada:
 *
 *   {
 *     id: "paso-tec",
 *     nombre: "Paso Tec",
 *     ubicacion: "Monterrey, Nuevo León",
 *     foto: `${CENTROS}/paso-tec-altea.webp`,
 *     alt: "",
 *     label: "Paso Tec",
 *     datos: [{ etiqueta: "Formato", valor: "Centro comercial" }],
 *   },
 *
 * Y con él, el alta en lib/proyectos.ts — que es de donde salen las cifras.
 */

export const GALERIA_PLAZAS = {
  /** PENDIENTE */
  titulo: "Nuestras plazas comerciales",
  plazas: PLAZAS,
};

/* ============== 6 · Hoteles, hospital y educación ================== */

const OTROS = "/images/comercial";

export const OTROS_GIROS = {
  /** PENDIENTE */
  titulo: "Hoteles, hospital y educación dentro de nuestros desarrollos",
  bloques: [
    {
      id: "hoteles",
      numero: "01",
      title: "Hoteles",
      /** PENDIENTE */
      description:
        "Cuatro operaciones hoteleras conviven con el comercio en los mismos desarrollos: Fiesta Inn, NH Collection y One. El huésped llega por el hotel y se queda por la plaza, y la plaza gana ocupación entre semana.",
      image: `${OTROS}/hoteles/fiesta-inn-tec-altea.webp`,
      alt: "Fiesta Inn dentro de un desarrollo de Altea",
    },
    {
      id: "hospital",
      numero: "02",
      title: "Hospital",
      /** PENDIENTE */
      description:
        "Un hospital dentro del desarrollo cambia el perfil de quien lo visita y el horario en que lo hace. Deja de ser un destino de fin de semana para volverse infraestructura de la zona.",
      image: `${OTROS}/hospital-y-educacion/hospital-altea.webp`,
      alt: "Hospital dentro de un desarrollo de Altea",
    },
    {
      id: "educacion",
      numero: "03",
      title: "Educación",
      /** PENDIENTE */
      description:
        "Campus y centros educativos que traen tránsito diario y sostenido. Es el uso que más estabiliza a los comercios de alimentos y servicios alrededor.",
      image: `${OTROS}/hospital-y-educacion/educacion-altea.webp`,
      alt: "Centro educativo dentro de un desarrollo de Altea",
    },
  ],
};

/* ====================== 7 · Marcas de comercial ==================== */

/**
 * Interruptor de la sección de marcas de comercial.
 *
 * Propio, NO el MOSTRAR_MARCAS de lib/marcas.ts: aquél gobierna la sección de
 * clientes de la portada y de /nosotros, y son decisiones distintas.
 *
 * ⚠⚠ ENCENDIDA SÓLO PARA EL DEMO. HAY QUE APAGARLA ANTES DE PUBLICAR. ⚠⚠
 *
 * Usar marcas ajenas implica endoso. Lo normal es que lo cubra el contrato de
 * arrendamiento, pero ALTEA TODAVÍA NO LO HA CONFIRMADO POR ESCRITO. Está en
 * `true` para que la sección se vea al enseñar la página, no porque el permiso
 * exista. Si esto sale a producción sin la confirmación, el riesgo es de Altea
 * pero el problema es nuestro.
 */
export const MOSTRAR_MARCAS_COMERCIAL = true;

/*
 * Los logos los pone <Marcas> por defecto, desde lib/marcas.ts — los mismos
 * "clientes actuales" del resto del sitio.
 *
 * PENDIENTE: son provisionales y Altea va a sustituirlos por los inquilinos
 * reales de las plazas. Cuando lleguen, el sitio donde cambiarlos es
 * lib/marcas.ts, no aquí, y ahí habrá que decidir si los cuatro logos
 * industriales que trae la lista —Mazda, CEVA, Viakable, Güntner— siguen
 * teniendo sentido en una página de centros comerciales.
 */


/* ====================== 8 · Próximos proyectos ===================== */

const PROXIMOS = "/images/comercial/proximos-proyectos";

/**
 * Tres, que es exactamente lo que cabe en una banda junto al titular. Con
 * <ProyectosPaneles> no hace falta forzar una segunda: sin sobrantes no se
 * dibuja.
 */
export const PROXIMOS_PROYECTOS = {
  titulo: "Próximos\nproyectos",
  proyectos: [
    {
      slug: "paseo-la-fe-ampliacion",
      name: "Paseo La Fe",
      unit: "Ampliación",
      location: "San Nicolás, Nuevo León",
      image: `${PROXIMOS}/paseo-la-fe-altea-proximo.webp`,
    },
    {
      slug: "punto-la-pastora",
      name: "Punto La Pastora",
      unit: "Comercial",
      location: "Guadalupe, Nuevo León",
      image: `${PROXIMOS}/punto-la-pastora-altea-proximo.webp`,
    },
    {
      slug: "punto-lopez-mateos",
      name: "Punto López Mateos",
      unit: "Comercial",
      location: "Zapopan, Jalisco",
      image: `${PROXIMOS}/punto-lopez-mateos-altea-proximo.webp`,
    },
  ],
};

/* ============================== 9 · CTA ============================ */

/**
 * PENDIENTE: ni un solo teléfono ni correo está confirmado. Mientras falten,
 * el campo va sin valor y <LeadCTA> pinta un guion — un `tel:` a un número
 * inventado marca de verdad.
 */
export const CANALES_COMERCIAL = [
  { nombre: "Renta de islas" },
  { nombre: "Renta de locales" },
  { nombre: "Renta de espacios publicitarios" },
  { nombre: "Venta de inmuebles" },
];
